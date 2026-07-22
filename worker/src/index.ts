// API classifica per "Albero delle alternative" — Cloudflare Worker + D1.
//
// Endpoint:
//   POST /api/submit  { clientId, nickname, profileName, percentage, answeredCount, responses }
//   GET  /api/top?period=day|week|month|year&profile=<nome>&limit=10
//   GET  /api/recent?limit=200      (per la mappa: risposte recenti, una per client)
//
// Il Worker è l'unico guardiano dei dati: valida tutto server-side e applica
// un rate-limit minimo per client. Il piano free (100k req/giorno, D1 5 GB)
// copre ampiamente un sito personale.

import { isNicknameAllowed } from "./nickname";

interface Env {
  DB: D1Database;
  // Secret Wrangler (`wrangler secret put TURNSTILE_SECRET`). Se assente,
  // la verifica captcha è disattivata e il submit funziona senza token —
  // così il primo deploy non è bloccato dalla configurazione di Turnstile.
  TURNSTILE_SECRET?: string;
}

// Codifica posizionale: una cifra 0-5 per domanda. La versione Completa (v1)
// ha 31 domande; il range copre entrambe le lunghezze possibili dei questionari.
const RESPONSES_RE = /^[0-5]{20,40}$/;
const NICKNAME_MAX = 24;
const PERIOD_MS: Record<string, number> = {
  day: 24 * 3600 * 1000,
  week: 7 * 24 * 3600 * 1000,
  month: 30 * 24 * 3600 * 1000,
  year: 365 * 24 * 3600 * 1000
};
// Un invio per client ogni 30 secondi: sufficiente contro lo spam banale
// senza infrastruttura aggiuntiva (niente KV, solo una query in più).
const SUBMIT_COOLDOWN_MS = 30 * 1000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS }
  });
}

function badRequest(message: string): Response {
  return json({ error: message }, 400);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    try {
      if (request.method === "POST" && url.pathname === "/api/submit") {
        return await handleSubmit(request, env);
      }
      if (request.method === "GET" && url.pathname === "/api/top") {
        return await handleTop(url, env);
      }
      if (request.method === "GET" && url.pathname === "/api/recent") {
        return await handleRecent(url, env);
      }
    } catch (err) {
      console.error(err);
      return json({ error: "internal error" }, 500);
    }

    return json({ error: "not found" }, 404);
  }
};

async function handleSubmit(request: Request, env: Env): Promise<Response> {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return badRequest("invalid JSON");
  }

  const clientId = typeof body.clientId === "string" ? body.clientId.trim() : "";
  const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
  const profileName = typeof body.profileName === "string" ? body.profileName.trim() : "";
  const percentage = Number(body.percentage);
  const answeredCount = Number(body.answeredCount);
  const responses = typeof body.responses === "string" ? body.responses : "";

  if (!/^[0-9a-f-]{36}$/i.test(clientId)) return badRequest("invalid clientId");
  if (nickname.length < 1 || nickname.length > NICKNAME_MAX) {
    return badRequest(`nickname must be 1-${NICKNAME_MAX} chars`);
  }
  if (profileName.length < 1 || profileName.length > 40) return badRequest("invalid profileName");
  if (!Number.isInteger(percentage) || percentage < 0 || percentage > 100) {
    return badRequest("invalid percentage");
  }
  if (!Number.isInteger(answeredCount) || answeredCount < 1 || answeredCount > 37) {
    return badRequest("invalid answeredCount");
  }
  if (!RESPONSES_RE.test(responses)) return badRequest("invalid responses");
  if (!isNicknameAllowed(nickname)) {
    return badRequest("Nickname non consentito: scegline un altro.");
  }

  if (env.TURNSTILE_SECRET) {
    const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    if (!token) return badRequest("Verifica anti-bot mancante.");
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get("CF-Connecting-IP") ?? undefined
      })
    });
    const outcome = (await verify.json()) as { success: boolean };
    if (!outcome.success) return badRequest("Verifica anti-bot non superata. Riprova.");
  }

  const now = Date.now();

  const last = await env.DB.prepare(
    "SELECT MAX(created_at) AS last FROM results WHERE client_id = ?"
  )
    .bind(clientId)
    .first<{ last: number | null }>();
  if (last?.last && now - last.last < SUBMIT_COOLDOWN_MS) {
    return json({ error: "too many submissions, retry later" }, 429);
  }

  await env.DB.prepare(
    `INSERT INTO results (client_id, nickname, profile_name, percentage, answered_count, responses, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(clientId, nickname, profileName, percentage, answeredCount, responses, now)
    .run();

  return json({ ok: true });
}

async function handleTop(url: URL, env: Env): Promise<Response> {
  const period = url.searchParams.get("period") ?? "week";
  const periodMs = PERIOD_MS[period];
  if (!periodMs) return badRequest("invalid period");

  const profile = url.searchParams.get("profile");
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 10, 1), 50);
  const cutoff = Date.now() - periodMs;

  // Un solo piazzamento per client: l'invio più recente nel periodo.
  const query = `
    SELECT r.client_id AS clientId, r.nickname, r.profile_name AS profileName,
           r.percentage, r.answered_count AS answeredCount, r.created_at AS timestamp
    FROM results r
    JOIN (
      SELECT client_id, MAX(id) AS max_id
      FROM results
      WHERE created_at >= ?
      GROUP BY client_id
    ) latest ON latest.max_id = r.id
    ${profile ? "WHERE r.profile_name = ?" : ""}
    ORDER BY r.percentage DESC, r.answered_count DESC, r.created_at ASC
    LIMIT ?`;

  const stmt = profile
    ? env.DB.prepare(query).bind(cutoff, profile, limit)
    : env.DB.prepare(query).bind(cutoff, limit);
  const { results } = await stmt.all();

  return json({ entries: results });
}

async function handleRecent(url: URL, env: Env): Promise<Response> {
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 200, 1), 500);

  const { results } = await env.DB.prepare(
    `SELECT r.client_id AS clientId, r.nickname, r.profile_name AS profileName,
            r.responses, r.created_at AS timestamp
     FROM results r
     JOIN (
       SELECT client_id, MAX(id) AS max_id FROM results GROUP BY client_id
     ) latest ON latest.max_id = r.id
     ORDER BY r.created_at DESC
     LIMIT ?`
  )
    .bind(limit)
    .all();

  return json({ entries: results });
}

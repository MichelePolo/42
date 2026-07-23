// API classifica del PoC "tre versioni" — Cloudflare Worker + D1.
// Come il Worker di produzione, ma con un discriminatore `version` che tiene
// separate le classifiche di Vecchia / Nuova / Somma, e una codifica risposte
// base36 (le domande della Somma possono avere più di 9 opzioni).
//
// Endpoint:
//   POST /api/submit  { version, clientId, nickname, profileName, percentage, answeredCount, responses }
//   GET  /api/top?version=…&period=…&profile=…&limit=…
//   GET  /api/recent?version=…&limit=…

import { isNicknameAllowed } from "./nickname";

interface Env {
  DB: D1Database;
  TURNSTILE_SECRET?: string;
}

// Base36, una cifra per domanda: copre da ~15 fino a ~120 domande.
const RESPONSES_RE = /^[0-9a-z]{15,120}$/;
const NICKNAME_MAX = 24;
const VERSIONS = new Set(["vecchia", "nuova", "somma"]);
const PERIOD_MS: Record<string, number> = {
  day: 24 * 3600 * 1000,
  week: 7 * 24 * 3600 * 1000,
  month: 30 * 24 * 3600 * 1000,
  year: 365 * 24 * 3600 * 1000
};
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

  const version = typeof body.version === "string" ? body.version.trim() : "";
  const clientId = typeof body.clientId === "string" ? body.clientId.trim() : "";
  const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
  const profileName = typeof body.profileName === "string" ? body.profileName.trim() : "";
  const percentage = Number(body.percentage);
  const answeredCount = Number(body.answeredCount);
  const responses = typeof body.responses === "string" ? body.responses : "";

  if (!VERSIONS.has(version)) return badRequest("invalid version");
  if (!/^[0-9a-f-]{36}$/i.test(clientId)) return badRequest("invalid clientId");
  if (nickname.length < 1 || nickname.length > NICKNAME_MAX) {
    return badRequest(`nickname must be 1-${NICKNAME_MAX} chars`);
  }
  if (profileName.length < 1 || profileName.length > 40) return badRequest("invalid profileName");
  if (!Number.isInteger(percentage) || percentage < 0 || percentage > 100) {
    return badRequest("invalid percentage");
  }
  if (!Number.isInteger(answeredCount) || answeredCount < 1 || answeredCount > 120) {
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
    "SELECT MAX(created_at) AS last FROM results WHERE version = ? AND client_id = ?"
  )
    .bind(version, clientId)
    .first<{ last: number | null }>();
  if (last?.last && now - last.last < SUBMIT_COOLDOWN_MS) {
    return json({ error: "too many submissions, retry later" }, 429);
  }

  await env.DB.prepare(
    `INSERT INTO results (version, client_id, nickname, profile_name, percentage, answered_count, responses, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(version, clientId, nickname, profileName, percentage, answeredCount, responses, now)
    .run();

  return json({ ok: true });
}

async function handleTop(url: URL, env: Env): Promise<Response> {
  const version = url.searchParams.get("version") ?? "";
  if (!VERSIONS.has(version)) return badRequest("invalid version");
  const period = url.searchParams.get("period") ?? "week";
  const periodMs = PERIOD_MS[period];
  if (!periodMs) return badRequest("invalid period");

  const profile = url.searchParams.get("profile");
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 10, 1), 50);
  const cutoff = Date.now() - periodMs;

  // Un piazzamento per client (l'invio più recente nel periodo), per versione.
  const query = `
    SELECT r.client_id AS clientId, r.nickname, r.profile_name AS profileName,
           r.percentage, r.answered_count AS answeredCount, r.created_at AS timestamp
    FROM results r
    JOIN (
      SELECT client_id, MAX(id) AS max_id
      FROM results
      WHERE version = ? AND created_at >= ?
      GROUP BY client_id
    ) latest ON latest.max_id = r.id
    ${profile ? "WHERE r.profile_name = ?" : ""}
    ORDER BY r.percentage DESC, r.answered_count DESC, r.created_at ASC
    LIMIT ?`;

  const stmt = profile
    ? env.DB.prepare(query).bind(version, cutoff, profile, limit)
    : env.DB.prepare(query).bind(version, cutoff, limit);
  const { results } = await stmt.all();
  return json({ entries: results });
}

async function handleRecent(url: URL, env: Env): Promise<Response> {
  const version = url.searchParams.get("version") ?? "";
  if (!VERSIONS.has(version)) return badRequest("invalid version");
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 200, 1), 500);

  const { results } = await env.DB.prepare(
    `SELECT r.client_id AS clientId, r.nickname, r.profile_name AS profileName,
            r.responses, r.created_at AS timestamp
     FROM results r
     JOIN (
       SELECT client_id, MAX(id) AS max_id FROM results WHERE version = ? GROUP BY client_id
     ) latest ON latest.max_id = r.id
     ORDER BY r.created_at DESC
     LIMIT ?`
  )
    .bind(version, limit)
    .all();
  return json({ entries: results });
}

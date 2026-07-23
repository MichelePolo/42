// --- LEADERBOARD ---
// Interfaccia del servizio classifica con due adapter:
//  - remoto: Cloudflare Worker + D1 (attivo se VITE_LEADERBOARD_API è definita)
//  - locale: dati simulati + punteggio dell'utente in localStorage (fallback
//    di sviluppo, così l'app funziona anche senza backend deployato)
// I componenti UI usano solo l'interfaccia e non sanno quale adapter gira.
// Il servizio dipende dal questionario attivo (domande e profili della
// variante corrente), mai da un dataset importato staticamente: legacy e v1
// hanno lunghezze di codifica diverse (37 vs 31 cifre) e mescolarle rende
// indecodificabili le risposte.

import { Question, Profile } from "./data";
import { getTurnstileToken } from "./turnstile";

export type Period = "day" | "week" | "month" | "year";

export interface LeaderboardEntry {
  nickname: string;
  profileName: string; // profilo dominante (es. "Darwinismo")
  percentage: number; // risonanza col profilo dominante
  answeredCount: number;
  timestamp: number; // epoch ms
  isMe?: boolean;
}

export interface RecentResult {
  clientId: string;
  nickname: string;
  profileName: string;
  responses: string; // codifica posizionale: una cifra per domanda del questionario attivo
  timestamp: number;
}

export interface SubmitPayload {
  nickname: string;
  profileName: string;
  percentage: number;
  answeredCount: number;
  responses: string;
}

export interface LeaderboardService {
  /** Top N per profilo e periodo (tutti i profili se profileName è null). */
  top(period: Period, profileName: string | null, limit?: number): Promise<LeaderboardEntry[]>;
  /** Registra il punteggio dell'utente corrente (una riga storica per invio). */
  submit(entry: SubmitPayload): Promise<void>;
  /** Ultimi risultati (uno per utente), per la mappa. */
  recent(limit?: number): Promise<RecentResult[]>;
  /** Nickname già registrato in questo browser, se presente. */
  myNickname(): string | null;
  /** True se i dati sono condivisi davvero (adapter remoto attivo). */
  isRemote: boolean;
}

export const PERIOD_LABELS: Record<Period, string> = {
  day: "Oggi",
  week: "Settimana",
  month: "Mese",
  year: "Anno"
};

const PERIOD_MS: Record<Period, number> = {
  day: 24 * 3600 * 1000,
  week: 7 * 24 * 3600 * 1000,
  month: 30 * 24 * 3600 * 1000,
  year: 365 * 24 * 3600 * 1000
};

const MY_ENTRY_KEY = "albero-alternative-leaderboard-me";
const CLIENT_ID_KEY = "albero-alternative-client-id";

// Identità anonima e stabile per browser: deduplica la classifica
// (un piazzamento per dispositivo) senza alcun dato personale.
export function getClientId(): string {
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return "00000000-0000-4000-8000-000000000000";
  }
}

function saveMyNickname(nickname: string) {
  try {
    localStorage.setItem(MY_ENTRY_KEY, JSON.stringify({ nickname }));
  } catch {
    // storage non disponibile: pazienza, si perde solo il pre-riempimento
  }
}

function loadMyNickname(): string | null {
  try {
    const raw = localStorage.getItem(MY_ENTRY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed.nickname === "string" ? parsed.nickname : null;
  } catch {
    return null;
  }
}

// --- ADAPTER REMOTO (Cloudflare Worker + D1) ---

// `version` distingue questionari diversi nella stessa tabella D1 (Light /
// Completa / Somma nel PoC), così le tre classifiche non si mescolano.
function createRemoteLeaderboard(baseUrl: string, version?: string): LeaderboardService {
  const clientId = getClientId();
  const api = baseUrl.replace(/\/$/, "");

  return {
    isRemote: true,
    async top(period, profileName, limit = 10) {
      const params = new URLSearchParams({ period, limit: String(limit) });
      if (profileName) params.set("profile", profileName);
      if (version) params.set("version", version);
      const res = await fetch(`${api}/api/top?${params}`);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      return (data.entries as (LeaderboardEntry & { clientId: string })[]).map((e) => ({
        ...e,
        isMe: e.clientId === clientId
      }));
    },
    async submit(entry) {
      const turnstileToken = await getTurnstileToken();
      const res = await fetch(`${api}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...entry, clientId, turnstileToken, version })
      });
      if (res.status === 429) throw new Error("Attendi qualche secondo prima di un nuovo invio.");
      if (!res.ok) {
        // Il Worker risponde { error: "<messaggio leggibile>" }: mostralo.
        const message = await res
          .json()
          .then((d: { error?: string }) => d.error)
          .catch(() => undefined);
        throw new Error(message ?? `Errore del servizio (${res.status}).`);
      }
      saveMyNickname(entry.nickname);
    },
    async recent(limit = 200) {
      const params = new URLSearchParams({ limit: String(limit) });
      if (version) params.set("version", version);
      const res = await fetch(`${api}/api/recent?${params}`);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      return data.entries as RecentResult[];
    },
    myNickname: loadMyNickname
  };
}

// --- ADAPTER LOCALE SIMULATO (fallback di sviluppo) ---

const SEED_NAMES = [
  "NomadeStellare", "Alba42", "IlDubbioso", "Petricore", "Entropia",
  "VelaNera", "Miriade", "Fenice_K", "Ombra&Luce", "Talpa Cosmica",
  "Eco di Mileto", "Brontolo", "Clessidra", "Ipazia_redux", "Zeno42",
  "Marmotta Zen", "Rasoio di O.", "Fil0S0f0", "Ginkgo", "Anemone",
  "Custode", "Vento del Nord", "Lanterna", "Muschio", "Deriva",
  "Sibilla", "Corvo Bianco", "Ultimo Uomo", "Aurora B.", "Semplice"
];

// PRNG deterministico (mulberry32): stessa classifica a ogni caricamento.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createLocalLeaderboard(
  questions: Question[],
  profileNames: string[]
): LeaderboardService {
  const rand = mulberry32(42);
  const now = Date.now();
  const seed: (LeaderboardEntry & { responses: string })[] = SEED_NAMES.map(
    (nickname, i) => ({
      nickname,
      profileName: profileNames[Math.floor(rand() * profileNames.length)],
      percentage: 55 + Math.floor(rand() * 44),
      answeredCount: Math.min(20 + Math.floor(rand() * 18), questions.length),
      // Risposte casuali valide per il questionario ATTIVO (lunghezza e numero
      // di opzioni corretti), così anche la mappa ha punti demo decodificabili.
      responses: questions
        .map((q) => String(1 + Math.floor(rand() * q.o.length)))
        .join(""),
      // Metà delle voci nell'ultima settimana: ogni periodo ha dati.
      timestamp:
        now -
        Math.floor(i % 2 === 0 ? rand() * PERIOD_MS.week : rand() * PERIOD_MS.year)
    })
  );

  const loadMine = (): (LeaderboardEntry & { responses?: string }) | null => {
    try {
      const raw = localStorage.getItem(MY_ENTRY_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed.nickname !== "string" || typeof parsed.percentage !== "number") return null;
      return { ...parsed, isMe: true };
    } catch {
      return null;
    }
  };

  return {
    isRemote: false,
    async top(period, profileName, limit = 10) {
      const cutoff = Date.now() - PERIOD_MS[period];
      const mine = loadMine();
      const pool = mine ? [...seed, mine as LeaderboardEntry] : seed;
      return pool
        .filter(
          (e) =>
            e.timestamp >= cutoff &&
            (profileName === null || e.profileName === profileName)
        )
        .sort(
          (a, b) =>
            b.percentage - a.percentage ||
            b.answeredCount - a.answeredCount ||
            a.timestamp - b.timestamp
        )
        .slice(0, limit);
    },
    async submit(entry) {
      try {
        localStorage.setItem(
          MY_ENTRY_KEY,
          JSON.stringify({ ...entry, timestamp: Date.now() })
        );
      } catch {
        // storage non disponibile: la voce vive solo in memoria di sessione
      }
    },
    async recent(limit = 200) {
      const mine = loadMine();
      const pool = mine?.responses
        ? [...seed, { ...(mine as Required<typeof mine>), isMe: true }]
        : seed;
      return pool.slice(0, limit).map((e, i) => ({
        clientId: e.isMe ? getClientId() : `seed-${i}`,
        nickname: e.nickname,
        profileName: e.profileName,
        responses: e.responses!,
        timestamp: e.timestamp
      }));
    },
    myNickname: () => loadMine()?.nickname ?? null
  };
}

// --- FACTORY ---

export interface LeaderboardDataset {
  Q: Question[];
  PROFILES: Profile[];
}

export interface LeaderboardConfig {
  dataset: LeaderboardDataset;
  /** URL del Worker; assente → adapter demo locale. Default: VITE_LEADERBOARD_API. */
  apiUrl?: string;
  /** Discriminatore di questionario nella tabella condivisa (Light/Completa/Somma). */
  version?: string;
}

// Un'istanza per dataset (memoizzata): classifica e mappa della stessa
// variante condividono lo stesso service, e ogni variante ha il proprio.
const instances = new WeakMap<LeaderboardDataset["Q"], LeaderboardService>();

export function getLeaderboardService(config: LeaderboardConfig): LeaderboardService {
  const { dataset } = config;
  let service = instances.get(dataset.Q);
  if (!service) {
    const apiUrl = config.apiUrl ?? import.meta.env.VITE_LEADERBOARD_API;
    service = apiUrl
      ? createRemoteLeaderboard(apiUrl, config.version)
      : createLocalLeaderboard(dataset.Q, dataset.PROFILES.map((p) => p.n));
    instances.set(dataset.Q, service);
  }
  return service;
}

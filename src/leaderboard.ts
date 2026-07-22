// --- LEADERBOARD (PoC) ---
// Il sito è statico (GitHub Pages): non esiste un backend condiviso.
// Questo modulo definisce l'interfaccia del servizio classifica e la
// implementa con un adapter locale (dati simulati + punteggi reali
// dell'utente in localStorage). Per andare in produzione basta
// sostituire `createLocalLeaderboard` con un adapter remoto
// (Firebase / Supabase / Cloudflare Worker) che rispetti la stessa
// interfaccia: i componenti UI non cambiano.

export type Period = "day" | "week" | "month" | "year";

export interface LeaderboardEntry {
  nickname: string;
  profileName: string; // profilo dominante (es. "Darwinismo")
  percentage: number; // risonanza col profilo dominante
  answeredCount: number;
  timestamp: number; // epoch ms
  isMe?: boolean;
}

export interface LeaderboardService {
  /** Top N per profilo e periodo (tutti i profili se profileName è null). */
  top(period: Period, profileName: string | null, limit?: number): LeaderboardEntry[];
  /** Registra (o aggiorna) il punteggio dell'utente corrente. */
  submit(entry: Omit<LeaderboardEntry, "timestamp" | "isMe">): void;
  /** Nickname già registrato, se presente. */
  myNickname(): string | null;
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

// Seed deterministico: nickname finti con età (frazione del periodo "year")
// e punteggi plausibili, distribuiti sugli 8 profili.
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

function buildSeed(profileNames: string[], now: number): LeaderboardEntry[] {
  const rand = mulberry32(42);
  return SEED_NAMES.map((nickname, i) => ({
    nickname,
    profileName: profileNames[Math.floor(rand() * profileNames.length)],
    percentage: 55 + Math.floor(rand() * 44), // 55–98%
    answeredCount: 20 + Math.floor(rand() * 18), // 20–37
    // Età sparsa nell'ultimo anno, con metà dei casi nell'ultima settimana
    // così ogni periodo (giorno/settimana/mese/anno) ha abbastanza voci.
    timestamp:
      now -
      Math.floor(
        (i % 2 === 0 ? rand() * PERIOD_MS.week : rand() * PERIOD_MS.year)
      )
  }));
}

export function createLocalLeaderboard(profileNames: string[]): LeaderboardService {
  const seed = buildSeed(profileNames, Date.now());

  const loadMine = (): LeaderboardEntry | null => {
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
    top(period, profileName, limit = 10) {
      const cutoff = Date.now() - PERIOD_MS[period];
      const mine = loadMine();
      const pool = mine ? [...seed, mine] : seed;
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
    submit(entry) {
      try {
        localStorage.setItem(
          MY_ENTRY_KEY,
          JSON.stringify({ ...entry, timestamp: Date.now() })
        );
      } catch {
        // storage non disponibile: la voce vive solo in memoria di sessione
      }
    },
    myNickname() {
      return loadMine()?.nickname ?? null;
    }
  };
}

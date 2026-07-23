import { CLUSTERS, Q, MATRIX, MCOL, PROFILES } from "./data";
import {
  CLUSTERS_V2,
  Q_V2,
  MATRIX_V2,
  MCOL_V2,
  PROFILES_V2
} from "./dataV2";
import {
  CLUSTERS_SUM,
  Q_SUM,
  MATRIX_SUM,
  MCOL_SUM,
  PROFILES_SUM
} from "./dataSum";
import { THEME_DATASETS, Theme } from "./dataThemes";
import { Variant } from "./variants";

// --- VARIANTI DEL PoC "tre versioni" ---
// Tutte e tre abilitano mappa e classifiche (salvataggio su D1). Usano un
// Worker dedicato (VITE_POC_LEADERBOARD_API) e un `leaderboardVersion` distinto,
// così le tre classifiche restano separate nella stessa tabella. Storage delle
// risposte separato per versione, per poter compilare le tre in parallelo.

export type PocVersion = "vecchia" | "nuova" | "somma" | Theme;

const POC_API = import.meta.env.VITE_POC_LEADERBOARD_API;

// Fabbrica una variante tematica (Reale/Sapere/Agire) dal relativo sottoinsieme.
function themeVariant(key: Theme): Variant {
  return {
    id: "completa",
    dataset: THEME_DATASETS[key],
    enableCommunity: true,
    storageKey: `poc-answers-${key}`,
    shareVersion: `poc-${key}`,
    useProfileSharePages: false,
    leaderboardApiUrl: POC_API,
    leaderboardVersion: key
  };
}

export const POC_VARIANTS: Record<PocVersion, Variant> = {
  vecchia: {
    id: "light",
    dataset: { CLUSTERS, Q, MATRIX, MCOL, PROFILES },
    enableCommunity: true,
    storageKey: "poc-answers-vecchia",
    shareVersion: "poc-1",
    useProfileSharePages: false,
    leaderboardApiUrl: POC_API,
    leaderboardVersion: "vecchia"
  },
  nuova: {
    id: "completa",
    dataset: {
      CLUSTERS: CLUSTERS_V2,
      Q: Q_V2,
      MATRIX: MATRIX_V2,
      MCOL: MCOL_V2,
      PROFILES: PROFILES_V2
    },
    enableCommunity: true,
    storageKey: "poc-answers-nuova",
    shareVersion: "poc-2",
    useProfileSharePages: false,
    leaderboardApiUrl: POC_API,
    leaderboardVersion: "nuova"
  },
  somma: {
    id: "completa",
    dataset: {
      CLUSTERS: CLUSTERS_SUM,
      Q: Q_SUM,
      MATRIX: MATRIX_SUM,
      MCOL: MCOL_SUM,
      PROFILES: PROFILES_SUM
    },
    enableCommunity: true,
    storageKey: "poc-answers-somma",
    shareVersion: "poc-3",
    useProfileSharePages: false,
    leaderboardApiUrl: POC_API,
    leaderboardVersion: "somma"
  },
  reale: themeVariant("reale"),
  sapere: themeVariant("sapere"),
  agire: themeVariant("agire")
};

export const POC_LABELS: Record<PocVersion, string> = {
  vecchia: "Vecchia",
  nuova: "Nuova",
  somma: "Somma",
  reale: "Il Reale",
  sapere: "Il Sapere",
  agire: "L'Agire"
};

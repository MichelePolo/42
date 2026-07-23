import { CLUSTERS, Q, MATRIX, MCOL, PROFILES } from "./data";
import {
  CLUSTERS_V2,
  Q_V2,
  MATRIX_V2,
  MCOL_V2,
  PROFILES_V2
} from "./dataV2";
import { THEME_DATASETS, Theme } from "./dataThemes";
import { Variant } from "./variants";

// Questionario Light storico (37 domande), senza database. Ora servito alla
// route secondaria "/v1/". Mantiene la chiave localStorage di produzione e la
// propria versione di condivisione, così le risposte salvate dei vecchi utenti
// e i vecchi link continuano a funzionare dopo lo scambio dei path.
export const LIGHT_VARIANT: Variant = {
  id: "light",
  dataset: { CLUSTERS, Q, MATRIX, MCOL, PROFILES },
  enableCommunity: false,
  storageKey: "albero-alternative-answers",
  shareVersion: "1",
  useProfileSharePages: false
};

// Questionario Completo (31 domande). Non più servito da una route propria: il
// suo contenuto confluisce nei percorsi tematici (vedi THEME_VARIANTS). Resta
// esportato come riferimento del dataset.
export const COMPLETA_VARIANT: Variant = {
  id: "completa",
  dataset: {
    CLUSTERS: CLUSTERS_V2,
    Q: Q_V2,
    MATRIX: MATRIX_V2,
    MCOL: MCOL_V2,
    PROFILES: PROFILES_V2
  },
  enableCommunity: true,
  storageKey: "albero-42-v1-answers",
  shareVersion: "2",
  useProfileSharePages: false
};

// --- PERCORSI TEMATICI DI PRODUZIONE (route "/") ---
// Il Reale / Il Sapere / L'Agire: sottoinsiemi tematici del pool completo, ognuno
// con la propria classifica su D1 (discriminata da leaderboardVersion) e con
// Turnstile del sito. Storage e versione di condivisione distinti per percorso.
function productionThemeVariant(key: Theme): Variant {
  return {
    id: "completa",
    dataset: THEME_DATASETS[key],
    enableCommunity: true,
    storageKey: `albero-42-tema-${key}`,
    shareVersion: key,
    useProfileSharePages: false,
    leaderboardVersion: key
  };
}

export const THEME_VARIANTS: Record<Theme, Variant> = {
  reale: productionThemeVariant("reale"),
  sapere: productionThemeVariant("sapere"),
  agire: productionThemeVariant("agire")
};

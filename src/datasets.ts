import { CLUSTERS, Q, MATRIX, MCOL, PROFILES } from "./data";
import {
  CLUSTERS_V2,
  Q_V2,
  MATRIX_V2,
  MCOL_V2,
  PROFILES_V2
} from "./dataV2";
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

// Questionario Completo (31 domande), con mappa e classifiche dal backend.
// È la versione principale, servita alla route "/". Usa le pagine share
// statiche con anteprima Open Graph (generate in dist/share/). Storage e
// versione di condivisione distinti da Light: dati e link non si mescolano mai.
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
  useProfileSharePages: true
};

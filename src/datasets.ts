import { CLUSTERS, Q, MATRIX, MCOL, PROFILES } from "./data";
import {
  CLUSTERS_V2,
  Q_V2,
  MATRIX_V2,
  MCOL_V2,
  PROFILES_V2
} from "./dataV2";
import { Variant } from "./variants";

// Route "/" — versione storica Light, senza database (né mappa né classifiche).
// Mantiene la chiave localStorage di produzione e le pagine share con Open Graph.
export const LEGACY_VARIANT: Variant = {
  id: "legacy",
  dataset: { CLUSTERS, Q, MATRIX, MCOL, PROFILES },
  enableCommunity: false,
  storageKey: "albero-alternative-answers",
  shareVersion: "1",
  useProfileSharePages: true
};

// Route "/v1/" — versione Completa (31 domande), con mappa e classifiche
// alimentate dal backend. Storage e versione di condivisione distinti, così i
// dati e i link delle due versioni non si mescolano mai.
export const V1_VARIANT: Variant = {
  id: "v1",
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

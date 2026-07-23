import { createContext, useContext } from "react";
import { Cluster, Question, MatrixRow, Profile } from "./data";

// Un "dataset" è un questionario completo e autoconsistente: domande,
// matrice, profili. Route del sito:
//   - /       → hub tematico: tre percorsi (Il Reale / Il Sapere / L'Agire),
//               con classifica e mappa dal backend
//   - /v1/    → questionario Light storico, senza database
export interface Dataset {
  CLUSTERS: Cluster[];
  Q: Question[];
  MATRIX: MatrixRow[];
  MCOL: Record<string, (string | null)[]>;
  PROFILES: Profile[];
}

export interface Variant {
  id: "light" | "completa";
  dataset: Dataset;
  /** Abilita i tab Mappa e Classifiche (e quindi il backend). */
  enableCommunity: boolean;
  /** Chiave localStorage delle risposte: distinta per non mischiare i due questionari. */
  storageKey: string;
  /** Versione della codifica di condivisione (?v=…): distingue i link fra i questionari. */
  shareVersion: string;
  /** Discriminatore del questionario nella tabella D1 (per non mischiare le classifiche). */
  leaderboardVersion?: string;
}

export const VariantContext = createContext<Variant | null>(null);

export function useVariant(): Variant {
  const v = useContext(VariantContext);
  if (!v) throw new Error("useVariant deve stare dentro <VariantContext.Provider>");
  return v;
}

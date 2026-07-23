import { createContext, useContext } from "react";
import { Cluster, Question, MatrixRow, Profile } from "./data";

// Un "dataset" è un questionario completo e autoconsistente: domande,
// matrice, profili. Il sito ne serve due, su due route non collegate:
//   - legacy  (/)     → questionario Light storico, senza database
//   - v1      (/v1/)  → questionario Completo, con classifica e mappa
export interface Dataset {
  CLUSTERS: Cluster[];
  Q: Question[];
  MATRIX: MatrixRow[];
  MCOL: Record<string, (string | null)[]>;
  PROFILES: Profile[];
}

export interface Variant {
  id: "legacy" | "v1";
  dataset: Dataset;
  /** Abilita i tab Mappa e Classifiche (e quindi il backend). */
  enableCommunity: boolean;
  /** Chiave localStorage delle risposte: distinta per non mischiare i due questionari. */
  storageKey: string;
  /** Versione della codifica di condivisione (?v=…): distingue i link fra le due versioni. */
  shareVersion: string;
  /** Usa le pagine share statiche per-profilo con Open Graph (solo legacy). */
  useProfileSharePages: boolean;
}

export const VariantContext = createContext<Variant | null>(null);

export function useVariant(): Variant {
  const v = useContext(VariantContext);
  if (!v) throw new Error("useVariant deve stare dentro <VariantContext.Provider>");
  return v;
}

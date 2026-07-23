import { Cluster, Question, Profile, MatrixRow } from "./data";
import {
  CLUSTERS_SUM,
  Q_SUM,
  MATRIX_SUM,
  MCOL_SUM,
  PROFILES_SUM
} from "./dataSum";

// --- PERCORSI TEMATICI (Il Reale / Il Sapere / L'Agire) ---
// Partizione per argomento del pool completo (le 54 domande della Somma):
// ogni tema è un sottoinsieme di Q_SUM filtrato per ambito. Domande, opzioni e
// profili sono gli stessi della Somma, solo ristretti al tema. Vedi
// RIPARTIZIONE-TEMATICA.md per il razionale (registro "Reale/Sapere/Agire").

export type Theme = "reale" | "sapere" | "agire";

export interface ThemeMeta {
  key: Theme;
  name: string;
  gloss: string; // domanda kantiana
  blurb: string; // di cosa parla
  clusters: string[]; // id (namespaced) degli ambiti Somma che confluiscono
}

export const THEME_META: Record<Theme, ThemeMeta> = {
  reale: {
    key: "reale",
    name: "Il Reale",
    gloss: "che cosa c'è",
    blurb: "metafisica, ontologia, divino, cosmo, struttura",
    clusters: ["No", "Nd", "Ns", "Nr", "Nc", "Ld"]
  },
  sapere: {
    key: "sapere",
    name: "Il Sapere",
    gloss: "che cosa posso sapere",
    blurb: "epistemologia, filosofia della mente, coscienza, simbolo",
    clusters: ["Ne", "Nm", "Nk", "Lc", "Lk"]
  },
  agire: {
    key: "agire",
    name: "L'Agire",
    gloss: "che cosa devo fare",
    blurb: "il vivente, la persona, i valori, la società",
    clusters: ["Nv", "Nu", "Lv", "Lu", "Le", "Ls"]
  }
};

export interface ThemeDataset {
  CLUSTERS: Cluster[];
  Q: Question[];
  MATRIX: MatrixRow[];
  MCOL: Record<string, (string | null)[]>;
  PROFILES: Profile[];
}

function buildTheme(meta: ThemeMeta): ThemeDataset {
  const clusterSet = new Set(meta.clusters);
  const CLUSTERS = CLUSTERS_SUM.filter((c) => clusterSet.has(c.id));
  const Q = Q_SUM.filter((q) => clusterSet.has(q.c));
  const qidSet = new Set(Q.map((q) => q.id));

  const MATRIX = MATRIX_SUM.filter((row) => qidSet.has(row.qid));
  const MCOL: Record<string, (string | null)[]> = {};
  MATRIX.forEach((row) => {
    MCOL[row.qid] = MCOL_SUM[row.qid];
  });

  // Profili ristretti alle domande del tema, così la risonanza è calcolata solo
  // sugli argomenti effettivamente presenti nel percorso.
  const PROFILES = PROFILES_SUM.map((p) => {
    const m: Record<string, string> = {};
    Object.entries(p.m).forEach(([qid, oid]) => {
      if (qidSet.has(qid)) m[qid] = oid;
    });
    return { n: p.n, era: p.era, m };
  });

  return { CLUSTERS, Q, MATRIX, MCOL, PROFILES };
}

export const THEME_DATASETS: Record<Theme, ThemeDataset> = {
  reale: buildTheme(THEME_META.reale),
  sapere: buildTheme(THEME_META.sapere),
  agire: buildTheme(THEME_META.agire)
};

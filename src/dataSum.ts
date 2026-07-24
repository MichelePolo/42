import {
  CLUSTERS,
  Q,
  MATRIX,
  MCOL,
  PROFILES,
  Cluster,
  Question,
  Option,
  Profile,
  MatrixRow
} from "./data";
import {
  CLUSTERS_V2,
  Q_V2,
  MATRIX_V2,
  MCOL_V2,
  PROFILES_V2
} from "./dataV2";

// --- VERSIONE SOMMA (unione distinct di Light + Completa) ---
// Calcolata per merge dai due dataset, così resta sempre allineata.
// Regole: nessuna domanda o risposta persa; le domande presenti in entrambe le
// versioni vengono fuse in una sola con l'UNIONE delle risposte (deduplicate
// per etichetta), che può superare le 5 opzioni. Gli id dei cluster sono
// prefissati ("N" = nuova/Completa, "L" = Light) perché le stesse lettere
// indicano ambiti diversi nelle due tassonomie (es. "c" = Cosmo vs Coscienza).

// Coppie di domande "equivalenti" fra Light (q…) e Completa (o/d/s/… ) —
// 6 identiche (cosmo + "come procede") e 8 riformulate sullo stesso tema.
const PAIRS: [string, string][] = [
  ["q7", "d2"],
  ["q14", "c1"],
  ["q15", "c2"],
  ["q16", "c3"],
  ["q17", "c4"],
  ["q18", "c5"],
  ["q12", "o1"],
  ["q11", "r1"],
  ["q13", "s1"],
  ["q31", "e1"],
  ["q32", "e2"],
  ["q19", "v1"],
  ["q21", "m1"],
  ["q27", "u3"]
];

const legacyMatched = new Map(PAIRS.map(([l, v]) => [l, v]));

// Equivalenze semantiche fra opzioni delle due versioni, per unire risposte che
// dicono la stessa cosa con etichette diverse (oltre alle coincidenze esatte).
// Chiave = id domanda Completa; mappa = id opzione Light → id opzione Completa.
const OPTION_EQUIV: Record<string, Record<string, string>> = {
  r1: { b: "b" }, // Idealismo ≈ Idealismo trascendentale
  s1: { a: "a", b: "d" }, // Sostanzialismo≈Sostanze, Processualismo≈Processi
  e1: { a: "a", b: "b", d: "d" }, // Razionalismo≈La ragione, Empirismo≈esperienza, Intuizione≈L'intuizione
  e2: { a: "a", b: "b", c: "c" }, // Scientismo forte≈Scientismo, Naturalismo metod.≈Competenza limitata, Pluralismo epist.≈eccede il metodo
  v1: { e: "e" }, // Vita come relazione ≈ Relazione ecologica
  m1: { a: "a" }, // Identità ≈ Teoria dell'identità
  u3: { a: "a", b: "b" } // Individualismo≈Preesiste, Relazionalismo≈Si costituisce
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

interface Merged {
  question: Question;
  // id opzione originale → id opzione nella domanda fusa, per rimappare i profili
  map: { legacy: Record<string, string>; v2: Record<string, string> };
}

function mergeQuestion(
  lq: Question,
  vq: Question,
  equiv?: Record<string, string>
): Merged {
  const opts: Option[] = [];
  const map = { legacy: {} as Record<string, string>, v2: {} as Record<string, string> };
  const seen = new Map<string, string>(); // etichetta normalizzata → nuovo id
  let idx = 0;

  const add = (opt: Option, source: "legacy" | "v2") => {
    // Equivalenza semantica esplicita (solo per le opzioni Light): fondi
    // sull'opzione Completa corrispondente, già aggiunta.
    if (source === "legacy" && equiv && equiv[opt.id] && map.v2[equiv[opt.id]]) {
      map.legacy[opt.id] = map.v2[equiv[opt.id]];
      return;
    }
    const key = norm(opt.l);
    const existing = seen.get(key);
    if (existing) {
      map[source][opt.id] = existing;
      return;
    }
    const newId = String.fromCharCode(97 + idx); // a, b, c, …
    idx++;
    opts.push({ ...opt, id: newId });
    seen.set(key, newId);
    map[source][opt.id] = newId;
  };

  // La Completa (rifinita) definisce l'ordine; le opzioni Light nuove seguono.
  vq.o.forEach((o) => add(o, "v2"));
  lq.o.forEach((o) => add(o, "legacy"));

  return {
    question: {
      id: `sum_${lq.id}_${vq.id}`,
      c: "N" + vq.c,
      t: vq.t,
      f: vq.f ?? lq.f,
      note: vq.note || lq.note,
      g: vq.g ?? lq.g,
      an: vq.an ?? lq.an,
      o: opts
    },
    map
  };
}

// Costruisce le domande fuse, indicizzate per id Light e per id Completa.
const mergedByLegacy = new Map<string, Merged>();
const mergedByV2 = new Map<string, Merged>();
PAIRS.forEach(([lid, vid]) => {
  const lq = Q.find((q) => q.id === lid)!;
  const vq = Q_V2.find((q) => q.id === vid)!;
  const merged = mergeQuestion(lq, vq, OPTION_EQUIV[vid]);
  mergedByLegacy.set(lid, merged);
  mergedByV2.set(vid, merged);
});

// --- CLUSTERS_SUM: prima gli ambiti della Completa, poi gli ambiti Light che
//     conservano domande proprie (non fuse). ---
const v2ClustersNS: Cluster[] = CLUSTERS_V2.map((c) => ({
  ...c,
  id: "N" + c.id
}));
// Id prefissato "L" (per non collidere con gli ambiti della Completa), nome
// originale invariato.
const legacyLeftoverClusters: Cluster[] = CLUSTERS.filter((c) =>
  Q.some((q) => q.c === c.id && !legacyMatched.has(q.id))
).map((c) => ({ ...c, id: "L" + c.id }));

export const CLUSTERS_SUM: Cluster[] = [...v2ClustersNS, ...legacyLeftoverClusters];

// --- Q_SUM: per ogni ambito Completa le domande (fuse dove serve), poi le
//     domande Light rimaste. ---
const sumQuestions: Question[] = [];
CLUSTERS_V2.forEach((c) => {
  Q_V2.filter((q) => q.c === c.id).forEach((vq) => {
    const merged = mergedByV2.get(vq.id);
    sumQuestions.push(merged ? merged.question : { ...vq, c: "N" + vq.c });
  });
});
CLUSTERS.forEach((c) => {
  Q.filter((q) => q.c === c.id && !legacyMatched.has(q.id)).forEach((lq) => {
    sumQuestions.push({ ...lq, c: "L" + lq.c });
  });
});
export const Q_SUM: Question[] = sumQuestions;

// --- PROFILES_SUM: unione delle chiavi di risonanza, rimappate sugli id fusi.
//     Sulle domande fuse prevale la posizione della Completa. ---
function remapProfile(name: string): Profile {
  const legacy = PROFILES.find((p) => p.n === name);
  const v2 = PROFILES_V2.find((p) => p.n === name);
  const m: Record<string, string> = {};

  if (legacy) {
    Object.entries(legacy.m).forEach(([qid, oid]) => {
      const merged = mergedByLegacy.get(qid);
      if (merged) m[merged.question.id] = merged.map.legacy[oid] ?? oid;
      else m[qid] = oid;
    });
  }
  if (v2) {
    Object.entries(v2.m).forEach(([qid, oid]) => {
      const merged = mergedByV2.get(qid);
      if (merged) m[merged.question.id] = merged.map.v2[oid] ?? oid;
      else m[qid] = oid;
    });
  }
  return { n: name, era: (v2 ?? legacy)!.era, m };
}

const profileNames = Array.from(
  new Set([...PROFILES_V2.map((p) => p.n), ...PROFILES.map((p) => p.n)])
);
export const PROFILES_SUM: Profile[] = profileNames.map(remapProfile);

// --- MATRIX_SUM / MCOL_SUM: matrice CURATA, non auto-generata. Riusa le colonne
//     scelte editorialmente nelle matrici originali (la "terza possibilità"
//     resta quella pensata a mano), rimappate sugli id delle opzioni fuse.
//     Le righe delle domande fuse prendono le colonne della Completa. ---
export const MATRIX_SUM: MatrixRow[] = [];
export const MCOL_SUM: Record<string, (string | null)[]> = {};
const matrixSeen = new Set<string>();

function addMatrixRow(sumQ: Question, cols: (string | null)[]) {
  if (matrixSeen.has(sumQ.id)) return;
  matrixSeen.add(sumQ.id);
  const label = (id: string | null) =>
    id ? sumQ.o.find((o) => o.id === id)?.l ?? "—" : "—";
  MATRIX_SUM.push({ qid: sumQ.id, a: label(cols[0]), b: label(cols[1]), c: label(cols[2]) });
  MCOL_SUM[sumQ.id] = [cols[0] ?? null, cols[1] ?? null, cols[2] ?? null];
}

// Completa prima (vince sulle domande fuse), poi Light per le domande proprie.
MATRIX_V2.forEach((row) => {
  const merged = mergedByV2.get(row.qid);
  const sumQ = merged ? merged.question : Q_SUM.find((q) => q.id === row.qid);
  if (!sumQ) return;
  const cols = (MCOL_V2[row.qid] ?? []).map((id) =>
    id == null ? null : merged ? merged.map.v2[id] : id
  );
  addMatrixRow(sumQ, cols);
});
MATRIX.forEach((row) => {
  const merged = mergedByLegacy.get(row.qid);
  const sumQ = merged ? merged.question : Q_SUM.find((q) => q.id === row.qid);
  if (!sumQ) return;
  const cols = (MCOL[row.qid] ?? []).map((id) =>
    id == null ? null : merged ? merged.map.legacy[id] : id
  );
  addMatrixRow(sumQ, cols);
});

// Ordina le righe secondo la sequenza delle domande, per una lettura coerente.
const qOrder = new Map(Q_SUM.map((q, i) => [q.id, i]));
MATRIX_SUM.sort((a, b) => (qOrder.get(a.qid) ?? 0) - (qOrder.get(b.qid) ?? 0));

// Esporta in DOMANDE.md tutte le domande e le risposte delle due versioni
// (Light 37 domande, Completa 31), leggendo direttamente i dataset TypeScript
// tramite un bundle esbuild in memoria. Rigenerabile: `node scripts/export-questions.mjs`.
import { build } from "esbuild";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const bundled = await build({
  stdin: {
    contents:
      `export * as light from ${JSON.stringify(path.join(root, "src/data.ts"))};\n` +
      `export * as full from ${JSON.stringify(path.join(root, "src/dataV2.ts"))};`,
    resolveDir: root,
    loader: "ts"
  },
  bundle: true,
  format: "esm",
  write: false,
  platform: "node"
});
const dataUrl =
  "data:text/javascript;base64," +
  Buffer.from(bundled.outputFiles[0].text).toString("base64");
const { light, full } = await import(dataUrl);

const LETTERS = ["A", "B", "C", "D", "E"];

function renderQuestion(q, idx, clusters) {
  const cluster = clusters.find((c) => c.id === q.c);
  const lines = [];
  lines.push(`#### ${idx}. ${q.t}`);
  lines.push("");
  lines.push(
    `*Ambito: ${cluster ? cluster.name : q.c}${q.f ? ` · \`${q.f}\`` : ""}*`
  );
  lines.push("");
  if (q.note) lines.push(`> ${q.note}`, "");
  if (q.g) lines.push(`**Come orientarsi.** ${q.g}`, "");
  if (q.an) lines.push(`**Analogia.** ${q.an}`, "");
  q.o.forEach((opt, i) => {
    lines.push(`- **${LETTERS[i] ?? opt.id}. ${opt.l}**${opt.f ? ` — \`${opt.f}\`` : ""}`);
    if (opt.b) lines.push(`  ${opt.b}`);
    if (opt.ex && opt.ex.length) lines.push(`  - *Esempi:* ${opt.ex.join(", ")}`);
    if (opt.im) lines.push(`  - *Implica:* ${opt.im}`);
    if (opt.co) lines.push(`  - *Costo filosofico:* ${opt.co}`);
  });
  lines.push("");
  return lines.join("\n");
}

function renderVersion(title, subtitle, data, clustersKey, qKey, profKey) {
  const clusters = data[clustersKey];
  const questions = data[qKey];
  const profiles = data[profKey];
  const out = [];
  out.push(`## ${title}`, "", `*${subtitle}*`, "");

  clusters.forEach((cluster) => {
    const qs = questions.filter((q) => q.c === cluster.id);
    if (!qs.length) return;
    out.push(`### ${cluster.name}`, "", `*${cluster.gloss}*`, "");
    qs.forEach((q) => {
      const globalIdx = questions.findIndex((x) => x.id === q.id) + 1;
      out.push(renderQuestion(q, globalIdx, clusters));
    });
  });

  // Appendice profili: posizione di ogni tradizione sulle domande
  out.push(`### Profili filosofici — chiavi di risonanza`, "");
  profiles.forEach((p) => {
    out.push(`**${p.n}** *(${p.era})*`);
    Object.entries(p.m).forEach(([qid, oid]) => {
      const q = questions.find((x) => x.id === qid);
      if (!q) return;
      const opt = q.o.find((o) => o.id === oid);
      out.push(`- ${q.t} → *${opt ? opt.l : oid}*`);
    });
    out.push("");
  });

  return out.join("\n");
}

const header = [
  "# Albero delle Alternative — Archivio domande e risposte",
  "",
  "Questo documento raccoglie tutte le domande e le relative risposte delle due versioni del sito.",
  "Generato automaticamente da `src/data.ts` (Light) e `src/dataV2.ts` (Completa) via `scripts/export-questions.mjs`.",
  "",
  `- **Versione Light:** ${light.Q.length} domande, ${light.CLUSTERS.length} ambiti`,
  `- **Versione Completa:** ${full.Q_V2.length} domande, ${full.CLUSTERS_V2.length} ambiti`,
  "",
  "---",
  ""
].join("\n");

const body =
  renderVersion(
    "Versione Light (storica)",
    `${light.Q.length} domande — questionario originale`,
    light,
    "CLUSTERS",
    "Q",
    "PROFILES"
  ) +
  "\n---\n\n" +
  renderVersion(
    "Versione Completa",
    `${full.Q_V2.length} domande — derivate dall'analisi "Visioni del mondo, della vita e dell'uomo"`,
    full,
    "CLUSTERS_V2",
    "Q_V2",
    "PROFILES_V2"
  );

writeFileSync(path.join(root, "DOMANDE.md"), header + body + "\n");
console.log(
  `DOMANDE.md scritto: Light ${light.Q.length} domande, Completa ${full.Q_V2.length} domande.`
);

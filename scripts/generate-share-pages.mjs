// Generates dist/share/<slug>/index.html: static pages whose only job is to
// give social crawlers per-profile Open Graph tags, then redirect real
// browsers to the app preserving the ?responses=... query string.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = "https://michelepolo.github.io/42/";
const profiles = JSON.parse(
  readFileSync(path.join(root, "src", "shareProfiles.json"), "utf8")
);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

for (const { slug, title, description } of Object.values(profiles)) {
  const pageUrl = `${SITE}share/${slug}/`;
  const html = `<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Albero delle Alternative" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:image" content="${SITE}og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <link rel="icon" type="image/svg+xml" href="${SITE}favicon.svg" />
    <script>location.replace("${SITE}" + location.search + location.hash);</script>
  </head>
  <body style="font-family: sans-serif; background: #F2F0E9; color: #2D302A; text-align: center; padding: 3rem 1rem;">
    <p>${esc(title)}</p>
    <p><a id="go" href="${SITE}">Apri l'Albero delle Alternative</a></p>
    <script>document.getElementById("go").href = "${SITE}" + location.search;</script>
  </body>
</html>
`;
  const dir = path.join(root, "dist", "share", slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html);
  console.log(`share page: share/${slug}/index.html`);
}

// Assemble le projet dans dist/ : index.html autonome (CSS et JS en ligne) + sw, manifest, icones.
const fs = require("fs");
const path = require("path");

const root = __dirname;
const dist = path.join(root, "dist");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");

let html = read("index.html");
const hrefs = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">\n?/g)].map((m) => m[1]);
const srcs = [...html.matchAll(/<script defer src="([^"]+)"><\/script>\n?/g)].map((m) => m[1]);

const css = hrefs.map(read).join("");
// les scripts partagent une seule portee globale: on les concatene dans l'ordre de chargement
const js = srcs.map(read).join("\n");

html = html
  .replace(/<link rel="stylesheet" href="[^"]+">\n?/g, "")
  .replace(/<script defer src="[^"]+"><\/script>\n?/g, "")
  .replace("</head>", () => `<style>\n${css}</style>\n</head>`)
  .replace("</body>", () => `<script>\n${js}</script>\n</body>`);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, "index.html"), html);
for (const f of ["sw.js", "manifest.webmanifest"]) fs.copyFileSync(path.join(root, f), path.join(dist, f));
fs.cpSync(path.join(root, "icons"), path.join(dist, "icons"), { recursive: true });

console.log(`dist/index.html: ${(html.length / 1024).toFixed(1)} Ko (${hrefs.length} css, ${srcs.length} js)`);

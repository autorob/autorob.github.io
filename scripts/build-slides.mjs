// Builds every reveal.js deck under slides/ (except the _template) into
// site/slides/<lecture-dir>/, merging into MkDocs' already-built output.
// Must run *after* `mkdocs build`, which wipes and regenerates site/ from
// scratch -- run this second or the merged decks will be deleted.
import { readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const slidesDir = path.join(root, "slides");
const siteDir = path.join(root, "site");

if (!existsSync(siteDir)) {
  console.error("site/ not found -- run `mkdocs build` before this script.");
  process.exit(1);
}

const includeTemplate = process.argv.includes("--include-template");
const lectureDirs = readdirSync(slidesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((name) => includeTemplate || name !== "_template")
  .filter((name) => existsSync(path.join(slidesDir, name, "slides.md")));

for (const name of lectureDirs) {
  const src = path.join(slidesDir, name, "slides.md");
  const assetsDir = path.join(slidesDir, name, "assets");
  const out = path.join(siteDir, "slides", name);
  const args = [
    "reveal-md",
    src,
    "--static",
    out,
    "--title",
    name,
  ];
  if (existsSync(assetsDir)) {
    args.push("--static-dirs", path.relative(root, assetsDir));
  }
  console.log(`building ${name} ...`);
  execFileSync("npx", args, { cwd: root, stdio: "inherit" });
}

console.log(`built ${lectureDirs.length} deck(s) into site/slides/`);

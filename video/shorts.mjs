// Renders every slideshow in public/video.json (its `shorts`) into one folder
// the founder can see: on the Desktop, not in the hidden .shipfound/ folder,
// so they can pick the slides in the TikTok or Instagram app themselves
// (AirDrop them to the phone). See skills/shipfound/routines/shorts.md.
//
//   npm run shorts                  every slideshow
//   npm run shorts -- --show 2      only slideshow 2
//   npm run shorts -- --out <dir>   somewhere else
//
// Per slideshow n: show<n>-slide<k>.png (1080x1920, 9:16) for each slide,
// in order, and show<n>-caption.txt with the caption to post with it.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};

const spec = JSON.parse(readFileSync("public/video.json", "utf8"));
const shows = spec.shorts ?? [];
if (!shows.length) throw new Error("public/video.json has no shorts: write them first (routines/shorts.md, step 5)");
const only = arg("show");
const picked = only ? [Number(only)] : shows.map((_, i) => i + 1);
for (const n of picked) if (!(n >= 1 && n <= shows.length)) throw new Error(`No slideshow ${n}: public/video.json has ${shows.length}`);

const slug = String(spec.product ?? "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "product";
const desktop = join(homedir(), "Desktop");
const out = resolve(arg("out") ?? (existsSync(desktop) ? join(desktop, `${slug}-shorts-${new Date().toISOString().slice(0, 10)}`) : "out/shorts"));
mkdirSync(out, { recursive: true });

const made = [];
for (const n of picked) {
  const show = shows[n - 1];
  show.slides.forEach((_, k) => {
    const file = join(out, `show${n}-slide${k + 1}.png`);
    const r = spawnSync("npx", ["remotion", "still", `Slide-${n}-${k + 1}`, file], { stdio: "inherit" });
    if (r.status !== 0) process.exit(r.status ?? 1);
    made.push(file);
  });
  const caption = join(out, `show${n}-caption.txt`);
  writeFileSync(caption, `${show.caption}\n`);
  made.push(caption);
}
console.log(`\n${made.length} files in ${out}`);

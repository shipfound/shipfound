// Renders every ad's creatives into one folder the founder can see: on the
// Desktop, not in the hidden .shipfound/ folder, so they can drag a file into
// an upload box themselves (the Reddit steps are all theirs).
//
//   npm run ads                  every cut in public/video.json
//   npm run ads -- --ad 2        only ad 2
//   npm run ads -- --out <dir>   somewhere else
//
// Per ad n: ad<n>-video-square.mp4 (1:1, X and Reddit), ad<n>-video-portrait.mp4
// (4:5, Meta feeds), ad<n>-video-vertical.mp4 (9:16, Reels and Stories),
// ad<n>-image-portrait.png (4:5) and ad<n>-image-square.png (1:1). The videos
// carry a silent audio track: no sound, but an upload that expects audio
// (Reddit's has failed without one) gets one.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};

const spec = JSON.parse(readFileSync("public/video.json", "utf8"));
const count = 1 + (spec.ads?.length ?? 0);
const only = arg("ad");
const ads = only ? [Number(only)] : Array.from({ length: count }, (_, i) => i + 1);
for (const n of ads) if (!(n >= 1 && n <= count)) throw new Error(`No ad ${n}: public/video.json has ${count} cut${count === 1 ? "" : "s"}`);

const slug = String(spec.product ?? "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "product";
const desktop = join(homedir(), "Desktop");
const out = resolve(arg("out") ?? (existsSync(desktop) ? join(desktop, `${slug}-ads-${new Date().toISOString().slice(0, 10)}`) : "out/ads"));
mkdirSync(out, { recursive: true });

const run = (args) => {
  const r = spawnSync("npx", ["remotion", ...args], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

const made = [];
for (const n of ads) {
  for (const [comp, name] of [["Square", "square"], ["Portrait", "portrait"], ["Vertical", "vertical"]]) {
    const file = join(out, `ad${n}-video-${name}.mp4`);
    run(["render", `${comp}-${n}`, file, "--codec=h264", "--crf=18", "--enforce-audio-track"]);
    made.push(file);
  }
  for (const [comp, name] of [[`Image-${n}`, "portrait"], [`Image-${n}-square`, "square"]]) {
    const file = join(out, `ad${n}-image-${name}.png`);
    run(["still", comp, file]);
    made.push(file);
  }
}

console.log(`\nThe ads are in ${out}:\n${made.map((f) => `  ${f.slice(out.length + 1)}`).join("\n")}`);

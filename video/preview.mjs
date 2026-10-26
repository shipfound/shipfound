// Renders the App Store app preview from the simulator's recordings into a
// folder on the founder's Desktop, ready to drag into App Store Connect.
//
//   npm run preview                 iPhone (886x1920)
//   npm run preview -- --ipad       iPad too (1200x1600)
//   npm run preview -- --out <dir>  somewhere else
//
// public/preview.json: { "product": "Robo", "clips": [{ "file": "rec1.mp4", "from": 0, "to": 6, "caption": "..." }] }
// Apple's rules it checks: 15 to 30 seconds, captions of 7 words or fewer,
// every recording in public/. Rendered at 30 fps, H.264, with a silent stereo
// audio track (App Store Connect expects one).

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};

const spec = JSON.parse(readFileSync("public/preview.json", "utf8"));
const clips = spec.clips ?? [];
const seconds = clips.reduce((n, c) => n + (c.to - c.from), 0);
const problems = [];
if (!clips.length) problems.push("public/preview.json has no clips.");
if (seconds < 15 || seconds > 30) problems.push(`The preview is ${seconds.toFixed(1)} seconds; Apple takes 15 to 30.`);
for (const [i, c] of clips.entries()) {
  if (!existsSync(join("public", c.file))) problems.push(`Clip ${i + 1}: public/${c.file} is not there. Record it with xcrun simctl io booted recordVideo.`);
  if (!(c.to > c.from)) problems.push(`Clip ${i + 1}: "to" must be after "from".`);
  if ((c.caption ?? "").split(/\s+/).filter(Boolean).length > 7) problems.push(`Clip ${i + 1}: the caption is over 7 words.`);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

const day = new Date().toISOString().slice(0, 10);
const slug = String(spec.product ?? "app").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const out = resolve(arg("out") ?? join(homedir(), "Desktop", `${slug}-preview-${day}`));
mkdirSync(out, { recursive: true });

const sizes = ["iphone", ...(process.argv.includes("--ipad") ? ["ipad"] : [])];
for (const size of sizes) {
  const file = join(out, `preview-${size}.mp4`);
  const r = spawnSync("npx", ["remotion", "render", `Preview-${size}`, file, "--props=public/preview.json", "--codec=h264", "--crf=18", "--enforce-audio-track"], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.log(`✓ ${file}`);
}
console.log(`\nIn ${out}. Drag a file into App Store Connect: a product page A/B test's treatment (App Previews), or the next version once a test has shown it helps.`);

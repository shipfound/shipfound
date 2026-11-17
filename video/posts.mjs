// Renders the week's social posts in public/posts.json into one folder on the
// founder's Desktop (skills/shipfound/routines/posts.md): the slides for a
// photo post or carousel, and the same post as a 9:16 MP4 for TikTok on the
// web, Reels and Shorts.
//
//   npm run posts                  every post
//   npm run posts -- --post 3      only post 3
//   npm run posts -- --out <dir>   somewhere else
//
// public/posts.json: { "product": "Shipfound", "week": "2026-w47", "posts": [{ "n": 1, "format": "notes", "caption": "...", "frames": [...] }] }
// Per post n: post<n>-slide<k>.png for each frame, post<n>.mp4, and
// post<n>-caption.txt. Frames are built in the kit (src/Posts.tsx), no stock.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};

const FPS = 30;
const BEAT = 2.5;
// The same seconds as src/Posts.tsx.
const SECONDS = { notes: 4, chat: 4, versus: 4, tier: 5, beforeafter: 4, lockscreen: 3.5, calendar: 4, guess: 3.5, xpost: 3.5, answer: 5, sheet: 4 };
const KINDS = ["title", "screen", "inbox", ...Object.keys(SECONDS)];
const secondsOf = (f) => f.seconds ?? SECONDS[f.kind] ?? BEAT;
const frames = (f) => Math.round(secondsOf(f) * FPS);

const spec = JSON.parse(readFileSync("public/posts.json", "utf8"));
const posts = spec.posts ?? [];
if (!posts.length) throw new Error("public/posts.json has no posts: write them first (routines/posts.md, step 4)");
const only = arg("post");
const picked = only ? posts.filter((p) => p.n === Number(only)) : posts;
if (!picked.length) throw new Error(`No post ${only} in public/posts.json`);

const problems = [];
for (const p of picked) {
  for (const [i, f] of (p.frames ?? []).entries()) {
    if (!KINDS.includes(f.kind)) problems.push(`post ${p.n} frame ${i + 1}: no frame kind "${f.kind}" (${KINDS.join(", ")})`);
  }
  if (!p.caption) problems.push(`post ${p.n}: no caption`);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

const slug = String(spec.product ?? "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "product";
const desktop = join(homedir(), "Desktop");
const out = resolve(arg("out") ?? (existsSync(desktop) ? join(desktop, `${slug}-posts-${spec.week ?? new Date().toISOString().slice(0, 10)}`) : "out/posts"));
mkdirSync(out, { recursive: true });
mkdirSync("out", { recursive: true });

const run = (args) => {
  const r = spawnSync("npx", ["remotion", ...args], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

const made = [];
for (const p of picked) {
  const props = resolve("out", `post-${p.n}.json`);
  writeFileSync(props, JSON.stringify({ post: p }));
  let at = 0;
  p.frames.forEach((f, k) => {
    const file = join(out, `post${p.n}-slide${k + 1}.png`);
    run(["still", "Post", file, `--props=${props}`, `--frame=${at + Math.floor(frames(f) * 0.75)}`]);
    made.push(file);
    at += frames(f);
  });
  const mp4 = join(out, `post${p.n}.mp4`);
  run(["render", "Post", mp4, `--props=${props}`, "--codec=h264", "--crf=18", "--enforce-audio-track"]);
  made.push(mp4);
  const caption = join(out, `post${p.n}-caption.txt`);
  writeFileSync(caption, `${p.caption}\n`);
  made.push(caption);
}
console.log(`\n${made.length} files in ${out}`);

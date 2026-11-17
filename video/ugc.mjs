// Finishes an AI-presenter clip (the ugc move, routines/video.md "The AI
// presenter ad") into the post or ad: the presenter says the hook full
// screen, then the product's real screens fill the frame while the presenter
// keeps talking from a round bubble in the corner (a facecam), the kit's end
// card under the last line, in 9:16 and 4:5.
//
//   npm run ugc -- --clip <clip.mp4> [--script public/ugc.json] [--out out/ugc] [--desktop <dir>]
//
// The clip is one generated take, 9:16: the presenter talking to the phone
// camera as a selfie the whole time, in their own voice. The script
// (public/ugc.json) says what the voice says, line by line, and which of the
// Screen beats (video.json `screen`) each line is about:
//   {
//     "device": "laptop",
//     "lines": [
//       { "text": "You built it. Nobody came." },
//       { "text": "Type acme check, and it finds the fixes:", "beat": 0 },
//       { "text": "titles, images.", "beat": [1, 2] },
//       { "text": "Free to start.", "end": true }
//     ]
//   }
// A line's `at` ([start, end] seconds) pins it when the voice cannot be read
// from the pauses alone. Lines before the first beat are the hook; the `end`
// line runs under the end card. `face` ({ "x", "y", "size" }, fractions of
// the frame: the face's centre and the bubble's crop width; default 0.5,
// 0.33, 0.62) moves the bubble's crop when the face sits elsewhere.
//
// Steps: time the speech (silencedetect, fitted to the lines' lengths), cut
// to the screens between the hook and the first beat's line, retime and
// render the Screen composition, composite, and write both shapes, a contact
// sheet and the timing to --out, then copy them to the Desktop folder the
// other routines use. Needs ffmpeg and ffprobe.

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const die = (msg) => {
  console.error(`\nugc: ${msg}`);
  process.exit(1);
};
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 << 20 });
  if (r.error) die(`${cmd} could not run (${r.error.message}). Install it first${cmd.startsWith("ff") ? " (brew install ffmpeg)" : ""}.`);
  if (r.status !== 0) die(`${cmd} ${args.slice(0, 3).join(" ")}… failed:\n${(r.stderr || r.stdout || "").slice(-3000)}`);
  return r;
};
const remotion = (args) => {
  const r = spawnSync("npx", ["remotion", ...args, "--log=error"], { stdio: "inherit" });
  if (r.status !== 0) die(`remotion ${args[0]} ${args[1]} failed`);
};
const r2 = (n) => Math.round(n * 100) / 100;

// ─── Inputs ─────────────────────────────────────────────

const clip = arg("clip");
if (!clip || !existsSync(clip)) die("pass the generated clip: npm run ugc -- --clip <clip.mp4>");
const scriptPath = arg("script", "public/ugc.json");
if (!existsSync(scriptPath)) die(`no script at ${scriptPath}: write the lines the voice says (see the top of ugc.mjs)`);
const script = JSON.parse(readFileSync(scriptPath, "utf8"));
const video = JSON.parse(readFileSync("public/video.json", "utf8"));
const screen = video.screen;
if (!screen?.beats?.length) die("public/video.json has no `screen`: write its beats first (routines/video.md, The screen)");
const device = script.device ?? "laptop";
if (!["laptop", "phone"].includes(device)) die(`device is "${device}"; laptop or phone`);
const out = resolve(arg("out", "out/ugc"));
mkdirSync(out, { recursive: true });

const probe = JSON.parse(run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate:format=duration", "-of", "json", clip]).stdout);
const vs = probe.streams.find((s) => s.codec_type === "video");
if (!vs) die("the clip has no video");
if (!probe.streams.some((s) => s.codec_type === "audio")) die("the clip has no audio: the voice comes from the clip");
const [fn, fd] = vs.r_frame_rate.split("/").map(Number);
const fps = fn / (fd || 1);
const dur = Number(probe.format.duration);
if (Math.abs(vs.width / vs.height - 9 / 16) > 0.02) die(`the clip is ${vs.width}x${vs.height}; it must be 9:16`);
const W = 1080;
const H = 1920;

// ─── 1. The speech ──────────────────────────────────────

const lines = script.lines ?? [];
if (lines.length < 3) die("the script needs the hook, a line per screen beat and the end line");
const endIdx = lines.findIndex((l) => l.end);
if (endIdx !== lines.length - 1) die("mark the last line, the one under the end card, with \"end\": true");
const beatsOf = (l) => (l.beat === undefined ? [] : Array.isArray(l.beat) ? l.beat : [l.beat]);
const firstBeatLine = lines.findIndex((l) => beatsOf(l).length);
if (firstBeatLine < 1) die("the first line is the hook and has no beat; the lines after it name the beats they show");
const used = lines.flatMap(beatsOf);
for (let b = 0; b < screen.beats.length; b++) if (!used.includes(b)) die(`no line names screen beat ${b} (${screen.beats[b].kind} "${screen.beats[b].title ?? screen.beats[b].type ?? ""}")`);
if (used.some((b, i) => i && b <= used[i - 1])) die("the lines must name the beats in order, each once");
if (Math.max(...used) >= screen.beats.length) die(`a line names beat ${Math.max(...used)}; the screen has ${screen.beats.length}`);

const silences = (noise, d) => {
  const err = spawnSync("ffmpeg", ["-hide_banner", "-i", clip, "-af", `silencedetect=noise=${noise}:d=${d}`, "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const marks = [...err.matchAll(/silence_(start|end): ([\d.]+)/g)].map((m) => [m[1], Number(m[2])]);
  const speech = [];
  let from = 0;
  for (const [k, t] of marks) {
    if (k === "start" && t > from + 0.05) speech.push({ s: from, e: t });
    if (k === "end") from = t;
  }
  if (marks.at(-1)?.[0] !== "start" && dur > from + 0.05) speech.push({ s: from, e: dur });
  return speech;
};
const chars = (t = "") => t.replace(/[^\p{L}\p{N} ]/gu, "").length || 1;

/** Splits speech segments into lines: each line about as long as its words, its ends on pauses. */
const fit = (segs, group) => {
  const n = group.length;
  const m = segs.length;
  if (m < n) return null;
  const span = segs[m - 1].e - segs[0].s;
  const rate = span / group.reduce((a, l) => a + chars(l.text), 0);
  const cost = (i, j, l) => {
    const d = segs[j].e - segs[i].s;
    const want = chars(l.text) * rate;
    return ((d - want) / Math.max(want, 0.6)) ** 2 - 0.6 * ((segs[j + 1]?.s ?? segs[j].e) - segs[j].e);
  };
  // best[k][j]: lines 0..k-1 over segments 0..j-1.
  const best = Array.from({ length: n + 1 }, () => Array(m + 1).fill(Infinity));
  const from = Array.from({ length: n + 1 }, () => Array(m + 1).fill(-1));
  best[0][0] = 0;
  for (let k = 1; k <= n; k++)
    for (let j = k; j <= m - (n - k); j++)
      for (let i = k - 1; i < j; i++) {
        const c = best[k - 1][i] + cost(i, j - 1, group[k - 1]);
        if (c < best[k][j]) (best[k][j] = c), (from[k][j] = i);
      }
  const res = [];
  for (let k = n, j = m; k > 0; k--) {
    const i = from[k][j];
    res.unshift({ s: segs[i].s, e: segs[j - 1].e, segs: segs.slice(i, j) });
    j = i;
  }
  return res;
};

const timeLines = () => {
  for (const [noise, d] of [["-32dB", 0.12], ["-30dB", 0.08], ["-35dB", 0.06]]) {
    const segs = silences(noise, d);
    const times = new Array(lines.length);
    lines.forEach((l, i) => l.at && (times[i] = { s: l.at[0], e: l.at[1], segs: segs.filter((g) => g.s < l.at[1] && g.e > l.at[0]) }));
    // Fit each run of unpinned lines into the speech between the pinned ones.
    let ok = true;
    for (let i = 0; i < lines.length; ) {
      if (times[i]) {
        i++;
        continue;
      }
      let j = i;
      while (j < lines.length && !times[j]) j++;
      const lo = i ? times[i - 1].e : 0;
      const hi = j < lines.length ? times[j].s : dur;
      const got = fit(segs.filter((g) => g.s >= lo - 0.01 && g.e <= hi + 0.01), lines.slice(i, j));
      if (!got) {
        ok = false;
        break;
      }
      got.forEach((t, k) => (times[i + k] = t));
      i = j;
    }
    if (ok) return times;
  }
  die('the pauses in the voice do not separate the lines; give each line its "at": [start, end] in seconds');
};
const times = timeLines();
lines.forEach((l, i) => console.log(`  ${r2(times[i].s).toFixed(2)}-${r2(times[i].e).toFixed(2)}  ${l.end ? "[end] " : beatsOf(l).length ? `[beat ${beatsOf(l).join(",")}] ` : "[hook] "}${l.text ?? ""}`));
// The cut to the screens: in the pause between the hook and the first beat's line.
const cut = r2(Math.max(1, (times[firstBeatLine - 1].e + times[firstBeatLine].s) / 2));
console.log(`cut: ${cut}s`);

// When each beat starts: as its words begin, a moment early, so the screen is there when the voice names it.
const LEAD = 0.1;
const starts = [];
lines.forEach((l, i) => {
  const bs = beatsOf(l);
  if (bs.length <= 1) return bs.length && (starts[bs[0]] = times[i].s);
  // One line over several beats: its own pauses split it, or its words.
  let parts = times[i].segs;
  while (parts.length > bs.length) {
    let g = 0;
    for (let k = 1; k < parts.length - 1; k++) if (parts[k + 1].s - parts[k].e < parts[g + 1].s - parts[g].e) g = k;
    parts = [...parts.slice(0, g), { s: parts[g].s, e: parts[g + 1].e }, ...parts.slice(g + 2)];
  }
  if (parts.length === bs.length) bs.forEach((b, k) => (starts[b] = parts[k].s));
  else {
    const words = (l.text ?? "").split(/(?<=[,.;:])\s+/);
    const total = words.reduce((a, w) => a + chars(w), 0);
    let acc = 0;
    bs.forEach((b, k) => {
      starts[b] = times[i].s + (times[i].e - times[i].s) * (acc / total);
      acc += chars(words[k] ?? "");
    });
  }
});
const endAt = times[endIdx].s - 0.2;
const bounds = starts.map((s, b) => (b === 0 ? cut : s - LEAD));
const seconds = bounds.map((s, b) => r2((b + 1 < bounds.length ? bounds[b + 1] : endAt) - s));
seconds.forEach((s, b) => s < 0.4 && die(`screen beat ${b} gets ${s}s; under 0.4s nobody reads it. Give it more words or merge it`));
// The beats fill the device shot exactly: the last one takes the rounding.
seconds[seconds.length - 1] = r2(endAt - cut - seconds.slice(0, -1).reduce((a, s) => a + s, 0));
console.log(`beats: ${seconds.join(" + ")} = ${r2(endAt - cut)}s, end card from ${r2(endAt)}s`);

// ─── Renders from the kit ───────────────────────────────

const props = (name, value) => {
  const p = join(out, `${name}.json`);
  writeFileSync(p, JSON.stringify(value));
  return p;
};
const screenFile = join(out, "screen.mp4");
remotion(["render", device === "phone" ? "Screen-phone" : "Screen", screenFile, "--codec=h264", "--crf=14", `--props=${props("screen-props", { device, seconds })}`]);
const endSeconds = r2(dur - endAt);
const SHAPES = [
  { name: "vertical", w: 1080, h: 1920 },
  { name: "portrait", w: 1080, h: 1350 },
];
for (const s of SHAPES) remotion(["render", "End", join(out, `end-${s.name}.mp4`), "--codec=h264", "--crf=16", `--props=${props(`end-${s.name}-props`, { w: s.w, h: s.h, seconds: endSeconds + 0.2 })}`]);

// ─── 2. The composite ───────────────────────────────────

const shot = r2(endAt - cut);
const tail = r2(dur - endAt);
// The face's square in the 1080x1920 selfie, for the bubble.
const face = { x: 0.5, y: 0.33, size: 0.62, ...(script.face ?? {}) };
const fs = Math.round(W * face.size);
const fx = Math.round(Math.min(W - fs, Math.max(0, W * face.x - fs / 2)));
const fy = Math.round(Math.min(H - fs, Math.max(0, H * face.y - fs / 2)));
// 4:5 keeps the face on the hook.
const presenterY = Math.round((H - 1350) * (script.presenterCrop ?? 0.3));
const SCREEN_SIZE = device === "phone" ? { w: 1170, h: 2532 } : { w: 1600, h: 1000 };
const even = (n) => Math.round(n / 2) * 2;

/** Where the screen and the bubble sit in a shape: the screen big, the bubble bottom left above the platform's own buttons. */
const layout = (s) => {
  const safe = s.h === 1920 ? 230 : 70;
  if (device === "phone") {
    const sh = even(s.h - 2 * safe);
    const sw = even((sh * SCREEN_SIZE.w) / SCREEN_SIZE.h);
    const d = even(Math.min(s.w * 0.36, s.w - sw - 40 + sw * 0.35));
    return { sw, sh, sx: s.w - sw - 50, sy: safe, d, bx: 40, by: s.h - safe - d };
  }
  const sw = even(s.w - 80);
  const sh = even((sw * SCREEN_SIZE.h) / SCREEN_SIZE.w);
  const d = even(s.w * (s.h === 1920 ? 0.37 : 0.3));
  const by = s.h - safe - d - 10;
  const sy = Math.max(safe, Math.round(Math.min((s.h - sh) / 2 - s.h * 0.08, by - 40 - sh)));
  return { sw, sh, sx: 40, sy, d, bx: 44, by };
};

/** A white circle on transparent, d across: the bubble's mask, and its ring. */
const circle = (file, d) => run("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", `color=c=white:s=${d}x${d}`, "-vf", `format=rgba,geq=r=255:g=255:b=255:a='255*lt(hypot(X-${d / 2},Y-${d / 2}),${d / 2 - 1})'`, "-frames:v", "1", file]);

const made = [];
for (const s of SHAPES) {
  const L = layout(s);
  const RING = 10;
  const mask = join(out, `mask-${s.name}.png`);
  const ring = join(out, `ring-${s.name}.png`);
  circle(mask, L.d);
  circle(ring, L.d + 2 * RING);
  const crop = s.h === H ? "" : `,crop=${W}:${s.h}:0:${presenterY}`;
  const graph = [
    `[0:v]fps=30,scale=${W}:${H}:flags=lanczos,setsar=1,split[c1][c2]`,
    `[c1]trim=0:${cut},setpts=PTS-STARTPTS${crop},format=yuv420p[pre]`,
    // The bubble: the face cropped square from the same take, so the lips stay in sync with the voice.
    `[c2]trim=${cut},setpts=PTS-STARTPTS,crop=${fs}:${fs}:${fx}:${fy},scale=${L.d}:${L.d}:flags=lanczos,format=rgba[f0]`,
    `[3:v]format=rgba,alphaextract,scale=${L.d}:${L.d}[m]`,
    `[f0][m]alphamerge[face]`,
    // The screens on a dark ground, then the end card, under the bubble.
    `color=c=0x111111:s=${s.w}x${s.h}:r=30:d=${shot},format=yuv420p[bg]`,
    `[1:v]fps=30,scale=${L.sw}:${L.sh}:flags=lanczos,setsar=1,trim=0:${shot},setpts=PTS-STARTPTS[scr]`,
    `[bg][scr]overlay=${L.sx}:${L.sy}:eof_action=repeat,format=yuv420p[mid]`,
    `[2:v]fps=30,scale=${s.w}:${s.h},setsar=1,format=yuv420p,trim=0:${tail},setpts=PTS-STARTPTS[end]`,
    `[mid][end]concat=n=2:v=1:a=0[body]`,
    `[body][4:v]overlay=${L.bx - RING}:${L.by - RING}[ringed]`,
    `[ringed][face]overlay=${L.bx}:${L.by}:eof_action=pass,format=yuv420p[post]`,
    `[pre][post]concat=n=2:v=1:a=0,noise=alls=3:allf=t,tpad=stop_mode=clone:stop_duration=0.5[v]`,
    `[0:a]aresample=48000,apad[a]`,
  ].join(";");
  const file = join(out, `ugc-video-${s.name}.mp4`);
  run("ffmpeg", ["-v", "error", "-y", "-i", clip, "-i", screenFile, "-i", join(out, `end-${s.name}.mp4`), "-loop", "1", "-i", mask, "-loop", "1", "-i", ring, "-filter_complex", graph, "-map", "[v]", "-map", "[a]", "-t", dur.toFixed(3), "-c:v", "libx264", "-crf", "17", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", file]);
  made.push(file);
  // ─── 5. The contact sheet: a frame every half second. ──
  const sheet = join(out, `ugc-sheet-${s.name}.png`);
  const cells = Math.ceil(dur * 2);
  run("ffmpeg", ["-v", "error", "-y", "-i", file, "-vf", `fps=2,scale=270:-1,tile=8x${Math.ceil(cells / 8)}`, "-frames:v", "1", sheet]);
  made.push(sheet);
}
writeFileSync(join(out, "ugc-timing.json"), JSON.stringify({ clip: resolve(clip), device, cut, lines: lines.map((l, i) => ({ text: l.text, s: r2(times[i].s), e: r2(times[i].e) })), seconds, endAt: r2(endAt), face }, null, 2));

const slug = String(video.product ?? "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "product";
const desktop = join(homedir(), "Desktop");
const dest = arg("desktop") ?? (existsSync(desktop) ? join(desktop, `${slug}-ads-${new Date().toISOString().slice(0, 10)}`) : null);
if (dest) {
  mkdirSync(dest, { recursive: true });
  for (const f of made) copyFileSync(f, join(dest, f.split("/").pop()));
}
console.log(`\nThe ad is in ${dest ?? out}:\n${made.map((f) => `  ${f.split("/").pop()}`).join("\n")}\nLook at both sheets before anyone sees it: the face whole and centred in the bubble, the screen readable, the end card under the last line.`);

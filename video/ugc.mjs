// Finishes an AI-presenter clip (the ugc move, routines/video.md "The AI
// presenter ad") into the ad: the product's real screen on the clip's green
// screen, timed to the voice, the AI label on every presenter shot, the kit's
// end card under the last line, in 9:16 and 4:5.
//
//   npm run ugc -- --clip <clip.mp4> [--script public/ugc.json] [--out out/ugc] [--desktop <dir>]
//
// The clip is one generated take, 9:16: a selfie hook, then a hard cut to a
// device shot (a laptop, or a phone in hand) whose screen is solid green,
// the camera still, with the presenter's own voice all the way through.
// The script (public/ugc.json) says what the voice says, line by line, and
// which of the Screen beats (video.json `screen`) each line is about:
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
// line runs under the end card.
//
// Steps: find the cut (the first frame with the green screen), time the
// speech (silencedetect, fitted to the lines' lengths), retime and render the
// Screen composition, find the green corners across the device shot (tracked
// if they move, refused if they move a lot or vanish), composite, and write
// both shapes, a contact sheet and the timing to --out, then copy them to the
// Desktop folder the other routines use. Needs ffmpeg and ffprobe.

import { spawn, spawnSync } from "node:child_process";
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

/** Streams the clip's frames as raw RGB at w x h, calling each(frame index, pixels). */
const frames = (w, h, vf, each) =>
  new Promise((done, fail) => {
    const p = spawn("ffmpeg", ["-v", "error", "-i", clip, "-vf", `${vf ? `${vf},` : ""}scale=${w}:${h}:flags=bilinear`, "-fps_mode", "passthrough", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
    const size = w * h * 3;
    let buf = Buffer.alloc(0);
    let n = 0;
    p.stdout.on("data", (d) => {
      buf = Buffer.concat([buf, d]);
      while (buf.length >= size) {
        each(n++, buf.subarray(0, size));
        buf = buf.subarray(size);
      }
    });
    p.on("error", fail);
    p.on("close", (code) => (code === 0 ? done(n) : fail(new Error(`ffmpeg exited ${code}`))));
  });

const green = (px, k) => px[k + 1] > 150 && px[k + 1] > px[k] + 60 && px[k + 1] > px[k + 2] + 60;

// ─── 1. The cut ─────────────────────────────────────────

const LW = 72;
const LH = 128;
const frac = [];
await frames(LW, LH, "", (n, px) => {
  let g = 0;
  for (let k = 0; k < px.length; k += 3) if (green(px, k)) g++;
  frac[n] = g / (LW * LH);
});
const ON = 0.02;
const cutFrame = frac.findIndex((f, i) => f > ON && frac.slice(i, i + 4).every((v) => v > ON));
if (cutFrame < 0) die("no green screen found in the clip: the device shot's screen must be solid green");
if (cutFrame < fps) die(`the green screen is there from ${r2(cutFrame / fps)}s: the clip must open on the presenter, then cut to the device`);
const cut = cutFrame / fps;
console.log(`cut: ${r2(cut)}s (frame ${cutFrame})`);

// ─── 2. The speech ──────────────────────────────────────

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
if (times[firstBeatLine].s < cut - 0.3) die(`the line "${lines[firstBeatLine].text}" starts at ${r2(times[firstBeatLine].s)}s, before the cut at ${r2(cut)}s: the hook must end before the device shot`);

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

// ─── 3. The corners ─────────────────────────────────────

/** The four corners of the green screen in one 1080x1920 frame, TL TR BL BR, or null. */
const corners = (px) => {
  let bx0 = W, by0 = H, bx1 = -1, by1 = -1;
  for (let y = 0; y < H; y += 8)
    for (let x = 0; x < W; x += 8)
      if (green(px, (y * W + x) * 3)) (bx0 = Math.min(bx0, x)), (by0 = Math.min(by0, y)), (bx1 = Math.max(bx1, x)), (by1 = Math.max(by1, y));
  if (bx1 < 0 || (bx1 - bx0) * (by1 - by0) < 0.01 * W * H) return null;
  const best = [Infinity, Infinity, Infinity, Infinity];
  const pts = [null, null, null, null];
  for (let y = Math.max(0, by0 - 10); y < Math.min(H, by1 + 10); y++)
    for (let x = Math.max(0, bx0 - 10); x < Math.min(W, bx1 + 10); x++) {
      if (!green(px, (y * W + x) * 3)) continue;
      const sc = [x + y, -x + y, x - y, -x - y];
      for (let c = 0; c < 4; c++) if (sc[c] < best[c]) (best[c] = sc[c]), (pts[c] = [x, y]);
    }
  return pts;
};
const shotStart = cutFrame + 2;
const shotEnd = Math.min(frac.length - 2, Math.floor(endAt * fps));
const STEP = 2;
const samples = [];
await frames(W, H, `select='between(n,${shotStart},${shotEnd})*not(mod(n-${shotStart},${STEP}))'`, (k, px) => samples.push({ n: shotStart + k * STEP, c: corners(px) }));
const lost = samples.filter((s) => !s.c);
if (lost.length) die(`the green screen is not whole at ${lost.map((s) => `${r2(s.n / fps)}s`).slice(0, 5).join(", ")}: something covers it or the screen leaves the frame. Make the clip again with the device's screen in full view`);
const median = (v) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];
const still = [0, 1, 2, 3].map((c) => [median(samples.map((s) => s.c[c][0])), median(samples.map((s) => s.c[c][1]))]);
const drift = Math.max(...samples.flatMap((s) => s.c.map((p, c) => Math.hypot(p[0] - still[c][0], p[1] - still[c][1]))));
if (drift > 60) die(`the screen moves ${Math.round(drift)}px during the device shot: the camera must be still. Make the clip again`);
const tracked = drift > 4;
console.log(`corners: ${still.map((p) => p.join(",")).join("  ")}  (moves ${r2(drift)}px${tracked ? ", tracked per frame" : ""})`);

// Pushed 8px out from the screen's middle, so no green edge is left.
const cx = still.reduce((a, p) => a + p[0], 0) / 4;
const cy = still.reduce((a, p) => a + p[1], 0) / 4;
const grow = (p) => [p[0] + (p[0] < cx ? -8 : 8), p[1] + (p[1] < cy ? -8 : 8)];
const NAMES = ["0", "1", "2", "3"];
let quad;
if (!tracked) quad = still.map(grow).flatMap((p, c) => [`x${NAMES[c]}=${p[0]}`, `y${NAMES[c]}=${p[1]}`]).join(":");
else {
  // Keyframes at each sample, linear between, as a per-frame expression of the screen's own frame count (30 fps from the cut).
  const keys = samples.map((s) => ({ f: Math.max(0, (s.n / fps - cut) * 30), c: s.c.map(grow) }));
  const expr = (c, axis) => {
    let e = String(keys.at(-1).c[c][axis]);
    for (let k = keys.length - 2; k >= 0; k--) {
      const a = keys[k];
      const b = keys[k + 1];
      const va = a.c[c][axis];
      const vb = b.c[c][axis];
      e = `if(lt(in,${b.f.toFixed(2)}),${va}+(${vb - va})*(in-${a.f.toFixed(2)})/${(b.f - a.f).toFixed(2)},${e})`;
    }
    return `if(lt(in,${keys[0].f.toFixed(2)}),${keys[0].c[c][axis]},${e})`;
  };
  quad = [0, 1, 2, 3].flatMap((c) => [`x${c}='${expr(c, 0)}'`, `y${c}='${expr(c, 1)}'`]).join(":") + ":eval=frame";
}

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
const labelFile = join(out, "label.png");
remotion(["still", "Label", labelFile, `--props=${props("label-props", { text: script.label ?? "AI-generated presenter" })}`]);

// ─── 4. The composite ───────────────────────────────────

const shot = r2(endAt - cut);
// 4:5 keeps the face on the presenter shot and the device on the device shot.
const presenterY = Math.round((H - 1350) * (script.presenterCrop ?? 0.3));
const deviceY = Math.round(Math.min(H - 1350, Math.max(0, cy - 1350 / 2 + 80)));
const made = [];
for (const s of SHAPES) {
  const crop = s.h === H ? "" : `,crop=${W}:${s.h}:0:'if(lt(t,${cut.toFixed(3)}),${presenterY},${deviceY})'`;
  const graph = [
    `[0:v]fps=30,scale=${W}:${H}:flags=lanczos,unsharp=5:5:0.45:5:5:0,setsar=1,split[c1][c2]`,
    `[c1]trim=0:${cut.toFixed(3)},setpts=PTS-STARTPTS,format=yuv420p[pre]`,
    `[c2]trim=${cut.toFixed(3)}:${endAt.toFixed(3)},setpts=PTS-STARTPTS,format=rgba[bg]`,
    // The screen: a transparent 4px pad, so its edges come out soft; onto the quad; a touch soft and dark, like a lit display filmed.
    `[1:v]fps=30,scale=${W - 8}:${H - 8}:flags=lanczos,setsar=1,format=rgba,pad=${W}:${H}:4:4:color=0x00000000,perspective=${quad}:sense=destination,gblur=sigma=0.9,eq=brightness=-0.03:saturation=0.94,split[sharp][g0]`,
    `[g0]gblur=sigma=18,colorchannelmixer=aa=0.35[glow]`,
    `[bg][glow]overlay=0:0[b1]`,
    `[b1][sharp]overlay=0:0,format=yuv420p,trim=0:${shot},setpts=PTS-STARTPTS[dev]`,
    `[pre][dev]concat=n=2:v=1:a=0,noise=alls=5:allf=t${crop}[body]`,
    `[body][3:v]overlay=36:48,setsar=1[lab]`,
    `[2:v]fps=30,scale=${W}:${s.h},setsar=1,format=yuv420p,trim=0:${endSeconds},setpts=PTS-STARTPTS[end]`,
    `[lab][end]concat=n=2:v=1:a=0,tpad=stop_mode=clone:stop_duration=0.5[v]`,
    `[0:a]aresample=48000,apad[a]`,
  ].join(";");
  const file = join(out, `ugc-video-${s.name}.mp4`);
  run("ffmpeg", ["-v", "error", "-y", "-i", clip, "-i", screenFile, "-i", join(out, `end-${s.name}.mp4`), "-i", labelFile, "-filter_complex", graph, "-map", "[v]", "-map", "[a]", "-t", dur.toFixed(3), "-c:v", "libx264", "-crf", "17", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", file]);
  made.push(file);
  // ─── 5. The contact sheet: a frame every half second. ──
  const sheet = join(out, `ugc-sheet-${s.name}.png`);
  const cells = Math.ceil(dur * 2);
  run("ffmpeg", ["-v", "error", "-y", "-i", file, "-vf", `fps=2,scale=270:-1,tile=8x${Math.ceil(cells / 8)}`, "-frames:v", "1", sheet]);
  made.push(sheet);
}
writeFileSync(join(out, "ugc-timing.json"), JSON.stringify({ clip: resolve(clip), device, cut: r2(cut), lines: lines.map((l, i) => ({ text: l.text, s: r2(times[i].s), e: r2(times[i].e) })), seconds, endAt: r2(endAt), corners: still, drift: r2(drift), tracked }, null, 2));

const slug = String(video.product ?? "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "product";
const desktop = join(homedir(), "Desktop");
const dest = arg("desktop") ?? (existsSync(desktop) ? join(desktop, `${slug}-ads-${new Date().toISOString().slice(0, 10)}`) : null);
if (dest) {
  mkdirSync(dest, { recursive: true });
  for (const f of made) copyFileSync(f, join(dest, f.split("/").pop()));
}
console.log(`\nThe ad is in ${dest ?? out}:\n${made.map((f) => `  ${f.split("/").pop()}`).join("\n")}\nLook at both sheets before anyone sees it: the screen on the device with no green edge, readable, the label on every presenter shot, the end card under the last line.`);

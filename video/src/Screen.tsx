import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import video from "../public/video.json";
import { B, C, FPS, FontsReady, Logo, fonts, headingWeight, sec, settle } from "./kit";

// Screen: only the product's screen, for compositing onto a laptop (1600x1000,
// 16:10) or a phone (1170x2532) in a generated scene. No captions, no
// background around a card: the product fills the display edge to edge, a
// maximised browser window or terminal, and is used the way a person uses it:
// a command typed in, results streaming back, a cursor that travels and
// clicks, rows sliding in, states flipping, the page scrolling.
//
// Everything on it comes from video.json's `screen` block (see
// routines/video.md, "The screen"): a list of beats, each one screen state
// held for `seconds`. The seconds are props, so the cut can be retimed to a
// voiceover without touching video.json:
//   npx remotion render Screen out/screen.mp4 --props='{"seconds":[3.9,1.2,1.0,1.2,4.1]}'
//
// No CSS animation, no timers, no randomness: every pixel is a function of the
// frame (routines/video.md step 6), and every position is computed, never
// measured from the page, so the cursor lands on the same pixel in every tab.

// ─── The spec ───────────────────────────────────────────

/** A line the terminal prints. Exactly one of say, tool, out, text or choice. */
export interface TermLine {
  /** The agent speaking: "⏺ text", typed out. */
  say?: string;
  /** A tool call: "⏺ name(arg)", or "⏺ name - arg (tag)" when it has a tag. */
  tool?: string;
  arg?: string;
  tag?: string;
  /** A tool's result, under it: "⎿ text", streamed in. */
  out?: string;
  /** A plain line (a shell's output). */
  text?: string;
  /** A choice offered to the user, selected: "❯ choice note". */
  choice?: string;
  note?: string;
  tone?: "ok" | "hl" | "dim" | "accent";
  /** Seconds into the beat; default, right after the line before it. */
  at?: number;
  /** Lit up once it is in: the line the beat is about. */
  focus?: boolean;
}

export interface TerminalBeat {
  kind: "terminal";
  seconds: number;
  /** What the user types and sends, e.g. "/acme:check". */
  type?: string;
  /** Seconds into the beat the typing starts (default 0.3). */
  typeAt?: number;
  lines?: TermLine[];
}

/** A state badge: `from` until `at`, then `to` with a pulse. Only `to`: done from the start. Only `from`: pending. */
export interface Badge {
  from?: string;
  to?: string;
  at?: number;
}

export interface PageItem {
  /** The small uppercase line above the title. */
  eyebrow?: string;
  title: string;
  meta?: string;
  /** Replaces `meta` once the badge is done. */
  metaDone?: string;
  /** A quoted block under the title, two lines at most. */
  body?: string;
  /** Seconds into the beat the body starts typing itself in (a draft being written); default, already there. */
  typed?: number;
  /** Buttons under it; the first is the primary one. */
  buttons?: string[];
  badge?: Badge;
  /** A row of steps; each is reached at its `at` (0: already), never without one. */
  steps?: { label: string; at?: number }[];
  /** Seconds into the beat the row slides in, pushing the rows under it down; default, already there. */
  at?: number;
}

export interface PageBeat {
  kind: "page";
  seconds: number;
  /** The sidebar item this page is under. A different one from the page before is clicked to get here. */
  nav?: string;
  /** The URL path shown in the address bar. */
  path?: string;
  title: string;
  sub?: string;
  /** A row of filter chips; `chip` is the one on. A different one from the page before is clicked to get here. */
  chips?: string[];
  chip?: string;
  items: PageItem[];
  /** A click on a button or chip by its label, `at` seconds in; `then` relabels the button ("Copied"). */
  click?: { target: string; at: number; then?: string };
  /** Smooth scrolls: at `at` seconds, scroll to `y` pixels down. */
  scroll?: { at: number; y: number }[];
}

export type Beat = TerminalBeat | PageBeat;

export interface Theme {
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  ink: string;
  ink2: string;
  muted: string;
  line: string;
  lineStrong: string;
  good: string;
  /** A done state: the badge's fill and the reached steps. */
  done: string;
  doneFg: string;
  doneText: string;
  doneSoft: string;
  doneLine: string;
  pending: string;
  pendingLine: string;
  chrome: string;
  desk: string;
  termBg: string;
  termBar: string;
  termLine: string;
  termFg: string;
  termDim: string;
  termHl: string;
  termAccent: string;
  termOk: string;
}

export interface ScreenSpec {
  /** The product's colors on its own screens (its CSS tokens); unset ones come from the brand. */
  theme?: Partial<Theme>;
  /** The web app the page beats are in: its host, its sidebar, the workspace shown in it. */
  app?: { host?: string; nav?: string[]; workspace?: string };
  /** The terminal: its title bar, and "agent" (an input box at the bottom, like Claude Code) or "shell" ($ prompt). */
  terminal?: { title?: string; style?: "agent" | "shell"; hint?: string; banner?: string[] };
  beats: Beat[];
}

export type Device = "laptop" | "phone";
export interface ScreenProps {
  device: Device;
  /** Each beat's seconds, in order: the retiming. Default, each beat's own. */
  seconds?: number[];
}

export const SCREEN = (video as { screen?: ScreenSpec }).screen;
const PRODUCT = (video as { product?: string }).product ?? "";
export const SCREEN_SIZES = { laptop: { w: 1600, h: 1000 }, phone: { w: 1170, h: 2532 } } as const;

const startsOf = (secs: number[]) => {
  const out = [0];
  let t = 0;
  for (const s of secs) out.push(Math.round((t += s) * FPS));
  return out;
};
export const screenFrames = (secs: number[]) => {
  if (!SCREEN) return 1;
  if (secs.length !== SCREEN.beats.length) throw new Error(`Screen: ${secs.length} seconds for ${SCREEN.beats.length} beats in video.json's screen`);
  return Math.max(1, startsOf(secs)[secs.length]!);
};
export const defaultSeconds = () => (SCREEN?.beats ?? []).map((b) => b.seconds);

// ─── Helpers ────────────────────────────────────────────

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeIO = Easing.bezier(0.45, 0, 0.2, 1);
const lerp = (f: number, a: number, b: number, from = 0, to = 1, easing = easeIO) => (a >= b ? (f >= b ? to : from) : interpolate(f, [a, b], [from, to], { ...clamp, easing }));
const mix = (a: string, b: string, pa: number) => `color-mix(in srgb, ${a} ${pa}%, ${b})`;
/** 0 before `at`, 1 a few frames after, smooth and exact at both ends. */
const enter = (f: number, at: number, frames = 10) => settle(f - at, FPS, { damping: 200 }, frames);
/** A deterministic 0..1 per index, for a human typing rhythm. */
const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const themeOf = (t: Partial<Theme> = {}): Theme => {
  const bg = t.bg ?? C.bg;
  const ink = t.ink ?? C.fg;
  const done = t.done ?? C.accent;
  const muted = t.muted ?? mix(ink, bg, 55);
  const lineStrong = t.lineStrong ?? mix(ink, bg, 22);
  return {
    bg,
    ink,
    muted,
    lineStrong,
    done,
    surface: mix(bg, ink, 98),
    surface2: mix(bg, ink, 94),
    surface3: mix(bg, ink, 90),
    ink2: mix(ink, bg, 78),
    line: mix(ink, bg, 12),
    good: "#15803d",
    doneFg: C.accentFg,
    doneText: done,
    doneSoft: mix(done, "transparent", 9),
    doneLine: mix(done, "transparent", 35),
    pending: muted,
    pendingLine: lineStrong,
    chrome: mix(bg, ink, 92),
    desk: "#1a1a1c",
    termBg: "#0c0d0c",
    termBar: "#161715",
    termLine: "#262825",
    termFg: "#d9dbd4",
    termDim: "#80837c",
    termHl: "#f2efe2",
    termAccent: "#c9a46b",
    termOk: "#7fb58a",
    ...t,
  };
};

let measure: CanvasRenderingContext2D | null = null;
const widths = new Map<string, number>();
/** A label's width in its font: positions are computed from it, never measured from the page. Called only once the fonts are in (FontsReady). */
const textW = (text: string, font: string) => {
  const key = `${font}|${text}`;
  const hit = widths.get(key);
  if (hit !== undefined) return hit;
  measure ??= document.createElement("canvas").getContext("2d");
  if (!measure) return text.length * 11;
  measure.font = font;
  const w = Math.ceil(measure.measureText(text).width);
  widths.set(key, w);
  return w;
};

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
const inside = (p: { x: number; y: number } | null, r: Rect) => Boolean(p && p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h);
const centre = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

// ─── Geometry ───────────────────────────────────────────
// Everything is laid out in logical pixels: the laptop's 1600x1000 as is, the
// phone's 1170x2532 at 1.5x (780x1688), so text has the same size on both.

interface Geo {
  phone: boolean;
  W: number;
  H: number;
  k: number;
  /** The top of the window under the status bar (phone) or at 0. */
  top: number;
  /** The browser's own bar: on top on the laptop, at the bottom on the phone. */
  barH: number;
  content: Rect;
  padX: number;
  padTop: number;
  titleSize: number;
}

const geoOf = (device: Device): Geo => {
  if (device === "phone") {
    const W = 780;
    const H = 1688;
    const top = 54;
    const appBar = 132;
    const barH = 92;
    return { phone: true, W, H, k: 1.5, top, barH, content: { x: 0, y: top + appBar, w: W, h: H - top - appBar - barH }, padX: 22, padTop: 26, titleSize: 36 };
  }
  // 1280x800 at 1.25x: the app at 125% zoom, so it still reads once the display is small in the frame.
  const W = 1280;
  const H = 800;
  const barH = 60;
  const side = 256;
  return { phone: false, W, H, k: 1.25, top: 0, barH, content: { x: side, y: barH, w: W - side, h: H - barH }, padX: 40, padTop: 30, titleSize: 40 };
};

const NAV_FONT = (g: Geo) => `${g.phone ? 400 : 400} ${g.phone ? 20 : 21}px ${fonts.body}`;

/** The app's navigation: a sidebar on the laptop, a row of tabs under the app's bar on the phone. */
const navRects = (nav: string[], g: Geo): (Rect & { label: string; textX: number })[] => {
  if (g.phone) {
    let x = 16;
    return nav.map((label) => {
      const w = textW(label, NAV_FONT(g)) + 28;
      const r = { label, x, y: g.top + 72, w, h: 46, textX: x + 14 };
      x += w + 6;
      return r;
    });
  }
  const top = g.barH + 148;
  return nav.map((label, i) => ({ label, x: 12, y: top + i * 48, w: 232, h: 44, textX: 30 }));
};

// Page rows: every height is fixed (titles stay on one line, a body is two),
// so where a button sits is known before anything is drawn.
const ITEM = { pad: 22, padX: 26, eyebrow: 24, title: 34, meta: 28, bodyLine: 34, button: 46, step: 36, gap: 14 };
const itemH = (it: PageItem) =>
  ITEM.pad * 2 +
  (it.eyebrow ? ITEM.eyebrow + 6 : 0) +
  ITEM.title +
  (it.meta || it.metaDone ? 4 + ITEM.meta : 0) +
  (it.body ? 16 + ITEM.bodyLine * 2 + 28 : 0) +
  (it.buttons?.length ? 18 + ITEM.button : 0) +
  (it.steps?.length ? 18 + ITEM.step : 0);

const BUTTON_FONT = `500 21px ${fonts.body}`;
const CHIP_FONT = `400 20px ${fonts.body}`;
const STEP_FONT = `500 17px ${fonts.mono}`;

interface PageLayout {
  headerH: number;
  chips: (Rect & { label: string })[];
  itemsTop: number;
  heights: number[];
  /** A button's rect inside its row, from the row's top-left. */
  buttons: (Rect & { label: string })[][];
}

const pageLayout = (b: PageBeat, g: Geo): PageLayout => {
  const titleLH = Math.round(g.titleSize * 1.2);
  const headerH = g.padTop + titleLH + (b.sub ? 8 + 32 : 0) + 22;
  const chipsY = headerH + 22;
  let x = g.padX;
  const chips = (b.chips ?? []).map((label) => {
    const w = textW(label, CHIP_FONT) + 34;
    const r = { label, x, y: chipsY, w, h: 42 };
    x += w + 10;
    return r;
  });
  const itemsTop = chips.length ? chipsY + 42 + 26 : headerH + 28;
  const buttons = b.items.map((it) => {
    let by = ITEM.pad + (it.eyebrow ? ITEM.eyebrow + 6 : 0) + ITEM.title + (it.meta || it.metaDone ? 4 + ITEM.meta : 0) + (it.body ? 16 + ITEM.bodyLine * 2 + 28 : 0) + 18;
    let bx = ITEM.padX;
    return (it.buttons ?? []).map((label) => {
      // Wide enough for the label a click turns it into ("Copied") too.
      const then = b.click?.target === label && b.click.then ? textW(b.click.then, BUTTON_FONT) : 0;
      const w = Math.max(textW(label, BUTTON_FONT), then) + 44;
      const r = { label, x: bx, y: by, w, h: ITEM.button };
      bx += w + 12;
      return r;
    });
  });
  return { headerH, chips, itemsTop, heights: b.items.map(itemH), buttons };
};

/** Where each row's top is at local frame `lf`: a row sliding in pushes the rows under it down as it opens. */
const itemTops = (b: PageBeat, L: PageLayout, lf: number) => {
  let y = L.itemsTop;
  return b.items.map((it, i) => {
    const top = y;
    const p = it.at === undefined ? 1 : enter(lf, sec(it.at), 12);
    y += (L.heights[i]! + ITEM.gap) * p;
    return top;
  });
};

const scrollAt = (b: PageBeat, lf: number) => {
  let y = 0;
  for (const s of b.scroll ?? []) y = lerp(lf, sec(s.at), sec(s.at) + 18, y, s.y);
  return y;
};

// ─── The cursor's path ──────────────────────────────────

interface Track {
  keys: { f: number; x: number; y: number }[];
  clicks: { f: number; label: string }[];
  shown: [number, number][];
}

const trackOf = (spec: ScreenSpec, beats: Beat[], starts: number[], layouts: (PageLayout | null)[], g: Geo): Track => {
  const nav = navRects(spec.app?.nav ?? [], g);
  const keys: Track["keys"] = [];
  const clicks: Track["clicks"] = [];
  const shown: [number, number][] = [];
  let pos: { x: number; y: number } | null = null;
  const rest = g.phone ? { x: g.W * 0.7, y: g.H * 0.7 } : { x: g.content.x + g.content.w * 0.62, y: g.content.y + g.content.h * 0.62 };

  /** A button or chip of beat i, by label, on screen at frame f. */
  const find = (i: number, label: string, f: number): Rect | null => {
    const b = beats[i] as PageBeat;
    const L = layouts[i]!;
    const lf = f - starts[i]!;
    const dy = g.content.y - scrollAt(b, lf);
    const tops = itemTops(b, L, lf);
    for (let k = 0; k < b.items.length; k++) {
      const r = L.buttons[k]!.find((r) => r.label === label);
      if (r) return { x: g.content.x + g.padX + r.x, y: dy + tops[k]! + r.y, w: r.w, h: r.h };
    }
    const c = L.chips.find((c) => c.label === label);
    if (c) return { x: g.content.x + c.x, y: dy + c.y, w: c.w, h: c.h };
    const n = nav.find((n) => n.label === label);
    if (n) return { ...n, x: n.textX, w: Math.min(textW(label, NAV_FONT(g)), n.w - 20) };
    return null;
  };

  const moveTo = (t: number, r: Rect) => {
    const to = centre(r);
    const last = keys[keys.length - 1]!.f;
    const m = Math.min(14, t - last - 1);
    if (m >= 4) keys.push({ f: t - m, ...pos! });
    keys.push({ f: Math.max(t, last + 1), ...to });
    pos = to;
  };

  beats.forEach((b, i) => {
    if (b.kind !== "page") {
      pos = null;
      return;
    }
    const s = starts[i]!;
    const e = starts[i + 1]!;
    if (!pos) {
      const appear = i > 0 ? s + 8 : s;
      pos = rest;
      keys.push({ f: appear, ...rest });
      shown.push([appear, Infinity]);
    }
    if (b.click) {
      const t = s + sec(b.click.at);
      const r = find(i, b.click.target, t);
      if (r) {
        moveTo(t, r);
        clicks.push({ f: t, label: b.click.target });
      }
    }
    const nb = beats[i + 1];
    if (nb?.kind === "page") {
      const t = e - 1;
      const label = nb.nav && nb.nav !== b.nav ? nb.nav : nb.chip && nb.chip !== b.chip && b.chips?.includes(nb.chip) ? nb.chip : null;
      const r = label ? find(i, label, t) : null;
      if (label && r) {
        moveTo(t, r);
        clicks.push({ f: t, label });
      }
    } else if (nb) shown[shown.length - 1]![1] = e - 4;
  });
  return { keys, clicks, shown };
};

const cursorAt = (t: Track, f: number) => {
  const ks = t.keys;
  if (!ks.length) return null;
  if (f <= ks[0]!.f) return { x: ks[0]!.x, y: ks[0]!.y };
  for (let j = 0; j < ks.length - 1; j++) {
    const a = ks[j]!;
    const b = ks[j + 1]!;
    if (f >= b.f) continue;
    if (a.x === b.x && a.y === b.y) return { x: a.x, y: a.y };
    // A hand's move: quick off the mark, slowing into the target, on a slight arc.
    const p = interpolate(f, [a.f, b.f], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.05, 0.15, 1) });
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const arc = Math.sin(Math.PI * p) * 0.08;
    return { x: a.x + dx * p - dy * arc, y: a.y + dy * p + dx * arc };
  }
  const z = ks[ks.length - 1]!;
  return { x: z.x, y: z.y };
};

const cursorOpacity = (t: Track, f: number) => Math.max(0, ...t.shown.map(([a, b]) => Math.min(lerp(f, a, a + 5), 1 - lerp(f, b - 5, b))));

// ─── The terminal ───────────────────────────────────────

const TERM = { size: 28, lh: 42, gap: 14 };
const lineText = (l: TermLine) => l.say ?? l.out ?? l.text ?? l.choice ?? "";
const spaced = (l: TermLine) => Boolean(l.say !== undefined || l.tool !== undefined || l.choice !== undefined);

interface TermPlan {
  chars: number[];
  submit: number;
  lines: { line: TermLine; at: number; dur: number }[];
}

const termPlan = (b: TerminalBeat): TermPlan => {
  const text = b.type ?? "";
  const chars: number[] = [];
  let t = sec(b.typeAt ?? 0.3);
  for (let i = 0; i < text.length; i++) {
    chars.push(t);
    // About 20 keys a second, unevenly, a beat longer after a separator.
    t += (FPS / 22) * (0.55 + 0.9 * jitter(i)) + (/[\s:/-]/.test(text[i]!) ? 1 : 0);
  }
  const submit = text ? Math.round(t + sec(0.15)) : 0;
  let next = text ? submit + sec(0.27) : sec(0.2);
  const lines = (b.lines ?? []).map((line) => {
    const at = line.at !== undefined ? sec(line.at) : next;
    const n = lineText(line).length;
    const dur = line.say !== undefined ? Math.ceil((n / 90) * FPS) : line.out !== undefined || line.text !== undefined ? Math.ceil((n / 150) * FPS) : 0;
    next = at + dur + sec(line.say !== undefined || line.choice !== undefined ? 0.18 : 0.15);
    return { line, at, dur };
  });
  return { chars, submit, lines };
};

const Caret: React.FC<{ color: string; bar?: boolean }> = ({ color, bar }) => (
  <span style={{ display: "inline-block", width: bar ? 3 : "0.6em", height: "1.15em", verticalAlign: "-0.22em", marginLeft: bar ? 2 : 0, background: color, opacity: 0.9 }} />
);

const SPIN = ["·", "✢", "✳", "✶", "✻", "✽", "✻", "✶", "✳", "✢"];

const TermRow: React.FC<{ line: TermLine; lf: number; at: number; dur: number; th: Theme; first: boolean }> = ({ line, lf, at, dur, th, first }) => {
  if (lf < at) return null;
  const p = enter(lf, at, 6);
  const shown = (s: string) => (dur ? s.slice(0, Math.max(1, Math.round(s.length * lerp(lf, at, at + dur, 0, 1, Easing.linear)))) : s);
  const tone = line.tone === "ok" ? th.termOk : line.tone === "hl" ? th.termHl : line.tone === "dim" ? th.termDim : line.tone === "accent" ? th.termAccent : undefined;
  const base: React.CSSProperties = { marginTop: spaced(line) && !first ? TERM.gap : 0, height: TERM.lh, whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis", opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 6}px)` };
  if (line.tool !== undefined)
    return (
      <div style={base}>
        <span style={{ color: th.termOk }}>⏺</span>{" "}
        <span style={{ fontWeight: 700, color: th.termHl }}>{line.tool}</span>
        {line.tag ? (
          <>
            <span style={{ color: th.termDim }}> - </span>
            <span style={{ color: th.termHl }}>{line.arg}</span>
            <span style={{ color: th.termDim }}> ({line.tag})</span>
          </>
        ) : (
          <>
            <span style={{ color: th.termDim }}>(</span>
            {line.arg}
            <span style={{ color: th.termDim }}>)</span>
          </>
        )}
      </div>
    );
  if (line.out !== undefined)
    return (
      <div style={{ ...base, paddingLeft: 18, color: tone ?? "rgba(217,219,212,0.85)" }}>
        <span style={{ color: th.termDim }}>⎿  </span>
        {shown(line.out)}
      </div>
    );
  if (line.choice !== undefined) {
    const lit = line.focus ? enter(lf, at + 6, 10) : 0;
    return (
      <div style={{ ...base, height: TERM.lh + 12, padding: "6px 16px", marginLeft: -16, borderRadius: 8, background: mix(th.termHl, "transparent", 8 + 6 * lit), color: th.termHl }}>
        <span style={{ color: th.termAccent }}>❯</span> {line.choice} {line.note ? <span style={{ color: th.termOk }}>{line.note}</span> : null}
      </div>
    );
  }
  if (line.say !== undefined) {
    const typing = lf < at + dur;
    // The line the beat is about lights up once it is written: a warm band that pulses once, then holds.
    const lit = line.focus ? interpolate(lf, [at + dur + 2, at + dur + 8, at + dur + 22], [0, 1, 0.55], clamp) : 0;
    return (
      <div style={{ ...base, height: TERM.lh + 8, padding: "4px 16px", marginLeft: -16, borderRadius: 8, background: mix(th.termAccent, "transparent", Math.round(22 * lit)), boxShadow: lit ? `inset 4px 0 0 ${mix(th.termAccent, "transparent", Math.round(100 * Math.min(1, lit * 1.6)))}` : undefined, color: tone ?? th.termFg }}>
        <span style={{ color: th.termFg }}>⏺</span> {shown(line.say)}
        {typing ? <Caret color={th.termDim} bar /> : null}
      </div>
    );
  }
  return <div style={{ ...base, color: tone ?? th.termFg }}>{shown(line.text ?? "")}</div>;
};

const rowH = (l: TermLine, first: boolean) => (spaced(l) && !first ? TERM.gap : 0) + TERM.lh + (l.choice !== undefined ? 12 : l.say !== undefined ? 8 : 0);

const TerminalBody: React.FC<{ b: TerminalBeat; lf: number; th: Theme; spec: ScreenSpec; viewH: number }> = ({ b, lf, th, spec, viewH }) => {
  const plan = termPlan(b);
  const agent = (spec.terminal?.style ?? "agent") === "agent";
  const typed = plan.chars.filter((c) => lf >= c).length;
  const sent = Boolean(b.type) && lf >= plan.submit;
  const firstAt = plan.lines[0]?.at ?? Infinity;
  const working = sent && lf < firstAt;
  const banner = spec.terminal?.banner ?? [];
  const bannerH = banner.length ? banner.length * 40 + 24 + 24 : 0;
  const promptH = b.type ? TERM.lh : 0;
  // Scrolls as the output fills the window, each step eased.
  let scroll = 0;
  let h = bannerH + promptH + (working ? TERM.gap + TERM.lh : 0);
  plan.lines.forEach((l, i) => {
    h += rowH(l.line, i === 0 && !b.type);
    const target = Math.max(0, h - viewH);
    scroll = lerp(lf, l.at, l.at + 6, scroll, target);
  });
  const promptText = (b.type ?? "").slice(0, typed);
  return (
    <>
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        {banner.length ? (
          <div style={{ display: "inline-block", border: `1px solid ${mix(th.termAccent, "transparent", 55)}`, borderRadius: 8, padding: "12px 24px", marginBottom: 24, fontSize: 26, lineHeight: "40px" }}>
            {banner.map((t, i) => (
              <div key={i} style={{ color: i ? th.termDim : th.termHl }}>
                {i ? null : <span style={{ color: th.termAccent }}>✻ </span>}
                {t}
              </div>
            ))}
          </div>
        ) : null}
        {b.type && (agent ? sent : true) ? (
          <div style={{ height: TERM.lh, color: th.termHl, whiteSpace: "pre" }}>
            <span style={{ color: th.termDim }}>{agent ? ">" : "$"} </span>
            {agent ? b.type : promptText}
            {!agent && !sent && lf >= (plan.chars[0] ?? 0) - 6 ? <Caret color={th.termFg} /> : null}
          </div>
        ) : null}
        {working ? (
          <div style={{ marginTop: TERM.gap, height: TERM.lh, color: th.termAccent }}>
            {SPIN[Math.floor((lf - plan.submit) / 3) % SPIN.length]} <span style={{ color: th.termDim }}>Working…</span>
          </div>
        ) : null}
        {plan.lines.map((l, i) => (
          <TermRow key={i} line={l.line} lf={lf} at={l.at} dur={l.dur} th={th} first={i === 0 && !b.type} />
        ))}
      </div>
    </>
  );
};

const Dots: React.FC<{ muted?: string }> = ({ muted }) => (
  <div style={{ display: "flex", gap: 9 }}>
    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
      <div key={c} style={{ width: 14, height: 14, borderRadius: 99, background: muted ?? c }} />
    ))}
  </div>
);

const TerminalWindow: React.FC<{ beats: { b: TerminalBeat; lf: number; o: number; dy: number }[]; th: Theme; spec: ScreenSpec; g: Geo }> = ({ beats, th, spec, g }) => {
  const agent = (spec.terminal?.style ?? "agent") === "agent";
  const titleH = 52;
  const inputH = agent ? 66 + 12 + 34 + 26 : 0;
  const padY = 34;
  const viewH = g.H - g.top - titleH - inputH - padY * 2;
  const live = beats[beats.length - 1]!;
  const plan = termPlan(live.b);
  const typed = plan.chars.filter((c) => live.lf >= c).length;
  const sent = Boolean(live.b.type) && live.lf >= plan.submit;
  const typing = Boolean(live.b.type) && !sent && live.lf >= (plan.chars[0] ?? 0) - 8;
  return (
    <div style={{ position: "absolute", left: 0, top: g.top, width: g.W, height: g.H - g.top, display: "flex", flexDirection: "column", background: th.termBg, color: th.termFg, fontFamily: fonts.mono, fontSize: TERM.size, lineHeight: `${TERM.lh}px` }}>
      <div style={{ height: titleH, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 20px", background: th.termBar, borderBottom: `1px solid ${th.termLine}`, position: "relative" }}>
        {g.phone ? null : <Dots />}
        <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: fonts.body, fontSize: 19, fontWeight: 500, color: th.termDim, lineHeight: `${titleH}px` }}>{spec.terminal?.title ?? ""}</div>
      </div>
      <div style={{ position: "relative", flex: 1, overflow: "hidden", padding: `${padY}px 44px` }}>
        {beats.map(({ b, lf, o, dy }, i) => (
          <div key={i} style={{ position: "absolute", left: 44, right: 44, top: padY, opacity: o, transform: `translateY(${dy}px)` }}>
            <TerminalBody b={b} lf={lf} th={th} spec={spec} viewH={viewH} />
          </div>
        ))}
      </div>
      {agent ? (
        <div style={{ flexShrink: 0, padding: "12px 36px 26px" }}>
          <div style={{ height: 66, display: "flex", alignItems: "center", padding: "0 20px", border: `2px solid ${typing ? mix(th.termFg, "transparent", 45) : th.termLine}`, borderRadius: 12, color: th.termHl, whiteSpace: "pre" }}>
            <span style={{ color: th.termDim }}>&gt; </span>
            {sent ? "" : (live.b.type ?? "").slice(0, typed)}
            {typing ? <Caret color={th.termFg} /> : null}
          </div>
          <div style={{ marginTop: 8, paddingLeft: 22, height: 34, fontSize: 20, lineHeight: "34px", color: th.termDim }}>{spec.terminal?.hint ?? ""}</div>
        </div>
      ) : null}
    </div>
  );
};

// ─── The web app ────────────────────────────────────────

const BadgeView: React.FC<{ badge: Badge; lf: number; th: Theme }> = ({ badge, lf, th }) => {
  const flipAt = badge.from && badge.to && badge.at !== undefined ? sec(badge.at) : badge.to && !badge.from ? -Infinity : Infinity;
  const isDone = lf >= flipAt;
  const label = isDone ? badge.to! : badge.from ?? badge.to ?? "";
  // A flip: the old state folds away, the new one pops in with a ring going out from it.
  const fold = Number.isFinite(flipAt) ? (lf < flipAt ? 1 - lerp(lf, flipAt - 4, flipAt) : settle(lf - flipAt, FPS, { damping: 11, stiffness: 220 })) : 1;
  const ring = Number.isFinite(flipAt) && lf >= flipAt && lf < flipAt + 18 ? (lf - flipAt) / 18 : -1;
  const style: React.CSSProperties = isDone
    ? { background: th.done, color: th.doneFg, border: `2px solid ${th.done}` }
    : { border: `2px dashed ${th.pendingLine}`, color: th.pending };
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {ring >= 0 ? <div style={{ position: "absolute", inset: -4, borderRadius: 8, border: `3px solid ${th.done}`, opacity: 1 - ring, transform: `scale(${1 + ring * 0.45})` }} /> : null}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 40, padding: "0 14px", borderRadius: 5, fontFamily: fonts.mono, fontSize: 17, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transform: `scaleX(${Math.max(0.02, fold)}) scale(${isDone ? 0.9 + 0.1 * fold : 1})`, ...style }}>
        <span style={{ fontSize: 16 }}>{isDone ? "✓" : "◌"}</span>
        {label}
      </div>
    </div>
  );
};

const Button: React.FC<{ r: Rect & { label: string }; primary: boolean; th: Theme; hover: boolean; press: number; label: string }> = ({ r, primary, th, hover, press, label }) => (
  <div
    style={{
      position: "absolute",
      left: r.x,
      top: r.y,
      width: r.w,
      height: r.h,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
      font: BUTTON_FONT,
      background: primary ? (hover ? mix(th.ink, th.bg, 82) : th.ink) : hover ? th.surface2 : th.surface,
      color: primary ? th.bg : th.ink,
      border: primary ? "none" : `2px solid ${th.lineStrong}`,
      transform: `scale(${1 - 0.04 * press})`,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </div>
);

const ItemView: React.FC<{ it: PageItem; lf: number; th: Theme; w: number; h: number; buttons: (Rect & { label: string })[]; hoverAt: (r: Rect) => boolean; pressOf: (label: string) => number; clicked: (label: string) => string }> = ({ it, lf, th, w, h, buttons, hoverAt, pressOf, clicked }) => {
  const flip = it.badge?.from && it.badge.to && it.badge.at !== undefined ? sec(it.badge.at) : it.badge?.to && !it.badge.from ? -Infinity : Infinity;
  const isDone = lf >= flip;
  const glow = Number.isFinite(flip) ? interpolate(lf, [flip, flip + 4, flip + 30], [0, 1, 0], clamp) : 0;
  const p = it.at === undefined ? 1 : enter(lf, sec(it.at), 12);
  const meta = isDone && it.metaDone ? it.metaDone : it.meta;
  const typedN = it.body && it.typed !== undefined ? Math.round(it.body.length * lerp(lf, sec(it.typed), sec(it.typed) + Math.ceil((it.body.length / 85) * FPS), 0, 1, Easing.linear)) : it.body?.length ?? 0;
  const typing = it.body !== undefined && it.typed !== undefined && typedN > 0 && typedN < it.body.length;
  const one: React.CSSProperties = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: w,
        height: h,
        boxSizing: "border-box",
        padding: `${ITEM.pad}px ${ITEM.padX}px`,
        background: glow ? mix(th.done, th.surface, Math.round(9 * glow)) : th.surface,
        border: `1px solid ${glow ? mix(th.done, th.line, Math.round(45 * glow)) : th.line}`,
        borderRadius: 8,
        boxShadow: "0 1px 0 rgba(13,14,12,0.04), 0 8px 24px -14px rgba(13,14,12,0.14)",
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * -16}px) scale(${0.985 + 0.015 * p})`,
        transformOrigin: "50% 0",
      }}
    >
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {it.eyebrow ? <div style={{ ...one, height: ITEM.eyebrow, marginBottom: 6, fontFamily: fonts.mono, fontSize: 16, lineHeight: `${ITEM.eyebrow}px`, letterSpacing: "0.07em", textTransform: "uppercase", color: th.muted }}>{it.eyebrow}</div> : null}
          <div style={{ ...one, height: ITEM.title, fontSize: 27, lineHeight: `${ITEM.title}px`, fontWeight: 500, color: th.ink, letterSpacing: "-0.01em" }}>{it.title}</div>
          {meta ? (
            <div style={{ ...one, marginTop: 4, height: ITEM.meta, fontFamily: fonts.mono, fontSize: 19, lineHeight: `${ITEM.meta}px`, color: isDone && it.metaDone ? th.good : th.muted }}>
              {meta}
            </div>
          ) : null}
        </div>
        {it.badge ? <BadgeView badge={it.badge} lf={lf} th={th} /> : null}
      </div>
      {it.body ? (
        <div style={{ marginTop: 16, height: ITEM.bodyLine * 2 + 28, boxSizing: "border-box", padding: "14px 18px", borderRadius: 6, background: th.bg, border: `1px solid ${th.line}`, fontSize: 22, lineHeight: `${ITEM.bodyLine}px`, color: th.ink2, overflow: "hidden" }}>
          {it.body.slice(0, typedN)}
          {typing ? <Caret color={th.ink} bar /> : null}
        </div>
      ) : null}
      {buttons.map((r, k) => (
        <Button key={r.label} r={r} primary={k === 0} th={th} hover={hoverAt(r)} press={pressOf(r.label)} label={clicked(r.label)} />
      ))}
      {it.steps?.length ? (
        <div style={{ position: "absolute", left: ITEM.padX, bottom: ITEM.pad, display: "flex", alignItems: "center", gap: 8 }}>
          {it.steps.map((s, k) => {
            const at = s.at === undefined ? Infinity : sec(s.at);
            const reached = lf >= at;
            const pop = Number.isFinite(at) && at > 0 ? settle(lf - at, FPS, { damping: 12, stiffness: 240 }) : 1;
            const lit = reached && isDone;
            return (
              <React.Fragment key={s.label}>
                {k ? <span style={{ color: th.lineStrong, fontFamily: fonts.mono, fontSize: 17 }}>›</span> : null}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    height: ITEM.step,
                    padding: "0 12px",
                    borderRadius: 5,
                    font: STEP_FONT,
                    border: `1.5px solid ${lit ? th.doneLine : reached ? th.lineStrong : th.line}`,
                    background: lit ? th.doneSoft : "transparent",
                    color: lit ? th.doneText : reached ? th.ink : th.muted,
                    transform: reached ? `scale(${0.9 + 0.1 * pop})` : undefined,
                  }}
                >
                  {reached ? <span style={{ fontWeight: 700 }}>✓</span> : <span style={{ opacity: 0.6 }}>○</span>}
                  {s.label}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

interface Pointer {
  pos: { x: number; y: number } | null;
  /** Frames since the last click on a label (to press it), by label. */
  press: (label: string) => number;
}

const PageBody: React.FC<{ b: PageBeat; L: PageLayout; lf: number; th: Theme; g: Geo; ptr: Pointer; clickedFrom: number | null; o: number; ho: number; dy: number }> = ({ b, L, lf, th, g, ptr, clickedFrom, o, ho, dy }) => {
  const scroll = scrollAt(b, lf);
  const tops = itemTops(b, L, lf);
  const w = g.content.w - 2 * g.padX;
  // Hit tests run in screen coordinates: the content's offset and the scroll undone.
  const toScreen = (r: Rect, dx: number, dy: number): Rect => ({ x: r.x + g.content.x + dx, y: r.y + g.content.y + dy - scroll, w: r.w, h: r.h });
  const titleLH = Math.round(g.titleSize * 1.2);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-scroll}px)` }}>
      <div style={{ position: "absolute", left: g.padX, right: g.padX, top: g.padTop, height: L.headerH - g.padTop, borderBottom: `1px solid ${th.line}`, opacity: ho }}>
        <div style={{ fontFamily: fonts.heading, fontSize: g.titleSize, lineHeight: `${titleLH}px`, fontWeight: Math.max(600, headingWeight), letterSpacing: "-0.025em", color: th.ink }}>{b.title}</div>
        {b.sub ? <div style={{ marginTop: 8, fontSize: 22, lineHeight: "32px", color: th.ink2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.sub}</div> : null}
      </div>
      {L.chips.map((c) => {
        const on = c.label === b.chip;
        const hover = inside(ptr.pos, toScreen(c, 0, 0));
        return (
          <div
            key={c.label}
            style={{
              opacity: ho,
              position: "absolute",
              left: c.x,
              top: c.y,
              width: c.w,
              height: c.h,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              font: CHIP_FONT,
              border: `1.5px solid ${on ? th.ink : th.lineStrong}`,
              background: on ? th.ink : hover ? th.surface2 : "transparent",
              color: on ? th.bg : hover ? th.ink : th.ink2,
              transform: `scale(${1 - 0.05 * ptr.press(c.label)})`,
            }}
          >
            {c.label}
          </div>
        );
      })}
      {b.items.map((it, k) => (
        <div key={k} style={{ position: "absolute", left: g.padX, top: tops[k]! + dy, opacity: o }}>
          <ItemView
            it={it}
            lf={lf}
            th={th}
            w={w}
            h={L.heights[k]!}
            buttons={L.buttons[k]!}
            hoverAt={(r) => inside(ptr.pos, toScreen(r, g.padX, tops[k]!))}
            pressOf={(label) => ptr.press(label)}
            clicked={(label) => (b.click?.then && b.click.target === label && clickedFrom !== null && lf >= clickedFrom ? b.click.then : label)}
          />
        </div>
      ))}
    </div>
  );
};

const Icon: React.FC<{ d: string; color: string; size?: number }> = ({ d, color, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const AddressBar: React.FC<{ host: string; path: string; th: Theme; w: number }> = ({ host, path, th, w }) => (
  <div style={{ width: w, height: 42, borderRadius: 12, background: th.surface, border: `1px solid ${th.line}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, font: `400 19px ${fonts.body}`, whiteSpace: "nowrap" }}>
    <Icon d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" color={th.muted} size={17} />
    <span style={{ color: th.ink }}>{host}</span>
    <span style={{ color: th.muted, marginLeft: -8 }}>{path}</span>
  </div>
);

const Sidebar: React.FC<{ spec: ScreenSpec; th: Theme; g: Geo; active: string | undefined; ptr: Pointer }> = ({ spec, th, g, active, ptr }) => {
  const nav = navRects(spec.app?.nav ?? [], g);
  if (g.phone)
    return (
      <div style={{ position: "absolute", left: 0, top: g.top, width: g.W, height: g.content.y - g.top, background: th.surface, borderBottom: `1px solid ${th.line}` }}>
        <div style={{ position: "absolute", left: 20, top: 16, height: 40, display: "flex", alignItems: "center" }}>{B.logo ? <Logo height={28} /> : <b style={{ fontSize: 26 }}>{PRODUCT}</b>}</div>
        {spec.app?.workspace ? <div style={{ position: "absolute", right: 20, top: 16, height: 40, display: "flex", alignItems: "center", padding: "0 14px", border: `1px solid ${th.line}`, borderRadius: 6, fontSize: 19, color: th.ink2 }}>{spec.app.workspace}</div> : null}
        {nav.map((n) => (
          <div key={n.label} style={{ position: "absolute", left: n.x, top: n.y - g.top, width: n.w, height: n.h, borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 14, font: NAV_FONT(g), background: n.label === active ? th.surface3 : "transparent", color: n.label === active ? th.ink : th.ink2, fontWeight: n.label === active ? 500 : 400, whiteSpace: "nowrap" }}>
            {n.label}
          </div>
        ))}
      </div>
    );
  return (
    <div style={{ position: "absolute", left: 0, top: g.barH, width: g.content.x, height: g.H - g.barH, background: th.surface, borderRight: `1px solid ${th.line}` }}>
      <div style={{ position: "absolute", left: 26, top: 24, height: 36, display: "flex", alignItems: "center" }}>{B.logo ? <Logo height={30} /> : <b style={{ fontFamily: fonts.heading, fontSize: 28, color: th.ink }}>{PRODUCT}</b>}</div>
      {spec.app?.workspace ? (
        <div style={{ position: "absolute", left: 18, right: 18, top: 78, height: 52, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", border: `1px solid ${th.line}`, borderRadius: 6, fontSize: 20, color: th.ink }}>
          <span style={{ minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{spec.app.workspace}</span>
          <Icon d="M7 10l5 5 5-5" color={th.muted} size={18} />
        </div>
      ) : null}
      {nav.map((n) => {
        const on = n.label === active;
        const hover = !on && inside(ptr.pos, n);
        return (
          <div key={n.label} style={{ position: "absolute", left: n.x, top: n.y - g.barH, width: n.w, height: n.h, boxSizing: "border-box", borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: n.textX - n.x, font: NAV_FONT(g), fontWeight: on ? 500 : 400, background: on ? th.surface3 : hover ? th.surface2 : "transparent", color: on || hover ? th.ink : th.ink2, whiteSpace: "nowrap" }}>
            {n.label}
          </div>
        );
      })}
    </div>
  );
};

const BrowserWindow: React.FC<{
  pages: { b: PageBeat; L: PageLayout; lf: number; o: number; ho: number; dy: number; clickedFrom: number | null }[];
  live: PageBeat;
  th: Theme;
  spec: ScreenSpec;
  g: Geo;
  ptr: Pointer;
}> = ({ pages, live, th, spec, g, ptr }) => {
  const host = spec.app?.host ?? "";
  return (
    <div style={{ position: "absolute", inset: 0, background: th.bg, fontFamily: fonts.body, color: th.ink }}>
      {g.phone ? null : (
        <div style={{ position: "absolute", left: 0, top: 0, width: g.W, height: g.barH, display: "flex", alignItems: "center", padding: "0 22px", gap: 26, background: th.chrome, borderBottom: `1px solid ${th.line}`, boxSizing: "border-box" }}>
          <Dots />
          <div style={{ display: "flex", gap: 10, marginLeft: 10 }}>
            <Icon d="M15 18l-6-6 6-6" color={th.ink2} />
            <Icon d="M9 18l6-6-6-6" color={th.lineStrong} />
          </div>
          <div style={{ position: "absolute", left: (g.W - 520) / 2, top: (g.barH - 42) / 2 }}>
            <AddressBar host={host} path={live.path ?? ""} th={th} w={520} />
          </div>
        </div>
      )}
      <Sidebar spec={spec} th={th} g={g} active={live.nav} ptr={ptr} />
      <div style={{ position: "absolute", left: g.content.x, top: g.content.y, width: g.content.w, height: g.content.h, overflow: "hidden" }}>
        {pages.map((p, i) => (
          <div key={i} style={{ position: "absolute", inset: 0 }}>
            <PageBody b={p.b} L={p.L} lf={p.lf} th={th} g={g} ptr={ptr} clickedFrom={p.clickedFrom} o={p.o} ho={p.ho} dy={p.dy} />
          </div>
        ))}
      </div>
      {g.phone ? (
        <div style={{ position: "absolute", left: 0, top: g.H - g.barH, width: g.W, height: g.barH, background: th.chrome, borderTop: `1px solid ${th.line}`, display: "flex", justifyContent: "center", paddingTop: 12, boxSizing: "border-box" }}>
          <AddressBar host={host} path="" th={th} w={g.W - 120} />
        </div>
      ) : null}
    </div>
  );
};

// ─── The phone's own parts ──────────────────────────────

const StatusBar: React.FC<{ g: Geo; dark: boolean }> = ({ g, dark }) => {
  const c = dark ? "#ffffff" : "#000000";
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: g.W, height: g.top, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 44px 0 52px", boxSizing: "border-box", color: c, font: `600 21px ${fonts.body}`, background: dark ? "#0c0d0c" : "transparent" }}>
      <span>9:41</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
          {[6, 9, 12, 15].map((h) => (
            <span key={h} style={{ width: 4, height: h, borderRadius: 1, background: c }} />
          ))}
        </span>
        <span style={{ width: 34, height: 16, borderRadius: 5, border: `2px solid ${c}`, opacity: 0.9, position: "relative", boxSizing: "border-box" }}>
          <span style={{ position: "absolute", left: 2, top: 2, right: 6, bottom: 2, borderRadius: 2, background: c }} />
        </span>
      </span>
    </div>
  );
};

// ─── The composition ────────────────────────────────────

const Inner: React.FC<ScreenProps> = ({ device, seconds }) => {
  const f = useCurrentFrame();
  const spec = SCREEN!;
  const secs = seconds ?? defaultSeconds();
  const beats = spec.beats;
  const starts = startsOf(secs);
  const g = geoOf(device);
  const th = themeOf(spec.theme);
  const layouts = React.useMemo(() => beats.map((b) => (b.kind === "page" ? pageLayout(b, g) : null)), [device]);
  const track = React.useMemo(() => trackOf(spec, beats, starts, layouts, g), [device, secs.join(",")]);

  // Windows: each run of beats of one kind is one window. Between runs the
  // screen swipes, a full-screen app switch; inside a run the content
  // crossfades on the click that changed it, under the same chrome.
  const runs: number[][] = [];
  beats.forEach((b, i) => (i && beats[i - 1]!.kind === b.kind ? runs[runs.length - 1]!.push(i) : runs.push([i])));
  const SWIPE = 11;
  const LEAD = 4;
  let shift = 0;
  runs.forEach((r, k) => {
    if (k) shift += lerp(f, starts[r[0]!]! - LEAD, starts[r[0]!]! - LEAD + SWIPE, 0, 1, Easing.bezier(0.5, 0, 0.15, 1));
  });

  const pos = cursorAt(track, f);
  const visible = cursorOpacity(track, f);
  const ptr: Pointer = {
    pos: visible > 0.5 ? pos : null,
    // The control under a click dips for a few frames.
    press: (label) => Math.max(0, ...track.clicks.filter((c) => c.label === label && f >= c.f && f < c.f + 6).map((c) => interpolate(f - c.f, [0, 2, 6], [0, 1, 0], clamp))),
  };

  const windows = runs.map((run, k) => {
    const x = (k - shift) * (g.W + 48);
    if (Math.abs(k - shift) >= 1) return null;
    const shown = run.filter((i, n) => (n === 0 || f >= starts[i]!) && !(run[n + 1] !== undefined && f >= starts[run[n + 1]!]! + 6));
    // A content swap: the old rows go in 2 frames as the new ones rise in over 5.
    // A header that stays the same (the same page, another filter) does not
    // fade at all: only what changed moves.
    const title = (i: number) => (beats[i]!.kind === "page" ? (beats[i] as PageBeat).title : null);
    const parts = shown.map((i, n) => {
      const nx = shown[n + 1];
      const out = nx === undefined ? 1 : 1 - lerp(f, starts[nx]!, starts[nx]! + 2, 0, 1, Easing.linear);
      const inn = n === 0 ? 1 : lerp(f, starts[i]! + 1, starts[i]! + 6, 0, 1, Easing.out(Easing.cubic));
      const o = Math.min(out, inn);
      const sameNext = nx !== undefined && title(nx) !== null && title(nx) === title(i);
      const samePrev = n > 0 && title(i) !== null && title(shown[n - 1]!) === title(i);
      return { i, lf: f - starts[i]!, o, ho: sameNext ? 0 : samePrev ? 1 : o, dy: (1 - inn) * 10 };
    });
    const liveIdx = parts[parts.length - 1]!.i;
    const inner =
      beats[run[0]!]!.kind === "terminal" ? (
        <TerminalWindow beats={parts.map((p) => ({ b: beats[p.i] as TerminalBeat, lf: p.lf, o: p.o, dy: p.dy }))} th={th} spec={spec} g={g} />
      ) : (
        <BrowserWindow
          pages={parts.map((p) => {
            const b = beats[p.i] as PageBeat;
            return { b, L: layouts[p.i]!, lf: p.lf, o: p.o, ho: p.ho, dy: p.dy, clickedFrom: b.click ? sec(b.click.at) : null };
          })}
          live={beats[liveIdx] as PageBeat}
          th={th}
          spec={spec}
          g={g}
          ptr={ptr}
        />
      );
    return (
      <div key={k} style={{ position: "absolute", left: 0, top: 0, width: g.W, height: g.H, transform: `translateX(${x}px)`, overflow: "hidden" }}>
        {inner}
      </div>
    );
  });

  const darkTop = beats[runs[Math.min(runs.length - 1, Math.round(shift))]![0]!]!.kind === "terminal";
  const lastClick = [...track.clicks].reverse().find((c) => f >= c.f && f < c.f + 16)?.f;
  return (
    <AbsoluteFill style={{ background: th.desk, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: g.W, height: g.H, transform: `scale(${g.k})`, transformOrigin: "0 0" }}>
        {windows}
        {g.phone ? <StatusBar g={g} dark={darkTop} /> : null}
        {pos && visible > 0 ? (
          g.phone ? (
            // A finger: a soft dot where it taps, nothing in between.
            lastClick !== undefined ? <div style={{ position: "absolute", left: pos.x - 34, top: pos.y - 34, width: 68, height: 68, borderRadius: 99, background: "rgba(120,120,120,0.35)", border: "2px solid rgba(255,255,255,0.7)", opacity: interpolate(f - lastClick, [0, 3, 16], [0, 1, 0], clamp), transform: `scale(${interpolate(f - lastClick, [0, 16], [0.7, 1.1], clamp)})` }} /> : null
          ) : (
            <>
              {lastClick !== undefined ? (
                <div style={{ position: "absolute", left: pos.x - 30, top: pos.y - 30, width: 60, height: 60, borderRadius: 99, background: mix(th.ink, "transparent", 14), border: `2px solid ${mix(th.ink, "transparent", 35)}`, opacity: interpolate(f - lastClick, [0, 2, 16], [0, 1, 0], clamp), transform: `scale(${interpolate(f - lastClick, [0, 16], [0.3, 1.25], { ...clamp, easing: Easing.out(Easing.cubic) })})` }} />
              ) : null}
              <svg width={32} height={44} viewBox="0 0 20 27" style={{ position: "absolute", left: pos.x - 3, top: pos.y - 2, opacity: visible, transform: `scale(${lastClick !== undefined ? interpolate(f - lastClick, [0, 2, 6], [1, 0.86, 1], clamp) : 1})`, transformOrigin: "3px 2px", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }}>
                <path d="M2 1 L2 21 L7.5 16 L11 24.5 L14.5 23 L11 15 L18 15 Z" fill="#000" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
              </svg>
            </>
          )
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const Screen: React.FC<ScreenProps> = (props) => (
  <AbsoluteFill style={{ textRendering: "geometricPrecision", WebkitFontSmoothing: "antialiased" }}>
    <FontsReady>
      <Inner {...props} />
    </FontsReady>
  </AbsoluteFill>
);

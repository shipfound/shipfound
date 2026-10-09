import React, { useEffect, useState } from "react";
import { Easing, Img, cancelRender, continueRender, delayRender, interpolate, measureSpring, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { SpringConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import brand from "../public/brand/brand.json";

// The pieces a scene is built from. A scene recreates one screen of the
// product in HTML and CSS on a 1160x900 stage (the Clip scales it to fit),
// in the site's own fonts and colors, and animates it with these: what the
// user does (Typing, Cursor) and what the product does in answer (Appear,
// CountUp, Highlight), with Camera to move in on the part that matters.
// Times are frames from the start of the scene; sec(1.5) is 45 frames.

export const FPS = 30;
export const STAGE = { w: 1160, h: 900 };
export const sec = (s: number) => Math.round(s * FPS);

// ─── The brand (public/brand/, read from the landing page by capture.mjs) ───

interface Brand {
  colors: Record<string, string>;
  fonts: Partial<Record<"heading" | "body", { family: string; weight: string; files: { file: string; weight: string }[] }>>;
  logo: { file: string; width: number; height: number } | null;
}
export const B = brand as Brand;
const interFont = loadInter("normal", { weights: ["400", "500", "700", "800"], subsets: ["latin"] });
const monoFont = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] });
const inter = interFont.fontFamily;
const jetbrains = monoFont.fontFamily;

// Every font, the site's own files and the fallbacks, loaded once per tab.
// FontsReady renders nothing until this is done: text laid out before its
// font arrives keeps the fallback's measurements in some tabs (SVG text,
// centred labels), and frames from different tabs then disagree: a flicker.
const faces = (["heading", "body"] as const).flatMap((role) => (B.fonts[role]?.files ?? []).map((f) => ({ family: `Brand ${role}`, ...f })));
let fontsLoaded = false;
const fontsDone = Promise.all([
  ...faces.map((f) => new FontFace(f.family, `url(${staticFile(f.file)})`, { weight: f.weight }).load().then((face) => void document.fonts.add(face))),
  interFont.waitUntilDone(),
  monoFont.waitUntilDone(),
])
  .then(() => document.fonts.ready)
  .then(() => {
    fontsLoaded = true;
  });

/** Mounts its children only once every font is loaded. Clip wraps everything in it. */
export const FontsReady: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(fontsLoaded);
  const [handle] = useState(() => (fontsLoaded ? null : delayRender("Loading fonts")));
  useEffect(() => {
    if (ready) return;
    fontsDone.then(() => setReady(true)).catch((e) => cancelRender(e));
  }, [ready]);
  useEffect(() => {
    if (ready && handle !== null) continueRender(handle);
  }, [ready, handle]);
  return ready ? <>{children}</> : null;
};
const bodyIsMono = /mono|code|courier/i.test(B.fonts.body?.family ?? "");
export const fonts = {
  heading: B.fonts.heading ? `"Brand heading", ${inter}` : inter,
  body: B.fonts.body && !bodyIsMono ? `"Brand body", ${inter}` : B.fonts.heading ? `"Brand heading", ${inter}` : inter,
  mono: bodyIsMono ? `"Brand body", ${jetbrains}` : jetbrains,
};
export const headingWeight = Number(B.fonts.heading?.weight) >= 500 ? Number(B.fonts.heading?.weight) : 700;
export const C = { bg: "#0e0f12", fg: "#ffffff", accent: "#4f7cff", accentFg: "#ffffff", muted: "#a1a1aa", ...B.colors };

/** The site's logo, as its header shows it. Nothing when none was found. */
export const Logo: React.FC<{ height: number }> = ({ height }) =>
  B.logo ? <Img src={staticFile(B.logo.file)} style={{ height, width: (height * B.logo.width) / B.logo.height }} /> : null;

// ─── Motion ─────────────────────────────────────────────

/**
 * A spring that is exactly 0 before it starts and exactly 1 once settled.
 * A plain spring creeps towards 1 for ever, so anything it moves shifts by a
 * fraction of a pixel every frame; text then re-rasterizes and flickers.
 * Use this, never spring() directly.
 */
export const settle = (frame: number, fps: number, config: Partial<SpringConfig>, durationInFrames?: number): number => {
  if (frame <= 0) return 0;
  const end = durationInFrames ?? measureSpring({ fps, config });
  return frame >= end ? 1 : spring({ frame, fps, config, durationInFrames });
};

/** Children enter at `at`: sliding a little from a side, scaling up, or fading. */
export const Appear: React.FC<{ at?: number; from?: "up" | "down" | "left" | "right" | "scale" | "fade"; style?: React.CSSProperties; children: React.ReactNode }> = ({ at = 0, from = "up", style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = settle(frame - at, fps, { damping: 18, stiffness: 170 });
  const d = 22 * (1 - p);
  const transform =
    from === "up" ? `translateY(${d}px)` : from === "down" ? `translateY(${-d}px)` : from === "left" ? `translateX(${d}px)` : from === "right" ? `translateX(${-d}px)` : from === "scale" ? `scale(${0.92 + 0.08 * p})` : undefined;
  return <div style={{ opacity: Math.min(1, p * 1.25), transform, ...style }}>{children}</div>;
};

/** Frames Typing takes for this text. */
export const typingFrames = (text: string, cps = 26) => Math.ceil((text.length / cps) * FPS);

/** Text typed in from `at`, `cps` characters a second, with a steady caret that goes once the text is in (a blinking one reads as a glitch). */
export const Typing: React.FC<{ text: string; at?: number; cps?: number; caret?: boolean; style?: React.CSSProperties }> = ({ text, at = 0, cps = 26, caret = true, style }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - at) / FPS) * cps)));
  const showCaret = caret && frame >= at && frame < at + typingFrames(text, cps) + sec(0.4);
  return (
    <span style={{ whiteSpace: "pre-wrap", ...style }}>
      {text.slice(0, n)}
      {showCaret ? <span style={{ display: "inline-block", width: "0.55em", height: "1.1em", verticalAlign: "-0.2em", background: "currentColor", opacity: 0.85 }} /> : null}
    </span>
  );
};

/** A number counting from `from` to `to` over `frames`, starting at `at`. */
export const CountUp: React.FC<{ to: number; from?: number; at?: number; frames?: number; format?: (n: number) => string }> = ({ to, from = 0, at = 0, frames = sec(0.8), format = (n) => Math.round(n).toLocaleString("en-US") }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + frames], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <>{format(v)}</>;
};

/** A pointer moving through points on the stage, pressing at each of `clicks`. */
export const Cursor: React.FC<{ path: { at: number; x: number; y: number }[]; clicks?: number[] }> = ({ path, clicks = [] }) => {
  const frame = useCurrentFrame();
  if (!path.length || frame < path[0]!.at) return null;
  const pts = path.length === 1 ? [path[0]!, { ...path[0]!, at: path[0]!.at + 1 }] : path;
  const opts = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
  const x = interpolate(frame, pts.map((p) => p.at), pts.map((p) => p.x), opts);
  const y = interpolate(frame, pts.map((p) => p.at), pts.map((p) => p.y), opts);
  const press = clicks.some((c) => frame >= c && frame < c + 5);
  return (
    <>
      {clicks.map((c) =>
        frame >= c && frame < c + 14 ? (
          <div
            key={c}
            style={{
              position: "absolute",
              left: x - 22,
              top: y - 22,
              width: 44,
              height: 44,
              borderRadius: 999,
              border: `3px solid ${C.accent}`,
              transform: `scale(${interpolate(frame, [c, c + 14], [0.3, 1.4])})`,
              opacity: interpolate(frame, [c, c + 14], [0.9, 0]),
            }}
          />
        ) : null
      )}
      <svg width={30} height={40} viewBox="0 0 20 27" style={{ position: "absolute", left: x - 3, top: y - 2, transform: `scale(${press ? 0.85 : 1})`, transformOrigin: "3px 2px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
        <path d="M2 1 L2 21 L7.5 16 L11 24.5 L14.5 23 L11 15 L18 15 Z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** A ring around a box on the stage, drawn in at `at`. */
export const Highlight: React.FC<{ box: { x: number; y: number; w: number; h: number }; at?: number; radius?: number }> = ({ box, at = 0, radius = 10 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: box.x - 6, top: box.y - 6, width: box.w + 12, height: box.h + 12, border: `3px solid ${C.accent}`, borderRadius: radius, opacity: o, transform: `scale(${1.04 - 0.04 * o})` }} />;
};

/** Moves in on a point of the stage: keys of { at, x, y, scale }, eased between, never showing past the stage's edges. */
export const Camera: React.FC<{ keys: { at: number; x?: number; y?: number; scale: number }[]; children: React.ReactNode }> = ({ keys, children }) => {
  const frame = useCurrentFrame();
  const ks = keys.length === 1 ? [keys[0]!, { ...keys[0]!, at: keys[0]!.at + 1 }] : keys;
  const opts = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
  const at = ks.map((k) => k.at);
  const s = interpolate(frame, at, ks.map((k) => k.scale), opts);
  const x = interpolate(frame, at, ks.map((k) => k.x ?? STAGE.w / 2), opts);
  const y = interpolate(frame, at, ks.map((k) => k.y ?? STAGE.h / 2), opts);
  const tx = Math.min(0, Math.max(STAGE.w - STAGE.w * s, STAGE.w / 2 - x * s));
  const ty = Math.min(0, Math.max(STAGE.h - STAGE.h * s, STAGE.h / 2 - y * s));
  return <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>{children}</div>;
};

// ─── Frames ─────────────────────────────────────────────

/** A browser window filling the stage, for a web app. `bg` is the page's own background. */
export const BrowserWindow: React.FC<{ url: string; bg?: string; children: React.ReactNode }> = ({ url, bg = "#ffffff", children }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: bg }}>
    <div style={{ height: 46, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: "#e9e9ec", borderBottom: "1px solid #d4d4d8" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
      ))}
      <div style={{ marginLeft: 18, flex: 1, maxWidth: 560, height: 28, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", font: `500 15px ${fonts.body}`, color: "#52525b" }}>{url}</div>
    </div>
    <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>{children}</div>
  </div>
);

/** A terminal window filling the stage, for a CLI or an agent in a terminal. */
export const TerminalWindow: React.FC<{ title?: string; children: React.ReactNode }> = ({ title = "", children }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#0c0c0e", color: "#e7e7ea", fontFamily: fonts.mono }}>
    <div style={{ height: 46, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: "#1b1b1f", borderBottom: "1px solid #2a2a30" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
      ))}
      <div style={{ flex: 1, textAlign: "center", font: `500 15px ${fonts.mono}`, color: "#8b8b94", marginRight: 60 }}>{title}</div>
    </div>
    <div style={{ position: "relative", flex: 1, overflow: "hidden", padding: "28px 34px", fontSize: 34, lineHeight: 1.45 }}>{children}</div>
  </div>
);

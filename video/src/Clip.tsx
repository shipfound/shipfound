import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, cancelRender, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import video from "../public/video.json";
import capture from "../public/shots/capture.json";
import brand from "../public/brand/brand.json";

// The 15 second cut: the hook (2s), three steps (3s each, the screen then a
// zoom to the part that matters), the result (2s) and the end card (2s).
// Silent: no music, no voiceover. Every screen is a real screenshot from
// capture.mjs; every word comes from video.json, which takes its lines from
// the post and the landing page. The logo, fonts and colors are the site's
// own (public/brand/, read by capture.mjs); Inter only when none was found.

interface Brand {
  colors: Record<string, string>;
  fonts: Partial<Record<"heading" | "body", { family: string; weight: string; files: { file: string; weight: string }[] }>>;
  logo: { file: string; width: number; height: number } | null;
}
const B = brand as Brand;
const inter = loadFont("normal", { weights: ["500", "700", "800"], subsets: ["latin"] }).fontFamily;

// The site's own font files, loaded before any frame renders.
const brandFaces = (["heading", "body"] as const).flatMap((role) => (B.fonts[role]?.files ?? []).map((f) => ({ family: `Brand ${role}`, ...f })));
if (brandFaces.length) {
  const wait = delayRender("Loading the site's fonts");
  Promise.all(brandFaces.map((f) => new FontFace(f.family, `url(${staticFile(f.file)})`, { weight: f.weight }).load().then((face) => document.fonts.add(face))))
    .then(() => continueRender(wait))
    .catch((e) => cancelRender(e));
}
const headingFont = B.fonts.heading ? `"Brand heading", ${inter}` : inter;
const bodyFont = B.fonts.body ? `"Brand body", ${inter}` : inter;
const headingWeight = Number(B.fonts.heading?.weight) >= 500 ? Number(B.fonts.heading?.weight) : 700;

export const FPS = 30;
const HOOK = 2 * FPS;
const STEP = 3 * FPS;
const RESULT = 2 * FPS;
const END = 2 * FPS;
export const DURATION = HOOK + 3 * STEP + RESULT + END;

interface Shot {
  image: string;
  width: number;
  height: number;
  focus: { x: number; y: number; w: number; h: number } | null;
}
interface VideoSpec {
  product: string;
  colors?: { bg?: string; fg?: string; accent?: string; accentFg?: string; muted?: string };
  hook: string;
  steps: { shot: string; caption: string }[];
  result: { shot: string; caption: string };
  end: { line: string; cta: string };
}

const spec = video as VideoSpec;
const shots = (capture as { shots: Record<string, Shot> }).shots;
const C = { bg: "#0e0f12", fg: "#ffffff", accent: "#4f7cff", accentFg: "#ffffff", muted: "#a1a1aa", ...B.colors, ...spec.colors };

if (spec.steps.length !== 3) throw new Error(`video.json needs exactly 3 steps, it has ${spec.steps.length}`);
for (const name of [...spec.steps.map((s) => s.shot), spec.result.shot]) {
  if (!shots[name]) throw new Error(`video.json names shot "${name}", which capture.json does not have`);
}

export interface Size {
  w: number;
  h: number;
}

/** Fades a scene in over its first frames and out over its last. */
const useScene = (length: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 12 });
  const exit = interpolate(frame, [length - 6, length], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { frame, enter, opacity: Math.min(enter, exit) };
};

const Caption: React.FC<{ text: string; size: Size; delay?: number }> = ({ text, size, delay = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });
  const unit = Math.min(size.w, size.h);
  return (
    <div
      style={{
        position: "absolute",
        left: unit * 0.07,
        right: unit * 0.07,
        bottom: unit * 0.07,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - s) * unit * 0.05}px)`,
        opacity: s,
      }}
    >
      <div style={{ fontFamily: headingFont, fontWeight: headingWeight, fontSize: Math.round(unit * 0.052), lineHeight: 1.15, color: C.fg, textAlign: "center", letterSpacing: "-0.01em" }}>{text}</div>
    </div>
  );
};

/** A real screen in a window, zooming towards its focus box. */
const Screen: React.FC<{ shot: Shot; caption: string; size: Size; length: number; zoom: boolean }> = ({ shot, caption, size, length, zoom }) => {
  const { frame, enter, opacity } = useScene(length);
  const unit = Math.min(size.w, size.h);
  const pad = unit * 0.06;
  const captionH = unit * 0.2;
  const areaW = size.w - 2 * pad;
  const areaH = size.h - captionH - 2 * pad;
  const k = Math.min(areaW / shot.width, areaH / shot.height);
  const fw = shot.width * k;
  const fh = shot.height * k;

  // Zoom so the focus box fills about three quarters of the window, at most 2.4x.
  const f = shot.focus;
  const target = zoom && f ? Math.max(1, Math.min(2.4, (fw * 0.75) / (f.w * k), (fh * 0.75) / (f.h * k))) : 1;
  const p = interpolate(frame, [0.25 * FPS, length - 0.7 * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const s = 1 + (target - 1) * p;
  const cx = f ? (f.x + f.w / 2) * k : fw / 2;
  const cy = f ? (f.y + f.h / 2) * k : fh / 2;
  const tx = Math.min(0, Math.max(fw - fw * s, fw / 2 - cx * s));
  const ty = Math.min(0, Math.max(fh - fh * s, fh / 2 - cy * s));
  const ring = f && zoom ? interpolate(p, [0.55, 0.85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const radius = unit * 0.018;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, opacity }}>
      <div
        style={{
          position: "absolute",
          left: (size.w - fw) / 2,
          top: pad + (areaH - fh) / 2,
          width: fw,
          height: fh,
          overflow: "hidden",
          borderRadius: radius,
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          transform: `translateY(${(1 - enter) * unit * 0.04}px) scale(${0.97 + 0.03 * enter})`,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: fw, height: fh, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
          <Img src={staticFile(shot.image)} style={{ width: fw, height: fh, display: "block" }} />
          {f && ring > 0 ? (
            <div
              style={{
                position: "absolute",
                left: f.x * k - 6 / s,
                top: f.y * k - 6 / s,
                width: f.w * k + 12 / s,
                height: f.h * k + 12 / s,
                border: `${4 / s}px solid ${C.accent}`,
                borderRadius: radius / s,
                opacity: ring,
              }}
            />
          ) : null}
        </div>
      </div>
      <Caption text={caption} size={size} />
    </AbsoluteFill>
  );
};

/** The site's logo, as its header shows it. Nothing when none was found. */
const Logo: React.FC<{ height: number }> = ({ height }) =>
  B.logo ? <Img src={staticFile(B.logo.file)} style={{ height, width: (height * B.logo.width) / B.logo.height }} /> : null;

const Hook: React.FC<{ size: Size }> = ({ size }) => {
  const { frame, opacity } = useScene(HOOK);
  const { fps } = useVideoConfig();
  const unit = Math.min(size.w, size.h);
  const words = spec.hook.split(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, opacity, alignItems: "center", justifyContent: "center", gap: unit * 0.07, padding: unit * 0.09 }}>
      <Logo height={unit * 0.05} />
      <div style={{ fontFamily: headingFont, fontWeight: headingWeight, fontSize: Math.round(unit * 0.082), lineHeight: 1.08, color: C.fg, textAlign: "center", letterSpacing: "-0.02em" }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - i * 2, fps, config: { damping: 16, stiffness: 180 } });
          return (
            <span key={i} style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * unit * 0.03}px)`, marginRight: "0.25em" }}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ size: Size }> = ({ size }) => {
  const { frame, enter } = useScene(END + 6);
  const { fps } = useVideoConfig();
  const unit = Math.min(size.w, size.h);
  const cta = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 160 } });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, alignItems: "center", justifyContent: "center", gap: unit * 0.04, padding: unit * 0.09, opacity: enter }}>
      {B.logo ? <Logo height={unit * 0.1} /> : <div style={{ fontFamily: headingFont, fontWeight: headingWeight, fontSize: Math.round(unit * 0.09), color: C.fg, letterSpacing: "-0.02em" }}>{spec.product}</div>}
      <div style={{ fontFamily: bodyFont, fontSize: Math.round(unit * 0.04), color: C.muted, textAlign: "center", lineHeight: 1.25 }}>{spec.end.line}</div>
      <div
        style={{
          fontFamily: headingFont,
          fontWeight: headingWeight,
          fontSize: Math.round(unit * 0.045),
          color: C.accentFg,
          backgroundColor: C.accent,
          borderRadius: 999,
          padding: `${unit * 0.018}px ${unit * 0.05}px`,
          transform: `scale(${0.9 + 0.1 * cta})`,
          opacity: cta,
        }}
      >
        {spec.end.cta}
      </div>
    </AbsoluteFill>
  );
};

export const Clip: React.FC<Size> = (size) => {
  let at = 0;
  const next = (n: number) => {
    const from = at;
    at += n;
    return from;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Sequence from={next(HOOK)} durationInFrames={HOOK}>
        <Hook size={size} />
      </Sequence>
      {spec.steps.map((st, i) => (
        <Sequence key={i} from={next(STEP)} durationInFrames={STEP}>
          <Screen shot={shots[st.shot]!} caption={st.caption} size={size} length={STEP} zoom />
        </Sequence>
      ))}
      <Sequence from={next(RESULT)} durationInFrames={RESULT}>
        <Screen shot={shots[spec.result.shot]!} caption={spec.result.caption} size={size} length={RESULT} zoom={false} />
      </Sequence>
      <Sequence from={next(END)} durationInFrames={END}>
        <EndCard size={size} />
      </Sequence>
    </AbsoluteFill>
  );
};

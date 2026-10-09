import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import video from "../public/video.json";
import { C, FPS, FontsReady, Logo, STAGE, fonts, headingWeight, sec, settle } from "./kit";
import { scenes } from "./scenes";

// The cut: the hook (2s), the scenes (each a screen of the product recreated
// in HTML and animated, src/scenes/), and the end card (2s). 30 seconds at
// most. Silent: no music, no voiceover, no audio track. Every word on screen
// comes from video.json, which takes its lines from the post and the landing
// page, and from the scenes, which copy the product's own labels.

interface VideoSpec {
  product: string;
  colors?: Partial<typeof C>;
  hook: string;
  scenes: { id: string; seconds: number; caption: string }[];
  end: { line: string; cta: string };
}

const spec = video as VideoSpec;
const col = { ...C, ...spec.colors };
const HOOK = sec(2);
const END = sec(2);
export const MAX_SECONDS = 30;

for (const s of spec.scenes) if (!scenes[s.id]) throw new Error(`video.json names scene "${s.id}", which src/scenes/index.ts does not register`);
if (spec.scenes.length < 2 || spec.scenes.length > 5) throw new Error(`video.json needs 2 to 5 scenes, it has ${spec.scenes.length}`);
export const DURATION = HOOK + spec.scenes.reduce((n, s) => n + sec(s.seconds), 0) + END;
if (DURATION > MAX_SECONDS * FPS) throw new Error(`The video is ${(DURATION / FPS).toFixed(1)} seconds; ${MAX_SECONDS} is the most. Shorten the scenes in video.json.`);

export interface Size {
  w: number;
  h: number;
}

/** Fades a part in over its first frames and out over its last. */
const useFade = (length: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = settle(frame, fps, { damping: 200 }, 12);
  const exit = interpolate(frame, [length - 6, length], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { frame, enter, opacity: Math.min(enter, exit) };
};

const Caption: React.FC<{ text: string; size: Size }> = ({ text, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = settle(frame - 4, fps, { damping: 18, stiffness: 160 });
  const unit = Math.min(size.w, size.h);
  return (
    <div style={{ position: "absolute", left: unit * 0.07, right: unit * 0.07, bottom: unit * 0.07, display: "flex", justifyContent: "center", transform: `translateY(${(1 - s) * unit * 0.05}px)`, opacity: s }}>
      <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: Math.round(unit * 0.052), lineHeight: 1.15, color: col.fg, textAlign: "center", letterSpacing: "-0.01em" }}>{text}</div>
    </div>
  );
};

/** One scene: the recreated screen on the stage, scaled to fit above its caption. */
const Scene: React.FC<{ id: string; caption: string; size: Size; length: number }> = ({ id, caption, size, length }) => {
  const { enter, opacity } = useFade(length);
  const unit = Math.min(size.w, size.h);
  const pad = unit * 0.06;
  const areaW = size.w - 2 * pad;
  const areaH = size.h - unit * 0.2 - 2 * pad;
  const k = Math.min(areaW / STAGE.w, areaH / STAGE.h);
  const Screen = scenes[id]!;
  return (
    <AbsoluteFill style={{ backgroundColor: col.bg, opacity }}>
      <div
        style={{
          position: "absolute",
          left: (size.w - STAGE.w * k) / 2,
          top: pad + (areaH - STAGE.h * k) / 2,
          width: STAGE.w * k,
          height: STAGE.h * k,
          borderRadius: unit * 0.018,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          transform: `translateY(${(1 - enter) * unit * 0.04}px) scale(${0.97 + 0.03 * enter})`,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: STAGE.w, height: STAGE.h, transform: `scale(${k})`, transformOrigin: "0 0", overflow: "hidden" }}>
          <Screen />
        </div>
      </div>
      <Caption text={caption} size={size} />
    </AbsoluteFill>
  );
};

const Hook: React.FC<{ size: Size }> = ({ size }) => {
  const { frame, opacity } = useFade(HOOK);
  const { fps } = useVideoConfig();
  const unit = Math.min(size.w, size.h);
  return (
    <AbsoluteFill style={{ backgroundColor: col.bg, opacity, alignItems: "center", justifyContent: "center", gap: unit * 0.07, padding: unit * 0.09 }}>
      <Logo height={unit * 0.05} />
      <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: Math.round(unit * 0.082), lineHeight: 1.08, color: col.fg, textAlign: "center", letterSpacing: "-0.02em" }}>
        {spec.hook.split(" ").map((w, i) => {
          const s = settle(frame - i * 2, fps, { damping: 16, stiffness: 180 });
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
  const { frame, enter } = useFade(END + 6);
  const { fps } = useVideoConfig();
  const unit = Math.min(size.w, size.h);
  const cta = settle(frame - 8, fps, { damping: 14, stiffness: 160 });
  return (
    <AbsoluteFill style={{ backgroundColor: col.bg, alignItems: "center", justifyContent: "center", gap: unit * 0.04, padding: unit * 0.09, opacity: enter }}>
      {Logo({ height: unit * 0.1 }) ?? <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: Math.round(unit * 0.09), color: col.fg }}>{spec.product}</div>}
      <div style={{ fontFamily: fonts.body, fontSize: Math.round(unit * 0.04), color: col.muted, textAlign: "center", lineHeight: 1.25 }}>{spec.end.line}</div>
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: headingWeight,
          fontSize: Math.round(unit * 0.045),
          color: col.accentFg,
          backgroundColor: col.accent,
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
  const next = (n: number) => ((at += n), at - n);
  return (
    <AbsoluteFill style={{ backgroundColor: col.bg, textRendering: "geometricPrecision" }}>
      <FontsReady>
        <Sequence from={next(HOOK)} durationInFrames={HOOK}>
          <Hook size={size} />
        </Sequence>
        {spec.scenes.map((s) => (
          <Sequence key={s.id} from={next(sec(s.seconds))} durationInFrames={sec(s.seconds)}>
            <Scene id={s.id} caption={s.caption} size={size} length={sec(s.seconds)} />
          </Sequence>
        ))}
        <Sequence from={next(END)} durationInFrames={END}>
          <EndCard size={size} />
        </Sequence>
      </FontsReady>
    </AbsoluteFill>
  );
};

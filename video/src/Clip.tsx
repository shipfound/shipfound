import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import video from "../public/video.json";
import { C, FPS, FontsReady, Logo, STAGE, fonts, headingWeight, sec, settle } from "./kit";
import { scenes } from "./scenes";

// The cut: the hook (2s), the scenes (each a screen of the product recreated
// in HTML and animated, src/scenes/), and the end card (2.5s). 30 seconds at
// most. No sound: no music, no voiceover, only a silent audio track. Every
// word on screen comes from video.json, which takes its lines from the ad and
// the landing page, and from the scenes, which copy the product's own labels.
//
// One cut per ad. Ad 1 is video.json's own hook and scenes; each entry in
// `ads` is the next ad's cut (its hook, its scene order and captions, its
// image), sharing the product, colors and end card. Each opens on its own
// ad's hook, so the same video never runs on two ads.

type Scenes = { id: string; seconds: number; caption: string }[];

/** The image ad: the hook as the headline, one scene at its finished frame, the payoff line. */
export interface ImageSpec {
  /** A line break ("\n") where the headline should wrap. */
  hook: string;
  scene: string;
  /** Seconds into the scene, once its motion has landed. */
  at: number;
  line: string;
  /** The small print beside the logo; default the end card's line. */
  note?: string;
}

interface CutSpec {
  hook: string;
  scenes: Scenes;
  image?: ImageSpec;
}

export interface VideoSpec extends CutSpec {
  product: string;
  colors?: Partial<typeof C>;
  end: { line: string; cta: string };
  ads?: CutSpec[];
}

const base = video as VideoSpec;
const HOOK = sec(2);
const END = sec(2.5);
export const MAX_SECONDS = 30;
const MAX_HOOK_WORDS = 8;
const MAX_CAPTION_WORDS = 7;
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** Every cut by ad number: "1" is video.json itself, "2" and "3" its `ads`. */
export const CUTS: Record<string, VideoSpec> = Object.fromEntries(
  // A cut's image is its own: ad 2 never carries ad 1's headline.
  [base, ...(base.ads ?? [])].map((c, i) => [String(i + 1), { ...base, ...c, image: c.image, ads: undefined }])
);

export const durationOf = (cut: string) => {
  const spec = CUTS[cut];
  if (!spec) throw new Error(`No cut ${cut}: video.json has ${Object.keys(CUTS).join(", ")}`);
  const name = cut === "1" ? "video.json" : `video.json ads[${Number(cut) - 2}]`;
  for (const s of spec.scenes) {
    if (!scenes[s.id]) throw new Error(`${name} names scene "${s.id}", which src/scenes/index.ts does not register`);
    if (words(s.caption) > MAX_CAPTION_WORDS) throw new Error(`${name}: the caption "${s.caption}" is over ${MAX_CAPTION_WORDS} words; say what the viewer gets, shorter`);
  }
  if (words(spec.hook) > MAX_HOOK_WORDS) throw new Error(`${name}: the hook "${spec.hook}" is over ${MAX_HOOK_WORDS} words`);
  if (spec.image && !scenes[spec.image.scene]) throw new Error(`${name}: image names scene "${spec.image.scene}", which src/scenes/index.ts does not register`);
  if (spec.scenes.length < 2 || spec.scenes.length > 5) throw new Error(`${name} needs 2 to 5 scenes, it has ${spec.scenes.length}`);
  const d = HOOK + spec.scenes.reduce((n, s) => n + sec(s.seconds), 0) + END;
  if (d > MAX_SECONDS * FPS) throw new Error(`${name} is ${(d / FPS).toFixed(1)} seconds; ${MAX_SECONDS} is the most. Shorten its scenes.`);
  return d;
};
export const DURATION = durationOf("1");
for (const cut of Object.keys(CUTS)) durationOf(cut);

const SpecCtx = React.createContext<VideoSpec>(CUTS["1"]!);
export const useSpec = () => React.useContext(SpecCtx);
export const useCol = () => ({ ...C, ...useSpec().colors });
export const SpecProvider: React.FC<{ cut: string; children: React.ReactNode }> = ({ cut, children }) => <SpecCtx.Provider value={CUTS[cut]!}>{children}</SpecCtx.Provider>;

export interface Size {
  w: number;
  h: number;
}

/** Portrait (4:5) and vertical (9:16): the screen and its caption are stacked in the middle, clear of the feed's and Reels' overlays. */
export const tall = (size: Size) => size.h / size.w > 1.2;

/** Fades a part in over its first frames and out over its last. */
const useFade = (length: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = settle(frame, fps, { damping: 200 }, 12);
  const exit = interpolate(frame, [length - 6, length], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { frame, enter, opacity: Math.min(enter, exit) };
};

const Caption: React.FC<{ text: string; size: Size; top?: number }> = ({ text, size, top }) => {
  const col = useCol();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = settle(frame - 4, fps, { damping: 18, stiffness: 160 });
  const unit = Math.min(size.w, size.h);
  return (
    <div style={{ position: "absolute", left: unit * 0.07, right: unit * 0.07, ...(top === undefined ? { bottom: unit * 0.07 } : { top }), display: "flex", justifyContent: "center", transform: `translateY(${(1 - s) * unit * 0.05}px)`, opacity: s }}>
      <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: Math.round(unit * (tall(size) ? 0.068 : 0.056)), lineHeight: 1.15, color: col.fg, textAlign: "center", letterSpacing: "-0.01em" }}>{text}</div>
    </div>
  );
};

/** One scene: the recreated screen on the stage, scaled to fit with its caption. */
const Scene: React.FC<{ id: string; caption: string; size: Size; length: number }> = ({ id, caption, size, length }) => {
  const col = useCol();
  const { enter, opacity } = useFade(length);
  const unit = Math.min(size.w, size.h);
  const pad = unit * 0.06;
  const areaW = size.w - 2 * pad;
  const areaH = tall(size) ? size.h * 0.5 : size.h - unit * 0.2 - 2 * pad;
  const k = Math.min(areaW / STAGE.w, areaH / STAGE.h);
  const screenH = STAGE.h * k;
  // Tall: the screen, then its caption under it, the pair centred a little above the middle.
  const top = tall(size) ? (size.h - screenH - unit * 0.3) / 2 : pad + (areaH - screenH) / 2;
  const Screen = scenes[id]!;
  return (
    <AbsoluteFill style={{ backgroundColor: col.bg, opacity }}>
      <div
        style={{
          position: "absolute",
          left: (size.w - STAGE.w * k) / 2,
          top,
          width: STAGE.w * k,
          height: screenH,
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
      <Caption text={caption} size={size} top={tall(size) ? top + screenH + unit * 0.07 : undefined} />
    </AbsoluteFill>
  );
};

// The hook is whole on frame 0: that frame is the thumbnail and what a
// scroller sees before the video plays, so nothing fades or types in. A slow
// push-in is its only motion.
const Hook: React.FC<{ size: Size }> = ({ size }) => {
  const spec = useSpec();
  const col = useCol();
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [HOOK - 6, HOOK], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, HOOK], [1, 1.04]);
  const unit = Math.min(size.w, size.h);
  return (
    <AbsoluteFill style={{ backgroundColor: col.bg, opacity: exit, alignItems: "center", justifyContent: "center", gap: unit * 0.07, padding: unit * 0.08 }}>
      <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: Math.round(unit * 0.12), lineHeight: 1.04, color: col.fg, textAlign: "center", letterSpacing: "-0.03em", whiteSpace: "pre-line", transform: `scale(${drift})` }}>{spec.hook}</div>
      <Logo height={unit * 0.045} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ size: Size }> = ({ size }) => {
  const spec = useSpec();
  const col = useCol();
  const { frame, enter } = useFade(END + 6);
  const { fps } = useVideoConfig();
  const unit = Math.min(size.w, size.h);
  const cta = settle(frame - 8, fps, { damping: 14, stiffness: 160 });
  return (
    <AbsoluteFill style={{ backgroundColor: col.bg, alignItems: "center", justifyContent: "center", gap: unit * 0.04, padding: unit * 0.09, opacity: enter }}>
      {Logo({ height: unit * 0.1 }) ?? <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: Math.round(unit * 0.09), color: col.fg }}>{spec.product}</div>}
      <div style={{ fontFamily: fonts.body, fontSize: Math.round(unit * 0.055), color: col.fg, textAlign: "center", lineHeight: 1.25 }}>{spec.end.line}</div>
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

/** One ad's cut at one size. Without `cut`, ad 1. */
export const Clip: React.FC<Size & { cut?: string }> = ({ cut = "1", ...size }) => {
  const spec = CUTS[cut]!;
  const col = { ...C, ...spec.colors };
  let at = 0;
  const next = (n: number) => ((at += n), at - n);
  return (
    <SpecProvider cut={cut}>
      <AbsoluteFill style={{ backgroundColor: col.bg, textRendering: "geometricPrecision" }}>
        <FontsReady>
          <Sequence from={next(HOOK)} durationInFrames={HOOK}>
            <Hook size={size} />
          </Sequence>
          {spec.scenes.map((s, i) => (
            <Sequence key={`${s.id}-${i}`} from={next(sec(s.seconds))} durationInFrames={sec(s.seconds)}>
              <Scene id={s.id} caption={s.caption} size={size} length={sec(s.seconds)} />
            </Sequence>
          ))}
          <Sequence from={next(END)} durationInFrames={END}>
            <EndCard size={size} />
          </Sequence>
        </FontsReady>
      </AbsoluteFill>
    </SpecProvider>
  );
};

import React from "react";
import { AbsoluteFill, Freeze } from "remotion";
import { CUTS, SpecProvider, useCol, useSpec, type ImageSpec, type Size } from "./Clip";
import { FontsReady, Logo, STAGE, fonts, headingWeight, sec } from "./kit";
import { scenes } from "./scenes";

// The image ad, one per cut: the hook as the headline, one product screen at
// its finished frame, the payoff line, the logo and the small print with the
// domain. The same brand and screens as the video. It runs as a second
// creative beside the video, and in its place where a platform rejects the
// video upload (Reddit has).
//   npx remotion still Image-1 out/image.png
// A slideshow's slide is the same card, 9:16, with the slide as its image
// (routines/shorts.md):
//   npx remotion still Slide-1-1 out/slide.png

/** The cut's image, or one made from its last scene: the hook, that screen at its end, its caption. */
export const imageOf = (cut: string): ImageSpec => {
  const spec = CUTS[cut]!;
  if (spec.image) return spec.image;
  const last = spec.scenes[spec.scenes.length - 1]!;
  return { hook: spec.hook, scene: last.id, at: Math.max(0, last.seconds - 0.5), line: last.caption };
};

const Card: React.FC<Size & { cut: string; image?: ImageSpec }> = ({ w, h, cut, image }) => {
  const spec = useSpec();
  const col = useCol();
  const img = image ?? imageOf(cut);
  const unit = Math.min(w, h);
  const pad = unit * 0.07;
  // A 9:16 slide keeps its top and bottom 12% clear: TikTok and Reels draw their tabs, caption and buttons there.
  const safe = h / w > 1.6 ? h * 0.12 : pad;
  const Screen = scenes[img.scene]!;
  const square = h / w < 1.1;
  const areaW = w - 2 * pad;
  const areaH = h * (square ? 0.4 : h / w > 1.6 ? 0.38 : 0.44);
  const k = Math.min(areaW / STAGE.w, areaH / STAGE.h);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "space-between", padding: `${safe}px ${pad}px ${safe === pad ? pad * 0.9 : safe}px` }}>
      <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: Math.round(unit * (square ? 0.09 : 0.105)), lineHeight: 1.02, letterSpacing: "-0.03em", color: col.fg, textAlign: "center", whiteSpace: "pre-line" }}>{img.hook}</div>
      <div style={{ position: "relative", width: STAGE.w * k, height: STAGE.h * k, borderRadius: unit * 0.018, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", flexShrink: 0 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: STAGE.w, height: STAGE.h, transform: `scale(${k})`, transformOrigin: "0 0", overflow: "hidden" }}>
          <Freeze frame={sec(img.at)}>
            <Screen />
          </Freeze>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: unit * 0.03 }}>
        <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: Math.round(unit * 0.052), color: col.fg, textAlign: "center", lineHeight: 1.15 }}>{img.line}</div>
        <div style={{ display: "flex", alignItems: "center", gap: unit * 0.035 }}>
          <Logo height={unit * 0.04} />
          <div style={{ fontFamily: fonts.body, fontSize: Math.round(unit * 0.034), color: col.muted }}>
            {img.note ?? spec.end.line} · {spec.end.cta}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ backgroundColor: useCol().bg, textRendering: "geometricPrecision" }}>{children}</AbsoluteFill>;

export const Static: React.FC<Size & { cut: string; image?: ImageSpec }> = ({ cut, image, ...size }) => (
  <SpecProvider cut={cut}>
    <Background>
      <FontsReady>
        <Card {...size} cut={cut} image={image} />
      </FontsReady>
    </Background>
  </SpecProvider>
);

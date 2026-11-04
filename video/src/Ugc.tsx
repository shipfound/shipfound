import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FontsReady, fonts } from "./kit";
import { EndCard, SpecProvider } from "./Clip";

// The parts ugc.mjs needs from the kit to finish an AI-presenter clip: the
// end card at any size and length (it runs under the voice's last line), and
// the label every presenter shot carries, as a transparent PNG.
//   npx remotion render End out/ugc/end.mp4 --props='{"w":1080,"h":1920,"seconds":2.5}'
//   npx remotion still Label out/ugc/label.png --props='{"text":"AI-generated presenter"}'

export interface EndProps {
  w: number;
  h: number;
  seconds: number;
}

export const End: React.FC<EndProps> = ({ w, h, seconds }) => (
  <SpecProvider cut="1">
    <AbsoluteFill style={{ backgroundColor: C.bg, textRendering: "geometricPrecision" }}>
      <FontsReady>
        {/* Six frames past the end: the card holds to the last frame instead of fading out. */}
        <EndCard size={{ w, h }} length={Math.round(seconds * 30) + 6} />
      </FontsReady>
    </AbsoluteFill>
  </SpecProvider>
);

export const LABEL = { w: 560, h: 76 };

/** A dark pill, white text, on a transparent frame: readable over any shot. */
export const Label: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <FontsReady>
      <div style={{ display: "inline-flex", alignItems: "center", height: LABEL.h, padding: "0 30px", borderRadius: LABEL.h / 2, background: "rgba(0,0,0,0.55)", color: "#ffffff", font: `500 30px ${fonts.body}`, whiteSpace: "nowrap", alignSelf: "flex-start" }}>{text}</div>
    </FontsReady>
  </AbsoluteFill>
);

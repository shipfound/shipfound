import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FontsReady, fonts, headingWeight } from "./kit";
import { EndCard, SpecProvider } from "./Clip";

// The parts ugc.mjs needs from the kit to finish an AI-presenter clip: the
// end card at any size and length (it runs under the voice's last line).
//   npx remotion render End out/ugc/end.mp4 --props='{"w":1080,"h":1920,"seconds":2.5}'

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

export const HOOK = { w: 1080, h: 1920 };

/**
 * The hook as a card: big text on a dark ground, the presenter talking from
 * the bubble under it. Shows no body, so a generated take's hands never show.
 */
export const Hook: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ backgroundColor: "#111111", alignItems: "center", justifyContent: "center", padding: "0 90px 380px" }}>
    <FontsReady>
      <div style={{ color: "#ffffff", fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: 104, lineHeight: 1.08, textAlign: "center" }}>{text}</div>
    </FontsReady>
  </AbsoluteFill>
);

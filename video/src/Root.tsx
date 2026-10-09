import React from "react";
import { AbsoluteFill, Composition, Freeze, OffthreadVideo, staticFile } from "remotion";
import { Clip, DURATION, FPS } from "./Clip";

// Square (1:1, for the X feed), Wide (16:9), and Sheet: one still with a
// frame every half second of the square cut, each with the safe zone drawn
// in, for the quality check before anyone sees the video. It is as long as
// the clip (a Sequence is cut at its composition's end) and rendered as frame 0.

const SHEET_COLS = 6;
const SHEET_CELL = 400;
const SHEET_FRAMES = Array.from({ length: Math.floor(DURATION / (FPS / 2)) }, (_, i) => Math.round(i * (FPS / 2) + FPS / 4));

const Sheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#202020", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
    {SHEET_FRAMES.map((f) => (
      <div key={f} style={{ position: "relative", width: SHEET_CELL, height: SHEET_CELL, overflow: "hidden", outline: "2px solid #202020" }}>
        <div style={{ width: 1200, height: 1200, transform: `scale(${SHEET_CELL / 1200})`, transformOrigin: "0 0" }}>
          <Freeze frame={f}>
            <Clip w={1200} h={1200} />
          </Freeze>
        </div>
        <div style={{ position: "absolute", inset: SHEET_CELL * 0.05, border: "1px dashed rgba(255,80,80,0.8)" }} />
        <div style={{ position: "absolute", left: 6, top: 4, font: "600 16px sans-serif", color: "#ff5050" }}>{(f / FPS).toFixed(1)}s</div>
      </div>
    ))}
  </AbsoluteFill>
);

// The same check for the founder's own clip (public/clip.mp4): 30 frames
// spread over its length. `seconds` comes from ffprobe:
//   npx remotion still ClipSheet out/clip-sheet.png --props='{"seconds":42}'
const ClipSheet: React.FC<{ seconds: number }> = ({ seconds }) => {
  const total = Math.max(1, Math.floor(seconds * FPS) - 1);
  const frames = Array.from({ length: 30 }, (_, i) => Math.round((i * total) / 29));
  return (
    <AbsoluteFill style={{ backgroundColor: "#202020", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
      {frames.map((f) => (
        <div key={f} style={{ position: "relative", width: SHEET_CELL, height: SHEET_CELL, overflow: "hidden", outline: "2px solid #202020" }}>
          <Freeze frame={f}>
            <OffthreadVideo src={staticFile("clip.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </Freeze>
          <div style={{ position: "absolute", left: 6, top: 4, font: "600 16px sans-serif", color: "#ff5050" }}>{(f / FPS).toFixed(1)}s</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <>
    <Composition id="Square" component={Clip} durationInFrames={DURATION} fps={FPS} width={1200} height={1200} defaultProps={{ w: 1200, h: 1200 }} />
    <Composition id="Wide" component={Clip} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ w: 1920, h: 1080 }} />
    <Composition id="Sheet" component={Sheet} durationInFrames={DURATION} fps={FPS} width={SHEET_COLS * SHEET_CELL} height={Math.ceil(SHEET_FRAMES.length / SHEET_COLS) * SHEET_CELL} />
    <Composition
      id="ClipSheet"
      component={ClipSheet}
      durationInFrames={FPS}
      fps={FPS}
      width={SHEET_COLS * SHEET_CELL}
      height={5 * SHEET_CELL}
      defaultProps={{ seconds: 1 }}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, Math.ceil(props.seconds * FPS)) })}
    />
  </>
);

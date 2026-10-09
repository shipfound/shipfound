import React from "react";
import { AbsoluteFill, Composition, Freeze, OffthreadVideo, staticFile } from "remotion";
import { Clip, DURATION } from "./Clip";
import { FPS } from "./kit";

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

// The flicker check, on the rendered file (frames come from several browser
// tabs, so a flicker only shows there): 12 consecutive frames of
// public/check.mp4 from `from`, zoomed on a box of the 1200x1200 cut.
//   cp out/video-1x1.mp4 public/check.mp4
//   npx remotion still Frames out/frames.png --props='{"from":570,"x":390,"y":585,"w":380,"h":60}'
interface FramesProps {
  from: number;
  x: number;
  y: number;
  w: number;
  h: number;
}
const FRAME_CELL = 760;
const Frames: React.FC<FramesProps> = ({ from, x, y, w, h }) => {
  const k = FRAME_CELL / w;
  return (
    <AbsoluteFill style={{ backgroundColor: "#202020", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ position: "relative", width: FRAME_CELL, height: h * k, overflow: "hidden", outline: "2px solid #202020" }}>
          <Freeze frame={from + i}>
            <OffthreadVideo src={staticFile("check.mp4")} muted style={{ position: "absolute", left: -x * k, top: -y * k, width: 1200 * k, height: 1200 * k, maxWidth: "none" }} />
          </Freeze>
          <div style={{ position: "absolute", left: 6, top: 4, font: "600 16px sans-serif", color: "#ff5050" }}>{from + i}</div>
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
      id="Frames"
      component={Frames}
      durationInFrames={DURATION}
      fps={FPS}
      width={3 * FRAME_CELL}
      height={4 * FRAME_CELL}
      defaultProps={{ from: 0, x: 0, y: 0, w: 1200, h: 1200 }}
      calculateMetadata={({ props }) => ({ height: Math.ceil(4 * (props.h * FRAME_CELL) / props.w) })}
    />
  </>
);

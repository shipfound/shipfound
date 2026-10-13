import React from "react";
import { AbsoluteFill, Composition, Freeze, OffthreadVideo, staticFile } from "remotion";
import { CUTS, Clip, DURATION, durationOf } from "./Clip";
import { FPS } from "./kit";
import { Static } from "./Static";

// Square (1:1, ad 1, for the X post), Wide (16:9), and per ad cut n:
// Square-n (1:1, the X and Reddit feeds), Portrait-n (4:5, the Meta feed),
// Vertical-n (9:16, Reels and Stories), and its image twin, Image-n (4:5)
// and Image-n-square (1:1). `npm run ads` renders every one of them.
//
// Sheet: one still with a frame every half second of a cut's square video,
// each with the safe zone drawn in, for the quality check before anyone sees
// it (--props='{"cut":"2"}' for ad 2). It is as long as the longest cut (a
// Sequence is cut at its composition's end) and rendered as frame 0.
// Thumbs: frame 0 of every cut in every format at 200px wide, the way a
// scroller sees it before the video plays.

export const FORMATS = [
  ["Square", 1200, 1200],
  ["Portrait", 1080, 1350],
  ["Vertical", 1080, 1920],
] as const;

const LONGEST = Math.max(...Object.keys(CUTS).map(durationOf));
const SHEET_COLS = 6;
const SHEET_CELL = 400;
const sheetFrames = (cut: string) => Array.from({ length: Math.floor(durationOf(cut) / (FPS / 2)) }, (_, i) => Math.round(i * (FPS / 2) + FPS / 4));

const Sheet: React.FC<{ cut: string }> = ({ cut }) => (
  <AbsoluteFill style={{ backgroundColor: "#202020", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
    {sheetFrames(cut).map((f) => (
      <div key={f} style={{ position: "relative", width: SHEET_CELL, height: SHEET_CELL, overflow: "hidden", outline: "2px solid #202020" }}>
        <div style={{ width: 1200, height: 1200, transform: `scale(${SHEET_CELL / 1200})`, transformOrigin: "0 0" }}>
          <Freeze frame={f}>
            <Clip w={1200} h={1200} cut={cut} />
          </Freeze>
        </div>
        <div style={{ position: "absolute", inset: SHEET_CELL * 0.05, border: "1px dashed rgba(255,80,80,0.8)" }} />
        <div style={{ position: "absolute", left: 6, top: 4, font: "600 16px sans-serif", color: "#ff5050" }}>{(f / FPS).toFixed(1)}s</div>
      </div>
    ))}
  </AbsoluteFill>
);

const THUMB_W = 200;
const Thumbs: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#202020", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", gap: 16, padding: 16 }}>
    {Object.keys(CUTS).flatMap((cut) =>
      FORMATS.map(([name, w, h]) => (
        <div key={`${cut}-${name}`} style={{ position: "relative", width: THUMB_W, height: (h * THUMB_W) / w, overflow: "hidden" }}>
          <div style={{ width: w, height: h, transform: `scale(${THUMB_W / w})`, transformOrigin: "0 0" }}>
            <Freeze frame={0}>
              <Clip w={w} h={h} cut={cut} />
            </Freeze>
          </div>
        </div>
      ))
    )}
  </AbsoluteFill>
);
const THUMBS_H = 16 + Object.keys(CUTS).length * ((1920 * THUMB_W) / 1080 + 16);

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
    {Object.keys(CUTS).flatMap((cut) => [
      ...FORMATS.map(([name, w, h]) => <Composition key={`${name}-${cut}`} id={`${name}-${cut}`} component={Clip} durationInFrames={durationOf(cut)} fps={FPS} width={w} height={h} defaultProps={{ w, h, cut }} />),
      <Composition key={`Image-${cut}`} id={`Image-${cut}`} component={Static} durationInFrames={durationOf(cut)} fps={FPS} width={1080} height={1350} defaultProps={{ w: 1080, h: 1350, cut }} />,
      <Composition key={`Image-${cut}-square`} id={`Image-${cut}-square`} component={Static} durationInFrames={durationOf(cut)} fps={FPS} width={1200} height={1200} defaultProps={{ w: 1200, h: 1200, cut }} />,
    ])}
    <Composition
      id="Sheet"
      component={Sheet}
      durationInFrames={LONGEST}
      fps={FPS}
      width={SHEET_COLS * SHEET_CELL}
      height={SHEET_CELL}
      defaultProps={{ cut: "1" }}
      calculateMetadata={({ props }) => ({ height: Math.ceil(sheetFrames(props.cut).length / SHEET_COLS) * SHEET_CELL })}
    />
    <Composition id="Thumbs" component={Thumbs} durationInFrames={1} fps={FPS} width={16 + FORMATS.length * (THUMB_W + 16)} height={Math.round(THUMBS_H)} />
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

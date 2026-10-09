import React from "react";
import { Appear, C, Camera, TerminalWindow, Typing, sec, typingFrames } from "../kit";

// An example terminal scene: a command typed in, then its output, line by
// line. Use the product's real command and its real output text (from the
// code that prints it), with demo data that belongs to no one.

const CMD = "acme check demo-shop.example";
const out = sec(0.4) + typingFrames(CMD) + sec(0.3);

const lines = [
  { text: "Checked 42 pages in 9s", color: "#a1a1aa" },
  { text: "3 fixes found", color: "#e7e7ea" },
  { text: "  page titles     missing on 12 pages", color: "#e7e7ea" },
  { text: "  share images    missing on 30 pages", color: "#e7e7ea" },
  { text: "Opened pull request #14", color: C.accent },
];

const TerminalExample: React.FC = () => (
  <TerminalWindow title="~/demo-shop">
    <Camera keys={[{ at: 0, scale: 1 }, { at: out + sec(1), scale: 1 }, { at: out + sec(2), x: 380, y: 300, scale: 1.3 }]}>
      <div style={{ padding: "28px 34px" }}>
        <div>
          <span style={{ color: C.accent }}>$ </span>
          <Typing text={CMD} at={sec(0.4)} />
        </div>
        {lines.map((l, i) => (
          <Appear key={i} at={out + i * 6} from="fade">
            <div style={{ color: l.color, whiteSpace: "pre" }}>{l.text}</div>
          </Appear>
        ))}
      </div>
    </Camera>
  </TerminalWindow>
);

export default TerminalExample;

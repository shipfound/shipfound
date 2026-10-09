import React from "react";
import { Appear, BrowserWindow, C, Camera, CountUp, Cursor, Highlight, Typing, fonts, sec, typingFrames } from "../kit";

// An example web app screen: the user pastes a link and runs a check, and the
// results come in. Recreate the real screen the same way: its layout, labels
// and copy from the product's own source, demo data that belongs to no one.

const URL_TEXT = "https://demo-shop.example";
const typed = sec(0.5) + typingFrames(URL_TEXT);
const click = typed + sec(0.4);
const results = click + sec(0.3);

const rows = [
  { label: "Page titles", state: "Fixed" },
  { label: "Share images", state: "Fixed" },
  { label: "Sitemap", state: "Submitted" },
];

const BrowserExample: React.FC = () => (
  <BrowserWindow url="app.acme.example/check" bg="#ffffff">
    <Camera keys={[{ at: 0, scale: 1 }, { at: results + sec(0.4), scale: 1 }, { at: results + sec(1.4), x: 580, y: 520, scale: 1.35 }]}>
      <div style={{ padding: "56px 64px", fontFamily: fonts.body, color: "#18181b" }}>
        <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 52 }}>Check a site</div>
        <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
          <div style={{ flex: 1, height: 80, border: "2px solid #d4d4d8", borderRadius: 12, display: "flex", alignItems: "center", padding: "0 22px", fontSize: 32 }}>
            <Typing text={URL_TEXT} at={sec(0.5)} />
          </div>
          <div style={{ height: 80, padding: "0 32px", borderRadius: 12, background: C.accent, color: C.accentFg, display: "flex", alignItems: "center", fontSize: 32, fontWeight: 700 }}>Run check</div>
        </div>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 14 }}>
          {rows.map((r, i) => (
            <Appear key={r.label} at={results + i * 5}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "22px 26px", border: "1px solid #e4e4e7", borderRadius: 12, fontSize: 34 }}>
                <span>{r.label}</span>
                <span style={{ color: "#15803d", fontWeight: 700 }}>{r.state}</span>
              </div>
            </Appear>
          ))}
        </div>
        <Appear at={results + 18}>
          <div style={{ marginTop: 30, fontSize: 40 }}>
            Score <b><CountUp from={41} to={88} at={results + 18} /></b>
          </div>
        </Appear>
      </div>
      <Highlight box={{ x: 64, y: 300, w: 1032, h: 300 }} at={results + sec(1.2)} />
    </Camera>
    <Cursor path={[{ at: sec(0.2), x: 900, y: 600 }, { at: typed, x: 1010, y: 120 }]} clicks={[click]} />
  </BrowserWindow>
);

export default BrowserExample;

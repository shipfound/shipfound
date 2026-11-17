import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Static } from "./Static";
import { B, FPS, FontsReady, Logo, fonts, headingWeight, sec } from "./kit";

// The week's social posts (skills/shipfound/routines/posts.md), 9:16. A post
// is a list of frames; each frame is one slide of a photo post and one beat
// of the same post as a video (TikTok on the web, Reels and Shorts take
// video). posts.mjs renders each frame as a PNG and the whole post as an MP4:
//   npx remotion still Post out/p.png --props=public/post.json --frame=<f>
//   npx remotion render Post out/p.mp4 --props=public/post.json
//
// The kinds, from the formats in the routine:
// - photo:  a stock or own photo, the text in a white box (the slideshow look)
// - screen: the product's own screen, the kit's card (a scene of src/scenes)
// - notes:  an iPhone Notes page, a lowercase title and a checklist
// - inbox:  an iPhone Mail inbox, the product's real email on top
// - chat:   a phone chat with the product answering, ending on a link card
// - versus: "the usual way" against the product, a table of real differences
// - video:  stock footage or the founder's own clip, lines of text over it
//
// Never an AI person or an AI image (founder, Nov 17). A stock person is
// never shown saying, holding or endorsing the product.

export const W = 1080;
export const H = 1920;
/** TikTok and Reels draw their tabs, caption and buttons over the top and bottom 12%. */
const SAFE = H * 0.12;
const BEAT = 2.5;
const SYS = '-apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

export type Frame =
  | { kind: "photo"; image: string; text: string; place?: "top" | "middle" | "bottom"; seconds?: number }
  | { kind: "screen"; scene: string; at: number; text: string; line: string; seconds?: number }
  | { kind: "notes"; title: string; date?: string; items: { text: string; done?: boolean }[]; seconds?: number }
  | { kind: "inbox"; from: string; subject: string; preview: string; time?: string; text?: string; seconds?: number }
  | { kind: "chat"; name: string; text?: string; messages: ({ from: "me" | "them"; text: string } | { card: { title: string; domain: string } })[]; seconds?: number }
  | { kind: "versus"; headline: string; left: string; right: string; rows: [string, string][]; seconds?: number }
  | { kind: "video"; clip: string; from?: number; lines: string[]; seconds: number };

export interface PostSpec {
  n: number;
  format: string;
  caption: string;
  frames: Frame[];
}

export const secondsOf = (f: Frame) => f.seconds ?? (f.kind === "notes" || f.kind === "chat" || f.kind === "versus" ? 4 : BEAT);
export const postFrames = (p: PostSpec) => p.frames.reduce((n, f) => n + sec(secondsOf(f)), 0);
/** The frame a still of frame i is taken at: its middle, once its text has landed. */
export const stillAt = (p: PostSpec, i: number) => p.frames.slice(0, i).reduce((n, f) => n + sec(secondsOf(f)), 0) + Math.floor(sec(secondsOf(p.frames[i]!)) * 0.75);

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
/** The checks a post must pass before it renders: a hook is short enough to read before the swipe. */
export function checkPost(p: PostSpec): string[] {
  const out: string[] = [];
  if (!p.frames.length) out.push(`post ${p.n}: no frames`);
  if (p.frames.length > 10) out.push(`post ${p.n}: ${p.frames.length} frames; 10 at most`);
  const first = p.frames[0];
  const hook = first ? ("text" in first && first.text) || ("title" in first && first.title) || ("headline" in first && first.headline) || ("lines" in first && first.lines[0]) || "" : "";
  if (words(String(hook)) > 12) out.push(`post ${p.n}: the hook "${hook}" is over 12 words`);
  if (postFrames(p) > sec(60)) out.push(`post ${p.n}: over 60 seconds`);
  return out;
}

/** The slideshow's text: black on a white box, centred, the way TikTok's own text tool draws it. */
const BoxText: React.FC<{ text: string; size?: number }> = ({ text, size = 64 }) => (
  <div style={{ textAlign: "center", lineHeight: 1.32, maxWidth: W * 0.84 }}>
    {text.split("\n").map((l, i) => (
      <div key={i}>
        <span style={{ background: "#fff", color: "#000", fontFamily: SYS, fontWeight: 700, fontSize: size, padding: "4px 18px", borderRadius: 10, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{l}</span>
      </div>
    ))}
  </div>
);

/** White text with a soft shadow, for over footage. */
const OverText: React.FC<{ lines: string[]; shown: number }> = ({ lines, shown }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center", maxWidth: W * 0.86 }}>
    {lines.map((l, i) => (
      <div key={i} style={{ opacity: i < shown ? 1 : 0, color: "#fff", fontFamily: SYS, fontWeight: 600, fontSize: 50, lineHeight: 1.28, textAlign: "center", textShadow: "0 2px 12px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)" }}>
        {l}
      </div>
    ))}
  </div>
);

/** A slow push in, so a still frame reads as video. */
const Drift: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, frames], [1, 1.06], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${k})` }}>{children}</AbsoluteFill>;
};

const place = (p?: "top" | "middle" | "bottom") => (p === "top" ? "flex-start" : p === "bottom" ? "flex-end" : "center");

const Photo: React.FC<{ f: Extract<Frame, { kind: "photo" }>; frames: number }> = ({ f, frames }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Drift frames={frames}>
      <Img src={staticFile(f.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Drift>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: place(f.place), padding: `${SAFE + 40}px 0` }}>
      <BoxText text={f.text} />
    </AbsoluteFill>
  </AbsoluteFill>
);

/** The logo fitted inside a box, whatever its shape: a wide wordmark is never cut by a round avatar. */
const LogoFit: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const ratio = B.logo ? B.logo.width / B.logo.height : 1;
  return <Logo height={Math.min(h, w / ratio)} />;
};

/** The space a caption takes above the phone screen: the top safe zone and two lines of text. */
const CAPTION_BAND = SAFE + 230;

/** An iPhone screen, edge to edge: the status bar, then the app. With a caption, the screen starts below it. */
const Phone: React.FC<{ bg?: string; children: React.ReactNode; caption?: string }> = ({ bg = "#fff", children, caption }) => (
  <AbsoluteFill style={{ backgroundColor: caption ? "#0d0d0d" : bg, fontFamily: SYS, color: "#000" }}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: caption ? CAPTION_BAND : 0, background: bg, borderRadius: caption ? "56px 56px 0 0" : 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 130, flexShrink: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 70px 18px", fontSize: 40, fontWeight: 600 }}>
        <span>9:41</span>
        <span style={{ letterSpacing: 4 }}>▮▮▮ ◔ ▭</span>
      </div>
      <div style={{ position: "relative", flex: 1 }}>{children}</div>
    </div>
    {caption ? (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: SAFE, height: CAPTION_BAND - SAFE }}>
        <BoxText text={caption} size={54} />
      </AbsoluteFill>
    ) : null}
  </AbsoluteFill>
);

const Notes: React.FC<{ f: Extract<Frame, { kind: "notes" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const shown = Math.min(f.items.length, Math.floor(frame / sec(0.35)) + 1);
  return (
    <Phone bg="#fbfbf8">
      <div style={{ padding: "10px 60px", color: "#e3a21a", fontSize: 44 }}>‹ Notes</div>
      <div style={{ padding: "20px 70px" }}>
        <div style={{ textAlign: "center", color: "#8e8e93", fontSize: 30, marginBottom: 30 }}>{f.date ?? ""}</div>
        <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.15, marginBottom: 46 }}>{f.title}</div>
        {f.items.slice(0, shown).map((it, i) => (
          <div key={i} style={{ display: "flex", gap: 28, alignItems: "flex-start", marginBottom: 34 }}>
            <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 24, marginTop: 4, border: it.done ? "none" : "3px solid #c7c7cc", background: it.done ? "#e3a21a" : "transparent", color: "#fff", fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{it.done ? "✓" : ""}</div>
            <div style={{ fontSize: 44, lineHeight: 1.3, color: it.done ? "#8e8e93" : "#000" }}>{it.text}</div>
          </div>
        ))}
      </div>
    </Phone>
  );
};

const INBOX_ROWS = [
  { from: "Calendar", subject: "Standup moved to 10:15 tomorrow", time: "Yesterday", dot: "#34c759" },
  { from: "Mom", subject: "Did you eat something besides coffee?", time: "Yesterday", dot: "#30b0c7" },
  { from: "Receipts", subject: "Your monthly hosting invoice is ready", time: "Monday", dot: "#ff9500" },
];

const Inbox: React.FC<{ f: Extract<Frame, { kind: "inbox" }> }> = ({ f }) => (
  <Phone caption={f.text}>
    <div style={{ padding: "0 60px", display: "flex", justifyContent: "space-between", color: "#007aff", fontSize: 42 }}>
      <span>‹ Mailboxes</span>
      <span>Edit</span>
    </div>
    <div style={{ padding: "16px 60px 20px", fontSize: 84, fontWeight: 800 }}>Inbox</div>
    <div style={{ margin: "0 60px 26px", background: "#eeeef0", borderRadius: 22, padding: "16px 26px", color: "#8e8e93", fontSize: 38 }}>Search</div>
    <div style={{ background: "#f2f6ff", padding: "30px 60px", display: "flex", gap: 26, borderBottom: "1px solid #e5e5ea" }}>
      <div style={{ width: 18, height: 18, borderRadius: 9, background: "#007aff", marginTop: 26, flexShrink: 0 }} />
      <div style={{ width: 84, height: 84, borderRadius: 42, background: "#111", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <LogoFit w={58} h={40} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40 }}>
          <b>{f.from}</b>
          <span style={{ color: "#8e8e93", fontSize: 34 }}>{f.time ?? "9:41 AM"}</span>
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, marginTop: 6 }}>{f.subject}</div>
        <div style={{ fontSize: 36, color: "#6e6e73", marginTop: 8, lineHeight: 1.3 }}>{f.preview}</div>
      </div>
    </div>
    {INBOX_ROWS.map((r) => (
      <div key={r.from} style={{ padding: "28px 60px 28px 104px", display: "flex", gap: 26, borderBottom: "1px solid #e5e5ea" }}>
        <div style={{ width: 84, height: 84, borderRadius: 42, background: r.dot, color: "#fff", fontSize: 40, fontWeight: 700, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.from[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40 }}>
            <b>{r.from}</b>
            <span style={{ color: "#8e8e93", fontSize: 34 }}>{r.time}</span>
          </div>
          <div style={{ fontSize: 36, color: "#6e6e73", marginTop: 6 }}>{r.subject}</div>
        </div>
      </div>
    ))}
  </Phone>
);

const Chat: React.FC<{ f: Extract<Frame, { kind: "chat" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const shown = Math.min(f.messages.length, Math.floor(frame / sec(0.5)) + 1);
  return (
    <Phone caption={f.text}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingBottom: 20, borderBottom: "1px solid #e5e5ea" }}>
        <div style={{ width: 96, height: 96, borderRadius: 48, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <LogoFit w={66} h={46} />
        </div>
        <div style={{ fontSize: 34 }}>{f.name} ›</div>
      </div>
      <div style={{ padding: "40px 44px 0", display: "flex", flexDirection: "column", gap: 18 }}>
        {f.messages.slice(0, shown).map((m, i) =>
          "card" in m ? (
            <div key={i} style={{ alignSelf: "flex-start", width: "68%", borderRadius: 34, overflow: "hidden", background: "#e9e9eb" }}>
              <div style={{ height: 220, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LogoFit w={420} h={90} />
              </div>
              <div style={{ padding: "18px 28px" }}>
                <div style={{ fontSize: 36, fontWeight: 600 }}>{m.card.title}</div>
                <div style={{ fontSize: 30, color: "#6e6e73" }}>{m.card.domain}</div>
              </div>
            </div>
          ) : (
            <div key={i} style={{ alignSelf: m.from === "me" ? "flex-end" : "flex-start", maxWidth: "76%", background: m.from === "me" ? "#0a84ff" : "#e9e9eb", color: m.from === "me" ? "#fff" : "#000", fontSize: 40, lineHeight: 1.3, padding: "20px 30px", borderRadius: 40 }}>
              {m.text}
            </div>
          )
        )}
      </div>
    </Phone>
  );
};

const Versus: React.FC<{ f: Extract<Frame, { kind: "versus" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const shown = Math.min(f.rows.length, Math.floor(frame / sec(0.4)) + 1);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", padding: `${SAFE}px 56px`, fontFamily: SYS, color: "#fff", justifyContent: "center" }}>
      <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: 76, lineHeight: 1.08, textAlign: "center", marginBottom: 56 }}>{f.headline}</div>
      <div style={{ background: "#fff", color: "#000", borderRadius: 28, overflow: "hidden" }}>
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, background: "#f2f2f7" }}>
          <div style={{ flex: 1, padding: "26px 30px", color: "#6e6e73" }}>{f.left}</div>
          <div style={{ flex: 1, padding: "26px 30px", display: "flex", alignItems: "center", gap: 16, borderLeft: "1px solid #e5e5ea" }}>
            <Logo height={36} />
            {f.right}
          </div>
        </div>
        {/* Every row takes its place from the start (unshown ones invisible), so the centred table never moves. */}
        {f.rows.map(([l, r], i) => (
          <div key={i} style={{ display: "flex", fontSize: 38, lineHeight: 1.3, borderTop: "1px solid #e5e5ea", opacity: i < shown ? 1 : 0 }}>
            <div style={{ flex: 1, padding: "24px 30px", color: "#6e6e73" }}>✕ {l}</div>
            <div style={{ flex: 1, padding: "24px 30px", fontWeight: 600, borderLeft: "1px solid #e5e5ea" }}>✓ {r}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Footage: React.FC<{ f: Extract<Frame, { kind: "video" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const total = sec(f.seconds);
  const shown = Math.min(f.lines.length, Math.floor((frame / Math.max(1, total * 0.7)) * f.lines.length) + 1);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile(f.clip)} startFrom={sec(f.from ?? 0)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.38)", alignItems: "center", justifyContent: "center", padding: `${SAFE}px 0` }}>
        <OverText lines={f.lines} shown={shown} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FrameView: React.FC<{ f: Frame; frames: number }> = ({ f, frames }) => {
  switch (f.kind) {
    case "photo":
      return <Photo f={f} frames={frames} />;
    case "screen":
      return <Static w={W} h={H} cut="1" image={{ hook: f.text, scene: f.scene, at: f.at, line: f.line }} />;
    case "notes":
      return <Notes f={f} />;
    case "inbox":
      return <Inbox f={f} />;
    case "chat":
      return <Chat f={f} />;
    case "versus":
      return <Versus f={f} />;
    case "video":
      return <Footage f={f} />;
  }
};

export const Post: React.FC<{ post: PostSpec }> = ({ post }) => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <FontsReady>
        {post.frames.map((f, i) => {
          const frames = sec(secondsOf(f));
          const at = from;
          from += frames;
          return (
            <Sequence key={i} from={at} durationInFrames={frames}>
              <FrameView f={f} frames={frames} />
            </Sequence>
          );
        })}
      </FontsReady>
    </AbsoluteFill>
  );
};

export const EMPTY_POST: PostSpec = { n: 1, format: "slideshow", caption: "", frames: [{ kind: "versus", headline: "Set public/post.json", left: "", right: "", rows: [] }] };
export const POST_FPS = FPS;

import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Static } from "./Static";
import { B, FPS, FontsReady, Logo, fonts, headingWeight, sec } from "./kit";

// The week's social posts (skills/shipfound/routines/posts.md), 9:16. A post
// is a list of frames; each frame is one slide of a photo post and one beat
// of the same post as a video (TikTok on the web, Reels and Shorts take
// video). posts.mjs renders each frame as a PNG and the whole post as an MP4:
//   npx remotion still Post out/p.png --props=public/post.json --frame=<f>
//   npx remotion render Post out/p.mp4 --props=public/post.json
//
// The kinds, from the formats in the routine (no stock, founder, Nov 17):
// - title:       the hook on a plain slide
// - screen:      the product's own screen, the kit's card (a scene of src/scenes)
// - notes:       an iPhone Notes page, a lowercase title and a checklist
// - inbox:       an iPhone Mail inbox, the product's real email on top
// - chat:        a phone chat with the product answering, ending on a link card
// - versus:      "the usual way" against the product, a table of real differences
// - tier:        an S to D tier list
// - beforeafter: a page, headline or number before and after a change
// - lockscreen:  an iPhone lock screen, the product's notification on top
// - calendar:    an iPhone calendar day, the product's block marked
// - guess:       two versions, A and B; with `winner`, the reveal
// - xpost:       the founder's own X post as a card
// - answer:      an AI assistant's answer, the names it gives marked
// - sheet:       a spreadsheet, one row marked

export const W = 1080;
export const H = 1920;
/** TikTok and Reels draw their tabs, caption and buttons over the top and bottom 12%. */
const SAFE = H * 0.12;
const BEAT = 2.5;
const SYS = '-apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

export type Tier = "S" | "A" | "B" | "C" | "D";
/** Text on a card; `us` marks the product's own (its logo, a highlight). */
export type Item = string | { text: string; us?: boolean };

export type Frame =
  | { kind: "title"; text: string; sub?: string; theme?: "dark" | "light"; seconds?: number }
  | { kind: "screen"; scene: string; at: number; text: string; line: string; seconds?: number }
  | { kind: "notes"; title: string; date?: string; items: { text: string; done?: boolean }[]; seconds?: number }
  | { kind: "inbox"; from: string; subject: string; preview: string; time?: string; text?: string; seconds?: number }
  | { kind: "chat"; name: string; text?: string; messages: ({ from: "me" | "them"; text: string } | { card: { title: string; domain: string } })[]; seconds?: number }
  | { kind: "versus"; headline: string; left: string; right: string; rows: [string, string][]; seconds?: number }
  | { kind: "tier"; title: string; rows: { tier: Tier; items: Item[] }[]; seconds?: number }
  | { kind: "beforeafter"; headline?: string; before: { text: string; sub?: string; label?: string }; after: { text: string; sub?: string; label?: string }; result?: string; seconds?: number }
  | { kind: "lockscreen"; time?: string; date?: string; text?: string; notifications: { app: string; title: string; body: string; when?: string; us?: boolean }[]; seconds?: number }
  | { kind: "calendar"; day: string; date: string; month?: string; text?: string; events: { start: string; end: string; title: string; us?: boolean; crossed?: boolean }[]; seconds?: number }
  | { kind: "guess"; question: string; a: string; b: string; label?: string; winner?: "a" | "b"; result?: string; seconds?: number }
  | { kind: "xpost"; name: string; handle: string; post: string; time?: string; stats?: { replies?: string; reposts?: string; likes?: string; views?: string }; avatar?: "logo" | "initial"; text?: string; seconds?: number }
  | { kind: "answer"; engine?: string; question: string; answer: string; names?: string[]; us?: string; text?: string; seconds?: number }
  | { kind: "sheet"; title: string; columns: string[]; rows: string[][]; mark?: number; text?: string; seconds?: number };

export interface PostSpec {
  n: number;
  format: string;
  caption: string;
  frames: Frame[];
}

const SECONDS: Partial<Record<Frame["kind"], number>> = { notes: 4, chat: 4, versus: 4, tier: 5, beforeafter: 4, lockscreen: 3.5, calendar: 4, guess: 3.5, xpost: 3.5, answer: 5, sheet: 4 };
export const secondsOf = (f: Frame) => f.seconds ?? SECONDS[f.kind] ?? BEAT;
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
  const hook = first ? ("text" in first && first.text) || ("title" in first && first.title) || ("headline" in first && first.headline) || ("question" in first && first.question) || "" : "";
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

// ─── Frames built from plain shapes (no stock) ─────────

const itemText = (it: Item) => (typeof it === "string" ? it : it.text);
const itemUs = (it: Item) => typeof it !== "string" && !!it.us;
/** How many of n parts are in view, one every `every` seconds from the first frame. */
const reveal = (frame: number, n: number, every: number) => Math.min(n, Math.floor(frame / sec(every)) + 1);

/** The hook alone on a plain slide, the way a slideshow's first and last slides read. */
const Title: React.FC<{ f: Extract<Frame, { kind: "title" }> }> = ({ f }) => {
  const dark = f.theme !== "light";
  return (
    <AbsoluteFill style={{ backgroundColor: dark ? "#0d0d0d" : "#f6f5f1", color: dark ? "#fff" : "#000", alignItems: "center", justifyContent: "center", padding: `${SAFE}px 80px` }}>
      <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: 96, lineHeight: 1.08, textAlign: "center", whiteSpace: "pre-line" }}>{f.text}</div>
      {f.sub ? <div style={{ marginTop: 44, fontFamily: SYS, fontSize: 46, lineHeight: 1.3, textAlign: "center", color: dark ? "#b8b8b4" : "#55554f", whiteSpace: "pre-line" }}>{f.sub}</div> : null}
    </AbsoluteFill>
  );
};

const TIER_COLORS: Record<Tier, string> = { S: "#ff7f7f", A: "#ffbf7f", B: "#ffdf7f", C: "#ffff7f", D: "#bfff7f" };

/** A tier list: each row's letter on its colour, the items on cards; rows land top to bottom. */
const TierList: React.FC<{ f: Extract<Frame, { kind: "tier" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const shown = reveal(frame, f.rows.length, 0.6);
  return (
    <AbsoluteFill style={{ backgroundColor: "#111", padding: `${SAFE}px 40px`, fontFamily: SYS, justifyContent: "center" }}>
      <div style={{ color: "#fff", fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: 70, lineHeight: 1.1, textAlign: "center", marginBottom: 44 }}>{f.title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, background: "#000" }}>
        {f.rows.map((r, i) => (
          <div key={i} style={{ display: "flex", minHeight: 170, opacity: i < shown ? 1 : 0 }}>
            <div style={{ width: 170, flexShrink: 0, background: TIER_COLORS[r.tier], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 84, fontWeight: 700, color: "#111" }}>{r.tier}</div>
            <div style={{ flex: 1, background: "#1e1e1c", display: "flex", flexWrap: "wrap", alignContent: "center", gap: 14, padding: "16px 18px" }}>
              {r.items.map((it, k) =>
                itemUs(it) ? (
                  <div key={k} style={{ background: "#111", border: "4px solid #fff", borderRadius: 16, padding: "14px 22px", display: "flex", alignItems: "center", gap: 16, color: "#fff", fontSize: 38, fontWeight: 700 }}>
                    <LogoFit w={200} h={40} />
                    {itemText(it) ? <span>{itemText(it)}</span> : null}
                  </div>
                ) : (
                  <div key={k} style={{ background: "#f2f2ee", color: "#111", borderRadius: 16, padding: "16px 24px", fontSize: 38, fontWeight: 600, lineHeight: 1.2 }}>
                    {itemText(it)}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** One side of before and after: a tag, then the line set like a page's own headline. */
const BACard: React.FC<{ tag: string; color: string; text: string; sub?: string; dim?: boolean }> = ({ tag, color, text, sub, dim }) => (
  <div style={{ background: "#fff", borderRadius: 30, overflow: "hidden", opacity: dim ? 0.55 : 1 }}>
    <div style={{ background: "#ececea", padding: "16px 26px", display: "flex", alignItems: "center", gap: 12 }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />
      ))}
      <div style={{ marginLeft: "auto", background: color, color: "#fff", fontSize: 30, fontWeight: 800, letterSpacing: 2, padding: "6px 18px", borderRadius: 10 }}>{tag}</div>
    </div>
    <div style={{ padding: "46px 50px 54px", color: "#111" }}>
      <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: 62, lineHeight: 1.1 }}>{text}</div>
      {sub ? <div style={{ marginTop: 22, fontFamily: SYS, fontSize: 36, lineHeight: 1.35, color: "#55554f" }}>{sub}</div> : null}
    </div>
  </div>
);

const BeforeAfter: React.FC<{ f: Extract<Frame, { kind: "beforeafter" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const after = frame >= sec(1.2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0d", padding: `${SAFE}px 56px`, fontFamily: SYS, justifyContent: "center", gap: 34 }}>
      {f.headline ? <div style={{ color: "#fff", fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: 72, lineHeight: 1.1, textAlign: "center", marginBottom: 10 }}>{f.headline}</div> : null}
      <BACard tag={f.before.label ?? "BEFORE"} color="#d64545" text={f.before.text} sub={f.before.sub} dim={after} />
      <div style={{ opacity: after ? 1 : 0 }}>
        <BACard tag={f.after.label ?? "AFTER"} color="#1f9d55" text={f.after.text} sub={f.after.sub} />
      </div>
      {f.result ? (
        <div style={{ opacity: frame >= sec(2) ? 1 : 0, alignSelf: "center" }}>
          <BoxText text={f.result} size={52} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** An app's icon: the product's logo on black, or a letter on a colour. */
const AppIcon: React.FC<{ name: string; us?: boolean; size: number; color?: string }> = ({ name, us, size, color = "#8e8e93" }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: us ? "#111" : color, color: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.48, fontWeight: 700, overflow: "hidden" }}>
    {us ? <LogoFit w={size * 0.78} h={size * 0.5} /> : name[0]}
  </div>
);

const ICON_COLORS = ["#34c759", "#0a84ff", "#ff9500", "#af52de", "#ff2d55"];

const LockScreen: React.FC<{ f: Extract<Frame, { kind: "lockscreen" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const shown = reveal(frame, f.notifications.length, 0.45);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg, #1d2b4a 0%, #3b2a5c 55%, #12121c 100%)", fontFamily: SYS, color: "#fff", alignItems: "center" }}>
      <div style={{ marginTop: SAFE + 10, fontSize: 44, fontWeight: 600, opacity: 0.9 }}>{f.date ?? "Wednesday, November 18"}</div>
      <div style={{ fontSize: 250, fontWeight: 600, lineHeight: 1, letterSpacing: -6, marginTop: 6 }}>{f.time ?? "7:42"}</div>
      <div style={{ width: "100%", padding: "0 44px", marginTop: 90, display: "flex", flexDirection: "column", gap: 18 }}>
        {f.notifications.slice(0, shown).map((n, i) => (
          <div key={i} style={{ background: "rgba(245,245,250,0.82)", color: "#000", borderRadius: 40, padding: "26px 30px", display: "flex", gap: 24, alignItems: "flex-start" }}>
            <AppIcon name={n.app} us={n.us} size={84} color={ICON_COLORS[i % ICON_COLORS.length]} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 34 }}>
                <b>{n.title}</b>
                <span style={{ color: "#6e6e73", fontSize: 30, flexShrink: 0, marginLeft: 16 }}>{n.when ?? "now"}</span>
              </div>
              <div style={{ fontSize: 34, lineHeight: 1.3, marginTop: 4, color: "#1c1c1e" }}>{n.body}</div>
            </div>
          </div>
        ))}
      </div>
      {f.text ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: SAFE + 30 }}>
          <BoxText text={f.text} size={52} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

const minutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};
const hourLabel = (h: number) => (h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "Noon" : `${h - 12} PM`);
const EVENT_COLORS = ["#5e9cf5", "#f2a33a", "#b07ee8", "#4cc38a", "#ef6f6c"];

const Calendar: React.FC<{ f: Extract<Frame, { kind: "calendar" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const shown = reveal(frame, f.events.length, 0.35);
  const from = Math.floor(Math.min(...f.events.map((e) => minutes(e.start))) / 60);
  const to = Math.ceil(Math.max(...f.events.map((e) => minutes(e.end))) / 60);
  const hours = Math.max(1, to - from);
  const PX = Math.min(150, 1180 / hours);
  return (
    <Phone caption={f.text}>
      <div style={{ padding: "0 50px", color: "#ff3b30", fontSize: 42 }}>‹ {f.month ?? "November"}</div>
      <div style={{ padding: "18px 50px 22px", display: "flex", alignItems: "baseline", gap: 20, borderBottom: "1px solid #e5e5ea" }}>
        <span style={{ fontSize: 76, fontWeight: 800 }}>{f.day}</span>
        <span style={{ fontSize: 76, fontWeight: 300, color: "#ff3b30" }}>{f.date}</span>
      </div>
      <div style={{ position: "relative", margin: "24px 40px 0 0", height: hours * PX + 40 }}>
        {Array.from({ length: hours + 1 }, (_, i) => (
          <div key={i} style={{ position: "absolute", top: i * PX, left: 0, right: 0, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 150, textAlign: "right", fontSize: 28, color: "#8e8e93" }}>{hourLabel(from + i)}</span>
            <div style={{ flex: 1, height: 1, background: "#e5e5ea" }} />
          </div>
        ))}
        {f.events.slice(0, shown).map((e, i) => {
          const top = ((minutes(e.start) - from * 60) / 60) * PX;
          const h = Math.max(70, ((minutes(e.end) - minutes(e.start)) / 60) * PX - 6);
          const c = e.us ? "#111" : EVENT_COLORS[i % EVENT_COLORS.length]!;
          return (
            <div key={i} style={{ position: "absolute", top: top + 4, left: 176, right: 0, height: h, background: e.us ? "#111" : `${c}33`, borderLeft: `8px solid ${c}`, borderRadius: 12, padding: "12px 20px", color: e.us ? "#fff" : "#1c1c1e", display: "flex", alignItems: "flex-start", gap: 16, overflow: "hidden" }}>
              {e.us ? <LogoFit w={150} h={34} /> : null}
              <span style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.2, textDecoration: e.crossed ? "line-through" : "none", opacity: e.crossed ? 0.5 : 1 }}>{e.title}</span>
            </div>
          );
        })}
      </div>
    </Phone>
  );
};

const GuessCard: React.FC<{ tag: string; text: string; state: "open" | "won" | "lost"; label?: string }> = ({ tag, text, state, label }) => (
  <div style={{ position: "relative", background: "#fff", borderRadius: 30, padding: "40px 46px 50px", border: state === "won" ? "8px solid #1f9d55" : "8px solid transparent", opacity: state === "lost" ? 0.45 : 1 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, background: "#111", color: "#fff", fontSize: 40, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{tag}</div>
      {label ? <span style={{ fontSize: 30, color: "#8e8e93", fontFamily: SYS }}>{label}</span> : null}
      {state === "won" ? <span style={{ marginLeft: "auto", background: "#1f9d55", color: "#fff", fontSize: 32, fontWeight: 800, letterSpacing: 2, padding: "8px 20px", borderRadius: 12, fontFamily: SYS }}>WINNER</span> : null}
    </div>
    <div style={{ fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: 58, lineHeight: 1.12, color: "#111" }}>{text}</div>
  </div>
);

const Guess: React.FC<{ f: Extract<Frame, { kind: "guess" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const revealed = !!f.winner && frame >= sec(0.8);
  const state = (side: "a" | "b") => (!revealed ? "open" : f.winner === side ? "won" : "lost");
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0d", padding: `${SAFE}px 56px`, fontFamily: SYS, justifyContent: "center", gap: 34 }}>
      <div style={{ color: "#fff", fontFamily: fonts.heading, fontWeight: headingWeight, fontSize: 74, lineHeight: 1.1, textAlign: "center", marginBottom: 10 }}>{f.question}</div>
      <GuessCard tag="A" text={f.a} state={state("a")} label={f.label} />
      <GuessCard tag="B" text={f.b} state={state("b")} label={f.label} />
      {f.result ? (
        <div style={{ opacity: revealed && frame >= sec(1.4) ? 1 : 0, alignSelf: "center" }}>
          <BoxText text={f.result} size={52} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const XPost: React.FC<{ f: Extract<Frame, { kind: "xpost" }> }> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: "#15181c", padding: `${SAFE}px 50px`, fontFamily: SYS, justifyContent: "center", gap: 50 }}>
    {f.text ? (
      <div style={{ alignSelf: "center" }}>
        <BoxText text={f.text} size={54} />
      </div>
    ) : null}
    <div style={{ background: "#000", border: "2px solid #2f3336", borderRadius: 36, padding: "44px 46px", color: "#e7e9ea" }}>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {f.avatar === "logo" ? (
          <div style={{ width: 100, height: 100, borderRadius: 50, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <LogoFit w={74} h={50} />
          </div>
        ) : (
          <div style={{ width: 100, height: 100, borderRadius: 50, background: "#1d9bf0", color: "#fff", fontSize: 50, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{f.name[0]}</div>
        )}
        <div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{f.name}</div>
          <div style={{ fontSize: 36, color: "#71767b" }}>@{f.handle.replace(/^@/, "")}</div>
        </div>
      </div>
      <div style={{ fontSize: 46, lineHeight: 1.35, marginTop: 34, whiteSpace: "pre-line" }}>{f.post}</div>
      <div style={{ fontSize: 32, color: "#71767b", marginTop: 34 }}>{f.time ?? "9:41 PM · Nov 18, 2026"}</div>
      {f.stats ? (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 32, color: "#71767b", marginTop: 28, paddingTop: 26, borderTop: "1px solid #2f3336" }}>
          <span>💬 {f.stats.replies ?? ""}</span>
          <span>🔁 {f.stats.reposts ?? ""}</span>
          <span>♡ {f.stats.likes ?? ""}</span>
          <span>📊 {f.stats.views ?? ""}</span>
        </div>
      ) : null}
    </div>
  </AbsoluteFill>
);

/** The answer's text with each name in `names` in bold, the product's on a highlight. */
const marked = (text: string, names: string[], us?: string) => {
  if (!names.length && !us) return [text];
  const all = [...names, ...(us ? [us] : [])].filter(Boolean).sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${all.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return text.split(re).map((part, i) =>
    us && part === us ? (
      <span key={i} style={{ background: "#fff3a3", fontWeight: 700, padding: "0 6px", borderRadius: 6 }}>{part}</span>
    ) : all.includes(part) ? (
      <b key={i}>{part}</b>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
};

const Answer: React.FC<{ f: Extract<Frame, { kind: "answer" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const chars = Math.floor(interpolate(frame, [sec(0.6), sec(3.4)], [0, f.answer.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const shown = f.answer.slice(0, chars);
  return (
    <Phone caption={f.text}>
      <div style={{ padding: "0 50px 22px", display: "flex", justifyContent: "center", fontSize: 40, fontWeight: 600, borderBottom: "1px solid #ececec" }}>{f.engine ?? "ChatGPT"}</div>
      <div style={{ padding: "40px 50px", display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ alignSelf: "flex-end", maxWidth: "80%", background: "#f4f4f4", borderRadius: 40, padding: "22px 32px", fontSize: 40, lineHeight: 1.3 }}>{f.question}</div>
        <div style={{ fontSize: 40, lineHeight: 1.45, color: "#0d0d0d", whiteSpace: "pre-line" }}>{marked(shown, f.names ?? [], f.us)}</div>
      </div>
    </Phone>
  );
};

const COLS = "ABCDEFGH";

const Sheet: React.FC<{ f: Extract<Frame, { kind: "sheet" }> }> = ({ f }) => {
  const frame = useCurrentFrame();
  const shown = reveal(frame, f.rows.length, 0.35);
  const cell = { padding: "18px 16px", borderRight: "1px solid #e1e1e1", borderBottom: "1px solid #e1e1e1", fontSize: 32, lineHeight: 1.25 } as const;
  const widths = f.columns.map((_, i) => (i === 0 ? 1.6 : 1));
  return (
    <Phone caption={f.text}>
      <div style={{ background: "#fff", padding: "0 36px 18px", display: "flex", alignItems: "center", gap: 18, borderBottom: "1px solid #e1e1e1" }}>
        <div style={{ width: 54, height: 70, borderRadius: 8, background: "#0f9d58", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 30, height: 34, border: "4px solid #fff", borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 40, fontWeight: 500 }}>{f.title}</div>
      </div>
      <div style={{ display: "flex", background: "#f8f9fa", fontSize: 28, color: "#5f6368" }}>
        <div style={{ width: 60, borderRight: "1px solid #e1e1e1", borderBottom: "1px solid #e1e1e1" }} />
        {f.columns.map((_, i) => (
          <div key={i} style={{ flex: widths[i], textAlign: "center", padding: "8px 0", borderRight: "1px solid #e1e1e1", borderBottom: "1px solid #e1e1e1" }}>{COLS[i]}</div>
        ))}
      </div>
      {[f.columns, ...f.rows].map((row, r) => {
        const isMark = f.mark !== undefined && r - 1 === f.mark;
        return (
          <div key={r} style={{ display: "flex", background: r === 0 ? "#f1f3f4" : isMark ? "#d9f2e3" : "#fff", opacity: r === 0 || r - 1 < shown ? 1 : 0, fontWeight: r === 0 || isMark ? 700 : 400 }}>
            <div style={{ width: 60, textAlign: "center", padding: "18px 0", background: "#f8f9fa", color: "#5f6368", fontSize: 28, borderRight: "1px solid #e1e1e1", borderBottom: "1px solid #e1e1e1" }}>{r + 1}</div>
            {row.map((c, i) => (
              <div key={i} style={{ ...cell, flex: widths[i] }}>{c}</div>
            ))}
          </div>
        );
      })}
    </Phone>
  );
};

const FrameView: React.FC<{ f: Frame }> = ({ f }) => {
  switch (f.kind) {
    case "title":
      return <Title f={f} />;
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
    case "tier":
      return <TierList f={f} />;
    case "beforeafter":
      return <BeforeAfter f={f} />;
    case "lockscreen":
      return <LockScreen f={f} />;
    case "calendar":
      return <Calendar f={f} />;
    case "guess":
      return <Guess f={f} />;
    case "xpost":
      return <XPost f={f} />;
    case "answer":
      return <Answer f={f} />;
    case "sheet":
      return <Sheet f={f} />;
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
              <FrameView f={f} />
            </Sequence>
          );
        })}
      </FontsReady>
    </AbsoluteFill>
  );
};

export const EMPTY_POST: PostSpec = { n: 1, format: "screens", caption: "", frames: [{ kind: "versus", headline: "Set public/post.json", left: "", right: "", rows: [] }] };
export const POST_FPS = FPS;

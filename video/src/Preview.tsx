import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";
import { C, FontsReady, fonts, headingWeight, sec } from "./kit";

// The App Store app preview: the app's own screen, recorded in the
// simulator, with a caption over each part. Apple requires a preview to be
// captured from the app itself, so nothing here is recreated or animated:
// the recordings are cut, captioned and sized. It autoplays muted at the top
// of the product page, so the captions carry it. 15 to 30 seconds, 30 fps,
// a silent audio track. The spec is public/preview.json (preview.mjs).

export interface PreviewClip {
  /** A recording in public/, e.g. "rec1.mp4". */
  file: string;
  /** Seconds into the recording to start and end this part. */
  from: number;
  to: number;
  /** What the viewer gets, in the words people search; 7 words or fewer. Empty: no caption. */
  caption: string;
}

export interface PreviewSpec {
  clips: PreviewClip[];
}

/** Apple's app preview sizes, portrait. */
export const PREVIEW_SIZES = { iphone: { w: 886, h: 1920 }, ipad: { w: 1200, h: 1600 } } as const;

export const previewFrames = (s: PreviewSpec) => s.clips.reduce((n, c) => n + sec(c.to - c.from), 0);

export const Preview: React.FC<PreviewSpec> = ({ clips }) => {
  const { width, height } = useVideoConfig();
  const starts = clips.reduce<number[]>((acc, c, i) => [...acc, i ? acc[i - 1]! + sec(clips[i - 1]!.to - clips[i - 1]!.from) : 0], []);
  return (
    <FontsReady>
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        {clips.map((c, i) => (
          <Sequence key={i} from={starts[i]} durationInFrames={sec(c.to - c.from)}>
            <AbsoluteFill>
              <OffthreadVideo src={staticFile(c.file)} startFrom={sec(c.from)} muted style={{ width, height, objectFit: "cover" }} />
              {c.caption ? (
                <div
                  style={{
                    position: "absolute",
                    left: width * 0.06,
                    right: width * 0.06,
                    top: height * 0.07,
                    padding: `${width * 0.035}px ${width * 0.045}px`,
                    borderRadius: width * 0.04,
                    backgroundColor: "rgba(0,0,0,0.66)",
                    color: "#ffffff",
                    fontFamily: fonts.heading,
                    fontWeight: headingWeight,
                    fontSize: width * 0.068,
                    lineHeight: 1.15,
                    textAlign: "center",
                  }}
                >
                  {c.caption}
                </div>
              ) : null}
            </AbsoluteFill>
          </Sequence>
        ))}
      </AbsoluteFill>
    </FontsReady>
  );
};

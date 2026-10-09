# Routine: video

A 15 second video of the real product, for a boost on X: only the product, in the founder's own branding, with no sound. Made on their machine from screenshots of their own product, cut from a fixed template, and checked frame by frame before they see it. Free: nothing runs on Shipfound's servers.

Input: `redo`, or nothing. A boost (routines/boost.md) starts this routine when it has no video.

## What it is

- **Real screens only.** Playwright opens the product and takes a screenshot of each step; Remotion cuts them into the video: the hook (2 seconds), three steps (3 seconds each, the screen, then a zoom to the part that matters), the result (2 seconds) and an end card (2 seconds). Two files: 1:1 at 1200x1200 for the feed and 16:9 at 1920x1080, H.264.
- **Their brand.** The capture reads the landing page: the logo as its header shows it, the font files its headings and body text use, and its background, text, muted and accent colors. The hook and end card carry the logo; every caption is in their heading font.
- **Only the product, no sound.** No music, no voiceover, no sound effects: the files have no audio track. No AI video or images of the product (models redraw the interface and invent features), no AI people, no stock footage. 30 seconds at most, their own clip included.
- **Truthful.** Every word on screen comes from the post being boosted or the landing page. A caption names what the screen shows, never a number or result the screen does not show.

## Hard lines here

- Never type the founder's password. To get into the live app, they sign in by hand in the window the capture opens. A local demo account with seed data is fine, its password read from an environment variable, never written in a file.
- Never show private data: other people's emails, names, keys, tokens, customer data or invoices. Blur them (`blur` in shots.json), or use a demo account.
- Never put the video anywhere: it stays in their repo folder until they attach it to a post or an ad themselves.

## Procedure

1. **Is there one already?** In the root of their repo, look for `.shipfound/video/out/video-1x1.mp4` (or `public/clip.mp4`, their own clip, there). If it is there and under 30 days old, and the input is not `redo`, show them its sheet (`out/sheet.png`, or `out/clip-sheet.png`) and ask whether to use it or make a new one. Using it: done, go back to the caller.
2. **Set up the kit**, in `.shipfound/video/` at the root of their repo: copy the plugin's [video/](../../../video/) folder there (if the skill was copied on its own, fetch it from https://github.com/shipfound/shipfound/tree/main/video). Add `.shipfound/` to `.git/info/exclude`, so it is never committed and their `.gitignore` is not touched. Then `npm install` and `npx playwright install chromium` in that folder (a few hundred MB, once). If installing is blocked (no network, a sandbox), say what to run and stop.
3. **Pick the flow.** The one thing the product does for a buyer, in three steps and a result: the input, the work, the output, and what it gets them. Take it from the landing page and the post being boosted. Say it to the founder in one line per step and let them change it.
4. **Where the screens come from**, in this order:
   - The app running locally with seed data, if the repo has a seed script and starting the app takes one command. Start it, and stop it when done.
   - The live app: `login` in shots.json, and the founder signs in by hand in the window that opens. Ask them to use a demo or test account if they have one.
   - Their own landing page, when the product has no screens to show (an API or a CLI): its hero, its how-it-works and its result sections. Say it plainly: "Your product has no screen to show, so the video is cut from your landing page."
   - Their own clip, if they have a screen recording they like. Skip to step 8 with it: it is checked the same way and not cut.
5. **Write `shots.json`** (see `shots.example.json`): four shots named 1 to 4, the steps to reach each, the element each zooms to (`focus`: a button, a result, a number, not a whole page), what to `blur`, and banners to `hide`. Keep the 1160x900 viewport: it fills the square frame. When the app is not on the landing page's domain, set `brand.url` to the landing page. Run `node capture.mjs`: it reads the brand first, then takes the shots.
6. **Check the brand and each screenshot** before anything else. Look at `public/brand/logo.png`: it must be their whole logo and nothing else (not a menu icon, not cut off); if not, set `brand.logo` to the right selector and run it again. `capture.mjs` prints the fonts and colors it found: a font "not found" falls back to Inter, so say so. Then each screenshot in `public/shots/` at full size. Retake (fix the steps, wait longer, blur more) if you see any of these:
   - a spinner, a skeleton, a blank or half-loaded area, an empty state
   - an error, a toast, a dev overlay, a cookie banner, a chat widget
   - an email, a name, a key, a token or any customer's data
   - the focus box on the wrong element (capture.mjs prints each one)
7. **Write `public/video.json`** (see `video.example.json`): `hook` is the post's first line or the landing page headline, cut to 8 words or fewer; one caption per step, 7 words or fewer, saying what the screen shows; the result's caption, what it gets the buyer; the end card is the product name, one short line from the landing page and the bare domain. Leave out `colors`: they come from the brand. Set them only to fix one the capture read wrong.
8. **Check the cut.** Run `npm run sheet` and look at `out/sheet.png`: a frame every half second with the safe zone drawn in red. Retake if a caption is cut off, outside the red box, or over something that matters, if any frame is blank or shows the problems in step 6, or if a step's zoom lands on nothing. At most 2 retakes; if it is still not clean, say exactly why, show nothing, and stop. For their own clip: copy it in without its sound, `npx remotion ffmpeg -y -i <their file> -an -c:v copy "$PWD/public/clip.mp4"`; read its length, `npx remotion ffprobe -v error -show_entries format=duration -of csv=p=0 public/clip.mp4` (30 seconds at most: a longer one is not used, so ask for a shorter cut or make one from screens); then `npx remotion still ClipSheet out/clip-sheet.png --props='{"seconds":<length>}'` and check those 30 frames the same way. It is used as it is, not cut.
9. **Render** (not for their own clip, which is ready as it is). `npm run render`. Show them `out/sheet.png` and give the two paths: `out/video-1x1.mp4` for the post and the ad, `out/video-16x9.mp4` for anywhere else. Ask if they want any caption changed; a change is a new `video.json` and steps 8 and 9 again.
10. If a boost started this routine, go back to it. Otherwise close as SKILL.md says, with 0 credits.

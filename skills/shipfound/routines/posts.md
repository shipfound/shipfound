# Routine: posts

The week's social posts: 6 short posts for TikTok, Instagram Reels and YouTube Shorts (the same post on each) and X, made from the product itself and phone screens built in the kit, no stock (founder, Nov 17), for the 2 or 3 people the product is for, leaning toward the goal the founder picked. You make them on the founder's machine with the video kit and fill each platform's own scheduler in the founder's Chrome; the founder presses Schedule, about 10 minutes for the week. The views come back at the next sitting; the format with the most views stays in every week.

Input: `read` (read last week's views only), links to posts that worked (remake them), or nothing.

Grow offers it once a week, pinned first like the App Store and SEO sets. The posts go out from the founder's own accounts: with no TikTok or Instagram yet, run the social routine first.

## What it is

- **The variety.** Each week's 6 come from `social_set`: a slideshow of the product's screens and an AI presenter video every week, then 4 formats in turn, least recently posted first: a Notes list, the product's real email in an inbox, a chat with the product, us vs them, a tier list (S to D), before and after, a lock screen, a calendar day, guess the winner (A or B), the founder's X post, an AI answer, a spreadsheet. Once three formats have views, the one with the most is in every week and the one with the fewest sits the week out. Remakes take a rotating slot. The formats and what keeps each true are in `social_set`'s `formats`; follow them.
- **Hooks for one person.** Each slot names the audience its hook is for. The hook is that person's moment in their own words, 12 words at most, lowercase where it reads as a person talking: "shipped it last week. now what?", "things i stopped doing by hand this month", "POV: you just shipped and need customers", "my analytics vs my actual signups". Never the product's name in the hook. Every hook passes the stranger test (routines/video.md, "The words: the stranger test").
- **The product inside a story, never an ad.** It shows the way a phone shows it: the email at the top of the inbox, the line in the Notes list, the one answering in the chat, the screen on a later slide. The last frame or the caption gives the one next step for the goal: search its name, or "link in bio".
- **The goal.** `goal.line` says what each week leans toward (downloads, paying users, a following, a launch); every caption's next step follows it.
- **Real material.** Guess the winner needs a real A/B test (`experiment_results`), the X post a post the founder really posted, the AI answer the product's last AI visibility check (`visibility`), the spreadsheet the founder's own numbers. When a slot's format has nothing real to be made from this week, use the next rotating format not in the week, and say so.

## Hard lines here

- One account per platform: the founder's own. Never a second account, an account farm, bought views or follows.
- True. A first-person story is the founder's own, from what they did and shipped (ask them when unsure). A number is theirs, or a demo screen shown as one. Never a made-up friend, customer, chat, review, quote or result. A POV hook about the buyer's moment is fine; "I found this app and it changed my life" from a stranger is not.
- A Kids category app speaks to the parent: never a child as the audience, never a frame that asks a child to download or buy.
- The founder presses Schedule or Post. You fill everything up to that button and stop.

## Procedure

1. **Accounts.** Read `access` for the tiktok, instagram, youtube and x areas. TikTok or Instagram missing: run the social routine first and come back. Instagram schedules through Meta Business Suite, which needs it as a Business account linked to a Facebook Page (the social routine's step for ads does that). YouTube and X are optional: leave out a platform the founder has no account on.
2. **The week.** Read the founder's time zone from their machine (`node -e "console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)"`) and call `social_set` with `tz`.
   - No `goal` yet: ask once, a numbered list, one line each from what `GOAL_LINES` says in `next`; call again with `goal`.
   - No `audiences` yet: read the site and write the 2 or 3 people it is for, in their words; show them; change what the founder says; call again with `audiences`.
   - The founder pasted links to posts that worked: pass them as `remakes`.
   - `saved` is there: this week's are made; go to step 6 or 7 for what is left.
3. **Write the 6.** For each slot in order: its format's guide, its audience, its time. Write the frames (the kit's kinds below), the hook first, and the caption: one line in the founder's voice (`notes_voice` has it when it was read), the next step for the goal, then 3 to 5 hashtags. For X, the same post with the hook as the text. Show all 6 at once, one compact block each: the time, the format, the hook, each frame in a few words, the caption. Wait for the founder's yes; change what they say.
4. **Make them.**
   1. The kit is `.shipfound/video/` at the root of their repo; set it up as routines/video.md step 2 says when it is missing (copy `src/Posts.tsx`, `src/Root.tsx`, `posts.mjs` and `package.json` over an older kit), and build the product's scenes (steps 3 to 5) when a post uses a `screen` frame.
   2. Write `public/posts.json`: `{ "product", "week", "posts": [{ "n", "format", "caption", "frames": [...] }] }`. Frames, each with optional `seconds`:
      - `{ "kind": "title", "text": "shipped it last week.\nnow what?", "sub": "<optional line>", "theme": "dark" }` (or `light`)
      - `{ "kind": "screen", "scene": "<kit scene>", "at": 3, "text": "<headline>", "line": "<line>" }`
      - `{ "kind": "notes", "title": "things i stopped doing by hand", "date": "November 17", "items": [{ "text": "...", "done": true }] }`
      - `{ "kind": "inbox", "from": "<product>", "subject": "<its real email's subject>", "preview": "<its first lines>", "text": "<optional caption above>" }`
      - `{ "kind": "chat", "name": "<product>", "text": "<optional caption>", "messages": [{ "from": "me", "text": "..." }, { "from": "them", "text": "..." }, { "card": { "title": "<product>", "domain": "<domain>" } }] }`
      - `{ "kind": "versus", "headline": "...", "left": "The usual way", "right": "With <product>", "rows": [["...", "..."]] }`
      - `{ "kind": "tier", "title": "...", "rows": [{ "tier": "S", "items": ["...", { "text": "", "us": true }] }, { "tier": "A", "items": ["..."] }] }` (`us`: the product's logo card)
      - `{ "kind": "beforeafter", "headline": "...", "before": { "text": "<old line>", "sub": "..." }, "after": { "text": "<new line>", "sub": "..." }, "result": "<what changed>" }`
      - `{ "kind": "lockscreen", "text": "<optional caption>", "notifications": [{ "app": "<product>", "us": true, "title": "...", "body": "...", "when": "now" }, { "app": "Messages", "title": "...", "body": "..." }] }`
      - `{ "kind": "calendar", "day": "Tuesday", "date": "18", "text": "<optional caption>", "events": [{ "start": "09:00", "end": "11:00", "title": "..." }, { "start": "13:30", "end": "13:45", "title": "...", "us": true }, { "start": "12:00", "end": "13:30", "title": "...", "crossed": true }] }`
      - `{ "kind": "guess", "question": "which headline got more signups?", "label": "home page", "a": "...", "b": "..." }`, then the same frame with `"winner": "b", "result": "B, by 2.1x"`
      - `{ "kind": "xpost", "name": "...", "handle": "...", "avatar": "logo", "post": "<the post word for word>", "time": "...", "stats": { "replies", "reposts", "likes", "views" }, "text": "<optional caption>" }`
      - `{ "kind": "answer", "engine": "ChatGPT", "question": "...", "answer": "<the answer as it came back>", "names": ["<other names>"], "us": "<product>", "text": "<optional caption>" }`
      - `{ "kind": "sheet", "title": "...", "columns": ["what", "cost", "signups"], "rows": [["...", "...", "..."]], "mark": 4, "text": "<optional caption>" }` (`mark`: the row index to highlight)
   4. `npm run posts`. It writes `post<n>-slide<k>.png`, `post<n>.mp4` and `post<n>-caption.txt` for every post to `~/Desktop/<product>-posts-<week>/`. Open every slide and look: the hook whole and readable, nothing cut, the top and bottom 12% clear of text. Fix and render again until each passes.
   5. The AI presenter post: the ugc routine with input `post` and this slot's hook (it prices the video and asks first). Copy its `ugc-video-vertical.mp4` to the week's Desktop folder as `post<n>.mp4` and write `post<n>-caption.txt` next to it; it is not in `posts.json`.
   6. Save them to Assets with `assets_save` (`kind` slideshow for the slides, video for the MP4s, `source` posts; titled "Post <n>, slide <k>" and "Post <n>"), run each `curl`, then `confirm`.
5. **Save the week.** `social_posts_save` with `tz` and every post: `n`, `format`, `audience`, `hook`, `caption`, `at` (from its slot), `assetIds`, `platforms`.
6. **Schedule, in the founder's Chrome.** One platform at a time, each post at its `at`. Upload with the browser's file upload tool from the Desktop folder. Fill everything, then stop at the Schedule button for the founder to press; after they do, `social_posts_update` with `status` scheduled. If a platform asks for a login, a code or a check that it is a person, the founder does it.
   - **TikTok** (TikTok Studio, `scheduler` in `platforms`): Upload `post<n>.mp4` (or the slides, where Studio offers a photo post), the caption, Content disclosure with "Your brand" on, then Schedule with the date and time. TikTok schedules up to 10 days ahead.
   - **Instagram** (Meta Business Suite's composer): a Reel with `post<n>.mp4`, or a carousel with the slides for a slideshow; the caption; then Schedule with the date and time.
   - **YouTube Shorts** (YouTube Studio): Create, Upload videos, `post<n>.mp4`; the hook as the title, the caption as the description, not made for kids unless the app is, then Visibility, Schedule.
   - **X**: the composer with the image or video and the X text; the schedule icon with the date and time. Without X Premium the schedule may be missing: then fill the post on its day at grow, for the founder to post.
   For the AI presenter post, TikTok's AI-generated content switch is on, and Instagram's AI info label where Meta offers it.
   When all are scheduled, `record_action` once: `module` COMMUNITIES, `kind` POST, `title` "This week's <n> posts scheduled", `meta` `{ type: "posts", week, count }`. It is Claimed; nothing is verified until a post is live.
7. **Read** (input `read`, or at the start of next week's set). For each post of last week, in the founder's Chrome: TikTok Studio's posts list, Meta Business Suite's insights for the Reels, YouTube Studio's content list, and X's post analytics. Read each post's views and likes and its link. `social_posts_update` with them (`status` posted, `url`, `views`, `likes`). Then say in a few lines: views per format (median and the best post with its link), and what next week has more of. For the first live TikTok post of the week, `record_action` with its `url` (`module` COMMUNITIES, `kind` POST, `meta` `{ type: "posts", week, platform: "tiktok" }`) and `verify` it.

# Routine: notes

Build in public notes: the founder's own posts on X and Reddit about their product. A note starts from something real that happened: a milestone in their analytics, a launch, a free tool that went live, a week of work on the product. You write it in their voice, learned from their own posts, with an image of the real thing, and fill it in for them. They post it.

Input: a source key from grow (`milestone:...`, `launch:...`, `tool:...`, `skill:...`, `repo:...`), `voice` to learn their voice again, or nothing.

## Hard lines here

- **Their product, never Shipfound's work.** A note is about what the founder built, shipped, launched or learned. Never a site fix, a content page, an index request, a visibility run or a listing, and never "my agent wrote 2 pages" or "named in 0 of 4 ChatGPT runs". A status report about Shipfound's work tells their followers nothing they can use. Do not name Shipfound unless the founder asks.
- **Real numbers only.** A number comes from the source's `facts` or from the founder, and the founder decides whether it is shared. Ask before a number goes in a public post ("104 signups", or "passed 100", or none).
- **They post it.** On X you fill the composer in their Chrome and stop. On Reddit, which Claude cannot open, the draft waits on Assisted posts with Reddit's submit page filled in. Never press post.
- **A real image, never generated.** A screenshot of the real product, a still from the product video, or a card made in code with their own numbers. Never AI images, stock photos, or a customer's real data in a screenshot.
- **No engagement bait.** No "like if you agree", no "comment for the link", no tagging big accounts, no more hashtags than their own posts use.

## Procedure

1. Call `workspace`. Count this week's work on the product, if you are in its repo: read the commit subjects on the default branch (`git log --since="7 days ago" --no-merges --format=%s`) and count the ones that change the product. Leave out Shipfound's own work: commits from its PRs (branches named `shipfound/...`, subjects like `feat(seo)`, `feat(content)`, `chore(tracking)`; see references/pr-conventions.md).
2. Call `notes_context` (free) with `repoCommits`. It returns the `sources` not written yet, each with its open `platforms`, the founder's `voice` per platform, and the `subreddits` that take these posts. If its `next` says there is nothing to write about or no platform is open, say that in one line and stop. Never make up a note to fill the gap.
3. **Pick the source:** the one in the input, else the first. Say in one line what the note is about and where it goes ("Your first payment, on X and Reddit").
4. **Voice**, for each platform the note goes to that has no stored voice, or for every platform when the input is `voice`. Learn it once; after that `notes_context` returns it.
   - **X:** open their own profile in their Chrome (`x.com/<handle>`: `access` has it in the x area's facts, or ask). Read their last 30 to 50 posts of their own, not replies or reposts, scrolling as needed. Note how long they are, casing, punctuation, emoji, hashtags, line breaks, how they open, whether they write threads, whether they link, the words and phrases they come back to, and what they talk about.
   - **Reddit:** Claude cannot open Reddit. Ask the founder to paste two to five of their own Reddit posts or comments. If they have none or would rather not, write Reddit in their X voice with Reddit's habits (full sentences, no hashtags, longer), and say so.
   - Fewer than 10 posts of their own on X: say so, and use the Voice section of SKILL.md until they have more.
   - Save it with `notes_voice`: `sample` the number of posts read, a `summary` in a few lines, `rules` one line each ("all lowercase", "no emoji", "short lines with a blank line between"), and up to five `examples`, verbatim.
5. **Gather the material.**
   - Milestone: the number from `facts`, and what led to it if the founder says.
   - Launch, free tool or skill: the post or page in `facts`. Open it and read what it says.
   - A week's work: the commits you counted, and the code they change. Say what changed for the person using the product, not the files.
   - Ask the founder one question for the part only they know: what was hard, what surprised them, what is next. One line from them makes the note theirs. Use their words.
6. **Write the drafts**, one per open platform for this source:
   - **In their voice.** Their stored rules beat the Voice section of SKILL.md on casing, emoji, length and tone. These house rules stay: no made-up numbers, none of the banned words, no em dashes.
   - **X:** one post, at most 280 characters as X counts them (each link is 23). Lead with what happened. A link only when the source has one worth opening (the launch, the tool, the product), to their own site or the launch post.
   - **Reddit:** pick the subreddit from `subreddits` that fits: r/SideProject for a launch or a tool, r/indiehackers or r/EntrepreneurRideAlong for a milestone with what they learned, r/buildinpublic for progress. Read its `rules` and `gate` and keep every one. A plain title (what happened, with the number if they share it), never clickbait. The body: what happened, how, what they learned, what is next, and one honest question for the sub. A link only where the rules allow it; when unsure, none. Before their first post in a sub, ask them to check its account age and karma minimums (SKILL.md, "Reddit: you post it").
7. **The image**, one per note, saved under `.shipfound/notes/<YYYY-MM-DD>-<slug>/` in the repo root (add `.shipfound/` to `.git/info/exclude` if it is not there):
   - A launch, a tool or a week's work: a screenshot of the real screen it is about. Use the video kit's capture (routines/video.md, step 4: `shots.json` with that page, then `node capture.mjs`), or a frame of the product video if there is one (`npx remotion still Square <file> --frame=<n>` in `.shipfound/video/`). Use a demo account, never a customer's data.
   - A milestone: a card made in code. A small HTML page in their brand (the logo, fonts and colors the capture reads) with the number and what it counts, nothing else, then `npx playwright screenshot --viewport-size=1200,675 file://<card.html> x.png`.
   - Look at it before you use it: nothing cut off, nothing private, readable on a phone.
8. **Show the founder** each draft and the image. In Claude Code, one AskUserQuestion per platform: "Use it (Recommended)", "Edit it", "Leave <platform> out". Their edits go in as they wrote them.
9. **Save** with `notes_save` (free): `source` its key and title, `x` and or `reddit` with the text and the image path. The source is written now and is never offered again. Saving again for the same source revises a draft they have not posted.
10. **Fill it in.**
    - **X:** open the `openUrl` it returns in their Chrome (X's composer with the post in it), attach the image, and stop. They read it and post it.
    - **Reddit:** give them the Assisted posts link and the image path. The draft there opens Reddit's submit page with the title and text filled in; they attach the image if the sub takes one, and post.
11. End with "Tell me when you have posted it" and stop. When they give the links, call `reach_mark` with `status` posted and the `url` for each (ids from `notes_save`), so each is recorded. A note they leave out: `reach_mark` with `status` skipped. Then the hand-over (SKILL.md), once they say they have posted.

A note is a few minutes' work and grow offers one at most every 3 days on X and every 14 on Reddit. Never offer a second note in the same sitting.

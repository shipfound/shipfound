# Routine: shorts

Slideshows for TikTok and Instagram: photo posts of 3 to 8 slides, 9:16, in the formats that work for the founder's buyers this week, made from the product's own screens with the video kit and saved to the Desktop for the founder to post from their own account. Then creators in the niche to pay for a post, one email each. App founders reported slideshows as their channel more than any other on X and Reddit (one niche account: 1,250 downloads and $2.3k MRR in 5 weeks from under 1M views), and the same posts reach a site's buyers.

Input: `creators`, `read`, or nothing. Grow offers it once a week (`SHORTS:week`); for an app, only once downloads start trials, because views do not pay while the step after the download loses everyone (one app had 30M views in a month and its revenue fell).

## What it is

- **A slideshow, not a video.** TikTok's photo mode and an Instagram carousel: the first slide is the hook and all a scroller sees, the middle slides give the viewer something (three tips, a before and after, a list, a short story in the buyer's world), the product shows on a later slide through its own screen, and the last slide is the next step. The founder adds a sound from the app's own library when they post.
- **The formats that work now, never their words.** `shorts_research` reads the week's top posts for the buyers' searches. Copy a post's shape (its number of slides, where the hook sits, list or story), never its text, its images or its account's look.
- **Their screens, their words.** Each slide is the kit's card (the image ad in `video/src/Static.tsx`) at 1080x1920: a headline, one screen of the product recreated from its source, a line. The same hard lines as the video (routines/video.md, "Hard lines here"): only screens the product has, demo data, no one's real data, no AI images, no stock, no AI people.
- **The stranger test.** Every word passes "The words: the stranger test" in routines/video.md. A headline is 8 words or fewer, a line 14 or fewer; the kit refuses longer.
- **On the Desktop.** `<product>-shorts-<date>/`: `show<n>-slide<k>.png` in order and `show<n>-caption.txt`. The founder AirDrops them to the phone and posts them.

## Hard lines here

- One account: the founder's own. Never a second account, an account farm, warmed-up accounts, bought views or follows, or posts made to look like a stranger's ("POV: I found this app").
- Never a review, a testimonial, a quote or a result the product did not have. A number on a slide is the founder's own and true, or demo data shown as a product screen.
- A Kids category app speaks to the parent: never a child on a slide, never a slide that asks a child to download or buy.
- A paid creator's post says it is paid: TikTok's branded content toggle or #ad, which the email asks for.
- The founder posts and sends. You make the files and the drafts; nothing is posted or sent from here.

## Procedure

1. **What to search.** Write 3 to 6 searches the buyers type on TikTok, in their words, never the product's name: what they want or what hurts ("coding games for kids", "screen time ideas", "how to get my first customers"). For an app, the open searches from its App Store check are a start; for a site, its buyers' questions from the brief.
2. **Read.** Tell the founder the price `shorts_research` states and wait for their yes. Call it with the searches. When it returns a `note` about the provider token, say it in one line: without it, downloads from these posts cannot be told apart.
3. **The formats.** Say the 3 formats that work in these posts, one line each: the shape, one post with its plays and link, and why it fits this product. Slideshows first; a video format only when no slideshow is in the top posts.
4. **Write three slideshows**, one in each format. For each: 3 to 8 slides, each `{ hook, scene, at, line }` (the headline, the kit scene, the second its motion lands, the line under it), and the caption (one line in the founder's voice, then 3 to 5 hashtags seen on the top posts). The product's slide says what the viewer gets, never how it works; the last slide says the next step: search the app's name on the App Store, or the link in bio (the `ownLink` from step 2 goes in the founder's bio). Show every slide's words and the caption, and wait for the founder's yes; change what they say.
5. **Render.**
   1. The kit is `.shipfound/video/` at the root of their repo. If it is not there, or has no scenes of this product, set it up and build the scenes as routines/video.md steps 2 to 5 say (the capture of their brand and the product's screens recreated); only the screens the slides name.
   2. Put the slideshows in `public/video.json` as `shorts: [{ caption, slides: [...] }]`, beside what is there.
   3. `npm run shorts`. Open each slide image and look at it: the headline whole, the screen readable, nothing cut at the edges, the top and bottom 12% clear of text (TikTok draws over them). Fix and render again until each one passes.
   4. Tell the founder the folder.
6. **The founder posts.** In the TikTok app: photo mode, the slides in order, the caption from the file, a sound. On Instagram: a carousel. When they give the post's link, `record_action` with `module` COMMUNITIES, `kind` POST, `url` the link, `meta` `{ type: "shorts", platform: "tiktok" | "instagram", format, campaign: "sf-shorts-own" }`, then `verify` (TikTok is checked by its public embed). Grow leaves shorts until Monday once one is posted.
7. **Creators** (input `creators`, or once the founder's own posts are out). From `shorts_research`'s `creators`, the ones whose best post fits the buyers, with an email their bio publishes:
   1. Show them one line each: handle, followers, the post and its plays, the email. The founder picks; skip the rest.
   2. Call `mail_setup` and draft ONE short email to each picked creator in the sending address's mailbox, as routines/outbound.md "Drafting" says: say which post of theirs you saw and link it, the product in one line from the buyer's side, the ask (one slideshow or video in their own style, the founder's price, which the founder sets; a post from a creator this size runs about $10 to $100), that it is marked as paid (TikTok's branded content toggle or #ad), and their own link (`link`) to use in their bio or caption, so what it brings is counted. No attachments, no follow-ups.
   3. After each draft, `record_action` with `module` INBOX, `kind` DRAFT, `title` "Wrote to @<handle>", `url` their post, `meta` `{ type: "shorts-creator", person: <handle>, email, link }`. The 20 inbox drafts a day are shared with outbound. A creator with no email: none; never a DM from here.
8. **Read** (input `read`, or at the next week's slideshows). For an app, `app_downloads`' `byCampaign`: the `sf-shorts-*` campaigns (Apple leaves out a campaign with fewer than 5 people, so a small one reads as none). For a site, `analytics` channels: `utm_source=tiktok`. Ask the founder for each post's views from the app's own insights. Say per post: views, downloads or signups, and which format to make again. The next week's three start from the one that brought the most.

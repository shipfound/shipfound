# Routine: giveaway (Giveaway Drop™)

A post on X or Reddit where people drop what the gift is for (their startup, their site, their app) under it, and the first ones, up to the founder's cap, get one thing the founder's product can give. Then each one made and delivered, a public reply to each for the founder to post, and everyone who got one kept for a signup follow-up. "Drop your URL and I'll do X for you" posts get hundreds of replies (one had 363). The gifts that turned into customers started inside the product: free templates with no email gate led to a $249 sale 3 minutes after a visitor opened one, while results handed over with nothing to sign up for brought about 100 signups and 2 paid out of 200. So the best gift lands in the product: credit that lands when they sign up with what they listed, or a result made by the product.

The founder's own example, for Shipfound: "Drop your startup below: the first 30 get $30 in their Shipfound account."

Input: nothing (a new one), or `deliver` (the one running). Grow offers a new one in its own slot, whenever X or Reddit can post (never only when a note is due), one at a time, 14 days after the last; and `deliver` while one runs and its post is up.

## The shapes

- **Credit or usage.** An amount in their balance, or free uses. Two ways to reach each person (`claim`):
  - **match** (credits only, the strongest): the product they listed is the key. The credit lands when they sign up with it, once each, within the cap. Your agent adds that check to the product's signup (step 5); for Shipfound's own drops it is the grant, nothing to build.
  - **code**: one code the payment provider or the product's admin caps at the number given away; each reply carries it.
- **A result done for them.** The product's own job, run for each person: an audit, a report, a design, a generated output. They reply with their input (their URL, what they need).
- **An asset.** Templates, a dataset or benchmark, a playbook, built from the product's domain or public data. A page on the founder's own site, shipped as a PR in their stack, with no email gate.
- **Founding seats.** The first N customers at a founding price the founder sets (routines/offer.md), by a capped code.

## Hard lines here

- The founder posts the post and every reply. You fill the composer or the reply box and stop.
- Never like + repost + follow mechanics, never "tag a friend": X ranks them down. The only ask is a reply with what the gift is for.
- Numbers first, never "I built X": Reddit removes those posts.
- A reply on X carries no link and no pitch, theirs or yours: the result and nothing else ("your site", not its address). X labelled an account for link replies before.
- Never write a review, a testimonial or a quote, and never ask for one in return.
- One account, the founder's own. Never a second account, and never a reply made to look like a stranger's.
- A result is what the product really made for that person's input, never made up. A number on it is the product's own output.
- A match drop's `claimSecret` lives in the server's environment (the hosting dashboard), never in the repo or in code a browser loads.
- Reddit: only a subreddit whose rules allow it, read first.

## Procedure

1. Call `workspace` with `repo`, then `giveaway_plan` (free). `running` is there: go to "Delivering". Neither platform ready: say its `next` in one line and stop.
2. **What one costs.** When `askCost` is true, read the repo for what one run of the product's job costs (calls to an AI model or a paid API per use). If it pays per use, ask the founder once what one use costs them (AskUserQuestion, a few amounts and "Not sure"), then call `giveaway_plan` again with `unitCostUsd`. It is kept; never ask again.
3. **Propose three**, each a different shape where it fits, from `product` (what it does, its buyers, their pains), `ideas` and `peers` when there are any, and what the product can make: read the repo for the job it runs, what it outputs, how accounts and balances work, and the domain or public data it holds. Credit by match first when the product has accounts and a balance or usage to give. Each in a few lines: what the person gets, who it is for, what they drop under the post, and the cost line (`costs`; for credit, the cap × the credit, spent only as they use it). One AskUserQuestion, your pick first with "(Recommended)". Then ask the cap ("10 (Recommended)", "30", "50", or their number) and an end date ("None", "3 days", "7 days").
4. `giveaway_start` with the pick, the cap, any `endsAt`, and for credit `claim` and `creditCents` (credit in money, in cents: $30 is 3000). It returns the `source` key, the cost line, the tagged `link`, and for a match drop the `claimSecret` and `claimEndpoint`.
5. **What has to exist first.**
   - An asset: build it as a page on the founder's site in their own components, branch `shipfound/giveaway-<slug>`, one PR (references/pr-conventions.md). No email gate, no signup to read it; one button to the product with `link`. `record_action` with `module` CONTENT, `kind` PR, `url` the PR, `liveUrl` the page, `meta` `{ type: "giveaway_asset", giveaway: <id> }`. The post waits until the page is live.
   - Credit by match on the founder's product: read where a new account is created on the server (the signup handler, the auth callback, the "create workspace" step that takes the site), and add one call there, in their stack, on branch `shipfound/giveaway-claim`, one PR: POST `claimEndpoint` with `Authorization: Bearer` the secret from an environment variable (`SHIPFOUND_DROP_SECRET`) and JSON `{ "site": <the site they signed up with> }` (or `{ "handle": <their X or Reddit name> }` when the product knows it). When it answers `claimed: true`, add `creditCents` (or what `what` says) to that account the way the product adds credit, and show it to them. It answers once per person, so call it once per new account; a failed call must never fail the signup. Give the founder the variable to set in their hosting dashboard, with the secret, and `record_action` with `module` FIXES, `kind` PR, `meta` `{ type: "giveaway_claim", giveaway: <id> }`. The post waits until it is live.
   - Shipfound's own drop by match: nothing to build. The credit lands as the grant when they confirm a project on the domain they listed.
   - Credit or seats by code: open the payment provider's or the product's admin dashboard in the founder's Chrome, fill one code capped at the cap (Stripe: a promotion code with its redemption limit) with any end date, and stop before Save; they press it (routines/offer.md, step 5).
6. **The post**, as a build in public note: their voice (routines/notes.md step 4, `notes_context` has it), one draft per platform that can post, the image of the real thing (step 7: an example made by the product on demo data, the asset's first page, or the product's balance screen with the credit).
   - The first line is the number and what each person gets ("The first 30 startups dropped below get $30 in their account"). Then who it is for, then the ask ("drop your startup's link below"), and the end date if there is one. Nothing else to do: no like, repost or follow.
   - **X:** no link in the post. Give the founder `link` for their profile while it runs.
   - **Reddit:** a subreddit from `subreddits` whose `rules` and `gate` allow it; when unsure, none. A numbers-first title, the body as above, `link` only where the rules allow links.
   - Show it (AskUserQuestion: "Use it (Recommended)", "Edit it", "Leave <platform> out"), then `notes_save` with `source` from step 4. It fails on bait, "I built" or a post with no number first; fix what it says.
7. Fill it in as routines/notes.md step 10 says. End with "Tell me when you have posted it" and stop. When they give the link, `reach_mark` with `status` posted and the `url`: that records it as this giveaway (Claimed), then `verify` (X by its embed).

## Delivering

8. `giveaway_replies` (free). Say in one line: replies, waiting, delivered of the cap, and claimed for a match drop. Nobody waiting: say so and stop; read again tomorrow, never in a loop.
9. For each person in `queue`, in order:
   1. Leave out anyone off topic, a bot, a rival, or asking for what the product does not do: `giveaway_mark` with `action` skip. The next in line takes the place. For a match drop, someone with no `host` (no product named) gets one only by their handle: say so to the founder.
   2. Make it. A result: run the product's own job on what they gave, in the founder's environment (the dev server, a script or CLI in the repo, or the product's own API with the founder's own keys), never on a customer's data. Keep what it made, and an image of it when it is visual, under `.shipfound/giveaway/<id>/<handle>.png` (add `.shipfound/` to `.git/info/exclude` if it is not there). An asset: the page is the result. Credit by code or seats: the code. Credit by match: nothing to make; it lands when they sign up.
   3. Draft the reply: the result in a few plain lines, written to what they said. Credit by match: that it is waiting for their site and shows when they sign in with it, in a line ("Done: your $30 is waiting for your site, it shows when you sign in with it."). On X at most 280 characters, with no link, no address and no pitch (the image carries the rest). On Reddit, the asset's page only where the sub allows links. Show the founder the first few, then carry on as they say.
   4. `giveaway_mark` with `action` draft, the `key` and the `reply`. X: open `openUrl` (the reply box, filled in) in their Chrome, attach the image, and stop. Reddit: give them the reply to copy and the comment's link (`openUrl`).
   5. When they say it is posted, `giveaway_mark` with `action` posted and the link to their reply.
10. When the cap is reached, or the end date passed and the queue is empty, `giveaway_mark` with `action` close. A match drop's credit can still be claimed up to 60 days after the drop started.
11. **Hand them on.** Everyone posted to is kept for the signup follow-up (`handOn`, the count in each `giveaway_mark` answer). If grow offers a signup follow-up move, it starts from them. Otherwise say the number in one line. Never DM or email them from here.

## What it brought

Grow reads each giveaway once, two weeks on, as one line: replies, delivered, claimed, then the visits, signups and revenue its posts and its asset page brought. The tagged link counts visits by its `utm_campaign` (`analytics` channels), or by campaign in App Store Connect for an app. Then the hand-over (SKILL.md).

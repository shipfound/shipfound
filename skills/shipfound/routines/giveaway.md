# Routine: giveaway

One thing the founder's product can give, capped by them, offered in a post on X or Reddit to the people who reply. Then each one made and delivered, a public reply to each for the founder to post, and everyone who got one kept for a signup follow-up. "Drop your URL and I'll do X for you" posts get hundreds of replies (one had 363), but with no follow-up they convert badly: 200 given away brought about 100 signups and 2 paid. An asset with no email gate did convert: free templates led to a $249 sale 3 minutes after a visitor opened one.

Input: nothing (a new one), or `deliver` (the one running). Grow offers a new one when X or Reddit is open for a post on the notes cadence and the product has something to give, one at a time, 14 days after the last; and `deliver` while one runs and its post is up.

## The shapes

- **A result done for them.** The product's own job, run for each person: an audit, a report, a design, a generated output. They reply with their input (their URL, what they need).
- **Capped credits or usage.** One code the payment provider or the product's admin caps at the number given away, or credits the founder adds to each account.
- **An asset.** Templates, a dataset or benchmark, a playbook, built from the product's domain or public data. A page on the founder's own site, shipped as a PR in their stack, with no email gate.
- **Founding seats.** The first N customers at a founding price the founder sets (routines/offer.md).

## Hard lines here

- The founder posts the post and every reply. You fill the composer or the reply box and stop.
- Never like + repost + follow mechanics, never "tag a friend": X ranks them down. The only ask is a reply with their URL or what they need.
- Numbers first, never "I built X": Reddit removes those posts.
- A reply on X carries no link and no pitch, theirs or yours: the result and nothing else ("your home page", not its address). X labelled an account for link replies before.
- Never write a review, a testimonial or a quote, and never ask for one in return.
- One account, the founder's own. Never a second account, and never a reply made to look like a stranger's.
- A result is what the product really made for that person's input, never made up. A number on it is the product's own output.
- Reddit: only a subreddit whose rules allow it, read first.

## Procedure

1. Call `workspace` with `repo`, then `giveaway_plan` (free). `running` is there: go to "Delivering". Neither platform ready: say its `next` in one line and stop.
2. **What one costs.** When `askCost` is true, read the repo for what one run of the product's job costs (calls to an AI model or a paid API per use). If it pays per use, ask the founder once what one use costs them (AskUserQuestion, a few amounts and "Not sure"), then call `giveaway_plan` again with `unitCostUsd`. It is kept; never ask again.
3. **Propose three**, each a different shape where it fits, from `product` (what it does, its buyers, their pains), `ideas` and `peers` when there are any, and what the product can make: read the repo for the job it runs, what it outputs, and the domain or public data it holds. Each in a few lines: what the person gets, who it is for, what they reply with, and the cost line: recipients × the cost of one (`costs`, or worked out from `unitCostUsd` and the cap). One AskUserQuestion, your pick first with "(Recommended)". Then ask the cap ("10 (Recommended)", "25", "50", or their number: "First 10" is only a default) and an end date ("None", "3 days", "7 days").
4. `giveaway_start` with the pick, the cap and any `endsAt`. It returns the `source` key, the cost line and the tagged `link`.
5. **What has to exist first.**
   - An asset: build it as a page on the founder's site in their own components, branch `shipfound/giveaway-<slug>`, one PR (references/pr-conventions.md). No email gate, no signup to read it; one button to the product with `link`. `record_action` with `module` CONTENT, `kind` PR, `url` the PR, `liveUrl` the page, `meta` `{ type: "giveaway_asset", giveaway: <id> }`. The post waits until the page is live.
   - Credits or seats: open the payment provider's or the product's admin dashboard in the founder's Chrome, fill one code capped at the cap (Stripe: a promotion code with its redemption limit) with any end date, and stop before Save; they press it (routines/offer.md, step 5).
6. **The post**, as a build in public note: their voice (routines/notes.md step 4, `notes_context` has it), one draft per open platform, the image of the real thing (step 7: an example made by the product on demo data, or the asset's first page).
   - The first line is the number and what each person gets ("10 free teardowns of your pricing page"). Then who it is for, then the ask ("reply with your URL"), and the end date if there is one. Nothing else to do: no like, repost or follow.
   - **X:** no link in the post. Give the founder `link` for their profile while it runs.
   - **Reddit:** a subreddit from `subreddits` whose `rules` and `gate` allow it; when unsure, none. A numbers-first title, the body as above, `link` only where the rules allow links.
   - Show it (AskUserQuestion: "Use it (Recommended)", "Edit it", "Leave <platform> out"), then `notes_save` with `source` from step 4. It respects the notes cadence and fails on bait, "I built" or a post with no number first; fix what it says.
7. Fill it in as routines/notes.md step 10 says. End with "Tell me when you have posted it" and stop. When they give the link, `reach_mark` with `status` posted and the `url`: that records it as this giveaway (Claimed), then `verify` (X by its embed).

## Delivering

8. `giveaway_replies` (free). Say in one line: replies, waiting, delivered of the cap. Nobody waiting: say so and stop; read again tomorrow, never in a loop.
9. For each person in `queue`, in order:
   1. Leave out anyone off topic, a bot, a rival, or asking for what the product does not do: `giveaway_mark` with `action` skip. The next in line takes the place.
   2. Make it. A result: run the product's own job on what they gave, in the founder's environment (the dev server, a script or CLI in the repo, or the product's own API with the founder's own keys), never on a customer's data. Keep what it made, and an image of it when it is visual, under `.shipfound/giveaway/<id>/<handle>.png` (add `.shipfound/` to `.git/info/exclude` if it is not there). An asset: the page is the result. Credits or seats: the code.
   3. Draft the reply: the result in a few plain lines, written to what they said. On X at most 280 characters, with no link and no pitch (the image carries the rest). On Reddit, the asset's page only where the sub allows links. Show the founder the first few, then carry on as they say.
   4. `giveaway_mark` with `action` draft, the `key` and the `reply`. X: open `openUrl` (the reply box, filled in) in their Chrome, attach the image, and stop. Reddit: give them the reply to copy and the comment's link (`openUrl`).
   5. When they say it is posted, `giveaway_mark` with `action` posted and the link to their reply.
10. When the cap is reached, or the end date passed and the queue is empty, `giveaway_mark` with `action` close.
11. **Hand them on.** Everyone posted to is kept for the signup follow-up (`handOn`, the count in each `giveaway_mark` answer). If grow offers a signup follow-up move, it starts from them. Otherwise say the number in one line. Never DM or email them from here.

## What it brought

Grow reads each giveaway once, two weeks on, as one line: replies, delivered, then the visits, signups and revenue its posts and its asset page brought. The tagged link counts visits by its `utm_campaign` (`analytics` channels), or by campaign in App Store Connect for an app. Then the hand-over (SKILL.md).

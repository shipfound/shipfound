# Routine: status

Credits, what shipped, what is verified and what is still claimed, tracking state, the results app link, and what the founder can do next.

Follow [../references/verification.md](../references/verification.md).

Input: an optional module filter (fixes, content, index, listings, communities, inbox, tracking, experiments).

## Procedure

1. Call `workspace`: plan, credit balance, access summary, tracking state, links.
2. Call `shipped` with `{}`, or `{ module }` with the module in upper case if the founder named one. Count by state (VERIFIED, CLAIMED, FAILED) and by module.
3. If a tracking PR is recorded, or `workspace` shows tracking installed but not confirmed, call `tracking_check` and report what it has and has not seen (events, crawler hits, goals).
4. Print:
   - Plan and credits: "Builder, 212 credits left."
   - Access: "8 of 11 open."
   - Shipped: "11 verified, 4 claimed, 1 failed", then the claimed and failed items, one line each with title and age.
   - Tracking: one line from `tracking_check`.
   - The results app link from `workspace` (else https://www.shipfound.co).
5. Offer to verify the claimed items the founder says are merged or live: "`verify` costs 1 credit each; 4 items is 4 credits." Only on a yes, and only those items; if the total is over 5 credits, wait for an explicit yes with the number in it.
6. Call `plan` (free) and `goals` `{ action: "list" }` (free). Then end with what the founder can do now. Status is never the end of the day: it hands over to the next move.

   **What you can do now**: the top 3 `plan` items, in its order, one line each: what it gets them, the reason from `why` with its number, how to start it, and the credits. For example:

   > 1. Publish a comparison page: "Ahrefs vs Shipfound" gets 1,300 searches a month and no page of yours answers it. Start: write, `comparison ahrefs`. (Brief and check: the prices `workspace` lists.)
   > 2. Start an A/B test on the pricing page: 2,100 visitors a month, enough to read a 20% lift in 3 weeks. Start: test, `/pricing`. (Free.)
   > 3. Submit to G2 and Capterra: both are open on your Access Card and neither lists you. Start: list, `g2`. (Free; you press submit.)

   The numbers there are only an illustration: use the ones `plan` returns, and the credits from `plan` or the `workspace` prices, never a guess. Where the example says "Start: write, `comparison ahrefs`", print what the founder types: the routine's command with those arguments in Claude Code, its phrase in Codex.

   If no goal is `HARD`, add one line before the list: "Your headline conversions are soft. Convert `payment` (or the goal that is a real conversion) to hard in the results app, Analytics, Conversions." Name the goal from `goals`.

   **Any time**: one short line per routine not already in the top 3, only where the access audit opened it, in the founder's own words of what they get:
   - write: publish a blog, glossary, answer, comparison or alternatives page.
   - test: start an A/B test from your analytics (only once tracking is verified).
   - index: get new pages indexed in Google and Bing.
   - list: listings on review, launch and marketplace sites, filled in for you to submit (partly built: say so).
   - reach: replies to threads where your buyers ask, and one-to-one inbox drafts (partly built: say so; only where the plan allows community work).
   - fix: site fixes as pull requests.
   - analytics: any question about your traffic, in plain words with numbers.

   Say how to start each one the way the founder's host runs it: the command from the routines table in Claude Code, the phrase from the same table in Codex. In the examples above, Codex would read "Write a comparison page about Ahrefs" instead of the command.

   Close with one question naming the first move and its price: "Want me to start with the comparison page? It costs 7 credits: the brief and the check." (the real total from the prices) On a yes, run that routine from its first step, with the price rule as usual. Never start one without the yes, and never more than one.

Never call something done that is not VERIFIED.

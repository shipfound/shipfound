# Routine: launch

Launch posts on the boards where early adopters look for new products: Show HN, Indie Hackers, DevHunt (developer products) and Product Hunt. You draft each one from the founder's own site, in their voice, and fill the form in their browser. They post it under their own name and stay to answer comments. Every link is tagged, so each launch's visits and signups are counted as its own.

Follow [../references/verification.md](../references/verification.md). Every hard line applies, number 3 most of all: never upvote, never ask anyone to upvote or comment, never trade votes, never post in a group asking for them. Each board removes launches that do.

Input: an optional board (`show_hn`, `indie_hackers`, `devhunt`, `product_hunt`).

## Procedure

1. Call `workspace` and `access`.
2. If Show HN could be in play (no board named, or `show_hn`), ask the founder for their Hacker News username, once. Then call `launch_targets` with `hnUser` (free). It returns only the boards and steps not recorded yet; never offer one from memory.
3. **Blockers first.** If `readiness.blockers` is not empty, say each in plain words, offer the fix as the move (tracking: finish the install with the fix routine; assets: what the audit says is missing), and stop. A launch is a one-day spike: without tracking it is lost.
4. **Pick the board.** Only the boards that fit this product come back (each with `why`); `notOffered` names the others and why they fit poorly. Never offer one from `notOffered`. If the founder asks for one by name, say its `why` in one line, and only if they still want it call `launch_targets` with `all`. Show the boards left with their `timing`, and recommend one, by who the buyers are:
   - A developer product: DevHunt, and Show HN when it is open to the founder's account.
   - A product for founders and makers: Indie Hackers.
   - Anything else: whichever board the buyers read; Product Hunt last, and only on a day the founder can spend answering comments.
   - **Show HN** needs something people can try now, without a waitlist or a sales call. `readiness.freeTool` is a free tool verified live, a page that qualifies (the `link` already points at it); a free plan, a demo or an open-source repo do too. If `hn.showHn` is "unlikely" or "missing", say `hn.note` plainly: Hacker News restricts Show HN for accounts that have not taken part yet, and the only way in is for the founder to comment for a few weeks, in their own words, where they know the subject. Never offer a shortcut. Offer another board today.
   - One board at a time, a few days to a week apart, so each gets answered and its numbers can be read before the next.
5. **Draft**, from the founder's own site and the product the `workspace` describes. Read the home page and the pricing page first. Plain words, no superlatives, no "revolutionary", no emoji, no exclamation marks (SKILL.md, "Voice"). Numbers only the founder gives you. Keep every rule in the target's `rules`.
   - Show HN: the title (`Show HN: <Name> – <what it does>`, under 80 characters) and the founder's first comment: who they are, why they built it, what is technically interesting, its honest limits, and the feedback they want. The submit form's text stays empty when there is a URL; the first comment is posted right after.
   - Indie Hackers: the product page fields, then the post: the story and the stage it is at, what was built and for whom, a real number or lesson, and one or two concrete questions. One group, the closest to the buyer.
   - DevHunt: the slogan (one technical line), the short description, the pricing type, the screenshots in order (the product itself first), the launch week. Picking the week costs the founder $19 or $49: say so, recommend the free queue, and leave the choice to them.
   - Product Hunt: name, 60-character tagline, 260-character description, the gallery (the product video from the video routine when there is one), and the maker's first comment.
   Show the draft to the founder and take their edits before you fill anything.
6. **Fill the form** at the step's `url` in the founder's browser, with the target's tagged `link` as the URL. If a login is needed, ask them to sign in. If Hacker News sends the submit page to `/showlim` ("We're temporarily restricting Show HNs"), stop: Show HN is not open to this account yet. Say so, record nothing, and offer another board. **Stop before submit**, and tell the founder which button to press and what to paste as the first comment, if the board has one.
7. When the founder says it is up, ask for the link and call `record_action` with the step's `recordAs` (`module`, `kind`, `meta`, always with `meta.launch`: without it the post is not counted as the launch), `title` the post's title, `url` the post or listing page, and for a listing `liveUrl` the product's URL. On Indie Hackers, go straight on to the next step (the post after the product page).
8. **After.** Tell the founder the target's `after` in two lines. For each comment that needs an answer, they can bring the thread URL to the reach routine for a draft they edit and post. Answer critics first and never argue.
9. A week later (grow offers it): `verify` the post (a Hacker News post that was flagged or killed shows as Failed), and read the launch's numbers with `analytics` `{ report: "overview", filters: [{ field: "utm_source", value: "<the target's utmSource>" }] }` (the `conversions` report the same way). Report visits, signups and paying customers, not points or upvotes. Then the hand-over (SKILL.md): offer the next move.

Without browser tools, give the founder the URL and every field to paste, and record nothing until they say it is posted.

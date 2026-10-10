# Routine: list

Listings on directories, marketplaces and, when the founder asks, review sites, filled in the founder's browser for them to submit, one after another.

Follow [../references/verification.md](../references/verification.md).

Input: an optional site the founder named, or "marketplaces".

## Procedure

1. Call `workspace` and `access`. Read the assets and marketplace areas. If the assets area is red (no logo, no 160-character description, no screenshots), fix that first: list what is missing and stop.
2. Targets: the site the founder named; for marketplaces (the input says so, or the founder picked the marketplaces move), call `listing_targets` with `marketplaces: true` (free): the MCP registries, plugin lists, extension stores and awesome lists the product fits, minus what is recorded; else call `listing_targets` (4 credits) for the next directories, free to list, open to this kind of product, not already listed, ranked by how often AI answers cite them. Offer only what it returns, never a site or list from memory, and never ask the founder whether they already did one of them: what is recorded is already left out (SKILL.md, "Done is done"). Review profiles (G2, Capterra) only when the founder asks: pass `include: ["review"]`, and say why they are different (they need real customer reviews). Launch boards (Product Hunt, DevHunt, Show HN, Indie Hackers) are not listings: a launch is a post with a day attached, so it is the launch routine. Show the list with each one's note and ask which to do, or all of them in order. If the founder says one is already done, `record_action` it now (step 5) and move on.
3. For each chosen site, in the founder's browser: open the claim or submit page, fill every field from the founder's own site and assets (name, URL, 160-character description, category, pricing, logo, screenshots). If a login is needed, ask the founder to sign in. Never create an account for them.
4. **Stop before submit.** Tell the founder which button to press. They submit.
5. When the founder says it is submitted, call `record_action` with `module` LISTINGS, `kind` LISTING, `url` the listing page (or the submission confirmation URL until the listing exists), `liveUrl` the product URL it should link to, `meta: { site }` (the directory's host, or the target's `key`; for a GitHub list `github.com/owner/repo`). `verify` comes later, once the listing is live.
6. Go straight to the next one on the list: "Next: SaaSHub. Fill it now?" Keep going one after another until the list is done or the founder stops; when it is done, offer `listing_targets` again for the next batch.
7. Awesome lists (the `github: true` targets): prepare the fork, branch and one-line entry, and give the founder the `gh pr create` command to run (or the issue link, when the target's note says the list takes suggestions by issue). Record it once they have opened it, with `url` the PR or issue. Opening a PR on someone else's repository is posting in public, so the founder runs it.
8. When the batch is done or the founder stops, the hand-over (SKILL.md): offer the next move.

Without browser tools, give the founder the URLs and the field values to paste, and record nothing until they say it is submitted.

Never write reviews or ask anyone but real customers for one.

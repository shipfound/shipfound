# Routine: list

Listings on directories, marketplaces and, when the founder asks, launch and review sites, filled in the founder's browser for them to submit, one after another.

Follow [../references/verification.md](../references/verification.md).

Input: an optional site the founder named.

## Procedure

1. Call `workspace` and `access`. Read the assets and marketplace areas. If the assets area is red (no logo, no 160-character description, no screenshots), fix that first: list what is missing and stop.
2. Targets: the site the founder named; else call `listing_targets` (4 credits) for the next directories, free to list, open to this kind of product, not already listed, ranked by how often AI answers cite them; plus the marketplaces in `facts.fits`. Launch platforms (Product Hunt) and review profiles (G2, Capterra) only when the founder asks: pass `include`, and say why they are different (a launch needs the founder there on the day; review sites need real customer reviews). Show the list with each one's note and ask which to do, or all of them in order.
3. For each chosen site, in the founder's browser: open the claim or submit page, fill every field from the founder's own site and assets (name, URL, 160-character description, category, pricing, logo, screenshots). If a login is needed, ask the founder to sign in. Never create an account for them.
4. **Stop before submit.** Tell the founder which button to press. They submit.
5. When the founder says it is submitted, call `record_action` with `module` LISTINGS, `kind` LISTING, `url` the listing page (or the submission confirmation URL until the listing exists), `liveUrl` the product URL it should link to, `meta: { site }` (the directory's host). `verify` comes later, once the listing is live.
6. Go straight to the next one on the list: "Next: SaaSHub. Fill it now?" Keep going one after another until the list is done or the founder stops; when it is done, offer `listing_targets` again for the next batch.
7. Awesome lists (GitHub area green): prepare the fork, branch and one-line entry, and give the founder the `gh pr create` command to run. Opening a PR on someone else's repository is posting in public, so the founder runs it.
8. When the batch is done or the founder stops, the hand-over (SKILL.md): offer the next move.

Without browser tools, give the founder the URLs and the field values to paste, and record nothing until they say it is submitted.

Never write reviews or ask anyone but real customers for one.

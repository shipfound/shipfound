# Routine: list

Listings on review sites, launch sites and marketplaces, filled in the founder's browser for them to submit. Partly built; see the note.

Follow [../references/verification.md](../references/verification.md).

**What is not built yet:** the `listing_targets` tool (the ranked batch from the ~270-directory database, with form recipes and the assets each needs). Until it ships, this routine covers the site the founder names and the marketplaces the audit says fit. It does not pick from the directory database.

Input: an optional site the founder named.

## Procedure

1. Call `workspace` and `access`. Read the assets and marketplace areas. If the assets area is red (no logo, no 160-character description, no screenshots), fix that first: list what is missing and stop.
2. Targets: the site the founder named, else the marketplaces in `facts.fits`. Do not suggest review or launch sites (Product Hunt, G2, Capterra, AlternativeTo, SaaSHub, BetaList, Crunchbase) on your own: a launch needs the founder there on the day, and review sites need real customer reviews. Show at most 5 and ask which to do.
3. For each chosen site, in the founder's browser: open the claim or submit page, fill every field from the founder's own site and assets (name, URL, 160-character description, category, pricing, logo, screenshots). If a login is needed, ask the founder to sign in. Never create an account for them.
4. **Stop before submit.** Tell the founder which button to press. They submit.
5. When the founder says it is submitted, call `record_action` with `module` LISTINGS, `kind` LISTING, `url` the listing page (or the submission confirmation URL until the listing exists), `liveUrl` the product URL it should link to, `meta: { site }`. `verify` comes later, once the listing is live.
6. Awesome lists (GitHub area green): prepare the fork, branch and one-line entry, and give the founder the `gh pr create` command to run. Opening a PR on someone else's repository is posting in public, so the founder runs it.

Without browser tools, give the founder the URLs and the field values to paste, and record nothing until they say it is submitted.

Never write reviews or ask anyone but real customers for one.

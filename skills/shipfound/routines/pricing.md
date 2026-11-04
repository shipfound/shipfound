# Routine: pricing

Whether the people who reach the pricing page (a website) or the paywall (an app) can pay, and what stops them. Each step to paid counted, the way to pay walked on a phone without paying, the way in (a trial, a card, a free plan, free credit, a paywall) read against products of the same kind, and one change, shipped as an A/B test judged on paid per visitor.

Any stack and any payment provider: Stripe, Paddle, Lemon Squeezy, Polar, Dodo, RevenueCat, StoreKit. Prices are the founder's.

Follow [../references/pr-conventions.md](../references/pr-conventions.md) and [../references/verification.md](../references/verification.md).

Input: none, or `web` or `app` when the product is both.

## Hard lines

- Never change a price, charge, refund, or change a customer's plan.
- Never pay, never create a real charge, never create an account. Use the founder's own session in their browser, or the provider's test mode.
- A price change is the founder's to save: fill it in the payment dashboard, or stage it in App Store Connect (`app_prices`, `app_purchases_stage`), and stop before Save.

## Procedure

1. Call `workspace` with `repo` and `access`. Then `pricing_check` (free). It returns `kind` (web or app), `steps`, `untracked`, `entry`, `own`, `walk`, `changes`, `pick`, `judge` and `hardLines`.
2. **Map each step and count it.**
   - A website: pricing seen, plan picked, checkout opened, paid, renewal or top-up. An app: paywall seen, trial started, paid, renewed.
   - Say every step in `untracked` first, one line each: a step nobody tracks reads as nobody reaching it. Find each in the code (the plan buttons' data-sf, where checkout starts, the payment webhook, the paywall's view event) and save it with `funnels_save` in a "Pricing to payment" funnel, `evidence` the file and line. A payment or a renewal seen only by the server is tracked from the payment webhook (references/tracking.md); a paywall view, by the subscription service or the app's own analytics.
   - Read the payments of the same days in the payment dashboard or the subscription service, in the founder's browser, and pass them as `counts.providerPaid`. Say `paidGap` when it comes back: the analytics miss payments, and every rate after pricing reads too low until that is fixed.
   - An app: read paywall views and new users, renewals, and trial cancellations (all of them, and those on the day the trial started) in the subscription service (RevenueCat, Superwall, Adapty) or App Store Connect, and pass them as `counts`.
3. **Walk it** in the founder's browser, one `walk.checks` entry at a time. For a website, walk the upgrade path as the convert routine does in its step 4, with its rules; for an app, walk the first session to the paywall as the aso routine does in its step 16 (the trial walk). Do not repeat those walks: carry on from where they stop, with the checks they do not make.
   - Phone first, at 390 by 844, then desktop. Name what an in-app browser (Instagram, Facebook, Reddit, X) would do with the checkout: a pop-up window, a new tab, a cookie it needs.
   - The checks read in the code (`paid-gated`) and in the provider's settings (`dunning`, `local-price`) are read only.
   - `promo-code` only while `offer_plan` says a founding offer is live.
   - Stop on the payment page every time.
   Then call `pricing_check` with `record` (one entry per check: pass or fail, `evidence` what you saw, a `fix` for a fail), `model` (the way in, read in the code) and `counts`.
4. **The way in.** Say the product's way in, then `entry.benchmarks` one line each with its source. Then `own`: the founder's own before and after comes before any benchmark. When the founder says they changed the way in before (a trial replaced by free credit, a card dropped), `record_action` it now with `meta.type` "pricing", `meta.change` "ask-at-value", `meta.from` and `meta.to` the ways in and `meta.saw` what they saw, in their words, so it counts as their own evidence.
5. **One change.** Show every check still `open`, one line each with its evidence. Then the change in `pick`, with what it rests on (its `facts`, each with its source, and its `appPlays`, the paywall plays from `app_downloads` with their numbers), and wait for the founder's yes. One change at a time: a second waits until the first is read.
6. **Ship it as an A/B test**, never as a straight change, however few visitors reach the page:
   - A website: `experiment_create` on the pricing page with the payment step as the goal, the variant in the same PR (the test routine). An app: the subscription service's experiments, or a split at first launch (the aso routine, step 16, sub-step 7).
   - Say `judge.note` before you open it: under about 9,000 views per variant the read is directional, judged on paid per visitor, not signups, and it stops on `judge.stopAt`. That date does not move.
   - A price is never in the PR. Local prices: the founder saves them in the provider (Stripe adaptive pricing or a price per currency, Paddle and Lemon Squeezy price overrides) or approves them in App Store Connect (the aso routine, prices); the PR only shows them.
   Branch `shipfound/pricing-<change>`, one PR, the body with the steps, the walk and the change. `record_action` with `module` FIXES (ASO for an app), `kind` PR, `url` the PR, `liveUrl` the pricing page, `meta: { type: "pricing", change: <the change's id>, experiment: <the key>, plays: [<app play ids>] }`.
7. Tell the founder how it is judged: paid per visitor (per download for an app), 28 days before against 28 after, and the test read with `experiment_results` on its stop date. Never call a winner the read does not.
8. Summarise: what was not tracked and is now, what the walk found, the change (claimed, not verified), and that nothing was paid or charged. Then the hand-over (SKILL.md): offer the next move.

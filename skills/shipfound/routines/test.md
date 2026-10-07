# Routine: test

A/B tests from the founder's analytics: propose a change with the evidence, size it from the page's traffic, ship the variant as a PR, read it honestly, and ship what won.

Input: an optional page, goal, or the key of a running test.

## What a test needs

- **Attribution mode** on the site, with consent asked. Only a visitor with a stable id can be kept in one variant; visitors who decline see the control and are not counted. Cookieless sites cannot run tests: say so, and offer to switch (the founder turns it on in the results app, Settings, Tracking; you add `data-mode="attribution"` to the script tag in a PR).
- **Traffic.** `experiment_create` sizes the test from the page's last 28 days and refuses one under 50 testable visitors a week or over 12 weeks, with the numbers. Do not argue with the refusal; offer what it suggests.
- **A goal** on the site that the change should move (see `goals`).

## Procedure

1. Call `workspace`. If tracking is not installed, point to the fix routine and stop. If the input is a running test's key, go to step 7.
2. Call `experiment_results` with no key. Report any running test's verdict first; one running test per page at a time.
3. Call `goals` with `{ action: "list" }`, then `analytics` up to 3 times over the last 28 days: `conversions`, `landing_pages`, and `pages` or `ai_search` as the question needs.
4. Propose 3 ranked changes. Each has one evidence line made only of numbers those reports returned ("/pricing: 1,240 entrances, 34% engaged, 1.1% reach Signup"), the change, the goal it should move, and the page. Never write a number the reports did not give you.
5. If the founder picks one, call `experiment_create` with a lowercase `key`, the `name`, the `hypothesis` (the change, for whom, why, and the evidence line), the `path`, the `goal`, and `variants` (control first; default `["control", "b"]`). Leave `mde` at its default unless the founder wants a bigger change sized. Tell the founder the sizing it returns: visitors a variant and weeks.
   - If it is refused for traffic, offer what it says: size for a bigger change, a goal closer to the page, a busier page, or ship the change without a test as a before-and-after PR (weaker evidence; say so) recorded with `module` EXPERIMENTS.
   - If it is refused for Cookieless mode, explain Attribution mode as above and stop.
6. Build the variant from the `implementation` it returns, in the framework's idiom: `experiment()` from `@shipfound/next` in a server component on a Next.js site (the page must render per request), the plain HTML snippet with `sf.variant()` anywhere else. Change only what the hypothesis is about. One PR ([../references/pr-conventions.md](../references/pr-conventions.md)), titled "Shipfound test: <name>". Then `record_action` with `module` EXPERIMENTS, `kind` PR, the PR `url`, `liveUrl` the tested page, and `meta: { experiment: <key> }`. Tell the founder to check `experiment_results` a day after the deploy.
7. Reading a test: call `experiment_results` with its key and report the table (visitors, converted, rate, chance to beat control, lift) and the verdict in its own words. Act on the verdict only: Then the hand-over (SKILL.md): offer the next move.
   - `keep_running`: say how many visitors are left and the weeks at the current rate. Do not stop early because a variant "looks good".
   - `srm` or exposures to unlisted variants: the split is broken (a cached page, a redirect, a typo in a variant name). Find and fix it in the code; the reading is not usable until then.
   - `winner`, `control_wins` or `no_difference`: call `experiment_close` with `keep` (the winner, else the control) and a one-line `note`. Then one PR that makes the kept version the page's only version and removes the experiment code, and `record_action` it with `module` EXPERIMENTS, `kind` PR.
   - Never call a winner the verdict does not, and never describe `no_difference` as a loss for the founder: it is the answer.

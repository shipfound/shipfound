# Routine: test

A/B tests from the founder's analytics: propose a change with the evidence, size it from the page's traffic, ship the variant as a PR, read it honestly, and ship what won.

Input: an optional page, goal, or the key of a running test.

## What a test needs

- **Attribution mode** on the site, with consent asked. Only a visitor with a stable id can be kept in one variant; visitors who decline see the control and are not counted. A Cookieless site cannot run a test. Say that it is required and offer to set it up, in these words or close to them: "A/B tests need Attribution mode, so each visitor stays in one variant. It keeps a first-party id, which needs a consent signal. I can set it up for you: one PR with the script tag change and the consent banner, and I switch the setting." In Claude Code ask it with AskUserQuestion, header "Attribution": "Set it up for me (Recommended)", "Ship the change as a before-and-after PR" (weaker evidence, no test), "Not now". In Codex end with "Do you want it?". Then wait for the answer. A yes is the founder asking for the banner; without one, never add it ([../references/tracking.md](../references/tracking.md) section 5).
- **Traffic.** `experiment_create` sizes the test from the page's last 28 days and refuses one under 50 testable visitors a week or over 12 weeks, with the numbers. Do not argue with the refusal; offer what it suggests.
- **A goal** on the site that the change should move (see `goals`).

## Procedure

1. Call `workspace`. If tracking is not installed, point to the fix routine and stop. If the input is a running test's key, go to step 7.
2. Call `experiment_results` with no key. Report any running test's verdict first; one running test per page at a time. If the site is not in its `attributionSites`, make the Attribution offer above now, before proposing anything. On a yes, follow "Switching to Attribution mode" below, then carry on from step 3. On a no, carry on and offer the before-and-after PR in step 5 instead of a test.
3. Call `goals` with `{ action: "list" }`, then `analytics` up to 3 times over the last 28 days: `conversions`, `landing_pages`, and `pages` or `ai_search` as the question needs.
4. Propose 3 ranked changes. Each has one evidence line made only of numbers those reports returned ("/pricing: 1,240 entrances, 34% engaged, 1.1% reach Signup"), the change, the goal it should move, and the page. Never write a number the reports did not give you.
5. If the founder picks one, call `experiment_create` with a lowercase `key`, the `name`, the `hypothesis` (the change, for whom, why, and the evidence line), the `path`, the `goal`, and `variants` (control first; default `["control", "b"]`). Leave `mde` at its default unless the founder wants a bigger change sized. Tell the founder the sizing it returns: visitors a variant and weeks.
   - If it is refused for traffic, offer what it says: size for a bigger change, a goal closer to the page, a busier page, or ship the change without a test as a before-and-after PR (weaker evidence; say so) recorded with `module` EXPERIMENTS.
   - If it is refused for Cookieless mode, make the Attribution offer above, unless the founder already said no to it.
6. Build the variant from the `implementation` it returns, in the framework's idiom: `experiment()` from `@shipfound/next` in a server component on a Next.js site (the page must render per request), the plain HTML snippet with `sf.variant()` anywhere else. Change only what the hypothesis is about. One PR ([../references/pr-conventions.md](../references/pr-conventions.md)), titled "Shipfound test: <name>". Then `record_action` with `module` EXPERIMENTS, `kind` PR, the PR `url`, `liveUrl` the tested page, and `meta: { experiment: <key> }`. Tell the founder to check `experiment_results` a day after the deploy.
7. Reading a test: call `experiment_results` with its key and report the table (visitors, converted, rate, chance to beat control, lift) and the verdict in its own words. Act on the verdict only: Then the hand-over (SKILL.md): offer the next move.
   - `keep_running`: say how many visitors are left and the weeks at the current rate. Do not stop early because a variant "looks good".
   - `srm` or exposures to unlisted variants: the split is broken (a cached page, a redirect, a typo in a variant name). Find and fix it in the code; the reading is not usable until then.
   - `winner`, `control_wins` or `no_difference`: call `experiment_close` with `keep` (the winner, else the control) and a one-line `note`. Then one PR that makes the kept version the page's only version and removes the experiment code, and `record_action` it with `module` EXPERIMENTS, `kind` PR.
   - Never call a winner the verdict does not, and never describe `no_difference` as a loss for the founder: it is the answer.

## Switching to Attribution mode

Only after the founder says yes to the offer above.

1. Look in the repo for a consent manager already there: a TCF banner (`__tcfapi`), Google Consent Mode (`gtag('consent', ...)`), Cookiebot, OneTrust, or a hand-made banner. The script reads TCF and Google Consent Mode by itself.
2. One PR on a `shipfound/` branch ([../references/pr-conventions.md](../references/pr-conventions.md)), titled "Shipfound: Attribution mode for A/B tests":
   - Add `data-mode="attribution"` to the tracking script tag. On Next.js with `@shipfound/next`, pass `mode: "attribution"` to `shipfoundScriptProps()`.
   - A TCF or Google Consent Mode manager: nothing more. A hand-made banner: call `sf('consent', true)` when the visitor accepts and `sf('consent', false)` when they decline.
   - No consent manager: add a small banner built from the site's own components and styles. Accept and Decline side by side with the same weight, one plain sentence on what is kept and why, the choice remembered, and `sf('consent', true)` or `sf('consent', false)` called on it. No pre-ticked box, no "by using this site you agree".
3. Call `tracking_install` with the site's `domain`, its `framework` and `identityMode: "attribution"`. That switches the setting; leave `rotateSecret` off. It is safe before the PR merges: the script stays cookieless until the tag and the visitor's consent both say otherwise.
4. `record_action` with `module` TRACKING, `kind` PR, the PR `url` and `liveUrl` the site's home page. After the founder merges and it deploys, call `tracking_check`.
5. Be straight about traffic. If the reports from step 3 show the page under 50 visitors a week, say the test still cannot start, and that switching now is still worth it: visitors keep their id from today, so multi-day journeys and first-touch attribution build up from now, and the test can start once the traffic is there.

# Routine: test

A/B test proposals from the founder's analytics, with the traffic gate. Experiments are not built yet; see the note for what works today.

**What is not built yet:** experiments. The `experiment_plan`, `experiment_hypotheses`, `experiment_create`, `experiment_results` and `experiment_close` tools, variant assignment in `@shipfound/next` and tracking.js, and the stats service are planned, not live. Until they ship, this routine reads the funnel, proposes changes with evidence, applies the traffic gate by rule of thumb, and ships a chosen change as a normal PR tracked as a before-and-after. It does not split traffic and does not call winners.

Input: an optional page or goal.

## Procedure

1. Call `workspace`. If tracking is not installed, point to the fix routine and stop.
2. Call `goals` with `{ action: "list" }`, then `analytics` up to 3 times over the last 28 days: `conversions`, `landing_pages`, and `pages` or `ai_search` as the question needs.
3. Traffic gate, by hand: weekly visitors to the page. Under about 1,000 a week, say a real test on a paid or signup step would take months, and limit proposals to top-of-funnel copy and offer changes (CTA clicks, signup starts).
4. Propose 3 ranked changes, each with one evidence line from the numbers ("62% of AI Search visitors leave /pricing within 10 seconds"), the change, and the step it should move.
5. If the founder picks one: build it as a normal PR ([../references/pr-conventions.md](../references/pr-conventions.md)), and say plainly that it will be measured as a before-and-after with an annotation, which is weaker evidence than a split test. Call `record_action` with `module` EXPERIMENTS, `kind` PR.
6. Note that real split tests will need Attribution mode (a stable visitor id across days), and say when that is the founder's call to make.

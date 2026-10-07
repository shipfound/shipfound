# Routine: week

The Monday routine. Re-check what moved, verify what is due, then the top 5 moves.

**What is not built yet:** the server-side weekly re-check and the Monday digest email, and the `visibility_rerun` job. Until they ship, this routine does the same work by hand with the tools that exist: `visibility_run` for a repeat run (15 credits, only on a yes), and `visibility`, `shipped`, `analytics` and `plan` for the rest.

Input: an optional module, to limit the top 5 moves to that module.

## Procedure

1. Call `workspace` (credits, plan, tracking state) and `visibility` (the latest full run and its date).
2. If the latest run is 7 or more days old, offer a fresh one: "A new visibility run costs 15 credits; you have N. Run it?" Only on a yes, call `visibility_run`; it runs in the background, so carry on and tell the founder where the result will show.
3. Call `shipped` with `{}`. List what changed state this week, and the CLAIMED items old enough to check (merged PRs, live listings, index requests from 1+ days ago). Offer `verify` for those at 1 credit each, with the total; ask for an explicit yes when the total is over 5.
4. Call `analytics` up to 3 times, last 7 days with `compare: true`: `overview`, `ai_search`, `shipped_work` (and `ai_crawlers` if crawler hits are the story). Skip if tracking is not installed and say so.
5. Call `experiment_results` with no key. For each running test, one line with its verdict; when a verdict is final (winner, control wins, no difference) or the split is broken, say the test routine closes or fixes it.
6. Call `plan` and take the top 5 (of the named module, if the founder gave one).
7. Print the week in under 15 lines: what moved (named status per engine with stability labels, AI visits and signups vs last week, verified this week), running tests and their verdicts, what is still claimed, the top 5 moves with how to run each and their credits, and the results app link. Then the hand-over (SKILL.md): offer the next move.

Run nothing from the top 5 in this routine; the founder picks.

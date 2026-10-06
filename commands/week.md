---
description: The Monday routine. Re-check what moved, verify what is due, then the top 5 moves. Partly built; see the note.
allowed-tools: mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__visibility, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__plan
---

# /shipfound:week

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md).

**What is not built yet:** the server-side weekly re-check and the Monday digest email, and the `visibility_rerun` job. Until they ship, this command does the same routine by hand with the tools that exist: `visibility_run` for a repeat run (15 credits, only on a yes), and `visibility`, `shipped`, `analytics` and `plan` for the rest.

## Procedure

1. Call `workspace` (credits, plan, tracking state) and `visibility` (the latest full run and its date).
2. If the latest run is 7 or more days old, offer a fresh one: "A new visibility run costs 15 credits; you have N. Run it?" Only on a yes, call `visibility_run`; it runs in the background, so carry on and tell the founder where the result will show.
3. Call `shipped` with `{}`. List what changed state this week, and the CLAIMED items old enough to check (merged PRs, live listings, index requests from 1+ days ago). Offer `verify` for those at 1 credit each, with the total; ask for an explicit yes when the total is over 5.
4. Call `analytics` up to 3 times, last 7 days with `compare: true`: `overview`, `ai_search`, `shipped_work` (and `ai_crawlers` if crawler hits are the story). Skip if tracking is not installed and say so.
5. Call `plan` and take the top 5.
6. Print the week in under 15 lines: what moved (named status per engine with stability labels, AI visits and signups vs last week, verified this week), what is still claimed, the top 5 moves with their commands and credits, and the results app link.

Run nothing from the top 5 in this command; the founder picks.

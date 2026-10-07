# Routine: plan

The ranked queue for this week, built only from what the audit opened. This routine reads only; it never calls a paid tool.

Input: an optional module filter (fixes, content, index, listings, communities, inbox, tracking).

## Procedure

1. Call `workspace` for credits and plan. Call `access`. If there is no audit yet, say the plan is built from the audit, name the audit routine the way the founder's host runs it, and stop.
2. Call `plan`. It returns `{ rank, module, title, why, command, credits }[]`.
3. If the founder named a module, show only those items.
4. Print the top items as a numbered list: title, the one-line why, how to run it, and its credits. `command` is a Claude Code command; in Codex, give the matching phrase from the routines table in SKILL.md instead. Then the total credits for the list against the balance, for example "Top 5 cost 21 credits; you have 18. The first 3 fit."
5. Mark items whose routine is only partly built (list, reach) as "later" and say what that routine can do today.
6. End with the single next routine to run. Do not start it; the founder runs it.

Never add moves for channels the audit marked red, and never reorder the server's ranking by guesswork. If you disagree with an item, say why in one line under it.

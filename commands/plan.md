---
description: The ranked queue for this week, built only from what the audit opened. Reads, does not run anything.
argument-hint: "[module]"
allowed-tools: mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__plan, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:plan

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md). This command reads only; it never calls a paid tool.

Optional module filter from the founder: $ARGUMENTS

## Procedure

1. Call `workspace` for credits and plan. Call `access`. If there is no audit yet, say "Run /shipfound:audit first; the plan is built from it" and stop.
2. Call `plan`. It returns `{ rank, module, title, why, command, credits }[]`.
3. If the founder named a module (fixes, content, index, listings, communities, inbox, tracking), show only those items.
4. Print the top items as a numbered list: title, the one-line why, the command to run it, and its credits. Then the total credits for the list against the balance, for example "Top 5 cost 21 credits; you have 18. The first 3 fit."
5. Mark items whose command is not built yet (`/shipfound:list`, `/shipfound:reach`, `/shipfound:test`) as "later" and say what the command can do today.
6. End with the single next command to run. Do not start it; the founder runs it.

Never add moves for channels the audit marked red, and never reorder the server's ranking by guesswork. If you disagree with an item, say why in one line under it.

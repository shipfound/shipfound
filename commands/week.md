---
description: The Monday routine. Re-check what moved, verify what is due, then the top 5 moves. Partly built; see the note.
argument-hint: "[module]"
allowed-tools: AskUserQuestion, Read, Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__visibility, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__plan, mcp__plugin_shipfound_shipfound__experiment_results
---

# /shipfound:week

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its week routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/week.md). Read both before you act. The routine is the procedure; this command only starts it.

Module to focus the top 5 on, if any: $ARGUMENTS

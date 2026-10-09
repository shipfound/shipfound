---
description: Community replies and one-to-one inbox drafts. You post and send; Shipfound never does. Partly built; see the note.
argument-hint: "[thread url | signups | network]"
allowed-tools: AskUserQuestion, Read, Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__authenticate, mcp__plugin_shipfound_shipfound__complete_authentication, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__reach_drafts, mcp__plugin_shipfound_shipfound__reach_mark
---

# /shipfound:reach

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its reach routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/reach.md). Read both before you act. The routine is the procedure; this command only starts it.

What to work on: $ARGUMENTS

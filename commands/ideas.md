---
description: Features people ask for on Reddit and X, found for you and grouped by the problem they solve, each with the posts behind it and the smallest version to ship first. Free once a week on Builder and Growth.
argument-hint: "[idea key | run]"
allowed-tools: AskUserQuestion, Read, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__ideas, mcp__plugin_shipfound_shipfound__ideas_skip, mcp__plugin_shipfound_shipfound__grow_answer, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:ideas

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its ideas routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/ideas.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

Idea key or run, if given: $ARGUMENTS

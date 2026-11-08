---
description: Bullseye Test™. Bet that X% of the exact people who have the problem will do Z, sized into how many must hear from you, then send each day's personal messages (email, X DM, Reddit) and read pass or fail.
argument-hint: "[send, read, extend or stop, with the test's id]"
allowed-tools: AskUserQuestion, Read, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__goals_list, mcp__plugin_shipfound_shipfound__mail_setup, mcp__plugin_shipfound_shipfound__bullseye_plan, mcp__plugin_shipfound_shipfound__bullseye_add, mcp__plugin_shipfound_shipfound__bullseye_batch, mcp__plugin_shipfound_shipfound__bullseye_mark, mcp__plugin_shipfound_shipfound__bullseye_read, mcp__plugin_shipfound_shipfound__bullseye_change, mcp__plugin_shipfound_shipfound__record_lesson
---

# /shipfound:bullseye

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its bullseye routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/bullseye.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

What to work on: $ARGUMENTS

---
description: See every user and what they do after signing up. Adds a few lines to your product's server (signup, sign-in, main actions, payment), then reads who activated, who comes back and where they came from. Free.
argument-hint: "[read]"
allowed-tools: AskUserQuestion, Read, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__users_activation, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__record_lesson
---

# /shipfound:users

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its users routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/users.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

Input: $ARGUMENTS

---
description: A personal note to each person who signed up and got stuck, saying what they did, with the one offer you pick, drafted in your mailbox for you to send. Read two weeks later on whether they activated or paid. Free.
argument-hint: "[offer]"
allowed-tools: AskUserQuestion, Read, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__followup_offer, mcp__plugin_shipfound_shipfound__followup_targets, mcp__plugin_shipfound_shipfound__mail_setup, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__record_lesson, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:followup

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its followup routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/followup.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

offer, if given: $ARGUMENTS

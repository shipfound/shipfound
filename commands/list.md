---
description: Directory and marketplace listings, picked for your product and filled in your Chrome one after another for you to submit.
argument-hint: "[site | marketplaces]"
allowed-tools: AskUserQuestion, Read, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__listing_targets, mcp__plugin_shipfound_shipfound__listing_skip
---

# /shipfound:list

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its list routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/list.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

Site, if any: $ARGUMENTS

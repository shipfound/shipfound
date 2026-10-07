---
description: Directory and marketplace listings, picked for your product and filled in your Chrome one after another for you to submit.
argument-hint: "[site]"
allowed-tools: Read, Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__listing_targets
---

# /shipfound:list

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its list routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/list.md). Read both before you act. The routine is the procedure; this command only starts it.

Site, if any: $ARGUMENTS

---
description: Listings on review sites, launch sites and marketplaces, filled in your Chrome for you to submit. Partly built; see the note.
argument-hint: "[site]"
allowed-tools: Read, Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:list

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its list routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/list.md). Read both before you act. The routine is the procedure; this command only starts it.

Site, if any: $ARGUMENTS

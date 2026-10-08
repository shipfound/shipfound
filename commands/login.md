---
description: Sign this session in to Shipfound. Gives you a link and a code to approve in your browser; nothing to restart.
argument-hint: "[nothing needed]"
allowed-tools: AskUserQuestion, Read, Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace
---

# /shipfound:login

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md). Read both before you act. The routine is the procedure; this command only starts it.

Anything the founder added: $ARGUMENTS

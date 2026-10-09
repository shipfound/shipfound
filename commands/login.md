---
description: Sign in to Shipfound, once per machine. Checks you are signed in, and tells you how if not.
argument-hint: "[nothing needed]"
allowed-tools: AskUserQuestion, Read, Bash(script -q /dev/null claude mcp login plugin:shipfound:shipfound), Bash(script -qec "claude mcp login plugin:shipfound:shipfound" /dev/null), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__authenticate, mcp__plugin_shipfound_shipfound__complete_authentication, mcp__plugin_shipfound_shipfound__workspace
---

# /shipfound:login

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md). Read both before you act. The routine is the procedure; this command only starts it.

Anything the founder added: $ARGUMENTS

---
description: Access audit (11 areas, read only, about 3 minutes) plus the free baseline AI visibility run. Start here.
argument-hint: "[domain]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, WebFetch, Bash(git status *), Bash(git remote *), Bash(git log *), Bash(gh auth status *), Bash(gh repo view *), Bash(gh search repos *), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__record_access, mcp__plugin_shipfound_shipfound__visibility, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__shipped, Bash(gh search prs *)
---

# /shipfound:audit

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its audit routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/audit.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

Domain, if the founder gave one: $ARGUMENTS

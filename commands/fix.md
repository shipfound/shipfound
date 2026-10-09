---
description: Site fixes as themed pull requests. Installs tracking first if it is not live yet.
argument-hint: "[theme | url]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, WebFetch, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh repo view *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), Bash(script -q /dev/null claude mcp login plugin:shipfound:shipfound), Bash(script -qec "claude mcp login plugin:shipfound:shipfound" /dev/null), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__authenticate, mcp__plugin_shipfound_shipfound__complete_authentication, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__tracking_install, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__goals, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:fix

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its fix routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/fix.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

Theme or URL, if any: $ARGUMENTS

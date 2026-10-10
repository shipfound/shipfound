---
description: Get pages indexed. Sitemap and IndexNow key file by PR, then sitemap submits and Request indexing in your Chrome, within quotas.
argument-hint: "[url ...]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, WebFetch, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(openssl rand -hex 16), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:index

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its index routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/index.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

URLs to index, if any: $ARGUMENTS

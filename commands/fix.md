---
description: Site fixes as themed pull requests. Installs tracking first if it is not live yet.
argument-hint: "[theme | url]"
allowed-tools: Read, Grep, Glob, Edit, Write, WebFetch, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh repo view *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__tracking_install, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__goals, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:fix

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its fix routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/fix.md). Read both before you act. The routine is the procedure; this command only starts it.

Theme or URL, if any: $ARGUMENTS

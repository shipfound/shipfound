---
description: A/B tests from your analytics. Proposes a change with evidence, sizes it from your traffic, ships the variant as a PR, and reads it honestly.
argument-hint: "[page, goal or test key]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh repo view *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__goals, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__tracking_install, mcp__plugin_shipfound_shipfound__experiment_create, mcp__plugin_shipfound_shipfound__experiment_results, mcp__plugin_shipfound_shipfound__experiment_close, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:test

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its test routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/test.md). Read both before you act. The routine is the procedure; this command only starts it.

Page, goal or test key, if any: $ARGUMENTS

---
description: A/B tests from your analytics. Proposes a change with evidence, sizes it from your traffic, ships the variant as a PR, and reads it honestly.
argument-hint: "[page, goal or test key]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh repo view *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__goals_list, mcp__plugin_shipfound_shipfound__goals_save, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__tracking_install, mcp__plugin_shipfound_shipfound__experiment_create, mcp__plugin_shipfound_shipfound__experiment_results, mcp__plugin_shipfound_shipfound__experiment_close, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:test

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its test routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/test.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

Page, goal or test key, if any: $ARGUMENTS

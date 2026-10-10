---
description: Build a free tool for your site that your buyers search for, or an agent skill for your product, as a PR or a repo you publish.
argument-hint: "<tool | skill> [idea]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git init *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), Bash(claude plugin validate *), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__plan, mcp__plugin_shipfound_shipfound__build_ideas, mcp__plugin_shipfound_shipfound__keyword_research, mcp__plugin_shipfound_shipfound__goals_list, mcp__plugin_shipfound_shipfound__goals_save, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:build

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its build routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/build.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

What to build: $ARGUMENTS

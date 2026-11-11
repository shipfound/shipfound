---
description: "Conversion QA Walk™. Every step from first visit to payment walked on desktop and phone: copy, errors, layout, forms, emails, checkout. Each issue with the step and the fix, blockers first. Free."
argument-hint: "[fix | disable]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__qa_walk, mcp__plugin_shipfound_shipfound__funnel_check, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__record_lesson, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__verify
---

# /shipfound:qa-walk

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its qa-walk routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/qa-walk.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

fix or disable, if given: $ARGUMENTS

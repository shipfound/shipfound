---
description: Whether people who reach your pricing or paywall can pay. Each step to paid counted, the way to pay walked on a phone without paying, your way in read against products like yours, and one change as an A/B test.
argument-hint: "[web | app]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__pricing_check, mcp__plugin_shipfound_shipfound__funnels_save, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__offer_plan, mcp__plugin_shipfound_shipfound__app_downloads, mcp__plugin_shipfound_shipfound__experiment_create, mcp__plugin_shipfound_shipfound__experiment_results, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:pricing

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its pricing routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/pricing.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

web or app, if given: $ARGUMENTS

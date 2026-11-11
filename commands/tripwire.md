---
description: "Tripwire Ladder™. From a free diagnostic to a bigger payment, each rung counted from your own users, then the rung that keeps the fewest built, with what worked for others there. Free."
argument-hint: "[diagnostic | signup | activated | first_payment | bigger_payment]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__ladder, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__experiment_create, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__verify
---

# /shipfound:tripwire

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its tripwire routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/tripwire.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

The rung, if given: $ARGUMENTS

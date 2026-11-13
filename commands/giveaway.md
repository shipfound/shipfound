---
description: Giveaway Drop™. People drop their startup under your post on X or Reddit; the ones you pick, capped by you, get a gift from your product, like credit that lands at signup. Your agent writes the post and each reply; you post. Free.
argument-hint: "[deliver]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh pr create *), Bash(gh pr view *), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__giveaway_plan, mcp__plugin_shipfound_shipfound__giveaway_start, mcp__plugin_shipfound_shipfound__giveaway_replies, mcp__plugin_shipfound_shipfound__giveaway_mark, mcp__plugin_shipfound_shipfound__notes_context, mcp__plugin_shipfound_shipfound__notes_voice, mcp__plugin_shipfound_shipfound__notes_save, mcp__plugin_shipfound_shipfound__reach_mark, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__record_lesson, mcp__plugin_shipfound_shipfound__verify, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:giveaway

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its giveaway routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/giveaway.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

deliver, if given: $ARGUMENTS

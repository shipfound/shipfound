---
description: Build in public posts on X and Reddit about your product, features you shipped told from the problem they solve, and a flagship X Article every 14 days, in your own voice with real images. Your agent fills them in; you post. Free.
argument-hint: "[source key | article [source key] | voice]"
allowed-tools: AskUserQuestion, Read, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), Bash(git log *), Bash(gh pr list *), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__notes_context, mcp__plugin_shipfound_shipfound__notes_voice, mcp__plugin_shipfound_shipfound__notes_save, mcp__plugin_shipfound_shipfound__reach_mark
---

# /shipfound:notes

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its notes routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/notes.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

Source or voice, if given: $ARGUMENTS

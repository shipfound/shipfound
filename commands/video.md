---
description: A short video of your product for a boost or a post on X, one cut per ad in the feed shapes plus an image of each, saved to your Desktop. Your screens recreated and animated in your branding, no sound, 30 seconds at most. Free.
argument-hint: "[redo | ads | post]"
allowed-tools: AskUserQuestion, Read, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), Bash(npm install), Bash(npx playwright install chromium), Bash(npm run sheet), Bash(npm run render), Bash(npm run render:square), Bash(npm run ads), Bash(npm run ads -- *), Bash(npm run thumbs), Bash(cp out/*), Bash(cp public/*), Bash(npx remotion still *), Bash(git log *), Bash(gh pr list *), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__notes_context, mcp__plugin_shipfound_shipfound__notes_voice, mcp__plugin_shipfound_shipfound__notes_save, mcp__plugin_shipfound_shipfound__reach_mark
---

# /shipfound:video

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its video routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/video.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

redo or ads, if given: $ARGUMENTS

---
description: A short video of your product for a boost, one cut per ad in the feed shapes plus an image of each, saved to your Desktop. Your agent recreates its screens and animates them, in your branding, no sound, 30 seconds at most. No screen recording. Free.
argument-hint: "[redo | ads]"
allowed-tools: AskUserQuestion, Read, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), Bash(npm install), Bash(npx playwright install chromium), Bash(npm run sheet), Bash(npm run render), Bash(npm run render:square), Bash(npm run ads), Bash(npm run ads -- *), Bash(npm run thumbs), Bash(cp out/*), Bash(cp public/*), Bash(npx remotion still *), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace
---

# /shipfound:video

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its video routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/video.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

redo or ads, if given: $ARGUMENTS

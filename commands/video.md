---
description: A short video of your product for a boost on X. Your agent recreates its screens and animates them, in your branding, no sound, 30 seconds at most. No screen recording. Free.
argument-hint: "[redo]"
allowed-tools: AskUserQuestion, Read, Bash(sh */scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), Bash(npm install), Bash(npx playwright install chromium), Bash(node capture.mjs*), Bash(npm run sheet), Bash(npm run render), Bash(npx remotion still *), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace
---

# /shipfound:video

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its video routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/video.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

redo, if given: $ARGUMENTS

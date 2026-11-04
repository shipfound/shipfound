---
description: An AI presenter video for an ad or your own TikTok and Instagram, your real screens on their laptop or phone. Your accounts are checked first; priced from its cost and asked for first; saved to your Desktop.
argument-hint: "[ad | post | read]"
allowed-tools: AskUserQuestion, Read, Edit, Write, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), Bash(npm install), Bash(npx playwright install chromium), Bash(npm run capture *), Bash(npm run sheet), Bash(npm run ugc), Bash(npm run ugc -- *), Bash(npx remotion still *), Bash(npx remotion render *), Bash(cp public/*), Bash(cp out/*), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__ugc_plan, mcp__plugin_shipfound_shipfound__ugc_status, mcp__plugin_shipfound_shipfound__ads_setup, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__verify, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__app_downloads, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__notes_voice
---

# /shipfound:ugc

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its ugc routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/ugc.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

When an account for an organic post is not ready, run `/shipfound:social setup` for just those platforms, then come back here. When an ad account is not ready, run that platform's boost setup (`/shipfound:boost meta`, `/shipfound:boost tiktok`), then come back here.

ad, post or read, if given: $ARGUMENTS

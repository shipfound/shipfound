---
description: TikTok and Instagram slideshows in the formats working for your buyers, made from your own screens and saved to your Desktop for you to post; then creators to pay for a post. $0.02 a read.
argument-hint: "[creators | read]"
allowed-tools: AskUserQuestion, Read, Edit, Write, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), Bash(npm install), Bash(npx playwright install chromium), Bash(npm run capture *), Bash(npm run sheet), Bash(npm run shorts), Bash(npm run shorts -- *), Bash(npx remotion still *), Bash(cp public/*), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__shorts_research, mcp__plugin_shipfound_shipfound__mail_setup, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__verify, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__app_downloads, mcp__plugin_shipfound_shipfound__app_keywords, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__notes_voice, mcp__plugin_shipfound_shipfound__assets_save
---

# /shipfound:shorts

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its shorts routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/shorts.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

creators or read, if given: $ARGUMENTS

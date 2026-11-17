---
description: Your 6 social posts this week for TikTok, Reels, Shorts and X, made from your screens, phone-screen formats in turn (tier lists, before and after, more) and an AI presenter, scheduled in your Chrome for you to press Schedule.
argument-hint: "[read | links to posts to remake]"
allowed-tools: AskUserQuestion, Read, Edit, Write, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), Bash(npm install), Bash(npx playwright install chromium), Bash(npm run capture *), Bash(npm run posts), Bash(npm run posts -- *), Bash(npx remotion still *), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__social_set, mcp__plugin_shipfound_shipfound__social_posts_save, mcp__plugin_shipfound_shipfound__social_posts_update, mcp__plugin_shipfound_shipfound__notes_voice, mcp__plugin_shipfound_shipfound__assets_save, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__verify
---

# /shipfound:posts

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its posts routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/posts.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

read, or links to remake, if given: $ARGUMENTS

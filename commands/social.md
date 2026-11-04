---
description: Start your own TikTok and Instagram for your slideshows and videos. Each signup opened in your Chrome for you to create, then the profile filled from your site with a tagged link, switched to Business and connected for ads. Free.
argument-hint: "[setup | tiktok | instagram]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__record_access, mcp__plugin_shipfound_shipfound__social_setup, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__verify, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:social

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its social routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/social.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

setup, tiktok or instagram, if given: $ARGUMENTS

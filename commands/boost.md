---
description: A small paid test of your own X posts, each with a video of your product. Planned for you, filled in X Ads Manager for you to launch, read on clicks and traced to signups.
argument-hint: "[post link | read | stop]"
allowed-tools: AskUserQuestion, Read, Bash(npm install), Bash(npx playwright install chromium), Bash(npm run sheet), Bash(npm run render), Bash(npx remotion still *), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__boost_candidates, mcp__plugin_shipfound_shipfound__boost_plan, mcp__plugin_shipfound_shipfound__boost_record, mcp__plugin_shipfound_shipfound__boost_results, mcp__plugin_shipfound_shipfound__grow_answer
---

# /shipfound:boost

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its boost routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/boost.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

Post link, read or stop, if any: $ARGUMENTS

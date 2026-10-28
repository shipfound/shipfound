---
description: SEO and AI search as one weekly set, picked from what Google and Bing already show for your site, a crawl of every page and the AI answers you lose. Each change read again at 28 and 56 days.
argument-hint: "[read | crawl | programmatic]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__seo_read, mcp__plugin_shipfound_shipfound__seo_crawl, mcp__plugin_shipfound_shipfound__seo_set, mcp__plugin_shipfound_shipfound__ideas, mcp__plugin_shipfound_shipfound__ideas_check, mcp__plugin_shipfound_shipfound__research, mcp__plugin_shipfound_shipfound__seo_programmatic_check, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__verify, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__content_brief, mcp__plugin_shipfound_shipfound__check_content, mcp__plugin_shipfound_shipfound__keyword_research, mcp__plugin_shipfound_shipfound__bing_connect, mcp__plugin_shipfound_shipfound__bing_submit, mcp__plugin_shipfound_shipfound__index_status, mcp__plugin_shipfound_shipfound__outreach_targets, mcp__plugin_shipfound_shipfound__listing_targets, mcp__plugin_shipfound_shipfound__visibility
---

# /shipfound:seo

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its seo routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/seo.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

Input, if any: $ARGUMENTS

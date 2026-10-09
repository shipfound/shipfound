---
description: Your iOS app on the App Store. Audit the listing free, ship the fixes, turn reviews into a to-do list, write its own site, set up screenshot A/B tests and custom product pages, and propose Apple Ads changes for you to approve.
argument-hint: "[App Store link | country code | reviews | site | connect | test | cpp | ads]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__authenticate, mcp__plugin_shipfound_shipfound__complete_authentication, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__app_add, mcp__plugin_shipfound_shipfound__app_audit, mcp__plugin_shipfound_shipfound__app_reviews, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__verify, mcp__plugin_shipfound_shipfound__app_site, mcp__plugin_shipfound_shipfound__app_metadata, mcp__plugin_shipfound_shipfound__app_metadata_stage, mcp__plugin_shipfound_shipfound__app_screenshots, mcp__plugin_shipfound_shipfound__app_cpp, mcp__plugin_shipfound_shipfound__app_experiment, mcp__plugin_shipfound_shipfound__app_downloads, mcp__plugin_shipfound_shipfound__ads_review, mcp__plugin_shipfound_shipfound__ads_propose, mcp__plugin_shipfound_shipfound__keyword_research
---

# /shipfound:aso

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its aso routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/aso.md). Read both before you act. The routine is the procedure; this command only starts it.

Input, if any: $ARGUMENTS

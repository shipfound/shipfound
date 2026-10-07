---
description: Your iOS app's App Store listing. Audit it free, ship the fixes to its metadata as a PR, turn reviews into a to-do list, and verify changes once Apple releases them.
argument-hint: "[App Store link | reviews | country code]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__app_add, mcp__plugin_shipfound_shipfound__app_audit, mcp__plugin_shipfound_shipfound__app_reviews, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__verify
---

# /shipfound:aso

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its aso routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/aso.md). Read both before you act. The routine is the procedure; this command only starts it.

Input, if any: $ARGUMENTS

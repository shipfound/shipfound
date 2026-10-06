---
description: Write one content page (glossary, answer, comparison, alternatives, post, report) in your stack, gate it, and open a PR.
argument-hint: "<glossary|answer|comparison|alternatives|post|report> [topic]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__plan, mcp__plugin_shipfound_shipfound__check_content, mcp__plugin_shipfound_shipfound__record_action
---

# /shipfound:write

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its write routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/write.md). Read both before you act. The routine is the procedure; this command only starts it.

Type and topic: $ARGUMENTS

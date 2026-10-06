---
description: Access audit (12 areas, read only, about 3 minutes) plus the free baseline AI visibility run. Start here.
argument-hint: "[domain]"
allowed-tools: Read, Grep, Glob, WebFetch, Bash(git status *), Bash(git remote *), Bash(git log *), Bash(gh auth status *), Bash(gh repo view *), Bash(gh search repos *), mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__record_access, mcp__plugin_shipfound_shipfound__visibility, mcp__plugin_shipfound_shipfound__tracking_check
---

# /shipfound:audit

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its audit routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/audit.md). Read both before you act. The routine is the procedure; this command only starts it.

Domain, if the founder gave one: $ARGUMENTS

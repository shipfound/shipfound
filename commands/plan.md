---
description: The ranked queue for this week, built only from what the audit opened. Reads, does not run anything.
argument-hint: "[module]"
allowed-tools: Read, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__plan, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:plan

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its plan routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/plan.md). Read both before you act. The routine is the procedure; this command only starts it.

Module filter, if any: $ARGUMENTS

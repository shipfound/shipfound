---
description: Answer an analytics question in plain words with numbers, for example "which channel brought paid users in September".
argument-hint: "<question>"
allowed-tools: Read, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__goals, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:analytics

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its analytics routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/analytics.md). Read both before you act. The routine is the procedure; this command only starts it.

The question: $ARGUMENTS

---
description: Credits, what shipped, what is verified and what is still claimed, tracking state, and the results app link.
allowed-tools: mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__tracking_check
---

# /shipfound:status

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and ${CLAUDE_PLUGIN_ROOT}/skills/shipfound/references/verification.md.

## Procedure

1. Call `workspace`: plan, credit balance, access summary, tracking state, links.
2. Call `shipped` with `{}`. Count by state (VERIFIED, CLAIMED, FAILED) and by module.
3. If a tracking PR is recorded, or `workspace` shows tracking installed but not confirmed, call `tracking_check` and report what it has and has not seen (events, crawler hits, goals).
4. Print:
   - Plan and credits: "Builder, 212 credits left."
   - Access: "8 of 12 open."
   - Shipped: "11 verified, 4 claimed, 1 failed", then the claimed and failed items, one line each with title and age.
   - Tracking: one line from `tracking_check`.
   - The results app link from `workspace` (else https://shipfound.co).
5. Offer to verify the claimed items the founder says are merged or live: "`verify` costs 1 credit each; 4 items is 4 credits." Only on a yes, and only those items; if the total is over 5 credits, wait for an explicit yes with the number in it.

Never call something done that is not VERIFIED.

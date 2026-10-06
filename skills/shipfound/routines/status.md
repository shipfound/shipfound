# Routine: status

Credits, what shipped, what is verified and what is still claimed, tracking state, and the results app link.

Follow [../references/verification.md](../references/verification.md).

Input: an optional module filter (fixes, content, index, listings, communities, inbox, tracking, experiments).

## Procedure

1. Call `workspace`: plan, credit balance, access summary, tracking state, links.
2. Call `shipped` with `{}`, or `{ module }` with the module in upper case if the founder named one. Count by state (VERIFIED, CLAIMED, FAILED) and by module.
3. If a tracking PR is recorded, or `workspace` shows tracking installed but not confirmed, call `tracking_check` and report what it has and has not seen (events, crawler hits, goals).
4. Print:
   - Plan and credits: "Builder, 212 credits left."
   - Access: "8 of 12 open."
   - Shipped: "11 verified, 4 claimed, 1 failed", then the claimed and failed items, one line each with title and age.
   - Tracking: one line from `tracking_check`.
   - The results app link from `workspace` (else https://www.shipfound.co).
5. Offer to verify the claimed items the founder says are merged or live: "`verify` costs 1 credit each; 4 items is 4 credits." Only on a yes, and only those items; if the total is over 5 credits, wait for an explicit yes with the number in it.

Never call something done that is not VERIFIED.

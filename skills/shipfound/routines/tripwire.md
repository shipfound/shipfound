# Routine: tripwire (Tripwire Ladder™)

The way from a stranger to a bigger payment, as rungs: a free diagnostic (a check or tool that runs the product's own job), signup or trial, the free part used, a first small payment, then a bigger one. Each rung is counted from the product's own people, the rung that keeps the fewest is found, and that one thing is built. For Shipfound itself: the website checker, then signup, the $10 used, a top-up, a bigger top-up. Free.

Input: nothing, or the rung grow offered (`diagnostic`, `signup`, `activated`, `first_payment`, `bigger_payment`).

Follow [../references/pr-conventions.md](../references/pr-conventions.md) and [../references/verification.md](../references/verification.md).

## Hard lines here

- Prices are the founder's. Never set or change a price, a plan or a discount: fill it in their payment dashboard and stop before Save.
- The diagnostic is free and real: it runs the product's own job on what the visitor gives, never a made-up score.
- It shows something before any signup (how many things it found, and one in full). Never an email gate in front of every result.
- No fake scarcity or urgency: no timers, no "only 3 left" that is not true.

## Procedure

1. Call `workspace` with `repo`, then `ladder` (free). `needs`: say it in one line and stop. When user events are missing, the users routine comes first.
2. **The diagnostic.** No `def`: read the code and the site for a free check or tool anyone can run before signing up, and for an event the product reports when someone runs it. Ask the founder in one line whether that is their diagnostic, then `ladder` with `define` (`diagnosticPath`, `diagnosticEvent`, `label`). None: the diagnostic is the rung to build.
3. **The ladder**, in the chat: one line per rung, its people and the share of the rung before that reached it, over the window (`days`). Then the rung that keeps the fewest (`weakest`, with its `why`), what to build there (`play.build`) and what it rests on (`play.evidence`). Too few people anywhere: say that what brings people to the diagnostic comes first, and stop.
4. **Plan the build** for that rung in the founder's stack: what changes, where in the code, what a visitor sees, and any price as theirs to set. AskUserQuestion: "Build it (Recommended)", "Change it", "Not now". Never build before a yes.
   - **diagnostic:** a free tool (the build routine) that runs the product's job on what the visitor types, shows how many things it found and one in full, keeps the rest for after signup, carries what they typed into the signup, and reports an event when it runs (the users routine's event). Then `ladder` with `define` for its path and event.
   - **signup:** the diagnostic's result shows the count and one in full; the rest opens with an account that lands on the result. A page change: an A/B test (the test routine).
   - **activated:** the first screen after signup runs the product on what they gave the diagnostic, before any install, key or invite, and says the one next step. Those already stuck: the followup routine.
   - **first_payment:** where the free part ends, in the product: the next job's price and one small amount to pay now, with the price, tax and what it opens said before the card. The amount is the founder's; the product or payment link is filled in their payment dashboard for them to save. An A/B test where a page changes.
   - **bigger_payment:** right after a paid result lands, one offer to go bigger: a larger amount with a bonus, auto top-up, or a yearly plan, at the founder's prices.
5. **Ship it** as one PR (branch `shipfound/ladder-<rung>`), and `record_action` with `module` FIXES, `kind` PR, `meta` `{ type: "ladder", rung: "<rung>" }`. Anything in the payment dashboard: filled, and they save it.
6. **Read it after 28 days:** `ladder` again. In one line, the rung's share before and after. Then `verify` the record.

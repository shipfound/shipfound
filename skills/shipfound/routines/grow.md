# Routine: grow

The daily front door. The founder runs it whenever they sit down to work on growth, without having to know which routine comes next. It looks first, then offers one move.

Input: optional. A module ("content", "listings", "fixes") means the founder wants a move from that area today.

## Procedure

1. Call `workspace`. Not signed in: run the login routine, then carry on. If `pluginUpdate` is there, pass its line on once.
2. Setup comes first, and grow routes to it rather than repeating it:
   - No audit yet (`access` is null): say the plan is built from the audit, then run the audit routine from its first step.
   - Otherwise carry on; `today` puts the baseline and tracking first by itself while they are missing.
3. Call `today` (free). It returns:
   - `happened`: facts since the founder's last session (AI visits, AI crawler hits, conversions, what got verified or failed, a new visibility run).
   - `due`: a test that reached a verdict, shipped work old enough to verify (`actionIds`, 1 credit each). Quick things, each with its own short ask.
   - `offer`: the one move for today (the real work; it is a due item only on a day with nothing else), with `key`, `title`, `why`, `command`, `credits`. Only moves with concrete work behind them: the checks still failing on the live site, the directories not listed yet, the page worth writing with its search volume. Never the same move as yesterday.
   - `after`: the next two, for a no. `resting`: moves held back because they were offered or declined lately.
   If the founder named a module, use the first move of that module among `offer` and `after`; if there is none, say so in one line and offer `offer`.
4. Print the brief in under 10 lines:
   - First run (`firstRun`): one line on what grow is: "Run this whenever you sit down to work on growth. It checks what changed and what is still failing, then offers one move."
   - `happened`, one line each, as given. Nothing happened: say "Quiet since <date>."
   - `due`, one line each, with its own short ask and price: "PR #14 merged 2 days ago. Verify it? 1 credit." "Test pricing-headline: B wins. Close it and keep B?"
   - Today: the `offer` title, the reason from `why` with its number, and its price. Say how to start it the way the founder's host runs it.
   - Next, when `after` has moves: one line saying today's move comes first and naming what is lined up after it, by title, so the founder knows the rest of the menu is coming: "This one first, because it stops engines reading the site. After it: listing on BetaList and SaaSHub, then writing "What is AEO"." This line names the moves without offering them, so there is no price and no question.
   - `credits.ask`, if it is there: one line, as given (what they can buy and the billing link). The founder buys; you never do.
5. End with the offer and one question, with its price: "Start it? 6 credits." The founder can answer the due asks in the same reply ("verify it, and yes"): do the due items first (a verify on a yes; a closed test through the test routine), then the offer. Pass the answer on the offer to `grow_answer` with its `key`, before anything else.
   - Yes: start it.
     - A routine (`command` is a routine's command, with its arguments): read that routine and run it from its first step, with those arguments. The price rule applies as usual (over 5 credits: the price and the balance, then wait for a yes; this yes counts when it named the price).
     - `verify`: call `verify` once for each id in `actionIds`, then report each state. Never say done for anything that is not VERIFIED.
     - `visibility_run`: call it (15 credits, the yes named the price) and say where the result will show.
   - No: offer the first of `after` the same way. Two noes: stop and name what is `resting`, so the founder knows they can ask for any of it.
6. When the move is finished, the hand-over (SKILL.md) takes over: `record_action`'s `next` is the next move. Stop when the founder says they are done, and tell them to run grow next time they sit down, the way their host runs it (the command in Claude Code, "What should I do today?" in Codex).

`offer` is null: say what happened, that there is nothing new to do today, and name what is resting. Do not invent work and do not fall back to the plan's generic items.

Never offer more than one move at a time, and never start one without a yes. Naming what is lined up after it is not an offer.

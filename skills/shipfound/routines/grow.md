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
   - `due`, one line each, with its price: "The fix for your Google snippet went live 2 days ago. Checking it is live is 1 credit." "Test of the pricing headline: the new one wins."
   - Today: the `offer` title, the reason from `why` with its number, and its price.
   - In Codex (no question tool), when `after` has moves: one line saying today's move comes first and naming what is lined up after it, by title: "This one first, because it stops engines reading the site. After it: listing on BetaList and SaaSHub, then writing "What is AEO"." In Claude Code the question in step 5 shows them as choices, so skip this line.
   - `credits.ask`, if it is there: one line, as given (what they can buy and the billing link). The founder buys; you never do.
5. Ask, as the hand-over in SKILL.md says:
   Word every option the way "Asking the founder" (SKILL.md) says: one "(Recommended)" first, plain words, no jargon.
   - **Claude Code, with `due` items:** ask about them first, alone. One AskUserQuestion, header "Due", multiSelect: first "Check all <n> (Recommended)" (or "Close the test (Recommended)"), its description the total price and what checking means ("3 credits. Shipfound checks each one on your live site; until then it counts as claimed, not done."); then one option per item, in plain words with its price ("Check your Google snippet", "1 credit: confirms the line under your link in Google results is the new one."). Do the ones picked (a verify; a closed test through the test routine), report each result in one line, and only then ask about today's move below. Nothing picked: go straight to it.
   - **Claude Code, today's move:** one AskUserQuestion, header "Today": the `offer` as the first option, labelled "<the move in a few words> (Recommended)", its description the reason and the price; then each move in `after`, with its description and price; then "Done for now".
   - **Codex:** end with the due asks and the offer, each with its price, and one question: "Check them first (3 credits), then start it? 6 credits." Do the due items first, then the offer.
   Pass the answer to `grow_answer` before anything else: `yes` on the key of the move picked. "Done for now" records nothing. A typed no (Codex, or "Other") is `no` on the offer's key.
   - A move picked (or a yes): start it.
     - A routine (`command` is a routine's command, with its arguments): read that routine and run it from its first step, with those arguments. The price rule applies as usual (over 5 credits: the price and the balance, then wait for a yes; this yes counts when it named the price).
     - `verify`: call `verify` once for each id in `actionIds`, then report each state. Never say done for anything that is not VERIFIED.
     - `visibility_run`: call it (15 credits, the yes named the price) and say where the result will show.
   - Codex no: offer the first of `after` the same way. Two noes: stop and name what is `resting`, so the founder knows they can ask for any of it.
   - "Done for now": stop, and name what is `resting` if anything is.
6. When the move is finished (its last step done, including anything the founder does by hand right then, such as posting or pressing submit; see "Only once the current job is finished" in SKILL.md), the hand-over (SKILL.md) takes over: `record_action`'s `next` is the next move. Stop when the founder says they are done, and tell them to run grow next time they sit down, the way their host runs it (the command in Claude Code, "What should I do today?" in Codex).

`offer` is null: say what happened, that there is nothing new to do today, and name what is resting. Do not invent work and do not fall back to the plan's generic items.

Start one move at a time, and never start one the founder did not pick. In Claude Code the alternatives are choices in the same question; in Codex, naming what is lined up after it is not an offer.

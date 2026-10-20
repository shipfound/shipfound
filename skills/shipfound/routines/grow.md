# Routine: grow

The daily front door. The founder runs it whenever they sit down to work on growth, without having to know which routine comes next. It looks first, then offers one move.

Input: optional. A module ("content", "listings", "fixes", "convert", "offer", "build", "launch", "notes", "research") means the founder wants a move from that area today.

## Procedure

1. Call `workspace` with `repo`. Not signed in: run the login routine, then carry on. If `pluginUpdate` is there, pass its line on once. If `repo` is not CONFIRMED, settle it first (SKILL.md, "The repo").
2. Setup comes first, and grow routes to it rather than repeating it:
   - No audit yet (`access` is null): say the plan is built from the audit, then run the audit routine from its first step.
   - Otherwise carry on; `today` puts the baseline and tracking first by itself while they are missing.
3. If you are in the founder's repo, count this week's commits to the product the way routines/notes.md, step 1, says (Shipfound's own PRs left out) and pass it as `repoCommits`, so `today` can offer a build in public note on the week's work. Then call `today` (free). It returns:
   - `happened`: facts since the founder's last session (AI visits, AI crawler hits, conversions, what got verified or failed, a new visibility run).
   - `due`: a test that reached a verdict, shipped work old enough to verify (`actionIds`, 1 credit each). Quick things, each with its own short ask.
   - `offer`: the one move for today (the real work; it is a due item only on a day with nothing else), with `key`, `title`, `why`, `command`, `credits`. Only moves with concrete work behind them: the checks still failing on the live site, the directories not listed yet, the page worth writing with its search volume. Never the same move as yesterday.
   - `after`: the next two, for a no. `more`: every other move with work behind it, for a founder who wants to look further. `catalog`: every other kind of move Shipfound makes (a build in public post, a product video, a boost, a question about the numbers...), so the founder can find what exists without knowing to ask; `ready: false` means it needs something first, and its `why` starts with what. `resting`: moves held back because they were declined lately.
   - `research`, on Builder and Growth when this run started the week's free study of products a step ahead of the founder: say it in one plain line after the brief, as `next` says (it is running, free, and what it finds comes in a few minutes). Nothing to ask; carry on. What a study finds comes back as moves keyed `RESEARCH:...`: what two or more of those products do that this site does not, at most one among the choices.
   If the founder named a module, use the first move of that module among `offer`, `after`, `more` and `catalog`; if there is none, say so in one line and offer `offer`.
4. Print the brief in under 10 lines:
   - First run (`firstRun`): one line on what grow is: "Run this whenever you sit down to work on growth. It checks what changed and what is still failing, then offers one move."
   - `happened`, one line each, as given. Nothing happened: say "Quiet since <date>."
   - `due`, one line each, with its price: "The fix for your Google snippet went live 2 days ago. Checking it is live is 1 credit." "Test of the pricing headline: the new one wins."
   - Today: the `offer` title, the reason from `why` with its number, and its price.
   - In Codex (no question tool), when `after` has moves: one line saying today's move comes first and naming what is lined up after it, by title: "This one first, because it stops engines reading the site. After it: listing on BetaList and SaaSHub, then writing "What is AEO"." Then one more line: "<n> other moves too, like a build in public post and a product video; ask to see them all." (n is `more` and `catalog` together). In Claude Code the question in step 5 shows them as choices, so skip this line.
   - `credits.ask`, if it is there: one line, as given (what they can buy and the billing link). The founder buys; you never do.
5. Ask, as the hand-over in SKILL.md says:
   Word every option the way "Asking the founder" (SKILL.md) says: one "(Recommended)" first, plain words, no jargon.
   - **Claude Code, the first screen:** one AskUserQuestion call, so the founder sees what is due and what they can do at once. Never ask about `due` alone first.
     - With `due` items, its first question, header "Due", multiSelect: first "Check all <n> (Recommended)" (or "Close the test (Recommended)", "Read the X boost (Recommended)"), its description the total price and what it means ("3 credits. Shipfound checks each one on your live site; until then it counts as claimed, not done."); then one option per item, in plain words with its price ("Check your Google snippet", "1 credit: confirms the line under your link in Google results is the new one."). Picking none leaves them for next time; there is no "Skip" option.
     - Then the question header "Today": the `offer` first, labelled "<the move in a few words> (Recommended)", its description the reason and the price; then each move in `after`, with its description and price; then "Show more", its description how many others there are (`more` and `catalog` together) and two of them in a few words, one from `catalog` when there is one ("14 more, like listing on SaaSHub and a build in public post"); then "Done for now" only if there is room (four options at most; Esc also stops). Keep the order `today` gives.
     - Do the due ones picked first (a verify; a closed test through the test routine; a boost read through the boost routine), report each result in one line, then start the move picked.
   - **Show more**, when picked: the first time, print every move in `more` and then `catalog`, numbered, one line each with its reason in a few words and its price, and for one with `ready: false` what it needs first. Then one AskUserQuestion, header "More moves": the next three in that order as options, each with its description and price, then "Show more" while any are left ("<n> more, like <the next two>"), else "Done for now". Keep going three at a time, never stopping before the list ends; the founder can also type any number from the list. The pick is a yes on its key, as below (a catalog move too). A boost (a small paid test on X, Meta or Reddit) can be the offer: say in its description that it spends their own money, $30 to $100 they approve inside the boost, and that the ad account and tracking come first. Never present it as free.
   - **Codex:** end with the due asks and the offer, each with its price, and one question: "Check them first (3 credits), then start it? 6 credits." Do the due items first, then the offer.
   Pass the answer to `grow_answer` before anything else: `yes` on the key of the move picked. "Show more" and "Done for now" record nothing. A typed no (Codex, or "Other") is `no` on the offer's key.
   - A move picked (or a yes): start it. A `catalog` move with `ready: false`: say in one line what it needs and offer to set that up first (most need the audit for that area; tracking goes through the fix routine).
     - A routine (`command` is a routine's command, with its arguments): read that routine and run it from its first step, with those arguments. The price rule applies as usual (over 5 credits: the price and the balance, then wait for a yes; this yes counts when it named the price).
     - A move from the study of products a step ahead (its key starts with `RESEARCH:`) routes the same way, through the routine its `command` names; its `why` is what those products do. Every `record_action` for it carries `meta.research` with the move's key, so it is never offered again (routines/research.md, step 6).
     - `verify`: call `verify` once for each id in `actionIds`, then report each state. Never say done for anything that is not VERIFIED.
     - `visibility_run`: call it (15 credits, the yes named the price) and say where the result will show.
   - Codex no: offer the first of `after` the same way. Two noes: stop and say how many other moves there are in `more` and `catalog`, and what is `resting`, so the founder knows they can ask for any of it. Asked to see more: list `after`, `more` and `catalog`, numbered, and let them pick.
   - "Done for now": stop, and name what is `resting` if anything is.
6. When the move is finished (its last step done, including anything the founder does by hand right then, such as posting or pressing submit; see "Only once the current job is finished" in SKILL.md), the hand-over (SKILL.md) takes over: `record_action`'s `next` is the next move. Stop when the founder says they are done, and tell them to run grow next time they sit down, the way their host runs it (the command in Claude Code, "What should I do today?" in Codex).

`offer` is null: say what happened, that there is nothing new to do today, and name what is resting. Do not invent work. Then ask over `catalog` the way "Show more" does, so the founder can still pick anything Shipfound makes.

Start one move at a time, and never start one the founder did not pick. In Claude Code the alternatives are choices in the same question; in Codex, naming what is lined up after it is not an offer.

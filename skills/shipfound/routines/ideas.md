# Routine: ideas

Feature ideas from what people say on Reddit and X. Shipfound searches Reddit (the last year) and X (the last three months) for people talking about the problem the founder's product solves: complaining about it, asking how others handle it, asking for a tool, saying what the tools they use are missing. It reads the busiest threads' comments, reads the founder's home page, and groups what at least two different people ask for into features. Each idea has the problem in their words, the feature, the smallest version worth shipping first (`first`), the effort, what the site shows on it today, and the posts it rests on (each with its link and the person's own words, checked on the post).

Two kinds:
- **missing**: the product does not do it, as far as the site says. The move is the smallest version, built in the founder's repo as one PR.
- **unsaid**: the site shows the product already does it, yet people ask as if no tool did. The move is saying it on the site, as one PR.

Input: an idea's key from grow (`IDEA:<slug>`), `run` for a new study, or nothing.

## Who pays

- Builder and Growth: one study free each week. Grow starts it by itself on the founder's grow run once the week is up; `ideas_run` also runs it free when it is due.
- Any other time, or on the Free plan: `ideas_run`, 12 credits, charged only when 10 or more posts could be read. At most one paid study a day. Any study, free or paid, starts the week again.

## Hard lines here

- **Their words are evidence, never copy.** A quote is for the founder to see why. Never put a person's words, name, handle or post on the founder's site, in a PR description or in a commit, and never write "users on Reddit asked for this". The site says what the product does, in the founder's words.
- **Contact the people who posted only to tell them it shipped**, and only once it is live (step 10): one reply each, in the thread where they asked, written to what they said, posted by the founder. Never a DM, a mention elsewhere or a follow, and never before the feature is live.
- **Public posts only**, read by Shipfound. You never open a profile or search for a person.
- **The founder decides what gets built.** Plan the first version, show it, and wait for a yes before writing product code.

## Procedure

1. Call `workspace` with `repo`. If there is no `ideas` tool, say in one line that feature ideas are not open yet, and stop.
2. Call `ideas` (free). It returns `study` (the latest finished one, or null), `running`, `nextFreeAt`, `price`, `results` (the Ideas tab), `lastAttempt` when the last try did not finish, `ideasDone` and `skipped`.
   - `running`: say a study is running and the ideas come in a few minutes, and stop. Never start another.
   - `lastAttempt`: say its note in one line.
   - No key in the input (the founder started this routine on its own, or said `run`): they want a new study. `price` 0 (this week's is free on their plan): call `ideas_run` now, without asking. Otherwise its price and the balance from `workspace`, and that it is charged only when at least 10 posts can be read ("12 credits; you have 40. Run it?"); wait for a yes, then call `ideas_run`. `next` says which applies; follow it, and its wording rules. If it says the site has to be read first, say so and offer the audit routine. It runs a few minutes in the background: say so, and call `ideas` once more only when the founder comes back to it. Never call it again and again to wait. With an older study there, carry on with it below while the new one runs.
3. **The ideas**, most people first, one line each: the problem in their words, how many people and where ("4 people on r/freelance and X"), the feature and its first version, the effort. For an unsaid one, that the product already does it and the site does not say so. At most one quote per idea, word for word as given, with its link. No idea: say what was read (`study.read`) and that nothing two people asked for is a feature for this product yet. That is an answer, not a failure. Then the `results` link.
4. **Ask**, the way "Asking the founder" in SKILL.md says. In a question tool, one question, header "Build which": each idea as an option, its label the feature in a few words, its description the people behind it and the effort, the one you would pick first with "(Recommended)"; then "I won't build one of these" while there is room (four options at most). Without a question tool, the same as one line each, numbered.
   - **Won't build**: ask which, with the ideas as options, and call `ideas_skip` with its key. It is never offered again. Said by mistake: `ideas_skip` with `undo: true`.
5. **An idea picked** (here, or the move grow offered, its key the input): `grow_answer` with `yes` on its key first. Then check the repo before anything else: search the code for what the idea asks for. If the product already does it and the site does not say so, it is unsaid whatever the study said (step 7). If it does it and the site says so plainly, tell the founder, `record_action` it as done (step 8), and stop.
6. **Missing: the first version.**
   - Read the code around it and write the plan in at most six lines: what the first version does (from `first`, cut down further if the code makes it bigger than its effort), the files it touches, what it leaves out for later, and how you will test it. Ask "Build it?" and wait for a yes. A no or a change: change the plan, or stop.
   - Build it on a branch (references/pr-conventions.md), with tests where the repo has them, in the repo's own patterns. Run the repo's checks. Open one PR. Its description says what the feature does for the person using the product, never who asked or where.
   - `record_action` with `module` CONTENT, `kind` PR, `title` the feature, `url` the PR, `liveUrl` the page where it shows (or the product's URL), `meta: { type: "feature", idea: <the key>, problem: <the problem, one line>, people: <the idea's people> }`. Once it is merged, the notes routine offers a post (and an X Article) about it, told from the problem it solves, and the replies to the people who asked. Then step 9.
7. **Unsaid: say it.** Find where a buyer with this problem would look on the site: the home page's list of what it does, the page for that use, the pricing page's plan list. Write it in the founder's words and in the words of the problem (the problem phrased plainly, never a quote), the way references/page-copy.md says. One PR. `record_action` with `module` FIXES, `kind` PR, `url` the PR, `liveUrl` the page, `meta: { type: "feature_copy", idea: <the key>, problem: <the problem, one line>, people: <the idea's people> }`. Once it is merged, grow offers a post about it (the product already did it; now the site says so) and the replies to the people who asked, the same as a built feature. Then step 9: the replies say the product already does it, and how.
8. **Already done** (the founder says they built it, or step 5 found it said): `record_action` it right away with `meta.idea` and the record that fits (the PR or page it lives in), so it is never offered again (SKILL.md, "Done is done"). Never ask about it again.
9. **Once it is live, ask about telling people.** Check the PR (`gh pr view <n> --json state`). Not merged yet: tell the founder that once it is merged, grow offers a post about it and replies to the people who asked, and go to the hand-over. Merged: call `ideas_replies` with the key (free) and ask one question, header "Tell people":
   - "Post and replies (Recommended)": an X post about it, told from the problem it solves, and a reply to each of the N people who asked (N from `targets`).
   - "Only the post": the notes routine with the source `feature:<slug>`.
   - "Only the replies": step 10.
   - "Not now": grow offers it again once.
   With no `targets` (none open, or all drafted), leave the replies out and say why in one line. A post goes through the notes routine (notes.md) with its source; it is written once.
10. **Replies to the people who asked**, from `ideas_replies`:
   - Read each target. Keep only a direct ask ("is there a tool that", "I wish it did", "how do I"); a passing complaint gets no reply. Never more than its five.
   - Write one reply each, to what that person said, in the founder's voice (notes.md, "Voice"): it shipped, what it does for them, how to start. No two alike, never a template, never "I saw you asked". X may carry the live link. Reddit carries one only where the sub's rules allow it; when unsure, none. Someone who said it in a comment gets the reply under their comment (the quote finds it).
   - Show them, then `ideas_replies_save` `{ key, replies: [{ url, text }] }`. X: fill each reply box in the founder's Chrome from its `openUrl`, one at a time; they press Reply. Reddit: they open the thread and paste it; never open Reddit yourself (SKILL.md, "Reddit: you post it").
   - End with "Tell me when you have posted them". Then `reach_mark` each, with the link to their reply. A thread with a draft is never offered again.
11. The hand-over (SKILL.md) once the move is finished.

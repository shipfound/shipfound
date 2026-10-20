# Routine: research

A study of 3 to 5 products a step ahead of the founder that sell to the same buyers, to learn how they grew. The founder names nobody: Shipfound finds them from the AI answers that name them in the founder's place. It reads what each shows in public (the home page and the way to signup, free tools, pricing, launches, listings, their best X posts) and the founder's site the same way, and turns what two or more of them do, that this site does not, into moves. Each move is carried out by the routine that does that kind of work: a free tool by build, the home page by convert, a launch by launch, a post by notes.

It is a study to learn from, and it stands on its own: it never says what another product changed, and it is not run to keep an eye on anyone. Call them "products a step ahead of you", by name.

Input: a move key from grow (`RESEARCH:<kind>:<slug>`), `run` for a new study, or nothing.

## Who pays

- Builder and Growth: one study free each week. Grow starts it by itself on the founder's grow run once the week is up; `research_run` also runs it free when it is due.
- Any other time, or on the Free plan: `research_run`, 8 credits, charged only when 2 or more products could be read. At most one paid study a day. Any study, free or paid, starts the week again.

## Hard lines here

- **Learn, never copy.** A move is the founder's own version of what the products do, in their own words and design. Never another product's words, name, screenshots or layout on the founder's site. Their quotes are evidence for the founder, nothing more.
- **Public pages only.** You never sign up for, email, message or post about a product studied.
- **Never about change.** Never say what a product added, dropped or changed, and never compare one study with the one before.

## Procedure

1. Call `workspace` with `repo`. An app (`product.kind` "app"): say the study reads websites and the app's peers are on the App Store, which it does not read, and stop. If there is no `research` tool, say in one line that studies of products a step ahead are not open yet, and stop.
2. Call `research` (free). It returns `study` (the latest finished one, or null), `running`, `nextFreeAt`, `price`, `results` (the page in the results app), `lastAttempt` when the last try did not finish, `skipped` (products the founder removed) and `patternsDone` (patterns already done, left out).
   - `running`: say a study is running and what it finds comes in a few minutes, and stop. Never start another.
   - `lastAttempt`: say its note in one line.
   - No study, the input is `run`, or the study finished more than 7 days ago: offer a new one. When `nextFreeAt` is now or past: "This week's study is free on your plan." Otherwise its price and the balance from `workspace`, and that it is charged only when at least 2 products can be read ("8 credits; you have 40. Run it?"); wait for a yes. On a yes, call `research_run`. If it says the first AI visibility check comes first, say so and offer the audit routine. It runs a few minutes in the background: say so, and call `research` once more only when the founder comes back to it. Never call it again and again to wait. With an older study there, carry on with it below while the new one runs.
3. **The products**, one line each: the name and domain, and why it counts as a step ahead with the same buyers (`peers[].why`).
4. **The patterns**, the clearest first, one line each: what they do, which of them do it with the page (`evidence[].what` and `url`, a quote only word for word as given), what the founder's site shows (`founder`), and the move with its price. "Acme and Beta each have a free invoice checker with no signup (acme.com/tools/check, beta.io/checker). Your site has none. Move: a free tool on your site, 4 credits." No pattern: name the products and say nothing two of them do is missing from the site. That is an answer, not a failure. Then the `results` link for the full read.
5. **Ask**, the way "Asking the founder" in SKILL.md says. In a question tool, one question, header "Copy which": each pattern as an option, its label the move in a few words, its description the evidence in a few words and the price, the one you would pick first with "(Recommended)"; then "One of these is not like me" while there is room (four options at most). Without a question tool, the same as one line each, numbered.
   - **Not like them** (other buyers, far bigger, not a product at all): ask which, with the products as options, and call `research_skip` with its domain. It is left out of this study's patterns now (a pattern it leaves with one product goes too) and never studied again. Call `research` again and show what is left. Said by mistake: `research_skip` with `undo: true`.
6. **A pattern picked** (here, or the move grow offered, its key the input): `grow_answer` with `yes` on its key first. Then read the routine its move's command names and run it from its first step, with the command's arguments. What the products do is that routine's starting point: the kind of free tool for build, what the first screen and signup do for convert, the board for launch, what the posts are about for notes. Everything else is that routine as usual.
   - **Record it as done.** Every `record_action` that routine makes for this work carries `meta.research` with the move's key, next to the meta the routine already sets. Where the routine records another way (notes, with `reach_mark`), call `record_action` once more with the same module, kind, title and url as that record (a post on X: COMMUNITIES, POST, the post's link) and `meta.research`: the same URL updates it. A pattern recorded this way is never offered again.
   - **A pattern no other routine covers** (its command is this routine with the key): say in one line what doing it takes, from the evidence. A change to the site: one PR (references/pr-conventions.md), `record_action` with `module` FIXES, `kind` PR, `meta.research`. Something the founder does by hand: say exactly what and where, end with "Tell me when it's done", and record it then.
   - **Already done** (the founder says they do it): `record_action` it right away with `meta.research` (SKILL.md, "Done is done"). Never ask about it again.
7. The hand-over (SKILL.md) once the move is finished.

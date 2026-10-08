# Routine: reach

Community replies and one-to-one inbox drafts. The founder posts and sends; Shipfound never does. Partly built; see the note.

Every hard line applies here more than anywhere: never post, never send, no karma farming, no bulk email, Gmail drafts only, at most 20 a day.

**What is not built yet:** thread discovery for Quora and Hacker News. Reddit's and X's are on Assisted posts in the results app: Reddit finds 5 threads a run plus a post where it fits, X finds up to 5 live conversations and writes a reply to each. For Quora and HN, this routine works on threads the founder brings, and on inbox drafts.

**X is replies, never posts.** Never write the founder's own X posts: no progress updates, no "today it wrote 2 pages" status reports, no numbers from Shipfound's own runs or visibility checks. A post like that tells the founder's followers nothing they can use. On X, Shipfound joins conversations that are already happening.

Input: a thread URL, `signups`, or `network`.

## Procedure

1. Call `workspace` and `access`. Read the reddit, x and gmail areas.
2. **Reddit.** If the reddit area is red (no account), do no Reddit drafting. Otherwise send the founder to Assisted posts in the results app (the results link from `workspace`, then Assisted posts): Find Reddit threads there finds questions their buyers asked this month and writes a reply for each, plus a post of their own, for 8 credits a run, and they post each one by hand and mark it posted with the link. Never open or fetch Reddit yourself (SKILL.md, "Reddit: you post it"), and say once why the founder posts it by hand. End with "Tell me when you have posted them" and stop; the next move waits for that (step 7).
3. **X.** If the x area is red (no account signed in), do no X drafting. Otherwise send the founder to Assisted posts in the results app, X section: Find X conversations looks for posts from the last couple of days where their buyers talk about the problem the product solves or ask what to use, and writes one reply for each, for 8 credits a run. Each opens X's reply box with the reply filled in; they post it and mark it posted with the link. Say that in two or three plain lines, end with "Tell me when you have posted them", and stop. Ask about the next move only after they say they are done (step 7).
4. **A thread URL.** Reddit: ask the founder to paste the question and the sub's rules from the thread, draft one reply that answers it, with no link, and give it to them to copy, with the thread link to open and paste it into. X, Quora, Hacker News: open it in the browser, read the thread and the community's rules, draft one reply (Quora and HN carry no link; X may carry one), fill the reply box and stop. Either way the founder edits and posts. When they give you the posted URL, call `record_action` with `module` COMMUNITIES, `kind` POST.
5. **signups**: with a Gmail connector, find new-signup notification emails from the last 7 days, and draft one personal note per signup (from the founder, plain, one question about what they are trying to do). At most 20 drafts today, counting any made earlier today. Call `record_action` with `module` INBOX, `kind` DRAFT for the batch, `url` https://mail.google.com/mail/u/0/#drafts, `meta: { count }`.
6. **network**: propose up to 20 people from the founder's sent mail who would plausibly care, with one line on why each. The founder approves names before any draft exists. Then draft as in step 5.
7. Without a Gmail connector that can create drafts, say so and skip inbox work. Without browser tools, give the founder the draft text to paste. Then the hand-over (SKILL.md), once the founder says they have posted or sent what this routine handed them: offer the next move.

Never draft from an account the founder does not own, never ask anyone to upvote, never write a review or testimonial.

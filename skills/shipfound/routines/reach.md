# Routine: reach

Community replies and one-to-one inbox drafts. The founder posts and sends; Shipfound never does. Partly built; see the note.

Every hard line applies here more than anywhere: never post, never send, no karma farming, no bulk email, Gmail drafts only, at most 20 a day.

**What is not built yet:** the `discover` tool (5 community threads per run, plus a post where it fits, drafted to each platform's rules). Until it ships, this routine works on threads the founder brings and on inbox drafts.

Input: a thread URL, `signups`, or `network`.

## Procedure

1. Call `workspace` and `access`. Read the reddit, x and gmail areas.
2. **Reddit readiness.** If the reddit area is amber or red, print the readiness plan from the audit (2 to 3 weeks of helpful comments the founder writes and posts by hand) and do no Reddit drafting for subs whose minimums the account does not meet.
3. **A thread URL** (Reddit, X, Quora, Hacker News): open it in the browser, read the thread and the community's rules, and draft one reply that answers the question asked. Reddit, Quora and HN drafts carry no link; X drafts may carry one. Fill the reply box and stop. The founder edits and posts. When they give you the posted URL, call `record_action` with `module` COMMUNITIES, `kind` POST.
4. **signups**: with a Gmail connector, find new-signup notification emails from the last 7 days, and draft one personal note per signup (from the founder, plain, one question about what they are trying to do). At most 20 drafts today, counting any made earlier today. Call `record_action` with `module` INBOX, `kind` DRAFT for the batch, `url` https://mail.google.com/mail/u/0/#drafts, `meta: { count }`.
5. **network**: propose up to 20 people from the founder's sent mail who would plausibly care, with one line on why each. The founder approves names before any draft exists. Then draft as in step 4.
6. Without a Gmail connector that can create drafts, say so and skip inbox work. Without browser tools, give the founder the draft text to paste.

Never draft from an account the founder does not own, never ask anyone to upvote, never write a review or testimonial.

# Routine: trumpet (Trumpet™)

Creators the founder's buyers already watch, on YouTube, TikTok, Instagram or X: micro creators found by niche and size on influencers.club, with whether they took brand deals before. One email to each picked creator, from the founder, drafted in their mailbox. How each creator is paid is the founder's pick (a flat fee per video, per view, or a small upfront fee and a bonus by views), guided by the creator's real average views. Each post is read by its own link: visits, signups and revenue against what the founder paid.

Input: nothing (find and write), `write` (the picked creators not written to yet), or `read` (the posts that are up).

## Hard lines here

- The founder sends every email and pays every creator. You draft; they send and pay.
- One email per creator, about one post of theirs you watched. No follow-ups, no attachments, never a DM from here.
- The deal and its numbers are the founder's.
- Every paid post says it is paid: #ad, or the platform's branded content toggle. The email asks for it.
- Micro creators first. Never a flat fee to a big account before a smaller one proved the angle; one post first, and a second only when the first brought signups.
- Before `trumpet_find` and `trumpet_contact`, say the price and wait for a yes.

## Procedure

1. Call `workspace` with `repo`, then `trumpet` (free). Input `write`: step 5. Input `read`: step 7.
2. **Find.** Write the niche from the product's buyers: who the creators are and who watches them ("YouTube creators who teach Claude Code and vibe coding to indie founders"), and the platform where those buyers watch. Say the price (a page of 20) and wait for a yes, then `trumpet_find`. Show the new ones one line each: handle, followers, engagement, and why they fit. Too few: plainer words or another platform, once.
3. **Pick and contact.** The founder picks up to 10. Say the price per email found, then `trumpet_contact` with their keys: the email (never guessed), brand deals, bio and average views.
4. **The price per 1,000 views**, once per product: AskUserQuestion with a few amounts and their own. A micro creator's video often goes for $25 plus bonuses at 10k, 50k and 100k views; the founder's own example is $200 for a video. Then `trumpet` with `cpmUsd`. Each creator now has `options`: a flat fee, per view with its cap, and upfront plus a bonus, priced from their own views.
5. **Write.** For each picked creator with an email, watch or read one recent post of theirs, then ask the founder which way to pay them (AskUserQuestion with the three `options` and "Your own"). Call `mail_setup` and draft ONE short email in the sending address's mailbox: the post of theirs you saw, linked; the product in one line from the buyer's side; the ask (one post in their own style about the problem it solves); the deal at the founder's numbers; that it is marked as paid; their own link (`link`) to use; and "If it is not a fit, just say so." Then `trumpet` with `mark` written, and `record_action` with `module` INBOX, `kind` DRAFT, `title` "Wrote to @<handle>", `url` their post, `meta` `{ type: "trumpet", person: <handle>, email }`. The 20 inbox drafts a day are shared with the other inbox work.
6. **Replies and deals.** When a creator replies, `trumpet` with `mark` replied; once the founder and the creator agree, `mark` deal with its model and numbers. When their post is up, `mark` posted with its link: it is recorded with their campaign, so what it brings is counted.
7. **Read and pay.** `trumpet`: for each posted creator, what their post brought (`brought`: visits, signups, revenue), what the deal says is owed at its views, and the cost per signup. The founder pays as agreed; `mark` paid with what they paid. Book again only the creators whose post brought signups.

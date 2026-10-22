# Routine: outbound

A short personal email to people who said in public, in the last two weeks, that they have the problem the founder's product solves: they described it, asked for a tool like it, or complained about a tool named in its place. They are the warmest strangers there are. The founder sends every email; Shipfound never does.

Every hard line applies here more than anywhere: one to one, Gmail drafts only, at most 20 a day counting every other inbox draft, no follow-ups, never sent by you.

Where they come from: X posts and Hacker News comments. Never Reddit: its users chose to be pseudonymous, so on Reddit the answer is a reply in the thread, through the reach routine.

How they are reached, only the way they chose to publish: the email on their own profile, or a work email found from their name and the site on their profile, only when the verifier says it is valid. Never a guessed address, never a DM, never a list bought or scraped.

Input: optional. `fresh` asks for a new batch even when last week's still has people in it.

## Procedure

1. Call `workspace` with `repo` and `access`. Read the gmail area. Without a Gmail connector that can create drafts, say so, and say the batch can still be read and the notes pasted by hand.
2. Tell the founder in two plain lines what a run does and its price: it finds people who said this fortnight they have the problem the product solves, keeps the ones who could buy, and finds the email they published or a verified work email, for 8 credits, charged only when it finds someone new. Last week's batch comes back free. Wait for a yes before a new batch.
3. Call `outbound_targets` (with `fresh` only when the founder asked for a new batch). Show each person in one line: who (name or handle, and where), what they said (`post.quote`, with `post.url`), `why`, and whether there is an email. Ask which to write to. Anyone the founder will not write to: call `outbound_targets` with `skip` set to their `person`, so they never come back.
4. For each person picked who has an `email`, one at a time:
   - Open their post (`post.url`) and read it whole, so the note answers what they actually said.
   - Draft ONE short Gmail from the founder (the Gmail connector's create draft), in the founder's voice:
     - say plainly where you saw their post, and link it;
     - the one way the product helps with exactly that, from `angle`, in the founder's own words, with nothing it does not do;
     - a link to the site with `?utm_source=outbound&utm_medium=email`, so a signup from it traces back;
     - one closing line: "If this isn't useful, say so and I won't write again."
     No attachments, no images, no follow-up, nothing that reads like a template, under about 120 words.
   - `record_action` with `module` INBOX, `kind` DRAFT, `title` "Wrote to <name or handle>", `url` their post, `meta: { type: "outbound", person: <person>, post: <post.url> }`.
   Stop at 20 inbox drafts today, counting any made earlier today (reach's too).
5. For someone picked with no `email`: offer a reply in their own thread instead. On X, fill the reply box in the founder's Chrome and stop; on Hacker News, give the text to paste. Same rules as the reach routine, never a DM. When the founder posts it, `record_action` with `module` COMMUNITIES, `kind` POST, `url` the reply, `meta: { type: "outbound", person: <person>, post: <post.url> }`, so they are not offered again.
6. Say what is waiting: the number of drafts in Gmail for the founder to read and send, and that each one is theirs to change or delete. Then the hand-over (SKILL.md): offer the next move.

Never write to someone the founder skipped, never twice, and never to an address the tool did not return.

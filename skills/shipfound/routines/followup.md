# Routine: followup

A personal note to each person who signed up and got stuck, from the founder's own address, in their voice, saying what that person did, with the one offer the founder picked. The founder sends every one. One founder wrote to 8 signups offering a 5 to 10 minute onboarding and 5 paid; a mass email to 148 signups got no reply. A note sent when someone is stuck, personal, from the founder, is what converts.

Input: `offer` (change the offer), or nothing. Grow offers it (`INBOX:followup`) when the users report has people who signed up in the last 14 days and stopped before getting going.

## Hard lines here

- One to one. Never a mass email, a BCC, a list, a sequence or a second note to the same person.
- Drafts only: the founder reads and sends each one. Never press Send.
- At most 20 inbox drafts a day, counted with every other inbox draft (`draftsLeftToday`).
- Only the people `followup_targets` returns. It leaves out the founder's own and test accounts, anyone written to before and anyone skipped; never add someone it did not return.
- No tracking link, no UTM, no image, no attachment. A call's booking link is the founder's own and fine.
- Never offer more than the founder set: credits only up to their cap.

## Procedure

1. Call `workspace` with `repo`, and `access`. If the gmail area is red, say Gmail comes first (the audit) and stop.
2. **The offer, once per product.** Call `followup_offer` with no input. When one is kept and the input is not `offer`, say it in one line and go on. Otherwise ask. Claude Code: AskUserQuestion, header "Offer", "What do you offer the people who got stuck?":
   - "A 10-minute call (Recommended)": "You walk them through it. Your booking link goes in the note, if you have one."
   - "I'll set it up for you": "You set it up for them, or do their first result."
   - "One question": "Just ask what they were trying to do."
   - "Credits for feedback": "They get credits for telling you what stopped them. You set the amount and the most people."
   Their own words are the Other answer. Codex: list the five and ask in text.
   Then what the pick needs, in one more question: a call, their booking link (or none); credits, the amount, what it is in ($, credits) and the most people who get it; their own words, the text. Call `followup_offer` with it and say it back in one line; for credits, the most it can cost (the cap times the amount).
3. **The sending address.** Call `mail_setup`, as routines/outbound.md step 2 says. Until it says ready, the drafts wait: mail from a domain without SPF, DKIM and DMARC lands in spam.
4. **Who.** Call `followup_targets`.
   - `needs` is there: the product does not report its users yet. Say in one line that the users routine (routines/users.md) comes first, a few lines in the product's server, free; offer to run it, and stop.
   - Otherwise say its `cost` line when there is one, then show each person in one line: name or email, `did`, and `from`. Ask which to write to. Anyone the founder will not write to: call `followup_targets` with `skip` set to their `person`, so they never come back.
5. **Draft**, one picked person at a time, up to `draftsLeftToday`:
   - Check the sending mailbox never wrote to them: search its Sent mail for `to:<email>` (routines/outbound.md, "Drafting"). Already written to: skip them, with `skip`, and say so.
   - Write ONE short note in the founder's voice: `voice` from `followup_targets` (their own posts, `notes_voice`); none, the Voice section of SKILL.md. It reads like the founder wrote it to this one person:
     - a plain subject, the way a person writes one ("your first invoice", "quick question");
     - their name when there is one;
     - what they did, in plain words, from `did` ("you signed up on Tuesday and sent one invoice"), never an event name;
     - the offer, from `line`, with the booking link for a call;
     - one line saying they can just reply;
     - the founder's first name.
     Under about 90 words, no link to the site, nothing that reads like a template.
   - Make it a draft in the sending address's mailbox (routines/outbound.md, "Drafting").
   - `record_action` with that person's `record`, as it is.
6. Say how many drafts wait in Drafts for the founder to read and send, and that each one is theirs to change or delete. Two weeks on, grow reads whether each person activated or paid. Then the hand-over (SKILL.md): offer the next move.

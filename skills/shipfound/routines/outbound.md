# Routine: outbound

A short personal email to people with a reason to hear from the founder now. The founder sends every email; Shipfound never does. Shipfound picks where to look from who buys the product (its brief), so nobody chooses a source:

- **people with the pain**, for every product: people who said in public, in the last two weeks, that they have the problem the founder's product solves: they described it, asked for a tool like it, or complained about a tool named in its place. They are the warmest strangers there are.
- **teams that just launched**, only when the buyers are makers, founders, startups or software teams: today's Product Hunt launches and the last two weeks of Show HN. A team that just launched needs what comes after a launch.

Everyone found goes on the product's outbound list and stays there until written to, skipped, or two weeks old, so the list does not run dry after one batch. `outbound_targets` hands back up to 10 people with an address from it, the pain posts first, and each person's `found` says how they were found. Reading the list is free. When it is short, a search runs in the background for a few minutes (`searching`) and adds to it.

Every hard line applies here more than anywhere: one to one, drafts only, at most 20 a day counting every other inbox draft (the server counts them: `draftsLeftToday`), no follow-ups, never sent by you.

Where they come from: X posts and Hacker News comments, and for launches Show HN posts and Product Hunt. Never Reddit: its users chose to be pseudonymous, so on Reddit the answer is a reply in the thread, through the reach routine.

How they are reached, only the way they chose to publish: the email on their own profile, a work email found from their name and the site on their profile, or for a launch the address its own domain's mail server accepts, only when verified. Never a guessed address, never a DM, never a list bought or scraped.

Input: optional. `fresh` asks for a new search even when the list still has people on it.

## Procedure

1. Call `workspace` with `repo` and `access`.
2. **The sending address.** Call `mail_setup`. The drafts go from that address, in its own mailbox, which may not be the Gmail the connector reads or the account the founder signs in with (a personal Gmail for GitHub mail, a company address for outreach).
   - No address yet: ask which address outreach should go from, on the product's own domain, and call `mail_setup` with it.
   - Not `ready`: say in one line what is missing (its `next`), and offer to fix it now with [mail setup](../references/mail-setup.md). Outreach waits until `mail_setup` says ready: mail from a domain without SPF, DKIM and DMARC lands in spam.
3. Tell the founder in two plain lines what it does and its price: it hands back up to 10 people with a reason to hear from them (people who said this fortnight they have the problem, and teams who just launched when the product is sold to such teams), the ones who could buy, each with the email they published or a verified one. Free while the list has people; when it is short, a search adds more for $1.49, charged only when it adds someone with an address. Wait for a yes before the first call of a session (it may start a search).
4. Call `outbound_targets` (with `fresh` only when the founder asked for a new search). When `searching` is true and nobody with an email came back, say in one line that a search is running, then call it again in about 3 minutes, without `fresh` (free); never start a second search. Show each person in one line: who (name, handle or product, and where), how they were found (`found`: a post about the problem, or a launch) with `post.quote` and `post.url`, `why`, and whether there is an email. Ask which to write to. Anyone the founder will not write to: call `outbound_targets` with `skip` set to their `person`, so they never come back.
5. For each person picked who has an `email`, one at a time, up to `draftsLeftToday`:
   - Check the sending mailbox has never written to them: search its Sent mail for `to:<email>` (Drafting, below). Already written to: skip them and say so.
   - Open their post or launch (`post.url`) and read it whole, so the note answers what they actually said or made.
   - Write ONE short email from the founder, in the founder's voice:
     - say plainly where you saw them (their post, or their launch today), and link it;
     - the one way the product helps with exactly that, from `angle`, in the founder's own words, with nothing it does not do;
     - a link to the site with `?utm_source=outbound&utm_medium=email`, so a signup from it traces back;
     - one closing line: "If this isn't useful, say so and I won't write again."
     No attachments, no images, no follow-up, nothing that reads like a template, under about 120 words.
   - Make it a draft in the sending address's mailbox (Drafting, below).
   - `record_action` with `module` INBOX, `kind` DRAFT, `title` "Wrote to <name, handle or product>", `url` their post or launch, `meta: { type: "outbound", person: <person>, post: <post.url>, email: <email> }`.
6. For someone picked with no `email`: offer a reply in their own thread instead. On X, fill the reply box in the browser and stop; on Hacker News, give the text to paste; on a Product Hunt launch, give a comment to paste. Same rules as the reach routine: no link, on X no product name either, never a DM. When the founder posts it, `record_action` with `module` COMMUNITIES, `kind` POST, `url` the reply, `meta: { type: "outbound", person: <person>, post: <post.url> }`, so they are not offered again.
7. Say what is waiting: the number of drafts in the sending mailbox's Drafts for the founder to read and send, and that each one is theirs to change or delete. Then the hand-over (SKILL.md): offer the next move.

## Drafting

The draft is made in the sending address's own mailbox, so the founder sends it from the right address. Which way, by `mail_setup`'s `check.provider`:

- **The Gmail connector**, only when the connector's own account is the sending address (its address shows on any message it reads). Create the draft there.
- **Google Workspace in the browser**, otherwise. Open
  `https://mail.google.com/mail/?authuser=<sending address>&view=cm&fs=1&to=<email>&su=<subject>&body=<body>`
  with each value URL-encoded (a new line is `%0A`). Then read the page title: it says "Compose Mail - <account> - ...". It must be the sending address. Gmail opens the first signed-in account when the one asked for is not signed in here; if the title names another account, press the trash icon at the bottom of that compose window to discard it, and ask the founder to add the sending address to this browser ([mail setup](../references/mail-setup.md), section 4). When the title is right, wait until it says "Draft saved", then close that tab. The draft stays in Drafts.
  To check Sent first: open `https://mail.google.com/mail/?authuser=<sending address>#search/in%3Asent+to%3A<email>`, confirm the title names the sending address, and read whether any message is listed.
- **Microsoft 365 in the browser**: `https://outlook.office.com/mail/deeplink/compose?to=<email>&subject=<subject>&body=<body>`. Check the From line shows the sending address, then close the compose window without sending and confirm it is in Drafts.
- **Any other mail host**: open its web mail, start a new message, fill To, Subject and the body, check the From line, and leave it as a draft.

Never press Send. Never write to someone the founder skipped, never twice, and never to an address the tool did not return.

# Routine: bullseye

A Bullseye Test™ checks one bet on exactly the people it is about: "At least X% of Y will Z." Y is people who said in public that they have the problem the product solves, and Z is something they do with skin in the game: sign up, pay, connect the product. The founder sets X before the first message goes out. Shipfound works out how many people must get a message and the lines a result must cross, and every day the founder sends that day's batch of personal messages.

It exists because a small cold test reads nothing: twenty emails cannot say yes or no. Ads cannot reach a hand-picked list either, since X takes emails, phones or device ids, never handles. So every message here is one to one, written from the person's own post, and sent by the founder.

Input: nothing (plan a test, or carry on the running one), `send <id>` (today's batch, grow's daily item), `read <id>`, `extend <id>` or `stop <id>`.

## Hard lines here

- The founder sends every message. Email stays a draft in the sending address's mailbox. An X DM is pasted in their Chrome and stops before send. A Reddit message is a filled link they open and send.
- One message per person, ever. No follow-ups. Each one ends with the line that they can say no and you won't write again.
- At most 20 a channel a day, and email also within the hard line's 20 drafts a day across every mode (`bullseye_batch` counts both).
- Never a guessed address or a catch-all one. An X DM only goes to an open inbox: a closed one is skipped, never "used" through a phone number.
- The bet locks at the first message. Never change X, Y or Z after it: plan a new test instead.

## Plan

1. Call `workspace` with `repo`. With no test running (or the input asks for a new one), ask for the bet in one go (Claude Code: AskUserQuestion; Codex: a short list):
   - **Who** (header "Who"): Y in words, from the brief's buyers and their pain, e.g. "founders who posted in the last 6 months that they are stuck at $0 / 0 users".
   - **Do what** (header "Do what"): Z. Read `goals_list`. Offer the deepest step the product tracks that a person can take within days of a message: a signup goal, a payment goal, or an event the product's server sends for a user (the users routine, e.g. `plugin_connected`). Recommend the one closest to real use.
   - **How many** (header "Bet"): X, the share the founder believes will do it. Offer 2%, 5% and 10%, with the size each needs (from `bullseye_plan`'s sizing: a smaller bet needs more people).
2. `bullseye_plan` with `rate`, `who` and `outcome`. Say the bet in one line, then the size: how many people get a message, the pass line and the fail line. Say that it locks at the first message. Wait for their yes.

## Fill the list

People who said it themselves, newest first. `bullseye_add` keeps each person once across every test, and nobody outbound already wrote to.

- **Email:** `outbound_targets` (its price and rules as in the outbound routine): pain posts with an address. Each one with an email goes in with channel `email`, its post and an opener.
- **Reddit:** threads where someone says the product's problem about their own product (from `reach_drafts` for Reddit, or posts the founder names). The poster goes in with channel `reddit_dm` and their username.
- **X:** a pain post with no address goes in as `x_dm` only after you open their profile in the founder's Chrome, click Message and see a message box. "Has a closed inbox" means skip them. Most inboxes are closed to people who do not follow the founder.
- The opener is one line from their own post, specific and kind ("Saw your post about 15 users in 3 months, you included. Respect for counting yourself honestly."). Never a compliment that could fit anyone.

## Send today's batch (`send`)

1. `bullseye_batch`. It gives today's people per channel, each channel's tagged link, and the drafts left today.
2. One message each, in the founder's voice: the opener, then one line on what the product does for exactly that problem, the channel's link as it is (never add or remove tags), and "If it's not useful, just say so and I won't message again." Then the founder's name for email. Under 90 words.
3. By channel:
   - **Email:** a draft in the sending address's own mailbox (outbound routine, "Drafting"). Check the draft saved before counting it.
   - **X DM:** open their chat from their profile's Message button in the founder's Chrome. Confirm the message box has focus (`document.activeElement` is the chat's textarea). Paste the message from the clipboard. Never type it: a typed newline sends, and typing without focus fires X shortcuts. Stop before send.
   - **Reddit:** a page on the Desktop (`~/Desktop/<product>-bullseye-<n>/reddit-<date>.html`) with one link per person to `https://www.reddit.com/message/compose/?to=<user>&subject=<subject>&message=<text>`, URL-encoded, and their post beside it. The founder opens each and presses Send.
4. Say what is ready where, then "Tell me which ones you sent." Then `bullseye_mark`: `reached` for each sent (or each saved email draft), `skipped` with why for each that could not go (closed inbox, the founder passed, Reddit refused). Only reached people count toward the size.

## Read (`read`)

`bullseye_read`. Say reached against the target, per channel in one line, the visits the links brought, and how many did Z. Then the verdict in its own words:
- **pass:** the bet holds for these people. The move is to reach more like them the same way.
- **fail:** it does not hold. That is the answer the test was for. Ask what to change first (the people, the message, or what you asked them to do), then plan the next test.
- **too close:** offer to grow it by a third (`bullseye_change` extend) on a yes.
- **running:** reached so far and hits so far, in one line.

Close the routine as SKILL.md says, with the messages sent today and the test's reached count on their own line.

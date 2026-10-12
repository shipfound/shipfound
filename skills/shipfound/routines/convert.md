# Routine: convert

Whether a visitor understands the home page, wants the product, and can get from it to signup and then to paying. Two things lose them: what the page says and what it does.

What it says: every line read as someone who has never heard of the product. Can they follow it, does it say what they get, is it filler, would the page lose anything without it, is it as short as it can be. The usual misses hide where a read of the main copy does not look: a caption that repeats what is shown, a plan unit nobody has met, a term the page coined and then has to define, one offering split into two sections, and a product video still telling the story the page told before it was rewritten.

What it does: the usual miss is a button that only scrolls the page it is on: the visitor clicks, the page moves, and nothing tells them what to do next. Others are a broken link, no signup within one click, a signup page with no form, a pricing page with no way to start, a main button below the first screen on a phone, a first screen after signup that does not say what to do, and an upgrade that never reaches the payment page.

At a few hundred visitors an A/B test cannot answer, so the page has to work on the first read. Everything found ships as one pull request, with copy built from the founder's own words.

Follow [../references/page-copy.md](../references/page-copy.md), [../references/pr-conventions.md](../references/pr-conventions.md) and [../references/verification.md](../references/verification.md).

Input: an optional page visitors arrive on (default the home page).

## Procedure

1. Call `workspace` and `access`. Run the framework gate (SKILL.md); stop for unsupported stacks.
2. Call `funnel_check` (free) with the page, if one was named. The server reads the live site itself and follows every button near the top; never describe the buttons from the repo instead. It returns:
   - `funnel`: the last 28 days of visitors, signups and payments, and `focus`, the step most of them stop at. Null when tracking is not live: say the numbers come once it is, and carry on.
   - `findings`: what it saw from outside, each with `evidence` (the button's words and where it goes), a `fix` and an `id`. An "unsure" one means script decides where a button goes: the walk settles it.
   - `read`: the page's words, the founder's list of what the product gets its customers (`outcomes`, null until they give it once) and `measure`, the script that measures the page at phone width.
   - `walk`: the checks only a browser can make, in the order `focus` says.
   Say the numbers and the focus in one line ("Last 28 days: 840 visits, 12 signups, 0 payments. Most stop between signup and paying, so the upgrade path comes first."), then the outside findings, one line each.
3. **Read the page** (references/page-copy.md), first unless `focus` is signup-to-payment, then after the walk. Read every line from the source, measure it in the founder's Chrome with `read.measure.script`, ask for the founder's list if `read.outcomes` is null, and judge every line, card and section, the script's `smallPrint`, `labels` and `quotedTerms` included, and every frame of every video in its `videos`. Call `funnel_check` with `record` (one entry per copy check, failing ones with the page's lines word for word as `quotes`), `measure` (`when: "before"`) and `outcomes` if you asked. A refused quote is not on the live page: quote what a visitor sees there and record again.
4. **Walk it** in the founder's Chrome (the host's browser tools, see "Hosts" in SKILL.md), one `walk` step at a time, in order:
   - Phone width first for `mobile-cta`: resize the window to 390 by 844, take a screenshot of the first screen, tap the main button.
   - `after-signup` and `upgrade-path` need a signed-in account. Use the founder's own session in their Chrome, or a test account on their local preview. **Never create an account, never submit the signup form, never type a password.** If they are not signed in, ask them to sign in, or skip the step and say so.
   - **Stop on the payment page.** Never enter card details, never press pay, subscribe or upgrade.
   - Settle every "unsure" finding from step 2 while you are there.
   Write down what you saw for each step: the button's words, what the screen says, how many clicks it took. Then call `funnel_check` again with `record`: one entry per walk step, `verdict` pass or fail, `evidence` what you saw, and a `fix` for a fail. No browser tools connected: say so, give the steps to connect them, and record nothing (an unwalked step is not a pass, and the page is still read from the source, without the phone numbers).
5. Show every miss still open (`open`), one line each for the buttons and the walk: what stops a visitor, the evidence, the fix. For the copy, a table: each line, its verdict (cut, shorten or rewrite), why, and the new text. Ask which to ship, recommending all of them. Ids the founder declines: call `funnel_check` with `skip` set to those ids (free), so they are never offered again. Lines they keep within a check they accept: record that check again with only the lines that change.
6. Make the changes in the site's own components and routes. Copy as references/page-copy.md says: cut before rewriting, new text from the founder's own words, never an invented fact, a component the page no longer uses deleted, links to a removed section fixed. What each button and walk check usually means in code:
   - cta-goes: the hero's main button links to the signup page (keep a choice the visitor made, like a plan or an integration, as a query parameter the signup page reads), not to an anchor on the same page. An anchor is fine only when the section it scrolls to starts the signup itself.
   - cta-works: fix the link or the page behind it.
   - signup-near: a "Sign up" (or "Start free") button in the header and the hero, both to the same page.
   - signup-form: the form, or the sign in with buttons, on the first screen of the signup page, in the HTML it sends.
   - pricing-next: each plan's button starts it: the free plan to signup, a paid one to signup with the plan picked, or to checkout.
   - mobile-cta: the main button above the first screen at 390 px wide: shorter copy above it, or the button moved up.
   - after-signup: the first screen a new account sees says the one next step, in a sentence and a button.
   - upgrade-path: a visible upgrade link where a signed-in user looks (the header, the settings, the limit they hit), straight to checkout with the plan picked.
7. Build the site, open the preview, and walk the fixed path again at phone and desktop width (screenshots in the browser, if there is one) until every fixed step works. Measure the preview with the same script and call `funnel_check` with `measure` (`when: "after"`).
8. Branch `shipfound/convert`, one PR, the body listing each miss with its evidence and what changed, and the phone numbers before and after (screens, words, sideways overflow). `record_action` with `module` FIXES, `kind` PR, `title` "Home page: <the misses fixed, in a few words>", `url` the PR, `liveUrl` the page visitors arrive on, `meta: { type: "convert", fixIds: [the ids shipped, exactly as funnel_check gave them], screensBefore, screensAfter, wordsBefore, wordsAfter }`. `verify` follows the buttons on the live site again and looks for every line a copy fix changed: a fix that did not ship stays Claimed.
9. Tell the founder how it will be judged: at their traffic, as a before and after on the step `focus` named (visit to signup, or signup to payment), or the home page's engaged rate for a copy change, read with `analytics` once it is live. Not as an A/B test unless the test routine says the traffic can answer one.
10. Summarise: what changed, the PR (claimed, not verified), credits spent (none). Then the hand-over (SKILL.md): offer the next move.

One page per run.

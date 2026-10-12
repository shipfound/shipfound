# Routine: convert

Whether a visitor who wants the product can get from the home page to signup and then to paying. The landing routine reads what the top of the page says; this one follows what it does. The usual miss is a button that only scrolls the page it is on: the visitor clicks, the page moves, and nothing tells them what to do next. Others are a broken link, no signup within one click, a signup page with no form, a pricing page with no way to start, a main button below the first screen on a phone, a first screen after signup that does not say what to do, and an upgrade that never reaches the payment page.

Follow [../references/pr-conventions.md](../references/pr-conventions.md) and [../references/verification.md](../references/verification.md).

Input: an optional page visitors arrive on (default the home page).

## Procedure

1. Call `workspace` and `access`. Run the framework gate (SKILL.md); stop for unsupported stacks.
2. Call `funnel_check` (free) with the page, if one was named. The server reads the live site itself and follows every button near the top; never describe the buttons from the repo instead. It returns:
   - `funnel`: the last 28 days of visitors, signups and payments, and `focus`, the step most of them stop at. Null when tracking is not live: say the numbers come once it is, and carry on.
   - `findings`: what it saw from outside, each with `evidence` (the button's words and where it goes), a `fix` and an `id`. An "unsure" one means script decides where a button goes: the walk settles it.
   - `walk`: the checks only a browser can make, in the order `focus` says.
   Say the numbers and the focus in one line ("Last 28 days: 840 visits, 12 signups, 0 payments. Most stop between signup and paying, so the upgrade path comes first."), then the outside findings, one line each.
3. **Walk it** in the founder's Chrome (the host's browser tools, see "Hosts" in SKILL.md), one `walk` step at a time, in order:
   - Phone width first for `mobile-cta`: resize the window to 390 by 844, take a screenshot of the first screen, tap the main button.
   - `after-signup` and `upgrade-path` need a signed-in account. Use the founder's own session in their Chrome, or a test account on their local preview. **Never create an account, never submit the signup form, never type a password.** If they are not signed in, ask them to sign in, or skip the step and say so.
   - **Stop on the payment page.** Never enter card details, never press pay, subscribe or upgrade.
   - Settle every "unsure" finding from step 2 while you are there.
   Write down what you saw for each step: the button's words, what the screen says, how many clicks it took. Then call `funnel_check` again with `record`: one entry per walk step, `verdict` pass or fail, `evidence` what you saw, and a `fix` for a fail. No browser tools connected: say so, give the steps to connect them, and record nothing (an unwalked step is not a pass).
4. Show every miss still open (`open`, from outside and from the walk), one line each: what stops a visitor, the evidence, the fix. Ask which to ship, recommending all of them. Ids the founder declines: call `funnel_check` with `skip` set to those ids (free), so they are never offered again.
5. Make the changes in the site's own components and routes. What each check usually means in code:
   - cta-goes: the hero's main button links to the signup page (keep a choice the visitor made, like a plan or an integration, as a query parameter the signup page reads), not to an anchor on the same page. An anchor is fine only when the section it scrolls to starts the signup itself.
   - cta-works: fix the link or the page behind it.
   - signup-near: a "Sign up" (or "Start free") button in the header and the hero, both to the same page.
   - signup-form: the form, or the sign in with buttons, on the first screen of the signup page, in the HTML it sends.
   - pricing-next: each plan's button starts it: the free plan to signup, a paid one to signup with the plan picked, or to checkout.
   - mobile-cta: the main button above the first screen at 390 px wide: shorter copy above it, or the button moved up.
   - after-signup: the first screen a new account sees says the one next step, in a sentence and a button.
   - upgrade-path: a visible upgrade link where a signed-in user looks (the header, the settings, the limit they hit), straight to checkout with the plan picked.
   Copy changes follow the landing routine's rule: options built from the founder's own words, they pick or rewrite, never an invented fact.
6. Build the site, open the preview, and walk the fixed path again at phone and desktop width (screenshots in the browser, if there is one) until every fixed step works.
7. Branch `shipfound/convert`, one PR, the body listing each miss with its evidence and what changed. `record_action` with `module` FIXES, `kind` PR, `title` "Signup path: <the misses fixed, in a few words>", `url` the PR, `liveUrl` the page visitors arrive on, `meta: { type: "convert", fixIds: [the ids shipped, exactly as funnel_check gave them] }`. `verify` follows the buttons on the live site again: a fix that did not work stays Claimed.
8. Tell the founder how it will be judged: at their traffic, as a before and after on the step `focus` named (visit to signup, or signup to payment), read with `analytics` once it is live. Not as an A/B test unless the test routine says the traffic can answer one.
9. Summarise: what changed, the PR (claimed, not verified), credits spent (none). Then the hand-over (SKILL.md): offer the next move.

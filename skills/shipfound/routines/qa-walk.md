# Routine: qa-walk (Conversion QA Walk™)

Every step a new customer takes, from the page they land on to the screen after paying, walked in the founder's browser on a desktop width and a phone width: the pages that bring visitors, signup, the email, the first screen, the first result, the way to pay, checkout, after paying, and billing. At each step the copy, the console, the network, the layout, the forms, in-app browsers, speed, and what stops someone from paying. Each issue comes back with the step, the device, what was seen and the fix, blockers first. Free.

Input: nothing (a walk), `fix` (fix what the last walk found), or `disable` (delete the walk's test account). Grow offers a walk every 30 days for a website, the fixes while blockers or majors are open, and the deletion until it is done.

Follow [../references/pr-conventions.md](../references/pr-conventions.md) and [../references/verification.md](../references/verification.md).

## Hard lines here

- The test account is the only account you ever make, and only on the founder's own product, with their yes: their email (a `+qa` version when it already has an account) and a password you set, never theirs. Delete it when the walk is done, and say so.
- Never pay. Checkout in the provider's test mode on a preview, or stop before the card or the billing address on the live site.
- Never submit any other form: contact, newsletter, demo requests, a billing address.
- An issue is something seen, with where: the step, the device, the words quoted, the console line, the status. Never a guess. A number read once is said as read once. A check you could not reach is said as not walked, with why.
- Bugs, errors, layout and forms ship as fix PRs; copy and conversion changes as A/B tests (routines/test.md: one test per page, check the running ones first).

## Procedure

1. Call `workspace` with `repo`, then `qa_walk` (free). It returns the site read from outside (`entry`, `signup`, `pricing`, and `seenFromOutside`: misses the server already sees), the `steps`, the `checks` with how to make each, `measureScript`, `lcpScript`, the `rules`, the `last` walk, and `accountToDisable`. An account to disable: do step 8 first.
2. **Read the code first**, so the walk knows where to look: the signup handler and the sign-in providers, where emails are sent and their templates, the checkout (provider, test mode on a preview), billing, and how an account is deleted. The checks read in the code (`how: "code"`: keyboard, autofill, in-app browsers, currency, after paying) are made here, with the file and line.
3. **The browser.** One new tab. Desktop first: resize the window to 1440 by 900. Then the phone: 390 by 844, and check `innerWidth` with a script. When the window does not change (maximized or in full screen), ask the founder once to take it out of full screen or un-maximize it; if it still does not, the phone width is not walked, with that why. Framing the page in a narrow frame fails on sites that send `X-Frame-Options`.
4. **Signed in already.** Founders are usually signed in to their own product, so its signup page sends you into their app. Ask (AskUserQuestion) to sign them out of the product in this browser for the walk; they sign back in after. A no: the signed-out pages only, and signup onward not walked.
5. **The account.** AskUserQuestion: "Can I sign up on <site> with <email> and a password I set, then delete that account when the walk is done?", with "Yes (Recommended)", their other address, and "No, walk signed-out only". On a yes, make a random password of 16 or more characters that meets the form's rules; never say it in the chat.
6. **Walk each step in order, on each device.** At each one: a screenshot, the console (errors only, after a reload so load errors count), the network (the site's own calls at 400 or above, or over 3 seconds), and the checks `checks` lists for that step. Then:
   - **Entry:** every line read as a first-time visitor (references/page-copy.md), every button followed, `measureScript` and `lcpScript` at phone width.
   - **Signup:** wrong input first (an empty field, a bad email, a short password) and what the form says, then the real signup.
   - **The email:** in the founder's mailbox (the Gmail connector, or their Gmail in the browser): the seconds from submit, inbox, a tab or spam, the sender and subject, the link at phone width. Put the email's words next to the screen that said to open it.
   - **The first screen and the first result:** the time to the first result, against what the page promised.
   - **The way to pay:** the clicks from inside the product, and whether each price matches the pricing page.
   - **Checkout:** read the totals (tax and currency), the fields and anything prefilled, and the terms on the page. Stop before the card or the billing address.
   - **After paying:** walk it in test mode on a preview; otherwise read the webhook and the success page in the code.
   - **Billing:** loads, with cancel or top-up, invoices and a way to delete the account.
7. `qa_walk` with `record`: every step (`walked`, and `why` for a step not walked or walked in part, like the phone width), each issue (`check`, `step`, `device`, `severity` blocker, major or minor, `what` with the words quoted, `fix`, `evidence`), the checks that `passed`, and `account` `{ email }` when you made one.
8. **Delete the test account** with the product's own way: its settings, or its delete-account API with the password from the signed-in session after checking the signed-in email is the test one; else its admin; else give the founder the one step. Then `qa_walk` with `disabled: true`, and tell the founder they can sign back in.
9. **The report**, in the chat: the `line`, then the blockers, majors and minors, each as "step · device: what was seen. Fix: ...". Then the steps not walked or walked in part, with why, and what was clean in one line. Close your tab.
10. **Fix** (input `fix`, or the founder says go): bugs, errors, layout and forms as one PR per theme (routines/fix.md), each `record_action` with `module` FIXES, `meta` `{ type: "qa_walk", issues: [<ids>] }`; copy and conversion as A/B tests (routines/test.md); anything in the payment provider's dashboard filled for the founder to save. An issue they will not fix: `qa_walk` with `skip`.
11. **Re-walk** the fixed steps after the deploy (those steps only), `record` again: `fixedSinceLast` says what closed. Then `verify` each record.

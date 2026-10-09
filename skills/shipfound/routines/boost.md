# Routine: boost

A small paid test of the founder's own X posts. They spend their own money in X Ads Manager; you plan it, fill the form in their browser, and read the result. Shipfound never launches, pays or changes a budget.

Input: one or more post links, `read`, `stop`, or nothing.

## What a boost is

Say this once, in plain words, the first time it comes up: "A boost pays X to show your post to people who do not follow you. The promotion is the test: on a small budget it shows which message makes strangers click. Signups get counted too, but a $50 test brings a handful at most, too few to rank posts on."

- Default: $45 over 3 days, split equally across the posts, each in its own ad group so X cannot hand all the money to one post early.
- **Every boost carries the product video**: its screens recreated in HTML and animated, in their branding, no sound, 30 seconds at most (routines/video.md). A boost shows strangers the product, not only a sentence about it.
- Goal **visits** (default): each post runs as a Promoted-only copy, its text plus the product video as a video website card with its own tagged link. Only the ad audience sees it, never the founder's timeline, and every visit and signup traces back to its post.
- Goal **reach**: the post is boosted as it is, for the founder who wants the post itself seen more, so only a post that already carries the video. Measured by engagements; visits cannot be traced to one post.
- A post with few views is untested, not weak. A small account's post can go unseen just because few people follow it.

## Hard lines here

- Never press Launch, never enter or change payment details, never raise a budget or extend the days without the founder's yes on the new amount. Pausing or stopping is the founder's click too.
- Only the founder's own posts, from their own account. Never boost someone else's post, and never buy followers, likes or views.
- The only posts you fill in for their timeline are the messages for a test (step 4, "Not a post yet"): their landing page's own headline and subhead or the line they named, and one new angle you write from what their site says. They approve or edit every word before it is filled in, and they press Post.
- No boost without the product video. If it cannot be made clean, the boost stops with the reason.
- The money is the founder's, not credits: ask for a yes on the amount every time, even when they picked the boost as today's move.

## Procedure

1. Call `workspace` and `access`. If the x area is red, they need to sign in to x.com in this browser first; stop until they have. If tracking is not verified, say once that visits and signups from the boost cannot be traced yet and X's own numbers still work, then carry on. If the input is `read` or `stop`, go to step 8 or 9.

   **The video.** Look in their repo for `.shipfound/video/out/video-1x1.mp4` under 30 days old. If there is none, say in one line that every boost carries a short video of their product, its screens recreated and animated, and that it is free, then run routines/video.md and come back here. If that routine stops, the boost stops too: say why.
2. **They named a post.** The input is a post link, or they said which one they like. Plan it as it is: no ranking, no numbers, no checks on the post. Go to step 5 with `source` founder. A message they want boosted that is not a post yet (their home page line, a phrase) is posted first: step 4, "Not a post yet".
3. **They asked which to boost.** Call `boost_candidates` (free). From its list keep the posts that are about the problem the product solves and make sense to someone who does not follow them: no inside jokes, no "as I said yesterday", no middle of a thread. Leave out anything X's ad review would reject: politics, health or money claims, before-and-after promises. Read each kept post's `why`; never add a number it does not give.
4. Ask which to boost. Claude Code: AskUserQuestion, multi-select, header "Boost which", the two or three best kept posts as options (the first is your pick, its label ending in "(Recommended)"), each label the post's opening words, each description its `why` in plain words. Codex: list them and ask. If fewer than two fit, offer new messages to test, posted first: an option labelled "Post two new messages, then boost them". Pass each picked post's text along with its link.

   **Not a post yet.** Shipfound plans and scores only existing posts, so a message that is not one is posted first, then boosted like any other. Never offer to boost it as an ad alone: Shipfound could not score it, with no stop rule and no verdict. Offer two messages, so the boost compares them:
   - **Theirs:** their landing page's headline and subhead as they are, or the line they named.
   - **One new angle**, written by you, different enough that the test teaches something: the problem in the buyer's own words, the before and after of one task the product does, or the moment it saves them. Only from what their landing page and product say: no number, customer, result or claim the site does not make, no quote, no hashtags, no emoji. Under 200 characters, the first line able to stand alone.

   Show both, each on its own line, and ask which to post: both (Recommended), only theirs, or only the new one; they can edit either. For each one picked, open https://x.com/compose/post in their browser, fill in the text without a link (the ad's website card carries the tagged link), attach the product video (`out/video-1x1.mp4`) with the browser's file upload, and stop: they press Post. Without a file upload, tell them which file to attach. Then take each post's link (read it from their profile, or ask) and plan them together as named posts, `source` founder. A post made today has no views yet, which is fine: the boost is the test.
5. Call `boost_plan` with the posts, `source`, and `goal` visits unless they asked for the post itself to be seen. Then say, in four short lines: the spend (total, per post, days, daily cap), what to expect (`brief.expect`), the stop rule (`brief.stopRule`), and that they press Launch and can stop it any time. Ask for the money. Claude Code: AskUserQuestion, header "Boost", "Spend $<total> over <days> days (Recommended)", "Change the amount", "Not now". On "Change the amount", ask the number and call `boost_plan` again with it. If the plan says it could not be kept, give them the setup anyway and say the read-out is not available yet.
6. **Fill X Ads Manager** in their browser, from `brief.setup`:
   - Open https://ads.x.com. Without an ads account, X asks for a country and a payment method: they fill those themselves; you never type card details. Then carry on.
   - New campaign named `sf-boost-<id>`. Objective Website traffic for visits; Reach or Engagements for reach. Daily cap and dates from the plan.
   - One ad group per post, named `post <n>`, with that post's budget. Targeting: the countries their buyers are in, plus follower look-alikes of 2 or 3 accounts their buyers follow (ask them, or propose ones from their field and let them choose). Leave the rest broad: narrow targeting costs more per impression.
   - The ad, for visits: a new Promoted-only post with the post's text (drop its own t.co link) and a video website card: the product video (`out/video-1x1.mp4`, uploaded with the browser's file upload), the post's tagged `link` from the plan, the card headline the page's own title. For reach: pick the existing post, only if it carries the video; otherwise run it as visits.
   - Stop before Launch. Tell them exactly which button to press, then: "Tell me when it is launched." Without browser tools, give the URL, the steps above and each tagged link to paste.
7. Once they say it is launched, call `boost_record` with `id` and `status` running. Tell them grow will offer the read when it is due: after a day to apply the stop rule, and when its days are up.
8. **Read** (`read`, or the due move from grow). Open the campaign in ads.x.com in their browser and read each ad group's spend, impressions and link clicks: link clicks, not "clicks", which counts every tap on the post. For reach, read engagements. Call `boost_record` with those numbers per post (`n`), leaving out any you could not read. Then `boost_results`, and report each post's click rate, cost per click, visits and signups, and the verdict in its own words, plus `signupsNote`. Act only on the verdict:
   - `too_early`: say how many impressions each still needs. If it names posts to pause, ask, and they press Pause on those ad groups.
   - `stop`: say it plainly: strangers did not click this message, and that is the answer the test was for. They stop the campaign; then step 9.
   - `winner`: offer two things, the money one first: move what is left of the budget to the winner (a yes on the amount; they change it), and try its opening line as the landing page headline (the test routine, as an A/B test).
   - `no_clear_winner` or `working`: let it finish its budget, then step 9.
   - Never call a winner the verdict does not call.
9. **Stop.** They stop the campaign in Ads Manager. Read the final numbers as in step 8 and call `boost_record` with them and `status` stopped. Its `then` is the next move: the hand-over (SKILL.md) after they confirm it is stopped.

Close the routine as SKILL.md says, with the money spent in dollars on its own line, apart from credits (boosts cost no credits).

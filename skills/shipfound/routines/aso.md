# Routine: aso

The founder's iOS app on the App Store:
- find the App Store searches it can win, country by country, and follow its rank for them week by week;
- open it in another country's language, aimed at what people there search;
- audit the listing and ship the fixes, aimed at those searches;
- turn the reviews into a to-do list;
- write the app's own site on shipfound.site;
- with App Store Connect connected, stage fixes in the next version and set up screenshot A/B tests and custom product pages as drafts;
- with Apple Ads connected, propose changes the founder approves;
- find where people stop between the download and a trial, and ship one change to that step.

Verify every change once it is live.

Follow [../references/aso.md](../references/aso.md) and [../references/pr-conventions.md](../references/pr-conventions.md).

Input, optional:
- An App Store link adds that app.
- A two-letter country code (`de`, `gb`) checks that storefront.
- One word picks the part: `rating`, `purchases`, `featuring`, `keywords`, `ranks`, `countries` (optionally with a country code: `countries br`), `screenshots` (optionally with a locale: `screenshots pt-BR`), `reviews`, `site`, `connect`, `test`, `cpp`, `ads` or `trial`.
- Without a word, run the listing (steps 4 to 9).

## Procedure

1. Call `workspace` with `repo` for the plan and credits.
2. The app. If `workspace` says `product.kind` "app", this product is the app: go on. Otherwise this product is a website, and an app is either part of it or its own product (SKILL.md, "Sites and apps"):
   - Find its App Store link: the founder gave it, or look in the repo (README, the site's footer, `fastlane/metadata`); if there is none, ask the founder for it.
   - The first time, ask once, with choices: "Is <app> the same product as <site>, or its own product?" Same product (the site is the app's home page): call `app_add` with the link. Its own product: the founder adds it in the results app (Add a product, with the App Store link), and the work happens from that product: in the app's repo, `workspace` moves the session to the app once that repo is confirmed for it (SKILL.md, "The repo"); no second sign-in. If this repo is the app's, `repo_confirm` it for the app now (`product`) and carry on there. Otherwise stop here and say so in one line.
3. Go to the part the input names: `rating` step 21, `purchases` step 22, `featuring` step 23, `keywords` step 17, `ranks` step 18, `countries` step 19, `screenshots` step 20, `reviews` step 10, `site` step 11, `connect` step 12, `test` step 13, `cpp` step 14, `ads` step 15, `trial` step 16.

### The listing

4. Read the metadata:
   - If App Store Connect is connected, `app_audit` reads it itself, every locale and the keyword field included; call it without `locales`.
   - Otherwise read the repo's `fastlane/metadata/<locale>/` (`name.txt`, `subtitle.txt`, `keywords.txt`, `promotional_text.txt`, `description.txt`) and the screenshot captions where the repo keeps them, and pass them as `locales`.
   - With neither, say so: the audit checks the public listing only. Offer `connect`.
5. Call `app_audit`. Show the findings, high first, one line each.
6. On Free, stop here. The audit and the review to-do list are free; the fixes are on Builder and Growth. Say so in one line with the results app link from `workspace`, and offer the review to-do list.
7. Aim the fixes at the searches the app can win: the latest `app_keywords` check for this storefront. When there is none from the last 30 days, run step 17 first. Then write the fixes by the rules in the reference: limits first, then the keyword field, the subtitle, the description for AI answers, screenshot captions, and the locales the storefront also indexes. Never put a competitor's name or a trademark in any field. Call `app_audit` again with the new text and fix until no high finding is left.
8. Ship them one of two ways:
   - **App Store Connect connected.** Show the founder every field changed (before, after, characters), then call `app_metadata_stage`. It writes into the version they will submit and never touches what is live. If it answers that no version is open, the founder creates the next version in App Store Connect first.
   - **Through the repo.** Branch `shipfound/aso-<theme>` and open the PR with that table. Call `record_action` with `module` ASO, `kind` PR, `meta: { appStoreId }`.
9. The founder submits the version for review; only they do. When they say Apple has released it:
   - call `record_action` with `module` ASO and `kind` STORE_LISTING;
   - `url` is the App Store link plus `#` and today's date;
   - `meta` holds `appStoreId` and one `expect.<field>.<locale>` per field changed. That is the keyword field and promotional text too when App Store Connect is connected; for the description, its first 300 characters.

   Then `verify` (1 credit), or leave it to the free daily re-check. Two weeks after the release, read the ranks for the searches the change aimed at (step 18) before changing the same words again.

### Reviews

10. Call `app_reviews`. Group the 1 and 2 star reviews into themes, the most costly first (how many, how recent, which version). For each theme, give what to fix in the app, plus one reply to a representative review for the founder to post in App Store Connect. If the app never asks for ratings, offer the rating prompt (step 21).

### The app's own site

11. `app_site` without content shows the draft, if there is one.
    1. Pick the pages: the home page, then one page per search people make. Choose the searches with `keyword_research` (price it first) and from the reviews' own words.
    2. Write each page from the listing, the repo and the reviews (see the reference). Never invent numbers, quotes or features.
    3. Save the whole site with `app_site` and fix every issue it returns.
    4. Tell the founder the draft is ready: they preview it and press Publish on the App Store page of the results app (Builder). Never say it is live before they do.
    5. Once they publish it, it is recorded as shipped work; `verify` checks it is live.
    6. Shipfound tells Google and Bing about the site each time it is published. shipfound.site is Shipfound's domain, so the founder cannot verify it in Search Console or Bing Webmaster Tools: never offer to submit its sitemap or request indexing for its pages.

### Connecting App Store Connect

12. Connecting is the founder's to do, on the App Store page of the results app.
    - Walk them through it: App Store Connect, Users and Access, Integrations, App Store Connect API, Team Keys. Make a key with the App Manager role (Admin also gives downloads by source), download the .p8, and paste it with the issuer id and key id.
    - Never ask for the key in chat.
    - Once connected, `app_metadata` reads everything and `app_downloads` gives downloads by source.
    - For trial and subscription starts, the founder also pastes the account's vendor number on the same page (App Store Connect shows it on Payments and Financial Reports). Then `app_downloads` says how many people started a free trial or a subscription after the download, and how many became paid, whatever the app uses for subscriptions.

### A screenshot A/B test (Growth)

13. Apple tests screenshots, the icon and previews, never text. Every change to the screenshots everyone sees goes through a test first.
    1. Read the current screenshots: open the images `app_add` lists and read their captions. Call `app_downloads` for `productPage` (seen, opened, Get): it says whether the page is where people stop.
    2. Take the raw screens from the repo (simulator captures or the screenshot generator's input), never screenshots that already carry captions.
    3. Write 1 to 3 treatments, each a new set of captions (the reference, "Screenshot captions"):
       - the first three captions each carry one open or gap search from the latest `app_keywords` check for this storefront, as a benefit;
       - `proof: "rating"` on the first one when the rating is strong enough (4.5 stars from 20 ratings; the tool refuses otherwise). Never another proof: no made-up awards, numbers or quotes;
       - one idea per treatment, so the result says something.
    4. Render them with `app_screenshots` and show the founder.
    5. On a yes, call `app_experiment_create`. Most tests send 50% of visitors.
    6. The founder starts it on the App Store page of the results app. Never say it is running before then.
    7. The results. Apple's reports do not split a test's treatments, so read them in App Store Connect (the app, Product Page Optimization) in the founder's Chrome: each treatment's conversion and Apple's confidence. Never call a winner Apple does not.
    8. A winner goes to everyone with `app_screenshots_apply` (`why` test_winner, the test's locale and size, the winning set in order) into the next version. Then `record_action` with `module` ASO, kind STORE_LISTING once released, `meta` `{ appStoreId, step: "screenshots", locale }`.

### A custom product page (Growth)

14. One page per audience or search.
    1. Pick the search, and the words from the app's approved keyword field it should show for.
    2. Write the promotional text and new captioned screenshots for it.
    3. On the founder's yes, call `app_cpp_create`.
    4. The founder submits it for review in App Store Connect.
    5. Then link it: the matching shipfound.site page takes its `ppid` (`app_site`), and so can an Apple Ads ad group.

### Apple Ads (Growth)

15. Connecting is the founder's, on the App Store page of the results app. It is two steps: they paste the public key Shipfound shows into Apple Ads, then type back three ids.
    1. Ask the founder for their target cost per trial (or per subscription, when the app has no trial) if they have one, and pass it as `targetCostPerStart`; a target cost per install goes in `targetCpi`.
    2. Call `ads_review`.
    3. If `afterInstall.hold` is true, say that first: not one trial or subscription started after the installs the ads bought, so no bid goes up and no budget grows, and buying more installs will not fix it. Otherwise give the share of downloads that start one and the estimated cost per start, and say it is an estimate: Apple does not tie a trial to an ad.
    4. Say each new proposal in one line: the change, the numbers behind it, and what it can add to daily spend.
    5. Add your own keyword ideas with `ads_propose`, each with why.
    6. Every change waits for the founder's Approve on the App Store page. Nothing is spent before that, so never say a change is made until they approve it.

### From download to trial

16. Downloads only pay once someone starts a trial or a subscription. This part finds where a new user stops before that, in the app's own code, and ships one change to that step.
    1. Call `app_downloads`. If `trials` is not ready (no vendor number saved), walk the founder through step 12's vendor number and stop. Otherwise say the numbers in one line: first-time downloads and starts over the days both reports cover (`startRateOver`).
    2. This needs the app's code: the repo confirmed for this app (SKILL.md, "The repo"). Without it, say so and stop.
    3. Walk the first session in the code as a new user meets it, from the first launch: onboarding, any sign-in or setup, the first screens, and every place the subscription offer can appear (a paywall, a lock on content, a settings screen). For each, the condition that must be true before it shows. Follow the code; never guess. Write the path as numbered lines, one per screen, each with its file and line. If the app builds and runs in the simulator, check the path there too.
    4. Read `app_reviews` for what people say about their first minutes.
    5. Name where the offer is lost, with file and line: an offer most new users never reach (only after a lock they may never hit, behind a step they skip), a plan shown without its trial, a trial whose length or price is never said, a paywall with no way back to the app, a gate the person who pays never sees. Apple reports no screens, so never put a number on a screen.
    6. Pick one change for this app, by the case: the one that puts the trial in front of the person who decides, sooner or more clearly. Say it in one line with why, and wait for the founder's yes.
       - A Kids category app: the offer is for the parent, behind a parental gate; no purchase screen the child can act on, and no third-party analytics or ads SDK (Apple's Kids rules).
    7. Ship it as a split against today's flow, never as a straight swap:
       - Through the app's subscription service when it runs experiments (RevenueCat Experiments, Superwall, Adapty placements): the new flow is the treatment there.
       - Otherwise, a split the app makes at first launch, kept on the device, with each half reported where starts can be told apart: a subscriber attribute in the subscription service, or a separate introductory offer per half so Apple's report counts them apart.
       - With neither possible, say so: the change goes to everyone and is read before and after.
       Branch `shipfound/aso-trial-<theme>`, open the PR with the walk (step 3), the change and how it is split.
    8. Call `record_action` with `module` ASO, `kind` PR, `url` the PR, and `meta` `{ appStoreId, step: "trial", change, split }`. Grow holds the next change to this step while this one is read.
    9. The founder merges, builds and submits the release; only they do. Once Apple releases it, `app_downloads` reads the starts against the downloads again after two weeks.

### The searches to target

17. Which App Store searches the app can win, in one country: the app's storefront, unless the founder names another.
    1. Pick 5 to 10 searches people would type, in that country's language:
       - what the app does, in plain words ("robot game", "coding for kids"), from the listing and the repo;
       - the reviews' own words (`app_reviews`);
       - with Apple Ads connected, the search terms that brought installs (`ads_review`).
       Never another app's name.
    2. Call `app_keywords` with them. Apple's longer suggestions for each are added, up to 20 in all.
    3. Show a table, open searches first: the search, its verdict, the app's rank, where Apple suggests it, how many of the top 10 name it, and the top apps' ratings.
    4. Say which searches to aim at and where:
       - the main open search in the name or subtitle;
       - its other words, and the next searches, in the keyword field (the reference, "Which searches to target");
       - a search the app already ranks for keeps its words where they are.
    5. Another country is a new check in its own language. Research the searches again there; never translate them.
    6. Unless the founder asked only for the check, go on with the listing (step 7), aimed at these searches.

### Ranks

18. Where the app ranks for the searches its keyword checks track (open, gap, weak, and the ones it holds), per country. Shipfound reads them every Monday from the check onwards.
    1. Call `app_ranks`. Pass `refresh` only when the founder wants today's ranks and the last read is a day old or more.
    2. Show a table per country, best rank first: the search, the rank now, at the first read and the best so far. A rank past the first page (about 11 apps) shows as "not on the first page".
    3. Say what moved and what it means:
       - A search the app came onto the first page for is one to build on: a custom product page for it (step 14), and its words stay where they are.
       - A listing change with two weeks since its release and no move says the next change should aim at other searches (step 17), not repeat the words.
    4. Never put a rank on a search outside the first page, and never call a move caused by one change when several shipped together.

### Another country

19. Open the app in another country's language: a listing there is its own name, subtitle and keyword field, so a new set of searches to rank for.
    1. Call `app_countries`. When App Store Connect is not connected, pass `locales` from the repo's `fastlane/metadata/` folder names. Show the options as a table: country, language, and why (first-time downloads from there without that language, open searches found there, or a large store to check first). With a country code after `countries`, go straight to that country.
    2. The founder picks one or two.
    3. The searches, in that language. Write 5 to 10 searches people there type, in their words; never translate the English ones word for word. Check them with `app_keywords` for that country: Apple's suggestions show what people there actually type, so prefer them.
    4. Write the locale's name, subtitle, keyword field, promotional text and description, aimed at that check's open and gap searches, by the rules in the reference. Keep the brand name as it is.
    5. Show the founder every field with an English translation beside it, and say the agent wrote it. If they do not read the language, a native speaker checks it before it ships. Nothing ships before their yes.
    6. Ship it as in step 8: `app_metadata_stage` with the new locale (App Store Connect connected, Builder), or `fastlane/metadata/<locale>/` in a PR. Call `record_action` with `module` ASO and `meta` `{ appStoreId, step: "country", country, locale }`: kind PR for the PR, or STORE_LISTING with `expect.<field>.<locale>` once Apple has released it. Grow stops offering that country.
    7. The check in sub-step 3 started that country's ranks (step 18). Read them two weeks after the release.
    8. Screenshot captions in that language and the app's own text are separate changes, each offered on its own.

### A language's own screenshots

20. A language opened in step 19 shows the English screenshots until it has its own. This gives it its own, in its words and script.
    1. The locale is the one named, or the first opened language without screenshots of its own.
    2. The captions: the open and gap searches from that country's `app_keywords` check, as benefits in that language. The same raw screens as the main set, unless the app's screens are localized too.
    3. Render them with `app_screenshots`; any script renders (Japanese, Korean, Arabic...). Show the founder every caption with its English translation; a native speaker checks it when they do not read the language.
    4. On their yes, `app_screenshots_apply` with `why` new_language puts them in the next version for that locale (Builder). The language's text must be staged first (step 19).
    5. Once Apple releases it, `record_action` with `module` ASO, kind STORE_LISTING, `meta` `{ appStoreId, step: "screenshots", locale }`.
    6. A later change to these screenshots is tested like any other (step 13).

### Asking for a rating

21. A rating shows beside the app in every search result, and from 4.5 stars and 20 ratings it can go on the screenshots. This adds Apple's rating prompt right after the app's first win, as a PR to the app. It needs the app's repo (SKILL.md, "The repo"); without it, say so and stop.
    1. Read the rating now (`app_add` or `app_audit`) and say it in one line. Under 4 stars, the low reviews come first (step 10): a prompt then asks unhappy people.
    2. Find what the app does today: search the code for `requestReview`, `SKStoreReviewController`, `AppStore.requestReview`, `StoreReview`, `InAppReview`, `in_app_review`. If it already asks, say where and when, and stop unless the moment is wrong (first launch, onboarding, after an error).
    3. Find the first win in the code: the first time the app's core job succeeds for the person (a lesson finished, a task done, a first result shown, a streak kept). Name it with file and line. Never during onboarding, on first launch, right after an error, or on the paywall: Apple rejects prompts in onboarding.
    4. Add the prompt right after that moment, with the stack's own API:
       - SwiftUI: `@Environment(\.requestReview)`, then `requestReview()`.
       - UIKit: `AppStore.requestReview(in: windowScene)` (iOS 16+), else `SKStoreReviewController.requestReview(in:)`.
       - Expo: `expo-store-review` (`StoreReview.isAvailableAsync()`, then `StoreReview.requestReview()`).
       - React Native: `react-native-in-app-review`. Flutter: `in_app_review`. Capacitor: `@capacitor-community/in-app-review`.
       - The same call asks on Google Play when the app ships there too.
       Keep a flag on the device so it asks at most once per app version; Apple shows it at most three times a year anyway.
    5. A Kids category app asks only in the parent area, after the parental gate (after the parent sees the child's progress), never where the child plays.
    6. Never ask only happy users, never offer anything for a rating, never put a custom "rate us" screen before Apple's prompt.
    7. Ratings cannot be told apart by who saw the prompt, so this is read before and after: say so in the PR. Branch `shipfound/aso-rating-prompt`, open the PR with the moment (file and line) and why.
    8. Call `record_action` with `module` ASO, kind PR, `url` the PR, and `meta` `{ appStoreId, step: "rating_prompt", ratingsAt: <rating count now>, moment }`. Grow holds the move while the ratings are read.
    9. The founder merges, builds and submits the release; only they do. Two weeks after Apple releases it, compare the rating count with `ratingsAt`.

### In-app purchase names

22. Each in-app purchase and subscription has a display name per language. It shows on the product page, and ASO tools see App Store search read it. "Premium" or "Pro Yearly" says nothing people search for. Needs App Store Connect connected.
    1. Call `app_purchases`. Show each purchase with its names per language and the findings, plan-word names first.
    2. Write new names: what the purchase gives, in the words people search (the latest `app_keywords` check), then the plan: "Robot Coding Games: Full Year". At most 30 characters, description at most 45. Never another app's name. Keep the price and period clear: a person must still know what they buy.
    3. For a language the listing has and a purchase does not, write its name and description in that language (step 19's rules: written, not translated word for word, shown with an English translation).
    4. Show the founder every name before and after. On their yes, `app_purchases_stage` (Builder).
    5. Apple reviews them with the next version the founder submits. Once released, `record_action` with `module` ASO, kind STORE_LISTING, `meta` `{ appStoreId, step: "purchases" }`.

### Featuring and events (Growth)

23. Two ways to be seen beyond search, both drafted in App Store Connect for the founder to submit. Both need something real and new in the app: read the repo's recent commits and the release being prepared. With nothing new, say so and stop.
    1. **A featuring nomination** asks Apple's editors to consider the app around a date: a launch, an update (APP_ENHANCEMENTS) or new content (NEW_CONTENT).
       - Set the date to the release date, weeks ahead; editors need the notice.
       - Write the description plainly: what is new, for whom, and why it matters to them. No superlatives, no claims about other apps.
       - Add the app's site or a short video as supplemental material when there is one.
       - Show the founder the text. On their yes, `app_nomination_create` drafts it. The founder submits it (App Store Connect, Featuring, Nominations), then `record_action` with `module` ASO, kind STORE_LISTING, `meta` `{ appStoreId, step: "nomination", nominationId }`.
    2. **An in-app event** is a card in search results and on the product page, for at most 31 days, shown from up to 14 days before it starts. It is for something time-bound that people can do in the app: a challenge, a new season, a big update. Never an ad for the app itself.
       - Call `app_events` for what ran before.
       - Pick the badge and purpose that fit (a challenge to bring new people: CHALLENGE, ATTRACT_NEW_USERS).
       - Write the name (30), short description (50) and long description (120) for the primary language, and for each language the listing has, in that language.
       - Give the deep link that opens the event in the app, when the app has one.
       - Show the founder. On their yes, `app_event_create` drafts it. The founder adds the card image (1920x1080) and page image (1080x1920) in App Store Connect and submits it, then `record_action` with `module` ASO, kind STORE_LISTING, `meta` `{ appStoreId, step: "event", eventId }`.
       - A Kids category app's event says nothing that sends the child out of the app or to a purchase.

### Close

24. Summarise:
    - findings fixed and left;
    - the searches aimed at, with their verdicts, and any country opened;
    - what was staged or opened as a PR (claimed);
    - what the founder submits, publishes, starts or approves;
    - the review themes;
    - credits spent.

    Then the hand-over (SKILL.md): offer the next move.

Never write, buy or incentivise reviews. Never reply to reviews, submit to App Review, publish the site, start a test or approve ad spend for the founder. Never call a change done before `verify` says VERIFIED.

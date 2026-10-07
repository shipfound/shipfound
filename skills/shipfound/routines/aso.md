# Routine: aso

The founder's iOS app on the App Store:
- audit the listing and ship the fixes;
- turn the reviews into a to-do list;
- write the app's own site on shipfound.site;
- with App Store Connect connected, stage fixes in the next version and set up screenshot A/B tests and custom product pages as drafts;
- with Apple Ads connected, propose changes the founder approves.

Verify every change once it is live.

Follow [../references/aso.md](../references/aso.md) and [../references/pr-conventions.md](../references/pr-conventions.md).

Input, optional:
- An App Store link adds that app.
- A two-letter country code (`de`, `gb`) checks that storefront.
- One word picks the part: `reviews`, `site`, `connect`, `test`, `cpp` or `ads`.
- Without a word, run the listing (steps 4 to 9).

## Procedure

1. Call `workspace` for the plan and credits.
2. The app: if the founder gave an App Store link, or a tool answers that there is no app yet, call `app_add` with the link. Without a link, look in the repo (README, the site's footer, `fastlane/metadata`); if there is none, ask the founder for it.
3. Go to the part the input names: `reviews` step 10, `site` step 11, `connect` step 12, `test` step 13, `cpp` step 14, `ads` step 15.

### The listing

4. Read the metadata:
   - If App Store Connect is connected, `app_audit` reads it itself, every locale and the keyword field included; call it without `locales`.
   - Otherwise read the repo's `fastlane/metadata/<locale>/` (`name.txt`, `subtitle.txt`, `keywords.txt`, `promotional_text.txt`, `description.txt`) and the screenshot captions where the repo keeps them, and pass them as `locales`.
   - With neither, say so: the audit checks the public listing only. Offer `connect`.
5. Call `app_audit`. Show the findings, high first, one line each.
6. On Free, stop here. The audit and the review to-do list are free; the fixes are on Builder and Growth. Say so in one line with the results app link from `workspace`, and offer the review to-do list.
7. Write the fixes by the rules in the reference: limits first, then the keyword field, the subtitle, the description for AI answers, screenshot captions, and the locales the storefront also indexes. Never put a competitor's name or a trademark in any field. Call `app_audit` again with the new text and fix until no high finding is left.
8. Ship them one of two ways:
   - **App Store Connect connected.** Show the founder every field changed (before, after, characters), then call `app_metadata_stage`. It writes into the version they will submit and never touches what is live. If it answers that no version is open, the founder creates the next version in App Store Connect first.
   - **Through the repo.** Branch `shipfound/aso-<theme>` and open the PR with that table. Call `record_action` with `module` ASO, `kind` PR, `meta: { appStoreId }`.
9. The founder submits the version for review; only they do. When they say Apple has released it:
   - call `record_action` with `module` ASO and `kind` STORE_LISTING;
   - `url` is the App Store link plus `#` and today's date;
   - `meta` holds `appStoreId` and one `expect.<field>.<locale>` per field changed. That is the keyword field and promotional text too when App Store Connect is connected; for the description, its first 300 characters.

   Then `verify` (1 credit), or leave it to the free daily re-check.

### Reviews

10. Call `app_reviews`. Group the 1 and 2 star reviews into themes, the most costly first (how many, how recent, which version). For each theme, give what to fix in the app, plus one reply to a representative review for the founder to post in App Store Connect. If the app never asks for ratings, offer a PR that asks at a good moment (see the reference).

### The app's own site

11. `app_site` without content shows the draft, if there is one.
    1. Pick the pages: the home page, then one page per search people make. Choose the searches with `keyword_research` (price it first) and from the reviews' own words.
    2. Write each page from the listing, the repo and the reviews (see the reference). Never invent numbers, quotes or features.
    3. Save the whole site with `app_site` and fix every issue it returns.
    4. Tell the founder the draft is ready: they preview it and press Publish on the App Store page of the results app (Builder). Never say it is live before they do.
    5. Once they publish it, it is recorded as shipped work; `verify` checks it is live.

### Connecting App Store Connect

12. Connecting is the founder's to do, on the App Store page of the results app.
    - Walk them through it: App Store Connect, Users and Access, Integrations, App Store Connect API, Team Keys. Make a key with the App Manager role (Admin also gives downloads by source), download the .p8, and paste it with the issuer id and key id.
    - Never ask for the key in chat.
    - Once connected, `app_metadata` reads everything and `app_downloads` gives downloads by source.

### A screenshot A/B test (Growth)

13. Apple tests screenshots, the icon and previews, never text.
    1. Read the current screenshots (`app_add` lists them).
    2. Write 1 to 3 treatments, each a new set of captions over the raw screens (see the reference).
    3. Render them with `app_screenshots` and show the founder.
    4. On a yes, call `app_experiment` with `action: create`. Most tests send 50% of visitors.
    5. The founder starts it on the App Store page of the results app. Never say it is running before then.
    6. `app_experiment` `list` shows its state; the results are in App Store Connect.

### A custom product page (Growth)

14. One page per audience or search.
    1. Pick the search, and the words from the app's approved keyword field it should show for.
    2. Write the promotional text and new captioned screenshots for it.
    3. On the founder's yes, call `app_cpp` with `action: create`.
    4. The founder submits it for review in App Store Connect.
    5. Then link it: the matching shipfound.site page takes its `ppid` (`app_site`), and so can an Apple Ads ad group.

### Apple Ads (Growth)

15. Connecting is the founder's, on the App Store page of the results app. It is two steps: they paste the public key Shipfound shows into Apple Ads, then type back three ids.
    1. Ask the founder for their target cost per install if they have one.
    2. Call `ads_review`.
    3. Say what it found and each new proposal in one line: the change, the numbers behind it, and what it can add to daily spend.
    4. Add your own keyword ideas with `ads_propose`, each with why.
    5. Every change waits for the founder's Approve on the App Store page. Nothing is spent before that, so never say a change is made until they approve it.

### Close

16. Summarise:
    - findings fixed and left;
    - what was staged or opened as a PR (claimed);
    - what the founder submits, publishes, starts or approves;
    - the review themes;
    - credits spent.

    Then the hand-over (SKILL.md): offer the next move.

Never write, buy or incentivise reviews. Never reply to reviews, submit to App Review, publish the site, start a test or approve ad spend for the founder. Never call a change done before `verify` says VERIFIED.

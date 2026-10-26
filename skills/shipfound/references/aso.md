# App Store Optimization (ASO)

What the `app_audit` findings mean and how to write the fixes. `app_audit` checks the rules below; this is how to act on them.

## What Apple's search reads

| Field | Limit | Read by App Store search | Notes |
|---|---|---|---|
| Name | 30 | Yes, weighted most | Brand plus the main thing it does: "Habitly: Habit Tracker" |
| Subtitle | 30 | Yes | The line under the name in every search result. Words not already in the name |
| Keyword field | 100 | Yes | Private. Comma-separated single words, no spaces |
| Promotional text | 170 | No | Changes without App Review: the place to test wording |
| Description | 4,000 | No | Read by AI engines on the public page (below) |

## Which searches to target

Apple publishes no search volumes. `app_keywords` reads App Store search in one country as the App Store shows it:
- where the app ranks on the first page;
- whether Apple suggests the search as people type it (a suggested search is one people make; first suggested is the most searched of those);
- how many of the top 10 put the search's words in their name or subtitle;
- how many ratings the top 5 have.

Each search gets a verdict:

| Verdict | Means | What to do |
|---|---|---|
| open | Few of the top 10 name it, and the top apps are small | Aim here first |
| gap | Few name it, but the top apps are big | Next: naming it still beats apps that do not |
| weak | Many name it, but the top apps are small | Worth a place in the keyword field |
| yours | The app is in the top 10 already | Keep its words where they are |
| crowded | Many name it, big apps hold it | Leave it, unless it is the app's whole category |
| thin | Under 5 apps answer it | Few people search it |
| brand | One app's name | Never target it |

- Put the main open search whole in the name or subtitle. Apple weighs those most.
- Spread the next searches' words through the keyword field. Apple combines the words, so `robot` in the subtitle plus `game` in the keyword field matches "robot game".
- The same search is popular in one country and not another. Check each storefront the app sells in on its own.
- Never translate keywords. Research them again in the language people search with: Germans search "Pflanzen bestimmen", not "Pflanzen Identifikator".
- Smaller storefronts often have the same searches with smaller apps on top. Check them when the app speaks that language, or will.

## The keyword field

- Commas only, no spaces: `adhd,planner,routine`. Every space is a wasted character.
- Single words, each once. Apple combines them with each other and with the name and subtitle, so `habit` in the name plus `tracker` in the keywords matches "habit tracker".
- Nothing already in the name or subtitle; no `app`, `free`, `iphone`, `best`.
- Fill all 100 characters.
- Never a competitor's name or another trademark: App Review rejects it, and it is the founder's name on the listing.

## In-app purchase names

Each in-app purchase and subscription has a display name (2 to 30 characters) and a description (up to 45) per language. They show on the product page, and ASO tools see App Store search read the names (Apple has not documented it).

- Name a purchase for what it gives, then the plan: "Robot Coding Games: Full Year", not "Premium Yearly".
- Use the words of a search the app aims at when they fit; never another app's name.
- The person must still know what they buy and for how long.
- Give every language the listing has its own names.

## Featuring and in-app events

- **Nominations:** Apple's editors choose what to feature partly from nominations (App Store Connect, Featuring). Send one weeks before a launch, an update or new content, with the release date. Say what is new and why it matters, plainly.
- **In-app events:** a card in search results and on the product page, for something time-bound in the app. Name 30 characters, short description 50, long description 120. It runs at most 31 days and shows from up to 14 days before. It needs a card image (1920x1080) and a page image (1080x1920). Events can be found in search by their own words, so write the name in the words people search.

## Locales a storefront reads

Each storefront reads keywords from its main locale and some others, and words are not combined across locales. The US store reads English (US) plus Spanish (Mexico), Russian, Chinese (Simplified and Traditional), Arabic, French, Portuguese (Brazil), Vietnamese and Korean. The UK reads English (Australia), Canada reads French (Canada), Germany, France, Mexico and Brazil read English (UK), Japan reads English (US). `app_audit` names the locales for the storefront it checks.

- Add those locales as new `fastlane/metadata/<locale>/` folders with keyword fields of new words, not repeats.
- Put a whole phrase in one locale ("metro bus" needs both words in the same locale).
- Translate the name, subtitle and description properly where the founder wants that language's users; never ship machine translation the founder has not seen.

## The description, for AI answers

App Store search ignores it; ChatGPT, Perplexity and Google's AI read it on the public page, and App Store pages are a large share of what they cite for "best app for X". Write it so an answer can quote it:

- The first sentence names the app, what it does and for whom: "Habitly is a habit tracker for people with ADHD."
- Then the main uses, one per line, in the words people ask with ("works offline", "no account needed", "for shift workers").
- What makes it different, plainly. No superlatives without a fact, no claims about competitors.
- At least 1,000 characters, short paragraphs and lists.

## Screenshot captions

The first three screenshots show in search results. Since mid-2025, ASO tools have seen caption text on screenshots affect App Store search ranking (Apple has not documented it).
- The first three captions each carry one search to win (the open and gap searches from `app_keywords`), as a benefit.
- Each caption says one benefit in the words people search with, in at most 40 characters.
- The first caption matches the subtitle's promise.
- The optional second line adds the proof.

Edit captions where the repo generates screenshots (fastlane frameit `title.strings`, or the generator's config). Otherwise `app_screenshots` renders new ones: each caption over a raw screen, at the size App Store Connect takes (1290 x 2796 for iPhone).
- Use raw screens, not screenshots that already carry captions.
- Use the app's colours.
- Proof: `proof: "rating"` puts the app's own App Store rating under a caption ("★★★★★ 4.8 · 1.2K ratings"), read from the listing. It is refused under 4.5 stars or 20 ratings. Never any other proof on a screenshot: no made-up awards, laurels, user counts or quotes.
- Captions render in any script (Japanese, Korean, Chinese, Arabic, Hebrew, Thai). A language's own set is written in its words, not translated from the English captions.
- Changes to the screenshots everyone sees are tested first (A/B tests, below). A language with no screenshots of its own gets its set directly, with `app_screenshots_apply`.

## Apple's AI tags

Apple generates tags for apps from their metadata and screenshots, people at Apple review them, and the developer chooses which to keep. Make the categories you want obvious: say them in the subtitle, the description's first lines and the captions. Never stuff words to chase a tag.

## The app's own site (shipfound.site)

Most apps have no website, so a search on Google, and an AI answer, has nothing of theirs to find. `app_site` writes the app a small site on `<name>.shipfound.site`. Shipfound renders it from what you write, with the app's icon, rating and screenshots from the listing. Each page carries:
- the App Store button with a campaign token, so App Analytics shows the downloads it brought;
- structured data for the app and the FAQs;
- the sitemap and llms.txt.

Shipfound submits the sitemap to Google and pings Bing (IndexNow) each time the founder publishes. The domain is Shipfound's, so the founder cannot add it to Search Console or Bing Webmaster Tools: never offer that for a shipfound.site address.

**The home page** (`path: ""`): what the app does and for whom in the headline, the intro, then sections on the main uses and an FAQ from what reviewers ask.

**One page per search**:
- The `keyword` is the search, and it goes in the title and headline.
- At least 300 words that answer it: who it is for, how the app does it step by step, and what it does not do.
- A few FAQs.
- Never two pages for the same search, and never a page for a search the app does not answer.
- If there is a custom product page for that search, put its `ppid` on the page: the button then opens that page.

Rules:
- Write from the listing, the repo and the reviews' own words. Never invent numbers, testimonials or awards.
- Name competitors only as plain facts the founder confirms.
- Sections are plain text: blank lines between paragraphs, `- ` for lists.
- Re-save the whole site when anything changes; the founder publishes each version.

## Custom product pages

Up to 70 per app. Each has its own promotional text, screenshots and deep link, and since 2025 its own search keywords: Apple shows it in App Store search for those words once it is approved.
- Only words already in the app's approved keyword field can be assigned. `app_cpp_create` reports the others, and they go into the next version's keyword field first.
- Give each page a distinct set of keywords and screenshots made for that search.
- Link to it from the matching shipfound.site page (`ppid`) and from Apple Ads ad groups.

## A/B tests (product page optimization)

- Apple tests the icon, screenshots and app previews against the current page, never text.
- Up to 3 treatments, up to 90 days, on a share of visitors.
- Test one idea per treatment, for example "the outcome first" against "the feature first", so the result says something.
- Results take weeks at small traffic; Apple shows the confidence in App Store Connect. Never call a winner Apple does not.
- Apple's reports do not split a test's treatments: read the results in App Store Connect, Product Page Optimization, in the founder's Chrome.
- When a treatment wins, `app_screenshots_apply` puts it in the next version, in order; the founder submits it.

## Apple Ads

`ads_review` reads 30 days and proposes:
- exact keywords for search terms that brought installs;
- negatives for terms with 15 or more taps, or spend over 1.5 times the target cost per install, and no installs;
- a pause for keywords that spent twice the target with no installs;
- 15% higher bids where cost per install is under 60% of target;
- 20% lower bids where it is over 1.5 times target;
- 20% more daily budget where a campaign uses 90% or more of its budget at or under target.

The target is the founder's, else the account's average. Every change waits for the founder's Approve in the results app.

Say each proposal in one line with its numbers and what it can add to daily spend. Never add spend the founder has not approved. Never bid on a competitor's brand name unless the founder asks.

## Reviews

- `app_reviews` gives the latest reviews from Apple's public feed. Group the 1 and 2 star ones into themes and rank by how many, how recent and which version.
- Replies: draft one per theme for the founder to post in App Store Connect. Thank, say what changed or when it will, never argue.
- Asking for ratings: a PR that calls the stack's rating prompt (StoreKit `requestReview`, `expo-store-review`, `in_app_review`...) right after the app's first win (a lesson finished, a task done, a streak kept), never in onboarding, on first launch, after an error or on the paywall. Apple shows it at most three times a year and rejects prompts in onboarding. Kids category apps ask only in the parent area, behind the parental gate.
- Never write reviews, offer anything for a review, or ask only happy users to review.

## Verifying

A listing change is Claimed until Apple has released the version and the public App Store shows it. `record_action` kind STORE_LISTING with `meta.appStoreId` and `expect.<field>.<locale>` (name, subtitle, the first 300 characters of the description); `verify` reads the public listing for each locale. Keyword and promotional text changes cannot be seen from outside. With App Store Connect connected, `verify` reads them from the live version; without it they stay Claimed.

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

## The keyword field

- Commas only, no spaces: `adhd,planner,routine`. Every space is a wasted character.
- Single words, each once. Apple combines them with each other and with the name and subtitle, so `habit` in the name plus `tracker` in the keywords matches "habit tracker".
- Nothing already in the name or subtitle; no `app`, `free`, `iphone`, `best`.
- Fill all 100 characters.
- Never a competitor's name or another trademark: App Review rejects it, and it is the founder's name on the listing.

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
- Each caption says one benefit in the words people search with, in at most 40 characters.
- The first caption matches the subtitle's promise.
- The optional second line adds the proof.

Edit captions where the repo generates screenshots (fastlane frameit `title.strings`, or the generator's config). Otherwise `app_screenshots` renders new ones: each caption over a raw screen, at the size App Store Connect takes (1290 x 2796 for iPhone).
- Use raw screens, not screenshots that already carry captions.
- Use the app's colours.

## Apple's AI tags

Apple generates tags for apps from their metadata and screenshots, people at Apple review them, and the developer chooses which to keep. Make the categories you want obvious: say them in the subtitle, the description's first lines and the captions. Never stuff words to chase a tag.

## The app's own site (shipfound.site)

Most apps have no website, so a search on Google, and an AI answer, has nothing of theirs to find. `app_site` writes the app a small site on `<name>.shipfound.site`. Shipfound renders it from what you write, with the app's icon, rating and screenshots from the listing. Each page carries:
- the App Store button with a campaign token, so App Analytics shows the downloads it brought;
- structured data for the app and the FAQs;
- the sitemap and llms.txt.

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
- When a treatment wins, the founder applies it to the default page in App Store Connect.

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
- Asking for ratings: a PR that calls `requestReview` (StoreKit) after a success moment (a streak kept, a task done), never after an error or on first launch. Apple shows it at most three times a year.
- Never write reviews, offer anything for a review, or ask only happy users to review.

## Verifying

A listing change is Claimed until Apple has released the version and the public App Store shows it. `record_action` kind STORE_LISTING with `meta.appStoreId` and `expect.<field>.<locale>` (name, subtitle, the first 300 characters of the description); `verify` reads the public listing for each locale. Keyword and promotional text changes cannot be seen from outside. With App Store Connect connected, `verify` reads them from the live version; without it they stay Claimed.

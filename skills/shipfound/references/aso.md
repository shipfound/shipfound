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

The first three screenshots show in search results. Each caption says one benefit in the words people search with, and the first matches the subtitle's promise. Edit captions where the repo generates screenshots (fastlane frameit `title.strings`, or the generator's config); otherwise give the founder the text.

## Apple's AI tags

Apple generates tags for apps from their metadata and screenshots, people at Apple review them, and the developer chooses which to keep. Make the categories you want obvious: say them in the subtitle, the description's first lines and the captions. Never stuff words to chase a tag.

## Reviews

- `app_reviews` gives the latest reviews from Apple's public feed. Group the 1 and 2 star ones into themes and rank by how many, how recent and which version.
- Replies: draft one per theme for the founder to post in App Store Connect. Thank, say what changed or when it will, never argue.
- Asking for ratings: a PR that calls `requestReview` (StoreKit) after a success moment (a streak kept, a task done), never after an error or on first launch. Apple shows it at most three times a year.
- Never write reviews, offer anything for a review, or ask only happy users to review.

## Verifying

A listing change is Claimed until Apple has released the version and the public App Store shows it. `record_action` kind STORE_LISTING with `meta.appStoreId` and `expect.<field>.<locale>` (name, subtitle, the first 300 characters of the description); `verify` reads the public listing for each locale. Keyword and promotional text changes cannot be seen from outside and stay Claimed until App Store Connect is connected.

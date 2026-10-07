# Routine: aso

The founder's iOS app on the App Store: audit the listing, ship the fixes to its metadata as a pull request, turn the reviews into a to-do list, and verify the changes once Apple has released them.

Follow [../references/aso.md](../references/aso.md) and [../references/pr-conventions.md](../references/pr-conventions.md).

Input: optional. An App Store link adds that app. `reviews` runs only the review to-do list. A two-letter country code (`de`, `gb`) checks that storefront instead of the app's own.

## Procedure

1. Call `workspace` for the plan and credits.
2. The app: if the founder gave an App Store link, or `app_audit` answers that there is no app yet, call `app_add` with the link. Without a link, look for one in the repo (README, the site's footer, `fastlane/metadata`); if there is none, ask the founder for it.
3. If the input was `reviews`, go to step 10.
4. Read the metadata from the repo: `fastlane/metadata/<locale>/` with `name.txt`, `subtitle.txt`, `keywords.txt`, `promotional_text.txt` and `description.txt`, one folder per locale. Read screenshot captions where the repo keeps them (a `title.strings` per locale for fastlane frameit, or the screenshot generator's config). If the repo has no fastlane metadata, say so: the audit can still check the public listing, and the fixes become text the founder pastes into App Store Connect instead of a PR.
5. Call `app_audit` with `{ locales }` from step 4 (and `storefront` if the founder named one). Show the findings, high first, one line each.
6. On Free, stop here: the audit and the review to-do list are free, the fixes are on Builder and Growth. Say so in one line with the results app link from `workspace`, and offer the review to-do list.
7. Write the fixes in the metadata files, by the rules in the reference: limits first, then the keyword field, the subtitle, the description for AI answers, screenshot captions, and the locales the storefront also indexes (new folders with their own keyword fields). Never put a competitor's name or a trademark in any field. Call `app_audit` again with the new metadata and fix until no high finding is left.
8. Branch `shipfound/aso-<theme>`, open the PR with a table of every field changed (before, after, characters), and call `record_action` with `module` ASO, `kind` PR, `meta: { appStoreId }`.
9. Tell the founder what happens next: merge, then submit the version in App Store Connect (or `fastlane deliver`), which only they do; promotional text alone can change without a review. When they say Apple has released it, call `record_action` with `module` ASO, `kind` STORE_LISTING, `url` the app's App Store link plus `#` and today's date, and `meta` with `appStoreId` and one `expect.<field>.<locale>` per public field changed (name, subtitle, the first 300 characters of the description). Then `verify` (1 credit), or leave it to the free daily re-check.
10. Reviews: call `app_reviews`. Group the 1 and 2 star reviews into themes, the most costly first (how many, how recent, which version). For each theme: what to fix in the app, and one reply to a representative review for the founder to post in App Store Connect. If the app never asks for ratings, offer a PR that asks at a good moment (see the reference).
11. Summarise: findings fixed and left, the PR (claimed), what the founder submits, the review themes, and credits spent. Then the hand-over (SKILL.md): offer the next move.

Never write, buy or incentivise reviews, never reply to reviews or submit to App Review for the founder, and never call a listing change done before `verify` says VERIFIED.

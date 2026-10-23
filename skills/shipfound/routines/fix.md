# Routine: fix

Site fixes as themed pull requests. Installs tracking first if it is not live yet.

Read [../references/site-fixes.md](../references/site-fixes.md), [../references/tracking.md](../references/tracking.md) and [../references/pr-conventions.md](../references/pr-conventions.md) before changing anything.

Input: an optional theme or URL, `rankings` (the searches the site almost wins, below), or `errors` (the JavaScript errors visitors hit, below).

## Procedure

1. Call `workspace` with `repo` and `access`. If there is no audit, run the repo and hosting checks from access-audit.md first (local, free).
2. **Framework gate.** Detect the framework (SKILL.md). If it is not Next.js, Astro, Nuxt, SvelteKit, Hugo or plain HTML, say Shipfound does not ship PRs into this stack yet and stop. If `git status` shows uncommitted work, ask before branching.
3. **Tracking first.** If `workspace` shows tracking not installed and the repo has no Shipfound script:
   1. Call `tracking_install` with `{ domain, framework }` (free). Tell the founder to store the secret now and where to set `SHIPFOUND_SITE_KEY` and `SHIPFOUND_SECRET` for their host. Never commit the secret.
   2. On branch `shipfound/tracking`: add the script tag and the crawler beacon for the stack (tracking.md, section 3). Build. Open the PR. Call `record_action` with `module` TRACKING, `kind` PR.
   3. Say: after you set the env vars, merge and deploy, run the grow routine: it picks up the tracking check first.
   If tracking is installed but `workspace` does not show events and crawler hits yet, call `tracking_check` and report what is missing.
   Either way, call `goals_list`. If `signup` is still `EVENT` `signup` with no note, or `payment` is still `CHECKOUT` `*`, or there is no `signin` goal and the site has a login, read the signup, login and checkout code and set them (tracking.md, "Signup and payment, read from the code"). Free, and nothing changes on the site.
   Then, if `goals_list` shows only the install funnel and the site has had visitors, map its real funnels from the code (tracking.md, "Funnels, mapped from the code"): `analytics` `page_flow` for the paths that matter, the code for what each step is, `funnels_save` for each. Free, and nothing changes on the site.
4. **Site fixes.** Say "site_fixes costs 6 credits; you have N. Run it?" and wait for a yes. Then call `site_fixes` once, with `{ url }` if the founder gave a URL, else `{}`.
5. **Training crawlers, when a robots fix carries `choices`.** Ask once, before the ai-crawlers PR, in one question, header "AI training": "Let them in (Recommended)", future AI models can learn what your product does, and AI search reads the site either way; "Keep them out", your pages stay out of model training, and AI search still reads them; "Leave as it is", nothing about them changes. Use the file in `choices` for the answer (`allow`, `block`, `keep`), and record the PR with `meta.training` set to it, so it is never asked again.
6. Group the specs by theme. Show the themes with counts in the order from site-fixes.md, for example "structured-data (3), metadata (7), llms-txt (1)". If the founder named a theme, use it; else take the first one or two.
7. For each chosen theme: reproduce the evidence, apply the fixes in the framework's idiom, build, branch `shipfound/fix-<theme>`, open one PR with the preview link (pr-conventions.md), and call `record_action` with `module` FIXES, `kind` PR, `liveUrl` the main page, `meta.theme` and `meta.fixIds`.
8. Stop after at most 3 PRs in this run. Summarise: PRs opened (all claimed, none verified until merged, deployed and checked), credits spent, the remaining themes, and the next step: review and merge, then the grow routine, which offers to verify them. Then the hand-over (SKILL.md): offer the next move.

## Rankings

Input `rankings`, or a "Lift ..." move from grow: a page that already ranks 4 to 20 on Google for a search, lifted in one PR. Steps 1 and 2 above first; no tracking step.

1. Unless grow named the search, call `search_positions` (2 credits; say so in the same line). Its data is an index of Google refreshed every few weeks: say that once, and never call it twice in a session. If it says the site ranks for nothing yet, say so plainly in one line, and the hand-over.
2. Offer the three best `targets` in one question, one line each: the search, its position, its monthly searches, and its page. Leave out a search the product cannot honestly answer. A grow move already named the search: take that one.
3. Call `keyword_research` with the search as the topic (4 credits; say so in the same line) for what the top results cover that the page does not.
4. Open the page in the repo and lift it, on branch `shipfound/rank-<slug>`, without changing its URL: the search in the title and the H1 when it is missing, a direct answer to it in the first 60 words, a section for what the top results cover and this page does not, and two or three links to it from related pages with the search as the link text. No keyword stuffing, and no claim the product or a source cannot back. Build, open one PR with the preview link (pr-conventions.md).
5. `record_action` with `module` FIXES, `kind` PR, `liveUrl` the page, `meta: { type: "ranking", keyword: <the search>, page: <its path> }`. Say it is claimed, and that its position is read again in about a month. Then the hand-over.

## Errors

Input `errors`, or a "Fix the error ..." move from grow: the JavaScript errors visitors hit on the live site, read from tracking, fixed in one PR. Steps 1 and 2 above first; no tracking step. Free.

1. Call `analytics` with `{ report: "errors", from: <7 days ago> }`. Each row has the scrubbed `message`, the top frames of its `stack`, the `pages` it happened on, the `browsers`, and `funnel` (seen on a signup, login, pricing or checkout page). If it is empty, say no visitor hit an error in the last 7 days, in one line, and the hand-over. A grow move named the error: take that row (its key is the move's key after `ERRORS:`).
2. Pick at most three errors you can find in the code, `funnel` ones first, then most visitors. Leave out, and say why in one line each: a `message` of null (sent before the tracker kept error text), a cross-origin "Script error." (no stack: the script needs `crossorigin` and CORS headers before it can be read), and a stack that is only third-party code (an analytics or chat widget) the repo does not own.
3. For each: find it from the stack's file and function names and the page's route. Minified frames (`chunk-3f2a.js:1:48211`): build locally and read the source map, or search the repo for the message's property or function name. Reproduce it when you can (the page, in the founder's Chrome or a local dev server) before changing anything, and say when you could not. Fix the cause, not the symptom: guard the missing value where it is born, handle the failed request, and never swallow the error with an empty catch.
4. Build, branch `shipfound/fix-errors`, open one PR with the preview link (pr-conventions.md) listing each error, the visitors who hit it, its page, and what caused it.
5. `record_action` with `module` FIXES, `kind` PR, `liveUrl` the page most of them happened on, `meta: { type: "errors", keys: [<each fixed error's key>] }`. Say it is claimed, and that once it is live the errors report shows whether visitors still hit them. Then the hand-over.

Never merge, never push to the default branch, never add a dependency other than `@shipfound/next` without asking.

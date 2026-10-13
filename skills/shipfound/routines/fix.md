# Routine: fix

Site fixes as themed pull requests. Installs tracking first if it is not live yet.

Read [../references/site-fixes.md](../references/site-fixes.md), [../references/tracking.md](../references/tracking.md) and [../references/pr-conventions.md](../references/pr-conventions.md) before changing anything.

Input: an optional theme or URL, or `rankings` (the searches the site almost wins, below).

## Procedure

1. Call `workspace` with `repo` and `access`. If there is no audit, run the repo and hosting checks from access-audit.md first (local, free).
2. **Framework gate.** Detect the framework (SKILL.md). If it is not Next.js, Astro, Nuxt, SvelteKit, Hugo or plain HTML, say Shipfound does not ship PRs into this stack yet and stop. If `git status` shows uncommitted work, ask before branching.
3. **Tracking first.** If `workspace` shows tracking not installed and the repo has no Shipfound script:
   1. Call `tracking_install` with `{ domain, framework }` (free). Tell the founder to store the secret now and where to set `SHIPFOUND_SITE_KEY` and `SHIPFOUND_SECRET` for their host. Never commit the secret.
   2. On branch `shipfound/tracking`: add the script tag and the crawler beacon for the stack (tracking.md, section 3). Build. Open the PR. Call `record_action` with `module` TRACKING, `kind` PR.
   3. Say: after you set the env vars, merge and deploy, run the grow routine: it picks up the tracking check first.
   If tracking is installed but `workspace` does not show events and crawler hits yet, call `tracking_check` and report what is missing.
   Either way, call `goals_list`. If `signup` is still `EVENT` `signup` with no note, or `payment` is still `CHECKOUT` `*`, or there is no `signin` goal and the site has a login, read the signup, login and checkout code and set them (tracking.md, "Signup and payment, read from the code"). Free, and nothing changes on the site.
4. **Site fixes.** Say "site_fixes costs 6 credits; you have N. Run it?" and wait for a yes. Then call `site_fixes` once, with `{ url }` if the founder gave a URL, else `{}`.
5. Group the specs by theme. Show the themes with counts in the order from site-fixes.md, for example "structured-data (3), metadata (7), llms-txt (1)". If the founder named a theme, use it; else take the first one or two.
6. For each chosen theme: reproduce the evidence, apply the fixes in the framework's idiom, build, branch `shipfound/fix-<theme>`, open one PR with the preview link (pr-conventions.md), and call `record_action` with `module` FIXES, `kind` PR, `liveUrl` the main page, `meta.theme` and `meta.fixIds`.
7. Stop after at most 3 PRs in this run. Summarise: PRs opened (all claimed, none verified until merged, deployed and checked), credits spent, the remaining themes, and the next step: review and merge, then the grow routine, which offers to verify them. Then the hand-over (SKILL.md): offer the next move.

## Rankings

Input `rankings`, or a "Lift ..." move from grow: a page that already ranks 4 to 20 on Google for a search, lifted in one PR. Steps 1 and 2 above first; no tracking step.

1. Unless grow named the search, call `search_positions` (2 credits; say so in the same line). Its data is an index of Google refreshed every few weeks: say that once, and never call it twice in a session. If it says the site ranks for nothing yet, say so plainly in one line, and the hand-over.
2. Offer the three best `targets` in one question, one line each: the search, its position, its monthly searches, and its page. Leave out a search the product cannot honestly answer. A grow move already named the search: take that one.
3. Call `keyword_research` with the search as the topic (4 credits; say so in the same line) for what the top results cover that the page does not.
4. Open the page in the repo and lift it, on branch `shipfound/rank-<slug>`, without changing its URL: the search in the title and the H1 when it is missing, a direct answer to it in the first 60 words, a section for what the top results cover and this page does not, and two or three links to it from related pages with the search as the link text. No keyword stuffing, and no claim the product or a source cannot back. Build, open one PR with the preview link (pr-conventions.md).
5. `record_action` with `module` FIXES, `kind` PR, `liveUrl` the page, `meta: { type: "ranking", keyword: <the search>, page: <its path> }`. Say it is claimed, and that its position is read again in about a month. Then the hand-over.

Never merge, never push to the default branch, never add a dependency other than `@shipfound/next` without asking.

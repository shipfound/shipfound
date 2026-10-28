# Routine: seo

SEO and AI search as one set a week. Grow picks it from what Google and Bing already show for the site, a crawl of every page, the AI answers the product loses, and the week's studies (what people ask for, what products a step ahead do); the founder does not choose item by item. Grow offers it first until the week's set ships. You do the set in order, one pull request per theme, and every change is read again at 28 and 56 days against the whole site.

Follow [../references/pr-conventions.md](../references/pr-conventions.md) for branches and PRs, and [../references/content.md](../references/content.md) for any page you write.

Input, optional: `read` (step 2 only), `crawl` (step 3 only), `programmatic` (step 14).

## Procedure

1. Call `workspace` with `repo` for the plan and the site. This needs the site's repo for every change except reading.

### Reading what search shows

2. Read Search Console in the founder's browser, where they are already signed in, once a week: the changes shipped before are read against it at 28 and 56 days. When the last read is under 6 days old, skip to step 3.
   1. Search Console, the site's property, Performance, Search results, last 28 days, Pages.
   2. For each of the top 15 pages by impressions, open it and read its Queries: each search with its clicks, impressions, CTR and position.
   3. Compare with the previous period for each page's clicks.
   4. Call `seo_read` with them as `rows` and `prev`.
   - When the site has no Search Console property, or the founder's Google account has no access to it, say so and carry on with steps 3 and 4: the crawl and the AI answers still make a set.
   - **Bing**: read with the key when Bing is connected. When it is not connected, offer `bing_connect` once (Bing Webmaster Tools, Settings, API access): ChatGPT search reads Bing's results.
3. Call `seo_crawl`. It reads every page in the sitemap, the most shown first.

### This week's set

4. Call `seo_set`. Say the set in a few lines: each action, and why, with its numbers. Then do them in this order. Skip an action only when it cannot be done here (say why); never pick and choose by taste.
5. **Rewrites and lifts** (`rewrites`). For each page, in its source:
   - the title starts with the search, word for word, then what the page gives; 60 characters at most; the brand last, if it fits;
   - the meta description promises the answer in the search's words;
   - the first paragraph answers the search in 60 words or fewer;
   - the H1 says the same thing as the title;
   - never change the URL.
   One PR for all of them, `shipfound/seo-titles-<week>`, with a table: page, search, position, impressions, click rate now, the old title and the new one.
6. **Internal links** (`links`). For each target, add 3 to 5 links from the source pages `seo_set` gives, in a sentence where the anchor (the target's own best search) reads naturally. At most one link to a target per page, never in the navigation or footer. The PR's table, source → anchor → target, is what the founder approves.
7. **Refresh** (`refresh`). For the page that lost clicks, read the searches it ranks for (the Google read), then:
   - update what is out of date (facts, dates, screenshots, prices);
   - answer the searches it lost, in sections of their own;
   - keep the URL and what still works.
8. **New page** (`new_page`). Write it with the write routine (routines/write.md): the search is the keyword, the type is the one the top results are (an answer, a comparison, a glossary term). It gets a page of its own because the page Google shows for it today is about something else.
9. **Site fixes** (`site_fixes`). Fix what the crawl found, in the code: a noindex or canonical that is a mistake, titles (too long, shared, the best search not at the start), missing or doubled H1s, links that lead nowhere. For a thin page: expand it, merge it into the page on the same subject, or noindex it; ask the founder which. For slow pages: the largest image, fonts and scripts on the first screen.
10. **Pages AI answers lean on** (`aeo_pages`).
    - A "what is <product>" page: what it is, for whom, what it does and costs, in plain sentences an assistant can quote.
    - An AI info page for assistants: the same facts, the limits, and an honest comparison. Link it from the footer and from llms.txt.
    - Facts only from the site and the repo; every number linked to where it comes from.
11. **AI answers lost** (`lost_prompts`). By the gap `seo_set` names:
    - decision: a comparison or proof page for that question (routines/write.md, comparison);
    - distribution: the cited lists and directories: `outreach_targets` (routines/reach.md) and `listing_targets` (routines/list.md);
    - evidence: an answer page with the product's own facts for that question;
    - entity: the pages in step 10, and the entity checks in `site_fixes`.
12. **Bing** (`bing`): the same rewrite as step 5, for Bing's search.
13. **From this week's studies** (`study`): at most two, each with its `key`, `command` and `link`.
    - An idea (`IDEA:...`): run the ideas routine with its key (routines/ideas.md, from step 5). A feature people ask for is planned and built only after the founder's yes; one the product already does is said on the site.
    - A pattern from products a step ahead (`RESEARCH:...`): the routine its `command` names, with `meta.research` set to its key on every record (routines/research.md, step 6).
    - Say each in a line with its link, so the founder can read the whole study: "4 people on r/SEO and X ask for this. All the ideas: <link>."
14. **Programmatic pages**, only when the founder has a data set to build pages from:
    1. Call `seo_programmatic_check` with the pattern, the pages and the fields that carry each page's own data.
    2. Ship only when it passes: the first batch, then at most one page a day.
    3. Never a set that only swaps a name: Google's 2026 updates removed sites for that.

### Recording and reading

15. Record every change with `record_action`. Use the action's `record` as `meta`: it holds the page's numbers now and the site's clicks, which the 28- and 56-day reads compare against, and the week (`set`), so grow knows this week's set shipped.
    - `module`: FIXES for site fixes, CONTENT for pages, FIXES for the rest. `kind`: PR.
    - When one PR changes several pages, record one action per page, with `url` the PR's URL plus `#` and the page's path.
16. `seo_set` also returns `reads`: the changes shipped before, read at 28 and 56 days against the whole site. Say them plainly: "up", "down" or "flat" against the site. When several changes shipped on one page in the same 28 days, say none of them alone moved it.
    - A title or snippet change shows on Google, not on the site, so it cannot be split by visitor. It is read before and after against the whole site's change; that is its control.
17. Summarise:
    - what was changed, as PRs (claimed until merged and live);
    - what waits for the founder (a thin page's fate);
    - the reads of earlier changes.

Never buy links, trade links, or write pages that only swap a name. Never call a change done before `verify` says VERIFIED.

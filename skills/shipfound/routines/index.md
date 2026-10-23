# Routine: index

Get pages indexed. Sitemap and IndexNow key file by PR, then sitemap submits and Request indexing in the founder's browser, within quotas. Bing's index feeds ChatGPT search, so Bing matters as much as Google here.

Follow [../references/pr-conventions.md](../references/pr-conventions.md).

Input: optional URLs the founder wants indexed.

## Procedure

1. Call `workspace` with `repo` and `access`. If the product's URL is on shipfound.site (an app's site), stop here: Shipfound submits it to Google and Bing each time it is published, and the founder cannot verify that domain. Say so in one line. Otherwise read the gsc and bing areas. If GSC has no verified property or Bing has no site, give the founder the steps to add and verify it (it needs a DNS record or a file only they can approve) and do the rest for whichever one is ready.
2. **Repo (one PR, theme "index").** Framework gate first (SKILL.md).
   - Sitemap: if none is live, add one in the framework's idiom (site-fixes.md).
   - IndexNow: if no key file is live, generate a key with `openssl rand -hex 16`, add `<key>.txt` containing only the key at the public root (`public/`, `static/` or the web root), and note the key in the PR body (it is public by design).
   - Branch `shipfound/index-sitemap-indexnow`, PR with preview, `record_action` with `module` INDEX, `kind` PR, `meta: { fixIds: ["sitemap:/"] }` when it adds the sitemap.
   - Both already live: no PR, say so in one line.
3. **List the URLs.** The ones the founder gave, else the newest pages from the sitemap and from `shipped` (CONTENT items), leaving out every URL `shipped` (module INDEX) already holds a request for in the last 14 days. Show the list (at most 10) and ask: "Submit the sitemap and request indexing for these N URLs in your Search Console and Bing?" Wait for a yes.
4. **Google Search Console, in the browser.** Sitemaps page: submit `https://<domain>/sitemap.xml` if it is not there. URL Inspection: for each URL, inspect, then press Request indexing. Stop at the first quota message; aim for 10 a day at most.
5. **Bing Webmaster Tools.** Call `bing_submit` once with the URLs and the sitemap's URL (free). It sends them through Bing's API within the site's daily quota and returns the ones past it, for tomorrow. If it says Bing is not connected, do it in the browser: Sitemaps, submit the sitemap if it is not there; URL Submission, submit the same URLs within the quota Bing shows. Then offer once to connect Bing (below).
6. **IndexNow**, only once the key file is live and the founder said yes in step 3: POST the URLs to `https://api.indexnow.org/indexnow` with `{ host, key, keyLocation, urlList }`. One request, not one per URL.
7. **Record.** For each sitemap submit and each URL requested, call `record_action` with `module` INDEX, `kind` INDEX_REQUEST, `url` the page (or sitemap) URL, `meta: { engine: "google" | "bing" | "indexnow", method: "sitemap" | "request-indexing" | "url-submission" | "api" }` (`"api"` for what `bing_submit` sent). A sitemap that was already submitted is recorded too (`method` "sitemap", `meta.already: true`): it is how Shipfound knows the setup is done and stops offering it.
8. Summarise: what was submitted where, how many requests are left in today's quota if shown, and that all of it is claimed until the server confirms the index state. Then the hand-over (SKILL.md): offer the next move.

## Bing, connected

With the founder's Bing Webmaster API key, Shipfound reads which of the site's main pages Bing has (home and the pages Shipfound shipped, ten at most) once a day, and grow names the ones it does not. ChatGPT search reads Bing's index.

- **Connect, once.** Ask the founder to open Bing Webmaster Tools, Settings, API access, make a key and paste it here. Never type it into a page for them, and never copy it out of the page yourself. Call `bing_connect` with it (free): it checks the key with Bing and that the site is verified in that account, and stores it encrypted.
- **Read.** `index_status` (free) reads Bing now and lists the pages it does not have. A page counts as in Bing when Bing crawled it and got a 2xx: Bing's API shows nothing nearer to "indexed".
- **Check.** `verify` on a Bing INDEX_REQUEST (free) is Verified once Bing has the page. A Google request stays Claimed: Search Console does not show its queue.

If browser tools are not connected, print the exact URLs and clicks for the founder to do by hand and record nothing until they confirm it is done.

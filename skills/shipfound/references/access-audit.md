# The access audit

The first command, free, about 3 minutes. You check what the founder actually has, store it with `record_access`, and the server builds the plan only from what is open. A founder with no X account never gets X plays.

Work through the eleven areas in this order (local first, then the browser, then live fetches), and keep each check light: read, do not change anything. The audit never edits files, never opens PRs and never submits anything.

For each area decide:

- **green**: usable now.
- **amber**: usable with a caveat (a verified GSC property with no sitemap, Gmail on @gmail.com).
- **red**: blocked or absent.

Write `detail` as one or two plain sentences of what you saw (max 600 characters), and `fix` as the one action that turns it green (max 300 characters, empty when green). Put numbers and flags in `facts` (strings, numbers, booleans, null, or arrays of strings).

If you could not check an area (no browser tools, the founder skipped a sign-in), mark it amber, say "Not checked: <reason>" in `detail`, and make the fix the step that lets you check it. For the three browser areas (gsc, bing, x) without browser tools, the reason is "your browser is not connected" and the fix is connecting it (SKILL.md, "Hosts", the Browser row).

## 1. Repo (`repo`)

Local reads only.

- **Framework**: see "detect the framework" in SKILL.md. Read `package.json`, look for `next.config.*`, `astro.config.*`, `nuxt.config.*`, `svelte.config.*`, `hugo.toml` / `config.toml` with `layouts/`, or bare `.html`.
- **Content location**: where posts or docs live: `content/`, `src/content/`, `app/blog/`, `src/pages/blog/`, `posts/`, MDX folders. Record the path as `contentDir`.
- **Sitemap**: `public/sitemap.xml`, `app/sitemap.ts`, `@astrojs/sitemap`, `@nuxtjs/sitemap`, `next-sitemap`, Hugo's built-in. Confirm live: `curl -s -o /dev/null -w "%{http_code}" https://<domain>/sitemap.xml`.
- **Robots**: `public/robots.txt`, `app/robots.ts`, `static/robots.txt`. Live: `curl -s https://<domain>/robots.txt`. Note any `Disallow` for GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot.
- **Structured data**: `grep -rl "application/ld+json"` in the source, and on the live home page.
- **llms.txt**: `public/llms.txt` or live `https://<domain>/llms.txt`.
- **Write access**: `gh repo view --json viewerPermission,defaultBranchRef` (ADMIN, MAINTAIN or WRITE means you can push a branch).
- **Branch protection**: `gh api repos/{owner}/{repo}/branches/{default}/protection` (404 means none; 403 means you cannot tell).
- **Other analytics** (also used by Tracking): grep for `googletagmanager`, `gtag(`, `plausible`, `posthog`, `umami`, `fathom`, `@vercel/analytics`.

Status: green when the framework is supported and you can push a branch. Amber when supported but you cannot push, or there is no git remote. Red when the stack is unsupported.

Fill the top-level `repo` object too:

```json
{ "framework": "nextjs", "contentDir": "content/blog", "hasSitemap": true, "hasRobots": true, "hasStructuredData": false, "hasLlmsTxt": false, "canPush": true, "branchProtected": true, "otherAnalytics": ["ga4"] }
```

`framework` is one of: nextjs, astro, nuxt, sveltekit, hugo, html, remix, gatsby, webflow, framer, wordpress, other.

## 2. Hosting (`hosting`)

- Files: `vercel.json`, `.vercel/project.json`, `netlify.toml`, `railway.json`, `railway.toml`, `wrangler.toml`, a `Dockerfile` with a deploy workflow.
- Preview deploys: `gh api "repos/{owner}/{repo}/deployments?per_page=10" --jq '.[].environment'` and look for `Preview`; or read the last merged PR's comments (`gh pr view <n> --comments`) for a Vercel or Netlify preview link.

Green: previews appear on PRs. Amber: a host is configured but no preview seen. Red: no host found. Facts: `{ host: "vercel", previews: true }`.

## 3. Google Search Console (`gsc`)

In the browser, open https://search.google.com/search-console. Read only.

- Is there a property for the domain (Domain property or the https URL prefix), and is it verified?
- Sitemaps page: submitted, and the last read status.
- Pages report: the count of not-indexed pages and the top two reasons.

Green: verified, sitemap read with Success. Amber: verified, no sitemap or errors. Red: no property. Facts: `{ verified: true, sitemapSubmitted: false, notIndexed: 14 }`.

## 4. Bing Webmaster Tools (`bing`)

In the browser, open https://www.bing.com/webmasters. Read only.

- Site added and verified, sitemap submitted.
- IndexNow: look for a key file in the repo (a 32-character hex `.txt` at the public root whose content is its own name) and confirm it is live.

Green: verified, sitemap and IndexNow key live. Amber: verified, one missing. Red: site not added. Bing's index feeds ChatGPT search, so say so when it is red.

## 5. Gmail (`gmail`)

Only if a Gmail connector is connected (SKILL.md, "Hosts"). Find the founder's sending address (for example from one recent sent message). Read nothing else.

Green: connected on a custom domain. Amber: connected on @gmail.com (many directories reject it). Red: not connected; the fix is "Connect Gmail: a Gmail connector in Claude, or a Gmail plugin in Codex".

## 6. Reddit (`reddit`)

One question to the founder, nothing else. Do not open Reddit, do not fetch it and do not ask for a username: Claude cannot open Reddit, in the browser or by fetch.

Ask: "Do you have a Reddit account you would post from? Yes or no." Then say in one line why it is a question and not a check: Shipfound writes the Reddit posts and replies, and the founder posts them by hand (SKILL.md, "Reddit: you post it").

Green: yes. Red: no; the fix is "Make a Reddit account if your buyers are there. Nothing else in the plan needs one." Facts: `{ hasAccount: true }`.

Never upvote, comment or post during the audit.

## 7. X (`x`)

In the browser, open https://x.com/home. If logged in, read the profile: joined date, followers, date of the last post.

Green: logged in, account older than 30 days, posted in the last 30 days. Amber: new or quiet. Red: not logged in or no account. Facts: `{ accountAgeDays, followers, daysSinceLastPost }`.

## 8. GitHub (`github`)

- `gh auth status`.
- Relevant awesome lists: `gh search repos "awesome <category>" --sort stars --limit 10`. For the top 3, check whether the product is already listed: `gh api repos/{owner}/{repo}/readme --jq .content | base64 -d | grep -i <domain>`.

Green: authed and at least one relevant list where the product is not yet listed. Amber: authed, no fitting list. Red: `gh` missing or not authed. Facts: `{ authed: true, lists: ["owner/awesome-x"] }`.

## 9. Tracking (`tracking`)

- Repo: `t.shipfound.co/t.js`, `data-site="sf_`, `@shipfound/next`, `/t/crawler`, `x-shipfound-secret`.
- Live: `curl -s https://<domain>/ | grep -o 'data-site="sf_[^"]*"'`.
- If `workspace` shows a site, call `tracking_check` (free) for events and crawler hits seen.
- Other analytics found under Repo.

Green: script live, crawler beacon installed, and `tracking_check` has seen a real event, a crawler hit and a goal. Amber: partly installed. Red: nothing installed; the fix is "Run the Shipfound fix; tracking is the first PR". Facts: `{ script: false, beacon: false, otherAnalytics: ["ga4"] }`.

## 10. Product assets (`assets`)

Check the repo and the live site for: a logo (SVG or 512 px PNG), at least 2 screenshots, a description of 160 characters or fewer (the home page meta description is a start), a pricing page (`/pricing` returns 200), an OG image (`og:image` present and returns 200), and a privacy page (`/privacy` returns 200).

Green: all six. Amber: three to five. Red: fewer than three. Facts: `{ logo: true, screenshots: 0, description160: true, pricing: true, ogImage: false, privacy: true }`.

## 11. Marketplace fit (`marketplace`)

Repo scan for: a public API (`openapi.*`, documented `/api/` routes), an MCP server (`@modelcontextprotocol/sdk` or an `/mcp` route), integrations (Slack, Zapier or HubSpot app manifests), a Chrome extension (`manifest.json` with `manifest_version`), a VS Code extension (`engines.vscode` in a package.json).

Green: at least one fits; list which. Amber: none fit; the fix is "Nothing to do unless you ship an API, an MCP server or an extension", and the plan will skip marketplaces. Facts: `{ fits: ["mcp", "chrome"] }`.

## Calling record_access

One call with all eleven areas you checked:

```json
{
  "areas": [
    { "id": "repo", "status": "green", "detail": "Next.js 15 app router. Posts in content/blog. Sitemap and robots live; no structured data, no llms.txt. You can push; main is protected.", "fix": "", "facts": { "framework": "nextjs" } },
    { "id": "gsc", "status": "amber", "detail": "Domain property verified. No sitemap submitted; 14 pages not indexed, mostly 'Discovered, currently not indexed'.", "fix": "Submit https://example.com/sitemap.xml in Search Console (the Shipfound index routine does it).", "facts": { "verified": true, "sitemapSubmitted": false, "notIndexed": 14 } }
  ],
  "repo": { "framework": "nextjs", "contentDir": "content/blog", "hasSitemap": true, "hasRobots": true, "hasStructuredData": false, "hasLlmsTxt": false, "canPush": true, "branchProtected": true, "otherAnalytics": [] },
  "client": "claude-code"
}
```

Area ids: repo, hosting, gsc, bing, gmail, reddit, x, github, tracking, assets, marketplace. Use `"client": "codex"` when running in Codex.

## The Access Card in the terminal

After `record_access`, print a short card: the headline ("7 of 11 open, 3 amber, 2 red"), one line per area as `[green] Repo: Next.js, can push`, and under each amber or red line its fix. Then the results app link.

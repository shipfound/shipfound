# Site fixes

`site_fixes` (6 credits, so state the price and wait for a yes) runs the AEO audit plus a DataForSEO on-page audit and returns fix specs:

```json
[{ "id": "fx_12", "theme": "structured-data", "page": "https://example.com/", "issue": "No Organization or SoftwareApplication markup", "evidence": "No application/ld+json on the page", "fix": "Add Organization and SoftwareApplication JSON-LD with name, url, logo, offers" }]
```

Fixes already shipped are left out by the server, so never re-apply one from an older run. Input is `{ url? }`: omit it for the whole site, pass one URL to audit a single page. Call it once per command, not once per page.

## Order

1. Tracking, if not installed (see [tracking.md](tracking.md)). It is the first PR so the baseline of crawler hits and AI visits is on record before anything else ships.
2. Crawlability: robots rules for AI crawlers, sitemap, canonicals.
3. Metadata: titles and meta descriptions.
4. Structured data: Organization, SoftwareApplication, FAQ, Article.
5. llms.txt.
6. Internal links.
7. OG images.
8. Core Web Vitals quick wins.
9. Pricing and FAQ blocks that answer engines can quote.

## One PR per theme

Group the specs by `theme`. One branch and one PR per theme, never one giant PR and never one PR per page. Keep each PR under about 15 files; split a theme into "part 1" and "part 2" if it is larger. Ship one or two themes per `/shipfound:fix` run and stop to report; the founder reviews before you go on. Branch names and PR bodies: [pr-conventions.md](pr-conventions.md).

Before you open a PR:

- Reproduce the evidence (read the page source or fetch the live URL). If you cannot reproduce it, skip that spec and say so.
- Apply the smallest change that fixes it, in the framework's own idiom.
- Do not add dependencies without asking the founder. If a fix needs one (a sitemap plugin), say which and why, and wait.
- Run the project's build (`npm run build`, `pnpm build`, `hugo`) and its lint or typecheck if there is one. A PR that does not build is not opened.

## Per framework

### Next.js

- Metadata: `export const metadata` or `generateMetadata` in the route's `page.tsx` / `layout.tsx` (app router); `next/head` (pages router). Set `alternates.canonical`.
- Sitemap: `app/sitemap.ts` returning `MetadataRoute.Sitemap`; pages router: a static `public/sitemap.xml` or the existing `next-sitemap` config.
- Robots: `app/robots.ts` or `public/robots.txt`.
- Structured data: a `<script type="application/ld+json">` with `dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}` in the page or layout.
- llms.txt: `public/llms.txt`.
- OG images: `opengraph-image.tsx` (app router) or a static image plus `openGraph.images`.

### Astro

- Metadata: the shared layout's `<head>`, fed by props from each page.
- Sitemap: `@astrojs/sitemap` (a dependency: ask first) or a static `public/sitemap.xml`.
- Robots and llms.txt: `public/robots.txt`, `public/llms.txt`.
- Structured data: `<script type="application/ld+json" set:html={JSON.stringify(data)} />`.

### Nuxt

- Metadata: `useSeoMeta` / `useHead` in the page, or `app.head` in `nuxt.config`.
- Sitemap and robots: the existing `@nuxtjs/sitemap` / `@nuxtjs/robots` modules if present, else `public/robots.txt` and a server route for the sitemap.
- Structured data: `useHead({ script: [{ type: "application/ld+json", innerHTML: JSON.stringify(data) }] })`.
- llms.txt: `public/llms.txt`.

### SvelteKit

- Metadata: `<svelte:head>` in the page or `+layout.svelte`.
- Sitemap: `src/routes/sitemap.xml/+server.ts` returning XML.
- Robots and llms.txt: `static/robots.txt`, `static/llms.txt`.
- Structured data: `{@html '<script type="application/ld+json">' + JSON.stringify(data) + '</script>'}` inside `<svelte:head>`.

### Hugo

- Metadata: the head partial (`layouts/partials/head.html` or the theme's, copied into `layouts/` to override, never edited inside `themes/`).
- Sitemap: built in; check `sitemap` settings in the config.
- Robots: `enableRobotsTXT = true` plus `layouts/robots.txt`.
- Structured data: a `layouts/partials/schema.html` partial included from the head.
- llms.txt: `static/llms.txt`.

### Plain HTML

- Edit each page's `<head>`. If there are more than 10 pages with a shared header pattern, say so and propose a small build step only if the founder wants one.
- `sitemap.xml`, `robots.txt` and `llms.txt` at the web root.

## Content rules for fixes

- **Robots and AI crawlers**: allow the search and user-fetch crawlers that decide whether the product gets cited (OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, Googlebot, Bingbot). Training crawlers (GPTBot, ClaudeBot, CCBot, Bytespider, Meta-ExternalAgent) are the founder's call: state the trade-off in one line and ask.
- **Structured data**: only facts that are true and on the page. Never add `AggregateRating`, `Review` or review counts unless the founder has real ones on the page. Prices must match the pricing page.
- **Titles and descriptions**: titles under 60 characters, descriptions under 160, written from what the page says. No keyword stuffing.
- **llms.txt**: a short Markdown file: product name, one-line description, then links to the key pages (docs, pricing, comparisons) with one line each. Only real URLs.
- **FAQ blocks**: only questions the product's own docs, support or pricing pages answer. Never invent answers.
- **Core Web Vitals**: quick wins only (image sizes and `loading`, font `display: swap`, removing an unused script). No refactors.

## Preview links

After pushing, find the preview: `gh pr checks <n>` or `gh pr view <n> --comments` (Vercel and Netlify bots comment with the URL). Put it in the PR body and in the terminal summary. If the hosting area is not green, say there is no preview and give the local command to check the change (`npm run dev`, then the path).

## After each PR

`record_action` with `module` FIXES, `kind` PR, the PR URL as `url`, the main changed page as `liveUrl`, and `meta: { theme, fixIds: [...], files: [...] }`. The state is CLAIMED. Then see [verification.md](verification.md).

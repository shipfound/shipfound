# Shipfound

Your coding agent ships features. Shipfound makes it ship customers.

Shipfound turns Claude Code (or Codex) into your growth engineer. It checks what you have access to, fixes your site for Google and AI search, ships blog, glossary and comparison pages as pull requests, gets your pages indexed on Google and Bing, and installs tracking that shows when GPTBot, PerplexityBot and ClaudeBot read your pages and when ChatGPT sends you a visitor. The Shipfound server checks every result itself, and labels each one Verified or Claimed.

This repo is the plugin: one skill, the `/shipfound:*` commands, the MCP server config, Codex guidance, and crawler beacon snippets. The data, verification and results app live at https://shipfound.co.

## Install in Claude Code

```
/plugin marketplace add shipfound/shipfound
/plugin install shipfound@shipfound
/shipfound:audit
```

The first Shipfound tool call opens your browser to sign in (OAuth). If it does not, run `/mcp`, pick the Shipfound server and choose Authenticate.

### Sign in with an API key instead

For CI or a machine without a browser: make a key in the Shipfound app (Settings, MCP server; it starts with `wl_`) and export it before starting Claude Code:

```bash
export SHIPFOUND_API_KEY=wl_...
```

The plugin's header helper (`scripts/mcp-headers.sh`) sends it as `Authorization: Bearer wl_...`. With the variable unset it sends nothing and OAuth is used. Each key carries a daily credit cap.

### Point at another server

The MCP server defaults to `https://api.shipfound.co/mcp`. Set `SHIPFOUND_API_URL` to use another API origin (staging, or `http://localhost:4000` when developing Shipfound itself); the plugin appends `/mcp`.

## Install in Codex

```bash
codex mcp add shipfound --url https://api.shipfound.co/mcp
codex mcp login shipfound
```

Then copy [AGENTS.md](AGENTS.md) into your repo. Full steps, including the API key option: [docs/codex.md](docs/codex.md).

## Commands

| Command | Does |
|---|---|
| `/shipfound:audit` | Access audit of 12 areas (repo, hosting, Search Console, Bing, Gmail, Reddit, X, review sites, GitHub, tracking, assets, marketplace fit) and the free baseline visibility run |
| `/shipfound:plan` | The ranked queue for this week, built only from what the audit found open |
| `/shipfound:fix` | Tracking first, then site fixes as one pull request per theme |
| `/shipfound:write <type>` | One glossary, answer, comparison, alternatives or long-form page, gated and opened as a PR |
| `/shipfound:index` | Sitemap and IndexNow key by PR, then sitemap submits and Request indexing in your Chrome |
| `/shipfound:status` | Credits, what shipped, what is verified and what is still claimed |
| `/shipfound:analytics <question>` | Answers an analytics question in plain words with numbers |
| `/shipfound:week` | The Monday routine. The server-side weekly re-check is not built yet; the command does it by hand |
| `/shipfound:list` | Review and launch profiles filled in your Chrome. The directory database batches come later |
| `/shipfound:reach` | Community replies and Gmail drafts. Thread discovery comes later |
| `/shipfound:test` | A/B test proposals from your funnel. Running experiments comes later |

Supported stacks for pull requests: Next.js, Astro, Nuxt, SvelteKit, Hugo and plain HTML. Other stacks get the audit, indexing and analytics, and no code changes.

## What it never does

- Never posts, publishes or sends without you. It fills the box; you press the button.
- Never merges code. Every change is a pull request on its own branch, with a preview.
- Never uses accounts you don't own, and never creates accounts for you.
- No fake reviews, testimonials or quotes.
- No karma farming, warmup automation or vote manipulation.
- No bulk email. Gmail drafts only, one to one, at most 20 a day.
- No Wikipedia or Wikidata edits about you or your competitors.
- Never calls something done until the Shipfound server has checked it live.

## Pricing

Your agent's work runs on your own Claude or ChatGPT subscription. Shipfound credits pay for search data, AI visibility runs and verification; tracking and analytics never cost credits. Free includes the audit, one baseline visibility check and 20 credits. The agent states the price before any step over 5 credits and waits for your yes. Plans and prices: https://shipfound.co. Our own numbers, every answer included: https://shipfound.co/proof/shipfound.

## Privacy

- The agent works on your machine. Your code is not uploaded to Shipfound; only what the agent records through the MCP tools is sent (the audit result, URLs of PRs, pages and listings, and drafts you check with `check_content`).
- Browser and Gmail work happens in your own Chrome and through your own Gmail connector. Shipfound never sees your passwords or cookies.
- tracking.js is cookieless by default: it stores nothing in the browser and the tracker drops the IP after deriving a daily visitor id. Attribution mode keeps a first-party id for 13 months and needs consent where the law requires it. Whether you need a banner depends on where you and your visitors are.
- The crawler beacon sends only requests whose user agent is on the crawler list in [snippets/crawlers.json](snippets/crawlers.json). Requests from people are never sent by the beacon.

## Repo layout

```
.claude-plugin/plugin.json        plugin manifest
.claude-plugin/marketplace.json   the "shipfound" marketplace with one plugin
.mcp.json                         the remote MCP server (HTTP, OAuth)
scripts/mcp-headers.sh            optional API key header
skills/shipfound/SKILL.md         the growth engineer skill
skills/shipfound/references/      audit, fixes, content, tracking, verification, PR playbooks
commands/                         the /shipfound:* commands
snippets/                         crawler beacons for Astro, Nuxt, SvelteKit, Vercel, Netlify, Cloudflare, nginx and Caddy
AGENTS.md, docs/codex.md          Codex
scripts/validate.mjs              checks this repo (node scripts/validate.mjs)
```

Next.js sites use the npm package [`@shipfound/next`](https://www.npmjs.com/package/@shipfound/next) for the beacon.

## License

MIT

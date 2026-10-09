# Shipfound

Your coding agent ships features. Shipfound makes it ship customers.

Shipfound turns Claude Code or Codex into your growth engineer. It checks what you have access to, fixes your site for Google and AI search, ships blog, glossary and comparison pages as pull requests, gets your pages indexed on Google and Bing, and installs tracking that shows when GPTBot, PerplexityBot and ClaudeBot read your pages and when ChatGPT sends you a visitor. The Shipfound server checks every result itself, and labels each one Verified or Claimed.

This repo is the plugin for both hosts: one skill with its routines, the `/shipfound:*` commands for Claude Code, the Codex plugin manifest, the MCP server config, and crawler beacon snippets. The data, verification and results app live at https://www.shipfound.co.

## Install

Pick your agent. Both get the same skill, the same routines and the same remote MCP server. Claude Code signs in from the chat; Codex signs in with OAuth.

### Claude Code

```bash
claude plugin marketplace add shipfound/shipfound
claude plugin install shipfound@shipfound
```

Then open a new Claude Code session in your site's repo and run `/shipfound:audit`. From then on, start each day with `/shipfound:grow`: it checks what changed and what is still failing, then offers one move. The shell commands work for every Claude Code surface (terminal, VS Code, Cursor, desktop). In the terminal CLI you can also install from inside a session with `/plugin marketplace add shipfound/shipfound` and `/plugin install shipfound@shipfound`.

You sign in from the chat. The first Shipfound command gives you a link and a code: your browser opens the link, you check the code, pick your site and choose Allow, and the command carries on by itself. Nothing to restart. To sign in on its own, run `/shipfound:login`. Each new session signs in again the same way, with one click if you are still signed in on shipfound.co.

### Codex

```bash
codex plugin marketplace add shipfound/shipfound
codex plugin add shipfound@shipfound
codex mcp login shipfound
```

`codex mcp login` opens your browser to sign in (OAuth). Then start a new Codex thread in your site's repo and ask: "Run the Shipfound audit." From then on, start each day by asking: "What should I do today?" In the ChatGPT desktop app you can also install it from Plugins once the marketplace is added; it shows up under Shipfound.

Codex has no plugin slash commands, so you ask in words ("fix the site", "get us indexed", "status") and the skill runs the matching routine. To call the skill by name, type `$shipfound:shipfound`.

**MCP server only (no plugin).** If you would rather not install the plugin:

```bash
codex mcp add shipfound --url https://api.shipfound.co/mcp
codex mcp login shipfound
```

Then copy [AGENTS.md](AGENTS.md) into your repo. Full steps: [docs/codex.md](docs/codex.md).

### Sign in with an API key instead

For CI or a machine without a browser, make a key in the Shipfound app (Settings, MCP server; it starts with `wl_`). Each key carries a daily credit cap.

- **Claude Code:** add the server with the key as a fixed header, and use it in place of the plugin's server (turn that one off in `/mcp`; the skill and routines keep working). This also suits anyone who would rather not sign in each session:

  ```
  claude mcp add --transport http shipfound-key https://api.shipfound.co/mcp --header "Authorization: Bearer $SHIPFOUND_API_KEY"
  ```
- **Codex plugin:** `export SHIPFOUND_AUTHORIZATION="Bearer wl_..."` before starting Codex. The plugin sends it as the `Authorization` header; unset, OAuth is used.
- **Codex, MCP server only:** `codex mcp add shipfound --url https://api.shipfound.co/mcp --bearer-token-env-var SHIPFOUND_API_KEY`, with `SHIPFOUND_API_KEY` exported.

### Point at another server

- **Claude Code:** the MCP server defaults to `https://api.shipfound.co/mcp/plugin`. Set `SHIPFOUND_API_URL` to use another API origin (staging, or `http://localhost:4000` when developing Shipfound itself); the plugin appends `/mcp/plugin`.
- **Codex:** the plugin's server URL is fixed (Codex does not expand variables in plugin config). For staging or local work, add your server by hand (`codex mcp add shipfound-dev --url http://localhost:4000/mcp`) and turn the plugin's server off in `~/.codex/config.toml`:

  ```toml
  [plugins."shipfound@shipfound".mcp_servers.shipfound]
  enabled = false
  ```

## Routines

Each routine is a file in `skills/shipfound/routines/`. Claude Code runs it as a command; in Codex you ask for it.

You need two: `/shipfound:audit` on day 1, then `/shipfound:grow` every day after. Grow reads what happened since your last session, what is due to verify and what is still failing on your live site, then offers the one move worth making, with its price. It does not offer the same move two days running, and a move you decline waits a week. The rest are there when you want something specific.

| Claude Code | Codex: ask | Does |
|---|---|---|
| `/shipfound:grow` | "What should I do today?" | Every day: what changed, what is due, what is still failing, then one move to make. Start here after the audit |
| `/shipfound:login` | "Sign in to Shipfound" | Signs this session in: a link and a code to approve in your browser. Other commands do it for you when needed |
| `/shipfound:audit` | "Run the Shipfound audit" | Access audit of 11 areas (repo, hosting, Search Console, Bing, Gmail, Reddit, X, GitHub, tracking, assets, marketplace fit) and the first baseline visibility run |
| `/shipfound:plan` | "What should I do next?" | The ranked queue for this week, built only from what the audit found open |
| `/shipfound:fix` | "Fix the site" | Tracking first, then site fixes as one pull request per theme |
| `/shipfound:write <type>` | "Write a glossary page about X" | One glossary, answer, comparison, alternatives or long-form page, gated and opened as a PR |
| `/shipfound:index` | "Get us indexed" | Sitemap and IndexNow key by PR, then sitemap submits and Request indexing in your browser |
| `/shipfound:status` | "Shipfound status" | Credits, what shipped, what is verified and what is still claimed, then what you can do next |
| `/shipfound:analytics <question>` | Any analytics question | Answers it in plain words with numbers |
| `/shipfound:week` | "Run the Shipfound week" | The Monday routine. The server-side weekly re-check is not built yet; the routine does it by hand |
| `/shipfound:list` | "List us on directories" | The directories AI answers cite, picked for your product from about 270 and filled in your browser one after another; you press submit. Launch and review sites when you ask |
| `/shipfound:reach` | "Draft a reply to this thread" | Community replies and Gmail drafts. Thread discovery comes later |
| `/shipfound:test` | "What should we A/B test?" | A/B tests: a change proposed from your analytics, sized from your traffic, shipped as a variant, read honestly, winner shipped |
| `/shipfound:video` | "Make a video of my product" | 15 seconds of your real product in your own logo, fonts and colors, no sound, cut on your machine and checked frame by frame. Every boost carries one. Free |
| `/shipfound:boost` | "Boost this post on X" | A small paid test of your own X posts: you pick the post (or ask which), your agent fills X Ads Manager, you press Launch; read on clicks and traced to signups. Your money, never spent without your yes |
| `/shipfound:aso` | "Fix our App Store listing" | Your iOS app: a free listing audit, then fixes and new languages (as a PR, or staged in your next version), a to-do list from your reviews, its own site on shipfound.site, screenshot A/B tests, custom product pages and Apple Ads proposals you approve, each change verified once live |

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

Your agent's work runs on your own Claude or ChatGPT subscription. Shipfound credits pay for search data, AI visibility runs and verification; tracking and analytics never cost credits. Free includes the audit, one baseline visibility check and 20 credits. The agent states the price before any step over 5 credits and waits for your yes. Plans and prices: https://www.shipfound.co. Our own numbers, every answer included: https://www.shipfound.co/proof/shipfound.

## Privacy

- The agent works on your machine. Your code is not uploaded to Shipfound; only what the agent records through the MCP tools is sent (the audit result, URLs of PRs, pages and listings, and drafts you check with `check_content`).
- Browser and Gmail work happens in your own Chrome (Claude in Chrome, or the Codex Browser plugin with its Chrome extension) and through your own Gmail connector. Shipfound never sees your passwords or cookies.
- tracking.js is cookieless by default: it stores nothing in the browser and the tracker drops the IP after deriving a daily visitor id. Attribution mode keeps a first-party id for 13 months and needs consent where the law requires it. Whether you need a banner depends on where you and your visitors are.
- The crawler beacon sends only requests whose user agent is on the crawler list in [snippets/crawlers.json](snippets/crawlers.json). Requests from people are never sent by the beacon.

## Repo layout

```
.claude-plugin/plugin.json        Claude Code plugin manifest
.claude-plugin/marketplace.json   the "shipfound" marketplace for Claude Code
.codex-plugin/plugin.json         Codex plugin manifest (skills, MCP server, listing)
.agents/plugins/marketplace.json  the "shipfound" marketplace for Codex
.mcp.json                         the remote MCP server for Claude Code (HTTP, sign-in from the chat)
skills/shipfound/SKILL.md         the growth engineer skill, shared by both hosts
skills/shipfound/routines/        one procedure per routine (audit, fix, write, ...)
skills/shipfound/references/      audit, fixes, content, tracking, verification, PR playbooks
skills/shipfound/agents/          Codex skill metadata
commands/                         the /shipfound:* commands (Claude Code), each starts a routine
snippets/                         crawler beacons for Astro, Nuxt, SvelteKit, Vercel, Netlify, Cloudflare, nginx and Caddy
assets/icon.svg                   plugin icon
AGENTS.md, docs/codex.md          Codex with the MCP server only
scripts/validate.mjs              checks this repo (node scripts/validate.mjs)
```

Next.js sites use the npm package [`@shipfound/next`](https://www.npmjs.com/package/@shipfound/next) for the beacon.

## License

MIT

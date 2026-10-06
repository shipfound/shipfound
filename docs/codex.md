# Shipfound in Codex

Codex connects to the same remote MCP server as Claude Code. There are no slash commands; you ask in words and Codex follows [AGENTS.md](../AGENTS.md).

## 1. Add the MCP server

```bash
codex mcp add shipfound --url https://api.shipfound.co/mcp
codex mcp login shipfound
```

`codex mcp login` opens the browser and signs you in with OAuth.

Or edit `~/.codex/config.toml` by hand:

```toml
[mcp_servers.shipfound]
url = "https://api.shipfound.co/mcp"
```

then run `codex mcp login shipfound`.

### With an API key instead of OAuth

For CI or a machine without a browser, make a key in the Shipfound app (Settings, MCP server; it starts with `wl_`), export it, and point Codex at the variable:

```bash
export SHIPFOUND_API_KEY=wl_...
codex mcp add shipfound --url https://api.shipfound.co/mcp --bearer-token-env-var SHIPFOUND_API_KEY
```

```toml
[mcp_servers.shipfound]
url = "https://api.shipfound.co/mcp"
bearer_token_env_var = "SHIPFOUND_API_KEY"
```

Each key carries a daily credit cap, so a leaked key cannot spend more than that in a day.

### Another server URL

For a staging or local API, change `url`, for example `http://localhost:4000/mcp`.

## 2. Add the guidance

Copy [AGENTS.md](../AGENTS.md) into your site's repo as `AGENTS.md` (or append it to the one you have). To use it in every repo, put it in `~/.codex/AGENTS.md`.

If your Codex version loads Agent Skills, also copy the skill so Codex can read the detailed playbooks:

```bash
git clone https://github.com/shipfound/shipfound ~/shipfound-plugin
mkdir -p ~/.codex/skills
cp -R ~/shipfound-plugin/skills/shipfound ~/.codex/skills/shipfound
```

The crawler beacon snippets for Astro, Nuxt, SvelteKit, Cloudflare, Vercel, Netlify and nginx or Caddy are in `~/shipfound-plugin/snippets/`.

## 3. Run the audit

In Codex, in your site's repo:

```
Run the Shipfound audit.
```

Then "fix the site", "write a glossary page about <term>", "get us indexed", "status", or any analytics question. Codex tells you the price before anything over 5 credits and waits for your yes.

# Shipfound in Codex

Codex gets the same skill, routines and remote MCP server as Claude Code. There are no slash commands in Codex: you ask in words ("run the Shipfound audit") and the skill runs the matching routine.

There are two ways to set it up. The plugin is the full version; the MCP-only setup is for when you do not want a plugin.

## A. The plugin (recommended)

```bash
codex plugin marketplace add shipfound/shipfound
codex plugin add shipfound@shipfound
codex mcp login shipfound
```

- `codex plugin marketplace add` registers this repo as the `shipfound` marketplace (Codex reads `.agents/plugins/marketplace.json`). Add `--ref <tag>` to pin a release.
- `codex plugin add` installs the plugin: the `shipfound` skill with its routines and references, and the `shipfound` MCP server at `https://api.shipfound.co/mcp`.
- `codex mcp login shipfound` opens the browser and signs you in with OAuth.

In the ChatGPT desktop app, once the marketplace is added, the plugin also shows up in Plugins under Shipfound, where you can install it and sign in.

Start a new thread after installing so Codex picks up the skill and tools. The skill is listed as `shipfound:shipfound`; type `$shipfound:shipfound` to call it by name, or just ask.

To update: `codex plugin marketplace upgrade shipfound`, then `codex plugin add shipfound@shipfound` again.

### With an API key instead of OAuth

For CI or a machine without a browser, make a key in the Shipfound app (Settings, MCP server; it starts with `wl_`) and export it as a full header value before starting Codex:

```bash
export SHIPFOUND_AUTHORIZATION="Bearer wl_..."
```

The plugin sends it as the `Authorization` header. With the variable unset, nothing is sent and OAuth is used. Each key carries a daily credit cap, so a leaked key cannot spend more than that in a day.

### Another server URL

Codex does not expand variables in plugin config, so the plugin always points at `https://api.shipfound.co/mcp`. For a staging or local API, add your server by hand and turn the plugin's server off:

```bash
codex mcp add shipfound-dev --url http://localhost:4000/mcp
```

```toml
# ~/.codex/config.toml
[plugins."shipfound@shipfound".mcp_servers.shipfound]
enabled = false
```

## B. The MCP server only

### 1. Add the MCP server

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

With an API key instead of OAuth:

```bash
export SHIPFOUND_API_KEY=wl_...
codex mcp add shipfound --url https://api.shipfound.co/mcp --bearer-token-env-var SHIPFOUND_API_KEY
```

```toml
[mcp_servers.shipfound]
url = "https://api.shipfound.co/mcp"
bearer_token_env_var = "SHIPFOUND_API_KEY"
```

For a staging or local API, change `url`, for example `http://localhost:4000/mcp`.

### 2. Add the guidance

Copy [AGENTS.md](../AGENTS.md) into your site's repo as `AGENTS.md` (or append it to the one you have). To use it in every repo, put it in `~/.codex/AGENTS.md`.

For the full routines, also copy the skill so Codex can read them:

```bash
git clone https://github.com/shipfound/shipfound ~/shipfound-plugin
mkdir -p ~/.codex/skills
cp -R ~/shipfound-plugin/skills/shipfound ~/.codex/skills/shipfound
```

Copied this way the skill is named `shipfound` (`$shipfound`). The crawler beacon snippets for Astro, Nuxt, SvelteKit, Cloudflare, Vercel, Netlify and nginx or Caddy are in `~/shipfound-plugin/snippets/`.

## Run the audit

In Codex, in your site's repo:

```
Run the Shipfound audit.
```

Then "fix the site", "write a glossary page about <term>", "get us indexed", "status", or any analytics question. The full list is in the README's Routines table. Codex tells you the price before anything over 5 credits and waits for your yes.

## Browser and Gmail

Search Console, Bing, Reddit, X and listings run in your own Chrome through Codex's Browser plugin and its Chrome extension. The in-app browser is not signed in to your accounts, so the audit marks those areas "Not checked" if only it is available. Inbox drafts need a Gmail connector that can create drafts; without one, Codex gives you the text to paste. Codex fills forms and reply boxes; you press submit, post or send.

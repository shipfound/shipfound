# Routine: agent-inside (Agent Inside™)

The founder's product as a tool the agents people already use can call, and inside the skill packs, agent templates and automation nodes they already install. First the product's own surfaces: an agent skill on its real API, and, where it has an API, a small MCP server over it. Then additions to other people's packs and nodes in its domain, each by that repo's own rules, or pitched to its owner. Every addition carries a link that counts what it brings. Postiz went from $20k to $100k MRR in three months as the posting tool inside a popular agent skill. Free.

Input: nothing (the surface first, then the packs), or `packs`.

Follow [../references/pr-conventions.md](../references/pr-conventions.md) and [../references/verification.md](../references/verification.md).

## Hard lines here

- A skill, server or node calls only what the product really exposes: its API, CLI or MCP server. Never an endpoint, a flag or a tool name that is not there.
- It reads the user's own API key from their environment. Never a key in the code, the README or the package.
- The founder publishes every repo and package, opens every PR and issue, and sends every email. You prepare the branch, the files and the text.
- Only where the repo's own rules take additions: its CONTRIBUTING, its PR template or its issue form, read first. One addition per repo, saying plainly that it is the founder's own product.
- Never ask for or buy stars, upvotes or installs.

## Procedure

1. Call `workspace` with `repo`, then `agent_inside` (free): the `surfaces` that shipped, the `targets` with their links, and the `rules`. Input `packs`: step 4.
2. **The surface.** Read the repo for the product's public API routes, its CLI or SDK, an MCP server already in it, and how a user authenticates (a personal API key, OAuth).
   - No skill yet: the build routine with `skill`.
   - An API and no MCP server: a small MCP server over it, in a new folder outside the product's repo (`../<product>-mcp`), or in the repo where it already ships packages. One tool per job a user would ask an agent for, from the API's main routes; the user's API key from an environment variable; a README with the install line for Claude Code (`claude mcp add`), Cursor and Codex, three example prompts, and the tagged link. The founder publishes it (a public repo, and npm when it is a package). Then `record_action` with `module` CONTENT, `kind` PAGE, `url` the repo, `meta` `{ type: "mcp_server" }`.
   - Neither an API nor a CLI: say in one line that this fits products an agent can call, and stop.
3. **Listed.** Each new surface goes to the listings routine's marketplaces (skills.sh, the MCP registries, the plugin directories). Offer it.
4. **Inside others.** In the founder's terminal, search GitHub and npm for the product's domain: `gh search repos "<domain> skills" --sort stars --limit 20`, `gh search repos "claude code <domain>" --sort stars`, agent templates and starters in the domain, n8n community nodes (`npm search n8n-nodes-<category>`) and Pipedream components for the category. Keep repos with 300 stars or more and a commit in the last 90 days, whose rules take additions, or whose owner publishes an email. `agent_inside` with `add`, each with `how` (pr, issue or email) from the repo's own rules.
5. **Pick.** Show them one line each: the name, stars, how it takes additions, and why the product fits its users. The founder picks.
6. **Add.** For each pick:
   - **pr:** fork and branch in the founder's terminal, add the product's skill, tool or component in the repo's own format with the target's `link`, run the repo's own checks, and write the PR text: what it does for the repo's users, and that it is the founder's own product. Give the founder the `gh pr create` line to run; then `agent_inside` with `mark` opened and the PR's link.
   - **issue:** the issue in the repo's own form, filled for the founder to open; then `mark` opened with its link.
   - **email:** call `mail_setup`, then one short email to the owner in the sending address's mailbox: their pack, why the product fits its users, the addition ready on a branch, and "If it isn't a fit, just say so." The 20 inbox drafts a day are shared. Then `mark` emailed.
   - **An n8n node of the product's own:** `n8n-nodes-<product>` over its API, from n8n's community node starter. The founder publishes it to npm and submits it for verification; `record_action` with `module` CONTENT, `kind` PAGE, `url` the package, `meta` `{ type: "agent_node" }`.
7. **A week later**, `gh pr view <link> --json state` for each opened PR: merged, `mark` merged (it is recorded with its campaign); closed, `mark` declined.
8. **Read** what each merged addition brought: `analytics` by its campaign (`sf-agent-<name>`), the visits and signups.

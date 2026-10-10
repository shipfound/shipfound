# Routine: build

Something the founder gives away that brings buyers back to the product: a **free tool** on their site (a checker, generator or calculator their buyers search for), or an **agent skill** for their product (a SKILL.md that Claude Code, Codex and Cursor install with one command). Built by you, shipped as a PR or a repo the founder publishes, checked live by Shipfound.

Follow [../references/pr-conventions.md](../references/pr-conventions.md) and [../references/verification.md](../references/verification.md).

Input: `tool` or `skill`, then an optional idea (the name from `build_ideas`). Neither given: ask which, recommending a tool unless `plan` offered the skill.

## Procedure

1. Call `workspace` and `access`. For a tool, run the framework gate (SKILL.md); stop for unsupported stacks.
2. **Ideas.** No idea given: call `build_ideas` with the kind. A tool costs 4 credits, so say "build_ideas: 4 credits" as you call it; a skill is free. Show each idea in one line (for a tool: the name, its monthly searches, and the bridge to the product; for a skill: the name and what it does) and ask which to build, recommending the first. What is built already is left out, so never offer one from memory. For a skill, if `fit.good` is false, say `fit.why` in plain words and recommend a tool instead.
3. Build it: a tool by step 4, a skill by step 5.
4. **A free tool.**
   - Where: one page at `/tools/<slug>` (or the path the site already uses for tools), in the site's own framework, components and styles. If the site has no tools index, add `/tools` listing it, and link that from the footer.
   - **No signup, no email before the result.** The result shows in seconds and works on a phone. Bad input gets a plain message, never a crash.
   - Logic in the page where it can be. A server route only for what a browser cannot do (fetching another site's robots.txt, say), on the site's own server: public addresses only (refuse localhost, private and link-local IPs, and re-check after redirects), a 10 second timeout, a size cap, and a simple per-IP rate limit. No new paid API, no new secret, no data kept beyond what the founder already keeps.
   - **One call to action, after the result**, saying the idea's bridge in the founder's voice ("Want this checked every week? <Product> does it for you."), linking to their signup or the page that sells it. No utm tags on links within the site: they overwrite where the visitor came from. Instead put `data-sf="tool-cta-<slug>"` on the button, and call `sf('tool_run', { tool: '<slug>' })` each time a result shows.
   - For Google and AI answers: the title and H1 carry the keyword; a meta description; two or three short paragraphs on what it checks and how; three to five FAQ entries answering what people really ask (from `keyword_research` only if the founder wants it, 4 credits); JSON-LD `WebApplication` (name, url, `applicationCategory`, `offers` with price 0) and `FAQPage`; in the sitemap.
   - **Facts:** no numbers, stats or claims that do not come from the founder's site or the tool's own output. Never put another product's name or logo on the tool.
   - Try it locally before the PR: build the site, run the tool with three real inputs and one bad one, and fix what breaks.
   - If no `tool_run` goal exists (`goals_list`), create a soft one: `goals_save` `{ name: "tool_run", type: "EVENT", match: "tool_run", note: "free tool result shown, <file>" }`. Soft until the founder converts it.
   - Branch `shipfound/build-tool-<slug>`, one PR, the body per pr-conventions with the keyword and its monthly searches. `record_action` with `module` CONTENT, `kind` PR, `title` "Free tool: <name>", `url` the PR, `liveUrl` the tool's final URL, `meta: { type: "free_tool", topic: "<name>", keyword: "<keyword>" }`.
5. **An agent skill.**
   - Read how the product is used from code: its public API routes, CLI, SDK or MCP server and their docs in the repo. The skill uses only what exists. **Never invent an endpoint, flag or tool name.** If the product has none, the skill does the job on its own and says where the product helps further.
   - Where it lives: if the product's repo is public, a PR adding `skills/<name>/SKILL.md` there. Otherwise a new folder outside the product repo (`../<product>-skills`), a new git repo the founder publishes in step 6.
   - `SKILL.md`: frontmatter with `name` (kebab-case) and `description` (what it does and exactly when to use it: "Use when the user asks to ..."). The body is the steps an agent follows, the commands or calls with their real arguments, and what to do when something fails. Keep it under 300 lines; long reference material goes in `references/` beside it.
   - Credentials: from an environment variable the README names (`<PRODUCT>_API_KEY`), never a key in a file. Scripts, if any, in `scripts/`: they call only the product's own API, send nothing anywhere else, and keep no telemetry.
   - `README.md`: what it does in one line, the install line `npx skills add <owner>/<repo>`, what it needs (an account, the env var), three example prompts, and a link to the product. A licence the founder picks (MIT is common; ask).
   - Optionally a Claude Code plugin manifest (`.claude-plugin/plugin.json`) so it can go in the plugin directories; then run `claude plugin validate .` and fix what it reports.
   - Read it back as an agent would: does the description say when to use it? Does every command it names exist?
6. **Publishing a skill is the founder's.** A new repo: give them the one command to run (`gh repo create <owner>/<name> --public --source . --push`). A PR on the product's repo: they merge it. Then they run the first `npx skills add <owner>/<repo>` themselves: that first install is what lists it on skills.sh. Once it is public, `record_action` with `module` CONTENT, `kind` PAGE, `title` "Agent skill: <name>", `url` and `liveUrl` the repo (or the folder on GitHub), `meta: { type: "skill", topic: "<name>" }`. That opens the skill and plugin directories in the list routine's marketplaces; offer it as the next move. The awesome-agent-skills list takes only skills with real installs, so it waits.
7. Summarise: what was built, where it lives, the PR or repo (claimed, not verified), credits spent, and for a tool that it is now what a Show HN post can link to. Then the hand-over (SKILL.md): offer the next move.

One tool or one skill per run. Never build a tool that imitates another company's product, collects data the founder does not need, or needs the visitor to sign in.

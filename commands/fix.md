---
description: Site fixes as themed pull requests. Installs tracking first if it is not live yet.
argument-hint: "[theme | url]"
allowed-tools: Read, Grep, Glob, Edit, Write, WebFetch, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh repo view *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__tracking_install, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__goals, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:fix

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md). Read ${CLAUDE_PLUGIN_ROOT}/skills/shipfound/references/site-fixes.md, ${CLAUDE_PLUGIN_ROOT}/skills/shipfound/references/tracking.md and ${CLAUDE_PLUGIN_ROOT}/skills/shipfound/references/pr-conventions.md before changing anything.

Theme or URL from the founder, if given: $ARGUMENTS

## Procedure

1. Call `workspace` and `access`. If there is no audit, run the repo and hosting checks from access-audit.md first (local, free).
2. **Framework gate.** Detect the framework (SKILL.md). If it is not Next.js, Astro, Nuxt, SvelteKit, Hugo or plain HTML, say Shipfound does not ship PRs into this stack yet and stop. If `git status` shows uncommitted work, ask before branching.
3. **Tracking first.** If `workspace` shows tracking not installed and the repo has no Shipfound script:
   1. Call `tracking_install` with `{ domain, framework }` (free). Tell the founder to store the secret now and where to set `SHIPFOUND_SITE_KEY` and `SHIPFOUND_SECRET` for their host. Never commit the secret.
   2. On branch `shipfound/tracking`: add the script tag and the crawler beacon for the stack (tracking.md, section 3). Build. Open the PR. Call `record_action` with `module` TRACKING, `kind` PR.
   3. Say: after you set the env vars, merge and deploy, run `/shipfound:status` and I will run `tracking_check`.
   If tracking is installed but `workspace` does not show events and crawler hits yet, call `tracking_check` and report what is missing.
4. **Site fixes.** Say "site_fixes costs 6 credits; you have N. Run it?" and wait for a yes. Then call `site_fixes` once, with `{ url }` if the founder gave a URL, else `{}`.
5. Group the specs by theme. Show the themes with counts in the order from site-fixes.md, for example "structured-data (3), metadata (7), llms-txt (1)". If the founder named a theme, use it; else take the first one or two.
6. For each chosen theme: reproduce the evidence, apply the fixes in the framework's idiom, build, branch `shipfound/fix-<theme>`, open one PR with the preview link (pr-conventions.md), and call `record_action` with `module` FIXES, `kind` PR, `liveUrl` the main page, `meta.theme` and `meta.fixIds`.
7. Stop after at most 3 PRs in this run. Summarise: PRs opened (all claimed, none verified until merged, deployed and checked), credits spent, the remaining themes, and the next step: review and merge, then `/shipfound:status`.

Never merge, never push to the default branch, never add a dependency other than `@shipfound/next` without asking.

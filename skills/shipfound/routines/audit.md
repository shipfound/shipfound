# Routine: audit

Access audit (11 areas, read only, about 3 minutes) plus the free first baseline visibility run. Start here.

Follow [../references/access-audit.md](../references/access-audit.md) exactly. The audit is free and read only: no file edits, no PRs, no form submits, no posts.

Input: an optional domain.

## Procedure

1. Call `workspace`. If it says you are not signed in, run the login routine now (the approval page also lets a founder with no workspace add their site), then call `workspace` again and carry on. If the call fails with an auth error and there is no `sign_in` tool, tell the founder how to sign in for their host (SKILL.md, "Hosts"), then to run the audit again.
2. Work out the domain: the one the founder gave, else the workspace's product URL. If the repo's homepage or deploy config points at a different domain, ask which one is right before going on.
3. Tell the founder in one line what happens next: "Checking 11 areas, read only, about 3 minutes. I will use your browser for Search Console, Bing, Reddit and X."
4. Check the eleven areas in this order: repo, hosting, github, tracking, assets, marketplace (local, `gh` and live fetches), then gsc, bing, reddit, x (browser), then gmail (Gmail connector). For the tracking area, call `tracking_check` only if `workspace` shows a site. If browser tools or a Gmail connector are missing, mark those areas amber with "Not checked" and the step that lets you check.
5. Framework gate: if the repo's stack is not Next.js, Astro, Nuxt, SvelteKit, Hugo or plain HTML, mark repo red, say Shipfound does not ship PRs into that stack yet, and keep going with the other areas.
6. Call `record_access` once with every area you checked, the `repo` facts, and `client`: "claude-code" in Claude Code, "codex" in Codex.
7. Baseline: call `visibility`. If there is no baseline run yet, call `visibility_run` (the first baseline is free: 10 buyer questions x 4 engines x 4 runs). If a baseline already exists, do not start another one here: a repeat run costs 15 credits and belongs in the week routine.
8. Print the Access Card: the headline ("7 of 11 open, 3 amber, 2 red"), one line per area with its status, and the fix under each amber or red line. Then: the baseline (running, or the latest result in stability labels such as "named in 1 of 4 runs on Perplexity"), the results app link from `workspace` (else https://www.shipfound.co), and the next step, which is almost always the fix routine (tracking goes first).

Never upvote, comment, post, claim a profile or submit a form during the audit. Review and launch sites (Product Hunt, G2, Capterra, AlternativeTo, SaaSHub, BetaList, Crunchbase) are not part of the audit: do not look them up.

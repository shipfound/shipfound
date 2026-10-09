# Routine: audit

Access audit (11 areas, read only, about 3 minutes) plus the free first baseline visibility run. Start here.

Follow [../references/access-audit.md](../references/access-audit.md) exactly. The audit is free and read only: no file edits, no PRs, no form submits, no posts.

Input: an optional domain.

## Procedure

1. Call `workspace`. If the Shipfound tools are missing, or it fails with an auth error or says you are not signed in, run the login routine now (the approval page also lets a founder with no workspace add their site), then call `workspace` again and carry on.
2. Work out the domain: the one the founder gave, else the workspace's product URL. If the repo's homepage or deploy config points at a different domain, ask which one is right before going on.
3. Check the browser before you start. Search Console, Bing and X are read in the founder's own logged-in browser with the browser tools for their host (SKILL.md, "Hosts"), and nothing else can stand in for it. Ask those tools for the open tabs: an answer means they are connected. If it is connected, tell the founder in one line what happens next: "Checking 11 areas, read only, about 3 minutes. I will use your browser for Search Console, Bing and X, and ask you one question about Reddit." If it is not connected, say so first, plainly, with the steps to connect it for their host (SKILL.md, "Hosts", the Browser row), and ask: "Connect it and say go, or I carry on and those three come back Not checked." Wait for the answer.
4. Check the eleven areas in this order: repo, hosting, github, tracking, assets, marketplace (local, `gh` and live fetches), then gsc, bing, x (browser), then reddit (one question to the founder), then gmail (Gmail connector). For the tracking area, call `tracking_check` only if `workspace` shows a site. If the browser is still not connected, mark gsc, bing and x amber with "Not checked: your browser is not connected" and the fix "Connect your browser" followed by the steps for their host (the results app shows each fix on its own). Do not offer to check them another way (a username, a public fetch): X blocks plain fetches, and logged-out pages cannot show what the founder can use. If a Gmail connector is missing, mark gmail as its section says.
5. Framework gate: if the repo's stack is not Next.js, Astro, Nuxt, SvelteKit, Hugo or plain HTML, mark repo red, say Shipfound does not ship PRs into that stack yet, and keep going with the other areas.
6. Call `record_access` once with every area you checked, the `repo` facts, and `client`: "claude-code" in Claude Code, "codex" in Codex.
7. Baseline: call `visibility`. If there is no baseline run yet, call `visibility_run` (the first baseline is free: 10 buyer questions x 4 engines x 4 runs). If a baseline already exists, do not start another one here: a repeat run costs 15 credits and belongs in the week routine.
8. Print the Access Card: the headline ("7 of 11 open, 3 amber, 2 red"), one line per area with its status, and the fix under each amber or red line. If the browser was not connected, put that first, above the headline: "Your browser is not connected, so Search Console, Bing and X were not checked." Then the steps to connect it for their host, once, and "then run the audit again". Under each of the three areas, the fix is just "Connect your browser". Then: the baseline (running, or the latest result in stability labels such as "named in 1 of 4 runs on Perplexity"), the results app link from `workspace` (else https://www.shipfound.co), and the next step, which is almost always the fix routine (tracking goes first). Then the hand-over (SKILL.md): offer the next move.

Never upvote, comment, post, claim a profile or submit a form during the audit. Review and launch sites (Product Hunt, G2, Capterra, AlternativeTo, SaaSHub, BetaList, Crunchbase) are not part of the audit: do not look them up.

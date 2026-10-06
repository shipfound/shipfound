# Pull request conventions

Every code change goes out as a pull request on its own branch, with a preview. You never merge (hard line 5).

## Before you branch

- `git status`: if the working tree has the founder's uncommitted changes, stop and ask. Never stash, reset or commit their work.
- Start from the up-to-date default branch: `git fetch origin && git switch -c <branch> origin/<default>`.
- One theme per branch. Never mix a site fix and a content page.

## Branch names

`shipfound/<module>-<theme>`, lower case, hyphens, under 50 characters:

- `shipfound/tracking`
- `shipfound/fix-structured-data`
- `shipfound/fix-robots-ai-crawlers`
- `shipfound/content-glossary-llms-txt`
- `shipfound/content-vs-acme`
- `shipfound/index-indexnow-key`

If the branch exists, add `-2`.

## Commits

Small and plain. Conventional prefix, imperative, under 72 characters:

```
feat(seo): add Organization and SoftwareApplication JSON-LD
fix(seo): set canonical URLs on blog posts
feat(content): add glossary page for llms.txt
chore(tracking): add Shipfound script and crawler beacon
```

Follow the repo's own convention instead if it has one (read `git log --oneline -20`). Never use `--no-verify` to skip the founder's hooks; if a hook fails, fix the cause or stop and report.

## PR title

`<Theme>: <what changed>`, under 70 characters. For example `Structured data: Organization and SoftwareApplication`.

## PR body

```markdown
## What
- Adds Organization and SoftwareApplication JSON-LD to the root layout.
- Adds FAQ JSON-LD to /pricing (the 4 questions already on the page).

## Why
Shipfound site audit, fixes fx_12, fx_13: no structured data on / or /pricing, so answer engines cannot read the product's name, category or price.

## How to check
- Preview: <preview URL>
- View source on / and /pricing, search for application/ld+json.
- Google Rich Results Test on the preview URL.

## Notes
- No new dependencies.
- Opened by Shipfound from Claude Code. Review and merge it yourself; Shipfound never merges.
```

Keep it short and factual. No marketing language, no em dashes, no claims about results ("this will rank"). If you added a dependency, say which and why under Notes.

## Opening it

```bash
git push -u origin <branch>
gh pr create --title "<title>" --body-file <tmpfile> --base <default>
```

Then find the preview (`gh pr checks`, or the host bot's comment) and add it to the body with `gh pr edit`.

## Never

- Never `gh pr merge`, never enable auto-merge, never approve your own PR.
- Never push to the default branch or force-push.
- Never change CI, branch protection, repository settings or secrets.
- Never commit secrets, `.env` files, or the site secret.
- Never open more than one PR per theme per run, and never more than 3 PRs in one command without the founder saying go on.

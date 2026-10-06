---
description: Write one content page (glossary, answer, comparison, alternatives, post, report) in your stack, gate it, and open a PR.
argument-hint: "<glossary|answer|comparison|alternatives|post|report> [topic]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git push -u origin shipfound/*), Bash(git diff *), Bash(git log *), Bash(gh pr create *), Bash(gh pr view *), Bash(gh pr checks *), Bash(gh pr edit *), mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__plan, mcp__plugin_shipfound_shipfound__check_content, mcp__plugin_shipfound_shipfound__record_action
---

# /shipfound:write

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md). Follow ${CLAUDE_PLUGIN_ROOT}/skills/shipfound/references/content.md and ${CLAUDE_PLUGIN_ROOT}/skills/shipfound/references/pr-conventions.md.

Type and topic from the founder: $ARGUMENTS

## Procedure

1. Call `workspace` and `access`. Run the framework gate (SKILL.md); stop for unsupported stacks.
2. Type: the first word of the arguments, one of glossary, answer, comparison, alternatives, post, report. If it is missing, ask. `report` only when the founder has data to publish; ask for it.
3. Topic: the rest of the arguments. If there is none, call `plan` and take the top CONTENT item, and confirm it with the founder in one line.
4. If the founder has no keyword in mind and wants one, offer `keyword_research` with `{ topic }` at 4 credits. Only on a yes.
5. Call `content_brief` with `{ type, topic, keyword? }`. Say "content_brief: 5 credits" as you call it.
6. Read where this kind of page lives in the repo, its format and frontmatter, and two existing pages for voice. Write the page there, following the outline and using only facts from the research pack and the founder's own site.
7. Call `check_content` with `{ type, markdown, facts }` (2 credits). Fix every failure and run it once more. If it still fails, show the failures and stop without a PR.
8. Add internal links from one or two related pages, update a hand-written sitemap, build the site.
9. Branch `shipfound/content-<type>-<slug>`, open the PR with the preview link, and call `record_action` with `module` CONTENT, `kind` PR, `liveUrl` the page's final URL, `meta: { type, topic, keyword }`.
10. Summarise: the page, its URL once live, the PR (claimed), the gate result, credits spent (brief 5, checks 2 each), and the next step.

Never invent statistics, quotes, customers or competitor claims. One page per run (a batch of up to 5 glossary terms may share one brief each and one PR).

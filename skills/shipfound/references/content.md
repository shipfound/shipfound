# Content

The founder's subscription pays for the writing; Shipfound supplies the research and the gate. The page is written in the founder's stack, in their voice, and goes out as a PR.

## Page types

Use these values for `type` in `content_brief` and `check_content`:

| type | What | Typical length |
|---|---|---|
| `glossary_term` | One term, defined plainly, with how it applies to the product's category | 600 to 900 words |
| `answer_page` | One question buyers ask AI engines, answered in the first two sentences, then the detail and an FAQ | 300 to 600 words |
| `comparison` | "<Product> vs <Competitor>": a fair table and when to pick each | 900 to 1,400 words |
| `alternatives` | "<Competitor> alternatives": a short, honest list including the product | 900 to 1,400 words |
| `article` | A blog post on a topic the brief picks | 1,500 to 2,200 words |

The lengths are what `check_content` gates on. A **listicle** ("Best <category> tools", "Best <category> tools for <segment>") is an `article`: a ranked list of real products with what each is best for, a comparison table, and the product in it on its merits, never at the top by default. Every claim about another product comes from its own public pages. Record it with `meta.type` `listicle`.

## Steps

1. **Pick the topic.** From `plan`, from the founder's request, or from `keyword_research` (`{ topic }`, 4 credits; say the price). Do not research more than one topic per write run.
2. **Brief.** `content_brief` with `{ type, topic, keyword? }` (5 credits; say the price). It returns a research pack (facts, each with a source), an outline and rules. Read all of it before writing.
3. **Read the site.** Find where this kind of page lives (the `contentDir` from the audit, existing posts, the glossary route), the file format (MDX, Markdown with frontmatter, a `.astro` or `.svelte` page, a Hugo content file), the frontmatter fields existing pages use, and two existing pages for tone. Match them exactly.
4. **Write.** Follow the outline. Lead with the answer. Use the founder's own product facts from their site and docs, and only the external facts in the research pack, cited where the brief says to.
5. **Gate.** `check_content` with `{ type, markdown, facts? }` (2 credits). Pass the draft as Markdown (strip component syntax) and the research pack's facts as `facts`. Fix every failure (fabrication, unsupported claim, disparagement, duplication, placeholder) and run it again once. If it still fails, stop and show the founder the failures; do not open the PR.
6. **Wire it in.** Add the page to the sitemap if the sitemap is hand-written, link to it from one or two related existing pages (internal links), and add Article or FAQ structured data only where it is true.
7. **Build** the site locally. A page that breaks the build is not opened.
8. **PR.** One PR per page (a batch of up to 5 glossary terms may share one PR). See [pr-conventions.md](pr-conventions.md).
9. **Record.** `record_action` with `module` CONTENT, `kind` PR, `url` the PR, `liveUrl` the page's final URL, `meta: { type, topic, keyword, key }` (`key` from the Content page idea, when there is one). The Content page shows the page as written, and whether engines cite it.

## Never fabricate

- No invented statistics, customer names, quotes, testimonials, case studies, awards, integrations, or dates.
- No claims about competitors beyond what their own public pages say, and no disparagement. A comparison states where the competitor is the better pick.
- No placeholders left in (`TODO`, `[insert]`, `lorem`, `example.com` in prose).
- If a fact the outline wants is missing from the research pack and the founder's site, leave the section out or ask the founder. Never fill the gap.
- Never write reviews or testimonials, on the site or anywhere else.

## Voice

Write like the founder's best existing page, not like a content farm. Short sentences. Specific numbers. No em dashes. No "In today's fast-paced world", no "Let's dive in", no "game-changer". None of the banned words in SKILL.md. Answer first, then explain.

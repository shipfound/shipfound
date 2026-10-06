---
description: Answer an analytics question in plain words with numbers, for example "which channel brought paid users in September".
argument-hint: "<question>"
allowed-tools: mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__goals, mcp__plugin_shipfound_shipfound__tracking_check, mcp__plugin_shipfound_shipfound__shipped
---

# /shipfound:analytics

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md). Analytics is free.

The question: $ARGUMENTS

## Procedure

1. If there is no question, ask for one and give three examples: "How many visits came from ChatGPT last week?", "Which landing page converts best?", "Did the llms.txt PR change AI crawler hits?"
2. Call `workspace`. If tracking is not installed, say so, point to `/shipfound:fix`, and stop.
3. Turn the question into at most 3 `analytics` calls, each `{ report, from?, to?, compare?, filters? }`:
   - Reports: overview, realtime, channels, ai_search, sources, landing_pages, pages, shipped_work, ai_crawlers, conversions, timeseries.
   - Dates as ISO dates. "Last week" is the last 7 full days; "September" is 2026-09-01 to 2026-09-30 unless the year is clear otherwise. Set `compare: true` when the question is about change.
   - Filters: `[{ field, op, value }]`, `op` one of is, is_not, contains; fields channel, ai_engine, path, landing_page, referrer_host, utm_source, utm_medium, utm_campaign, country, device, browser, os.
   - Goals: call `goals` with `{ action: "list" }` when the question names a conversion.
4. Answer in two to six lines: the direct answer first, with numbers, the period, and the change against the previous period when you have it. For example "ChatGPT sent 31 visits last week (up from 12), 6 signed up (19%). Perplexity sent 9, none signed up."
5. Say what the numbers cannot show, in one line, when it matters: cookieless mode cannot follow a visitor across days, so multi-day attribution needs Attribution mode; revenue needs a payment webhook; Search Console and Bing data run 2 to 3 days behind.
6. If the reports are empty, call `tracking_check` and report what is missing instead of guessing.

Never round small numbers into percentages without the count ("2 of 3", not "67%"), and never present a trend from fewer than 20 sessions as a finding.

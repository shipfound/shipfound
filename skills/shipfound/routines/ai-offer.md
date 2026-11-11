# Routine: ai-offer (AI Agent Offer)

One offer for the people ChatGPT, Claude, Perplexity and other AI assistants send to the founder's site, said the same to people and to agents: a page an assistant can quote when someone asks about the product, and a line on landing for visitors an assistant sent, carried into signup. Free.

Input: nothing.

Follow [../references/pr-conventions.md](../references/pr-conventions.md) and [../references/verification.md](../references/verification.md).

## Hard lines here

- Never content for bots only, and never content switched by user agent: that is cloaking, which Google penalizes and the engines read as manipulation. The page, its Markdown and its structured data say exactly what the landing line says.
- The offer is the founder's: what they get, the amount, the code and the end date. Fill any code in their payment dashboard and stop before Save.
- Never say an AI recommends the product. The landing line names where the visitor came from and the offer, nothing more.
- No fake urgency: an end date only when the founder set one.

## Procedure

1. Call `workspace` with `repo`, then `ai_offer` (free). It returns the AI-sent visits of the last 28 days by engine with their conversions (`aiVisits`), whether a landing line is worth a test yet (`landingLine`), the offer if set, whether one `shipped`, `referralScript`, and the `rules`. Shipped already: read its visits and signups with `analytics` (`ai_search`) and stop.
2. **The offer.** AskUserQuestion, in one go: what a visitor an AI assistant sent gets (more credit, a discount on the first payment, a longer trial, or their own), the amount, how it applies (by itself at signup, or a code at checkout) and any end date. Read the repo first for what the product can give and how signup and checkout take an offer, and recommend the one that applies by itself. Then `ai_offer` with `save`; it returns the page's `templates`.
3. **Build it** in the founder's stack, branch `shipfound/ai-offer`, one PR:
   - **The offer, in public:** a page at `/offer` in the site's own components, `/offer.md` from `templates.markdown`, and `templates.jsonLd` as structured data on `/offer` and on the pricing page. Link it from `llms.txt` and `pricing.md` when the site has them, and from the pricing page's small print.
   - **How it applies:** by itself, where the account is created: a visitor whose signup carries `via=<engine>` gets it, once per account. As a code: the code prefilled at checkout when `via` is set, the code itself saved in the payment dashboard by the founder.
   - **The landing line**, only when `landingLine` is yes: on the pages AI-sent visitors land on (`aiVisits.engines`' landing pages in `analytics`), run `referralScript`; when it names an assistant, show one line ("Came from ChatGPT? <the offer>.") and add `via=<engine>` to the signup links. As an A/B test (the test routine): the code asks for its arm only when `referralScript` names an assistant, so the test counts AI-sent visitors only.
4. `record_action` with `module` FIXES, `kind` PR, `url` the PR, `liveUrl` the offer page, `meta` `{ type: "ai_offer" }`. Once it is live, `verify`.
5. **Read it** after 28 days: `analytics` with `ai_search`, the AI-sent visits and their signups before and after, in one line.

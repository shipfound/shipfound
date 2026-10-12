# Reading the page

How the convert routine reads what a page says. The buttons are followed separately; this is about the words. One question runs through all of it: does this line give a visitor who has never heard of the product anything? Lines that do not lose visitors before they click anything.

This is judgment, not a layout checklist. There is no required order of sections and no list of what a home page must contain. Read every line, decide keep, cut, shorten or rewrite, and say why.

## Read it all first

1. **Every line a visitor sees.** Read the page's source and every component and data list it renders: card lists, step lists, plan features, the FAQ, the header and the footer. Copy is spread across files; judge none of it until you have all of it.
2. **Measure it on a phone.** In the founder's Chrome, open the live page, resize the window to 390 by 844 if you can, and run `read.measure.script` from `funnel_check` (the host's JavaScript tool). It works at any width. It returns the page's height in phone screens, its words, the screen the first button and the product image are on, how far anything sticks out to the side, each section's words and height, and three lists: `smallPrint`, `labels` and `quotedTerms`. Keep the numbers: they are the before. Take screenshots of the first screen and the longest sections, then reload the page (the script changes its styles).
3. **The small print, the labels and the quoted terms are lines too.** Captions under images, notes under buttons and price tables, eyebrows above headings, badges and chips, definition boxes. A read of the main copy skips them and visitors still see them. Judge every entry in those three lists like any other line.
4. **What the product gets its customers, in the founder's words.** `read.outcomes` has their list once they have given it. When it is null, ask once: "In a list, what does it get your customers?" and pass the answer as `outcomes`. Never ask again.

## Five questions for every line, card and section

Read as someone who has never heard of the product.

1. **Understood** (`copy-understood`). Can they follow it on one read? It fails on:
   - words they have not met: the product's internal names, command or feature names, plan units (credits, events, runs, seats) used before the page says what they are;
   - a term the page coined and then has to define. A term that needs a definition box is a term the page should not use: say the plain thing instead;
   - a claim with nothing attached ("You approve. We verify every result." Approve what? Which result?);
   - a promise or offer named before the page has made it ("The 90-day named promise" in a plan's list).
2. **Value** (`copy-value`). Can they say what they get from it? It fails on how the product works inside (setup steps, internal checks, scoring methods, status labels), a section title that sells a method, and a line so wrapped in caveats that the outcome is lost.
3. **Filler** (`copy-filler`). Could it sit on any product's site? Generic adjectives ("powerful", "seamless", "next-generation"), setups ("Here's the thing:"), groups of three that add nothing, a line that repeats the one above it, whoever wrote it.
4. **Cut test** (`copy-cut`). Take it out. Does the page lose anything? If not, cut it. This applies to a label, a caption, a card and a whole section. It also catches:
   - the same point made twice, in two sections or two cards;
   - one kind of thing split up: two cards that differ only by a channel's name, or a section that is really one more item of a list above it;
   - a caption or label that says what is already shown;
   - anything meant for the team: section numbers ("02", "3b"), internal ids, code names.
5. **Length** (`copy-length`). Is it as short as it can be and still keep its value? Watch for a line under the headline over about 30 words, cards with more than 3 bullets, grids that stack into one long column on a phone, pricing small print listing every overage and unit, and a page over about 10 phone screens or 900 words.

Then the page as a whole (`copy-missing`): does it say who it is for, what they get and how it differs from what they do today, and does it show the product (on the first or second phone screen), a price within reach and honest proof? Is every item on the founder's list said somewhere, early (not below about screen 3), as one thing rather than split across cards?

## Examples from shipfound.co (October 2026)

Each of these was on the live page after a rewrite and was found by the founder, not the check. Catch their kind.

| On the page | Check | Why it fails | Verdict |
|---|---|---|---|
| "Example brief", a caption under a terminal whose header already says EXAMPLE | copy-cut | Says what is already shown | Cut |
| A "Reddit and X" section after the six-block grid of what the product does, with "Reddit replies." and "X replies." as two cards | copy-cut | One offering split off from the list it belongs to, and two cards that differ only by the channel's name. It also looks out of place next to the grid | One block in the grid: replies where buyers ask, and posts in your voice |
| "Credit packs: $15 per 100, never expire. Events over the plan: $10 per 500k." under the price table | copy-understood, copy-length | Plan units the visitor has not met, and overage detail no first-time visitor asked about | Cut from the home page; the pricing page's FAQ can carry it |
| "WITH THE PROMISE", "The 90-day named promise", and a "Definition" box for "Named" | copy-understood | A coined term the page then has to define, and a promise named before the page has made it | Say the plain thing once, or cut |
| "First, it checks your access." | copy-value | How it works inside | Cut, or move to the FAQ |
| "One AI check lies. We ask four times." as a section | copy-value | Sells a method | Cut the section; its point can answer a FAQ question |
| "Small tests of which message makes strangers click, on a budget you set." | copy-value | The outcome is lost in caveats | "Test your messages, keep the one that converts." |

## Recording what you found

Call `funnel_check` with `record`: one entry per copy check, `verdict` pass or fail.

- A failing `copy-understood`, `copy-value`, `copy-filler` or `copy-cut` passes `quotes`: each line word for word as the live page shows it, at least six characters. The server checks every quote against the live page and refuses the record if one is not there: quote what a visitor sees, not the source and not a change that is not deployed.
- `evidence` says why the lines fail, in a sentence. `fix` gives, for each line, cut or the new text.
- `copy-length` gives the numbers as evidence (quotes optional); `copy-missing` says what the page never says (no quotes).
- Pass `measure` with `when: "before"` and the script's numbers in the same call.

## Writing the new text

- Show the founder a table: the line, its verdict (cut, shorten or rewrite), why, and the new text.
- Cut before you rewrite. A shorter page is usually the fix.
- New text is built from the founder's own words: their list, their site, their README and notes. For the lines that matter most (the headline, the line under it, section titles) give two or three options; they pick or write their own. A line they write is used as theirs, and said to be theirs.
- Never invent a number, a customer, a quote, a result or a feature. Check every claim against the code or docs; a feature that is partly built or planned comes off the top of the page.
- Outcome first, short and confident. Marketing language is fine when it is true. Safeguards go in one place (a "what it never does" line or the FAQ), not on every line.

## Shipping it

- Make the changes in the site's own components. Delete a component the page no longer uses. Fix header and footer links that pointed at a removed or renamed section. Content that moves rather than goes (what happens after signup, how results are measured) goes to the FAQ.
- Before the PR, record each copy check again with only the lines being changed: lines the founder keeps come out, and a check with none left is a pass. Verify looks for every recorded line on the live page after the merge, and a fix whose lines are still there stays Claimed.
- Measure the preview with the same script and record it with `when: "after"`. Put both in the PR body: phone screens, words, sideways overflow, before and after.

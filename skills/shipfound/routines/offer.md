# Routine: offer

A founding offer: the thing a founder at zero can ask money for now. A price for the first customers, capped, kept for as long as they stay, with a money-back promise. The founder sets every number. You ship the page as a pull request and fill the discount in their payment provider's dashboard for them to save. Once it is live, a boost on X leads with it.

Follow [../references/pr-conventions.md](../references/pr-conventions.md) and [../references/verification.md](../references/verification.md).

Input: none, or the kind the founder wants (`founding_price`, `lifetime_deal`, `pre_order`).

## Procedure

1. Call `workspace` and `access`. Run the framework gate (SKILL.md); stop for unsupported stacks.
2. Call `offer_plan` (free). If `fits.fits` is false (an App Store app, an agency, a shop, a media site), say `fits.why` plainly and stop: offer the next move instead, unless the founder still wants one. If `offer` is there, one is already recorded: say what it is and where, and stop unless the founder asks to change it. Never make a second.
3. Read the repo first: the pricing page, the plans and prices in code or config, and the payment code (Stripe, Dodo, Paddle, Lemon Squeezy, Polar): how checkout is started and whether it takes a discount or promotion code. A product with no paid plan yet: the offer is the first price, so say so.
4. **Propose one offer**, from `suggestions`, with numbers for the founder to set: the kind (a founding price for most subscriptions; a lifetime deal only when one customer costs little to serve each month, never for a product that pays AI or API costs per use; a pre-order for what is not built yet), the price or discount, how many customers, how long it is kept, the money-back days, and an end date only if they want a real one. Ask with a question (Claude Code: AskUserQuestion), your pick first with "(Recommended)". Every rule in `rules` holds. Before they choose "kept for as long as they stay" or "for life", say plainly that it is a promise they must keep.
5. **The discount in the provider**, the founder's to save: open the provider's dashboard in their browser (Stripe: Product catalog, Coupons, then a promotion code), fill the discount, its usage limit (the cap) and any end date, and stop before Save; they press it. Never use API keys or change prices yourself. If the provider cannot cap a discount, say so: the cap then lives in code, as a check on the count of founding customers, and the page says the real number.
6. **The page**, in the site's own components:
   - Where: on the pricing page, plus one line under the home page's main button that links to it. A pre-order gets its own page.
   - What it says: the offer word for word as the founder set it (the price, how many customers, how long it is kept, the money-back days with how to ask, any end date), and what happens at checkout.
   - Checkout: the code applied in the checkout link the site already uses (Stripe Checkout `discounts` or `allow_promotion_codes`, or the provider's own way), so the buyer does not have to type it.
   - A seats-left count only if it reads the real count from the provider on the server, cached for a few minutes. Otherwise no count. No countdown timer unless the end date is real and the same for everyone.
   - The terms page (or the pricing FAQ) gets the offer's terms in a few lines.
7. Build, try the checkout path on a test or preview environment if there is one (never a real payment), branch `shipfound/offer-founding`, one PR. `record_action` with `module` FIXES, `kind` PR, `title` "Founding offer: <the offer in a few words>", `url` the PR, `liveUrl` the page it is on, `meta: { type: "founding_offer", offerKind, offerPrice, offerCap, offerKeptFor, offerMoneyBackDays, offerEndsAt }` with the founder's numbers (meta is flat: strings, numbers, booleans; leave out a term they did not set).
8. Summarise: the offer as set, where it lives, what the founder saved in the provider, the PR (claimed, not verified). Then the hand-over (SKILL.md): offer the next move. A boost on X now leads with the offer, and the launch posts can mention it.

Never invent scarcity, urgency, a deadline or a discount the founder did not set, and never charge, refund or change a customer's plan.

# Routine: landing

The home page, read the way a first-time visitor reads it: in a few seconds, from the top. Does it say who it is for, what they get, why it is different, and what to do next, with a price and the product itself within reach? The misses ship as one pull request, with copy built from the founder's own words. At a few hundred visitors an A/B test cannot answer, so the page has to be clear on the first read.

Follow [../references/pr-conventions.md](../references/pr-conventions.md) and [../references/verification.md](../references/verification.md).

Input: an optional page on the site (default the home page).

## Procedure

1. Call `workspace` and `access`. Run the framework gate (SKILL.md); stop for unsupported stacks.
2. Call `landing_check` (3 credits; say so as you call it) with the page, if one was named. The server reads the live page itself; never describe the page from the repo instead. If it returns `shell`, the server got an empty app shell: say that a first-time visitor's first second, Google and ChatGPT all see an empty page, and offer the fix routine first. Stop.
3. Show the misses in plain words, one line each: what a stranger would not get, the page's own words next to it (`evidence`), and the fix. Ask which to ship, recommending all of them. An "unsure" one (usually whether the product is shown) is the founder's call: ask them to look. Ids the founder declines (or an unsure one they say is fine): call `landing_check` with `skip` set to those ids (free, and it does not read the page again), so they are never offered again.
4. **Copy is the founder's.** For every change of words, show the options the fix gives and the current text, and let them pick or rewrite. Never invent a number, a customer, a logo, a quote, a testimonial or a feature. When a fix needs a fact they have not given (how many users), ask for the real one or leave it out.
5. Make the changes in the site's own components and styles. What each check usually means in code:
   - who, outcome, different, specific: the H1 and the line under it. Keep the H1 one sentence; put who it is for in the headline or the line under it.
   - cta: one primary button above the fold whose words say what happens next; other actions become secondary links.
   - show: a real screenshot, a short product video (the video routine makes one from the product's own screens) or something to try, beside or under the headline.
   - price: a link to pricing in the hero or the nav, or the starting price under the button.
   - proof: something true the founder has: the product working, a real count they confirm, a public changelog. Nothing if there is nothing yet.
   Keep the page's title and meta description in step with a changed headline only if the founder agrees; the fix routine owns those.
6. Build the site, look at the top of the page at phone and desktop width (a screenshot in the browser, if there is one), and fix what does not fit.
7. Branch `shipfound/landing-<page>`, one PR, the body listing each miss with its evidence and what changed. `record_action` with `module` FIXES, `kind` PR, `title` "Landing page: <the misses fixed, in a few words>", `url` the PR, `liveUrl` the page, `meta: { type: "landing", fixIds: [the ids shipped, exactly as landing_check gave them] }`. A shipped miss stays hidden until the page is read again after the change; if it is still missing then, it comes back.
8. Tell the founder how it will be judged: at their traffic, as a before and after on the page's visitor-to-signup rate once it is live, read with `analytics` (the `shipped_work` report). Not as an A/B test unless the test routine says the traffic can answer one.
9. Summarise: what changed, the PR (claimed, not verified), credits spent. Then the hand-over (SKILL.md): offer the next move.

One page per run. A re-run on the same page content returns the same read from the cache, so it never buys a different opinion; it is worth running again only after the page has changed.

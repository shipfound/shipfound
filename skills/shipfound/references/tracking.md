# Tracking

Two pieces, installed together as one of the first PRs of the fix routine:

- **tracking.js** for people: one script tag, under 3 KB, cookieless by default.
- **The crawler beacon** for AI bots: a few lines of server or edge code that post each hit from GPTBot, PerplexityBot, ClaudeBot and the rest of the list to the tracker. Without it, the founder never sees AI engines reading their pages.

Tracking and analytics never cost credits. If the founder already runs GA4, Plausible or PostHog, keep it; Shipfound runs alongside.

## 1. tracking_install

Call `tracking_install` with `{ domain, framework, identityMode? }`. `framework` is the one from the audit (nextjs, astro, nuxt, sveltekit, hugo, html). Leave `identityMode` out for cookieless; pass "attribution" only when the founder asked for it (see Identity modes).

It returns the site key (`sf_...`, public), the site secret (`sfs_...`, **shown only the first time**), the script tag, the crawler snippet for the stack, and creates the default goals.

The secret:

- Never commit it. Never put it in a file that is not gitignored. Never paste it into a PR, an issue or a log.
- Tell the founder to store it now (password manager), and give the exact place to set it: Vercel Project Settings, Environment Variables, `SHIPFOUND_SECRET`, marked sensitive; Netlify Site configuration, Environment variables; `wrangler secret put SHIPFOUND_SECRET` for Cloudflare; the server's env file for nginx or Caddy.
- For local testing, put it in `.env.local` (Next.js) or `.env` only after checking that file is in `.gitignore`.
- If it was lost, do not guess: tell the founder, and point them to the results app's tracking settings.

## 2. The script tag

```html
<script defer src="https://t.shipfound.co/t.js" data-site="sf_..."></script>
```

| Stack | Where |
|---|---|
| Next.js app router | `app/layout.tsx` inside `<head>`: `<script {...shipfoundScriptProps()} />` from `@shipfound/next`, or the plain tag |
| Next.js pages router | `pages/_document.tsx` inside `<Head>` |
| Astro | The base layout's `<head>` |
| Nuxt | `nuxt.config`: `app.head.script: [{ src: "https://t.shipfound.co/t.js", defer: true, "data-site": "sf_..." }]` |
| SvelteKit | `src/app.html` inside `<head>` |
| Hugo | The head partial (overridden in `layouts/`, not inside `themes/`) |
| Plain HTML | Every page's `<head>` |

The site key is public; it is fine in the repo.

## 3. The crawler beacon

Use the snippet `tracking_install` returned. If it returned none for this stack, use the matching file from the plugin's [snippets/](../../../snippets/) folder (same wire format; if the skill was copied on its own, fetch it from https://github.com/shipfound/shipfound/tree/main/snippets). Every beacon posts fire-and-forget to `POST ${TRACKER}/t/crawler` with the header `x-shipfound-secret` and the body `{ k, ua, path, status?, ms?, ip? }`, gives up after 800 ms, and never breaks the page.

| Stack | Beacon |
|---|---|
| Next.js | `npm install @shipfound/next`, then `middleware.ts`: `export default withShipfound()` (wrap the existing middleware if there is one: `withShipfound(existing)`). Env: `SHIPFOUND_SITE_KEY`, `SHIPFOUND_SECRET` |
| Astro with a server or edge adapter | `snippets/astro-middleware.ts` as `src/middleware.ts` (merge with `sequence` if one exists) |
| Nuxt (server rendered) | `snippets/nuxt-server-middleware.ts` as `server/middleware/shipfound.ts` |
| SvelteKit (server rendered) | `snippets/sveltekit-hooks.server.ts` as `src/hooks.server.ts` (combine with `sequence` if a `handle` exists) |
| Static build on Vercel (Astro static, Hugo, HTML, SvelteKit static) | `snippets/vercel-edge-middleware.ts` as `middleware.ts` at the root |
| Static build on Netlify | `snippets/netlify-edge-function.ts` as `netlify/edge-functions/shipfound.ts` |
| Anything behind Cloudflare | `snippets/cloudflare-worker.js` as a Worker on the site's route |
| Own server with nginx or Caddy | `snippets/log-shipper.mjs`, run beside the server; set the log format it documents |
| GitHub Pages or a host with no edge code | No beacon possible. Install the script only, and say crawler data needs Cloudflare in front or a host with edge functions |

Adding `@shipfound/next` is the one dependency this flow adds without a separate ask, because installing it is what the founder asked for when they ran the fix routine. Say so in the PR body.

## 4. The first-party proxy (optional)

Some ad blockers drop third-party analytics. A `/sf/*` rewrite on the founder's own domain fixes that. Offer it; do not force it. With the proxy, the script `src` becomes `/sf/t.js`.

| Stack or host | Rewrite |
|---|---|
| Next.js | `withShipfound(existing, { proxy: true })`, and `shipfoundScriptProps({ proxyPath: "/sf" })` |
| Vercel (any stack) | `vercel.json`: `{ "rewrites": [{ "source": "/sf/:path*", "destination": "https://t.shipfound.co/:path*" }] }` |
| Netlify | `_redirects`: `/sf/*  https://t.shipfound.co/:splat  200` |
| Nuxt | `routeRules: { "/sf/**": { proxy: "https://t.shipfound.co/**" } }` |
| Cloudflare Worker | Built into `snippets/cloudflare-worker.js` |
| nginx | `location /sf/ { proxy_pass https://t.shipfound.co/; proxy_ssl_server_name on; proxy_set_header Host t.shipfound.co; proxy_set_header X-Forwarded-For $remote_addr; }` |
| Caddy | `handle_path /sf/* { reverse_proxy https://t.shipfound.co { header_up Host t.shipfound.co } }` |

The proxy must pass the visitor's IP in `X-Forwarded-For`; cookieless mode derives the daily visitor id from it (and then drops it).

## 5. Identity modes and consent

| Mode | Stores in the browser | Gives | Needs |
|---|---|---|---|
| Cookieless (default) | Nothing | Same-day sessions, channels, landing pages, same-session conversions | Nothing |
| Attribution | A first-party id for 13 months | Multi-day journeys, first-touch attribution, cohorts, A/B tests, identify | A consent signal where the law requires one |

- Stay cookieless unless the founder asks for journeys, multi-day attribution, cohorts or A/B tests. Then explain the trade-off in two lines and switch with `data-mode="attribution"` on the tag.
- Attribution mode reads the site's consent manager (TCF or Google Consent Mode). With a hand-made banner, call `sf('consent', true)` when the visitor accepts.
- Never say "no cookie banner needed": whether one is needed depends on where the founder and their visitors are. Say that plainly if asked.
- Never add a consent banner the founder did not ask for.

## 6. Goals and events

`tracking_install` creates the default goals. Check them with `goals_list`.

Goals are **hard** or **soft**:

- Every goal you create is soft. Only the founder makes one hard, in the results app (Analytics, Conversions, "Convert to Hard Conversion"). Never say a goal is hard until `goals` lists it as `HARD`.
- The headline conversions count hard goals once there is one; until then they count the soft ones and say so.
- Changing a hard goal's type or match puts it back to soft. Do not redefine a hard goal without the founder.
- Say why you added a goal in `note`, with the evidence.

Payments need no code. When goals are listed, Shipfound proposes a soft `payment` goal from the site's own data: a payment-like event the site already sends, or a `CHECKOUT` goal (a visit back from a hosted checkout such as Stripe, Dodo, Paddle, Lemon Squeezy or Polar, which also counts past payments). Point the founder at it to convert it to hard. Do not add payment events to the site for this.

### Signup and payment, read from the code

The defaults are guesses: `signup` waits for an `sf('signup')` most sites never send, and `payment` counts a return from any checkout to any page. Once tracking is live, read the repo and redefine both, and add `signin`, with `goals_save` `{ name: "signup" | "payment" | "signin", ... }` (same name: redefined). Add nothing to the site.

- **Signup.** Find where an account is created: the signup page, its form, the API call, and where the browser goes after it succeeds. Pick the first that holds:
  1. The site already calls `sf(...)` on success: `EVENT` with that name.
  2. Only new accounts reach a page (`/welcome`, `/onboarding`, `/verify-email`, `/check-your-email`): `PAGEVIEW` on it. Not a page that logins also reach, such as `/app` or `/dashboard`.
  3. Otherwise the form sent on the signup page, which t.js reports as `form_submit` with that page's path: `EVENT` `form_submit@/register` (the real path from the code, with `*` for locale prefixes). It also counts rejected submits, so say that in the note.
  Signup only through OAuth buttons (Google, GitHub) has no page or form of its own: say so and leave the goal as it is.
- **Sign-in.** If the site has a login, add a soft `signin` goal the same way, from the login code: an `sf(...)` call on success, else the login form sent on its page (`form_submit@/login`, the real path). It counts the sessions that signed in, so returning users show next to new ones. A rejected password counts too; say that in the note. Never make it the headline: it is not a conversion. Login only through OAuth buttons: say so and add nothing.
- **Payment.** Find the checkout call (Stripe `success_url`, Dodo `return_url`, Paddle `successUrl`, Lemon Squeezy `redirect_url`, Polar `success_url`) and the path the buyer comes back to. `CHECKOUT` with that path (`/billing*`); the query string is not stored, so match the path only. A success page only buyers reach (`/thank-you`, `/checkout/success`) is surer: `PAGEVIEW` on it. A plan change that bills in place, with no checkout page, is not seen from outside: say so.
- Put the evidence in `note`: the file and line, and what happens there.
- `payment` may already be hard. Redefining it puts it back to soft, so show the founder the new definition and ask first.

Prefer goals that read data the site already sends (a `PAGEVIEW` on a path, `CHECKOUT`) over new code. Ask the founder for the one event that means a user got value (for example `first_project_created`) and create it with `goals_save` `{ ... }` only if nothing already sent shows it.

The founder's own visits are excluded by the server while they are signed in to the results app; never add code to the site to filter them.

In the code, only where the founder agrees:

- Signup: `sf('signup')` after a successful signup.
- CTAs: `data-sf="pricing-cta"` on the button.
- Identify (Attribution mode only): `sf.identify(userId, { plan })` after login; tracking.js hashes the id before sending.

Put goal wiring in the same tracking PR when it is small, else a second PR titled "Tracking: goals".

## 7. PR, deploy, check

- One PR: "Tracking: Shipfound script and AI crawler beacon". `record_action` with `module` TRACKING, `kind` PR.
- After the founder merges and the site deploys, call `tracking_check`. Then send one test crawler request:

  ```bash
  curl -s -o /dev/null -A "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)" https://<domain>/
  ```

  and open the site once in the browser so a real pageview arrives. Call `tracking_check` again.
- Tracking is green on the Access Card only after a real event, a crawler hit and the first goal arrive. Report exactly what `tracking_check` says is missing.

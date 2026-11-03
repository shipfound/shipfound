# Routine: users

Who signed up, what they did after, and where they came from. The website cannot see past the signup (the tracker is cookieless, and few visitors consent to more), so the product's own server says it: a few lines that post to the tracker when a person signs up, signs in, does the main things the product is for, and pays. The founder then sees every user, how many activated, who comes back, and which channel brought the ones who stayed, in the results app's Analytics, Users tab. Free.

Input, optional: `read` (step 6 only).

## Procedure

1. Call `workspace` with `repo`. Tracking must be installed first (the site key and the site secret come from `tracking_install`, references/tracking.md); if it is not, say so, run the fix routine's tracking step, and come back.
2. Find in the code, and write down with file:line:
   - where an account is created (signup), for every way in: email, Google, GitHub, an invite;
   - where a person signs in, or their session is restored;
   - the one to five actions the product is for, named as the product names them (project_created, report_sent, invoice_paid): the things a person does when they get what they came for, not page views or settings;
   - where a payment is confirmed (the payment provider's webhook), with the amount;
   - the product's own user id at each place, and the email when it is there.
3. Add one small helper in the product's server, in its language and framework, the way references/tracking.md adds the crawler beacon: it posts fire-and-forget to `POST ${TRACKER}/t/u` with the header `x-shipfound-secret: <SHIPFOUND_SECRET>` and the JSON body `{ k: <site key>, events: [{ user, event, ts?, email?, name?, ip?, ua?, value?, props? }] }`, up to 100 events a call; it gives up after 800 ms, never throws, and never blocks the request. The secret comes from the server's environment, never the code or the browser.
   - `user`: the product's own id for the person (never the email as the id).
   - `event`: `signup`, `signin`, `paid`, or the action's own name.
   - `ip` and `ua`: the person's IP and user agent on that request (behind a proxy or CDN, the client IP the platform forwards, as the request sees it), on signup above all: they let Shipfound find the visit the person came from without a cookie. Neither is stored.
   - `email` and `name` when the code has them: they show in the founder's Users page only.
   - `value`: cents, on `paid`, and on any action that costs the person money (a product paid by use: what that action cost them).
   - `props`: a few small facts about the action (a plan, a count), never personal data or secrets.
4. Call the helper at each place from step 2, after the action succeeded (a signup that failed is not a signup). One PR, `shipfound/user-events`, with a table: event, where (file:line), when it fires. `record_action` with `module` TRACKING, `kind` PR, `title` "User events: signup, sign-in, <actions>, payment".
5. Call `users_activation` with the rule that means a new person got what they came for: `event` (the action from step 2 that is the product's value, as a rule its first), `minCount` (more than 1 only when once is not real use, like a notes app's third page), `minValueCents` (above 0 for a product paid by use: the action that costs money, with its cost as the value, so activated means they spent something) and `withinDays` (7 unless the product is used less often). Say it in one line: "A new user counts as activated when they create a project within 7 days." The founder can change it in Analytics, Users.
6. Once the PR is live and someone has signed up, call `analytics` with `report: "users"`, and say it in a few lines with numbers: signups in the period, how many activated, who is active this week, who pays, and the channel the activated ones came from. For one person, `report: "user"` with `user`.

Never send passwords, tokens, card numbers or anything a person typed into the product; never post from the browser; never batch-send old users the founder has not asked to backfill.

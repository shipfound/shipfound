# Mail setup: a company address that can send

Outreach drafts go from an address on the product's own domain, in a mailbox that can send, with SPF, DKIM and DMARC in place. Mail from a domain without them lands in spam or is refused. `mail_setup` reads all of it from DNS, from outside, and says what is missing. This is how to fix each part with the founder.

The founder creates the account, signs in, accepts terms and pays. You open the pages, read them, fill the business details and the DNS records, and say which button to press. Never type a password, a card number or a verification code, and never press a button that creates an account, accepts terms or pays (SKILL.md, hard lines 1 and 2, and "Working in the browser").

## 0. Where it stands

Call `mail_setup`, with `address` when the founder names the address outreach should go from. Follow its `next`:

- A personal mailbox (gmail.com and the like): ask which address on the product's domain outreach should go from, and set it.
- Nothing receives mail on the domain, or only a forwarding service does (ImprovMX, Cloudflare Email Routing, Forward Email): it needs a mailbox. Offer Google Workspace (section 1). If a forwarding service is there, section 2 comes before any MX change.
- A mailbox elsewhere (Microsoft 365, Zoho, Fastmail): no new mailbox. Only the missing records (section 3), and drafts are made in that host's web mail.
- Records missing: section 3.
- `ready`: go back to the routine that sent you here.

## 1. Google Workspace

Say what it costs before anything else: read the current price for Business Starter on workspace.google.com and say it with the trial Google offers. Wait for a yes.

1. Open https://workspace.google.com in the browser and have the founder press "Get started".
2. Fill what it asks about the business: the product's name, "Just you" (or the team's size), the country. Ask before you fill the founder's own name and current email; they are the founder's personal details.
3. Domain: "Yes, I have one I can use", then the product's domain.
4. The username is the part before the @ of the address `mail_setup` holds. The founder chooses and types the password, and does any phone or robot check.
5. The plan and the card are the founder's. Stop and say so.
6. Verifying the domain: Google offers to sign in to the DNS host and add its records itself. With Cloudflare, GoDaddy or Namecheap that is the quickest: the founder signs in there and approves. Otherwise Google shows a TXT record: add it as in section 3, then the founder presses Verify.
7. When Google asks to "Activate Gmail" (the MX records), do section 2 first if a forwarding service holds MX today.

## 2. Keep the addresses that forward today

When MX points at a forwarding service, every address it forwards stops the moment MX moves to Google. Before that:

1. Open the forwarding service's dashboard (ImprovMX: https://app.improvmx.com) and list each alias and where it goes: hello@, support@, a catch-all. Read only.
2. Show the founder the list. For each one, in the Google Admin console (https://admin.google.com): an alternate email on the new user (Directory, Users, the user, "Add alternate emails"), or a group that forwards to where it went before. Fill the form; the founder saves.
3. Mail that other services send for the domain (a newsletter tool, transactional mail through Brevo, Resend or Postmark) does not use MX. It stays, as long as the SPF record keeps its include (section 3).

## 3. DNS records

The NS records say where DNS lives (Cloudflare, GoDaddy, Namecheap, Vercel, Route 53). Open its DNS page for the domain. For each record below, fill the form and tell the founder to press Save. Removing a record is the founder's step too: say which one.

- **MX**: Google's single record, `smtp.google.com` at priority 1. The forwarding service's MX records come out once section 2 is done.
- **SPF**: one TXT record at the root that starts `v=spf1`. Edit the one there to the value in `check.spf.fix`. Never add a second: two SPF records make both fail.
- **DKIM**: in the Google Admin console, Apps, Google Workspace, Gmail, "Authenticate email": the founder presses "Generate new record" (2048-bit, selector `google`). Add the value as TXT at `google._domainkey`, then the founder presses "Start authentication" once DNS shows it (minutes, sometimes hours).
- **DMARC**: keep the one there. With none, add `check.dmarc.fix` (it starts at `p=none`, which only reports).

On Cloudflare: DNS, Records, "Add record"; pick the type, the name (`@` for the root) and the content. Proxy status does not apply to MX and TXT.

Then call `mail_setup` again. DNS can take up to an hour; say so, and check again later rather than in a loop.

## 4. The mailbox in the browser

Drafts are made in the sending address's own web mail, so the founder signs in to it in the browser you use: Gmail's avatar, "Add another account". Check it: open `https://mail.google.com/mail/?authuser=<address>` and read the page title, which names the account Gmail opened. It must be the sending address. When it names another account, that address is not signed in here yet.

## 5. Sending well

At most 20 a day, one to one, each written for its reader (hard line 6), from the domain the founder owns: that is how a person writes email, and the main domain is fine for it. No warm-up tools (hard line 3). Replies come to the same mailbox.

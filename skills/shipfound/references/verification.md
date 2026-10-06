# Verification

Hard line 8: nothing is done until the server has checked it. You report with `record_action`; the server checks with `verify`. The results app shows Verified and Claimed apart, and so do you.

## record_action

```json
{
  "module": "FIXES",
  "kind": "PR",
  "title": "Structured data: Organization and SoftwareApplication",
  "url": "https://github.com/acme/site/pull/14",
  "liveUrl": "https://acme.com/",
  "meta": { "theme": "structured-data", "fixIds": ["fx_12", "fx_13"], "files": ["app/layout.tsx"] }
}
```

- `module`: FIXES, CONTENT, INDEX, LISTINGS, COMMUNITIES, INBOX, TRACKING, EXPERIMENTS.
- `kind`: PR, PAGE, LISTING, INDEX_REQUEST, POST, DRAFT.
- `title`: 3 to 200 characters, plain: what changed, not how hard it was.
- `url`: https only. The thing itself: the PR, the listing, the post.
- `liveUrl`: optional. For a PR, the page it changes or creates. For a listing, the founder's own URL the listing should link to.
- `meta`: small context: theme, files, directory slug, subreddit. Strings up to 500 characters, numbers, booleans, null, or arrays of up to 50 strings.

Record right after the thing exists (the PR is open, the request was sent), once. Keep the returned action id and show it in the summary.

## verify

`verify` `{ actionId }` costs 1 credit. Call it when there is something to see, not in a loop:

| kind | When to call verify | What the server checks |
|---|---|---|
| PR | After the founder says it is merged and deployed | PR state on GitHub (open, merged, closed), then the live page at `liveUrl` (status, the change present) |
| PAGE | After deploy | The live URL returns 200 and carries the product's name or domain |
| INDEX_REQUEST | A day or more after the request | Index state for the URL, where the APIs allow |
| LISTING | After the founder submits and the listing is live | The listing page is live, links to `liveUrl`, and the link's rel attribute |
| POST | After the founder posts | The post is live; it is checked again at 7 days for removal |
| DRAFT | Not verified by the server; the founder sends it | n/a |

States: CLAIMED (recorded, not yet seen), VERIFIED (the server saw it), FAILED (the server looked and did not find it; the note says why).

## Saying it right

- VERIFIED: "Verified: llms.txt is live at acme.com/llms.txt."
- CLAIMED: "PR #14 opened. Claimed, not verified yet: run /shipfound:status after you merge and deploy." In Codex, say "ask for Shipfound status" instead of the command.
- FAILED: quote the server's note, then the one next step. Never re-record the same action to get a different answer.

Never write "done", "shipped" or "live" for something that is not VERIFIED. Use `shipped` (`{ module?, state? }`) to list what is still claimed.

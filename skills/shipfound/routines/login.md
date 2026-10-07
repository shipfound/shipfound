# Routine: login

Sign this session in to Shipfound from the chat: a link and a code the founder approves in their browser. Nothing to restart. Every other routine runs this one in place when a Shipfound tool says it is not signed in, then carries on where it was.

Input: none needed.

## Procedure

1. Call `sign_in`, with `client` "claude-code" in Claude Code or "codex" in Codex.
   - **SIGNED_IN**: go to step 4.
   - **OPEN_LINK**: go to step 2.
   - An error saying the connection has no session: this connection cannot sign in from the chat. Give the founder the API key steps for their host (SKILL.md, "Hosts") and stop.
   - No `sign_in` tool, and the Shipfound tools fail with an auth error: the host signs in its own way. Give the founder the sign-in step for their host (SKILL.md, "Hosts") and stop.
2. Open the `url` in the founder's default browser from the shell, quoted because of the `?`: `open "<url>"` on macOS, `xdg-open "<url>"` on Linux. Print it as well, in case it did not open:

   > Approve Shipfound in your browser: <url>
   > Check it shows **<code>**, pick your site and choose Allow.

   The founder approves their own access. Never press Allow for them, and never open the link with browser tools that can click.
3. Call `sign_in` again. Each call waits up to 40 seconds for the founder's answer.
   - **SIGNED_IN**: go to step 4.
   - **WAITING**: call it again. Keep going for up to 10 minutes in all, which is how long the code lives. Say nothing between calls unless the founder asks.
   - **OPEN_LINK** (the code expired): go back to step 2 once. If that one expires too, stop and say to run the login routine again when they are ready.
   - An error saying the founder chose Deny: say nothing was signed in, and stop.
4. Call `workspace` and say, in one line, which site this session works on, the plan and credits, and whether there is an audit yet. If you were running another routine, carry on with it now from where you stopped; do not ask the founder to start it again. If you were not in another routine, do the hand-over (SKILL.md): offer the next move.

If the founder has no Shipfound account yet, the approval page asks them to register first and lets them add their site there. There is nothing to do here for that.

The sign-in lasts for this session. A new session signs in again the same way, with one click if the founder is still signed in on the web. To sign every session out, they revoke the "signed in from chat" key in the results app (Settings, MCP connection).

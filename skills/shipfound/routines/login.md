# Routine: login

Sign the founder in to Shipfound. They do it once per machine: the host keeps the sign-in and renews it by itself, so a new session starts signed in. Every other routine runs this one in place when the Shipfound tools are missing or say they are not signed in, then carries on where it was.

Input: none needed.

## Procedure

1. Call `workspace`.
   - It answers with a site: the founder is signed in. Go to step 4.
   - It says you are not signed in and a `sign_in` tool is there: this is an older plugin that signs in from the chat. Go to step 3.
   - There is no `workspace` tool, or it fails with an auth error: go to step 2.
2. Start the host's sign-in yourself when the host lets you. In Claude Code, a server that is not signed in has an `authenticate` tool in place of its real tools (SKILL.md, "Hosts"); load it first if it is only listed by name.
   - Call it. It opens the sign-in page in the founder's browser and returns its link. Print the link as well, and tell the founder in one line: pick the site and choose Allow; they only do this once on this machine. Never press Allow for them.
   - When the founder says it is done, the Shipfound tools are there: call `workspace` and go to step 4. If the browser showed a connection error after Allow, ask for the full address from the address bar and pass it to `complete_authentication` as `callback_url`, then call `workspace`.
   - It fails, or says to sign in from `/mcp`: fall through to the steps below.

   With no such tool, only the founder can start the sign-in. Tell them, in one short block, for their host:
   - **Claude Code**: run `/mcp`, pick **plugin:shipfound:shipfound**, choose **Authenticate**, then in the browser pick the site and choose Allow. Say they only do this once on this machine. When they say it is done, call `workspace` again and go to step 4.
   - **Codex**: run `codex mcp login shipfound` in a terminal, approve in the browser, then start a new thread.
   - If they would rather use an API key (CI, a machine without a browser): the plugin README, "Sign in with an API key instead".

   Then stop and wait for the founder. If `workspace` still fails after they say it is done, ask them to check `/mcp` shows the server as connected, and stop.
3. Older plugin, signing in from the chat. Suggest updating the plugin once (in Claude Code: `/plugin`, update Shipfound, new session; then sign-in lasts across sessions), and carry on with this one:
   - Call `sign_in` with `client` "claude-code" in Claude Code or "codex" in Codex. **SIGNED_IN**: go to step 4. **OPEN_LINK**: open the `url` in the founder's default browser from the shell, quoted because of the `?` (`open "<url>"` on macOS, `xdg-open "<url>"` on Linux), print it as well, and ask them to check it shows the `code`, pick their site and choose Allow. Never press Allow for them, and never open the link with browser tools that can click.
   - Call `sign_in` again; each call waits up to 40 seconds. **WAITING**: call it again, for up to 10 minutes in all, saying nothing between calls. **OPEN_LINK** again (the code expired): give the new link once; if that one expires too, stop and say to run the login routine again when they are ready. The founder chose Deny: say nothing was signed in, and stop.
4. Say, in one line, which site the founder works on, the plan and credits, and whether there is an audit yet (from `workspace`). If you were running another routine, carry on with it now from where you stopped; do not ask the founder to start it again. If you were not in another routine, do the hand-over (SKILL.md): offer the next move.

If the founder has no Shipfound account yet, the approval page asks them to register first and lets them add their site there. There is nothing to do here for that.

To sign out, they revoke the connector's key in the results app (Settings, MCP connection), or choose **Clear authentication** for the server in `/mcp`.

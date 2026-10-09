# Routine: login

Sign the founder in to Shipfound. They do it once per machine: one Allow on shipfound.co signs in this session and this machine, and every later session starts signed in. Every other routine runs this one in place when the Shipfound tools are missing or say they are not signed in, then carries on where it was.

Input: none needed.

## Procedure

1. Call `workspace`.
   - It answers with a site: the founder is signed in. Go to step 4.
   - It says you are not signed in, and a `sign_in` tool is there: go to step 2.
   - There is no `workspace` tool, or it fails with an auth error: go to step 3.
2. **Sign in this machine.** The browser stays on shipfound.co the whole way.
   - Run `sh <plugin root>/scripts/device.sh init` (the plugin root is two folders above this file's `skills/`, the same root the command named). It makes this machine's secret if there is none, keeps it in the macOS Keychain (or a file only this user can read), and prints only its hash. Never print, read or pass the secret itself.
   - Call `sign_in` with `client` "claude-code" in Claude Code or "codex" in Codex, and `device` set to that hash. **SIGNED_IN**: go to step 4. **OPEN_LINK**: open the `url` in the founder's default browser from the shell, quoted because of the `?` (`open "<url>"` on macOS, `xdg-open "<url>"` on Linux), print it as well, and tell them in one line: check it shows the code, pick the site and choose Allow; they only do this once on this machine. Never press Allow for them, and never open the link with browser tools that can click.
   - Call `sign_in` again; each call waits up to 40 seconds. **WAITING**: call it again, for up to 10 minutes in all, saying nothing between calls. **OPEN_LINK** again (the code expired): give the new link once; if that one expires too, stop and say to run the login routine again when they are ready. The founder chose Deny: say nothing was signed in, and stop.
   - If `device.sh` fails, call `sign_in` without `device`: this session signs in, and the next one asks again. Say so in one line.
3. **No Shipfound tools at all.**
   - **Claude Code**: the plugin is older than 0.3.27, which signed in through `/mcp`. Tell the founder to update it once: `/plugin`, update Shipfound, then a new conversation; from then on this routine signs in by itself. If they cannot update now: `/mcp`, pick **plugin:shipfound:shipfound**, choose **Authenticate**.
   - **Codex**: run `codex mcp login shipfound` in a terminal, approve in the browser, then start a new thread.
   - With an API key instead (CI, a machine without a browser): the plugin README, "Sign in with an API key instead".

   Then stop and wait for the founder.
4. Say, in one line, which site the founder works on, the plan and credits, and whether there is an audit yet (from `workspace`). If you were running another routine, carry on with it now from where you stopped; do not ask the founder to start it again. If you were not in another routine, do the hand-over (SKILL.md): offer the next move.

If the founder has no Shipfound account yet, the approval page asks them to register first and lets them add their site there. There is nothing to do here for that.

To sign out on this machine: `sh <plugin root>/scripts/device.sh forget`. To sign out everywhere, they revoke the key in the results app (Settings, MCP connection).

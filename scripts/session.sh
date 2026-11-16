#!/bin/sh
# Shipfound at session start (hooks/hooks.json, SessionStart "startup").
#
# Asks Shipfound for today's move for the product whose repo this session is
# in, and prints the answer as Claude Code's hook output: one line for the
# founder (systemMessage) and what a reply of "go" should do
# (additionalContext). The server answers once a day per product, only in a
# repo confirmed as that product's, and only while the morning brief is on;
# otherwise it answers {} and nothing is printed.
#
# Sends the git remote (credentials stripped) or the folder name, and the
# machine's sign-in (scripts/device.sh). Never fails, never waits more than a
# few seconds, and prints nothing when signed out or offline.

dir="${CLAUDE_PROJECT_DIR:-$PWD}"
command -v curl >/dev/null 2>&1 || exit 0

repo=$(git -C "$dir" remote get-url origin 2>/dev/null | sed 's#//[^@/]*@#//#')
[ -n "$repo" ] || repo=$(basename "$dir")

here=$(dirname "$0")
token=$(sh "$here/device.sh" header 2>/dev/null | sed -n 's/.*"Bearer \([A-Za-z0-9_-]*\)".*/\1/p')
[ -n "$token" ] || exit 0

api="${SHIPFOUND_API_URL:-https://api.shipfound.co}"
out=$(curl -fsS --max-time 4 -G "$api/api/public/brief/session" --data-urlencode "repo=$repo" -H "Authorization: Bearer $token" 2>/dev/null) || exit 0
case "$out" in
  "{"*systemMessage*) printf '%s\n' "$out" ;;
esac
exit 0

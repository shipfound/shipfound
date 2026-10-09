#!/bin/sh
# Shipfound's sign-in on this machine (the login routine).
#
#   device.sh header   For Claude Code's headersHelper (.mcp.json): prints
#                      {"Authorization":"Bearer sfd_<secret>"}, or {} when this
#                      machine has no secret yet. Never fails.
#   device.sh init     Makes the secret if there is none and prints only its
#                      SHA-256, which sign_in takes as `device`.
#   device.sh forget   Deletes the secret: this machine is signed out.
#
# The secret is 32 random bytes, made here and never printed. It lives in the
# macOS Keychain (service "shipfound", account "device"), or where there is no
# Keychain in ~/.config/shipfound/device, readable by this user only. The
# server keeps its hash; one Allow on shipfound.co binds it to a key that the
# founder can revoke in Settings, MCP connection.

SERVICE=shipfound
ACCOUNT=device
FILE="${XDG_CONFIG_HOME:-$HOME/.config}/shipfound/device"

valid() {
  case "$1" in
    "" | *[!A-Za-z0-9_-]*) return 1 ;;
  esac
  [ "${#1}" -ge 32 ] && [ "${#1}" -le 128 ]
}

keychain() {
  [ "$(uname -s 2>/dev/null)" = Darwin ] && command -v security >/dev/null 2>&1
}

read_secret() {
  s=""
  if keychain; then
    s=$(security find-generic-password -s "$SERVICE" -a "$ACCOUNT" -w 2>/dev/null)
  fi
  if ! valid "$s" && [ -r "$FILE" ]; then
    s=$(cat "$FILE" 2>/dev/null)
  fi
  valid "$s" && printf '%s' "$s"
}

new_secret() {
  head -c 32 /dev/urandom | base64 | tr '+/' '-_' | tr -d '=\n'
}

save_secret() {
  if keychain && security add-generic-password -U -s "$SERVICE" -a "$ACCOUNT" -l "Shipfound sign-in" -w "$1" >/dev/null 2>&1; then
    return 0
  fi
  mkdir -p "$(dirname "$FILE")" && (umask 077 && printf '%s' "$1" >"$FILE") && chmod 600 "$FILE"
}

sha256() {
  if command -v shasum >/dev/null 2>&1; then
    printf '%s' "$1" | shasum -a 256 | cut -d' ' -f1
  else
    printf '%s' "$1" | sha256sum | cut -d' ' -f1
  fi
}

case "$1" in
  header)
    s=$(read_secret)
    if [ -n "$s" ]; then
      printf '{"Authorization":"Bearer sfd_%s"}\n' "$s"
    else
      printf '{}\n'
    fi
    exit 0
    ;;
  init)
    s=$(read_secret)
    if [ -z "$s" ]; then
      s=$(new_secret)
      valid "$s" || { echo "Could not make a secret on this machine." >&2; exit 1; }
      save_secret "$s" || { echo "Could not save the secret on this machine." >&2; exit 1; }
    fi
    sha256 "$s"
    ;;
  forget)
    if keychain; then security delete-generic-password -s "$SERVICE" -a "$ACCOUNT" >/dev/null 2>&1; fi
    rm -f "$FILE"
    echo "Signed out on this machine."
    ;;
  *)
    echo "usage: device.sh header|init|forget" >&2
    exit 2
    ;;
esac

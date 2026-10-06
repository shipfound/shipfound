#!/bin/sh
# Request headers for the Shipfound MCP server, printed as one JSON object.
#
# Claude Code runs this before it connects (the headersHelper in .mcp.json).
# - SHIPFOUND_API_KEY unset: prints {} and Claude Code signs you in with
#   OAuth in the browser (the default).
# - SHIPFOUND_API_KEY set to a wl_ key from Settings in the Shipfound app:
#   sends it as a Bearer token instead, for CI or machines without a browser.
key="${SHIPFOUND_API_KEY:-}"
case "$key" in
  "")
    printf '{}\n'
    ;;
  *[!A-Za-z0-9_-]*)
    echo "shipfound: SHIPFOUND_API_KEY has characters a key never has; ignoring it and using OAuth" >&2
    printf '{}\n'
    ;;
  *)
    printf '{"Authorization":"Bearer %s"}\n' "$key"
    ;;
esac

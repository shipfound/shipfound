---
description: "Agent Inside™. Your product as a tool the agents your buyers use can call (a skill, and an MCP server on your API), then inside the skill packs, templates and automation nodes they install. Free."
argument-hint: "[packs]"
allowed-tools: AskUserQuestion, Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git add *), Bash(git commit *), Bash(git diff *), Bash(git log *), Bash(gh search *), Bash(gh repo view *), Bash(gh pr view *), Bash(npm search *), Bash(sh ${CLAUDE_PLUGIN_ROOT}/scripts/device.sh init), Bash(open "https://www.shipfound.co/connect?code=*"), Bash(xdg-open "https://www.shipfound.co/connect?code=*"), mcp__plugin_shipfound_shipfound__sign_in, mcp__plugin_shipfound_shipfound__workspace, mcp__plugin_shipfound_shipfound__access, mcp__plugin_shipfound_shipfound__agent_inside, mcp__plugin_shipfound_shipfound__build_ideas, mcp__plugin_shipfound_shipfound__listing_targets, mcp__plugin_shipfound_shipfound__mail_setup, mcp__plugin_shipfound_shipfound__analytics, mcp__plugin_shipfound_shipfound__record_action, mcp__plugin_shipfound_shipfound__shipped, mcp__plugin_shipfound_shipfound__verify
---

# /shipfound:agent-inside

Use the shipfound skill (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/SKILL.md) and follow its agent-inside routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/agent-inside.md). Read both before you act. The routine is the procedure; this command only starts it.

Sign-in comes first: call `workspace` with `repo` (SKILL.md, "The repo") before anything else. If the Shipfound tools are missing, or it answers that you are not signed in, run the login routine (${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/login.md) now, then carry on with this command where you were; do not ask the founder to run it again.

packs, if given: $ARGUMENTS

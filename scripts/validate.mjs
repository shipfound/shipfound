#!/usr/bin/env node
// Checks the plugin repo. Plain Node 18+, no dependencies.
//
//   node scripts/validate.mjs
//
// - plugin.json, marketplace.json, .mcp.json and snippets/crawlers.json parse
//   and agree with each other
// - the Codex side (.codex-plugin/plugin.json, .agents/plugins/marketplace.json,
//   skills/shipfound/agents/openai.yaml) follows the Codex plugin contract
//   (mirrors plugin-creator's validate_plugin.py) and agrees with the Claude
//   Code side: same name, version, metadata, marketplace and MCP endpoint
// - every command and skill file has valid frontmatter; the skill's
//   frontmatter uses only keys both hosts accept
// - every command is a thin wrapper around its routine in
//   skills/shipfound/routines/, and routines, references and SKILL.md stay
//   host neutral (no Claude Code only paths or placeholders)
// - the hard lines in AGENTS.md match the ones in SKILL.md
// - every MCP tool named in the skill, the commands and the docs is in the
//   Shipfound tool table (and, inside the monorepo, that table still matches
//   docs/shipfound/BUILD.md)
// - commands never pre-approve a tool that costs more than 5 credits
// - every crawler snippet carries the same crawler list (and, inside the
//   monorepo, that list matches packages/shared and @shipfound/next)
// - relative links in Markdown resolve
// - no em dashes and none of the banned words in anything a founder reads,
//   and no offer of a "free scan"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MONOREPO = resolve(ROOT, "..");
const errors = [];
const notes = [];
const fail = (file, msg) => errors.push(`${relative(ROOT, file) || file}: ${msg}`);

// ─── The tool table (copy of docs/shipfound/BUILD.md, "MCP tools") ──────────
const TOOLS = {
  sign_in: 0,
  workspace: 0,
  record_access: 0,
  access: 0,
  visibility_run: 15, // 0 for the first baseline
  visibility: 0,
  plan: 0,
  site_fixes: 6,
  keyword_research: 4,
  content_brief: 5,
  check_content: 2,
  record_action: 0,
  verify: 1,
  shipped: 0,
  tracking_install: 0,
  tracking_check: 0,
  analytics: 0,
  goals: 0,
};
const CONFIRM_ABOVE_CREDITS = 5;
// In the spec, not built yet. Allowed only in files that say "not built yet".
const NOT_YET = [
  "index_status",
  "listing_targets",
  "visibility_rerun",
  "experiment_plan",
  "experiment_hypotheses",
  "experiment_create",
  "experiment_results",
  "experiment_close",
];
// snake_case identifiers that are not tools: report names, filter fields, example events, config keys.
const NOT_TOOLS = new Set([
  "ai_search",
  "landing_pages",
  "shipped_work",
  "ai_crawlers",
  "ai_engine",
  "landing_page",
  "referrer_host",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "first_project_created",
  "bearer_token_env_var",
  "mcp_servers",
  "is_suspended",
  "manifest_version",
  "env_http_headers",
]);
const COMMANDS = ["login", "audit", "plan", "fix", "write", "index", "status", "week", "list", "reach", "analytics", "test"];
const MCP_PREFIX = "mcp__plugin_shipfound_shipfound__";
const BANNED = ["unlock", "supercharge", "10x", "ai-powered"];
const EM_DASH = String.fromCharCode(0x2014);
const API_MCP_URL = "https://api.shipfound.co/mcp";
// Phrases nobody should see in this repo.
const BANNED_PHRASES = ["free scan"];

// ─── helpers ────────────────────────────────────────────────────────────────
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "dist") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    fail(file, `invalid JSON: ${e.message}`);
    return null;
  }
}

/** Minimal frontmatter reader: `key: value` lines between --- fences. */
function frontmatter(file) {
  const text = readFileSync(file, "utf8");
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!m) {
    fail(file, "missing frontmatter (--- fences at the top)");
    return null;
  }
  const out = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim()) continue;
    const kv = /^([a-z][a-z-_]*):\s*(.*)$/.exec(line);
    if (!kv) {
      fail(file, `frontmatter line is not "key: value": ${line}`);
      continue;
    }
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    else if (/^[[{]|: /.test(v) && kv[1] !== "allowed-tools") fail(file, `quote the value of ${kv[1]}; it reads as YAML structure`);
    out[kv[1]] = v;
  }
  return { data: out, body: text.slice(m[0].length) };
}

// ─── manifests ──────────────────────────────────────────────────────────────
const pluginFile = join(ROOT, ".claude-plugin/plugin.json");
const marketFile = join(ROOT, ".claude-plugin/marketplace.json");
const mcpFile = join(ROOT, ".mcp.json");
const plugin = readJson(pluginFile);
const market = readJson(marketFile);
const mcp = readJson(mcpFile);

if (plugin) {
  if (plugin.name !== "shipfound") fail(pluginFile, `name must be "shipfound", got ${plugin.name}`);
  for (const k of ["version", "description", "author", "license"]) if (!plugin[k]) fail(pluginFile, `missing ${k}`);
  if (plugin.author && !plugin.author.name) fail(pluginFile, "author.name is required");
  if (plugin.homepage && !/^https:\/\//.test(plugin.homepage)) fail(pluginFile, "homepage must be an https URL");
}
if (market) {
  if (market.name !== "shipfound") fail(marketFile, `marketplace name must be "shipfound", got ${market.name}`);
  if (!market.owner?.name) fail(marketFile, "owner.name is required");
  if (!Array.isArray(market.plugins) || market.plugins.length === 0) fail(marketFile, "plugins must be a non-empty array");
  const entry = market.plugins?.find((p) => p.name === "shipfound");
  if (!entry) fail(marketFile, 'no plugin entry named "shipfound"');
  else {
    if (typeof entry.source !== "string" || !(entry.source === "." || entry.source.startsWith("./"))) fail(marketFile, 'source must be "./" or another ./ path');
    else if (!existsSync(join(ROOT, entry.source, ".claude-plugin/plugin.json"))) fail(marketFile, `source ${entry.source} has no .claude-plugin/plugin.json`);
    if (plugin && entry.name !== plugin.name) fail(marketFile, "entry name differs from plugin.json name");
    if (entry.version) fail(marketFile, "leave version to plugin.json (it wins at install time)");
  }
}
if (mcp) {
  const s = mcp.mcpServers?.shipfound;
  if (!s) fail(mcpFile, 'mcpServers.shipfound is missing');
  else {
    if (s.type !== "http") fail(mcpFile, `shipfound.type must be "http", got ${s.type}`);
    // /mcp/plugin, not /mcp: it never answers 401, so Claude Code loads the tools signed out and sign_in works from the chat.
    if (!/^\$\{SHIPFOUND_API_URL:-https:\/\/api\.shipfound\.co\}\/mcp\/plugin$/.test(s.url ?? "")) fail(mcpFile, `url must be \${SHIPFOUND_API_URL:-https://api.shipfound.co}/mcp/plugin, got ${s.url}`);
    if (s.headers?.Authorization) fail(mcpFile, "a static Authorization header breaks the OAuth default; API-key users add their own server (README)");
    if (s.headersHelper) {
      const m = /\$\{CLAUDE_PLUGIN_ROOT\}\/([^"\s]+)/.exec(s.headersHelper);
      if (!m || !existsSync(join(ROOT, m[1]))) fail(mcpFile, `headersHelper script not found: ${s.headersHelper}`);
    }
  }
}

// ─── Codex manifests ────────────────────────────────────────────────────────
// Codex reads .codex-plugin/plugin.json before .claude-plugin/plugin.json and
// .agents/plugins/marketplace.json before .claude-plugin/marketplace.json, so
// these files decide what Codex installs. The rules below mirror
// ~/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py.
const codexFile = join(ROOT, ".codex-plugin/plugin.json");
const codexMarketFile = join(ROOT, ".agents/plugins/marketplace.json");
const codex = existsSync(codexFile) ? readJson(codexFile) : (fail(codexFile, "missing (Codex would fall back to the Claude manifest and .mcp.json)"), null);
const codexMarket = existsSync(codexMarketFile) ? readJson(codexMarketFile) : (fail(codexMarketFile, "missing"), null);
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const isHttps = (v) => typeof v === "string" && /^https:\/\/[^/\s]+/.test(v);
const nonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

function checkAsset(file, field, value) {
  if (!nonEmpty(value)) return fail(file, `${field} must be a non-empty relative path`);
  if (!value.startsWith("./") || value.split("/").some((part, i) => (i > 0 && (part === "" || part === "." || part === "..")))) return fail(file, `${field} must start with ./ and stay inside the plugin`);
  if (!existsSync(join(ROOT, value))) fail(file, `${field} points to a missing file: ${value}`);
}

if (codex) {
  const allowed = new Set(["id", "name", "version", "description", "skills", "apps", "mcpServers", "interface", "author", "homepage", "repository", "license", "keywords"]);
  for (const k of Object.keys(codex)) if (!allowed.has(k)) fail(codexFile, `field ${k} is not accepted by Codex plugin validation`);
  if (codex.name !== "shipfound") fail(codexFile, `name must be "shipfound", got ${codex.name}`);
  if (!SEMVER.test(codex.version ?? "")) fail(codexFile, "version must be strict semver");
  if (!nonEmpty(codex.description)) fail(codexFile, "description is required");
  if (!codex.author || typeof codex.author !== "object") fail(codexFile, "author must be an object");
  else {
    for (const k of Object.keys(codex.author)) if (!["name", "email", "url"].includes(k)) fail(codexFile, `author.${k} is not accepted`);
    if (!nonEmpty(codex.author.name)) fail(codexFile, "author.name is required");
    if (codex.author.url !== undefined && !isHttps(codex.author.url)) fail(codexFile, "author.url must be an https URL");
  }
  if ((codex.skills ?? "").replace(/^\.\//, "").replace(/\/+$/, "") !== "skills") fail(codexFile, 'skills must be "./skills/"');
  if (codex.apps !== undefined) fail(codexFile, "apps needs a .app.json; Shipfound has none");
  // An object here makes Codex skip .mcp.json, whose ${SHIPFOUND_API_URL:-...} URL and
  // headersHelper are Claude Code features Codex does not expand.
  const server = codex.mcpServers?.shipfound;
  if (typeof codex.mcpServers !== "object" || codex.mcpServers === null || Array.isArray(codex.mcpServers)) fail(codexFile, "mcpServers must be an inline object, so Codex ignores the Claude Code .mcp.json");
  else if (!server) fail(codexFile, "mcpServers.shipfound is missing");
  else {
    for (const k of Object.keys(codex.mcpServers)) if (k !== "shipfound") fail(codexFile, `unexpected MCP server ${k}`);
    if (!["http", "streamable_http", "streamable-http"].includes(server.type)) fail(codexFile, `mcpServers.shipfound.type must be an HTTP transport, got ${server.type}`);
    if (server.url !== API_MCP_URL) fail(codexFile, `mcpServers.shipfound.url must be ${API_MCP_URL}, got ${server.url}`);
    if (/\$\{/.test(JSON.stringify(server))) fail(codexFile, "Codex does not expand ${...} in plugin MCP config");
    if (server.bearer_token_env_var) fail(codexFile, "bearer_token_env_var fails startup when the variable is unset, which breaks the OAuth default; use env_http_headers");
    if (server.http_headers?.Authorization || server.http_headers?.authorization) fail(codexFile, "a static Authorization header breaks the OAuth default");
    for (const k of ["command", "args", "headersHelper", "http_headers_helper"]) if (server[k] !== undefined) fail(codexFile, `mcpServers.shipfound.${k} is not used; the server is remote and the helper cannot see SHIPFOUND_API_KEY`);
  }
  const ui = codex.interface;
  if (!ui || typeof ui !== "object") fail(codexFile, "interface must be an object");
  else {
    const uiAllowed = new Set(["displayName", "shortDescription", "longDescription", "developerName", "category", "capabilities", "websiteURL", "privacyPolicyURL", "termsOfServiceURL", "brandColor", "composerIcon", "logo", "logoDark", "screenshots", "defaultPrompt", "default_prompt"]);
    for (const k of Object.keys(ui)) if (!uiAllowed.has(k)) fail(codexFile, `interface.${k} is not accepted`);
    for (const k of ["displayName", "shortDescription", "longDescription", "developerName", "category"]) if (!nonEmpty(ui[k])) fail(codexFile, `interface.${k} is required`);
    if (!Array.isArray(ui.capabilities) || !ui.capabilities.every(nonEmpty)) fail(codexFile, "interface.capabilities must be an array of strings");
    const prompts = ui.defaultPrompt ?? ui.default_prompt;
    if (!Array.isArray(prompts) || prompts.length === 0) fail(codexFile, "interface.defaultPrompt is required");
    else {
      if (prompts.length > 3) fail(codexFile, "interface.defaultPrompt: Codex shows only the first 3");
      for (const p of prompts) if (!nonEmpty(p) || p.length > 128) fail(codexFile, `interface.defaultPrompt entry must be 1 to 128 characters: ${p}`);
    }
    for (const k of ["websiteURL", "privacyPolicyURL", "termsOfServiceURL"]) if (ui[k] !== undefined && !isHttps(ui[k])) fail(codexFile, `interface.${k} must be an https URL`);
    if (ui.brandColor !== undefined && !/^#[0-9A-F]{6}$/i.test(ui.brandColor)) fail(codexFile, "interface.brandColor must be #RRGGBB");
    for (const k of ["composerIcon", "logo", "logoDark"]) if (ui[k] !== undefined) checkAsset(codexFile, `interface.${k}`, ui[k]);
    for (const [i, s] of (ui.screenshots ?? []).entries()) checkAsset(codexFile, `interface.screenshots[${i}]`, s);
  }
  // One plugin, two manifests: the shared fields must agree.
  if (plugin) {
    for (const k of ["name", "version", "description", "homepage", "repository", "license"]) {
      if (plugin[k] !== codex[k]) fail(codexFile, `${k} differs from .claude-plugin/plugin.json`);
    }
    if (plugin.author?.name !== codex.author?.name || plugin.author?.url !== codex.author?.url) fail(codexFile, "author differs from .claude-plugin/plugin.json");
    if (JSON.stringify(plugin.keywords ?? []) !== JSON.stringify(codex.keywords ?? [])) fail(codexFile, "keywords differ from .claude-plugin/plugin.json");
  }
}
if (mcp?.mcpServers?.shipfound?.url) {
  // Same API as the Codex manifest; Codex stays on /mcp, where `codex mcp login` finds OAuth through the 401.
  const fallback = /:-([^}]+)\}(\/mcp)\/plugin$/.exec(mcp.mcpServers.shipfound.url);
  if (!fallback || `${fallback[1]}${fallback[2]}` !== API_MCP_URL) fail(mcpFile, `the default URL must be ${API_MCP_URL}/plugin, on the same API as the Codex manifest`);
}
if (codexMarket) {
  if (codexMarket.name !== (market?.name ?? "shipfound")) fail(codexMarketFile, `marketplace name must match .claude-plugin/marketplace.json (${market?.name})`);
  if (!/^[A-Za-z0-9_-]+$/.test(codexMarket.name ?? "")) fail(codexMarketFile, "marketplace name may only use letters, digits, _ and -");
  if (!nonEmpty(codexMarket.interface?.displayName)) fail(codexMarketFile, "interface.displayName is required");
  const entries = Array.isArray(codexMarket.plugins) ? codexMarket.plugins : (fail(codexMarketFile, "plugins must be an array"), []);
  const entry = entries.find((p) => p.name === "shipfound");
  if (!entry) fail(codexMarketFile, 'no plugin entry named "shipfound"');
  else {
    const path = typeof entry.source === "string" ? entry.source : entry.source?.source === "local" ? entry.source.path : null;
    if (path === null) fail(codexMarketFile, "source must be a local path (the plugin is this repo)");
    else if (!(path === "." || path === "./")) fail(codexMarketFile, `source path must be "./" (the repo root is the plugin), got ${path}`);
    else if (!existsSync(join(ROOT, ".codex-plugin/plugin.json"))) fail(codexMarketFile, "source has no .codex-plugin/plugin.json");
    if (!["NOT_AVAILABLE", "AVAILABLE", "INSTALLED_BY_DEFAULT"].includes(entry.policy?.installation)) fail(codexMarketFile, "policy.installation must be NOT_AVAILABLE, AVAILABLE or INSTALLED_BY_DEFAULT");
    if (!["ON_INSTALL", "ON_USE"].includes(entry.policy?.authentication)) fail(codexMarketFile, "policy.authentication must be ON_INSTALL or ON_USE");
    if (entry.policy?.installation === "NOT_AVAILABLE") fail(codexMarketFile, "policy.installation NOT_AVAILABLE hides the plugin");
    if (!nonEmpty(entry.category)) fail(codexMarketFile, "category is required");
    if (entry.version) fail(codexMarketFile, "leave version to .codex-plugin/plugin.json");
  }
}

// Codex skill metadata (agents/openai.yaml). No YAML parser here: check the lines we rely on.
const openaiYaml = join(ROOT, "skills/shipfound/agents/openai.yaml");
if (!existsSync(openaiYaml)) fail(openaiYaml, "missing");
else {
  const y = readFileSync(openaiYaml, "utf8");
  const val = (key) => new RegExp(`^\\s+${key}:\\s*"([^"]*)"\\s*$`, "m").exec(y)?.[1];
  for (const top of y.split("\n").filter((l) => /^[a-z_]+:/.test(l)).map((l) => l.split(":")[0])) {
    if (!["interface", "policy", "dependencies"].includes(top)) fail(openaiYaml, `top-level key ${top} is not accepted`);
  }
  if (!nonEmpty(val("display_name"))) fail(openaiYaml, 'interface.display_name is required (quoted)');
  const short = val("short_description") ?? "";
  if (short.length < 25 || short.length > 64) fail(openaiYaml, `interface.short_description must be 25 to 64 characters, got ${short.length}`);
  if (!/\$shipfound(:shipfound)?\b/.test(val("default_prompt") ?? "")) fail(openaiYaml, "interface.default_prompt must name the skill ($shipfound:shipfound)");
  if (val("url") !== API_MCP_URL) fail(openaiYaml, `dependencies.tools url must be ${API_MCP_URL}`);
  if (val("transport") !== "streamable_http") fail(openaiYaml, 'dependencies.tools transport must be "streamable_http"');
  if (/allow_implicit_invocation:\s*false/.test(y)) fail(openaiYaml, "the skill must stay implicitly invocable; Codex users start routines by asking in words");
}

// ─── commands and skills ────────────────────────────────────────────────────
const cmdDir = join(ROOT, "commands");
const cmdFiles = existsSync(cmdDir) ? readdirSync(cmdDir).filter((f) => f.endsWith(".md")) : [];
for (const c of COMMANDS) if (!cmdFiles.includes(`${c}.md`)) fail(cmdDir, `missing command ${c}.md`);
const CMD_KEYS = new Set(["description", "argument-hint", "allowed-tools", "model", "disable-model-invocation"]);
for (const f of cmdFiles) {
  const file = join(cmdDir, f);
  const fm = frontmatter(file);
  if (!fm) continue;
  for (const k of Object.keys(fm.data)) if (!CMD_KEYS.has(k)) fail(file, `unknown frontmatter key ${k}`);
  if (!fm.data.description || fm.data.description.length < 10) fail(file, "description is missing or too short");
  if (fm.data.description && fm.data.description.length > 250) fail(file, "description over 250 characters");
  if (/\$ARGUMENTS/.test(fm.body) && !fm.data["argument-hint"]) fail(file, "uses $ARGUMENTS but has no argument-hint");
  if (!/shipfound skill/.test(fm.body)) fail(file, "does not point at the shipfound skill");
  // One source of truth: the procedure lives in the routine, which Codex reads too.
  const routine = f.replace(/\.md$/, "");
  const routineRef = `\${CLAUDE_PLUGIN_ROOT}/skills/shipfound/routines/${routine}.md`;
  if (!fm.body.includes(routineRef)) fail(file, `does not start its routine (${routineRef})`);
  else if (!existsSync(join(ROOT, "skills/shipfound/routines", `${routine}.md`))) fail(file, `routine file skills/shipfound/routines/${routine}.md is missing`);
  if (/^## /m.test(fm.body) || fm.body.split("\n").length > 12) fail(file, "keep the command a thin wrapper; the procedure belongs in its routine");
  // Codex copies argument-free plugin commands into stray "source-command-*" skills;
  // commands that take $ARGUMENTS are skipped, so every command takes input.
  if (!/\$ARGUMENTS/.test(fm.body)) fail(file, "must pass $ARGUMENTS to its routine (also keeps Codex from copying it into a stray skill)");
  for (const t of (fm.data["allowed-tools"] ?? "").split(/,\s*/).filter(Boolean)) {
    if (!t.startsWith("mcp__")) continue;
    if (!t.startsWith(MCP_PREFIX)) {
      fail(file, `allowed-tools entry ${t} is not a Shipfound tool (${MCP_PREFIX}<name>)`);
      continue;
    }
    const name = t.slice(MCP_PREFIX.length);
    if (!(name in TOOLS)) fail(file, `allowed-tools names unknown tool ${name}`);
    else if (TOOLS[name] > CONFIRM_ABOVE_CREDITS) fail(file, `allowed-tools pre-approves ${name} (${TOOLS[name]} credits); tools over ${CONFIRM_ABOVE_CREDITS} credits must ask first`);
  }
}

const skillsDir = join(ROOT, "skills");
const skillDirs = existsSync(skillsDir) ? readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory()) : [];
if (!skillDirs.includes("shipfound")) fail(skillsDir, "missing skills/shipfound");
for (const d of skillDirs) {
  const file = join(skillsDir, d, "SKILL.md");
  if (!existsSync(file)) {
    fail(join(skillsDir, d), "missing SKILL.md");
    continue;
  }
  const fm = frontmatter(file);
  if (!fm) continue;
  if (fm.data.name !== d) fail(file, `name must match its folder (${d}), got ${fm.data.name}`);
  // Keys both hosts accept (Codex's quick_validate.py allows only these).
  for (const k of Object.keys(fm.data)) if (!["name", "description", "license", "allowed-tools", "metadata"].includes(k)) fail(file, `frontmatter key ${k} is not accepted by Codex`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.data.name ?? "") || (fm.data.name ?? "").length > 64) fail(file, "name must be kebab-case, at most 64 characters");
  if (!fm.data.description) fail(file, "description is required");
  else if (fm.data.description.length > 1024) fail(file, `description is ${fm.data.description.length} characters; keep it under 1024`);
  const lines = fm.body.split("\n").length;
  if (lines > 500) fail(file, `SKILL.md is ${lines} lines; move detail into references/`);
  for (const t of Object.keys(TOOLS)) if (!fm.body.includes(`\`${t}\``)) fail(file, `does not describe the tool ${t}`);
}

// ─── routines and host neutrality ───────────────────────────────────────────
const skillRoot = join(ROOT, "skills/shipfound");
const routineDir = join(skillRoot, "routines");
const routineFiles = existsSync(routineDir) ? readdirSync(routineDir).filter((f) => f.endsWith(".md")) : [];
for (const c of COMMANDS) if (!routineFiles.includes(`${c}.md`)) fail(routineDir, `missing routine ${c}.md`);
for (const f of routineFiles) if (!COMMANDS.includes(f.replace(/\.md$/, ""))) fail(join(routineDir, f), "routine without a command; add it to COMMANDS and commands/");
const skillMdFile = join(skillRoot, "SKILL.md");
const skillMd = existsSync(skillMdFile) ? readFileSync(skillMdFile, "utf8") : "";
for (const c of COMMANDS) {
  if (!skillMd.includes(`](routines/${c}.md)`)) fail(skillMdFile, `routines table does not link routines/${c}.md`);
  if (!skillMd.includes(`\`/shipfound:${c}`)) fail(skillMdFile, `routines table does not give the Claude Code command for ${c}`);
}
// Everything under skills/ is read by both hosts.
for (const file of walk(skillRoot).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(file, "utf8");
  if (text.includes("${CLAUDE_PLUGIN_ROOT}")) fail(file, "${CLAUDE_PLUGIN_ROOT} is Claude Code only; use a relative link");
  if (text.includes("$ARGUMENTS")) fail(file, "$ARGUMENTS is Claude Code only; say \"the founder's input\"");
  if (file.startsWith(routineDir)) {
    if (/\/shipfound:/.test(text)) fail(file, "routines name other routines (\"the fix routine\"); commands are host specific");
    if (/\bin Chrome\b|\bmcp__/.test(text)) fail(file, "routines say \"the browser\"; SKILL.md maps it per host");
  }
}
// The hard lines in AGENTS.md (for MCP-only setups) must say what SKILL.md says.
const agentsFile = join(ROOT, "AGENTS.md");
if (existsSync(agentsFile) && skillMd) {
  const agents = readFileSync(agentsFile, "utf8");
  const section = (text) => text.split("## Hard lines")[1]?.split("\n## ")[0] ?? "";
  const leads = [...section(skillMd).matchAll(/^\d+\. \*\*(.+?)\*\*/gm)].map((m) => m[1].replace(/[.]$/, "").replace(/`/g, ""));
  const theirs = section(agents).replace(/`/g, "");
  if (leads.length !== 8) fail(skillMdFile, `expected 8 hard lines, found ${leads.length}`);
  if ((theirs.match(/^\d+\. /gm) ?? []).length !== leads.length) fail(agentsFile, "hard lines count differs from SKILL.md");
  for (const lead of leads) if (!theirs.includes(lead)) fail(agentsFile, `hard line missing or reworded: "${lead}"`);
}

// ─── text checks across the repo ────────────────────────────────────────────
const TEXT = /\.(md|json|ts|js|mjs|sh|toml|txt|yaml|yml)$/;
const files = walk(ROOT).filter((f) => TEXT.test(f) || f.endsWith("LICENSE"));
const DOCS = files.filter((f) => f.endsWith(".md"));

for (const file of files) {
  const text = readFileSync(file, "utf8");
  text.split("\n").forEach((line, i) => {
    if (line.includes(EM_DASH)) fail(file, `line ${i + 1}: em dash`);
    const lower = line.toLowerCase();
    const hits = BANNED.filter((w) => lower.includes(w));
    // The one line that lists all four, to ban them, is allowed.
    if (hits.length > 0 && hits.length < BANNED.length) fail(file, `line ${i + 1}: banned word "${hits.join('", "')}"`);
    for (const phrase of BANNED_PHRASES) if (lower.includes(phrase) && !file.endsWith("validate.mjs")) fail(file, `line ${i + 1}: "${phrase}"`);
  });
}

for (const file of DOCS) {
  const text = readFileSync(file, "utf8");
  const notYetOk = /not built yet/i.test(text);
  for (const m of text.matchAll(new RegExp(`${MCP_PREFIX}([a-z_]+)`, "g"))) {
    if (!(m[1] in TOOLS)) fail(file, `unknown tool ${m[1]}`);
  }
  for (const m of text.matchAll(/`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`/g)) {
    const t = m[1];
    if (t in TOOLS || NOT_TOOLS.has(t)) continue;
    if (NOT_YET.includes(t)) {
      if (!notYetOk) fail(file, `mentions ${t}, which is not built yet, without saying so`);
      continue;
    }
    fail(file, `\`${t}\` looks like a tool name but is not in the tool table (add it to NOT_TOOLS if it is not a tool)`);
  }
  // Relative links resolve.
  for (const m of text.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
    const target = m[1];
    if (/^[a-z]+:/.test(target)) continue;
    if (!existsSync(resolve(dirname(file), target))) fail(file, `broken link ${target}`);
  }
}

// ─── crawler lists ──────────────────────────────────────────────────────────
const crawlersFile = join(ROOT, "snippets/crawlers.json");
const crawlers = existsSync(crawlersFile) ? readJson(crawlersFile) : (fail(crawlersFile, "missing"), null);
const tokens = crawlers?.crawlers?.map((c) => c.match) ?? [];
const snippetDir = join(ROOT, "snippets");
const snippets = existsSync(snippetDir) ? readdirSync(snippetDir).filter((f) => /\.(ts|js|mjs)$/.test(f)) : [];
for (const name of ["astro-middleware.ts", "nuxt-server-middleware.ts", "sveltekit-hooks.server.ts", "cloudflare-worker.js", "log-shipper.mjs"]) {
  if (!snippets.includes(name)) fail(snippetDir, `missing snippet ${name}`);
}
for (const f of snippets) {
  const file = join(snippetDir, f);
  const text = readFileSync(file, "utf8");
  const m = /BOT_TOKENS\s*=\s*\[([\s\S]*?)\]/.exec(text);
  if (!m) {
    fail(file, "no BOT_TOKENS list");
    continue;
  }
  const list = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  if (JSON.stringify(list) !== JSON.stringify(tokens)) fail(file, "BOT_TOKENS differs from snippets/crawlers.json");
  for (const needle of ["/t/crawler", "x-shipfound-secret", "800"]) if (!text.includes(needle)) fail(file, `missing ${needle}`);
  if (!text.includes("https://t.shipfound.co")) fail(file, "default tracker must be https://t.shipfound.co");
}

function crawlerPairs(ts) {
  return [...ts.matchAll(/bot:\s*"([^"]+)",\s*match:\s*\[([^\]]*)\]/g)].map((m) => [m[1], [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]).join("|")]);
}
const ours = crawlers?.crawlers?.map((c) => [c.bot, c.match]) ?? [];
for (const [label, path] of [
  ["packages/shared", join(MONOREPO, "packages/shared/src/shipfound/crawlers.ts")],
  ["@shipfound/next", join(MONOREPO, "packages/sdk-next/src/crawlers.ts")],
]) {
  if (!existsSync(path)) continue;
  const theirs = crawlerPairs(readFileSync(path, "utf8"));
  if (JSON.stringify(theirs) !== JSON.stringify(ours)) fail(crawlersFile, `crawler list differs from ${label} (${relative(MONOREPO, path)})`);
  else notes.push(`crawler list matches ${label}`);
}

// ─── drift against BUILD.md (monorepo only) ─────────────────────────────────
const buildMd = join(MONOREPO, "docs/shipfound/BUILD.md");
if (existsSync(buildMd)) {
  const text = readFileSync(buildMd, "utf8");
  const section = text.split("## MCP tools")[1]?.split("\n## ")[0] ?? "";
  const table = {};
  for (const m of section.matchAll(/^\| `([a-z_]+)` \| ([^|]*) \|/gm)) {
    const credits = m[2].trim();
    const n = /^(\d+)/.exec(credits);
    table[m[1]] = /then (\d+)/.test(credits) ? Number(/then (\d+)/.exec(credits)[1]) : n ? Number(n[1]) : NaN;
  }
  const a = Object.keys(table).sort().join(",");
  const b = Object.keys(TOOLS).sort().join(",");
  if (a !== b) fail(buildMd, `tool table drifted. BUILD.md: ${a}. validate.mjs: ${b}`);
  for (const [t, c] of Object.entries(table)) if (t in TOOLS && TOOLS[t] !== c) fail(buildMd, `${t} costs ${c} in BUILD.md, ${TOOLS[t]} here`);
  if (a === b) notes.push(`tool table matches BUILD.md (${Object.keys(table).length} tools)`);
}

// ─── report ─────────────────────────────────────────────────────────────────
for (const n of notes) console.log(`ok   ${n}`);
console.log(`ok   ${cmdFiles.length} commands, ${skillDirs.length} skill, ${snippets.length} snippets, ${files.length} files scanned`);
if (errors.length) {
  for (const e of errors) console.error(`FAIL ${e}`);
  console.error(`\n${errors.length} problem${errors.length === 1 ? "" : "s"}`);
  process.exit(1);
}
console.log("Validation passed");

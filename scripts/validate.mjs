#!/usr/bin/env node
// Checks the plugin repo. Plain Node 18+, no dependencies.
//
//   node scripts/validate.mjs
//
// - plugin.json, marketplace.json, .mcp.json and snippets/crawlers.json parse
//   and agree with each other
// - every command and skill file has valid frontmatter
// - every MCP tool named in the skill, the commands and the docs is in the
//   Shipfound tool table (and, inside the monorepo, that table still matches
//   docs/shipfound/BUILD.md)
// - commands never pre-approve a tool that costs more than 5 credits
// - every crawler snippet carries the same crawler list (and, inside the
//   monorepo, that list matches packages/shared and @shipfound/next)
// - relative links in Markdown resolve
// - no em dashes and none of the banned words in anything a founder reads
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
]);
const COMMANDS = ["audit", "plan", "fix", "write", "index", "status", "week", "list", "reach", "analytics", "test"];
const MCP_PREFIX = "mcp__plugin_shipfound_shipfound__";
const BANNED = ["unlock", "supercharge", "10x", "ai-powered"];
const EM_DASH = String.fromCharCode(0x2014);

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
    if (!/^\$\{SHIPFOUND_API_URL:-https:\/\/api\.shipfound\.co\}\/mcp$/.test(s.url ?? "")) fail(mcpFile, `url must be \${SHIPFOUND_API_URL:-https://api.shipfound.co}/mcp, got ${s.url}`);
    if (s.headers?.Authorization) fail(mcpFile, "a static Authorization header breaks the OAuth default; use the headersHelper");
    if (s.headersHelper) {
      const m = /\$\{CLAUDE_PLUGIN_ROOT\}\/([^"\s]+)/.exec(s.headersHelper);
      if (!m || !existsSync(join(ROOT, m[1]))) fail(mcpFile, `headersHelper script not found: ${s.headersHelper}`);
    }
  }
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
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.data.name ?? "") || (fm.data.name ?? "").length > 64) fail(file, "name must be kebab-case, at most 64 characters");
  if (!fm.data.description) fail(file, "description is required");
  else if (fm.data.description.length > 1024) fail(file, `description is ${fm.data.description.length} characters; keep it under 1024`);
  const lines = fm.body.split("\n").length;
  if (lines > 500) fail(file, `SKILL.md is ${lines} lines; move detail into references/`);
  for (const t of Object.keys(TOOLS)) if (!fm.body.includes(`\`${t}\``)) fail(file, `does not describe the tool ${t}`);
}

// ─── text checks across the repo ────────────────────────────────────────────
const TEXT = /\.(md|json|ts|js|mjs|sh|toml|txt)$/;
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

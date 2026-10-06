#!/usr/bin/env node
// Shipfound crawler log shipper, for static sites served by nginx or Caddy
// on your own server (no middleware runs there). A sketch to adapt, not a
// daemon manager: run it under systemd, pm2 or a supervisor of your choice.
//
// It follows the access log, keeps only lines whose user agent is on the
// crawler list, and posts each hit to the tracker. Nothing about people is
// sent: their lines are dropped before anything leaves the machine.
//
//   SHIPFOUND_SITE_KEY=sf_... SHIPFOUND_SECRET=sfs_... \
//     node log-shipper.mjs /var/log/caddy/access.log caddy
//   node log-shipper.mjs /var/log/nginx/access.log nginx
//
// Caddy: enable JSON access logs in the site block:
//   log {
//     output file /var/log/caddy/access.log
//     format json
//   }
//
// nginx: the default "combined" format works (no response time). For the
// response time, add this format and use it on the access_log line:
//   log_format shipfound '$remote_addr - $remote_user [$time_local] "$request" '
//                        '$status $body_bytes_sent "$http_referer" "$http_user_agent" $request_time';
//   access_log /var/log/nginx/access.log shipfound;
//
// Needs Node 18+ (global fetch) and `tail` on the PATH. No dependencies.
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

// Copy of Shipfound's crawler list. Lower-case user agent substrings.
const BOT_TOKENS = [
  "oai-searchbot", "chatgpt-user", "gptbot",
  "perplexity-user", "perplexitybot",
  "claude-user", "claude-searchbot", "claudebot",
  "google-inspectiontool", "googlebot", "bingbot",
  "applebot", "duckassistbot", "meta-externalagent", "bytespider", "ccbot", "amazonbot",
];

const [file, format = "nginx"] = process.argv.slice(2);
const SITE_KEY = process.env.SHIPFOUND_SITE_KEY;
const SECRET = process.env.SHIPFOUND_SECRET;
const TRACKER = (process.env.SHIPFOUND_TRACKER_URL || "https://t.shipfound.co").replace(/\/+$/, "");
const MAX_IN_FLIGHT = 8;

if (!file || !SITE_KEY || !SECRET || !["nginx", "caddy"].includes(format)) {
  console.error("usage: SHIPFOUND_SITE_KEY=sf_... SHIPFOUND_SECRET=sfs_... node log-shipper.mjs <access.log> [nginx|caddy]");
  process.exit(1);
}

function isCrawler(ua) {
  const s = (ua || "").toLowerCase();
  return s !== "" && BOT_TOKENS.some((t) => s.includes(t));
}

// nginx combined, optionally followed by $request_time in seconds.
const NGINX = /^(\S+) \S+ \S+ \[[^\]]+\] "(?:[A-Z]+) (\S+)[^"]*" (\d{3}) \S+ "[^"]*" "([^"]*)"(?: (\d+(?:\.\d+)?))?/;

function parse(line) {
  if (format === "caddy") {
    try {
      const j = JSON.parse(line);
      const req = j.request || {};
      const ua = (req.headers && req.headers["User-Agent"] && req.headers["User-Agent"][0]) || "";
      return {
        ua,
        path: String(req.uri || "/").split("?")[0],
        status: Number(j.status) || undefined,
        ms: typeof j.duration === "number" ? Math.round(j.duration * 1000) : undefined,
        ip: req.client_ip || req.remote_ip || undefined,
      };
    } catch {
      return null;
    }
  }
  const m = NGINX.exec(line);
  if (!m) return null;
  return {
    ua: m[4],
    path: m[2].split("?")[0],
    status: Number(m[3]),
    ms: m[5] ? Math.round(Number(m[5]) * 1000) : undefined,
    ip: m[1],
  };
}

let inFlight = 0;

async function send(hit) {
  if (inFlight >= MAX_IN_FLIGHT) return; // Shed load rather than queue without bound.
  inFlight++;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 800);
  try {
    await fetch(`${TRACKER}/t/crawler`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-shipfound-secret": SECRET },
      body: JSON.stringify(hit),
      signal: controller.signal,
    });
  } catch {
    // Drop the hit and carry on.
  } finally {
    clearTimeout(timer);
    inFlight--;
  }
}

// -F follows the file across log rotation; -n0 starts at the end.
const tail = spawn("tail", ["-F", "-n", "0", file], { stdio: ["ignore", "pipe", "inherit"] });
const lines = createInterface({ input: tail.stdout });
lines.on("line", (line) => {
  const row = parse(line);
  if (!row || !isCrawler(row.ua)) return;
  const hit = { k: SITE_KEY, ua: row.ua.slice(0, 500), path: (row.path || "/").slice(0, 2000) };
  if (row.status >= 100 && row.status <= 599) hit.status = row.status;
  if (Number.isFinite(row.ms) && row.ms >= 0) hit.ms = Math.min(row.ms, 600000);
  if (row.ip) hit.ip = String(row.ip).slice(0, 64);
  void send(hit);
});
tail.on("exit", (code) => process.exit(code ?? 1));

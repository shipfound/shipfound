// Shipfound crawler beacon for Nuxt 3 (Nitro). Save as
// server/middleware/shipfound.ts. Nitro runs every file in server/middleware
// on every request, before the route.
//
// Middleware runs before the page renders, so the status code and response
// time are unknown and left out. A prerendered (nuxt generate) site never
// runs it for visitors: use an edge snippet or the log shipper instead.
//
// Env: SHIPFOUND_SITE_KEY (sf_...), SHIPFOUND_SECRET (sfs_..., keep it
// secret), SHIPFOUND_TRACKER_URL (optional, default https://t.shipfound.co).
// The values come from the tracking_install tool.
import { defineEventHandler, getRequestHeader, getRequestIP, getRequestURL } from "h3";

// Copy of Shipfound's crawler list. Lower-case user agent substrings.
const BOT_TOKENS = [
  "oai-searchbot", "chatgpt-user", "gptbot",
  "perplexity-user", "perplexitybot",
  "claude-user", "claude-searchbot", "claudebot",
  "google-inspectiontool", "googlebot", "bingbot",
  "applebot", "duckassistbot", "meta-externalagent", "bytespider", "ccbot", "amazonbot",
];

function isCrawler(ua: string): boolean {
  const s = ua.toLowerCase();
  return s !== "" && BOT_TOKENS.some((t) => s.includes(t));
}

async function sendHit(body: Record<string, unknown>, secret: string): Promise<void> {
  const tracker = (process.env.SHIPFOUND_TRACKER_URL || "https://t.shipfound.co").replace(/\/+$/, "");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 800);
  try {
    await fetch(`${tracker}/t/crawler`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-shipfound-secret": secret },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    // Drop the hit, never the page.
  } finally {
    clearTimeout(timer);
  }
}

export default defineEventHandler((event) => {
  try {
    const siteKey = process.env.SHIPFOUND_SITE_KEY;
    const secret = process.env.SHIPFOUND_SECRET;
    const ua = getRequestHeader(event, "user-agent") ?? "";
    if (!siteKey || !secret || !isCrawler(ua)) return;
    const ip = getRequestIP(event, { xForwardedFor: true });
    const hit = {
      k: siteKey,
      ua: ua.slice(0, 500),
      path: getRequestURL(event).pathname.slice(0, 2000),
      ...(ip ? { ip: ip.slice(0, 64) } : {}),
    };
    const p = sendHit(hit, secret);
    // Keep serverless and edge presets alive for the post; never await it here.
    const wait = (event as unknown as { waitUntil?: (p: Promise<unknown>) => void }).waitUntil;
    if (typeof wait === "function") wait.call(event, p);
  } catch {
    // Never break the page.
  }
  // Return nothing so Nitro carries on to the route.
});

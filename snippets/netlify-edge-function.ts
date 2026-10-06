// Shipfound crawler beacon as a Netlify Edge Function, for any site on
// Netlify (Hugo, Astro, SvelteKit, Nuxt, plain HTML). Save as
// netlify/edge-functions/shipfound.ts.
//
// Env (Site configuration, Environment variables, scoped to Functions):
// SHIPFOUND_SITE_KEY (sf_...), SHIPFOUND_SECRET (sfs_..., secret),
// SHIPFOUND_TRACKER_URL (optional, default https://t.shipfound.co).
// The values come from the tracking_install tool.
import type { Config, Context } from "@netlify/edge-functions";

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
  const tracker = (Netlify.env.get("SHIPFOUND_TRACKER_URL") || "https://t.shipfound.co").replace(/\/+$/, "");
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

export default async (request: Request, context: Context) => {
  const ua = request.headers.get("user-agent") ?? "";
  const siteKey = Netlify.env.get("SHIPFOUND_SITE_KEY");
  const secret = Netlify.env.get("SHIPFOUND_SECRET");
  // People pass straight through without waiting on anything.
  if (!siteKey || !secret || !isCrawler(ua)) return;
  const started = Date.now();
  const response = await context.next();
  try {
    const hit = {
      k: siteKey,
      ua: ua.slice(0, 500),
      path: new URL(request.url).pathname.slice(0, 2000),
      status: response.status,
      ms: Date.now() - started,
      ...(context.ip ? { ip: context.ip.slice(0, 64) } : {}),
    };
    const p = sendHit(hit, secret);
    const wait = (context as unknown as { waitUntil?: (p: Promise<unknown>) => void }).waitUntil;
    if (typeof wait === "function") wait.call(context, p);
  } catch {
    // Never break the page.
  }
  return response;
};

export const config: Config = {
  path: "/*",
  excludedPath: ["/*.js", "/*.css", "/*.png", "/*.jpg", "/*.svg", "/*.ico", "/*.webp", "/*.woff2"],
};

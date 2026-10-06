// Shipfound crawler beacon for SvelteKit. Save as src/hooks.server.ts. If
// you already export a `handle`, combine them:
//   import { sequence } from "@sveltejs/kit/hooks";
//   export const handle = sequence(shipfound, yourHandle);
//
// Prerendered pages never run hooks for visitors: for a fully static build
// (adapter-static) use an edge snippet or the log shipper instead.
//
// Env: SHIPFOUND_SITE_KEY (sf_...), SHIPFOUND_SECRET (sfs_..., keep it
// secret), SHIPFOUND_TRACKER_URL (optional, default https://t.shipfound.co).
// The values come from the tracking_install tool.
import type { Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

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
  const tracker = (env.SHIPFOUND_TRACKER_URL || "https://t.shipfound.co").replace(/\/+$/, "");
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

export const shipfound: Handle = async ({ event, resolve }) => {
  const started = Date.now();
  const response = await resolve(event);
  try {
    const siteKey = env.SHIPFOUND_SITE_KEY;
    const secret = env.SHIPFOUND_SECRET;
    const ua = event.request.headers.get("user-agent") ?? "";
    if (siteKey && secret && isCrawler(ua)) {
      let ip: string | undefined;
      try {
        ip = event.getClientAddress();
      } catch {
        ip = undefined;
      }
      const hit = {
        k: siteKey,
        ua: ua.slice(0, 500),
        path: event.url.pathname.slice(0, 2000),
        status: response.status,
        ms: Date.now() - started,
        ...(ip ? { ip: ip.slice(0, 64) } : {}),
      };
      const p = sendHit(hit, secret);
      // Cloudflare adapter: keep the worker alive for the post. Elsewhere the
      // promise runs on its own; it is never awaited before the response.
      const platform = event.platform as { context?: { waitUntil?: (p: Promise<unknown>) => void } } | undefined;
      platform?.context?.waitUntil?.(p);
    }
  } catch {
    // Never break the page.
  }
  return response;
};

export const handle = shipfound;

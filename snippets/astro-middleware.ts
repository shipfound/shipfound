// Shipfound crawler beacon for Astro. Save as src/middleware.ts (or merge
// into yours with `sequence` from "astro:middleware").
//
// Works when Astro renders on a server or at the edge (output "server", or
// pages with `export const prerender = false`). A fully static Astro build
// never runs middleware for visitors: use the Vercel, Netlify or Cloudflare
// edge snippet, or the log shipper, instead.
//
// Env: SHIPFOUND_SITE_KEY (sf_...), SHIPFOUND_SECRET (sfs_..., keep it
// secret), SHIPFOUND_TRACKER_URL (optional, default https://t.shipfound.co).
// The values come from the tracking_install tool.
import { defineMiddleware } from "astro:middleware";

// Copy of Shipfound's crawler list. Lower-case user agent substrings.
const BOT_TOKENS = [
  "oai-searchbot", "chatgpt-user", "gptbot",
  "perplexity-user", "perplexitybot",
  "claude-user", "claude-searchbot", "claudebot",
  "google-inspectiontool", "googlebot", "bingbot",
  "applebot", "duckassistbot", "meta-externalagent", "bytespider", "ccbot", "amazonbot",
];

function readEnv(name: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)[name];
  if (fromMeta) return fromMeta;
  try {
    return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
  } catch {
    return undefined;
  }
}

function isCrawler(ua: string): boolean {
  const s = ua.toLowerCase();
  return s !== "" && BOT_TOKENS.some((t) => s.includes(t));
}

async function sendHit(body: Record<string, unknown>, secret: string): Promise<void> {
  const tracker = (readEnv("SHIPFOUND_TRACKER_URL") ?? "https://t.shipfound.co").replace(/\/+$/, "");
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

export const onRequest = defineMiddleware(async (context, next) => {
  const started = Date.now();
  const response = await next();
  try {
    const siteKey = readEnv("SHIPFOUND_SITE_KEY");
    const secret = readEnv("SHIPFOUND_SECRET");
    const ua = context.request.headers.get("user-agent") ?? "";
    if (siteKey && secret && isCrawler(ua)) {
      let ip: string | undefined;
      try {
        ip = context.clientAddress;
      } catch {
        ip = context.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
      }
      const hit = {
        k: siteKey,
        ua: ua.slice(0, 500),
        path: context.url.pathname.slice(0, 2000),
        status: response.status,
        ms: Date.now() - started,
        ...(ip ? { ip: ip.slice(0, 64) } : {}),
      };
      const p = sendHit(hit, secret);
      // Cloudflare adapter: keep the worker alive for the post. Elsewhere the
      // promise runs on its own; it is never awaited before the response.
      const ctx = (context.locals as { runtime?: { ctx?: { waitUntil?: (p: Promise<unknown>) => void } } }).runtime?.ctx;
      ctx?.waitUntil?.(p);
    }
  } catch {
    // Never break the page.
  }
  return response;
});

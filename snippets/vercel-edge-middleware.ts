// Shipfound crawler beacon as Vercel Routing Middleware, for sites on Vercel
// that are not Next.js (Astro static, Hugo, SvelteKit static, plain HTML).
// Next.js sites use the @shipfound/next package instead. Save as
// middleware.ts at the project root.
//
// Middleware runs before the response, so the status code and response time
// are unknown and left out.
//
// Env (Project Settings, Environment Variables): SHIPFOUND_SITE_KEY (sf_...),
// SHIPFOUND_SECRET (sfs_..., mark it sensitive), SHIPFOUND_TRACKER_URL
// (optional, default https://t.shipfound.co). The values come from the
// tracking_install tool.

export const config = {
  // Skip static assets; match pages.
  matcher: ["/((?!_vercel|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?|map)$).*)"],
};

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

export default function middleware(request: Request, context?: { waitUntil?: (p: Promise<unknown>) => void }): void {
  try {
    const siteKey = process.env.SHIPFOUND_SITE_KEY;
    const secret = process.env.SHIPFOUND_SECRET;
    const ua = request.headers.get("user-agent") ?? "";
    if (!siteKey || !secret || !isCrawler(ua)) return;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined;
    const hit = {
      k: siteKey,
      ua: ua.slice(0, 500),
      path: new URL(request.url).pathname.slice(0, 2000),
      ...(ip ? { ip: ip.slice(0, 64) } : {}),
    };
    context?.waitUntil?.(sendHit(hit, secret));
  } catch {
    // Never break the page.
  }
  // Returning nothing lets the request continue to the site.
}

// Shipfound crawler beacon as a Cloudflare Worker in front of any site
// (Hugo, plain HTML, Astro static, anything Cloudflare proxies). Deploy it on
// a route that covers the site, for example example.com/*.
//
// It also serves the first-party proxy: /sf/t.js and /sf/t/e go to the
// tracker, so ad blockers do not drop the script. Delete that block if you
// load t.js from https://t.shipfound.co directly.
//
// Secrets and vars (wrangler secret put / dashboard):
//   SHIPFOUND_SITE_KEY      sf_...
//   SHIPFOUND_SECRET        sfs_...  (secret)
//   SHIPFOUND_TRACKER_URL   optional, default https://t.shipfound.co
// The values come from the tracking_install tool.

// Copy of Shipfound's crawler list. Lower-case user agent substrings.
const BOT_TOKENS = [
  "oai-searchbot", "chatgpt-user", "gptbot",
  "perplexity-user", "perplexitybot",
  "claude-user", "claude-searchbot", "claudebot",
  "google-inspectiontool", "googlebot", "bingbot",
  "applebot", "duckassistbot", "meta-externalagent", "bytespider", "ccbot", "amazonbot",
];

function isCrawler(ua) {
  const s = (ua || "").toLowerCase();
  return s !== "" && BOT_TOKENS.some((t) => s.includes(t));
}

function trackerOrigin(env) {
  return (env.SHIPFOUND_TRACKER_URL || "https://t.shipfound.co").replace(/\/+$/, "");
}

async function sendHit(env, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 800);
  try {
    await fetch(`${trackerOrigin(env)}/t/crawler`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-shipfound-secret": env.SHIPFOUND_SECRET },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    // Drop the hit, never the page.
  } finally {
    clearTimeout(timer);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // First-party proxy: /sf/* -> tracker.
    if (url.pathname.startsWith("/sf/")) {
      const target = trackerOrigin(env) + url.pathname.slice(3) + url.search;
      const headers = new Headers(request.headers);
      const ip = request.headers.get("cf-connecting-ip");
      if (ip) headers.set("x-forwarded-for", ip);
      return fetch(target, { method: request.method, headers, body: request.body, redirect: "manual" });
    }

    const started = Date.now();
    const response = await fetch(request);
    try {
      const ua = request.headers.get("user-agent") || "";
      if (env.SHIPFOUND_SITE_KEY && env.SHIPFOUND_SECRET && isCrawler(ua)) {
        const ip = request.headers.get("cf-connecting-ip");
        const hit = {
          k: env.SHIPFOUND_SITE_KEY,
          ua: ua.slice(0, 500),
          path: url.pathname.slice(0, 2000),
          status: response.status,
          ms: Date.now() - started,
          ...(ip ? { ip: ip.slice(0, 64) } : {}),
        };
        ctx.waitUntil(sendHit(env, hit));
      }
    } catch {
      // Never break the page.
    }
    return response;
  },
};

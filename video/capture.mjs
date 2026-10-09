#!/usr/bin/env node
// What the agent recreates the video from, read by Playwright: the brand from
// the landing page, and reference shots of the real product. The video never
// shows these shots: each scene is the screen rebuilt in HTML and animated
// (src/scenes/). The shots and their text are what the rebuild copies.
//
//   node capture.mjs [shots.json]
//
// shots.json lists the screens to copy, each reached by a few steps in one
// browser session (so a login in the first shot holds for the rest):
//
//   {
//     "base": "https://app.example.com",
//     "brand": { "url": "https://example.com" },
//     "login": { "url": "/login", "until": "text=Projects" },
//     "shots": [{ "name": "1", "steps": [{ "goto": "/projects/new" }] }]
//   }
//
// `login`: a browser window opens on that page, the founder signs in by hand
// (up to 5 minutes), and the shots run once `until` is on screen. Their
// password never passes through the agent or a file. A local app with seed
// data can use fill steps instead, a value starting with $ read from the
// environment.
//
// Steps: goto, click, fill [selector, value], press [selector, key], hover,
// scroll (a selector to bring to the middle of the screen), waitFor (a
// selector), wait (ms). `hide` removes banners from every shot.
//
// The brand comes from the landing page (`brand.url`, default the site root
// of `base`): the logo as the site header shows it (a transparent PNG;
// "logo": "<selector>" when it picks the wrong element), the font files its
// headings and body text use, and its background, text, muted and accent
// colors.
//
// Writes public/brand/ (brand.json, logo.png and the fonts), which the video
// uses, and ref/<name>.png and ref/<name>.txt (the screen's text), which the
// agent reads. With no shots (a CLI, an agent in a terminal), only the brand.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const file = process.argv[2] ?? "shots.json";
const spec = JSON.parse(readFileSync(file, "utf8"));
const viewport = spec.viewport ?? { width: 1160, height: 900 };
const OUT = "ref";
const BRAND = "public/brand";
mkdirSync(OUT, { recursive: true });
mkdirSync(BRAND, { recursive: true });

const value = (v) => {
  if (typeof v !== "string" || !v.startsWith("$")) return v;
  const env = process.env[v.slice(1)];
  if (env === undefined) throw new Error(`${v} is not set in the environment`);
  return env;
};
const url = (u) => new URL(u, spec.base).toString();

const browser = await chromium.launch({ headless: !spec.login });

/** Whether a CSS unicode-range ("u+0000-00ff", "u+00??", "U+0041") includes a code point. */
const covers = (range, cp) =>
  range.split(",").some((part) => {
    const m = /u\+([0-9a-f?]+)(?:-([0-9a-f]+))?/i.exec(part.trim());
    if (!m) return false;
    const lo = parseInt(m[1].replace(/\?/g, "0"), 16);
    const hi = m[2] ? parseInt(m[2], 16) : parseInt(m[1].replace(/\?/g, "f"), 16);
    return cp >= lo && cp <= hi;
  });

/** The landing page's logo, fonts and colors, into public/brand/. */
async function readBrand() {
  const site = spec.brand?.url ?? new URL("/", spec.base).toString();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 4, colorScheme: spec.colorScheme ?? "light" });
  const p = await ctx.newPage();
  const brand = { site, colors: {}, fonts: {}, logo: null };
  try {
    await p.goto(site, { waitUntil: "networkidle", timeout: 45_000 });
    await p.evaluate(() => document.fonts.ready);

    const found = await p.evaluate(() => {
      const visible = (e) => {
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && r.top < innerHeight;
      };
      const clear = (c) => !c || c === "transparent" || /rgba\(.*,\s*0\)$/.test(c);
      const bg = [document.body, document.documentElement].map((e) => getComputedStyle(e).backgroundColor).find((c) => !clear(c)) ?? "rgb(255, 255, 255)";
      const h1 = document.querySelector("h1");
      const para = [...document.querySelectorAll("main p, p")].find(visible);
      const cta = [...document.querySelectorAll("main a, main button, header a, a, button")].find((e) => visible(e) && !clear(getComputedStyle(e).backgroundColor) && getComputedStyle(e).backgroundColor !== bg);
      const family = (e) => (e ? getComputedStyle(e).fontFamily.split(",")[0].trim().replace(/^["']|["']$/g, "") : null);
      return {
        colors: {
          bg,
          fg: h1 ? getComputedStyle(h1).color : getComputedStyle(document.body).color,
          muted: para ? getComputedStyle(para).color : null,
          accent: cta ? getComputedStyle(cta).backgroundColor : null,
          accentFg: cta ? getComputedStyle(cta).color : null,
        },
        heading: family(h1),
        body: family(para ?? document.body),
        weights: { heading: h1 ? getComputedStyle(h1).fontWeight : "700", body: para ? getComputedStyle(para).fontWeight : "400" },
        sheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href),
        inline: [...document.querySelectorAll("style")].map((s) => s.textContent ?? ""),
      };
    });
    brand.colors = Object.fromEntries(Object.entries(found.colors).filter(([, v]) => v));

    // Every @font-face the page loads, from its stylesheets and inline styles.
    const css = [...found.inline.map((text) => ({ text, base: site }))];
    for (const href of found.sheets) {
      const r = await p.request.get(href).catch(() => null);
      if (r?.ok()) css.push({ text: await r.text(), base: href });
    }
    const faces = [];
    for (const { text, base } of css) {
      for (const block of text.match(/@font-face\s*{[^}]*}/g) ?? []) {
        const prop = (name) => new RegExp(`${name}\\s*:\\s*([^;}]+)`).exec(block)?.[1]?.trim();
        const fam = prop("font-family")?.replace(/^["']|["']$/g, "");
        const src = prop("src") ?? "";
        const urls = [...src.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)\s*format\(\s*["']?([\w-]+)/g)].map((m) => ({ url: m[1], format: m[2] }));
        const plain = urls.length ? urls : [...src.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map((m) => ({ url: m[1], format: "" }));
        const pick = plain.find((u) => /woff2/.test(u.format) || /\.woff2/.test(u.url)) ?? plain[0];
        if (!fam || !pick || pick.url.startsWith("data:")) continue;
        const range = prop("unicode-range")?.replace(/}$/, "");
        // Latin only: a family split by unicode-range keeps the block with basic letters.
        if (range && !covers(range, 0x41)) continue;
        faces.push({ family: fam, weight: prop("font-weight") ?? "400", style: prop("font-style") ?? "normal", url: new URL(pick.url, base).toString() });
      }
    }
    for (const role of ["heading", "body"]) {
      const fam = found[role];
      const mine = faces.filter((f) => f.family === fam && f.style === "normal");
      if (!fam || !mine.length) continue;
      const files = [];
      for (const [i, f] of mine.entries()) {
        const r = await p.request.get(f.url).catch(() => null);
        if (!r?.ok()) continue;
        const ext = /\.(woff2?|ttf|otf)(\?|$)/.exec(f.url)?.[1] ?? "woff2";
        const name = `brand/${role}-${i}.${ext}`;
        writeFileSync(`public/${name}`, await r.body());
        files.push({ file: name, weight: f.weight });
      }
      if (files.length) brand.fonts[role] = { family: fam, weight: found.weights[role], files };
    }

    // The logo as the header shows it: the link home, else the first image or svg in the header.
    const sel = spec.brand?.logo ?? 'header a[href="/"], nav a[href="/"], header [class*="logo" i], header svg, header img, a[href="/"] img, a[href="/"] svg';
    const logo = p.locator(sel).first();
    if (await logo.count()) {
      const box = await logo.boundingBox();
      if (box && box.width > 8 && box.height > 8 && box.height < 200) {
        await logo.screenshot({ path: `${BRAND}/logo.png`, omitBackground: true });
        brand.logo = { file: "brand/logo.png", width: box.width, height: box.height };
      }
    }
  } finally {
    await ctx.close();
  }
  writeFileSync(`${BRAND}/brand.json`, JSON.stringify(brand, null, 2));
  const f = brand.fonts;
  console.log(`brand from ${site}: logo ${brand.logo ? `${Math.round(brand.logo.width)}x${Math.round(brand.logo.height)}` : "not found"}, heading font ${f.heading?.family ?? "not found"} (${f.heading?.files.length ?? 0} files), body font ${f.body?.family ?? "not found"}, colors ${JSON.stringify(brand.colors)}`);
}

const context = await browser.newContext({ viewport, deviceScaleFactor: 2, colorScheme: spec.colorScheme ?? "light", reducedMotion: "reduce" });
const page = await context.newPage();

try {
  await readBrand();
  if (spec.login) {
    await page.goto(url(spec.login.url), { waitUntil: "domcontentloaded" });
    console.log("Sign in in the browser window that just opened. The shots start once you are in.");
    await page.locator(spec.login.until).first().waitFor({ timeout: 300_000 });
  }
  for (const shot of spec.shots ?? []) {
    for (const step of shot.steps ?? []) {
      if (step.goto) await page.goto(url(step.goto), { waitUntil: "networkidle", timeout: 45_000 });
      else if (step.click) await page.locator(step.click).first().click();
      else if (step.fill) await page.locator(step.fill[0]).first().fill(value(step.fill[1]));
      else if (step.press) await page.locator(step.press[0]).first().press(step.press[1]);
      else if (step.hover) await page.locator(step.hover).first().hover();
      else if (step.scroll) await page.locator(step.scroll).first().evaluate((e) => e.scrollIntoView({ block: "center" }));
      else if (step.waitFor) await page.locator(step.waitFor).first().waitFor({ timeout: 30_000 });
      else if (step.wait) await page.waitForTimeout(step.wait);
    }
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    const css = (spec.hide ?? []).map((sel) => `${sel} { display: none !important; }`).join("\n");
    await page.screenshot({ path: `${OUT}/${shot.name}.png`, style: css, animations: "disabled" });
    writeFileSync(`${OUT}/${shot.name}.txt`, await page.evaluate(() => document.body.innerText));
    console.log(`ref ${shot.name}: ${page.url()}`);
  }
} finally {
  await browser.close();
}

console.log(`${(spec.shots ?? []).length} reference shots in ${OUT}/`);

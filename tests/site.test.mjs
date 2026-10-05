// Run: node --test tests/
// Checks the built pages: language redirect logic, no-JS readability, links, GPTVoice honesty.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const pages = { en: read("index.html"), fr: read("fr/index.html") };

// ---- language script, executed in a sandbox ----
function headScript(html) {
  const m = html.match(/<script>\s*\/\* Language:[\s\S]*?<\/script>/);
  assert.ok(m, "inline language script present");
  return m[0].replace(/^<script>/, "").replace(/<\/script>$/, "");
}
function runLang(lang, { search = "", hash = "", saved = null, navLang = "en-US", storage = "ok" } = {}) {
  const store = new Map(saved ? [["gmfc-lang", saved]] : []);
  const res = { redirect: null, replaced: null };
  const localStorage = {
    getItem: (k) => { if (storage === "blocked") throw new Error("SecurityError"); return store.has(k) ? store.get(k) : null; },
    setItem: (k, v) => { if (storage !== "ok") throw new Error("QuotaExceeded"); store.set(k, v); },
  };
  const ctx = {
    URLSearchParams,
    location: { search, hash, pathname: lang === "en" ? "/" : "/fr/", replace: (u) => (res.redirect = u) },
    navigator: { languages: [navLang], language: navLang },
    history: { replaceState: (_a, _b, u) => (res.replaced = u) },
    get localStorage() { if (storage === "blocked") throw new Error("SecurityError"); return localStorage; },
  };
  vm.runInNewContext(headScript(pages[lang]), ctx);
  return { ...res, saved: store.get("gmfc-lang") ?? null };
}

test("EN page, English browser, no choice: stays", () => {
  assert.equal(runLang("en").redirect, null);
});
test("EN page, French browser, no choice: goes to fr/ keeping the hash", () => {
  assert.equal(runLang("en", { navLang: "fr-FR", hash: "#faq" }).redirect, "fr/#faq");
});
test("FR page is never auto-redirected by browser language (crawlers, shared links)", () => {
  assert.equal(runLang("fr", { navLang: "en-US" }).redirect, null);
});
test("saved choice wins over browser language", () => {
  assert.equal(runLang("en", { navLang: "fr-FR", saved: "en" }).redirect, null);
  assert.equal(runLang("fr", { saved: "en" }).redirect, "../");
  assert.equal(runLang("en", { saved: "fr" }).redirect, "fr/");
});
test("explicit ?lang= is saved, URL cleaned, no redirect", () => {
  const r = runLang("en", { search: "?lang=en", navLang: "fr-FR", hash: "#tools" });
  assert.equal(r.redirect, null);
  assert.equal(r.saved, "en");
  assert.equal(r.replaced, "/#tools");
});
test("storage blocked: ?lang= still honored and kept in URL; no crash", () => {
  const r = runLang("en", { search: "?lang=en", navLang: "fr-FR", storage: "blocked" });
  assert.equal(r.redirect, null);
  assert.equal(r.replaced, null, "param kept so a reload keeps the choice");
  assert.equal(runLang("en", { navLang: "fr-FR", storage: "blocked" }).redirect, "fr/");
  assert.equal(runLang("fr", { storage: "blocked" }).redirect, null);
});
test("storage write fails (quota/private mode): no crash, choice honored", () => {
  const r = runLang("fr", { search: "?lang=fr", storage: "readonly" });
  assert.equal(r.redirect, null);
  assert.equal(r.replaced, null);
});
test("invalid ?lang= and invalid saved value are ignored", () => {
  assert.equal(runLang("en", { search: "?lang=de" }).redirect, null);
  assert.equal(runLang("en", { saved: "xx", navLang: "fr" }).redirect, "fr/");
});

// ---- static content (works without JavaScript) ----
for (const [lang, html] of Object.entries(pages)) {
  test(`${lang}: html lang, one h1, landmarks, skip link`, () => {
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    for (const tag of ["<header", "<main id=\"main\"", "<footer", "<nav"]) assert.ok(html.includes(tag), tag);
    assert.ok(html.includes('class="skip" href="#main"'));
  });
  test(`${lang}: every img has alt and dimensions`, () => {
    const imgs = html.match(/<img\b[^>]*>/g);
    assert.ok(imgs.length >= 6);
    for (const i of imgs) {
      assert.match(i, /\balt="/, i);
      assert.match(i, /\bwidth="\d+"/, i);
      assert.match(i, /\bheight="\d+"/, i);
    }
  });
  test(`${lang}: all local assets referenced exist`, () => {
    const base = lang === "en" ? "" : "fr/";
    const refs = [...html.matchAll(/(?:src|href|srcset)="([^"]+)"/g)].flatMap((m) => m[1].split(",").map((s) => s.trim().split(" ")[0]));
    for (const r of refs) {
      if (/^(https?:|#|mailto:)/.test(r) || r.includes("?lang=")) continue;
      const p = join(ROOT, base, r.split("?")[0]);
      assert.ok(existsSync(p), `missing ${r}`);
    }
  });
  test(`${lang}: in-page anchors resolve`, () => {
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(m[1]), `#${m[1]}`);
  });
  test(`${lang}: copy buttons hidden until JS runs; install text present`, () => {
    for (const b of html.match(/<button[^>]*data-copy[^>]*>/g)) assert.match(b, /\bhidden\b/);
    assert.ok(html.includes("git clone https://github.com/Connected-Mate/gptimage.git"));
  });
  test(`${lang}: GPTVoice shown as preview, install only with a public repo, real audio files and only verified numbers`, () => {
    const voice = html.slice(html.indexOf('id="gptvoice"'), html.indexOf('id="film"'));
    assert.match(voice, /data-status="preview"/);
    // Install command only once the repository is public (repo set in content/gptvoice.mjs).
    const hasRepo = /github\.com\/[^"]+\/gptvoice"/.test(voice);
    assert.equal(voice.includes("git clone https://github.com/Connected-Mate/gptvoice.git"), hasRepo, "install shown iff repo public");
    // 10 voices = the set verified against the live endpoint (alloy, ash, ballad, coral, echo, sage, shimmer, verse, marin, cedar).
    for (const m of html.matchAll(/\b(\d+)\s+(voices|voix)\b/gi)) assert.equal(m[1], "10", `unverified voice count: ${m[0]}`);
    const srcs = [...html.matchAll(/<source[^>]+src="([^"]+\.mp3)"/g)].map((m) => m[1]);
    assert.ok(srcs.length >= 3, "audio players present");
    for (const src of srcs) assert.ok(existsSync(join(ROOT, lang === "fr" ? join("fr", src) : src)), `missing audio ${src}`);
  });
  test(`${lang}: grey-area notice near the top and full section present`, () => {
    assert.ok(html.indexOf('class="notice"') < html.indexOf('id="how"'));
    assert.ok(html.includes('id="grey"'));
  });
  test(`${lang}: hreflang alternates and canonical`, () => {
    assert.match(html, /hreflang="en"/);
    assert.match(html, /hreflang="fr"/);
    assert.match(html, /hreflang="x-default"/);
    assert.match(html, /<link rel="canonical" href="https:\/\/[^"]+">/);
  });
}

test("FR page has no leftover English UI strings", () => {
  for (const s of ["Skip to content", "Copy<", "How it works", "Install GPTImage", "Questions about"]) {
    assert.ok(!pages.fr.includes(s), s);
  }
});
test("404 and sitemap exist", () => {
  assert.ok(existsSync(join(ROOT, "404.html")));
  assert.match(read("sitemap.xml"), /<loc>https:\/\/[^<]+\/fr\/<\/loc>/);
});

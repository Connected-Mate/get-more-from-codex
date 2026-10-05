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
const ROUTES = {
  home: { en: "", fr: "fr/" },
  images: { en: "images/", fr: "fr/images/" },
  voices: { en: "voices/", fr: "fr/voix/" },
  how: { en: "how-it-works/", fr: "fr/comment-ca-marche/" },
};
const all = Object.entries(ROUTES).flatMap(([name, r]) => Object.entries(r).map(([lang, path]) => ({ name, lang, path, html: read(path + "index.html") })));
const page = (name, lang) => all.find((p) => p.name === name && p.lang === lang).html;

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
for (const { name, lang, path, html } of all) {
  const id = `${lang}/${name}`;
  test(`${id}: html lang, one h1, landmarks, skip link, title`, () => {
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    for (const tag of ["<header", '<main id="main"', "<footer", "<nav"]) assert.ok(html.includes(tag), tag);
    assert.ok(html.includes('class="skip" href="#main"'));
    assert.match(html, /<title>[^<]{10,}<\/title>/);
  });
  test(`${id}: every img has alt and dimensions`, () => {
    for (const i of html.match(/<img\b[^>]*>/g) || []) {
      assert.match(i, /\balt="/, i);
      assert.match(i, /\bwidth="\d+"/, i);
      assert.match(i, /\bheight="\d+"/, i);
    }
  });
  test(`${id}: all local links and assets exist`, () => {
    const refs = [...html.matchAll(/(?:src|href|srcset)="([^"]+)"/g)].flatMap((m) => m[1].split(",").map((s) => s.trim().split(" ")[0]));
    for (const r of refs) {
      if (/^(https?:|#|mailto:)/.test(r)) continue;
      let p = join(ROOT, path, r.split("?")[0].split("#")[0]);
      if (p.endsWith("/") || !/\.[a-z0-9]+$/i.test(p)) p = join(p, "index.html");
      assert.ok(existsSync(p), `missing ${r} (from ${path || "/"})`);
    }
  });
  test(`${id}: in-page anchors resolve`, () => {
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(m[1]), `#${m[1]}`);
  });
  test(`${id}: cross-page anchors resolve`, () => {
    for (const m of html.matchAll(/href="((?:\.\.\/)*[a-z/-]*)#([a-z0-9-]+)"/g)) {
      let target = join(ROOT, path, m[1] || "", "index.html");
      if (!m[1]) continue;
      assert.ok(existsSync(target), `missing page ${m[1]}`);
      assert.ok(readFileSync(target, "utf8").includes(`id="${m[2]}"`), `${m[1]}#${m[2]}`);
    }
  });
  test(`${id}: copy buttons hidden until JS runs`, () => {
    for (const b of html.match(/<button[^>]*data-copy[^>]*>/g) || []) assert.match(b, /\bhidden\b/);
  });
  test(`${id}: hreflang alternates, canonical, language switch to the same page`, () => {
    assert.match(html, /hreflang="en"/);
    assert.match(html, /hreflang="fr"/);
    assert.match(html, /hreflang="x-default"/);
    assert.match(html, /<link rel="canonical" href="https:\/\/[^"]+">/);
    const other = lang === "en" ? "fr" : "en";
    const sw = html.match(new RegExp(`href="([^"]*)\\?lang=${other}"`));
    assert.ok(sw, "language switch link");
    const target = join(ROOT, path, sw[1], "index.html");
    assert.equal(target, join(ROOT, ROUTES[name][other], "index.html"));
  });
  test(`${id}: wording uses "generate", no abstract diagram`, () => {
    assert.ok(!html.includes("flow-art"));
    assert.ok(!/Make (images|voices)|Créer des (images|voix)/.test(html));
  });
  test(`${id}: no unverified cost claim for voices, no gptvoice clone while repo is private`, () => {
    assert.ok(!html.includes("No extra bill"));
    assert.ok(!html.includes("gptvoice.git"));
  });
}

for (const lang of ["en", "fr"]) {
  test(`${lang}: images page has GPTImage install and per-agent setup`, () => {
    const html = page("images", lang);
    assert.ok(html.includes("git clone https://github.com/Connected-Mate/gptimage.git"));
    assert.ok(html.includes("codex mcp add gptimage -- node /path/to/gptimage/src/server.js"));
    assert.ok(html.includes("&quot;mcpServers&quot;"));
  });
  test(`${lang}: voices page: gallery of 10 voices, demos with transcripts, cost note`, () => {
    const html = page("voices", lang);
    assert.match(html, /data-status="(preview|released|development)"/);
    const voices = html.match(/<li class="voice" data-gender="(female|male|neutral)">/g) || [];
    assert.equal(voices.length, 10);
    const plays = [...html.matchAll(/class="play" href="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(plays.length, 20);
    const demos = html.match(/<li class="sample" data-sample>[\s\S]*?<\/li>/g) || [];
    assert.ok(demos.length >= 5, "demo clips");
    for (const d of demos) assert.match(d, /<details class="transcript">[\s\S]*<p lang="(en|fr)">[^<]{10,}<\/p>/);
    assert.ok(html.includes("platform.openai.com/usage"), "billing caveat");
    for (const m of html.matchAll(/\b(\d+)\s+(voices|voix)\b/gi)) assert.equal(m[1], "10", `unverified voice count: ${m[0]}`);
  });
  test(`${lang}: how page has flow, table, setup, FAQ and grey area`, () => {
    const html = page("how", lang);
    for (const id of ['id="setup"', 'id="faq"', 'id="grey"', 'class="compare"']) assert.ok(html.includes(id), id);
    assert.ok(html.includes("platform.openai.com/usage"));
  });
  test(`${lang}: home links to every page and shows the honest note`, () => {
    const html = page("home", lang);
    assert.ok(html.indexOf('class="notice"') > 0);
    for (const n of ["images", "voices", "how"]) assert.ok(html.includes(`href="${ROUTES[n][lang].replace(/^fr\//, "")}`), n);
  });
}

test("FR pages have no leftover English UI strings", () => {
  for (const p of all.filter((x) => x.lang === "fr")) {
    for (const s of ["Skip to content", ">Copy<", "How it works<", "Install GPTImage", "Best for", "Recommended"]) assert.ok(!p.html.includes(s), `${p.path}: ${s}`);
  }
});
test("404, sitemap with 8 URLs, mascot icons", () => {
  assert.ok(existsSync(join(ROOT, "404.html")));
  assert.equal((read("sitemap.xml").match(/<loc>/g) || []).length, 8);
  assert.ok(existsSync(join(ROOT, "assets/favicon-32.png")));
  assert.ok(!existsSync(join(ROOT, "assets/mark.svg")), "ring mark removed");
});

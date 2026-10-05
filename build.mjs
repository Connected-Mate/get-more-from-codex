#!/usr/bin/env node
// Builds the static site from content/*.mjs.
//   node build.mjs
// Outputs, for each language: home, images, voices, how-it-works pages, plus 404.html,
// sitemap.xml and robots.txt. No dependencies. Generated files are committed, so
// GitHub Pages serves them as-is.

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { t, SITE_URL, GPTIMAGE_REPO, ROUTES, AGENTS } from "./content/site.mjs";
import { gptvoice as RAW } from "./content/gptvoice.mjs";

// Entries flagged `hidden` stay in the data file but never reach the page.
const V = { ...RAW, samples: RAW.samples.filter((s) => !s.hidden) };

const ROOT = dirname(fileURLToPath(import.meta.url));
const LANGS = ["en", "fr"];
const PAGES = ["home", "images", "voices", "how"];

const ver = (f) => createHash("sha1").update(readFileSync(join(ROOT, f))).digest("hex").slice(0, 8);
const CSS_V = ver("assets/site.css");
const JS_V = ver("assets/site.js");

// ---------- helpers ----------
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const attr = esc;
const strip = (s) => String(s).replace(/<[^>]+>/g, "");
const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
const depth = (path) => path.split("/").filter(Boolean).length;
const baseFor = (path) => "../".repeat(depth(path));
// Link from page `fromPath` to route `to` in `lang`.
function rel(fromPath, toPath) {
  const a = fromPath.split("/").filter(Boolean);
  const b = toPath.split("/").filter(Boolean);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const r = "../".repeat(a.length - i) + b.slice(i).map((x) => x + "/").join("");
  return r || "./";
}
const href = (fromPath, to, lang, hash = "") => rel(fromPath, ROUTES[to][lang]) + hash;

function validateVoice() {
  const ok = ["development", "preview", "released"];
  if (!ok.includes(V.status)) throw new Error(`gptvoice.status must be one of ${ok.join(", ")}`);
  if (V.repo !== null && !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(V.repo))
    throw new Error("gptvoice.repo must be null or a https://github.com/<owner>/<repo> URL");
  if (V.install !== null && !(Array.isArray(V.install) && V.install.every((l) => typeof l === "string")))
    throw new Error("gptvoice.install must be null or an array of strings");
  for (const v of V.voices ?? []) {
    for (const l of ["en", "fr"]) {
      const f = join(ROOT, "assets/audio/voices", `${v.id}-${l}.mp3`);
      if (!existsSync(f)) throw new Error(`voice ${v.id}: missing sample ${f}`);
    }
  }
  for (const s of V.samples) {
    if (!s.id || !/^[a-z0-9-]+$/.test(s.id)) throw new Error(`sample id invalid: ${s.id}`);
    if (!s.transcript) throw new Error(`sample ${s.id} needs a transcript`);
    if (s.src !== null) {
      if (/^(https?:)?\/\//.test(s.src) || s.src.startsWith("/") || s.src.includes(".."))
        throw new Error(`sample ${s.id}: src must be a relative path inside the site, e.g. assets/audio/x.mp3`);
      if (!existsSync(join(ROOT, s.src))) throw new Error(`sample ${s.id}: file not found: ${s.src}`);
    }
  }
}
const voicePublic = () => V.status !== "development" && Boolean(V.install && V.repo);

const IMG = {
  hero: { w: [800, 1200, 1774], ratio: [1774, 887] },
  mascot: { w: [360, 720], ratio: [1074, 1014] },
  voice: { w: [360, 720], ratio: [974, 994] },
  "story-1": { w: [640, 1000, 1600], ratio: [1600, 900] },
  "story-2": { w: [640, 1000, 1600], ratio: [1600, 900] },
  "story-3": { w: [640, 1000, 1600], ratio: [1600, 900] },
};

function picture(base, name, alt, sizes, { eager = false, cls = "" } = {}) {
  const { w, ratio } = IMG[name];
  const set = (ext) => w.map((x) => `${base}assets/img/${name}-${x}.${ext} ${x}w`).join(", ");
  const fallback = `${base}assets/img/${name}-${w[Math.min(1, w.length - 1)]}.webp`;
  return `<picture${cls ? ` class="${cls}"` : ""}>
      <source type="image/avif" srcset="${set("avif")}" sizes="${sizes}">
      <source type="image/webp" srcset="${set("webp")}" sizes="${sizes}">
      <img src="${fallback}" alt="${attr(alt)}" width="${ratio[0]}" height="${ratio[1]}" ${
        eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'
      }>
    </picture>`;
}

function codeBlock(L, lines, label, cls = "") {
  const C = L.common;
  return `<div class="codeblock${cls ? " " + cls : ""}">
          <div class="codebar"><span>${esc(label)}</span><button type="button" class="copy" data-copy data-copied="${attr(C.copied)}" data-failed="${attr(C.copyFailed)}" hidden>${esc(C.copy)}</button></div>
          <pre tabindex="0" aria-label="${attr(label)}"><code>${lines.map(esc).join("\n")}</code></pre>
          <p class="copy-status" role="status" aria-live="polite"></p>
        </div>`;
}

// "Let your agent install it": a copyable prompt for any coding agent.
function starter(L, text, { id = "install-prompt", heading = "h2", title = "" } = {}) {
  const S = L.starter;
  return `<div class="starter" id="${id}">
      <div class="starter-head">
        <${heading}>${esc(title || S.h)}</${heading}>
        <p>${esc(S.p)}</p>
      </div>
      ${codeBlock(L, text.split("\n"), S.label, "is-prompt")}
      <p class="note">${esc(S.note)}</p>
    </div>`;
}

function sample(L, base, s) {
  const lang = L.htmlLang;
  const C = L.common;
  const title = esc(s.title[lang]);
  const meta = esc(s.voice[lang]);
  const tr = `<details class="transcript"><summary>${esc(C.transcript)}</summary><p lang="${attr(s.lang)}">${esc(s.transcript)}</p></details>`;
  if (!s.src) {
    return `<li class="sample is-soon">
            <div class="sample-head"><h4>${title}</h4><p class="meta">${meta}</p></div>
            <div class="sample-soon"><p>${esc(C.sampleSoon)}</p><blockquote lang="${attr(s.lang)}">${esc(s.transcript)}</blockquote></div>
          </li>`;
  }
  return `<li class="sample" data-sample>
            <div class="sample-head"><h4 id="s-${s.id}">${title}</h4><p class="meta">${meta}</p></div>
            <div>
              <audio controls preload="none" aria-labelledby="s-${s.id}"><source src="${base}${attr(s.src)}" type="${attr(s.type || "audio/mpeg")}"></audio>
              <p class="audio-error" hidden>${esc(C.audioError)}</p>
              ${tr}
            </div>
          </li>`;
}

function gallery(L, base) {
  const lang = L.htmlLang;
  const G = L.listen;
  const genders = ["female", "male", "neutral"].filter((g) => V.voices.some((v) => v.gender === g));
  return `<div class="gallery" data-gallery>
      <div class="gallery-head">
        <h3 class="sub-h" id="voices-h">${esc(G.galleryH.replace("{n}", V.voices.length))}</h3>
        <div class="filters" role="group" aria-label="${attr(G.filterLabel)}" hidden>
          <button type="button" data-filter="all" aria-pressed="true">${esc(G.all)}</button>
          ${genders.map((g) => `<button type="button" data-filter="${g}" aria-pressed="false">${esc(G.genders[g])}</button>`).join("")}
        </div>
      </div>
      <div class="voice-line">
        <p>${esc(G.lineIntro)}</p>
        <p lang="en">${esc(V.voiceLine.en.replace("{Name}", cap(V.voices[0].id)))}</p>
        <p lang="fr">${esc(V.voiceLine.fr.replace("{Name}", cap(V.voices[0].id)))}</p>
      </div>
      <p class="sr" role="status" aria-live="polite" data-gallery-status></p>
      <ul class="voices" aria-labelledby="voices-h">
        ${V.voices.map((v) => {
          const name = cap(v.id);
          const label = (l) => G.playLabel.replace("{name}", name).replace("{lang}", G.langs[l]);
          const play = (l) => `<a class="play" href="${base}assets/audio/voices/${v.id}-${l}.mp3" data-play aria-label="${attr(label(l))}"><span class="play-icon" aria-hidden="true"></span><span aria-hidden="true">${l.toUpperCase()}</span></a>`;
          return `<li class="voice" data-gender="${v.gender}">
          <div class="v-head"><h4>${name}</h4><span class="v-gender">${esc(G.genders[v.gender])}</span>${v.recommended ? `<span class="badge is-soon">${esc(G.recommended)}</span>` : ""}</div>
          <p class="v-tags">${v.tags[lang].map(esc).join(" · ")}</p>
          <p class="v-best"><span>${esc(G.bestFor)}</span> ${esc(v.bestFor[lang])}</p>
          <div class="v-play">${play("en")}${play("fr")}</div>
        </li>`;
        }).join("\n        ")}
      </ul>
    </div>`;
}

// Step pipeline used by the "under the hood" blocks.
function pipeline(steps, cls = "") {
  return `<ol class="pipeline${cls ? " " + cls : ""}">
      ${steps.map((s, i) => `<li><span class="pipe-n" aria-hidden="true">0${i + 1}</span><h3>${esc(s.h)}</h3><p>${s.p}</p></li>`).join("\n      ")}
    </ol>`;
}

// Per-agent setup. `tool` is "gptimage" or "gptvoice".
function setup(L, tool, { id }) {
  const A = L.agents;
  const C = L.common;
  const path = `/path/to/${tool}/src/server.js`;
  const login = tool === "gptimage" ? ["npm install", "npm run login"] : ["npm install", "npm run login"];
  const snippets = {
    claude: tool === "gptimage" ? L.images.gptimage.install : V.install,
    codex: [`cd /path/to/${tool}`, ...login, `codex mcp add ${tool} -- node ${path}`],
    cursor: [`{`, `  "mcpServers": {`, `    "${tool}": {`, `      "command": "node",`, `      "args": ["${path}"]`, `    }`, `  }`, `}`],
    other: [`command: node`, `args:    ${path}`],
  };
  return `<div class="setup" id="${id}">
      ${AGENTS.map((a, i) => `<details class="agent"${i === 0 ? " open" : ""}>
        <summary><span class="agent-name">${esc(A[a].name)}</span><span class="agent-state${a === "claude" ? " is-tested" : ""}">${esc(a === "claude" ? C.tested : C.untested)}</span></summary>
        <div class="agent-body">
          <p>${A[a].how}</p>
          ${codeBlock(L, snippets[a], a === "cursor" ? "mcp.json" : C.codeLabel)}
          ${a !== "claude" ? `<p class="note">${L.signInNote} ${L.pathNote}</p>` : ""}
        </div>
      </details>`).join("\n      ")}
    </div>`;
}

// ---------- shell ----------
function layout(lang, page, { title, description, body, ogImage = "assets/og.png" }) {
  const L = t[lang];
  const path = ROUTES[page][lang];
  const base = baseFor(path);
  const url = SITE_URL + path;
  const other = lang === "en" ? "fr" : "en";
  const enPath = ROUTES[page].en;
  const frPath = ROUTES[page].fr;

  const langSwitch = LANGS.map((l) => {
    const target = rel(path, ROUTES[page][l]) + `?lang=${l}`;
    const cur = l === lang ? ' aria-current="page"' : "";
    return `<a href="${target}" hreflang="${l}" lang="${l}" data-lang-link="${l}"${cur}><span aria-hidden="true">${l.toUpperCase()}</span><span class="sr">${esc(L.langNames[l])}</span></a>`;
  }).join("");

  const navItems = ["images", "voices", "how"].map((p) => {
    const cur = p === page ? ' aria-current="page"' : "";
    return `<a href="${href(path, p, lang)}"${cur}>${esc(L.nav[p])}</a>`;
  }).join("\n      ");

  // Redirect target for the language script: same page in the other language, relative to here.
  const toFr = rel(path, frPath);
  const toEn = rel(path, enPath);

  return `<!doctype html>
<html lang="${L.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0a0a0a">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${SITE_URL}${enPath}">
<link rel="alternate" hreflang="fr" href="${SITE_URL}${frPath}">
<link rel="alternate" hreflang="x-default" href="${SITE_URL}${enPath}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${attr(L.brand)}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${L.ogLocale}">
<meta property="og:locale:alternate" content="${t[other].ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(description)}">
<meta name="twitter:image" content="${SITE_URL}${ogImage}">
<link rel="icon" href="${base}assets/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="${base}assets/apple-touch-icon.png">
<link rel="preload" href="${base}assets/fonts/dmsans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}assets/fonts/geist.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${base}assets/site.css?v=${CSS_V}">
<script>
/* Language: explicit ?lang= > saved choice > browser language (English pages only). Storage may be blocked. */
(function () {
  var page = "${lang}", q = null, saved = null, stored = false;
  try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
  if (q !== "en" && q !== "fr") q = null;
  try { if (q) { localStorage.setItem("gmfc-lang", q); stored = true; } saved = localStorage.getItem("gmfc-lang"); } catch (e) {}
  if (q) {
    if (stored && history.replaceState) history.replaceState(null, "", location.pathname + location.hash);
    return;
  }
  var want = saved === "en" || saved === "fr" ? saved : null;
  if (!want && page === "en") {
    var n = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    if (/^fr\\b/i.test(n)) want = "fr";
  }
  if (want && want !== page) location.replace((want === "fr" ? "${toFr}" : "${toEn}") + location.hash);
})();
</script>
</head>
<body data-page="${page}">
<a class="skip" href="#main">${esc(L.skip)}</a>

<header class="top">
  <div class="top-row">
    <a class="brand" href="${href(path, "home", lang)}"${page === "home" ? ' aria-current="page"' : ""}><img src="${base}assets/favicon-32.png" alt="" width="28" height="28"><span>${esc(L.brand)}</span></a>
    <nav class="mainnav" aria-label="${attr(L.navLabel)}">
      ${navItems}
    </nav>
    <nav class="lang" aria-label="${attr(L.langLabel)}">${langSwitch}</nav>
  </div>
  <nav class="subnav" aria-label="${attr(L.navLabel)}">
    ${navItems}
  </nav>
</header>

<main id="main">
${body}
</main>

<footer class="foot">
  <div class="wrap foot-grid">
    <div class="foot-brand">
      <p class="foot-mark"><img src="${base}assets/favicon-32.png" alt="" width="28" height="28"><span>${esc(L.brand)}</span></p>
      <p>${esc(L.footer.made)}</p>
      <p class="legal">${esc(L.footer.legal)}</p>
    </div>
    <ul class="foot-links">
      ${PAGES.map((p) => `<li><a href="${href(path, p, lang)}">${esc(L.nav[p])}</a></li>`).join("")}
    </ul>
    <ul class="foot-links">
      <li><a href="${GPTIMAGE_REPO}">${esc(L.footer.gptimage)}</a></li>
      ${V.repo ? `<li><a href="${attr(V.repo)}">${esc(L.footer.gptvoice)}</a></li>` : ""}
      <li><a href="#top">${esc(L.footer.top)}</a></li>
    </ul>
  </div>
</footer>
<script src="${base}assets/site.js?v=${JS_V}" defer></script>
</body>
</html>
`;
}

function pageHero(H, { art = "", cls = "" } = {}) {
  return `<section id="top" class="hero${cls ? " " + cls : ""}" aria-labelledby="hero-h">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      ${H.banner ?? ""}
      <p class="eyebrow">${esc(H.eyebrow)}</p>
      ${H.sub
        ? `<h1 id="hero-h" class="h1-stack"><span class="h1-main">${esc(H.h1)}</span> <span class="h1-sub">${esc(H.sub)}</span></h1>`
        : `<h1 id="hero-h" class="h1-main">${esc(H.h1)}</h1>`}
      <p class="lead">${H.lead}</p>
      <div class="cta">${H.ctas}</div>
      ${H.facts ? `<ul class="facts">${H.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
    </div>
    <div class="hero-art">${art}</div>
  </div>
</section>`;
}

// ---------- pages ----------
function home(lang) {
  const L = t[lang];
  const P = L.home;
  const path = ROUTES.home[lang];
  const base = baseFor(path);
  const H = P.hero;
  const banner = V.samples.length
    ? `<a class="banner" href="${href(path, "voices", lang, "#listen")}"><span class="spark" aria-hidden="true"></span>${esc(L.listen.banner[V.status])}<span aria-hidden="true">→</span></a>`
    : "";
  const body = `${pageHero({ ...H, banner, ctas: `<a class="btn" href="${href(path, "images", lang)}">${esc(H.cta1)}</a><a class="btn ghost" href="${href(path, "voices", lang)}">${esc(H.cta2)}</a><a class="cta-link" href="#install-prompt">${esc(L.starter.cta)} <span aria-hidden="true">↓</span></a>` }, { art: picture(base, "hero", H.alt, "(min-width: 1000px) 560px, calc(100vw - 32px)", { eager: true }), cls: "hero-home" })}

<aside class="notice" aria-label="${attr(P.notice.title.replace(/\.$/, ""))}">
  <div class="wrap notice-row">
    <strong>${esc(P.notice.title)}</strong>
    <p>${esc(P.notice.body)} <a href="${href(path, "how", lang, "#grey")}">${esc(P.notice.link)}</a>.</p>
  </div>
</aside>

<section class="starter-sec" aria-label="${attr(L.starter.h)}">
  <div class="wrap">
    <div class="starter-pair">
      ${starter(L, L.starter.gptimage, { title: L.starter.h + " · GPTImage" })}
      ${voicePublic() && V.agentPrompt ? starter(L, V.agentPrompt[lang], { id: "install-prompt-voice", title: L.starter.h + " · GPTVoice" }) : ""}
    </div>
  </div>
</section>

<section class="flow" aria-labelledby="flow-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.flow.kicker)}</p><h2 id="flow-h">${esc(P.flow.h2)}</h2></div>
    ${pipeline(P.flow.steps, "is-three")}
  </div>
</section>

<section class="products" aria-labelledby="products-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.products.kicker)}</p><h2 id="products-h">${esc(P.products.h2)}</h2></div>
    <div class="product-grid">
      ${["images", "voices"].map((k) => {
        const p = P.products[k];
        const badge = k === "images" ? L.common.badge.available : L.common.badge[V.status];
        return `<article class="product" aria-labelledby="pr-${k}">
        ${picture(base, k === "images" ? "mascot" : "voice", "", "(min-width: 900px) 200px, 40vw", { cls: "product-art" })}
        <div class="product-body">
          <div class="tool-title"><h3 id="pr-${k}">${esc(p.h)}</h3><span class="badge ${k === "images" || V.status !== "development" ? "is-live" : "is-soon"}">${esc(badge)}</span></div>
          <p>${esc(p.p)}</p>
          <ul class="feat">${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          <a class="btn ghost" href="${href(path, k, lang)}">${esc(p.cta)} <span aria-hidden="true">→</span></a>
        </div>
      </article>`;
      }).join("\n      ")}
    </div>
  </div>
</section>

<section class="agents-sec" aria-labelledby="agents-h">
  <div class="wrap agents-grid">
    <div>
      <p class="kicker">${esc(P.agents.kicker)}</p>
      <h2 id="agents-h">${esc(P.agents.h2)}</h2>
      <p class="sec-p">${esc(P.agents.p)}</p>
    </div>
    <div>
      <ul class="agent-chips">${AGENTS.map((a) => `<li${a === "claude" ? ' class="is-tested"' : ""}>${esc(L.agents[a].name)}</li>`).join("")}</ul>
      <p class="note">${esc(P.agents.note)}</p>
      <p class="note"><a href="${href(path, "how", lang, "#setup")}">${esc(P.agents.cta)}</a></p>
    </div>
  </div>
</section>

<section class="uses" aria-labelledby="uses-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.uses.kicker)}</p><h2 id="uses-h">${esc(P.uses.h2)}</h2></div>
    <ul class="use-list">
      ${P.uses.items.map((u, i) => `<li><a href="${href(path, u.to, lang, u.hash || "")}"><span class="pipe-n" aria-hidden="true">0${i + 1}</span><span class="use-h">${esc(u.h)}</span><span class="use-p">${esc(u.p)}</span><span class="use-go" aria-hidden="true">→</span></a></li>`).join("\n      ")}
    </ul>
  </div>
</section>`;
  return layout(lang, "home", { title: P.title, description: P.description, body });
}

function images(lang) {
  const L = t[lang];
  const P = L.images;
  const G = P.gptimage;
  const path = ROUTES.images[lang];
  const base = baseFor(path);
  const H = P.hero;
  const body = `${pageHero({ ...H, ctas: `<a class="btn" href="#install-prompt">${esc(H.cta1)}</a><a class="btn ghost" href="#tech">${esc(H.cta2)}</a>` }, { art: `<div class="art-frame">${picture(base, "mascot", H.alt, "(min-width: 1000px) 460px, 70vw", { eager: true })}</div>`, cls: "hero-product" })}

<section class="uses-cards" aria-labelledby="iu-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.uses.kicker)}</p><h2 id="iu-h">${esc(P.uses.h2)}</h2></div>
    <ul class="three">${P.uses.items.map((u) => `<li><h3>${esc(u.h)}</h3><p>${esc(u.p)}</p></li>`).join("")}</ul>
  </div>
</section>

<section id="tech" class="tech" aria-labelledby="tech-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.tech.kicker)}</p><h2 id="tech-h">${esc(P.tech.h2)}</h2><p>${esc(P.tech.intro)}</p></div>
    ${pipeline(P.tech.steps)}
    <p class="cost-note is-ok">${esc(P.cost)}</p>
    <p class="note"><a href="${href(path, "how", lang)}">${esc(L.common.readMore)}</a></p>
  </div>
</section>

<section id="install" class="tools" aria-labelledby="install-h">
  <div class="wrap">
    <article class="tool solo" aria-labelledby="install-h">
      <div class="tool-body">
        <div class="tool-title"><h2 id="install-h">GPTImage</h2><span class="badge is-live">${esc(L.common.badge.available)}</span></div>
        ${starter(L, L.starter.gptimage, { heading: "h3" })}
        <p class="tagline">${esc(G.tagline)}</p>
        <ul class="feat">${G.features.map((f) => `<li>${f}</li>`).join("")}</ul>
        <p class="label">${esc(L.common.examplePromptLabel)}</p>
        <p class="prompt">${esc(G.example)}</p>
        <p class="label">${esc(P.setupH)}</p>
        <p class="note">${esc(P.setupIntro)} ${esc(G.installNote)}</p>
        ${setup(L, "gptimage", { id: "setup-gptimage" })}
        <p class="note"><a href="${GPTIMAGE_REPO}">${esc(L.common.repoLink)}</a></p>
      </div>
    </article>
  </div>
</section>

<section id="film" class="film" aria-labelledby="film-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.film.kicker)}</p><h2 id="film-h">${esc(P.film.h2)}</h2><p>${P.film.intro}</p></div>
    <figure class="strip">
      <ol class="frames">
        ${P.film.frames.map((f, i) => `<li class="frame">
          ${picture(base, `story-${i + 1}`, f.alt, "(min-width: 900px) 360px, calc(100vw - 32px)")}
          <p class="scene">${esc(f.n)}</p>
          <p class="line">${esc(f.line)}</p>
        </li>`).join("\n        ")}
      </ol>
      <figcaption>${esc(P.film.caption)}</figcaption>
    </figure>
    <p class="cta"><a class="btn ghost" href="${href(path, "voices", lang)}">${esc(P.film.voiceCta)} <span aria-hidden="true">→</span></a></p>
  </div>
</section>`;
  return layout(lang, "images", { title: P.title, description: P.description, body });
}

function voices(lang) {
  const L = t[lang];
  const P = L.voices;
  const path = ROUTES.voices[lang];
  const base = baseFor(path);
  const H = P.hero;
  const live = V.status !== "development";
  const body = `${pageHero({ ...H, ctas: `<a class="btn" href="#listen">${esc(H.cta1)}</a><a class="btn ghost" href="#tech">${esc(H.cta2)}</a>` }, { art: `<div class="art-frame">${picture(base, "voice", H.alt, "(min-width: 1000px) 460px, 70vw", { eager: true })}</div>`, cls: "hero-product" })}

<section class="motion" aria-labelledby="motion-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.motion.kicker)}</p><h2 id="motion-h">${esc(P.motion.h2)}</h2></div>
    ${pipeline(P.motion.steps)}
    <p class="label">${esc(L.common.examplePromptLabel)}</p>
    <p class="prompt">${esc(P.motion.example)}</p>
    ${P.motion.tip ? `<div class="tip" id="clips">
      <h3>${esc(P.motion.tip.h)}</h3>
      <p>${esc(P.motion.tip.p)}</p>
      <ul class="feat">${P.motion.tip.items.map((i) => `<li>${i}</li>`).join("")}</ul>
      ${P.motion.tip.measured ? `<p class="note">${esc(P.motion.tip.measured)}</p>` : ""}
      <p class="label">${esc(L.common.examplePromptLabel)}</p>
      <p class="prompt">${esc(P.motion.tip.example)}</p>
    </div>` : ""}
  </div>
</section>

${V.samples.length || V.voices?.length ? `<section id="listen" class="listen" aria-labelledby="listen-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(L.listen.kicker)}</p><h2 id="listen-h">${esc(L.listen.h2)}</h2><p>${esc(L.listen.intro)}</p></div>
    ${V.samples.length ? `<h3 class="sub-h">${esc(L.listen.demosH)}</h3>
    <ul class="samples">${V.samples.map((s) => sample(L, base, s)).join("")}</ul>` : ""}
    ${V.voices?.length ? gallery(L, base) : ""}
  </div>
</section>` : ""}

<section id="tech" class="tech" aria-labelledby="tech-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.tech.kicker)}</p><h2 id="tech-h">${esc(P.tech.h2)}</h2><p>${esc(P.tech.intro)}</p></div>
    ${pipeline(P.tech.steps)}
    ${V.billingNote ? `<p class="cost-note">${esc(V.billingNote[lang])}</p>` : ""}
    <p class="note"><a href="${href(path, "how", lang)}">${esc(L.common.readMore)}</a></p>
  </div>
</section>

<section id="install" class="tools" aria-labelledby="install-h">
  <div class="wrap">
    <article class="tool solo" id="gptvoice" aria-labelledby="install-h" data-status="${V.status}">
      <div class="tool-body">
        <div class="tool-title"><h2 id="install-h">GPTVoice</h2><span class="badge ${live ? "is-live" : "is-soon"}">${esc(L.common.badge[V.status])}</span></div>
        <p class="tagline">${esc(V.tagline[lang])}</p>
        <p>${esc(V.summary[lang])}</p>
        <p class="label">${esc(live ? L.common.featuresLabel.live : L.common.featuresLabel.planned)}</p>
        <ul class="feat${live ? "" : " is-planned"}">${V.features.map((f) => `<li>${esc(f[lang])}</li>`).join("")}</ul>
        ${V.controls?.length ? `<p class="label">${esc(L.voice.controlsH)}</p>
        <div class="controls">${V.controls.map((c) => `<div class="ctl">
          <h4>${esc(c.level[lang])}</h4><p class="ctl-note">${esc(c.note[lang])}</p>
          <ul>${c.items.map((i) => `<li>${esc(i[lang])}</li>`).join("")}</ul>
        </div>`).join("")}</div>` : ""}
        ${V.measured?.length ? `<p class="label">${esc(L.voice.measuredH)}</p>
        <dl class="measured">${V.measured.map((m) => `<div><dt>${esc(m.value[lang])}</dt><dd>${esc(m.label[lang])}</dd></div>`).join("")}</dl>` : ""}
        ${V.mcpTools?.length ? `<p class="label">${esc(L.voice.toolsH.replace("{n}", V.mcpTools.length))}</p>
        <ul class="chips">${V.mcpTools.map((x) => `<li><code>${esc(x)}</code></li>`).join("")}</ul>` : ""}
        <p class="label">${esc(P.setupH)}</p>
        ${voicePublic()
          ? `${V.agentPrompt ? starter(L, V.agentPrompt[lang], { heading: "h3" }) : ""}
        <p class="note">${esc(P.setupIntro)} ${V.installNote ? esc(V.installNote[lang] ?? V.installNote) : ""}</p>
        ${setup(L, "gptvoice", { id: "setup-gptvoice" })}
        <p class="note"><a href="${attr(V.repo)}">${esc(L.common.repoLink)}</a></p>`
          : `<p class="not-yet">${esc(live ? L.common.notPublic : L.common.notYet)}</p>`}
      </div>
    </article>
  </div>
</section>`;
  return layout(lang, "voices", { title: P.title, description: P.description, body });
}

function how(lang) {
  const L = t[lang];
  const P = L.how;
  const path = ROUTES.how[lang];
  const H = P.hero;
  const body = `<section id="top" class="hero hero-text" aria-labelledby="hero-h">
  <div class="wrap">
    <div class="hero-copy">
      <p class="eyebrow">${esc(H.eyebrow)}</p>
      ${H.sub
        ? `<h1 id="hero-h" class="h1-stack"><span class="h1-main">${esc(H.h1)}</span> <span class="h1-sub">${esc(H.sub)}</span></h1>`
        : `<h1 id="hero-h" class="h1-main">${esc(H.h1)}</h1>`}
      <p class="lead">${esc(H.lead)}</p>
    </div>
  </div>
</section>

<section class="tech" aria-labelledby="flow-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.flow.kicker)}</p><h2 id="flow-h">${esc(P.flow.h2)}</h2></div>
    ${pipeline(P.flow.steps)}
  </div>
</section>

<section class="data" aria-labelledby="data-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.data.kicker)}</p><h2 id="data-h">${esc(P.data.h2)}</h2></div>
    <div class="table-wrap" tabindex="0" role="region" aria-labelledby="data-h">
      <table class="compare">
        <thead><tr>${P.data.headers.map((h, i) => `<th scope="col"${i === 0 ? ' class="sr-col"' : ""}>${esc(h) || `<span class="sr">-</span>`}</th>`).join("")}</tr></thead>
        <tbody>${P.data.rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="security" aria-labelledby="sec-h">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">${esc(P.security.kicker)}</p><h2 id="sec-h">${esc(P.security.h2)}</h2></div>
    <ul class="feat">${P.security.items.map((i) => `<li>${i}</li>`).join("")}</ul>
  </div>
</section>

<section id="setup" class="setup-sec" aria-labelledby="setup-h">
  <div class="wrap">
    <div class="sec-head"><h2 id="setup-h">${esc(P.setupH)}</h2><p>${esc(P.setupIntro)}</p></div>
    ${starter(L, L.starter.gptimage, { heading: "h3", title: L.starter.h + " · GPTImage" })}
    ${voicePublic() && V.agentPrompt ? starter(L, V.agentPrompt[lang], { id: "install-prompt-voice", heading: "h3", title: L.starter.h + " · GPTVoice" }) : ""}
    <h3 class="sub-h">GPTImage</h3>
    ${setup(L, "gptimage", { id: "how-gptimage" })}
    <h3 class="sub-h">GPTVoice</h3>
    ${voicePublic() ? setup(L, "gptvoice", { id: "how-gptvoice" }) : `<p class="not-yet">${esc(V.status !== "development" ? L.common.notPublic : L.common.notYet)}</p>`}
  </div>
</section>

<section id="faq" class="faq" aria-labelledby="faq-h">
  <div class="wrap faq-grid">
    <h2 id="faq-h">${esc(P.faqH)}</h2>
    <div class="faq-list">
      ${P.faq.map((it) => `<details><summary>${esc(it.q)}</summary><div class="answer"><p>${it.a}</p></div></details>`).join("\n      ")}
    </div>
  </div>
</section>

<section id="grey" class="grey" aria-labelledby="grey-h">
  <div class="wrap">
    <p class="kicker">${esc(P.grey.kicker)}</p>
    <h2 id="grey-h">${esc(P.grey.h2)}</h2>
    <ul>${P.grey.items.map((g) => `<li>${g}</li>`).join("")}</ul>
  </div>
</section>`;
  return layout(lang, "how", { title: P.title, description: P.description, body });
}

function notFound() {
  // Served by GitHub Pages for any unknown path, possibly nested: use absolute site URLs.
  const E = t.en.notFound, F = t.fr.notFound;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(E.title)} · Get more from Codex</title>
<meta name="robots" content="noindex">
<meta name="color-scheme" content="dark">
<link rel="icon" href="${SITE_URL}assets/favicon-32.png" type="image/png">
<link rel="stylesheet" href="${SITE_URL}assets/site.css?v=${CSS_V}">
</head>
<body>
<main id="main" class="nf">
  <div class="wrap">
    <img src="${SITE_URL}assets/img/mascot-360.webp" alt="" width="180" height="170">
    <h1>${esc(E.h1)}</h1>
    <p>${esc(E.p)}</p>
    <p><a class="btn" href="${SITE_URL}">${esc(E.back)}</a></p>
    <div lang="fr">
      <h2>${esc(F.h1)}</h2>
      <p>${esc(F.p)}</p>
      <p><a href="${SITE_URL}fr/">${esc(F.back)}</a></p>
    </div>
  </div>
</main>
</body>
</html>
`;
}

// ---------- write ----------
validateVoice();
const out = (p, s) => {
  mkdirSync(dirname(join(ROOT, p)), { recursive: true });
  writeFileSync(join(ROOT, p), s);
  console.log("wrote", p, `${(s.length / 1024).toFixed(1)} kB`);
};
const RENDER = { home, images, voices, how };
for (const lang of LANGS) for (const p of PAGES) out(ROUTES[p][lang] + "index.html", RENDER[p](lang));
out("404.html", notFound());
const today = new Date().toISOString().slice(0, 10);
out(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PAGES.flatMap((p) => LANGS.map((l) => `  <url>
    <loc>${SITE_URL}${ROUTES[p][l]}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${ROUTES[p].en}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}${ROUTES[p].fr}"/>
  </url>`)).join("\n")}
</urlset>
`
);
out("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);

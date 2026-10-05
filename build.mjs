#!/usr/bin/env node
// Builds the static site from content/*.mjs.
//   node build.mjs
// Outputs: index.html (EN), fr/index.html (FR), 404.html, sitemap.xml, robots.txt.
// No dependencies. The generated files are committed so GitHub Pages serves them as-is.

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { t, SITE_URL, GPTIMAGE_REPO } from "./content/site.mjs";
import { gptvoice as RAW } from "./content/gptvoice.mjs";

// Entries flagged `hidden` stay in the data file but never reach the page.
const V = { ...RAW, samples: RAW.samples.filter((s) => !s.hidden) };

const ROOT = dirname(fileURLToPath(import.meta.url));
const LANGS = ["en", "fr"];
// Cache-busting version for CSS/JS: changes whenever the file content changes.
const ver = (f) => createHash("sha1").update(readFileSync(join(ROOT, f))).digest("hex").slice(0, 8);
const CSS_V = ver("assets/site.css");
const JS_V = ver("assets/site.js");
const PATHS = { en: "", fr: "fr/" };

// ---------- helpers ----------
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const attr = esc;

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

function codeBlock(L, lines, label) {
  return `<div class="codeblock">
          <div class="codebar"><span>${esc(label)}</span><button type="button" class="copy" data-copy data-copied="${attr(L.tools.copied)}" data-failed="${attr(L.tools.copyFailed)}" hidden>${esc(L.tools.copy)}</button></div>
          <pre tabindex="0" aria-label="${attr(L.tools.codeLabel)}"><code>${lines.map(esc).join("\n")}</code></pre>
          <p class="copy-status" role="status" aria-live="polite"></p>
        </div>`;
}

function sample(L, base, s, lang) {
  const title = esc(s.title[lang]);
  const meta = esc(s.voice[lang]);
  const tr = `<details class="transcript"><summary>${esc(L.tools.transcript)}</summary><p lang="${attr(s.lang)}">${esc(s.transcript)}</p></details>`;
  if (!s.src) {
    return `<li class="sample is-soon">
            <div class="sample-head"><h4>${title}</h4><p class="meta">${meta}</p></div>
            <div class="sample-soon"><p>${esc(L.tools.sampleSoon)}</p><blockquote lang="${attr(s.lang)}">${esc(s.transcript)}</blockquote></div>
          </li>`;
  }
  return `<li class="sample" data-sample>
            <div class="sample-head"><h4 id="s-${s.id}">${title}</h4><p class="meta">${meta}</p></div>
            <div>
              <audio controls preload="none" aria-labelledby="s-${s.id}"><source src="${base}${attr(s.src)}" type="${attr(s.type || "audio/mpeg")}"></audio>
              <p class="audio-error" hidden>${esc(L.tools.audioError)}</p>
              ${tr}
            </div>
          </li>`;
}

function gallery(L, base, lang) {
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
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
          const play = (l) => `<a class="play" href="${base}assets/audio/voices/${v.id}-${l}.mp3" data-play data-label="${attr(G.playLabel.replace("{name}", name).replace("{lang}", G.langs[l]))}" aria-label="${attr(G.playLabel.replace("{name}", name).replace("{lang}", G.langs[l]))}"><span class="play-icon" aria-hidden="true"></span><span aria-hidden="true">${l.toUpperCase()}</span></a>`;
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

// ---------- page ----------
function page(lang) {
  const L = t[lang];
  const base = lang === "en" ? "" : "../";
  const url = SITE_URL + PATHS[lang];
  const other = lang === "en" ? "fr" : "en";
  const live = V.status !== "development";
  const voiceBadge = L.tools.badge[V.status];
  const H = L.hero;

  const langSwitch = LANGS.map((l) => {
    const href = (l === "en" ? base || "./" : `${base}fr/`) + `?lang=${l}`;
    const cur = l === lang ? ' aria-current="page"' : "";
    return `<a href="${href}" hreflang="${l}" lang="${l}" data-lang-link="${l}"${cur}><span aria-hidden="true">${l.toUpperCase()}</span><span class="sr">${esc(L.langNames[l])}</span></a>`;
  }).join("");

  return `<!doctype html>
<html lang="${L.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(L.title)}</title>
<meta name="description" content="${attr(L.description)}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0a0a0a">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${SITE_URL}">
<link rel="alternate" hreflang="fr" href="${SITE_URL}fr/">
<link rel="alternate" hreflang="x-default" href="${SITE_URL}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Get more from Codex">
<meta property="og:title" content="${attr(L.title)}">
<meta property="og:description" content="${attr(L.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${attr(H.alt)}">
<meta property="og:locale" content="${L.ogLocale}">
<meta property="og:locale:alternate" content="${t[other].ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(L.title)}">
<meta name="twitter:description" content="${attr(L.description)}">
<meta name="twitter:image" content="${SITE_URL}assets/og.png">
<link rel="icon" href="${base}assets/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="${base}assets/apple-touch-icon.png">
<link rel="preload" href="${base}assets/fonts/dmsans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}assets/fonts/geist.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${base}assets/site.css?v=${CSS_V}">
<script>
/* Language: explicit ?lang= > saved choice > browser language (EN page only). Storage may be blocked. */
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
  if (want && want !== page) location.replace((page === "en" ? "fr/" : "../") + location.hash);
})();
</script>
</head>
<body>
<a class="skip" href="#main">${esc(L.skip)}</a>

<header class="top">
  <div class="top-row">
    <a class="brand" href="#top"><img src="${base}assets/favicon-32.png" alt="" width="32" height="32"><span>Get more from Codex</span></a>
    <nav class="mainnav" aria-label="${attr(L.navLabel)}">
      <a href="#how">${esc(L.nav.how)}</a>
      <a href="#tools">${esc(L.nav.tools)}</a>
      ${V.samples.length || V.voices?.length ? `<a href="#listen">${esc(L.nav.listen)}</a>` : ""}
      <a href="#film">${esc(L.nav.film)}</a>
      <a href="#faq">${esc(L.nav.faq)}</a>
    </nav>
    <nav class="lang" aria-label="${attr(L.langLabel)}">${langSwitch}</nav>
  </div>
</header>

<main id="main">
<section id="top" class="hero" aria-labelledby="hero-h">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <a class="banner" href="${V.samples.length ? "#listen" : "#gptvoice"}"><span class="spark" aria-hidden="true"></span>${esc(H.banner[V.status])}<span aria-hidden="true">→</span></a>
      <p class="eyebrow">${esc(H.eyebrow)}</p>
      <h1 id="hero-h"><span class="h1-main">${esc(H.h1)}</span> <span class="h1-sub">${esc(H.sub)}</span></h1>
      <p class="lead">${esc(H.lead)}</p>
      <div class="cta">
        <a class="btn" href="#install-gptimage">${esc(H.ctaPrimary)}</a>
        <a class="btn ghost" href="#film">${esc(H.ctaSecondary)}</a>
      </div>
      <ul class="facts">${H.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
    </div>
    <div class="hero-art">
      ${picture(base, "hero", H.alt, "(min-width: 1000px) 560px, calc(100vw - 32px)", { eager: true })}
    </div>
  </div>
</section>

<aside class="notice" aria-label="${attr(L.notice.title.replace(/\.$/, ""))}">
  <div class="wrap notice-row">
    <strong>${esc(L.notice.title)}</strong>
    <p>${esc(L.notice.body)} <a href="#grey">${esc(L.notice.link)}</a>.</p>
  </div>
</aside>

<section id="how" class="how" aria-labelledby="how-h">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker">${esc(L.how.kicker)}</p>
      <h2 id="how-h">${esc(L.how.h2)}</h2>
    </div>
    <ol class="steps">
      ${L.how.steps.map((s, i) => `<li><div><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p></div><span class="num" aria-hidden="true">0${i + 1}</span></li>`).join("\n      ")}
    </ol>
    <figure class="ask">
      <figcaption>${esc(L.how.exampleLabel)}</figcaption>
      <p><span class="caret" aria-hidden="true">&gt;</span> ${esc(L.how.example)}</p>
    </figure>
  </div>
</section>

<section id="tools" class="tools" aria-labelledby="tools-h">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker">${esc(L.tools.kicker)}</p>
      <h2 id="tools-h">${esc(L.tools.h2)}</h2>
      <p>${esc(L.tools.intro)}</p>
    </div>

    <article class="tool" aria-labelledby="gptimage-h">
      <div class="tool-art">
        ${picture(base, "mascot", L.gptimage.alt, "(min-width: 900px) 400px, 70vw")}
      </div>
      <div class="tool-body">
        <div class="tool-title"><h3 id="gptimage-h">GPTImage</h3><span class="badge is-live">${esc(L.tools.badge.available)}</span></div>
        <p class="tagline">${esc(L.gptimage.tagline)}</p>
        <p>${esc(L.gptimage.summary)}</p>
        <ul class="feat">${L.gptimage.features.map((f) => `<li>${f}</li>`).join("")}</ul>
        <p class="label">${esc(L.tools.examplePromptLabel)}</p>
        <p class="prompt">${esc(L.gptimage.example)}</p>
        <div id="install-gptimage" class="install">
          ${codeBlock(L, L.gptimage.install, L.tools.installLabel)}
          <p class="note">${esc(L.gptimage.installNote)}</p>
          <p class="note"><a href="${GPTIMAGE_REPO}">${esc(L.tools.repoLink)}</a></p>
        </div>
      </div>
    </article>

    <article class="tool flip" id="gptvoice" aria-labelledby="gptvoice-h" data-status="${V.status}">
      <div class="tool-art">
        ${picture(base, "voice", L.voiceAlt, "(min-width: 900px) 400px, 70vw")}
      </div>
      <div class="tool-body">
        <div class="tool-title"><h3 id="gptvoice-h">GPTVoice</h3><span class="badge ${live ? "is-live" : "is-soon"}">${esc(voiceBadge)}</span></div>
        <p class="tagline">${esc(V.tagline[lang])}</p>
        <p>${esc(V.summary[lang])}</p>
        ${V.billingNote ? `<p class="cost-note">${esc(V.billingNote[lang])}</p>` : ""}
        <p class="label">${esc(live ? L.tools.featuresLabel.live : L.tools.featuresLabel.planned)}</p>
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
        <p class="label">${esc(L.tools.examplePromptLabel)}</p>
        <p class="prompt">${esc(V.examplePrompt[lang])}</p>
        ${V.samples.length || V.voices?.length ? `<p class="note"><a href="#listen">${esc(L.voice.listenLink)}</a></p>` : ""}
        <div id="install-gptvoice" class="install">
          ${live && V.install && V.repo ? codeBlock(L, V.install, L.tools.installLabel) : `<p class="not-yet">${esc(live ? L.tools.notPublic : L.tools.notYet)}</p>`}
          ${live && V.install && V.repo && V.installNote ? `<p class="note">${esc(V.installNote[lang] ?? V.installNote)}</p>` : ""}
          ${V.repo ? `<p class="note"><a href="${attr(V.repo)}">${esc(L.tools.repoLink)}</a></p>` : ""}
        </div>
      </div>
    </article>
  </div>
</section>

${V.samples.length || V.voices?.length ? `<section id="listen" class="listen" aria-labelledby="listen-h">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker">${esc(L.listen.kicker)}</p>
      <h2 id="listen-h">${esc(L.listen.h2)}</h2>
      <p>${esc(L.listen.intro)}</p>
    </div>
    ${V.samples.length ? `<h3 class="sub-h">${esc(L.listen.demosH)}</h3>
    <ul class="samples">${V.samples.map((s) => sample(L, base, s, lang)).join("")}</ul>` : ""}
    ${V.voices?.length ? gallery(L, base, lang) : ""}
  </div>
</section>

` : ""}<section id="film" class="film" aria-labelledby="film-h">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker">${esc(L.film.kicker)}</p>
      <h2 id="film-h">${esc(L.film.h2)}</h2>
      <p>${L.film.intro}</p>
    </div>
    <figure class="strip">
      <ol class="frames">
        ${L.film.frames.map((f, i) => `<li class="frame">
          ${picture(base, `story-${i + 1}`, f.alt, "(min-width: 900px) 360px, calc(100vw - 32px)")}
          <p class="scene">${esc(f.n)}</p>
          <p class="line">${esc(f.line)}</p>
        </li>`).join("\n        ")}
      </ol>
      <figcaption>${esc(L.film.framesCaption)}</figcaption>
    </figure>
    <ol class="recipe">
      ${L.film.steps.map((s) => `<li><h3>${esc(s.h)}</h3><p>${s.p}</p></li>`).join("\n      ")}
    </ol>
    <div class="also">
      <h3>${esc(L.film.alsoH)}</h3>
      <ul>${L.film.also.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
    </div>
  </div>
</section>

<section id="faq" class="faq" aria-labelledby="faq-h">
  <div class="wrap faq-grid">
    <h2 id="faq-h">${esc(L.faq.h2)}</h2>
    <div class="faq-list">
      ${L.faq.items.map((it) => `<details><summary>${esc(it.q)}</summary><div class="answer"><p>${it.a}</p></div></details>`).join("\n      ")}
    </div>
  </div>
</section>

<section id="grey" class="grey" aria-labelledby="grey-h">
  <div class="wrap">
    <p class="kicker">${esc(L.grey.kicker)}</p>
    <h2 id="grey-h">${esc(L.grey.h2)}</h2>
    <ul>${L.grey.items.map((g) => `<li>${g}</li>`).join("")}</ul>
  </div>
</section>
</main>

<footer class="foot">
  <div class="wrap foot-grid">
    <div>
      <p>${esc(L.footer.made)}</p>
      <p class="legal">${esc(L.footer.legal)}</p>
    </div>
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
out("index.html", page("en"));
out("fr/index.html", page("fr"));
out("404.html", notFound());
const today = new Date().toISOString().slice(0, 10);
out(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map(
  (l) => `  <url>
    <loc>${SITE_URL}${PATHS[l]}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}fr/"/>
  </url>`
).join("\n")}
</urlset>
`
);
out("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);

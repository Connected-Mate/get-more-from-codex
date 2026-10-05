/* Get more from Codex: progressive enhancements. The page works without this file. */
(function () {
  "use strict";

  /* Language links keep the current section (#hash) when switching. */
  document.querySelectorAll("[data-lang-link]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (location.hash && a.href.indexOf("#") === -1) a.href = a.href + location.hash;
    });
  });

  /* Copy buttons: Clipboard API, then execCommand fallback, then "select + Ctrl+C" hint. */
  function selectText(el) {
    try {
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      return true;
    } catch (e) { return false; }
  }
  function legacyCopy(el) {
    if (!selectText(el)) return false;
    try { return document.execCommand("copy"); } catch (e) { return false; }
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var block = btn.closest(".codeblock");
    var code = block.querySelector("pre code");
    var status = block.querySelector(".copy-status");
    var label = btn.textContent;
    var timer = null;
    btn.hidden = false;

    function report(ok) {
      clearTimeout(timer);
      if (ok) {
        btn.textContent = btn.getAttribute("data-copied");
        btn.classList.add("is-done");
        status.textContent = "";
        // Announce once; a fresh text node is needed for repeat announcements.
        setTimeout(function () { status.textContent = btn.getAttribute("data-copied"); }, 30);
        timer = setTimeout(function () {
          btn.textContent = label;
          btn.classList.remove("is-done");
          status.textContent = "";
        }, 2000);
      } else {
        btn.textContent = label;
        btn.classList.remove("is-done");
        selectText(code);
        status.textContent = btn.getAttribute("data-failed");
      }
    }

    btn.addEventListener("click", function () {
      var text = code.textContent;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { report(true); },
          function () { report(legacyCopy(code)); }
        );
      } else {
        report(legacyCopy(code));
      }
    });
  });

  /* Audio samples: if a file fails to load, say so and point to the transcript. */
  document.querySelectorAll("[data-sample]").forEach(function (s) {
    var audio = s.querySelector("audio");
    var source = s.querySelector("source");
    var msg = s.querySelector(".audio-error");
    function fail() { msg.hidden = false; var d = s.querySelector("details"); if (d) d.open = true; }
    if (source) source.addEventListener("error", fail);
    if (audio) audio.addEventListener("error", fail);
  });
})();

/* Voice gallery: one shared player, EN/FR buttons, gender filter. Without JS the buttons are plain links to the MP3s. */
(function () {
  "use strict";
  var root = document.querySelector("[data-gallery]");
  if (!root) return;
  var status = root.querySelector("[data-gallery-status]");
  var links = root.querySelectorAll("[data-play]");
  var player = new Audio();
  player.preload = "none";
  var current = null;

  function reset(a) {
    if (!a) return;
    a.classList.remove("is-playing");
    a.setAttribute("aria-pressed", "false");
  }
  function say(msg) { if (status) { status.textContent = ""; setTimeout(function () { status.textContent = msg; }, 30); } }

  links.forEach(function (a) {
    a.setAttribute("role", "button");
    a.setAttribute("aria-pressed", "false");
    a.addEventListener("keydown", function (e) { if (e.key === " ") { e.preventDefault(); a.click(); } });
    a.addEventListener("click", function (e) {
      e.preventDefault();
      if (current === a && !player.paused) { player.pause(); return; }
      reset(current);
      current = a;
      a.classList.remove("is-error");
      player.src = a.getAttribute("href");
      var p = player.play();
      if (p && p.catch) p.catch(function (err) {
        if (err && err.name === "AbortError") return; // superseded by another click
        reset(a);
        a.classList.add("is-error");
        say(document.documentElement.lang === "fr" ? "Cet extrait n’a pas pu se lire." : "This sample could not play.");
      });
    });
  });
  player.addEventListener("playing", function () {
    if (!current) return;
    current.classList.add("is-playing");
    current.setAttribute("aria-pressed", "true");
    // Pause any demo clip that is playing.
    document.querySelectorAll("audio").forEach(function (el) { if (!el.paused) el.pause(); });
  });
  player.addEventListener("pause", function () { reset(current); });
  player.addEventListener("ended", function () { reset(current); });

  // Starting a demo clip stops the gallery voice (and other demos).
  document.querySelectorAll("audio").forEach(function (el) {
    el.addEventListener("play", function () {
      if (!player.paused) player.pause();
      document.querySelectorAll("audio").forEach(function (o) { if (o !== el && !o.paused) o.pause(); });
    });
  });

  var filters = root.querySelector(".filters");
  if (filters) {
    filters.hidden = false;
    var items = root.querySelectorAll(".voice");
    filters.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-filter]");
      if (!b) return;
      var f = b.getAttribute("data-filter");
      filters.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      var n = 0;
      items.forEach(function (li) {
        var show = f === "all" || li.getAttribute("data-gender") === f;
        li.hidden = !show;
        if (!show && current && li.contains(current)) player.pause();
        if (show) n++;
      });
      say(n + (document.documentElement.lang === "fr" ? " voix" : n === 1 ? " voice" : " voices"));
    });
  }
})();

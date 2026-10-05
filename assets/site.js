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

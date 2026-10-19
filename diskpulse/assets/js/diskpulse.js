/* DiskPulse product page. No network requests, no storage beyond the language choice. */
(function () {
  "use strict";

  var config = {};
  try { config = JSON.parse(document.getElementById("release-config").textContent); } catch (e) { config = {}; }

  // ------------------------------------------------------------------ language
  var LABELS = {
    ru: { soon: "Релиз готовится", copied: "Скопировано", copy: "Копировать", version: "Версия " },
    en: { soon: "Release coming soon", copied: "Copied", copy: "Copy", version: "Version " }
  };
  var lang = "ru";

  function pickLanguage() {
    var fromQuery = new URLSearchParams(location.search).get("lang");
    if (fromQuery === "ru" || fromQuery === "en") return fromQuery;
    try {
      var saved = localStorage.getItem("diskpulse-lang");
      if (saved === "ru" || saved === "en") return saved;
    } catch (e) { /* private mode */ }
    var preferred = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
    return /^(ru|uk|be|kk)/i.test(preferred) ? "ru" : "en";
  }

  function applyLanguage(next) {
    lang = next;
    document.documentElement.lang = next;
    var root = document.documentElement.dataset;
    if (root.titleRu === undefined) root.titleRu = document.title;
    document.title = next === "en" && root.titleEn ? root.titleEn : root.titleRu;
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (el.dataset.ru === undefined) el.dataset.ru = el.textContent;
      el.textContent = next === "en" ? el.dataset.en : el.dataset.ru;
    });
    document.querySelectorAll("[data-en-html]").forEach(function (el) {
      if (el.dataset.ruHtml === undefined) el.dataset.ruHtml = el.innerHTML;
      el.innerHTML = next === "en" ? el.dataset.enHtml : el.dataset.ruHtml;
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === next));
    });
    applyRelease();
    applyGitHub();
    demo.render();
    try { localStorage.setItem("diskpulse-lang", next); } catch (e) { /* ignore */ }
  }

  // ------------------------------------------------------------------ release state
  function applyRelease() {
    var released = config.released === true && typeof config.dmgURL === "string";
    document.querySelectorAll(".js-download").forEach(function (a) {
      var label = a.querySelector(".js-download-label");
      if (released) {
        a.href = config.dmgURL;
        a.removeAttribute("aria-disabled");
        a.setAttribute("download", "");
      } else {
        a.removeAttribute("href");
        a.setAttribute("aria-disabled", "true");
        if (label) label.textContent = LABELS[lang].soon;
      }
    });
    document.querySelectorAll(".js-cmd").forEach(function (code) {
      var key = code.dataset.cmd;
      if (config[key]) code.textContent = config[key];
    });
    document.querySelectorAll(".copy-chip, .cmd-card").forEach(function (el) {
      el.style.opacity = released ? "" : "0.6";
    });
    var version = document.querySelector(".js-version");
    if (version) {
      version.textContent = released && config.version ? LABELS[lang].version + config.version : "";
      version.style.display = version.textContent ? "" : "none";
    }
  }

  function applyGitHub() {
    document.querySelectorAll(".js-gh").forEach(function (a) {
      if (config.repoPublic === true && config.repoURL) {
        a.href = config.repoURL + (a.dataset.ghPath || "");
        a.style.display = "";
      } else {
        a.style.display = "none";   // private repository: a link would only show GitHub's 404
      }
    });
  }

  // ------------------------------------------------------------------ platform hint
  function isMac() {
    var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    var mac = /mac/i.test(platform);                         // "MacIntel" or "macOS"
    var touchMac = mac && navigator.maxTouchPoints > 1;      // iPad reports MacIntel
    return mac && !touchMac;
  }

  // ------------------------------------------------------------------ copy buttons
  function copyText(text, button) {
    function done() {
      var original = button.innerHTML;
      button.classList.add("done");
      button.innerHTML = '<svg><use href="#i-check"/></svg><span>' + LABELS[lang].copied + "</span>";
      setTimeout(function () { button.classList.remove("done"); button.innerHTML = original; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    } else {
      var area = document.createElement("textarea");
      area.value = text; document.body.appendChild(area); area.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ }
      area.remove();
    }
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest(".copy-btn");
    if (!button) return;
    var text = button.dataset.copyText;
    if (!text) {
      var code = button.parentElement.querySelector("code");
      text = code ? code.textContent : "";
    }
    copyText(text.trim(), button);
  });

  // ------------------------------------------------------------------ tabs
  document.querySelectorAll(".tabs button").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".tabs button").forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); });
      document.querySelectorAll(".tabpanel").forEach(function (p) { p.classList.toggle("active", p.dataset.panel === tab.dataset.tab); });
    });
  });

  // ------------------------------------------------------------------ hero demo
  // Fictional numbers: free space drains during builds, the background pass clears rebuildable caches.
  var demo = (function () {
    var free = 18.4, phase = "drain", timer = null;
    var els = {
      free: document.querySelector(".js-free"), bar: document.querySelector(".js-bar"),
      mb: document.querySelector(".js-mb-free"), chip: document.querySelector(".js-chip"),
      chipText: document.querySelector(".js-chip-text"), toast: document.querySelector(".js-toast"),
      sub: document.querySelector(".js-auto-sub"),
      rows: [".js-r1", ".js-r2", ".js-r3"].map(function (s) { return document.querySelector(s); })
    };
    var TEXT = {
      ru: { gb: " ГБ", ok: "Места достаточно", low: "Места мало", critical: "Критически мало места",
            watching: "Следит каждые 5 минут", cleaning: "Убирает безопасное…", sep: "," },
      en: { gb: " GB", ok: "Plenty of space", low: "Low on space", critical: "Critically low",
            watching: "Watching every 5 minutes", cleaning: "Cleaning what is safe…", sep: "." }
    };
    var TOTAL = 494;

    function format(value) { return value.toFixed(1).replace(".", TEXT[lang].sep) + TEXT[lang].gb; }

    function render() {
      if (!els.free) return;
      var t = TEXT[lang];
      els.free.textContent = format(free);
      els.mb.textContent = Math.round(free) + (lang === "ru" ? " ГБ" : " GB");
      els.bar.style.width = Math.min(99, (1 - free / TOTAL) * 100).toFixed(1) + "%";
      var state = free >= 15 ? "ok" : free >= 5 ? "low" : "critical";
      els.chip.classList.toggle("attention", state !== "ok");
      els.chipText.textContent = t[state];
      els.sub.textContent = phase === "clean" ? t.cleaning : t.watching;
    }

    function step() {
      if (phase === "drain") {
        free = Math.max(3.1, free - 0.9);
        if (free <= 3.1) { phase = "clean"; }
      } else if (phase === "clean") {
        var next = els.rows.find(function (r) { return r && !r.classList.contains("cleaned"); });
        if (next) {
          next.classList.add("cleaned");
          free += next === els.rows[0] ? 9.4 : next === els.rows[1] ? 6.1 : 3.8;
        } else {
          phase = "rest";
          els.toast.classList.add("show");
        }
      } else if (phase === "rest") {
        phase = "reset";
      } else {
        els.toast.classList.remove("show");
        els.rows.forEach(function (r) { r && r.classList.remove("cleaned"); });
        free = 18.4; phase = "drain";
      }
      render();
    }

    function start() {
      if (timer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { render(); return; }
      render();
      timer = setInterval(step, 900);
    }
    return { render: render, start: start };
  })();

  // ------------------------------------------------------------------ reveal on scroll
  function reveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(function (el) { el.classList.add("in"); }); return; }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { observer.observe(el); });
  }

  // ------------------------------------------------------------------ boot
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { applyLanguage(b.dataset.lang); });
  });
  var note = document.querySelector(".js-platform-note");
  if (note && !isMac()) note.classList.add("show");
  applyLanguage(pickLanguage());
  reveal();
  demo.start();
})();

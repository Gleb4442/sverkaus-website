(function () {
  var root = document.documentElement;
  var store = {
    get: function () { try { return localStorage.getItem("any-lang"); } catch (e) { return null; } },
    set: function (v) { try { localStorage.setItem("any-lang", v); } catch (e) {} }
  };
  var lang = store.get() || ((navigator.language || "").toLowerCase().indexOf("ru") === 0 ? "ru" : "en");
  var button = document.getElementById("lang");
  var phrases = {
    ru: { press: "Нажатие", listen: "Слушаю", done: "Вставлено", text: "Давайте перенесём созвон на 15:00 и пришлём отчёт до обеда." },
    en: { press: "Press", listen: "Listening", done: "Inserted", text: "Let’s move the call to 3 pm and send the report before noon." }
  };

  document.querySelectorAll("[data-en],[data-en-html],[data-en-aria]").forEach(function (el) {
    el.dataset.ruHtml = el.innerHTML;
    if (el.hasAttribute("aria-label")) el.dataset.ruAria = el.getAttribute("aria-label");
  });
  var ruTitle = document.title;

  function apply() {
    root.lang = lang;
    document.querySelectorAll("[data-ru-html]").forEach(function (el) {
      if (lang === "en") {
        if (el.dataset.enHtml) el.innerHTML = el.dataset.enHtml;
        else if (el.dataset.en) el.textContent = el.dataset.en;
        if (el.dataset.enAria) el.setAttribute("aria-label", el.dataset.enAria);
      } else {
        if (el.dataset.en || el.dataset.enHtml) el.innerHTML = el.dataset.ruHtml;
        if (el.dataset.ruAria) el.setAttribute("aria-label", el.dataset.ruAria);
      }
    });
    document.title = lang === "en" ? "any — dictation with one press on your AirPods" : ruTitle;
    button.textContent = lang === "en" ? "RU" : "EN";
    button.setAttribute("aria-label", lang === "en" ? "Переключить на русский" : "Switch to English");
  }
  button.addEventListener("click", function () {
    lang = lang === "en" ? "ru" : "en";
    store.set(lang);
    apply();
    play();
  });

  var stage = document.getElementById("stage");
  var status = document.getElementById("status");
  var typed = document.getElementById("typed");
  var timer = null;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function set(state, label) { stage.dataset.state = state; status.textContent = label; }
  function after(ms, fn) { timer = setTimeout(fn, ms); }

  function play() {
    clearTimeout(timer);
    var p = phrases[lang];
    typed.textContent = "";
    if (still) { set("idle", p.done); typed.textContent = p.text; return; }
    set("idle", "");
    after(700, function () {
      set("press", p.press);
      after(850, function () {
        set("listen", p.listen);
        var i = 0;
        (function type() {
          typed.textContent = p.text.slice(0, ++i);
          if (i < p.text.length) { after(34, type); return; }
          after(650, function () {
            set("done", p.done);
            after(3600, play);
          });
        })();
      });
    });
  }

  apply();
  play();
})();

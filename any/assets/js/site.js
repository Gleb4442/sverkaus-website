(function () {
  var root = document.documentElement;
  var store = {
    get: function () { try { return localStorage.getItem("any-lang"); } catch (e) { return null; } },
    set: function (v) { try { localStorage.setItem("any-lang", v); } catch (e) {} }
  };
  var lang = store.get() || ((navigator.language || "").toLowerCase().indexOf("ru") === 0 ? "ru" : "en");
  var button = document.getElementById("lang");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    agentPlay(agentIndex);
  });

  function words(text, into, cls) {
    // Appends text word by word; keeps line breaks.
    return text.split(/(\s+)/).filter(Boolean).map(function (part) {
      if (/^\s+$/.test(part)) return function () { into.appendChild(document.createTextNode(part)); };
      return function () {
        var w = document.createElement("span");
        w.className = cls;
        w.textContent = part;
        into.appendChild(w);
      };
    });
  }

  /* ---------- Hero: press the stem, words land in an app, it sends ---------- */
  var ui = {
    ru: { press: "Нажатие", listen: "Слушаю", sent: "Отправлено", ph: "Сообщение" },
    en: { press: "Press", listen: "Listening", sent: "Sent", ph: "Message" }
  };
  var scenes = [
    { icon: "/any/assets/img/apps/tiles/telegram.png", app: "Telegram", to: { ru: "Анна", en: "Anna" },
      thread: [["inc", { ru: "Привет! Ты сегодня в офисе?", en: "Hi! Are you at the office today?" }],
               ["out", { ru: "Нет, работаю из дома", en: "No, working from home" }],
               ["inc", { ru: "Во сколько тогда созвон?", en: "So what time is the call?" }]],
      text: { ru: "Давай в 15:00, а отчёт пришлю до обеда.", en: "Let’s do 3 pm, and I’ll send the report before lunch." } },
    { icon: "/any/assets/img/apps/tiles/claude.png", app: "Claude", to: { ru: "", en: "" },
      hello: { ru: "Чем могу помочь?", en: "How can I help?" }, ph: { ru: "Спросите что-нибудь", en: "Ask anything" },
      text: { ru: "Составь план поездки в Лиссабон на три дня, без музеев и ранних подъёмов.", en: "Plan three days in Lisbon for me, no museums and no early mornings." } },
    { icon: "/any/assets/img/apps/tiles/codex.png", app: "Codex", to: { ru: "", en: "" },
      hello: { ru: "Что сделаем?", en: "What should we build?" }, ph: { ru: "Опишите задачу", en: "Describe a task" },
      text: { ru: "Добавь тёмную тему в настройки и прогони тесты.", en: "Add a dark theme to settings and run the tests." } }
  ];
  var stage = document.getElementById("stage");
  var win = document.getElementById("win");
  var bud = document.getElementById("bud");
  var field = document.getElementById("field");
  var typed = document.getElementById("typed");
  var thread = document.getElementById("thread");
  var timers = [];
  var scene = 0;

  function after(list, ms, fn) { list.push(setTimeout(fn, ms)); }
  function stop(list) { list.forEach(clearTimeout); list.length = 0; }
  function set(state) { stage.dataset.state = state; }
  function tap() { bud.classList.remove("tap"); void bud.offsetWidth; bud.classList.add("tap"); }
  function bubble(cls, text, anim) {
    var m = document.createElement("p");
    m.className = cls === "hello" ? cls : "msg " + cls + (anim ? "" : " old");
    m.textContent = text;
    thread.appendChild(m);
  }
  function setup(sc) {
    document.getElementById("win-icon").src = sc.icon;
    document.getElementById("win-app").textContent = sc.app;
    document.getElementById("win-to").textContent = sc.to[lang];
    thread.textContent = "";
    (sc.thread || []).forEach(function (t) { bubble(t[0], t[1][lang]); });
    if (sc.hello) bubble("hello", sc.hello[lang]);
    typed.textContent = "";
    typed.dataset.ph = sc.ph ? sc.ph[lang] : ui[lang].ph;
    field.className = "field";
    stage.classList.remove("focus");
    set("idle");
  }
  function play() {
    stop(timers);
    var sc = scenes[scene], u = ui[lang], steps = words(sc.text[lang], typed, "w");
    setup(sc);
    win.classList.remove("in", "out");
    void win.offsetWidth;
    win.classList.add("in");
    after(timers, 900, function () {
      tap(); set("press", u.press);
      after(timers, 420, function () {
        set("listen", u.listen);
        stage.classList.add("focus");
        var i = 0;
        (function next() {
          steps[i]();
          if (i === 0) field.classList.add("ready");
          var last = typed.lastChild;
          if (++i < steps.length) { after(timers, last.nodeType === 3 ? 0 : 150 + last.textContent.length * 16, next); return; }
          after(timers, 700, function () {
            tap(); set("press", u.press);
            field.classList.add("go");
            after(timers, 300, function () {
              stage.classList.remove("focus");
              field.className = "field";
              typed.textContent = "";
              var h = thread.querySelector(".hello");
              if (h) h.remove();
              bubble("out", sc.text[lang], true);
              set("sent", u.sent);
              after(timers, 2000, function () {
                win.classList.add("out");
                after(timers, 600, function () { scene = (scene + 1) % scenes.length; play(); });
              });
            });
          });
        })();
      });
    });
  }

  /* ---------- Agent: the orb takes a spoken task and writes into the field ---------- */
  var agentCases = [
    { title: { ru: "Новое письмо · Анне", en: "New email · to Anna" },
      said: { ru: "Напиши вежливый отказ кандидату", en: "Write a polite rejection for a candidate" },
      answer: { ru: "Анна, здравствуйте!\nСпасибо за отклик и время на задание. Мы продолжим с другим кандидатом, но будем рады вернуться к вам с новыми вакансиями.", en: "Hi Anna,\nThank you for applying and for your time on the assignment. We’re moving forward with another candidate, and we’d be glad to reach out when new roles open." } },
    { title: { ru: "Заметки", en: "Notes" },
      said: { ru: "Чем отличаются Supabase и Firebase? Коротко", en: "How do Supabase and Firebase differ? Briefly" },
      answer: { ru: "Supabase: Postgres, SQL, открытый код.\nFirebase: NoSQL, сервисы Google.\nОба: вход и хранение файлов.", en: "Supabase: Postgres, SQL, open source.\nFirebase: NoSQL, Google services.\nBoth: auth and file storage." } },
    { title: { ru: "Письмо Анне", en: "Email to Anna" },
      ctx: { ru: "Анна, добрый день! Простите, пожалуйста, за задержку. К сожалению, отчёт ещё не готов, извините. Постараемся прислать его завтра до обеда. Ещё раз простите!", en: "Hi Anna! I’m so sorry for the delay. Unfortunately the report isn’t ready yet, apologies. We’ll try to send it tomorrow before noon. Sorry again!" },
      said: { ru: "Короче и без извинений", en: "Shorter, no apologies" },
      answer: { ru: "Анна, отчёт будет у вас завтра до обеда.", en: "Anna, you’ll have the report tomorrow before noon." } }
  ];
  var agentUi = { ru: { think: "Пишу…", done: "Готово" }, en: { think: "Writing…", done: "Done" } };
  var ag = document.getElementById("agent-stage");
  var agTabs = document.querySelectorAll("#agent-tabs button");
  var agSaid = document.getElementById("agent-said");
  var agBody = document.getElementById("agent-body");
  var agTitle = document.getElementById("agent-title");
  var agTimers = [];
  var agentIndex = 0;
  function agentPlay(i) {
    if (!ag) return;
    stop(agTimers);
    agentIndex = i;
    var c = agentCases[i], u = agentUi[lang];
    agTabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); });
    agTitle.textContent = c.title[lang];
    agBody.textContent = "";
    if (c.ctx) { var s = document.createElement("span"); s.className = "sel"; s.textContent = c.ctx[lang]; agBody.appendChild(s); }
    ag.dataset.state = "listen";
    agSaid.textContent = "«" + c.said[lang] + "»";
    after(agTimers, 1800, function () {
      ag.dataset.state = "think";
      agSaid.textContent = u.think;
      after(agTimers, 700, function () {
        agBody.textContent = "";
        var steps = words(c.answer[lang], agBody, "w"), k = 0;
        (function next() {
          steps[k]();
          if (++k < steps.length) { after(agTimers, 55, next); return; }
          after(agTimers, 400, function () {
            ag.dataset.state = "done";
            agSaid.textContent = u.done;
            after(agTimers, 3200, function () { agentPlay((agentIndex + 1) % agentCases.length); });
          });
        })();
      });
    });
  }
  agTabs.forEach(function (t, k) { t.addEventListener("click", function () { agentPlay(k); }); });

  /* ---------- Speed: feel 160 ms ---------- */
  var tryBtn = document.getElementById("speed-try");
  var meterFill = document.getElementById("meter-fill");
  var speedOut = document.getElementById("speed-out");
  var speedMs = document.getElementById("speed-ms");
  function feel() {
    if (!tryBtn) return;
    speedOut.classList.remove("on");
    meterFill.style.transition = "none";
    meterFill.style.width = "0";
    void meterFill.offsetWidth;
    meterFill.style.transition = "width 160ms linear";
    meterFill.style.width = "16%";
    var t0 = performance.now();
    (function tick() {
      var ms = Math.min(160, Math.round(performance.now() - t0));
      speedMs.textContent = ms;
      if (ms < 160) requestAnimationFrame(tick);
      else speedOut.classList.add("on");
    })();
  }
  if (tryBtn) {
    tryBtn.addEventListener("click", feel);
    if ("IntersectionObserver" in window) {
      var seen = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { feel(); seen.disconnect(); } }, { threshold: .6 });
      seen.observe(tryBtn);
    }
  }

  /* ---------- Liquid glass: refraction at the edges (Chromium only) ---------- */
  var refract = !!window.chrome && window.CSS && CSS.supports("backdrop-filter", "url(#a)");
  if (refract) {
    root.classList.add("refract");
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true");
    svg.style.position = "absolute";
    document.body.appendChild(svg);
    var n = 0;
    var lens = function (el) {
      var w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      var r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, h / 2, w / 2);
      var bezel = Math.max(10, Math.min(r * 0.9, 28)), scale = Math.round(bezel * 1.5);
      var c = document.createElement("canvas"); c.width = w; c.height = h;
      var x2 = c.getContext("2d"), img = x2.createImageData(w, h), d = img.data;
      var hw = w / 2, hh = h / 2;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var dx = x + .5 - hw, dy = y + .5 - hh, sx = dx < 0 ? -1 : 1, sy = dy < 0 ? -1 : 1;
          var px = Math.abs(dx) - (hw - r), py = Math.abs(dy) - (hh - r);
          var ox = Math.max(px, 0), oy = Math.max(py, 0), out = Math.sqrt(ox * ox + oy * oy);
          var depth = r - out - Math.min(Math.max(px, py), 0);
          var o = (y * w + x) * 4, vx = 0, vy = 0;
          if (depth < bezel) {
            var t = 1 - Math.max(depth, 0) / bezel, m = t * t;
            if (px > 0 && py > 0) { vx = sx * ox / (out || 1); vy = sy * oy / (out || 1); }
            else if (px > py) vx = sx; else vy = sy;
            vx *= -m; vy *= -m;
          }
          d[o] = 128 + vx * 127; d[o + 1] = 128 + vy * 127; d[o + 2] = 128; d[o + 3] = 255;
        }
      }
      x2.putImageData(img, 0, 0);
      var id = el.dataset.lens || ("lens" + (++n));
      el.dataset.lens = id;
      var old = document.getElementById(id);
      if (old) old.remove();
      var ns = "http://www.w3.org/2000/svg";
      var f = document.createElementNS(ns, "filter");
      f.id = id;
      f.setAttribute("x", "0"); f.setAttribute("y", "0"); f.setAttribute("width", w); f.setAttribute("height", h);
      f.setAttribute("filterUnits", "userSpaceOnUse");
      f.setAttribute("color-interpolation-filters", "sRGB");
      var fi = document.createElementNS(ns, "feImage");
      fi.setAttribute("href", c.toDataURL());
      fi.setAttribute("x", "0"); fi.setAttribute("y", "0"); fi.setAttribute("width", w); fi.setAttribute("height", h);
      fi.setAttribute("preserveAspectRatio", "none");
      fi.setAttribute("result", "map");
      var dm = document.createElementNS(ns, "feDisplacementMap");
      dm.setAttribute("in", "SourceGraphic"); dm.setAttribute("in2", "map");
      dm.setAttribute("scale", scale);
      dm.setAttribute("xChannelSelector", "R"); dm.setAttribute("yChannelSelector", "G");
      f.appendChild(fi); f.appendChild(dm); svg.appendChild(f);
      var blur = el.dataset.blur || "18";
      el.style.backdropFilter = el.style.webkitBackdropFilter = "url(#" + id + ") blur(" + blur + "px) saturate(170%)";
    };
    var glass = document.querySelectorAll(".glass");
    var ro = new ResizeObserver(function (list) { list.forEach(function (e) { lens(e.target); }); });
    glass.forEach(function (el) { ro.observe(el); });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(timers); stop(agTimers); }
    else { play(); agentPlay(agentIndex); }
  });

  apply();
  play();
  agentPlay(0);
  void reduced;
})();

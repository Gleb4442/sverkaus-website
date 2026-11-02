(function () {
  var root = document.documentElement;
  var store = {
    get: function () { try { return localStorage.getItem("any-lang"); } catch (e) { return null; } },
    set: function (v) { try { localStorage.setItem("any-lang", v); } catch (e) {} }
  };
  var lang = store.get() || ((navigator.language || "").toLowerCase().indexOf("ru") === 0 ? "ru" : "en");
  var button = document.getElementById("lang");


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

  var ui = {
    ru: { press: "Нажатие", listen: "Слушаю", sent: "Отправлено", ph: "Сообщение" },
    en: { press: "Press", listen: "Listening", sent: "Sent", ph: "Message" }
  };
  var scenes = [
    { icon: "/any/assets/img/apps/telegram-app.png", app: "Telegram", to: { ru: "Анна", en: "Anna" },
      thread: [["inc", { ru: "Привет! Ты сегодня в офисе?", en: "Hi! Are you at the office today?" }],
               ["out", { ru: "Нет, работаю из дома", en: "No, working from home" }],
               ["inc", { ru: "Во сколько тогда созвон?", en: "So what time is the call?" }]],
      text: { ru: "Давай в 15:00, а отчёт пришлю до обеда.", en: "Let’s do 3 pm, and I’ll send the report before lunch." } },
    { icon: "/any/assets/img/apps/claude.png", app: "Claude", to: { ru: "", en: "" },
      hello: { ru: "Чем могу помочь?", en: "How can I help?" }, ph: { ru: "Спросите что-нибудь", en: "Ask anything" },
      text: { ru: "Составь план поездки в Лиссабон на три дня, без музеев и ранних подъёмов.", en: "Plan three days in Lisbon for me, no museums and no early mornings." } },
    { icon: "/any/assets/img/apps/slack.svg", app: "Slack", to: { ru: "# дизайн", en: "# design" },
      thread: [["inc", { ru: "Сайт выкатываем после обеда", en: "The site ships after lunch" }],
               ["inc", { ru: "Макет шапки готов?", en: "Is the header mockup ready?" }]],
      text: { ru: "Почти, ссылку кину через десять минут.", en: "Almost, I’ll drop the link in ten minutes." } }
  ];
  var stage = document.getElementById("stage");
  var win = document.getElementById("win");
  var bud = document.getElementById("bud");
  var field = document.getElementById("field");
  var typed = document.getElementById("typed");
  var thread = document.getElementById("thread");
  var status = document.getElementById("status");
  var timers = [];
  var scene = 0;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function after(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function stop() { timers.forEach(clearTimeout); timers = []; }
  function set(state, label) { stage.dataset.state = state; status.textContent = label || ""; }
  function tap() { bud.classList.remove("tap"); void bud.offsetWidth; bud.classList.add("tap"); }
  function bubble(cls, text, anim) {
    var m = document.createElement("p");
    m.className = cls === "hello" ? cls : "msg " + cls + (anim ? "" : " old");
    m.textContent = text;
    thread.appendChild(m);
  }
  function setup(sc) {
    var u = ui[lang];
    document.getElementById("win-icon").src = sc.icon;
    document.getElementById("win-app").textContent = sc.app;
    document.getElementById("win-to").textContent = sc.to[lang];
    thread.textContent = "";
    (sc.thread || []).forEach(function (t) { bubble(t[0], t[1][lang]); });
    if (sc.hello) bubble("hello", sc.hello[lang]);
    typed.textContent = "";
    typed.dataset.ph = sc.ph ? sc.ph[lang] : u.ph;
    field.className = "field";
    stage.classList.remove("focus");
    set("idle");
  }

  function play() {
    stop();
    var sc = scenes[scene], u = ui[lang], words = sc.text[lang].split(" ");
    setup(sc);
    if (still) {
      typed.textContent = sc.text[lang];
      field.classList.add("ready");
      win.className = "win glass in";
      return;
    }
    win.className = "win glass";
    void win.offsetWidth;
    win.classList.add("in");
    after(900, function () {
      tap(); set("press", u.press);
      after(420, function () {
        set("listen", u.listen);
        stage.classList.add("focus");
        var i = 0;
        (function next() {
          if (i) typed.appendChild(document.createTextNode(" "));
          var w = document.createElement("span");
          w.className = "w";
          w.textContent = words[i];
          typed.appendChild(w);
          if (i === 0) field.classList.add("ready");
          if (++i < words.length) { after(150 + words[i - 1].length * 16, next); return; }
          after(700, function () {
            tap(); set("press", u.press);
            field.classList.add("go");
            after(300, function () {
              stage.classList.remove("focus");
              field.className = "field";
              typed.textContent = "";
              var h = thread.querySelector(".hello");
              if (h) h.remove();
              bubble("out", sc.text[lang], true);
              set("sent", u.sent);
              after(2000, function () {
                win.classList.add("out");
                after(600, function () { scene = (scene + 1) % scenes.length; play(); });
              });
            });
          });
        })();
      });
    });
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else play(); });

  var examples = {
    ru: [
      ["Напиши вежливый отказ кандидату на вакансию дизайнера", "Анна, здравствуйте!\nСпасибо за отклик и время, которое вы уделили заданию. Мы решили продолжить с другим кандидатом. Будем рады вернуться к вам, когда откроем новые позиции."],
      ["Чем отличаются Supabase и Firebase? Коротко", "- Supabase: Postgres, SQL, открытый код\n- Firebase: NoSQL, сервисы Google, закрытый код\n- Оба дают авторизацию и хранение файлов"],
      ["Выделено письмо. «Сделай короче и убери извинения»", "Анна, отчёт будет у вас завтра до обеда. Если нужны правки, напишите сегодня."]
    ],
    en: [
      ["Write a polite rejection for a designer candidate", "Hi Anna,\nThank you for applying and for the time you gave the assignment. We’ve decided to move forward with another candidate, and we’d be glad to reconnect when new roles open."],
      ["How do Supabase and Firebase differ? Keep it short", "- Supabase: Postgres, SQL, open source\n- Firebase: NoSQL, Google services, closed source\n- Both offer auth and file storage"],
      ["Email selected. “Shorten this and drop the apologies”", "Hi Anna, you’ll have the report by noon tomorrow. If you need changes, let me know today."]
    ]
  };
  var tabs = document.querySelectorAll("#agent-tabs button");
  var current = 0;
  function showExample() {
    var e = examples[lang][current];
    document.getElementById("agent-said").textContent = "«" + e[0].replace(/[«»“”]/g, "") + "»";
    document.getElementById("agent-answer").textContent = e[1];
    tabs.forEach(function (t, i) { t.setAttribute("aria-selected", i === current ? "true" : "false"); });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { current = i; showExample(); });
  });
  button.addEventListener("click", showExample);

  apply();
  showExample();
  play();
})();

// any — product site interactions: language switch, release links, the notch
// HUD state machine (geometry and strings mirror the macOS app) and the demos.
"use strict";
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STOP = Symbol("stop");

  /* ---------------- Language ---------------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }
  };
  const stored = store.get("any-site-language");
  let lang = stored === "en" || stored === "ru" ? stored
    : /^(ru|uk|be|kk)\b/i.test(navigator.language || "ru") ? "ru" : "en";
  const T = (ru, en) => (lang === "ru" ? ru : en);
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;

  $$("[data-en]").forEach(n => { n.dataset.ru = n.textContent; });
  $$("[data-en-html]").forEach(n => { n.dataset.ruHtml = n.innerHTML; });
  $$("[data-en-aria]").forEach(n => { n.dataset.ruAria = n.getAttribute("aria-label") || ""; });

  const config = (() => { try { return JSON.parse($("#release-config").textContent); } catch { return {}; } })();

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.title = T("any — голос в челке вашего Mac", "any — voice in your Mac’s notch");
    $$("[data-en]").forEach(n => { n.textContent = lang === "ru" ? n.dataset.ru : n.dataset.en; });
    $$("[data-en-html]").forEach(n => { n.innerHTML = lang === "ru" ? n.dataset.ruHtml : n.dataset.enHtml; });
    $$("[data-en-aria]").forEach(n => n.setAttribute("aria-label", lang === "ru" ? n.dataset.ruAria : n.dataset.enAria));
    const button = $("#lang");
    button.textContent = lang === "ru" ? "EN" : "RU";
    button.setAttribute("aria-label", lang === "ru" ? "Switch to English" : "Переключить на русский");
    for (const link of $$(".download")) {
      link.setAttribute("aria-disabled", String(!config.downloadURL));
      if (config.downloadURL) link.href = config.downloadURL; else link.removeAttribute("href");
      const label = link.querySelector(".dl-label");
      if (label) label.textContent = config.downloadURL ? T("Скачать для Mac", "Download for Mac") : T("Релиз готовится", "Release in preparation");
      const short = link.querySelector(".btn-label-short");
      if (short) short.textContent = config.downloadURL ? T("Скачать", "Download") : T("Скоро", "Soon");
    }
    const support = $("#support");
    if (support && config.supportURL) { support.href = config.supportURL; support.hidden = false; }
  }

  $("#lang").addEventListener("click", () => {
    lang = lang === "ru" ? "en" : "ru";
    store.set("any-site-language", lang);
    applyLanguage();
    demos.forEach(d => d.restart());
    renderVocab(); renderBytes(true);
  });

  /* ---------------- Notch HUD ---------------- */
  // Widths/heights come from NotchHubViewModel.compactLayoutSize; see web_handoff/ui_blueprints.json.
  class Notch {
    constructor(el) {
      this.el = el;
      el.innerHTML = '<div class="notch-body"><div class="aura"></div><div class="notch-row"></div></div>';
      this.row = el.querySelector(".notch-row");
      this.levels = new Array(30).fill(0);
      this.speaking = false;
      this.timers = [];
    }
    clear() { this.timers.forEach(clearInterval); this.timers = []; this.speaking = false; }
    set(state, html = "") {
      this.clear();
      this.el.dataset.state = state;
      this.row.className = "notch-row" + (state === "sheet" ? " sheet-mode" : "");
      this.row.innerHTML = html;
      const wave = this.row.querySelector(".wave");
      if (wave) this.startWave(wave);
      const timer = this.row.querySelector(".timer");
      if (timer) this.startTimer(timer);
    }
    startWave(wave) {
      wave.innerHTML = "<i></i>".repeat(30);
      const bars = [...wave.children];
      const max = this.el.dataset.state === "locked" || this.el.dataset.state === "command" ? 18 : 20;
      let t = 0;
      this.levels.fill(0);
      const tick = () => {
        t += 1;
        let level = 0;
        if (this.speaking) {
          // Syllable-like envelope: bursts with short gaps.
          const syllable = Math.abs(Math.sin(t * 0.9)) * (0.55 + 0.45 * Math.random());
          level = (t % 11 === 0) ? 0.02 : Math.min(1, 0.18 + syllable * 0.85);
        }
        this.levels.shift(); this.levels.push(level);
        bars.forEach((bar, i) => {
          const v = this.levels[i];
          const h = v < 0.04 ? 2.8 : 2.8 + (max - 2.8) * Math.pow(v, 0.92);
          bar.style.height = h + "px";
          bar.style.opacity = v < 0.04 ? 0.4 : 0.58 + 0.38 * v;
        });
      };
      tick();
      this.timers.push(setInterval(tick, reduce ? 400 : 95));
    }
    startTimer(el) {
      let s = 0;
      const show = () => { el.textContent = "00:" + String(Math.min(s, 59)).padStart(2, "0"); };
      show();
      this.timers.push(setInterval(() => { s += 1; show(); }, 1000));
    }

    // ---- State builders (NotchOverlayView.swift) ----
    recording({ locked = false, command = null } = {}) {
      const badge = command === "task"
        ? `<span class="badge-task"><span class="orb"></span>${T("Задача", "Task")}</span>`
        : command === "selection"
          ? `<span class="badge-sel">${icon("translate")}${T("Выделение", "Selection")}</span>` : "";
      const hint = command === "task" ? T("Скажите, что сделать → Fn", "Say what to do → Fn")
        : command === "selection" ? T("Язык или правка → Fn", "Language or edit → Fn") : "";
      const right = locked || command
        ? `<span class="gbtn finish" aria-hidden="true">${icon("check")}</span><span class="gbtn" aria-hidden="true">${icon("xmark")}</span>`
        : `<span class="gbtn" aria-hidden="true">${icon("lock-open")}</span>`;
      this.set(command ? "command" : locked ? "locked" : "hold",
        `${badge}<span class="timer">00:00</span>${hint ? `<span class="hint">${hint}</span>` : ""}<span class="spacer"></span><span class="wave"></span><span class="spacer"></span><span class="gbtn" aria-hidden="true">${icon("chevron-down")}</span>${right}`);
      this.speaking = true;
    }
    processing(status, wide = false) {
      this.set(wide ? "translating" : "processing",
        `<span class="spinner"></span><span class="status">${esc(status)}</span><span class="spacer"></span><span class="gbtn" aria-hidden="true">${icon("chevron-down")}</span><span class="gbtn" aria-hidden="true">${icon("xmark")}</span>`);
    }
    task(status) {
      this.set("task",
        `<span class="orb"></span><span class="status shimmer">${esc(status)}</span><span class="spacer"></span><span class="gbtn" aria-hidden="true">${icon("chevron-down")}</span><span class="gbtn" aria-hidden="true">${icon("xmark")}</span>`);
    }
    done(snippet) {
      this.set("done",
        `<svg class="done-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="snippet">${esc(snippet)}</span><span class="spacer"></span><button type="button" class="copy-pill">${icon("copy")}<span>${T("Скопировать", "Copy")}</span></button><span class="gbtn" aria-hidden="true">${icon("chevron-down")}</span><span class="gbtn" aria-hidden="true">${icon("xmark")}</span>`);
      const pill = this.row.querySelector(".copy-pill");
      pill.addEventListener("click", () => { pill.classList.add("copied"); pill.innerHTML = `${icon("check")}<span>${T("Скопировано", "Copied")}</span>`; });
    }
    idle() { this.set("idle"); }
  }

  /* ---------------- Scenario runner ---------------- */
  class Run {
    constructor() { this.alive = true; }
    stop() { this.alive = false; }
    async wait(ms) {
      if (!this.alive) throw STOP;
      await new Promise(r => setTimeout(r, ms));
      if (!this.alive) throw STOP;
    }
  }
  const caret = '<span class="caret"></span>';
  function renderText(el, html) { el.innerHTML = html + caret; }
  async function type(run, el, text, { prefix = "", step = reduce ? 9999 : 3, delay = 16 } = {}) {
    for (let i = 0; i <= text.length; i += step) {
      renderText(el, prefix + esc(text.slice(0, i)));
      await run.wait(delay);
    }
    renderText(el, prefix + esc(text));
  }
  function said(stage, text) {
    let bubble = stage.querySelector(".said");
    if (!bubble) { bubble = document.createElement("div"); bubble.className = "said"; stage.appendChild(bubble); }
    bubble.innerHTML = text ? `${icon("mic")}<span>${esc(text)}</span>` : "";
    bubble.classList.toggle("show", Boolean(text));
  }

  // A demo loops its scenario while its stage is on screen.
  const demos = [];
  function demo(stageEl, scenario) {
    const d = {
      run: null, visible: false, paused: false,
      start() {
        if (this.run || !this.visible || this.paused) return;
        const run = this.run = new Run();
        (async () => {
          try { for (;;) { await scenario(run); await run.wait(2600); } }
          catch (e) { if (e !== STOP) console.error(e); }
          finally { if (this.run === run) this.run = null; }
        })();
      },
      stop() { if (this.run) { this.run.stop(); this.run = null; } },
      restart() { this.stop(); this.start(); }
    };
    new IntersectionObserver(([entry]) => {
      d.visible = entry.isIntersecting;
      if (d.visible) d.start(); else d.stop();
    }, { threshold: 0.25 }).observe(stageEl);
    demos.push(d);
    return d;
  }

  /* ---------------- Hero: Fn dictation ---------------- */
  const heroNotch = new Notch($("#hero-notch"));
  const heroText = $("#hero-text");
  const heroStage = $(".hero-stage");
  const heroLines = () => [
    T("Давайте оставим утро свободным для самого важного: созвон с командой переносим на 15:00.",
      "Let’s keep the morning clear for what matters: the team call moves to 3 p.m."),
    T("Чуть меньше печатать. Чуть больше пространства, чтобы думать.",
      "A little less typing. A little more room to think.")
  ];
  let heroCount = 0;
  async function heroInsert(run) {
    const lines = heroLines();
    const line = lines[heroCount % lines.length];
    heroCount += 1;
    heroNotch.processing(T("Распознавание речи…", "Recognizing speech…"));
    await run.wait(850);
    const before = heroText.dataset.done || "";
    const joined = (before ? before + "\n\n" : "") + line;
    heroText.dataset.done = heroCount % 2 === 0 ? "" : joined;
    // Dictation is pasted in one go, not typed.
    heroText.innerHTML = esc(joined) + caret;
    heroText.classList.remove("flash"); void heroText.offsetWidth; heroText.classList.add("flash");
    heroNotch.done(line);
    await run.wait(2600);
    heroNotch.idle();
  }
  const heroDemo = demo(heroStage, async run => {
    if (!heroText.dataset.done) renderText(heroText, "");
    await run.wait(1100);
    heroNotch.recording();
    $("#hero-fn").classList.add("is-down");
    await run.wait(2700);
    $("#hero-fn").classList.remove("is-down");
    heroNotch.speaking = false;
    await heroInsert(run);
  });
  // Hold-to-talk on the page: the on-screen fn key, or F on the keyboard.
  let holdRun = null, resumeTimer = 0;
  function holdStart() {
    if (holdRun) return;
    heroDemo.paused = true; heroDemo.stop(); clearTimeout(resumeTimer);
    holdRun = new Run();
    $("#hero-fn").classList.add("is-down");
    if (!heroText.dataset.done) renderText(heroText, "");
    heroNotch.recording();
  }
  async function holdEnd() {
    if (!holdRun) return;
    const run = holdRun;
    $("#hero-fn").classList.remove("is-down");
    heroNotch.speaking = false;
    try { await heroInsert(run); } catch (e) { if (e !== STOP) console.error(e); }
    if (holdRun === run) holdRun = null;
    resumeTimer = setTimeout(() => { heroDemo.paused = false; heroDemo.start(); }, 6000);
  }
  const fnKey = $("#hero-fn");
  fnKey.addEventListener("pointerdown", e => { e.preventDefault(); fnKey.setPointerCapture?.(e.pointerId); holdStart(); });
  fnKey.addEventListener("pointerup", holdEnd);
  fnKey.addEventListener("pointercancel", holdEnd);
  fnKey.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); holdStart(); } });
  fnKey.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") holdEnd(); });
  addEventListener("keydown", e => {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || (e.key !== "f" && e.key !== "F" && e.key !== "а" && e.key !== "А")) return;
    if (e.target.closest("input, textarea, [contenteditable]") || !heroDemo.visible) return;
    holdStart();
  });
  addEventListener("keyup", e => { if (["f", "F", "а", "А"].includes(e.key)) holdEnd(); });

  /* ---------------- Task Assistant ---------------- */
  const tasks = () => [
    {
      q: T("Напиши вежливый отказ кандидату на вакансию дизайнера", "Write a polite rejection to the designer candidate"),
      to: "anna@studio.design", subject: T("По поводу вакансии", "About the position"), web: false,
      a: T("Анна, здравствуйте!\n\nСпасибо за отклик на вакансию дизайнера и за время, которое вы уделили тестовому заданию. Мы внимательно изучили портфолио, но решили продолжить с кандидатом, чей опыт ближе к нашим текущим задачам.\n\nБудем рады вернуться к вашей кандидатуре, когда откроем новые позиции. Удачи в поиске!",
        "Hi Anna,\n\nThank you for applying for the designer role and for the time you spent on the test assignment. We reviewed your portfolio carefully, but decided to move forward with a candidate whose experience is closer to our current work.\n\nWe’d be glad to reconnect when new positions open. Good luck with your search!")
    },
    {
      q: T("Составь список вопросов для собеседования по Swift", "List interview questions for a Swift developer"),
      to: "team@studio.dev", subject: T("Собеседование iOS", "iOS interview"), web: false,
      a: T("- Чем struct отличается от class и когда что выбирать?\n- Как работает ARC и откуда берутся циклы сильных ссылок?\n- Что такое actor и какую проблему он решает?\n- Как устроены async/await и отмена Task?\n- Когда нужен протокол с associatedtype?\n- Как вы тестируете код, который ходит в сеть?",
        "- How does a struct differ from a class, and when do you pick each?\n- How does ARC work, and where do retain cycles come from?\n- What is an actor and which problem does it solve?\n- How do async/await and Task cancellation work?\n- When do you need a protocol with an associatedtype?\n- How do you test code that talks to the network?")
    },
    {
      q: T("Коротко объясни, чем Supabase отличается от Firebase", "Explain briefly how Supabase differs from Firebase"),
      to: "cto@studio.dev", subject: T("Выбор бэкенда", "Choosing a backend"), web: true,
      a: T("Supabase — открытая платформа поверх PostgreSQL: SQL, авторизация, файловое хранилище и realtime. Firebase от Google построен на NoSQL-базах Firestore и Realtime Database.\n- Данные: таблицы и связи в Supabase, документы и коллекции в Firebase.\n- Хостинг: Supabase можно развернуть у себя, Firebase работает в Google Cloud.\n- Доступ: row-level security в Postgres против правил безопасности Firebase.",
        "Supabase is an open-source platform built on PostgreSQL: SQL, auth, file storage and realtime. Google’s Firebase is built on the NoSQL databases Firestore and Realtime Database.\n- Data: tables and relations in Supabase, documents and collections in Firebase.\n- Hosting: Supabase can be self-hosted, Firebase runs on Google Cloud.\n- Access: Postgres row-level security versus Firebase security rules.")
    }
  ];
  let taskIndex = 0;
  const taskNotch = new Notch($("#task-notch"));
  const taskStage = $("#task-stage");
  const taskDemo = demo(taskStage, async run => {
    const t = tasks()[taskIndex];
    $("#task-to").textContent = t.to;
    $("#task-subject").textContent = t.subject;
    const out = $("#task-text"), card = $("#task-card");
    card.classList.remove("show");
    renderText(out, "");
    taskNotch.idle(); said(taskStage, "");
    await run.wait(900);
    taskNotch.recording({ command: "task" });
    await run.wait(500);
    said(taskStage, "«" + t.q + "»");
    await run.wait(2300);
    taskNotch.speaking = false;
    said(taskStage, "");
    taskNotch.task(T("Работаю над задачей", "Working on it"));
    await run.wait(t.web ? 2600 : 1900);
    taskNotch.task(t.web ? T("Нашёл в интернете · вставляю ответ", "Found online · inserting") : T("Вставляю ответ", "Inserting the answer"));
    await run.wait(700);
    await type(run, out, t.a, { step: 4, delay: 14 });
    taskNotch.done(t.a.split("\n")[0]);
    $("#task-chip").innerHTML = t.web
      ? `${icon("globe")}<span>${T("Задача · интернет", "Task · web")}</span>`
      : `<span class="orb"></span><span>${T("Задача", "Task")}</span>`;
    $("#task-card-q").textContent = T("Ваш запрос: ", "Your request: ") + t.q;
    $("#task-card-a").textContent = t.a;
    card.classList.add("show");
    await run.wait(3600);
    taskNotch.idle();
    await run.wait(600);
    taskIndex = (taskIndex + 1) % 3;
    syncPrompts();
  });
  function syncPrompts() { $$("#task-prompts .prompt").forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.task) === taskIndex))); }
  $$("#task-prompts .prompt").forEach(b => b.addEventListener("click", () => { taskIndex = Number(b.dataset.task); syncPrompts(); taskDemo.restart(); }));

  /* ---------------- Translation ---------------- */
  let trMode = "selection", trField = "editable";
  const trNotch = new Notch($("#tr-notch"));
  const trStage = $("#tr-stage"), trBody = $("#tr-body");
  const trData = () => ({
    chat: T("Привет! Завтра буду в офисе в 10:30. Пришли, пожалуйста, отчёт до полудня.", "Hi! I’ll be in the office at 10:30 tomorrow. Please send the report before noon."),
    chatOut: T("Hi! I’ll be in the office at 10:30 tomorrow. Please send the report before noon.", "¡Hola! Mañana estaré en la oficina a las 10:30. Envíame el informe antes del mediodía, por favor."),
    chatCmd: T("на английский", "to Spanish"),
    chatLang: T("Английский", "Spanish"),
    article: "Apple Silicon runs speech and language models on the Neural Engine and GPU, so dictation can stay on the device without a round trip to the cloud.",
    articleOut: T("Apple Silicon запускает речевые и языковые модели на Neural Engine и GPU, поэтому диктовка может оставаться на устройстве без обращения к облаку.",
      "Apple Silicon ejecuta modelos de voz y de lenguaje en el Neural Engine y la GPU, así que el dictado puede quedarse en el dispositivo sin pasar por la nube."),
    articleCmd: T("переведи на русский", "translate to Spanish"),
    articleLang: T("Русский", "Spanish"),
    speech: T("Завтра в десять встреча с командой дизайна, подготовь, пожалуйста, макеты главного экрана.", "Mañana a las diez nos reunimos con el equipo de diseño; prepara, por favor, las maquetas de la pantalla principal."),
    speechOut: "Tomorrow at ten we have a meeting with the design team; please prepare the mockups of the home screen."
  });
  function trLayout() {
    const d = trData();
    if (trMode === "speech") {
      trBody.innerHTML = `<div class="app-window"><div class="app-bar"><span class="lights"><i></i><i></i><i></i></span><span class="app-name"><span class="app-dot" style="background:#e5b400">N</span>${T("Заметки", "Notes")}</span></div><div class="app-body"><div class="field-meta"><b>${T("Встреча", "Meeting")}</b></div><div class="typed" id="tr-text"></div></div></div>`;
    } else if (trField === "editable") {
      trBody.innerHTML = `<div class="app-window"><div class="app-bar"><span class="lights"><i></i><i></i><i></i></span><span class="app-name"><span class="app-dot" style="background:#2aabee">T</span>Telegram</span></div><div class="app-body"><div class="field-meta"><b>Maria</b><span>${T("в сети", "online")}</span></div><div class="typed chat-input" id="tr-text"></div></div></div><p class="toast-undo" id="tr-note"></p>`;
    } else {
      trBody.innerHTML = `<div class="app-window"><div class="app-bar"><span class="lights"><i></i><i></i><i></i></span><span class="app-name"><span class="app-dot" style="background:#1e90ff">S</span>Safari</span><span class="urlbar">developer.apple.com</span></div><div class="app-body article"><h4>Machine learning on Apple Silicon</h4><p id="tr-text">${esc(d.article)}</p></div></div>`;
    }
  }
  async function selectWords(run, el, text, html = s => esc(s)) {
    const words = text.split(" ");
    for (let i = 1; i <= words.length; i += reduce ? words.length : 2) {
      el.innerHTML = `<span class="sel">${html(words.slice(0, i).join(" "))}</span>${words.length > i ? " " + html(words.slice(i).join(" ")) : ""}`;
      await run.wait(40);
    }
    el.innerHTML = `<span class="sel">${html(text)}</span>`;
  }
  const trDemo = demo(trStage, async run => {
    const d = trData();
    trNotch.idle(); said(trStage, "");
    trLayout();
    const el = $("#tr-text");
    if (trMode === "speech") {
      renderText(el, "");
      await run.wait(900);
      trNotch.recording();
      await run.wait(400);
      said(trStage, "«" + d.speech + "»");
      await run.wait(2800);
      trNotch.speaking = false; said(trStage, "");
      trNotch.processing(T("Перевод речи на английский…", "Translating speech to English…"));
      await run.wait(1300);
      el.innerHTML = esc(d.speechOut) + caret;
      el.classList.add("flash");
      trNotch.done(d.speechOut);
      await run.wait(3200);
      trNotch.idle();
      return;
    }
    if (trField === "editable") {
      renderText(el, esc(d.chat));
      await run.wait(900);
      await selectWords(run, el, d.chat);
      await run.wait(400);
      trNotch.recording({ command: "selection" });
      await run.wait(500);
      said(trStage, "«" + d.chatCmd + "»");
      await run.wait(1500);
      trNotch.speaking = false; said(trStage, "");
      trNotch.processing(T("Перевод → ", "Translation → ") + d.chatLang, true);
      await run.wait(1300);
      el.innerHTML = esc(d.chatOut) + caret;
      el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
      trNotch.done(T("Выделение заменено переводом", "Selection replaced with translation"));
      await run.wait(3400);
      trNotch.idle();
      return;
    }
    // Read-only: the sheet opens from the notch.
    await run.wait(900);
    await selectWords(run, el, d.article);
    await run.wait(400);
    trNotch.recording({ command: "selection" });
    await run.wait(500);
    said(trStage, "«" + d.articleCmd + "»");
    await run.wait(1700);
    trNotch.speaking = false; said(trStage, "");
    trNotch.processing(T("Перевод → ", "Translation → ") + d.articleLang, true);
    await run.wait(1200);
    trNotch.set("sheet", sheetHTML(d));
    wireSheet(d);
    await run.wait(7000);
    trNotch.idle();
  });
  function sheetHTML(d) {
    return `<div class="sheet-head"><span>${T("Перевод выделения", "Selection translation")}</span><span class="sheet-status">${icon("check")}${T("Перевод готов", "Translation ready")}</span></div>
      <div class="sheet-langs"><span class="lchip">${T("Автоопределение (Английский)", "Auto-detect (English)")}<svg><use href="#i-chevron-down"/></svg></span><span class="swap">${icon("swap")}</span><span class="lchip">${esc(d.articleLang)}<svg><use href="#i-chevron-down"/></svg></span></div>
      <div class="sheet-result">${esc(d.articleOut)}</div>
      <div class="sheet-actions"><button type="button" class="sbtn" data-act="copy">${icon("copy")}<span>${T("Скопировать", "Copy")}</span></button><button type="button" class="sbtn" data-act="listen">${icon("speaker")}<span>${T("Слушать", "Listen")}</span></button><span class="sbtn ghost">${T("Повторить перевод", "Retry translation")}</span><span class="sbtn ghost">${T("Открыть переводчик", "Open translator")}</span></div>
      <div class="sheet-source">› ${T("Исходное выделение", "Original selection")}</div>`;
  }
  function wireSheet(d) {
    const root = $("#tr-notch");
    root.querySelector('[data-act="copy"]').addEventListener("click", e => {
      const b = e.currentTarget; b.classList.add("ok"); b.innerHTML = `${icon("check")}<span>${T("Скопировано!", "Copied!")}</span>`;
      trDemo.paused = true; trDemo.stop(); setTimeout(() => { trDemo.paused = false; trDemo.start(); }, 6000);
    });
    root.querySelector('[data-act="listen"]').addEventListener("click", () => {
      if (!("speechSynthesis" in window)) return;
      trDemo.paused = true; trDemo.stop();
      const u = new SpeechSynthesisUtterance(d.articleOut);
      u.lang = lang === "ru" ? "ru-RU" : "es-ES";
      u.onend = () => { trDemo.paused = false; trDemo.start(); };
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    });
  }
  function bindSeg(root, attr, onPick) {
    $$("button", root).forEach(b => b.addEventListener("click", () => {
      $$("button", root).forEach(x => x.setAttribute("aria-selected", String(x === b)));
      onPick(b.dataset[attr]);
    }));
  }
  bindSeg($("#tr-mode"), "mode", m => {
    trMode = m;
    $("#tr-copy-selection").hidden = m !== "selection";
    $("#tr-copy-speech").hidden = m !== "speech";
    trDemo.paused = false; trDemo.restart();
  });
  bindSeg($("#tr-field"), "field", f => { trField = f; trDemo.paused = false; trDemo.restart(); });

  /* ---------------- Vocabulary ---------------- */
  // Example rules in the shape of VocabularyEntry; the scoped rule mirrors VocabularyTests.swift:273-280.
  let vocabApp = "xcode";
  const bundles = { xcode: "com.apple.dt.Xcode", vscode: "com.microsoft.VSCode", telegram: "ru.keepcoder.Telegram" };
  function vocabCase() {
    if (lang === "ru") return {
      heard: "Открой пул реквест про супабейс и проверь миграцию в постгрес.",
      rules: [
        { from: "пул реквест", to: "pull request", scope: ["xcode", "vscode"], label: "Термин · только Xcode, VS Code" },
        { from: "пул реквест", to: "пул-реквест", scope: null, label: "Замена · все приложения" },
        { from: "супабейс", to: "Supabase", scope: null, label: "Бренд · как в словаре" },
        { from: "постгрес", to: "PostgreSQL", scope: null, label: "Бренд · как в словаре" }
      ]
    };
    return {
      heard: "Rename user ID in the super base client and check the post gress migration.",
      rules: [
        { from: "user ID", to: "userId", scope: ["xcode", "vscode"], label: "Technical · Xcode, VS Code only" },
        { from: "super base", to: "Supabase", scope: null, label: "Brand · as in dictionary" },
        { from: "post gress", to: "PostgreSQL", scope: null, label: "Brand · as in dictionary" }
      ]
    };
  }
  function renderVocab() {
    const c = vocabCase();
    // Scoped rules win over global ones for the same alias (Vocabulary.swift:241-247).
    const active = [];
    for (const r of c.rules) {
      if (r.scope && !r.scope.includes(vocabApp)) continue;
      if (active.some(a => a.from === r.from)) continue;
      active.push(r);
    }
    let heard = esc(c.heard), out = esc(c.heard);
    for (const r of c.rules) heard = heard.replace(esc(r.from), `<mark>${esc(r.from)}</mark>`);
    for (const r of active) out = out.replace(esc(r.from), `<mark class="hit">${esc(r.to)}</mark>`);
    for (const r of c.rules) if (!active.includes(r) && !active.some(a => a.from === r.from)) out = out.replace(esc(r.from), `<mark class="keep">${esc(r.from)}</mark>`);
    $("#vocab-heard").innerHTML = `${T("Распознано", "Recognized")}: ${heard}`;
    $("#vocab-out").innerHTML = `${T("Вставлено", "Inserted")}: ${out}`;
    $("#vocab-trace").innerHTML = [`frontmost · ${bundles[vocabApp]}`]
      .concat(active.map(r => `«${esc(r.from)}» → ${esc(r.to)} · ${esc(r.label)}`))
      .concat(c.rules.filter(r => r.scope && !r.scope.includes(vocabApp)).map(r => `«${esc(r.from)}» → ${esc(r.to)} · ${T("пропущено: другое приложение", "skipped: different app")}`))
      .map(s => `<div>${s}</div>`).join("");
  }
  bindSeg($("#vocab-app"), "app", a => { vocabApp = a; renderVocab(); });
  renderVocab();

  // Level 1: fill the 224-byte prompt budget the way Vocabulary.selectHints does.
  const hintTerms = ["Supabase", "PostgreSQL", "Claude Code", "Notion", "GitHub", "kubectl", "OAuth", "SwiftUI", "TestFlight", "Xcode", "Figma", "Linear", "Vercel", "Tailwind", "Kubernetes", "Grafana", "Terraform", "Cloudflare", "Sentry", "Redis", "Prisma", "Webflow", "Miro", "Jira", "Confluence", "Postman", "Docker", "Nginx"];
  let bytesDone = false;
  function renderBytes(force) {
    if (bytesDone && !force) return;
    bytesDone = true;
    const cloud = $("#hint-cloud"), bar = $("#bytes .bytes-bar i"), count = $("#bytes-count");
    cloud.innerHTML = "";
    const enc = new TextEncoder();
    let used = 0, n = 0;
    hintTerms.forEach((term, i) => {
      const size = enc.encode(term).length + (n ? 2 : 0);
      const fits = used + size <= 224 && n < 32;
      const chip = document.createElement("span");
      chip.textContent = term;
      if (fits) { used += size; n += 1; } else { chip.style.opacity = ".3"; chip.style.textDecoration = "line-through"; chip.title = T("не помещается в 224 байта", "does not fit in 224 bytes"); }
      chip.style.transition = "opacity .3s"; chip.style.opacity = "0";
      cloud.appendChild(chip);
      setTimeout(() => { chip.style.opacity = fits ? "1" : ".3"; }, reduce ? 0 : 60 * i);
    });
    setTimeout(() => { bar.style.width = (used / 224 * 100) + "%"; count.textContent = `${used} / 224 B · ${n} ${T("терминов", "terms")}`; }, reduce ? 0 : 200);
  }
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { renderBytes(); o.disconnect(); } }, { threshold: .4 }).observe($("#bytes"));

  /* ---------------- Chain ---------------- */
  const chainNotch = new Notch($("#chain-notch"));
  const chainStage = $("#chain-stage");
  let chainFrom = 0;
  const outline = () => T(
    "- Проблема: команды тратят часы на рутинный текст\n- Решение: any — голос, задачи и перевод прямо в челке Mac\n- Как работает: Fn — диктовка, Fn + ⌃ — команды\n- Приватность: локальные Whisper и Qwen на Apple Silicon\n- Запуск: 30 дней бесплатно, затем одна покупка",
    "- Problem: teams spend hours on routine text\n- Solution: any — voice, tasks and translation right in the Mac’s notch\n- How it works: Fn for dictation, Fn + ⌃ for commands\n- Privacy: local Whisper and Qwen on Apple Silicon\n- Launch: 30 days free, then a single purchase");
  const german = "- Problem: Teams verbringen Stunden mit Routinetexten\n- Lösung: any — Stimme, Aufgaben und Übersetzung direkt in der Notch des Mac\n- So funktioniert es: Fn für Diktat, Fn + ⌃ für Befehle\n- Datenschutz: lokale Whisper- und Qwen-Modelle auf Apple Silicon\n- Start: 30 Tage kostenlos, danach ein einmaliger Kauf";
  function markStep(i) { $$("#chain-steps .step").forEach(s => { if (Number(s.dataset.step) === i) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current"); }); }
  const nl = s => esc(s);
  const chainDemo = demo(chainStage, async run => {
    const el = $("#chain-text");
    const from = chainFrom; chainFrom = 0;
    chainNotch.idle(); said(chainStage, "");
    if (from === 0) {
      markStep(0); renderText(el, "");
      await run.wait(800);
      chainNotch.recording({ command: "task" });
      await run.wait(400);
      said(chainStage, T("«Напиши тезисный план презентации нового продукта»", "“Write a bullet outline for the new product presentation”"));
      await run.wait(2200);
      chainNotch.speaking = false; said(chainStage, "");
      chainNotch.task(T("Работаю над задачей", "Working on it"));
      await run.wait(1700);
      chainNotch.task(T("Вставляю ответ", "Inserting the answer"));
      await type(run, el, outline(), { step: 4, delay: 14 });
      chainNotch.done(outline().split("\n")[0]);
      await run.wait(2200);
      chainNotch.idle();
    } else renderText(el, nl(outline()));
    if (from <= 1) {
      markStep(1);
      await run.wait(700);
      el.innerHTML = `<span class="sel">${nl(outline())}</span>`;
      await run.wait(700);
      chainNotch.recording({ command: "selection" });
      await run.wait(400);
      said(chainStage, T("«на немецкий»", "“to German”"));
      await run.wait(1500);
      chainNotch.speaking = false; said(chainStage, "");
    } else el.innerHTML = `<span class="sel">${nl(outline())}</span>`;
    markStep(2);
    chainNotch.processing(T("Перевод → Немецкий", "Translation → German"), true);
    await run.wait(1400);
    el.innerHTML = nl(german) + caret;
    el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
    chainNotch.done(T("Выделение заменено переводом", "Selection replaced with translation"));
    await run.wait(3600);
    chainNotch.idle();
  });
  $$("#chain-steps .step").forEach(s => s.addEventListener("click", () => { chainFrom = Number(s.dataset.step); markStep(chainFrom); chainDemo.restart(); }));

  /* ---------------- Recorded loops (optional) ---------------- */
  // A file listed in assets/video/manifest.json replaces the live simulation of the stage with the same data-video key.
  fetch("assets/video/manifest.json").then(r => (r.ok ? r.json() : null)).then(m => {
    const videos = (m && m.videos) || {};
    for (const stage of $$("[data-video]")) {
      const file = videos[stage.dataset.video];
      if (!file) continue;
      const v = document.createElement("video");
      Object.assign(v, { autoplay: true, loop: true, muted: true, playsInline: true, src: "assets/video/" + file });
      v.className = "stage-video";
      v.setAttribute("aria-hidden", "true");
      v.addEventListener("canplay", () => stage.classList.add("has-video"), { once: true });
      stage.appendChild(v);
    }
  }).catch(() => { /* opened from disk or no manifest: keep the live simulation */ });

  /* ---------------- Page chrome ---------------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(el => io.observe(el));
  const clock = $("#hero-clock");
  const tickClock = () => { const d = new Date(); clock.textContent = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0"); };
  tickClock(); setInterval(tickClock, 30000);

  applyLanguage();
})();

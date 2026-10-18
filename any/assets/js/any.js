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
      const short = link.classList.contains("btn-sm");
      label.textContent = config.downloadURL
        ? (short ? T("Скачать", "Download") : T("Скачать для Mac", "Download for Mac"))
        : (short ? T("Скоро", "Soon") : T("Релиз готовится", "Release in preparation"));
    }
    const support = $("#support");
    if (support && config.supportURL) { support.href = config.supportURL; support.hidden = false; }
    syncTranslationMeta();
    syncFlowMeta();
  }

  $("#lang").addEventListener("click", () => {
    lang = lang === "ru" ? "en" : "ru";
    store.set("any-site-language", lang);
    applyLanguage();
    demos.forEach(d => d.restart());
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
    clear() { this.timers.forEach(clearInterval); this.timers = []; this.speaking = false; this.el.style.setProperty("--lvl", 0); }
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
      const max = this.el.dataset.state === "command" ? 18 : 20;
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
        // The glow around the notch breathes with the voice.
        this.el.style.setProperty("--lvl", (this.levels.slice(-4).reduce((a, b) => a + b, 0) / 4).toFixed(2));
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
    recording({ command = null } = {}) {
      const badge = command === "task"
        ? `<span class="badge-task"><span class="orb"></span>${T("Задача", "Task")}</span>`
        : command === "selection"
          ? `<span class="badge-sel">${icon("translate")}${T("Выделение", "Selection")}</span>` : "";
      const hint = command === "task" ? T("Скажите, что сделать → Fn", "Say what to do → Fn")
        : command === "selection" ? T("Язык или правка → Fn", "Language or edit → Fn") : "";
      const right = command
        ? `<span class="gbtn finish" aria-hidden="true">${icon("check")}</span><span class="gbtn" aria-hidden="true">${icon("xmark")}</span>`
        : `<span class="gbtn" aria-hidden="true">${icon("lock-open")}</span>`;
      this.set(command ? "command" : "hold",
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
  async function type(run, el, text, { step = reduce ? 9999 : 4, delay = 14 } = {}) {
    for (let i = 0; i <= text.length; i += step) {
      renderText(el, esc(text.slice(0, i)));
      await run.wait(delay);
    }
    renderText(el, esc(text));
  }
  // Pasted text: every word condenses out of a blur, one after another.
  function words(text, from = 0) {
    return text.split(/(\s+)/).map((part, i) => /^\s+$/.test(part) ? part : `<span class="w" style="--i:${from + i}">${esc(part)}</span>`).join("");
  }
  // Decoding effect: characters pass through glyphs of the target text before settling.
  async function morph(run, el, from, to, { frames = reduce ? 1 : 20, delay = 38, wrap = "" } = {}) {
    const a = Array.from(from), b = Array.from(to);
    const pool = b.filter(c => /\S/.test(c));
    const len = Math.max(a.length, b.length);
    for (let f = 1; f <= frames; f++) {
      const p = f / frames * 1.25;
      let html = "";
      for (let i = 0; i < len; i++) {
        const at = i / len;
        if (p >= at + 0.25) html += esc(b[i] ?? "");
        else if (p >= at) html += /\s/.test(b[i] ?? " ") ? (b[i] ?? "") : `<span class="glyph">${esc(pool[(Math.random() * pool.length) | 0] || "·")}</span>`;
        else html += esc(a[i] ?? "");
      }
      el.innerHTML = wrap ? wrap.replace("$", html) : html;
      await run.wait(delay);
    }
    el.innerHTML = wrap ? wrap.replace("$", esc(to)) : esc(to);
  }
  function said(stage, text) {
    let bubble = stage.querySelector(".said");
    if (!bubble) { bubble = document.createElement("div"); bubble.className = "said"; stage.appendChild(bubble); }
    if (text) { bubble.innerHTML = `${icon("mic")}<span>${esc(text)}</span>`; bubble.className = "said show"; }
    else if (bubble.classList.contains("show")) bubble.className = "said up"; // pulled into the notch
    else bubble.className = "said";
  }

  // A demo loops its scenario while its element is on screen.
  const demos = [];
  function demo(el, scenario, { pause = 2600 } = {}) {
    const d = {
      run: null, visible: false, paused: false,
      start() {
        if (this.run || !this.visible || this.paused) return;
        const run = this.run = new Run();
        (async () => {
          try { for (;;) { await scenario(run); await run.wait(pause); } }
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
    }, { threshold: 0.25 }).observe(el);
    demos.push(d);
    return d;
  }
  function bindTabs(root, attr, onPick, pressed = "aria-selected") {
    $$("button", root).forEach(b => b.addEventListener("click", () => {
      $$("button", root).forEach(x => x.setAttribute(pressed, String(x === b)));
      onPick(b.dataset[attr]);
    }));
  }

  /* ---------------- Hero: Fn dictation ---------------- */
  const heroNotch = new Notch($("#hero-notch"));
  const heroText = $("#hero-text");
  const heroStage = $("#hero-stage");
  const fnKey = $("#hero-fn");
  const heroLines = () => [
    T("Давайте оставим утро свободным: созвон с командой переносим на 15:00.",
      "Let’s keep the morning clear: the team call moves to 3 p.m."),
    T("Чуть меньше печатать. Чуть больше времени думать.",
      "A little less typing. A little more time to think.")
  ];
  let heroCount = 0, heroDone = "";
  async function heroInsert(run) {
    const line = heroLines()[heroCount % 2];
    heroCount += 1;
    heroNotch.processing(T("Распознавание речи…", "Recognizing speech…"));
    await run.wait(850);
    // Dictation is pasted in one go; the words then condense into place.
    const before = heroDone;
    heroText.innerHTML = (before ? esc(before) + "\n\n" : "") + words(line) + caret;
    heroDone = heroCount % 2 === 0 ? "" : line;
    heroNotch.done(line);
    await run.wait(2800);
    heroNotch.idle();
  }
  const heroDemo = demo(heroStage, async run => {
    if (!heroDone) renderText(heroText, "");
    await run.wait(1000);
    heroNotch.recording();
    fnKey.classList.add("is-down");
    await run.wait(2700);
    fnKey.classList.remove("is-down");
    heroNotch.speaking = false;
    await heroInsert(run);
  }, { pause: 1600 });
  // Hold-to-talk on the page: the on-screen fn key, or F on the keyboard.
  let holdRun = null, resumeTimer = 0;
  function holdStart() {
    if (holdRun) return;
    heroDemo.paused = true; heroDemo.stop(); clearTimeout(resumeTimer);
    holdRun = new Run();
    fnKey.classList.add("is-down");
    if (!heroDone) renderText(heroText, "");
    heroNotch.recording();
  }
  async function holdEnd() {
    if (!holdRun) return;
    const run = holdRun;
    fnKey.classList.remove("is-down");
    heroNotch.speaking = false;
    try { await heroInsert(run); } catch (e) { if (e !== STOP) console.error(e); }
    if (holdRun === run) holdRun = null;
    resumeTimer = setTimeout(() => { heroDemo.paused = false; heroDemo.start(); }, 6000);
  }
  fnKey.addEventListener("pointerdown", e => { e.preventDefault(); fnKey.setPointerCapture?.(e.pointerId); holdStart(); });
  fnKey.addEventListener("pointerup", holdEnd);
  fnKey.addEventListener("pointercancel", holdEnd);
  fnKey.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); holdStart(); } });
  fnKey.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") holdEnd(); });
  addEventListener("keydown", e => {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || !["f", "F", "а", "А"].includes(e.key)) return;
    if (e.target.closest("input, textarea, [contenteditable]") || !heroDemo.visible) return;
    holdStart();
  });
  addEventListener("keyup", e => { if (["f", "F", "а", "А"].includes(e.key)) holdEnd(); });

  /* ---------------- Task Assistant ---------------- */
  const tasks = () => [
    {
      q: T("Напиши вежливый отказ кандидату на вакансию дизайнера", "Write a polite rejection to the designer candidate"),
      to: "anna@studio.design", web: false,
      a: T("Анна, здравствуйте!\n\nСпасибо за отклик на вакансию дизайнера и за время, которое вы уделили тестовому заданию. Мы решили продолжить с кандидатом, чей опыт ближе к нашим текущим задачам.\n\nБудем рады вернуться к вашей кандидатуре, когда откроем новые позиции.",
        "Hi Anna,\n\nThank you for applying for the designer role and for the time you spent on the test assignment. We decided to move forward with a candidate whose experience is closer to our current work.\n\nWe’d be glad to reconnect when new positions open.")
    },
    {
      q: T("Составь список вопросов для собеседования по Swift", "List interview questions for a Swift developer"),
      to: "team@studio.dev", web: false,
      a: T("- Чем struct отличается от class?\n- Как работает ARC и откуда берутся циклы ссылок?\n- Какую проблему решает actor?\n- Как устроены async/await и отмена Task?\n- Как вы тестируете сетевой код?",
        "- How does a struct differ from a class?\n- How does ARC work, and where do retain cycles come from?\n- Which problem does an actor solve?\n- How do async/await and Task cancellation work?\n- How do you test networking code?")
    },
    {
      q: T("Коротко объясни, чем Supabase отличается от Firebase", "Explain briefly how Supabase differs from Firebase"),
      to: "cto@studio.dev", web: true,
      a: T("Supabase — открытая платформа поверх PostgreSQL. Firebase от Google построен на NoSQL-базах.\n- Данные: таблицы и связи против документов и коллекций.\n- Хостинг: Supabase можно развернуть у себя, Firebase — только Google Cloud.\n- Доступ: row-level security в Postgres против правил Firebase.",
        "Supabase is an open-source platform on PostgreSQL. Google’s Firebase is built on NoSQL databases.\n- Data: tables and relations versus documents and collections.\n- Hosting: Supabase can be self-hosted, Firebase runs on Google Cloud.\n- Access: Postgres row-level security versus Firebase rules.")
    }
  ];
  let taskIndex = 0;
  const taskNotch = new Notch($("#task-notch"));
  const taskStage = $("#task-stage");
  const beacon = $("#task-beacon");
  taskStage.insertAdjacentHTML("afterbegin", '<div class="agent-spill" aria-hidden="true"></div>');
  const taskDemo = demo(taskStage, async run => {
    const t = tasks()[taskIndex];
    const out = $("#task-text");
    $("#task-to").textContent = t.to;
    renderText(out, "");
    taskNotch.idle(); said(taskStage, ""); beacon.classList.remove("on"); taskStage.classList.remove("agent");
    await run.wait(800);
    taskNotch.recording({ command: "task" });
    await run.wait(500);
    said(taskStage, "«" + t.q + "»");
    await run.wait(2300);
    taskNotch.speaking = false;
    said(taskStage, "");
    taskStage.classList.add("agent");
    taskNotch.task(T("Работаю над задачей", "Working on it"));
    if (t.web) { await run.wait(700); beacon.classList.add("on"); }
    await run.wait(t.web ? 2200 : 1800);
    taskNotch.task(t.web ? T("Нашёл в интернете · вставляю ответ", "Found online · inserting") : T("Вставляю ответ", "Inserting the answer"));
    await run.wait(600);
    beacon.classList.remove("on");
    await type(run, out, t.a);
    taskStage.classList.remove("agent");
    taskNotch.done(t.a.split("\n")[0]);
    await run.wait(3600);
    taskNotch.idle();
    taskIndex = (taskIndex + 1) % 3;
    syncPrompts();
  }, { pause: 900 });
  function syncPrompts() { $$("#task-prompts button").forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.task) === taskIndex))); }
  bindTabs($("#task-prompts"), "task", i => { taskIndex = Number(i); taskDemo.restart(); }, "aria-pressed");

  /* ---------------- Translation ---------------- */
  let trMode = "editable";
  const trNotch = new Notch($("#tr-notch"));
  const trStage = $("#tr-stage"), trBody = $("#tr-body");
  const trData = () => ({
    chat: T("Привет! Завтра буду в офисе в 10:30. Пришли, пожалуйста, отчёт до полудня.", "Hi! I’ll be in the office at 10:30 tomorrow. Please send the report before noon."),
    chatOut: T("Hi! I’ll be in the office at 10:30 tomorrow. Please send the report before noon.", "¡Hola! Mañana estaré en la oficina a las 10:30. Envíame el informe antes del mediodía, por favor."),
    chatCmd: T("на английский", "to Spanish"),
    chatLang: T("Английский", "Spanish"), chatPair: lang === "ru" ? ["RU", "EN"] : ["EN", "ES"],
    article: "Apple Silicon runs speech and language models on the Neural Engine and GPU, so dictation can stay on the device.",
    articleOut: T("Apple Silicon запускает речевые и языковые модели на Neural Engine и GPU, поэтому диктовка может оставаться на устройстве.",
      "Apple Silicon ejecuta modelos de voz y de lenguaje en el Neural Engine y la GPU, así que el dictado puede quedarse en el dispositivo."),
    articleCmd: T("переведи на русский", "translate to Spanish"),
    articleLang: T("Русский", "Spanish"), articlePair: lang === "ru" ? ["EN", "RU"] : ["EN", "ES"],
    speech: T("Завтра в десять встреча с командой дизайна, подготовь макеты главного экрана.", "Mañana a las diez nos reunimos con el equipo de diseño; prepara las maquetas de la pantalla principal."),
    speechOut: "Tomorrow at ten we meet the design team; please prepare the home screen mockups.",
    speechPair: lang === "ru" ? ["RU", "EN"] : ["ES", "EN"]
  });
  function lightLangs(pair) {
    $$("#tr-langs span").forEach(s => { s.classList.toggle("from", Boolean(pair) && s.textContent === pair[0]); s.classList.toggle("on", Boolean(pair) && s.textContent === pair[1]); });
  }
  function syncTranslationMeta() {
    $("#tr-meta").textContent = trMode === "speech" ? "Whisper large-v3 · Groq" : "Apple Translation · " + T("на устройстве", "on device");
  }
  function trLayout() {
    const d = trData();
    if (trMode === "speech") {
      trBody.innerHTML = `<div class="app-tag"><span class="app-dot" style="background:#e5b400">N</span>${T("Заметки", "Notes")}</div><div class="typed big" id="tr-text"></div>`;
    } else if (trMode === "editable") {
      trBody.innerHTML = `<div class="app-tag"><span class="app-dot" style="background:#2aabee">T</span>Telegram · Maria</div><div class="typed big"><span class="chat-bubble" id="tr-text"></span></div>`;
    } else {
      trBody.innerHTML = `<div class="app-tag"><span class="app-dot" style="background:#1e90ff">S</span>developer.apple.com</div><div class="article"><h4>Machine learning on Apple Silicon</h4><p class="typed" id="tr-text">${esc(d.article)}</p></div>`;
    }
  }
  async function selectWords(run, el, text) {
    const parts = text.split(" ");
    for (let i = 1; i <= parts.length; i += reduce ? parts.length : 2) {
      el.innerHTML = `<span class="sel">${esc(parts.slice(0, i).join(" "))}</span>${parts.length > i ? " " + esc(parts.slice(i).join(" ")) : ""}`;
      await run.wait(40);
    }
    el.innerHTML = `<span class="sel">${esc(text)}</span>`;
  }
  const trDemo = demo(trStage, async run => {
    const d = trData();
    trNotch.idle(); said(trStage, ""); lightLangs(null);
    trLayout();
    const el = $("#tr-text");
    if (trMode === "speech") {
      renderText(el, "");
      await run.wait(800);
      trNotch.recording();
      await run.wait(400);
      said(trStage, "«" + d.speech + "»");
      lightLangs(d.speechPair);
      await run.wait(2800);
      trNotch.speaking = false; said(trStage, "");
      trNotch.processing(T("Перевод речи на английский…", "Translating speech to English…"));
      await run.wait(1300);
      el.innerHTML = words(d.speechOut) + caret;
      trNotch.done(d.speechOut);
      await run.wait(3400);
      trNotch.idle();
      return;
    }
    if (trMode === "editable") {
      el.innerHTML = esc(d.chat);
      await run.wait(900);
      await selectWords(run, el, d.chat);
      await run.wait(400);
      trNotch.recording({ command: "selection" });
      await run.wait(500);
      said(trStage, "«" + d.chatCmd + "»");
      await run.wait(1500);
      trNotch.speaking = false; said(trStage, "");
      lightLangs(d.chatPair);
      trNotch.processing(T("Перевод → ", "Translation → ") + d.chatLang, true);
      await run.wait(700);
      await morph(run, el, d.chat, d.chatOut);
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
    lightLangs(d.articlePair);
    trNotch.processing(T("Перевод → ", "Translation → ") + d.articleLang, true);
    await run.wait(1200);
    trNotch.set("sheet", sheetHTML(d));
    wireSheet(d);
    await morph(run, $("#tr-notch .sheet-result"), d.article, d.articleOut, { frames: reduce ? 1 : 16 });
    await run.wait(6000);
    trNotch.idle();
  });
  function sheetHTML(d) {
    return `<div class="sheet-head"><span>${T("Перевод выделения", "Selection translation")}</span><span class="sheet-status">${icon("check")}${T("Перевод готов", "Translation ready")}</span></div>
      <div class="sheet-langs"><span class="lchip">${T("Автоопределение (Английский)", "Auto-detect (English)")}<svg><use href="#i-chevron-down"/></svg></span><span class="swap">${icon("swap")}</span><span class="lchip">${esc(d.articleLang)}<svg><use href="#i-chevron-down"/></svg></span></div>
      <div class="sheet-result"></div>
      <div class="sheet-actions"><button type="button" class="sbtn" data-act="copy">${icon("copy")}<span>${T("Скопировать", "Copy")}</span></button><button type="button" class="sbtn" data-act="listen">${icon("speaker")}<span>${T("Слушать", "Listen")}</span></button><span class="sbtn ghost">${T("Повторить перевод", "Retry translation")}</span></div>
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
  bindTabs($("#tr-mode"), "mode", m => { trMode = m; syncTranslationMeta(); trDemo.paused = false; trDemo.restart(); });

  /* ---------------- Vocabulary, level 1: recognizer hints ---------------- */
  // Fills the 224-byte prompt budget the way Vocabulary.selectHints does (≤224 UTF-8 bytes, ≤32 terms).
  const hintTerms = ["Ксения", "sverkaus", "Notion", "Slack", "Zoom", "Figma", "Jira", "ChatGPT", "Claude", "Perplexity", "Midjourney", "Linear", "GitHub", "Miro", "Raycast", "ElevenLabs", "OpenAI", "Cursor", "Obsidian", "Discord", "WhatsApp", "Telegram", "Microsoft Teams", "Supabase", "Vercel", "Docker", "Webflow", "Trello"];
  const cloud = $("#hint-cloud"), bar = $("#bytes .bytes-bar i"), count = $("#bytes-count");
  demo($("#bytes"), async run => {
    cloud.innerHTML = hintTerms.map(t => `<span>${esc(t)}</span>`).join("");
    bar.style.width = "0%"; count.textContent = "0 / 224 B";
    const enc = new TextEncoder();
    let used = 0, n = 0;
    await run.wait(400);
    for (const chip of cloud.children) {
      const size = enc.encode(chip.textContent).length + (n ? 2 : 0);
      if (used + size <= 224 && n < 32) {
        used += size; n += 1;
        chip.className = "in";
        bar.style.width = (used / 224 * 100) + "%";
        count.textContent = `${used} / 224 B · ${n}`;
      } else chip.className = "out";
      await run.wait(reduce ? 0 : 120);
    }
    await run.wait(4200);
    for (const chip of cloud.children) chip.className = "";
    await run.wait(700);
  }, { pause: 200 });

  /* ---------------- Vocabulary, level 2: local replacement engine ---------------- */
  // Example rules in the shape of VocabularyEntry. Brand spellings come from the starter packs
  // (StarterBrands.swift; "зум" needs a cue such as "ссылку"); the name rule is a personal entry
  // scoped to Slack's bundle ID, so it wins there and is skipped elsewhere (Vocabulary.swift:241-247).
  const apps = ["telegram", "slack", "whatsapp", "notion", "discord", "zoom", "teams", "obsidian"];
  const appInfo = {
    telegram: ["Telegram", "ru.keepcoder.Telegram"], slack: ["Slack", "com.tinyspeck.slackmacgap"],
    whatsapp: ["WhatsApp", "net.whatsapp.WhatsApp"], notion: ["Notion", "notion.id"],
    discord: ["Discord", "com.hnc.Discord"], zoom: ["Zoom", "us.zoom.xos"],
    teams: ["Microsoft Teams", "com.microsoft.teams2"], obsidian: ["Obsidian", "md.obsidian"]
  };
  let vocabApp = "telegram";
  function vocabCase() {
    const ru = lang === "ru";
    const name = ru ? [{ from: "Ксюша", to: "Ксения", scope: ["slack"] }] : [{ from: "Kate", to: "Katherine", scope: ["slack"] }];
    const r = (from, to) => [{ from, to, scope: null }];
    const cases = ru ? {
      telegram: [["name", ", кинь ссылку на ", "zoom", ", план в ", "notion", "."], { name, zoom: r("зум", "Zoom"), notion: r("ноушене", "Notion") }],
      slack: [["name", ", макеты в ", "figma", ", тикет завёл в ", "jira", "."], { name, figma: r("фигме", "Figma"), jira: r("джире", "Jira") }],
      whatsapp: [["Купил подписку на ", "gpt", ", вечером расскажу."], { gpt: r("чат гпт", "ChatGPT") }],
      notion: [["Сравнить ", "claude", " и ", "perplexity", " для поддержки."], { claude: r("клод", "Claude"), perplexity: r("перплексити", "Perplexity") }],
      discord: [["Сделал обложку в ", "mj", ", кидаю сюда."], { mj: r("миджорни", "Midjourney") }],
      zoom: [["Запись созвона выложу в ", "slack", " после встречи."], { slack: r("слак", "Slack") }],
      teams: [["Отчёт по ", "sv", " пришлю до пятницы."], { sv: r("сфера хаос", "sverkaus") }],
      obsidian: [["Сведу сюда заметки по ", "linear", " и ", "github", "."], { linear: r("линеар", "Linear"), github: r("гитхаб", "GitHub") }]
    } : {
      telegram: [["name", ", the plan is in ", "notion", "."], { name, notion: r("noshen", "Notion") }],
      slack: [["name", ", mockups are in ", "figma", ", the ticket is in ", "jira", "."], { name, figma: r("fygma", "Figma"), jira: r("geera", "Jira") }],
      whatsapp: [["Got a ", "gpt", " subscription, tell you tonight."], { gpt: r("chat gpt", "ChatGPT") }],
      notion: [["Compare ", "claude", " and ", "perplexity", " for support."], { claude: r("claud", "Claude"), perplexity: r("perplexety", "Perplexity") }],
      discord: [["Made the cover in ", "mj", ", dropping it here."], { mj: r("midjourny", "Midjourney") }],
      zoom: [["I’ll post the recording to ", "slack", " after the call."], { slack: r("slak", "Slack") }],
      teams: [["The ", "sv", " report lands by Friday."], { sv: r("sphere chaos", "sverkaus") }],
      obsidian: [["Merging my notes on ", "linear", " and ", "github", " here."], { linear: r("lineer", "Linear"), github: r("git hub", "GitHub") }]
    };
    const [parts, rules] = cases[vocabApp];
    return { parts, rules };
  }
  function pickRule(list) { return list.find(r => r.scope && r.scope.includes(vocabApp)) || list.find(r => !r.scope) || null; }
  const vocabOut = $("#vocab-out");
  const vocabDemo = demo(vocabOut, async run => {
    const c = vocabCase();
    $$("#vocab-app button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.app === vocabApp)));
    $("#vocab-bundle").textContent = appInfo[vocabApp].join(" · ");
    vocabOut.innerHTML = c.parts.map(p => c.rules[p] ? `<span class="term" data-k="${p}">${esc(c.rules[p][0].from)}</span>` : esc(p)).join("");
    await run.wait(1400);
    for (const term of $$(".term", vocabOut)) {
      const list = c.rules[term.dataset.k], rule = pickRule(list);
      if (!rule) { term.classList.add("keep"); await run.wait(500); continue; }
      await morph(run, term, list[0].from, rule.to, { frames: reduce ? 1 : 12, delay: 40 });
      term.classList.add("hit");
      await run.wait(350);
    }
    await run.wait(3200);
    vocabApp = apps[(apps.indexOf(vocabApp) + 1) % apps.length];
  }, { pause: 300 });
  bindTabs($("#vocab-app"), "app", a => { vocabApp = a; vocabDemo.restart(); });

  /* ---------------- Chain ---------------- */
  const chainNotch = new Notch($("#chain-notch"));
  const chainStage = $("#chain-stage");
  chainStage.insertAdjacentHTML("afterbegin", '<div class="agent-spill" aria-hidden="true"></div>');
  let chainFrom = 0;
  const outline = () => T(
    "- Проблема: команды тратят часы на рутинный текст\n- Решение: голос, задачи и перевод в челке Mac\n- Приватность: локальные Whisper и Qwen\n- Запуск: 30 дней бесплатно",
    "- Problem: teams spend hours on routine text\n- Solution: voice, tasks and translation in the Mac’s notch\n- Privacy: local Whisper and Qwen\n- Launch: 30 days free");
  const german = "- Problem: Teams verbringen Stunden mit Routinetexten\n- Lösung: Stimme, Aufgaben und Übersetzung in der Notch\n- Datenschutz: lokale Whisper- und Qwen-Modelle\n- Start: 30 Tage kostenlos";
  function markStep(i) {
    $$("#chain-steps .node").forEach(s => {
      const n = Number(s.dataset.step);
      if (n === i) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
      s.classList.toggle("done", n < i);
    });
    $("#chain-steps .track-beam").style.setProperty("--p", i / 2);
  }
  const chainDemo = demo(chainStage, async run => {
    const el = $("#chain-text");
    const from = chainFrom; chainFrom = 0;
    chainNotch.idle(); said(chainStage, "");
    if (from === 0) {
      markStep(0); renderText(el, "");
      await run.wait(800);
      chainNotch.recording({ command: "task" });
      await run.wait(400);
      said(chainStage, T("«Напиши тезисный план презентации»", "“Write a bullet outline for the presentation”"));
      await run.wait(2100);
      chainNotch.speaking = false; said(chainStage, "");
      chainStage.classList.add("agent");
      chainNotch.task(T("Работаю над задачей", "Working on it"));
      await run.wait(1600);
      chainNotch.task(T("Вставляю ответ", "Inserting the answer"));
      await type(run, el, outline());
      chainStage.classList.remove("agent");
      chainNotch.done(outline().split("\n")[0]);
      await run.wait(2000);
      chainNotch.idle();
    } else el.innerHTML = esc(outline());
    markStep(1);
    if (from <= 1) {
      await run.wait(700);
      el.innerHTML = `<span class="sel">${esc(outline())}</span>`;
      await run.wait(700);
      chainNotch.recording({ command: "selection" });
      await run.wait(400);
      said(chainStage, T("«на немецкий»", "“to German”"));
      await run.wait(1500);
      chainNotch.speaking = false; said(chainStage, "");
    } else el.innerHTML = `<span class="sel">${esc(outline())}</span>`;
    markStep(2);
    chainNotch.processing(T("Перевод → Немецкий", "Translation → German"), true);
    await run.wait(600);
    await morph(run, el, outline(), german, { frames: reduce ? 1 : 24 });
    chainNotch.done(T("Выделение заменено переводом", "Selection replaced with translation"));
    await run.wait(3600);
    chainNotch.idle();
  });
  $$("#chain-steps .node").forEach(s => s.addEventListener("click", () => { chainFrom = Number(s.dataset.step); markStep(chainFrom); chainDemo.restart(); }));

  /* ---------------- Local vs cloud: where your voice travels ---------------- */
  let flowMode = "local";
  function syncFlowMeta() {
    $("#flow-meta").textContent = flowMode === "local"
      ? "WhisperKit · Qwen3-4B · Apple Translation"
      : "whisper-large-v3-turbo · gpt-oss-120b · Exa";
    $("#flow-desc").textContent = flowMode === "local"
      ? T("Голос, распознавание, текстовая модель и перевод — всё на Mac.", "Voice, recognition, the text model and translation all stay on the Mac.")
      : T("Аудио и текст уходят в Groq с вашим ключом; история и словарь остаются на Mac.", "Audio and text go to Groq with your key; history and vocabulary stay on the Mac.");
  }
  bindTabs($("#flow-mode"), "mode", m => { flowMode = m; syncFlowMeta(); flow.kick(); });
  const flow = (() => {
    const canvas = $("#flow"), ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1, mix = 0, frame = 0, running = false;
    const ring = Array.from({ length: 150 }, () => ({ a: Math.random() * Math.PI * 2, s: 0.0035 + Math.random() * 0.004, r: (Math.random() - 0.5) * 22, z: Math.random() }));
    const bridge = Array.from({ length: 28 }, (_, i) => ({ t: i / 28, s: 0.0028 + Math.random() * 0.0016, j: (Math.random() - 0.5) * 16 }));
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    }
    const lerp = (a, b, t) => a + (b - a) * t;
    function bez(p0, p1, p2, t) { const u = 1 - t; return { x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y }; }
    function glow(x, y, r, color, a) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${color},${a})`); g.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    function label(text, x, y, alpha, align = "center") {
      if (alpha < 0.02) return;
      ctx.globalAlpha = alpha; ctx.fillStyle = "rgba(255,255,255,.72)"; ctx.textAlign = align;
      ctx.font = `500 ${W < 520 ? 11 : 12.5}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.fillText(text, x, y); ctx.globalAlpha = 1;
    }
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const narrow = W < 560;
      const mac = { x: lerp(W * 0.5, W * (narrow ? 0.3 : 0.34), mix), y: H * (narrow ? lerp(0.5, 0.6, mix) : 0.54) };
      const R = Math.min(W * (narrow ? 0.3 : 0.24), H * 0.34) * lerp(1, 0.8, mix);
      const cl = { x: W * (narrow ? 0.76 : 0.76), y: H * (narrow ? 0.2 : 0.3) };
      ctx.globalCompositeOperation = "lighter";
      // The Mac: a warm core with the boundary your data never crosses in local mode.
      glow(mac.x, mac.y, R * 1.55, "155,231,185", 0.07 * (1 - mix) + 0.04);
      glow(mac.x, mac.y, R * 0.42, "255,255,255", 0.28);
      glow(mac.x, mac.y, R * 0.2, "255,255,255", 0.9);
      ctx.strokeStyle = "rgba(155,231,185,.12)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(mac.x, mac.y, R, R * 0.62, 0, 0, Math.PI * 2); ctx.stroke();
      // Orbiting particles: everything that stays on the Mac.
      for (const p of ring) {
        if (!reduce) p.a += p.s;
        const rr = R + p.r;
        const x = mac.x + Math.cos(p.a) * rr, y = mac.y + Math.sin(p.a) * rr * 0.62;
        const front = Math.sin(p.a) > 0;
        ctx.fillStyle = `rgba(155,231,185,${(front ? 0.75 : 0.35) * (0.5 + p.z * 0.5)})`;
        ctx.beginPath(); ctx.arc(x, y, front ? 1.6 + p.z : 1 + p.z * 0.6, 0, Math.PI * 2); ctx.fill();
      }
      // Cloud mode: a bridge out to Groq and back.
      if (mix > 0.01) {
        glow(cl.x, cl.y, 90, "188,214,255", 0.16 * mix);
        for (const [dx, dy, r] of [[-24, 6, 26], [0, -8, 32], [26, 4, 24], [6, 14, 26]]) glow(cl.x + dx, cl.y + dy, r * 1.4, "188,214,255", 0.22 * mix);
        const out0 = { x: mac.x + R * 0.5, y: mac.y - R * 0.2 }, in0 = { x: mac.x + R * 0.5, y: mac.y + R * 0.1 };
        const c1 = { x: lerp(out0.x, cl.x, 0.5), y: Math.min(out0.y, cl.y) - H * 0.16 };
        const c2 = { x: lerp(in0.x, cl.x, 0.6), y: Math.max(in0.y, cl.y) + H * 0.12 };
        for (const p of bridge) {
          if (!reduce) p.t = (p.t + p.s) % 1;
          const going = p.t < 0.5, t = going ? p.t * 2 : (p.t - 0.5) * 2;
          const pt = going ? bez(out0, c1, cl, t) : bez(cl, c2, in0, t);
          const a = Math.sin(t * Math.PI) * mix;
          ctx.fillStyle = going ? `rgba(188,214,255,${0.85 * a})` : `rgba(255,255,255,${0.7 * a})`;
          ctx.beginPath(); ctx.arc(pt.x, pt.y + p.j * Math.sin(t * Math.PI) * 0.3, 1.8, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      // Labels: what runs where.
      ctx.fillStyle = "rgba(0,0,0,.75)"; ctx.textAlign = "center"; ctx.font = "700 11px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText("Mac", mac.x, mac.y + 4);
      const local = [T("Голос", "Voice"), "Whisper", "Qwen3-4B", T("Перевод", "Translation")];
      const stays = [T("Голос", "Voice"), T("История", "History"), T("Словарь", "Vocabulary"), "Keychain"];
      const spots = [[-1, 0], [0, -1], [1, 0], [0, 1]];
      spots.forEach(([sx, sy], i) => {
        const x = mac.x + sx * (R + 22), y = mac.y + sy * (R * 0.62 + 24) + 4 + (sy > 0 ? 8 : 0);
        const align = sx < -0.5 ? "right" : sx > 0.5 ? "left" : "center";
        label(local[i], x, y, 1 - mix, align);
        label(stays[i], x, y, mix, align);
      });
      label("Groq", cl.x, cl.y + 62, mix);
      label("Whisper · gpt-oss", cl.x, cl.y + 80, mix * 0.6);
    }
    function loop() {
      const target = flowMode === "cloud" ? 1 : 0;
      mix += (target - mix) * (reduce ? 1 : 0.05);
      draw();
      frame = running ? requestAnimationFrame(loop) : 0;
    }
    function start() { if (running) return; running = !reduce; loop(); }
    function stop() { running = false; cancelAnimationFrame(frame); }
    size();
    addEventListener("resize", () => { size(); draw(); });
    new IntersectionObserver(([e]) => { if (e.isIntersecting) start(); else stop(); }, { threshold: 0.1 }).observe(canvas);
    return { kick() { if (reduce) loop(); else if (running) return; } };
  })();

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

  applyLanguage();
})();

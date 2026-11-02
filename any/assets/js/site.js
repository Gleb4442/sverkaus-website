(function () {
  var I = window.ANY_I18N, LANGS = I.langs, root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var qsa = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  // The founder's Mac runs with Reduce Motion on and the page must still move, so motion stays on (and gentle).
  var reduced = false;
  var ease = "cubic-bezier(.2,.8,.2,1)";
  var store = {
    get: function () { try { return localStorage.getItem("any-lang"); } catch (e) { return null; } },
    set: function (v) { try { localStorage.setItem("any-lang", v); } catch (e) {} }
  };
  function detect() {
    var saved = store.get();
    if (saved && LANGS.indexOf(saved) >= 0) return saved;
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < list.length; i++) {
      var c = String(list[i] || "").toLowerCase().split("-")[0];
      if (LANGS.indexOf(c) >= 0) return c;
    }
    return "en";
  }
  var lang = detect();
  function tr(k) { var e = I.t[k]; return e ? (e[lang] != null ? e[lang] : e.en) : ""; }
  function pick(o) { return o ? (o[lang] != null ? o[lang] : o.en) : ""; }
  function after(list, ms, fn) { list.push(setTimeout(fn, ms)); }
  function stop(list) { list.forEach(clearTimeout); list.length = 0; }

  /* ---------- Language ---------- */
  var langBtn = $("lang"), langCode = $("lang-code"), menu = $("lang-menu");
  var items = qsa("[data-lang]", menu);
  function apply() {
    root.lang = lang === "zh" ? "zh-Hans" : lang;
    qsa("[data-t]").forEach(function (el) { el.textContent = tr(el.dataset.t); });
    qsa("[data-th]").forEach(function (el) { el.innerHTML = tr(el.dataset.th); });
    qsa("[data-ta]").forEach(function (el) { el.setAttribute("aria-label", tr(el.dataset.ta)); });
    document.title = tr("meta.title");
    langCode.textContent = lang.toUpperCase();
    items.forEach(function (b) { b.setAttribute("aria-checked", b.dataset.lang === lang ? "true" : "false"); });
    $("sd-num").textContent = tr("sp.num");
    moveInd();
  }
  function place() {
    var r = langBtn.getBoundingClientRect();
    menu.style.top = Math.round(r.bottom + 14) + "px";
    menu.style.right = Math.max(10, Math.round(window.innerWidth - r.right - 4)) + "px";
  }
  function openMenu() {
    place();
    menu.hidden = false;
    langBtn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add("open"); }); });
    var cur = menu.querySelector('[aria-checked="true"]') || items[0];
    setTimeout(function () { cur.focus({ preventScroll: true }); }, 30);
  }
  function closeMenu(back) {
    if (menu.hidden) return;
    menu.classList.remove("open");
    langBtn.setAttribute("aria-expanded", "false");
    setTimeout(function () { if (!menu.classList.contains("open")) menu.hidden = true; }, 280);
    if (back) langBtn.focus({ preventScroll: true });
  }
  langBtn.addEventListener("click", function (e) { e.stopPropagation(); if (menu.hidden || !menu.classList.contains("open")) openMenu(); else closeMenu(false); });
  items.forEach(function (b, k) {
    b.addEventListener("click", function () {
      if (b.dataset.lang !== lang) {
        lang = b.dataset.lang;
        store.set(lang);
        apply();
        play();
        agentPlay(agentIndex, true);
        sdReset();
      }
      closeMenu(true);
    });
    b.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        items[(k + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length].focus();
      }
    });
  });
  document.addEventListener("click", function (e) { if (!menu.hidden && !menu.contains(e.target)) closeMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) closeMenu(true); });
  window.addEventListener("resize", function () { if (!menu.hidden) place(); });
  window.addEventListener("scroll", function () { if (!menu.hidden) place(); }, { passive: true });

  /* ---------- Words appear one by one (CJK split into words too) ---------- */
  function parts(text) {
    if ((lang === "zh" || lang === "ja") && window.Intl && Intl.Segmenter) {
      var out = [], it = new Intl.Segmenter(lang, { granularity: "word" }).segment(text);
      for (var s of it) out.push(s.segment);
      return out;
    }
    return text.split(/(\s+)/).filter(Boolean);
  }
  function words(text, into, cls) {
    return parts(text).map(function (part) {
      if (/^\s+$/.test(part)) return function () { into.appendChild(document.createTextNode(part)); };
      return function () {
        var w = document.createElement("span");
        w.className = cls;
        w.textContent = part;
        into.appendChild(w);
      };
    });
  }
  function pause(node) {
    if (!node || node.nodeType === 3) return 0;
    var n = node.textContent.length;
    return lang === "zh" || lang === "ja" ? 110 + n * 45 : 150 + n * 16;
  }

  /* ---------- Hero: press the stem, words land in an app, it sends ---------- */
  var stage = $("stage"), win = $("win"), bud = $("bud"), field = $("field"), typed = $("typed"), thread = $("thread");
  var timers = [], scene = 0;
  function set(state) { stage.dataset.state = state; }
  function tap() { bud.classList.remove("tap"); void bud.offsetWidth; bud.classList.add("tap"); }
  function bubble(cls, text, anim) {
    var m = document.createElement("p");
    m.className = cls === "hello" ? cls : "msg " + cls + (anim ? "" : " old");
    m.textContent = text;
    thread.appendChild(m);
  }
  function setup(sc) {
    $("win-icon").src = sc.icon;
    $("win-app").textContent = sc.app;
    $("win-to").textContent = pick(sc.to);
    thread.textContent = "";
    (sc.thread || []).forEach(function (m) { bubble(m[0], pick(m[1])); });
    if (sc.hello) bubble("hello", pick(sc.hello));
    typed.textContent = "";
    typed.dataset.ph = sc.ph ? pick(sc.ph) : tr("ui.ph");
    field.className = "field";
    stage.classList.remove("focus");
    set("idle");
  }
  function play() {
    stop(timers);
    var sc = I.scenes[scene], text = pick(sc.text), steps = words(text, typed, "w");
    setup(sc);
    win.classList.remove("in", "out");
    void win.offsetWidth;
    win.classList.add("in");
    after(timers, 900, function () {
      tap(); set("press");
      after(timers, 420, function () {
        set("listen");
        stage.classList.add("focus");
        var i = 0;
        (function next() {
          steps[i]();
          if (i === 0) field.classList.add("ready");
          if (++i < steps.length) { after(timers, pause(typed.lastChild), next); return; }
          after(timers, 700, function () {
            tap(); set("press");
            field.classList.add("go");
            after(timers, 300, function () {
              stage.classList.remove("focus");
              field.className = "field";
              typed.textContent = "";
              var h = thread.querySelector(".hello");
              if (h) h.remove();
              bubble("out", text, true);
              set("sent");
              after(timers, 2000, function () {
                win.classList.add("out");
                after(timers, 600, function () { scene = (scene + 1) % I.scenes.length; play(); });
              });
            });
          });
        })();
      });
    });
  }

  /* ---------- Agent: the orb takes a spoken task and writes into the field ---------- */
  var ag = $("agent-stage"), agWin = $("agent-win"), agIn = $("agent-in"), notch = $("notch");
  var agTabs = qsa("#agent-tabs button[role=tab]"), ind = document.querySelector("#agent-tabs .tab-ind");
  var agSaid = $("agent-said"), agBody = $("agent-body"), agTitle = $("agent-title");
  var agTimers = [], agentIndex = 0;
  function moveInd() {
    var b = agTabs[agentIndex];
    if (!b || !ind) return;
    ind.style.width = b.offsetWidth + "px";
    ind.style.transform = "translateX(" + b.offsetLeft + "px)";
  }
  function morph(el, change, ms) {
    // Animates an element's width/height between its old and new natural size.
    var w0 = el.offsetWidth, h0 = el.offsetHeight;
    change();
    var w1 = el.offsetWidth, h1 = el.offsetHeight;
    if (reduced || !el.animate || (w0 === w1 && h0 === h1)) return;
    el.animate([{ width: w0 + "px", height: h0 + "px" }, { width: w1 + "px", height: h1 + "px" }], { duration: ms || 420, easing: ease });
  }
  function say(text) {
    morph(notch, function () { agSaid.textContent = text; }, 380);
    if (!reduced && agSaid.animate) agSaid.animate([{ opacity: 0, filter: "blur(4px)" }, { opacity: 1, filter: "blur(0)" }], { duration: 320, easing: "ease-out" });
  }
  function render(c) {
    agTitle.textContent = pick(c.title);
    agBody.textContent = "";
    if (c.ctx) { var s = document.createElement("span"); s.className = "sel"; s.textContent = pick(c.ctx); agBody.appendChild(s); }
  }
  function run(c) {
    ag.dataset.state = "listen";
    say("«" + pick(c.said) + "»");
    after(agTimers, 1800, function () {
      ag.dataset.state = "think";
      say(tr("ag.think"));
      after(agTimers, 700, function () {
        var hasSel = !!agBody.querySelector(".sel");
        var write = function () {
          agBody.textContent = "";
          var steps = words(pick(c.answer), agBody, "w"), k = 0;
          (function next() {
            steps[k]();
            if (++k < steps.length) { after(agTimers, lang === "zh" || lang === "ja" ? 70 : 55, next); return; }
            after(agTimers, 400, function () {
              ag.dataset.state = "done";
              say(tr("ag.done"));
              after(agTimers, 3200, function () { agentPlay((agentIndex + 1) % I.agent.length, true); });
            });
          })();
        };
        if (hasSel && !reduced) { agBody.classList.add("fade"); after(agTimers, 220, function () { agBody.classList.remove("fade"); write(); }); }
        else write();
      });
    });
  }
  function agentPlay(i, smooth) {
    if (!ag) return;
    stop(agTimers);
    agentIndex = i;
    var c = I.agent[i];
    agTabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); });
    moveInd();
    if (!smooth || reduced) { render(c); run(c); return; }
    agIn.classList.add("swap");
    after(agTimers, 280, function () {
      morph(agWin, function () { render(c); }, 460);
      agIn.classList.remove("swap");
      run(c);
    });
  }
  agTabs.forEach(function (t, k) { t.addEventListener("click", function () { if (k !== agentIndex) agentPlay(k, true); }); });
  window.addEventListener("resize", moveInd);

  /* ---------- Speed: you speak, you stop, the text is there ---------- */
  var sd = $("sd"), sdTimers = [], sdOn = false;
  function sdReset() { stop(sdTimers); sd.dataset.phase = "idle"; if (sdOn) after(sdTimers, 300, sdPlay); }
  function sdPlay() {
    stop(sdTimers);
    sd.dataset.phase = "talk";
    after(sdTimers, 2400, function () {
      sd.dataset.phase = "gap";
      after(sdTimers, 160, function () {
        sd.dataset.phase = "in";
        after(sdTimers, 3200, function () {
          sd.dataset.phase = "out";
          after(sdTimers, 450, function () { if (sdOn) sdPlay(); });
        });
      });
    });
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      var vis = e[0].isIntersecting;
      if (vis && !sdOn) { sdOn = true; sdPlay(); }
      if (!vis && sdOn) { sdOn = false; stop(sdTimers); sd.dataset.phase = "idle"; }
    }, { threshold: .6 }).observe(sd);
  } else { sdOn = true; sdPlay(); }

  /* ---------- Nav: the section you are reading ---------- */
  var navLinks = qsa(".nav-link");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (list) {
      list.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["how", "agent", "apps", "speed", "price"].forEach(function (id) { var el = $(id); if (el) spy.observe(el); });
    spy.observe(document.querySelector(".hero"));
  }

  /* ---------- Download: the button folds, flies to the browser's downloads, the next screen opens from there ---------- */
  var next = $("next"), fromBtn = null, dlUrl = null, busy = false, corner = { x: 0, y: 0 };
  var arrowSvg = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.8v9.4M3.8 8.2 8 12.4l4.2-4.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function startDownload(url) {
    var f = document.createElement("iframe");
    f.hidden = true; f.src = url;
    document.body.appendChild(f);
    setTimeout(function () { f.remove(); }, 60000);
  }
  function ping(x) {
    var p = document.createElement("span");
    p.className = "ping"; p.style.left = x + "px";
    document.body.appendChild(p);
    setTimeout(function () { p.remove(); }, 900);
  }
  function reveal() {
    var R = Math.hypot(Math.max(corner.x, innerWidth - corner.x), innerHeight) * 1.05;
    next.hidden = false;
    document.body.classList.add("lock");
    var shape = function (r) { return "circle(" + r + "px at " + corner.x + "px " + corner.y + "px)"; };
    next.animate([{ clipPath: shape(0) }, { clipPath: shape(R) }], { duration: 820, easing: "cubic-bezier(.6,0,.2,1)" });
    requestAnimationFrame(function () { next.classList.add("open"); });
    setTimeout(function () { next.querySelector(".next-x").focus({ preventScroll: true }); }, 400);
  }
  function launch(btn) {
    if (busy) return;
    busy = true; fromBtn = btn; dlUrl = btn.href;
    var r = btn.getBoundingClientRect(), cs = getComputedStyle(btn), d = r.height;
    var tok = document.createElement("div");
    tok.className = "fly";
    tok.style.cssText = "left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + d + "px;font:" + cs.font;
    tok.innerHTML = '<span class="fly-label"></span><span class="fly-arrow">' + arrowSvg + "</span>";
    tok.firstChild.textContent = btn.textContent;
    document.body.appendChild(tok);
    btn.style.visibility = "hidden";
    requestAnimationFrame(function () { tok.classList.add("fold"); });
    var fold = tok.animate([{ left: r.left + "px", width: r.width + "px" }, { left: r.left + (r.width - d) / 2 + "px", width: d + "px" }],
      { duration: 420, delay: 60, easing: "cubic-bezier(.6,0,.25,1)", fill: "forwards" });
    fold.onfinish = function () {
      var cx = r.left + r.width / 2, cy = r.top + d / 2;
      corner = { x: innerWidth - 64, y: 0 };
      var dx = corner.x - cx, dy = corner.y - 8 - cy;
      var fly = tok.animate([
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: "translate(0,4px) scale(1.06)", opacity: 1, offset: .12 },
        { transform: "translate(" + dx * .3 + "px," + (dy * .62 - 30) + "px) scale(.78)", opacity: 1, offset: .55 },
        { transform: "translate(" + dx + "px," + dy + "px) scale(.32)", opacity: .2 }
      ], { duration: 860, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" });
      setTimeout(function () { startDownload(dlUrl); }, 500);
      fly.onfinish = function () { tok.remove(); ping(corner.x); setTimeout(reveal, 120); };
    };
  }
  function closeNext() {
    if (next.hidden) return;
    next.classList.remove("open");
    var shape = function (r) { return "circle(" + r + "px at " + corner.x + "px " + corner.y + "px)"; };
    var R = Math.hypot(Math.max(corner.x, innerWidth - corner.x), innerHeight) * 1.05;
    var a = next.animate([{ clipPath: shape(R) }, { clipPath: shape(0) }], { duration: 560, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" });
    a.onfinish = function () {
      next.hidden = true; a.cancel();
      document.body.classList.remove("lock");
      if (fromBtn) {
        fromBtn.style.visibility = "";
        if (fromBtn.animate) fromBtn.animate([{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: ease });
        fromBtn.focus({ preventScroll: true });
      }
      busy = false;
    };
  }
  qsa(".dl-btn").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      e.preventDefault();
      launch(a);
    });
  });
  qsa("[data-close]", next).forEach(function (el) { el.addEventListener("click", closeNext); });
  $("dl-again").addEventListener("click", function (e) { e.preventDefault(); startDownload(dlUrl || this.href); ping(innerWidth - 64); });
  document.addEventListener("keydown", function (e) {
    if (next.hidden) return;
    if (e.key === "Escape") closeNext();
    if (e.key === "Tab") {
      var f = qsa("button, a[href]", next), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

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
    var ro = new ResizeObserver(function (list) { list.forEach(function (e) { lens(e.target); }); });
    qsa(".glass").forEach(function (el) { ro.observe(el); });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(timers); stop(agTimers); stop(sdTimers); }
    else { play(); agentPlay(agentIndex); if (sdOn) sdPlay(); }
  });

  apply();
  play();
  agentPlay(0);
  requestAnimationFrame(function () { ind && ind.classList.add("ready"); });
})();

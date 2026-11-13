/* Feature orbit: a Saturn-like ring around the feature screen. Each satellite is one feature;
   the satellites ride the front of the ring in a row, the one in the middle is playing.
   Tap a satellite (or swipe the screen) to bring it to the middle; on its own the ring
   moves on when the video ends (or after DWELL for a slide without video).
   Videos load only when the section comes near the viewport; everything pauses off-screen.
   Reduced motion → static chips under the screen, no auto-advance, video with controls.
   ?motion=live / ?motion=static in the URL forces either mode for review. */
(function () {
  "use strict";
  var RESPECT_REDUCED_MOTION = false;   // the rest of the page animates regardless; the ring moves only on a feature change
  var DWELL = 10000;          // ms on a slide without video
  var TURN = 1500;            // ms for the ring to bring a satellite to the middle

  var sec = document.getElementById("features");
  if (!sec) return;
  var stage = document.getElementById("orbit-stage");
  var screen = document.getElementById("orbit-screen");
  var canvas = document.getElementById("orbit-ring");
  var ctx = canvas.getContext && canvas.getContext("2d");
  var sats = [].slice.call(sec.querySelectorAll(".orbit-sat"));
  var slides = [].slice.call(sec.querySelectorAll(".orbit-slide"));
  var caps = [].slice.call(sec.querySelectorAll(".orbit-cap"));
  var N = sats.length, STEP = 0.78;   // angle between neighbouring satellites on the ring

  var force = (location.search.match(/[?&]motion=(live|static)/) || [])[1];
  var mq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  var live = force ? force === "live" : !(RESPECT_REDUCED_MOTION && mq && mq.matches);

  var active = 0, visible = false, nearby = false;
  var dwellStart = 0, dwellSpent = 0;

  /* ---------- media ---------- */
  function videoOf(i) {
    var s = slides[i], src = s.dataset.video;
    if (!src) return null;
    var v = s.querySelector("video");
    if (!v) {
      v = document.createElement("video");
      v.muted = true; v.playsInline = true; v.preload = "none";
      v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
      if (s.dataset.poster) v.poster = s.dataset.poster;
      if (!live) { v.controls = true; v.removeAttribute("aria-hidden"); }
      v.addEventListener("ended", function () { if (live && i === active) next(); });
      v.addEventListener("error", function () { s.dataset.video = ""; });
      s.appendChild(v);
    }
    if (nearby && !v.getAttribute("src")) { v.src = src; v.preload = live ? "auto" : "metadata"; }
    return v;
  }
  function playActive() {
    var v = videoOf(active);
    if (!v || !live || !visible || document.hidden || !v.getAttribute("src")) return;
    var i = active, p = v.play();
    // autoplay refused (Low Power Mode etc.): the dwell timer advances instead
    if (p && p.catch) p.catch(function (e) { if (e && e.name === "NotAllowedError") s_noVideo[i] = true; });
  }
  var s_noVideo = {};
  function pauseAll() { slides.forEach(function (s) { var v = s.querySelector("video"); if (v) v.pause(); }); }

  /* ---------- selection ---------- */
  function select(i, user) {
    i = (i + N) % N;
    var prev = active;
    active = i;
    sats.forEach(function (b, k) {
      var on = k === i;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    slides.forEach(function (s, k) { s.classList.toggle("is-on", k === i); });
    caps.forEach(function (c, k) { c.classList.toggle("is-on", k === i); });
    if (prev !== i) {
      var pv = slides[prev].querySelector("video");
      if (pv) { pv.pause(); }
    }
    var v = videoOf(i);
    if (v && live) { try { v.currentTime = 0; } catch (e) {} }
    dwellSpent = 0; dwellStart = performance.now();
    sats.forEach(function (b) { b.style.setProperty("--p", 0); }); lastP = -1;
    if (live) { turnTo(i); playActive(); }
  }
  function next() { select(active + 1, false); }

  sats.forEach(function (b, k) {
    b.addEventListener("click", function () { if (k !== active) select(k, true); else playActive(); });
    b.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (!d) return;
      e.preventDefault(); select(active + d, true); sats[active].focus();
    });
  });

  // swipe the screen left/right on touch screens
  var sx0 = null, sy0 = 0;
  screen.addEventListener("touchstart", function (e) { var t = e.touches[0]; sx0 = t.clientX; sy0 = t.clientY; }, { passive: true });
  screen.addEventListener("touchend", function (e) {
    if (sx0 === null) return;
    var t = e.changedTouches[0], dx = t.clientX - sx0, dy = t.clientY - sy0;
    sx0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) select(active + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  /* ---------- static mode ---------- */
  function lazyWatch() {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !nearby) { nearby = true; videoOf(active); playActive(); }
      });
    }, { rootMargin: "400px 0px" });
    io.observe(sec);
    var io2 = new IntersectionObserver(function (es) {
      var was = visible;
      visible = es[0].intersectionRatio > 0.18;
      if (!live || was === visible) return;
      if (visible) { dwellStart = performance.now(); start(); playActive(); }
      else { dwellSpent += performance.now() - dwellStart; stop(); pauseAll(); }
    }, { threshold: [0, 0.18, 0.4] });
    io2.observe(stage);
  }
  if (!("IntersectionObserver" in window)) { nearby = true; visible = true; }

  if (!live || !ctx) {
    live = false;
    sats.forEach(function (b, k) { b.tabIndex = k === active ? 0 : -1; });
    if ("IntersectionObserver" in window) lazyWatch(); else videoOf(active);
    return;
  }

  /* ---------- live orbit ---------- */
  sec.classList.remove("is-static");
  sec.classList.add("is-live");

  // dust gets its own canvas so the ring itself is painted once per layout, not every frame
  var dustCv = document.createElement("canvas");
  dustCv.className = "orbit-dust"; dustCv.setAttribute("aria-hidden", "true");
  canvas.parentNode.insertBefore(dustCv, canvas.nextSibling);
  var dctx = dustCv.getContext("2d");

  var RX = 0.6, RY = 0.2, DK = 0.04;   // ring radii and how far its centre sits above the screen's bottom edge (× screen width)
  var G = {};
  var phi = 0, from = 0, to = 0, turnT0 = -1e9;
  var bw = [], dust = [], raf = 0, last = 0, lastP = -1;
  var BANDS = [ // k, width (px at W=800), alpha
    [.88, .8, .10], [.91, 6, .035], [.94, 1, .20], [.968, 8, .05], [1, 1.4, .55],
    [1.03, 4, .07], [1.06, .9, .22], [1.095, 10, .03], [1.13, .7, .10]
  ];

  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function turnTo(i) {
    var target = -i * STEP;
    if (Math.abs(target - phi) < 1e-3) return;
    from = phi; to = target; turnT0 = performance.now();
  }

  function measure() { bw = sats.map(function (b) { return b.offsetWidth; }); }
  function layout() {
    var S = stage.clientWidth, vw = document.documentElement.clientWidth;
    var narrow = S < 700;
    sec.classList.toggle("is-narrow", narrow);
    var W = narrow ? S
      : Math.max(520, Math.min(960, S, (vw / 2 - 20) / (RX * 1.13), (window.innerHeight - 250) / 0.7225));
    var H = W * 9 / 16, sy = 6, sb = sy + H;
    var rx = W * RX, ry = W * RY, cx = S / 2, cy = sb - W * DK;
    var rs = narrow ? 19 : 22;
    var h = sb + ry * (1 - DK / RY) + (narrow ? 58 : 66);
    G = { S: S, W: W, H: H, rx: rx, ry: ry, cx: cx, cy: cy, rs: rs, h: h, narrow: narrow, sx: cx - W / 2, sy: sy, M: 90 };
    STEP = narrow ? 0.62 : 0.78;
    phi = from = to = -active * STEP; turnT0 = -1e9;
    var st = sec.style;
    st.setProperty("--stage-h", h + "px");
    st.setProperty("--sx", G.sx + "px"); st.setProperty("--sy", sy + "px"); st.setProperty("--sw", W + "px");
    st.setProperty("--cx0", cx + "px"); st.setProperty("--cy0", (sb + W * 0.026) + "px");
    st.setProperty("--cw", Math.min(W * 0.62, 640) + "px");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cw = S + G.M * 2, ch = h + G.M * 2;
    [canvas, dustCv].forEach(function (c) {
      c.width = Math.round(cw * dpr); c.height = Math.round(ch * dpr);
      c.style.width = cw + "px"; c.style.height = ch + "px";
      c.style.left = -G.M + "px"; c.style.top = -G.M + "px";
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    G.rad = parseFloat(getComputedStyle(screen).borderTopLeftRadius) || 20;
    seedDust(narrow ? 70 : 150);
    drawRing();
    measure();
    frame(performance.now(), true);
  }

  function seedDust(n) {
    if (dust.length === n) return;
    dust = [];
    for (var j = 0; j < n; j++) {
      var b = BANDS[(Math.random() * BANDS.length) | 0];
      dust.push({ k: b[0] + (Math.random() - .5) * .03, a: Math.random() * Math.PI * 2,
                  w: .010 + Math.random() * .014, s: .8 + Math.random() * 1.4, o: .25 + Math.random() * .55 });
    }
  }

  function clipScreen(c) {           // everything outside the screen's rounded rectangle
    var M = G.M, x = G.sx + M, y = G.sy + M, w = G.W, h = G.H, r = G.rad;
    c.beginPath();
    c.rect(0, 0, G.S + M * 2, G.h + M * 2);
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    c.clip("evenodd");
  }
  function drawRing() {
    var M = G.M, cx = G.cx + M, cy = G.cy + M, sc = G.W / 800;
    ctx.clearRect(0, 0, G.S + M * 2, G.h + M * 2);
    ctx.save();
    clipScreen(ctx);
    for (var half = 0; half < 2; half++) {      // 0 = back half (dimmer), 1 = front half
      var a0 = half === 0 ? Math.PI : 0, dim = half === 0 ? .55 : 1;
      for (var b = 0; b < BANDS.length; b++) {
        var k = BANDS[b][0];
        ctx.beginPath();
        ctx.ellipse(cx, cy, G.rx * k, G.ry * k, 0, a0, a0 + Math.PI);
        ctx.lineWidth = Math.max(.6, BANDS[b][1] * sc);
        ctx.strokeStyle = "rgba(236,232,224," + (BANDS[b][2] * dim) + ")";
        ctx.stroke();
      }
    }
    // warm glow on the main band under the middle satellite
    var g = 22;
    for (var s = -g; s < g; s++) {
      var t0 = Math.PI / 2 + s * .04, f = Math.exp(-(s * s) / (g * g / 4));
      ctx.beginPath();
      ctx.ellipse(cx, cy, G.rx, G.ry, 0, t0, t0 + .042);
      ctx.lineWidth = 2.2 * Math.max(.8, sc);
      ctx.strokeStyle = "rgba(255,236,214," + (.5 * f) + ")";
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawDust(dt) {
    var M = G.M, cx = G.cx + M, cy = G.cy + M, sc = Math.max(.75, G.W / 800);
    var x0 = G.sx + M, x1 = x0 + G.W, y0 = G.sy + M, y1 = y0 + G.H;
    dctx.clearRect(0, 0, G.S + M * 2, G.h + M * 2);
    dctx.fillStyle = "#f2eee6";
    for (var j = 0; j < dust.length; j++) {
      var p = dust[j];
      p.a -= p.w * dt / p.k;
      var c = Math.cos(p.a), x = cx + G.rx * p.k * Math.sin(p.a), y = cy + G.ry * p.k * c;
      if (x > x0 && x < x1 && y > y0 && y < y1) continue;   // behind the screen
      var depth = (c + 1) / 2, r = p.s * (.6 + .5 * depth) * sc;
      dctx.globalAlpha = p.o * (.35 + .65 * depth);
      dctx.fillRect(x - r / 2, y - r / 2, r, r);
    }
    dctx.globalAlpha = 1;
  }

  function frame(now, still) {
    var dt = last && !still ? Math.min(.05, (now - last) / 1000) : 0;
    if (!still) last = now;
    var tt = (now - turnT0) / TURN;
    var base = tt < 1 ? from + (to - from) * ease(Math.max(0, tt)) : to;
    phi = base + 0.03 * Math.sin(now / 16000 * Math.PI * 2);
    drawDust(dt);

    for (var i = 0; i < N; i++) {
      var th = phi + i * STEP, c = Math.cos(th);
      var x = G.cx + G.rx * Math.sin(th), y = G.cy + G.ry * c;
      var depth = (c + 1) / 2;
      var s = .62 + .38 * depth * depth;
      var el = sats[i], st = el.style;
      st.transform = "translate3d(" + (x - bw[i] / 2).toFixed(2) + "px," + (y - G.rs - 6).toFixed(2) + "px,0) scale(" + s.toFixed(4) + ")";
      st.opacity = Math.max(0, Math.min(1, .2 + .8 * depth * depth)).toFixed(3);
      st.zIndex = c > 0 ? 4 : 1;
      st.visibility = c < -.2 ? "hidden" : "";
    }

    // progress on the active satellite
    var p = 0, v = slides[active].querySelector("video");
    var spent = dwellSpent + (visible && !document.hidden ? now - dwellStart : 0);
    if (v && slides[active].dataset.video && !s_noVideo[active]) {
      p = v.duration ? v.currentTime / v.duration : 0;
      if (spent > 90000 && !still) { next(); p = 0; }   // safety net for a video that never plays
    } else {
      p = Math.min(1, spent / DWELL);
      if (p >= 1 && !still) { next(); p = 0; }
    }
    if (Math.abs(p - lastP) > .0005) { sats[active].style.setProperty("--p", p.toFixed(4)); lastP = p; }
  }

  function loop(now) { frame(now, false); raf = requestAnimationFrame(loop); }
  function start() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { dwellSpent += performance.now() - dwellStart; stop(); pauseAll(); }
    else if (visible) { dwellStart = performance.now(); start(); playActive(); }
  });
  var lastW = 0;
  new ResizeObserver(function () {
    var w = stage.clientWidth;
    if (w === lastW && G.W) return;     // phones fire resize on scroll (toolbar); width is what matters
    lastW = w; layout();
  }).observe(stage);
  new MutationObserver(function () { setTimeout(function () { measure(); frame(performance.now(), true); }, 0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  select(active, true);
  layout();
  lazyWatch();
})();

/* Feature orbit: a Saturn-like ring around the feature screen. Each satellite is one feature;
   the satellite at the front of the ring is the one playing. The ring turns to the next
   satellite when the video ends (or after DWELL for a slide without video).
   Videos load only when the section comes near the viewport; everything pauses off-screen.
   Reduced motion → static chips under the screen, no auto-advance, video with controls.
   ?motion=live / ?motion=static in the URL forces either mode for review. */
(function () {
  "use strict";
  var RESPECT_REDUCED_MOTION = true;
  var DWELL = 10000;          // ms on a slide without video
  var TURN = 3200;            // ms for the ring to bring the next satellite to the front

  var sec = document.getElementById("features");
  if (!sec) return;
  var stage = document.getElementById("orbit-stage");
  var screen = document.getElementById("orbit-screen");
  var canvas = document.getElementById("orbit-ring");
  var ctx = canvas.getContext && canvas.getContext("2d");
  var sats = [].slice.call(sec.querySelectorAll(".orbit-sat"));
  var slides = [].slice.call(sec.querySelectorAll(".orbit-slide"));
  var caps = [].slice.call(sec.querySelectorAll(".orbit-cap"));
  var N = sats.length, STEP = Math.PI * 2 / N;

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
    if (live) { turnTo(i, user); playActive(); }
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

  var G = {};               // geometry
  var phi = 0, from = 0, to = 0, turnT0 = -1e9;
  var bw = [], dust = [], raf = 0, last = 0;
  var BANDS = [ // k, width (px at W=800), alpha
    [.86, .8, .10], [.90, 6, .035], [.935, 1, .20], [.965, 8, .05], [1, 1.4, .55],
    [1.03, 4, .07], [1.065, .9, .22], [1.10, 10, .03], [1.13, .7, .10]
  ];

  function wrap(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a <= -Math.PI) a += 2 * Math.PI; return a; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function turnTo(i, user) {
    var target = -i * STEP;
    var d = wrap(target - phi);
    if (!user && d > 0) d -= 2 * Math.PI;        // auto-advance always turns the same way
    if (Math.abs(d) < 1e-3) return;
    from = phi; to = phi + d; turnT0 = performance.now();
  }

  function measure() {
    bw = sats.map(function (b) { return b.offsetWidth; });
  }
  function layout() {
    var S = stage.clientWidth;
    var narrow = S < 700;
    sec.classList.toggle("is-narrow", narrow);
    // ring centre sits below the screen centre (dK·W) so the caption fits inside the ring
    var dK = narrow ? 0.06 : 0.2, ryK = 9 / 32 + dK + (narrow ? 0.07 : 0.06);
    // keep the whole planet-and-ring in one screen: the stage is about 2.26·ryK·W + 70 tall
    var W = narrow ? S * 0.8 : Math.min(860, S * 0.7, Math.max(600, (window.innerHeight - 220) / (2.26 * ryK)));
    var H = W * 9 / 16;
    var d = W * dK;
    var ry = W * ryK;
    var rx = Math.min(W * 0.62, S / 2 - (narrow ? 20 : 34));
    var rs = narrow ? 18 : 22;
    var cy = Math.max(ry + rs + 12, ry * 1.13 + 4);
    var cx = S / 2;
    var h = cy + ry * 1.13 + rs + (narrow ? 14 : 44);
    G = { S: S, W: W, H: H, d: d, rx: rx, ry: ry, cx: cx, cy: cy, rs: rs, h: h, narrow: narrow,
          sx: cx - W / 2, sy: cy - d - H / 2, M: 80 };
    var st = sec.style;
    st.setProperty("--stage-h", h + "px");
    st.setProperty("--sx", G.sx + "px"); st.setProperty("--sy", G.sy + "px"); st.setProperty("--sw", W + "px");
    st.setProperty("--cx0", cx + "px"); st.setProperty("--cy0", (G.sy + H + W * 0.04) + "px");
    st.setProperty("--cw", Math.min(W * 0.74, 620) + "px");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cw = S + G.M * 2, ch = h + G.M * 2;
    canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
    canvas.style.width = cw + "px"; canvas.style.height = ch + "px";
    canvas.style.left = -G.M + "px"; canvas.style.top = -G.M + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    G.rad = parseFloat(getComputedStyle(screen).borderTopLeftRadius) || 20;
    seedDust(narrow ? 80 : 170);
    measure();
    frame(performance.now(), true);
  }

  function seedDust(n) {
    if (dust.length === n) return;
    dust = [];
    for (var j = 0; j < n; j++) {
      var b = BANDS[(Math.random() * BANDS.length) | 0];
      dust.push({ k: b[0] + (Math.random() - .5) * .03, a: Math.random() * Math.PI * 2,
                  w: .010 + Math.random() * .014, s: .5 + Math.random() * 1.1, o: .25 + Math.random() * .55 });
    }
  }

  function clipBack() {
    var M = G.M, x = G.sx + M, y = G.sy + M, w = G.W, h = G.H, r = G.rad;
    ctx.beginPath();
    ctx.rect(0, 0, G.S + M * 2, G.h + M * 2);
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    ctx.clip("evenodd");
  }
  function drawRing(now, dphi) {
    var M = G.M, cx = G.cx + M, cy = G.cy + M, sc = G.W / 800;
    ctx.clearRect(0, 0, G.S + M * 2, G.h + M * 2);
    for (var half = 0; half < 2; half++) {      // 0 = back (behind the screen), 1 = front
      ctx.save();
      if (half === 0) clipBack();
      var a0 = half === 0 ? Math.PI : 0, a1 = a0 + Math.PI, dim = half === 0 ? .5 : 1;
      for (var b = 0; b < BANDS.length; b++) {
        var k = BANDS[b][0];
        ctx.beginPath();
        ctx.ellipse(cx, cy, G.rx * k, G.ry * k, 0, a0, a1);
        ctx.lineWidth = Math.max(.6, BANDS[b][1] * sc);
        ctx.strokeStyle = "rgba(236,232,224," + (BANDS[b][2] * dim) + ")";
        ctx.stroke();
      }
      // dust drifting along the bands
      for (var j = 0; j < dust.length; j++) {
        var p = dust[j];
        var th = p.a, c = Math.cos(th);
        if ((c >= 0) !== (half === 1)) continue;
        var x = cx + G.rx * p.k * Math.sin(th), y = cy + G.ry * p.k * c;
        var depth = (c + 1) / 2;
        ctx.globalAlpha = p.o * (.35 + .65 * depth);
        ctx.fillStyle = "#f2eee6";
        ctx.beginPath(); ctx.arc(x, y, p.s * (.6 + .5 * depth) * Math.max(.7, sc), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    // warm glow on the main band where the active satellite sits (the front)
    var g = 22;
    for (var s = -g; s < g; s++) {
      var t0 = Math.PI / 2 + s * .045, f = Math.exp(-(s * s) / (g * g / 4));
      ctx.beginPath();
      ctx.ellipse(cx, cy, G.rx, G.ry, 0, t0, t0 + .047);
      ctx.lineWidth = 2.2 * Math.max(.8, sc);
      ctx.strokeStyle = "rgba(255,236,214," + (.55 * f) + ")";
      ctx.stroke();
    }
  }

  function frame(now, still) {
    var dt = last ? Math.min(.05, (now - last) / 1000) : 0;
    last = now;
    var prev = phi;
    var tt = (now - turnT0) / TURN;
    var base = tt < 1 ? from + (to - from) * ease(Math.max(0, tt)) : to;
    var sway = 0.045 * Math.sin(now / 14000 * Math.PI * 2);
    phi = base + sway;
    var dphi = still ? 0 : phi - prev;
    for (var j = 0; j < dust.length; j++) dust[j].a += dphi - dust[j].w * dt * (1 / dust[j].k);
    drawRing(now, dphi);

    for (var i = 0; i < N; i++) {
      var th = phi + i * STEP, c = Math.cos(th);
      var x = G.cx + G.rx * Math.sin(th), y = G.cy + G.ry * c;
      var depth = (c + 1) / 2;
      var s = .66 + .4 * depth;
      var el = sats[i], st = el.style;
      st.transform = "translate(" + (x - bw[i] / 2).toFixed(1) + "px," + (y - G.rs).toFixed(1) + "px) scale(" + s.toFixed(3) + ")";
      st.opacity = (.3 + .7 * depth).toFixed(3);
      st.zIndex = c > -0.08 ? 4 : 1;
      st.filter = depth < .5 ? "blur(" + ((.5 - depth) * 3).toFixed(2) + "px)" : "none";
      var lab = el.lastElementChild;
      if (lab) lab.style.opacity = Math.max(0, Math.min(1, (c + .15) / .6)).toFixed(3);
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
    sats[active].style.setProperty("--p", p.toFixed(4));
    for (var q = 0; q < N; q++) if (q !== active) sats[q].style.setProperty("--p", 0);
  }

  function loop(now) { frame(now, false); raf = requestAnimationFrame(loop); }
  function start() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { dwellSpent += performance.now() - dwellStart; stop(); pauseAll(); }
    else if (visible) { dwellStart = performance.now(); start(); playActive(); }
  });
  new ResizeObserver(function () { layout(); }).observe(stage);
  new MutationObserver(function () { setTimeout(function () { measure(); frame(performance.now(), true); }, 0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  phi = from = to = -active * STEP;
  select(active, true);
  layout();
  lazyWatch();
})();

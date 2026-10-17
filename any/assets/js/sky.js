// Starlight canvas: a quiet field of stars with slow parallax, twinkles and the odd shooting star.
"use strict";
(function () {
  const canvas = document.getElementById("sky");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars = [], w = 0, h = 0, dpr = 1, scroll = 0, frame = 0, meteor = null;

  function seed() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const count = Math.round((w * h) / 2600);
    stars = Array.from({ length: count }, () => {
      const depth = Math.random();
      return {
        x: Math.random() * w,
        y: Math.random() * h * 1.6,
        r: depth < 0.92 ? 0.35 + depth * 0.5 : 0.9 + Math.random() * 0.6,
        a: 0.18 + depth * 0.62,
        depth,
        tw: Math.random() * Math.PI * 2,
        tint: Math.random() < 0.12 ? "255,214,180" : Math.random() < 0.3 ? "200,220,255" : "255,255,255"
      };
    });
  }

  function draw(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const y = ((s.y - scroll * (0.04 + s.depth * 0.12)) % (h * 1.6) + h * 1.6) % (h * 1.6);
      if (y > h + 2) continue;
      const twinkle = reduce ? 1 : 0.75 + 0.25 * Math.sin(t * 0.0012 * (0.4 + s.depth) + s.tw);
      ctx.globalAlpha = s.a * twinkle;
      ctx.fillStyle = `rgb(${s.tint})`;
      ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, Math.PI * 2); ctx.fill();
      if (s.r > 1.1) {
        ctx.globalAlpha = s.a * 0.12 * twinkle;
        ctx.beginPath(); ctx.arc(s.x, y, s.r * 4, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (!reduce) drawMeteor();
  }

  function drawMeteor() {
    if (!meteor && Math.random() < 0.0025) {
      const angle = Math.PI * (0.12 + Math.random() * 0.12);
      meteor = { x: w * (0.15 + Math.random() * 0.7), y: h * Math.random() * 0.4, vx: Math.cos(angle) * 9, vy: Math.sin(angle) * 9, life: 0 };
    }
    if (!meteor) return;
    const m = meteor;
    m.x += m.vx; m.y += m.vy; m.life += 1;
    const fade = Math.sin(Math.min(m.life / 60, 1) * Math.PI);
    const tail = 16;
    const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tail, m.y - m.vy * tail);
    g.addColorStop(0, `rgba(255,255,255,${0.85 * fade})`);
    g.addColorStop(1, "rgba(156,199,255,0)");
    ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail); ctx.stroke();
    if (m.life > 60) meteor = null;
  }

  function loop(t) { draw(t); frame = requestAnimationFrame(loop); }

  seed();
  if (reduce) draw(0); else frame = requestAnimationFrame(loop);
  addEventListener("resize", () => { cancelAnimationFrame(frame); seed(); if (reduce) draw(0); else frame = requestAnimationFrame(loop); });
  addEventListener("scroll", () => { scroll = scrollY; if (reduce) draw(0); }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (reduce) return;
    if (document.hidden) cancelAnimationFrame(frame); else frame = requestAnimationFrame(loop);
  });
})();

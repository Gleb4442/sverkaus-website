// Gotham Noir Snowfall: subtle falling snow and silver air particulates drifting across the dark cityscape.
"use strict";
(function () {
  const canvas = document.getElementById("sky");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let flakes = [], w = 0, h = 0, dpr = 1, scroll = 0, frame = 0, lastTime = 0;

  function seed() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    // Maintain elegant sparse density: ~60-80 flakes on desktop, ~35 on mobile
    const count = Math.min(Math.max(Math.round((w * h) / 16000), 30), 85);
    flakes = Array.from({ length: count }, () => {
      const depth = Math.random(); // 0: distant, 1: near
      const isBokeh = Math.random() < 0.07; // rare soft out-of-focus foreground flake
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: isBokeh ? 2.8 + Math.random() * 1.4 : depth < 0.7 ? 0.6 + depth * 0.8 : 1.4 + Math.random() * 0.9,
        speedY: 0.3 + depth * 0.65 + (isBokeh ? 0.35 : 0),
        swaySpeed: 0.001 + Math.random() * 0.0012,
        swayAmp: 0.35 + depth * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: isBokeh ? 0.14 + Math.random() * 0.16 : 0.25 + depth * 0.55,
        depth,
        isBokeh,
        tint: depth > 0.6 ? "255, 255, 255" : "220, 230, 245"
      };
    });
  }

  function draw(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const dt = lastTime ? Math.min((t - lastTime) / 16.67, 2.5) : 1;
    lastTime = t;

    for (const f of flakes) {
      if (!reduce) {
        f.y += f.speedY * dt;
        f.x += Math.sin(t * f.swaySpeed + f.phase) * f.swayAmp * 0.15 * dt;

        // Wrap around vertically
        if (f.y > h + 15) {
          f.y = -10;
          f.x = Math.random() * w;
        }
      }

      // Parallax offset with page scroll
      const renderY = f.y - (scroll * (0.02 + f.depth * 0.06)) % (h + 20);
      const displayY = ((renderY % (h + 20)) + (h + 20)) % (h + 20) - 10;

      ctx.globalAlpha = f.alpha;
      ctx.fillStyle = `rgb(${f.tint})`;
      ctx.beginPath();
      ctx.arc(f.x, displayY, f.r, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow aura for bokeh flakes
      if (f.isBokeh) {
        ctx.globalAlpha = f.alpha * 0.35;
        ctx.beginPath();
        ctx.arc(f.x, displayY, f.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    draw(t);
    frame = requestAnimationFrame(loop);
  }

  seed();
  if (reduce) {
    draw(0);
  } else {
    frame = requestAnimationFrame(loop);
  }

  addEventListener("resize", () => {
    cancelAnimationFrame(frame);
    seed();
    if (reduce) draw(0);
    else frame = requestAnimationFrame(loop);
  });

  addEventListener("scroll", () => {
    scroll = scrollY;
    if (reduce) draw(0);
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (reduce) return;
    if (document.hidden) {
      cancelAnimationFrame(frame);
    } else {
      lastTime = 0;
      frame = requestAnimationFrame(loop);
    }
  });
})();

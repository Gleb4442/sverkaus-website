/**
 * Tier 2: Milestone 2 Adversarial Scroll Physics, Hysteresis & Boundary Challenge
 * 
 * Adversarial stress tests:
 * 1. Micro-scroll oscillations around 48px/18px hysteresis thresholds
 * 2. Rapid momentum scroll down and up (extreme velocity, reversals, bounce, delta thresholds)
 * 3. Computed border styles in all nav states (strictly 0px / none)
 * 4. Hero safe zone immunity (scrollY <= 240px immunity & instant recovery)
 * 5. Viewport responsiveness (375px-1440px) with strict 0px horizontal overflow
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('../harness/test-runner');
const { checkHorizontalOverflow, checkNavFrameless } = require('../harness/assertions');

const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000/any/';

describe('Adversarial M2: Frameless Nav & Morphing Physics Stress Suite', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9360);
    await cdp.start();
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(TARGET_URL);
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  // =========================================================================
  // SECTION 1: Micro-Scroll Oscillations & Hysteresis Thresholds (48px / 18px)
  // =========================================================================

  it('ADV-1.1: Precise upper hysteresis boundary (48px un-scrolled vs 49px scrolled)', async () => {
    await cdp.scrollTo(0);
    // Scroll to exact boundary 48px from top -> must NOT enter dock yet (> 48 required)
    await cdp.scrollTo(48);
    let isScrolled = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav');
      return nav ? nav.classList.contains('is-scrolled') : false;
    });
    expect(isScrolled).toBe(false);

    // Increment to 49px (past 48px threshold) -> must enter dock
    await cdp.scrollTo(49);
    isScrolled = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav');
      return nav ? nav.classList.contains('is-scrolled') : false;
    });
    expect(isScrolled).toBe(true);
  });

  it('ADV-1.2: Deadband retention when scrolling back down into (18px, 48px] region', async () => {
    // Docked at 49px
    // Scroll back down through deadband: 45px, 35px, 25px, 19px
    const deadbandPoints = [45, 35, 25, 19];
    for (const pt of deadbandPoints) {
      await cdp.scrollTo(pt);
      const isScrolled = await cdp.evaluate(() => {
        const nav = document.querySelector('.nav');
        return nav ? nav.classList.contains('is-scrolled') : false;
      });
      expect(isScrolled).toBe(true);
    }
  });

  it('ADV-1.3: Precise lower hysteresis exit threshold (18px reverts vs 19px retained)', async () => {
    // At 19px, it must remain docked
    await cdp.scrollTo(19);
    let isScrolled = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav');
      return nav ? nav.classList.contains('is-scrolled') : false;
    });
    expect(isScrolled).toBe(true);

    // At 18px (<= 18px threshold), it must cleanly revert to classic bar
    await cdp.scrollTo(18);
    isScrolled = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav');
      return nav ? nav.classList.contains('is-scrolled') : false;
    });
    expect(isScrolled).toBe(false);

    // Below 18px (e.g. 10px), must remain false
    await cdp.scrollTo(10);
    isScrolled = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav');
      return nav ? nav.classList.contains('is-scrolled') : false;
    });
    expect(isScrolled).toBe(false);
  });

  it('ADV-1.4: Deadband retention from top-down direction (15px to 48px remains un-scrolled)', async () => {
    // Coming from 0px up through deadband: must NOT enter dock
    await cdp.scrollTo(0);
    const deadbandPoints = [15, 18, 25, 35, 45, 48];
    for (const pt of deadbandPoints) {
      await cdp.scrollTo(pt);
      const isScrolled = await cdp.evaluate(() => {
        const nav = document.querySelector('.nav');
        return nav ? nav.classList.contains('is-scrolled') : false;
      });
      expect(isScrolled).toBe(false);
    }
  });

  it('ADV-1.5: Micro-oscillation thrash around 48px boundary (47px <-> 49px across 20 frames)', async () => {
    cdp.clearErrors();
    await cdp.scrollTo(0);
    
    // Perform rapid oscillations between 47px and 49px
    const states = [];
    for (let i = 0; i < 20; i++) {
      const targetY = (i % 2 === 0) ? 49 : 47;
      await cdp.scrollTo(targetY);
      const isScrolled = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('is-scrolled'));
      states.push(isScrolled);
    }

    // In step 0 (49px), is-scrolled becomes true. In all subsequent steps (47px and 49px),
    // because 47 > 18, it must STAY true without jitter or flicker!
    const allScrolled = states.every(s => s === true);
    expect(allScrolled).toBe(true);
    expect(cdp.getErrors().length).toBe(0);
  });

  it('ADV-1.6: Micro-oscillation thrash around 18px boundary (17px <-> 19px across 20 frames)', async () => {
    cdp.clearErrors();
    // Start docked at 50px
    await cdp.scrollTo(50);

    // Oscillate between 17px and 19px
    const states = [];
    for (let i = 0; i < 20; i++) {
      const targetY = (i % 2 === 0) ? 17 : 19;
      await cdp.scrollTo(targetY);
      const isScrolled = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('is-scrolled'));
      states.push(isScrolled);
    }

    // In step 0 (17px <= 18), is-scrolled becomes false. In step 1 (19px <= 48), it remains false!
    // Therefore throughout all subsequent oscillations, is-scrolled remains false without spurious docking!
    const allUnscrolled = states.every(s => s === false);
    expect(allUnscrolled).toBe(true);
    expect(cdp.getErrors().length).toBe(0);
  });

  // =========================================================================
  // SECTION 2: Rapid Momentum Scrolling & Extreme Velocity
  // =========================================================================

  it('ADV-2.1: Mega momentum scroll leap (+2500px in single frame)', async () => {
    await cdp.scrollTo(0);
    // Huge downward flick
    await cdp.scrollTo(2500);

    const navState = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav');
      return {
        isScrolled: nav.classList.contains('is-scrolled'),
        navHidden: nav.classList.contains('nav-hidden')
      };
    });

    expect(navState.isScrolled).toBe(true);
    expect(navState.navHidden).toBe(true);
  });

  it('ADV-2.2: Instantaneous upward momentum reverse flick (-1500px in single frame)', async () => {
    // Currently at 2500px, hidden
    // Flick up to 1000px (delta = -1500px, way above REVEAL_THRESHOLD 12px)
    await cdp.scrollTo(1000);

    const navState = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav');
      return {
        isScrolled: nav.classList.contains('is-scrolled'),
        navHidden: nav.classList.contains('nav-hidden')
      };
    });

    expect(navState.isScrolled).toBe(true);
    expect(navState.navHidden).toBe(false);
  });

  it('ADV-2.3: Alternating extreme momentum spikes [0, 2000, 100, 3200, 50, 0]', async () => {
    cdp.clearErrors();
    const spikes = [0, 2000, 100, 3200, 50, 0];
    for (const targetY of spikes) {
      await cdp.scrollTo(targetY);
    }

    const navState = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav');
      return {
        isScrolled: nav.classList.contains('is-scrolled'),
        navHidden: nav.classList.contains('nav-hidden')
      };
    });

    // Back at 0: must be un-scrolled and visible
    expect(navState.isScrolled).toBe(false);
    expect(navState.navHidden).toBe(false);
    expect(cdp.getErrors().length).toBe(0);
  });

  it('ADV-2.4: Zero-delta scroll events do not mutate nav state or leak accumulators', async () => {
    // Scroll to 400px and reveal nav
    await cdp.scrollTo(400);
    await cdp.scrollBy(-30); // reveal
    let initialHidden = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('nav-hidden'));
    expect(initialHidden).toBe(false);

    // Dispatch 25 zero-delta scroll events
    await cdp.evaluate(() => {
      for (let i = 0; i < 25; i++) {
        window.dispatchEvent(new Event('scroll'));
      }
    });

    let postZeroDeltaHidden = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('nav-hidden'));
    expect(postZeroDeltaHidden).toBe(false);
  });

  it('ADV-2.5: Deliberate delta thresholds (32px downward hide, 12px upward reveal)', async () => {
    // Position at 300px and reveal nav
    await cdp.scrollTo(300);
    await cdp.scrollBy(-30);
    let hidden = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('nav-hidden'));
    expect(hidden).toBe(false);

    // Downward scroll of 28px (below 32px threshold) -> must NOT hide
    await cdp.scrollBy(28);
    hidden = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('nav-hidden'));
    expect(hidden).toBe(false);

    // Additional downward scroll of 10px (total 38px > 32px) -> MUST hide
    await cdp.scrollBy(10);
    hidden = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('nav-hidden'));
    expect(hidden).toBe(true);

    // Upward scroll of 10px (below 12px threshold) -> must NOT reveal yet
    await cdp.scrollBy(-10);
    hidden = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('nav-hidden'));
    expect(hidden).toBe(true);

    // Additional upward scroll of 5px (total 15px > 12px) -> MUST reveal
    await cdp.scrollBy(-5);
    hidden = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('nav-hidden'));
    expect(hidden).toBe(false);
  });

  it('ADV-2.6: Elastic overscroll negative scroll simulation clamps safely without error', async () => {
    await cdp.scrollTo(300);
    // Simulate rubber-banding bounce to negative position
    await cdp.evaluate(() => {
      window.scrollTo({ top: -40, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    });
    // Wait for rAF update
    await new Promise(r => setTimeout(r, 120));

    const result = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav');
      return {
        isScrolled: nav.classList.contains('is-scrolled'),
        navHidden: nav.classList.contains('nav-hidden'),
        scrollY: window.scrollY
      };
    });

    expect(result.isScrolled).toBe(false);
    expect(result.navHidden).toBe(false);
    expect(cdp.getErrors().length).toBe(0);
  });

  // =========================================================================
  // SECTION 3: Computed Border Styles in All States (Must Be Strictly 0px / None)
  // =========================================================================

  it('ADV-3.1: Computed border styles on .nav-bar across 6 distinct operational states', async () => {
    const statesToTest = [
      { name: 'State 1: Top Classic Bar (scrollY = 0)', y: 0, prepare: null },
      { name: 'State 2: Deadband Morph (scrollY = 35)', y: 35, prepare: null },
      { name: 'State 3: Scrolled Dock (scrollY = 200)', y: 200, prepare: null },
      { name: 'State 4: Auto-Hidden Dock (scrollY = 500 down)', y: 500, prepare: null },
      { name: 'State 5: Auto-Revealed Dock (scrollY = 450 up)', y: 450, prepare: async () => {
        await cdp.scrollTo(550);
        await cdp.scrollBy(-100);
      }},
      { name: 'State 6: Return to Top (scrollY = 0)', y: 0, prepare: null }
    ];

    for (const st of statesToTest) {
      if (st.prepare) {
        await st.prepare();
      } else {
        await cdp.scrollTo(st.y);
      }

      const styles = await cdp.evaluate(() => {
        const navBar = document.querySelector('.nav-bar');
        const nav = document.querySelector('.nav');
        if (!navBar) return null;

        const csBar = window.getComputedStyle(navBar);
        const csNav = nav ? window.getComputedStyle(nav) : null;

        return {
          barBorderTopWidth: csBar.borderTopWidth,
          barBorderRightWidth: csBar.borderRightWidth,
          barBorderBottomWidth: csBar.borderBottomWidth,
          barBorderLeftWidth: csBar.borderLeftWidth,
          barBorderStyle: csBar.borderStyle,
          barOutlineWidth: csBar.outlineWidth,
          barOutlineStyle: csBar.outlineStyle,
          navBorderTopWidth: csNav ? csNav.borderTopWidth : '0px',
          navBorderBottomWidth: csNav ? csNav.borderBottomWidth : '0px'
        };
      });

      expect(styles).toBeDefined();
      expect(styles.barBorderTopWidth).toBe('0px');
      expect(styles.barBorderRightWidth).toBe('0px');
      expect(styles.barBorderBottomWidth).toBe('0px');
      expect(styles.barBorderLeftWidth).toBe('0px');
      expect(styles.barBorderStyle).toBe('none');
      expect(styles.barOutlineWidth === '0px' || styles.barOutlineStyle === 'none').toBe(true);
      expect(styles.navBorderTopWidth).toBe('0px');
      expect(styles.navBorderBottomWidth).toBe('0px');
    }
  });

  it('ADV-3.2: Specular pseudo-element (.nav-bar::before) has zero border', async () => {
    await cdp.scrollTo(300);
    const beforeBorder = await cdp.evaluate(() => {
      const navBar = document.querySelector('.nav-bar');
      if (!navBar) return null;
      const cs = window.getComputedStyle(navBar, '::before');
      return {
        borderTopWidth: cs.borderTopWidth,
        borderBottomWidth: cs.borderBottomWidth,
        borderLeftWidth: cs.borderLeftWidth,
        borderRightWidth: cs.borderRightWidth,
        borderStyle: cs.borderStyle
      };
    });

    expect(beforeBorder.borderTopWidth).toBe('0px');
    expect(beforeBorder.borderBottomWidth).toBe('0px');
    expect(beforeBorder.borderLeftWidth).toBe('0px');
    expect(beforeBorder.borderRightWidth).toBe('0px');
    expect(beforeBorder.borderStyle).toBe('none');
  });

  // =========================================================================
  // SECTION 4: Hero Safe Zone Immunity (scrollY <= 240px)
  // =========================================================================

  it('ADV-4.1: Nav is strictly immune to auto-hide anywhere within hero safe zone (0px to 240px)', async () => {
    await cdp.scrollTo(0);
    // Step downward inside hero safe zone in 40px increments with heavy deltas
    const safeZonePoints = [40, 80, 120, 160, 200, 240];
    for (const pt of safeZonePoints) {
      await cdp.scrollTo(pt);
      const isHidden = await cdp.evaluate(() => {
        const nav = document.querySelector('.nav');
        return nav ? nav.classList.contains('nav-hidden') : false;
      });
      expect(isHidden).toBe(false);
    }
  });

  it('ADV-4.2: Exceeding hero safe zone boundary (241px) engages auto-hide under downward scroll', async () => {
    // Currently at 240px. Scroll downward past 240px by > 32px
    await cdp.scrollTo(280);
    const isHidden = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav');
      return nav ? nav.classList.contains('nav-hidden') : false;
    });
    expect(isHidden).toBe(true);
  });

  it('ADV-4.3: Instant auto-reveal upon entering safe zone regardless of upward delta', async () => {
    // Scroll deep down so nav is firmly hidden
    await cdp.scrollTo(600);
    let isHidden = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('nav-hidden'));
    expect(isHidden).toBe(true);

    // Scroll directly into safe zone at 240px
    await cdp.scrollTo(240);
    isHidden = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('nav-hidden'));
    expect(isHidden).toBe(false);

    // Step to 239px
    await cdp.scrollTo(239);
    isHidden = await cdp.evaluate(() => document.querySelector('.nav').classList.contains('nav-hidden'));
    expect(isHidden).toBe(false);
  });

  // =========================================================================
  // SECTION 5: Viewport Responsiveness (375px - 1440px) & 0px Overflow Matrix
  // =========================================================================

  const testViewports = [
    { width: 375, height: 812, name: 'iPhone SE (375px)' },
    { width: 390, height: 844, name: 'iPhone 14/15 (390px)' },
    { width: 414, height: 896, name: 'iPhone XR (414px)' },
    { width: 768, height: 1024, name: 'iPad Portrait (768px)' },
    { width: 860, height: 1024, name: 'CSS Breakpoint Bound (860px)' },
    { width: 1024, height: 768, name: 'iPad Landscape (1024px)' },
    { width: 1280, height: 800, name: 'MacBook Standard (1280px)' },
    { width: 1440, height: 900, name: 'Desktop Retina (1440px)' }
  ];

  for (const vp of testViewports) {
    it(`ADV-5: ${vp.name} maintains strict 0px horizontal overflow in top and scrolled states`, async () => {
      await cdp.setViewport(vp.width, vp.height, vp.width < 768);
      await cdp.navigate(TARGET_URL);

      // 1. Top Bar state (scrollY = 0)
      await cdp.scrollTo(0);
      let auditTop = await checkHorizontalOverflow(cdp);
      if (auditTop.hasOverflow) {
        console.error(`Overflow at ${vp.width}px (top):`, auditTop.overflowing);
      }
      expect(auditTop.scrollWidth).toBeLessThanOrEqual(vp.width);
      expect(auditTop.hasOverflow).toBe(false);

      // 2. Scrolled Dock state (scrollY = 300)
      await cdp.scrollTo(300);
      let auditScrolled = await checkHorizontalOverflow(cdp);
      if (auditScrolled.hasOverflow) {
        console.error(`Overflow at ${vp.width}px (scrolled):`, auditScrolled.overflowing);
      }
      expect(auditScrolled.scrollWidth).toBeLessThanOrEqual(vp.width);
      expect(auditScrolled.hasOverflow).toBe(false);

      // 3. Frameless border verification at this viewport
      const navBorder = await cdp.evaluate(() => {
        const nb = document.querySelector('.nav-bar');
        if (!nb) return null;
        const cs = window.getComputedStyle(nb);
        return {
          borderTopWidth: cs.borderTopWidth,
          borderBottomWidth: cs.borderBottomWidth,
          borderLeftWidth: cs.borderLeftWidth,
          borderRightWidth: cs.borderRightWidth,
          borderStyle: cs.borderStyle
        };
      });
      expect(navBorder.borderTopWidth).toBe('0px');
      expect(navBorder.borderStyle).toBe('none');
    });
  }

  it('ADV-5.Bilingual: Strict 0px horizontal overflow maintained under Russian and English', async () => {
    await cdp.setViewport(375, 812, true);
    await cdp.navigate(TARGET_URL);

    for (const lang of ['ru', 'en']) {
      await cdp.evaluate((l) => {
        if (typeof window.applyLanguage === 'function') {
          window.applyLanguage(l);
        }
      }, lang);

      // Check overflow
      const audit = await checkHorizontalOverflow(cdp);
      expect(audit.scrollWidth).toBeLessThanOrEqual(375);
      expect(audit.hasOverflow).toBe(false);
    }
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

/**
 * Milestone 5 Challenger 1: Empirical Verification & Adversarial Stress Suite
 * 
 * Target: Any Landing Page Redesign & Dual Archetype Prototypes
 * 
 * Scope:
 * - Module 1: Extreme Viewport Sweep (320px to 3840px, 10 viewports x 3 routes x 2 scroll states = 60 audit points)
 * - Module 2: Rapid Switcher Toggling Storm (16x full alternating cycles / 32 transitions)
 * - Module 3: Active Tab Pointer-Events Inertness & Scroll Preservation under physical CDP clicks
 * - Module 4: Deep Link Navigation & Cross-Route Anchor Behavior with Bilingual Persistence
 */

const { CDPClient } = require('./harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('./harness/test-runner');
const { checkHorizontalOverflow, checkVariantSwitcherPill, checkNavFrameless } = require('./harness/assertions');

const BASE_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000/any/';
const ROOT_URL = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
const COCKPIT_URL = `${ROOT_URL}variant-cockpit.html`;
const GRID_URL = `${ROOT_URL}variant-grid.html`;

const ROUTES = [
  { name: 'Root (index.html)', url: ROOT_URL },
  { name: 'Variant Cockpit', url: COCKPIT_URL },
  { name: 'Variant Grid', url: GRID_URL }
];

const VIEWPORTS = [
  { width: 320, height: 568, isMobile: true, label: '320px (iPhone SE 1st gen)' },
  { width: 360, height: 640, isMobile: true, label: '360px (Galaxy narrow)' },
  { width: 375, height: 812, isMobile: true, label: '375px (iPhone standard)' },
  { width: 540, height: 720, isMobile: true, label: '540px (Foldable/large mobile)' },
  { width: 768, height: 1024, isMobile: false, label: '768px (iPad portrait)' },
  { width: 1024, height: 768, isMobile: false, label: '1024px (iPad landscape / Laptop)' },
  { width: 1440, height: 900, isMobile: false, label: '1440px (MacBook Desktop)' },
  { width: 1920, height: 1080, isMobile: false, label: '1920px (Full HD 1080p)' },
  { width: 2560, height: 1440, isMobile: false, label: '2560px (2K QHD / Studio Display)' },
  { width: 3840, height: 2160, isMobile: false, label: '3840px (4K UHD Ultra-wide)' }
];

async function waitForNavigation(cdp, expectedSubstr, timeoutMs = 4000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const state = await cdp.evaluate(() => ({
        url: window.location.href,
        ready: document.readyState
      }));
      if (state && state.ready === 'complete' && state.url.includes(expectedSubstr)) {
        return true;
      }
    } catch (_) {}
    await new Promise(r => setTimeout(r, 50));
  }
  return false;
}

describe('Milestone 5 Challenger 1: Comprehensive E2E Adversarial Pass', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient();
    await cdp.start();
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  // =========================================================================
  // MODULE 1: EXTREME VIEWPORT AUDIT (320px -> 3840px)
  // =========================================================================
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      it(`M1.Overflow [${route.name}] at ${vp.label}: 0px overflow in unscrolled & scrolled states`, async () => {
        await cdp.setViewport(vp.width, vp.height, vp.isMobile);
        await cdp.navigate(route.url);

        // 1. Unscrolled (Top Bar)
        await cdp.scrollTo(0);
        let auditUnscrolled = await checkHorizontalOverflow(cdp);
        if (auditUnscrolled.hasOverflow) {
          console.error(`OVERFLOW DETECTED: [${route.name}] @ ${vp.width}px unscrolled:`, auditUnscrolled.overflowing);
        }
        expect(auditUnscrolled.scrollWidth).toBeLessThanOrEqual(vp.width);
        expect(auditUnscrolled.hasOverflow).toBe(false);

        // 2. Scrolled state (Dock activated)
        await cdp.scrollTo(600);
        let auditScrolled = await checkHorizontalOverflow(cdp);
        if (auditScrolled.hasOverflow) {
          console.error(`OVERFLOW DETECTED: [${route.name}] @ ${vp.width}px scrolled:`, auditScrolled.overflowing);
        }
        expect(auditScrolled.scrollWidth).toBeLessThanOrEqual(vp.width);
        expect(auditScrolled.hasOverflow).toBe(false);

        // Verify zero uncaught JavaScript errors
        expect(cdp.getErrors().length).toBe(0);
      });
    }
  }

  // =========================================================================
  // MODULE 2: RAPID SWITCHER TOGGLING STORM (16x FULL CYCLES / 32 TOGGLES)
  // =========================================================================
  it('M2.1: 16 full alternating cycles (32 switches) cleanly converge without state corruption', async () => {
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();

    const totalCycles = 16; // 16x full cycles = 32 transitions
    for (let cycle = 1; cycle <= totalCycles; cycle++) {
      // Toggle to Grid
      const gridLink = '.variant-switcher-pill a[href*="grid"]';
      await cdp.click(gridLink);
      const okGrid = await waitForNavigation(cdp, 'variant-grid.html', 3000);
      expect(okGrid).toBe(true);

      // Toggle back to Cockpit
      const cockpitLink = '.variant-switcher-pill a[href*="cockpit"]';
      await cdp.click(cockpitLink);
      const okCockpit = await waitForNavigation(cdp, 'variant-cockpit.html', 3000);
      expect(okCockpit).toBe(true);
    }

    // Assert final DOM structure after storm
    const finalState = await cdp.evaluate(() => {
      const pill = document.querySelector('.variant-switcher-pill');
      const activeTab = pill?.querySelector('.variant-tab.active');
      const inactiveTab = pill?.querySelector('.variant-tab:not(.active)');
      const tabs = pill ? [...pill.querySelectorAll('.variant-tab')] : [];
      return {
        pillExists: !!pill,
        tabCount: tabs.length,
        activeText: activeTab?.textContent?.trim(),
        activeAriaCurrent: activeTab?.getAttribute('aria-current'),
        inactiveHref: inactiveTab?.getAttribute('href'),
        navScrolled: document.querySelector('.nav')?.classList.contains('is-scrolled'),
        url: window.location.pathname
      };
    });

    expect(finalState.pillExists).toBe(true);
    expect(finalState.tabCount).toBe(2);
    expect(finalState.url).toContain('variant-cockpit.html');
    expect(finalState.activeText).toContain('Cockpit');
    expect(finalState.activeAriaCurrent).toBe('page');
    expect(finalState.inactiveHref).toContain('variant-grid.html');
    expect(cdp.getErrors().length).toBe(0);
  });

  it('M2.2: Burst clicking inactive switcher tab triggers single clean navigation', async () => {
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();

    // Dispatch 8 synthetic clicks simultaneously
    await cdp.evaluate(() => {
      const gridLink = document.querySelector('.variant-switcher-pill a[href*="grid"]');
      for (let i = 0; i < 8; i++) {
        gridLink?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });

    const arrived = await waitForNavigation(cdp, 'variant-grid.html', 4000);
    expect(arrived).toBe(true);

    const readyState = await cdp.evaluate(() => document.readyState);
    expect(readyState).toBe('complete');
    expect(cdp.getErrors().length).toBe(0);
  });

  // =========================================================================
  // MODULE 3: ACTIVE TAB POINTER-EVENTS INERTNESS & SCROLL PRESERVATION
  // =========================================================================
  it('M3.1: Computed styles enforce pointer-events: none and cursor: default on active tab', async () => {
    for (const [name, url] of [['Cockpit', COCKPIT_URL], ['Grid', GRID_URL]]) {
      await cdp.navigate(url);

      const styles = await cdp.evaluate(() => {
        const active = document.querySelector('.variant-tab.active');
        const inactive = document.querySelector('.variant-tab:not(.active)');
        const actCss = window.getComputedStyle(active);
        const inactCss = window.getComputedStyle(inactive);
        return {
          actPointerEvents: actCss.pointerEvents,
          actCursor: actCss.cursor,
          inactPointerEvents: inactCss.pointerEvents,
          inactCursor: inactCss.cursor
        };
      });

      expect(styles.actPointerEvents).toBe('none');
      expect(styles.actCursor).toBe('default');
      expect(styles.inactPointerEvents).toBe('auto');
    }
  });

  it('M3.2: Physical CDP clicks on active tab in scrolled state do NOT reload page or alter scrollY', async () => {
    for (const [name, url] of [['Cockpit', COCKPIT_URL], ['Grid', GRID_URL]]) {
      await cdp.setViewport(1440, 900, false);
      await cdp.navigate(url);

      // Scroll deep into the document
      await cdp.scrollTo(1850);
      const initialY = await cdp.evaluate(() => window.scrollY);
      expect(initialY).toBeGreaterThanOrEqual(1800);

      // Inject window reload canary
      await cdp.evaluate(() => { window.__CDP_CANARY_TEST_VALUE = 42; });

      // Retrieve screen center coordinates of active tab
      const coords = await cdp.evaluate(() => {
        const tab = document.querySelector('.variant-tab.active');
        if (!tab) return null;
        const rect = tab.getBoundingClientRect();
        return {
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2)
        };
      });
      expect(coords).not.toBeNull();

      // Dispatch physical hardware mouse events at the active tab location
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: coords.x,
        y: coords.y,
        button: 'left',
        clickCount: 1
      });
      await new Promise(r => setTimeout(r, 60));
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: coords.x,
        y: coords.y,
        button: 'left',
        clickCount: 1
      });

      // Wait to ensure no asynchronous reload or scroll animation was queued
      await new Promise(r => setTimeout(r, 500));

      // Canary MUST survive (verifies zero document reload occurred)
      const canarySurvived = await cdp.evaluate(() => window.__CDP_CANARY_TEST_VALUE === 42);
      expect(canarySurvived).toBe(true);

      // Scroll position MUST be preserved within strict tolerance (±3px)
      const currentY = await cdp.evaluate(() => window.scrollY);
      expect(Math.abs(currentY - initialY)).toBeLessThanOrEqual(3);

      // Zero unhandled errors
      expect(cdp.getErrors().length).toBe(0);
    }
  });

  // =========================================================================
  // MODULE 4: DEEP LINK NAVIGATION & HASH ANCHORS
  // =========================================================================
  const SECTIONS = ['ecosystem', 'tasks', 'translate', 'vocabulary', 'price'];

  it('M4.1: Direct deep link visits navigate and scroll to corresponding target sections', async () => {
    await cdp.setViewport(1440, 900, false);

    for (const sec of SECTIONS) {
      const targetUrl = `${COCKPIT_URL}#${sec}`;
      await cdp.navigate(targetUrl);
      await new Promise(r => setTimeout(r, 400));

      const scrollData = await cdp.evaluate((sectionId) => {
        const el = document.getElementById(sectionId);
        if (!el) return { found: false };
        const rect = el.getBoundingClientRect();
        return {
          found: true,
          scrollY: window.scrollY,
          top: rect.top,
          bottom: rect.bottom
        };
      }, sec);

      expect(scrollData.found).toBe(true);
      expect(scrollData.scrollY).toBeGreaterThan(0);
      // Target element should be visible in viewport
      expect(scrollData.top).toBeLessThan(900);
    }
  });

  it('M4.2: Clicking in-page TOC anchor links smoothly scrolls target into view', async () => {
    await cdp.navigate(GRID_URL);
    await cdp.scrollTo(0);

    // Click #tasks TOC link
    await cdp.click('.nav-toc a[href="#tasks"]');
    await new Promise(r => setTimeout(r, 600));

    const tasksScroll = await cdp.evaluate(() => {
      const el = document.getElementById('tasks');
      const r = el?.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        top: r ? r.top : -999
      };
    });

    expect(tasksScroll.scrollY).toBeGreaterThan(300);
    expect(tasksScroll.top).toBeLessThan(400);
  });

  it('M4.3: Direct deep link visit preserves active bilingual language from localStorage', async () => {
    // Set Spanish in storage
    await cdp.navigate(ROOT_URL);
    await cdp.selectOption('#footer-lang-select', 'es');
    expect(await cdp.evaluate(() => localStorage.getItem('any-site-language'))).toBe('es');

    // Direct bookmark visit to Cockpit with #price deep link
    await cdp.navigate(`${COCKPIT_URL}#price`);
    await new Promise(r => setTimeout(r, 500));

    const state = await cdp.evaluate(() => ({
      htmlLang: document.documentElement.lang,
      stored: localStorage.getItem('any-site-language'),
      footerSelect: document.querySelector('#footer-lang-select')?.value,
      scrollY: window.scrollY,
      priceFound: !!document.getElementById('price')
    }));

    expect(state.htmlLang).toBe('es');
    expect(state.stored).toBe('es');
    expect(state.footerSelect).toBe('es');
    expect(state.priceFound).toBe(true);
    expect(state.scrollY).toBeGreaterThan(500);
    expect(cdp.getErrors().length).toBe(0);
  });
});

if (require.main === module) {
  const { run } = require('./harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

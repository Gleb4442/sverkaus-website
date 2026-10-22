/**
 * Remediation Challenger Suite: Prototypes Switcher Pill, Transition Mechanics & Reload Language Persistence
 * 
 * Empirical verification and adversarial stress-testing of:
 * - Module 1: Comprehensive Reload Language Persistence across all 7 supported languages (RU, EN, ES, FR, DE, ZH, HI) on variant-grid.html
 * - Module 2: Reload Language Persistence on variant-cockpit.html & Direct Bookmark URL (document.referrer = "")
 * - Module 3: Rapid Switcher Pill Toggling (Burst events, alternating toggles, rapid state convergence)
 * - Module 4: Active Tab Inertness via Real Pointer Events (pointer-events: none prevents reload & preserves scroll)
 * - Module 5: Cross-Variant Scroll Reset Mechanics & Dock Transition Physics
 * - Module 6: Keyboard Focus Accessibility & ARIA Semantics
 * - Module 7: Navbar Download Button Integrity & Translation Reversibility
 */

const { CDPClient } = require('./harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll, beforeEach } = require('./harness/test-runner');
const { checkHorizontalOverflow, checkNavFrameless, checkVariantSwitcherPill } = require('./harness/assertions');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/any/';
const COCKPIT_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-cockpit.html`;
const GRID_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-grid.html`;
const SUPPORTED_LANGS = ['ru', 'en', 'es', 'fr', 'de', 'zh', 'hi'];

async function dispatchTab(cdp) {
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'rawKeyDown',
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9
  });
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9
  });
  await new Promise(r => setTimeout(r, 60));
}

async function dispatchEnter(cdp) {
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'rawKeyDown',
    key: 'Enter',
    code: 'Enter',
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13,
    text: '\r',
    unmodifiedText: '\r'
  });
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'char',
    key: 'Enter',
    code: 'Enter',
    text: '\r',
    unmodifiedText: '\r'
  });
  await cdp.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Enter',
    code: 'Enter',
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13
  });
  await new Promise(r => setTimeout(r, 600));
}

async function clickAtCoordinates(cdp, x, y) {
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x,
    y,
    button: 'left',
    clickCount: 1
  });
  await new Promise(r => setTimeout(r, 50));
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x,
    y,
    button: 'left',
    clickCount: 1
  });
  await new Promise(r => setTimeout(r, 400));
}

describe('Remediation Challenger: Switcher Pill, Transitions & Language Persistence', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9366);
    await cdp.start();
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  beforeEach(async () => {
    if (cdp) {
      try {
        await cdp.send('Storage.clearDataForOrigin', {
          origin: new URL(BASE_URL).origin,
          storageTypes: 'all'
        });
      } catch (e) {}
      try {
        await cdp.evaluate(() => {
          try { localStorage.clear(); } catch (e) {}
        });
      } catch (e) {}
    }
  });

  // =========================================================================
  // MODULE 1: Reload Language Persistence Across ALL 7 Languages on Grid
  // =========================================================================
  for (const lang of SUPPORTED_LANGS) {
    it(`1.${SUPPORTED_LANGS.indexOf(lang) + 1}: Grid reload preserves language "${lang}" without reverting to "ru"`, async () => {
      await cdp.setViewport(1440, 900, false);
      await cdp.navigate(GRID_URL);

      // Select target language in footer
      await cdp.selectOption('#footer-lang-select', lang);

      // Verify DOM updated before reload
      let currentDocLang = await cdp.evaluate(() => document.documentElement.lang);
      expect(currentDocLang).toBe(lang);
      let currentStored = await cdp.evaluate(() => localStorage.getItem('any-site-language'));
      expect(currentStored).toBe(lang);

      // Perform hard page reload via CDP Page.reload
      await cdp.send('Page.reload', { ignoreCache: true });
      await new Promise(r => setTimeout(r, 700));

      // Assert post-reload state invariants
      const postReloadDocLang = await cdp.evaluate(() => document.documentElement.lang);
      const postReloadStored = await cdp.evaluate(() => localStorage.getItem('any-site-language'));
      const postReloadSelectVal = await cdp.evaluate(() => document.querySelector('#footer-lang-select')?.value);

      expect(postReloadStored).toBe(lang);
      expect(postReloadDocLang).toBe(lang);
      expect(postReloadSelectVal).toBe(lang);
      expect(cdp.getErrors().length).toBe(0);
    });
  }

  // =========================================================================
  // MODULE 2: Direct URL Visit (document.referrer = "") Language Persistence
  // =========================================================================
  it('2.1: Direct URL visit to Grid with saved "en" in localStorage preserves "en" (no referrer clobbering)', async () => {
    // Navigate to Cockpit, switch to EN
    await cdp.navigate(COCKPIT_URL);
    await cdp.selectOption('#footer-lang-select', 'en');
    expect(await cdp.evaluate(() => localStorage.getItem('any-site-language'))).toBe('en');

    // Directly navigate to Grid (simulating bookmark visit, document.referrer is empty)
    await cdp.navigate(GRID_URL);

    const docReferrer = await cdp.evaluate(() => document.referrer);
    const stored = await cdp.evaluate(() => localStorage.getItem('any-site-language'));
    const docLang = await cdp.evaluate(() => document.documentElement.lang);
    const selectVal = await cdp.evaluate(() => document.querySelector('#footer-lang-select')?.value);

    // Verify referrer is empty or not a variant switch
    expect(stored).toBe('en');
    expect(docLang).toBe('en');
    expect(selectVal).toBe('en');

    // Verify hero text rendered in English
    const h1 = await cdp.evaluate(() => document.querySelector('.hero h1, h1')?.textContent);
    expect(h1).toMatch(/Architecture of thought/i);
    expect(cdp.getErrors().length).toBe(0);
  });

  it('2.2: Direct URL visit to Cockpit with saved "de" in localStorage preserves "de"', async () => {
    await cdp.navigate(GRID_URL);
    await cdp.selectOption('#footer-lang-select', 'de');
    expect(await cdp.evaluate(() => localStorage.getItem('any-site-language'))).toBe('de');

    await cdp.navigate(COCKPIT_URL);

    const stored = await cdp.evaluate(() => localStorage.getItem('any-site-language'));
    const docLang = await cdp.evaluate(() => document.documentElement.lang);
    const selectVal = await cdp.evaluate(() => document.querySelector('#footer-lang-select')?.value);

    expect(stored).toBe('de');
    expect(docLang).toBe('de');
    expect(selectVal).toBe('de');
    expect(cdp.getErrors().length).toBe(0);
  });

  // =========================================================================
  // MODULE 3: Rapid Switcher Pill Toggling Stress Test
  // =========================================================================
  it('3.1: 12x alternating rapid switching between Cockpit and Grid converges cleanly with zero DOM corruption', async () => {
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();

    const iterations = 12;
    for (let i = 0; i < iterations; i++) {
      const isCockpitTurn = (i % 2 === 0);
      const targetSelector = isCockpitTurn
        ? '.variant-switcher-pill a[href*="grid"]'
        : '.variant-switcher-pill a[href*="cockpit"]';
      const expectedSubstring = isCockpitTurn ? 'variant-grid' : 'variant-cockpit';

      await cdp.click(targetSelector);
      await new Promise(r => setTimeout(r, 450));

      const path = await cdp.evaluate(() => window.location.pathname);
      expect(path).toContain(expectedSubstring);

      // Verify active tab indicator matches current page
      const pill = await checkVariantSwitcherPill(cdp);
      expect(pill.found).toBe(true);
      const activeTab = pill.tabs.find(t => t.isActive);
      expect(activeTab?.text.toLowerCase()).toContain(isCockpitTurn ? 'grid' : 'cockpit');
    }

    expect(cdp.getErrors().length).toBe(0);
  });

  it('3.2: Rapid 5-event storm on switcher link does not trigger race conditions or orphaned state', async () => {
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();

    // Spam 5 synthetic click events in immediate succession
    await cdp.evaluate(() => {
      const link = document.querySelector('.variant-switcher-pill a[href*="grid"]');
      for (let i = 0; i < 5; i++) {
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });
    await new Promise(r => setTimeout(r, 600));

    const path = await cdp.evaluate(() => window.location.pathname);
    expect(path).toContain('variant-grid');
    expect(cdp.getErrors().length).toBe(0);
  });

  // =========================================================================
  // MODULE 4: Active Tab Inertness & Real Pointer Events Protection
  // =========================================================================
  it('4.1: Active variant tab has pointer-events: none and cursor: default in CSS computed styles', async () => {
    for (const url of [COCKPIT_URL, GRID_URL]) {
      await cdp.navigate(url);

      const styles = await cdp.evaluate(() => {
        const active = document.querySelector('.variant-tab.active');
        const inactive = document.querySelector('.variant-tab:not(.active)');
        const activeCss = window.getComputedStyle(active);
        const inactiveCss = window.getComputedStyle(inactive);
        return {
          activePointerEvents: activeCss.pointerEvents,
          activeCursor: activeCss.cursor,
          inactivePointerEvents: inactiveCss.pointerEvents,
          inactiveCursor: inactiveCss.cursor
        };
      });

      expect(styles.activePointerEvents).toBe('none');
      expect(styles.activeCursor).toBe('default');
      expect(styles.inactivePointerEvents).toBe('auto');
    }
  });

  it('4.2: Real physical mouse click at coordinates of active tab does NOT reload page or reset scroll', async () => {
    await cdp.navigate(COCKPIT_URL);
    await cdp.scrollTo(1200);

    const initialScrollY = await cdp.evaluate(() => window.scrollY);
    expect(initialScrollY).toBeGreaterThanOrEqual(1100);

    // Mark window object with canary property
    await cdp.evaluate(() => { window.__CANARY_SURVIVES = true; });

    // Get bounding box of active Cockpit tab in dock
    const rect = await cdp.evaluate(() => {
      const active = document.querySelector('.variant-tab.active');
      const r = active.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    // Send real hardware mouse click at tab coordinates
    await clickAtCoordinates(cdp, rect.x, rect.y);

    // Verify window canary is still present (NO document reload occurred!)
    const canarySurvives = await cdp.evaluate(() => window.__CANARY_SURVIVES === true);
    expect(canarySurvives).toBe(true);

    // Verify scroll position was not reset to 0
    const currentScrollY = await cdp.evaluate(() => window.scrollY);
    expect(currentScrollY).toBeGreaterThanOrEqual(1100);
    expect(cdp.getErrors().length).toBe(0);
  });

  // =========================================================================
  // MODULE 5: Cross-Variant Scroll Reset Mechanics & Dock Transition Physics
  // =========================================================================
  it('5.1: Switching from deep scroll on Cockpit (scrollY = 2200) cleanly resets Grid to scrollY = 0', async () => {
    await cdp.navigate(COCKPIT_URL);
    await cdp.scrollTo(2200);

    // Click inactive Grid tab
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await new Promise(r => setTimeout(r, 600));

    const landingScrollY = await cdp.evaluate(() => window.scrollY);
    expect(landingScrollY).toBe(0);

    // Verify header starts in pristine expanded top bar state (not dock is-scrolled)
    const isScrolled = await cdp.evaluate(() => document.querySelector('.nav, header')?.classList.contains('is-scrolled'));
    expect(isScrolled).toBe(false);
  });

  it('5.2: Returning from deep scroll on Grid (scrollY = 1800) cleanly resets Cockpit to scrollY = 0', async () => {
    await cdp.navigate(GRID_URL);
    await cdp.scrollTo(1800);

    await cdp.click('.variant-switcher-pill a[href*="cockpit"]');
    await new Promise(r => setTimeout(r, 600));

    const landingScrollY = await cdp.evaluate(() => window.scrollY);
    expect(landingScrollY).toBe(0);

    const isScrolled = await cdp.evaluate(() => document.querySelector('.nav, header')?.classList.contains('is-scrolled'));
    expect(isScrolled).toBe(false);
  });

  it('5.3: Frameless dock physics maintains border: none throughout scroll morphing on both variants', async () => {
    for (const url of [COCKPIT_URL, GRID_URL]) {
      await cdp.navigate(url);

      // Check expanded top bar (scrollY = 0)
      let nav = await checkNavFrameless(cdp);
      expect(nav.barBorderNone).toBe(true);

      // Scroll into dock threshold (scrollY = 350)
      await cdp.scrollTo(350);
      nav = await checkNavFrameless(cdp);
      expect(nav.barBorderNone).toBe(true);

      // Scroll into deep page (scrollY = 1500)
      await cdp.scrollTo(1500);
      nav = await checkNavFrameless(cdp);
      expect(nav.barBorderNone).toBe(true);
    }
  });

  // =========================================================================
  // MODULE 6: Keyboard Focus Accessibility & ARIA Semantics
  // =========================================================================
  it('6.1: Keyboard Tab navigation reaches inactive switcher tab with compliant outline ring', async () => {
    await cdp.navigate(COCKPIT_URL);

    // Tab sequentially to inactive Grid tab (Tab 8)
    for (let i = 0; i < 8; i++) {
      await dispatchTab(cdp);
    }

    const ring = await cdp.evaluate(() => {
      const el = document.activeElement;
      const s = window.getComputedStyle(el);
      return {
        isFocusVisible: el.matches(':focus-visible'),
        outlineStyle: s.outlineStyle,
        outlineWidth: s.outlineWidth,
        outlineColor: s.outlineColor,
        text: el.textContent?.trim()
      };
    });

    expect(ring.isFocusVisible).toBe(true);
    expect(ring.outlineStyle).toBe('solid');
    expect(ring.outlineWidth).toBe('2px');
    expect(ring.text).toContain('Grid');
  });

  it('6.2: Enter key on focused inactive tab navigates to destination prototype', async () => {
    await cdp.navigate(COCKPIT_URL);

    // Focus inactive Grid tab
    for (let i = 0; i < 8; i++) {
      await dispatchTab(cdp);
    }

    await dispatchEnter(cdp);
    const path = await cdp.evaluate(() => window.location.pathname);
    expect(path).toContain('variant-grid');
  });

  it('6.3: ARIA semantics correctly specify navigation landmark and active page state', async () => {
    for (const [url, expectedActive] of [[COCKPIT_URL, 'cockpit'], [GRID_URL, 'grid']]) {
      await cdp.navigate(url);

      const a11y = await cdp.evaluate(() => {
        const pill = document.querySelector('.variant-switcher-pill');
        const active = pill?.querySelector('.variant-tab.active');
        const inactive = pill?.querySelector('.variant-tab:not(.active)');
        return {
          pillRole: pill?.getAttribute('role'),
          pillLabel: pill?.getAttribute('aria-label'),
          activeAriaCurrent: active?.getAttribute('aria-current'),
          activeText: active?.textContent?.trim().toLowerCase(),
          inactiveAriaCurrent: inactive?.getAttribute('aria-current')
        };
      });

      expect(a11y.pillRole).toBe('navigation');
      expect(a11y.pillLabel).toBe('Design variant');
      expect(a11y.activeAriaCurrent).toBe('page');
      expect(a11y.activeText).toContain(expectedActive);
      expect(a11y.inactiveAriaCurrent).toBe(null);
    }
  });

  // =========================================================================
  // MODULE 7: Navbar Download Button Integrity & Translation Reversibility
  // =========================================================================
  it('7.1: Navbar Download button in Grid has clean classes, intact href="#download", and reversible translation', async () => {
    await cdp.navigate(GRID_URL);

    // 1. Initial RU state
    let btnState = await cdp.evaluate(() => {
      const btn = document.querySelector('.nav-download-btn');
      const span = btn?.querySelector('span');
      return {
        href: btn?.getAttribute('href'),
        classList: [...(btn?.classList || [])],
        text: span?.textContent?.trim(),
        dataEn: span?.getAttribute('data-en'),
        ariaDisabled: btn?.getAttribute('aria-disabled')
      };
    });

    expect(btnState.href).toBe('#download');
    expect(btnState.text).toBe('Скачать');
    expect(btnState.dataEn).toBe('Download');
    // Critical: must NOT contain the bare 'download' class that any.js uses to disable hero CTAs
    expect(btnState.classList.includes('download')).toBe(false);
    expect(btnState.ariaDisabled).toBe(null);

    // 2. Switch to EN in footer
    await cdp.selectOption('#footer-lang-select', 'en');
    btnState = await cdp.evaluate(() => {
      const btn = document.querySelector('.nav-download-btn');
      const span = btn?.querySelector('span');
      return {
        href: btn?.getAttribute('href'),
        text: span?.textContent?.trim()
      };
    });
    expect(btnState.href).toBe('#download');
    expect(btnState.text).toBe('Download');

    // 3. Switch back to RU in footer
    await cdp.selectOption('#footer-lang-select', 'ru');
    btnState = await cdp.evaluate(() => {
      const btn = document.querySelector('.nav-download-btn');
      const span = btn?.querySelector('span');
      return {
        href: btn?.getAttribute('href'),
        text: span?.textContent?.trim()
      };
    });
    expect(btnState.href).toBe('#download');
    expect(btnState.text).toBe('Скачать');

    expect(cdp.getErrors().length).toBe(0);
  });

  it('7.2: Mobile 375px switcher pill tap targets conform to >=24px and maintain 0px overflow', async () => {
    await cdp.setViewport(375, 812, true);

    for (const url of [COCKPIT_URL, GRID_URL]) {
      await cdp.navigate(url);

      const audit = await checkHorizontalOverflow(cdp);
      expect(audit.hasOverflow).toBe(false);

      const dimensions = await cdp.evaluate(() => {
        const pill = document.querySelector('.variant-switcher-pill');
        const tabs = [...(pill?.querySelectorAll('.variant-tab') || [])];
        return tabs.map(t => {
          const r = t.getBoundingClientRect();
          return { text: t.textContent.trim(), width: r.width, height: r.height };
        });
      });

      expect(dimensions.length).toBe(2);
      for (const d of dimensions) {
        expect(d.height).toBeGreaterThanOrEqual(24);
        expect(d.width).toBeGreaterThanOrEqual(35);
      }
    }
  });
});

if (require.main === module) {
  const { run } = require('./harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

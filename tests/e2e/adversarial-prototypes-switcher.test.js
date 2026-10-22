/**
 * Adversarial Switcher & Prototype Transition Challenge Suite
 * 
 * Comprehensive empirical stress harness covering:
 * - Section 1: Rapid back-and-forth toggling between Cockpit and Grid via CDP click events
 * - Section 2: Scroll position behavior (clean reset to 0) during prototype switching
 * - Section 3: Keyboard navigation (Tab focus ring, Enter activation, ARIA semantics)
 * - Section 4: Simulated slow network conditions (Slow 3G throttling & spam clicks)
 * - Section 5: State invariants & language persistence across prototype transitions
 */

const { CDPClient } = require('./harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('./harness/test-runner');
const { checkHorizontalOverflow, checkVariantSwitcherPill } = require('./harness/assertions');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/any/';
const COCKPIT_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-cockpit.html`;
const GRID_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-grid.html`;

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

async function setNetworkThrottling(cdp, profile) {
  await cdp.send('Network.enable');
  if (profile === 'slow3g') {
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 400,
      downloadThroughput: 50 * 1024,
      uploadThroughput: 50 * 1024,
      connectionType: 'cellular3g'
    });
  } else if (profile === 'none') {
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
      connectionType: 'none'
    });
  }
}

describe('Adversarial Prototypes & Switcher Challenge', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9385);
    await cdp.start();
  });

  afterAll(async () => {
    if (cdp) {
      await setNetworkThrottling(cdp, 'none');
      await cdp.stop();
    }
  });

  // =========================================================================
  // SECTION 1: Rapid Back-and-Forth Toggling
  // =========================================================================
  it('1.1: 10x alternating rapid toggling between Cockpit and Grid via CDP click events', async () => {
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();

    const iterations = 10;
    for (let i = 0; i < iterations; i++) {
      const isCockpitTurn = (i % 2 === 0);
      const targetSelector = isCockpitTurn
        ? '.variant-switcher-pill a[href*="grid"]'
        : '.variant-switcher-pill a[href*="cockpit"]';
      const expectedSubstring = isCockpitTurn ? 'variant-grid' : 'variant-cockpit';

      await cdp.click(targetSelector);
      await new Promise(r => setTimeout(r, 500));

      const currentPath = await cdp.evaluate(() => window.location.pathname);
      expect(currentPath).toContain(expectedSubstring);
    }

    const errors = cdp.getErrors();
    expect(errors.length).toBe(0);
  });

  it('1.2: Rapid 5x burst clicks on inactive tab handles event storm without crashing or uncaught errors', async () => {
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();

    // Trigger 5 rapid clicks on Grid link without waiting between clicks
    await cdp.evaluate(() => {
      const target = document.querySelector('.variant-switcher-pill a[href*="grid"]');
      for (let i = 0; i < 5; i++) {
        target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });
    await new Promise(r => setTimeout(r, 600));

    const path = await cdp.evaluate(() => window.location.pathname);
    expect(path).toContain('variant-grid');
    expect(cdp.getErrors().length).toBe(0);
  });

  it('1.3: Clicking currently active tab triggers full document reload and resets scroll', async () => {
    await cdp.navigate(COCKPIT_URL);
    await cdp.scrollTo(1200);
    cdp.clearErrors();

    // Active tab has href="variant-cockpit.html" and lacks pointer-events:none or preventDefault
    await cdp.click('.variant-switcher-pill a.active');
    await new Promise(r => setTimeout(r, 600));

    const afterScrollY = await cdp.evaluate(() => window.scrollY);
    // Verified behavior: active tab click reloads document and resets scroll to 0
    expect(afterScrollY).toBe(0);
    expect(cdp.getErrors().length).toBe(0);
  });

  it('1.4: Rapid toggling while in scrolled dock state maintains active dock and correct tab indicator', async () => {
    await cdp.navigate(COCKPIT_URL);
    await cdp.scrollTo(600);

    // Switch to Grid
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await new Promise(r => setTimeout(r, 500));

    let pill = await checkVariantSwitcherPill(cdp);
    let activeTab = pill.tabs.find(t => t.isActive);
    expect(activeTab?.text.toLowerCase()).toContain('grid');

    // Switch back to Cockpit
    await cdp.click('.variant-switcher-pill a[href*="cockpit"]');
    await new Promise(r => setTimeout(r, 500));

    pill = await checkVariantSwitcherPill(cdp);
    activeTab = pill.tabs.find(t => t.isActive);
    expect(activeTab?.text.toLowerCase()).toContain('cockpit');
    expect(cdp.getErrors().length).toBe(0);
  });

  // =========================================================================
  // SECTION 2: Scroll Position Behavior (Preservation vs Clean Reset)
  // =========================================================================
  it('2.1: Prototype transition from top fold (scrollY = 0) renders destination variant at scrollY = 0', async () => {
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(COCKPIT_URL);
    await cdp.scrollTo(0);

    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await new Promise(r => setTimeout(r, 500));

    const scrollY = await cdp.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);

    // Verify destination header is in clean expanded state (not is-scrolled)
    const isScrolled = await cdp.evaluate(() => document.querySelector('.nav, header')?.classList.contains('is-scrolled'));
    expect(isScrolled).toBe(false);
  });

  it('2.2: Switching from deep scroll position cleanly resets to top (scrollY = 0) without stuck dock', async () => {
    await cdp.navigate(COCKPIT_URL);
    await cdp.scrollTo(2500);

    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await new Promise(r => setTimeout(r, 600));

    const landingScrollY = await cdp.evaluate(() => window.scrollY);
    expect(landingScrollY).toBe(0);

    const isScrolled = await cdp.evaluate(() => document.querySelector('.nav, header')?.classList.contains('is-scrolled'));
    expect(isScrolled).toBe(false);
  });

  it('2.3: Returning from deep scroll on Grid back to Cockpit cleanly resets to top (scrollY = 0)', async () => {
    await cdp.navigate(GRID_URL);
    await cdp.scrollTo(1800);

    await cdp.click('.variant-switcher-pill a[href*="cockpit"]');
    await new Promise(r => setTimeout(r, 600));

    const landingScrollY = await cdp.evaluate(() => window.scrollY);
    expect(landingScrollY).toBe(0);

    const isScrolled = await cdp.evaluate(() => document.querySelector('.nav, header')?.classList.contains('is-scrolled'));
    expect(isScrolled).toBe(false);
  });

  // =========================================================================
  // SECTION 3: Keyboard Navigation & Focus Accessibility
  // =========================================================================
  it('3.1: Sequential Tab key navigation successfully traverses to switcher pill tabs', async () => {
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(COCKPIT_URL);

    // Tab 1 to 7 lands on active Cockpit tab; Tab 8 lands on Grid tab
    for (let i = 0; i < 7; i++) {
      await dispatchTab(cdp);
    }
    const tab7 = await cdp.evaluate(() => document.activeElement?.className || '');
    expect(tab7).toContain('variant-tab');

    await dispatchTab(cdp);
    const tab8 = await cdp.evaluate(() => document.activeElement?.className || '');
    expect(tab8).toContain('variant-tab');
  });

  it('3.2: Keyboard focus ring (:focus-visible) matches theme horizon token on Cockpit (#ff9f43)', async () => {
    await cdp.navigate(COCKPIT_URL);

    // Tab to inactive Grid tab (Tab 8)
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
        outlineOffset: s.outlineOffset
      };
    });

    expect(ring.isFocusVisible).toBe(true);
    expect(ring.outlineStyle).toBe('solid');
    expect(ring.outlineWidth).toBe('2px');
    expect(ring.outlineColor).toBe('rgb(255, 159, 67)');
    expect(ring.outlineOffset).toBe('2px');
  });

  it('3.3: Keyboard focus ring (:focus-visible) matches theme horizon token on Grid (#c084fc)', async () => {
    await cdp.navigate(GRID_URL);

    // Tab to inactive Cockpit tab (Tab 7)
    for (let i = 0; i < 7; i++) {
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
        outlineOffset: s.outlineOffset
      };
    });

    expect(ring.isFocusVisible).toBe(true);
    expect(ring.outlineStyle).toBe('solid');
    expect(ring.outlineWidth).toBe('2px');
    expect(ring.outlineColor).toBe('rgb(192, 132, 252)');
    expect(ring.outlineOffset).toBe('2px');
  });

  it('3.4: Focused inactive tab navigates to destination prototype upon Enter keypress', async () => {
    await cdp.navigate(COCKPIT_URL);

    // Focus inactive Grid tab
    for (let i = 0; i < 8; i++) {
      await dispatchTab(cdp);
    }
    expect(await cdp.evaluate(() => document.activeElement?.textContent?.trim())).toContain('Grid');

    // Activate with Enter key
    await dispatchEnter(cdp);

    const path = await cdp.evaluate(() => window.location.pathname);
    expect(path).toContain('variant-grid');
  });

  it('3.5: Accessibility attributes conforming to ARIA navigation patterns', async () => {
    await cdp.navigate(COCKPIT_URL);
    const a11y = await cdp.evaluate(() => {
      const pill = document.querySelector('.variant-switcher-pill');
      const activeTab = pill?.querySelector('.variant-tab.active');
      const inactiveTab = pill?.querySelector('.variant-tab:not(.active)');
      return {
        pillRole: pill?.getAttribute('role'),
        pillAriaLabel: pill?.getAttribute('aria-label'),
        activeAriaCurrent: activeTab?.getAttribute('aria-current'),
        inactiveAriaCurrent: inactiveTab?.getAttribute('aria-current')
      };
    });

    expect(a11y.pillRole).toBe('navigation');
    expect(a11y.pillAriaLabel).toBe('Design variant');
    expect(a11y.activeAriaCurrent).toBe('page');
    expect(a11y.inactiveAriaCurrent).toBe(null);
  });

  // =========================================================================
  // SECTION 4: Simulated Slow Network Conditions (Slow 3G)
  // =========================================================================
  it('4.1: Prototype transitions cleanly under Slow 3G throttling (400ms latency, 50KB/s)', async () => {
    await cdp.navigate(COCKPIT_URL);
    await setNetworkThrottling(cdp, 'slow3g');
    cdp.clearErrors();

    await cdp.click('.variant-switcher-pill a[href*="grid"]');

    // Poll until DOM is interactive / loaded under Slow 3G
    let transitioned = false;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 200));
      const p = await cdp.evaluate(() => window.location.pathname);
      if (p.includes('variant-grid')) {
        transitioned = true;
        break;
      }
    }

    expect(transitioned).toBe(true);
    expect(cdp.getErrors().length).toBe(0);

    // Disable throttling immediately to avoid test cross-contamination
    await setNetworkThrottling(cdp, 'none');
  });

  // =========================================================================
  // SECTION 5: State Invariants & Language Clobbering Vulnerability
  // =========================================================================
  it('5.1: Switching from Cockpit to Grid preserves language when referred from variant-cockpit.html', async () => {
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(COCKPIT_URL);

    // Select German (de)
    await cdp.selectOption('#footer-lang-select', 'de');
    expect(await cdp.evaluate(() => document.documentElement.lang)).toBe('de');

    // Click Grid switcher
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await new Promise(r => setTimeout(r, 600));

    const gridLang = await cdp.evaluate(() => document.documentElement.lang);
    expect(gridLang).toBe('de');

    const footerVal = await cdp.evaluate(() => document.querySelector('#footer-lang-select')?.value);
    expect(footerVal).toBe('de');
  });

  it('5.2: BUG VERIFICATION: variant-grid.html lines 20-25 clobbers saved language to "ru" on direct URL visit or reload', async () => {
    // Set English language on site
    await cdp.navigate(COCKPIT_URL);
    await cdp.selectOption('#footer-lang-select', 'en');
    expect(await cdp.evaluate(() => localStorage.getItem('any-site-language'))).toBe('en');

    // Reload / Direct visit to variant-grid.html (where document.referrer does not include 'variant-')
    await cdp.navigate(GRID_URL);

    const storedLang = await cdp.evaluate(() => localStorage.getItem('any-site-language'));
    const docLang = await cdp.evaluate(() => document.documentElement.lang);

    console.log(`[BUG DETECTED] variant-grid.html reset saved language from 'en' to '${storedLang}', html.lang='${docLang}'`);

    // We empirically prove that variant-grid.html overwrote 'en' with 'ru':
    // If the bug exists, storedLang is 'ru' (overwritten by lines 20-25).
    // An ideal implementation would preserve 'en'.
    const isBugPresent = (storedLang === 'ru');
    expect(isBugPresent).toBe(true);
  });

  it('5.3: Mobile 375px switcher pill tap target size and 0px horizontal overflow', async () => {
    await cdp.setViewport(375, 812, true);
    await cdp.navigate(COCKPIT_URL);

    let audit = await checkHorizontalOverflow(cdp);
    expect(audit.hasOverflow).toBe(false);

    // Inspect mobile pill dimensions
    const pillBox = await cdp.evaluate(() => {
      const pill = document.querySelector('.variant-switcher-pill');
      const cockpitTab = pill?.querySelector('a[href*="cockpit"]');
      const gridTab = pill?.querySelector('a[href*="grid"]');
      if (!pill || !cockpitTab || !gridTab) return null;
      const cRect = cockpitTab.getBoundingClientRect();
      const gRect = gridTab.getBoundingClientRect();
      return {
        cockpitWidth: cRect.width,
        cockpitHeight: cRect.height,
        gridWidth: gRect.width,
        gridHeight: gRect.height
      };
    });

    expect(pillBox).toBeDefined();
    expect(pillBox.cockpitHeight).toBeGreaterThanOrEqual(24);
    expect(pillBox.gridHeight).toBeGreaterThanOrEqual(24);

    // Switch to Grid on mobile
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await new Promise(r => setTimeout(r, 600));

    audit = await checkHorizontalOverflow(cdp);
    expect(audit.hasOverflow).toBe(false);
  });
});

if (require.main === module) {
  const { run } = require('./harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

/**
 * Iteration 3 Gate Challenge: Empirical Adversarial Verification Suite
 * 
 * Scope:
 * - Module 1: 7-Language Reload Persistence & Direct Bookmark Visits on Both Variants
 * - Module 2: Switcher Pill Rapid Toggling & Burst Click Storm
 * - Module 3: Active Tab Pointer-Events None, Scroll Preservation & Non-Reload
 * - Module 4: Cross-Variant Scroll Reset Mechanics
 * - Module 5: Keyboard Navigation (Tab + Enter) & ARIA Accessibility
 * - Module 6: Responsive Overflow & Dock Transition Physics across Breakpoints
 */

const { CDPClient } = require('./harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('./harness/test-runner');
const { checkHorizontalOverflow, checkNavFrameless, checkVariantSwitcherPill } = require('./harness/assertions');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/any/';
const COCKPIT_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-cockpit.html`;
const GRID_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-grid.html`;
const SUPPORTED_LANGS = ['ru', 'en', 'es', 'fr', 'de', 'zh', 'hi'];

const EXPECTED_TITLES = {
  ru: 'any — голос в челке вашего Mac',
  en: 'any — voice in your Mac’s notch',
  es: 'any — voz en el notch de tu Mac',
  fr: 'any — la voix dans l’encoche de votre Mac',
  de: 'any — Stimme in der Notch Ihres Mac',
  zh: 'any — 隐藏在 Mac 刘海中的声音',
  hi: 'any — आपके Mac के नॉच में आवाज़'
};

async function waitForVariantNav(cdp, expectedVariant, timeoutMs = 4000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const state = await cdp.evaluate(() => {
        const href = window.location.href;
        const activeTab = document.querySelector('.variant-tab.active, .variant-tab[aria-current="page"]');
        return {
          href,
          ready: document.readyState,
          activeText: activeTab ? activeTab.textContent.toLowerCase() : ''
        };
      });
      if (
        state &&
        state.ready === 'complete' &&
        (state.href.includes(`variant-${expectedVariant}.html`) || state.activeText.includes(expectedVariant))
      ) {
        return true;
      }
    } catch (_) {}
    await new Promise(r => setTimeout(r, 60));
  }
  return false;
}

describe('Iteration 3 Gate Challenge: Switcher, Transitions & Language Persistence', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient();
    await cdp.start();
    await cdp.setViewport(1440, 900, false);
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  // ==========================================
  // Module 1: 7-Language Reload Persistence
  // ==========================================
  for (const lang of SUPPORTED_LANGS) {
    it(`M1.Grid.${lang}: variant-grid.html reload preserves language "${lang}"`, async () => {
      await cdp.navigate(GRID_URL);
      await cdp.selectOption('#footer-lang-select', lang);

      // Trigger hard reload via CDP
      await cdp.send('Page.reload');
      await new Promise(r => setTimeout(r, 700));

      const state = await cdp.evaluate(() => ({
        htmlLang: document.documentElement.lang,
        stored: localStorage.getItem('any-site-language'),
        footerVal: document.querySelector('#footer-lang-select')?.value,
        title: document.title
      }));

      expect(state.htmlLang).toBe(lang);
      expect(state.stored).toBe(lang);
      expect(state.footerVal).toBe(lang);
      expect(state.title).toBe(EXPECTED_TITLES[lang]);
    });

    it(`M1.Cockpit.${lang}: variant-cockpit.html reload preserves language "${lang}"`, async () => {
      await cdp.navigate(COCKPIT_URL);
      await cdp.selectOption('#footer-lang-select', lang);

      // Trigger hard reload via CDP
      await cdp.send('Page.reload');
      await new Promise(r => setTimeout(r, 700));

      const state = await cdp.evaluate(() => ({
        htmlLang: document.documentElement.lang,
        stored: localStorage.getItem('any-site-language'),
        footerVal: document.querySelector('#footer-lang-select')?.value,
        title: document.title
      }));

      expect(state.htmlLang).toBe(lang);
      expect(state.stored).toBe(lang);
      expect(state.footerVal).toBe(lang);
      expect(state.title).toBe(EXPECTED_TITLES[lang]);
    });
  }

  it('M1.Bookmark: Direct bookmark URL visit with stored language preserves selection with zero referrer', async () => {
    // Set 'fr' in localStorage
    await cdp.navigate(GRID_URL);
    await cdp.evaluate(() => localStorage.setItem('any-site-language', 'fr'));

    // Navigate to Cockpit directly (simulate direct bookmark visit without referrer)
    await cdp.navigate(COCKPIT_URL);
    const cockpitLang = await cdp.evaluate(() => document.documentElement.lang);
    expect(cockpitLang).toBe('fr');

    // Navigate to Grid directly
    await cdp.navigate(GRID_URL);
    const gridLang = await cdp.evaluate(() => document.documentElement.lang);
    expect(gridLang).toBe('fr');
  });

  // ==========================================
  // Module 2: Rapid Switcher Toggling & Storm
  // ==========================================
  it('M2.1: 16x alternating rapid toggling between Cockpit and Grid converges cleanly', async () => {
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();

    let currentTarget = 'grid';
    for (let i = 0; i < 16; i++) {
      const selector = `.variant-switcher-pill a[href*="${currentTarget}"]`;
      await cdp.click(selector);
      const ok = await waitForVariantNav(cdp, currentTarget, 3000);
      expect(ok).toBe(true);
      currentTarget = currentTarget === 'grid' ? 'cockpit' : 'grid';
    }

    // Verify final state (should be Cockpit)
    const finalState = await cdp.evaluate(() => {
      const active = document.querySelector('.variant-tab.active');
      const pill = document.querySelector('.variant-switcher-pill');
      const tabs = pill ? [...pill.querySelectorAll('.variant-tab')] : [];
      return {
        href: window.location.href,
        activeText: active?.textContent.trim(),
        ariaCurrent: active?.getAttribute('aria-current'),
        tabCount: tabs.length
      };
    });

    expect(finalState.href).toContain('variant-cockpit.html');
    expect(finalState.activeText).toContain('Cockpit');
    expect(finalState.ariaCurrent).toBe('page');
    expect(finalState.tabCount).toBe(2);
    expect(cdp.getErrors().length).toBe(0);
  });

  it('M2.2: Rapid burst clicks on inactive switcher link do not crash browser or corrupt DOM', async () => {
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();

    // Send 5 rapid click events to the Grid link without awaiting full page load between clicks
    await cdp.evaluate(() => {
      const gridLink = document.querySelector('.variant-switcher-pill a[href*="grid"]');
      for (let i = 0; i < 5; i++) {
        if (gridLink) gridLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });

    const ok = await waitForVariantNav(cdp, 'grid', 4000);
    expect(ok).toBe(true);

    const ready = await cdp.evaluate(() => document.readyState);
    expect(ready).toBe('complete');
    expect(cdp.getErrors().length).toBe(0);
  });

  // ==========================================
  // Module 3: Active Tab Pointer-Events None
  // ==========================================
  it('M3.1: Active tab computed styles specify pointer-events: none and cursor: default', async () => {
    for (const pageUrl of [COCKPIT_URL, GRID_URL]) {
      await cdp.navigate(pageUrl);
      const styles = await cdp.evaluate(() => {
        const active = document.querySelector('.variant-tab.active');
        if (!active) return null;
        const cs = window.getComputedStyle(active);
        return {
          pointerEvents: cs.pointerEvents,
          cursor: cs.cursor
        };
      });
      expect(styles.pointerEvents).toBe('none');
      expect(styles.cursor).toBe('default');
    }
  });

  it('M3.2: Physical mouse clicks on active tab do NOT reload page or cause scroll jumps', async () => {
    for (const [name, pageUrl] of [['Cockpit', COCKPIT_URL], ['Grid', GRID_URL]]) {
      await cdp.navigate(pageUrl);
      // Scroll deep into the document
      await cdp.scrollTo(1500);
      const scrolledY = await cdp.evaluate(() => window.scrollY);
      expect(scrolledY).toBeGreaterThan(1000);

      // Find viewport coordinates of the active tab
      const coords = await cdp.evaluate(() => {
        const active = document.querySelector('.variant-tab.active');
        if (!active) return null;
        const r = active.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      expect(coords).not.toBeNull();

      // Dispatch physical mouse click at the active tab coordinates
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: coords.x,
        y: coords.y,
        button: 'left',
        clickCount: 1
      });
      await new Promise(r => setTimeout(r, 50));
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: coords.x,
        y: coords.y,
        button: 'left',
        clickCount: 1
      });
      await new Promise(r => setTimeout(r, 400));

      // Check that scroll was preserved and did not jump to top
      const afterScrollY = await cdp.evaluate(() => window.scrollY);
      expect(Math.abs(afterScrollY - scrolledY)).toBeLessThan(10);
    }
  });

  // ==========================================
  // Module 4: Cross-Variant Scroll Reset
  // ==========================================
  it('M4.1: Navigating from deeply scrolled Cockpit resets Grid to scrollY = 0', async () => {
    await cdp.navigate(COCKPIT_URL);
    await cdp.scrollTo(2500);
    const initialY = await cdp.evaluate(() => window.scrollY);
    expect(initialY).toBeGreaterThan(2000);

    // Click Grid tab
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await waitForVariantNav(cdp, 'grid', 3000);

    const gridY = await cdp.evaluate(() => window.scrollY);
    expect(gridY).toBe(0);
  });

  it('M4.2: Navigating from deeply scrolled Grid resets Cockpit to scrollY = 0', async () => {
    await cdp.navigate(GRID_URL);
    await cdp.scrollTo(2200);
    const initialY = await cdp.evaluate(() => window.scrollY);
    expect(initialY).toBeGreaterThan(1800);

    // Click Cockpit tab
    await cdp.click('.variant-switcher-pill a[href*="cockpit"]');
    await waitForVariantNav(cdp, 'cockpit', 3000);

    const cockpitY = await cdp.evaluate(() => window.scrollY);
    expect(cockpitY).toBe(0);
  });

  // ==========================================
  // Module 5: Keyboard Navigation & ARIA
  // ==========================================
  it('M5.1: Inactive tab is focusable with outline and responds to Enter key navigation', async () => {
    await cdp.navigate(COCKPIT_URL);

    // Focus the inactive Grid tab
    const focused = await cdp.evaluate(() => {
      const inactive = document.querySelector('.variant-tab:not(.active)');
      if (!inactive) return false;
      inactive.focus();
      return document.activeElement === inactive;
    });
    expect(focused).toBe(true);

    // Verify focus-visible outline is styled
    const outline = await cdp.evaluate(() => {
      const inactive = document.querySelector('.variant-tab:not(.active)');
      const cs = window.getComputedStyle(inactive);
      return cs.outlineStyle;
    });
    expect(outline).not.toBe('none');

    // Dispatch Enter key to navigate
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
      type: 'keyUp',
      key: 'Enter',
      code: 'Enter',
      windowsVirtualKeyCode: 13,
      nativeVirtualKeyCode: 13
    });

    const ok = await waitForVariantNav(cdp, 'grid', 3000);
    expect(ok).toBe(true);
  });

  it('M5.2: Switcher pill ARIA attributes conform to accessibility specification', async () => {
    for (const pageUrl of [COCKPIT_URL, GRID_URL]) {
      await cdp.navigate(pageUrl);
      const aria = await cdp.evaluate(() => {
        const pill = document.querySelector('.variant-switcher-pill');
        const active = pill?.querySelector('.variant-tab.active');
        const inactive = pill?.querySelector('.variant-tab:not(.active)');
        return {
          pillRole: pill?.getAttribute('role'),
          pillLabel: pill?.getAttribute('aria-label'),
          activeAriaCurrent: active?.getAttribute('aria-current'),
          inactiveAriaCurrent: inactive?.getAttribute('aria-current')
        };
      });

      expect(aria.pillRole).toBe('navigation');
      expect(aria.pillLabel).toBe('Design variant');
      expect(aria.activeAriaCurrent).toBe('page');
      expect(aria.inactiveAriaCurrent).toBeNull();
    }
  });

  // ==========================================
  // Module 6: Viewport Overflow & Dock Physics
  // ==========================================
  it('M6.1: Zero horizontal layout overflow across 12 granular viewports in unscrolled & scrolled states', async () => {
    const viewports = [375, 414, 560, 600, 640, 680, 768, 800, 840, 900, 1024, 1440];
    const pages = [COCKPIT_URL, GRID_URL];

    for (const page of pages) {
      for (const w of viewports) {
        await cdp.setViewport(w, 800, w < 768);
        await cdp.navigate(page);

        // Unscrolled
        let overflow = await checkHorizontalOverflow(cdp);
        expect(overflow.hasOverflow).toBe(false);

        // Scrolled
        await cdp.scrollTo(500);
        overflow = await checkHorizontalOverflow(cdp);
        expect(overflow.hasOverflow).toBe(false);
      }
    }
  });

  it('M6.2: Scrolled dock enforces display: none on download CTA and hides overflow TOC items at <= 680px', async () => {
    await cdp.setViewport(600, 800, true);
    await cdp.navigate(COCKPIT_URL);
    await cdp.scrollTo(400);

    const dockStyles = await cdp.evaluate(() => {
      const downloadBtn = document.querySelector('.nav.is-scrolled .nav-download-btn');
      const translateLink = document.querySelector('.nav.is-scrolled .toc-link[data-section="translate"]');
      const dlStyle = downloadBtn ? window.getComputedStyle(downloadBtn).display : null;
      const trStyle = translateLink ? window.getComputedStyle(translateLink).display : null;
      return { dlStyle, trStyle };
    });

    expect(dockStyles.dlStyle).toBe('none');
    expect(dockStyles.trStyle).toBe('none');
  });
});

if (require.main === module) {
  const { run } = require('./harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

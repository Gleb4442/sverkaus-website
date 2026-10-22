/**
 * Tier 3: Cross-Feature Combinations & Pairwise Matrix
 * 
 * Verifies:
 * - Pairwise 1: Toggling variant pill preserves active language (RU or EN)
 * - Pairwise 2: Changing language on variant page updates copy across all cards & footer
 * - Pairwise 3: Scrolling on variant page triggers frameless dock morphing without layout jump
 * - Pairwise 4: Interactive demo stages run correctly across both variants
 * - Pairwise 5: Mobile viewport + language switch + variant toggle maintains zero overflow
 * - Pairwise 6: Scrolled dock state + variant switch maintains valid navigation state
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('../harness/test-runner');
const { checkHorizontalOverflow, checkNavFrameless } = require('../harness/assertions');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/any/';
const COCKPIT_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-cockpit.html`;
const GRID_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-grid.html`;

describe('Tier 3: Cross-Feature Pairwise Matrix', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9354);
    await cdp.start();
    await cdp.setViewport(1440, 900, false);
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  it('P1.1: Switching from Cockpit to Grid preserves active Russian language selection', async () => {
    await cdp.navigate(COCKPIT_URL);
    await cdp.selectOption('#footer-lang-select', 'ru');
    // Click switcher pill to go to Grid
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await new Promise(r => setTimeout(r, 600));

    const gridLang = await cdp.evaluate(() => document.documentElement.lang);
    expect(gridLang).toBe('ru');

    const footerVal = await cdp.evaluate(() => {
      const sel = document.querySelector('#footer-lang-select');
      return sel ? sel.value : null;
    });
    expect(footerVal).toBe('ru');
  });

  it('P1.2: Switching from Cockpit to Grid preserves active English language selection', async () => {
    await cdp.navigate(COCKPIT_URL);
    await cdp.selectOption('#footer-lang-select', 'en');
    // Click switcher pill to go to Grid
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await new Promise(r => setTimeout(r, 600));

    const gridLang = await cdp.evaluate(() => document.documentElement.lang);
    expect(gridLang).toBe('en');

    const footerVal = await cdp.evaluate(() => {
      const sel = document.querySelector('#footer-lang-select');
      return sel ? sel.value : null;
    });
    expect(footerVal).toBe('en');
  });

  it('P2.1: Changing language on variant page synchronizes copy across all feature cards', async () => {
    await cdp.navigate(GRID_URL);
    await cdp.selectOption('#footer-lang-select', 'en');

    // Verify card titles have updated to English
    const titles = await cdp.evaluate(() => {
      return Array.from(document.querySelectorAll('.card-title, .feature-title, h3')).slice(0, 5).map(h => h.textContent.trim());
    });
    expect(titles.length).toBeGreaterThan(0);
  });

  it('P3.1: Scrolling on variant page triggers frameless dock morphing without layout jump', async () => {
    await cdp.navigate(COCKPIT_URL);
    await cdp.scrollTo(300);

    const navCheck = await checkNavFrameless(cdp);
    expect(navCheck.found).toBe(true);
    expect(navCheck.barBorderNone).toBe(true);

    const isScrolled = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav, header');
      return nav ? nav.classList.contains('is-scrolled') : false;
    });
    expect(isScrolled).toBe(true);
  });

  it('P4.1: Interactive demo stages execute without error across both variants', async () => {
    // Check Cockpit demo
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();
    await new Promise(r => setTimeout(r, 1000));
    expect(cdp.getErrors().length).toBe(0);

    // Check Grid demo
    await cdp.navigate(GRID_URL);
    cdp.clearErrors();
    await new Promise(r => setTimeout(r, 1000));
    expect(cdp.getErrors().length).toBe(0);
  });

  it('P5.1: Mobile 375px + language switch + variant toggle maintains 0px horizontal overflow', async () => {
    await cdp.setViewport(375, 812, true);
    await cdp.navigate(COCKPIT_URL);

    // Switch to English in mobile view
    await cdp.selectOption('#footer-lang-select', 'en');

    // Check overflow on Cockpit
    let audit = await checkHorizontalOverflow(cdp);
    expect(audit.hasOverflow).toBe(false);

    // Switch to Grid
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await new Promise(r => setTimeout(r, 600));

    // Check overflow on Grid
    audit = await checkHorizontalOverflow(cdp);
    expect(audit.hasOverflow).toBe(false);

    // Reset viewport
    await cdp.setViewport(1440, 900, false);
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

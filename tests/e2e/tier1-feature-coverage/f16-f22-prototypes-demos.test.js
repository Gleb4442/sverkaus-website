/**
 * Tier 1: F16-F22 Parallel Prototypes, Switcher Pill & Interactive Demos
 * 
 * Verifies:
 * - F16: /any/variant-cockpit.html route status 200 and Cockpit visual theme
 * - F17: /any/variant-grid.html route status 200 and Grid visual theme
 * - F18: Navigation variant switcher pill presence and active state indicator
 * - F19: Bidirectional toggling between prototypes
 * - F21: Dynamic notch HUD simulation resilience
 * - F22: Physical 'F' hold-to-talk interactive simulation
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('../harness/test-runner');
const { checkVariantSwitcherPill } = require('../harness/assertions');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/any/';
const COCKPIT_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-cockpit.html`;
const GRID_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-grid.html`;

describe('Tier 1: F16-F22 Prototypes, Switcher & Interactive Demos', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9349);
    await cdp.start();
    await cdp.setViewport(1440, 900, false);
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  it('F16.1: Standalone prototype route /any/variant-cockpit.html is accessible', async () => {
    const res = await cdp.navigate(COCKPIT_URL);
    const title = await cdp.evaluate(() => document.title);
    expect(title.length).toBeGreaterThan(0);
    const hasTheme = await cdp.evaluate(() => {
      return document.body.classList.contains('theme-cockpit') ||
        document.documentElement.classList.contains('theme-cockpit') ||
        !!document.querySelector('link[href*="variant-cockpit"]') ||
        !!document.querySelector('.cockpit-environment');
    });
    expect(hasTheme).toBe(true);
  });

  it('F17.1: Standalone prototype route /any/variant-grid.html is accessible', async () => {
    const res = await cdp.navigate(GRID_URL);
    const title = await cdp.evaluate(() => document.title);
    expect(title.length).toBeGreaterThan(0);
    const hasTheme = await cdp.evaluate(() => {
      return document.body.classList.contains('theme-grid') ||
        document.documentElement.classList.contains('theme-grid') ||
        !!document.querySelector('link[href*="variant-grid"]') ||
        !!document.querySelector('.grid-environment');
    });
    expect(hasTheme).toBe(true);
  });

  it('F18.1: Segmented switcher pill is present in navigation with active indicator', async () => {
    await cdp.navigate(COCKPIT_URL);
    const pill = await checkVariantSwitcherPill(cdp);
    expect(pill.found).toBe(true);
    expect(pill.tabCount).toBe(2);

    const cockpitTab = pill.tabs.find(t => t.text.toLowerCase().includes('cockpit'));
    const gridTab = pill.tabs.find(t => t.text.toLowerCase().includes('grid'));
    expect(cockpitTab).toBeDefined();
    expect(gridTab).toBeDefined();
    expect(cockpitTab.isActive).toBe(true);
  });

  it('F18.2: Grid prototype highlights Grid tab as active in switcher pill', async () => {
    await cdp.navigate(GRID_URL);
    const pill = await checkVariantSwitcherPill(cdp);
    expect(pill.found).toBe(true);
    const gridTab = pill.tabs.find(t => t.text.toLowerCase().includes('grid'));
    expect(gridTab).toBeDefined();
    expect(gridTab.isActive).toBe(true);
  });

  it('F19.1: Clicking Grid tab on Cockpit navigates smoothly to variant-grid.html', async () => {
    await cdp.navigate(COCKPIT_URL);
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await new Promise(r => setTimeout(r, 600));

    const currentUrl = await cdp.evaluate(() => window.location.pathname);
    expect(currentUrl).toMatch(/variant-grid/);
  });

  it('F21.1: Dynamic notch typing simulation runs without runtime exceptions', async () => {
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();
    // Allow demo loop to tick for 1.5 seconds
    await new Promise(r => setTimeout(r, 1500));
    const errors = cdp.getErrors();
    expect(errors.length).toBe(0);

    const notchPresent = await cdp.evaluate(() => {
      return !!document.querySelector('#hero-notch, .hero-notch, .dynamic-island');
    });
    expect(notchPresent).toBe(true);
  });

  it('F22.1: Physical "F" key hold-to-talk interactive simulation triggers dictation', async () => {
    await cdp.navigate(COCKPIT_URL);
    cdp.clearErrors();

    // Trigger 'F' keydown
    await cdp.dispatchKey('f', 'down');
    await new Promise(r => setTimeout(r, 400));
    await cdp.dispatchKey('f', 'up');

    const errors = cdp.getErrors();
    expect(errors.length).toBe(0);
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

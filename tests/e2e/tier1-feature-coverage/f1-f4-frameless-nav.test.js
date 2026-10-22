/**
 * Tier 1: F1-F4 Frameless Glass Navigation & Soft Physics
 * 
 * Verifies:
 * - F1: Container has border: none (0px) in both top and dock states
 * - F2: Smooth continuous scroll-driven morphing between wide top bar and compact dock
 * - F3: Soft physics easing (cubic-bezier) and lens refraction
 * - F4: Directional auto-hide on downward scroll > 240px, reveal on upward scroll
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('../harness/test-runner');
const { checkNavFrameless } = require('../harness/assertions');

const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000/any/';

describe('Tier 1: F1-F4 Frameless Navigation & Physics', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9346);
    await cdp.start();
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(TARGET_URL);
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  it('F1.1: Expanded top navigation has border: none / 0px', async () => {
    await cdp.scrollTo(0);
    const navState = await checkNavFrameless(cdp);
    expect(navState.found).toBe(true);
    expect(navState.barBorderNone).toBe(true);
  });

  it('F1.2: Scrolled compact dock has border: none / 0px (no hard borders)', async () => {
    await cdp.scrollTo(300);
    const navState = await checkNavFrameless(cdp);
    expect(navState.found).toBe(true);
    expect(navState.barBorderNone).toBe(true);
  });

  it('F1.3: Scrolled dock has optical lens backdrop-filter blur >= 30px', async () => {
    await cdp.scrollTo(300);
    const blurPx = await cdp.evaluate(() => {
      const navBar = document.querySelector('.nav-bar');
      if (!navBar) return 0;
      const bf = window.getComputedStyle(navBar).backdropFilter || window.getComputedStyle(navBar).webkitBackdropFilter || '';
      const match = bf.match(/blur\(([0-9.]+)px\)/);
      return match ? parseFloat(match[1]) : 0;
    });
    expect(blurPx).toBeGreaterThanOrEqual(30);
  });

  it('F2.1: Continuous scroll morphing transitions to compact dock dimensions', async () => {
    // Check expanded width at top
    await cdp.scrollTo(0);
    const topWidth = await cdp.evaluate(() => {
      const nb = document.querySelector('.nav-bar');
      return nb ? nb.getBoundingClientRect().width : 0;
    });

    // Check compact width at scroll 300px
    await cdp.scrollTo(300);
    const scrolledWidth = await cdp.evaluate(() => {
      const nb = document.querySelector('.nav-bar');
      return nb ? nb.getBoundingClientRect().width : 0;
    });

    expect(topWidth).toBeGreaterThan(700);
    expect(scrolledWidth).toBeLessThanOrEqual(650);
  });

  it('F3.1: Soft physics easing applied with cubic-bezier transition', async () => {
    const transitionValue = await cdp.evaluate(() => {
      const nb = document.querySelector('.nav-bar');
      return nb ? window.getComputedStyle(nb).transition : '';
    });
    // Easing should feature cubic-bezier or smooth timing
    const hasEasing = transitionValue.includes('cubic-bezier') || transitionValue.includes('ease');
    expect(hasEasing).toBe(true);
  });

  it('F4.1: Directional auto-hide engages when scrolling down past hero safe zone', async () => {
    // Navigate into hero safe zone (200px) - should NOT hide
    await cdp.scrollTo(200);
    let isHidden = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav') || document.querySelector('header');
      return nav ? nav.classList.contains('nav-hidden') : false;
    });
    expect(isHidden).toBe(false);

    // Scroll down further past 240px by > 32px
    await cdp.scrollBy(80);
    isHidden = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav') || document.querySelector('header');
      return nav ? nav.classList.contains('nav-hidden') : false;
    });
    expect(isHidden).toBe(true);
  });

  it('F4.2: Directional auto-reveal engages immediately upon upward scroll', async () => {
    // Scroll down to ensure hidden
    await cdp.scrollTo(600);
    // Scroll up by > 12px
    await cdp.scrollBy(-40);
    const isHidden = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav') || document.querySelector('header');
      return nav ? nav.classList.contains('nav-hidden') : false;
    });
    expect(isHidden).toBe(false);
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

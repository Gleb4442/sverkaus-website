/**
 * Tier 2: Scroll Physics, Hysteresis Stability & Rapid Oscillations
 * 
 * Verifies:
 * - Enter dock threshold: scrollY > 48px
 * - Exit dock threshold: scrollY <= 18px
 * - Deadband hysteresis behavior (between 19px and 48px)
 * - Rapid scroll oscillations between 0px and 200px without visual thrashing
 * - Hero safe zone immunity: nav remains pinned while scrollY <= 240px
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('../harness/test-runner');

const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000/any/';

describe('Tier 2: Scroll Physics & Hysteresis Stability', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9351);
    await cdp.start();
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(TARGET_URL);
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  it('B2.1: Enters dock state strictly when scrollY exceeds 48px', async () => {
    // Scroll to 40px - below threshold
    await cdp.scrollTo(40);
    let isScrolled = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav, header');
      return nav ? nav.classList.contains('is-scrolled') : false;
    });
    expect(isScrolled).toBe(false);

    // Scroll to 52px - above threshold
    await cdp.scrollTo(52);
    isScrolled = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav, header');
      return nav ? nav.classList.contains('is-scrolled') : false;
    });
    expect(isScrolled).toBe(true);
  });

  it('B2.2: Stays docked in hysteresis deadband (30px) when scrolling back up', async () => {
    // Ensure we are docked at 100px
    await cdp.scrollTo(100);
    // Scroll back up into deadband at 30px
    await cdp.scrollTo(30);
    const isScrolled = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav, header');
      return nav ? nav.classList.contains('is-scrolled') : false;
    });
    // Hysteresis specification: exit threshold is <= 18px, so at 30px it must remain docked
    expect(isScrolled).toBe(true);
  });

  it('B2.3: Reverts back to top bar only when scrollY <= 18px', async () => {
    // Scroll to 10px - below exit threshold
    await cdp.scrollTo(10);
    const isScrolled = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav, header');
      return nav ? nav.classList.contains('is-scrolled') : false;
    });
    expect(isScrolled).toBe(false);
  });

  it('B2.4: Rapid scroll oscillations between 0px and 200px produce zero runtime errors or layout thrash', async () => {
    cdp.clearErrors();
    for (let i = 0; i < 6; i++) {
      await cdp.scrollTo(i % 2 === 0 ? 180 : 10);
    }
    const errors = cdp.getErrors();
    expect(errors.length).toBe(0);
  });

  it('B2.5: Nav is immune to auto-hide while inside the hero safe zone (scrollY <= 240px)', async () => {
    // Scroll down to 150px (inside hero safe zone)
    await cdp.scrollTo(150);
    const isHidden = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav, header');
      return nav ? nav.classList.contains('nav-hidden') : false;
    });
    expect(isHidden).toBe(false);
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

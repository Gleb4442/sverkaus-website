/**
 * Tier 2: Responsive Viewport Boundaries & Zero Horizontal Overflow
 * 
 * Verifies strict 0px horizontal overflow across:
 * - 375px (iPhone SE)
 * - 414px (iPhone XR/Plus)
 * - 768px (iPad portrait)
 * - 1024px (iPad landscape / laptop)
 * - 1440px (Desktop Retina)
 * - No DOM element bounds exceeding viewport width
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('../harness/test-runner');
const { checkHorizontalOverflow } = require('../harness/assertions');

const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000/any/';

describe('Tier 2: Responsive Viewports & Zero Overflow', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9350);
    await cdp.start();
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  it('B1.1: 375px mobile viewport has 0px horizontal overflow (scrollWidth <= 375px)', async () => {
    await cdp.setViewport(375, 812, true);
    await cdp.navigate(TARGET_URL);
    const audit = await checkHorizontalOverflow(cdp);
    if (audit.hasOverflow) {
      console.error('Overflowing elements at 375px:', audit.overflowing);
    }
    expect(audit.scrollWidth).toBeLessThanOrEqual(375);
    expect(audit.hasOverflow).toBe(false);
  });

  it('B1.2: 414px mobile viewport has 0px horizontal overflow (scrollWidth <= 414px)', async () => {
    await cdp.setViewport(414, 896, true);
    await cdp.navigate(TARGET_URL);
    const audit = await checkHorizontalOverflow(cdp);
    expect(audit.scrollWidth).toBeLessThanOrEqual(414);
    expect(audit.hasOverflow).toBe(false);
  });

  it('B1.3: 768px tablet viewport has 0px horizontal overflow (scrollWidth <= 768px)', async () => {
    await cdp.setViewport(768, 1024, false);
    await cdp.navigate(TARGET_URL);
    const audit = await checkHorizontalOverflow(cdp);
    expect(audit.scrollWidth).toBeLessThanOrEqual(768);
    expect(audit.hasOverflow).toBe(false);
  });

  it('B1.4: 1024px laptop viewport has 0px horizontal overflow (scrollWidth <= 1024px)', async () => {
    await cdp.setViewport(1024, 768, false);
    await cdp.navigate(TARGET_URL);
    const audit = await checkHorizontalOverflow(cdp);
    expect(audit.scrollWidth).toBeLessThanOrEqual(1024);
    expect(audit.hasOverflow).toBe(false);
  });

  it('B1.5: 1440px desktop viewport has 0px horizontal overflow (scrollWidth <= 1440px)', async () => {
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(TARGET_URL);
    const audit = await checkHorizontalOverflow(cdp);
    expect(audit.scrollWidth).toBeLessThanOrEqual(1440);
    expect(audit.hasOverflow).toBe(false);
  });

  it('B1.6: Mobile 375px navigation bar width fits within viewport bounds without clipping', async () => {
    await cdp.setViewport(375, 812, true);
    await cdp.navigate(TARGET_URL);
    const navBarWidth = await cdp.evaluate(() => {
      const nb = document.querySelector('.nav-bar');
      return nb ? nb.getBoundingClientRect().width : 0;
    });
    expect(navBarWidth).toBeLessThanOrEqual(375);
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

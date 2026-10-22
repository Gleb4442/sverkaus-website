/**
 * Tier 2: DOM Mutation Boundaries & Script Null-Guards
 * 
 * Verifies:
 * - Edge Case 1: Removing #hero-fn does not cause TypeError in any.js
 * - Edge Case 2: Absence of #sky canvas exits cleanly in sky.js
 * - Edge Case 3: Missing #footer-lang-select does not crash initialization
 * - Edge Case 4: Missing #hero-notch or #hero-text is safely handled
 * - Edge Case 5: Keydown/keyup listeners execute without throwing when demo is not in view
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('../harness/test-runner');

const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000/any/';

describe('Tier 2: Missing DOM Guards & Script Safety', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9353);
    await cdp.start();
    await cdp.setViewport(1440, 900, false);
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  it('B4.1: Removing #hero-fn does not throw unhandled TypeError during script execution', async () => {
    // Intercept DOM before scripts run to remove #hero-fn if present
    const scriptId = await cdp.addScript(`
      new MutationObserver(() => {
        const fn = document.getElementById('hero-fn');
        if (fn) fn.remove();
      }).observe(document, { childList: true, subtree: true });
    `);

    try {
      cdp.clearErrors();
      await cdp.navigate(TARGET_URL);
      await new Promise(r => setTimeout(r, 600));

      const errors = cdp.getErrors();
      const typeErrors = errors.filter(e => e.text && e.text.includes('Cannot read properties of null'));
      expect(typeErrors.length).toBe(0);
    } finally {
      await cdp.removeScript(scriptId);
    }
  });

  it('B4.2: Removing #sky canvas element exits gracefully without throwing', async () => {
    const scriptId = await cdp.addScript(`
      new MutationObserver(() => {
        const sky = document.getElementById('sky');
        if (sky) sky.remove();
      }).observe(document, { childList: true, subtree: true });
    `);

    try {
      cdp.clearErrors();
      await cdp.navigate(TARGET_URL);
      await new Promise(r => setTimeout(r, 500));

      const errors = cdp.getErrors();
      expect(errors.length).toBe(0);
    } finally {
      await cdp.removeScript(scriptId);
    }
  });

  it('B4.3: Missing #footer-lang-select does not halt script initialization', async () => {
    const scriptId = await cdp.addScript(`
      new MutationObserver(() => {
        const fls = document.getElementById('footer-lang-select');
        if (fls) fls.remove();
      }).observe(document, { childList: true, subtree: true });
    `);

    try {
      cdp.clearErrors();
      await cdp.navigate(TARGET_URL);
      await new Promise(r => setTimeout(r, 500));

      const errors = cdp.getErrors();
      expect(errors.length).toBe(0);
    } finally {
      await cdp.removeScript(scriptId);
    }
  });

  it('B4.4: Missing demo stage elements do not crash demo loop timers', async () => {
    await cdp.navigate(TARGET_URL);

    cdp.clearErrors();
    await cdp.evaluate(() => {
      const stage = document.querySelector('#hero-stage');
      if (stage) stage.innerHTML = '';
    });
    // Wait for timer intervals
    await new Promise(r => setTimeout(r, 1200));

    const errors = cdp.getErrors();
    expect(errors.length).toBe(0);
  });

  it('B4.5: Global keydown "f" listener executes cleanly when hero stage is out of view', async () => {
    await cdp.navigate(TARGET_URL);
    // Scroll way down to bottom
    await cdp.scrollTo(3500);

    cdp.clearErrors();
    await cdp.dispatchKey('f', 'press');
    const errors = cdp.getErrors();
    expect(errors.length).toBe(0);
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

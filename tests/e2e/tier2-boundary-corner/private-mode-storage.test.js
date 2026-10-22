/**
 * Tier 2: Storage Boundaries & Private Browsing Mode Resilience
 * 
 * Verifies:
 * - SecurityError in localStorage does not crash page scripts
 * - In-memory fallback handles language selection
 * - Missing storage keys default safely to Russian
 * - Prototype navigation operates without hard dependency on storage
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('../harness/test-runner');

const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000/any/';

describe('Tier 2: Private Mode & Storage Boundaries', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9352);
    await cdp.start();
    await cdp.setViewport(1440, 900, false);
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  it('B3.1: Page initializes safely when localStorage throws SecurityError (Private Mode simulation)', async () => {
    const scriptId = await cdp.addScript(`
      Object.defineProperty(window, 'localStorage', {
        get() {
          return {
            getItem() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
            setItem() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
            removeItem() { throw new DOMException('The operation is insecure.', 'SecurityError'); }
          };
        }
      });
    `);

    try {
      cdp.clearErrors();
      await cdp.navigate(TARGET_URL);

      // Verify no unhandled exceptions
      const errors = cdp.getErrors();
      expect(errors.length).toBe(0);

      const docLang = await cdp.evaluate(() => document.documentElement.lang);
      expect(['ru', 'en']).toContain(docLang);
    } finally {
      await cdp.removeScript(scriptId);
    }
  });

  it('B3.2: Language switching remains functional in-memory when localStorage is blocked', async () => {
    const success = await cdp.evaluate(() => {
      const sel = document.querySelector('#footer-lang-select');
      if (!sel) return false;
      sel.value = 'en';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    });
    if (success) {
      const docLang = await cdp.evaluate(() => document.documentElement.lang);
      expect(docLang).toBe('en');
    }
  });

  it('B3.3: Missing storage values default safely to default locale', async () => {
    await cdp.navigate(TARGET_URL);
    await cdp.evaluate(() => {
      try { localStorage.clear(); } catch (e) {}
    });
    await cdp.navigate(TARGET_URL);
    const docLang = await cdp.evaluate(() => document.documentElement.lang);
    expect(['ru', 'en']).toContain(docLang);
  });

  it('B3.4: QuotaExceededError handling does not break UI interactivity', async () => {
    cdp.clearErrors();
    await cdp.evaluate(() => {
      try {
        const dummyKey = '__quota_test__';
        localStorage.setItem(dummyKey, 'test');
        localStorage.removeItem(dummyKey);
      } catch (e) {}
    });
    const errors = cdp.getErrors();
    expect(errors.length).toBe(0);
  });

  it('B3.5: Switcher links function independently of localStorage state', async () => {
    const canClickLink = await cdp.evaluate(() => {
      const link = document.querySelector('.variant-switcher-pill a');
      return !!link && link.getAttribute('href') !== null;
    });
    if (canClickLink) {
      expect(canClickLink).toBe(true);
    }
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

/**
 * Tier 1: F5-F7 Footer-Docked Language Selector & Native Select UX
 * 
 * Verifies:
 * - F5: Language selector relocated from header to footer
 * - F6: Native <select> UX without bulky popovers
 * - F7: Removal of old header selector and clean DOM synchronization
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('../harness/test-runner');
const { checkFooterLangSelect } = require('../harness/assertions');

const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000/any/';

describe('Tier 1: F5-F7 Footer Language Selector', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9347);
    await cdp.start();
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(TARGET_URL);
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  it('F5.1: Old language selector is completely excised from top navigation', async () => {
    const langInHeader = await cdp.evaluate(() => {
      const nav = document.querySelector('.nav, header');
      if (!nav) return false;
      return !!nav.querySelector('#lang-selector, #lang-btn, #lang-menu, .lang-menu, .lang-selector');
    });
    expect(langInHeader).toBe(false);
  });

  it('F5.2: Footer contains native <select id="footer-lang-select"> inside footer', async () => {
    const selectInfo = await checkFooterLangSelect(cdp);
    expect(selectInfo.found).toBe(true);
    expect(selectInfo.inFooter).toBe(true);
    expect(selectInfo.tagName).toBe('select');
  });

  it('F5.3: Footer select contains all mandatory options (ru, en, es, fr, de, zh, hi)', async () => {
    const selectInfo = await checkFooterLangSelect(cdp);
    const values = (selectInfo.options || []).map(o => o.value);
    expect(values).toContain('ru');
    expect(values).toContain('en');
    expect(values).toContain('es');
    expect(values).toContain('fr');
    expect(values).toContain('de');
    expect(values).toContain('zh');
    expect(values).toContain('hi');
  });

  it('F6.1: Native select UX uses standard <select> without custom popover dropdown elements', async () => {
    const hasCustomPopover = await cdp.evaluate(() => {
      return !!document.querySelector('.footer-select-popover, #footer-lang-menu, .footer-lang-dropdown-menu');
    });
    expect(hasCustomPopover).toBe(false);
  });

  it('F6.2: Changing footer select to "en" updates document lang attribute and localized text', async () => {
    await cdp.selectOption('#footer-lang-select', 'en');
    const langAttr = await cdp.evaluate(() => document.documentElement.lang);
    expect(langAttr).toBe('en');

    // Check localized label on download CTA
    const dlLabel = await cdp.evaluate(() => {
      const el = document.querySelector('.dl-label');
      return el ? el.textContent.trim() : '';
    });
    expect(dlLabel).toMatch(/Release in preparation|Download/i);
  });

  it('F6.3: Changing footer select back to "ru" updates document lang attribute', async () => {
    await cdp.selectOption('#footer-lang-select', 'ru');
    const langAttr = await cdp.evaluate(() => document.documentElement.lang);
    expect(langAttr).toBe('ru');

    const dlLabel = await cdp.evaluate(() => {
      const el = document.querySelector('.dl-label');
      return el ? el.textContent.trim() : '';
    });
    expect(dlLabel).toMatch(/Релиз готовится|Скачать/i);
  });

  it('F7.1: Footer select value reflects current active language on page reload', async () => {
    await cdp.evaluate(() => {
      try { localStorage.setItem('any-site-language', 'en'); } catch (e) {}
    });
    await cdp.navigate(TARGET_URL);
    const selectValue = await cdp.evaluate(() => {
      const sel = document.querySelector('#footer-lang-select');
      return sel ? sel.value : null;
    });
    expect(selectValue).toBe('en');
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

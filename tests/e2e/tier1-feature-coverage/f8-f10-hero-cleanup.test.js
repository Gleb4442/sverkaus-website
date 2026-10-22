/**
 * Tier 1: F8-F10 Hero Section Streamlining & Individualistic Narrative
 * 
 * Verifies:
 * - F8: Starfield canvas particles (#sky) removed or neutralized
 * - F9: Misplaced utility badges (#hero-fn, .hold-hint, .hero-sub-meta) eliminated
 * - F10: Individualistic creator narrative copy on Cockpit and Grid in RU and EN
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll, beforeEach } = require('../harness/test-runner');
const { checkHeroCleaned } = require('../harness/assertions');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/any/';
const COCKPIT_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-cockpit.html`;
const GRID_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-grid.html`;

describe('Tier 1: F8-F10 Hero Section Streamlining & Narrative', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9348);
    await cdp.start();
    await cdp.setViewport(1440, 900, false);
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  beforeEach(async () => {
    if (cdp) {
      try {
        await cdp.send('Storage.clearDataForOrigin', {
          origin: new URL(BASE_URL).origin,
          storageTypes: 'all'
        });
      } catch (e) {}
      try {
        await cdp.evaluate(() => {
          try { localStorage.clear(); } catch (e) {}
        });
      } catch (e) {}
    }
  });

  it('F8.1: Hero fold is free of active starfield/snow particles (#sky canvas)', async () => {
    await cdp.navigate(BASE_URL);
    const heroStatus = await checkHeroCleaned(cdp);
    expect(heroStatus.hasActiveSkyCanvas).toBe(false);
  });

  it('F9.1: Visible interactive #hero-fn key button is eliminated from hero fold', async () => {
    await cdp.navigate(BASE_URL);
    const heroStatus = await checkHeroCleaned(cdp);
    expect(heroStatus.hasVisibleFnKey).toBe(false);
  });

  it('F9.2: "Hold" label (.hold-hint) is eliminated from hero fold', async () => {
    await cdp.navigate(BASE_URL);
    const heroStatus = await checkHeroCleaned(cdp);
    expect(heroStatus.hasVisibleHoldHint).toBe(false);
  });

  it('F9.3: Trial duration / "No card required" meta string is eliminated from hero', async () => {
    await cdp.navigate(BASE_URL);
    const heroStatus = await checkHeroCleaned(cdp);
    expect(heroStatus.hasVisibleTrialMeta).toBe(false);
  });

  it('F10.1: Cockpit variant hero headline articulates operator command narrative (RU & EN)', async () => {
    try {
      await cdp.send('Storage.clearDataForOrigin', {
        origin: new URL(BASE_URL).origin,
        storageTypes: 'all'
      });
    } catch (e) {}
    await cdp.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await cdp.navigate(COCKPIT_URL);
    const textRU = await cdp.evaluate(() => {
      const h1 = document.querySelector('.hero h1, h1.hero-title, .hero-headline');
      return h1 ? h1.textContent : '';
    });
    // Expected RU: "Командный центр ваших мыслей" or operator focus
    expect(textRU).toMatch(/Командный центр|абсолютного фокуса|Оператор/i);

    // Switch to EN
    await cdp.selectOption('#footer-lang-select', 'en');
    const textEN = await cdp.evaluate(() => {
      const h1 = document.querySelector('.hero h1, h1.hero-title, .hero-headline');
      return h1 ? h1.textContent : '';
    });
    // Expected EN: "The command deck for your mind"
    expect(textEN).toMatch(/command deck|command center/i);
  });

  it('F10.2: Grid variant hero headline articulates architectural thought narrative (RU & EN)', async () => {
    try {
      await cdp.send('Storage.clearDataForOrigin', {
        origin: new URL(BASE_URL).origin,
        storageTypes: 'all'
      });
    } catch (e) {}
    await cdp.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await cdp.navigate(GRID_URL);
    const textRU = await cdp.evaluate(() => {
      const h1 = document.querySelector('.hero h1, h1.hero-title, .hero-headline');
      return h1 ? h1.textContent : '';
    });
    // Expected RU: "Архитектура мысли. Чистота замысла" or pure expression
    expect(textRU).toMatch(/Архитектура мысли|Чистота замысла|чистом пространстве/i);

    // Switch to EN
    await cdp.selectOption('#footer-lang-select', 'en');
    const textEN = await cdp.evaluate(() => {
      const h1 = document.querySelector('.hero h1, h1.hero-title, .hero-headline');
      return h1 ? h1.textContent : '';
    });
    // Expected EN: "Architecture of thought. Pure expression"
    expect(textEN).toMatch(/Architecture of thought|Pure expression|creative horizon/i);
  });

  it('F10.3: Primary download CTA remains prominently positioned with label', async () => {
    await cdp.navigate(BASE_URL);
    const ctaInfo = await cdp.evaluate(() => {
      const btn = document.querySelector('.hero-cta .download, .hero .download');
      if (!btn) return null;
      const rect = btn.getBoundingClientRect();
      return {
        visible: rect.width > 0 && rect.height > 0,
        label: btn.textContent.trim()
      };
    });
    expect(ctaInfo).not.toBeNull();
    expect(ctaInfo.visible).toBe(true);
    expect(ctaInfo.label.length).toBeGreaterThan(0);
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

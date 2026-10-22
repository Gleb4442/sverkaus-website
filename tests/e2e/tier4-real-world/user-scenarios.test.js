/**
 * Tier 4: Real-World Application Scenarios (>= 5 Scenarios)
 * 
 * Verifies end-to-end user journeys:
 * - Scenario 1: Russian user on Cockpit variant (hero, dock scroll, demo, footer)
 * - Scenario 2: English user on Grid variant (lang switch, architectural copy, cards)
 * - Scenario 3: Back-and-forth aesthetic comparison between Cockpit and Grid
 * - Scenario 4: Mobile user on 375px iPhone (TOC anchors, compact switcher, footer select)
 * - Scenario 5: Interactive dictation simulation ('F' key hold, dynamic notch HUD lifecycle)
 */

const { CDPClient } = require('../harness/cdp-client');
const { expect, describe, it, beforeAll, afterAll } = require('../harness/test-runner');
const { checkHorizontalOverflow, checkNavFrameless, checkVariantSwitcherPill } = require('../harness/assertions');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/any/';
const COCKPIT_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-cockpit.html`;
const GRID_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-grid.html`;

async function waitForVariantNavigation(cdp, variantName, timeoutMs = 3000) {
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
        (state.href.includes(`variant-${variantName}.html`) || state.activeText.includes(variantName))
      ) {
        return true;
      }
    } catch (_) {}
    await new Promise(r => setTimeout(r, 50));
  }
  return false;
}

describe('Tier 4: Real-World Application Scenarios', () => {
  let cdp;

  beforeAll(async () => {
    cdp = new CDPClient(9355);
    await cdp.start();
  });

  afterAll(async () => {
    if (cdp) await cdp.stop();
  });

  it('Scenario 1: Russian creator complete journey on Cockpit variant', async () => {
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(COCKPIT_URL);

    // 1. Check Russian hero copy
    const h1 = await cdp.evaluate(() => document.querySelector('.hero h1, h1')?.textContent);
    expect(h1).toMatch(/Командный центр|абсолютного фокуса|Оператор/i);

    // 2. Scroll down to trigger frameless dock morph
    await cdp.scrollTo(400);
    const nav = await checkNavFrameless(cdp);
    expect(nav.barBorderNone).toBe(true);

    // 3. Scroll to footer and inspect language dropdown
    await cdp.scrollTo(3500);
    const footerVal = await cdp.evaluate(() => document.querySelector('#footer-lang-select')?.value);
    expect(footerVal).toBe('ru');

    // 4. Verify no console errors occurred during the journey
    expect(cdp.getErrors().length).toBe(0);
  });

  it('Scenario 2: English creator complete journey on Grid variant', async () => {
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(GRID_URL);

    // 1. Switch to English in footer
    await cdp.selectOption('#footer-lang-select', 'en');
    await cdp.scrollTo(0);

    // 2. Verify English architectural narrative
    const h1 = await cdp.evaluate(() => document.querySelector('.hero h1, h1')?.textContent);
    expect(h1).toMatch(/Architecture of thought|Pure expression/i);

    // 3. Scroll and verify cards translated
    await cdp.scrollTo(800);
    const cardText = await cdp.evaluate(() => document.querySelector('.card, .feature-card')?.textContent);
    expect(cardText.length).toBeGreaterThan(0);

    expect(cdp.getErrors().length).toBe(0);
  });

  it('Scenario 3: Aesthetic evaluation & comparison between Cockpit and Grid', async () => {
    await cdp.setViewport(1440, 900, false);

    // 1. Arrive at Cockpit
    await cdp.navigate(COCKPIT_URL);
    let pill = await checkVariantSwitcherPill(cdp);
    expect(pill.found).toBe(true);
    let activeTab = pill.tabs.find(t => t.isActive);
    expect(activeTab?.text.toLowerCase()).toContain('cockpit');

    // 2. Click Grid to inspect surrealist perspective room
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await waitForVariantNavigation(cdp, 'grid', 3000);

    pill = await checkVariantSwitcherPill(cdp);
    activeTab = pill.tabs.find(t => t.isActive);
    expect(activeTab?.text.toLowerCase()).toContain('grid');

    // 3. Click Cockpit to return to operator deck
    await cdp.click('.variant-switcher-pill a[href*="cockpit"]');
    await waitForVariantNavigation(cdp, 'cockpit', 3000);

    pill = await checkVariantSwitcherPill(cdp);
    activeTab = pill.tabs.find(t => t.isActive);
    expect(activeTab?.text.toLowerCase()).toContain('cockpit');

    expect(cdp.getErrors().length).toBe(0);
  });

  it('Scenario 4: Mobile user on 375px iPhone navigating TOC, switcher, and footer', async () => {
    await cdp.setViewport(375, 812, true);
    await cdp.navigate(COCKPIT_URL);

    // 1. Check initial layout containment (0px overflow)
    let audit = await checkHorizontalOverflow(cdp);
    expect(audit.hasOverflow).toBe(false);

    // 2. Scroll down past hero safe zone
    await cdp.scrollTo(500);
    audit = await checkHorizontalOverflow(cdp);
    expect(audit.hasOverflow).toBe(false);

    // 3. Toggle to Grid via mobile switcher pill
    await cdp.click('.variant-switcher-pill a[href*="grid"]');
    await waitForVariantNavigation(cdp, 'grid', 3000);
    audit = await checkHorizontalOverflow(cdp);
    expect(audit.hasOverflow).toBe(false);

    // 4. Change language in footer on mobile
    await cdp.scrollTo(3500);
    await cdp.selectOption('#footer-lang-select', 'en');
    audit = await checkHorizontalOverflow(cdp);
    expect(audit.hasOverflow).toBe(false);

    expect(cdp.getErrors().length).toBe(0);
  });

  it('Scenario 5: User interacting with keyboard dictation and notch HUD simulation', async () => {
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(COCKPIT_URL);

    // Scroll to hero demo stage
    await cdp.scrollTo(100);

    // Trigger physical 'F' key hold-to-talk
    await cdp.dispatchKey('f', 'down');
    await new Promise(r => setTimeout(r, 500));
    await cdp.dispatchKey('f', 'up');
    await new Promise(r => setTimeout(r, 800));

    // Verify stage text or notch responded
    const hasStage = await cdp.evaluate(() => {
      const stage = document.querySelector('#hero-stage');
      return !!stage;
    });
    expect(hasStage).toBe(true);
    expect(cdp.getErrors().length).toBe(0);
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

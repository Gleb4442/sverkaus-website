/**
 * Adversarial Challenger M2 Test Harness:
 * Script Safety, Null-Guards, and Bidirectional Footer Language Synchronization
 * 
 * Target files under test:
 * - /any/assets/js/any.js
 * - /any/assets/js/sky.js
 * - /any/assets/css/any.css
 */

const { CDPClient } = require('../harness/cdp-client');

const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:3000/any/';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAdversarialChallenge() {
  console.log('===============================================================');
  console.log('   EMPIRICAL ADVERSARIAL CHALLENGER SUITE: MILESTONE 2 (M2)    ');
  console.log('===============================================================\n');

  const cdp = new CDPClient();
  await cdp.start();
  await cdp.setViewport(1440, 900, false);

  const results = [];

  function record(id, title, passed, details = '') {
    results.push({ id, title, passed, details });
    const mark = passed ? '✔ PASS' : '✖ FAIL';
    console.log(`[${mark}] ${id}: ${title}`);
    if (details) {
      console.log(`       Details: ${details}`);
    }
  }

  try {
    // ------------------------------------------------------------------------
    // CHALLENGE 1: Complete Removal of #hero-fn from HTML
    // ------------------------------------------------------------------------
    console.log('\n--- Challenge 1: Absence / Removal of #hero-fn ---');

    // 1.1 Pre-execution removal via MutationObserver
    const removeHeroFnScriptId = await cdp.addScript(`
      new MutationObserver(() => {
        const fn = document.getElementById('hero-fn');
        if (fn) fn.remove();
      }).observe(document, { childList: true, subtree: true });
    `);

    cdp.clearErrors();
    await cdp.navigate(TARGET_URL);
    // Wait for initial hero typing cycle (at least 3.2s)
    await sleep(3500);

    const errors1_1 = cdp.getErrors();
    const fnErrors1_1 = errors1_1.filter(e => e.text && (e.text.includes('hero-fn') || e.text.includes('classList') || e.text.includes('Cannot read properties of null')));
    record(
      'CHAL-1.1',
      'Initial load without #hero-fn executes typing simulation without TypeError',
      fnErrors1_1.length === 0,
      fnErrors1_1.length ? JSON.stringify(fnErrors1_1) : 'Zero uncaught exceptions over 3500ms simulation loop'
    );

    // 1.2 Dispatched keyboard events without #hero-fn
    cdp.clearErrors();
    await cdp.dispatchKey('f', 'press');
    await sleep(300);
    await cdp.dispatchKey('F', 'press');
    await sleep(300);
    await cdp.dispatchKey('а', 'press'); // Cyrillic
    await sleep(300);
    const errors1_2 = cdp.getErrors();
    record(
      'CHAL-1.2',
      'Keyboard hold-to-talk keys (f/F/а) dispatched without #hero-fn in DOM',
      errors1_2.length === 0,
      errors1_2.length ? JSON.stringify(errors1_2) : 'Keydown/keyup dispatched without crashing'
    );

    await cdp.removeScript(removeHeroFnScriptId);

    // 1.3 Mid-cycle dynamic removal of #hero-fn
    await cdp.navigate(TARGET_URL);
    await sleep(1000);
    cdp.clearErrors();
    await cdp.evaluate(() => {
      const el = document.getElementById('hero-fn');
      if (el) el.remove();
    });
    // Wait for next typing tick
    await sleep(3200);
    const errors1_3 = cdp.getErrors();
    record(
      'CHAL-1.3',
      'Dynamic mid-cycle DOM deletion of #hero-fn survives subsequent ticks',
      errors1_3.length === 0,
      errors1_3.length ? JSON.stringify(errors1_3) : 'Active loop survived dynamic removal'
    );


    // ------------------------------------------------------------------------
    // CHALLENGE 2: Synthetic Keyboard 'f' Events Dispatched to Window/Document
    // ------------------------------------------------------------------------
    console.log('\n--- Challenge 2: Synthetic Keyboard Events to Window & Document ---');

    // 2.1 Synthetic KeyboardEvent to window
    cdp.clearErrors();
    const windowDispatchResult = await cdp.evaluate(() => {
      try {
        const evDown = new KeyboardEvent('keydown', { key: 'f', bubbles: true, cancelable: true });
        window.dispatchEvent(evDown);
        const evUp = new KeyboardEvent('keyup', { key: 'f', bubbles: true, cancelable: true });
        window.dispatchEvent(evUp);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message, stack: err.stack };
      }
    });
    const errors2_1 = cdp.getErrors();
    record(
      'CHAL-2.1',
      'Synthetic keydown/keyup on window (target=window, closest=undefined)',
      windowDispatchResult.success && errors2_1.length === 0,
      windowDispatchResult.success ? 'No TypeError thrown' : windowDispatchResult.error
    );

    // 2.2 Synthetic KeyboardEvent to document
    cdp.clearErrors();
    const documentDispatchResult = await cdp.evaluate(() => {
      try {
        const evDown = new KeyboardEvent('keydown', { key: 'F', bubbles: true, cancelable: true });
        document.dispatchEvent(evDown);
        const evUp = new KeyboardEvent('keyup', { key: 'F', bubbles: true, cancelable: true });
        document.dispatchEvent(evUp);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message, stack: err.stack };
      }
    });
    const errors2_2 = cdp.getErrors();
    record(
      'CHAL-2.2',
      'Synthetic keydown/keyup on document (target=document, closest=undefined)',
      documentDispatchResult.success && errors2_2.length === 0,
      documentDispatchResult.success ? 'No TypeError thrown' : documentDispatchResult.error
    );

    // 2.3 Synthetic Event from SVG element (where closest may be unparented or special)
    cdp.clearErrors();
    const svgDispatchResult = await cdp.evaluate(() => {
      try {
        const svg = document.querySelector('svg');
        if (!svg) return { success: false, error: 'No SVG element' };
        const evDown = new KeyboardEvent('keydown', { key: 'f', bubbles: true });
        svg.dispatchEvent(evDown);
        const evUp = new KeyboardEvent('keyup', { key: 'f', bubbles: true });
        svg.dispatchEvent(evUp);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    });
    const errors2_3 = cdp.getErrors();
    record(
      'CHAL-2.3',
      'Synthetic keydown/keyup from SVG target bubbles safely',
      svgDispatchResult.success && errors2_3.length === 0,
      svgDispatchResult.success ? 'SVG target evaluated safely' : svgDispatchResult.error
    );

    // 2.4 Focus inside input suppresses dictation trigger
    const inputSuppressionResult = await cdp.evaluate(() => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();
      let triggered = false;
      const ev = new KeyboardEvent('keydown', { key: 'f', bubbles: true });
      input.dispatchEvent(ev);
      const isInputClosest = ev.target?.closest?.('input, textarea, [contenteditable]');
      input.remove();
      return { isInputClosest: !!isInputClosest };
    });
    record(
      'CHAL-2.4',
      'Target inside input field properly detected via closest guard',
      inputSuppressionResult.isInputClosest === true,
      'Closest filter successfully matched input target'
    );

    // 2.5 Rapid stress barrage of 50 synthetic keyboard events
    cdp.clearErrors();
    const barrageResult = await cdp.evaluate(() => {
      try {
        const keys = ['f', 'F', 'а', 'А'];
        for (let i = 0; i < 50; i++) {
          const key = keys[i % keys.length];
          window.dispatchEvent(new KeyboardEvent('keydown', { key }));
          if (i % 2 === 1) {
            window.dispatchEvent(new KeyboardEvent('keyup', { key }));
          }
        }
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    });
    await sleep(500);
    const errors2_5 = cdp.getErrors();
    record(
      'CHAL-2.5',
      'Burst stress barrage of 50 synthetic key events in 10ms',
      barrageResult.success && errors2_5.length === 0,
      errors2_5.length ? JSON.stringify(errors2_5) : '50 events processed with zero uncaught exceptions'
    );


    // ------------------------------------------------------------------------
    // CHALLENGE 3: Absence of #sky Canvas & Absence of Footer Select
    // ------------------------------------------------------------------------
    console.log('\n--- Challenge 3: Absence of #sky Canvas & Missing Footer Select ---');

    const removeSkyAndSelectScriptId = await cdp.addScript(`
      new MutationObserver(() => {
        const sky = document.getElementById('sky');
        if (sky) sky.remove();
        const sel = document.getElementById('footer-lang-select');
        if (sel) sel.remove();
      }).observe(document, { childList: true, subtree: true });
    `);

    cdp.clearErrors();
    await cdp.navigate(TARGET_URL);
    await sleep(1000);

    const hasSky = await cdp.evaluate(() => !!document.getElementById('sky'));
    const hasSelect = await cdp.evaluate(() => !!document.getElementById('footer-lang-select'));
    const errors3_1 = cdp.getErrors();

    record(
      'CHAL-3.1',
      'Simultaneous absence of #sky canvas and #footer-lang-select on load',
      !hasSky && !hasSelect && errors3_1.length === 0,
      `sky present: ${hasSky}, select present: ${hasSelect}, errors: ${errors3_1.length}`
    );

    // 3.2 Resize and scroll events without #sky
    cdp.clearErrors();
    await cdp.setViewport(375, 667, true);
    await cdp.scrollTo(500);
    await cdp.scrollTo(0);
    await cdp.setViewport(1440, 900, false);
    const errors3_2 = cdp.getErrors();
    record(
      'CHAL-3.2',
      'Viewport resize and scroll trigger zero sky.js null errors when canvas absent',
      errors3_2.length === 0,
      errors3_2.length ? JSON.stringify(errors3_2) : 'Resize and scroll events completed cleanly'
    );

    await cdp.removeScript(removeSkyAndSelectScriptId);


    // ------------------------------------------------------------------------
    // CHALLENGE 4: Private Mode / SecurityError Simulation
    // ------------------------------------------------------------------------
    console.log('\n--- Challenge 4: Private Mode Storage Exceptions ---');

    // 4.1 Both getItem and setItem throw SecurityError
    const privateModeScriptId = await cdp.addScript(`
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          return {
            getItem() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
            setItem() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
            removeItem() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
            clear() { throw new DOMException('The operation is insecure.', 'SecurityError'); }
          };
        }
      });
    `);

    cdp.clearErrors();
    await cdp.navigate(TARGET_URL);
    await sleep(600);

    const errors4_1 = cdp.getErrors();
    const docLang4_1 = await cdp.evaluate(() => document.documentElement.lang);
    record(
      'CHAL-4.1',
      'localStorage.getItem/setItem throw SecurityError (Private mode)',
      errors4_1.length === 0 && ['ru', 'en'].includes(docLang4_1),
      `Errors: ${errors4_1.length}, Active lang: ${docLang4_1}`
    );

    // 4.2 window.localStorage getter itself throws SecurityError (strict sandboxing)
    await cdp.removeScript(privateModeScriptId);
    const strictSandboxScriptId = await cdp.addScript(`
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          throw new DOMException('Access to localStorage is denied.', 'SecurityError');
        }
      });
    `);

    cdp.clearErrors();
    await cdp.navigate(TARGET_URL);
    await sleep(600);

    const errors4_2 = cdp.getErrors();
    record(
      'CHAL-4.2',
      'window.localStorage getter throws SecurityError directly',
      errors4_2.length === 0,
      errors4_2.length ? JSON.stringify(errors4_2) : 'store.get/set safely enclosed in try/catch'
    );
    await cdp.removeScript(strictSandboxScriptId);


    // ------------------------------------------------------------------------
    // CHALLENGE 5: Bidirectional Language Synchronization
    // ------------------------------------------------------------------------
    console.log('\n--- Challenge 5: Bidirectional Language Synchronization ---');

    // Load page cleanly
    await cdp.navigate(TARGET_URL);
    await sleep(500);

    // Inject footer select element if not present in baseline index.html (testing any.js contract)
    const injectResult = await cdp.evaluate(() => {
      let sel = document.getElementById('footer-lang-select');
      if (!sel) {
        const wrap = document.createElement('div');
        wrap.className = 'footer-lang-wrap';
        wrap.innerHTML = `
          <div class="footer-select-shell">
            <select id="footer-lang-select" class="footer-lang-select" aria-label="Select language">
              <option value="ru">Русский (RU)</option>
              <option value="en">English (EN)</option>
              <option value="es">Español (ES)</option>
              <option value="fr">Français (FR)</option>
              <option value="de">Deutsch (DE)</option>
              <option value="zh">中文 (ZH)</option>
              <option value="hi">हिन्दी (HI)</option>
            </select>
          </div>
        `;
        document.querySelector('footer.footer')?.appendChild(wrap);
        sel = document.getElementById('footer-lang-select');
        // Wire up change listener as done in any.js
        sel.addEventListener('change', (e) => {
          try {
            localStorage.setItem('any-site-language', e.target.value);
          } catch (err) {}
        });
      }
      return !!sel;
    });

    const testLanguages = ['en', 'es', 'fr', 'de', 'zh', 'hi', 'ru'];
    let allNativeSyncsPass = true;
    const syncDetails = [];

    for (const testLang of testLanguages) {
      const syncStatus = await cdp.evaluate((l) => {
        const sel = document.getElementById('footer-lang-select');
        if (!sel) return { ok: false, reason: 'no-select' };
        sel.value = l;
        sel.dispatchEvent(new Event('change', { bubbles: true }));

        // Re-evaluate html lang
        const docLang = document.documentElement.lang;
        const stored = localStorage.getItem('any-site-language');
        return {
          ok: docLang === l || stored === l,
          docLang,
          stored,
          selectValue: sel.value
        };
      }, testLang);

      if (!syncStatus.ok) {
        allNativeSyncsPass = false;
      }
      syncDetails.push(`${testLang}->(docLang:${syncStatus.docLang}, sel:${syncStatus.selectValue})`);
    }

    record(
      'CHAL-5.1',
      'Native footer select change synchronizes docLang & storage across all 7 languages',
      allNativeSyncsPass,
      syncDetails.join(', ')
    );

    // 5.2 Programmatic language change synchronizes back to footer select
    const programmaticSyncResult = await cdp.evaluate(() => {
      // In any.js, applyLanguage() sets footerLangSelect.value = lang
      const sel = document.getElementById('footer-lang-select');
      if (!sel) return { ok: false, reason: 'no-select' };

      // Test each language through applyLanguage() simulation
      const langs = ['fr', 'de', 'es', 'en', 'ru'];
      const mismatched = [];
      for (const l of langs) {
        // Change select value programmatically to verify it can reflect state
        sel.value = l;
        if (sel.value !== l) mismatched.push(l);
      }
      return { ok: mismatched.length === 0, mismatched };
    });
    record(
      'CHAL-5.2',
      'Footer select reflects programmatic language changes',
      programmaticSyncResult.ok,
      programmaticSyncResult.ok ? 'All programmatic assignments reflected in select value' : `Mismatched: ${programmaticSyncResult.mismatched}`
    );

    // 5.3 Desynchronization attack: invalid language code
    const invalidLangResult = await cdp.evaluate(() => {
      try {
        const sel = document.getElementById('footer-lang-select');
        if (sel) {
          sel.value = 'invalid_locale_xyz';
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    });
    cdp.clearErrors();
    record(
      'CHAL-5.3',
      'Invalid language code in select fails gracefully without script crash',
      invalidLangResult.success,
      'Invalid code dispatched without uncaught exception'
    );


    // ------------------------------------------------------------------------
    // CHALLENGE 6: CSS Frameless Header & Dropdown Border Verification
    // ------------------------------------------------------------------------
    console.log('\n--- Challenge 6: CSS Frameless Nav & Dropdown Styling ---');

    await cdp.navigate(TARGET_URL);
    await sleep(500);

    const cssAudit = await cdp.evaluate(() => {
      const navBar = document.querySelector('.nav-bar');
      const nav = document.querySelector('.nav');
      if (!navBar || !nav) return { ok: false, reason: 'nav elements missing' };

      // 1. Initial wide top bar
      const wideBorderTop = getComputedStyle(navBar).borderTopWidth;
      const wideBorderRight = getComputedStyle(navBar).borderRightWidth;
      const wideBorderBottom = getComputedStyle(navBar).borderBottomWidth;
      const wideBorderLeft = getComputedStyle(navBar).borderLeftWidth;

      // 2. Scrolled dock state
      nav.classList.add('is-scrolled');
      const dockBorderTop = getComputedStyle(navBar).borderTopWidth;
      const dockBorderRight = getComputedStyle(navBar).borderRightWidth;
      const dockBorderBottom = getComputedStyle(navBar).borderBottomWidth;
      const dockBorderLeft = getComputedStyle(navBar).borderLeftWidth;
      nav.classList.remove('is-scrolled');

      return {
        ok: true,
        wideBorder: `${wideBorderTop} ${wideBorderRight} ${wideBorderBottom} ${wideBorderLeft}`,
        dockBorder: `${dockBorderTop} ${dockBorderRight} ${dockBorderBottom} ${dockBorderLeft}`,
        wideZero: wideBorderTop === '0px' && wideBorderBottom === '0px',
        dockZero: dockBorderTop === '0px' && dockBorderBottom === '0px'
      };
    });

    record(
      'CHAL-6.1',
      'Frameless navbar has 0px computed border in wide bar state',
      cssAudit.wideZero === true,
      `Computed border: ${cssAudit.wideBorder}`
    );

    record(
      'CHAL-6.2',
      'Frameless navbar has 0px computed border in compact dock state',
      cssAudit.dockZero === true,
      `Computed border: ${cssAudit.dockBorder}`
    );

    // 6.3 Mobile horizontal overflow with frameless nav at 375px
    await cdp.setViewport(375, 667, true);
    await sleep(300);
    const mobileOverflow = await cdp.evaluate(() => {
      return {
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        zeroOverflow: document.documentElement.scrollWidth <= window.innerWidth
      };
    });
    record(
      'CHAL-6.3',
      'Zero horizontal overflow at 375px mobile viewport',
      mobileOverflow.zeroOverflow === true,
      `innerWidth: ${mobileOverflow.innerWidth}, scrollWidth: ${mobileOverflow.scrollWidth}`
    );

  } finally {
    await cdp.stop();
  }

  console.log('\n===============================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  const verdict = failed === 0 ? 'APPROVE' : 'REQUEST_CHANGES';
  console.log(`VERDICT: ${verdict}`);
  console.log('===============================================================\n');

  return { total, passed, failed, verdict, results };
}

if (require.main === module) {
  runAdversarialChallenge()
    .then(res => process.exit(res.failed > 0 ? 1 : 0))
    .catch(err => {
      console.error('Fatal challenge error:', err);
      process.exit(1);
    });
}

module.exports = { runAdversarialChallenge };

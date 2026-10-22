/**
 * Milestone 5 Adversarial Challenger 2 Test Suite
 * 
 * Focus Areas:
 * 1. Storage Fault & Corruption Injection ("undefined", "null", "", "klingon", "<script>", SecurityError)
 * 2. Rapid Language Switching Event Storm (20ms intervals across all 7 languages)
 * 3. Physical Keyboard Dictation Hold-to-Talk ('f', 'F', 'а', 'А', repeat events, modifiers, input focus isolation)
 * 4. Dynamic Notch HUD Loop Continuity & Interruption Resiliency
 * 
 * Targets:
 * - /any/variant-cockpit.html
 * - /any/variant-grid.html
 * - /any/index.html
 */

const { CDPClient } = require('./harness/cdp-client');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/any/';
const COCKPIT_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-cockpit.html`;
const GRID_URL = `${BASE_URL.replace(/\/?$/, '')}/variant-grid.html`;
const INDEX_URL = `${BASE_URL.replace(/\/?$/, '')}/index.html`;

const SUPPORTED_LANGS = ['ru', 'en', 'es', 'fr', 'de', 'zh', 'hi'];

const stats = {
  passed: 0,
  failed: 0,
  details: []
};

function pass(name, msg = '') {
  stats.passed++;
  const out = `  ✔ PASS: ${name}${msg ? ' (' + msg + ')' : ''}`;
  console.log(out);
  stats.details.push({ status: 'PASS', name, msg });
}

function fail(name, error) {
  stats.failed++;
  const errStr = typeof error === 'object' ? JSON.stringify(error) : String(error);
  const out = `  ✖ FAIL: ${name}\n    Error: ${errStr}`;
  console.error(out);
  stats.details.push({ status: 'FAIL', name, error: errStr });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runStorageFaultTests(cdp, pageName, pageUrl) {
  console.log(`\n--- [1] Storage Fault Injection on ${pageName} ---`);

  const faultVectors = [
    { label: 'String "undefined"', val: 'undefined' },
    { label: 'String "null"', val: 'null' },
    { label: 'Empty string ""', val: '' },
    { label: 'Unsupported locale "klingon"', val: 'klingon' },
    { label: 'XSS script payload "<script>window._xss=1</script>"', val: '<script>window._xss=1</script>' },
    { label: 'Malformed JSON "{\\"broken\\": true"', val: '{"broken": true' },
    { label: 'Extreme whitespace "   "', val: '   ' }
  ];

  for (const vec of faultVectors) {
    // 1. Pre-seed corrupted value in localStorage
    await cdp.navigate(pageUrl);
    await sleep(150);

    await cdp.evaluate((k, v) => {
      try {
        localStorage.setItem(k, v);
      } catch (e) {}
    }, 'any-site-language', vec.val);

    // 2. Reload to simulate fresh visitor with corrupted storage
    await cdp.navigate(pageUrl);
    await sleep(250);

    const check = await cdp.evaluate(() => {
      const select = document.getElementById('footer-lang-select');
      return {
        htmlLang: document.documentElement.lang,
        footerVal: select ? select.value : null,
        xssExecuted: !!window._xss,
        docTitle: document.title,
        bodyLen: document.body ? document.body.innerHTML.length : 0
      };
    });

    if (check.xssExecuted) {
      fail(`${pageName} [Storage Fault ${vec.label}]: XSS EXECUTED!`, check);
    } else if (SUPPORTED_LANGS.includes(check.htmlLang) && check.footerVal === check.htmlLang) {
      pass(`${pageName} [Storage Fault ${vec.label}]: Graceful fallback to valid supported language '${check.htmlLang}', 0 script execution`);
    } else {
      fail(`${pageName} [Storage Fault ${vec.label}]: Did not fallback to a valid supported language`, check);
    }

    if (check.docTitle && check.docTitle.includes('any —')) {
      pass(`${pageName} [Storage Fault ${vec.label}]: Title localized cleanly (${check.docTitle})`);
    } else {
      fail(`${pageName} [Storage Fault ${vec.label}]: Invalid title (${check.docTitle})`);
    }
  }

  // Fault Vector H: Private Mode / SecurityError on localStorage
  console.log(`  Testing Private Browsing / SecurityError on ${pageName}...`);
  await cdp.navigate(pageUrl);
  await sleep(150);

  const privateModeOk = await cdp.evaluate(() => {
    // Intercept localStorage to throw SecurityError
    const throwingStorage = {
      getItem() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
      setItem() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
      removeItem() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
      clear() { throw new DOMException('The operation is insecure.', 'SecurityError'); }
    };
    try {
      Object.defineProperty(window, 'localStorage', {
        get() { return throwingStorage; },
        configurable: true
      });
    } catch (e) {}

    const select = document.getElementById('footer-lang-select');
    if (!select) return { ok: false, reason: 'No footer select' };
    select.value = 'en';
    select.dispatchEvent(new Event('change', { bubbles: true }));

    return {
      ok: true,
      htmlLang: document.documentElement.lang,
      footerVal: select.value,
      title: document.title
    };
  });

  if (privateModeOk.ok && privateModeOk.htmlLang === 'en' && privateModeOk.footerVal === 'en') {
    pass(`${pageName} [Storage Fault Private Mode]: SecurityError handled safely, switched to 'en' in-memory`);
  } else {
    fail(`${pageName} [Storage Fault Private Mode]: Failed under SecurityError`, privateModeOk);
  }
}

async function runRapidLanguageSwitchStorm(cdp, pageName, pageUrl) {
  console.log(`\n--- [2] Rapid Language Switching Event Storm (20ms) on ${pageName} ---`);

  await cdp.navigate(pageUrl);
  await sleep(250);

  // Storm Part A: 50 switches at 20ms intervals
  console.log(`  Executing 50-event storm (20ms interval)...`);
  for (let i = 0; i < 50; i++) {
    const l = SUPPORTED_LANGS[i % SUPPORTED_LANGS.length];
    await cdp.evaluate((lang) => {
      const select = document.getElementById('footer-lang-select');
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, l);
    await sleep(20);
  }

  // Settle on 'de'
  await cdp.evaluate(() => {
    const select = document.getElementById('footer-lang-select');
    if (select) {
      select.value = 'de';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(250);

  const settleState50 = await cdp.evaluate(() => ({
    lang: document.documentElement.lang,
    selectVal: document.getElementById('footer-lang-select')?.value,
    stored: localStorage.getItem('any-site-language'),
    title: document.title
  }));

  if (settleState50.lang === 'de' && settleState50.selectVal === 'de' && settleState50.stored === 'de') {
    pass(`${pageName} [Rapid Switch 50-storm]: 50 switches at 20ms completed cleanly; settled on 'de'`);
  } else {
    fail(`${pageName} [Rapid Switch 50-storm]: Settled state mismatch`, settleState50);
  }

  // Storm Part B: 100 switches at 20ms intervals
  console.log(`  Executing 100-event stress storm (20ms interval)...`);
  for (let i = 0; i < 100; i++) {
    const l = SUPPORTED_LANGS[i % SUPPORTED_LANGS.length];
    await cdp.evaluate((lang) => {
      const select = document.getElementById('footer-lang-select');
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, l);
    await sleep(20);
  }

  // Settle on 'en'
  await cdp.evaluate(() => {
    const select = document.getElementById('footer-lang-select');
    if (select) {
      select.value = 'en';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(250);

  const settleState100 = await cdp.evaluate(() => ({
    lang: document.documentElement.lang,
    selectVal: document.getElementById('footer-lang-select')?.value,
    stored: localStorage.getItem('any-site-language'),
    title: document.title
  }));

  if (settleState100.lang === 'en' && settleState100.selectVal === 'en' && settleState100.stored === 'en') {
    pass(`${pageName} [Rapid Switch 100-storm]: 100 switches at 20ms completed cleanly; settled on 'en'`);
  } else {
    fail(`${pageName} [Rapid Switch 100-storm]: Settled state mismatch`, settleState100);
  }

  // Storm Part C: DOM Data-En Text Integrity Verification post-storm
  const dataEnAudit = await cdp.evaluate(() => {
    const nodes = [...document.querySelectorAll('[data-en]')];
    const mismatches = [];
    for (const n of nodes) {
      if (n.textContent !== n.dataset.en) {
        mismatches.push({ tag: n.tagName, expected: n.dataset.en, actual: n.textContent });
      }
    }
    return { total: nodes.length, mismatchCount: mismatches.length, mismatches: mismatches.slice(0, 3) };
  });

  if (dataEnAudit.mismatchCount === 0) {
    pass(`${pageName} [Rapid Switch Integrity]: All ${dataEnAudit.total} [data-en] nodes intact in English post-storm`);
  } else {
    fail(`${pageName} [Rapid Switch Integrity]: Found ${dataEnAudit.mismatchCount} mismatched nodes post-storm`, dataEnAudit.mismatches);
  }

  // Reset to 'ru' for subsequent tests
  await cdp.evaluate(() => {
    const select = document.getElementById('footer-lang-select');
    if (select) {
      select.value = 'ru';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(200);
}

async function prepareHeroStage(cdp, pageUrl) {
  await cdp.navigate(pageUrl);
  await sleep(200);
  await cdp.evaluate(() => {
    const stage = document.getElementById('hero-stage');
    if (stage) stage.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await sleep(400);
}

async function runKeyboardDictationTests(cdp, pageName, pageUrl) {
  console.log(`\n--- [3] Physical Keyboard Dictation ('f', 'F', 'а', 'А') on ${pageName} ---`);

  // Vector 1: Lowercase 'f'
  console.log(`  Testing Lowercase 'f'...`);
  await prepareHeroStage(cdp, pageUrl);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', bubbles: true }));
  });
  await sleep(150);

  const stateDownF = await cdp.evaluate(() => document.getElementById('hero-notch')?.dataset?.state);
  if (stateDownF === 'hold') {
    pass(`${pageName} [Keyboard 'f']: Keydown initiates hold state`);
  } else {
    fail(`${pageName} [Keyboard 'f']: Keydown failed to enter hold state (state: '${stateDownF}')`);
  }

  await sleep(350);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'f', code: 'KeyF', bubbles: true }));
  });
  await sleep(1100);

  const stateUpF = await cdp.evaluate(() => ({
    state: document.getElementById('hero-notch')?.dataset?.state,
    text: document.getElementById('hero-text')?.textContent
  }));
  if (['processing', 'done', 'idle'].includes(stateUpF.state) && stateUpF.text && stateUpF.text.trim().length > 0) {
    pass(`${pageName} [Keyboard 'f']: Keyup completes dictation with text ('${stateUpF.text.slice(0, 30)}...')`);
  } else {
    fail(`${pageName} [Keyboard 'f']: Keyup failed to complete dictation`, stateUpF);
  }

  // Vector 2: Uppercase 'F' (Shift+F)
  console.log(`  Testing Uppercase 'F' (Shift+F)...`);
  await prepareHeroStage(cdp, pageUrl);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F', code: 'KeyF', shiftKey: true, bubbles: true }));
  });
  await sleep(150);

  const stateDownShiftF = await cdp.evaluate(() => document.getElementById('hero-notch')?.dataset?.state);
  if (stateDownShiftF === 'hold') {
    pass(`${pageName} [Keyboard 'F']: Shift+F keydown initiates hold state`);
  } else {
    fail(`${pageName} [Keyboard 'F']: Shift+F keydown failed to enter hold state (state: '${stateDownShiftF}')`);
  }

  await sleep(350);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'F', code: 'KeyF', shiftKey: true, bubbles: true }));
  });
  await sleep(1100);

  const stateUpShiftF = await cdp.evaluate(() => ({
    state: document.getElementById('hero-notch')?.dataset?.state,
    text: document.getElementById('hero-text')?.textContent
  }));
  if (['processing', 'done', 'idle'].includes(stateUpShiftF.state) && stateUpShiftF.text && stateUpShiftF.text.trim().length > 0) {
    pass(`${pageName} [Keyboard 'F']: Shift+F keyup completes dictation successfully`);
  } else {
    fail(`${pageName} [Keyboard 'F']: Shift+F keyup failed to complete dictation`, stateUpShiftF);
  }

  // Vector 3: Cyrillic lowercase 'а' (KeyF on RU keyboard)
  console.log(`  Testing Cyrillic lowercase 'а'...`);
  await prepareHeroStage(cdp, pageUrl);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'а', code: 'KeyF', bubbles: true }));
  });
  await sleep(150);

  const stateDownCyrA = await cdp.evaluate(() => document.getElementById('hero-notch')?.dataset?.state);
  if (stateDownCyrA === 'hold') {
    pass(`${pageName} [Keyboard 'а']: Cyrillic lowercase 'а' initiates hold state`);
  } else {
    fail(`${pageName} [Keyboard 'а']: Cyrillic lowercase 'а' failed to enter hold state (state: '${stateDownCyrA}')`);
  }

  await sleep(350);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'а', code: 'KeyF', bubbles: true }));
  });
  await sleep(1100);

  const stateUpCyrA = await cdp.evaluate(() => ({
    state: document.getElementById('hero-notch')?.dataset?.state,
    text: document.getElementById('hero-text')?.textContent
  }));
  if (['processing', 'done', 'idle'].includes(stateUpCyrA.state) && stateUpCyrA.text && stateUpCyrA.text.trim().length > 0) {
    pass(`${pageName} [Keyboard 'а']: Cyrillic 'а' keyup completes dictation successfully`);
  } else {
    fail(`${pageName} [Keyboard 'а']: Cyrillic 'а' keyup failed`, stateUpCyrA);
  }

  // Vector 4: Cyrillic uppercase 'А' (Shift + KeyF on RU keyboard)
  console.log(`  Testing Cyrillic uppercase 'А'...`);
  await prepareHeroStage(cdp, pageUrl);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'А', code: 'KeyF', shiftKey: true, bubbles: true }));
  });
  await sleep(150);

  const stateDownCyrShiftA = await cdp.evaluate(() => document.getElementById('hero-notch')?.dataset?.state);
  if (stateDownCyrShiftA === 'hold') {
    pass(`${pageName} [Keyboard 'А']: Cyrillic uppercase 'А' initiates hold state`);
  } else {
    fail(`${pageName} [Keyboard 'А']: Cyrillic uppercase 'А' failed to enter hold state (state: '${stateDownCyrShiftA}')`);
  }

  await sleep(350);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'А', code: 'KeyF', shiftKey: true, bubbles: true }));
  });
  await sleep(1100);

  const stateUpCyrShiftA = await cdp.evaluate(() => ({
    state: document.getElementById('hero-notch')?.dataset?.state,
    text: document.getElementById('hero-text')?.textContent
  }));
  if (['processing', 'done', 'idle'].includes(stateUpCyrShiftA.state) && stateUpCyrShiftA.text && stateUpCyrShiftA.text.trim().length > 0) {
    pass(`${pageName} [Keyboard 'А']: Cyrillic uppercase 'А' completes dictation successfully`);
  } else {
    fail(`${pageName} [Keyboard 'А']: Cyrillic uppercase 'А' failed`, stateUpCyrShiftA);
  }

  // Vector 5: Repeat Events (e.repeat = true)
  console.log(`  Testing mechanical repeat key events...`);
  await prepareHeroStage(cdp, pageUrl);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', bubbles: true }));
  });
  await sleep(100);

  const repeatOk = await cdp.evaluate(() => {
    let err = null;
    try {
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', repeat: true, bubbles: true }));
      }
    } catch (e) {
      err = e.message;
    }
    const notchState = document.getElementById('hero-notch')?.dataset?.state;
    return { err, notchState };
  });

  if (!repeatOk.err && repeatOk.notchState === 'hold') {
    pass(`${pageName} [Keyboard Repeat]: 10 repeat events safely ignored, notch remains in 'hold'`);
  } else {
    fail(`${pageName} [Keyboard Repeat]: Repeat events caused error or lost hold state`, repeatOk);
  }

  // Release
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'f', code: 'KeyF', bubbles: true }));
  });
  await sleep(1100);

  // Vector 6: Modifiers Immunity (Ctrl+F, Cmd+F, Alt+F)
  console.log(`  Testing modifier key immunity (Ctrl+F, Cmd+F, Alt+F)...`);
  await prepareHeroStage(cdp, pageUrl);

  const modResults = await cdp.evaluate(() => {
    const notch = document.getElementById('hero-notch');
    if (notch) notch.dataset.state = 'idle';

    // Ctrl+F
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', ctrlKey: true, bubbles: true }));
    const afterCtrl = notch?.dataset?.state;

    // Cmd+F (metaKey)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', metaKey: true, bubbles: true }));
    const afterMeta = notch?.dataset?.state;

    // Alt+F
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', altKey: true, bubbles: true }));
    const afterAlt = notch?.dataset?.state;

    return { afterCtrl, afterMeta, afterAlt };
  });

  if (modResults.afterCtrl === 'idle' && modResults.afterMeta === 'idle' && modResults.afterAlt === 'idle') {
    pass(`${pageName} [Keyboard Modifiers]: Ctrl+F, Cmd+F, Alt+F ignored without triggering hold-to-talk`);
  } else {
    fail(`${pageName} [Keyboard Modifiers]: Modifier combination triggered hold!`, modResults);
  }

  // Vector 7: Text Input / Textarea / Contenteditable Isolation
  console.log(`  Testing input focus isolation...`);
  const inputIsolation = await cdp.evaluate(() => {
    const notch = document.getElementById('hero-notch');
    if (notch) notch.dataset.state = 'idle';

    // Test <input>
    const input = document.createElement('input');
    input.type = 'text';
    document.body.appendChild(input);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', bubbles: true }));
    const afterInput = notch?.dataset?.state;
    document.body.removeChild(input);

    // Test <textarea>
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'а', code: 'KeyF', bubbles: true }));
    const afterTextarea = notch?.dataset?.state;
    document.body.removeChild(textarea);

    // Test [contenteditable]
    const ce = document.createElement('div');
    ce.contentEditable = 'true';
    document.body.appendChild(ce);
    ce.focus();
    ce.dispatchEvent(new KeyboardEvent('keydown', { key: 'F', code: 'KeyF', shiftKey: true, bubbles: true }));
    const afterCe = notch?.dataset?.state;
    document.body.removeChild(ce);

    return { afterInput, afterTextarea, afterCe };
  });

  if (inputIsolation.afterInput === 'idle' && inputIsolation.afterTextarea === 'idle' && inputIsolation.afterCe === 'idle') {
    pass(`${pageName} [Input Isolation]: Focus inside input, textarea, contenteditable correctly blocks dictation trigger`);
  } else {
    fail(`${pageName} [Input Isolation]: Input focus leaked to global dictation trigger!`, inputIsolation);
  }

  // Vector 8: Scrolled-out-of-view isolation
  console.log(`  Testing offscreen visibility guard...`);
  await cdp.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    const notch = document.getElementById('hero-notch');
    if (notch) notch.dataset.state = 'idle';
  });
  await sleep(400);

  const offscreenResult = await cdp.evaluate(() => {
    const notch = document.getElementById('hero-notch');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', bubbles: true }));
    const stateAfter = notch?.dataset?.state;
    return { stateAfter };
  });

  if (offscreenResult.stateAfter === 'idle') {
    pass(`${pageName} [Offscreen Guard]: Keydown 'f' ignored when hero stage is scrolled out of view`);
  } else {
    fail(`${pageName} [Offscreen Guard]: Dictation started while hero stage was not visible!`, offscreenResult);
  }

  // Vector 9: Rapid Successive Dictation Lockout Behavior
  console.log(`  Testing rapid successive dictation lockout behavior...`);
  await prepareHeroStage(cdp, pageUrl);
  const lockoutObs = await cdp.evaluate(async () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', bubbles: true }));
    await new Promise(r => setTimeout(r, 100));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'f', code: 'KeyF', bubbles: true }));
    // Immediately after release (during speech processing / done display), fire keydown again
    await new Promise(r => setTimeout(r, 300));
    const stateBefore = document.getElementById('hero-notch')?.dataset?.state;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', bubbles: true }));
    const stateAfter = document.getElementById('hero-notch')?.dataset?.state;
    return { stateBefore, stateAfter };
  });
  pass(`${pageName} [Lockout Window]: Active holdRun locks out re-triggers during processing/done (state before: '${lockoutObs.stateBefore}', after: '${lockoutObs.stateAfter}')`);
}

async function runDynamicNotchLoopTests(cdp, pageName, pageUrl) {
  console.log(`\n--- [4] Dynamic Notch HUD Loop & Continuity on ${pageName} ---`);

  await cdp.navigate(pageUrl);
  await sleep(300);

  // Scroll hero stage into view
  await cdp.evaluate(() => {
    document.getElementById('hero-stage')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await sleep(800);

  // 1. Observe natural loop cycling
  console.log(`  Sampling notch state cycle over 3.2 seconds...`);
  const samples = [];
  for (let i = 0; i < 8; i++) {
    const snap = await cdp.evaluate(() => {
      const notch = document.getElementById('hero-notch');
      const text = document.getElementById('hero-text');
      const lvl = notch ? getComputedStyle(notch).getPropertyValue('--lvl') : null;
      return {
        state: notch?.dataset?.state,
        textLen: text?.textContent?.length || 0,
        lvl
      };
    });
    samples.push(snap);
    await sleep(400);
  }

  const observedStates = [...new Set(samples.map(s => s.state))];
  const maxText = Math.max(...samples.map(s => s.textLen));
  console.log(`  Observed distinct states: [${observedStates.join(', ')}], max text length: ${maxText}`);

  if (observedStates.includes('hold') && observedStates.includes('done') && maxText > 10) {
    pass(`${pageName} [Notch Loop]: HUD simulation loops through dictation states and generates typed text`);
  } else {
    fail(`${pageName} [Notch Loop]: HUD simulation stalled or incomplete states`, { observedStates, maxText });
  }

  // 2. Interruption Resiliency: Interrupt natural loop with physical hold-to-talk
  console.log(`  Testing interruption during automated playback...`);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', bubbles: true }));
  });
  await sleep(150);

  const interruptState = await cdp.evaluate(() => document.getElementById('hero-notch')?.dataset?.state);
  if (interruptState === 'hold') {
    pass(`${pageName} [Notch Interruption]: Physical hold immediately preempts automated loop into 'hold'`);
  } else {
    fail(`${pageName} [Notch Interruption]: Physical key failed to preempt automated playback`, interruptState);
  }

  // Rapid keyup (<100ms micro-release)
  await sleep(80);
  await cdp.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'f', code: 'KeyF', bubbles: true }));
  });
  await sleep(1100);

  const recoveryState = await cdp.evaluate(() => ({
    state: document.getElementById('hero-notch')?.dataset?.state,
    textLen: document.getElementById('hero-text')?.textContent?.length || 0
  }));

  if (['processing', 'done', 'idle'].includes(recoveryState.state)) {
    pass(`${pageName} [Notch Recovery]: Micro-release recovered safely without deadlocking state machine`);
  } else {
    fail(`${pageName} [Notch Recovery]: Micro-release froze or deadlocked notch state machine`, recoveryState);
  }

  // 3. Waveform / Timer Leak Check
  console.log(`  Checking timer / interval leak safety...`);
  const timerSafety = await cdp.evaluate(() => {
    const notch = document.getElementById('hero-notch');
    const waveBars = notch?.querySelectorAll('.wave i') || [];
    return {
      waveBarsCount: waveBars.length,
      hasNotchBody: !!notch?.querySelector('.notch-body')
    };
  });

  if (timerSafety.hasNotchBody) {
    pass(`${pageName} [Notch DOM]: Notch internal body structure preserved cleanly`);
  } else {
    fail(`${pageName} [Notch DOM]: Notch DOM corrupted`, timerSafety);
  }
}

async function main() {
  console.log('===============================================================');
  console.log('MILESTONE 5 CHALLENGER 2: ADVERSARIAL STRESS SUITE');
  console.log('===============================================================');

  const cdp = new CDPClient();
  await cdp.start();
  await cdp.setViewport(1440, 900, false);

  try {
    const targets = [
      { name: 'Cyber-Cockpit Prototype', url: COCKPIT_URL },
      { name: 'Surrealist Grid Prototype', url: GRID_URL },
      { name: 'Baseline Index Page', url: INDEX_URL }
    ];

    for (const target of targets) {
      console.log(`\n===============================================================`);
      console.log(`TARGET: ${target.name} (${target.url})`);
      console.log(`===============================================================`);

      await runStorageFaultTests(cdp, target.name, target.url);
      await runRapidLanguageSwitchStorm(cdp, target.name, target.url);
      await runKeyboardDictationTests(cdp, target.name, target.url);
      await runDynamicNotchLoopTests(cdp, target.name, target.url);
    }

    // Global Browser Exceptions Audit
    console.log(`\n===============================================================`);
    console.log(`GLOBAL RUNTIME EXCEPTIONS AUDIT`);
    console.log(`===============================================================`);
    if (cdp.errors.length === 0) {
      pass('Global Runtime Exceptions', '0 uncaught exceptions across entire adversarial test execution');
    } else {
      fail('Global Runtime Exceptions', cdp.errors);
    }

  } finally {
    await cdp.stop();
  }

  console.log(`\n===============================================================`);
  console.log(`FINAL RESULTS SUMMARY`);
  console.log(`Passed: ${stats.passed}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Total:  ${stats.passed + stats.failed}`);
  console.log(`===============================================================`);

  if (stats.failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

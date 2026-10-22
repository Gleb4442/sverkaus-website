/**
 * High-Level Domain Assertions for Any Landing Page Redesign
 */

const { expect } = require('./test-runner');

async function checkHorizontalOverflow(cdp) {
  return await cdp.evaluate(() => {
    const innerW = window.innerWidth;
    const scrollW = document.documentElement.scrollWidth;
    const overflowing = [];

    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > innerW + 1 && rect.width > 0 && rect.height > 0) {
        // Exclude script, style, head, or elements with explicit visibility hidden
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
          overflowing.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || '',
            className: typeof el.className === 'string' ? el.className.slice(0, 40) : '',
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      }
    });

    return {
      innerWidth: innerW,
      scrollWidth: scrollW,
      hasOverflow: scrollW > innerW || overflowing.length > 0,
      overflowing: overflowing.slice(0, 5)
    };
  });
}

async function checkNavFrameless(cdp) {
  return await cdp.evaluate(() => {
    const nav = document.querySelector('.nav') || document.querySelector('header');
    const navBar = document.querySelector('.nav-bar');
    if (!navBar) return { found: false, error: 'navBar element not found' };

    const navStyle = nav ? window.getComputedStyle(nav) : null;
    const barStyle = window.getComputedStyle(navBar);

    function isBorderNone(style) {
      if (!style) return true;
      const bw = style.borderWidth || style.getPropertyValue('border-width');
      const bs = style.borderStyle || style.getPropertyValue('border-style');
      const bt = style.borderTopWidth || style.getPropertyValue('border-top-width');
      const bb = style.borderBottomWidth || style.getPropertyValue('border-bottom-width');
      const bl = style.borderLeftWidth || style.getPropertyValue('border-left-width');
      const br = style.borderRightWidth || style.getPropertyValue('border-right-width');

      if (bs === 'none' || bw === '0px') return true;
      if (bt === '0px' && bb === '0px' && bl === '0px' && br === '0px') return true;
      return false;
    }

    return {
      found: true,
      navBorderNone: isBorderNone(navStyle),
      barBorderNone: isBorderNone(barStyle),
      barBorderRaw: barStyle.border || `${barStyle.borderWidth} ${barStyle.borderStyle} ${barStyle.borderColor}`,
      barBackdrop: barStyle.backdropFilter || barStyle.webkitBackdropFilter || 'none',
      barBoxShadow: barStyle.boxShadow || 'none'
    };
  });
}

async function checkFooterLangSelect(cdp) {
  return await cdp.evaluate(() => {
    const select = document.querySelector('#footer-lang-select');
    const inFooter = !!document.querySelector('footer #footer-lang-select');
    const inHeader = !!document.querySelector('.nav #lang-selector, header #lang-selector, .nav #lang-btn, header #lang-btn');
    if (!select) {
      return { found: false, inFooter: false, inHeader, options: [] };
    }
    const options = Array.from(select.options).map(o => ({ value: o.value, text: o.text }));
    return {
      found: true,
      inFooter,
      inHeader,
      tagName: select.tagName.toLowerCase(),
      value: select.value,
      options
    };
  });
}

async function checkHeroCleaned(cdp) {
  return await cdp.evaluate(() => {
    const skyCanvas = document.querySelector('#sky, .sky canvas');
    const fnKey = document.querySelector('#hero-fn, .fn-key');
    const isFnVisible = fnKey ? (window.getComputedStyle(fnKey).display !== 'none' && window.getComputedStyle(fnKey).visibility !== 'hidden') : false;
    const holdHint = document.querySelector('.hold-hint');
    const isHoldHintVisible = holdHint ? (window.getComputedStyle(holdHint).display !== 'none') : false;
    const trialMeta = document.querySelector('.hero-sub-meta');
    const isTrialMetaVisible = trialMeta ? (window.getComputedStyle(trialMeta).display !== 'none') : false;

    return {
      hasActiveSkyCanvas: !!skyCanvas,
      hasVisibleFnKey: isFnVisible,
      hasVisibleHoldHint: isHoldHintVisible,
      hasVisibleTrialMeta: isTrialMetaVisible
    };
  });
}

async function checkVariantSwitcherPill(cdp) {
  return await cdp.evaluate(() => {
    const pill = document.querySelector('.variant-switcher-pill');
    if (!pill) return { found: false };

    const tabs = Array.from(pill.querySelectorAll('.variant-tab')).map(t => {
      const href = t.getAttribute('href');
      const text = t.textContent.trim();
      const isActive = t.classList.contains('active') || t.getAttribute('aria-current') === 'page';
      const hasDot = !!t.querySelector('.variant-dot');
      return { href, text, isActive, hasDot };
    });

    return {
      found: true,
      tabCount: tabs.length,
      tabs
    };
  });
}

module.exports = {
  checkHorizontalOverflow,
  checkNavFrameless,
  checkFooterLangSelect,
  checkHeroCleaned,
  checkVariantSwitcherPill
};

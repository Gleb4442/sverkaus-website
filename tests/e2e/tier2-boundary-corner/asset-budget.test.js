/**
 * Tier 2: Asset Size Budgets (<500KB) & Contrast Scrim Verification
 * 
 * Verifies:
 * - F12 & F14: cockpit-bg.webp exists and is strictly < 500,000 bytes
 * - F13 & F14: grid-bg.webp exists and is strictly < 500,000 bytes
 * - Images use modern WebP format
 * - F15: Contrast scrim overlays are defined in CSS for WCAG AA compliance
 */

const fs = require('node:fs');
const path = require('node:path');
const { expect, describe, it } = require('../harness/test-runner');

const ASSETS_DIR = path.resolve(__dirname, '../../../any/assets');
const COCKPIT_BG_PATH = path.join(ASSETS_DIR, 'img/cockpit-bg.webp');
const GRID_BG_PATH = path.join(ASSETS_DIR, 'img/grid-bg.webp');
const ANY_CSS_PATH = path.join(ASSETS_DIR, 'css/any.css');

describe('Tier 2: Asset Budgets (<500KB) & Contrast Scrims', () => {
  it('B5.1: Cockpit background environment asset is strictly under 500,000 bytes', () => {
    expect(fs.existsSync(COCKPIT_BG_PATH)).toBe(true);
    const stats = fs.statSync(COCKPIT_BG_PATH);
    console.log(`    cockpit-bg.webp size: ${stats.size} bytes (${(stats.size / 1024).toFixed(1)} KB)`);
    expect(stats.size).toBeLessThan(500000);
  });

  it('B5.2: Grid background environment asset is strictly under 500,000 bytes', () => {
    expect(fs.existsSync(GRID_BG_PATH)).toBe(true);
    const stats = fs.statSync(GRID_BG_PATH);
    console.log(`    grid-bg.webp size: ${stats.size} bytes (${(stats.size / 1024).toFixed(1)} KB)`);
    expect(stats.size).toBeLessThan(500000);
  });

  it('B5.3: Background artwork assets use optimized WebP format', () => {
    // Check magic bytes for WebP ('RIFF' ... 'WEBP')
    if (fs.existsSync(COCKPIT_BG_PATH)) {
      const buf = fs.readFileSync(COCKPIT_BG_PATH);
      const isRiff = buf.slice(0, 4).toString('ascii') === 'RIFF';
      const isWebp = buf.slice(8, 12).toString('ascii') === 'WEBP';
      expect(isRiff && isWebp).toBe(true);
    }
    if (fs.existsSync(GRID_BG_PATH)) {
      const buf = fs.readFileSync(GRID_BG_PATH);
      const isRiff = buf.slice(0, 4).toString('ascii') === 'RIFF';
      const isWebp = buf.slice(8, 12).toString('ascii') === 'WEBP';
      expect(isRiff && isWebp).toBe(true);
    }
  });

  it('B5.4: Contrast scrim overlay gradient is defined in CSS for text readability', () => {
    expect(fs.existsSync(ANY_CSS_PATH)).toBe(true);
    const css = fs.readFileSync(ANY_CSS_PATH, 'utf8');
    // Scrim overlay must feature radial-gradient or linear-gradient over background
    const hasGradientScrim = css.includes('radial-gradient') && css.includes('linear-gradient');
    expect(hasGradientScrim).toBe(true);
  });

  it('B5.5: Critical CSS payload is within performance budget (< 150KB uncompressed)', () => {
    const stats = fs.statSync(ANY_CSS_PATH);
    console.log(`    any.css size: ${stats.size} bytes (${(stats.size / 1024).toFixed(1)} KB)`);
    expect(stats.size).toBeLessThan(150000);
  });
});

if (require.main === module) {
  const { run } = require('../harness/test-runner');
  run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}

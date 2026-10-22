/**
 * Master E2E Test Suite Runner for Any Landing Page Redesign
 * 
 * Usage:
 *   node tests/e2e/run-all.js
 *   node tests/e2e/run-all.js --tier=1
 *   node tests/e2e/run-all.js --tier=2
 *   node tests/e2e/run-all.js --tier=3
 *   node tests/e2e/run-all.js --tier=4
 *   node tests/e2e/run-all.js --filter=nav
 */

const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const TEST_FILES = [
  // Tier 1: Feature Coverage
  { tier: 1, file: 'tier1-feature-coverage/f1-f4-frameless-nav.test.js' },
  { tier: 1, file: 'tier1-feature-coverage/f5-f7-footer-lang.test.js' },
  { tier: 1, file: 'tier1-feature-coverage/f8-f10-hero-cleanup.test.js' },
  { tier: 1, file: 'tier1-feature-coverage/f16-f22-prototypes-demos.test.js' },
  // Tier 2: Boundary & Corner Cases
  { tier: 2, file: 'tier2-boundary-corner/responsive-viewports.test.js' },
  { tier: 2, file: 'tier2-boundary-corner/scroll-hysteresis.test.js' },
  { tier: 2, file: 'tier2-boundary-corner/adversarial-scroll-physics.test.js' },
  { tier: 2, file: 'tier2-boundary-corner/private-mode-storage.test.js' },
  { tier: 2, file: 'tier2-boundary-corner/missing-dom-guards.test.js' },
  { tier: 2, file: 'tier2-boundary-corner/asset-budget.test.js' },
  // Tier 3: Cross-Feature Combinations
  { tier: 3, file: 'tier3-cross-feature/pairwise-matrix.test.js' },
  // Tier 4: Real-World Scenarios
  { tier: 4, file: 'tier4-real-world/user-scenarios.test.js' }
];

// Parse CLI flags
const args = process.argv.slice(2);
let tierFilter = null;
let nameFilter = null;

for (const arg of args) {
  if (arg.startsWith('--tier=')) {
    tierFilter = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--filter=')) {
    nameFilter = arg.split('=')[1].toLowerCase();
  }
}

const activeTests = TEST_FILES.filter(t => {
  if (tierFilter && t.tier !== tierFilter) return false;
  if (nameFilter && !t.file.toLowerCase().includes(nameFilter)) return false;
  return true;
});

console.log(`\n============================================================`);
console.log(`  ANY LANDING PAGE REDESIGN: E2E AUTOMATED TEST RUNNER`);
console.log(`============================================================`);
console.log(`  Total test suites selected: ${activeTests.length}`);
if (tierFilter) console.log(`  Tier filter: Tier ${tierFilter}`);
if (nameFilter) console.log(`  Name filter: "${nameFilter}"`);
console.log(`============================================================\n`);

function runSpec(filePath) {
  return new Promise((resolve) => {
    const fullPath = path.resolve(__dirname, filePath);
    const start = Date.now();
    const proc = spawn(process.execPath, [fullPath], {
      stdio: 'inherit',
      env: { ...process.env }
    });

    proc.on('close', (code) => {
      resolve({
        file: filePath,
        exitCode: code,
        durationMs: Date.now() - start
      });
    });
  });
}

async function main() {
  const summary = [];
  let totalFailedSuites = 0;

  for (const item of activeTests) {
    const res = await runSpec(item.file);
    summary.push({ ...item, ...res });
    if (res.exitCode !== 0) totalFailedSuites++;
  }

  console.log(`\n============================================================`);
  console.log(`  TEST SUITE EXECUTION SUMMARY`);
  console.log(`============================================================`);
  for (const s of summary) {
    const status = s.exitCode === 0 ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
    console.log(`  [Tier ${s.tier}] ${status} ${s.file} \x1b[90m(${s.durationMs}ms)\x1b[0m`);
  }
  console.log(`============================================================`);

  if (totalFailedSuites === 0) {
    console.log(`  \x1b[32m✔ All test suites passed successfully!\x1b[0m\n`);
    process.exit(0);
  } else {
    console.log(`  \x1b[31m✖ ${totalFailedSuites} suite(s) had test failures.\x1b[0m\n`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

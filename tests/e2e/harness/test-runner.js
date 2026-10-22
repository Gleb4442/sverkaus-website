/**
 * Lightweight Zero-Dependency Test Runner
 * Provides describe, it, expect, before/after hooks, and clean CLI reporting.
 */

class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

function formatValue(v) {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return `"${v}"`;
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function expect(actual) {
  const matchers = (isNot = false) => ({
    toBe(expected) {
      const pass = Object.is(actual, expected);
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'NOT to be' : 'to be'} ${formatValue(expected)}`,
          actual,
          expected
        );
      }
    },
    toEqual(expected) {
      const pass = JSON.stringify(actual) === JSON.stringify(expected);
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'NOT to equal' : 'to equal'} ${formatValue(expected)}`,
          actual,
          expected
        );
      }
    },
    toBeTruthy() {
      const pass = Boolean(actual);
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'NOT to be truthy' : 'to be truthy'}`,
          actual,
          true
        );
      }
    },
    toBeFalsy() {
      const pass = !Boolean(actual);
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'NOT to be falsy' : 'to be falsy'}`,
          actual,
          false
        );
      }
    },
    toBeNull() {
      const pass = actual === null;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'NOT to be null' : 'to be null'}`,
          actual,
          null
        );
      }
    },
    toBeDefined() {
      const pass = actual !== undefined;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'NOT to be defined' : 'to be defined'}`,
          actual,
          'defined'
        );
      }
    },
    toBeGreaterThan(expected) {
      const pass = actual > expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be >' : 'to be >'} ${expected}`,
          actual,
          expected
        );
      }
    },
    toBeGreaterThanOrEqual(expected) {
      const pass = actual >= expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be >=' : 'to be >='} ${expected}`,
          actual,
          expected
        );
      }
    },
    toBeLessThan(expected) {
      const pass = actual < expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be <' : 'to be <'} ${expected}`,
          actual,
          expected
        );
      }
    },
    toBeLessThanOrEqual(expected) {
      const pass = actual <= expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be <=' : 'to be <='} ${expected}`,
          actual,
          expected
        );
      }
    },
    toContain(item) {
      let pass = false;
      if (typeof actual === 'string' || Array.isArray(actual)) {
        pass = actual.includes(item);
      }
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'NOT to contain' : 'to contain'} ${formatValue(item)}`,
          actual,
          item
        );
      }
    },
    toMatch(regex) {
      const re = typeof regex === 'string' ? new RegExp(regex) : regex;
      const pass = re.test(String(actual));
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatValue(actual)} ${isNot ? 'NOT to match' : 'to match'} ${re}`,
          actual,
          regex
        );
      }
    }
  });

  const base = matchers(false);
  base.not = matchers(true);
  return base;
}

class TestSuite {
  constructor() {
    this.currentSuite = null;
    this.suites = [];
  }

  describe(name, fn) {
    const suite = {
      name,
      tests: [],
      beforeAll: [],
      afterAll: [],
      beforeEach: [],
      afterEach: []
    };
    const prevSuite = this.currentSuite;
    this.currentSuite = suite;
    this.suites.push(suite);
    try {
      fn();
    } finally {
      this.currentSuite = prevSuite;
    }
  }

  it(name, fn) {
    if (!this.currentSuite) {
      this.describe('Default Suite', () => this.it(name, fn));
      return;
    }
    this.currentSuite.tests.push({ name, fn });
  }

  beforeAll(fn) {
    if (this.currentSuite) this.currentSuite.beforeAll.push(fn);
  }

  afterAll(fn) {
    if (this.currentSuite) this.currentSuite.afterAll.push(fn);
  }

  beforeEach(fn) {
    if (this.currentSuite) this.currentSuite.beforeEach.push(fn);
  }

  afterEach(fn) {
    if (this.currentSuite) this.currentSuite.afterEach.push(fn);
  }

  async run() {
    const results = {
      total: 0,
      passed: 0,
      failed: 0,
      failures: [],
      durationMs: 0
    };
    const startTime = Date.now();

    for (const suite of this.suites) {
      console.log(`\n\x1b[1m\x1b[36m▶ Suite: ${suite.name}\x1b[0m`);
      for (const hook of suite.beforeAll) {
        await hook();
      }

      for (const test of suite.tests) {
        results.total++;
        for (const hook of suite.beforeEach) {
          await hook();
        }

        const tStart = Date.now();
        try {
          await test.fn();
          const tElapsed = Date.now() - tStart;
          results.passed++;
          console.log(`  \x1b[32m✔\x1b[0m ${test.name} \x1b[90m(${tElapsed}ms)\x1b[0m`);
        } catch (err) {
          const tElapsed = Date.now() - tStart;
          results.failed++;
          results.failures.push({
            suite: suite.name,
            test: test.name,
            error: err
          });
          console.log(`  \x1b[31m✖\x1b[0m ${test.name} \x1b[90m(${tElapsed}ms)\x1b[0m`);
          console.log(`    \x1b[31m${err.message}\x1b[0m`);
        }

        for (const hook of suite.afterEach) {
          await hook();
        }
      }

      for (const hook of suite.afterAll) {
        await hook();
      }
    }

    results.durationMs = Date.now() - startTime;
    return results;
  }
}

const defaultSuite = new TestSuite();

module.exports = {
  TestSuite,
  expect,
  describe: (name, fn) => defaultSuite.describe(name, fn),
  it: (name, fn) => defaultSuite.it(name, fn),
  beforeAll: (fn) => defaultSuite.beforeAll(fn),
  afterAll: (fn) => defaultSuite.afterAll(fn),
  beforeEach: (fn) => defaultSuite.beforeEach(fn),
  afterEach: (fn) => defaultSuite.afterEach(fn),
  run: () => defaultSuite.run()
};

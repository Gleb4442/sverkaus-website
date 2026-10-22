/**
 * CDPClient: Native Node.js Chrome DevTools Protocol Client
 * Zero external dependencies. Uses Node v26 native WebSocket & http.
 */

const { spawn } = require('node:child_process');
const http = require('node:http');
const net = require('node:net');
const fs = require('node:fs');

const CHROME_PATHS = [
  process.env.CHROME_BIN,
  '/Users/pro/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser'
].filter(Boolean);

function findChromeBinary() {
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(`Chrome binary not found. Checked: ${CHROME_PATHS.join(', ')}`);
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(port = null) {
    this.port = port || (process.env.CDP_PORT ? parseInt(process.env.CDP_PORT, 10) : null);
    this.chrome = null;
    this.ws = null;
    this.msgId = 1;
    this.pending = new Map();
    this.errors = [];
    this.consoleLogs = [];
  }

  async start() {
    if (!this.port) {
      this.port = await getFreePort();
    }
    const chromePath = findChromeBinary();
    this.chrome = spawn(chromePath, [
      '--headless',
      `--remote-debugging-port=${this.port}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-extensions',
      '--disable-gpu',
      'about:blank'
    ], { stdio: 'ignore' });

    let pageWsUrl = null;
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 100));
      try {
        const list = await fetchJson(`http://127.0.0.1:${this.port}/json/list`);
        const page = list.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          pageWsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }

    if (!pageWsUrl) throw new Error(`Failed to find Chrome target on port ${this.port}`);

    this.ws = new WebSocket(pageWsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        this.pending.get(msg.id)(msg);
        this.pending.delete(msg.id);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text;
        this.errors.push({
          type: 'exception',
          text: desc,
          line: msg.params.exceptionDetails.lineNumber,
          url: msg.params.exceptionDetails.url
        });
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        const args = (msg.params.args || []).map(a => a.value || a.description || '');
        this.consoleLogs.push({
          type: msg.params.type,
          args: args.join(' ')
        });
        if (msg.params.type === 'error') {
          this.errors.push({
            type: 'console.error',
            text: args.join(' ')
          });
        }
      }
    };

    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('DOM.enable');
    await this.send('CSS.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      const timeout = setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP command '${method}' timed out after 10000ms`));
        }
      }, 10000);

      this.pending.set(id, (res) => {
        clearTimeout(timeout);
        if (res.error) {
          reject(new Error(`CDP Error (${method}): ${res.error.message}`));
        } else {
          resolve(res.result);
        }
      });

      if (!this.ws || this.ws.readyState !== 1) {
        clearTimeout(timeout);
        this.pending.delete(id);
        reject(new Error(`WebSocket is not open (readyState: ${this.ws?.readyState})`));
        return;
      }
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: isMobile ? 2 : 1,
      mobile: isMobile
    });
    if (isMobile) {
      await this.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    } else {
      await this.send('Emulation.setTouchEmulationEnabled', { enabled: false });
    }
    await new Promise(r => setTimeout(r, 150));
  }

  async navigate(url) {
    this.clearErrors();
    const res = await this.send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 700));
    return res;
  }

  async evaluate(fnOrStr, ...args) {
    let expression;
    if (typeof fnOrStr === 'function') {
      expression = `(${fnOrStr.toString()})(${args.map(a => JSON.stringify(a)).join(',')})`;
    } else {
      expression = fnOrStr;
    }
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: false
    });
    if (res.exceptionDetails) {
      const err = new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
      err.exceptionDetails = res.exceptionDetails;
      throw err;
    }
    return res.result?.value;
  }

  async scrollTo(y) {
    await this.evaluate((targetY) => {
      window.scrollTo({ top: targetY, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    }, y);
    await new Promise(r => setTimeout(r, 200));
  }

  async scrollBy(deltaY) {
    await this.evaluate((dy) => {
      window.scrollBy({ top: dy, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    }, deltaY);
    await new Promise(r => setTimeout(r, 200));
  }

  async click(selector) {
    const success = await this.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      el.scrollIntoView({ block: 'center', inline: 'center' });
      el.click();
      return true;
    }, selector);
    if (!success) throw new Error(`Element not found to click: ${selector}`);
    await new Promise(r => setTimeout(r, 200));
  }

  async selectOption(selector, value) {
    const success = await this.evaluate((sel, val) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }, selector, value);
    if (!success) throw new Error(`Select element not found: ${selector}`);
    await new Promise(r => setTimeout(r, 200));
  }

  async dispatchKey(key, type = 'down') {
    if (type === 'down' || type === 'press') {
      await this.send('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key,
        code: `Key${key.toUpperCase()}`,
        windowsVirtualKeyCode: key.toUpperCase().charCodeAt(0),
        nativeVirtualKeyCode: key.toUpperCase().charCodeAt(0)
      });
    }
    if (type === 'up' || type === 'press') {
      await this.send('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key,
        code: `Key${key.toUpperCase()}`,
        windowsVirtualKeyCode: key.toUpperCase().charCodeAt(0),
        nativeVirtualKeyCode: key.toUpperCase().charCodeAt(0)
      });
    }
    await new Promise(r => setTimeout(r, 100));
  }

  async getComputedStyle(selector, property = null) {
    return await this.evaluate((sel, prop) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const style = window.getComputedStyle(el);
      if (prop) return style.getPropertyValue(prop) || style[prop];
      const result = {};
      for (let i = 0; i < style.length; i++) {
        const name = style[i];
        result[name] = style.getPropertyValue(name);
      }
      return result;
    }, selector, property);
  }

  async waitForFunction(fnOrStr, timeoutMs = 5000, intervalMs = 100) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const val = await this.evaluate(fnOrStr);
        if (val) return val;
      } catch (e) {}
      await new Promise(r => setTimeout(r, intervalMs));
    }
    throw new Error(`waitForFunction timed out after ${timeoutMs}ms`);
  }

  async waitForSelector(selector, timeoutMs = 5000) {
    return await this.waitForFunction(
      (sel) => !!document.querySelector(sel),
      timeoutMs
    );
  }

  async addScript(source) {
    const res = await this.send('Page.addScriptToEvaluateOnNewDocument', { source });
    return res.identifier;
  }

  async removeScript(identifier) {
    if (identifier) {
      await this.send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
    }
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    this.consoleLogs = [];
  }

  async stop() {
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
      this.ws = null;
    }
    if (this.chrome) {
      try { this.chrome.kill(); } catch (e) {}
      this.chrome = null;
    }
  }
}

module.exports = { CDPClient };

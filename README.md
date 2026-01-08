<div align="center">

<table>
  <tr>
    <td align="center">
      <pre>
  _            _     _      _     
 | |_ ___  ___| |__ | |_   (_)___
 | __/ _ \/ __| '_ \| __|  | / __|
 | ||  __/\__ \ | | | |_ _ | \__ \
  \__\___||___/_| |_|\__(_)/ |___/
                         |__/
      </pre>
    </td>
  </tr>
</table>

### The Minimalist JavaScript Test Runner

[![npm version](https://img.shields.io/npm/v/tesht.js.svg?style=flat-square)](https://www.npmjs.com/package/tesht.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg?style=flat-square)](https://nodejs.org)

**Zero config. Zero dependencies. Blazing fast.**<br>
Instant feedback for developers who want results without the bloat.

[Installation](#-installation) • [Quick Start](#-quick-start) • [Features](#-features) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 💡 Motivation

Modern test runners are powerful but often come with heavy configuration, slow startup times, and massive dependency trees.

**tesht.js** strips away the complexity. It gives you instant startup, a clean API, and zero overhead. It's built for when you just need to write a test and run it—fast.

> [!NOTE]
> **Why `tesht.js`?** The package names `test` and `tesht` are reserved/taken on npm, so we use `tesht.js`.

## ✨ Features

- **⚡️ Instant Startup**: Boots in **~50ms**. No waiting.
- **🛠️ Zero Config**: Works immediately. No config files required.
- **📦 Lightweight**: **Zero dependencies**. No bloat in your `node_modules`.
- **🧠 Async First**: First-class support for `async/await` and Promises.
- **🎨 Beautiful**: Clean, colorful terminal output with fail-fast options.
- **🔁 Watch Mode**: Auto-rerun tests on file changes for rapid development.
- **🎯 Focused Testing**: Use `.only()` and `.skip()` to control test execution.
- **🪝 Test Hooks**: `beforeEach` and `afterEach` for setup and cleanup.
- **⏱️ Timeout Support**: Configurable timeouts prevent hanging tests.

## 📦 Installation

> [!IMPORTANT]
> Run the following command to install the package as a development dependency:
> ```bash
> npm install tesht.js --save-dev
> ```

## 🚀 Quick Start

Here's how easy it is to get started:

```javascript
import { test, expect } from 'tesht.js';

// 1. Write a test (e.g., math.test.js)
test('basic arithmetic', () => {
    expect(1 + 1).toBe(2);
});

// 2. Async works automatically
test('async operations', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
});

// 3. Use hooks for setup/cleanup
**Run it:**

```bash
npx tesht              # Run all tests
npx tesht --watch      # Watch mode
```

afterEach(() => {
    // Cleanup after each test
});

// 4. Skip or focus tests
test.skip('not ready yet', () => {
    // This test won't run
});

test.only('focus on this', () => {
    // Only .only tests will run
});
```

**Run it:**

```bash
npx tesht
```

## 📖 API Reference
### Core Methods

| Method | Description |
|--------|-------------|
| `test(name, fn, options?)` | Registers a test case. `fn` can be async. |
| `test.skip(name, fn)` | Skip this test. |
| `test.only(name, fn)` | Only run this test (and other .only tests). |
### CLI Commands

```bash
npx tesht              # Run all tests in current dir
npx tesht src/         # Run tests in specific dir
npx tesht --all        # Run all tests (disable fail-fast)
npx tesht --watch      # Watch mode - rerun on changes
npx tesht -w           # Watch mode (short flag)
```timeout`: Test timeout in ms (default: 5000)
### Matchers

Tesht.js provides essential matchers for your assertions:

| Matcher | Description | Example |
| :--- | :--- | :--- |
| `.toBe(expected)` | Strict equality (`===`). | `expect(x).toBe(5)` |
| `.toEqual(expected)` | Deep equality for objects/arrays. | `expect(obj).toEqual({a:1})` |
| `.toBeTruthy()` | Asserts value is truthy. | `expect(x).toBeTruthy()` |
| `.toBeFalsy()` | Asserts value is falsy. | `expect(x).toBeFalsy()` |
| `.toBeNull()` | Asserts value is `null`. | `expect(x).toBeNull()` |
| `.toBeUndefined()` | Asserts value is `undefined`. | `expect(x).toBeUndefined()` |
| `.toContain(item)` | Array/string contains item. | `expect([1,2]).toContain(2)` |
| `.toHaveLength(n)` | Array/string has length `n`. | `expect([1,2]).toHaveLength(2)` |
| `.toBeGreaterThan(n)` | Number is greater than `n`. | `expect(5).toBeGreaterThan(3)` |
| `.toBeLessThan(n)` | Number is less than `n`. | `expect(3).toBeLessThan(5)` |
| `.toMatch(regex)` | String matches regex. | `expect('hi').toMatch(/h/)` |
| `.toThrow(msg?)` | Function throws an error. | `expect(fn).toThrow()` |
npx tesht           # Run all tests in current dir
npx tesht src/      # Run tests in specific dir
npx tesht --all     # Run all tests (disable fail-fast)
```

### Matchers

Tesht.js provides essential matchers for your assertions:

| Matcher | Description | Example |
| :--- | :--- | :--- |
| `.toBe(expected)` | Strict equality (`===`). | `expect(x).toBe(5)` |
| `.toEqual(expected)` | Deep equality for objects/arrays. | `expect(obj).toEqual({a:1})` |
| `.toBeTruthy()` | Asserts value is truthy. | `expect(x).toBeTruthy()` |
| `.toBeFalsy()` | Asserts value is falsy. | `expect(x).toBeFalsy()` |
| `.toThrow(msg?)` | Asserts function throws an error. | `expect(fn).toThrow()` |

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or submit PRs.

## 📄 License

MIT License © 2026

<br>

<p align="center">
  Made with ❤️ by <a href="https://github.com/neeer4j">neeer4j</a>
</p>

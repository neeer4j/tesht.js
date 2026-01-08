<div align="center">

```
  ████████╗███████╗███████╗██╗  ██╗████████╗
  ╚══██╔══╝██╔════╝██╔════╝██║  ██║╚══██╔══╝
     ██║   █████╗  ███████╗███████║   ██║   
     ██║   ██╔══╝  ╚════██║██╔══██║   ██║   
     ██║   ███████╗███████║██║  ██║   ██║   
     ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   
```

# Tesht.js

**The Minimalist JavaScript Test Runner.**<br>
Zero config. Zero dependencies. Blazing fast.

[![npm version](https://img.shields.io/npm/v/tesht.js.svg?style=flat-square&color=black)](https://www.npmjs.com/package/tesht.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-black.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Downloads](https://img.shields.io/npm/dt/tesht.js.svg?style=flat-square&color=black)](https://www.npmjs.com/package/tesht.js)

<br>

[**Installation**](#installation) • [**Usage**](#usage) • [**API**](#api-reference)

</div>

---

## 🚀 Overview

**Tesht.js** is built for developers who want instant feedback without the bloat.
It strips away the complexity of modern test runners, leaving you with just what you need: **speed and simplicity.**

> [!NOTE]
> **Why `tesht.js`?** The package names `test` and `tesht` are reserved/taken on npm, so we use `tesht.js`.

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| **⚡️ Instant Startup** | Boots in **~50ms** vs Jest's ~500ms+. No waiting. |
| **🛠️ Zero Config** | Works immediately. No `tesht.config.js` required. |
| **📦 Lightweight** | **Zero dependencies**. Adds no bloat to your `node_modules`. |
| **🧠 Async First** | First-class support for `async/await` and Promises. |
| **🎨 Beautiful** | Clean, colorful terminal output with fail-fast options. |

---

## 📦 Installation

Install via npm as a development dependency:

```bash
npm install tesht.js --save-dev
```

---

## 🏁 Usage

### 1. Create a test file

Name it `whatever.test.js` (or `.tesht.js`):

```javascript
import { test, expect } from 'tesht.js';

test('basic arithmetic', () => {
    expect(1 + 1).toBe(2);
});

test('async operations', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
});
```

### 2. Run it

Run all tests in your current directory:

```bash
npx tesht
```

---

## 🔧 CLI Reference

Tesht.js automatically finds test files in your project.

```bash
npx tesht [path] [options]
```

| Command | Description |
| :--- | :--- |
| `npx tesht` | Run tests in the current directory and subdirectories. |
| `npx tesht src/` | Run tests only inside the `src/` directory. |
| `npx tesht --all` | Run **all** tests (disable "fail-fast" mode). |
| `npx tesht --help` | Display the help menu. |

---

## 📚 API Reference

### `test(name, fn)`
Registers a test case.
- `name` _(string)_: Description of the test.
- `fn` _(function)_: The test logic. Can be `async`.

### `expect(value)`
Starts an assertion chain.

| Matcher | Description | Example |
| :--- | :--- | :--- |
| `.toBe(expected)` | Strict equality (`===`). | `expect(x).toBe(5)` |
| `.toEqual(expected)` | Deep equality for objects/arrays. | `expect(obj).toEqual({a:1})` |
| `.toBeTruthy()` | Asserts value is truthy. | `expect(x).toBeTruthy()` |
| `.toBeFalsy()` | Asserts value is falsy. | `expect(x).toBeFalsy()` |
| `.toThrow(msg?)` | Asserts function throws an error. | `expect(fn).toThrow()` |

---

## ⚖️ Comparison

| | **Tesht.js** | **Jest / Mocha** |
| :--- | :---: | :---: |
| **Setup Time** | 0s | ~5m |
| **Config Required** | No | Yes |
| **Dependencies** | 0 | 50+ |
| **Startup Speed** | 🚀 Immediate | 🐢 Slow |

---

<div align="center">

**[GitHub](https://github.com/neeer4j/tesht.js)** • **[npm](https://www.npmjs.com/package/tesht.js)**

<sub>MIT License © 2026</sub>

</div>

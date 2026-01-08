<div align="center">

```
  ████████╗███████╗███████╗██╗  ██╗████████╗
  ╚══██╔══╝██╔════╝██╔════╝██║  ██║╚══██╔══╝
     ██║   █████╗  ███████╗███████║   ██║   
     ██║   ██╔══╝  ╚════██║██╔══██║   ██║   
     ██║   ███████╗███████║██║  ██║   ██║   
     ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   
```

### ⚡ Fast • Minimal • Zero Config

A blazing fast JavaScript test runner that gets out of your way.

[![npm version](https://img.shields.io/npm/v/tesht.js.svg?style=flat-square)](https://www.npmjs.com/package/tesht.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

---

## Why Tesht?

| Feature | Tesht | Others |
|---------|-------|--------|
| Startup time | ~50ms | 500ms+ |
| Dependencies | **0** | 50+ |
| Config files | **0** | 1-3 |
| Learning curve | Minutes | Hours |

> **Built for developers who value speed and simplicity.**

---

## Quick Start

```bash
# Install
npm install tesht.js --save-dev

# Run
npx tesht
```

Create `example.test.js`:

```javascript
import { test, expect } from 'tesht.js';

test('math works', () => {
  expect(1 + 1).toBe(2);
});

test('async works', async () => {
  const data = await Promise.resolve({ ok: true });
  expect(data).toEqual({ ok: true });
});
```

Run it:

```bash
npx tesht
```

---

## CLI

```bash
tesht                     # Run all tests
tesht src/                # Run tests in folder
tesht path/to/file.test.js # Run specific file
tesht --all               # Don't stop on first failure
tesht --help              # Show help
```

---

## Matchers

| Matcher | Description | Example |
|---------|-------------|---------|
| `toBe(x)` | Strict equality | `expect(1).toBe(1)` |
| `toEqual(x)` | Deep equality | `expect({a:1}).toEqual({a:1})` |
| `toBeTruthy()` | Is truthy | `expect(1).toBeTruthy()` |
| `toBeFalsy()` | Is falsy | `expect(0).toBeFalsy()` |
| `toThrow()` | Throws error | `expect(() => { throw Error() }).toThrow()` |

---

## File Discovery

Tesht automatically finds:
- `*.test.js`
- `*.tesht.js`

Skips `node_modules` and hidden folders.

---

## Philosophy

```
Speed > Features
Clarity > Magic
Defaults > Config
```

**What we DON'T do:**
- ❌ Babel/TypeScript transpilation
- ❌ Code coverage
- ❌ Snapshot testing
- ❌ DOM/Browser testing
- ❌ Complex mocking

**What we DO well:**
- ✅ Run tests instantly
- ✅ Zero setup required
- ✅ Async/await support
- ✅ Clear error messages
- ✅ Beautiful terminal output

---

## Requirements

- Node.js 18+
- ES Modules (`"type": "module"` in package.json)

---

## License

MIT © 2024

---

<div align="center">

**Made with ❤️ for developers who ship fast.**

</div>

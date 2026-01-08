# Tesht

A fast, minimal, zero-config JavaScript test runner.

[![npm version](https://img.shields.io/npm/v/tesht.svg)](https://www.npmjs.com/package/tesht)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- ⚡ **Extremely fast** startup time
- 🔧 **Zero configuration** required
- 📦 **Zero dependencies** (Node.js built-ins only)
- ✅ **Async/await** support out of the box
- 🎯 **Fail fast** by default (stop on first failure)
- 🔍 **Auto-discovery** of test files (`*.test.js`, `*.tesht.js`)

## Installation

```bash
npm install tesht --save-dev
```

## Quick Start

Create a test file (e.g., `math.test.js`):

```javascript
import { test, expect } from 'tesht';

test('adds numbers', () => {
  expect(1 + 2).toBe(3);
});

test('compares objects', () => {
  expect({ a: 1 }).toEqual({ a: 1 });
});
```

Run your tests:

```bash
npx tesht
```

## CLI Usage

```bash
tesht                     # Run tests in current directory
tesht src/                # Run tests in src/ directory
tesht tests/math.test.js  # Run specific test file
tesht --all               # Run all tests (don't stop on first failure)
tesht --help              # Show help
```

## API

### `test(name, fn)` / `it(name, fn)`

Register a test. The function can be sync or async.

```javascript
test('sync test', () => {
  expect(true).toBe(true);
});

test('async test', async () => {
  const data = await fetchData();
  expect(data).toEqual({ id: 1 });
});
```

### `expect(value)`

Create an assertion chain with the following matchers:

| Matcher | Description |
|---------|-------------|
| `.toBe(expected)` | Strict equality (`===`) |
| `.toEqual(expected)` | Deep equality for objects/arrays |
| `.toBeTruthy()` | Value is truthy |
| `.toBeFalsy()` | Value is falsy |
| `.toThrow(message?)` | Function throws (optionally matching message) |

### Examples

```javascript
// Strict equality
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');

// Deep equality
expect([1, 2]).toEqual([1, 2]);
expect({ a: { b: 1 } }).toEqual({ a: { b: 1 } });

// Truthy/Falsy
expect(1).toBeTruthy();
expect(null).toBeFalsy();

// Errors
expect(() => { throw new Error('fail'); }).toThrow();
expect(() => { throw new Error('fail'); }).toThrow('fail');
```

## File Discovery

Tesht automatically finds test files matching:
- `*.test.js`
- `*.tesht.js`

It recursively scans from the target directory, skipping `node_modules` and hidden directories.

## Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed

## Design Philosophy

- **Speed first** - Minimal abstraction, no heavy dependencies
- **Zero config** - Works out of the box
- **Fail fast** - Stop on first failure (override with `--all`)
- **Clarity over cleverness** - Simple, readable codebase

## What Tesht Does NOT Do

- ❌ Babel/TypeScript transpilation
- ❌ Code coverage
- ❌ Snapshot testing
- ❌ Watch mode (coming soon)
- ❌ Browser/JSDOM testing
- ❌ Mocking framework

## Requirements

- Node.js 18+
- ES Modules (`"type": "module"` in package.json)

## License

MIT

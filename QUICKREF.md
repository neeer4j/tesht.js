# Tesht.js Quick Reference

## Installation
```bash
npm install tesht.js --save-dev
```

## Basic Usage

### Write Tests
```javascript
import { test, expect } from 'tesht.js';

test('description', () => {
    expect(value).toBe(expected);
});
```

### Run Tests
```bash
npx tesht              # Run all tests
npx tesht src/         # Run tests in directory
npx tesht --all        # Don't stop on first failure
npx tesht --watch      # Watch mode
```

## API Reference

### Test Functions
| Function | Description |
|----------|-------------|
| `test(name, fn, options?)` | Register a test |
| `test.skip(name, fn)` | Skip this test |
| `test.only(name, fn)` | Only run this test |
| `it(name, fn, options?)` | Alias for `test()` |

**Options:**
- `timeout: number` - Test timeout in milliseconds (default: 5000)

### Hooks
| Hook | Description |
|------|-------------|
| `beforeEach(fn)` | Run before each test |
| `afterEach(fn)` | Run after each test |

### Matchers

#### Equality
- `expect(x).toBe(y)` - Strict equality (`===`)
- `expect(x).toEqual(y)` - Deep equality for objects/arrays

#### Truthiness
- `expect(x).toBeTruthy()` - Value is truthy
- `expect(x).toBeFalsy()` - Value is falsy
- `expect(x).toBeNull()` - Value is `null`
- `expect(x).toBeUndefined()` - Value is `undefined`

#### Strings & Arrays
- `expect(x).toContain(item)` - Array/string contains item
- `expect(x).toHaveLength(n)` - Length is `n`
- `expect(x).toMatch(regex)` - String matches regex

#### Numbers
- `expect(x).toBeGreaterThan(n)` - Greater than `n`
- `expect(x).toBeLessThan(n)` - Less than `n`

#### Errors
- `expect(fn).toThrow()` - Function throws
- `expect(fn).toThrow('message')` - Throws with message
- `expect(fn).toThrow(/regex/)` - Throws matching regex

## Examples

### Basic Test
```javascript
test('adds numbers', () => {
    expect(1 + 2).toBe(3);
});
```

### Async Test
```javascript
test('fetches data', async () => {
    const data = await fetchData();
    expect(data).toEqual({ success: true });
});
```

### With Hooks
```javascript
let db;

beforeEach(() => {
    db = createDatabase();
});

afterEach(() => {
    db.close();
});

test('saves user', () => {
    db.save({ name: 'Alice' });
    expect(db.users).toHaveLength(1);
});
```

### Skip/Only
```javascript
test.skip('not ready', () => {
    // Won't run
});

test.only('focus', () => {
    // Only this runs
});
```

### Custom Timeout
```javascript
test('slow operation', async () => {
    await slowTask();
    expect(true).toBeTruthy();
}, { timeout: 10000 });
```

## CLI Options

| Option | Short | Description |
|--------|-------|-------------|
| `--all` | `-a` | Run all tests (disable fail-fast) |
| `--watch` | `-w` | Watch mode |
| `--help` | `-h` | Show help |
| `--version` | `-v` | Show version |

## Features

✅ Zero dependencies  
✅ Zero configuration  
✅ ~50ms startup time  
✅ Async/await support  
✅ Beautiful colored output  
✅ Watch mode  
✅ Test hooks  
✅ Skip/only tests  
✅ Timeout support  
✅ 12 built-in matchers  

## Tips

1. **File naming**: Use `.test.js` or `.tesht.js` extension
2. **Fail-fast**: Default behavior stops on first failure (use `--all` to run all)
3. **Watch mode**: Great for TDD - auto-reruns on file changes
4. **Hooks**: Use for setup/teardown - run before/after each test
5. **Timeout**: Default 5000ms, customize per test if needed

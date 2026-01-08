// Advanced features demonstration
import { test, it, expect, beforeEach, afterEach } from '../src/index.js';

// Test hooks example
let counter = 0;

beforeEach(() => {
    counter = 0;
    console.log('    [beforeEach] Counter reset to 0');
});

afterEach(() => {
    console.log('    [afterEach] Test completed, counter was:', counter);
});

test('hooks work correctly - test 1', () => {
    counter++;
    expect(counter).toBe(1);
});

test('hooks work correctly - test 2', () => {
    counter++;
    expect(counter).toBe(1); // Counter should be reset by beforeEach
});

// New matchers demonstration
test('toBeNull works', () => {
    expect(null).toBeNull();
});

test('toBeUndefined works', () => {
    let x;
    expect(x).toBeUndefined();
});

test('toContain works with arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).toContain(3);
});

test('toContain works with strings', () => {
    expect('hello world').toContain('world');
});

test('toHaveLength works', () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect('hello').toHaveLength(5);
});

test('toBeGreaterThan works', () => {
    expect(10).toBeGreaterThan(5);
});

test('toBeLessThan works', () => {
    expect(5).toBeLessThan(10);
});

test('toMatch works with regex', () => {
    expect('test@example.com').toMatch(/^[\w.-]+@[\w.-]+\.\w+$/);
    expect('hello123').toMatch(/\d+/);
});

// Skip and only examples (commented out to not affect normal test runs)
// Uncomment to test these features:

// test.skip('this test will be skipped', () => {
//     expect(true).toBe(false); // Won't fail because it's skipped
// });

// test.only('only this test will run', () => {
//     expect(1).toBe(1);
// });

// Timeout example
test('timeout example - fast operation', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(true).toBeTruthy();
}, { timeout: 500 });

// This would timeout if uncommented:
// test('this will timeout', async () => {
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     expect(true).toBeTruthy();
// }, { timeout: 1000 });

// Comprehensive example showcasing all tesht.js features
import { test, it, expect, beforeEach, afterEach } from '../src/index.js';

console.log('\n🎯 Comprehensive Feature Demo\n');

// ============================================================================
// 1. BASIC TESTING
// ============================================================================
test('basic equality works', () => {
    expect(2 + 2).toBe(4);
});

test('deep equality for objects', () => {
    const user = { name: 'Alice', age: 30 };
    expect(user).toEqual({ name: 'Alice', age: 30 });
});

// ============================================================================
// 2. ASYNC TESTING
// ============================================================================
test('async operations work seamlessly', async () => {
    const data = await Promise.resolve({ status: 'success' });
    expect(data.status).toBe('success');
});

test('can fetch data asynchronously', async () => {
    const fetchData = () => new Promise(resolve => 
        setTimeout(() => resolve('data'), 10)
    );
    const result = await fetchData();
    expect(result).toBe('data');
});

// ============================================================================
// 3. HOOKS (beforeEach / afterEach)
// ============================================================================
let database;

beforeEach(() => {
    // Simulate database setup
    database = { users: [], posts: [] };
});

afterEach(() => {
    // Cleanup
    database = null;
});

test('database starts empty', () => {
    expect(database.users).toHaveLength(0);
    expect(database.posts).toHaveLength(0);
});

test('can add users to database', () => {
    database.users.push({ id: 1, name: 'John' });
    expect(database.users).toHaveLength(1);
    expect(database.users).toContain({ id: 1, name: 'John' });
});

test('database is reset between tests', () => {
    // Even though previous test added a user, it's reset
    expect(database.users).toHaveLength(0);
});

// ============================================================================
// 4. ALL MATCHERS
// ============================================================================
test('toBe - strict equality', () => {
    expect(true).toBe(true);
    expect('hello').toBe('hello');
});

test('toEqual - deep equality', () => {
    expect([1, 2, 3]).toEqual([1, 2, 3]);
    expect({ a: { b: 1 } }).toEqual({ a: { b: 1 } });
});

test('toBeTruthy - truthy values', () => {
    expect(1).toBeTruthy();
    expect('text').toBeTruthy();
    expect(true).toBeTruthy();
});

test('toBeFalsy - falsy values', () => {
    expect(0).toBeFalsy();
    expect('').toBeFalsy();
    expect(false).toBeFalsy();
});

test('toBeNull - null check', () => {
    expect(null).toBeNull();
});

test('toBeUndefined - undefined check', () => {
    let x;
    expect(x).toBeUndefined();
});

test('toContain - array contains item', () => {
    expect([1, 2, 3, 4]).toContain(3);
    expect(['apple', 'banana']).toContain('apple');
});

test('toContain - string contains substring', () => {
    expect('hello world').toContain('world');
    expect('test@example.com').toContain('@');
});

test('toHaveLength - check length', () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect('hello').toHaveLength(5);
});

test('toBeGreaterThan - numeric comparison', () => {
    expect(10).toBeGreaterThan(5);
    expect(100).toBeGreaterThan(99);
});

test('toBeLessThan - numeric comparison', () => {
    expect(5).toBeLessThan(10);
    expect(0).toBeLessThan(1);
});

test('toMatch - regex matching', () => {
    expect('hello123').toMatch(/\d+/);
    expect('test@example.com').toMatch(/^[\w.-]+@[\w.-]+\.\w+$/);
});

test('toThrow - function throws', () => {
    const throwError = () => { throw new Error('Boom!'); };
    expect(throwError).toThrow();
    expect(throwError).toThrow('Boom');
    expect(throwError).toThrow(/Boom/);
});

// ============================================================================
// 5. TIMEOUT FEATURE
// ============================================================================
test('fast operations complete in time', async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(true).toBeTruthy();
}, { timeout: 200 });

test('default timeout is generous', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(true).toBeTruthy();
});

// ============================================================================
// 6. IT() ALIAS
// ============================================================================
it('works with it() alias', () => {
    expect('it() is an alias for test()').toContain('alias');
});

it('can handle async with it()', async () => {
    const value = await Promise.resolve(42);
    expect(value).toBe(42);
});

// ============================================================================
// 7. SKIP AND ONLY (commented to not affect test run)
// ============================================================================

// Uncomment to test skip functionality:
// test.skip('this test is skipped', () => {
//     expect(false).toBe(true); // Won't fail because skipped
// });

// it.skip('it() can also skip', () => {
//     throw new Error('This will not run');
// });

// Uncomment to test only functionality:
// test.only('only this test runs', () => {
//     expect(true).toBeTruthy();
// });

console.log('');

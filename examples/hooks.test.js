// Demonstrating beforeEach and afterEach hooks
import { test, expect, beforeEach, afterEach } from '../src/index.js';

// Example: Testing a simple counter with setup/teardown
let testCounter;
let testArray;

beforeEach(() => {
    // Setup runs before each test
    testCounter = 0;
    testArray = [];
    console.log('    [Setup] Initialized test data');
});

afterEach(() => {
    // Cleanup runs after each test
    testCounter = null;
    testArray = null;
    console.log('    [Cleanup] Cleared test data');
});

test('counter starts at zero', () => {
    expect(testCounter).toBe(0);
});

test('can increment counter', () => {
    testCounter++;
    expect(testCounter).toBe(1);
});

test('counter is reset between tests', () => {
    // Even though previous test incremented, this starts fresh
    expect(testCounter).toBe(0);
});

test('array starts empty', () => {
    expect(testArray).toHaveLength(0);
});

test('can add to array', () => {
    testArray.push(1, 2, 3);
    expect(testArray).toHaveLength(3);
    expect(testArray).toContain(2);
});

test('array is reset between tests', () => {
    // Array should be empty again
    expect(testArray).toHaveLength(0);
});

// Multiple hooks example
beforeEach(() => {
    console.log('    [Second beforeEach hook] Also runs before each test');
});

test('multiple hooks all execute', () => {
    expect(testCounter).toBe(0);
    expect(testArray).toEqual([]);
});

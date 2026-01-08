import { createExpect } from './assertions.js';

/**
 * Internal registry of tests
 * @type {Array<{name: string, fn: Function}>}
 */
let tests = [];

/**
 * Register a test
 * @param {string} name - Test description
 * @param {Function} fn - Test function (can be async)
 */
export function test(name, fn) {
    tests.push({ name, fn });
}

/**
 * Alias for test()
 * @param {string} name - Test description
 * @param {Function} fn - Test function (can be async)
 */
export function it(name, fn) {
    test(name, fn);
}

/**
 * Create assertion chain for a value
 * @param {*} value - Value to test
 * @returns {object} - Assertion chain
 */
export function expect(value) {
    return createExpect(value);
}

/**
 * Get all registered tests (internal use)
 * @returns {Array<{name: string, fn: Function}>}
 */
export function getTests() {
    return tests;
}

/**
 * Clear all registered tests (internal use)
 */
export function clearTests() {
    tests = [];
}

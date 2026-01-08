import { createExpect } from './assertions.js';
import { fn, spyOn } from './mock.js';

/**
 * Internal registry of tests
 * @type {Array<{name: string, fn: Function, skip: boolean, only: boolean, timeout: number}>}
 */
let tests = [];

/**
 * Registry of lifecycle hooks
 */
let hooks = {
    beforeEach: [],
    afterEach: []
};

/**
 * Register a test
 * @param {string} name - Test description
 * @param {Function} fn - Test function (can be async)
 * @param {object} options - Test options
 * @param {number} options.timeout - Timeout in ms (default: 5000)
 */
export function test(name, fn, options = {}) {
    tests.push({
        name,
        fn,
        skip: false,
        only: false,
        timeout: options.timeout || 5000
    });
}

/**
 * Skip a test
 * @param {string} name - Test description
 * @param {Function} fn - Test function (can be async)
 */
test.skip = function (name, fn, options = {}) {
    tests.push({
        name,
        fn,
        skip: true,
        only: false,
        timeout: options.timeout || 5000
    });
};

/**
 * Run only this test (and other .only tests)
 * @param {string} name - Test description
 * @param {Function} fn - Test function (can be async)
 */
test.only = function (name, fn, options = {}) {
    tests.push({
        name,
        fn,
        skip: false,
        only: true,
        timeout: options.timeout || 5000
    });
};

/**
 * Alias for test()
 * @param {string} name - Test description
 * @param {Function} fn - Test function (can be async)
 * @param {object} options - Test options
 */
export function it(name, fn, options = {}) {
    test(name, fn, options);
}

// Add .skip and .only to it() as well
it.skip = test.skip;
it.only = test.only;

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
    hooks = {
        beforeEach: [],
        afterEach: []
    };
}

/**
 * Register a beforeEach hook
 * @param {Function} fn - Hook function (can be async)
 */
export function beforeEach(fn) {
    hooks.beforeEach.push(fn);
}

/**
 * Register an afterEach hook
 * @param {Function} fn - Hook function (can be async)
 */
export function afterEach(fn) {
    hooks.afterEach.push(fn);
}

/**
 * Get all registered hooks (internal use)
 * @returns {object}
 */
export function getHooks() {
    return hooks;
}

/**
 * Create a mock function
 * @param {Function} [implementation] - Optional implementation
 * @returns {Function} - Mock function
 */
export { fn, spyOn };

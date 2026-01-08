/**
 * Deep equality comparison for objects and arrays
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} - True if deeply equal
 */
function deepEqual(a, b) {
  if (a === b) return true;
  
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

/**
 * Create an assertion chain for a given value
 * @param {*} received - The value to test
 * @returns {object} - Object with matcher methods
 */
export function createExpect(received) {
  return {
    /**
     * Strict equality check (===)
     * @param {*} expected - Expected value
     */
    toBe(expected) {
      if (received !== expected) {
        throw new Error(
          `Expected: ${JSON.stringify(expected)}\nReceived: ${JSON.stringify(received)}`
        );
      }
    },

    /**
     * Deep equality check for objects/arrays
     * @param {*} expected - Expected value
     */
    toEqual(expected) {
      if (!deepEqual(received, expected)) {
        throw new Error(
          `Expected: ${JSON.stringify(expected, null, 2)}\nReceived: ${JSON.stringify(received, null, 2)}`
        );
      }
    },

    /**
     * Check if value is truthy
     */
    toBeTruthy() {
      if (!received) {
        throw new Error(
          `Expected truthy value, received: ${JSON.stringify(received)}`
        );
      }
    },

    /**
     * Check if value is falsy
     */
    toBeFalsy() {
      if (received) {
        throw new Error(
          `Expected falsy value, received: ${JSON.stringify(received)}`
        );
      }
    },

    /**
     * Check if function throws an error
     * @param {string|RegExp} [expected] - Optional expected error message or pattern
     */
    toThrow(expected) {
      if (typeof received !== 'function') {
        throw new Error('Expected a function to test for throwing');
      }

      let threw = false;
      let error = null;

      try {
        received();
      } catch (e) {
        threw = true;
        error = e;
      }

      if (!threw) {
        throw new Error('Expected function to throw an error, but it did not');
      }

      if (expected !== undefined) {
        const message = error?.message || String(error);
        
        if (expected instanceof RegExp) {
          if (!expected.test(message)) {
            throw new Error(
              `Expected error matching: ${expected}\nReceived: "${message}"`
            );
          }
        } else if (typeof expected === 'string') {
          if (!message.includes(expected)) {
            throw new Error(
              `Expected error containing: "${expected}"\nReceived: "${message}"`
            );
          }
        }
      }
    },

    /**
     * Check if value is null
     */
    toBeNull() {
      if (received !== null) {
        throw new Error(
          `Expected null, received: ${JSON.stringify(received)}`
        );
      }
    },

    /**
     * Check if value is undefined
     */
    toBeUndefined() {
      if (received !== undefined) {
        throw new Error(
          `Expected undefined, received: ${JSON.stringify(received)}`
        );
      }
    },

    /**
     * Check if array/string contains item
     * @param {*} item - Item to search for
     */
    toContain(item) {
      if (typeof received === 'string') {
        if (!received.includes(item)) {
          throw new Error(
            `Expected "${received}" to contain "${item}"`
          );
        }
      } else if (Array.isArray(received)) {
        // For objects, use deep equality check
        const found = typeof item === 'object' && item !== null
          ? received.some(el => deepEqual(el, item))
          : received.includes(item);
        
        if (!found) {
          throw new Error(
            `Expected array to contain: ${JSON.stringify(item)}\nReceived: ${JSON.stringify(received)}`
          );
        }
      } else {
        throw new Error('toContain() expects a string or array');
      }
    },

    /**
     * Check if value is greater than expected
     * @param {number} expected - Expected value
     */
    toBeGreaterThan(expected) {
      if (typeof received !== 'number' || typeof expected !== 'number') {
        throw new Error('toBeGreaterThan() expects numbers');
      }
      if (!(received > expected)) {
        throw new Error(
          `Expected ${received} to be greater than ${expected}`
        );
      }
    },

    /**
     * Check if value is less than expected
     * @param {number} expected - Expected value
     */
    toBeLessThan(expected) {
      if (typeof received !== 'number' || typeof expected !== 'number') {
        throw new Error('toBeLessThan() expects numbers');
      }
      if (!(received < expected)) {
        throw new Error(
          `Expected ${received} to be less than ${expected}`
        );
      }
    },

    /**
     * Check if value matches regex pattern
     * @param {RegExp} pattern - Regex pattern
     */
    toMatch(pattern) {
      if (!(pattern instanceof RegExp)) {
        throw new Error('toMatch() expects a RegExp');
      }
      const str = String(received);
      if (!pattern.test(str)) {
        throw new Error(
          `Expected "${str}" to match ${pattern}`
        );
      }
    },

    /**
     * Check if array/string has specific length
     * @param {number} expected - Expected length
     */
    toHaveLength(expected) {
      if (typeof expected !== 'number') {
        throw new Error('toHaveLength() expects a number');
      }
      const length = received?.length;
      if (length === undefined) {
        throw new Error('Received value does not have a length property');
      }
      if (length !== expected) {
        throw new Error(
          `Expected length: ${expected}\nReceived length: ${length}`
        );
      }
    }
  };
}

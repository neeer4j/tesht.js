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
    }
  };
}

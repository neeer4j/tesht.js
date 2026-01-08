
/**
 * Create a mock function
 * @param {Function} implementation - Optional implementation
 * @returns {Function} - Mock function
 */
export function fn(implementation) {
    const mockFn = function (...args) {
        mockFn.mock.calls.push(args);
        mockFn.mock.instances.push(this);

        let result;
        if (implementation) {
            try {
                result = implementation.apply(this, args);
                mockFn.mock.results.push({ type: 'return', value: result });
            } catch (error) {
                mockFn.mock.results.push({ type: 'throw', value: error });
                throw error;
            }
        } else {
            result = undefined;
            mockFn.mock.results.push({ type: 'return', value: undefined });
        }

        return result;
    };

    mockFn.mock = {
        calls: [],
        instances: [],
        results: [], // { type: 'return' | 'throw', value: any }
        implementation: implementation
    };

    // Helper methods
    mockFn.mockReturnValue = (value) => {
        implementation = () => value;
        return mockFn;
    };

    mockFn.mockImplementation = (newImpl) => {
        implementation = newImpl;
        return mockFn;
    };

    mockFn.mockClear = () => {
        mockFn.mock.calls = [];
        mockFn.mock.instances = [];
        mockFn.mock.results = [];
        return mockFn;
    };

    return mockFn;
}

/**
 * Spy on an object method
 * @param {object} object - Object to spy on
 * @param {string} methodName - Method name
 * @returns {Function} - Mock function
 */
export function spyOn(object, methodName) {
    const originalMethod = object[methodName];

    if (typeof originalMethod !== 'function') {
        throw new Error(`Cannot spy on ${methodName}, it is not a function`);
    }

    const mockFn = fn(originalMethod);

    // Replace method with mock
    object[methodName] = mockFn;

    // Add restore method
    mockFn.mockRestore = () => {
        object[methodName] = originalMethod;
    };

    return mockFn;
}

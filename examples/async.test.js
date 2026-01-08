// Example async tests demonstrating Promise/async-await support
import { test, expect } from '../src/index.js';

// Helper to simulate async operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchData = async () => {
    await delay(10);
    return { userId: 1, name: 'Test User' };
};

const fetchNumber = async () => {
    await delay(5);
    return 42;
};

// Async tests with async/await
test('handles async/await', async () => {
    const data = await fetchData();
    expect(data.userId).toBe(1);
    expect(data.name).toBe('Test User');
});

test('handles async number return', async () => {
    const num = await fetchNumber();
    expect(num).toBe(42);
});

// Promise-based test
test('handles Promises', () => {
    return fetchData().then(data => {
        expect(data).toEqual({ userId: 1, name: 'Test User' });
    });
});

// Async with toEqual
test('async deep equality check', async () => {
    const data = await fetchData();
    expect(data).toEqual({ userId: 1, name: 'Test User' });
});

// Example test file demonstrating Tesht features
import { test, it, expect } from '../src/index.js';

// Basic toBe matcher
test('adds numbers correctly', () => {
    expect(1 + 2).toBe(3);
});

test('string comparison works', () => {
    expect('hello').toBe('hello');
});

// toEqual for deep equality
test('toEqual compares objects deeply', () => {
    const obj = { a: 1, b: { c: 2 } };
    expect(obj).toEqual({ a: 1, b: { c: 2 } });
});

test('toEqual compares arrays', () => {
    expect([1, 2, 3]).toEqual([1, 2, 3]);
});

// toBeTruthy / toBeFalsy
test('toBeTruthy works', () => {
    expect(true).toBeTruthy();
    expect(1).toBeTruthy();
    expect('hello').toBeTruthy();
    expect({}).toBeTruthy();
});

test('toBeFalsy works', () => {
    expect(false).toBeFalsy();
    expect(0).toBeFalsy();
    expect('').toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
});

// toThrow matcher
test('toThrow catches errors', () => {
    expect(() => {
        throw new Error('Oops!');
    }).toThrow();
});

test('toThrow matches error message', () => {
    expect(() => {
        throw new Error('Something went wrong');
    }).toThrow('went wrong');
});

// Using 'it' alias
it('works with it() alias too', () => {
    expect(true).toBe(true);
});

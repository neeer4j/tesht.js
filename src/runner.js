import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { getTests, clearTests, getHooks } from './index.js';

// Global plain mode flag - set by run()
let isPlainMode = false;

// Extended ANSI color codes for rich terminal output
// Returns actual codes or empty strings based on isPlainMode
const ANSI = {
    // Basic colors
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',

    // Foreground colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',

    // Bright foreground colors
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m',

    // Background colors
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
};

// Create a proxy that returns empty strings in plain mode
const c = new Proxy(ANSI, {
    get(target, prop) {
        return isPlainMode ? '' : target[prop];
    }
});

// Gradient colors for the banner (cyan -> magenta)
const gradientColors = [
    '\x1b[96m', // bright cyan
    '\x1b[36m', // cyan
    '\x1b[35m', // magenta
    '\x1b[95m', // bright magenta
];

/**
 * Apply gradient effect to text (or return plain text in plain mode)
 */
function gradient(text) {
    if (isPlainMode) {
        return text;
    }
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const colorIndex = Math.floor((i / text.length) * gradientColors.length);
        result += gradientColors[colorIndex] + text[i];
    }
    return result + ANSI.reset;
}

/**
 * Print the Tesht banner
 */
function printBanner() {
    if (isPlainMode) {
        const line = '-'.repeat(50);
        console.log(`\n${line}`);
        console.log(`  tesht.js -> Fast * Minimal * Zero Config`);
        console.log(`${line}\n`);
        return;
    }
    const line = c.dim + '─'.repeat(50) + c.reset;
    console.log(`\n${line}`);
    console.log(`  ${gradient('tesht.js')} ${c.dim}→${c.reset} ${c.cyan}Fast${c.reset} ${c.dim}•${c.reset} ${c.magenta}Minimal${c.reset} ${c.dim}•${c.reset} ${c.yellow}Zero Config${c.reset}`);
    console.log(`${line}\n`);
}

/**
 * Print a styled box around text (plain version for CI)
 */
function printBox(text, style = 'info') {
    if (isPlainMode) {
        const line = '-'.repeat(text.length + 2);
        console.log(`+${line}+`);
        console.log(`| ${text} |`);
        console.log(`+${line}+`);
        return;
    }
    const colors = {
        info: c.cyan,
        success: c.brightGreen,
        error: c.brightRed,
        warning: c.brightYellow,
    };
    const color = colors[style] || c.white;
    const line = '─'.repeat(text.length + 2);
    console.log(`${color}┌${line}┐${c.reset}`);
    console.log(`${color}│${c.reset} ${text} ${color}│${c.reset}`);
    console.log(`${color}└${line}┘${c.reset}`);
}

// Keep old reference for compatibility
const colors = c;

// Symbol helper - returns Unicode or ASCII based on plain mode
const sym = {
    get check() { return isPlainMode ? '[PASS]' : '✓'; },
    get cross() { return isPlainMode ? '[FAIL]' : '✗'; },
    get arrow() { return isPlainMode ? '->' : '→'; },
    get bullet() { return isPlainMode ? '*' : '•'; },
    get play() { return isPlainMode ? '>' : '▶'; },
    get skip() { return isPlainMode ? '[SKIP]' : '⊘'; },
    get chevron() { return isPlainMode ? '>' : '❯'; },
    get pipe() { return isPlainMode ? '|' : '│'; },
};

/**
 * Recursively find test files in a directory
 * @param {string} dir - Directory to scan
 * @param {string[]} files - Accumulator for found files
 * @returns {string[]} - Array of test file paths
 */
function findTestFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // Skip node_modules and hidden directories
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
                continue;
            }
            findTestFiles(fullPath, files);
        } else if (entry.isFile()) {
            if (entry.name.endsWith('.test.js') ||
                entry.name.endsWith('.tesht.js') ||
                entry.name.endsWith('.test.ts') ||
                entry.name.endsWith('.tesht.ts')) {
                files.push(fullPath);
            }
        }
    }

    return files;
}

/**
 * Run all tests in the specified path
 * @param {string} targetPath - File or directory path
 * @param {object} options - Runner options
 * @param {boolean} options.failFast - Stop on first failure
 * @returns {Promise<{passed: number, failed: number, total: number}>}
 */
export async function run(targetPath, options = {}) {
    const { failFast = true, plain = false } = options;

    // Set plain mode - auto-detect if not explicitly set
    // Enable plain mode if: explicitly requested, or not a TTY, or CI environment
    isPlainMode = plain || !process.stdout.isTTY || !!process.env.CI;

    // Print the fancy banner
    printBanner();

    const startTime = Date.now();
    let passed = 0;
    let failed = 0;
    const failures = [];

    // Resolve the target path
    const resolvedPath = path.resolve(targetPath);

    // Check if path exists
    if (!fs.existsSync(resolvedPath)) {
        console.log(`${c.brightRed}${sym.cross} Path not found:${c.reset} ${targetPath}\n`);
        return { passed: 0, failed: 1, total: 1 };
    }

    // Find test files
    let testFiles = [];
    const stat = fs.statSync(resolvedPath);

    if (stat.isDirectory()) {
        testFiles = findTestFiles(resolvedPath);
    } else if (stat.isFile()) {
        testFiles = [resolvedPath];
    }

    if (testFiles.length === 0) {
        console.log(`${c.yellow}No test files found${c.reset} ${c.dim}(*.test.js, *.test.ts, etc)${c.reset}\n`);
        return { passed: 0, failed: 0, total: 0 };
    }

    // Show discovery info
    console.log(`${c.dim}Found ${c.reset}${c.cyan}${testFiles.length}${c.reset} ${c.dim}test file(s)${c.reset}\n`);

    // Process each test file
    for (const file of testFiles) {
        const relativePath = path.relative(process.cwd(), file);

        // Styled file path with icon
        console.log(`${c.cyan}${sym.play}${c.reset} ${c.bold}${relativePath}${c.reset}`);

        // Clear previous tests
        clearTests();

        // Import the test file (this registers tests via test()/it())
        try {
            const fileUrl = pathToFileURL(file).href;
            await import(fileUrl);
        } catch (err) {
            console.log(`  ${c.brightRed}${sym.cross}${c.reset} ${c.red}Import failed${c.reset}: ${c.dim}${err.message}${c.reset}`);
            failed++;
            failures.push({ file: relativePath, error: err.message });

            if (failFast) {
                break;
            }
            continue;
        }

        // Run each test in the file
        const tests = getTests();
        const hooks = getHooks();

        // Check if there are any .only tests
        const hasOnly = tests.some(t => t.only);
        const testsToRun = hasOnly ? tests.filter(t => t.only) : tests.filter(t => !t.skip);
        const skippedCount = tests.length - testsToRun.length;

        for (const { name, fn, skip, timeout } of testsToRun) {
            try {
                // Run beforeEach hooks
                for (const hook of hooks.beforeEach) {
                    await hook();
                }

                // Run test with timeout
                await Promise.race([
                    fn(),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error(`Test timeout after ${timeout}ms`)), timeout)
                    )
                ]);

                // Run afterEach hooks
                for (const hook of hooks.afterEach) {
                    await hook();
                }

                console.log(`  ${c.brightGreen}${sym.check}${c.reset} ${c.dim}${name}${c.reset}`);
                passed++;
            } catch (err) {
                // Still run afterEach hooks on failure
                try {
                    for (const hook of hooks.afterEach) {
                        await hook();
                    }
                } catch (hookErr) {
                    // Ignore hook errors during cleanup
                }

                console.log(`  ${c.brightRed}${sym.cross}${c.reset} ${c.red}${name}${c.reset}`);
                console.log(`    ${c.dim}${err.message.split('\n')[0]}${c.reset}`);
                failed++;
                failures.push({ file: relativePath, test: name, error: err.message });

                if (failFast) {
                    break;
                }
            }
        }

        if (skippedCount > 0) {
            console.log(`  ${c.yellow}${sym.skip}${c.reset} ${c.dim}${skippedCount} skipped${c.reset}`);
        }

        console.log(''); // Space after file

        // Break outer loop if failFast triggered
        if (failFast && failed > 0) {
            break;
        }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Print compact summary
    console.log('');
    if (failed > 0) {
        console.log(`${c.brightRed}${sym.cross}${c.reset} ${c.red}${failed} failed${c.reset} ${c.dim}${sym.pipe}${c.reset} ${c.brightGreen}${sym.check}${c.reset} ${c.green}${passed} passed${c.reset} ${c.dim}${sym.pipe}${c.reset} ${c.yellow}${duration}ms${c.reset}`);

        // Show failure details
        if (failures.length > 0) {
            console.log(`\n${c.red}${c.bold}${sym.chevron} Failures:${c.reset}`);
            for (const f of failures) {
                if (f.test) {
                    console.log(`  ${c.red}${sym.bullet}${c.reset} ${c.dim}${f.file}${c.reset} ${c.dim}${sym.arrow}${c.reset} ${c.white}${f.test}${c.reset}`);
                } else {
                    console.log(`  ${c.red}${sym.bullet}${c.reset} ${c.dim}${f.file}${c.reset}`);
                }
            }
        }
    } else {
        console.log(`${c.brightGreen}${sym.check}${c.reset} ${c.green}All tests passed!${c.reset} ${c.dim}${sym.pipe}${c.reset} ${c.cyan}${passed}${c.reset} ${c.dim}tests${c.reset} ${c.dim}${sym.pipe}${c.reset} ${c.yellow}${duration}ms${c.reset}`);
    }

    console.log('');

    return { passed, failed, total: passed + failed };
}

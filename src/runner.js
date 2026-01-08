import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { getTests, clearTests } from './index.js';

// Extended ANSI color codes for rich terminal output
const c = {
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

// Gradient colors for the banner (cyan -> magenta)
const gradientColors = [
    '\x1b[96m', // bright cyan
    '\x1b[36m', // cyan
    '\x1b[35m', // magenta
    '\x1b[95m', // bright magenta
];

/**
 * Apply gradient effect to text
 */
function gradient(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const colorIndex = Math.floor((i / text.length) * gradientColors.length);
        result += gradientColors[colorIndex] + text[i];
    }
    return result + c.reset;
}

/**
 * Print the Tesht banner
 */
function printBanner() {
    const banner = `
${c.bold}${gradient('  ████████╗███████╗███████╗██╗  ██╗████████╗')}
${c.bold}${gradient('  ╚══██╔══╝██╔════╝██╔════╝██║  ██║╚══██╔══╝')}
${c.bold}${gradient('     ██║   █████╗  ███████╗███████║   ██║   ')}
${c.bold}${gradient('     ██║   ██╔══╝  ╚════██║██╔══██║   ██║   ')}
${c.bold}${gradient('     ██║   ███████╗███████║██║  ██║   ██║   ')}
${c.bold}${gradient('     ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   ')}
  ${c.dim}Fast • Minimal • Zero Config${c.reset}
`;
    console.log(banner);
}

/**
 * Print a styled box around text
 */
function printBox(text, style = 'info') {
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
            if (entry.name.endsWith('.test.js') || entry.name.endsWith('.tesht.js')) {
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
    const { failFast = true } = options;

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
        console.log(`  ${c.brightRed}✗ Error:${c.reset} Path not found: ${c.yellow}${targetPath}${c.reset}`);
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
        console.log(`  ${c.yellow}⚠${c.reset}  No test files found`);
        console.log(`  ${c.dim}Looking for *.test.js or *.tesht.js files${c.reset}\n`);
        return { passed: 0, failed: 0, total: 0 };
    }

    // Show discovery info
    console.log(`  ${c.cyan}◉${c.reset}  Found ${c.bold}${testFiles.length}${c.reset} test file(s)\n`);

    // Process each test file
    for (const file of testFiles) {
        const relativePath = path.relative(process.cwd(), file);

        // Styled file path with folder icon
        console.log(`  ${c.blue}📁${c.reset} ${c.bold}${c.white}${relativePath}${c.reset}`);

        // Clear previous tests
        clearTests();

        // Import the test file (this registers tests via test()/it())
        try {
            const fileUrl = pathToFileURL(file).href;
            await import(fileUrl);
        } catch (err) {
            console.log(`     ${c.brightRed}✗${c.reset} ${c.red}Failed to import${c.reset}`);
            console.log(`       ${c.dim}${err.message}${c.reset}`);
            failed++;
            failures.push({ file: relativePath, error: err.message });

            if (failFast) {
                break;
            }
            continue;
        }

        // Run each test in the file
        const tests = getTests();

        for (const { name, fn } of tests) {
            try {
                // Support async tests
                await fn();
                console.log(`     ${c.brightGreen}✓${c.reset} ${c.dim}${name}${c.reset}`);
                passed++;
            } catch (err) {
                console.log(`     ${c.brightRed}✗${c.reset} ${c.red}${name}${c.reset}`);
                console.log(`       ${c.brightRed}→${c.reset} ${c.dim}${err.message.split('\n')[0]}${c.reset}`);
                failed++;
                failures.push({ file: relativePath, test: name, error: err.message });

                if (failFast) {
                    break;
                }
            }
        }

        console.log(''); // Space between files

        // Break outer loop if failFast triggered
        if (failFast && failed > 0) {
            break;
        }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Print styled summary
    const summaryLine = '═'.repeat(44);

    if (failed > 0) {
        console.log(`  ${c.red}${summaryLine}${c.reset}`);
        console.log(`  ${c.red}║${c.reset}  ${c.bold}TEST RESULTS${c.reset}                            ${c.red}║${c.reset}`);
        console.log(`  ${c.red}${summaryLine}${c.reset}`);
        console.log(`  ${c.red}║${c.reset}  ${c.brightGreen}✓ ${passed} passed${c.reset}   ${c.brightRed}✗ ${failed} failed${c.reset}            ${c.red}║${c.reset}`);
        console.log(`  ${c.red}║${c.reset}  ${c.dim}⏱  ${duration}ms${c.reset}                              ${c.red}║${c.reset}`);
        console.log(`  ${c.red}${summaryLine}${c.reset}`);

        // Show failure details
        if (failures.length > 0) {
            console.log(`\n  ${c.brightRed}${c.bold}FAILURES:${c.reset}`);
            for (const f of failures) {
                console.log(`  ${c.red}●${c.reset} ${c.dim}${f.file}${c.reset}`);
                if (f.test) {
                    console.log(`    ${c.red}→${c.reset} ${f.test}`);
                }
            }
        }
    } else {
        console.log(`  ${c.green}${summaryLine}${c.reset}`);
        console.log(`  ${c.green}║${c.reset}  ${c.bold}${c.brightGreen}✓ ALL TESTS PASSED${c.reset}                     ${c.green}║${c.reset}`);
        console.log(`  ${c.green}${summaryLine}${c.reset}`);
        console.log(`  ${c.green}║${c.reset}  ${c.brightGreen}${passed} tests${c.reset} completed in ${c.cyan}${duration}ms${c.reset}           ${c.green}║${c.reset}`);
        console.log(`  ${c.green}${summaryLine}${c.reset}`);
    }

    console.log('');

    return { passed, failed, total: passed + failed };
}

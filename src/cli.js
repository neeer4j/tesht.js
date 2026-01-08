import { run } from './runner.js';
import fs from 'fs';
import path from 'path';

/**
 * Parse command line arguments
 * @param {string[]} args - Process arguments (without node and script)
 * @returns {{path: string, failFast: boolean, watch: boolean}}
 */
function parseArgs(args) {
    const options = {
        path: '.',
        failFast: true,
        watch: false
    };

    for (const arg of args) {
        if (arg === '--all' || arg === '-a') {
            options.failFast = false;
        } else if (arg === '--watch' || arg === '-w') {
            options.watch = true;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        } else if (arg === '--version' || arg === '-v') {
            console.log('tesht v1.0.0');
            process.exit(0);
        } else if (!arg.startsWith('-')) {
            options.path = arg;
        }
    }

    return options;
}

/**
 * Print help message
 */
function printHelp() {
    console.log(`
tesht - A fast, minimal JavaScript test runner

Usage:
  tesht [path] [options]

Arguments:
  path          Directory or file to test (default: current directory)

Options:
  --all, -a     Run all tests, don't stop on first failure
  --watch, -w   Watch mode - rerun tests on file changes
  --help, -h    Show this help message
  --version, -v Show version number

Examples:
  tesht                    Run tests in current directory
  tesht src/               Run tests in src/ directory
  tesht tests/math.test.js Run specific test file
  tesht --all              Run all tests even after failures
  tesht --watch            Run tests in watch mode
`);
}

/**
 * Watch mode - rerun tests on file changes
 * @param {string} targetPath - Path to watch
 * @param {object} options - Run options
 */
async function watchMode(targetPath, options) {
    const c = {
        cyan: '\x1b[36m',
        yellow: '\x1b[93m',
        dim: '\x1b[2m',
        reset: '\x1b[0m',
        bold: '\x1b[1m'
    };

    console.log(`${c.cyan}${c.bold}◉ Watch mode${c.reset} ${c.dim}→${c.reset} ${c.white}${targetPath}${c.reset}\n`);

    // Initial run
    await run(targetPath, options);

    // Simple file watcher
    const resolvedPath = path.resolve(targetPath);
    let timeout;

    const runTests = () => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            console.log(`\n${c.yellow}↻${c.reset} ${c.dim}Changes detected, rerunning...${c.reset}\n`);
            await run(targetPath, options);
        }, 100);
    };

    // Watch recursively
    const watchRecursive = (dir) => {
        try {
            const watcher = fs.watch(dir, { recursive: true }, (eventType, filename) => {
                if (filename && (filename.endsWith('.js') || filename.endsWith('.test.js'))) {
                    runTests();
                }
            });

            // Handle watch errors gracefully
            watcher.on('error', (err) => {
                console.error(`${c.yellow}⚠${c.reset} Watch error: ${err.message}`);
            });
        } catch (err) {
            console.error(`${c.yellow}⚠${c.reset} Could not watch ${dir}: ${err.message}`);
        }
    };

    const stat = fs.statSync(resolvedPath);
    if (stat.isDirectory()) {
        watchRecursive(resolvedPath);
    } else {
        // Watch the file's directory
        watchRecursive(path.dirname(resolvedPath));
    }

    // Keep process alive
    process.stdin.resume();
}

/**
 * Main CLI entry point
 */
export async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    try {
        if (options.watch) {
            await watchMode(options.path, { failFast: options.failFast });
        } else {
            const result = await run(options.path, { failFast: options.failFast });
            process.exit(result.failed > 0 ? 1 : 0);
        }
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}


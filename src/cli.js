import { run } from './runner.js';

/**
 * Parse command line arguments
 * @param {string[]} args - Process arguments (without node and script)
 * @returns {{path: string, failFast: boolean}}
 */
function parseArgs(args) {
    const options = {
        path: '.',
        failFast: true
    };

    for (const arg of args) {
        if (arg === '--all' || arg === '-a') {
            options.failFast = false;
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
  --help, -h    Show this help message
  --version, -v Show version number

Examples:
  tesht                    Run tests in current directory
  tesht src/               Run tests in src/ directory
  tesht tests/math.test.js Run specific test file
  tesht --all              Run all tests even after failures
`);
}

/**
 * Main CLI entry point
 */
export async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    try {
        const result = await run(options.path, { failFast: options.failFast });
        process.exit(result.failed > 0 ? 1 : 0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

/**
 * Command-line options interface
 * @interface CliOptions
 */
export interface CliOptions {
    /** Optional port override for HTTP server */
    port?: number;
    /** Force STDIO transport mode */
    stdio?: boolean;
}

/**
 * Parses command-line arguments
 * @returns {CliOptions} Parsed CLI options
 * @example
 * // node dist/index.js --port 3003
 * // Returns: { port: 3003 }
 * @example
 * // node dist/index.js --stdio
 * // Returns: { stdio: true }
 */
export function parseArgs(): CliOptions {
    const args = process.argv.slice(2);
    const options: CliOptions = {};

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--port':
                if (i + 1 < args.length) {
                    const portArg = args[++i];
                    if (portArg) {
                        options.port = parseInt(portArg, 10);
                    }
                }
                break;
            case '--stdio':
                options.stdio = true;
                break;
        }
    }

    return options;
}
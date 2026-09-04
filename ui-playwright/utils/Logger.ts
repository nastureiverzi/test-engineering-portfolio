import winston from 'winston';
import path from 'path';

/**
 * Custom Winston Logger configuration for test execution logging.
 * Outputs formatted logs to both the console and persistent log files under the /logs directory.
 *
 * Log Files:
 * - logs/test-execution.log : Contains all logs (info, warn, error)
 * - logs/test-errors.log    : Contains error-level logs only
 *
 * Environment Variable Overrides:
 * - LOG_LEVEL: Sets minimum logging threshold (e.g., 'debug', 'info', 'warn', 'error'). Default is 'info'.
 */

const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const Logger = winston.createLogger({
     level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [
        // Console output
        new winston.transports.Console(),

        // Log all info/warn/error entries to a combined file
        new winston.transports.File({
            filename: path.join('logs', 'test-execution.log'),
            maxsize: 5242880, // 5 MB per file
            maxFiles: 3,
        }),

        // Log errors only to a separate error file
        new winston.transports.File({
            filename: path.join('logs', 'test-errors.log'),
            level: 'error',
        }),
    ],
});

export default Logger;
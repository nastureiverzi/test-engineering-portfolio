import * as dotenv from 'dotenv';
import Logger from './Logger';

dotenv.config();

/**
 * Utility class responsible for loading framework configurations.
 * Implements a fallback mechanism: environment variables (process.env) take precedence
 * over values defined in the .env file.
 *
 * All configuration keys must be defined in .env or passed as environment variables.
 * See .env.example for the full list of required keys.
 */
class ConfigReader {

    /**
     * Resolves a configuration value by key.
     * Priority: process.env (CLI) → .env file → optional defaultValue
     *
     * @param key - Environment variable key
     * @param defaultValue - Optional fallback value
     * @returns Resolved string value
     * @throws Error if key is missing and no default is provided
     */
    static get(key: string, defaultValue?: string): string {
        const value = process.env[key]?.trim();

        if (value !== undefined && value !== '') {
            Logger.debug(`Resolved config [${key}] -> '${value}'`);
            return value;
        }

        if (defaultValue !== undefined) {
            Logger.debug(`Config [${key}] not set, using fallback -> '${defaultValue}'`);
            return defaultValue;
        }

        Logger.error(`Required config key '${key}' was not found in process.env or .env file`);
        throw new Error(`Required config key '${key}' is missing from environment and .env file`);
    }

   /**
     * Retrieves the target application base URL (`BASE_URL`).
     * @returns Base URL string
     */
    static getBaseUrl(): string {
        return this.get('BASE_URL');
    }

    /**
     * Checks if browser execution should run in headless mode (`HEADLESS`).
     * @returns True if headless mode is enabled, false if set to 'false'
     */
    static isHeadless(): boolean {
        return this.get('HEADLESS').toLowerCase() !== 'false';
    }

    /**
     * Retrieves the global test timeout in milliseconds (`TIMEOUT`).
     * @returns Timeout duration in milliseconds
     * @throws Error if TIMEOUT configuration value is not a valid numeric string
     */
    static getTimeout(): number {
        const timeoutStr = this.get('TIMEOUT');
        const parsed = parseInt(timeoutStr, 10);
        
        if (isNaN(parsed)) {
            Logger.error(`Invalid numeric TIMEOUT configuration: '${timeoutStr}'`);
            throw new Error(`Config key 'TIMEOUT' must be a valid integer, received: '${timeoutStr}'`);
        }
        return parsed;
    }

    /**
     * Retrieves the domain name used for dynamic test email generation (`TEST_EMAIL_DOMAIN`).
     * @returns Email domain string (e.g., 'example.com')
     */
    static getEmailDomain(): string {
        return this.get('TEST_EMAIL_DOMAIN');
    }

    /**
     * Retrieves the configured framework logging threshold (`LOG_LEVEL`).
     * @returns Log level string ('debug' | 'info' | 'warn' | 'error')
     */
    static getLogLevel(): string {
        return this.get('LOG_LEVEL');
    }

    /**
     * Retrieves the explicit wait timeout for element visibility and assertions in milliseconds (`EXPLICIT_WAIT_TIMEOUT`).
     * @returns Explicit wait duration in milliseconds (defaults to 10000)
     */
    static getExplicitWaitTimeout(): number {
        return parseInt(this.get('EXPLICIT_WAIT_TIMEOUT', '10000'), 10);
    }
}

export default ConfigReader;
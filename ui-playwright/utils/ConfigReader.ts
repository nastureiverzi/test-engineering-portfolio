import * as dotenv from 'dotenv';
import Logger from './Logger';

dotenv.config();

/**
 * Utility class responsible for loading framework configurations.
 * Implements a fallback mechanism: environment variables (process.env) take precedence
 * over values defined in the .env file.
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

    static getBaseUrl(): string {
        return this.get('BASE_URL');
    }

    static isHeadless(): boolean {
        return this.get('HEADLESS').toLowerCase() !== 'false';
    }

    static getTimeout(): number {
        const timeoutStr = this.get('TIMEOUT');
        const parsed = parseInt(timeoutStr, 10);
        
        if (isNaN(parsed)) {
            Logger.error(`Invalid numeric TIMEOUT configuration: '${timeoutStr}'`);
            throw new Error(`Config key 'TIMEOUT' must be a valid integer, received: '${timeoutStr}'`);
        }
        return parsed;
    }

    static getEmailDomain(): string {
        return this.get('TEST_EMAIL_DOMAIN');
    }

    static getLogLevel(): string {
        return this.get('LOG_LEVEL');
    }
}

export default ConfigReader;
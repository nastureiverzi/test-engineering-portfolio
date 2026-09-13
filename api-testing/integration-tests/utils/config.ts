import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Utility to retrieve an environment variable from process.env (CLI or .env).
 * Throws a descriptive error if the key is missing or empty.
 *
 * @param key - The environment variable key
 * @returns Resolved string value
 */
function getEnv(key: string): string {
    const value = process.env[key]?.trim();

    if (!value) {
        throw new Error(
            `[Config Error]: Required environment variable '${key}' is missing or empty. ` +
            `Please define it in your .env file or pass it via CLI.`
        );
    }

    return value;
}

const Config = {
    get baseUrl(): string {
        return getEnv('BASE_URL');
    },
    get username(): string {
        return getEnv('API_USERNAME');
    },
    get password(): string {
        return getEnv('API_PASSWORD');
    }
};

export default Config;
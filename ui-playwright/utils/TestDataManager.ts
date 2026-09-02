import * as fs from 'fs';
import * as path from 'path';
import Logger from './Logger';

/**
 * Dedicated loader for test data inputs and credentials.
 * Keeps test data strictly decoupled from infrastructure and environment configs.
 * Reads from data/testdata.json using dot-notation path traversal.
 */
class TestDataManager {

    private static readonly DATA_FILE = path.resolve(__dirname, '../data/testdata.json');
    private static readonly rootNode: Record<string, unknown> = TestDataManager.loadData();

    /**
     * Loads and parses testdata.json from the data directory.
     * @throws Error if file is not found or contains invalid JSON
     */
    private static loadData(): Record<string, unknown> {
        if (!fs.existsSync(TestDataManager.DATA_FILE)) {
            Logger.error(`testdata.json not found at: ${TestDataManager.DATA_FILE}`);
            throw new Error(`testdata.json not found at: ${TestDataManager.DATA_FILE}`);
        }

        try {
            const raw = fs.readFileSync(TestDataManager.DATA_FILE, 'utf-8');
            Logger.info('Successfully loaded test data from [testdata.json]');
            return JSON.parse(raw) as Record<string, unknown>;
        } catch (error) {
            Logger.error(`Failed to parse testdata.json: ${error}`);
            throw new Error(`Failed to parse testdata.json: ${error}`);
        }
    }

    /**
     * Traverses the JSON tree using a dot-notation path.
     * @param jsonPath - Dot-notation path (e.g. "authentication.validUser")
     * @returns The node at the given path
     */
    private static traversePath(jsonPath: string): unknown {
        return jsonPath.split('.').reduce((node: unknown, key: string) => {
            if (node === null || typeof node !== 'object') {
                Logger.error(`Invalid path segment '${key}' in path '${jsonPath}'`);
                throw new Error(`Invalid path segment '${key}' in path '${jsonPath}'`);
            }
            const result = (node as Record<string, unknown>)[key];
            if (result === undefined) {
                Logger.error(`Test data path '${jsonPath}' not found in testdata.json`);
                throw new Error(`Test data path '${jsonPath}' not found in testdata.json`);
            }
            return result;
        }, this.rootNode);
    }

    /**
     * Resolves a string value from JSON using dot-notation path.
     * @param jsonPath - Dot-notation path (e.g. "existingUser.email")
     * @returns String value
     */
    static get(jsonPath: string): string {
        const value = this.traversePath(jsonPath);
        if (typeof value !== 'string' || value.trim() === '') {
            Logger.error(`Test data path '${jsonPath}' is not a valid string`);
            throw new Error(`Test data path '${jsonPath}' is not a valid non-empty string`);
        }
        Logger.debug(`Resolved test data [${jsonPath}] -> '${value}'`);
        return value;
    }

    /**
     * Resolves an integer value from JSON using dot-notation path.
     * @param jsonPath - Dot-notation path
     * @returns Integer value
     */
    static getInt(jsonPath: string): number {
        const value = this.traversePath(jsonPath);
        if (typeof value !== 'number' || !Number.isInteger(value)) {
            Logger.error(`Test data path '${jsonPath}' is not a valid integer`);
            throw new Error(`Test data path '${jsonPath}' is not a valid integer`);
        }
        Logger.debug(`Resolved test data integer [${jsonPath}] -> '${value}'`);
        return value;
    }

    /**
     * Resolves a boolean value from JSON using dot-notation path.
     * @param jsonPath - Dot-notation path
     * @returns Boolean value
     */
    static getBoolean(jsonPath: string): boolean {
        const value = this.traversePath(jsonPath);
        if (typeof value !== 'boolean') {
            Logger.error(`Test data path '${jsonPath}' is not a valid boolean`);
            throw new Error(`Test data path '${jsonPath}' is not a valid boolean`);
        }
        Logger.debug(`Resolved test data boolean [${jsonPath}] -> '${value}'`);
        return value;
    }

    /**
     * Deserializes a JSON sub-tree into a typed object.
     * Clones object to guarantee immutability across test runs.
     * @param jsonPath - Dot-notation path
     * @returns Typed object
     */
    static getObject<T>(jsonPath: string): T {
        const value = this.traversePath(jsonPath);
        if (typeof value !== 'object' || value === null) {
            Logger.error(`Test data path '${jsonPath}' is not a valid object`);
            throw new Error(`Test data path '${jsonPath}' is not a valid object`);
        }
        Logger.debug(`Resolved test data object [${jsonPath}]`);
        return JSON.parse(JSON.stringify(value)) as T;
    }
}

export default TestDataManager;
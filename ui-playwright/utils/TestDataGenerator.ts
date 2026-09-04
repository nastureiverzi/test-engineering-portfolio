import { randomBytes } from 'crypto';
import ConfigReader from './ConfigReader';

/**
 * Utility class for generating dynamic test data at runtime.
 * Used for values that must be unique per test run (e.g. email addresses).
 */
class TestDataGenerator {

    /**
     * Generates a unique email address using a random hex string.
     * Format: {prefix}_{hex}@{domain}
     *
     * @param prefix - Short label identifying the test context (e.g. 'qa')
     * @returns Unique email address string
     */
    static generateEmail(prefix: string): string {
        const domain = ConfigReader.getEmailDomain();
        const unique = randomBytes(16).toString('hex');
        return `${prefix}_${unique}@${domain}`;
    }
}

export default TestDataGenerator;
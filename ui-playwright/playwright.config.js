/**
 * Playwright Test Runner Configuration.
 * Controls test execution settings, timeouts, environment overrides, and browser profiles.
 *
 * Environment Variable Overrides:
 * - BASE_URL: Target web application URL (default: https://automationexercise.com)
 * - TIMEOUT: Test execution timeout in milliseconds (default: 30000)
 * - HEADLESS: Set 'false' to run browser visually (default: true)
 */
module.exports = defineConfig({
    testDir: './tests',
    timeout: parseInt(process.env.TIMEOUT || '30000'),
    fullyParallel: false, // Disabled to avoid conflicts on shared test environment
    retries: 0,
    workers: 1,
    reporter: [['html', { open: 'never' }], ['list']],

    expect: {
        timeout: 5000,
    },

    use: {
        baseURL: process.env.BASE_URL || 'https://automationexercise.com',
        headless: process.env.HEADLESS !== 'false',
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit', // Safari engine — runs on all platforms via Playwright's bundled browsers
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
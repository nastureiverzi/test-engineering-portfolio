import { test as base } from '@playwright/test';

/**
 * Extended Playwright test fixture that blocks ad network requests
 * before every test to prevent ad overlays from interfering with automation.
 */
export const test = base.extend({
    page: async ({ page }, use) => {
        await page.route('**/*googlesyndication*', route => route.abort());
        await page.route('**/*googleadservices*', route => route.abort());
        await page.route('**/*doubleclick*', route => route.abort());
        await page.route('**/*google-analytics*', route => route.abort());
        await page.route('**/*adservice*', route => route.abort());
        await page.route('**/*googletag*', route => route.abort());
        await page.route('**/*amazon-adsystem*', route => route.abort());
        await page.route('**/*adsystem*', route => route.abort());
        await page.route('**/*adnxs*', route => route.abort());
        await page.route('**/*ads*', route => route.abort());
        await use(page);
    }
});

export { expect } from '@playwright/test';
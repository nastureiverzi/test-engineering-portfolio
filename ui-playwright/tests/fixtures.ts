import { test as base } from '@playwright/test';

/**
 * Extended Playwright test fixture that safely blocks ad and analytics domains
 * without accidentally killing application assets containing "ads".
 */
export const test = base.extend({
    page: async ({ page }, use) => {
        const blockedDomains = [
            'googlesyndication.com',
            'googleadservices.com',
            'doubleclick.net',
            'google-analytics.com',
            'googletagmanager.com',
            'amazon-adsystem.com',
            'adnxs.com',
            'adservice.google.com',
            'scorecardresearch.com',
            'criteo.com'
        ];

        await page.route('**/*', (route) => {
            const url = route.request().url();
            const isBlocked = blockedDomains.some(domain => url.includes(domain));
            if (isBlocked) {
                return route.abort();
            }
            return route.continue();
        });

        await use(page);
    }
});

export { expect } from '@playwright/test';
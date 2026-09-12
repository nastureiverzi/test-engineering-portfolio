import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import TestDataManager from '../utils/TestDataManager';

test.describe('Products Search Suite', () => {

    /**
     * TC-012 — Search by keyword
     * 
     * Pre-conditions:
     *   - None
     * 
     * Test Data:
     *   - Search query: top
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Products" in the top navigation menu
     *   3. In the search field, type top
     *   4. Click the search button
     * 
     * Expected Result:
     *   - Page displays a list of products matching the keyword "top"
     *   - Unrelated products such as pants or other categories are not shown
     */
    test('TC-012: Search by keyword', { tag: '@products' }, async ({ page }) => {
        const homePage = new HomePage(page);
        const searchQuery = TestDataManager.get('productSearch.keyword');

        // Step 1: Navigate and verify home page
        await homePage.open();
        await expect(homePage.homePageLogo, 'Home page logo should be visible').toBeVisible();

        // Step 2: Click "Products" in the top navigation menu
        const productsPage = await homePage.clickProducts();

        // Steps 3 - 4: Type search query and click search
        await productsPage.searchProduct(searchQuery);

        // Step 5: Verify searched products header is displayed
        await expect(
            productsPage.searchedProductsHeader,
            "'SEARCHED PRODUCTS' header should be displayed"
        ).toBeVisible();

        // Step 6: Verify results are not empty
        const productTitles = await productsPage.getDisplayedProductNames();
        expect(
            productTitles.length,
            `No products returned for search query: '${searchQuery}'`
        ).toBeGreaterThan(0);

        // Step 7: Verify unrelated categories are not shown
        const unrelatedKeywords = ['pant', 'trouser', 'jean', 'skirt', 'shoe', 'bag'];

        for (const title of productTitles) {
            for (const unrelated of unrelatedKeywords) {
                expect(
                    title.toLowerCase(),
                    `Unrelated product '${title}' should not appear in results for '${searchQuery}'`
                ).not.toContain(unrelated);
            }
        }
    });

});
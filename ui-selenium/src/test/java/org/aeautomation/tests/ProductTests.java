package org.aeautomation.tests;

import org.aeautomation.core.BaseTest;
import org.aeautomation.pages.HomePage;
import org.aeautomation.pages.ProductsPage;
import org.aeautomation.utils.TestDataManager;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;

/**
 * Product suite containing tests for product catalog search and filtering functionality.
 */
public class ProductTests extends BaseTest {

    /**
     * TC-012 — Search by keyword
     * Pre-conditions:
     * None
     * Test Data:
     * Search query: top
     * Steps:
     * 1. Navigate to homepage
     * 2. Click "Products" in the top navigation menu
     * 3. In the search field, type top
     * 4. Click the search button
     * Expected Result:
     * Page displays a list of products matching the keyword "top"
     * Unrelated products such as pants or other categories are not shown
     */
    @Test(description = "TC-012: Search product by keyword and verify filtered results")
    public void testSearchProductByKeyword() {
        String searchQuery = TestDataManager.get("productSearch.keyword");

        // Step 1: Navigate to homepage
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Products" in the top navigation menu
        ProductsPage productsPage = homePage.clickProducts();

        // Step 3 & 4: In the search field, type top and click the search button
        productsPage.searchProduct(searchQuery);

        // Expected Result Verification 1: Confirm 'SEARCHED PRODUCTS' header is displayed
        Assert.assertTrue(
                productsPage.isSearchedProductsHeaderDisplayed(),
                "'SEARCHED PRODUCTS' header was not displayed!"
        );

        // Expected Result Verification 2: Page displays a list of products matching the keyword "top"
        List<String> productNames = productsPage.getDisplayedProductNames();
        Assert.assertFalse(
                productNames.isEmpty(),
                "No products returned for search query: " + searchQuery
        );

        // Expected Result Verification 3: Verify results are not from unrelated categories
        List<String> unrelatedKeywords = List.of("pant", "trouser", "jean", "skirt", "shoe", "bag");

        for (String name : productNames) {
            String lowerName = name.toLowerCase();
            for (String unrelated : unrelatedKeywords) {
                Assert.assertFalse(
                        lowerName.contains(unrelated),
                        String.format("Unrelated product '%s' appeared in results for query '%s'!", name, searchQuery)
                );
            }
        }
    }
}

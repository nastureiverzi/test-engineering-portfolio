package org.aeautomation.tests;

import org.aeautomation.core.BaseTest;
import org.aeautomation.data.LoginData;
import org.aeautomation.utils.TestDataManager;
import org.aeautomation.pages.*;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;

/**
 * Cart suite containing tests for adding products to cart and cart management.
 */
public class CartTests extends BaseTest {

    /**
     * TC-013 — Add item to cart
     * Pre-conditions:
     * User is logged in
     * Test Data:
     * None
     * Steps:
     * 1. Navigate to homepage
     * 2. Scroll to the "Featured Items" section
     * 3. Hover over a product card and click "Add to cart"
     * 4. In the confirmation popup, click "View Cart"
     * Expected Result:
     * After step 3, a popup titled "Added!" is displayed with the message "Your product has been added to cart", a "View Cart" link, and a "Continue Shopping" button
     * After step 4, user is redirected to the cart page and the added product is listed correctly
     */
    @Test(description = "TC-013: Add item to cart for logged in user")
    public void testAddItemToCart() {

        // Step 1: Navigate to homepage and log in
        HomePage homePage = new HomePage();
        homePage.open();

        LoginData loginData = TestDataManager.getObject("authentication.validUser", LoginData.class);
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();
        homePage = signupLoginPage.login(loginData.email(), loginData.password());

        // Step 2 & 3: Scroll to "Featured Items", capture product name by index, and click "Add to cart"
        int targetProductIndex = 1;
        String expectedProductName = homePage.getProductNameByIndex(targetProductIndex);

        homePage.addProductToCartByIndex(targetProductIndex);

        // Expected Result Verification (After Step 3):
        // Popup titled "Added!" with message "Your product has been added to cart", "View Cart" link, and "Continue Shopping" button
        Assert.assertTrue(
                homePage.isAddToCartModalTitleDisplayed(),
                "Modal title 'Added!' was not displayed!"
        );
        Assert.assertTrue(
                homePage.isAddToCartModalMessageDisplayed(),
                "Modal message 'Your product has been added to cart' was not displayed!"
        );
        Assert.assertTrue(
                homePage.isModalViewCartLinkDisplayed(),
                "'View Cart' link was not displayed in modal!"
        );
        Assert.assertTrue(
                homePage.isContinueShoppingButtonDisplayed(),
                "'Continue Shopping' button was not displayed in modal!"
        );

        // Step 4: In the confirmation popup, click "View Cart"
        CartPage cartPage = homePage.clickModalViewCart();

        // Expected Result Verification (After Step 4):
        // User is redirected to cart page and added product is listed correctly
        Assert.assertTrue(
                cartPage.isCartPageDisplayed(),
                "User was not redirected to Cart page!"
        );

        List<String> cartProductNames = cartPage.getCartProductNames();
        Assert.assertTrue(
                cartProductNames.contains(expectedProductName),
                String.format("Cart does not contain product '%s'! Actual products in cart: %s", expectedProductName, cartProductNames)
        );
    }
}
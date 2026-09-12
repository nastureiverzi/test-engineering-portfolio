import { test, expect } from './fixtures';
import { HomePage } from '../pages/HomePage';
import TestDataManager from '../utils/TestDataManager';
import { LoginData } from '../data/types';

test.describe('Cart Management Suite', () => {

    /**
     * TC-013 — Add item to cart
     * 
     * Pre-conditions:
     *   - User is logged in
     * 
     * Test Data:
     *   - Product: Blue Top
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Hover over a product card and click "Add to cart"
     *   3. In the confirmation popup, click "View Cart"
     * 
     * Expected Result:
     *   - Popup titled "Added!" is displayed with the message "Your product has been added to cart"
     *   - User is redirected to the cart page via CartPage, cartInfoTable is visible, and the added product is listed correctly
     */
   test('TC-013: Add item to cart', { tag: '@cart' }, async ({ page }) => {

        const homePage = new HomePage(page);
        const productName = TestDataManager.get('cart.productName');
        const loginData = TestDataManager.getObject<LoginData>('authentication.validUser');

        // Step 1: Navigate and verify home page
        await homePage.open();
        await expect(homePage.homePageLogo, 'Home page logo should be visible').toBeVisible();

        // Step 2: Log in with valid credentials
        const signupLoginPage = await homePage.clickSignupLogin();
        await signupLoginPage.login(loginData.email, loginData.password);
        await expect(
            homePage.getLoggedInAsLocator(loginData.expectedUsername!),
            'User should be logged in before adding to cart'
        ).toBeVisible();

        // Step 3: Hover over product card and add to cart
        await homePage.addProductToCartByName(productName);

        // Verify confirmation popup details
        await expect(homePage.modalTitle, "'Added!' modal title should be displayed").toBeVisible();
        await expect(homePage.modalMessage, "Modal message 'Your product has been added to cart' should be visible").toBeVisible();
        await expect(homePage.modalViewCartLink, "'View Cart' link should be visible").toBeVisible();
        await expect(homePage.modalContinueShoppingBtn, "'Continue Shopping' button should be visible").toBeVisible();

        // Step 4: Click "View Cart" in the modal
        const cartPage = await homePage.clickModalViewCart();

        // Step 5: Verify cart table is visible and product is listed correctly
        await expect(cartPage.cartInfoTable, 'Cart products table should be visible').toBeVisible();

        const productNames = await cartPage.getCartProductNames();
        expect(
            productNames,
            `'${productName}' should be listed in the cart`
        ).toContain(productName);
     });
});
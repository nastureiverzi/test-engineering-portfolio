import { test, expect } from './fixtures';
import { HomePage } from '../pages/HomePage';
import type { LoginData } from '../data/types';
import TestDataManager from '../utils/TestDataManager';

test.describe('Authentication Test Suite', () => {

    /**
     * Test Case 6: Successful login with valid credentials
     * 
     * 1. Launch browser
     * 2. Navigate to url homepage
     * 3. Verify that home page is visible successfully
     * 4. Click on 'Signup / Login' button
     * 5. Verify 'Login to your account' is visible
     * 6. Enter correct email address and password
     * 7. Click 'Login' button
     * 8. Verify that 'Logged in as username' is visible
     */
    test('TC-006: Successful login with valid credentials', { tag: '@authentication' }, async ({ page }) => {

        const homePage = new HomePage(page);
        const loginData = TestDataManager.getObject<LoginData>('authentication.validUser');

        // Steps 1 - 2: Navigate and verify home page
        await homePage.open();
        expect(
            await homePage.isHomePageDisplayed(),
            'Home page logo should be visible'
        ).toBeTruthy();

        // Steps 3 - 4: Navigate to Signup/Login page and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        expect(
            await signupLoginPage.isLoginHeaderDisplayed(),
            "'Login to your account' header should be displayed"
        ).toBeTruthy();

        // Steps 5 - 7: Fill valid credentials and submit
        await signupLoginPage.login(loginData.email, loginData.password);

        // Step 8: Verify user is logged in and 'Logged in as username' is displayed
        expect(
            await homePage.isLoggedInAsDisplayed(loginData.expectedUsername!),
            `Header should display 'Logged in as ${loginData.expectedUsername!}'`
        ).toBeTruthy();
    });

    /**
     * Test Case 7: Login with incorrect password
     * 
     * 1. Launch browser
     * 2. Navigate to url homepage
     * 3. Verify that home page is visible successfully
     * 4. Click on 'Signup / Login' button
     * 5. Verify 'Login to your account' is visible
     * 6. Enter valid email address and incorrect password
     * 7. Click 'Login' button
     * 8. Verify error 'Your email or password is incorrect!' is visible and user remains on login page
     */
    test('TC-007: Login with incorrect password', { tag: '@authentication' }, async ({ page }) => {

        const homePage = new HomePage(page);
        const loginData = TestDataManager.getObject<LoginData>('authentication.invalidPassword');

        // Steps 1 - 2: Navigate and verify home page
        await homePage.open();
        expect(
            await homePage.isHomePageDisplayed(),
            'Home page logo should be visible'
        ).toBeTruthy();

        // Steps 3 - 4: Navigate to Signup/Login page and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        expect(
            await signupLoginPage.isLoginHeaderDisplayed(),
            "'Login to your account' header should be displayed"
        ).toBeTruthy();

        // Steps 5 - 7: Enter credentials and submit login form
        await signupLoginPage.login(loginData.email, loginData.password);

        // Step 8: Verify error message is displayed and user remains on login page
        expect(
            await signupLoginPage.isLoginErrorMessageDisplayed(),
            "'Your email or password is incorrect!' error message should be displayed"
        ).toBeTruthy();

        expect(
            await signupLoginPage.isLoginHeaderDisplayed(),
            "User should remain on the login page"
        ).toBeTruthy();

        expect(
        await signupLoginPage.getLoginErrorMessageText(),
        'Error message text should match expected value'
        ).toBe(loginData.expectedError);
    });
});
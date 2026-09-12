import { test, expect } from './fixtures';
import { HomePage } from '../pages/HomePage';
import type { LoginData } from '../data/types';
import TestDataManager from '../utils/TestDataManager';

test.describe('Authentication Test Suite', () => {

   /**
     * TC-006 — Successful login with valid credentials
     * 
     * Pre-conditions:
     *   - User has a registered account
     *   - User is not logged in
     * 
     * Test Data:
     *   - Email: testuser123.qa@gmail.com
     *   - Password: testPass
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. In the "Login to your account" section, enter email and password
     *   4. Click "Login"
     * 
     * Expected Result:
     *   - After step 4, user is redirected to the homepage
     *   - "Logged in as testAccount" is displayed in the top navigation bar
     */
    test('TC-006: Successful login with valid credentials', { tag: '@authentication' }, async ({ page }) => {
        const homePage = new HomePage(page);
        const loginData = TestDataManager.getObject<LoginData>('authentication.validUser');

        // Steps 1 - 3: Navigate and verify home page
        await homePage.open();
        await expect(
            homePage.homePageLogo,
            'Home page logo should be visible'
        ).toBeVisible();

        // Steps 4 - 5: Navigate to Signup/Login page and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(
            signupLoginPage.loginHeader,
            "'Login to your account' header should be displayed"
        ).toBeVisible();

        // Steps 6 - 7: Fill valid credentials and submit
        await signupLoginPage.login(loginData.email, loginData.password);

        // Step 8: Verify user is logged in and 'Logged in as username' is displayed
        await expect(
            homePage.getLoggedInAsLocator(loginData.expectedUsername!),
            `Header should display 'Logged in as ${loginData.expectedUsername!}'`
        ).toBeVisible();
    });

    /**
     * TC-007 — Login with incorrect password
     * 
     * Pre-conditions:
     *   - User has a registered account
     *   - User is not logged in
     * 
     * Test Data:
     *   - Email: testuser123.qa@gmail.com
     *   - Password: testfail
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. In the "Login to your account" section, enter valid email and incorrect password
     *   4. Click "Login"
     * 
     * Expected Result:
     *   - After step 4, a red error message is displayed below the form indicating the email or password is incorrect
     *   - User remains on the login page
     */
    test('TC-007: Login with incorrect password', { tag: '@authentication' }, async ({ page }) => {
        const homePage = new HomePage(page);
        const loginData = TestDataManager.getObject<LoginData>('authentication.invalidPassword');

        // Steps 1 - 3: Navigate and verify home page
        await homePage.open();
        await expect(
            homePage.homePageLogo,
            'Home page logo should be visible'
        ).toBeVisible();

        // Steps 4 - 5: Navigate to Signup/Login page and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(
            signupLoginPage.loginHeader,
            "'Login to your account' header should be displayed"
        ).toBeVisible();

        // Steps 6 - 7: Enter credentials and submit login form
        await signupLoginPage.login(loginData.email, loginData.password);

        // Step 8: Verify error message is displayed, text matches, and user remains on login page
        await expect(
            signupLoginPage.loginErrorMessageText,
            "'Your email or password is incorrect!' error message should be displayed"
        ).toBeVisible();

        await expect(
            signupLoginPage.loginErrorMessageText,
            'Error message text should match expected value'
        ).toHaveText(loginData.expectedError!);

        await expect(
            signupLoginPage.loginHeader,
            "User should remain on the login page"
        ).toBeVisible();
    });

    /**
     * TC-008 — Login with unregistered email
     * 
     * Pre-conditions:
     *   - Email does not exist in the system
     * 
     * Test Data:
     *   - Email: testUnregisteredUser@gmail.com
     *   - Password: testPass
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. In the "Login to your account" section, enter unregistered email and password
     *   4. Click "Login"
     * 
     * Expected Result:
     *   - After step 4, a red error message is displayed below the form indicating the email or password is incorrect
     *   - User remains on the login page
     */
    test('TC-008: Login with unregistered email', { tag: '@authentication' }, async ({ page }) => {
        const homePage = new HomePage(page);
        const loginData = TestDataManager.getObject<LoginData>('authentication.unregisteredEmail');

        // Steps 1 - 3: Navigate and verify home page
        await homePage.open();
        await expect(
            homePage.homePageLogo,
            'Home page logo should be visible'
        ).toBeVisible();

        // Steps 4 - 5: Navigate to Signup/Login page and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(
            signupLoginPage.loginHeader,
            "'Login to your account' header should be displayed"
        ).toBeVisible();

        // Steps 6 - 7: Enter unregistered credentials and submit login form
        await signupLoginPage.login(loginData.email, loginData.password);

        // Step 8: Verify error message is displayed, text matches, and user remains on login page
        await expect(
            signupLoginPage.loginErrorMessageText,
            "'Your email or password is incorrect!' error message should be displayed"
        ).toBeVisible();

        await expect(
            signupLoginPage.loginErrorMessageText,
            'Error message text should match expected value'
        ).toHaveText(loginData.expectedError!);

        await expect(
            signupLoginPage.loginHeader,
            "User should remain on the login page"
        ).toBeVisible();
    });

   /**
     * TC-009 — Login with empty email field
     * 
     * Pre-conditions:
     *   - User is not logged in
     * 
     * Test Data:
     *   - Email: (empty)
     *   - Password: testPass
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. In the "Login to your account" section, leave the email field empty and enter a password
     *   4. Click "Login"
     * 
     * Expected Result:
     *   - After step 4, browser displays a tooltip indicating the email field is required
     *   - User remains on the login page
     */
    test('TC-009: Login with empty email field', { tag: '@authentication' }, async ({ page }) => {
        
        const homePage = new HomePage(page);
        const loginData = TestDataManager.getObject<LoginData>('authentication.emptyEmailLogin');

        // Steps 1 - 3: Navigate and verify home page
        await homePage.open();
        await expect(
            homePage.homePageLogo,
            'Home page logo should be visible'
        ).toBeVisible();

        // Steps 4 - 5: Navigate to Signup/Login page and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(
            signupLoginPage.loginHeader,
            "'Login to your account' header should be displayed"
        ).toBeVisible();

        // Steps 6 - 7: Leave email empty, enter password, and submit login form
        await signupLoginPage.login('', loginData.password);

        // Step 8: Verify native HTML5 validation tooltip blocks submission and user remains on login page
        const validationMessage = await signupLoginPage.getLoginEmailValidationMessage();
        expect(validationMessage).toMatch(/fill|required|email/i);

        await expect(
            signupLoginPage.loginHeader,
            "User should remain on the login page"
        ).toBeVisible();
    });

    /**
     * TC-010 — Login with empty password field
     * 
     * Pre-conditions:
     *   - User has a registered account
     *   - User is not logged in
     * 
     * Test Data:
     *   - Email: testuser123.qa@gmail.com
     *   - Password: (empty)
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. In the "Login to your account" section, enter a valid email and leave the password field empty
     *   4. Click "Login"
     * 
     * Expected Result:
     *   - After step 4, browser displays a validation message indicating the password field is required
     *   - User remains on the login page
     */
    test('TC-010: Login with empty password field', { tag: '@authentication' }, async ({ page }) => {
        
        const homePage = new HomePage(page);
        const loginData = TestDataManager.getObject<LoginData>('authentication.emptyPasswordLogin');

        // Steps 1 - 3: Navigate and verify home page
        await homePage.open();
        await expect(
            homePage.homePageLogo,
            'Home page logo should be visible'
        ).toBeVisible();

        // Steps 4 - 5: Navigate to Signup/Login page and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(
            signupLoginPage.loginHeader,
            "'Login to your account' header should be displayed"
        ).toBeVisible();

        // Steps 6 - 7: Enter valid email, leave password empty, and submit login form
        await signupLoginPage.login(loginData.email, '');

        // Step 8: Verify native HTML5 validation tooltip blocks submission and user remains on login page
        const validationMessage = await signupLoginPage.getLoginPasswordValidationMessage();
        expect(validationMessage).toMatch(/fill|required|password/i);

        await expect(
            signupLoginPage.loginHeader,
            "User should remain on the login page"
        ).toBeVisible();
    });
});
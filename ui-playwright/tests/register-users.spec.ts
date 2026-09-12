import { test, expect } from './fixtures';
import { HomePage } from '../pages/HomePage';
import type { ExistingUserData, InvalidEmailData, UserRegistrationData } from '../data/types';
import TestDataManager from '../utils/TestDataManager';
import TestDataGenerator from '../utils/TestDataGenerator';

test.describe('Registration Test Suite', () => {

    /**
     * TC-001 — Successful signup and account creation
     * 
     * Pre-conditions:
     *   - User is not logged in
     *   - Email is not registered
     * 
     * Test Data:
     *   - Username: testAccount
     *   - Email: testuser123.qa@gmail.com
     *   - Password: testPass
     *   - First Name: Test / Last Name: User
     *   - DOB: 15/May/1990
     *   - Address: 123 Test Street, Test City, Test State, 12345, US
     *   - Mobile: 1234567890
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. In the "New User Signup!" section, enter username and email
     *   4. Click "Signup"
     *   5. Fill in all required account information fields (Title, Password, DOB)
     *   6. Fill in all required address fields (Name, Address, Country, State, City, Zipcode, Mobile)
     *   7. Click "Create Account"
     *   8. Click "Continue"
     * 
     * Expected Result:
     *   - After step 7, "Account Created!" page is displayed
     *   - After step 8, user is redirected to the homepage
     *   - "Logged in as testAccount" appears in the top navigation bar
     */
    test('TC-001: Register User with valid details', { tag: '@registration' }, async ({ page }) => {

        const homePage = new HomePage(page);
        const userData = TestDataManager.getObject<UserRegistrationData>('userRegistration');
        const email = TestDataGenerator.generateEmail('qa');

        // Steps 1 - 3: Navigate and verify home page logo is visible
        await homePage.open();
        await expect(homePage.homePageLogo, 'Home page logo should be visible').toBeVisible();

        // Steps 4 - 5: Navigate to Signup/Login and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(signupLoginPage.newUserSignupHeader, "'New User Signup!' header should be displayed").toBeVisible();

        // Steps 6 - 7: Enter signup details and submit
        await signupLoginPage.enterSignupDetails(userData.name, email);
        const accountInfoPage = await signupLoginPage.clickSignup();

        // Step 8: Verify Enter Account Information header
        await expect(accountInfoPage.enterAccountInfoHeading, "'ENTER ACCOUNT INFORMATION' heading should be displayed").toBeVisible();

        // Steps 9 - 11: Fill personal account details and opt-ins
        await accountInfoPage.fillAccountInformation({
            title: userData.title,
            password: userData.password,
            day: userData.dobDay,
            month: userData.dobMonth,
            year: userData.dobYear
        });

        // Step 12: Fill personal address and billing details
        await accountInfoPage.fillAddressInformation({
            firstName: userData.firstName,
            lastName: userData.lastName,
            company: userData.company,
            address1: userData.address1,
            address2: userData.address2,
            country: userData.country,
            state: userData.state,
            city: userData.city,
            zipcode: userData.zipcode,
            mobileNumber: userData.mobileNumber
        });

        // Steps 13 - 14: Submit and verify Account Created header
        const accountCreatedPage = await accountInfoPage.clickCreateAccount();
        await expect(accountCreatedPage.accountCreatedHeading, "'ACCOUNT CREATED!' confirmation heading should be displayed").toBeVisible();

        // Steps 15 - 16: Click Continue and verify logged-in username badge in top navigation
        const loggedInHomePage = await accountCreatedPage.clickContinue();
        await expect(loggedInHomePage.loggedInAsText, `Navigation header should display username '${userData.name}'`).toContainText(userData.name);
        await expect(loggedInHomePage.loggedInAsText).toBeVisible();
    });

    /**
     * TC-002 — Registration with already registered email
     * 
     * Pre-conditions:
     *   - User is not logged in
     * 
     * Test Data:
     *   - Username: testAccount
     *   - Email: testuser123.qa@gmail.com (already registered)
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. In the "New User Signup!" section, enter username and the already registered email
     *   4. Click "Signup"
     * 
     * Expected Result:
     *   - After step 4, a red error message is displayed below the signup form indicating the email already exists
     *   - User remains on the registration page
     */
    test('TC-002: Register User with already registered email', { tag: '@registration' }, async ({ page }) => {

        const homePage = new HomePage(page);
        const existingUserData = TestDataManager.getObject<ExistingUserData>('existingUser');

        // Steps 1 - 3: Navigate and verify home page
        await homePage.open();
        await expect(homePage.homePageLogo, 'Home page logo should be visible').toBeVisible();

        // Steps 4 - 5: Navigate to Signup/Login and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(signupLoginPage.newUserSignupHeader, "'New User Signup!' header should be displayed").toBeVisible();

        // Steps 6 - 7: Enter registered email details and submit
        await signupLoginPage.enterSignupDetails(existingUserData.name, existingUserData.email);
        await signupLoginPage.clickSignup();

        // Step 8: Verify error message is displayed and user remains on registration page
        await expect(
            signupLoginPage.signupErrorMessageText,
            "'Email Address already exist!' error message should be displayed"
        ).toBeVisible();
    });

    /**
     * TC-003 — Registration with missing @ symbol in email
     * 
     * Pre-conditions:
     *   - User is not logged in
     *   - Email is not registered
     * 
     * Test Data:
     *   - Username: testAccount
     *   - Email: test124.gmail.com
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. In the "New User Signup!" section, enter username and the malformed email
     *   4. Click "Signup"
     * 
     * Expected Result:
     *   - After step 4, browser displays a native HTML5 tooltip next to the email field indicating the @ symbol is missing
     *   - No network request is sent
     *   - User remains on the registration page
     */
    test('TC-003: Registration with missing @ symbol in email', { tag: '@registration' }, async ({ page }) => {

        const homePage = new HomePage(page);
        const invalidEmailData = TestDataManager.getObject<InvalidEmailData>('invalidRegistration.missingAtSymbol');

        // Steps 1 - 3: Navigate and verify home page
        await homePage.open();
        await expect(homePage.homePageLogo, 'Home page logo should be visible').toBeVisible();

        // Steps 4 - 5: Navigate to Signup/Login and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(signupLoginPage.newUserSignupHeader, "'New User Signup!' header should be displayed").toBeVisible();

        // Steps 6 - 7: Enter malformed email details and submit
        await signupLoginPage.enterSignupDetails(invalidEmailData.username, invalidEmailData.email);
        await signupLoginPage.clickSignup();

        // Step 8: Verify native HTML5 browser tooltip validation message
        const validationMessage = await signupLoginPage.getSignupEmailValidationMessage();
        expect(
            validationMessage,
            `Browser validation message should indicate invalid email format. Actual: '${validationMessage}'`
        ).toMatch(/@|email|address/i);
    });

   /**
     * TC-004 — Registration with missing email domain
     * 
     * Pre-conditions:
     *   - User is not logged in
     *   - Email is not registered
     * 
     * Test Data:
     *   - Username: testAccount
     *   - Email: test124@gmail
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. In the "New User Signup!" section, enter username and the malformed email
     *   4. Click "Signup"
     * 
     * Expected Result:
     *   - After step 4, browser or application displays a validation message indicating the email is invalid
     *   - User remains on the registration page
     *
     * Known Bug: Native browser validation fails to catch missing TLD/domain suffix 
     * and redirects to AccountInformationPage instead of showing an error.
     */
    test('TC-004: Registration with missing email domain', { tag: ['@registration', '@known-bugs'] }, async ({ page, browserName }) => {

        test.skip(browserName === 'webkit', 'WebKit native client-side email validation prevents reaching backend submission check');

        const homePage = new HomePage(page);
        const invalidEmailData = TestDataManager.getObject<InvalidEmailData>('invalidRegistration.missingDomain');

        // Steps 1 - 3: Navigate and verify home page
        await homePage.open();
        await expect(homePage.homePageLogo, 'Home page logo should be visible').toBeVisible();

        // Steps 4 - 5: Navigate to Signup/Login and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(signupLoginPage.newUserSignupHeader, "'New User Signup!' header should be displayed").toBeVisible();

        // Steps 6 - 7: Enter malformed email details and submit
        await signupLoginPage.enterSignupDetails(invalidEmailData.username, invalidEmailData.email);

        await signupLoginPage.clickSignup();

        
        // Step 8: Verify user remains on signup page (Expected to fail until BUG-002 is resolved)
        await expect(
            signupLoginPage.newUserSignupHeader,
            'BUG-002: User was redirected to registration form despite missing email domain suffix'
        ).toBeVisible();
    });

    /**
     * TC-005 — Registration with empty username field
     * 
     * Pre-conditions:
     *   - User is not logged in
     *   - Email is not registered
     * 
     * Test Data:
     *   - Username: (empty)
     *   - Email: test124@gmail.com
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. In the "New User Signup!" section, leave the username field empty and enter a valid email
     *   4. Click "Signup"
     * 
     * Expected Result:
     *   - After step 4, browser displays a tooltip next to the username field indicating the field is required
     *   - User remains on the registration page
     */
    test('TC-005: Registration with empty username field', { tag: '@registration' }, async ({ page }) => {

        const homePage = new HomePage(page);
        const email = TestDataGenerator.generateEmail('qa');

        // Steps 1 - 3: Navigate and verify home page
        await homePage.open();
        await expect(homePage.homePageLogo, 'Home page logo should be visible').toBeVisible();

        // Steps 4 - 5: Navigate to Signup/Login and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(signupLoginPage.newUserSignupHeader, "'New User Signup!' header should be displayed").toBeVisible();

        // Steps 6 - 7: Leave username empty, fill email, and submit
        await signupLoginPage.enterSignupDetails('', email);
        await signupLoginPage.clickSignup();

        // Step 8: Verify HTML5 validation tooltip on the name field and verify user remains on page
        const validationMessage = await signupLoginPage.getSignupUsernameValidationMessage();
        expect(
            validationMessage,
            'Browser validation message should indicate the username field is required'
        ).toBeTruthy();

        await expect(signupLoginPage.newUserSignupHeader, 'User should remain on the registration page').toBeVisible();
    });

    /**
     * TC-011 — Multi-click submission on registration
     * 
     * Pre-conditions:
     *   - User is not logged in
     *   - Email is not registered
     * 
     * Test Data:
     *   - Username: testAccount
     *   - Email: testuser123.qa+1@gmail.com
     *   - Password: testPass
     *   - First Name: Test / Last Name: Registration
     *   - DOB: 1/January/1987
     *   - Address: 456 Street, Moody, Alabama, 35004, US
     *   - Mobile: 345678901
     * 
     * Steps:
     *   1. Navigate to homepage
     *   2. Click "Signup / Login" in the top navigation menu
     *   3. Enter username and email in the "New User Signup!" section and click "Signup"
     *   4. Fill in all required account and address fields
     *   5. Click "Create Account" 5 times in quick succession
     * 
     * Expected Result:
     *   - First click submits the registration request
     *   - Button is disabled or debounced after the first click to prevent duplicate submissions
     *   - "Account Created!" page is displayed once
     */
   test('TC-011: Multi-click submission on registration', { tag: ['@registration', '@known-bugs'] }, async ({ page }) => {

        const homePage = new HomePage(page);
        const userData = TestDataManager.getObject<UserRegistrationData>('userRegistration');
        const email = TestDataGenerator.generateEmail('qa_multiclick');

        // Step 1: Navigate and verify home page
        await homePage.open();
        await expect(homePage.homePageLogo, 'Home page logo should be visible').toBeVisible();

        // Step 2: Click "Signup / Login" and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        await expect(signupLoginPage.newUserSignupHeader, "'New User Signup!' header should be displayed").toBeVisible();

        // Step 3: Enter username and email, click Signup
        await signupLoginPage.enterSignupDetails(userData.name, email);
        const accountInfoPage = await signupLoginPage.clickSignup();

        // Step 4: Fill all required account and address fields
        await accountInfoPage.fillAccountInformation({
            title: userData.title,
            password: userData.password,
            day: userData.dobDay,
            month: userData.dobMonth,
            year: userData.dobYear
        });

        await accountInfoPage.fillAddressInformation({
            firstName: userData.firstName,
            lastName: userData.lastName,
            company: userData.company,
            address1: userData.address1,
            address2: userData.address2,
            country: userData.country,
            state: userData.state,
            city: userData.city,
            zipcode: userData.zipcode,
            mobileNumber: userData.mobileNumber
        });

        // Steps 5 & 6: Click Create Account and immediately check disabled state in same JS frame
        // BUG-002: Button is not debounced — duplicate requests trigger 500 IntegrityError
        // This test is expected to FAIL until BUG-002 is resolved
        const isDisabled = await accountInfoPage.createAccountButton.evaluate(
            (btn: HTMLButtonElement) => {
                btn.click();
                return btn.disabled;
            }
        );

        expect(
            isDisabled,
            'BUG-002: Button should be disabled after first click to prevent duplicate submissions'
        ).toBe(true);
    });
});
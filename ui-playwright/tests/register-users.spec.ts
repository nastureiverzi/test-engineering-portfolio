import { test, expect } from './fixtures';
import { HomePage } from '../pages/HomePage';
import type { ExistingUserData, InvalidEmailData, UserRegistrationData } from '../data/types';
import TestDataManager from '../utils/TestDataManager';
import TestDataGenerator from '../utils/TestDataGenerator';

test.describe('Registration Test Suite', () => {

    /**
     * Test Case 1: Register User
     * 
     * 1. Launch browser
     * 2. Navigate to homepage
     * 3. Verify that home page is visible successfully
     * 4. Click on 'Signup / Login' button
     * 5. Verify 'New User Signup!' is visible
     * 6. Enter name and email address
     * 7. Click 'Signup' button
     * 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
     * 9. Fill details: Title, Name, Email, Password, Date of birth
     * 10. Select checkbox 'Sign up for our newsletter!'
     * 11. Select checkbox 'Receive special offers from our partners!'
     * 12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
     * 13. Click 'Create Account' button
     * 14. Verify that 'ACCOUNT CREATED!' is visible
     * 15. Click 'Continue' button
     * 16. Verify that 'Logged in as username' is visible
     */
    test('TC-001: Register User with valid details', { tag: '@registration' }, async ({page}) => {

        const homePage = new HomePage(page);
        const userData = TestDataManager.getObject<UserRegistrationData>('userRegistration');
        const email = TestDataGenerator.generateEmail('qa');

        // Steps 1 - 2: Navigate and verify home page
        await homePage.open();
        expect(
            await homePage.isHomePageDisplayed(),
            'Home page logo should be visible'
        ).toBeTruthy();

        // Step 3 - 4: Navigate to Signup/Login and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        expect(
            await signupLoginPage.isNewUserSignupHeaderDisplayed(),
            "'New User Signup!' header should be displayed"
        ).toBeTruthy();

        // Steps 5 - 6: Enter signup details and submit
        await signupLoginPage.enterSignupDetails(userData.name, email);
        const accountInfoPage = await signupLoginPage.clickSignup();

        // Step 7: Verify Enter Account Information header
        expect(
            await accountInfoPage.isEnterAccountInfoDisplayed(),
            "'ENTER ACCOUNT INFORMATION' heading should be displayed"
        ).toBeTruthy();

        // Steps 8 - 10: Fill personal account details
        await accountInfoPage.fillAccountInformation({
            title: userData.title,
            password: userData.password,
            day: userData.dobDay,
            month: userData.dobMonth,
            year: userData.dobYear
        });

        // Step 11: Fill address details
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

        // Steps 12 - 13: Submit and verify Account Created header
        const accountCreatedPage = await accountInfoPage.clickCreateAccount();
        expect(
            await accountCreatedPage.isAccountCreatedDisplayed(),
            "'ACCOUNT CREATED!' confirmation should be displayed"
        ).toBeTruthy();

        // Steps 14 - 15: Click Continue and verify logged-in status
        const loggedInPage = await accountCreatedPage.clickContinue();
        expect(
            await loggedInPage.isLoggedInAsDisplayed(userData.name),
            `Header should display 'Logged in as ${userData.name}'`
        ).toBeTruthy();
    });

    /**
     * Test Case 2: Register User with already registered email
     * 
     * 1. Launch browser
     * 2. Navigate to homepage
     * 3. Verify that home page is visible successfully
     * 4. Click on 'Signup / Login' button
     * 5. Verify 'New User Signup!' is visible
     * 6. Enter name and already registered email address
     * 7. Click 'Signup' button
     * 8. Verify error 'Email Address already exist!' is visible
     */
    test('TC-002: Register User with already registered email', { tag: '@registration' }, async ({ page }) => {

        const homePage = new HomePage(page);
        const existingUserData = TestDataManager.getObject<ExistingUserData>('existingUser');

        // Steps 1 - 2: Navigate and verify home page
        await homePage.open();
        expect(
            await homePage.isHomePageDisplayed(),
            'Home page logo should be visible'
        ).toBeTruthy();

        // Steps 3 - 4: Navigate to Signup/Login and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        expect(
            await signupLoginPage.isNewUserSignupHeaderDisplayed(),
            "'New User Signup!' header should be displayed"
        ).toBeTruthy();

        // Steps 5 - 7: Enter registered email details and submit
        await signupLoginPage.enterSignupDetails(existingUserData.name, existingUserData.email);
        await signupLoginPage.clickSignup();

        // Step 8: Verify error message is displayed and user remains on registration page
        expect(
            await signupLoginPage.isEmailAlreadyExistsErrorDisplayed(),
            "'Email Address already exist!' error message should be displayed"
        ).toBeTruthy();
    });

    /**
     * Test Case 3: Registration with missing @ symbol in email
     * 
     * 1. Launch browser
     * 2. Navigate to homepage
     * 3. Verify that home page is visible successfully
     * 4. Click on 'Signup / Login' button
     * 5. Verify 'New User Signup!' is visible
     * 6. Enter username and malformed email address (missing @)
     * 7. Click 'Signup' button
     * 8. Verify browser displays native HTML5 validation message for missing @ symbol
     */
    test('TC-003: Registration with missing @ symbol in email', { tag: '@registration' }, async ({ page }) => {

        const homePage = new HomePage(page);
        const invalidEmailData = TestDataManager.getObject<InvalidEmailData>('invalidRegistration.missingAtSymbol');

        // Steps 1 - 2: Navigate and verify home page
        await homePage.open();
        expect(
            await homePage.isHomePageDisplayed(),
            'Home page logo should be visible'
        ).toBeTruthy();

        // Steps 3 - 4: Navigate to Signup/Login and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        expect(
            await signupLoginPage.isNewUserSignupHeaderDisplayed(),
            "'New User Signup!' header should be displayed"
        ).toBeTruthy();

        // Steps 5 - 7: Enter malformed email details and submit
        await signupLoginPage.enterSignupDetails(invalidEmailData.username, invalidEmailData.email);
        void await signupLoginPage.clickSignup();

        // Step 8: Verify native HTML5 browser tooltip validation message
        const validationMessage = await signupLoginPage.getSignupEmailValidationMessage();
        expect(
        validationMessage.includes('@') || 
        validationMessage.toLowerCase().includes('email') ||
        validationMessage.toLowerCase().includes('address'),
        `Browser validation message should indicate invalid email format. Actual: ${validationMessage}`
        ).toBeTruthy();
    });

    /**
     * Test Case 4: Registration with missing email domain
     * 
     * 1. Launch browser
     * 2. Navigate to homepage
     * 3. Verify that home page is visible successfully
     * 4. Click on 'Signup / Login' button
     * 5. Verify 'New User Signup!' is visible
     * 6. Enter username and malformed email address (missing domain suffix, e.g. test124@gmail)
     * 7. Click 'Signup' button
     * 8. Verify validation message is displayed and user remains on registration page
     * 
     * Known Bug: Native browser validation fails to catch missing TLD/domain suffix 
     * and redirects to AccountInformationPage instead of showing an error.
     */
    test('TC-004: Registration with missing email domain', { tag: ['@registration', '@known-bugs'] }, async ({ page }) => {

        const homePage = new HomePage(page);
        const invalidEmailData = TestDataManager.getObject<InvalidEmailData>('invalidRegistration.missingDomain');

        // Steps 1 - 2: Navigate and verify home page
        await homePage.open();
        expect(
            await homePage.isHomePageDisplayed(),
            'Home page logo should be visible'
        ).toBeTruthy();

        // Steps 3 - 4: Navigate to Signup/Login and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        expect(
            await signupLoginPage.isNewUserSignupHeaderDisplayed(),
            "'New User Signup!' header should be displayed"
        ).toBeTruthy();

        // Steps 5 - 7: Enter malformed email details and submit
        await signupLoginPage.enterSignupDetails(invalidEmailData.username, invalidEmailData.email);
        await signupLoginPage.clickSignup();

        // Step 8: Verify user remains on signup page (Fails due to BUG-002)
        // BUG-001: User is incorrectly redirected to registration form despite invalid email
        expect(
            await signupLoginPage.isNewUserSignupHeaderDisplayed(),
            'BUG-002: User was redirected to registration form despite missing email domain suffix'
        ).toBeTruthy();
    });

    /**
     * Test Case 5: Registration with empty username field
     * 
     * 1. Launch browser
     * 2. Navigate to homepage
     * 3. Verify that home page is visible successfully
     * 4. Click on 'Signup / Login' button
     * 5. Verify 'New User Signup!' is visible
     * 6. Leave username empty and enter email address
     * 7. Click 'Signup' button
     * 8. Verify browser displays native HTML5 tooltip requiring the username field
     */
    test('TC-005: Registration with empty username field', { tag: '@registration' }, async ({ page }) => {

        const homePage = new HomePage(page);
        const email = TestDataGenerator.generateEmail('qa');

        // Steps 1 - 2: Navigate and verify home page
        await homePage.open();
        expect(
            await homePage.isHomePageDisplayed(),
            'Home page logo should be visible'
        ).toBeTruthy();

        // Steps 3 - 4: Navigate to Signup/Login and verify header
        const signupLoginPage = await homePage.clickSignupLogin();
        expect(
            await signupLoginPage.isNewUserSignupHeaderDisplayed(),
            "'New User Signup!' header should be displayed"
        ).toBeTruthy();

        // Steps 5 - 7: Leave username empty, fill email, and submit
        await signupLoginPage.enterSignupDetails('', email);
        await signupLoginPage.clickSignup();

        // Step 8: Verify HTML5 validation tooltip on the name field and stay on page
        const validationMessage = await signupLoginPage.getSignupUsernameValidationMessage();
        expect(
            validationMessage,
            "Browser validation message should indicate the username field is required"
        ).toBeTruthy();

        expect(
            await signupLoginPage.isNewUserSignupHeaderDisplayed(),
            "User should remain on the registration page"
        ).toBeTruthy();
    });
});
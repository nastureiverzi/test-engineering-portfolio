import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SignupLoginPage } from '../pages/SignupLoginPage';
import { AccountInformationPage } from '../pages/AccountInformationPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import type { UserRegistrationData } from '../data/types';
import ConfigReader from '../utils/ConfigReader';
import TestDataManager from '../utils/TestDataManager';
import TestDataGenerator from '../utils/TestDataGenerator';

test.describe('RegisterUser Test Suite', () => {

    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
    });

    /**
     * Test Case 1: Register User
     * 
     * 1. Launch browser
     * 2. Navigate to url 'http://automationexercise.com'
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
});
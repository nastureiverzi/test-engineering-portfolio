package org.aeautomation.tests;

import org.aeautomation.core.BaseTest;
import org.aeautomation.pages.*;
import org.aeautomation.utils.ConfigReader;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Test Suite verifying the user account creation and registration workflows.
 */
public class RegisterUserTest extends BaseTest {
    /**
     * TC-001: Register User successfully and verify authenticated redirection.
     * <p>
     * Steps:
     * 1. Launch browser & navigate to home page.
     * 2. Verify home page is visible.
     * 3. Click 'Signup / Login' button.
     * 4. Verify 'New User Signup!' header text.
     * 5. Enter name and dynamic email address, then click 'Signup'.
     * 6. Verify 'ENTER ACCOUNT INFORMATION' header text.
     * 7-10. Fill title, password, DOB, preferences, address details, and click 'Create Account'.
     * 11. Verify 'ACCOUNT CREATED!' header text.
     * 12. Click 'Continue' button.
     * 13. Verify 'Logged in as [username]' badge appears on the home page.
     */
    @Test(description = "Test Case 1: Register User successfully and cleanup account")
    public void testRegisterUser() {
        // --- Test Data Initialization ---
        String name = "TestUser";
        String email = "qa_" + System.currentTimeMillis() + "@example.com"; // Dynamic email to prevent collisions
        String password = "Password123!";

        // Date of Birth
        String dobDay = "15";
        String dobMonth = "May";
        String dobYear = "1995";

        // Personal & Address Details
        String firstName = "Test";
        String lastName = "User";
        String company = "Acme Inc";
        String address1 = "123 Main St";
        String address2 = "Apt 4B";
        String country = "United States";
        String state = "California";
        String city = "Los Angeles";
        String zipcode = "90210";
        String mobileNumber = "1234567890";

        // Expected Headers & Strings
        String expectedSignupHeader = "New User Signup!";
        String expectedAccountInfoHeader = "ENTER ACCOUNT INFORMATION";
        String expectedAccountCreatedHeader = "ACCOUNT CREATED!";

        // 1. Launch browser & navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // 2. Verify home page is visible successfully
        Assert.assertTrue(homePage.isHomePageDisplayed(), "Home page logo is not displayed.");

        // 3. Click 'Signup / Login' button
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // 4. Verify 'New User Signup!' is visible
        Assert.assertEquals(signupLoginPage.getSignupHeaderText(), expectedSignupHeader,
                "Signup header text mismatch.");

        // 5. Enter name, email address, and click 'Signup' button
        AccountInformationPage infoPage = signupLoginPage.submitSignup(name, email);

        // 6. Verify 'ENTER ACCOUNT INFORMATION' is visible
        Assert.assertEquals(infoPage.getPageHeaderText().toUpperCase(), expectedAccountInfoHeader,
                "Account information page header mismatch.");

        // 7 - 10. Fill details and click 'Create Account' button
        AccountCreatedPage createdPage = infoPage.selectTitleMr()
                .enterPassword(password)
                .selectDateOfBirth(dobDay, dobMonth, dobYear)
                .selectNewsletterAndOffers()
                .fillAddressDetails(
                        firstName, lastName, company,
                        address1, address2, country,
                        state, city, zipcode, mobileNumber
                )
                .clickCreateAccount();

        // 11. Verify 'ACCOUNT CREATED!' is visible
        Assert.assertEquals(createdPage.getHeaderText().toUpperCase(), expectedAccountCreatedHeader,
                "Account created text mismatch.");

        // 12. Click 'Continue' button
        homePage = createdPage.clickContinue();

        // 13. Verify 'Logged in as username' is visible
        Assert.assertTrue(homePage.isLoggedInAsDisplayed(name),
                "Logged in as username was not displayed on home page.");
    }

    /**
     * TC-002: Registration with already registered email
     * <p>
     * Pre-conditions:
     * - User is not logged in
     * - Email is already registered
     * <p>
     * Steps:
     * 1. Navigate to home page.
     * 2. Click 'Signup / Login'.
     * 3. Enter username and an already registered email.
     * 4. Click 'Signup'.
     * <p>
     * Expected Result:
     * - Red error message is displayed indicating email already exists.
     * - User remains on the registration page.
     */
    @Test(description = "TC-002: Registration with already registered email")
    public void testRegisterWithExistingEmail() {
        // --- Test Data Initialization ---
        String username = ConfigReader.getExistingUsername();
        String existingEmail = ConfigReader.getExistingUserEmail();
        String expectedErrorMessage = "Email Address already exist!";
        String expectedSignupHeader = "New User Signup!";

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login" in top navigation menu
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Steps 3 & 4: Enter username and already registered email, then click "Signup"
        signupLoginPage.submitSignupExpectingFailure(username, existingEmail);

        // Expected Result 1: Red error message is displayed below signup form
        Assert.assertEquals(signupLoginPage.getSignupErrorMessage(), expectedErrorMessage,
                "Signup error message mismatch for existing email.");

        // Expected Result 2: User remains on the signup/login page
        Assert.assertEquals(signupLoginPage.getSignupHeaderText(), expectedSignupHeader,
                "User was not kept on the signup page after invalid registration attempt.");
    }
}
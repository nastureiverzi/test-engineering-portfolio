package org.aeautomation.tests;

import org.aeautomation.core.BaseTest;
import org.aeautomation.data.*;
import org.aeautomation.pages.*;
import org.aeautomation.utils.TestDataGenerator;
import org.aeautomation.utils.TestDataManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.JavascriptExecutor;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.awt.*;

/**
 * Test Suite verifying the user account creation and registration workflows.
 */
public class RegisterUserTests extends BaseTest {

    private static final Logger log = LogManager.getLogger(RegisterUserTests.class);
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
        UserRegistrationData userData = TestDataManager.getObject("userRegistration", UserRegistrationData.class);
        String dynamicEmail = TestDataGenerator.generateEmail("qa");
        log.info("TC-001: Registering new user [{}] with dynamic email: [{}]", userData.name(), dynamicEmail);
        // 1. Launch browser & navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // 2. Verify home page is visible successfully
        Assert.assertTrue(homePage.isHomePageDisplayed(), "Home page logo is not displayed.");

        // 3. Click 'Signup / Login' button
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // 4. Verify 'New User Signup!' is visible
        Assert.assertEquals(signupLoginPage.getSignupHeaderText(), SignupLoginPage.SIGNUP_HEADER_TEXT,
                "Signup header text mismatch.");

        // 5. Enter name, email address, and click 'Signup' button
        AccountInformationPage infoPage = signupLoginPage.submitSignup(userData.name(), dynamicEmail);

        // 6. Verify 'ENTER ACCOUNT INFORMATION' is visible
        Assert.assertEquals(infoPage.getPageHeaderText().toUpperCase(), AccountInformationPage.HEADER_TEXT,
                "Account information page header mismatch.");

        // 7 - 10. Fill details and click 'Create Account' button
        AccountCreatedPage createdPage = infoPage.selectTitle(Title.MR)
                .enterPassword(userData.password())
                .selectDateOfBirth(userData.dobDay(), userData.dobMonth(), userData.dobYear())
                .selectNewsletterAndOffers()
                .fillAddressDetails(userData)
                .clickCreateAccount();

        // 11. Verify 'ACCOUNT CREATED!' is visible
        Assert.assertEquals(createdPage.getHeaderText().toUpperCase(), AccountCreatedPage.HEADER_TEXT,
                "Account created text mismatch.");

        // 12. Click 'Continue' button
        homePage = createdPage.clickContinue();

        // 13. Verify 'Logged in as username' is visible
        Assert.assertTrue(homePage.isLoggedInAsDisplayed(userData.name()),
                "Logged in as username was not displayed on home page.");
    }

    /**
     * TC-002: Registration with already registered email
     * Pre-conditions:
     * - User is not logged in
     * - Email is already registered
     * Steps:
     * 1. Navigate to home page.
     * 2. Click 'Signup / Login'.
     * 3. Enter username and an already registered email.
     * 4. Click 'Signup'.
     * Expected Result:
     * - Red error message is displayed indicating email already exists.
     * - User remains on the registration page.
     */
    @Test(description = "TC-002: Registration with already registered email")
    public void testRegisterWithExistingEmail() {
        UserCredentialsData data = TestDataManager.getObject("existingUser", UserCredentialsData.class);

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login" in top navigation menu
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Steps 3 & 4: Enter username and already registered email, then click "Signup"
        signupLoginPage.submitSignupExpectingFailure(data.name(), data.email());

        // Expected Result 1: Red error message is displayed below signup form
        Assert.assertEquals(signupLoginPage.getSignupErrorMessage(), SignupLoginPage.EXISTING_EMAIL_ERROR_TEXT,
                "Signup error message mismatch for existing email.");

        // Expected Result 2: User remains on the signup/login page
        Assert.assertEquals(signupLoginPage.getSignupHeaderText(), SignupLoginPage.SIGNUP_HEADER_TEXT,
                "User was not kept on the signup page after invalid registration attempt.");
    }

    /**
     * TC-003 — Registration with missing @ symbol in email
     * Pre-conditions:
     * - User is not logged in
     * - Email is not registered
     * Test Data:
     * - Username: testAccount
     * - Email: test124.gmail.com
     * Steps:
     * 1. Navigate to homepage
     * 2. Click "Signup / Login" in the top navigation menu
     * 3. In the "New User Signup!" section, enter username and the malformed email
     * 4. Click "Signup"
     * Expected Result:
     * - After step 4, browser displays a native HTML5 tooltip next to the email field indicating the @ symbol is missing
     * - No network request is sent
     * - User remains on the registration page
     */
    @Test(description = "TC-003: Registration with missing @ symbol in email triggers HTML5 native validation")
    public void testRegistrationMissingAtSymbol() {
        UserCredentialsData data = TestDataManager.getObject("invalidRegistration.missingAtSymbol", UserCredentialsData.class);

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login" in the top navigation menu
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Steps 3 & 4: Enter username and malformed email, then click "Signup"
        signupLoginPage.submitSignupExpectingFailure(data.name(), data.email());

        // Expected Result 1: Browser displays a native HTML5 tooltip next to the email field indicating the @ symbol is missing
        String validationMessage = signupLoginPage.getSignupEmailValidationMessage();
        Assert.assertNotNull(validationMessage, "HTML5 validation message was null.");
        Assert.assertFalse(validationMessage.isBlank(), "HTML5 validation message was empty.");
        Assert.assertTrue(
                validationMessage.contains("@") ||
                        validationMessage.toLowerCase().contains("email") ||
                        validationMessage.toLowerCase().contains("address"),
                "Validation message did not indicate invalid email format. Actual message: " + validationMessage
        );

        // Expected Result 2: User remains on the registration page
        Assert.assertEquals(signupLoginPage.getSignupHeaderText(), SignupLoginPage.SIGNUP_HEADER_TEXT,
                "User was navigated away from signup page despite invalid email format.");
    }

    /**
     * TC-004 — Registration with missing email domain
     * Pre-conditions:
     * - User is not logged in
     * - Email is not registered
     * Test Data:
     * - Username: testAccount
     * - Email: test124@gmail
     * Steps:
     * 1. Navigate to homepage
     * 2. Click "Signup / Login" in the top navigation menu
     * 3. In the "New User Signup!" section, enter username and the malformed email
     * 4. Click "Signup"
     * Expected Result:
     * - After step 4, browser or application displays a validation message indicating the email is invalid
     * - User remains on the registration page
     * Notes: Backend accepts test124@gmail as a valid email — missing domain suffix validation at both client and server level
     */
    @Test(description = "TC-004: Registration with missing email domain — documents known validation bug",
            groups = {"known-bugs"})
    public void testRegistrationMissingEmailDomain() {
        log.warn("TC-004: Known bug BUG-001 — asserting inverted behaviour, this test is expected to FAIL");
        UserCredentialsData data = TestDataManager.getObject("invalidRegistration.missingDomain", UserCredentialsData.class);

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login" in the top navigation menu
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Steps 3 & 4: Enter username and malformed email, then click "Signup"
        signupLoginPage.submitSignupExpectingFailure(data.name(), data.email());

        // Expected Result 2: Check URL first to ensure user remained on signup/login page
        Assert.assertFalse(signupLoginPage.getCurrentUrl().endsWith("/signup"),
                "BUG: User was navigated away to full registration form despite missing email domain suffix!");
    }

    /**
     * TC-005 — Registration with empty username field
     * Pre-conditions:
     * - User is not logged in
     * - Email is not registered
     * Test Data:
     * - Username: (empty)
     * - Email: test124@gmail.com
     * Steps:
     * 1. Navigate to homepage
     * 2. Click "Signup / Login" in the top navigation menu
     * 3. In the "New User Signup!" section, leave the username field empty and enter a valid email
     * 4. Click "Signup"
     * Expected Result:
     * - After step 4, browser displays a tooltip next to the username field indicating the field is required
     * - User remains on the registration page
     */
    @Test(description = "TC-005: Registration with empty username field triggers HTML5 required validation")
    public void testRegistrationEmptyUsername() {
        UserCredentialsData data = TestDataManager.getObject("invalidRegistration.emptyUsername", UserCredentialsData.class);

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login" in the top navigation menu
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Steps 3 & 4: Leave username empty and enter valid email, then click "Signup"
        signupLoginPage.submitSignupWithEmptyUsername(data.email());

        // Expected Result 1: Browser displays a native HTML5 validation tooltip indicating field is required
        String validationMessage = signupLoginPage.getSignupUsernameValidationMessage();
        Assert.assertNotNull(validationMessage, "HTML5 validation message was null.");
        Assert.assertFalse(validationMessage.isBlank(), "HTML5 validation message was empty.");

        // Expected Result 2: User remains on the registration page (URL ends with /login)
        Assert.assertEquals(signupLoginPage.getSignupHeaderText(), SignupLoginPage.SIGNUP_HEADER_TEXT,
                "User was navigated away from signup page despite missing required username.");
    }

    /**
     * TC-011 — Multi-click submission on registration
     * Pre-conditions:
     * - User is not logged in
     * - Email is not registered
     * Steps:
     * 1. Navigate to homepage
     * 2. Click "Signup / Login" in the top navigation menu
     * 3. Enter username and email, click "Signup"
     * 4. Fill in all required account and address fields
     * 5. Click "Create Account" 5 times in quick succession
     * Expected Result:
     * - First click submits the form
     * - Button is disabled or debounced after first click
     * - "Account Created!" page is displayed once
     */
    @Test(description = "TC-011: Create Account button not disabled after first click — documents known bug",
            groups = {"known-bugs"})
    public void testMultiClickRegistrationSubmit() {
        log.warn("TC-011: Known bug BUG-002 — this test is expected to FAIL");

        UserRegistrationData userData = TestDataManager.getObject("userRegistration", UserRegistrationData.class);
        String dynamicEmail = TestDataGenerator.generateEmail("qa_multi");
        log.info("TC-011: Attempting registration with email: [{}]", dynamicEmail);

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login"
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Step 3: Enter username and email, click Signup
        AccountInformationPage infoPage = signupLoginPage.submitSignup(userData.name(), dynamicEmail);

        // Step 4: Fill in all required fields
        infoPage.selectTitle(Title.MR)
                .enterPassword(userData.password())
                .selectDateOfBirth(userData.dobDay(), userData.dobMonth(), userData.dobYear())
                .fillAddressDetails(userData);

        // Step 5 & 6: Click Create Account and verify button is disabled — fails due to BUG-001
        // BUG-002: Button is not debounced — duplicate requests trigger 500 IntegrityError
        // This test is expected to FAIL until BUG-002 is resolved
        Assert.assertTrue(
                infoPage.clickCreateAccountAndCheckDisabled(),
                "BUG-001: Button should be disabled after first click to prevent duplicate submissions"
        );
    }
}
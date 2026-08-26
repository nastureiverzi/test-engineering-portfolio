package org.aeautomation.tests;

import org.aeautomation.core.BaseTest;
import org.aeautomation.data.LoginData;
import org.aeautomation.pages.HomePage;
import org.aeautomation.pages.SignupLoginPage;
import org.aeautomation.utils.TestDataManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Test suite verifying authentication functionality including login with valid
 * and invalid credentials.
 */
public class AuthenticateUserTests extends BaseTest {

    private static final Logger log = LogManager.getLogger(AuthenticateUserTests.class);

    /**
     * TC-006 — Successful login with valid credentials
     * Pre-conditions:
     * - User has a registered account
     * - User is not logged in
     * Test Data:
     * - Email: testuser123.qa@gmail.com
     * - Password: testPass
     * Steps:
     * 1. Navigate to homepage
     * 2. Click "Signup / Login" in the top navigation menu
     * 3. In the "Login to your account" section, enter email and password
     * 4. Click "Login"
     * Expected Result:
     * - After step 4, user is redirected to the homepage
     * - "Logged in as <username>" is displayed in the top navigation bar
     * Actual Result: PASS — Session initialized, user redirected to homepage, header updated correctly
     */
    @Test(description = "TC-006: Successful login with valid credentials")
    public void testSuccessfulLogin() {
        LoginData data = TestDataManager.getObject("authentication.validUser", LoginData.class);
        log.info("TC-006: Verifying login for user: [{}]", data.expectedUsername());
        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login" in the top navigation menu
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Steps 3 & 4: Enter email and password, then click "Login"
        HomePage loggedInHomePage = signupLoginPage.login(data.email(), data.password());

        // Expected Result 1: User is redirected to the homepage (logged-in view)
        Assert.assertTrue(loggedInHomePage.isUserLoggedIn(),
                "User was not logged in successfully.");

        // Expected Result 2: "Logged in as <username>" is displayed in the top navigation bar
        String loggedInUserText = loggedInHomePage.getLoggedInUsername();
        Assert.assertNotNull(loggedInUserText, "Logged in username text was null.");
        Assert.assertFalse(loggedInUserText.isBlank(), "Logged in username text was empty.");
        Assert.assertTrue(loggedInUserText.contains(data.expectedUsername()),
                "Header did not display expected logged-in username. Expected to contain: "
                        + data.expectedUsername() + " but was: " + loggedInUserText);
    }

    /*
     * TC-007 — Login with incorrect password
     *
     * Pre-conditions:
     * - User has a registered account
     * - User is not logged in
     *
     * Test Data:
     * - Email: testuser123.qa@gmail.com
     * - Password: testfail
     * Steps:
     * 1. Navigate to https://automationexercise.com/
     * 2. Click "Signup / Login" in the top navigation menu
     * 3. In the "Login to your account" section, enter valid email and incorrect password
     * 4. Click "Login"
     *
     * Expected Result:
     * - After step 4, a red error message is displayed below the form indicating the email or password is incorrect
     * - User remains on the login page
     */
    @Test(description = "TC-007: Login with incorrect password displays error message")
    public void testLoginWithIncorrectPassword() {
        LoginData data = TestDataManager.getObject("authentication.invalidPassword", LoginData.class);

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login" in top navigation menu
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Steps 3 & 4: Enter valid email and incorrect password, then click "Login"
        signupLoginPage.loginExpectingFailure(data.email(), data.password());

        // Expected Result 1: Red error message displayed below form
        Assert.assertTrue(
                signupLoginPage.isLoginErrorMessageDisplayed(),
                "Login error message was not displayed."
        );
        Assert.assertEquals(
                signupLoginPage.getLoginErrorMessageText(),
                data.expectedError(),  // use record field, not constant
                "Login error message text did not match expected value."
        );

        // Expected Result 2: Verify current URL remains on /login
        Assert.assertTrue(
                signupLoginPage.getCurrentUrl().contains("/login"),
                "User was navigated away from the login page after an invalid login attempt."
        );
    }

    /*
     * TC-008 — Login with unregistered email
     *
     * Pre-conditions:
     * - Email does not exist in the system
     *
     * Test Data:
     * - Email: testUnregisteredUser@gmail.com
     * - Password: testPass
     * Steps:
     * 1. Navigate to homepage
     * 2. Click "Signup / Login" in the top navigation menu
     * 3. In the "Login to your account" section, enter unregistered email and password
     * 4. Click "Login"
     * Expected Result:
     * - After step 4, a red error message is displayed below the form indicating the email or password is incorrect
     * - User remains on the login page
     */
    @Test(description = "TC-008: Login with unregistered email displays error message")
    public void testLoginWithUnregisteredEmail() {
        LoginData data = TestDataManager.getObject("authentication.unregisteredEmail", LoginData.class);

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login" in the top navigation menu
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Steps 3 & 4: Enter unregistered email and password, then click "Login"
        signupLoginPage.loginExpectingFailure(data.email(), data.password());

        // Expected Result 1: Red error message displayed below form indicating email/password is incorrect
        Assert.assertTrue(signupLoginPage.isLoginErrorMessageDisplayed(),
                "Login error message was not displayed.");
        Assert.assertEquals(signupLoginPage.getLoginErrorMessageText(), data.expectedError(),
                "Login error message text did not match expected value.");

        // Expected Result 2: User remains on the login page
        Assert.assertTrue(signupLoginPage.getCurrentUrl().contains("/login"),
                "User was navigated away from the login page after an invalid login attempt.");
    }

    /**
     * Test Case: TC-009 — Login with empty email field
     * Pre-conditions: User is not logged in
     * Steps:
     * 1. Navigate to homepage
     * 2. Click "Signup / Login" in the top navigation menu
     * 3. In the "Login to your account" section, leave the email field empty and enter a password
     * 4. Click "Login"
     * Expected Result:
     * - Browser displays an HTML5 validation message indicating the email field is required
     * - User remains on the login page
     */
    @Test(description = "TC-009: Login with empty email field shows HTML5 required tooltip and blocks submission")
    public void testLoginWithEmptyEmailField() {
        LoginData data = TestDataManager.getObject("authentication.emptyEmailLogin", LoginData.class);

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login"
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Step 3 & 4: Enter empty email, password, and click Login
        signupLoginPage.loginExpectingFailure(data.email(), data.password());

        // Expected Result 1: Browser displays HTML5 tooltip indicating field is required
        String validationMessage = signupLoginPage.getLoginEmailValidationMessage();
        Assert.assertNotNull(validationMessage, "HTML5 validation message was null.");
        Assert.assertFalse(validationMessage.isBlank(), "HTML5 validation message was empty!");

        // Expected Result 2: User remains on the login page
        Assert.assertTrue(
                signupLoginPage.getCurrentUrl().contains("/login"),
                "User was navigated away from the login page when email was left empty!"
        );
    }

    /**
     * Test Case: TC-010 — Login with empty password field
     * Pre-conditions:
     * - User has a registered account
     * - User is not logged in
     * Steps:
     * 1. Navigate to homepage
     * 2. Click "Signup / Login" in the top navigation menu
     * 3. In the "Login to your account" section, enter a valid email and leave the password field empty
     * 4. Click "Login"
     * Expected Result:
     * - Browser displays an HTML5 validation message indicating the password field is required
     * - User remains on the login page
     */
    @Test(description = "TC-010: Login with empty password field shows HTML5 required tooltip and blocks submission")
    public void testLoginWithEmptyPasswordField() {
        LoginData data = TestDataManager.getObject("authentication.emptyPasswordLogin", LoginData.class);

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login"
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Step 3 & 4: Enter valid email, empty password, and click Login
        signupLoginPage.loginExpectingFailure(data.email(), data.password());

        // Expected Result 1: Browser displays HTML5 tooltip on password field
        String validationMessage = signupLoginPage.getLoginPasswordValidationMessage();
        Assert.assertNotNull(validationMessage, "HTML5 validation message was null.");
        Assert.assertFalse(validationMessage.isBlank(), "HTML5 password validation message was empty!");

        // Expected Result 2: User remains on the login page
        Assert.assertTrue(
                signupLoginPage.getCurrentUrl().contains("/login"),
                "User was navigated away from the login page when password was left empty!"
        );
    }
}
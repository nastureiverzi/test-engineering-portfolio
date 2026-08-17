package org.aeautomation.tests;

import org.aeautomation.core.BaseTest;
import org.aeautomation.data.LoginData;
import org.aeautomation.pages.HomePage;
import org.aeautomation.pages.SignupLoginPage;
import org.aeautomation.utils.TestDataManager;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Test suite verifying authentication functionality including login with valid
 * and invalid credentials.
 */
public class AuthenticateUserTests extends BaseTest {

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
     *
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
        // Arrange: Load test data from testdata.json
        LoginData data = TestDataManager.getObject("authentication.invalidPassword", LoginData.class);

        // Step 1: Navigate to home page
        HomePage homePage = new HomePage();
        homePage.open();

        // Step 2: Click "Signup / Login" in top navigation menu
        SignupLoginPage signupLoginPage = homePage.clickSignupLogin();

        // Steps 3 & 4: Enter valid email and incorrect password, then click "Login"
        signupLoginPage.login(data.email(), data.password());

        // Expected Result 1: Red error message displayed below form
        Assert.assertTrue(
                signupLoginPage.isLoginErrorMessageDisplayed(),
                "Login error message was not displayed."
        );
        Assert.assertEquals(
                signupLoginPage.getLoginErrorMessageText(),
                "Your email or password is incorrect!",
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
     *
     * Steps:
     * 1. Navigate to https://automationexercise.com/
     * 2. Click "Signup / Login" in the top navigation menu
     * 3. In the "Login to your account" section, enter unregistered email and password
     * 4. Click "Login"
     *
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
        signupLoginPage.login(data.email(), data.password());

        // Expected Result 1: Red error message displayed below form indicating email/password is incorrect
        Assert.assertTrue(signupLoginPage.isLoginErrorMessageDisplayed(),
                "Login error message was not displayed.");
        Assert.assertEquals(signupLoginPage.getLoginErrorMessageText(), "Your email or password is incorrect!",
                "Login error message text did not match expected value.");

        // Expected Result 2: User remains on the login page
        Assert.assertTrue(signupLoginPage.getCurrentUrl().contains("/login"),
                "User was navigated away from the login page after an invalid login attempt.");
    }
}
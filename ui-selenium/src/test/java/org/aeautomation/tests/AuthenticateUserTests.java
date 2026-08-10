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
}
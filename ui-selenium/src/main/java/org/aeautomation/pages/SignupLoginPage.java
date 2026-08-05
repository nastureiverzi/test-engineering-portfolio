package org.aeautomation.pages;

import org.aeautomation.core.BasePage;
import org.openqa.selenium.By;

/**
 * Page Object representing the Signup / Login portal page (/login).
 * Handles authentication inputs for both existing users (login) and new users (signup).
 */
public class SignupLoginPage extends BasePage {

    // Header assertion locators
    private final By signupHeader = By.xpath("//div[@class='signup-form']/h2");
    private final By loginHeader = By.xpath("//div[@class='login-form']/h2");

    // New User Signup locators
    private final By signupNameInput = By.xpath("//input[@data-qa='signup-name']");
    private final By signupEmailInput = By.xpath("//input[@data-qa='signup-email']");
    private final By signupButton = By.xpath("//button[@data-qa='signup-button']");
    private final By signupErrorMessage = By.xpath("//div[@class='signup-form']//p");

    // Existing User Login locators
    private final By loginEmailInput = By.xpath("//input[@data-qa='login-email']");
    private final By loginPasswordInput = By.xpath("//input[@data-qa='login-password']");
    private final By loginButton = By.xpath("//button[@data-qa='login-button']");

    /**
     * Retrieves the text header from the "New User Signup!" section.
     *
     * @return Trimmed text string of the signup header (e.g., "New User Signup!")
     */
    public String getSignupHeaderText() {
        return getText(signupHeader);
    }

    /**
     * Enters the user's name and email into the signup form and submits it.
     *
     * @param name  Full name of the new user
     * @param email Email address for account creation
     * @return New instance of AccountInformationPage for step chaining
     */
    public AccountInformationPage submitSignup(String name, String email) {
        type(signupNameInput, name);
        type(signupEmailInput, email);
        click(signupButton);
        return new AccountInformationPage();
    }

    /**
     * Enters the user's name and email into the signup form when expecting a validation failure.
     *
     * @param name  Full name of the user
     * @param email Already registered email address
     * @return Current SignupLoginPage instance for asserting validation messages
     */
    public SignupLoginPage submitSignupExpectingFailure(String name, String email) {
        type(signupNameInput, name);
        type(signupEmailInput, email);
        click(signupButton);
        return this;
    }

    /**
     * Retrieves the red validation error message text displayed below the signup form.
     *
     * @return Trimmed error message text (e.g., "Email Address already exist!")
     */
    public String getSignupErrorMessage() {
        return getText(signupErrorMessage);
    }
}
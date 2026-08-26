package org.aeautomation.pages;

import org.aeautomation.core.BasePage;
import org.openqa.selenium.By;

/**
 * Page Object representing the Signup / Login portal page (/login).
 */
public class SignupLoginPage extends BasePage {

    // Header assertion locators
    private final By signupHeader = By.xpath("//div[@class='signup-form']/h2");
    private final By loginHeader = By.xpath("//div[@class='login-form']/h2");

    // New User Signup locators
    private final By signupNameInput = By.xpath("//input[@data-qa='signup-name']");
    private final By signupEmailInput = By.xpath("//input[@data-qa='signup-email']");
    private final By signupButton = By.xpath("//button[@data-qa='signup-button']");
    private final By signupErrorMessage = By.xpath("//p[contains(@style,'color: red')]");

    // Existing User Login locators
    private final By loginEmailInput = By.xpath("//input[@data-qa='login-email']");
    private final By loginPasswordInput = By.xpath("//input[@data-qa='login-password']");
    private final By loginButton = By.xpath("//button[@data-qa='login-button']");
    private final By loginErrorMessage = By.xpath("//form[@action='/login']//p");

    public static final String SIGNUP_HEADER_TEXT = "New User Signup!";
    public static final String EXISTING_EMAIL_ERROR_TEXT = "Email Address already exist!";
    public static final String INVALID_CREDENTIALS_ERROR_TEXT = "Your email or password is incorrect!";

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
        handleGoogleVignetteAd();
        return new AccountInformationPage();
    }

    /**
     * Enters the user's name and email into the signup form when expecting a validation failure.
     *
     * @param name  Full name of the user
     * @param email Already registered email address
     */
    public void submitSignupExpectingFailure(String name, String email) {
        type(signupNameInput, name);
        type(signupEmailInput, email);
        click(signupButton);
        handleGoogleVignetteAd();
    }

    /**
     * Submits the signup form leaving the username field empty.
     *
     * @param email The email address to enter into the signup form
     */
    public void submitSignupWithEmptyUsername(String email) {
        clear(signupNameInput);
        type(signupEmailInput, email);
        click(signupButton);
        handleGoogleVignetteAd();
    }

    /**
     * Retrieves the red validation error message text displayed below the signup form.
     *
     * @return Trimmed error message text (e.g., "Email Address already exist!")
     */
    public String getSignupErrorMessage() {
        return getText(signupErrorMessage);
    }

    /**
     * Retrieves the HTML5 native validation message from the signup email input field.
     *
     * @return The browser's native validation string
     */
    public String getSignupEmailValidationMessage() {
        return getValidationMessage(signupEmailInput);
    }

    /**
     * Retrieves the HTML5 native validation message from the signup username input field.
     *
     * @return The browser's native validation string (e.g., "Please fill out this field.")
     */
    public String getSignupUsernameValidationMessage() {
        return getValidationMessage(signupNameInput);
    }

    /**
     * Logs in with the provided email and password.
     *
     * @param email    User email address
     * @param password User password
     * @return HomePage instance after submitting credentials
     */
    public HomePage login(String email, String password) {
        type(loginEmailInput, email);
        type(loginPasswordInput, password);
        click(loginButton);
        handleGoogleVignetteAd();
        return new HomePage();
    }

    /**
     * Enters the email and password into the login form and submits it when expecting a authentication failure.
     *
     * @param email    User email address
     * @param password User password
     */
    public void loginExpectingFailure(String email, String password) {
        type(loginEmailInput, email);
        type(loginPasswordInput, password);
        click(loginButton);
    }

    /**
     * Checks if the login error message is displayed.
     *
     * @return true if error message is visible, false otherwise
     */
    public boolean isLoginErrorMessageDisplayed() {
        return isDisplayed(loginErrorMessage);
    }

    /**
     * Retrieves the text of the login error message.
     *
     * @return String containing the error text
     */
    public String getLoginErrorMessageText() {
        return getText(loginErrorMessage);
    }

    /**
     * Retrieves the HTML5 native validation message (tooltip) for the login email field.
     *
     * @return HTML5 validation message string (e.g., "Please fill out this field.")
     */
    public String getLoginEmailValidationMessage() {
        return getValidationMessage(loginEmailInput); // Calls your BasePage method
    }

    /**
     * Retrieves the HTML5 native validation message (tooltip) for the login password field.
     *
     * @return HTML5 validation message string (e.g., "Please fill out this field.")
     */
    public String getLoginPasswordValidationMessage() {
        return getValidationMessage(loginPasswordInput);
    }
}
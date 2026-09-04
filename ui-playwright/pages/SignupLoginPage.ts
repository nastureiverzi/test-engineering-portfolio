import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AccountInformationPage } from './AccountInformationPage';

/**
 * Page Object representing the Signup / Login page ('/login').
 * Encapsulates controls for new user registration entry, existing user authentication,
 * form validation error messages, and UI text constants.
 */
export class SignupLoginPage extends BasePage {

    public static readonly SIGNUP_HEADER_TEXT = 'New User Signup!';
    public static readonly LOGIN_HEADER_TEXT = 'Login to your account';
    public static readonly EXISTING_EMAIL_ERROR_TEXT = 'Email Address already exist!';
    public static readonly INVALID_CREDENTIALS_ERROR_TEXT = 'Your email or password is incorrect!';

    private readonly newUserSignupHeader: Locator;
    private readonly signupNameInput: Locator;
    private readonly signupEmailInput: Locator;
    private readonly signupButton: Locator;
    private readonly signupErrorMessageText: Locator;

    private readonly loginHeader: Locator;
    private readonly loginEmailInput: Locator;
    private readonly loginPasswordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginErrorMessageText: Locator;

    /**
     * Initializes locators for the Signup/Login page elements.
     * @param page - Playwright Page fixture instance
     */
    constructor(page: Page) {
        super(page);

        // Signup Locators
        this.newUserSignupHeader = page.locator('.signup-form h2');
        this.signupNameInput = page.locator('input[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.locator('button[data-qa="signup-button"]');
        this.signupErrorMessageText = page.locator('.signup-form p');

        // Login Locators
        this.loginHeader = page.locator('.login-form h2');
        this.loginEmailInput = page.locator('input[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
        this.loginButton = page.locator('button[data-qa="login-button"]');
        this.loginErrorMessageText = page.locator('form[action="/login"] p');
    }

    /**
     * Verifies whether the 'New User Signup!' form header is visible on the page.
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isNewUserSignupHeaderDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.newUserSignupHeader);
    }

    /**
     * Fills the new user registration input fields with name and email.
     * @param name - The full name or username for registration
     * @param email - The email address for the new account
     */
    async enterSignupDetails(name: string, email: string): Promise<void> {
        await this.type(this.signupNameInput, name);
        await this.type(this.signupEmailInput, email);
    }

    /**
     * Clicks the 'Signup' button to proceed to the detailed account creation page.
     * @returns Promise resolving to a new AccountInformationPage instance
     */
    async clickSignup(): Promise<AccountInformationPage> {
        await this.click(this.signupButton);
        return new AccountInformationPage(this.page);
    }

    /**
     * Retrieves the signup error message text (e.g., "Email Address already exist!").
     * @returns Promise resolving to the visible error text string
     */
    async getSignupErrorMessage(): Promise<string> {
        return this.getText(this.signupErrorMessageText);
    }

    /**
     * Retrieves the native HTML5 browser validation message from the signup email input field.
     * @returns Promise resolving to the browser validation message string
     */
    async getSignupEmailValidationMessage(): Promise<string> {
        return this.getValidationMessage(this.signupEmailInput);
    }

    /**
     * Retrieves the native HTML5 browser validation message from the signup name input field.
     * @returns Promise resolving to the browser validation message string
     */
    async getSignupUsernameValidationMessage(): Promise<string> {
        return this.getValidationMessage(this.signupNameInput);
    }

    /**
     * Verifies whether the 'Login to your account' form header is visible.
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isLoginHeaderDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.loginHeader);
    }

    /**
     * Fills credentials and submits the login form.
     * @param email - User account email address
     * @param password - User account password
     */
    async login(email: string, password: string): Promise<void> {
        await this.type(this.loginEmailInput, email);
        await this.type(this.loginPasswordInput, password);
        await this.click(this.loginButton);
    }

    /**
     * Checks if the login error message (e.g., "Your email or password is incorrect!") is displayed.
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isLoginErrorMessageDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.loginErrorMessageText);
    }

    /**
     * Retrieves the login error message text displayed under the login form.
     * @returns Promise resolving to the visible error message string
     */
    async getLoginErrorMessageText(): Promise<string> {
        return this.getText(this.loginErrorMessageText);
    }

    /**
     * Retrieves the native HTML5 browser validation message from the login email input field.
     * @returns Promise resolving to the browser validation message string
     */
    async getLoginEmailValidationMessage(): Promise<string> {
        return this.getValidationMessage(this.loginEmailInput);
    }

    /**
     * Retrieves the native HTML5 browser validation message from the login password input field.
     * @returns Promise resolving to the browser validation message string
     */
    async getLoginPasswordValidationMessage(): Promise<string> {
        return this.getValidationMessage(this.loginPasswordInput);
    }
}
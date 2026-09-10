import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AccountInformationPage } from './AccountInformationPage';

/**
 * Page Object representing the Signup / Login page (`/login`).
 */
export class SignupLoginPage extends BasePage {

    /** Expected header text for the new user registration form. */
    public static readonly SIGNUP_HEADER_TEXT = 'New User Signup!';

    /** Expected header text for the user login form. */
    public static readonly LOGIN_HEADER_TEXT = 'Login to your account';

    /** Error text displayed when attempting to register an already registered email. */
    public static readonly EXISTING_EMAIL_ERROR_TEXT = 'Email Address already exist!';

    /** Error text displayed when attempting to log in with invalid credentials. */
    public static readonly INVALID_CREDENTIALS_ERROR_TEXT = 'Your email or password is incorrect!';

    /** Heading locator for the signup section (`getByRole`). */
    readonly newUserSignupHeader: Locator;

    /** Text input locator for the signup name field (`getByTestId`). */
    readonly signupNameInput: Locator;

    /** Text input locator for the signup email field (`getByTestId`). */
    readonly signupEmailInput: Locator;

    /** Button locator to submit the signup form (`getByTestId`). */
    readonly signupButton: Locator;

    /** Element locator for signup error message text (`getByText`). */
    readonly signupErrorMessageText: Locator;

    /** Heading locator for the login section (`getByRole`). */
    readonly loginHeader: Locator;

    /** Text input locator for the login email field (`getByTestId`). */
    readonly loginEmailInput: Locator;

    /** Text input locator for the login password field (`getByTestId`). */
    readonly loginPasswordInput: Locator;

    /** Button locator to submit the login form (`getByTestId`). */
    readonly loginButton: Locator;

    /** Element locator for login error message text (`getByText`). */
    readonly loginErrorMessageText: Locator;

    constructor(page: Page) {
        super(page);

        // Section Headings (Semantic Role)
        this.newUserSignupHeader = page.getByRole('heading', { name: SignupLoginPage.SIGNUP_HEADER_TEXT });
        this.loginHeader = page.getByRole('heading', { name: SignupLoginPage.LOGIN_HEADER_TEXT });

        // Signup Form Controls (data-qa test IDs for fast execution)
        this.signupNameInput = page.getByTestId('signup-name');
        this.signupEmailInput = page.getByTestId('signup-email');
        this.signupButton = page.getByTestId('signup-button');

        // Login Form Controls (data-qa test IDs for fast execution)
        this.loginEmailInput = page.getByTestId('login-email');
        this.loginPasswordInput = page.getByTestId('login-password');
        this.loginButton = page.getByTestId('login-button');

        // Error Messages (Visible Copy)
        this.loginErrorMessageText = page.getByText(SignupLoginPage.INVALID_CREDENTIALS_ERROR_TEXT);
        this.signupErrorMessageText = page.getByText(SignupLoginPage.EXISTING_EMAIL_ERROR_TEXT);
    }

    /**
     * Fills the new user registration input fields with a name and email address.
     * 
     * @param name - Full name or username for registration
     * @param email - Email address for the new account
     */
    async enterSignupDetails(name: string, email: string): Promise<void> {
        await this.type(this.signupNameInput, name);
        await this.type(this.signupEmailInput, email);
    }

    /**
     * Clicks the 'Signup' button to submit initial registration credentials.
     * 
     * @returns Promise resolving to a new instance of AccountInformationPage
     */
    async clickSignup(): Promise<AccountInformationPage> {
        await this.click(this.signupButton);
        return new AccountInformationPage(this.page);
    }

    /**
     * Fills credentials and submits the login form.
     * 
     * @param email - User account email address
     * @param password - User account password
     */
    async login(email: string, password: string): Promise<void> {
        await this.type(this.loginEmailInput, email);
        await this.type(this.loginPasswordInput, password);
        await this.click(this.loginButton);
    }

    /**
     * Retrieves the native HTML5 browser validation message from the signup email input field.
     * 
     * @returns Promise resolving to the HTML5 validation message string
     */
    async getSignupEmailValidationMessage(): Promise<string> {
        return this.getValidationMessage(this.signupEmailInput);
    }

    /**
     * Retrieves the native HTML5 browser validation message from the signup name input field.
     * 
     * @returns Promise resolving to the HTML5 validation message string
     */
    async getSignupUsernameValidationMessage(): Promise<string> {
        return this.getValidationMessage(this.signupNameInput);
    }

    /**
     * Retrieves the native HTML5 browser validation message from the login email input field.
     * 
     * @returns Promise resolving to the HTML5 validation message string
     */
    async getLoginEmailValidationMessage(): Promise<string> {
        return this.getValidationMessage(this.loginEmailInput);
    }

    /**
     * Retrieves the native HTML5 browser validation message from the login password input field.
     * 
     * @returns Promise resolving to the HTML5 validation message string
     */
    async getLoginPasswordValidationMessage(): Promise<string> {
        return this.getValidationMessage(this.loginPasswordInput);
    }
}
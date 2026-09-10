import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AccountCreatedPage } from './AccountCreatedPage';

/**
 * Interface representing the required fields to populate account information.
 */
export interface AccountInfoDetails {
    title?: 'Mr' | 'Mrs';
    password: string;
    day: string;
    month: string;
    year: string;
}

/**
 * Interface representing the required fields to populate account address details.
 */
export interface AddressInfoDetails {
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
}

/**
 * Page Object representing the account registration form page ('/signup').
 */
export class AccountInformationPage extends BasePage {

    /** Heading text constant used for verification assertions. */
    public static readonly ENTER_ACCOUNT_INFO_HEADER_TEXT = 'ENTER ACCOUNT INFORMATION';

    /** Form heading locator for account information section (`getByRole`). */
    readonly enterAccountInfoHeading: Locator;

    /** Title radio button locator for 'Mr' (`getByRole`). */
    readonly mrTitleRadio: Locator;

    /** Title radio button locator for 'Mrs' (`getByRole`). */
    readonly mrsTitleRadio: Locator;

    /** Password input field locator (`getByTestId`). */
    readonly passwordInput: Locator;

    /** Day of birth dropdown selector locator (`getByTestId`). */
    readonly daysSelect: Locator;

    /** Month of birth dropdown selector locator (`getByTestId`). */
    readonly monthsSelect: Locator;

    /** Year of birth dropdown selector locator (`getByTestId`). */
    readonly yearsSelect: Locator;

    /** Checkbox locator for newsletter subscription opt-in (`getByTestId`). */
    readonly newsletterCheckbox: Locator;

    /** Checkbox locator for special offers opt-in (`getByTestId`). */
    readonly specialOffersCheckbox: Locator;

    /** First name input field locator (`getByTestId`). */
    readonly firstNameInput: Locator;

    /** Last name input field locator (`getByTestId`). */
    readonly lastNameInput: Locator;

    /** Company name input field locator (`getByTestId`). */
    readonly companyInput: Locator;

    /** Address line 1 input field locator (`getByTestId`). */
    readonly address1Input: Locator;

    /** Address line 2 input field locator (`getByTestId`). */
    readonly address2Input: Locator;

    /** Country dropdown selector locator (`getByTestId`). */
    readonly countrySelect: Locator;

    /** State input field locator (`getByTestId`). */
    readonly stateInput: Locator;

    /** City input field locator (`getByTestId`). */
    readonly cityInput: Locator;

    /** Zipcode input field locator (`getByTestId`). */
    readonly zipcodeInput: Locator;

    /** Mobile number input field locator (`getByTestId`). */
    readonly mobileNumberInput: Locator;

    /** Primary action button locator to submit account registration (`getByRole`). */
    readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page);

        // Account Information Section
        this.enterAccountInfoHeading = page.getByRole('heading', { name: 'Enter Account Information' });
        this.mrTitleRadio = page.getByRole('radio', { name: 'Mr.' });
        this.mrsTitleRadio = page.getByRole('radio', { name: 'Mrs.' });

        // Personal Details Fields (using data-qa test IDs)
        this.passwordInput = page.getByTestId('password');
        this.daysSelect = page.getByTestId('days');
        this.monthsSelect = page.getByTestId('months');
        this.yearsSelect = page.getByTestId('years');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.specialOffersCheckbox = page.locator('#optin');

        // Address Details Section (using data-qa test IDs)
        this.firstNameInput = page.getByTestId('first_name');
        this.lastNameInput = page.getByTestId('last_name');
        this.companyInput = page.getByTestId('company');
        this.address1Input = page.getByTestId('address');
        this.address2Input = page.getByTestId('address2');
        this.countrySelect = page.getByTestId('country');
        this.stateInput = page.getByTestId('state');
        this.cityInput = page.getByTestId('city');
        this.zipcodeInput = page.getByTestId('zipcode');
        this.mobileNumberInput = page.getByTestId('mobile_number');

        // Submission Action Button
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    }

    /**
     * Selects the title radio button ('Mr' or 'Mrs') based on input.
     * 
     * @param title - Optional title string ('Mr' | 'Mrs') to select
     */
    async selectTitle(title?: 'Mr' | 'Mrs'): Promise<void> {
        if (!title) return;

        if (title === 'Mr') {
            await this.click(this.mrTitleRadio);
        } else if (title === 'Mrs') {
            await this.click(this.mrsTitleRadio);
        }
    }

    /**
     * Fills title, password, date of birth dropdowns, and checks opt-in options.
     * Defaults to 'Mr' if no title is specified in details.
     * 
     * @param details - AccountInfoDetails object containing title, password, and birth date strings
     */
    async fillAccountInformation(details: AccountInfoDetails): Promise<void> {
        await this.selectTitle(details.title || 'Mr');
        await this.type(this.passwordInput, details.password);
        await this.selectByVisibleText(this.daysSelect, details.day);
        await this.selectByVisibleText(this.monthsSelect, details.month);
        await this.selectByVisibleText(this.yearsSelect, details.year);
        await this.click(this.newsletterCheckbox);
        await this.click(this.specialOffersCheckbox);
    }

    /**
     * Fills all personal and billing address form fields.
     * 
     * @param address - AddressInfoDetails object containing address, country, and contact details
     */
    async fillAddressInformation(address: AddressInfoDetails): Promise<void> {
        await this.type(this.firstNameInput, address.firstName);
        await this.type(this.lastNameInput, address.lastName);
        await this.type(this.companyInput, address.company);
        await this.type(this.address1Input, address.address1);
        await this.type(this.address2Input, address.address2);
        await this.selectByVisibleText(this.countrySelect, address.country);
        await this.type(this.stateInput, address.state);
        await this.type(this.cityInput, address.city);
        await this.type(this.zipcodeInput, address.zipcode);
        await this.type(this.mobileNumberInput, address.mobileNumber);
    }

    /**
     * Clicks the 'Create Account' button and navigates to the AccountCreatedPage.
     * 
     * @returns Promise resolving to a new AccountCreatedPage instance
     */
    async clickCreateAccount(): Promise<AccountCreatedPage> {
        await this.click(this.createAccountButton);
        return new AccountCreatedPage(this.page);
    }
}
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

    public static readonly ENTER_ACCOUNT_INFO_HEADER_TEXT = 'ENTER ACCOUNT INFORMATION';

    private readonly enterAccountInfoHeading: Locator;
    private readonly mrTitleRadio: Locator;
    private readonly mrsTitleRadio: Locator;
    private readonly passwordInput: Locator;
    private readonly daysSelect: Locator;
    private readonly monthsSelect: Locator;
    private readonly yearsSelect: Locator;
    private readonly newsletterCheckbox: Locator;
    private readonly specialOffersCheckbox: Locator;

    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly companyInput: Locator;
    private readonly address1Input: Locator;
    private readonly address2Input: Locator;
    private readonly countrySelect: Locator;
    private readonly stateInput: Locator;
    private readonly cityInput: Locator;
    private readonly zipcodeInput: Locator;
    private readonly mobileNumberInput: Locator;
    private readonly createAccountButton: Locator;

    /**
     * Initializes locators for the registration form elements.
     * @param page - Playwright Page fixture instance
     */
    constructor(page: Page) {
        super(page);
        this.enterAccountInfoHeading = page.locator('b:has-text("Enter Account Information")');
        this.mrTitleRadio = page.locator('#id_gender1');
        this.mrsTitleRadio = page.locator('#id_gender2');
        this.passwordInput = page.locator('#password');
        this.daysSelect = page.locator('#days');
        this.monthsSelect = page.locator('#months');
        this.yearsSelect = page.locator('#years');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.specialOffersCheckbox = page.locator('#optin');

        this.firstNameInput = page.locator('#first_name');
        this.lastNameInput = page.locator('#last_name');
        this.companyInput = page.locator('#company');
        this.address1Input = page.locator('#address1');
        this.address2Input = page.locator('#address2');
        this.countrySelect = page.locator('#country');
        this.stateInput = page.locator('#state');
        this.cityInput = page.locator('#city');
        this.zipcodeInput = page.locator('#zipcode');
        this.mobileNumberInput = page.locator('#mobile_number');
        this.createAccountButton = page.locator('button[data-qa="create-account"]');
    }

    /**
     * Verifies if the 'ENTER ACCOUNT INFORMATION' heading is displayed.
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isEnterAccountInfoDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.enterAccountInfoHeading);
    }

    /**
     * Selects the title radio button dynamically ('Mr' or 'Mrs').
     * @param title - The title string to select
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
     * Fills title, password, date of birth dropdowns, and selects opt-in checkboxes.
     * Defaults to 'Mr' if no title is specified in details.
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
     * Fills all user personal and billing address form fields.
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
     * @returns Promise resolving to a new AccountCreatedPage instance
     */
    async clickCreateAccount(): Promise<AccountCreatedPage> {
        await this.click(this.createAccountButton);
        return new AccountCreatedPage(this.page);
    }
}
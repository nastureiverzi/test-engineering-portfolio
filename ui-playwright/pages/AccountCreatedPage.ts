import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomePage } from './HomePage';

/**
 * Page Object representing the account creation confirmation page (`/account_created`).
 */
export class AccountCreatedPage extends BasePage {

    /** Expected header text displayed upon successful account registration. */
    public static readonly ACCOUNT_CREATED_HEADER_TEXT = 'ACCOUNT CREATED!';

    /** Heading locator for the account creation confirmation screen (`getByTestId`). */
    readonly accountCreatedHeading: Locator;

    /** Link/Button locator to proceed past the confirmation screen (`getByTestId`). */
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);

        this.accountCreatedHeading = page.getByTestId('account-created');
        this.continueButton = page.getByTestId('continue-button');
    }

    /**
     * Clicks the 'Continue' button after successful account creation
     * and navigates back to the home page.
     * 
     * @returns Promise resolving to a new HomePage instance
     */
    async clickContinue(): Promise<HomePage> {
        await this.click(this.continueButton);
        return new HomePage(this.page);
    }
}
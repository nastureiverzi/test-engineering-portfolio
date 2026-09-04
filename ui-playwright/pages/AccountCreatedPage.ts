import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomePage } from './HomePage';

/**
 * Page Object representing the account creation confirmation page ('/account_created').
 */
export class AccountCreatedPage extends BasePage {

    public static readonly ACCOUNT_CREATED_HEADER_TEXT = 'ACCOUNT CREATED!';

    private readonly accountCreatedHeading: Locator;
    private readonly continueButton: Locator;

    /**
     * Initializes locators for the post-registration confirmation screen.
     * @param page - Playwright Page fixture instance
     */
    constructor(page: Page) {
        super(page);
        this.accountCreatedHeading = page.locator('b:has-text("Account Created!")');
        this.continueButton = page.locator('a[data-qa="continue-button"]');
    }

    /**
     * Verifies if the 'ACCOUNT CREATED!' confirmation header is displayed.
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isAccountCreatedDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.accountCreatedHeading);
    }

    /**
     * Clicks the 'Continue' button after successful account creation, 
     * handles interstitial Google Vignette ads, and navigates back to HomePage.
     * @returns Promise resolving to a new HomePage instance
     */
    async clickContinue(): Promise<HomePage> {
        await this.click(this.continueButton);
        await this.handleGoogleVignetteAd();
        return new HomePage(this.page);
    }
}
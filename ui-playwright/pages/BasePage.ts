import { Page, Locator } from '@playwright/test';
import Logger from '../utils/Logger';
import ConfigReader from '../utils/ConfigReader';

/**
 * Foundation for all Page Objects.
 * Encapsulates Playwright interactions and provides shared navigation utilities.
 * Sources base URLs directly from ConfigReader to support live CLI and .env overrides.
 */
export abstract class BasePage {

    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigates to a path relative to the runtime base URL.
     * Evaluates ConfigReader.getBaseUrl() dynamically to respect live CLI overrides.
     * @param path - Relative path (e.g. '/products' or 'login')
     */
    protected async navigateTo(path: string): Promise<void> {
        const baseUrl = ConfigReader.getBaseUrl();
        const formattedPath = path.startsWith('/') ? path : `/${path}`;
        const fullUrl = `${baseUrl}${formattedPath}`;

        Logger.debug(`Navigating to: ${fullUrl}`);
        await this.page.goto(fullUrl);
    }

    /**
     * Clicks an element located by the given locator.
     * Playwright auto-waits for clickability before executing.
     * @param locator - Playwright Locator
     */
    protected async click(locator: Locator): Promise<void> {
        Logger.debug(`Clicking element: ${locator.toString()}`);
        await locator.click();
    }

    /**
     * Clears existing text and types new input into an element.
     * @param locator - Playwright Locator
     * @param text - Text content to enter
     */
    protected async type(locator: Locator, text: string): Promise<void> {
        Logger.debug(`Typing '${text}' into: ${locator.toString()}`);
        await locator.fill(text);
    }

    /**
     * Retrieves visible text content from an element.
     * @param locator - Playwright Locator
     * @returns Trimmed inner text string
     */
    protected async getText(locator: Locator): Promise<string> {
        const text = (await locator.innerText()).trim();
        Logger.debug(`Retrieved text '${text}' from: ${locator.toString()}`);
        return text;
    }

    /**
     * Checks whether an element is visible on the DOM.
     * Playwright returns false gracefully without throwing if the element is absent.
     * @param locator - Playwright Locator
     * @returns True if the element is visible
     */
    protected async isDisplayed(locator: Locator): Promise<boolean> {
        const visible = await locator.isVisible();
        Logger.debug(`Visibility check returned [${visible}] for: ${locator.toString()}`);
        return visible;
    }

    /**
     * Selects an option from a standard HTML select element by visible text.
     * @param locator - Playwright Locator for the select dropdown
     * @param visibleText - Label text of the option to select
     */
    protected async selectByVisibleText(locator: Locator, visibleText: string): Promise<void> {
        Logger.debug(`Selecting '${visibleText}' from dropdown: ${locator.toString()}`);
        await locator.selectOption({ label: visibleText });
    }

    /**
     * Retrieves the HTML5 native browser validation message from an input element.
     * @param locator - Playwright Locator for the input element
     * @returns Native validation message string
     */
    protected async getValidationMessage(locator: Locator): Promise<string> {
        const message = await locator.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        Logger.debug(`HTML5 validation message '${message}' from: ${locator.toString()}`);
        return message;
    }

    /**
     * Retrieves the current browser window URL.
     * @returns Current URL string
     */
    public async getCurrentUrl(): Promise<string> {
        const url = this.page.url();
        Logger.debug(`Current URL: ${url}`);
        return url;
    }

    /**
     * Dismisses GDPR/Cookie consent popups if present.
     */
    protected async handleCookieConsentIfPresent(): Promise<void> {
        const consentButton = this.page.locator(
            'button:has-text("Consent"), button:has-text("AGREE"), button:has-text("Accept")'
        ).first();

        if (await consentButton.isVisible()) {
            Logger.debug('Cookie consent popup detected, dismissing');
            await consentButton.click();
        }
    }

    /**
     * Redirects back to the target base URL if intercepted by Google Vignette ad overlays.
     */
    protected async handleGoogleVignetteAd(): Promise<void> {
        if (this.page.url().includes('#google_vignette')) {
            Logger.warn('Google Vignette ad detected, redirecting to base URL');
            await this.page.goto(ConfigReader.getBaseUrl());
        }
    }
}
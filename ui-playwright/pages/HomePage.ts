import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SignupLoginPage } from './SignupLoginPage';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';
import Logger from '../utils/Logger';
import ConfigReader from '../utils/ConfigReader';

/**
 * Page Object representing the main application landing page.
 */
export class HomePage extends BasePage {

    /** Main application logo image locator (`getByRole`). */
    readonly homePageLogo: Locator;

    /** Navigation link to the Login / Registration page (`getByRole`). */
    readonly signupLoginLink: Locator;

    /** Navigation badge element displaying the logged-in user state (`getByText`). */
    readonly loggedInAsText: Locator;

    /** Navigation link to the products catalog (`getByRole`). */
    readonly productsLink: Locator;

    /** Indicator locator for unhandled server or database exceptions. */
    readonly serverErrorIndicator: Locator;

    /** Heading locator inside the 'Added!' cart modal dialog (`getByRole`). */
    readonly modalTitle: Locator;

    /** Message locator inside the 'Added!' cart modal dialog (`getByText`). */
    readonly modalMessage: Locator;

    /** Button locator to dismiss the cart modal and continue shopping (`getByRole`). */
    readonly modalContinueShoppingBtn: Locator;

    /** Link locator inside the cart modal to navigate to the cart page (`getByRole`). */
    readonly modalViewCartLink: Locator;

    /** All product card containers on the home page grid. */
    readonly productCards: Locator;

    /** Explicit wait timeout loaded from environment configuration in milliseconds. */
    private readonly explicitWaitTimeout = ConfigReader.getExplicitWaitTimeout();

    constructor(page: Page) {
        super(page);

        // Header Navigation Locators (exact string matches for maximal resolution speed)
        this.homePageLogo = page.getByRole('img', { name: 'Website for automation practice' });
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.loggedInAsText = page.getByText('Logged in as');
        this.productsLink = page.getByRole('link', { name: 'Products' });

        // Featured Products Grid Locators
        this.productCards = page.locator('.productinfo');

        // Multi-condition CSS selector for backend exception handling
        this.serverErrorIndicator = page.locator(
            'h1:has-text("500"), :text("IntegrityError"), :text("Server Error"), :text("UNIQUE constraint failed")'
        );

        // Cart Modal Dialog Locators
        this.modalTitle = page.getByRole('heading', { name: 'Added!' });
        this.modalMessage = page.getByText('Your product has been added to cart');
        this.modalContinueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' });
        this.modalViewCartLink = page.getByRole('link', { name: 'View Cart' });
    }

    /**
     * Navigates to the home page URL and dismisses cookie consent banners if present.
     * 
     * @returns Promise resolving to the current HomePage instance for method chaining
     */
    async open(): Promise<HomePage> {
        await this.navigateTo('/');
        await this.handleCookieConsentIfPresent();
        return this;
    }

    /**
     * Verifies if the home page branding logo is displayed.
     * 
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isHomePageDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.homePageLogo);
    }

    /**
     * Clicks the 'Signup / Login' link in the top navigation bar.
     * 
     * @returns Promise resolving to a new SignupLoginPage instance
     */
    async clickSignupLogin(): Promise<SignupLoginPage> {
        await this.click(this.signupLoginLink);
        const signupLoginPage = new SignupLoginPage(this.page);
        await this.handleCookieConsentIfPresent();
        return signupLoginPage;
    }

    /**
     * Clicks the 'Products' link in the top navigation bar.
     * 
     * @returns Promise resolving to a new ProductsPage instance
     */
    async clickProducts(): Promise<ProductsPage> {
        await this.click(this.productsLink);
        return new ProductsPage(this.page);
    }

    /**
     * Checks whether the 'Logged in as' text badge is visible in the navigation bar.
     * 
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isUserLoggedIn(): Promise<boolean> {
        return this.isDisplayed(this.loggedInAsText);
    }

    /**
     * Verifies that the navigation bar displays the expected logged-in username.
     * 
     * @param username - Expected username string to assert against
     * @returns Promise resolving to true if the badge contains the username
     */
    async isLoggedInAsDisplayed(username: string): Promise<boolean> {
        await this.loggedInAsText.waitFor({ state: 'visible', timeout: this.explicitWaitTimeout });
        if (!await this.isDisplayed(this.loggedInAsText)) {
            return false;
        }
        const text = await this.getText(this.loggedInAsText);
        return text.includes(username);
    }

    /**
     * Retrieves the complete text string from the 'Logged in as [username]' navigation item.
     * 
     * @returns Promise resolving to the full badge text string
     */
    async getLoggedInUsername(): Promise<string> {
        return this.getText(this.loggedInAsText);
    }

    /**
     * Returns a Locator for the 'Logged in as [username]' navigation indicator.
     * 
     * @param username - Expected username string
     * @returns Locator scoped to the specific user session badge
     */
    getLoggedInAsLocator(username: string): Locator {
        return this.page.getByText(`Logged in as ${username}`);
    }

    /**
     * Checks whether a 500 or unhandled backend database exception page is displayed.
     * 
     * @returns Promise resolving to true if server error indicators are detected
     */
    async isServerErrorPageDisplayed(): Promise<boolean> {
        const title = await this.page.title();
        const titleContainsError = title.toLowerCase().includes('500') || title.toLowerCase().includes('integrityerror');
        
        return titleContainsError || await this.isDisplayed(this.serverErrorIndicator);
    }

    /**
     * Returns a product card Locator filtered by the exact product name text.
     * Avoids brittle positional indexing by using content-based filtering.
     * 
     * @param productName - Visible product title/name
     * @returns Locator scoped to the matching product container card
     */
    getProductCardByName(productName: string): Locator {
        return this.productCards.filter({ hasText: productName });
    }

    /**
     * Hovers over a specific product card identified by name and clicks 'Add to cart'.
     * Uses .first() on the add-to-cart link to resolve potential strict mode collisions between card & overlay.
     * 
     * @param productName - Visible title of the product to add
     */
    async addProductToCartByName(productName: string): Promise<void> {
        const card = this.getProductCardByName(productName);
        const addToCartBtn = card.getByRole('link', { name: 'Add to cart' }).first();

        await card.hover();
        await this.click(addToCartBtn);
        Logger.debug(`Added product [${productName}] to cart`);
    }

    /**
     * Checks if the 'Added!' modal header is displayed after adding an item to the cart.
     * 
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isAddToCartModalTitleDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.modalTitle);
    }

    /**
     * Checks if the confirmation body message is displayed in the cart modal.
     * 
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isAddToCartModalMessageDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.modalMessage);
    }

    /**
     * Checks if the 'Continue Shopping' button is visible in the cart modal.
     * 
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isContinueShoppingButtonDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.modalContinueShoppingBtn);
    }

    /**
     * Checks if the 'View Cart' link is visible in the cart modal.
     * 
     * @returns Promise resolving to true if visible, false otherwise
     */
    async isModalViewCartLinkDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.modalViewCartLink);
    }

    /**
     * Clicks the 'View Cart' link inside the modal dialog and navigates to the CartPage.
     * 
     * @returns Promise resolving to a new CartPage instance
     */
    async clickModalViewCart(): Promise<CartPage> {
        await this.click(this.modalViewCartLink);
        return new CartPage(this.page);
    }
}
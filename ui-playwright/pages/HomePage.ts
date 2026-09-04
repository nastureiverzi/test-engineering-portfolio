import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SignupLoginPage } from './SignupLoginPage';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';
import Logger from '../utils/Logger';

/**
 * Page Object representing the main application landing page.
 * Provides interactions for top navigation and initial page assertions.
 */
export class HomePage extends BasePage {

    private readonly homePageLogo: Locator;
    private readonly signupLoginLink: Locator;
    private readonly loggedInAsText: Locator;
    private readonly productsLink: Locator;
    private readonly serverErrorIndicator: Locator;
    private readonly modalTitle: Locator;
    private readonly modalMessage: Locator;
    private readonly modalContinueShoppingBtn: Locator;
    private readonly modalViewCartLink: Locator;

    constructor(page: Page) {
        super(page);
        this.homePageLogo = page.locator('div.logo.pull-left img');
        this.signupLoginLink = page.locator('a', { hasText: 'Signup / Login' });
        this.loggedInAsText = page.locator('li:has-text("Logged in as")');
        this.productsLink = page.locator('a[href="/products"]');
        this.serverErrorIndicator = page.locator(
            'h1:has-text("500"), :text("IntegrityError"), :text("Server Error"), :text("UNIQUE constraint failed")'
        );
        this.modalTitle = page.locator('#cartModal .modal-title:has-text("Added!")');
        this.modalMessage = page.locator('#cartModal .modal-body p:has-text("Your product has been added to cart")');
        this.modalContinueShoppingBtn = page.locator('#cartModal button:has-text("Continue Shopping")');
        this.modalViewCartLink = page.locator('#cartModal a[href*="/view_cart"]');
    }

    /**
     * Navigates to the home page and dismisses cookie consent if present.
     * @returns Current HomePage instance for method chaining
     */
    async open(): Promise<HomePage> {
        await this.navigateTo('/');
        await this.handleCookieConsentIfPresent();
        return this;
    }

    /**
     * Checks if the home page logo is visible.
     * @returns true if logo is displayed
     */
    async isHomePageDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.homePageLogo);
    }

    /**
     * Clicks the "Signup / Login" link in the navigation bar.
     * @returns New SignupLoginPage instance
     */
    async clickSignupLogin(): Promise<SignupLoginPage> {
        await this.click(this.signupLoginLink);
        return new SignupLoginPage(this.page);
    }

    /**
     * Clicks the "Products" link in the navigation bar.
     * @returns New ProductsPage instance
     */
    async clickProducts(): Promise<ProductsPage> {
        await this.click(this.productsLink);
        return new ProductsPage(this.page);
    }

    /**
     * Checks if the "Logged in as" badge is visible in the navigation bar.
     * @returns true if user is logged in
     */
    async isUserLoggedIn(): Promise<boolean> {
        return this.isDisplayed(this.loggedInAsText);
    }

    /**
     * Verifies the logged-in username appears in the navigation bar.
     * @param username - Expected username string
     * @returns true if navigation bar contains the username
     */
    async isLoggedInAsDisplayed(username: string): Promise<boolean> {
        if (!await this.isDisplayed(this.loggedInAsText)) {
            return false;
        }
        const text = await this.getText(this.loggedInAsText);
        return text.includes(username);
    }

    /**
     * Retrieves the full "Logged in as [username]" text from the navigation bar.
     * @returns Logged in text string
     */
    async getLoggedInUsername(): Promise<string> {
        return this.getText(this.loggedInAsText);
    }

    /**
     * Checks if a 500 or unhandled server error page is displayed.
     * @returns true if server error indicators are detected
     */
    async isServerErrorPageDisplayed(): Promise<boolean> {
        const title = await this.page.title();
        const titleContainsError = title.toLowerCase().includes('500') || title.toLowerCase().includes('integrityerror');
        
        return titleContainsError || await this.isDisplayed(this.serverErrorIndicator);
    }

    /**
     * Retrieves the name of a product by its 1-based index in the featured items grid.
     * @param index - 1-based product index
     * @returns Product name string
     */
    async getProductNameByIndex(index: number): Promise<string> {
        const locator = this.page.locator('.productinfo p').nth(index - 1);
        return this.getText(locator);
    }

    /**
     * Hovers over a product card and clicks "Add to cart" by 1-based index.
     * @param index - 1-based product index
     */
    async addProductToCartByIndex(index: number): Promise<void> {
        const locator = this.page.locator('.productinfo .add-to-cart').nth(index - 1);
        await locator.hover();
        await this.click(locator);
        Logger.debug(`Added product at index [${index}] to cart`);
    }

    /**
     * Checks if the "Added!" modal title is displayed.
     */
    async isAddToCartModalTitleDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.modalTitle);
    }

    /**
     * Checks if the modal confirmation message is displayed.
     */
    async isAddToCartModalMessageDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.modalMessage);
    }

    /**
     * Checks if the "Continue Shopping" button is displayed in the modal.
     */
    async isContinueShoppingButtonDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.modalContinueShoppingBtn);
    }

    /**
     * Checks if the "View Cart" link is displayed in the modal.
     */
    async isModalViewCartLinkDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.modalViewCartLink);
    }

    /**
     * Clicks "View Cart" inside the modal.
     * @returns New CartPage instance
     */
    async clickModalViewCart(): Promise<CartPage> {
        await this.click(this.modalViewCartLink);
        return new CartPage(this.page);
    }
}
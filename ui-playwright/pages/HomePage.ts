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

    constructor(page: Page) {
        super(page);

        // Header Navigation Locators (exact string matches for maximal resolution speed)
        this.homePageLogo = page.getByRole('img', { name: 'Website for automation practice' });
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.loggedInAsText = page.getByText('Logged in as');
        this.productsLink = page.getByRole('link', { name: 'Products' });

        // Featured Products Grid Locators
        this.productCards = page.locator('.productinfo');

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
     * Returns a product card Locator filtered by the exact product name text.
     * Avoids brittle positional indexing by using content-based filtering.
     * 
     * @param productName - Visible product title/name
     * @returns Locator scoped to the matching product container card
     */
    getProductCardByName(productName: string): Locator {
       return this.page.locator('.features_items').locator('.single-products').filter({ hasText: productName });
    }

    /**
     * Hovers over a specific product card identified by name and clicks 'Add to cart'.
     * Uses .first() on the add-to-cart link to resolve potential strict mode collisions between card & overlay.
     * 
     * @param productName - Visible title of the product to add
     */
    async addProductToCartByName(productName: string): Promise<void> {
        const card = this.page
            .locator('.features_items .single-products')
            .filter({ hasText: productName });

        await card.scrollIntoViewIfNeeded();

        // getByText targets the <a> element directly regardless of missing href/role
        const addToCartBtn = card.getByText('Add to cart').first();

        await addToCartBtn.click({ force: true });
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
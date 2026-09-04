import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object representing the Shopping Cart page
 */
export class CartPage extends BasePage {

    private readonly cartItemsHeader: Locator;
    private readonly cartProductNames: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItemsHeader = page.locator('li.active', { hasText: 'Shopping Cart' });
        this.cartProductNames = page.locator('td.cart_description a');
    }

    /**
     * Checks if the user is on the Shopping Cart page.
     *
     * @returns Promise resolving to true if active breadcrumb header is visible
     */
    async isCartPageDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.cartItemsHeader);
    }

    /**
     * Retrieves all product names currently present in the shopping cart table.
     *
     * @returns Promise resolving to an array of product name strings
     */
    async getCartProductNames(): Promise<string[]> {
        const names = await this.cartProductNames.allInnerTexts();
        return names.map(name => name.trim());
    }
}
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object representing the Shopping Cart page (`/view_cart`).
 * Encapsulates interactions for inspecting cart line items, pricing, quantities, and proceeding to checkout.
 */
export class CartPage extends BasePage {

    /** Active breadcrumb indicator locator for the Shopping Cart page (`locator`). */
    readonly cartItemsHeader: Locator;

    /** Locator targeting all product title links within the cart table (`locator`). */
    readonly cartProductNames: Locator;

    /**
     * Initializes locators for shopping cart elements using direct DOM strategies
     * to maximize selector resolution speed and minimize engine overhead.
     * 
     * @param page - Playwright Page fixture instance
     */
    constructor(page: Page) {
        super(page);

        // Targeted breadcrumb lookup bypassing array filtering on all list items
        this.cartItemsHeader = page.locator('ol.breadcrumb .active');

        // Direct CSS path bypassing table accessibility tree traversal
        this.cartProductNames = page.locator('td.cart_description a');
    }

    /**
     * Retrieves all product names currently displayed in the shopping cart table.
     * 
     * @returns Promise resolving to an array of trimmed product name strings
     */
    async getCartProductNames(): Promise<string[]> {
        const names = await this.cartProductNames.allInnerTexts();
        return names.map(name => name.trim());
    }
}
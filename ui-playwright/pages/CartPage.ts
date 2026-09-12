import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object representing the Shopping Cart page (`/view_cart`).
 * Encapsulates interactions for inspecting cart line items, pricing, quantities, and proceeding to checkout.
 */
export class CartPage extends BasePage {

    /** Active page heading indicator locator for the Shopping Cart page (`getByRole`). */
    readonly cartItemsHeader: Locator;

    /** Main shopping cart table container locator (`getByRole`). */
    readonly cartInfoTable: Locator;

    /** Locator targeting all product title links within the cart table (`getByRole`). */
    readonly cartProductNames: Locator;

    /**
     * Initializes locators for shopping cart elements using strict semantic getByRole strategies.
     * 
     * @param page - Playwright Page fixture instance
     */
    constructor(page: Page) {
        super(page);

        // Semantic heading locator for the cart view
        this.cartItemsHeader = page.getByRole('heading', { name: 'Shopping Cart' });

        // Semantic table locator for the items grid
        this.cartInfoTable = page.getByRole('table');

        // Scoped semantic row and cell locators for product description anchors
        this.cartProductNames = this.cartInfoTable.getByRole('row').locator('td.cart_description a');
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

    /**
     * Gets the total count of items listed in the cart table.
     * 
     * @returns Promise resolving to the number of items
     */
    async getCartItemCount(): Promise<number> {
        return await this.cartProductNames.count();
    }
}
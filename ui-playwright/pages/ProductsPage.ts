import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object representing the Products catalog page ('/products').
 */
export class ProductsPage extends BasePage {

    /** Search input field locator (`locator` by ID for instant DOM lookup). */
    readonly searchInput: Locator;

    /** Submit search button locator (`locator` by ID). */
    readonly searchButton: Locator;

    /** Heading locator for search results section (`getByRole`). */
    readonly searchedProductsHeader: Locator;

    /** Locator targeting all product card containers in the catalog grid. */
    readonly productCards: Locator;

    /** Locator targeting all product title elements across displayed cards. */
    readonly productNameList: Locator;

    constructor(page: Page) {
        super(page);

        // ID selectors resolve directly via document.getElementById for maximum execution speed
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');

        this.searchedProductsHeader = page.getByRole('heading', { name: 'Searched Products' });
        this.productCards = page.locator('.productinfo');
        this.productNameList = page.locator('.productinfo p');
    }

    /**
     * Enters a search keyword into the search input field and clicks the search button.
     * 
     * @param keyword - Search term (e.g., "top", "dress")
     */
    async searchProduct(keyword: string): Promise<void> {
        await this.type(this.searchInput, keyword);
        await this.click(this.searchButton);
    }

    /**
     * Retrieves the text strings of all displayed product names on the page.
     * 
     * @returns Promise resolving to an array of trimmed product name strings
     */
    async getDisplayedProductNames(): Promise<string[]> {
        const names = await this.productNameList.allInnerTexts();
        return names.map(name => name.trim());
    }

    /**
     * Returns a product card Locator filtered by exact or partial product name text.
     * Avoids brittle positional indexing by using content-based filtering.
     * 
     * @param productName - Visible title/name of the target product
     * @returns Locator scoped to the matching product card element
     */
    getProductCardByName(productName: string): Locator {
        return this.productCards.filter({ hasText: productName });
    }

    /**
     * Hovers over a catalog product card identified by name and clicks 'Add to cart'.
     * Uses `.first()` to resolve strict mode collisions between card and hover overlay elements.
     * 
     * @param productName - Visible title of the product to add to cart
     */
    async addProductToCartByName(productName: string): Promise<void> {
        const card = this.getProductCardByName(productName);
        const addToCartBtn = card.getByRole('link', { name: 'Add to cart' }).first();

        await card.hover();
        await this.click(addToCartBtn);
    }
}
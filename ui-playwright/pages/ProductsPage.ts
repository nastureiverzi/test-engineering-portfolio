import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object representing the Products catalog page.
 */
export class ProductsPage extends BasePage {

    private readonly searchInput: Locator;
    private readonly searchButton: Locator;
    private readonly searchedProductsHeader: Locator;
    private readonly productNameList: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.searchedProductsHeader = page.locator('h2.title', { hasText: 'Searched Products' });
        this.productNameList = page.locator('.productinfo p');
    }

    /**
     * Enters a keyword into the search bar and clicks the search button.
     *
     * @param keyword - Search term (e.g. "top")
     */
    async searchProduct(keyword: string): Promise<void> {
        await this.type(this.searchInput, keyword);
        await this.click(this.searchButton);
    }

    /**
     * Checks if the 'SEARCHED PRODUCTS' title header is displayed.
     *
     * @returns Promise resolving to true if visible
     */
    async isSearchedProductsHeaderDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.searchedProductsHeader);
    }

    /**
     * Retrieves the text of all displayed product names on the screen.
     *
     * @returns Promise resolving to an array of product titles
     */
    async getDisplayedProductNames(): Promise<string[]> {
        const names = await this.productNameList.allInnerTexts();
        return names.map(name => name.trim());
    }
}
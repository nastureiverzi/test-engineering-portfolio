package org.aeautomation.pages;

import org.aeautomation.core.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Page Object representing the Products catalog page.
 */
public class ProductsPage extends BasePage {

    private final By searchInput = By.xpath("//input[@id='search_product']");
    private final By searchButton = By.xpath("//button[@id='submit_search']");
    private final By searchedProductsHeader = By.xpath("//h2[contains(@class,'title') and contains(text(),'Searched Products')]");
    private final By productNameList = By.xpath("//div[contains(@class,'productinfo')]//p");

    /**
     * Enters a keyword into the search bar and clicks the search button.
     *
     * @param keyword Search term (e.g. "top")
     */
    public void searchProduct(String keyword) {
        type(searchInput, keyword);
        click(searchButton);
    }

    /**
     * Checks if the 'SEARCHED PRODUCTS' title header is displayed.
     *
     * @return true if visible
     */
    public boolean isSearchedProductsHeaderDisplayed() {
        return isDisplayed(searchedProductsHeader);
    }

    /**
     * Retrieves the text of all displayed product names on the screen.
     *
     * @return List of product titles
     */
    public List<String> getDisplayedProductNames() {
        List<WebElement> elements = driver.findElements(productNameList);
        return elements.stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());
    }
}
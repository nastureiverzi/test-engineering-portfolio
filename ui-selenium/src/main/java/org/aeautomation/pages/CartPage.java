package org.aeautomation.pages;

import org.aeautomation.core.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;
import static java.util.stream.Collectors.toList;

/**
 * Page Object representing the Shopping Cart page
 */
public class CartPage extends BasePage {

    private final By cartItemsHeader = By.xpath("//li[@class='active' and contains(text(),'Shopping Cart')]");
    private final By cartProductNames = By.xpath("//td[contains(@class,'cart_description')]//a");

    /**
     * Checks if the user is on the Shopping Cart page.
     *
     * @return true if active breadcrumb header is visible
     */
    public boolean isCartPageDisplayed() {
        return isDisplayed(cartItemsHeader);
    }

    /**
     * Retrieves all product names currently present in the shopping cart table.
     *
     * @return List of product name strings
     */
    public List<String> getCartProductNames() {
        List<WebElement> elements = waitForAllElements(cartProductNames);
        return elements.stream()
                .map(WebElement::getText)
                .collect(toList());
    }
}
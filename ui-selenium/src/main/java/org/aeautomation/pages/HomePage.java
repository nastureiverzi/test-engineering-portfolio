package org.aeautomation.pages;

import org.aeautomation.core.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import java.util.Optional;

/**
 * Page Object representing the main application landing page.
 */
public class HomePage extends BasePage {

    private static final String PAGE_PATH = "/";

    // Locators
    private final By homePageLogo = By.xpath("//div[@class='logo pull-left']//img");
    private final By signupLoginLink = By.xpath("//a[contains(text(),'Signup / Login')]");
    private final By loggedInAsText = By.xpath("//li[contains(.,'Logged in as')]");
    private final By serverErrorIndicator = By.xpath(
            "//h1[contains(text(),'500')] " +
                    "| //*[contains(text(),'IntegrityError')]" +
                    "| //*[contains(text(),'Server Error')]" +
                    "| //*[contains(text(),'UNIQUE constraint failed')]"
    );
    private final String productNameTemplate = "(//div[contains(@class,'productinfo')]//p)[%d]";
    private final String addToCartBtnTemplate = "(//div[contains(@class,'productinfo')]//a[contains(@class,'add-to-cart')])[%d]";
    private final By modalTitle = By.xpath("//div[@id='cartModal']//h4[contains(@class,'modal-title') and contains(text(),'Added!')]");
    private final By modalMessage = By.xpath("//div[@id='cartModal']//div[contains(@class,'modal-body')]//p[contains(text(),'Your product has been added to cart')]");
    private final By modalContinueShoppingBtn = By.xpath("//div[@id='cartModal']//button[contains(text(),'Continue Shopping')]");
    private final By modalViewCartLink = By.xpath("//div[@id='cartModal']//a[contains(@href,'/view_cart')]");

    /**
     * Navigates to the home page URL and automatically checks for GDPR cookie popups.
     */
    public void open() {
        navigateTo(PAGE_PATH);
        handleCookieConsentIfPresent();
    }

    /**
     * Asserts whether the home page brand logo is visible.
     *
     * @return true if visible
     */
    public boolean isHomePageDisplayed() {
        return isDisplayed(homePageLogo);
    }

    /**
     * Clicks the "Signup / Login" link in the top navigation bar.
     *
     * @return New instance of SignupLoginPage
     */
    public SignupLoginPage clickSignupLogin() {
        click(signupLoginLink);
        return new SignupLoginPage();
    }

    /**
     * Verifies that the "Logged in as [Username]" badge appears in the navigation bar.
     *
     * @param username Expected account holder username
     * @return true if text matching the username is displayed
     */
    public boolean isLoggedInAsDisplayed(String username) {
        if (!isDisplayed(loggedInAsText)) {
            return false;
        }
        return getText(loggedInAsText).contains(username);
    }

    /**
     * Checks if the "Logged in as" element is displayed in the navigation header.
     *
     * @return true if user is logged in, false otherwise
     */
    public boolean isUserLoggedIn() {
        return isDisplayed(loggedInAsText);
    }

    /**
     * Retrieves the "Logged in as <username>" text from the navigation bar.
     *
     * @return String containing the logged-in user header text
     */
    public String getLoggedInUsername() {
        return getText(loggedInAsText);
    }

    /**
     * Checks if the application returned a 500 or unhandled exception page.
     *
     * @return true if a server error page is detected
     */
    public boolean isServerErrorPageDisplayed() {
        boolean titleContainsError = Optional.ofNullable(driver.getTitle())
                .map(String::toLowerCase)
                .filter(title -> title.contains("500") || title.contains("integrityerror"))
                .isPresent();

        return titleContainsError || isDisplayed(serverErrorIndicator);
    }

    /**
     * Navigates to the Products page via top menu.
     *
     * @return ProductsPage instance
     */
    public ProductsPage clickProducts() {
        click(By.cssSelector("a[href='/products']"));
        return new ProductsPage();
    }

    /**
     * Retrieves the title of any product by its 1-based index on the home page.
     *
     * @param productIndex 1-based index (1 = first product, 2 = second product, etc.)
     * @return Product title string
     */
    public String getProductNameByIndex(int productIndex) {
        By locator = By.xpath(String.format(productNameTemplate, productIndex));
        return getText(locator);
    }

    /**
     * Clicks "Add to cart" for any product card by its 1-based index.
     *
     * @param productIndex 1-based index
     */
    public void addProductToCartByIndex(int productIndex) {
        By locator = By.xpath(String.format(addToCartBtnTemplate, productIndex));
        WebElement element = waitForVisibility(locator);
        new Actions(driver)
                .moveToElement(element)
                .perform();
        click(locator);
    }

    /**
     * Checks if the "Added!" popup modal title is displayed.
     *
     * @return true if visible
     */
    public boolean isAddToCartModalTitleDisplayed() {
        return isDisplayed(modalTitle);
    }

    /**
     * Checks if the "Your product has been added to cart" message is displayed in modal.
     *
     * @return true if visible
     */
    public boolean isAddToCartModalMessageDisplayed() {
        return isDisplayed(modalMessage);
    }

    /**
     * Checks if the "Continue Shopping" button is displayed in modal.
     *
     * @return true if visible
     */
    public boolean isContinueShoppingButtonDisplayed() {
        return isDisplayed(modalContinueShoppingBtn);
    }

    /**
     * Checks if the "View Cart" link is displayed in modal.
     *
     * @return true if visible
     */
    public boolean isModalViewCartLinkDisplayed() {
        return isDisplayed(modalViewCartLink);
    }

    /**
     * Clicks "View Cart" inside the modal to navigate to the Cart page.
     *
     * @return CartPage instance
     */
    public CartPage clickModalViewCart() {
        click(modalViewCartLink);
        return new CartPage();
    }
}

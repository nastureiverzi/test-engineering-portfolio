package org.aeautomation.core;

import org.aeautomation.utils.ConfigReader;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

/**
 * Foundation for all Page Objects. Encapsulates WebDriver interaction methods
 * and enforces explicit waiting mechanisms.
 */
public abstract class BasePage {

    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage() {
        this.driver = DriverFactory.getDriver();
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(ConfigReader.getTimeout()));
    }

    /**
     * Gets the current URL of the active browser tab.
     *
     * @return String representing the current URL
     */
    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    /**
     * Navigates to a path relative to the configured Base URL.
     *
     * @param relativePath Page route (e.g. "/login")
     */
    protected void navigateTo(String relativePath) {
        String baseUrl = ConfigReader.getBaseUrl();
        String formattedPath = relativePath.startsWith("/") ? relativePath : "/" + relativePath;
        driver.get(baseUrl + formattedPath);
    }

    /**
     * Clears an input field safely, falling back to JavaScript if standard clear fails.
     *
     * @param locator By locator strategy
     */
    protected void clear(By locator) {
        WebElement element = waitForVisibility(locator);
        scrollIntoView(element);
        try {
            element.clear();
        } catch (ElementNotInteractableException e) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].value = '';", element);
        }
    }

    /**
     * Clicks an element after ensuring it is clickable and scrolled into view.
     * Falls back to JavaScript click if intercepted by overlays or ad banners.
     *
     * @param locator By locator strategy
     */
    protected void click(By locator) {
        WebElement element = waitForClickability(locator);
        scrollIntoView(element);
        try {
            element.click();
        } catch (ElementNotInteractableException e) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        }
    }

    /**
     * Clears existing text and types the specified input into an element.
     *
     * @param locator By locator strategy
     * @param text    Text input to send
     */
    protected void type(By locator, String text) {
        WebElement element = waitForVisibility(locator);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
        try {
            element.clear();
            element.sendKeys(text);
        } catch (ElementNotInteractableException e) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].value = arguments[1];", element, text);
        }
    }

    /**
     * Retrieves visible inner text from an element after waiting for visibility.
     *
     * @param locator By locator strategy
     * @return Visible text string
     */
    protected String getText(By locator) {
        return waitForVisibility(locator).getText().trim();
    }

    /**
     * Checks if an element is currently displayed on the page.
     * Returns false gracefully if the element is not found within the timeout period.
     *
     * @param locator By locator strategy
     * @return true if visible, false otherwise
     */
    protected boolean isDisplayed(By locator) {
        try {
            return waitForVisibility(locator).isDisplayed();
        } catch (TimeoutException | NoSuchElementException e) {
            return false;
        }
    }

    /**
     * Selects an option from a standard HTML dropdown element by visible text.
     *
     * @param locator     By locator for the select element
     * @param visibleText Text option to select
     */
    protected void selectByVisibleText(By locator, String visibleText) {
        WebElement element = waitForVisibility(locator);
        Select select = new Select(element);
        select.selectByVisibleText(visibleText);
    }

    /**
     * Waits until the element is present in the DOM and visible on screen.
     *
     * @param locator By locator strategy
     * @return Fully loaded WebElement
     */
    protected WebElement waitForVisibility(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    /**
     * Waits until the element is present in the DOM, visible on screen, and enabled for interaction.
     *
     * @param locator By locator strategy
     * @return Clickable WebElement
     */
    protected WebElement waitForClickability(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    /**
     * Retrieves the HTML5 native browser validation message (e.g., "Please fill out this field.").
     *
     * @param locator By locator strategy
     * @return HTML5 validation message string
     */
    protected String getValidationMessage(By locator) {
        WebElement element = waitForVisibility(locator);
        return (String) ((JavascriptExecutor) driver)
                .executeScript("return arguments[0].validationMessage;", element);
    }

    /**
     * Waits until all elements matching the locator are visible.
     *
     * @param locator By locator strategy
     * @return List of WebElements
     */
    protected List<WebElement> waitForAllElements(By locator) {
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(locator));
    }

    /**
     * Detects if the browser was redirected to a Google vignette ad overlay
     * (#google_vignette) and navigates back to the base URL if needed.
     */
    protected void handleGoogleVignetteAd() {
        Optional.ofNullable(driver.getCurrentUrl())
                .filter(url -> url.contains("#google_vignette"))
                .ifPresent(url -> driver.navigate().to(ConfigReader.getBaseUrl()));
    }

    /**
     * Handles the cookie consent popup if present without throwing a TimeoutException
     * when the popup does not appear.
     */
    protected void handleCookieConsentIfPresent() {
        By consentButton = By.xpath("//button[contains(@class,'fc-cta-consent') or contains(.,'Consent') or contains(.,'AGREE') or contains(.,'Accept')]");

        List<WebElement> elements = driver.findElements(consentButton);
        if (!elements.isEmpty() && elements.get(0).isDisplayed()) {
            try {
                elements.get(0).click();
            } catch (Exception e) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", elements.get(0));
            }
        }
    }

    /**
     * Smoothly scrolls the viewport to align the targeted element in the center of the screen.
     *
     * @param element The target WebElement
     */
    private void scrollIntoView(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
    }
}
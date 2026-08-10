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
     * Waits for an element to be visible before clicking it.
     *
     * @param locator By locator strategy
     */
    protected void click(By locator) {
        WebElement element = waitForClickability(locator);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
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
     * Checks if an element is displayed on the page.
     *
     * @param locator By locator strategy
     * @return True if visible, false if absent or hidden
     */
    protected boolean isDisplayed(By locator) {
        try {
            return waitForVisibility(locator).isDisplayed();
        } catch (Exception e) {
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
     * Waits until all elements matching the locator are visible.
     *
     * @param locator By locator strategy
     * @return List of WebElements
     */
    protected List<WebElement> waitForAllElements(By locator) {
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(locator));
    }

    /**
     * Clicks an element using JavaScript to bypass ad overlays or hidden elements.
     *
     * @param locator By locator of the element to click
     */
    protected void clickWithJS(By locator) {
        WebElement element = waitForVisibility(locator);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
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
}
package org.aeautomation.pages;

import org.aeautomation.core.BasePage;
import org.openqa.selenium.By;
import java.util.Optional;

/**
 * Page Object representing the main application landing page.
 * Provides interactions for top navigation menu items and initial page assertions.
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



    /**
     * Navigates to the home page URL and automatically checks for GDPR cookie popups.
     *
     * @return Current HomePage instance for method chaining
     */
    public HomePage open() {
        navigateTo(PAGE_PATH);
        handleCookieConsentIfPresent();
        return this;
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
}
package org.aeautomation.pages;

import org.aeautomation.core.BasePage;
import org.aeautomation.utils.ConfigReader;
import org.openqa.selenium.By;

import java.util.Objects;

/**
 * Page Object representing the "ACCOUNT CREATED!" confirmation screen.
 * Handles header verification and navigation back to the home page.
 */
public class AccountCreatedPage extends BasePage {

    private final By accountCreatedHeader = By.xpath("//b[contains(text(),'Account Created!')]");
    private final By continueButton = By.xpath("//a[@data-qa='continue-button']");

    public static final String HEADER_TEXT = "ACCOUNT CREATED!";

    /**
     * Retrieves the text from the account creation confirmation header.
     *
     * @return Trimmed header text string (e.g., "ACCOUNT CREATED!")
     */
    public String getHeaderText() {
        return getText(accountCreatedHeader);
    }

    /**
     * Clicks the "Continue" button to complete the registration process.
     *
     * @return New instance of HomePage representing the authenticated session home view
     */
    public HomePage clickContinue() {
        clickWithJS(continueButton);

        // automationexercise.com occasionally serves fullscreen ads that hijack navigation.
        // If detected, navigate directly to base URL to recover the session.
        if (driver.getCurrentUrl().contains("#google_vignette")) {
            driver.navigate().to(ConfigReader.getBaseUrl());
        }
        return new HomePage();
    }
}
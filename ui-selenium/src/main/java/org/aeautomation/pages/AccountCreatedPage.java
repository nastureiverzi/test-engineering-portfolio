package org.aeautomation.pages;

import org.aeautomation.core.BasePage;
import org.openqa.selenium.By;

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
        handleGoogleVignetteAd();

        return new HomePage();
    }
}
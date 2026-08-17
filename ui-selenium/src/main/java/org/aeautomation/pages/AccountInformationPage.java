package org.aeautomation.pages;

import org.aeautomation.core.BasePage;
import org.aeautomation.data.Title;
import org.aeautomation.data.UserRegistrationData;
import org.openqa.selenium.By;

/**
 * Page Object representing the Account Information form page (/signup).
 */
public class AccountInformationPage extends BasePage {
    // Header & Section Identifiers
    private final By pageHeader = By.xpath("//b[contains(text(),'Enter Account Information')]");

    // Account Details Locators
    private final By mrTitleRadio = By.xpath("//input[@type='radio' and (@id='id_gender1' or @value='Mr')]");
    private final By mrsTitleRadio = By.xpath("//input[@type='radio' and (@id='id_gender2' or @value='Mrs')]");
    private final By passwordInput = By.xpath("//input[@data-qa='password' or @name='password']");
    private final By daysDropdown = By.xpath("//select[@data-qa='days' or @name='days']");
    private final By monthsDropdown = By.xpath("//select[@data-qa='months' or @name='months']");
    private final By yearsDropdown = By.xpath("//select[@data-qa='years' or @name='years']");
    private final By newsletterCheckbox = By.xpath("//input[@name='newsletter']");
    private final By offersCheckbox = By.xpath("//input[@name='optin']");

    // Address Details Locators
    private final By firstNameInput = By.xpath("//input[@data-qa='first_name' or @name='first_name']");
    private final By lastNameInput = By.xpath("//input[@data-qa='last_name' or @name='last_name']");
    private final By companyInput = By.xpath("//input[@data-qa='company' or @name='company']");
    private final By address1Input = By.xpath("//input[@data-qa='address' or @name='address1']");
    private final By address2Input = By.xpath("//input[@data-qa='address2' or @name='address2']");
    private final By countryDropdown = By.xpath("//select[@data-qa='country' or @name='country']");
    private final By stateInput = By.xpath("//input[@data-qa='state' or @name='state']");
    private final By cityInput = By.xpath("//input[@data-qa='city' or @name='city']");
    private final By zipcodeInput = By.xpath("//input[@data-qa='zipcode' or @name='zipcode']");
    private final By mobileNumberInput = By.xpath("//input[@data-qa='mobile_number' or @name='mobile_number']");
    private final By createAccountButton = By.xpath("//button[@data-qa='create-account']");

    public static final String HEADER_TEXT = "ENTER ACCOUNT INFORMATION";

    /**
     * Retrieves the text from the account information page header.
     *
     * @return Trimmed header text string (e.g., "ENTER ACCOUNT INFORMATION")
     */
    public String getPageHeaderText() {
        return getText(pageHeader);
    }

    /**
     * Selects the title radio button dynamically based on the Title enum provided.
     *
     * @param title Title enum (MR or MRS)
     * @return Current AccountInformationPage instance for method chaining
     */
    public AccountInformationPage selectTitle(Title title) {
        log.info("Selecting title: {}", title);
        switch (title) {
            case MR -> click(mrTitleRadio);
            case MRS -> click(mrsTitleRadio);
        }
        return this;
    }
    /**
     * Enters the password for the new account.
     *
     * @param password Account password
     * @return Current AccountInformationPage instance for method chaining
     */
    public AccountInformationPage enterPassword(String password) {
        type(passwordInput, password);
        return this;
    }

    /**
     * Selects the user's Date of Birth from the day, month, and year dropdowns.
     *
     * @param day   Day value (e.g., "15")
     * @param month Month visible text (e.g., "May")
     * @param year  Year value (e.g., "1990")
     * @return Current AccountInformationPage instance for method chaining
     */
    public AccountInformationPage selectDateOfBirth(String day, String month, String year) {
        selectByVisibleText(daysDropdown, day);
        selectByVisibleText(monthsDropdown, month);
        selectByVisibleText(yearsDropdown, year);
        return this;
    }

    /**
     * Selects both the newsletter and special offers checkboxes.
     *
     * @return Current AccountInformationPage instance for method chaining
     */
    public AccountInformationPage selectNewsletterAndOffers() {
        click(newsletterCheckbox);
        click(offersCheckbox);
        return this;
    }

    /**
     * Fills in all required and optional address details in the registration form.
     *
     * @param data Record containing user profile and address details
     * @return Current AccountInformationPage instance for method chaining
     */
    public AccountInformationPage fillAddressDetails(UserRegistrationData data) {
        type(firstNameInput, data.firstName());
        type(lastNameInput, data.lastName());
        type(companyInput, data.company());
        type(address1Input, data.address1());
        type(address2Input, data.address2());
        selectByVisibleText(countryDropdown, data.country());
        type(stateInput, data.state());
        type(cityInput, data.city());
        type(zipcodeInput, data.zipcode());
        type(mobileNumberInput, data.mobileNumber());
        return this;
    }

    /**
     * Clicks the "Create Account" button to submit the form.
     *
     * @return New instance of AccountCreatedPage
     */
    public AccountCreatedPage clickCreateAccount() {
        click(createAccountButton);
        handleGoogleVignetteAd();
        return new AccountCreatedPage();
    }
}
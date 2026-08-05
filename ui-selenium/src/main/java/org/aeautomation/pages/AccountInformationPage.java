package org.aeautomation.pages;

import org.aeautomation.core.BasePage;
import org.openqa.selenium.By;

/**
 * Page Object representing the Account Information form page (/signup).
 */
public class AccountInformationPage extends BasePage {

    // Locators
    private final By pageHeader = By.xpath("//b[contains(text(),'Enter Account Information')]");
    private final By mrTitleRadio = By.id("id_gender1");
    private final By passwordInput = By.id("password");
    private final By daysDropdown = By.id("days");
    private final By monthsDropdown = By.id("months");
    private final By yearsDropdown = By.id("years");
    private final By newsletterCheckbox = By.id("newsletter");
    private final By offersCheckbox = By.id("optin");

    // Address Locators
    private final By firstNameInput = By.id("first_name");
    private final By lastNameInput = By.id("last_name");
    private final By companyInput = By.id("company");
    private final By address1Input = By.id("address1");
    private final By address2Input = By.id("address2");
    private final By countryDropdown = By.id("country");
    private final By stateInput = By.id("state");
    private final By cityInput = By.id("city");
    private final By zipcodeInput = By.id("zipcode");
    private final By mobileNumberInput = By.id("mobile_number");
    private final By createAccountButton = By.xpath("//button[@data-qa='create-account']");

    /**
     * Retrieves the text from the account information page header.
     *
     * @return Trimmed header text string (e.g., "ENTER ACCOUNT INFORMATION")
     */
    public String getPageHeaderText() {
        return getText(pageHeader);
    }

    /**
     * Selects the "Mr." title radio button.
     *
     * @return Current AccountInformationPage instance for method chaining
     */
    public AccountInformationPage selectTitleMr() {
        click(mrTitleRadio);
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
     * @param firstName    First name
     * @param lastName     Last name
     * @param company      Company name
     * @param address1     Primary address line
     * @param address2     Secondary address line
     * @param country      Country visible text (e.g., "United States")
     * @param state        State name
     * @param city         City name
     * @param zipcode      Zip/Postal code
     * @param mobile       Mobile phone number
     * @return Current AccountInformationPage instance for method chaining
     */
    public AccountInformationPage fillAddressDetails(
            String firstName, String lastName, String company,
            String address1, String address2, String country,
            String state, String city, String zipcode, String mobile) {

        type(firstNameInput, firstName);
        type(lastNameInput, lastName);
        type(companyInput, company);
        type(address1Input, address1);
        type(address2Input, address2);
        selectByVisibleText(countryDropdown, country);
        type(stateInput, state);
        type(cityInput, city);
        type(zipcodeInput, zipcode);
        type(mobileNumberInput, mobile);
        return this;
    }

    /**
     * Clicks the "Create Account" button to submit the form.
     *
     * @return New instance of AccountCreatedPage
     */
    public AccountCreatedPage clickCreateAccount() {
        click(createAccountButton);
        return new AccountCreatedPage();
    }
}
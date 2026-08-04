package org.aeautomation.pages;

import org.aeautomation.utils.ConfigReader;
import org.aeautomation.core.DriverFactory;
import org.openqa.selenium.WebDriver;

public abstract class BasePage {

    protected WebDriver driver;

    public BasePage() {
        this.driver = DriverFactory.getDriver();
    }

    /**
     * Navigates to a path relative to the configured Base URL.
     * @param relativePath Page route (e.g., "/login")
     */
    protected void navigateTo(String relativePath) {
        String baseUrl = ConfigReader.getBaseUrl();
        String formattedPath = relativePath.startsWith("/") ? relativePath : "/" + relativePath;
        driver.get(baseUrl + formattedPath);
    }
}
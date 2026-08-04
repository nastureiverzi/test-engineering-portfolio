package org.aeautomation.core;

import org.aeautomation.utils.ConfigReader;
import org.aeautomation.core.DriverFactory.BrowserType;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;

/**
 * Base Test class managing the lifecycle of WebDriver instances via TestNG hooks.
 * Serves as the foundation for all test classes in the framework.
 */
public abstract class BaseTest {

    /**
     * Initializes a thread-safe WebDriver instance prior to each test execution.
     *
     * Browser resolution order of precedence:
     **TestNG XML Parameter (supplied via {@code testng.xml} suite files)</li>
     **CLI System Property (supplied via Maven: {@code -Dbrowser=FIREFOX})</li>
     **Default value defined in {@code config.properties}</li>
     * </ol>
     *
     * @param xmlBrowser Browser parameter optionally injected from testng.xml.
     */
    @BeforeMethod(alwaysRun = true)
    @Parameters({"browser"})
    public void setUp(@Optional String xmlBrowser) {
        String browserName = (xmlBrowser != null && !xmlBrowser.isEmpty())
                ? xmlBrowser
                : ConfigReader.getBrowser();

        BrowserType browserType = resolveBrowserType(browserName);
        DriverFactory.initDriver(browserType);
    }

    /**
     * Retrieves the active thread-bound WebDriver instance.
     *
     * @return WebDriver instance for the current thread
     */
    protected WebDriver getDriver() {
        return DriverFactory.getDriver();
    }

    /**
     * Tears down the browser instance and cleans up ThreadLocal memory after every test execution.
     */
    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        DriverFactory.quitDriver();
    }

    /**
     * Helper to parse string inputs into BrowserType enum values.
     */
    private BrowserType resolveBrowserType(String browserName) {
        try {
            return BrowserType.valueOf(browserName.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalArgumentException(
                    "Unsupported browser type: '" + browserName + "'. Supported values: CHROME, FIREFOX, EDGE.", e);
        }
    }
}
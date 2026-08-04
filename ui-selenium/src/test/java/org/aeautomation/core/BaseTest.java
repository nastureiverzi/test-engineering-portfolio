package org.aeautomation.core;

import org.aeautomation.utils.ConfigReader;
import org.aeautomation.core.DriverFactory.BrowserType;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;

import java.util.Objects;
import java.util.stream.Stream;

/**
 * Base Test class managing the lifecycle of WebDriver instances via TestNG hooks.
 * Serves as the foundation for all test classes in the framework.
 */
public abstract class BaseTest {

    /**
     * Initializes a thread-safe WebDriver instance prior to each test execution.
     *
     * Browser resolution order:
     * 1. CLI system property (-Dbrowser=FIREFOX)
     * 2. TestNG XML parameter
     * 3. Default from config.properties
     *
     * @param xmlBrowser Browser parameter optionally injected from testng.xml.
     */
    @BeforeMethod(alwaysRun = true)
    @Parameters({"browser"})
    public void setUp(@Optional String xmlBrowser) {
        String resolvedBrowser = Stream.of(
                        System.getProperty("browser"),
                        xmlBrowser
                )
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(b -> !b.isEmpty())
                .findFirst()
                .orElseGet(ConfigReader::getBrowser);

        BrowserType browserType = resolveBrowserType(resolvedBrowser);
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
package org.aeautomation.core;

import org.aeautomation.utils.ConfigReader;
import org.aeautomation.core.DriverFactory.BrowserType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;

/**
 * Base Test class managing the lifecycle of WebDriver instances via TestNG hooks.
 * Serves as the foundation for all test classes in the framework.
 */
public abstract class BaseTest {

    private static final Logger log = LogManager.getLogger(BaseTest.class);
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
    public void setUp(@Optional String xmlBrowser, ITestResult result) {
        log.info("Starting test: [{}]", result.getMethod().getMethodName());
        String resolvedBrowser = ConfigReader.getBrowser(xmlBrowser);
        log.debug("Resolved browser: [{}]", resolvedBrowser);
        BrowserType browserType = resolveBrowserType(resolvedBrowser);
        DriverFactory.initDriver(browserType);
    }

    /**
     * Tears down the browser instance and cleans up ThreadLocal memory after every test execution.
     */
    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            log.error("Test FAILED: [{}] — {}", result.getMethod().getMethodName(),
                    result.getThrowable().getMessage());
        } else if (result.getStatus() == ITestResult.SUCCESS) {
            log.info("Test PASSED: [{}]", result.getMethod().getMethodName());
        } else if (result.getStatus() == ITestResult.SKIP) {
            log.warn("Test SKIPPED: [{}]", result.getMethod().getMethodName());
        }
        DriverFactory.quitDriver();
    }

    /**
     * Helper to parse string inputs into BrowserType enum values.
     */
    private BrowserType resolveBrowserType(String browserName) {
        try {
            return BrowserType.valueOf(browserName.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            log.error("Unsupported browser type: '{}'. Supported values: CHROME, FIREFOX, EDGE.", browserName);
            throw new IllegalArgumentException(
                    "Unsupported browser type: '" + browserName + "'. Supported values: CHROME, FIREFOX, EDGE.", e);
        }
    }
}
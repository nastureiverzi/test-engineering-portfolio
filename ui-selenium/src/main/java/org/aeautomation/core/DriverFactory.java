package org.aeautomation.core;

import org.aeautomation.utils.ConfigReader;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.util.*;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.function.Supplier;

/**
 * Thread-safe factory for managing WebDriver instances across parallel test threads.
 * Uses Java Enums to supply browser creation logic, adhering to the Open-Closed Principle.
 */
public final class DriverFactory {

    private static final Logger log = LogManager.getLogger(DriverFactory.class);
    private static final ThreadLocal<WebDriver> driverPool = new ThreadLocal<>();

    // --- Browser Engine Option Constants ---
    private static final String CHROMIUM_HEADLESS_FLAG = "--headless=new";
    private static final String FIREFOX_HEADLESS_FLAG = "-headless";
    private static final String START_MAXIMIZED_FLAG = "--start-maximized";

    private DriverFactory() {}

    public enum BrowserType {
        CHROME(DriverFactory::createChromeDriver),
        FIREFOX(DriverFactory::createFirefoxDriver),
        EDGE(DriverFactory::createEdgeDriver);

        private final Supplier<WebDriver> driverSupplier;

        BrowserType(Supplier<WebDriver> driverSupplier) {
            this.driverSupplier = driverSupplier;
        }

        public WebDriver createDriver() {
            return driverSupplier.get();
        }
    }

    /**
     * Initializes a new WebDriver instance for the current executing thread if absent.
     */
    public static void initDriver(BrowserType browserType) {
        if (driverPool.get() == null) {
            log.info("Initializing [{}] browser instance for thread ID [{}] (Headless: {})",
                    browserType, Thread.currentThread().getId(), ConfigReader.isHeadless());
            driverPool.set(browserType.createDriver());
        } else {
            log.warn("WebDriver instance already exists for thread ID [{}]", Thread.currentThread().getId());
        }
    }

    /**
     * Retrieves the thread-bound WebDriver instance.
     */
    public static WebDriver getDriver() {
        if (driverPool.get() == null) {
            log.error("Attempted to fetch WebDriver, but instance was not initialized for thread ID [{}]",
                    Thread.currentThread().getId());
            throw new IllegalStateException("Driver has not been initialized. Call initDriver() first.");
        }
        return driverPool.get();
    }

    /**
     * Quits the browser and cleans up ThreadLocal memory.
     */
    public static void quitDriver() {
        if (driverPool.get() != null) {
            log.info("Quitting WebDriver instance and removing from ThreadLocal pool for thread ID [{}]",
                    Thread.currentThread().getId());
            driverPool.get().quit();
            driverPool.remove();
        } else {
            log.debug("No active WebDriver instance to tear down for thread ID [{}]", Thread.currentThread().getId());
        }
    }

    // --- Private Helper Methods for Browser Options ---

    private static WebDriver createChromeDriver() {
        ChromeOptions options = new ChromeOptions();
        List<String> args = getChromiumOptions();
        options.addArguments(args);

        // Disable password save prompts
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.password_manager_enabled", false);
        options.setExperimentalOption("prefs", prefs);

        log.debug("Launching Chrome with arguments: {}", args);
        return new ChromeDriver(options);
    }

    private static WebDriver createFirefoxDriver() {
        FirefoxOptions options = new FirefoxOptions();
        List<String> args = getFirefoxOptions();
        options.addArguments(args);
        log.debug("Launching Firefox with arguments: {}", args);
        return new FirefoxDriver(options);
    }

    private static WebDriver createEdgeDriver() {
        EdgeOptions options = new EdgeOptions();
        List<String> args = getChromiumOptions();
        options.addArguments(args);
        log.debug("Launching Edge with arguments: {}", args);
        return new EdgeDriver(options);
    }

    /**
     * Assembles browser launch arguments for Chromium-based engines (Chrome & Edge).
     *
     * @return List of argument flags for Chromium browsers
     */
    private static List<String> getChromiumOptions() {
        List<String> args = new ArrayList<>();
        args.add(START_MAXIMIZED_FLAG);

        if (ConfigReader.isHeadless()) {
            args.add(CHROMIUM_HEADLESS_FLAG);
        }

        args.addAll(getCustomBrowserArgs());
        return args;
    }

    /**
     * Assembles browser launch arguments specifically for the Mozilla Firefox engine.
     *
     * @return List of argument flags for Firefox
     */
    private static List<String> getFirefoxOptions() {
        List<String> args = new ArrayList<>();

        if (ConfigReader.isHeadless()) {
            args.add(FIREFOX_HEADLESS_FLAG);
        }

        args.addAll(getCustomBrowserArgs());
        return args;
    }

    /**
     * Retrieves optional custom browser arguments passed via the 'browser.args' property
     * @return List of additional browser flag strings
     */
    private static List<String> getCustomBrowserArgs() {
        return Optional.of(ConfigReader.getProperty("browser.args", ""))
                .filter(Predicate.not(String::isBlank))
                .map(args -> Pattern.compile(";")
                        .splitAsStream(args)
                        .map(String::trim)
                        .filter(Predicate.not(String::isBlank))
                        .toList())
                .orElseGet(List::of);
    }
}
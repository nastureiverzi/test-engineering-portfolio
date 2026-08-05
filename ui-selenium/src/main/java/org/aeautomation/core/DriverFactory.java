package org.aeautomation.core;

import org.aeautomation.utils.ConfigReader;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Supplier;

/**
 * Thread-safe factory for managing WebDriver instances across parallel test threads.
 * Uses Java Enums to supply browser creation logic, adhering to the Open-Closed Principle.
 */
public final class DriverFactory {

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
            driverPool.set(browserType.createDriver());
        }
    }

    /**
     * Retrieves the thread-bound WebDriver instance.
     */
    public static WebDriver getDriver() {
        if (driverPool.get() == null) {
            throw new IllegalStateException("Driver has not been initialized. Call initDriver() first.");
        }
        return driverPool.get();
    }

    /**
     * Quits the browser and cleans up ThreadLocal memory.
     */
    public static void quitDriver() {
        if (driverPool.get() != null) {
            driverPool.get().quit();
            driverPool.remove();
        }
    }

    // --- Private Helper Methods for Browser Options ---

    private static WebDriver createChromeDriver() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments(getChromiumOptions());
        return new ChromeDriver(options);
    }

    private static WebDriver createFirefoxDriver() {
        FirefoxOptions options = new FirefoxOptions();
        options.addArguments(getFirefoxOptions());
        return new FirefoxDriver(options);
    }

    private static WebDriver createEdgeDriver() {
        EdgeOptions options = new EdgeOptions();
        options.addArguments(getChromiumOptions());
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
        return java.util.Optional.of(ConfigReader.getProperty("browser.args", ""))
                .filter(java.util.function.Predicate.not(String::isBlank))
                .map(args -> java.util.regex.Pattern.compile(";")
                        .splitAsStream(args)
                        .map(String::trim)
                        .filter(java.util.function.Predicate.not(String::isBlank))
                        .toList()) // Unmodifiable List (Java 16+)
                .orElseGet(List::of);
    }
}
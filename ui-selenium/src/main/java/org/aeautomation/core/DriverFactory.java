package org.aeautomation.core;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.util.function.Supplier;

/**
 * Thread-safe factory for managing WebDriver instances across parallel test threads.
 * Uses Java Enums to supply browser creation logic, adhering to the Open-Closed Principle.
 */
public final class DriverFactory {

    private static final ThreadLocal<WebDriver> driverPool = new ThreadLocal<>();

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
        options.addArguments("--start-maximized");
        if (isHeadless()) {
            options.addArguments("--headless=new");
        }
        return new ChromeDriver(options);
    }

    private static WebDriver createFirefoxDriver() {
        FirefoxOptions options = new FirefoxOptions();
        if (isHeadless()) {
            options.addArguments("-headless");
        }
        return new FirefoxDriver(options);
    }

    private static WebDriver createEdgeDriver() {
        EdgeOptions options = new EdgeOptions();
        options.addArguments("--start-maximized");
        if (isHeadless()) {
            options.addArguments("--headless=new");
        }
        return new EdgeDriver(options);
    }

    private static boolean isHeadless() {
        return Boolean.parseBoolean(System.getProperty("headless", "false"));
    }
}
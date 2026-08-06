package org.aeautomation.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.Properties;
import java.util.stream.Stream;

/**
 * Utility class responsible for loading framework configurations.
 * Implements a fallback mechanism: CLI system properties (-D key=value)
 * take precedence over properties defined in config.properties.
 */
public final class ConfigReader {

    private static final Properties properties = new Properties();
    private static final String CONFIG_FILE_PATH = "config.properties";

    // Static initializer to load properties once when the class is loaded into memory
    static {
        try (InputStream input = ConfigReader.class.getClassLoader()
                .getResourceAsStream(CONFIG_FILE_PATH)) {

            if (input == null) {
                throw new IllegalStateException("Configuration file '" + CONFIG_FILE_PATH + "' not found in classpath.");
            }
            properties.load(input);

        } catch (IOException e) {
            throw new RuntimeException("Failed to load configuration file: " + CONFIG_FILE_PATH, e);
        }
    }

    private ConfigReader() {}

    /**
     * Property getter that resolves configuration values based on strict priority.
     *
     * @param key            The property key to resolve
     * @param optionalValues Optional runtime parameter fallbacks
     * @return Resolved property value string
     * @throws IllegalArgumentException if the property key is missing across all configuration sources
     */
    public static String getProperty(String key, String... optionalValues) {
        return Stream.concat(
                        Stream.of(System.getProperty(key), properties.getProperty(key)),
                        Stream.of(optionalValues)
                )
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(val -> !val.isEmpty())
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Property key '" + key + "' was not found in System properties, config.properties, or optional parameters!"));
    }

    /**
     * Gets the global explicit wait timeout in seconds.
     *
     * @return Timeout duration in seconds (defaults to 10 seconds if unspecified)
     */
    public static int getTimeout() {
        try {
            return Integer.parseInt(getProperty("timeout"));
        } catch (NumberFormatException e) {
            System.err.println("Invalid 'timeout' value in configuration. Defaulting to 10 seconds.");
            return 10;
        }
    }

    /**
     * Retrieves the target browser for test execution, allowing an optional TestNG XML override.
     *
     * @param xmlBrowser Browser parameter optionally injected from testng.xml
     * @return Resolved browser string
     */
    public static String getBrowser(String xmlBrowser) {
        return getProperty("browser", xmlBrowser);
    }

    /**
     * Retrieves the target browser for test execution using the standard priority hierarchy.
     *
     * @return Resolved browser string
     */
    public static String getBrowser() {
        return getProperty("browser", "CHROME");
    }

    /**
     * Retrieves the target application base URL for navigating test environments.
     *
     * @return Base URL string
     */
    public static String getBaseUrl() {
        return getProperty("baseUrl");
    }

    /**
     * Determines whether browser execution should run in headless mode.
     *
     * @return true if 'headless' property is set to "true", otherwise false
     */
    public static boolean isHeadless() {
        return Boolean.parseBoolean(getProperty("headless", "false"));
    }

    /**
     * Convenience method to retrieve a property parsed as a boolean.
     */
    public static boolean getBoolean(String key, String... optionalValues) {
        return Boolean.parseBoolean(getProperty(key, optionalValues));
    }

    /**
     * Convenience method to retrieve a property parsed as an integer (e.g. timeouts).
     */
    public static int getInt(String key, String... optionalValues) {
        return Integer.parseInt(getProperty(key, optionalValues));
    }
}
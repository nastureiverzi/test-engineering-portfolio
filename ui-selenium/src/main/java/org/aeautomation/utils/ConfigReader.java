package org.aeautomation.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

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
     * Resolves a property key by checking System Properties (CLI overrides) first,
     * falling back to values declared in config.properties.
     *
     * @param key The key to look up
     * @return Resolved property value or null if not found
     */
    public static String getProperty(String key) {
        // 1. Check command line argument (-Dkey=value)
        String systemProperty = System.getProperty(key);
        if (systemProperty != null && !systemProperty.trim().isEmpty()) {
            return systemProperty.trim();
        }

        // 2. Fall back to config.properties file value
        String fileProperty = properties.getProperty(key);
        return (fileProperty != null) ? fileProperty.trim() : null;
    }

    /**
     * Gets the target Base URL for the environment under test.
     *
     * @return Target environment URL string
     */
    public static String getBaseUrl() {
        String url = getProperty("baseUrl");
        if (url == null || url.isEmpty()) {
            throw new IllegalStateException("Property 'baseUrl' is missing or empty in config.properties");
        }
        return url;
    }

    /**
     * Gets the default browser specified for local test runs.
     *
     * @return Browser name string (defaults to "CHROME" if unspecified)
     */
    public static String getBrowser() {
        String browser = getProperty("browser");
        return (browser != null && !browser.isEmpty()) ? browser : "CHROME";
    }

    /**
     * Gets the global explicit wait timeout in seconds.
     *
     * @return Timeout duration in seconds (defaults to 10 seconds if unspecified)
     */
    public static int getTimeout() {
        String timeoutStr = getProperty("timeout");
        try {
            return (timeoutStr != null) ? Integer.parseInt(timeoutStr) : 10;
        } catch (NumberFormatException e) {
            System.err.println("Invalid 'timeout' value in configuration. Defaulting to 10 seconds.");
            return 10;
        }
    }

    /**
     * Gets whether browser execution should run in headless mode.
     *
     * @return True if headless execution is requested, false otherwise
     */
    public static boolean isHeadless() {
        return Boolean.parseBoolean(getProperty("headless"));
    }
}
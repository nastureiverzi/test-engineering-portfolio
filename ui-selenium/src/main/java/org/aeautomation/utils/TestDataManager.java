package org.aeautomation.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;
import java.util.Properties;
import java.util.function.Predicate;

/**
 * Dedicated loader for test data inputs and credentials.
 * Keeps test data strictly decoupled from infrastructure/environment configs.
 */
public final class TestDataManager {

    private static final Logger log = LogManager.getLogger(TestDataManager.class);
    private static final JsonNode rootNode;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private TestDataManager() {
    }

    static {
        try (InputStream input = TestDataManager.class.getClassLoader()
                .getResourceAsStream("testdata.json")) {
            if (input == null) {
                log.error("testdata.json file not found in classpath.");
                throw new IllegalStateException("testdata.json not found in classpath.");
            }
            rootNode = objectMapper.readTree(input);
            log.info("Successfully loaded test data from [testdata.json]");
        } catch (IOException e) {
            log.error("Failed to load testdata.json from classpath.", e);
            throw new RuntimeException("Failed to load testdata.json from classpath.", e);
        }
    }

    /**
     * Resolves a string value from JSON using a dot-notation path (e.g., "users.validUser.email").
     */
    public static String get(String jsonPath) {
        String value = Optional.ofNullable(traversePath(jsonPath).asText(null))
                .filter(Predicate.not(String::isBlank))
                .orElseThrow(() -> {
                    log.error("Test data path '{}' was not found or is empty in testdata.json!", jsonPath);
                    return new IllegalArgumentException(
                            "Test data path '" + jsonPath + "' was not found or is empty in testdata.json!");
                });

        log.debug("Resolved test data string [{}] -> '{}'", jsonPath, value);
        return value;
    }

    /**
     * Resolves an integer value from JSON (e.g., "checkout.itemQuantity").
     */
    public static int getInt(String jsonPath) {
        JsonNode node = traversePath(jsonPath);
        if (node.isMissingNode() || !node.isNumber()) {
            log.error("Test data path '{}' is missing or not a valid number!", jsonPath);
            throw new IllegalArgumentException("Test data path '" + jsonPath + "' is missing or not a valid number!");
        }
        int value = node.asInt();
        log.debug("Resolved test data integer [{}] -> '{}'", jsonPath, value);
        return value;
    }

    /**
     * Resolves a boolean value from JSON (e.g., "features.enableDiscount").
     */
    public static boolean getBoolean(String jsonPath) {
        JsonNode node = traversePath(jsonPath);
        if (node.isMissingNode() || !node.isBoolean()) {
            log.error("Test data path '{}' is missing or not a valid boolean!", jsonPath);
            throw new IllegalArgumentException("Test data path '" + jsonPath + "' is missing or not a valid boolean!");
        }
        boolean value = node.asBoolean();
        log.debug("Resolved test data boolean [{}] -> '{}'", jsonPath, value);
        return value;
    }

    /**
     * Deserializes a sub-tree of JSON directly into a Java POJO or Record.
     * Useful for complex objects
     */
    public static <T> T getObject(String jsonPath, Class<T> targetClass) {
        try {
            JsonNode node = traversePath(jsonPath);
            T object = objectMapper.treeToValue(node, targetClass);
            log.debug("Successfully mapped test data path [{}] to record/POJO [{}]", jsonPath, targetClass.getSimpleName());
            return object;
        } catch (Exception e) {
            log.error("Failed to parse JSON path '{}' into {}", jsonPath, targetClass.getSimpleName(), e);
            throw new IllegalArgumentException("Failed to parse JSON path '" + jsonPath + "' into " + targetClass.getSimpleName(), e);
        }
    }

    private static JsonNode traversePath(String jsonPath) {
        String[] keys = jsonPath.split("\\.");
        JsonNode currentNode = rootNode;

        for (String key : keys) {
            currentNode = currentNode.path(key);
        }
        return currentNode;
    }
}
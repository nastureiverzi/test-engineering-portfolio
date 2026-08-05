package org.aeautomation.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.Properties;
import java.util.function.Predicate;

/**
 * Dedicated loader for test data inputs and credentials.
 * Keeps test data strictly decoupled from infrastructure/environment configs.
 */
public final class TestDataManager {

    private static final Properties testData = new Properties();
    private static final JsonNode rootNode;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private TestDataManager() {
    }

    static {
        try {
            File jsonFile = new File("src/test/resources/testdata.json");
            rootNode = objectMapper.readTree(jsonFile);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load src/test/resources/testdata/testdata.json file.", e);
        }
    }

    /**
     * Resolves a string value from JSON using a dot-notation path (e.g., "users.validUser.email").
     */
    public static String get(String jsonPath) {
        return Optional.ofNullable(traversePath(jsonPath).asText(null))
                .filter(Predicate.not(String::isBlank))
                .orElseThrow(() -> new IllegalArgumentException(
                        "Test data path '" + jsonPath + "' was not found or is empty in testdata.json!"));
    }

    /**
     * Resolves an integer value from JSON (e.g., "checkout.itemQuantity").
     */
    public static int getInt(String jsonPath) {
        JsonNode node = traversePath(jsonPath);
        if (node.isMissingNode() || !node.isNumber()) {
            throw new IllegalArgumentException("Test data path '" + jsonPath + "' is missing or not a valid number!");
        }
        return node.asInt();
    }

    /**
     * Resolves a boolean value from JSON (e.g., "features.enableDiscount").
     */
    public static boolean getBoolean(String jsonPath) {
        JsonNode node = traversePath(jsonPath);
        if (node.isMissingNode() || !node.isBoolean()) {
            throw new IllegalArgumentException("Test data path '" + jsonPath + "' is missing or not a valid boolean!");
        }
        return node.asBoolean();
    }

    /**
     * Deserializes a sub-tree of JSON directly into a Java POJO or Record.
     * Useful for complex objects
     */
    public static <T> T getObject(String jsonPath, Class<T> targetClass) {
        try {
            JsonNode node = traversePath(jsonPath);
            return objectMapper.treeToValue(node, targetClass);
        } catch (Exception e) {
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
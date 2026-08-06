package org.aeautomation.utils;

import java.util.UUID;

public final class TestDataGenerator {

    private TestDataGenerator() {
    }

    public static String generateEmail(String prefix) {
        String domain = ConfigReader.getProperty("test.email.domain");
        return prefix + "_" + UUID.randomUUID().toString().replace("-", "") + "@" + domain;
    }
}
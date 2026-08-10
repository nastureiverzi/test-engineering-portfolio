package org.aeautomation.data;

/**
 * Record representing login test data retrieved from TestDataManager JSON.
 *
 * @param email            User login email address
 * @param password         User login password
 * @param expectedUsername Expected username displayed in the top navigation bar upon successful login
 */
public record LoginData(
        String email,
        String password,
        String expectedUsername
) {}
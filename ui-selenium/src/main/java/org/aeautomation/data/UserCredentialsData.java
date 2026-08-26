package org.aeautomation.data;

import com.fasterxml.jackson.annotation.JsonAlias;

/**
 * Generic record representing a name/email pair used across signup and validation tests.
 *
 * @param name  Full name or username string
 * @param email Email address string
 */
public record UserCredentialsData(
        @JsonAlias("username")
        String name,
        String email
) {}
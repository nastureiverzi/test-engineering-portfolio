package org.aeautomation.data;

public record UserRegistrationData(
        String name,
        String password,
        String dobDay,
        String dobMonth,
        String dobYear,
        String firstName,
        String lastName,
        String company,
        String address1,
        String address2,
        String country,
        String state,
        String city,
        String zipcode,
        String mobileNumber
) {}

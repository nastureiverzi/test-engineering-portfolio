export interface UserRegistrationData {
    name: string;
    password: string;
    title: 'Mr' | 'Mrs';
    dobDay: string;
    dobMonth: string;
    dobYear: string;
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
}

export interface LoginData {
    email: string;
    password: string;
    expectedUsername?: string;
    expectedError?: string;
}

export interface InvalidEmailData {
    username: string;
    email: string;
}

export interface ExistingUserData {
    name: string;
    email: string;
}
# Manual Test Suite

## Test Execution Summary

| Test ID | Module | Priority | Scenario | Status | Environment |
|:---|:---|:---|:---|:---|:---|
| TC-001 | User Registration | High | Successful signup and account creation | PASS | Chrome / Win11 |
| TC-002 | User Registration | High | Registration with already registered email | PASS | Chrome / Win11 |
| TC-003 | User Registration | High | Registration with missing @ symbol | PASS | Chrome / Win11 |
| TC-004 | User Registration | High | Registration with missing email domain | FAIL | Chrome / Win11 |
| TC-005 | User Registration | High | Registration with empty username field | PASS | Chrome / Win11 |
| TC-006 | Authentication | High | Successful login with valid credentials | PASS | Chrome / Win11 |
| TC-007 | Authentication | High | Login with incorrect password | PASS | Chrome / Win11 |
| TC-008 | Authentication | High | Login with unregistered email | PASS | Chrome / Win11 |
| TC-009 | Authentication | High | Login with empty email field | PASS | Chrome / Win11 |
| TC-010 | Authentication | High | Login with empty password field | PASS | Chrome / Win11 |
| TC-011 | User Registration | Medium | Multi-click submission on registration | FAIL | Chrome / Win11 |
| TC-012 | Product Search | High | Search by keyword | PASS | Chrome / Win11 |
| TC-013 | Shopping Cart | High | Add item to cart | PASS | Chrome / Win11 |

---

## Test Specifications

### User Registration

---

#### TC-001 — Successful signup and account creation

**Pre-conditions:**
- User is not logged in
- Email is not registered

**Test Data:**
- Username: `testAccount`
- Email: `testuser123.qa@gmail.com`
- Password: `testPass`
- First Name: `Test` / Last Name: `User`
- DOB: 15/May/1990
- Address: 123 Test Street, Test City, Test State, 12345, US
- Mobile: `1234567890`

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. In the "New User Signup!" section, enter username and email
4. Click "Signup"
5. Fill in all required account information fields (Title, Password, DOB)
6. Fill in all required address fields (Name, Address, Country, State, City, Zipcode, Mobile)
7. Click "Create Account"
8. Click "Continue"

**Expected Result:**
- After step 7, "Account Created!" page is displayed
- After step 8, user is redirected to the homepage
- "Logged in as testAccount" appears in the top navigation bar

**Actual Result:** PASS — Account created successfully, navigation header updated correctly

---

#### TC-002 — Registration with already registered email

**Pre-conditions:**
- User is not logged in

**Test Data:**
- Username: `testAccount`
- Email: `testuser123.qa@gmail.com` (already registered)

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. In the "New User Signup!" section, enter username and the already registered email
4. Click "Signup"

**Expected Result:**
- After step 4, a red error message is displayed below the signup form indicating the email already exists
- User remains on the registration page

**Actual Result:** PASS — Red validation message displayed, form progression blocked

---

#### TC-003 — Registration with missing @ symbol in email

**Pre-conditions:**
- User is not logged in
- Email is not registered

**Test Data:**
- Username: `testAccount`
- Email: `test124.gmail.com`

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. In the "New User Signup!" section, enter username and the malformed email
4. Click "Signup"

**Expected Result:**
- After step 4, browser displays a native HTML5 tooltip next to the email field indicating the `@` symbol is missing
- No network request is sent
- User remains on the registration page

**Actual Result:** PASS — Browser HTML5 validation blocked submission and displayed tooltip correctly

---

#### TC-004 — Registration with missing email domain

**Pre-conditions:**
- User is not logged in
- Email is not registered

**Test Data:**
- Username: `testAccount`
- Email: `test124@gmail`

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. In the "New User Signup!" section, enter username and the malformed email
4. Click "Signup"

**Expected Result:**
- After step 4, browser or application displays a validation message indicating the email is invalid
- User remains on the registration page

**Actual Result:** FAIL
- Browser native validation does not catch the missing domain suffix
- User is redirected to the full registration form page despite the invalid email
- No error message is displayed

**Notes:** Backend accepts `test124@gmail` as a valid email — missing domain suffix validation at both client and server level

---

#### TC-005 — Registration with empty username field

**Pre-conditions:**
- User is not logged in
- Email is not registered

**Test Data:**
- Username: (empty)
- Email: `test124@gmail.com`

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. In the "New User Signup!" section, leave the username field empty and enter a valid email
4. Click "Signup"

**Expected Result:**
- After step 4, browser displays a tooltip next to the username field indicating the field is required
- User remains on the registration page

**Actual Result:** PASS — Browser validation blocked submission and displayed "Fill out this field" tooltip

---

### User Authentication

---

#### TC-006 — Successful login with valid credentials

**Pre-conditions:**
- User has a registered account
- User is not logged in

**Test Data:**
- Email: `testuser123.qa@gmail.com`
- Password: `testPass`

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. In the "Login to your account" section, enter email and password
4. Click "Login"

**Expected Result:**
- After step 4, user is redirected to the homepage
- "Logged in as testAccount" is displayed in the top navigation bar

**Actual Result:** PASS — Session initialised, user redirected to homepage, header updated correctly

---

#### TC-007 — Login with incorrect password

**Pre-conditions:**
- User has a registered account
- User is not logged in

**Test Data:**
- Email: `testuser123.qa@gmail.com`
- Password: `testfail`

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. In the "Login to your account" section, enter valid email and incorrect password
4. Click "Login"

**Expected Result:**
- After step 4, a red error message is displayed below the form indicating the email or password is incorrect
- User remains on the login page

**Actual Result:** PASS — Error message displayed, user remained unauthenticated

---

#### TC-008 — Login with unregistered email

**Pre-conditions:**
- Email does not exist in the system

**Test Data:**
- Email: `testUnregisteredUser@gmail.com`
- Password: `testPass`

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. In the "Login to your account" section, enter unregistered email and password
4. Click "Login"

**Expected Result:**
- After step 4, a red error message is displayed below the form indicating the email or password is incorrect
- User remains on the login page

**Actual Result:** PASS — Validation error displayed, login blocked correctly

---

#### TC-009 — Login with empty email field

**Pre-conditions:**
- User is not logged in

**Test Data:**
- Email: (empty)
- Password: `testPass`

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. In the "Login to your account" section, leave the email field empty and enter a password
4. Click "Login"

**Expected Result:**
- After step 4, browser displays a tooltip indicating the email field is required
- User remains on the login page

**Actual Result:** PASS — Browser validation blocked submission before any network request was made

---

#### TC-010 — Login with empty password field

**Pre-conditions:**
- User has a registered account
- User is not logged in

**Test Data:**
- Email: `testuser123.qa@gmail.com`
- Password: (empty)

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. In the "Login to your account" section, enter a valid email and leave the password field empty
4. Click "Login"

**Expected Result:**
- After step 4, browser displays a validation message indicating the password field is required
- User remains on the login page

**Actual Result:** PASS — Browser validation blocked submission, password field flagged as required

---

### User Registration — Boundary

---

#### TC-011 — Multi-click submission on registration

**Pre-conditions:**
- User is not logged in
- Email is not registered

**Test Data:**
- Username: `testAccount`
- Email: `testuser123.qa+1@gmail.com`
- Password: `testPass`
- First Name: `Test` / Last Name: `Registration`
- DOB: 1/January/1987
- Address: 456 Street, Moody, Alabama, 35004, US
- Mobile: `345678901`

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Signup / Login" in the top navigation menu
3. Enter username and email in the "New User Signup!" section and click "Signup"
4. Fill in all required account and address fields
5. Click "Create Account" 5 times in quick succession

**Expected Result:**
- First click submits the registration request
- Button is disabled or debounced after the first click to prevent duplicate submissions
- "Account Created!" page is displayed once

**Actual Result:** FAIL
- All 5 clicks fire separate POST requests to the backend
- Server returns an unhandled exception: `IntegrityError at /signup — UNIQUE constraint failed: website_useraccount.email`
- Page displays a 500 Internal Server Error

**Notes:** Submit button is not debounced or disabled after initial click — duplicate requests reach the database layer simultaneously

---

### Product Search

---

#### TC-012 — Search by keyword

**Pre-conditions:**
- None

**Test Data:**
- Search query: `top`

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Click "Products" in the top navigation menu
3. In the search field, type `top`
4. Click the search button

**Expected Result:**
- Page displays a list of products matching the keyword "top"
- Unrelated products such as pants or other categories are not shown

**Actual Result:** PASS — Results filtered correctly to keyword, irrelevant products excluded

---

### Shopping Cart

---

#### TC-013 — Add item to cart

**Pre-conditions:**
- User is logged in

**Test Data:**
- None

**Steps:**
1. Navigate to `https://automationexercise.com/`
2. Scroll to the "Featured Items" section
3. Hover over a product card and click "Add to cart"
4. In the confirmation popup, click "View Cart"

**Expected Result:**
- After step 3, a popup titled "Added!" is displayed with the message "Your product has been added to cart", a "View Cart" link, and a "Continue Shopping" button
- After step 4, user is redirected to the cart page and the added product is listed correctly

**Actual Result:** PASS — Popup displayed correctly, cart shows the added product with correct details
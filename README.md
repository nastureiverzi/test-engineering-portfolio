# Test Engineering Portfolio

A test engineering portfolio covering UI and API test automation, defect 
reporting, and structured test design across Java and JavaScript.

**Author:** Raluca Botas

---

## Purpose

This repository demonstrates practical skills in:

- Manual testing and defect reporting
- UI test automation across two frameworks
- API testing with both manual and automated tools

---

## Repository Structure

```text
test-engineering-portfolio/
├── manual-testing/    # Test cases and bug reports
├── ui-selenium/       # UI automation — Java 17, Selenium 4, TestNG
├── ui-playwright/     # UI automation — JavaScript, Playwright
└── api-testing/       # API testing — Postman and Supertest
```
---

## Projects

### Manual Testing
- Functional test cases
- Bug reports with reproduction steps and screenshots
- Jira-based defect tracking

### Selenium Automation
- Page Object Model
- Explicit wait strategies
- Form validation and UI functional testing

### Playwright Automation
- Modern browser automation
- Reliable synchronization techniques
- Page Object Model in JavaScript

### API Testing
- Request and response validation
- Status code and payload verification
- Postman collections and environments
- Automated API testing with Supertest

---

## Stack

- **Java:** Java 17, Selenium 4, TestNG, Maven, WebDriverManager
- **JavaScript:** Node.js, Playwright, Supertest
- **API:** Postman

---

## Running the tests

Each project is self-contained with its own setup instructions.

`ui-selenium/`
```bash
mvn test                                                # default (Chrome)
mvn test -Dbrowser=FIREFOX                              # custom browser
mvn test -Dheadless=true                                # headless mode
mvn test -DbaseUrl=https://staging.myapp.com            # custom base URL
mvn test -Dbrowser=FIREFOX -Dheadless=true -DbaseUrl=https://staging.myapp.com  # combined
```

`ui-playwright/`

> First time setup: `npm install && npx playwright install`

```bash
npx playwright test                                          # default (Chromium)
npx playwright test --project=firefox                        # Firefox
npx playwright test --project=webkit                         # Safari (WebKit)
npx playwright test --headed                                 # headed mode
BASE_URL=https://staging.myapp.com npx playwright test       # custom base URL
HEADLESS=false npx playwright test --project=chromium        # combined
npx playwright show-report                                   # open last HTML report
```

`api-testing/`
- Supertest: `npm test`
- Postman: import collection from `collections/`
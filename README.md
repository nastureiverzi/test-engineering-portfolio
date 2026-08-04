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
mvn test                                                          # default (Chrome)
mvn test -Dbrowser=FIREFOX                                        # custom browser
mvn test -Dheadless=true                                          # headless mode
mvn test -Dbrowser=FIREFOX -Dheadless=true                        # combined
```

`ui-playwright/`
```bash
npx playwright test
```

`api-testing/`
- Supertest: `npm test`
- Postman: import collection from `collections/`
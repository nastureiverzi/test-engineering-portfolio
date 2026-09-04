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

### `ui-selenium/`

> First time setup: copy `config.example.properties` to `config.properties`.
> The example file contains working default values and can be used as-is to run the suite against `automationexercise.com`.

```bash
mvn test                                                # default (Chrome)
mvn test -Dbrowser=FIREFOX                              # custom browser
mvn test -Dheadless=true                                # headless mode
mvn test -DbaseUrl=https://staging.myapp.com            # custom base URL
mvn test -Dbrowser=FIREFOX -Dheadless=true -DbaseUrl=https://staging.myapp.com  # combined
```

> All other settings (`timeout`, `test.email.domain`) are configured via `config.properties` — see `config.example.properties`.

### `ui-playwright/`

> First time setup: `npm install && npx playwright install`, then copy `.env.example` to `.env`.
> The example file contains working default values and can be used as-is to run the suite against `automationexercise.com`.

**Using npm scripts:**

```bash
npm test                    # default (all browsers)
npm run test:chromium       # Chromium only
npm run test:firefox        # Firefox only
npm run test:webkit         # Safari (WebKit) only
npm run test:headed         # headed mode
npm run test:ui             # Playwright UI mode (interactive test runner)
npm run report              # open last HTML report
```

**Filtering tests by tag:**

```bash
npx playwright test --grep @registration          # registration tests only
npx playwright test --grep @authentication        # authentication tests only
npx playwright test --grep-invert @known-bugs     # exclude known bug tests
```

**With environment variable overrides (Linux/macOS/Git Bash):**

```bash
BASE_URL=https://staging.myapp.com npm test                    # custom base URL
HEADLESS=false npm run test:chromium                           # headed Chromium
TIMEOUT=60000 npm test                                         # custom timeout
BASE_URL=https://staging.myapp.com HEADLESS=true npm test      # combined
```

> **Windows PowerShell/CMD users:** Inline environment variable syntax is not supported. Use one of these alternatives instead:
>
> Set the variable first, then run:
> ```powershell
> $env:BASE_URL="https://staging.myapp.com"; npm test
> ```
> Or update `.env` directly with the values you need before running `npm test`.

> All other settings (`TEST_EMAIL_DOMAIN`, `LOG_LEVEL`) are configured via `.env` — see `.env.example`.

`api-testing/`
- Supertest: `npm test`
- Postman: import collection from `collections/`
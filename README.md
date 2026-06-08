# Task 1 — Frontend Test Automation
**SUT:** https://www.saucedemo.com  
**Framework:** Playwright

## Test scenarios

| # | Scenario | Why essential |
|---|----------|---------------|
| TC-01 | Login with valid credentials | Entry point to the entire app — any regression here blocks all users |
| TC-02 | Login with locked-out account is rejected | Access control must be enforced and the error must be visible to the user |
| TC-03 | Add item to cart persists correctly | Core user journey — broken cart means purchase flow is broken |
| TC-04 | Complete checkout flow end-to-end | Most critical path — failure here means no orders can be completed |

## Design pattern

**Page Object Model (POM)** — each page is encapsulated in its own class (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`). Tests interact only with page methods and locators, not raw selectors. Selector changes are isolated to a single file.

## Structure

```
task1-playwright/
├── playwright.config.js
├── package.json
├── README.md
└── tests/
    ├── saucedemo.spec.js      # all 4 test cases
    └── pages/
        ├── LoginPage.js
        ├── InventoryPage.js
        ├── CartPage.js
        └── CheckoutPage.js
```

## Prerequisites

- Node.js 18+

## Install & run

```bash
npm install
npx playwright install chromium
npm test
```

Run with HTML report:
```bash
npm run test:report
npx playwright show-report
```

Run a single test:
```bash
npx playwright test --grep "TC-01"
```

# AutomationExercise – Playwright E2E Test Suite (POM)

A production-grade end-to-end test suite for [automationexercise.com](https://automationexercise.com) built with **Playwright Test** and the **Page Object Model** pattern.

---

## Project Structure

```
playwright-pom/
├── locators/                        # All CSS/text selectors in JSON
│   ├── home.locators.json
│   ├── signup.locators.json
│   └── product.locators.json        # Also covers cart, checkout & payment
│
├── pages/                           # Page Object Model classes
│   ├── BasePage.ts                  # Shared helpers (navigate, wait, dismiss ads)
│   ├── HomePage.ts
│   ├── SignupPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── PaymentPage.ts
│
├── tests/
│   └── signup-to-purchase.spec.ts   # Main spec (5 tests)
│
├── utils/
│   └── testData.ts                  # Test constants & data generators
│
├── downloads/                       # Invoice PDFs land here (auto-created)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (first time only)
npx playwright install chromium

# 3. Create the downloads directory
mkdir -p downloads
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run with browser visible |
| `npx playwright test --grep "E2E"` | Run only the full E2E smoke test |
| `npx playwright test --debug` | Step-by-step debugger |
| `npm run test:report` | Open the HTML report after a run |

---

## Test Coverage

| # | Test | Key Assertions |
|---|---|---|
| 1 | Home page load | Title, Signup/Login link visible |
| 2 | Sign-up flow | Account Created heading, logged-in navbar |
| 3 | Product → Cart | Product in cart, correct quantity |
| 4 | Checkout → Payment | Order Placed message, invoice file exists |
| 5 | Full E2E (smoke) | All of the above in one run |

---

## Key Design Decisions

### Locators in JSON files
All CSS selectors live in `locators/*.json`. Page classes import these files — no magic strings scattered through test code. Changing a selector means editing **one file only**.

### Page Object Model
Each page of the application has a dedicated class that:
- Encapsulates all locators and interactions for that page
- Exposes intent-revealing methods (`assertAccountCreated`, `proceedToCheckout`)
- Inherits shared utilities from `BasePage`

### Email format
Generated as `test+<2 random digits>@yopmail.com` per requirements, e.g. `test+47@yopmail.com`.

### Failure artifacts
`playwright.config.ts` is configured with:
- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`
- `trace: 'retain-on-failure'`

All artifacts land in `playwright-report/` and can be viewed with `npm run test:report`.

---

## Adding More Tests

1. Add new locators to the relevant `locators/*.json` file (or create a new one).
2. Add methods to the relevant Page class (or create a new one extending `BasePage`).
3. Write a new `test(...)` block in the spec file, or create a new spec.

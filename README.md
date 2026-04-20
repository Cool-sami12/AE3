 Playwright Automation Framework – Technical Assessment Submission
 Author
Nkechi Anne Iwuoma
Technical Assessment Submission

Project Overview
This project is a Playwright-based end-to-end automation framework designed to validate critical user journeys in a web-based e-commerce application.
The framework follows industry best practices, including the Page Object Model (POM), separation of concerns, scalable test architecture, and maintainable locator management.
The primary goal is to ensure reliable regression coverage of high-value business workflows, including user onboarding, product selection, checkout, and order completion.

 Framework Architecture
The framework is designed with a clean layered architecture to ensure scalability, maintainability, and reusability.
Directory	Purpose
pages/	Page Object Model classes (BasePage + feature-specific pages)
locators/	External JSON-based element locators
e2e/	End-to-end test specifications
utils/	Test data utilities and helper functions
downloads/	Stored artifacts (e.g., invoices) for validation

Design Principles & Engineering Decisions
1. Page Object Model (POM)
The framework uses the Page Object Model to:
- Encapsulate UI interactions within page classes
- Reduce duplication across test cases
- Improve maintainability and readability
- Isolate UI changes from test logic
Each page extends a shared BasePage.ts class.

2. BasePage Abstraction Layer
A central BasePage provides reusable wrapper methods:
- navigate()
- click()
- fill()
- waitForElement()
Benefits:
- Standardised interaction layer
- Centralised error handling and logging
- Consistent Playwright page lifecycle management

3. JSON-Based Locator Strategy
Locators are externalised into JSON files rather than being hardcoded in test scripts.
Advantages:
- Improved maintainability
- Separation of UI structure from test logic
- Easier updates when UI changes occur
- Encourages reuse across multiple page objects
Note: This approach improves maintainability but still requires technical validation when updating selectors.

4. Centralised Test Data Management
All test data is managed in utils/testData.ts, including:
- Dynamic email generation (to avoid duplication conflicts)
- Product details
- Payment data (test environment only)
- Application URLs
Benefits:
- Single source of truth for test data
- Reduced duplication
- Improved maintainability and consistency

5. File Download & Invoice Validation
The framework validates post-purchase invoice generation by:
- Triggering invoice download after checkout
- Verifying file existence in the file system
- Ensuring end-to-end transaction completion integrity
 Enhancement Opportunity: Future improvements may include PDF content validation for stronger assertions.

Identified Key User Journeys
The following critical user journeys were identified from the application:
#	User Journey
1	User Registration
2	User Login / Authentication
3	Product Browsing & Selection
4	Add to Cart & Quantity Validation
5	Checkout & Payment Processing
6	End-to-End Purchase Flow

 Automated Test Coverage
The following four high-priority journeys were automated:
1. User Registration
Validates onboarding flow and account creation.
2. Product Browsing & Cart Management
Ensures product discovery and cart functionality work correctly.
3. Checkout & Payment Flow
Validates the revenue-critical transaction path.
4. Full End-to-End Purchase Flow
Simulates a real-world customer journey from entry to order completion.

 Test Selection Strategy & Justification
Test cases were selected based on:
- Business criticality
- User frequency
- Revenue impact
- Regression risk
Journey	Justification
Registration	Essential onboarding entry point
Product & Cart	Core shopping behaviour
Checkout & Payment	Revenue-critical workflow
End-to-End Flow	Full system integration validation

 Excluded Scenarios (With Justification)
Login (Standalone)
Login is not tested as an isolated flow because:
- Authentication is validated within multiple user journeys
- Session state is verified post-registration and during E2E flow
Isolated Product Browsing
Covered within cart and full E2E flows to avoid duplication and increase realism.
 Note: Authentication is still fully exercised across multiple workflows.

 Authentication Strategy
Authentication is embedded within real user journeys rather than isolated test cases.
Implementation:
- Login triggered via HomePage.goToSignupLogin()
- Session validation performed via HomePage.assertLoggedIn()
- Unique email generation ensures test isolation
Coverage Points:
- Registration flow
- Full E2E purchase flow
- Session persistence validation
Design Rationale:
This approach reflects real-world user behaviour, where authentication is not an isolated action but part of a broader journey.

Execution & Setup
Prerequisites
- Node.js v16+
- npm or yarn

Installation
npm install

Test Execution
Run all tests
npx playwright test
Run in UI mode
npx playwright test --ui
Run specific test file
npx playwright test e2e/signup-to-purchase.spec.ts
Run in headed mode
npx playwright test --headed
Run in specific browser
npx playwright test --project=chromium

📊 Reporting
Playwright provides built-in reporting features:
npx playwright show-report
Reporting Features:
- HTML test reports
- Failure screenshots
- Trace viewer support

 Quality Assurance Strategy
Test Approach
- End-to-end functional validation
- Real user journey simulation
- Regression-focused coverage
Testing Principles
- Maintainability over duplication
- Business-critical prioritisation
- Reusable abstraction layers

⚠️ Known Limitations
- Limited cross-browser execution coverage (can be extended)
- Invoice validation currently file-existence based (not content-level validation)
- No CI/CD pipeline integrated in current submission

🚀Future Improvements
- CI/CD integration (GitHub Actions / Jenkins)
- Parallel test execution optimisation
- PDF content validation for invoices
- Expanded negative test coverage
- Visual regression testing

Conclusion
This automation framework demonstrates:
- Strong understanding of Playwright and modern test automation principles
- Scalable architecture using Page Object Model
- Maintainable locator and data strategies
- Business-driven test selection approach
- Realistic end-to-end user journey validation
The framework is designed to be maintainable, extensible, and aligned with real-world QA engineering practices.

 Risk & Mitigation Matrix
Risk	Impact	Mitigation
UI changes breaking locators	High	JSON-based locator strategy + Page Object Model
Flaky tests due to timing issues	Medium	Explicit waits and Playwright auto-waiting mechanisms
Test data conflicts	Medium	Dynamic email generation for isolation
Environment instability	High	CI retry strategy + stable selectors
Payment/invoice verification limitations	Medium	File existence validation (future: PDF content validation)


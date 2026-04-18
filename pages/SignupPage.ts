import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import signupLocators from '../locators/signup.locators.json';

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

/**
 * SignupPage: Covers both the initial Signup section on /login
 * and the full registration form on /signup.
 */
export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Step 1: /login page ──────────────────────────────────────────────────

  /** Assert the "New User Signup!" heading is visible */
  async assertSignupSectionVisible(): Promise<void> {
    await expect(
      this.page.locator(signupLocators.loginPage.newUserHeading)
    ).toBeVisible();
  }

  /**
   * Fill the initial signup name + email and click "Signup".
   * Lands on the full registration form (/signup).
   */
  async submitInitialSignup(name: string, email: string): Promise<void> {
    await this.page
      .locator(signupLocators.loginPage.nameInput)
      .fill(name);

    await this.page
      .locator(signupLocators.loginPage.emailInput)
      .fill(email);

    await this.page
      .locator(signupLocators.loginPage.signupButton)
      .click();

    // Wait for the detailed registration form to appear
   // await this.page.waitForURL('/login');
    await this.page.waitForSelector(signupLocators.registrationForm.passwordInput, {
      state: 'visible',
    });
  }

  // ── Step 2: /signup page (full registration form) ────────────────────────

  /** Select the "Mr" title radio button */
  async selectTitleMr(): Promise<void> {
    await this.page.locator(signupLocators.registrationForm.titleMr).check();
  }

  /** Select the "Mrs" title radio button */
  async selectTitleMrs(): Promise<void> {
    await this.page.locator(signupLocators.registrationForm.titleMrs).check();
  }

  /** Fill every field of the account details form */
  async fillAccountDetails(data: RegistrationData): Promise<void> {
    const f = signupLocators.registrationForm;

    // Title
    await this.selectTitleMr();

    // Password
    await this.page.locator(f.passwordInput).fill(data.password);

    // Date of birth
    await this.page.locator(f.daySelect).selectOption(data.day);
    await this.page.locator(f.monthSelect).selectOption(data.month);
    await this.page.locator(f.yearSelect).selectOption(data.year);

    // Optional newsletter / offers checkboxes
    await this.page.locator(f.newsletterCheckbox).check();
    await this.page.locator(f.offersCheckbox).check();

    // Address info
    await this.page.locator(f.firstNameInput).fill(data.firstName);
    await this.page.locator(f.lastNameInput).fill(data.lastName);
    await this.page.locator(f.companyInput).fill(data.company);
    await this.page.locator(f.address1Input).fill(data.address1);
    await this.page.locator(f.address2Input).fill(data.address2);
    await this.page.locator(f.countrySelect).selectOption(data.country);
    await this.page.locator(f.stateInput).fill(data.state);
    await this.page.locator(f.cityInput).fill(data.city);
    await this.page.locator(f.zipcodeInput).fill(data.zipcode);
    await this.page.locator(f.mobileNumberInput).fill(data.mobile);
  }

  /** Click the "Create Account" button */
  async createAccount(): Promise<void> {
    await this.page
      .locator(signupLocators.registrationForm.createAccountButton)
      .click();
    await this.page.waitForURL('**/account_created');
  }

  // ── Step 3: /account_created page ────────────────────────────────────────

  /** Assert the "ACCOUNT CREATED!" success message */
  async assertAccountCreated(): Promise<void> {
    const heading = this.page.locator(signupLocators.successPage.accountCreatedHeading);
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Account Created');
  }

  /** Click Continue after account creation – lands on home page */
  async clickContinue(): Promise<void> {
    await this.page
      .locator(signupLocators.successPage.continueButton)
      .click();
   // await this.page.waitForURL('/');
  }
}

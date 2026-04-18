import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import homeLocators from '../locators/home.locators.json';

/**
 * HomePage: Encapsulates actions on the AutomationExercise home page.
 */
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Navigate to the site root */
  async open(): Promise<void> {
    await this.navigate('/');
    // Wait for the navbar to be present – confirms the page loaded
    await this.page.waitForSelector(homeLocators.navbar.signupLoginLink, {
      state: 'visible',
    });
  }

  /** Assert that the home page loaded correctly */
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Automation Exercise/i);
    await expect(
      this.page.locator(homeLocators.navbar.signupLoginLink)
    ).toBeVisible();
  }

  /** Click the Signup / Login link in the navbar */
  async goToSignupLogin(): Promise<void> {
    await this.page.locator(homeLocators.navbar.signupLoginLink).click();
    await this.page.waitForURL('**/login');
  }

  /** Assert that a user is logged in (navbar shows "Logged in as <name>") */
  async assertLoggedIn(username: string): Promise<void> {
    const loggedInText = this.page.locator(homeLocators.navbar.loggedInAs);
    await expect(loggedInText).toBeVisible();
    await expect(loggedInText).toContainText(username);
  }

  /** Click the Products link */
  async goToProducts(): Promise<void> {
    await this.page.locator(homeLocators.navbar.productsLink).click();
    await this.page.waitForURL('**/products');
  }

  /** Click the Cart link */
  async goToCart(): Promise<void> {
    await this.page.locator(homeLocators.navbar.cartLink).click();
    await this.page.waitForURL('**/view_cart');
  }

  /**
   * Click "View Product" for the first featured product on the home page.
   * Returns after navigation to the product detail page.
   */
  async viewFirstProduct(): Promise<void> {
    const viewButtons = this.page.locator(homeLocators.featuredItems.viewProductButtons);
    await viewButtons.first().click();
    await this.page.waitForURL('**/product_details/**');
  }
}

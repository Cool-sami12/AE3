import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import productLocators from '../locators/product.locators.json';

/**
 * CheckoutPage: Review order and place it.
 */
export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Assert the delivery and billing sections are visible */
  async assertOrderSummaryVisible(): Promise<void> {
    await expect(this.page.locator('#cart_info')).toBeVisible();
  }

  /** Optionally add an order comment */
  async addOrderComment(comment: string): Promise<void> {
    await this.page
      .locator(productLocators.checkoutPage.orderComment)
      .fill(comment);
  }

  /** Click "Place Order" – navigates to payment page */
  async placeOrder(): Promise<void> {
    await this.page
      .locator(productLocators.checkoutPage.placeOrderButton)
      .click();
    await this.page.waitForURL('**/payment');
  }
}

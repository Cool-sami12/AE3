import { Page, expect, Download } from '@playwright/test';
import { BasePage } from './BasePage';
import productLocators from '../locators/product.locators.json';
import * as path from 'path';

export interface CardDetails {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

/**
 * PaymentPage: Fill card details, confirm order, and download invoice.
 */
export class PaymentPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Fill in all payment card fields */
  async fillCardDetails(card: CardDetails): Promise<void> {
    const p = productLocators.paymentPage;

    await this.page.locator(p.nameOnCardInput).fill(card.nameOnCard);
    await this.page.locator(p.cardNumberInput).fill(card.cardNumber);
    await this.page.locator(p.cvcInput).fill(card.cvc);
    await this.page.locator(p.expiryMonthInput).fill(card.expiryMonth);
    await this.page.locator(p.expiryYearInput).fill(card.expiryYear);
  }

  /** Click "Pay and Confirm Order" */
  async confirmPayment(): Promise<void> {
    await this.page
      .locator(productLocators.paymentPage.payAndConfirmButton)
      .click();
   // await this.page.waitForURL('**/payment_done/**');
  }

  /** Assert the congratulatory "Order Placed!" success message */
  async assertOrderPlaced(): Promise<void> {
    const successMsg = this.page.locator(
      productLocators.orderSuccess.successMessage
    );
    await expect(successMsg).toBeVisible();
    await expect(successMsg).toContainText('Order Placed');
  }

  /**
   * Click "Download Invoice" and wait for the file to download.
   * Returns the Download object so tests can inspect the file.
   */
  async downloadInvoice(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page
        .locator(productLocators.orderSuccess.downloadInvoiceButton)
        .click(),
    ]);
    return download;
  }

  /** Click "Continue" on the order success page */
  // async clickContinue(): Promise<void> {
  //   await this.page
  //     .locator(productLocators.orderSuccess.continueButton)
  //     .click();
  // }
}

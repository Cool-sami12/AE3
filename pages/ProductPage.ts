import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import productLocators from '../locators/product.locators.json';

/**
 * ProductPage: Handles actions on the product detail page.
 */
export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Assert the product detail page is loaded */
  async assertProductDetailLoaded(): Promise<void> {
    await expect(
      this.page.locator(productLocators.productDetail.productName)
    ).toBeVisible();
    await expect(
      this.page.locator(productLocators.productDetail.quantityInput)
    ).toBeVisible();
  }

  /** Get the current product name text */
  async getProductName(): Promise<string> {
    return this.page
      .locator(productLocators.productDetail.productName)
      .innerText();
  }

  /**
   * Set the quantity field to a specific value.
   * Clears the default value first.
   */
  async setQuantity(quantity: number): Promise<void> {
    const qtyInput = this.page.locator(productLocators.productDetail.quantityInput);
    await qtyInput.clear();
    await qtyInput.fill(String(quantity));
    // Verify the value was set correctly
    await expect(qtyInput).toHaveValue(String(quantity));
  }

  /**
   * Click "Add to Cart", then handle the confirmation modal:
   * - Either clicks "View Cart" to navigate directly, or
   * - Clicks "Continue Shopping" to stay on the page.
   *
   * @param viewCart - if true, navigates to cart after adding
   */
  async addToCart(viewCart: boolean = true): Promise<void> {
    await this.page
      .locator(productLocators.productDetail.addToCartButton)
      .click();

    if (viewCart) {
      // Wait for the success modal then click "View Cart"
      const viewCartLink = this.page.locator(productLocators.productDetail.viewCartLink);
      await viewCartLink.waitFor({ state: 'visible' });
      await viewCartLink.click();
     // await this.page.waitForURL('**/view_cart');
    } else {
      const continueBtn = this.page.locator(
        productLocators.productDetail.continueShoppingButton
      );
      await continueBtn.waitFor({ state: 'visible' });
      await continueBtn.click();
    }
  }
}

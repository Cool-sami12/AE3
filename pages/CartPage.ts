import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import productLocators from '../locators/product.locators.json';

/**
 * CartPage: Handles the shopping cart (/view_cart).
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Assert the cart table is visible and contains at least one item */
  async assertCartNotEmpty(): Promise<void> {
    await expect(
      this.page.locator(productLocators.cartPage.cartTable)
    ).toBeVisible();
    
      // await expect(this.cartItems.first()).toBeVisible();
      // const count = await this.cartItems.count();
      // expect(count).toBeGreaterThan(0);
    

    const items = this.page.locator(productLocators.cartPage.cartItems);
    const countw = await items.count();
    await expect(countw).toBeGreaterThan(0);
   // await expect(items).toBeVisible()
  }

  /**
   * Assert that a product by name exists in the cart.
   * @param productName - partial or full product name
   */
  async assertProductInCart(productName: string): Promise<void> {
    const productNames = this.page.locator(
      productLocators.cartPage.productNameInCart
    );
    // At least one cart item should match the product name
    const count = await productNames.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await productNames.nth(i).innerText();
      if (text.toLowerCase().includes(productName.toLowerCase())) {
        found = true;
        break;
      }
    }
    expect(found, `Product "${productName}" not found in cart`).toBe(true);
  }

  /** Assert that cart quantity matches expected value */
  async assertQuantity(expectedQty: number): Promise<void> {
    const qtyButton = this.page
      .locator(productLocators.cartPage.productQuantityInCart)
      .first();
    await expect(qtyButton).toHaveText(String(expectedQty));
  }

  /** Click "Proceed To Checkout" */
  async proceedToCheckout(): Promise<void> {
    await this.page
      .locator(productLocators.cartPage.proceedToCheckoutButton)
      .click();
    // The checkout page URL
    await this.page.waitForURL('**/checkout');
  }
}

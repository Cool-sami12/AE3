/**
 * ============================================================
 * E2E Test: Full User Journey on automationexercise.com
 * ============================================================
 * Framework : Playwright Test (@playwright/test)
 * Pattern   : Page Object Model (POM) + JSON locator files
 * Coverage  :
 *   1. Home page load verification
 *   2. User sign-up (initial form → full registration)
 *   3. Account creation confirmation
 *   4. Post-login navbar verification
 *   5. View a product → set quantity → add to cart
 *   6. Cart verification
 *   7. Checkout → place order
 *   8. Payment → order confirmation
 *   9. Invoice download
 * ============================================================
 */

import { test, expect, Download } from '@playwright/test';
import { HomePage }     from '../pages/HomePage';
import { SignupPage }   from '../pages/SignupPage';
import { ProductPage }  from '../pages/ProductPage';
import { CartPage }     from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage }  from '../pages/PaymentPage';
import {
  registrationData,
  cardDetails,
  PRODUCT_QUANTITY,
  ORDER_COMMENT,
} from '../utils/testData';
import * as path from 'path';
import * as fs   from 'fs';

// ── Shared state across tests in this suite ──────────────────────────────────
let productNameAddedToCart: string = '';

// ── Test Suite ───────────────────────────────────────────────────────────────
test.describe('AutomationExercise – Complete User Journey', () => {

  // Page object instances are initialised fresh for every test via beforeEach.
  // This keeps each test's POM references bound to the correct page object.
  let homePage:     HomePage;
  let signupPage:   SignupPage;
  let productPage:  ProductPage;
  let cartPage:     CartPage;
  let checkoutPage: CheckoutPage;
  let paymentPage:  PaymentPage;

  test.beforeEach(async ({ page }) => {
    homePage     = new HomePage(page);
    signupPage   = new SignupPage(page);
    productPage  = new ProductPage(page);
    cartPage     = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage  = new PaymentPage(page);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TEST 1 – Home page loads successfully
  // ══════════════════════════════════════════════════════════════════════════
  test.skip('1 · Home page should load and display key elements', async ({ page }) => {
    // Navigate to the home page
    await homePage.open();

    // Assert title contains "Automation Exercise"
    await homePage.assertPageLoaded();

    // Additional sanity: the Signup/Login link must be present (user not yet logged in)
    await expect(page.locator("a[href='/login']")).toBeVisible();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TEST 2 – User can sign up with valid credentials
  // ══════════════════════════════════════════════════════════════════════════
  test.skip('2 · User should be able to sign up and create an account', async ({ page }) => {
    // ── Navigate to Home ──────────────────────────────────────────────────
    await homePage.open();
    await homePage.assertPageLoaded();

    // ── Go to Signup / Login page ─────────────────────────────────────────
    await homePage.goToSignupLogin();

    // Assert the "New User Signup!" section is visible
    await signupPage.assertSignupSectionVisible();

    // ── Step 1: Submit name + email ───────────────────────────────────────
    // Email format: test+<2 random digits>@yopmail.com
    console.log(`[TEST] Signing up with email: ${registrationData.email}`);
    await signupPage.submitInitialSignup(
      registrationData.name,
      registrationData.email,
    );

    // ── Step 2: Fill the full registration form ───────────────────────────
    await signupPage.fillAccountDetails(registrationData);

    // ── Step 3: Click "Create Account" ────────────────────────────────────
    await signupPage.createAccount();

    // ── Step 4: Assert success message ────────────────────────────────────
    await signupPage.assertAccountCreated();

    // ── Step 5: Click "Continue" → redirected to home ─────────────────────
    await signupPage.clickContinue();

    // ── Step 6: Confirm logged-in state in navbar ─────────────────────────
    await homePage.assertLoggedIn(registrationData.firstName);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TEST 3 – View a product, set quantity, and add it to the cart
  // ══════════════════════════════════════════════════════════════════════════
  test.skip('3 · User should be able to view a product and add it to the cart', async ({ page }) => {
    // ── Pre-condition: user must be logged in ─────────────────────────────
    // Re-run signup flow so the session is active for this isolated test
    await homePage.open();
    await homePage.goToSignupLogin();
    await signupPage.assertSignupSectionVisible();
    await signupPage.submitInitialSignup(registrationData.name, registrationData.email);
    await signupPage.fillAccountDetails(registrationData);
    await signupPage.createAccount();
    await signupPage.assertAccountCreated();
    await signupPage.clickContinue();
    await homePage.assertLoggedIn(registrationData.firstName);

    // ── View the first featured product ───────────────────────────────────
    await homePage.viewFirstProduct();

    // Verify the product detail page loaded
    await productPage.assertProductDetailLoaded();

    // Capture the product name for later cart assertion
    productNameAddedToCart = await productPage.getProductName();
    console.log(`[TEST] Product selected: "${productNameAddedToCart}"`);

    // ── Set quantity ──────────────────────────────────────────────────────
    await productPage.setQuantity(PRODUCT_QUANTITY);

    // ── Add to cart and navigate to cart ─────────────────────────────────
    await productPage.addToCart(true); // true = click "View Cart"

    // ── Assert the cart contains the product ─────────────────────────────
    await cartPage.assertCartNotEmpty();
    await cartPage.assertProductInCart(productNameAddedToCart);

    // Assert quantity was correctly set
    await cartPage.assertQuantity(PRODUCT_QUANTITY);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TEST 4 – Checkout, payment, and invoice download
  // ══════════════════════════════════════════════════════════════════════════
  test.skip('4 · User should complete checkout and receive order confirmation', async ({ page }) => {
    // ── Pre-condition: login + add product to cart ────────────────────────
    await homePage.open();
    await homePage.goToSignupLogin();
    await signupPage.assertSignupSectionVisible();
    await signupPage.submitInitialSignup(registrationData.name, registrationData.email);
    await signupPage.fillAccountDetails(registrationData);
    await signupPage.createAccount();
    await signupPage.assertAccountCreated();
    await signupPage.clickContinue();
    await homePage.assertLoggedIn(registrationData.firstName);

    // Add a product to cart
    await homePage.viewFirstProduct();
    await productPage.assertProductDetailLoaded();
    productNameAddedToCart = await productPage.getProductName();
    await productPage.setQuantity(PRODUCT_QUANTITY);
    await productPage.addToCart(true);

    // Verify cart before proceeding
    await cartPage.assertCartNotEmpty();

    // ── Proceed to Checkout ───────────────────────────────────────────────
    await cartPage.proceedToCheckout();

    // Review order summary
    await checkoutPage.assertOrderSummaryVisible();

    // Add a comment (optional but exercises the field)
    await checkoutPage.addOrderComment(ORDER_COMMENT);

    // Place the order → navigate to payment page
    await checkoutPage.placeOrder();

    // ── Fill payment details ──────────────────────────────────────────────
    await paymentPage.fillCardDetails(cardDetails);

    // ── Confirm payment ───────────────────────────────────────────────────
    await paymentPage.confirmPayment();

    // ── Assert "Order Placed!" congratulatory message ─────────────────────
    await paymentPage.assertOrderPlaced();

    // ── Download invoice ──────────────────────────────────────────────────
    const download: Download = await paymentPage.downloadInvoice();

    // Save to a temp location and verify the file exists
    const downloadPath = path.join('downloads', download.suggestedFilename());
    await download.saveAs(downloadPath);
    expect(fs.existsSync(downloadPath)).toBe(true);
    console.log(`[TEST] Invoice downloaded to: ${downloadPath}`);

    // ── Click Continue after order ────────────────────────────────────────
   // await paymentPage.clickContinue();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TEST 5 – Full end-to-end in a single run (smoke / regression)
  // ══════════════════════════════════════════════════════════════════════════
  test('5 · Full E2E: signup → product → cart → checkout → payment → invoice', async ({ page }) => {
    // ── 1. Open home page ─────────────────────────────────────────────────
    await homePage.open();
    await homePage.assertPageLoaded();

    // ── 2. Navigate to Signup / Login ─────────────────────────────────────
    await homePage.goToSignupLogin();
    await signupPage.assertSignupSectionVisible();

    // ── 3. Sign up ────────────────────────────────────────────────────────
    // Generate a fresh unique email for this standalone test run
    const runEmail = `test+${String(Math.floor(Math.random() * 900) + 100)}@yopmail.com`;
    console.log(`[E2E] Using email: ${runEmail}`);

    await signupPage.submitInitialSignup(registrationData.name, runEmail);
    await signupPage.fillAccountDetails({
      ...registrationData,
      email: runEmail,
    });
    await signupPage.createAccount();

    // ── 4. Assert account created ─────────────────────────────────────────
    await signupPage.assertAccountCreated();
    await signupPage.clickContinue();

    // ── 5. Confirm logged in ──────────────────────────────────────────────
    await homePage.assertLoggedIn(registrationData.firstName);

    // ── 6. View a product ─────────────────────────────────────────────────
    await homePage.viewFirstProduct();
    await productPage.assertProductDetailLoaded();
    const pName = await productPage.getProductName();
    console.log(`[E2E] Viewing product: "${pName}"`);

    // ── 7. Set quantity and add to cart ───────────────────────────────────
    await productPage.setQuantity(PRODUCT_QUANTITY);
    await productPage.addToCart(true); // navigate to cart

    // ── 8. Assert product in cart ─────────────────────────────────────────
    await cartPage.assertCartNotEmpty();
    await cartPage.assertProductInCart(pName);
    await cartPage.assertQuantity(PRODUCT_QUANTITY);

    // ── 9. Proceed to checkout ────────────────────────────────────────────
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOrderSummaryVisible();
    await checkoutPage.addOrderComment(ORDER_COMMENT);
    await checkoutPage.placeOrder();

    // ── 10. Fill payment details and confirm ──────────────────────────────
    await paymentPage.fillCardDetails(cardDetails);
    await paymentPage.confirmPayment();

    // ── 11. Verify congratulatory message ─────────────────────────────────
    await paymentPage.assertOrderPlaced();

    // ── 12. Download invoice ──────────────────────────────────────────────
    const download = await paymentPage.downloadInvoice();
    const filePath = path.join('downloads', download.suggestedFilename());
    await download.saveAs(filePath);
    expect(fs.existsSync(filePath)).toBe(true);
    console.log(`[E2E] Invoice saved: ${filePath}`);

    // await paymentPage.clickContinue();
    console.log('[E2E] Full journey completed successfully ✅');
  });

});

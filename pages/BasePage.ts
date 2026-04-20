import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage: Every POM page extends this.
 * Provides shared helpers like navigation, waiting, and screenshot capture.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    
  }

  /** Navigate to a relative or absolute URL */
  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto("https://automationexercise.com", { waitUntil: 'domcontentloaded' });
    
  }

  /** Wait for a locator to be visible */
  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /** Dismiss any ad overlay / modal that may block interactions */
  async dismissAdIfPresent(): Promise<void> {
    try {
      // Some pages show a full-screen ad iframe; close it if present
      const adClose = this.page.frameLocator('iframe').locator('#dismiss-button');
      if (await adClose.isVisible({ timeout: 3000 })) {
        await adClose.click();
      }
    } catch {
      // No ad present – continue
    }
  }

  /** Returns the current page title */
  async getTitle(): Promise<string> {
    return this.page.title();
  }
}

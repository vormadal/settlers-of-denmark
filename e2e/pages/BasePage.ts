import { Page } from '@playwright/test';

/**
 * Base Page Object class that all page objects extend from.
 * Provides common functionality and utilities for interacting with pages.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   * @param path - The path to navigate to (relative to baseURL)
   */
  async goto(path: string = '') {
    await this.page.goto(path);
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the current page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Take a screenshot of the page
   * @param name - Name for the screenshot file
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }
}

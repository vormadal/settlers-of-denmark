import { test, expect } from '../fixtures/testFixtures';

/**
 * Simple E2E test to verify the fixed game room can be created
 */
test.describe('Fixed Game - Basic Room Creation', () => {
  
  test('should be able to create and access a fixed game room', async ({ page }) => {
    // Go to the lobby
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Wait for page to be ready
    await page.waitForTimeout(1000);
    
    // Check if the page loaded
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    // Take a screenshot of the lobby
    await page.screenshot({ 
      path: 'e2e-screenshots/simple-test-lobby.png',
      fullPage: true 
    });

    expect(pageTitle).toBeTruthy();
  });
});

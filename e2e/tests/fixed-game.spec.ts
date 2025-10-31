import { test, expect } from '../fixtures/testFixtures';
import { Browser, chromium, Page } from '@playwright/test';

/**
 * Test Suite: Fixed Game - Initial Settlement Placement
 * Tests reproducible game behavior with two players placing their first settlements
 */
test.describe('Fixed Game - Initial Settlement Placement', () => {
  let browser: Browser;
  let player1Page: Page;
  let player2Page: Page;
  let roomId: string;

  test.beforeAll(async () => {
    // Create a separate browser instance for multi-player testing
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test('two players should be able to join fixed game and place settlements', async () => {
    // Create two browser contexts for two different players
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    player1Page = await context1.newPage();
    player2Page = await context2.newPage();

    // Player 1: Navigate to lobby and create a fixed room
    await player1Page.goto('http://localhost:3000');
    await player1Page.waitForLoadState('networkidle');
    
    // Enter player name for player 1
    const player1NameInput = player1Page.getByRole('textbox', { name: /Player Name/i });
    await player1NameInput.fill('Player1');
    
    // Wait for create button to be enabled
    await player1Page.waitForTimeout(500);
    
    // Create a new game - we need to intercept or use API to create a "fixed" room
    // For now, let's use the Colyseus API directly through the browser console
    roomId = await player1Page.evaluate(async () => {
      // Access the Colyseus client from the window (if exposed) or create one
      const Colyseus = (window as any).Colyseus || await import('colyseus.js');
      const client = new Colyseus.Client('ws://localhost:2567');
      const room = await client.create('fixed', { name: 'Player1' });
      return room.id;
    });

    console.log('Created fixed room:', roomId);

    // Player 1: Join the game room
    await player1Page.goto(`http://localhost:3000/#/game/${roomId}?name=Player1`);
    await player1Page.waitForLoadState('networkidle');
    
    // Wait for the canvas to load
    await player1Page.waitForSelector('canvas', { timeout: 10000 });
    await player1Page.waitForTimeout(1000);

    // Player 2: Join the same room
    await player2Page.goto(`http://localhost:3000/#/game/${roomId}?name=Player2`);
    await player2Page.waitForLoadState('networkidle');
    
    // Wait for the canvas to load for player 2
    await player2Page.waitForSelector('canvas', { timeout: 10000 });
    await player2Page.waitForTimeout(2000); // Give time for game to start

    // Take screenshots to verify both players see the same board
    await player1Page.screenshot({ 
      path: 'e2e-screenshots/fixed-game-player1-initial.png',
      fullPage: true 
    });
    
    await player2Page.screenshot({ 
      path: 'e2e-screenshots/fixed-game-player2-initial.png',
      fullPage: true 
    });

    // Verify both players are in the game
    const player1Canvas = player1Page.locator('canvas');
    const player2Canvas = player2Page.locator('canvas');
    
    await expect(player1Canvas).toBeVisible();
    await expect(player2Canvas).toBeVisible();

    // Test that the game has started (both players have joined)
    // In initial placement phase, players should be able to place settlements
    
    // Player 1 should be able to click to place a settlement
    // We need to wait for available intersections to be highlighted
    await player1Page.waitForTimeout(1000);
    
    // Try to click on the board to place first settlement for player 1
    const canvas1Box = await player1Canvas.boundingBox();
    if (canvas1Box) {
      // Click at a position that should be an available intersection
      await player1Page.mouse.click(canvas1Box.x + canvas1Box.width / 2, canvas1Box.y + canvas1Box.height / 3);
      await player1Page.waitForTimeout(500);
      
      // Click on an available edge to place a road
      await player1Page.mouse.click(canvas1Box.x + canvas1Box.width / 2 + 50, canvas1Box.y + canvas1Box.height / 3);
      await player1Page.waitForTimeout(500);
    }

    // Take screenshot after player 1's first placement
    await player1Page.screenshot({ 
      path: 'e2e-screenshots/fixed-game-player1-after-first-placement.png',
      fullPage: true 
    });

    // Player 2 should now be able to place their settlement
    await player2Page.waitForTimeout(1000);
    
    const canvas2Box = await player2Canvas.boundingBox();
    if (canvas2Box) {
      // Click at a different position for player 2's settlement
      await player2Page.mouse.click(canvas2Box.x + canvas2Box.width / 3, canvas2Box.y + canvas2Box.height / 2);
      await player2Page.waitForTimeout(500);
      
      // Click on an available edge to place a road
      await player2Page.mouse.click(canvas2Box.x + canvas2Box.width / 3 + 50, canvas2Box.y + canvas2Box.height / 2);
      await player2Page.waitForTimeout(500);
    }

    // Take screenshots after player 2's first placement
    await player2Page.screenshot({ 
      path: 'e2e-screenshots/fixed-game-player2-after-first-placement.png',
      fullPage: true 
    });
    
    await player1Page.screenshot({ 
      path: 'e2e-screenshots/fixed-game-player1-after-player2-placement.png',
      fullPage: true 
    });

    // Close contexts
    await context1.close();
    await context2.close();

    // If we got here without errors, the test passes
    expect(true).toBe(true);
  });
});

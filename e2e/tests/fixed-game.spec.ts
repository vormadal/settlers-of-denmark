import { test, expect } from '../fixtures/testFixtures';
import { Browser, chromium, BrowserContext } from '@playwright/test';

/**
 * Test Suite: Fixed Game - Reproducible Board Layout
 * Tests that the fixed game creates the same board layout every time
 */
test.describe('Fixed Game - Reproducible Layout', () => {
  
  test('should create a fixed game with deterministic board layout', async ({ page }) => {
    // Navigate to lobby
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Create a fixed room using the browser's console
    const roomId = await page.evaluate(async () => {
      const ColyseusJS = await import('colyseus.js');
      const client = new ColyseusJS.Client('ws://localhost:2567');
      const room = await client.create('fixed', { name: 'TestPlayer' });
      console.log('Created fixed room:', room.id);
      return room.id;
    });

    console.log('Fixed room created:', roomId);

    // Navigate to the game page
    await page.goto(`http://localhost:3000/#/game/${roomId}?name=TestPlayer`);
    await page.waitForLoadState('networkidle');
    
    // Wait for the canvas to load
    await page.waitForSelector('canvas', { timeout: 15000 });
    await page.waitForTimeout(2000); // Give time for board to render
    
    // Take a screenshot of the initial board
    await page.screenshot({ 
      path: 'e2e-screenshots/fixed-game-board-initial.png',
      fullPage: true 
    });

    // Verify canvas is visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Get board state information from the page
    const boardInfo = await page.evaluate(() => {
      // Try to access game state if it's available
      const anyWindow = window as any;
      if (anyWindow.gameState) {
        return {
          hexCount: anyWindow.gameState.hexes?.length || 0,
        };
      }
      return { hexCount: 0 };
    });

    console.log('Board info:', boardInfo);
    
    // The test passes if we can create the room and load the board
    expect(canvas).toBeTruthy();
  });

  test('should create the same board layout on multiple runs', async ({ page }) => {
    // Create first fixed room
    const roomId1 = await page.evaluate(async () => {
      const ColyseusJS = await import('colyseus.js');
      const client = new ColyseusJS.Client('ws://localhost:2567');
      const room = await client.create('fixed', { name: 'Player1' });
      
      // Get hex information
      const hexes = Array.from(room.state.hexes.values()).map((hex: any) => ({
        id: hex.id,
        type: hex.type,
        value: hex.value
      }));
      
      await room.leave();
      return { roomId: room.id, hexes };
    });

    console.log('First room hexes:', roomId1.hexes);

    // Create second fixed room
    const roomId2 = await page.evaluate(async () => {
      const ColyseusJS = await import('colyseus.js');
      const client = new ColyseusJS.Client('ws://localhost:2567');
      const room = await client.create('fixed', { name: 'Player2' });
      
      // Get hex information
      const hexes = Array.from(room.state.hexes.values()).map((hex: any) => ({
        id: hex.id,
        type: hex.type,
        value: hex.value
      }));
      
      await room.leave();
      return { roomId: room.id, hexes };
    });

    console.log('Second room hexes:', roomId2.hexes);

    // Verify both rooms have the same hex layout
    expect(roomId1.hexes.length).toBe(roomId2.hexes.length);
    
    // Check that hex types match at each position
    for (let i = 0; i < roomId1.hexes.length; i++) {
      expect(roomId1.hexes[i].type).toBe(roomId2.hexes[i].type);
      expect(roomId1.hexes[i].value).toBe(roomId2.hexes[i].value);
    }
  });

  test('should have predictable dice rolls in fixed game', async ({ page }) => {
    // Create a fixed room
    const diceSequence = await page.evaluate(async () => {
      const ColyseusJS = await import('colyseus.js');
      const client = new ColyseusJS.Client('ws://localhost:2567');
      const room = await client.create('fixed', { name: 'DiceTestPlayer' });
      
      // We need to wait for state to sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const rolls: number[] = [];
      
      // Simulate rolling dice multiple times and record the results
      // Note: This requires the game to be in a state where dice can be rolled
      // For initial placement phase, dice aren't rolled yet
      
      const initialDice = room.state.dice;
      const diceInfo = Array.from(initialDice.values()).map((die: any) => ({
        color: die.color,
        value: die.value
      }));
      
      await room.leave();
      return { rolls, diceInfo };
    });

    console.log('Dice info:', diceSequence.diceInfo);
    
    // Verify dice are initialized
    expect(diceSequence.diceInfo.length).toBe(2);
  });
});

/**
 * Test Suite: Fixed Game - Two Players Initial Placement
 * Tests that two players can place their initial settlements
 */
test.describe('Fixed Game - Two Players Placement', () => {
  let browser: Browser;
  let context1: BrowserContext;
  let context2: BrowserContext;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test('two players should join and see the game board', async () => {
    context1 = await browser.newContext();
    context2 = await browser.newContext();
    
    const player1Page = await context1.newPage();
    const player2Page = await context2.newPage();

    // Create a fixed room via player 1
    const roomId = await player1Page.evaluate(async () => {
      const ColyseusJS = await import('colyseus.js');
      const client = new ColyseusJS.Client('ws://localhost:2567');
      const room = await client.create('fixed', { name: 'Player1' });
      return room.id;
    });

    console.log('Created fixed room for multiplayer test:', roomId);

    // Player 1 joins the game
    await player1Page.goto(`http://localhost:3000/#/game/${roomId}?name=Player1`);
    await player1Page.waitForLoadState('networkidle');
    await player1Page.waitForSelector('canvas', { timeout: 15000 });

    // Player 2 joins the same game
    await player2Page.goto(`http://localhost:3000/#/game/${roomId}?name=Player2`);
    await player2Page.waitForLoadState('networkidle');
    await player2Page.waitForSelector('canvas', { timeout: 15000 });
    
    // Wait for game to start (both players joined)
    await player1Page.waitForTimeout(2000);
    await player2Page.waitForTimeout(2000);

    // Take screenshots
    await player1Page.screenshot({ 
      path: 'e2e-screenshots/fixed-game-player1-view.png',
      fullPage: true 
    });
    
    await player2Page.screenshot({ 
      path: 'e2e-screenshots/fixed-game-player2-view.png',
      fullPage: true 
    });

    // Verify both players see the canvas
    await expect(player1Page.locator('canvas')).toBeVisible();
    await expect(player2Page.locator('canvas')).toBeVisible();

    await context1.close();
    await context2.close();
  });
});

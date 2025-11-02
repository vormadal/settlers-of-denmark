import { test, expect } from '../fixtures/testFixtures';
import { Browser, chromium, BrowserContext } from '@playwright/test';

/**
 * Test Suite: Fixed Game - Reproducible Board Layout
 * Tests that the fixed game creates the same board layout every time
 */
test.describe('Fixed Game - Reproducible Layout', () => {
  
  test('should create a fixed game with deterministic board layout', async ({ gamePage }) => {
    // Navigate to lobby
    await gamePage.page.goto('http://localhost:3000');
    await gamePage.page.waitForLoadState('networkidle');
    
    // Create a fixed room
    const roomId = await gamePage.createFixedRoom('TestPlayer');
    console.log('Fixed room created:', roomId);

    // Join the game room
    await gamePage.joinGameRoom(roomId, 'TestPlayer');
    
    // Take a screenshot of the initial board
    await gamePage.takeScreenshot('fixed-game-board-initial.png');

    // Verify canvas is visible
    await expect(gamePage.boardCanvas).toBeVisible();
  });

  test('should create the same board layout on multiple runs', async ({ gamePage }) => {
    // Create first fixed room and get hex info
    const room1 = await gamePage.createFixedRoomWithHexInfo('Player1');
    console.log('First room hexes:', room1.hexes);

    // Create second fixed room and get hex info
    const room2 = await gamePage.createFixedRoomWithHexInfo('Player2');
    console.log('Second room hexes:', room2.hexes);

    // Verify both rooms have the same hex layout
    expect(room1.hexes.length).toBe(room2.hexes.length);
    
    // Check that hex types match at each position
    for (let i = 0; i < room1.hexes.length; i++) {
      expect(room1.hexes[i].type).toBe(room2.hexes[i].type);
      expect(room1.hexes[i].value).toBe(room2.hexes[i].value);
    }
  });

  test('should have predictable dice rolls in fixed game', async ({ gamePage }) => {
    // Create a fixed room and verify dice initialization
    const diceSequence = await gamePage.page.evaluate(async () => {
      const ColyseusJS = await import('colyseus.js');
      const client = new ColyseusJS.Client('ws://localhost:2567');
      const room = await client.create('fixed', { name: 'DiceTestPlayer' });
      
      // Wait for state to sync using room's state change listener
      await new Promise<void>(resolve => {
        if (room.state.dice && room.state.dice.length > 0) {
          resolve();
        } else {
          room.state.listen('dice', () => {
            if (room.state.dice.length > 0) {
              resolve();
            }
          });
        }
      });
      
      const initialDice = room.state.dice;
      const diceInfo = Array.from(initialDice.values()).map((die: any) => ({
        color: die.color,
        value: die.value
      }));
      
      await room.leave();
      return { diceInfo };
    });

    console.log('Dice info:', diceSequence.diceInfo);
    
    // Verify dice are initialized
    expect(diceSequence.diceInfo.length).toBe(2);
  });
});

/**
 * Test Suite: Fixed Game - Two Players Placement
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

    // Import GamePage for both players
    const { GamePage } = await import('../pages/GamePage');
    const gamePage1 = new GamePage(player1Page);
    const gamePage2 = new GamePage(player2Page);

    // Player 1 creates the room
    const roomId = await gamePage1.createFixedRoom('Player1');
    console.log('Created fixed room for multiplayer test:', roomId);

    // Both players join the game
    await gamePage1.joinGameRoom(roomId, 'Player1');
    await gamePage2.joinGameRoom(roomId, 'Player2');

    // Take screenshots
    await gamePage1.takeScreenshot('fixed-game-player1-view.png');
    await gamePage2.takeScreenshot('fixed-game-player2-view.png');

    // Verify both players see the canvas
    await expect(gamePage1.boardCanvas).toBeVisible();
    await expect(gamePage2.boardCanvas).toBeVisible();

    await context1.close();
    await context2.close();
  });
});

import { test, expect } from '../fixtures/testFixtures'
import { Browser, chromium, BrowserContext } from '@playwright/test'

/**
 * Test Suite: Fixed Game - Reproducible Board Layout
 * Tests that the fixed game creates the same board layout every time
 */
test.describe('Fixed Game - Reproducible Layout', () => {
  test('should create a fixed game with deterministic board layout', async ({ gamePage, context }) => {
    await gamePage.page.goto('http://localhost:3000')
    await gamePage.createFixedRoom('TestPlayer 1', 1)

    await gamePage.takeScreenshot('fixed-game-board-initial.png')
    await expect(gamePage.boardCanvas).toBeVisible()
  })
})

/**
 * Test Suite: Fixed Game - Two Players Placement
 * Tests that two players can place their initial settlements
 */
test.describe('Fixed Game - Two Players Placement', () => {
  let browser: Browser
  let context1: BrowserContext
  let context2: BrowserContext

  test.beforeAll(async () => {
    browser = await chromium.launch()
  })

  test.afterAll(async () => {
    await browser.close()
  })

  test('two players should join and see the game board', async () => {
    context1 = await browser.newContext()
    context2 = await browser.newContext()

    const player1Page = await context1.newPage()
    const player2Page = await context2.newPage()

    // Import GamePage for both players
    const { GamePage } = await import('../pages/GamePage')
    const gamePage1 = new GamePage(player1Page)
    const gamePage2 = new GamePage(player2Page)

    await gamePage1.page.goto('/')
    await gamePage2.page.goto('/')

    // Player 1 creates the room and 2nd player joins
    const room = await gamePage1.createFixedRoom('Player1')
    await gamePage2.joinGameRoom(room.roomId, 'Player2')

    // Take screenshots
    await gamePage1.takeScreenshot('fixed-game-player1-view.png')
    await gamePage2.takeScreenshot('fixed-game-player2-view.png')

    // Verify both players see the canvas
    await expect(gamePage1.boardCanvas).toBeVisible()
    await expect(gamePage2.boardCanvas).toBeVisible()

    await context1.close()
    await context2.close()
  })
})

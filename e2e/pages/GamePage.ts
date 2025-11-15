import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import * as Colyseus from 'colyseus.js'

/**
 * Page Object Model for the Game page.
 * Encapsulates all interactions and assertions for the game board.
 */
export class GamePage extends BasePage {
  // Locators for page elements
  readonly boardCanvas: Locator
  readonly currentPlayerIndicator: Locator
  readonly rollDiceButton: Locator
  readonly endTurnButton: Locator

  constructor(page: Page) {
    super(page)

    // Define locators - adjusting based on actual implementation
    this.boardCanvas = page.locator('canvas')
    this.currentPlayerIndicator = page.getByText(/Current Player/i)
    this.rollDiceButton = page.getByRole('button', { name: /Roll Dice/i })
    this.endTurnButton = page.getByRole('button', { name: /End Turn/i })
  }

  /**
   * Navigate to a specific game room
   * @param roomId - The room ID to join
   * @param playerName - The player name
   */
  async navigate(roomId: string, playerName: string = 'TestPlayer') {
    await this.goto(`/#/game/${roomId}?name=${playerName}`)
    await this.waitForLoad()
  }

  /**
   * Check if the game page is loaded correctly
   */
  async isLoaded() {
    // Wait for the canvas to be visible
    await expect(this.boardCanvas).toBeVisible({ timeout: 10000 })
  }

  /**
   * Wait for the game board to be fully rendered
   */
  async waitForBoardLoad() {
    await this.boardCanvas.waitFor({ state: 'visible', timeout: 10000 })
    // // Wait for canvas to be visible and game state to initialize
    // await this.page.waitForTimeout(1000) // Give time for board to render
    // await expect(this.boardCanvas).toBeVisible()
  }

  /**
   * Click on the canvas at specific coordinates
   * @param x - X coordinate
   * @param y - Y coordinate
   */
  async clickOnBoard(x: number, y: number) {
    const canvas = this.boardCanvas
    const box = await canvas.boundingBox()
    if (box) {
      await this.page.mouse.click(box.x + x, box.y + y)
    }
  }

  /**
   * Click on an intersection (for placing settlements)
   * This is a helper that will click at predetermined coordinates
   * based on the fixed board layout.
   *
   * Note: These coordinates are approximate and should ideally be replaced
   * with data attributes or more robust selectors in production tests.
   */
  async clickIntersection(index: number) {
    // These coordinates are approximate and may need adjustment based on actual board layout
    // For a fixed board, we can determine exact positions
    // TODO: Consider adding data-testid attributes to intersection elements for more robust selection
    const intersectionCoords = [
      { x: 300, y: 200 },
      { x: 400, y: 200 },
      { x: 500, y: 200 },
      { x: 350, y: 280 },
      { x: 450, y: 280 }
      // Add more coordinates as needed for testing
    ]

    const coord = intersectionCoords[index] || intersectionCoords[0]
    await this.clickOnBoard(coord.x, coord.y)
  }

  /**
   * Click on an edge (for placing roads)
   *
   * Note: These coordinates are approximate and should ideally be replaced
   * with data attributes or more robust selectors in production tests.
   */
  async clickEdge(index: number) {
    // These coordinates are approximate
    // TODO: Consider adding data-testid attributes to edge elements for more robust selection
    const edgeCoords = [
      { x: 350, y: 240 },
      { x: 450, y: 240 },
      { x: 300, y: 240 }
      // Add more coordinates as needed for testing
    ]

    const coord = edgeCoords[index] || edgeCoords[0]
    await this.clickOnBoard(coord.x, coord.y)
  }

  /**
   * Roll the dice
   */
  async rollDice() {
    if (await this.rollDiceButton.isVisible()) {
      await this.rollDiceButton.click()
    }
  }

  /**
   * End the current turn
   */
  async endTurn() {
    if (await this.endTurnButton.isVisible()) {
      await this.endTurnButton.click()
    }
  }

  /**
   * Get current game state information from the page
   */
  async getCurrentPlayer() {
    // This would need to be adjusted based on actual UI
    return await this.currentPlayerIndicator.textContent()
  }

  /**
   * Wait for a specific game phase
   * @param phase - The phase text to wait for
   */
  async waitForPhase(phase: string) {
    await this.page.waitForSelector(`text=${phase}`, { timeout: 5000 })
  }

  /**
   * Check if an element with specific text is visible
   */
  async hasText(text: string) {
    return await this.page.getByText(text).isVisible()
  }

  /**
   * Create a fixed room and returns the room object
   * Note that the first user is automatically added as a player in the room.
   * @param playerName - The player name
   */
  async createFixedRoom(playerName: string, numPlayers?: number): Promise<Colyseus.Room> {
    const client = new Colyseus.Client('ws://localhost:2567')
    const room = await client.create('fixed', { name: playerName, numPlayers: numPlayers || 2 })

    await room.leave(false)
    await this.joinGameRoom(room.roomId, playerName, room.reconnectionToken)

    return room
  }

  /**
   * Navigate to game room and wait for it to load
   * @param roomId - The room ID
   * @param playerName - The player name
   */
  async joinGameRoom(roomId: string, playerName: string, reconnectionToken?: string) {
    // this will ensure that the correct browser context is used
    await this.page.evaluate((reconnectionToken) => {
      if (reconnectionToken) {
        sessionStorage.setItem('reconnectionToken', reconnectionToken)
      }
    }, reconnectionToken)
    await this.navigate(roomId, playerName)
  }

  /**
   * Take a screenshot of the current page
   * @param filename - The filename for the screenshot
   */
  async takeScreenshot(filename: string) {
    await this.page.screenshot({
      path: `e2e-screenshots/${filename}`,
      fullPage: true
    })
  }
}

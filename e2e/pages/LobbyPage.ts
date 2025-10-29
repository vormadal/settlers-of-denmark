import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Lobby (front) page.
 * Encapsulates all interactions and assertions for the lobby.
 */
export class LobbyPage extends BasePage {
  // Locators for page elements
  readonly pageTitle: Locator;
  readonly playerNameInput: Locator;
  readonly createGameButton: Locator;
  readonly refreshButton: Locator;
  readonly availableGamesSection: Locator;
  readonly noGamesMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Define locators
    this.pageTitle = page.getByRole('heading', { name: /Settlers of Denmark/i });
    this.playerNameInput = page.getByRole('textbox', { name: /Player Name/i });
    this.createGameButton = page.getByRole('button', { name: /Create New Game/i });
    this.refreshButton = page.getByRole('button', { name: /Refresh/i });
    this.availableGamesSection = page.getByText(/Available Games/i);
    this.noGamesMessage = page.getByText(/No games available/i);
  }

  /**
   * Navigate to the lobby page
   */
  async navigate() {
    await this.goto('/');
    await this.waitForLoad();
  }

  /**
   * Check if the lobby page is loaded correctly
   */
  async isLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.playerNameInput).toBeVisible();
    await expect(this.createGameButton).toBeVisible();
    await expect(this.availableGamesSection).toBeVisible();
  }

  /**
   * Enter a player name
   * @param name - The player name to enter
   */
  async enterPlayerName(name: string) {
    await this.playerNameInput.fill(name);
  }

  /**
   * Get the entered player name
   */
  async getPlayerName() {
    return await this.playerNameInput.inputValue();
  }

  /**
   * Click the create game button
   */
  async clickCreateGame() {
    await this.createGameButton.click();
  }

  /**
   * Check if the create game button is enabled
   */
  async isCreateGameButtonEnabled() {
    return await this.createGameButton.isEnabled();
  }

  /**
   * Click the refresh button
   */
  async clickRefresh() {
    await this.refreshButton.click();
  }

  /**
   * Get the list of available games
   * @returns Array of room elements
   */
  async getAvailableGames() {
    // Look for game room cards in the available games section
    const gameCards = this.page.locator('button:has-text("Join Game"), button:has-text("Full")').locator('..');
    return await gameCards.all();
  }

  /**
   * Join a game by its index
   * @param index - Index of the game to join (0-based)
   */
  async joinGameByIndex(index: number) {
    const games = await this.getAvailableGames();
    if (index < games.length) {
      const joinButton = games[index].getByRole('button', { name: /Join Game|Full/i });
      await joinButton.click();
    }
  }

  /**
   * Check if "No games available" message is shown
   */
  async hasNoGamesMessage() {
    return await this.noGamesMessage.isVisible();
  }

  /**
   * Wait for games to load (refresh animation to complete)
   */
  async waitForGamesToLoad() {
    // Wait for loading message to disappear
    const loadingMessage = this.page.getByText(/Loading games/i);
    await expect(loadingMessage).not.toBeVisible({ timeout: 10000 });
  }
}

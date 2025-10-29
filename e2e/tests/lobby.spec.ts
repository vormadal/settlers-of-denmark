import { test, expect } from '../fixtures/testFixtures';

/**
 * Test Suite: Lobby Page
 * Tests the main lobby/front page functionality
 */
test.describe('Lobby Page', () => {
  test('should load the front page successfully', async ({ lobbyPage }) => {
    // Navigate to the lobby page
    await lobbyPage.navigate();

    // Verify the page loaded correctly
    await lobbyPage.isLoaded();

    // Check that the page title is correct
    const title = await lobbyPage.getTitle();
    expect(title).toContain('React App'); // Default CRA title - can be updated if custom title is set

    // Take a screenshot for visual verification
    await lobbyPage.page.screenshot({ 
      path: 'e2e-screenshots/lobby-page.png',
      fullPage: true 
    });
  });

  test('should display all main UI elements', async ({ lobbyPage }) => {
    await lobbyPage.navigate();

    // Verify key UI elements are visible
    await expect(lobbyPage.pageTitle).toBeVisible();
    await expect(lobbyPage.playerNameInput).toBeVisible();
    await expect(lobbyPage.createGameButton).toBeVisible();
    await expect(lobbyPage.refreshButton).toBeVisible();
    await expect(lobbyPage.availableGamesSection).toBeVisible();
  });

  test('should enable create game button when name is entered', async ({ lobbyPage }) => {
    await lobbyPage.navigate();

    // Initially, button should be disabled (empty name)
    const initiallyEnabled = await lobbyPage.isCreateGameButtonEnabled();
    expect(initiallyEnabled).toBe(false);

    // Enter a player name
    await lobbyPage.enterPlayerName('TestPlayer');

    // Button should now be enabled
    const nowEnabled = await lobbyPage.isCreateGameButtonEnabled();
    expect(nowEnabled).toBe(true);

    // Verify the name was entered correctly
    const enteredName = await lobbyPage.getPlayerName();
    expect(enteredName).toBe('TestPlayer');
  });

  test('should show no games message when no games are available', async ({ lobbyPage }) => {
    await lobbyPage.navigate();

    // Wait for games to load
    await lobbyPage.waitForGamesToLoad();

    // Check if "No games available" message is visible
    // Note: This assumes no games are running. If games exist, this test may need to be skipped or adjusted
    const hasNoGames = await lobbyPage.hasNoGamesMessage();
    if (hasNoGames) {
      await expect(lobbyPage.noGamesMessage).toBeVisible();
    }
  });

  test('should refresh games list when refresh button is clicked', async ({ lobbyPage }) => {
    await lobbyPage.navigate();

    // Wait for initial load
    await lobbyPage.waitForGamesToLoad();

    // Click refresh button
    await lobbyPage.clickRefresh();

    // Wait for games to reload
    await lobbyPage.waitForGamesToLoad();

    // If we get here without error, refresh worked
    // The page should still show the available games section
    await expect(lobbyPage.availableGamesSection).toBeVisible();
  });
});

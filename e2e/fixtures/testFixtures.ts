import { test as base } from '@playwright/test';
import { LobbyPage } from '../pages/LobbyPage';

/**
 * Custom test fixtures for Settlers of Denmark E2E tests.
 * Extends Playwright's base test with page objects and utilities.
 */
type CustomFixtures = {
  lobbyPage: LobbyPage;
};

/**
 * Extended test object with custom fixtures.
 * Usage: import { test, expect } from '../fixtures/testFixtures';
 */
export const test = base.extend<CustomFixtures>({
  /**
   * Lobby page fixture - automatically creates LobbyPage instance
   */
  lobbyPage: async ({ page }, use) => {
    const lobbyPage = new LobbyPage(page);
    await use(lobbyPage);
  },
});

// Re-export expect for convenience
export { expect } from '@playwright/test';

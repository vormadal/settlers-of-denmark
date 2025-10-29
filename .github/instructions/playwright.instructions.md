# Copilot Instructions - Playwright E2E Tests

End-to-end testing for Settlers of Denmark using Playwright with TypeScript.

## Architecture
- **Framework**: Playwright with TypeScript
- **Pattern**: Page Object Model (POM) for test organization
- **Location**: Root-level `/e2e` directory (tests both client + server)
- **Config**: `playwright.config.ts` in project root

## Project Structure

### Directory Layout
```
/e2e
├── /pages              # Page Object Models
│   ├── BasePage.ts     # Base class with common functionality
│   └── LobbyPage.ts    # Lobby page interactions
├── /fixtures           # Custom test fixtures
│   └── testFixtures.ts # Extended test object with page objects
└── /tests              # Test specifications
    └── lobby.spec.ts   # Lobby page tests
```

### Key Files
- **playwright.config.ts**: Main Playwright configuration
- **tsconfig.json**: TypeScript configuration for E2E tests
- **.gitignore**: Excludes test artifacts (reports, screenshots, etc.)

## Development Patterns

### Page Object Model (POM)
**Purpose**: Separate test logic from page interactions (Single Responsibility Principle)

**Structure**:
```typescript
// Base class with common functionality
export class BasePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async goto(path: string) { /* ... */ }
  async waitForLoad() { /* ... */ }
}

// Specific page objects extend BasePage
export class LobbyPage extends BasePage {
  // Locators
  readonly pageTitle: Locator;
  readonly playerNameInput: Locator;
  
  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { name: /Settlers/i });
    this.playerNameInput = page.getByRole('textbox', { name: /Player Name/i });
  }
  
  // Actions
  async enterPlayerName(name: string) {
    await this.playerNameInput.fill(name);
  }
  
  // Assertions
  async isLoaded() {
    await expect(this.pageTitle).toBeVisible();
  }
}
```

### Test Fixtures
**Purpose**: Provide reusable setup and utilities for tests

**Pattern**:
```typescript
// fixtures/testFixtures.ts
type CustomFixtures = {
  lobbyPage: LobbyPage;
};

export const test = base.extend<CustomFixtures>({
  lobbyPage: async ({ page }, use) => {
    const lobbyPage = new LobbyPage(page);
    await use(lobbyPage);
  },
});

export { expect } from '@playwright/test';
```

**Usage**:
```typescript
// tests/lobby.spec.ts
import { test, expect } from '../fixtures/testFixtures';

test('should load lobby', async ({ lobbyPage }) => {
  await lobbyPage.navigate();
  await lobbyPage.isLoaded();
});
```

## Writing Tests

### Test Structure
```typescript
test.describe('Feature Name', () => {
  test('should do something specific', async ({ lobbyPage }) => {
    // Arrange - navigate and setup
    await lobbyPage.navigate();
    
    // Act - perform actions
    await lobbyPage.enterPlayerName('TestUser');
    
    // Assert - verify results
    const name = await lobbyPage.getPlayerName();
    expect(name).toBe('TestUser');
  });
});
```

### Best Practices

#### 1. Use Semantic Locators
✅ **Good**: `page.getByRole('button', { name: /Create Game/i })`
✅ **Good**: `page.getByLabel('Player Name')`
❌ **Bad**: `page.locator('#btn-123')` (brittle, implementation-specific)

#### 2. Keep Tests Independent
- Each test should run independently
- Don't rely on test execution order
- Clean up state if necessary

#### 3. Use Page Objects for All Interactions
✅ **Good**: `await lobbyPage.enterPlayerName('Test')`
❌ **Bad**: `await page.fill('input[name="name"]', 'Test')` (in test file)

#### 4. Descriptive Test Names
✅ **Good**: `'should enable create game button when name is entered'`
❌ **Bad**: `'test button'`

#### 5. Take Screenshots for Debugging
```typescript
await lobbyPage.page.screenshot({ 
  path: 'e2e-screenshots/feature-name.png',
  fullPage: true 
});
```

## Running Tests

### Commands
```bash
# Run all tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Debug a specific test
npm run test:e2e:debug

# Show test report
npm run test:e2e:report
```

### Configuration
The `playwright.config.ts` automatically:
- Starts the server (`sod-server` on port 2567)
- Starts the client (`sod-client` on port 3000)
- Runs tests against `http://localhost:3000`
- Cleans up after tests complete

### CI/CD Considerations
- Tests run sequentially in CI (`workers: 1`)
- Retry failed tests 2 times in CI
- Use `forbidOnly` to prevent accidental `test.only` in CI

## Adding New Tests

### 1. Create Page Object (if needed)
```typescript
// e2e/pages/GamePage.ts
export class GamePage extends BasePage {
  readonly boardCanvas: Locator;
  
  constructor(page: Page) {
    super(page);
    this.boardCanvas = page.locator('canvas');
  }
  
  async rollDice() {
    await this.page.getByRole('button', { name: /Roll Dice/i }).click();
  }
}
```

### 2. Add to Fixtures (if needed)
```typescript
// e2e/fixtures/testFixtures.ts
type CustomFixtures = {
  lobbyPage: LobbyPage;
  gamePage: GamePage; // Add new page
};

export const test = base.extend<CustomFixtures>({
  lobbyPage: async ({ page }, use) => { /* ... */ },
  gamePage: async ({ page }, use) => {
    const gamePage = new GamePage(page);
    await use(gamePage);
  },
});
```

### 3. Write Tests
```typescript
// e2e/tests/game.spec.ts
import { test, expect } from '../fixtures/testFixtures';

test.describe('Game Page', () => {
  test('should roll dice', async ({ gamePage }) => {
    await gamePage.navigate('/game/test-room');
    await gamePage.rollDice();
    // Add assertions
  });
});
```

## Common Patterns

### Waiting for Elements
```typescript
// Wait for visibility
await expect(this.element).toBeVisible();

// Wait for text content
await expect(this.element).toContainText('Expected Text');

// Custom wait
await this.page.waitForLoadState('networkidle');
```

### Handling Async Operations
```typescript
// Wait for navigation
await Promise.all([
  this.page.waitForNavigation(),
  this.createGameButton.click()
]);

// Wait for API call
await this.page.waitForResponse(resp => 
  resp.url().includes('/api/rooms') && resp.status() === 200
);
```

### Working with Multiple Elements
```typescript
async getAvailableGames() {
  const gameCards = this.page.locator('.game-card');
  return await gameCards.all();
}
```

## Debugging

### Visual Debugging
- Use `npm run test:e2e:ui` for interactive debugging
- Use `await page.pause()` to pause execution
- Take screenshots at key points for troubleshooting

### Logs and Traces
- Check `playwright-report/` for HTML reports
- Use `trace: 'on-first-retry'` (already configured)
- View traces with `npx playwright show-trace trace.zip`

### Common Issues
1. **Element not found**: Verify locator with Playwright Inspector
2. **Timeout**: Increase timeout or use proper wait conditions
3. **Flaky tests**: Add explicit waits, check for race conditions

## Do / Don't

### Do
- **Use Page Objects**: Encapsulate all page interactions
- **Semantic Locators**: Use `getByRole`, `getByLabel`, `getByText`
- **Independent Tests**: Each test should be self-contained
- **Descriptive Names**: Test names should explain what they verify
- **Wait Properly**: Use `expect` with auto-waiting, not `sleep()`
- **Screenshot Failures**: Helpful for debugging (auto-configured)

### Don't
- **Hard-code Selectors**: Use semantic locators instead of CSS/XPath
- **Put Logic in Tests**: Business logic belongs in Page Objects
- **Use sleep()**: Use Playwright's auto-waiting mechanisms
- **Test Implementation**: Test behavior, not implementation details
- **Share State**: Tests should not depend on each other
- **Ignore Flakiness**: Fix flaky tests immediately

## Integration with Project

### Server + Client Lifecycle
- Playwright config automatically starts both server and client
- Tests wait for both to be ready before running
- Automatically cleans up after test run

### TypeScript Configuration
- Uses root-level `tsconfig.json` for E2E tests
- Includes Playwright types automatically
- Consistent with project's TypeScript patterns

### CI/CD Ready
- Configuration optimized for CI environments
- Artifacts (screenshots, videos, traces) saved on failure
- Parallel execution disabled in CI for stability

## Key Files Reference
- **Config**: `playwright.config.ts`
- **Base Page**: `e2e/pages/BasePage.ts`
- **Fixtures**: `e2e/fixtures/testFixtures.ts`
- **Tests**: `e2e/tests/*.spec.ts`
- **TypeScript**: `tsconfig.json`

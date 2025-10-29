# Playwright E2E Testing Architecture

## Overview

This document provides a visual overview of the Playwright E2E testing setup for Settlers of Denmark.

## Test Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Playwright Test Runner                   │
│                    (playwright.config.ts)                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─── Starts Server (localhost:2567)
                 │    └─── sod-server (Colyseus)
                 │
                 ├─── Starts Client (localhost:3000)
                 │    └─── sod-client (React)
                 │
                 └─── Runs Tests
                      │
                      v
          ┌───────────────────────┐
          │   Test Fixtures       │
          │ (testFixtures.ts)     │
          │                       │
          │ - Provides page       │
          │   objects to tests    │
          │ - Manages setup       │
          └───────┬───────────────┘
                  │
                  v
          ┌───────────────────────┐
          │   Page Objects        │
          │   (Page Object Model) │
          │                       │
          │ ┌─────────────────┐   │
          │ │  BasePage       │   │
          │ │  - Common logic │   │
          │ └────────┬────────┘   │
          │          │             │
          │ ┌────────v────────┐   │
          │ │  LobbyPage      │   │
          │ │  - Locators     │   │
          │ │  - Actions      │   │
          │ │  - Assertions   │   │
          │ └─────────────────┘   │
          └───────┬───────────────┘
                  │
                  v
          ┌───────────────────────┐
          │   Test Specs          │
          │ (*.spec.ts)           │
          │                       │
          │ - Load front page     │
          │ - Display UI elements │
          │ - Enable/disable btns │
          │ - Refresh games       │
          │ - etc.                │
          └───────────────────────┘
```

## Test Execution Flow

```
1. Test Start
   ↓
2. Playwright reads config (playwright.config.ts)
   ↓
3. Start server on port 2567
   ↓
4. Start client on port 3000
   ↓
5. Wait for both to be ready
   ↓
6. Initialize test fixtures
   ↓
7. Create page objects (LobbyPage, etc.)
   ↓
8. Execute test cases
   ↓
9. Collect results, screenshots, traces
   ↓
10. Shutdown server and client
   ↓
11. Generate test report
```

## Page Object Model Pattern

### Separation of Concerns

```
┌─────────────────────────────────────────────────────┐
│                   Test Layer                        │
│  (tests/*.spec.ts)                                  │
│                                                     │
│  - Business logic                                   │
│  - Test scenarios                                   │
│  - Assertions                                       │
│  - No direct page interaction                       │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ Uses
                       ↓
┌─────────────────────────────────────────────────────┐
│              Page Object Layer                      │
│  (pages/*.ts)                                       │
│                                                     │
│  - Element locators                                 │
│  - Page interactions                                │
│  - Reusable actions                                 │
│  - No test logic                                    │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ Interacts with
                       ↓
┌─────────────────────────────────────────────────────┐
│                Application Under Test                │
│  (Browser)                                          │
│                                                     │
│  - Server: localhost:2567                           │
│  - Client: localhost:3000                           │
└─────────────────────────────────────────────────────┘
```

## Example: Adding a New Test

```
Step 1: Create Page Object
┌────────────────────────────────┐
│  e2e/pages/GamePage.ts         │
│                                │
│  export class GamePage         │
│    extends BasePage {          │
│                                │
│    readonly diceButton         │
│    readonly boardCanvas        │
│                                │
│    async rollDice() { ... }    │
│  }                             │
└────────────────────────────────┘

Step 2: Add to Fixtures
┌────────────────────────────────┐
│  e2e/fixtures/testFixtures.ts  │
│                                │
│  type CustomFixtures = {       │
│    lobbyPage: LobbyPage        │
│    gamePage: GamePage ← NEW    │
│  }                             │
│                                │
│  export const test =           │
│    base.extend<...>({ ... })   │
└────────────────────────────────┘

Step 3: Write Tests
┌────────────────────────────────┐
│  e2e/tests/game.spec.ts        │
│                                │
│  test('should roll dice',      │
│    async ({ gamePage }) => {   │
│      await gamePage.navigate() │
│      await gamePage.rollDice() │
│      // assertions              │
│    })                          │
└────────────────────────────────┘
```

## Directory Structure

```
settlers-of-denmark/
├── sod-server/              # Colyseus server
├── sod-client/              # React client
├── e2e/                     # E2E tests (NEW)
│   ├── pages/               # Page Objects
│   │   ├── BasePage.ts      # Base class
│   │   └── LobbyPage.ts     # Lobby page
│   ├── fixtures/            # Test fixtures
│   │   └── testFixtures.ts  # Custom fixtures
│   └── tests/               # Test specs
│       └── lobby.spec.ts    # Lobby tests
├── playwright.config.ts     # Playwright config
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies + scripts
└── .github/
    ├── instructions/
    │   └── playwright.instructions.md
    └── workflows/
        └── e2e-tests.yml    # CI workflow
```

## Benefits of This Architecture

1. **Separation of Concerns**
   - Tests focus on business logic
   - Page objects handle UI interactions
   - Single Responsibility Principle

2. **Maintainability**
   - UI changes only affect page objects
   - Tests remain stable
   - Easy to update locators

3. **Reusability**
   - Page objects shared across tests
   - Fixtures provide common setup
   - Consistent patterns

4. **Readability**
   - Tests read like user stories
   - Clear intent
   - Self-documenting

5. **CI/CD Ready**
   - Automatic server/client startup
   - Artifact collection on failure
   - Parallel execution support

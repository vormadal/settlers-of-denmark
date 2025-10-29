# Playwright E2E Tests - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies (First Time Only)

```bash
# Install Playwright and dependencies (from root)
npm install

# Install Playwright browsers
npx playwright install chromium

# Verify setup
npm run validate:setup
```

### 2. Run Your First Test

```bash
# Make sure you're in the project root
cd /path/to/settlers-of-denmark

# Run all tests
npm run test:e2e
```

That's it! Playwright will automatically:
- Start the server on port 2567
- Start the client on port 3000
- Run all tests
- Generate a report
- Clean up everything when done

## 🎯 Common Commands

```bash
# Validate setup (no browser required)
npm run validate:setup

# Run tests (headless)
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Debug a specific test
npm run test:e2e:debug

# View last test report
npm run test:e2e:report
```

## 📝 Writing Your First Test

### Step 1: Create a Page Object

```typescript
// e2e/pages/MyNewPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyNewPage extends BasePage {
  readonly myButton: Locator;

  constructor(page: Page) {
    super(page);
    this.myButton = page.getByRole('button', { name: /Click Me/i });
  }

  async clickMyButton() {
    await this.myButton.click();
  }
}
```

### Step 2: Add to Fixtures

```typescript
// e2e/fixtures/testFixtures.ts
import { MyNewPage } from '../pages/MyNewPage';

type CustomFixtures = {
  lobbyPage: LobbyPage;
  myNewPage: MyNewPage; // Add this
};

export const test = base.extend<CustomFixtures>({
  lobbyPage: async ({ page }, use) => {
    const lobbyPage = new LobbyPage(page);
    await use(lobbyPage);
  },
  myNewPage: async ({ page }, use) => {
    const myNewPage = new MyNewPage(page);
    await use(myNewPage);
  },
});
```

### Step 3: Write the Test

```typescript
// e2e/tests/my-feature.spec.ts
import { test, expect } from '../fixtures/testFixtures';

test.describe('My Feature', () => {
  test('should do something', async ({ myNewPage }) => {
    await myNewPage.navigate();
    await myNewPage.clickMyButton();
    // Add your assertions
    await expect(myNewPage.myButton).toBeVisible();
  });
});
```

### Step 4: Run Your Test

```bash
npm run test:e2e
```

## 🔍 Best Practices Checklist

- ✅ Use semantic locators: `getByRole`, `getByLabel`, `getByText`
- ✅ Keep tests independent (don't rely on execution order)
- ✅ Put UI interactions in Page Objects, not in tests
- ✅ Use descriptive test names that explain what's being tested
- ✅ Use Playwright's auto-waiting (avoid `sleep()`)
- ✅ Take screenshots for visual verification when needed

## 🐛 Debugging Tips

### Visual Debugging
```bash
# Run with UI mode (pause, step through, inspect)
npm run test:e2e:ui

# Run with debugger
npm run test:e2e:debug
```

### Add Pause Points
```typescript
test('my test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Pauses execution here
  // Continue testing...
});
```

### Take Screenshots
```typescript
await page.screenshot({ path: 'debug-screenshot.png' });
```

### View Traces
After a failed test, view the trace:
```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

## 📊 Understanding Test Results

### Success ✅
```
✓ tests/lobby.spec.ts:10:5 › should load front page (2s)
```

### Failure ❌
```
✗ tests/lobby.spec.ts:10:5 › should load front page (2s)
  - Expected element to be visible
  - Screenshots saved to: test-results/
  - Trace saved to: test-results/.../trace.zip
```

View the report:
```bash
npm run test:e2e:report
```

## 🔧 Troubleshooting

### Problem: Browser not installed
```
Error: Executable doesn't exist
```
**Solution:**
```bash
npx playwright install chromium
```

### Problem: Port already in use
```
Error: Port 3000 is already in use
```
**Solution:** Stop any running server/client instances:
```bash
# Find and kill processes on port 3000
lsof -ti:3000 | xargs kill -9
# Find and kill processes on port 2567
lsof -ti:2567 | xargs kill -9
```

### Problem: Tests timeout
**Solution:** Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60 * 1000, // 60 seconds
```

### Problem: Flaky tests
**Solution:** Add explicit waits:
```typescript
await expect(element).toBeVisible();
await page.waitForLoadState('networkidle');
```

## 📚 Learn More

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Guide](../.github/instructions/playwright.instructions.md)
- [Architecture Overview](../.github/instructions/playwright-architecture.md)
- [Project Copilot Instructions](../.github/copilot-instructions.md)

## 💡 Pro Tips

1. **Use `test:e2e:ui` for development** - It's interactive and shows you exactly what's happening

2. **Validate setup first** - Run `npm run validate:setup` to ensure everything is configured correctly

3. **Keep tests focused** - One test should verify one thing

4. **Use fixtures** - They provide clean, reusable setup for your tests

5. **Follow the Page Object Model** - It makes tests maintainable and readable

## 🎉 You're Ready!

You now have everything you need to write effective E2E tests. Start by running the existing tests to see them in action:

```bash
npm run test:e2e:ui
```

Happy testing! 🚀

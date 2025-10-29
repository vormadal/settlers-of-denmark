# Settlers of Denmark

A multiplayer board game built with Colyseus server and React client.

## Project Structure

- **sod-server**: Colyseus multiplayer game server (TypeScript, Colyseus, XState)
- **sod-client**: React web client (React, MUI, Konva)
- **e2e**: End-to-end tests (Playwright)

## Getting Started

### Prerequisites

- Node.js >= 16.13.0
- npm

### Installation

1. Install server dependencies:
```bash
cd sod-server
npm install
```

2. Install client dependencies:
```bash
cd sod-client
npm install
```

3. Install Playwright for E2E tests (root level):
```bash
npm install
npx playwright install chromium
```

### Running the Application

#### Development Mode

Start the server:
```bash
cd sod-server
npm start
```
Server runs on `http://localhost:2567`

Start the client (in a new terminal):
```bash
cd sod-client
npm start
```
Client runs on `http://localhost:3000`

## Testing

### Server Unit Tests
```bash
cd sod-server
npm test
```

### Client Tests
```bash
cd sod-client
npm test
```

### End-to-End Tests (Playwright)

The E2E tests automatically start both server and client.

Validate the test setup:
```bash
npm run validate:setup
```

Run all E2E tests:
```bash
npm run test:e2e
```

Run tests in interactive UI mode:
```bash
npm run test:e2e:ui
```

Debug tests:
```bash
npm run test:e2e:debug
```

View test report:
```bash
npm run test:e2e:report
```

## Documentation

See `.github/instructions/` for detailed development guidelines:
- [Server Instructions](.github/instructions/server.instructions.md)
- [Client Instructions](.github/instructions/client.instructions.md)
- [Playwright E2E Tests](.github/instructions/playwright.instructions.md)

## License

UNLICENSED

# Copilot Instructions for Settlers of Denmark

Monorepo with multiplayer game using Colyseus server and React client.

## Project Structure
- **sod-server**: Colyseus multiplayer server → See [server.instructions.md](.github/instructions/server.instructions.md)
- **sod-client**: React client app → See [client.instructions.md](.github/instructions/client.instructions.md)

## Cross-App Integration

### Event Synchronization
- **Critical**: Server event strings must match client calls exactly
- **Events**: `'PLACE_SETTLEMENT'`, `'PLACE_ROAD'`, `'ROLL_DICE'`, `'END_TURN'`, `'BUY_CITY'`, `'BANK_TRADE'`
- **Pattern**: Client sends `room.send(eventType, payload)` → Server processes via state machine

### Schema & Type Generation
- **Source**: Server schema in `sod-server/src/rooms/schema/*`
- **Generate**: Run `npm run schema-codegen` from `sod-server` after schema changes
- **Output**: Client types in `sod-client/src/state/*` (auto-generated, do not edit)
- **Commit**: Always commit generated client types with schema changes

### Connection & Port
- **Development**: `ws://localhost:2567`
- **Production**: `wss://<host>`
- **Client**: Automatically selects based on environment

## Development Workflow

### Adding New Game Feature
1. **Server**: Define command, event, action, state machine transition
2. **Generate**: Run schema codegen if state changes
3. **Client**: Add UI components using generated types
4. **Sync**: Ensure event strings match between client and server
5. **Test**: Server tests with Mocha, manual client testing

### Schema Changes
1. **Modify**: Server schema files
2. **Generate**: `npm run schema-codegen` (from sod-server)
3. **Commit**: Both schema and generated client types
4. **Update**: Client components using new types

## Global Conventions
- **Language**: TypeScript across both apps
- **Types**: Explicit types for payloads and function signatures
- **Naming**: Consistent patterns (`PascalCase` commands, `camelCase` functions)
- **Validation**: Server validates all rules, client provides immediate feedback

## Cross-App Rules
- **Event Names**: Must match exactly between client sends and server transitions
- **State Sync**: Client subscribes to server state, no duplicate client state
- **Player ID**: Server uses `client.sessionId`, client only overrides for debug
- **Schema**: Server is source of truth, client imports generated types

---
For app-specific instructions, see:
- [Server Instructions](.github/instructions/server.instructions.md) - Colyseus, XState, Commands
- [Client Instructions](.github/instructions/client.instructions.md) - React, MUI, Konva
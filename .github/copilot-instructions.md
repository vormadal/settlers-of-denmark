# Copilot Instructions for this Repository

These guidelines help Copilot generate code that fits this project. Prefer patterns and names from this file. If you add new patterns, update this file.

## Overview
- Monorepo with two apps:
  - sod-server: Colyseus (0.15) multiplayer server in TypeScript, using @colyseus/command (Command pattern) and XState (state machine) to drive game flow.
  - sod-client: React 18 (CRA), MUI v6, Konva; connects to the server via colyseus.js. Client state types are generated from server schema.
- Port: dev server listens on ws://localhost:2567; client picks ws://localhost:2567 in development, wss://<host> in production.

## Server architecture (sod-server)
- Entry: `src/index.ts` starts Colyseus tools and listens on port 2567.
- Room: `src/rooms/MyRoom.ts` sets up `GameState`, hex map, deck, players, and the XState-based game state machine.
- State machine: `src/stateMachines/BaseGameStateMachine.ts` with actions/guards/events under `src/stateMachines/{actions,guards,events}/base.ts`.
- Commands: `src/commands/base/*.ts` implement server-side mutations. Use `Dispatcher` to run commands from state machine actions.
- Schema: `src/rooms/schema/*` defines Colyseus Schema state shared with client.
- Codegen: `npm run schema-codegen` outputs schema types to `sod-client/src/state`.

### State machine patterns
- Keep events defined in `src/stateMachines/events/base.ts` and referenced by `BaseGameStateMachine` transitions. Ensure event type strings match transitions exactly (e.g., 'PLACE_SETTLEMENT', 'PLACE_ROAD', 'ROLL_DICE', 'END_TURN', 'BUY_CITY').
- Map actions in `src/stateMachines/actions/base.ts` to dispatch commands via `context.dispatcher.dispatch(new SomeCommand(), payload)`.
- Guards belong in `src/stateMachines/guards/base.ts` and are pure functions. Common guards: `isPlayerTurn`, `initialRoundIsComplete`.
- Update `BaseGameStateMachine` when adding new actions/events to keep the flow consistent. Set `reenter: true` when you need to re-run entry/exit of the same state after an action.

### Command patterns
- File naming: `PascalCase` ending with `Command.ts` under `src/commands/base/`.
- Export a class extending `Command<MyRoom, Payload>` and implement `execute(payload: Payload)`. Keep `Payload` minimal and typed.
- Read/modify state through `this.room.state`. Only mutate Schema fields; avoid non-schema mutations.
- Enforce rules in commands: ownership, turn, resource costs, placement validity (use `state.availableIntersections` / `state.availableEdges`), and inventory limits.
- Use helper APIs on schema models when available (e.g., `player.cardsOfType(state, variant)`), and set `card.owner = null` to pay to bank.
- Keep commands side-effect free beyond state changes; no I/O or logs unless necessary.

### Common server tasks for Copilot
- Adding a new buy/place action:
  1) Create `src/commands/base/MyNewThingCommand.ts` with validation and state updates.
  2) Add an event type in `src/stateMachines/events/base.ts`.
  3) Wire an action in `src/stateMachines/actions/base.ts` to dispatch the command.
  4) Add a transition in `BaseGameStateMachine` with `guard: 'isPlayerTurn'` (and others as needed).
  5) If it affects placement options, update `setAvailableIntersections`/`setAvailableEdges` commands.
  6) Add a minimal server test under `sod-server/test` using Mocha and `@colyseus/testing`.

## Client architecture (sod-client)
- Entry: CRA app with React 18. UI uses MUI v6 and Konva to render the board.
- Colyseus client: `src/ColyseusClient.ts` provides a singleton with reconnection handling and room creation/join.
- Shared schema types: located in `src/state` (generated from server). Use those types when subscribing to room state.
- Routing: `react-router-dom` v6.

### Client patterns
- Use the singleton `ColyseusClient` to connect and maintain `room` state, not ad-hoc new `Colyseus.Client` instances.
- When sending messages, match server event type strings exactly. Provide `playerId` only if server expects override (debug mode does this server-side; normal mode uses `client.sessionId`).
- Subscribe to `room.state` changes to drive UI; do not keep duplicated client-side state for schema-backed data.
- Prefer MUI theming and components; keep custom drawing in Konva layers/components under `src/shapes`.

## Code generation and consistency
- After changing server schema (`sod-server/src/rooms/schema/*`), run `npm run schema-codegen` from `sod-server`. Commit the generated files in `sod-client/src/state`.
- Ensure server event names, actions, and commands stay in sync with any client calls and UI affordances.

## Style and tooling
- Language: TypeScript across server and client.
- Prefer explicit types for payloads and function signatures.
- Keep filenames and exports consistent with existing patterns.
- Tests: server uses Mocha (`npm test` in `sod-server`). Add happy-path + 1 edge case when changing core logic.

## Do / Don’t
- Do: reuse dispatcher and existing commands. Validate turn and resource costs before mutations. Update available placements when state changes.
- Do: keep transitions pure; push side-effects to commands.
- Don’t: invent new event or action names without wiring them end-to-end. Don’t mutate non-schema objects in state. Don’t change ports or connection URLs in client outside of the existing dev/prod pattern.

## Useful references in repo
- State machine: `sod-server/src/stateMachines/BaseGameStateMachine.ts`
- Actions: `sod-server/src/stateMachines/actions/base.ts`
- Guards: `sod-server/src/stateMachines/guards/base.ts`
- Events: `sod-server/src/stateMachines/events/base.ts`
- Commands: `sod-server/src/commands/base/*.ts`
- Room: `sod-server/src/rooms/MyRoom.ts`
- Client Colyseus: `sod-client/src/ColyseusClient.ts`
- Generated schema: `sod-client/src/state/*`

---
Notes for maintainers: keep this file short and task-oriented. Update it when adding new states, commands, or message types to keep Copilot aligned.

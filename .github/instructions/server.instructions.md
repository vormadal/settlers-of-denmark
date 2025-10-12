---
applyTo: "sod-server/**"
---

# Copilot Instructions - sod-server

Colyseus multiplayer server for Settlers of Denmark using Command pattern and XState.

## Architecture
- **Colyseus 0.15** multiplayer server in TypeScript
- **Command Pattern**: `@colyseus/command` for state mutations via `Dispatcher`
- **State Machine**: XState for game flow control
- **Schema**: `@colyseus/schema` for synchronized state with client
- **Port**: Listens on 2567 (ws://localhost:2567 in dev)

## Key Patterns

### Room Structure
- **Entry Point**: `src/index.ts` starts Colyseus tools
- **Main Room**: `src/rooms/MyRoom.ts` - game room implementation
- **Room Config**: `src/app.config.ts` - defines room types ("1v1", "4p", "debug")
- **State Schema**: `src/rooms/schema/GameState.ts` - main game state
- **Schema Types**: All types in `src/rooms/schema/*` (sync with client via codegen)

### State Machine (XState)
- **Location**: `src/games/base/BaseGameStateMachine.ts`
- **Actions**: Individual action functions in `src/games/base/actions/*`
- **Guards**: Pure validation functions in `src/games/base/guards/*`
- **Events**: Event type definitions in `src/games/base/events/*`
- **Pattern**: Actions dispatch commands via `context.dispatcher.dispatch(new SomeCommand(), payload)`

### Command Pattern
- **Location**: All commands in `src/games/base/commands/*`
- **Naming**: `PascalCase` ending with `Command.ts`
- **Structure**: Extend `Command<MyRoom, Payload>` with `execute(payload: Payload)` method
- **State Access**: Read/modify via `this.room.state` (only mutate Schema fields)
- **Validation**: Enforce ownership, turn, resources, placement rules

### Schema Design
- **Shared State**: All classes in `src/rooms/schema/*` extend `Schema`
- **Decorators**: Use `@type()` decorators for synchronized fields
- **Helper Methods**: Add non-synced methods for game logic (e.g., `player.cardsOfType()`)
- **Codegen**: Run `npm run schema-codegen` to generate client types

## File Organization

### Core Game Logic
- **Room**: `src/rooms/MyRoom.ts` (room lifecycle, player management)
- **State Machine**: `src/games/base/BaseGameStateMachine.ts` (game flow)
- **Actions**: `src/games/base/actions/*` (state machine action handlers)
- **Commands**: `src/games/base/commands/*` (atomic state mutations)
- **Guards**: `src/games/base/guards/*` (validation functions)
- **Events**: `src/games/base/events/*` (event type definitions)

### Schema & State
- **Game State**: `src/rooms/schema/GameState.ts` (main state container)
- **Entities**: `src/rooms/schema/*` (Player, Card, Hex, etc.)
- **Utils**: `src/utils/*` (helper functions and utilities)

### Algorithms
- **Board Generation**: `src/algorithms/*` (hex layout, dice, factories)
- **Testing**: `test/*` (Mocha test suites)

## Key Components

### MyRoom Class
```typescript
export class MyRoom extends Room<GameState> {
  dispatcher = new Dispatcher(this)
  stateMachine = createBaseGameStateMachine(this.state, this.dispatcher)
  
  onCreate(options: RoomOptions) {
    // Initialize state, players, board, cards
    // Start state machine when enough players join
  }
  
  onJoin(client: Client, options: RoomOptions) {
    // Add player, start game if full
  }
}
```

### Command Pattern
```typescript
export class PlaceSettlementCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    // Validate rules (resources, placement, turn)
    // Mutate state via schema fields
    // Pay resources: card.owner = null
  }
}
```

### State Machine Actions
```typescript
export function placeSettlement({ event, context }: InputType) {
  const e = event as PlaceSettlementEvent
  context.dispatcher.dispatch(new PlaceInitialSettlementCommand(), e.payload)
}
```

### Guards (Validation)
```typescript
export function isPlayerTurn({ context, event }: InputType) {
  return (event as any)?.payload?.playerId === context.gameState.currentPlayer
}
```

## Server Event Handling

### Message Reception
- **Client Events**: Match exact strings ('PLACE_SETTLEMENT', 'PLACE_ROAD', 'ROLL_DICE', 'END_TURN', 'BUY_CITY')
- **Room Registration**: Register message handlers in `MyRoom.ts`
- **State Machine**: Events trigger state machine transitions
- **Player ID**: Use `client.sessionId` for player identification

### Event Flow
1. Client sends `room.send(eventType, payload)`
2. Room receives message and validates
3. State machine processes event with guards
4. Actions dispatch commands for state changes
5. Schema automatically syncs changes to clients

## Common Development Tasks

### Adding New Game Action
1. **Command**: Create `src/games/base/commands/MyNewActionCommand.ts`
   - Extend `Command<MyRoom, Payload>`
   - Validate rules (resources, turn, placement)
   - Mutate schema state only
2. **Event**: Define event type in `src/games/base/events/MyNewActionEvent.ts`
3. **Action**: Create `src/games/base/actions/myNewAction.ts`
   - Import and dispatch command via `context.dispatcher.dispatch()`
4. **State Machine**: Add transition in `BaseGameStateMachine.ts`
   - Include appropriate guards (e.g., `'isPlayerTurn'`)
5. **Update Availability**: Modify placement commands if needed
   - `SetAvailableSettlementIntersectionsCommand`
   - `SetAvailableRoadEdgesCommand`

### Schema Changes
1. **Modify Schema**: Edit files in `src/rooms/schema/*`
2. **Run Codegen**: `npm run schema-codegen` (generates client types)
3. **Update Logic**: Adjust commands/actions using new schema fields
4. **Test**: Verify server tests still pass (`npm test`)

### Adding State Machine State
1. **Define State**: Add to `BaseGameStateMachine.ts` state configuration
2. **Entry/Exit Actions**: Define actions for state lifecycle
3. **Transitions**: Add event-driven transitions with guards
4. **Actions**: Implement action functions in `src/games/base/actions/*`

## Validation Patterns

### Resource Validation
```typescript
const cardsToPayToBank = [
  ...player.cardsOfType(state, CardVariants.Brick).slice(0, 1),
  ...player.cardsOfType(state, CardVariants.Lumber).slice(0, 1),
]
if (cardsToPayToBank.length !== 2) return // Insufficient resources
cardsToPayToBank.forEach(card => card.owner = null) // Pay to bank
```

### Placement Validation
```typescript
// Check available placements
if (!state.availableSettlementIntersections.includes(payload.intersectionId)) {
  return // Invalid placement
}
```

### Turn Validation
```typescript
if (payload.playerId !== state.currentPlayer) {
  return // Not player's turn
}
```

## Testing
- **Framework**: Mocha test suites in `test/*`
- **Pattern**: Test happy path + 1 edge case for core logic
- **Setup**: Use `@colyseus/testing` for room testing
- **Run**: `npm test`

## Do / Don't

### Do
- **Commands**: Validate all rules before state mutations
- **Schema**: Only mutate Schema-decorated fields
- **Resources**: Use `card.owner = null` to pay to bank
- **Placement**: Update available intersections/edges after placement
- **Guards**: Keep validation functions pure
- **Actions**: Dispatch commands via `context.dispatcher.dispatch()`

### Don't
- **State Machine**: Don't put side effects in transitions (use actions)
- **Schema**: Don't mutate non-schema objects in state
- **Events**: Don't invent new event names without end-to-end wiring
- **Commands**: Don't include I/O or logging (keep side-effect free)
- **Validation**: Don't skip resource/turn/placement validation

## Key Files Reference
- **Room**: `src/rooms/MyRoom.ts`
- **State Machine**: `src/games/base/BaseGameStateMachine.ts`
- **Game State**: `src/rooms/schema/GameState.ts`
- **Config**: `src/app.config.ts`
- **Actions**: `src/games/base/actions/index.ts`
- **Commands**: `src/games/base/commands/*`
- **Guards**: `src/games/base/guards/index.ts`
- **Events**: `src/games/base/events/index.ts`

## Debugging
- **Debug Room**: Use "debug" room type for single-player testing
- **Logs**: Add console.log in commands for debugging (remove after)
- **Monitor**: Use `@colyseus/monitor` for room inspection
- **Client State**: Check generated types sync after schema changes
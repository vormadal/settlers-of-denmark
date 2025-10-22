---
applyTo: "sod-client/**"
---

# Copilot Instructions - sod-client

Client-side React app for Settlers of Denmark multiplayer game.

## Architecture
- **React 18** (CRA) with TypeScript
- **UI Framework**: MUI v6 components with custom theme using Quicksand font
- **Board Rendering**: Konva (react-konva) for interactive game board
- **Colyseus Connection**: Connects to ws://localhost:2567 (dev) or wss://<host> (prod)
- **State Types**: Generated from server schema in `src/state/` (DO NOT MODIFY - auto-generated)
- **Routing**: `react-router-dom` v6 with HashRouter

## Key Patterns

### Colyseus Connection
- **Singleton Pattern**: Always use `ColyseusClient.instance` from `src/ColyseusClient.ts`
- **Context**: Access via `useColyseus()` hook from `src/context/ColyseusContext.tsx`
- **Room State**: Access via `useRoom()` hook from `src/context/RoomContext.tsx`
- **Never**: Create new `Colyseus.Client` instances

### State Management
- **Generated Types**: Import from `src/state/*` (auto-generated from server schema)
- **Real-time Updates**: Subscribe to `room.state` changes via custom hooks in `src/hooks/stateHooks.ts`
- **State Hooks Pattern**: Use `useState` + `useEffect` + `room.state.listen()` for reactive state
- **Don't**: Duplicate server schema data in client state

### Server Communication
- **Event Format**: Match server event strings exactly: `'PLACE_SETTLEMENT'`, `'PLACE_ROAD'`, `'ROLL_DICE'`, `'END_TURN'`, `'BUY_CITY'`, `'BANK_TRADE'`
- **Send Pattern**: `room.send(eventType, payload)`
- **Player ID**: Use `client.sessionId` (automatic), only override `playerId` for debug mode

### UI Components

### General UI Principles
- UI components should be simple, without too many details, to highlight the cartoonish and playful nature of the game.
- UI components should not be verbose with information on rules etc. The client should be intuitive and easy to use, with the server handling all game rules and validations.

#### MUI Patterns
- **Theme**: Custom theme with Quicksand font in `src/theme.ts`
- **Colors**: Primary `#FF6B6B`, Secondary `#4ECDC4`
- **Typography**: Custom font weights and sizes for game aesthetics
- **Components**: Prefer MUI v6 components and theming

#### Game Components
- **Modals**: Use `GameModal` component from `src/components/GameModal.tsx` with custom styling
- **Cards**: Consistent card sizing and spacing patterns in `src/components/cards/`
- **Icons**: Custom SVG icons in `src/components/icons/` with drop-shadow effects

#### Konva Board Components
- **Location**: All board shapes in `src/shapes/`
- **Naming**: `*Shape.tsx` files (e.g., `SettlementShape.tsx`, `RoadShape.tsx`)
- **Interaction**: Use Konva event handlers (`onClick`, `onMouseEnter`) for board interactions
- **Colors**: Use `getUniqueColor()` utility for player colors

### Custom Hooks Pattern
```tsx
export function useCustomState() {
  const gameRoom = useRoom()
  const [state, setState] = useState(initialValue)
  
  useEffect(() => {
    if (!gameRoom) return
    gameRoom.state.listen('property', (value) => {
      setState(value)
    })
  }, [gameRoom])
  
  return state
}
```

### Context Providers
- **Structure**: Wrap components with context providers for shared state
- **Player Context**: `PlayerContextProvider` provides current player data
- **Room Context**: `RoomContext` provides Colyseus room instance

## File Organization

### Component Structure
- **Pages**: Top-level route components in `src/pages/`
- **Components**: Reusable UI components in `src/components/`
- **Cards**: Game card components in `src/components/cards/`
- **Icons**: Custom SVG icons in `src/components/icons/`
- **Shapes**: Konva board elements in `src/shapes/`

### State & Utils
- **Generated State**: Schema types in `src/state/` (DO NOT EDIT)
- **Hooks**: Custom state hooks in `src/hooks/stateHooks.ts`
- **Utils**: Game constants and utilities in `src/utils/`
- **Context**: React context providers in `src/context/`

## Common Tasks

### Adding New Server Action UI
1. Import event type string from server patterns
2. Create UI component with MUI styling
3. Send via `room.send(eventType, payload)`
4. Subscribe to state changes for UI updates using custom hooks

### Creating New Board Element
1. Create Konva component in `src/shapes/`
2. Use generated schema types for props
3. Implement interaction handlers for game actions
4. Add to main `Board.tsx` component

### Adding Modal/Dialog
1. Use `GameModal` component for consistent styling
2. Import MUI components for form elements
3. Validate input client-side before sending to server
4. Handle open/close state with hooks

## Do / Don't

### Do
- Use `ColyseusClient.instance` singleton
- Import types from generated `src/state/`
- Subscribe to `room.state` for real-time updates
- Use MUI v6 components and theming
- Follow existing naming conventions (`*Shape.tsx`, `*Icon.tsx`)
- Use custom hooks for state management
- keep shape components pure and focused on rendering and interaction, there should be no game logic in these components and no usage of custom hooks

### Don't
- Create new Colyseus client instances
- Modify files in `src/state/` (auto-generated)
- Keep duplicate client state for server schema data
- Change connection URLs outside dev/prod pattern
- Use inline styles instead of MUI theme system

## Key Files Reference
- **Main App**: `src/App.tsx` (routing and providers)
- **Colyseus Client**: `src/ColyseusClient.ts` (singleton connection)
- **Board**: `src/Board.tsx` (main game board)
- **Lobby**: `src/Lobby.tsx` (room management)
- **Theme**: `src/theme.ts` (MUI customization)
- **State Hooks**: `src/hooks/stateHooks.ts` (reactive state patterns)
- **Generated Types**: `src/state/*` (DO NOT MODIFY)
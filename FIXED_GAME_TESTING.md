# Fixed Game Implementation - Testing Guide

## Overview
This document describes how to manually test the fixed game implementation for reproducible testing.

## What Was Implemented

### 1. Fixed Hex Type Provider (`FixedHexTypeProvider.ts`)
- Assigns hex types in a deterministic, repeatable pattern
- Distribution: 4 forests, 4 fields, 4 pastures, 3 mountains, 3 hills, 1 desert
- Sequence: Forest, Fields, Pastures, Mountains, Hills, Forest, Fields, ...

### 2. Fixed Number Token Provider (`FixedNumberTokenProvider.ts`)
- Assigns number tokens in a fixed sequence
- Values: [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
- Skips desert hexes (no number tokens)

### 3. Fixed Dice Cup (`FixedDiceCup.ts`)
- Rolls dice in a predictable sequence from 2 to 12
- Sequence: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, (repeats)
- Implemented by varying two dice values

### 4. Room Configuration
- Added "fixed" room type to `app.config.ts`
- Added `RoomNames.Fixed` to client enum
- Added `fixed` option to `RoomOptions` interface

## How to Test Manually

### Testing Server-Side (Command Line)

1. **Run the manual test script:**
   ```bash
   cd sod-server
   npx tsx test-fixed-providers.ts
   ```

   This verifies:
   - Fixed hex types are assigned correctly
   - Fixed number tokens are assigned correctly
   - Board layouts are reproducible
   - Dice rolls follow predictable sequence
   - All components produce identical results across multiple runs

### Testing with Debug Room

1. **Start the server:**
   ```bash
   cd sod-server
   npm start
   ```

2. **Start the client:**
   ```bash
   cd sod-client
   npm start
   ```

3. **Open browser to:** `http://localhost:3000`

4. **Access the Colyseus playground:** `http://localhost:2567`
   - Click on "fixed" room type
   - Click "Create Room"
   - Observe the game state in the playground

5. **In the browser console, create a fixed room:**
   ```javascript
   const Colyseus = require('colyseus.js');
   const client = new Colyseus.Client('ws://localhost:2567');
   const room = await client.create('fixed', { name: 'Player1' });
   console.log('Room ID:', room.id);
   
   // Inspect the hex layout
   room.state.hexes.forEach((hex, i) => {
     console.log(`Hex ${i}: type=${hex.type}, value=${hex.value}`);
   });
   
   // Test dice rolling (if in appropriate game phase)
   room.send('ROLL_DICE', {});
   ```

### Testing Reproducibility

1. **Create multiple fixed rooms and compare:**
   ```javascript
   // Create first room
   const room1 = await client.create('fixed', { name: 'Test1' });
   const hexes1 = Array.from(room1.state.hexes.values()).map(h => ({
     type: h.type,
     value: h.value
   }));
   
   // Leave and create second room
   await room1.leave();
   const room2 = await client.create('fixed', { name: 'Test2' });
   const hexes2 = Array.from(room2.state.hexes.values()).map(h => ({
     type: h.type,
     value: h.value
   }));
   
   // Compare
   console.log('Layouts match:', JSON.stringify(hexes1) === JSON.stringify(hexes2));
   ```

### E2E Testing (When Browser Setup Works)

The E2E tests in `e2e/tests/fixed-game.spec.ts` will:
1. Create a fixed game room
2. Verify board layout is deterministic
3. Test two players joining and placing settlements
4. Verify dice rolls are predictable

To run (requires Playwright browsers installed):
```bash
npm run test:e2e -- e2e/tests/fixed-game.spec.ts
```

## Expected Results

### Fixed Hex Types (First 10 Hexes)
1. Forest
2. Fields
3. Pastures
4. Mountains
5. Hills
6. Forest
7. Fields
8. Pastures
9. Mountains
10. Hills

### Fixed Number Tokens (First 10 Non-Desert Hexes)
1. 5
2. 2
3. 6
4. 3
5. 8
6. 10
7. 9
8. 12
9. 11
10. 4

### Fixed Dice Sequence (First 12 Rolls)
1. Roll 1: 2 (1+1)
2. Roll 2: 3 (1+2)
3. Roll 3: 4 (1+3)
4. Roll 4: 5 (1+4)
5. Roll 5: 6 (1+5)
6. Roll 6: 7 (2+5)
7. Roll 7: 8 (2+6)
8. Roll 8: 9 (3+6)
9. Roll 9: 10 (4+6)
10. Roll 10: 11 (5+6)
11. Roll 11: 12 (6+6)
12. Roll 12: 2 (1+1) - sequence repeats

## Verification Checklist

- [x] Fixed hex type provider assigns types deterministically
- [x] Fixed number token provider assigns values deterministically
- [x] Fixed dice cup rolls predictable sequence
- [x] "fixed" room type defined in app.config.ts
- [x] Room option `fixed` controls provider selection
- [x] Multiple fixed rooms produce identical layouts
- [x] Dice sequence repeats correctly after reaching 12
- [x] Manual test script confirms all functionality
- [ ] E2E tests pass (requires Playwright browser setup)

## Notes

- The fixed game is intended for testing and reproducibility only
- Regular game modes (1v1, 4p) still use random providers
- Debug mode is separate and provides different testing capabilities
- Fixed providers ensure every test run encounters the same game conditions

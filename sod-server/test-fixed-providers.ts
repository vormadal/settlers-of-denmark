/**
 * Simple manual test to verify fixed providers work correctly
 * Run with: cd sod-server && npx tsx test-fixed-providers.ts
 */

import { FixedHexTypeProvider } from './src/algorithms/FixedHexTypeProvider'
import { FixedNumberTokenProvider } from './src/algorithms/FixedNumberTokenProvider'
import { FixedDiceCup } from './src/algorithms/FixedDiceCup'
import { GameState } from './src/rooms/schema/GameState'
import { HexFactory } from './src/algorithms/HexFactory'
import { HexLayoutAlgorithm } from './src/algorithms/layout/HexLayoutAlgorithm'

console.log('Testing Fixed Providers...\n')

// Test 1: Fixed Hex Type Provider
console.log('Test 1: Fixed Hex Type Provider')
const state1 = new GameState()
const positions1 = new HexLayoutAlgorithm(3).createLayout()
new HexFactory().createHexMap(state1, positions1)
new FixedHexTypeProvider().assign(state1)

console.log('Hex types (first 10):')
for (let i = 0; i < Math.min(10, state1.hexes.length); i++) {
  console.log(`  Hex ${i}: ${state1.hexes[i].type}`)
}
console.log(`Total hexes: ${state1.hexes.length}\n`)

// Test 2: Fixed Number Token Provider
console.log('Test 2: Fixed Number Token Provider')
const state2 = new GameState()
const positions2 = new HexLayoutAlgorithm(3).createLayout()
new HexFactory().createHexMap(state2, positions2)
new FixedHexTypeProvider().assign(state2)
new FixedNumberTokenProvider().assign(state2)

console.log('Hex values (first 10):')
for (let i = 0; i < Math.min(10, state2.hexes.length); i++) {
  console.log(`  Hex ${i}: type=${state2.hexes[i].type}, value=${state2.hexes[i].value}`)
}
console.log('')

// Test 3: Verify reproducibility
console.log('Test 3: Verify reproducibility (same layout twice)')
const state3a = new GameState()
const positions3a = new HexLayoutAlgorithm(3).createLayout()
new HexFactory().createHexMap(state3a, positions3a)
new FixedHexTypeProvider().assign(state3a)
new FixedNumberTokenProvider().assign(state3a)

const state3b = new GameState()
const positions3b = new HexLayoutAlgorithm(3).createLayout()
new HexFactory().createHexMap(state3b, positions3b)
new FixedHexTypeProvider().assign(state3b)
new FixedNumberTokenProvider().assign(state3b)

let allMatch = true
for (let i = 0; i < state3a.hexes.length; i++) {
  if (state3a.hexes[i].type !== state3b.hexes[i].type || state3a.hexes[i].value !== state3b.hexes[i].value) {
    allMatch = false
    console.log(`  Mismatch at hex ${i}:`)
    console.log(`    First:  type=${state3a.hexes[i].type}, value=${state3a.hexes[i].value}`)
    console.log(`    Second: type=${state3b.hexes[i].type}, value=${state3b.hexes[i].value}`)
  }
}
console.log(`Layouts match: ${allMatch ? '✓ YES' : '✗ NO'}\n`)

// Test 4: Fixed Dice Cup
console.log('Test 4: Fixed Dice Cup')
const state4 = new GameState()
const diceCup = new FixedDiceCup()
diceCup.init(state4)

console.log('Dice rolls (first 15):')
for (let i = 0; i < 15; i++) {
  diceCup.roll()
  const total = state4.dice[0].value + state4.dice[1].value
  console.log(`  Roll ${i + 1}: ${state4.dice[0].value} + ${state4.dice[1].value} = ${total}`)
}
console.log('')

// Test 5: Verify dice reproducibility
console.log('Test 5: Verify dice reproducibility')
const state5a = new GameState()
const diceCup5a = new FixedDiceCup()
diceCup5a.init(state5a)

const state5b = new GameState()
const diceCup5b = new FixedDiceCup()
diceCup5b.init(state5b)

let diceMatch = true
const rolls = 20
for (let i = 0; i < rolls; i++) {
  diceCup5a.roll()
  diceCup5b.roll()
  const total5a = state5a.dice[0].value + state5a.dice[1].value
  const total5b = state5b.dice[0].value + state5b.dice[1].value
  if (total5a !== total5b) {
    diceMatch = false
    console.log(`  Mismatch at roll ${i + 1}: ${total5a} vs ${total5b}`)
  }
}
console.log(`All ${rolls} dice rolls match: ${diceMatch ? '✓ YES' : '✗ NO'}\n`)

console.log('All tests completed!')

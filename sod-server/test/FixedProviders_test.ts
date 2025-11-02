import assert from "assert";
import { FixedHexTypeProvider } from "../src/algorithms/FixedHexTypeProvider";
import { FixedNumberTokenProvider } from "../src/algorithms/FixedNumberTokenProvider";
import { FixedDiceCup } from "../src/algorithms/FixedDiceCup";
import { GameState } from "../src/rooms/schema/GameState";
import { HexFactory } from "../src/algorithms/HexFactory";
import { HexLayoutAlgorithm } from "../src/algorithms/layout/HexLayoutAlgorithm";
import { HexTypes } from "../src/rooms/schema/Hex";

describe("Fixed Providers for Reproducible Testing", () => {
  
  describe("FixedHexTypeProvider", () => {
    it("should assign hex types in a fixed pattern", () => {
      const state = new GameState();
      const positions = new HexLayoutAlgorithm(3).createLayout();
      new HexFactory().createHexMap(state, positions);
      new FixedHexTypeProvider().assign(state);

      // Verify hex types follow the expected pattern
      const expectedPattern = [
        HexTypes.Forest, HexTypes.Fields, HexTypes.Pastures, 
        HexTypes.Mountains, HexTypes.Hills
      ];
      
      for (let i = 0; i < Math.min(5, state.hexes.length); i++) {
        assert.strictEqual(state.hexes[i].type, expectedPattern[i]);
      }
    });

    it("should produce identical layouts across multiple runs", () => {
      const state1 = new GameState();
      const positions1 = new HexLayoutAlgorithm(3).createLayout();
      new HexFactory().createHexMap(state1, positions1);
      new FixedHexTypeProvider().assign(state1);

      const state2 = new GameState();
      const positions2 = new HexLayoutAlgorithm(3).createLayout();
      new HexFactory().createHexMap(state2, positions2);
      new FixedHexTypeProvider().assign(state2);

      assert.strictEqual(state1.hexes.length, state2.hexes.length);
      for (let i = 0; i < state1.hexes.length; i++) {
        assert.strictEqual(state1.hexes[i].type, state2.hexes[i].type);
      }
    });
  });

  describe("FixedNumberTokenProvider", () => {
    it("should assign number tokens in a fixed sequence", () => {
      const state = new GameState();
      const positions = new HexLayoutAlgorithm(3).createLayout();
      new HexFactory().createHexMap(state, positions);
      new FixedHexTypeProvider().assign(state);
      new FixedNumberTokenProvider().assign(state);

      // Verify first few non-desert hexes have expected values
      const expectedValues = [5, 2, 6, 3, 8];
      let nonDesertIndex = 0;
      
      for (let i = 0; i < state.hexes.length && nonDesertIndex < expectedValues.length; i++) {
        if (state.hexes[i].type !== HexTypes.Desert) {
          assert.strictEqual(state.hexes[i].value, expectedValues[nonDesertIndex]);
          nonDesertIndex++;
        }
      }
    });

    it("should produce identical number layouts across multiple runs", () => {
      const state1 = new GameState();
      const positions1 = new HexLayoutAlgorithm(3).createLayout();
      new HexFactory().createHexMap(state1, positions1);
      new FixedHexTypeProvider().assign(state1);
      new FixedNumberTokenProvider().assign(state1);

      const state2 = new GameState();
      const positions2 = new HexLayoutAlgorithm(3).createLayout();
      new HexFactory().createHexMap(state2, positions2);
      new FixedHexTypeProvider().assign(state2);
      new FixedNumberTokenProvider().assign(state2);

      for (let i = 0; i < state1.hexes.length; i++) {
        assert.strictEqual(state1.hexes[i].value, state2.hexes[i].value);
      }
    });
  });

  describe("FixedDiceCup", () => {
    it("should roll dice in a predictable sequence from 2 to 12", () => {
      const state = new GameState();
      const diceCup = new FixedDiceCup();
      diceCup.init(state);

      const expectedTotals = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      
      for (let i = 0; i < expectedTotals.length; i++) {
        diceCup.roll();
        const total = state.dice[0].value + state.dice[1].value;
        assert.strictEqual(total, expectedTotals[i]);
      }
    });

    it("should repeat the sequence after reaching 12", () => {
      const state = new GameState();
      const diceCup = new FixedDiceCup();
      diceCup.init(state);

      // Roll through one complete cycle
      for (let i = 0; i < 11; i++) {
        diceCup.roll();
      }

      // Next roll should be 2 again
      diceCup.roll();
      const total = state.dice[0].value + state.dice[1].value;
      assert.strictEqual(total, 2);
    });

    it("should produce identical dice sequences across multiple instances", () => {
      const state1 = new GameState();
      const diceCup1 = new FixedDiceCup();
      diceCup1.init(state1);

      const state2 = new GameState();
      const diceCup2 = new FixedDiceCup();
      diceCup2.init(state2);

      for (let i = 0; i < 20; i++) {
        diceCup1.roll();
        diceCup2.roll();
        const total1 = state1.dice[0].value + state1.dice[1].value;
        const total2 = state2.dice[0].value + state2.dice[1].value;
        assert.strictEqual(total1, total2);
      }
    });
  });
});

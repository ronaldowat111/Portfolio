import { GameState } from "../game/GameState";

describe("GameState", () => {
  let state: GameState;
  beforeEach(() => { state = new GameState(); });

  test("initializes with default values", () => {
    expect(state.score).toBe(0);
    expect(state.lives).toBe(3);
    expect(state.coins).toBe(0);
    expect(state.jumps).toBe(0);
    expect(state.blockHits).toBe(0);
  });

  test("addScore accumulates", () => {
    state.addScore(100);
    state.addScore(250);
    expect(state.score).toBe(350);
  });

  test("addCoin increments coins and adds 200 to score", () => {
    state.addCoin();
    state.addCoin();
    expect(state.coins).toBe(2);
    expect(state.score).toBe(400);
  });

  test("addJump increments jump counter", () => {
    state.addJump();
    state.addJump();
    expect(state.jumps).toBe(2);
  });

  test("addBlockHit increments blockHits and adds 200 to score", () => {
    state.addBlockHit();
    expect(state.blockHits).toBe(1);
    expect(state.score).toBe(200);
  });

  test("loseLife decrements lives and returns false while lives remain", () => {
    expect(state.loseLife()).toBe(false);
    expect(state.lives).toBe(2);
  });

  test("loseLife returns true when last life is lost", () => {
    state.loseLife();
    state.loseLife();
    expect(state.loseLife()).toBe(true);
    expect(state.lives).toBe(0);
  });

  test("lives does not go below 0", () => {
    state.loseLife(); state.loseLife(); state.loseLife(); state.loseLife();
    expect(state.lives).toBe(0);
  });

  test("reset restores all fields to defaults", () => {
    state.addCoin(); state.addJump(); state.addBlockHit(); state.loseLife();
    state.reset();
    expect(state.score).toBe(0);
    expect(state.lives).toBe(3);
    expect(state.coins).toBe(0);
    expect(state.jumps).toBe(0);
    expect(state.blockHits).toBe(0);
  });
});

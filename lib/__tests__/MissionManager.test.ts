import { MissionManager } from "../game/MissionManager";
import { GameState } from "../game/GameState";

describe("MissionManager", () => {
  let manager: MissionManager;
  let state: GameState;

  beforeEach(() => {
    manager = new MissionManager();
    state = new GameState();
  });

  test("no sections unlocked on init", () => {
    expect(manager.isUnlocked("about")).toBe(false);
    expect(manager.isUnlocked("projects")).toBe(false);
    expect(manager.isUnlocked("skills")).toBe(false);
    expect(manager.isUnlocked("contact")).toBe(false);
  });

  test("update returns empty array when no missions complete", () => {
    expect(manager.update(state)).toEqual([]);
  });

  test("unlocks 'about' when 10 coins collected", () => {
    for (let i = 0; i < 10; i++) state.addCoin();
    const unlocked = manager.update(state);
    expect(unlocked).toContain("about");
    expect(manager.isUnlocked("about")).toBe(true);
  });

  test("unlocks 'projects' when 4 blocks hit", () => {
    for (let i = 0; i < 4; i++) state.addBlockHit();
    const unlocked = manager.update(state);
    expect(unlocked).toContain("projects");
  });

  test("unlocks 'skills' when 15 jumps made", () => {
    for (let i = 0; i < 15; i++) state.addJump();
    const unlocked = manager.update(state);
    expect(unlocked).toContain("skills");
  });

  test("unlocks 'contact' when score reaches 3000", () => {
    state.addScore(3000);
    const unlocked = manager.update(state);
    expect(unlocked).toContain("contact");
  });

  test("does not emit unlock twice for same section", () => {
    for (let i = 0; i < 10; i++) state.addCoin();
    manager.update(state);
    const second = manager.update(state);
    expect(second).not.toContain("about");
  });

  test("getProgress returns correct pct and clamped current", () => {
    for (let i = 0; i < 5; i++) state.addCoin();
    const progress = manager.getProgress(state);
    const about = progress.find((p) => p.id === "about")!;
    expect(about.current).toBe(5);
    expect(about.target).toBe(10);
    expect(about.pct).toBe(50);
    expect(about.done).toBe(false);
  });

  test("getProgress clamps current at target", () => {
    for (let i = 0; i < 20; i++) state.addCoin();
    manager.update(state);
    const about = manager.getProgress(state).find((p) => p.id === "about")!;
    expect(about.current).toBe(10);
    expect(about.pct).toBe(100);
    expect(about.done).toBe(true);
  });

  test("unlockAll marks all sections and sets state fields to targets", () => {
    manager.unlockAll(state);
    expect(manager.isUnlocked("about")).toBe(true);
    expect(manager.isUnlocked("projects")).toBe(true);
    expect(manager.isUnlocked("skills")).toBe(true);
    expect(manager.isUnlocked("contact")).toBe(true);
  });
});

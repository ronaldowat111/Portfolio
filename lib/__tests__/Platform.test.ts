import { Platform } from "../game/entities/Platform";
import { Player } from "../game/entities/Player";

describe("Platform", () => {
  describe("brick platform", () => {
    test("initializes with type brick and no coin", () => {
      const p = new Platform(100, 200, 144, "brick");
      expect(p.type).toBe("brick");
      expect(p.has).toBe(false);
    });
  });

  describe("qblock platform", () => {
    test("initializes with coin by default", () => {
      const p = new Platform(100, 200, 48, "qblock");
      expect(p.has).toBe(true);
    });

    test("hitForCoin returns true and depletes coin", () => {
      const p = new Platform(100, 200, 48, "qblock");
      expect(p.hitForCoin()).toBe(true);
      expect(p.has).toBe(false);
    });

    test("hitForCoin returns false when already depleted", () => {
      const p = new Platform(100, 200, 48, "qblock");
      p.hitForCoin();
      expect(p.hitForCoin()).toBe(false);
    });

    test("hitForCoin returns false for brick platform", () => {
      const p = new Platform(100, 200, 144, "brick");
      expect(p.hitForCoin()).toBe(false);
    });
  });

  describe("resolveTopCollision", () => {
    test("lands player on top when approaching from above", () => {
      const plat = new Platform(0, 200, 144, "brick");
      const player = new Player(72, 202);
      player.vy = 5;
      player.onGround = false;
      const prevVy = 5;
      const resolved = plat.resolveTopCollision(player, prevVy);
      expect(resolved).toBe(true);
      expect(player.y).toBe(200);
      expect(player.onGround).toBe(true);
    });

    test("does not resolve when player approaches from below", () => {
      const plat = new Platform(0, 200, 144, "brick");
      const player = new Player(72, 190);
      player.vy = -5;
      const resolved = plat.resolveTopCollision(player, -5);
      expect(resolved).toBe(false);
    });
  });

  describe("resolveBottomCollision", () => {
    test("bounces player down when hitting underside", () => {
      const plat = new Platform(0, 200, 96, "qblock");
      // player.y=295 → head at 247, just inside block bottom (248); prevVy=-5 means was below
      const player = new Player(48, 295);
      player.vy = -5;
      const prevVy = -5;
      const resolved = plat.resolveBottomCollision(player, prevVy);
      expect(resolved).toBe(true);
      expect(player.vy).toBe(2);
    });
  });
});

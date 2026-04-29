import { Particle } from "../game/entities/Particle";

describe("Particle", () => {
  test("initializes with full life", () => {
    const p = new Particle(0, 0, 1, -4, "#FCD000", 5, 600);
    expect(p.life).toBe(600);
    expect(p.alpha).toBe(1);
    expect(p.isDead).toBe(false);
  });

  test("update moves position and applies gravity", () => {
    const p = new Particle(10, 10, 2, -4, "#FCD000", 5, 600);
    p.update(16);
    expect(p.x).toBe(12);
    expect(p.y).toBeCloseTo(6); // y += vy first (10 + -4 = 6), then vy incremented
    expect(p.life).toBe(584);
  });

  test("alpha decreases as life depletes", () => {
    const p = new Particle(0, 0, 0, 0, "#FCD000", 5, 600);
    p.update(300);
    expect(p.alpha).toBeCloseTo(0.5, 1);
  });

  test("isDead when life reaches 0", () => {
    const p = new Particle(0, 0, 0, 0, "#FCD000", 5, 100);
    p.update(200);
    expect(p.isDead).toBe(true);
    expect(p.alpha).toBe(0);
  });
});

import { Vector2 } from "../game/Vector2";

describe("Vector2", () => {
  test("initializes with default zero values", () => {
    const v = new Vector2();
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
  });

  test("add returns new vector with summed components", () => {
    const a = new Vector2(1, 2);
    const b = new Vector2(3, 4);
    const result = a.add(b);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
    expect(a.x).toBe(1); // immutable
  });

  test("sub returns new vector with difference", () => {
    const result = new Vector2(5, 3).sub(new Vector2(2, 1));
    expect(result.x).toBe(3);
    expect(result.y).toBe(2);
  });

  test("scale multiplies both components", () => {
    const result = new Vector2(3, 4).scale(2);
    expect(result.x).toBe(6);
    expect(result.y).toBe(8);
  });

  test("magnitude computes Euclidean length", () => {
    expect(new Vector2(3, 4).magnitude()).toBe(5);
    expect(new Vector2(0, 0).magnitude()).toBe(0);
  });

  test("clone creates independent copy", () => {
    const original = new Vector2(7, 8);
    const copy = original.clone();
    copy.x = 99;
    expect(original.x).toBe(7);
  });
});

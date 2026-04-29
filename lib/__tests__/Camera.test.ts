import { Camera } from "../game/Camera";

describe("Camera", () => {
  let camera: Camera;

  beforeEach(() => { camera = new Camera(); });

  test("initializes at x=0", () => {
    expect(camera.x).toBe(0);
  });

  test("snap immediately positions camera at target", () => {
    camera.snap(600, 1000);
    // target = 600 - 1000*0.35 = 600 - 350 = 250
    expect(camera.x).toBeCloseTo(250);
  });

  test("snap clamps target at 0 when player is near left edge", () => {
    camera.snap(100, 1000);
    // target = 100 - 350 = -250, clamp to 0
    expect(camera.x).toBe(0);
  });

  test("follow eases toward target (x moves toward but not fully there)", () => {
    camera.x = 0;
    camera.follow(600, 1000);
    // target=250, lerp factor=0.08 → x += (250-0)*0.08 = 20
    expect(camera.x).toBeCloseTo(20, 0);
  });

  test("follow does not go below 0", () => {
    camera.x = 0;
    camera.follow(0, 1000);
    expect(camera.x).toBeGreaterThanOrEqual(0);
  });

  test("toScreen converts world x to screen x", () => {
    camera.snap(600, 1000);
    // camera.x ≈ 250
    expect(camera.toScreen(350)).toBeCloseTo(100);
  });
});

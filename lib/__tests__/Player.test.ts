import { Player } from "../game/entities/Player";

describe("Player", () => {
  let player: Player;

  beforeEach(() => { player = new Player(100, 300); });

  test("initializes at given position", () => {
    expect(player.x).toBe(100);
    expect(player.y).toBe(300);
    expect(player.vx).toBe(0);
    expect(player.vy).toBe(0);
  });

  test("jump applies negative vertical velocity when on ground", () => {
    player.onGround = true;
    const jumped = player.jump(-13);
    expect(jumped).toBe(true);
    expect(player.vy).toBe(-13);
    expect(player.onGround).toBe(false);
  });

  test("jump does nothing when not on ground", () => {
    player.onGround = false;
    const jumped = player.jump(-13);
    expect(jumped).toBe(false);
    expect(player.vy).toBe(0);
  });

  test("jump does nothing when dead", () => {
    player.onGround = true;
    player.dead = true;
    expect(player.jump(-13)).toBe(false);
  });

  test("move right sets positive vx and facing 1", () => {
    player.move(1, 5);
    expect(player.vx).toBe(5);
    expect(player.facing).toBe(1);
  });

  test("move left sets negative vx and facing -1", () => {
    player.move(-1, 5);
    expect(player.vx).toBe(-5);
    expect(player.facing).toBe(-1);
  });

  test("move 0 applies friction (vx *= 0.7)", () => {
    player.vx = 10;
    player.move(0, 5);
    expect(player.vx).toBeCloseTo(7);
  });

  test("applyGravity increases vy", () => {
    player.vy = 0;
    player.applyGravity(0.6, 16.67);
    expect(player.vy).toBeCloseTo(0.6);
  });

  test("integrate moves position by velocity", () => {
    player.vx = 3; player.vy = 4;
    player.integrate();
    expect(player.x).toBe(103);
    expect(player.y).toBe(304);
  });

  test("clampLeft prevents going past left boundary", () => {
    player.x = 0;
    player.clampLeft(0);
    expect(player.x).toBe(player.w / 2);
  });

  test("landOnGround stops player and sets onGround", () => {
    player.y = 500; player.vy = 5;
    player.landOnGround(400);
    expect(player.y).toBe(400);
    expect(player.vy).toBe(0);
    expect(player.onGround).toBe(true);
  });

  test("landOnGround does nothing when player is above ground", () => {
    player.y = 200; player.vy = 2;
    player.landOnGround(400);
    expect(player.y).toBe(200);
    expect(player.onGround).toBe(false);
  });

  test("tickInvincible decrements and clamps at 0", () => {
    player.invincible = 100;
    player.tickInvincible(60);
    expect(player.invincible).toBe(40);
    player.tickInvincible(100);
    expect(player.invincible).toBe(0);
  });

  test("isTouchingTop detects feet over platform", () => {
    // player feet at y=300, moving down
    player.y = 305; player.vy = 5;
    // platform top at y=300, width=100 at x=60
    expect(player.isTouchingTop(60, 300, 100)).toBe(true);
  });

  test("isTouchingTop returns false when horizontally clear", () => {
    player.y = 305; player.vy = 5;
    expect(player.isTouchingTop(500, 300, 100)).toBe(false);
  });

  test("isHittingBottom detects head hitting block underside", () => {
    // player head at y - h = 260, moving up (vy < 0)
    player.y = 308; player.vy = -5;
    // block bottom at y+h = 300+48=348, top at y=300
    expect(player.isHittingBottom(60, 300, 96, 48)).toBe(true);
  });
});

export class Player {
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  readonly w = 36;
  readonly h = 48;
  onGround = false;
  facing = 1;          // 1 = right, -1 = left
  invincible = 0;      // ms remaining
  dead = false;

  constructor(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
  }

  /** Returns true if jump was applied. */
  jump(jumpForce = -13): boolean {
    if (!this.onGround || this.dead) return false;
    this.vy = jumpForce;
    this.onGround = false;
    return true;
  }

  move(dir: number, speed: number): void {
    if (dir !== 0) this.facing = dir > 0 ? 1 : -1;
    this.vx = dir === 0 ? this.vx * 0.7 : dir * speed;
  }

  applyGravity(gravity: number, dt: number): void {
    this.vy += gravity * (dt / 16.67);
  }

  integrate(): void {
    this.x += this.vx;
    this.y += this.vy;
  }

  clampLeft(minX: number): void {
    if (this.x < minX + this.w / 2) this.x = minX + this.w / 2;
  }

  landOnGround(groundY: number): void {
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.onGround = true;
    }
  }

  tickInvincible(dt: number): void {
    this.invincible = Math.max(0, this.invincible - dt);
  }

  /** AABB — returns true if this player's feet are above a surface top */
  isTouchingTop(rx: number, ry: number, rw: number): boolean {
    return (
      this.x + this.w / 2 > rx &&
      this.x - this.w / 2 < rx + rw &&
      this.y > ry &&
      this.vy > 0
    );
  }

  /** Returns true if player's head is hitting the bottom of a block */
  isHittingBottom(rx: number, ry: number, rw: number, rh: number): boolean {
    return (
      this.x + this.w / 2 > rx + 4 &&
      this.x - this.w / 2 < rx + rw - 4 &&
      this.y - this.h < ry + rh &&
      this.vy < 0
    );
  }
}

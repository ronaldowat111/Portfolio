export class Camera {
  x = 0;
  private target = 0;

  follow(playerX: number, screenW: number): void {
    this.target = playerX - screenW * 0.35;
    if (this.target < 0) this.target = 0;
    this.x += (this.target - this.x) * 0.08;
  }

  /** Snap immediately (used on resize/init). */
  snap(playerX: number, screenW: number): void {
    this.target = Math.max(0, playerX - screenW * 0.35);
    this.x = this.target;
  }

  toScreen(worldX: number): number {
    return worldX - this.x;
  }
}

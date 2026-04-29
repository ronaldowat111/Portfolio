export class Cloud {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public speed: number
  ) {}

  update(worldWidth: number): void {
    this.x -= this.speed;
    if (this.x < -200) this.x = worldWidth + 200;
  }
}

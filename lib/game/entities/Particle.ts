export class Particle {
  life: number;

  constructor(
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
    public color: string,
    public r: number,
    public maxLife: number = 600
  ) {
    this.life = maxLife;
  }

  update(dt: number): void {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.3;
    this.life -= dt;
  }

  get alpha(): number {
    return Math.max(0, this.life / this.maxLife);
  }

  get isDead(): boolean {
    return this.life <= 0;
  }
}

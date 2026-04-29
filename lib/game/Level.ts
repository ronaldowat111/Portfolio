import { Platform } from "./entities/Platform";
import { Coin } from "./entities/Coin";
import { Pipe } from "./entities/Pipe";
import { Cloud } from "./entities/Cloud";

const TILE = 48;

export class Level {
  platforms: Platform[] = [];
  coins: Coin[] = [];
  pipes: Pipe[] = [];
  clouds: Cloud[] = [];

  build(screenW: number, groundY: number): void {
    this.platforms = this.buildPlatforms(groundY);
    this.coins = this.buildCoins(groundY);
    this.pipes = this.buildPipes();
    if (this.clouds.length === 0) this.clouds = this.buildClouds(screenW);
  }

  private buildPlatforms(groundY: number): Platform[] {
    const B = (x: number, y: number, tiles: number) =>
      new Platform(x, groundY - TILE * y, TILE * tiles, "brick");
    const Q = (x: number, y: number) =>
      new Platform(x, groundY - TILE * y, TILE, "qblock");

    return [
      B(300, 2.5, 3), B(540, 4, 2), B(800, 2.5, 3), B(1060, 4.5, 2),
      B(1260, 3, 4), B(1560, 2, 3), B(1860, 4, 2), B(2100, 3, 3),
      B(2400, 5, 2), B(2660, 3.5, 4), B(2960, 2.5, 3), B(3200, 4, 2),
      B(3500, 3, 4),
      Q(440, 3.5), Q(700, 3.5), Q(950, 5), Q(1180, 3.5),
      Q(1400, 4.5), Q(1700, 3.5), Q(2000, 4), Q(2200, 4.5),
      Q(2800, 4), Q(3100, 5),
    ];
  }

  private buildCoins(groundY: number): Coin[] {
    const xs = [
      100, 150, 200, 350, 370, 390, 570, 590, 830, 860, 890,
      1090, 1120, 1310, 1340, 1370, 1600, 1640, 1900, 1940,
      2140, 2180, 2460, 2500, 2700, 2740, 2780, 3010, 3040,
      3260, 3560, 3590,
    ];
    return xs.map(
      (cx, i) =>
        new Coin(cx, groundY - TILE * (2.5 + (i % 4) * 0.9 + Math.sin(i) * 0.4))
    );
  }

  private buildPipes(): Pipe[] {
    return [
      new Pipe(220, 2), new Pipe(770, 3), new Pipe(1200, 2), new Pipe(1490, 3),
      new Pipe(2010, 2), new Pipe(2360, 3), new Pipe(2790, 2), new Pipe(3060, 3),
      new Pipe(3410, 2), new Pipe(3720, 3),
    ];
  }

  private buildClouds(screenW: number): Cloud[] {
    return Array.from({ length: 22 }, (_, i) =>
      new Cloud(
        80 + i * 210 + Math.random() * 80,
        70 + Math.random() * 120,
        70 + Math.random() * 90,
        0.25 + Math.random() * 0.3
      )
    );
  }
}

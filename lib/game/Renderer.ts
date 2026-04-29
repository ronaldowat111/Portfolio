import { Camera } from "./Camera";
import { Player } from "./entities/Player";
import { Platform } from "./entities/Platform";
import { Coin } from "./entities/Coin";
import { Pipe } from "./entities/Pipe";
import { Cloud } from "./entities/Cloud";
import { Particle } from "./entities/Particle";

const TILE = 48;

export interface RenderConfig {
  showClouds: boolean;
  showCoins: boolean;
  skyColor: string;
}

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
  }

  get width(): number { return this.canvas.width; }
  get height(): number { return this.canvas.height; }

  clear(skyColor: string): void {
    const gr = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gr.addColorStop(0, skyColor);
    gr.addColorStop(1, "#a0c8ff");
    this.ctx.fillStyle = gr;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawGround(camX: number, groundY: number): void {
    const c = this.ctx;
    const offX = -(camX % TILE) - TILE;
    c.fillStyle = "#c84b0f";
    c.fillRect(offX, groundY, this.width + TILE * 2, 80);
    c.fillStyle = "#8B6B14";
    c.fillRect(offX, groundY, this.width + TILE * 2, 10);
    c.fillStyle = "#9a3808";
    for (let bx = offX; bx < this.width + TILE; bx += TILE) {
      for (let by = groundY + 12; by < this.height; by += 24) {
        const off = (Math.floor((by - groundY) / 24) % 2) * (TILE / 2);
        c.fillRect(bx + off + 2, by + 1, TILE - 4, 22);
      }
    }
  }

  drawCloud(cl: Cloud, camX: number): void {
    const sx = cl.x - camX * 0.3;
    if (sx > this.width + 200 || sx < -200) return;
    const ch = cl.w * 0.55;
    const c = this.ctx;
    c.fillStyle = "#FCFCFC";
    c.fillRect(sx, cl.y, cl.w, ch * 0.5);
    c.beginPath();
    c.arc(sx + cl.w * 0.25, cl.y - ch * 0.05, ch * 0.32, Math.PI, 0);
    c.arc(sx + cl.w * 0.55, cl.y - ch * 0.15, ch * 0.4, Math.PI, 0);
    c.arc(sx + cl.w * 0.78, cl.y - ch * 0.05, ch * 0.25, Math.PI, 0);
    c.fill();
  }

  drawPipe(pipe: Pipe, camX: number, groundY: number): void {
    const sx = pipe.x - camX;
    if (sx > this.width + 100 || sx < -100) return;
    const pw = TILE * 1.5, ph = TILE * pipe.heightTiles, py = groundY - ph;
    const c = this.ctx;
    c.fillStyle = "#00A800"; c.fillRect(sx, py, pw, ph);
    c.fillStyle = "#40cc40"; c.fillRect(sx, py, 8, ph);
    c.fillStyle = "#007800"; c.fillRect(sx + pw - 8, py, 8, ph);
    c.fillStyle = "#00A800"; c.fillRect(sx - 6, py - 10, pw + 12, 20);
    c.fillStyle = "#40cc40"; c.fillRect(sx - 6, py - 10, pw + 12, 8);
    c.fillStyle = "#007800"; c.fillRect(sx - 6, py + 4, pw + 12, 6);
  }

  drawPlatform(p: Platform, camX: number): void {
    const sx = p.x - camX;
    if (sx > this.width + 100 || sx + p.w < -100) return;
    const c = this.ctx;
    if (p.type === "qblock") {
      c.fillStyle = p.has ? "#FCA044" : "#888";
      c.fillRect(sx, p.y, TILE, TILE);
      c.fillStyle = p.has ? "#c07020" : "#555";
      c.fillRect(sx + 4, p.y + 4, TILE - 8, TILE - 8);
      c.fillStyle = p.has ? "#ffe090" : "#aaa";
      c.font = "bold 20px monospace";
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText("?", sx + TILE / 2, p.y + TILE / 2 + 1);
      c.textAlign = "left"; c.textBaseline = "alphabetic";
      c.fillStyle = "rgba(255,255,255,0.3)";
      c.fillRect(sx + 6, p.y + 6, TILE - 12, 8);
    } else {
      for (let bx = 0; bx < p.w; bx += TILE) {
        const bw = Math.min(TILE, p.w - bx);
        c.fillStyle = "#c84b0f"; c.fillRect(sx + bx, p.y, bw, TILE);
        c.fillStyle = "#e06020"; c.fillRect(sx + bx, p.y, bw, 6);
        c.fillStyle = "#9a3808"; c.fillRect(sx + bx + 2, p.y + 8, TILE - 4, 14);
        c.fillStyle = "#e06020"; c.fillRect(sx + bx, p.y, 4, TILE);
      }
    }
  }

  drawCoin(coin: Coin, camX: number, t: number): void {
    if (coin.collected) return;
    const sx = coin.x - camX;
    if (sx < -40 || sx > this.width + 40) return;
    const bob = Math.sin(t * 0.003 + coin.x * 0.05) * 4;
    const c = this.ctx;
    c.fillStyle = "#FCD000"; c.fillRect(sx - coin.r, coin.y + bob - coin.r, coin.r * 2, coin.r * 2);
    c.fillStyle = "#c09000"; c.fillRect(sx - coin.r + 4, coin.y + bob - coin.r + 4, coin.r * 2 - 8, coin.r * 2 - 8);
    c.fillStyle = "#ffe060"; c.fillRect(sx - coin.r + 2, coin.y + bob - coin.r + 2, coin.r - 2, coin.r - 2);
  }

  drawPlayer(player: Player, camX: number, t: number): void {
    if (player.invincible > 0 && Math.floor(t / 80) % 2 === 0) return;
    const x = player.x - camX - player.w / 2;
    const y = player.y - player.h;
    const c = this.ctx;
    c.save();
    if (player.facing === -1) { c.translate(x + player.w, 0); c.scale(-1, 1); }
    const dx = player.facing === -1 ? 0 : x;
    const W = player.w;
    c.fillStyle = "#E52521"; c.fillRect(dx + 4, y, W - 8, 10); c.fillRect(dx, y + 4, W, 6);
    c.fillStyle = "#4a2800"; c.fillRect(dx + 4, y + 10, W - 8, 6);
    c.fillStyle = "#FCBCB0"; c.fillRect(dx + 2, y + 14, W - 4, 14);
    c.fillStyle = "#111"; c.fillRect(dx + 16, y + 17, 4, 4);
    c.fillStyle = "#7a4010"; c.fillRect(dx + 8, y + 22, 16, 4);
    c.fillStyle = "#1a6ebd"; c.fillRect(dx + 2, y + 28, W - 4, 12);
    c.fillStyle = "#E52521"; c.fillRect(dx + 6, y + 28, W - 12, 6);
    c.fillStyle = "#ffe"; c.fillRect(dx + 6, y + 30, 3, 3); c.fillRect(dx + W - 9, y + 30, 3, 3);
    c.fillStyle = "#1a6ebd"; c.fillRect(dx + 2, y + 40, W / 2 - 3, 8); c.fillRect(dx + W / 2 + 1, y + 40, W / 2 - 3, 8);
    c.fillStyle = "#3a1800"; c.fillRect(dx, y + 46, W / 2 + 2, 6); c.fillRect(dx + W / 2 - 2, y + 46, W / 2 + 2, 6);
    c.restore();
  }

  drawParticles(particles: Particle[], camX: number): void {
    const c = this.ctx;
    for (const p of particles) {
      c.globalAlpha = p.alpha;
      c.fillStyle = p.color;
      c.fillRect(p.x - camX - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }
    c.globalAlpha = 1;
  }

  render(
    config: RenderConfig,
    camera: Camera,
    groundY: number,
    clouds: Cloud[],
    pipes: Pipe[],
    platforms: Platform[],
    coins: Coin[],
    player: Player,
    particles: Particle[],
    t: number
  ): void {
    this.clear(config.skyColor);
    if (config.showClouds) clouds.forEach((cl) => this.drawCloud(cl, camera.x));
    pipes.forEach((p) => this.drawPipe(p, camera.x, groundY));
    platforms.forEach((p) => this.drawPlatform(p, camera.x));
    this.drawGround(camera.x, groundY);
    if (config.showCoins) coins.forEach((c) => this.drawCoin(c, camera.x, t));
    this.drawParticles(particles, camera.x);
    this.drawPlayer(player, camera.x, t);
  }
}

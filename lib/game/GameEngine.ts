import { Camera } from "./Camera";
import { GameState } from "./GameState";
import { MissionManager, SectionId } from "./MissionManager";
import { InputManager } from "./InputManager";
import { AudioManager } from "./AudioManager";
import { Level } from "./Level";
import { Renderer, RenderConfig } from "./Renderer";
import { Player } from "./entities/Player";
import { Particle } from "./entities/Particle";

const TILE = 48;
const GRAVITY = 0.6;
const MARIO_SPEED = 5;
const JUMP_FORCE = -13;

export interface GameCallbacks {
  onStateUpdate: (state: GameState) => void;
  onSectionUnlocked: (id: SectionId) => void;
}

export class GameEngine {
  readonly state = new GameState();
  readonly missions = new MissionManager();
  readonly camera = new Camera();
  private player: Player;
  private level = new Level();
  private particles: Particle[] = [];
  private renderer: Renderer;
  private input: InputManager;
  private audio = new AudioManager();
  private rafId = 0;
  private lastTime = 0;
  private W = 0;
  private H = 0;
  private groundY = 0;

  config: RenderConfig = {
    showClouds: true,
    showCoins: true,
    skyColor: "#5C94FC",
  };

  constructor(
    private canvas: HTMLCanvasElement,
    private callbacks: GameCallbacks
  ) {
    this.renderer = new Renderer(canvas);
    this.player = new Player(200, 0);
    this.input = new InputManager(this.handleJump.bind(this));
    this.resize();
    this.player.y = this.groundY;
  }

  private handleJump(): void {
    if (this.player.jump(JUMP_FORCE)) {
      this.state.addJump();
      this.audio.playJump();
      this.checkMissions();
    }
  }

  resize(): void {
    this.W = this.canvas.width = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
    this.groundY = this.H - 80;
    this.level.build(this.W, this.groundY);
    this.camera.snap(this.player?.x ?? 200, this.W);
  }

  start(): void {
    this.input.attach();
    window.addEventListener("resize", this.resize.bind(this));
    this.rafId = requestAnimationFrame((ts) => {
      this.lastTime = ts;
      this.rafId = requestAnimationFrame(this.loop.bind(this));
    });
  }

  stop(): void {
    this.input.detach();
    cancelAnimationFrame(this.rafId);
    window.removeEventListener("resize", this.resize.bind(this));
  }

  cheatUnlockAll(): void {
    this.missions.unlockAll(this.state);
    (["about", "projects", "skills", "contact"] as SectionId[]).forEach((id) =>
      this.callbacks.onSectionUnlocked(id)
    );
    this.callbacks.onStateUpdate(this.state);
  }

  private loop(ts: number): void {
    const dt = Math.min(ts - this.lastTime, 50);
    this.lastTime = ts;
    this.update(dt);
    this.renderer.render(
      this.config,
      this.camera,
      this.groundY,
      this.level.clouds,
      this.level.pipes,
      this.level.platforms,
      this.level.coins,
      this.player,
      this.particles,
      ts
    );
    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }

  private update(dt: number): void {
    const p = this.player;
    if (p.dead) return;

    // Input
    const dir = this.input.horizontal;
    p.move(dir, MARIO_SPEED);
    p.applyGravity(GRAVITY, dt);
    p.integrate();
    p.clampLeft(this.camera.x);
    p.landOnGround(this.groundY);
    p.tickInvincible(dt);

    // Platform collisions
    const prevVy = p.vy;
    for (const plat of this.level.platforms) {
      plat.resolveTopCollision(p, prevVy);
      if (plat.resolveBottomCollision(p, prevVy)) {
        if (plat.hitForCoin()) {
          this.spawnCoinFromBlock(plat.x, plat.y);
        }
      }
    }

    // Coin pickup
    for (const coin of this.level.coins) {
      if (coin.checkPickup(p)) {
        this.state.addCoin();
        this.audio.playCoin();
        this.spawnPopup(coin.x, coin.y, "+200");
        this.checkMissions();
      }
    }

    // Camera & clouds
    this.camera.follow(p.x, this.W);
    this.level.clouds.forEach((cl) => cl.update(this.W * 6));

    // Particles
    this.particles = this.particles.filter((pr) => {
      pr.update(dt);
      return !pr.isDead;
    });

    this.callbacks.onStateUpdate(this.state);
  }

  private spawnCoinFromBlock(bx: number, by: number): void {
    this.state.addBlockHit();
    this.audio.playBlock();
    this.spawnPopup(bx + TILE / 2, by, "+200");
    for (let i = 0; i < 6; i++) {
      this.particles.push(
        new Particle(
          bx + TILE / 2, by,
          (Math.random() - 0.5) * 4,
          -Math.random() * 8 - 4,
          "#FCD000", 5
        )
      );
    }
    this.checkMissions();
  }

  private spawnPopup(wx: number, wy: number, txt: string): void {
    // Delegate to DOM via callback; engine stays canvas-only
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;z-index:300;pointer-events:none;font-family:'Press Start 2P',monospace;font-size:8px;color:#FCD000;text-shadow:2px 2px 0 #000;left:${this.camera.toScreen(wx)}px;top:${wy - 20}px;animation:coinPop .8s ease-out forwards`;
    el.textContent = txt;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  private checkMissions(): void {
    const newly = this.missions.update(this.state);
    newly.forEach((id) => {
      this.audio.playUnlock();
      this.callbacks.onSectionUnlocked(id);
    });
  }
}

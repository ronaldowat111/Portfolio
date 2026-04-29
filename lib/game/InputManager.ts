export class InputManager {
  private keys = new Set<string>();
  private _touchDir = 0;
  private _jumpRequested = false;
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;
  private boundTouchStart: (e: TouchEvent) => void;
  private boundTouchMove: (e: TouchEvent) => void;
  private boundTouchEnd: () => void;
  private touchStartX = 0;
  private onJump?: () => void;

  constructor(onJump?: () => void) {
    this.onJump = onJump;
    this.boundKeyDown = this.onKeyDown.bind(this);
    this.boundKeyUp = this.onKeyUp.bind(this);
    this.boundTouchStart = this.onTouchStart.bind(this);
    this.boundTouchMove = this.onTouchMove.bind(this);
    this.boundTouchEnd = this.onTouchEnd.bind(this);
  }

  attach(): void {
    window.addEventListener("keydown", this.boundKeyDown);
    window.addEventListener("keyup", this.boundKeyUp);
    window.addEventListener("touchstart", this.boundTouchStart, { passive: true });
    window.addEventListener("touchmove", this.boundTouchMove, { passive: true });
    window.addEventListener("touchend", this.boundTouchEnd);
  }

  detach(): void {
    window.removeEventListener("keydown", this.boundKeyDown);
    window.removeEventListener("keyup", this.boundKeyUp);
    window.removeEventListener("touchstart", this.boundTouchStart);
    window.removeEventListener("touchmove", this.boundTouchMove);
    window.removeEventListener("touchend", this.boundTouchEnd);
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.keys.add(e.code);
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      this._jumpRequested = true;
      this.onJump?.();
    }
    if (["ArrowLeft", "ArrowRight", "ArrowDown"].includes(e.code)) e.preventDefault();
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.code);
  }

  private onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
    if (e.touches[0].clientY < window.innerHeight * 0.65) {
      this._jumpRequested = true;
      this.onJump?.();
    }
  }

  private onTouchMove(e: TouchEvent): void {
    const dx = e.touches[0].clientX - this.touchStartX;
    this._touchDir = dx < -20 ? -1 : dx > 20 ? 1 : 0;
  }

  private onTouchEnd(): void {
    this._touchDir = 0;
  }

  get horizontal(): number {
    if (this.keys.has("ArrowLeft") || this.keys.has("KeyA")) return -1;
    if (this.keys.has("ArrowRight") || this.keys.has("KeyD")) return 1;
    return this._touchDir;
  }

  consumeJump(): boolean {
    const j = this._jumpRequested;
    this._jumpRequested = false;
    return j;
  }
}

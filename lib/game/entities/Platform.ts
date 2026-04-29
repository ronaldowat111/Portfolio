import { Player } from "./Player";

export type PlatformType = "brick" | "qblock";

export class Platform {
  readonly h = 48; // TILE size
  has: boolean;    // qblock has a coin

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public type: PlatformType = "brick",
    hasCoin = true
  ) {
    this.has = type === "qblock" ? hasCoin : false;
  }

  /** Land-on-top collision. Returns true if player was placed on platform. */
  resolveTopCollision(player: Player, prevVy: number): boolean {
    if (!player.isTouchingTop(this.x, this.y, this.w)) return false;
    // Only resolve if player was above (or at) surface last frame
    if (player.y - prevVy > this.y) return false;
    player.y = this.y;
    player.vy = 0;
    player.onGround = true;
    return true;
  }

  /** Head-bump collision. Returns true if player hit the underside. */
  resolveBottomCollision(player: Player, prevVy: number): boolean {
    if (!player.isHittingBottom(this.x, this.y, this.w, this.h)) return false;
    if (player.y - player.h - prevVy < this.y + this.h) return false;
    player.vy = 2;
    return true;
  }

  /** Returns true and depletes coin if this is a qblock with a coin. */
  hitForCoin(): boolean {
    if (this.type !== "qblock" || !this.has) return false;
    this.has = false;
    return true;
  }
}

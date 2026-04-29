import { Player } from "./Player";

export class Coin {
  collected = false;
  readonly r = 10;

  constructor(public x: number, public y: number) {}

  /** Returns true if picked up this frame. */
  checkPickup(player: Player): boolean {
    if (this.collected) return false;
    const dx = player.x - this.x;
    const dy = player.y - player.h / 2 - this.y;
    if (Math.abs(dx) < 28 && Math.abs(dy) < 28) {
      this.collected = true;
      return true;
    }
    return false;
  }
}

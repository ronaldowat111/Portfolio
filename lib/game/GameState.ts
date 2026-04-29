export class GameState {
  score = 0;
  lives = 3;
  coins = 0;
  jumps = 0;
  blockHits = 0;

  addScore(pts: number): void {
    this.score += pts;
  }

  addCoin(): void {
    this.coins++;
    this.score += 200;
  }

  addJump(): void {
    this.jumps++;
  }

  addBlockHit(): void {
    this.blockHits++;
    this.score += 200;
  }

  /** Returns true if all lives are exhausted. */
  loseLife(): boolean {
    this.lives = Math.max(0, this.lives - 1);
    return this.lives === 0;
  }

  reset(): void {
    this.score = 0;
    this.lives = 3;
    this.coins = 0;
    this.jumps = 0;
    this.blockHits = 0;
  }
}

import { Coin } from "../game/entities/Coin";
import { Player } from "../game/entities/Player";

describe("Coin", () => {
  let coin: Coin;
  let player: Player;

  beforeEach(() => {
    coin = new Coin(200, 300);
    player = new Player(200, 324); // center-y aligns with coin (player.y - h/2 = 324-24=300)
  });

  test("initializes uncollected", () => {
    expect(coin.collected).toBe(false);
  });

  test("checkPickup collects coin when player overlaps", () => {
    const result = coin.checkPickup(player);
    expect(result).toBe(true);
    expect(coin.collected).toBe(true);
  });

  test("checkPickup returns false after already collected", () => {
    coin.checkPickup(player);
    expect(coin.checkPickup(player)).toBe(false);
  });

  test("checkPickup returns false when player is far away", () => {
    player.x = 500;
    expect(coin.checkPickup(player)).toBe(false);
    expect(coin.collected).toBe(false);
  });

  test("checkPickup uses 28px threshold", () => {
    player.x = 200 + 27; // within threshold
    expect(coin.checkPickup(player)).toBe(true);
    coin.collected = false;
    player.x = 200 + 29; // outside threshold
    expect(coin.checkPickup(player)).toBe(false);
  });
});

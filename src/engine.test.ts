import { describe, it, expect } from "vitest";
import {
  attack,
  damage,
  hurt,
  next,
  empty,
  encode,
  parseBattle,
  type Actor,
} from "./engine";
const actor: Actor = {
  id: "a",
  name: "Test",
  side: "hero",
  ac: 14,
  hp: 10,
  maxHp: 10,
  tempHp: 3,
  dex: 2,
  initiative: 15,
  conditions: [],
  notes: "",
  attack: 4,
  diceCount: 1,
  dieSize: 6,
  damageMod: 2,
};
describe("2014 attack rolls", () => {
  it("natural 1 misses regardless of bonus", () =>
    expect(attack(1, 20, false, false, 100, 10).hit).toBe(false));
  it("natural 20 hits critically regardless of AC", () =>
    expect(attack(20, 1, false, false, -20, 30)).toMatchObject({
      hit: true,
      critical: true,
    }));
  it("ties hit", () =>
    expect(attack(10, 1, false, false, 4, 14).hit).toBe(true));
  it("advantage uses higher; disadvantage uses lower", () => {
    expect(attack(3, 18, true, false, 0, 14).roll).toBe(18);
    expect(attack(3, 18, false, true, 0, 14).roll).toBe(3);
  });
  it("advantage and disadvantage cancel", () =>
    expect(attack(8, 20, true, true, 0, 14).roll).toBe(8));
  it("rejects invalid physical dice", () => {
    for (const n of [0, 21, 1.5, NaN])
      expect(() => attack(n, 1, false, false, 0, 14)).toThrow();
  });
});
describe("damage and HP", () => {
  it("crit doubles dice count, modifier once", () => {
    expect(damage([4, 5], 1, 6, 3, true, 1).amount).toBe(12);
    expect(() => damage([4], 1, 6, 3, true, 1)).toThrow();
  });
  it("rounds resistance down after modifier", () =>
    expect(damage([5], 1, 6, 2, false, 0.5).amount).toBe(3));
  it("handles immunity, vulnerability and negative totals", () => {
    expect(damage([5], 1, 6, 2, false, 0).amount).toBe(0);
    expect(damage([5], 1, 6, 2, false, 2).amount).toBe(14);
    expect(damage([1], 1, 6, -5, false, 1).amount).toBe(0);
  });
  it("rejects wrong dice size", () =>
    expect(() => damage([7], 1, 6, 0, false, 1)).toThrow());
  it("absorbs temp HP before HP and clamps zero", () => {
    expect(hurt(actor, 5)).toMatchObject({ hp: 8, tempHp: 0 });
    expect(hurt(actor, 50).hp).toBe(0);
    expect(actor.hp).toBe(10);
  });
});
describe("turns and persistence", () => {
  it("requires initiatives", () =>
    expect(() =>
      next({ ...empty, actors: [{ ...actor, initiative: null }] }),
    ).toThrow());
  it("starts highest then wraps round, including zero HP actors", () => {
    let s = next({
      ...empty,
      actors: [{ ...actor, id: "b", initiative: 3, hp: 0 }, actor],
    });
    expect(s.active).toBe("a");
    expect(s.round).toBe(1);
    s = next(s);
    expect(s.active).toBe("b");
    s = next(s);
    expect(s.round).toBe(2);
  });
  it("round trips and rejects malformed/duplicate data", () => {
    const s = { ...empty, actors: [actor] };
    expect(parseBattle(encode(s))).toEqual(s);
    expect(() => parseBattle("{}")).toThrow();
    expect(() =>
      parseBattle(encode({ ...s, actors: [actor, actor] })),
    ).toThrow();
    expect(() =>
      parseBattle(encode({ ...s, actors: [{ ...actor, hp: -1 }] })),
    ).toThrow();
  });
});

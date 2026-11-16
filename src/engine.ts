export type Actor = {
  id: string;
  name: string;
  side: "hero" | "monster";
  ac: number;
  maxHp: number;
  hp: number;
  tempHp: number;
  dex: number;
  initiative: number | null;
  conditions: string[];
  notes: string;
  attack: number;
  diceCount: number;
  dieSize: number;
  damageMod: number;
};
export type Battle = {
  actors: Actor[];
  active: string | null;
  round: number;
  started: boolean;
  log: string[];
};
export const empty: Battle = {
  actors: [],
  active: null,
  round: 1,
  started: false,
  log: [],
};
export function integer(n: number, min: number, max: number) {
  if (!Number.isInteger(n) || n < min || n > max)
    throw Error(`Enter a whole number from ${min} to ${max}.`);
  return n;
}
export function attack(
  a: number,
  b: number,
  adv: boolean,
  dis: boolean,
  mod: number,
  ac: number,
) {
  integer(a, 1, 20);
  integer(mod, -100, 100);
  integer(ac, 0, 100);
  if (adv !== dis) integer(b, 1, 20);
  const roll = adv === dis ? a : adv ? Math.max(a, b) : Math.min(a, b);
  return {
    roll,
    total: roll + mod,
    critical: roll === 20,
    hit: roll === 20 || (roll !== 1 && roll + mod >= ac),
    text: `d20 ${adv === dis ? a : `${a}, ${b} → ${roll}`} + (${mod}) = ${roll + mod} vs AC ${ac}${adv && dis ? " • advantage and disadvantage cancel" : ""}${roll === 1 ? " • natural 1" : roll === 20 ? " • critical hit" : ""}`,
  };
}
export function damage(
  values: number[],
  count: number,
  size: number,
  mod: number,
  critical: boolean,
  factor: number,
) {
  integer(count, 1, 30);
  integer(size, 2, 100);
  integer(mod, -100, 100);
  if (values.length !== count * (critical ? 2 : 1))
    throw Error(
      `Enter ${count * (critical ? 2 : 1)} individual d${size} results (including extra critical dice).`,
    );
  values.forEach((v) => integer(v, 1, size));
  if (![0, 0.5, 1, 2].includes(factor))
    throw Error("Invalid damage adjustment");
  const base = Math.max(0, values.reduce((a, b) => a + b, 0) + mod);
  return {
    amount: Math.floor(base * factor),
    text: `[${values.join(" + ")}] + (${mod}) = ${base}; × ${factor} → ${Math.floor(base * factor)} damage${critical ? " • double dice, modifier once" : ""}`,
  };
}
export function hurt(a: Actor, n: number): Actor {
  integer(n, 0, 100000);
  return {
    ...a,
    tempHp: Math.max(0, a.tempHp - n),
    hp: Math.max(0, a.hp - Math.max(0, n - a.tempHp)),
  };
}
export function order(actors: Actor[]) {
  return [...actors].sort(
    (a, b) => (b.initiative ?? -999) - (a.initiative ?? -999),
  );
}
export function next(s: Battle): Battle {
  const list = order(s.actors);
  if (!list.length) throw Error("Add combatants first.");
  if (list.some((a) => a.initiative === null))
    throw Error("Enter every initiative total first.");
  const i = list.findIndex((a) => a.id === s.active);
  const j = (i + 1) % list.length;
  return {
    ...s,
    started: true,
    active: list[j].id,
    round: s.round + (s.started && j === 0 ? 1 : 0),
  };
}
export function validActor(x: unknown): x is Actor {
  if (!x || typeof x !== "object") return false;
  const a = x as Actor;
  return (
    typeof a.id === "string" &&
    typeof a.name === "string" &&
    a.name.length > 0 &&
    a.name.length <= 100 &&
    ["hero", "monster"].includes(a.side) &&
    [
      "ac",
      "maxHp",
      "hp",
      "tempHp",
      "dex",
      "attack",
      "diceCount",
      "dieSize",
      "damageMod",
    ].every((k) => Number.isInteger(a[k as keyof Actor])) &&
    a.ac >= 0 &&
    a.ac <= 100 &&
    a.maxHp > 0 &&
    a.maxHp <= 100000 &&
    a.hp >= 0 &&
    a.hp <= a.maxHp &&
    a.tempHp >= 0 &&
    a.tempHp <= 100000 &&
    a.dex >= -10 &&
    a.dex <= 20 &&
    a.attack >= -100 &&
    a.attack <= 100 &&
    a.damageMod >= -100 &&
    a.damageMod <= 100 &&
    a.diceCount >= 1 &&
    a.diceCount <= 30 &&
    a.dieSize >= 2 &&
    a.dieSize <= 100 &&
    (a.initiative === null ||
      (Number.isInteger(a.initiative) && Math.abs(a.initiative) <= 100)) &&
    Array.isArray(a.conditions) &&
    a.conditions.every((c) => typeof c === "string") &&
    typeof a.notes === "string"
  );
}
export function parseBattle(raw: string): Battle {
  const x = JSON.parse(raw);
  if (
    x.version !== 1 ||
    !x.battle ||
    !Array.isArray(x.battle.actors) ||
    !x.battle.actors.every(validActor)
  )
    throw Error("Invalid version-1 battle file.");
  const b = x.battle as Battle;
  if (
    new Set(b.actors.map((a) => a.id)).size !== b.actors.length ||
    !Number.isInteger(b.round) ||
    b.round < 1 ||
    typeof b.started !== "boolean" ||
    !Array.isArray(b.log) ||
    !b.log.every((t) => typeof t === "string") ||
    (b.active !== null && !b.actors.some((a) => a.id === b.active))
  )
    throw Error("Invalid battle state.");
  return b;
}
export const encode = (battle: Battle) =>
  JSON.stringify({ version: 1, battle });

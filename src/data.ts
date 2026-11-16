export const official =
  "https://media.dndbeyond.com/compendium-images/marketing/dnd_starterset_characters.pdf";
export const heroes = ["Cleric", "Fighter", "Paladin", "Rogue", "Wizard"];
// Combat extracts verified against SRD 5.1, printed pp. 324, 346, 356–357.
export const monsters = [
  {
    name: "Kobold",
    ac: 12,
    maxHp: 5,
    dex: 2,
    attack: 4,
    diceCount: 1,
    dieSize: 4,
    damageMod: 2,
    notes:
      "SRD 5.1 p.324. Dagger: 5 ft., piercing. Sling: 30/120 ft., 1d4+2 bludgeoning. Pack Tactics: advantage if a non-incapacitated ally is within 5 ft. of target. Sunlight Sensitivity: disadvantage on attacks and sight-based Perception in sunlight. Speed 30 ft.; darkvision 60 ft.",
  },
  {
    name: "Skeleton",
    ac: 13,
    maxHp: 13,
    dex: 2,
    attack: 4,
    diceCount: 1,
    dieSize: 6,
    damageMod: 2,
    notes:
      "SRD 5.1 p.346. Shortsword: 5 ft., piercing; shortbow: 80/320 ft., piercing. Vulnerable to bludgeoning; immune to poison damage, exhaustion and poisoned. Speed 30 ft.; darkvision 60 ft.",
  },
  {
    name: "Zombie",
    ac: 8,
    maxHp: 22,
    dex: -2,
    attack: 3,
    diceCount: 1,
    dieSize: 6,
    damageMod: 1,
    notes:
      "SRD 5.1 pp.356–357. Slam: 5 ft., bludgeoning. Undead Fortitude: at 0 HP make CON save (+3), DC 5 + damage taken; success leaves 1 HP. No save against radiant or critical damage. Immune to poison damage and poisoned. Speed 20 ft.; darkvision 60 ft. Resolve Fortitude manually with HP controls.",
  },
];
export const conditions = [
  "Blinded",
  "Charmed",
  "Deafened",
  "Exhaustion 1",
  "Exhaustion 2",
  "Exhaustion 3",
  "Exhaustion 4",
  "Exhaustion 5",
  "Exhaustion 6",
  "Frightened",
  "Grappled",
  "Incapacitated",
  "Invisible",
  "Paralyzed",
  "Petrified",
  "Poisoned",
  "Prone",
  "Restrained",
  "Stunned",
  "Unconscious",
];

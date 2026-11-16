# Stormwreck Combat Companion

Mobile-first React + TypeScript + Vite PWA for a DM using **physical dice** and 2014 fifth-edition rules. One active battle, manual monster selection (duplicates welcome), initiative, turn and round tracking, transparent attack/damage calculations, criticals, advantage/disadvantage, HP/temp HP, condition reminders, 50-step undo and versioned localStorage save/resume. No random dice generation, backend or tracking.

## Run and verify

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev
npm test
npm run build
node node_modules/playwright/cli.js install chromium
npm run build
npm run test:e2e
```

Open the Vite URL with `/stormwreck-combat-companion/`. Production files are in `dist/`; `npm run build` generates a revisioned service worker that precaches the app shell and all bundled assets. First online visit must finish installing the service worker before offline use. Browser install support varies; SVG app icon supplied. No external fonts, scripts or CDNs are required at runtime. Clearing browser storage removes local battles; export JSON backups regularly.

## Play

1. Roster & sheets → official PDF → enter each hero's verified level-1 combat values. Five editable class slots are provided; none contains guessed stats. Set the attack and damage profile you want to use; edit for another weapon or spell, or override the fields during an attack. Notes hold other abilities, resources and death saves.
2. Add SRD Kobolds, Skeletons or Zombies, or enter a custom combatant. Each copy has its own ID and HP. Presets are abridged combat extracts, not complete stat blocks.
3. Physically roll initiative, add DEX, and enter **totals**. Use arrows for equal-total ties. Start battle, then Next turn. Zero HP does not automatically remove a combatant.
4. Choose attacker/target and enter physical d20 values. Natural 1 always misses; natural 20 always hits critically. Advantage/disadvantage cancel when both apply. Otherwise choose high/low.
5. Enter individual physical damage die results, including twice the dice on a critical, and add the modifier once. Resistance rounds down after adding the modifier. Temp HP absorbs first, HP clamps at zero. Mixed damage types need separate attack/damage applications or manual HP controls.
6. Use/manage controls provide damage, capped healing, temp HP replacement and condition toggles. Undo reverses battle mutations during this session. Reload preserves the battle but not undo history. Export/import uses `{ "version": 1, "battle": ... }`; malformed files are rejected. Imports replace the current battle and are undoable.

## Scope and manual adjudication

This MVP automates attack rolls and damage arithmetic, not all 5e combat. Conditions are **reminders**, not automated modifiers. DM resolves cover/range, spell saves/effects, concentration, death saves, massive damage, dying/stable states, special traits, resources and exhaustion effects. Choose situational modifiers and type-based resistance/vulnerability/immunity explicitly. Zombie Undead Fortitude requires a physical CON save and manual HP correction. No hidden math. Journal retains the last 100 events; undo retains 50 snapshots while open. New battle asks confirmation and can be undone.

## Official sheets and content provenance

Verified 2026-11-16:

- [Official D&D Beyond character-sheet resource page](https://www.dndbeyond.com/resources/1779-d-d-character-sheets) links [Dragons of Stormwreck Isle character sheets](https://media.dndbeyond.com/compendium-images/marketing/dnd_starterset_characters.pdf), a 10-page PDF containing the five premades (Cleric, Fighter, Paladin, Rogue, Wizard). The page permits personal printing and photocopying; it does not establish a redistribution license. Therefore this repository **does not reproduce the premade statistics, text, artwork or PDF**. It links to the original and provides five editable placeholders plus local JSON backup/import. Use personal sheet data only where you have permission; exported personal files are not automatically uploaded.
- [Official SRD 5.1 CC-BY PDF](https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf), printed p.324 Kobold; p.346 Skeleton; pp.356–357 Zombie, directly checked for AC, HP, DEX modifier, attack bonus, damage dice and combat traits. Attack and damage rules use the 2014 rules in SRD 5.1, not the revised SRD 5.2. Text is abridged/paraphrased and data adapted to the application format.

This work includes material taken from the System Reference Document 5.1 (“SRD 5.1”) by Wizards of the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at https://creativecommons.org/licenses/by/4.0/legalcode.

Independent unofficial companion; no endorsement. Code is MIT licensed; SRD-derived data/rule text retains CC-BY-4.0 attribution. Names identify compatibility; no logos or proprietary adventure content included.

## Deployment

The public repository deploys to [GitHub Pages](https://gibovski.github.io/stormwreck-combat-companion/). `.github/workflows/pages.yml` runs unit tests, builds, checks mobile and desktop Chromium, and deploys on pushes to `main`. Pages uses the GitHub Actions source.

The fantasy theme uses original CSS textures, an original SVG dragon and d20 crest, and system serif/sans-serif fonts. No external artwork or font downloads are required. Decorative motifs are hidden from assistive technology; navigation, physical dice inputs, and combat outcomes retain text labels. Reduced-motion preferences disable transitions.

See `VERIFICATION.md` for actual checks and deployment outcome.

## Original storybook illustrations

Seven self-contained SVG plates in `public/art/` were drawn specifically for this app: the tide dragon, lavender dice dragon, extended roll guardian, misty wreck, weathered guardian garden with a rock cat, two undead sailors, and a lantern sprite. Original geometry, expressions and compositions; no official artwork, traced references, third-party assets, external fonts or hotlinks. These illustrations share the repository’s MIT license. Reserved illustration space, opaque numeric surfaces and pointer-transparent decorative images keep combat controls readable. Every plate is precached on the first online visit; changes to SVG contents also revise the offline cache.

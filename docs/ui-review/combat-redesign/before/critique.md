# Independent baseline UX review
Reviewer: /root/ux_review (independent agent; did not author app). 2026-11-16 UTC.
Revision: 06806e44f3bf2da879a8349814cc62abd81346e1. Local existing dist preview at http://127.0.0.1:4173/stormwreck-combat-companion/.

Target: beginner mobile DM, with physical dice, trying to maintain initiative, adjust HP, remember conditions, and recover mistakes during live conversation. Test fixture: Zombie 1 + Skeleton 1.

| Category | 0–5 | Evidence |
|---|---:|---|
| hierarchy | 1 | At 390×844, active actor begins at y=1099; Next turn y=938. Hero and wreck consume initial viewport. Combat ownership is absent above fold. |
| journeys | 2 | Basic combat functions work, but manage HP is at document y=3511 after selecting a combatant. Three controls (manage, amount, damage) plus navigation across several screenfuls; undo lives after calculator. No next actor preview. |
| responsive | 2 | No horizontal overflow at 375/390/1440, but mobile task hierarchy is a very long document (3745px with two actors). Desktop also hides turn control below 1000px viewport. |
| accessibility | 3 | Explicit field labels, textual HP and active state, legible primary text, comfortable button heights. Native selects. No comprehensive automated accessibility audit in baseline; editor focus trap/Escape not implemented in source. |
| consistency | 4 | Strong consistent dark teal/bronze surfaces, typography, spacing, and control treatment. |
| states | 3 | Persistence, undo, empty state, journal, confirmation on remove work. States represented well, but recovery remote from task. Death saves/saves/rest absent; notes only, not an implemented workflow. |
| brand | 4 | Mature cinematic existing dragon/wreck art, restrained palette, strong fantasy identity. Repeated art is expensive in viewport and competes with task. |

Aggregate: 19/35 = **2.71/5**. Not ready for mobile combat redesign goal.

Actually opened rendered evidence: battle-390.png and battle-1440.png using view_image. Captured additional empty, roster, management screenshots at 375/390/1440 (not individually visually reviewed). interaction-results.json records actual tested paths and geometry.

Actual browser checks at each width: add Zombie/Skeleton, initiative entry, start, damage 7→15/22, heal→22/22, Prone toggle, undo condition, next actor, round wrap, reload recovery, remove actor all passed. Automated clicks scroll controls into view; these are not human speed measurements. No timing claim. Setup uses 1 roster navigation + 2 add taps + 1 Battle navigation + 2 filled fields + 1 Start tap. Basic manual HP requires manage + field + Damage; the essential problem is separation in the long document. No implemented saving throw, death-save, short/long-rest engine was available to test. No invented gameplay outcome was assumed.

Top corrections: (1) put whose turn/next/round/undo in immediate persistent view; (2) put fast damage/heal alongside HP and condition controls alongside actor; (3) collapse calculator, log, backup and instructions behind disclosure or dedicated tab; (4) condense art/header, retain atmosphere without displacing combat; (5) prioritize opponent setup rather than forcing a long party gallery before monsters; (6) provide beginner rules context with explicit manual adjudication boundaries.

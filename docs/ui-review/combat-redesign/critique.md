# Independent final UX critique
Reviewer /root/ux_review; independent-agent; author /root. Source dff871da250e27d90dcfbfb816c2c78fd394b08c. Reviewed 2026-11-16 UTC on local built preview http://127.0.0.1:4173/stormwreck-combat-companion/.

Beginner DM priority: keep combat ownership, HP and mistake recovery in immediate reach while preserving physical-dice rules and manual adjudication. Independent reviewer did not edit application source. Baseline was recorded and scored before implementation (before/critique.md).

| Category | Before | After | Evidence and findings |
|---|---:|---:|---|
| hierarchy | 1 | 4.5 | Current/next/round/undo always in dock. Active actor now y312 at390px instead of1099. Combat outranks art and secondary tools. |
| journeys | 2 | 4 | Damage is amount + Damage (2 controls), formerly manage + amount + Damage (3) plus remote scroll. Local conditions/notes and separate calculator preserve context. Setup direct party action and opponents above gallery. |
| responsive | 2 | 4 | Tested320/375/390/1440, no overflow. 390 two-actor document1247px vs3745 baseline (~67% shorter). Second mobile actor actions may require scroll; dock retains ownership. |
| accessibility | 3 | 4 | Computed visible text/control contrast >=4.5; 44px target heights; semantic labels, keyboard trap/Escape/return, reduced motion and320 reflow tested. Not a screen-reader/full WCAG audit; native browser zoom unverified. |
| consistency | 4 | 4.5 | Coherent slate/bronze/teal control language, restrained typography, stable navigation and local details. |
| states | 3 | 4 | Actual damage/heal0/condition/undo/round/reload paths passed. Storage-denied feedback truthful. Notes undo corrected and verified. Session-only undo and manual save/death-save adjudication remain explicit. |
| brand | 4 | 4 | Mature retained dragon art, uncluttered legible surfaces and subtle coastal identity. Art no longer displaces battle. Setup remains more utilitarian than cinematic. |

Before19/35 =2.71/5; after29/35 = **4.14/5**. Improvement +1.43 points. No unresolved release blockers observed in covered scope. Decision: ship threshold met, subject to gate/build records. This is a targeted human-judgment rubric, not a benchmark or universal accessibility certification.

Final rendered screenshots actually opened with view_image: after/battle-390.png, battle-1440.png, setup-390.png, attack-390.png. Earlier exploratory320 battle also opened; final320/375 and recovery captures available, not individually claimed inspected. Full-page screenshots of scrolled sticky/fixed navigation can position fixed controls within document capture; direct browser interaction verified controls. Gate uses top-scrolled battle mobile/desktop images.

Final independent browser paths at320/375/390/1440: add Zombie/Skeleton, enter initiatives, start, damage7→15/22, heal→22/22, Prone then undo, next actor, wrap round2, reload, add Cleric, damage to0 then heal4. Additional mobile physical-dice critical attack Skeleton→Zombie applied7 damage correctly (22→15). Keyboard initial focus, backward/forward wrapping, Escape/return, notes blur/undo, storage failure all verified. No human timing claim. Saving throws/death saves/rest/XP are not automated; notes and paraphrased rules support manual adjudication.

Corrections during review: stale uncontrolled notes after undo fixed with remount key; condition accessible label added; persistent nav/error notice, honest save status and all-tab turn dock improved context/recovery. Native browser zoom and assistive-technology testing remain limitations. Artificial CSS body zoom at640 keeps a desktop media query and overflows; this is recorded as a simulation limitation, not represented as a native zoom pass. Real320px layout passed.

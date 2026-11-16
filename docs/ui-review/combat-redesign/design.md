# Stormwreck combat redesign

Users: beginner and experienced DMs running 2014 fifth edition with physical dice, primarily one-handed on phones. Their job is to keep a battle moving while watching players, not administer a dashboard. Preserve all supported battle math, custom sheets, SRD presets, tie order, condition reminders, local persistence, offline support, undo, backups, journal and the existing Pages URL/settings.

Baseline revision 06806e4. Independent reviewer /root/ux_review captured real browser evidence before code changes; see before/critique.md and interaction-results.json. Success: current/next and round always available, local HP edits without navigation, fast duplicate monsters, less scroll, clear recovery, no rule automation beyond supported math. No added dependencies or external runtime requests.

## Hierarchy and journeys
- Enter Battle → Setup → add party/custom verified sheet values and duplicate SRD opponents → set initiative totals → Start. Setup puts opponents ahead of long premade sheet explanations, and offers a direct custom party action. Party values are never invented.
- Persistent bottom turn control → current/next/round → next turn. Active actor scrolls into view on advancement; zero HP actors remain in initiative.
- Actor → enter HP amount → Damage or Heal. Temp HP absorbs damage first; healing caps at max. Changes announce status, journal, save immediately and can be undone in the dock. Empty/invalid HP input announces a helpful error, never silently applies zero. Expanded local details expose condition toggles, notes, edit, remove with confirmation and tie order.
- Attack tab → existing physical-dice calculator. This is separate from routine HP; saving throw spells can use direct HP and do not require an attack roll. Temp HP control retained here. Quick rules are available in Battle and full sources in Rules.
- Backup/journal/reset disclosure → export/import/reset with confirmation and undo. Retains legacy v1 save format. Undo remains session-only; reload restores saved battle, not undo history.
- Empty state offers build roster, not fake demo characters. No network loading state needed (static local app). Storage/import errors reported, destructive removal/reset confirmed, calculated results visible, disabled actions styled. Modal traps Tab, Escape cancels, focus returns to invoking control.

## Style and composition
Mature coastal fantasy, charcoal/slate opaque work surfaces, muted bronze and sea glass accents. Existing original artwork retained per README provenance; no new third-party assets or fictional adventure lore. Dragon lives in a compact masthead, shipwreck in the empty state, undead thumbnails in setup; no painting behind critical numbers. Large scene panels and repeated decorative vitals removed from combat. No external fonts.

References selected from central library: D&D Beyond for scannable game information hierarchy (no reused art/branding); WCAG 2.2 for contrast/focus/reflow; GOV.UK plain-language errors and actions. These inform patterns only, not copied code or visual claims.

Tokens: #0b1115 canvas, #172126 panels, #e8e6df text, #b2c0c2 muted, #e0bb7c bronze, #315e59 primary; 4/8/12/16/24px rhythm; 6/8px radii; system sans controls and numbers, Georgia headings only. 44px minimum action/input height, 46px dock buttons, 16px inputs to avoid mobile zoom. Motion limited to color transitions, disabled for reduced motion. Desktop two-column actor grid, phone single-column; fixed dock reserves main bottom padding. Test 320/375/390 and 1440 plus zoom/reflow.

Rules: paraphrased SRD 5.1 (CC BY attribution already in Rules), verified from official PDF for quick reference; 2014 scope explicit. No spell or death save automation, no rests/XP/adventure book text introduced. Death saves remain manual notes. Zero HP/healing prompts require DM adjudication, not automatic condition outcomes.

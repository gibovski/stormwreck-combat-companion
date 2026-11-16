# Verification — 2026-11-16

- Baseline: `python3 /var/lib/bazworker/workspace/scripts/bootstrap-dev-tools.py` — all baseline tools available, no administrator actions.
- `npm ci --ignore-scripts` — clean lockfile install succeeded (50 packages, zero reported vulnerabilities). The complete build subsequently succeeded.
- `npm test` — **14 passed**: natural 1/20, AC ties, advantage/disadvantage/cancellation, invalid inputs, critical dice, resistance rounding, immunity/vulnerability, negative damage clamping, temp HP, turn/round order, zero-HP turns and import validation/round-trip.
- `npm run build` — TypeScript checks and Vite production build passed; generated revisioned service worker includes all hashed JS/CSS assets.
- `npm run test:e2e` — **8 passed**, Chromium at mobile (iPhone 13 viewport) and desktop sizes: duplicate monsters, initiative/turns, physical critical damage, undo, reload/resume, offline resume, official-sheet link and editable hero entry, conditions, healing, JSON export/import, malformed-import rejection, cancelled advantage and natural-1 miss, plus first-visit offline shell/assets. Browser installation existed; missing shared libraries were supplied through existing user-scoped paths, without modifying system services or installing system packages.

Exact local browser command:

```sh
LD_LIBRARY_PATH=/var/lib/bazworker/.local/lib/bazfit-browser/usr/lib/x86_64-linux-gnu:/var/lib/bazworker/.local/urban-browser/usr/lib/x86_64-linux-gnu npm run test:e2e
```

- Mobile screenshot inspected, and browser check confirms no horizontal page overflow. Screenshots generated under ignored `test-results/`.
- Initial browser attempts exposed missing shared libraries, ambiguous select labels, and first-visit offline asset lookup with Vary headers. Fixed the latter two; final suite passed. No failed attempt is represented as a pass.
- `git diff --check` — passed before initial commit.

## Content checks

Downloaded official PDFs temporarily for verification; PDFs are not committed:

- SRD 5.1 SHA-256: `2504d2a0abb0a4d491a939be4f17910a2dde0312570ab8d208080225ccf0a1f0`.
- Official five-premade PDF SHA-256: `7fd9af4718ba1a9c5f04ea2bcb6bd93e64ab2d0800501e40e27d88e8e1e0eef5`.
- Directly checked SRD printed pp.324, 346, 356–357 against the three combat presets. Character sheet source links and personal-use restriction documented in README and app. Premade statistics are intentionally editable placeholders rather than redistributed restricted material.

## Fantasy restyle verification — 2026-11-16

- Original SVG dragon and CSS-only parchment, rune, and jewel-tone treatments; no third-party artwork or runtime font downloads. Existing d20 crest retained.
- `npm test`: 14 engine tests passed. `npm run build`: TypeScript and Vite production build passed.
- Mobile and desktop Chromium coverage now includes keyboard skip link, pressed navigation state, physical dice entry by keyboard, reduced-motion behavior, roster and encounter screenshots, and overflow checks at 320, 390, 768 and 1440 CSS pixels. Existing combat, critical damage, undo, healing, conditions, import/export, resume and offline checks retained.
- The generated service worker precaches the dragon illustration; first-visit offline test verifies it decodes successfully.
- Screenshots are produced in `test-results/` for battle, roster and encounter views on mobile and desktop. CI uploads them as the `browser-screenshots` artifact.
- Screenshots visually reviewed for readable HP/AC, active turn, mobile controls and card layouts. Browser tests emulate Chromium; real Safari/iOS and a full assistive-technology audit were not performed.
- `git diff --check`: passed.

## Deployment

The earlier private-repository plan restriction is resolved: the repository is now public as requested by the user. GitHub API confirms Pages uses `build_type: workflow`, HTTPS enforced, and the live URL is https://gibovski.github.io/stormwreck-combat-companion/. The existing workflow verifies unit tests/build/browser tests before deploying. See GitHub Actions for the deployment tied to each commit; successful push alone is not considered deployment verification.

Spell saves/effects, death saves, condition effects, monster traits and other DM adjudication remain manual as described in README and the app.

## Illustrated edition — 2026-11-16

- Added seven original, locally bundled SVG plates (no copied official artwork or third-party images): expressive sea dragon/round keeper, lavender dragon/HP and AC frame, extended dragon/roll frame, moonlit misty wreck, weathered statue garden with hidden rock cat, two zombie sailors peeking behind encounter cards, and lantern sprite. Illustrations use shared ink outlines, muted sea/glass/purple colors and subtle stippling.
- Screenshot review covered mobile and desktop battle, roster and encounter layouts. Corrected the encounter description overlapping sailors and moved the mobile garden caption above its illustration. Numeric values and inputs use opaque surfaces; decorative art ignores pointer events and is hidden from assistive technology.
- `npm test`: 14 passed. `npm run build`: TypeScript and production build passed. Browser suite: 10 mobile/desktop tests, including keyboard controls, 320/390/768/1440-width overflow checks, combat and save/restore, and offline image decoding for all seven plates. Offline roster artwork is verified after starting offline from a first-visit battle view.
- Initial browser launch failed because the shell lacked the existing shared-library paths. Used the user-scoped `LD_LIBRARY_PATH` command documented above; no administrator action needed.
- Precache enumerates every illustration and includes SVG contents in its cache revision hash, so artwork-only edits invalidate the old offline cache.
- Screenshots are available in `test-results/` locally and uploaded by the Pages workflow. Chromium only; real-device Safari and a full screen-reader audit remain outside these checks.

## Cinematic dark fantasy correction — 2026-11-16

Supersedes the earlier SVG art direction. Replaced all seven simplistic SVG plates with seven original generated paintings, optimized to 1,587,000 bytes total (about 1.6 MB). Added a large dragon scene backdrop, storm wreck banner, misty statue garden, drowned sailor encounter scene and card artwork, antique lantern scenes, and scaled tail/claw frames around opaque numeric controls. Updated surfaces to charcoal/slate with muted teal, copper and parchment-gold accents. No official D&D artwork or external image dependencies.

- `npm test`: 14 engine tests passed.
- `npm run build`: TypeScript and production build passed; no unresolved asset warnings.
- `LD_LIBRARY_PATH=/var/lib/bazworker/.local/lib/bazfit-browser/usr/lib/x86_64-linux-gnu:/var/lib/bazworker/.local/urban-browser/usr/lib/x86_64-linux-gnu npm run test:e2e`: 10 Chromium tests passed on mobile and desktop, including 320/390/768/1440-width overflow checks, physical dice entry, combat, undo, import/export, persistence, and decoding all seven WebP assets offline.
- Reviewed full-page battle and roster screenshots at 390 and 1440 pixels, plus populated combat screenshots. Adjusted desktop dragon framing to preserve its head and sailor crop to preserve faces. Screenshot capture now waits for image decoding to avoid empty plates in CI captures.
- Initial browser launch without user-scoped shared libraries failed; the documented library paths resolved it. Pillow was installed in a temporary virtual environment to compress generated originals. No system packages or services changed.
- Service-worker revision includes WebP bytes, preserving automatic offline cache invalidation for artwork-only changes.
- `git diff --check`: passed. Real-device Safari and a full screen-reader audit were not performed.
- Final crop/screenshot-wait rerun: 9 passed, desktop keyboard test hit the 30-second test budget while typing. `npm run test:e2e -- --last-failed` with the same library paths passed that test in 4.7 seconds; no implementation change was required. Earlier full suite passed all 10. CI independently checks the pushed revision before deploying.

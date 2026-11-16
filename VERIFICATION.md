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

## Deployment blocker

Authenticated account: `gibovski`. Private repository created and verified through GitHub API. Activation attempted using:

```sh
gh api -X POST repos/gibovski/stormwreck-combat-companion/pages -f build_type=workflow
```

GitHub returned **HTTP 422**: `Your current plan does not support GitHub Pages for this repository.` Repository stays private per workspace instructions. No live site or live URL is claimed. README contains activation and workflow commands for after an eligible-plan upgrade. CI verifies and uploads the build artifact; deployment is skipped until the Pages API confirms Pages is enabled.

Browser tests cover Chromium emulation, not real iOS/Safari install UI. Spell saves/effects, death saves, condition effects, monster traits and other DM adjudication remain manual as described in README and the app.

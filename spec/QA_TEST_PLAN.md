# NIGHTBLOOM: The Last Signal — Quality Assurance & Test Plan (QA_TEST_PLAN)

**Project Name:** NIGHTBLOOM: The Last Signal  
**Target Platform:** Modern Desktop Web Browsers (Chrome, Firefox, Safari, Edge)  
**Test Frameworks:** Vitest (Unit/Integration), Playwright (E2E), Headless Balance Bot, Zod Schema Validators  
**Document Status:** Approved Specification v1.0  
**Authority:** This document expands `ARCHITECTURE.md`, `PREPRODUCTION.md`, `GDD.md`, and `STORY_BIBLE.md`. On any conflict, those source documents win.

---

## 1. QA Strategy & Testing Pyramid

```text
                      +-----------------------------+
                      |   MANUAL & ACCESSIBILITY    |
                      |   - WCAG 2.2 AA Contrast    |
                      |   - Colorblindness / Grayscale|
                      |   - 100% Keyboard Tab Flow  |
                      +-----------------------------+
                                     |
                      +-----------------------------+
                      |     E2E AUTOMATION          |
                      |     - Playwright Smoke      |
                      |     - Zero-Network Privacy  |
                      |     - Cross-Browser Matrix  |
                      +-----------------------------+
                                     |
                      +-----------------------------+
                      |  SIMULATION BOT & STRESS    |
                      |  - Headless Balance Bot     |
                      |    (30 Seeds/Chapter)       |
                      |  - 120s Profile C Stress    |
                      |    (DPR 1 & 2, Chrome & FF) |
                      +-----------------------------+
                                     |
                      +-----------------------------+
                      |   CONTENT & STORY CHECKS    |
                      |   - Zod Schema Validation   |
                      |   - Referential Integrity   |
                      |   - 6 Story Consistency Rules|
                      +-----------------------------+
                                     |
       +-----------------------------------------------------------+
       |                  UNIT & INTEGRATION (Vitest)              |
       |  - Pure TS Simulation, Spatial Hash, Damage Math, RNG     |
       |  - Upgrade Pool, SaveService Migrations, State Machines   |
       |  - Dead-Code Elimination Check (__NB_DEBUG__)             |
       +-----------------------------------------------------------+
```

---

## 2. Test Execution Matrix & CI Commands

| Test Suite | Purpose | Execution Command | Target SLA | CI Blocking? |
|---|---|---|---|---|
| **Type Check** | Enforce strict TypeScript compilation. | `npm run typecheck` | 0 errors | **Yes** |
| **Lint & Boundaries** | Enforce ESLint layer import boundaries. | `npm run lint` | 0 warnings | **Yes** |
| **Content Validation** | Zod schemas, asset/string IDs, story rules. | `npm run validate:content` | 0 broken IDs | **Yes** |
| **Unit & Integration** | Simulation math, mechanics, and saves. | `npm run test` | 100% pass | **Yes** |
| **Bundle Budget** | Verify bundle size $\le 350\text{ KB}$ gzipped. | `npm run build` | $\le 350\text{ KB}$ | **Yes** |
| **Debug Stripping** | Assert `__NB_DEBUG__` does not exist in `dist/`. | Automated build check | 0 occurrences | **Yes** |
| **E2E Browser Smoke** | UI flows, level-up cards, audio init. | `npm run test:e2e` | 100% pass | **Yes** |
| **Zero-Network Privacy**| Assert 0 network requests during gameplay. | Automated Playwright test | 0 requests | **Yes** |
| **Balance Simulation** | Headless bot difficulty validation (30 seeds).| `node tools/simulate_runs.mjs` | Within targets | Gate |
| **Performance Stress** | 120s Profile C stress (DPR 1 & 2). | Performance benchmark | $\ge 58\text{ FPS}$ | Gate |

---

## 3. Unit & Integration Test Suites (Vitest)

### 3.1 Simulation Math & Spatial Hash
- **`spatial_hash.test.ts`:**
  - Verify entities register, update cells on movement, and deregister cleanly upon defeat.
  - Verify boundary queries handle straddling entities across multiple cell buckets.
  - Verify $3 \times 3$ neighborhood queries return all candidates without false negatives.
- **`seeded_rng.test.ts`:**
  - Verify identical sequences generated across platforms given the same 32-bit integer seed (mulberry32).
  - Verify uniform distribution variance over 100,000 iterations.
- **`damage_and_invulnerability.test.ts`:**
  - Verify Mira takes contact damage upon intersection.
  - Verify hit invulnerability timer ($0.6\text{ s}$) rejects subsequent hits.
  - Verify lethal damage transitions state machine to `defeat` cleanly.

### 3.2 Weapon Systems & Abilities
- **`signal_flare.test.ts`:**
  - Targets nearest eligible enemy within $420\text{ px}$.
  - Projectile fires at $520\text{ px/s}$; returns to pool on max range or hit.
- **`coil_arc.test.ts`:**
  - Chains to up to 3 distinct targets within $180\text{ px}$ jump range.
  - Never strikes the same enemy twice in a single chain.
- **`bloomguard.test.ts`:**
  - Activates for $3.0\text{ s}$ every $10.0\text{ s}$, applying $30\%$ damage reduction and knockback.
- **`wren.test.ts`:**
  - Maintains $(40, -40)\text{ px}$ offset from Mira; auto-fires every $1.0\text{ s}$ dealing 6 damage to enemies within $300\text{ px}$.
- **`beacon_pulse.test.ts`:**
  - Applies $220\text{ px}$ knockback to all enemies within $160\text{ px}$.
  - Activates $50\%$ damage reduction for $0.8\text{ s}$.
  - **Cancels Stormroot's Gale Pull attack** when triggered during the pull telegraph.

### 3.3 Upgrade Drafting & Pool Integrity
- **`upgrade_pool.test.ts`:**
  - Verify 3 offered cards are always **distinct**.
  - Verify upgrades at `maxLevel` are never offered.
  - Verify upgrades requiring unheld abilities or locked ledger entries are never offered.
  - Fallback cards: when fewer than 3 valid cards exist, fill with **Field Rations** (heals 25% max HP) and **Score Bonus** cards.
  - Verify reroll replaces all 3 cards and decrements chapter reroll counter.
  - Verify state machine rejects double-picks and prevents stuck pause.

### 3.4 Save Data, Migrations & Fault Tolerance
- **`save_service.test.ts`:**
  - Verify schema validation against `SaveDocumentSchema` (`schemaVersion`, `profileId: "default"`, `campaigns`, `unlocks`, `settings`).
  - Verify migration runner safely updates legacy save formats.
  - Verify pre-migration backup copy is stored under `nightbloom_save_backup_vN`.
  - Verify corrupted save data triggers graceful fallback to defaults with notification, preserving corrupted blob under backup key.

---

## 4. Content & Story Consistency Checks

Automated script executed via `npm run validate:content`:

### 4.1 Referential Integrity
1. **String Catalog Resolution:** Every `stringId` referenced across chapters, abilities, upgrades, enemies, barks, and ledger entries exists in `src/content/locales/en.ts`.
2. **Asset ID Resolution:** Every procedural sprite recipe, portrait set, and audio ID resolves in engine registries.
3. **Numeric Sanity Bounds:** Enemy HP $> 0$, speed $\in [30, 400]\text{ px/s}$, cooldowns $> 0.1\text{ s}$, phase durations $> 0\text{ s}$.

### 4.2 The 6 Story Consistency Checks (from STORY_BIBLE.md §12)
1. **Rule 1:** Every string ID exists in `en.ts`, and no radio dialogue caption exceeds 100 characters.
2. **Rule 2:** The phrase *"Ticket closed"* appears **only** in `radio.tavi.ch2_installed` and `radio.tavi.ch5_end_defeat`.
3. **Rule 3:** `ledger.ring` and `ledger.ninth_column` unlock **only** after the Chapter 2 reveal; `ledger.old_core` unlocks at the Chapter 1 reward.
4. **Rule 4:** Every chapter data record has `nightLabelStringId` and `coreGrowthStage`, with stages 0 through 4 progressing strictly in order across Chapters 1 to 5.
5. **Rule 5:** Warden Idris Kael speaks clearly **only** from Chapter 4 onward; Chapter 1 contains static only.
6. **Rule 6:** The Signal Lock (300 s) mathematically matches Idris's *"Twelve minutes"* at the start of Chapter 5 Phase 2: Phases 2 and 3 take 420 s total, leaving exactly 300 s of convoy travel time for the boss phase.

---

## 5. Headless Balance Bot Simulation

A fast headless simulation script runs the pure TypeScript simulation without Canvas rendering, executing **at least 30 seeds per chapter** using a simulated kiting bot:
- **Bot Behavior:** Moves away from the centroid of the nearest 5 enemies; activates Beacon Pulse when HP $< 50\%$ and enemies are within $120\text{ px}$; selects upgrades favoring highest damage.
- **Target Difficulty Thresholds (from GDD.md §9):**

| Chapter | Peak Live Enemies | Player Level at End | First-Attempt Clear Rate (Target) |
|---|---|---|---|
| **Chapter 1: The Nursery Wakes** | 25–40 | 8–10 | $\mathbf{\ge 90\%}$ |
| **Chapter 2: Rustline** | 40–60 | 10–13 | $\mathbf{\approx 80\%}$ |
| **Chapter 3: The Quiet Water** | 50–70 | 12–15 | $\mathbf{\approx 75\%}$ |
| **Chapter 4: The Broken Relay** | 60–90 | 14–17 | $\mathbf{\approx 70\%}$ |
| **Chapter 5: Before Dawn** | 80–120 (excl. adds) | 16–20 | $\mathbf{55–65\%}$ (first attempt), $\mathbf{\ge 85\%}$ (within 3 attempts via retry) |

- **Boss Viability:** The balance bot must prove Stormroot is beatable with standard builds (Coil Arc + Wren, Bloomguard + Coil Arc, Wren + Bloomguard).

---

## 6. End-to-End Automated Browser Tests (Playwright)

Executed across headless desktop Chromium, Firefox, and WebKit:
- **`smoke.spec.ts`:** Title screen $\to$ Start $\to$ Briefing $\to$ Canvas mount $\to$ Pause $\to$ Resume $\to$ Quit cleanly.
- **`audio_unlock.spec.ts`:** Web Audio context initializes in suspended state and resumes cleanly on first interaction without console warnings.
- **`privacy_zero_network.spec.ts`:** Launches game, plays through combat, and asserts **zero** outbound network requests (telemetry, pings, ads) occur.
- **`keyboard_accessibility.spec.ts`:** Completes full navigation of menus, settings toggles, and 3-card upgrade selection using keyboard alone (`Tab`, `Shift+Tab`, `Arrow keys`, `Enter`, `Escape`, `1-3`, `R`, `S`).

---

## 7. Performance & Stress Benchmark Protocols

### 7.1 120-Second Stress Protocol (Profile C from PREPRODUCTION.md §3)
- **Parameters:** 200 active enemies, 300 active projectiles, 150 pickups, active glow particles, weather overlay.
- **Execution Conditions:**
  - Tested at **`devicePixelRatio = 1`** and **`devicePixelRatio = 2`**.
  - Tested in **Google Chrome** and **Mozilla Firefox**.
  - Tested with **Browser DevTools closed** to prevent debugger overhead.
- **Pass Criteria:**
  - Average Framerate $\ge 58.0\text{ FPS}$ on standard desktop hardware.
  - Simulation Tick Time $\le 3.0\text{ ms}$ at peak load.
  - Canvas Render Time $\le 8.0\text{ ms}$ at peak load.

### 7.2 Developer Tools & Replay Recorder Verification
- **F1–F10 Debug Key Verification:**
  - `F1`: Performance overlay displays FPS, tick ms, render ms, entity counts.
  - `F2/F3/F4`: Pause, single-step tick, cycle timescale ($0.25\times$ to $8\times$).
  - `F5/F6`: God mode toggle, kill-all enemies.
  - `F7`: Force level-up.
  - `F8`: Hitbox and spawn ring visualizer.
  - `F9`: Replay recorder exports seed + input command stream JSON.
  - `F10`: Run log exporter exports structured JSON.
- **Dead-Code Elimination Gate:** Automated test scans `dist/` production bundle for marker string `__NB_DEBUG__` and fails if detected.

### 7.3 The 3 Canonical Kill Criteria (from PREPRODUCTION.md §2)
Checked during Spike S3 and the Chapter 1 Vertical Slice (Milestone D2):
1. **Engagement Gate:** Fewer than 2 of 3 testers want to keep playing after 5 minutes, even after tuning, mandates stopping to rework the core movement/combat loop before proceeding to Milestone A.
2. **Upgrade Impact Gate:** Fewer than 2 of 3 testers can state what their last upgrade did indicates that upgrade card presentations or numeric values are too weak.
3. **Readability Gate:** Testers unable to identify what killed them in more than one-third of total deaths indicates a failure of visual clarity and readability (violating Pillar 1).

---

## 8. Continuous Integration (CI) Workflow Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):
```yaml
name: CI
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run validate:content
      - run: npm run test
      - run: npm run build
      - name: Verify Bundle Budget (<= 350 KB gzip)
        run: node scripts/check-bundle-size.mjs
      - name: Verify Dead-Code Elimination
        run: node scripts/verify-no-debug.mjs
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## 9. Release Acceptance Criteria Checklist (v1.0 RC Sign-Off)

```markdown
- [ ] 1. Full 5-chapter campaign can be started, saved, continued, replayed, and completed.
- [ ] 2. Chapter 1 teaches the core loop without a tutorial wall.
- [ ] 3. Every chapter has a story purpose, a distinct gameplay change, and a meaningful reward.
- [ ] 4. Every ability and upgrade works, renders, has localized text, and has been tested in combinations.
- [ ] 5. The final boss (Stormroot) is readable, beatable, and tested with ordinary builds.
- [ ] 6. Victory, defeat, pause, restart, phase retry, chapter unlock, save reset, and corrupt recovery work.
- [ ] 7. No stuck pause, orphaned timer, broken restart, missing asset, runaway spawning, or uncaught error.
- [ ] 8. The interface scales uniformly (1280x720 logical) with safe-area insets (`env(safe-area-inset-*)`). Unsupported touch/gamepad on web v1 is stated clearly; touch targets $\ge 48\times 48\text{ px}$ are verified for mobile wrapper readiness.
- [ ] 9. Keyboard navigation, visible focus, touch targets, and lifecycle auto-pause (`visibilitychange` / `AudioContext.suspend()`) work. Reduced flashes/motion work.
- [ ] 10. No uncredited or unclear-license assets. Credits screen and CREDITS.md exist.
- [ ] 11. Typecheck, lint, test, validate:content, and build pass. Production bundle <= 350 KB gzipped.
- [ ] 12. README documents setup, commands, controls, supported browsers, accessibility, credits, limitations.
```

---

## 10. Release & Legal Checklist (from PREPRODUCTION.md §12)

```markdown
- [ ] Name Check: Search "NIGHTBLOOM" on itch.io, Steam, and trademark databases for target distribution regions.
- [ ] Code License: Standard open source license (e.g. MIT) or proprietary notice in LICENSE file (clarifying it does not cover third-party assets).
- [ ] Font Licensing: Open-license fonts only (e.g. OFL) credited in CREDITS.md, or clean system-ui fallback stack.
- [ ] Asset & Audio Attribution: 100% procedural code, or third-party CC0 assets credited with origin URLs and license terms in CREDITS.md.
- [ ] Static Hosting Verification: itch.io HTML5 upload, GitHub Pages, or edge CDN build verified with relative-path resolution.
- [ ] Store Page Assets: Short gameplay capture GIF/WebP, 3–5 high-contrast screenshots, and 1-paragraph summary.
- [ ] Privacy Policy Statement: "No data collected. Game progress and settings are stored locally in your browser only."
- [ ] Versioning & Changelog: Version constant in package.json, CHANGELOG.md updated, and version string visible on Credits screen.
```


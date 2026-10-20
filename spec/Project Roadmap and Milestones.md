# NIGHTBLOOM: The Last Signal — Project Roadmap and Milestones

**Project Name:** NIGHTBLOOM: The Last Signal  
**Target Completion:** Production Release v1.0  
**Methodology:** 12 Phase-Gated Milestones with Approval Checkpoints, Operational Prompts, and Playtest Gates  
**Document Status:** Approved Specification v1.0  
**Authority:** This document expands `MILESTONE_PROMPTS.md` and `PREPRODUCTION.md`. On any conflict, those source documents win.

---

## 1. Milestone Roadmap Graph

```text
[Milestone 0: Pre-Production Spikes (S1-S5)]
                     |
                     v (Spikes Verified & Decisions Recorded)
[Milestone A: Project & Movement]
                     |
                     v
[Milestone B: Core Combat]
                     |
                     v
[Milestone C: XP & Upgrades]
                     |
                     v
[Milestone D1: Chapter Foundation & Save]
                     |
                     v
[Milestone D2: Full Chapter 1 (Vertical Slice)]
                     |
                     +---> [Vertical-Slice Gate: 4/5 Testers Finish Ch1]
                     |
[Milestone E1: Thornrunner, Rustwing, Chapters 2 & 3]
                     |
                     v
[Milestone E2: Briarheart, Wren, Chapter 4]
                     |
                     v
[Milestone E3: Stormroot & Chapter 5 (Campaign Climax)]
                     |
                     v
[Milestone F1: Art & Audio Pass (Vector Art, Portraits, Drones)]
                     |
                     v
[Milestone F2: UI, Settings & Accessibility (Full Keyboard Flow)]
                     |
                     v
[Milestone F3: Release Hardening & Acceptance (Final Bot Balance 30 Seeds)]
```

---

## 2. Milestone Specifications

### Milestone 0 — Pre-Production Spikes
- **Objective:** De-risk engine performance, visual styling, combat feel, audio synthesis, and math balance before writing production code.
- **Spikes:**
  - `S1 (Performance)`: Canvas 2D stress test holding $\ge 58\text{ FPS}$ on desktop Chrome/Firefox with 200 enemies, 300 projectiles, 150 pickups.
  - `S2 (Art)`: Procedural vector sprites from theme tokens; silhouette clarity; 3:1 luminance contrast against ground terrain across color-blindness modes.
  - `S3 (Feel)`: 5-minute playable prototype tested by 3 players with no coaching (Playtest P1); validates kiting, weapon rhythm, and card impact.
  - `S4 (Sound)`: Web Audio synthesis latency, bus routing, and procedural oscillator sound recipes.
  - `S5 (Balance Bot)`: Headless simulation script running 30 seeds per chapter to validate XP curve, live enemy counts, and damage pacing.
- **Exit Gate:** Pass/fail recorded in `PREPRODUCTION.md`; open decisions (O1–O10) resolved in `DECISIONS.md`.

---

### Milestone A — Project and Movement
- **Scope:**
  - Initialize Vite + React 18 + TypeScript (strict mode), ESLint, Prettier, Vitest, and npm scripts.
  - Folder structure following `CLAUDE.md`: `content/`, `game/`, `ui/`, `services/`, `storage/`.
  - Central theme tokens (`src/content/theme`), string catalog (`src/content/locales/en.ts`), and config.
  - Single `requestAnimationFrame` loop with fixed 60 Hz accumulator and 100 ms delta clamp.
  - Deterministic seeded PRNG (mulberry32) with unit tests.
  - Render layered field on Canvas 2D using tokens (ground, flower patches, beacon).
  - Mira 8-directional movement with smooth camera follow bounded within 3200×2400 px.
  - Minimal React title screen and game screen with clean disposal of loop and listeners.
  - README with setup, commands, and controls.
- **Done When:** `typecheck`, `lint`, `test`, `build` all pass; player moves Mira at 60 FPS and can return to title with no console errors.

---

### Milestone B — Core Combat
- **Scope:**
  - Seedling enemy data definition and direct chase behavior module.
  - Safe spawn system near camera boundary: never on player, never inside obstacles, leaving an escape route.
  - Uniform-grid spatial hash for $O(1)$ collision queries.
  - Contact damage, Mira health, hit invulnerability (0.6s), hit feedback, health HUD.
  - Signal Flare auto-attack targeting nearest enemy in range (420 px), projectile hits, enemy defeat, glow-seed drops, and magnetic pickup drift.
  - Procedural vector sprites via `SpriteFactory`, plus first minimal Web Audio set (shot, hit, pickup).
  - Unit tests for targeting, spawn safety, damage, and spatial hash.
- **Done When:** 60 FPS combat against 50+ Seedlings; player can fight, die, and restart cleanly.

---

### Milestone C — XP and Upgrades
- **Scope:**
  - XP curve config table, XP bar, level-up simulation pause.
  - 3-card level-up UI with keyboard navigation (arrows + Enter, keys 1–3), reroll (1 per chapter), and skip (heals 25% max HP).
  - Data-driven upgrade pool with Zod schemas, max levels, `add`/`multiply`/`grant_ability`/`set_flag` effect model, and fallback cards (Field Rations, Score Bonus).
  - Ability slots (3) with Signal Flare locked in slot 1.
  - Beacon Pulse on Spacebar (configurable binding) with cooldown indicator.
  - Dynamic description strings formatted from data values.
  - Tests for XP thresholds, distinct cards, fallbacks, effect application, cooldowns, no double-pick, and no stuck pause.
- **Done When:** Player levels up several times in a run, chooses/rerolls/skips cards, and activates Beacon Pulse.

---

### Milestone D1 — Chapter Foundation and Save
- **Scope:**
  - Chapter, phase, objective, and wave-schedule schemas with Zod and cross-reference validation (`npm run validate:content`).
  - Objective system: `survive_timer` first, with architectural room for `defend_entity`, `collect_item`, and `defeat_boss`.
  - In-memory phase snapshots and instant Retry-from-Phase on defeat; starting picks per chapter.
  - Story/interlude cards and bark system skeleton (data model, cooldowns, one-at-a-time display) using `CHARACTERS.md` strings.
  - `SaveService` with `schemaVersion`, Zod validation, migrations, and graceful recovery. Title screen Start/Continue/Chapter Select and Results screen.
  - Scoring system (formula, local best records, rank thresholds).
  - Tests for save validation, corrupt recovery, phase retry restore, wave determinism, bark cooldowns, and scoring.
- **Done When:** A stub chapter plays start to finish, win/lose reach Results, and Continue restores save after page reload.

---

### Milestone D2 — Full Chapter 1
- **Scope:**
  - Full Chapter 1 as data: four phases totalling 660 s (11 min), tutorial captions, Bloomed Seedling variant, Beacon Pulse prompt, storm surge ending.
  - Field Ledger screen with Seedling and Bloomed Seedling entries and Chapter 1 reward (Ledger plus Pickup Radius upgrade unlocked in save).
  - Chapter 1 story cards, radio captions and barks from `STORY_BIBLE.md` and `CHARACTERS.md`.
  - Balance pass against Chapter 1 targets (GDD §9). Add the headless balance bot and clear-rate report.
  - Integration test running Chapter 1 headlessly with a fixed seed.
  - Story props per `STORY_BIBLE.md` §9: Old Core pylon at growth stage 0, bloom-glow warning before each surge, night label on chapter cards.
- **Done When:** All quality gates pass; Chapter 1 is playable end-to-end (~11 minutes), reward earned, persists after reload, and replayable.
- **Vertical-Slice Gate:** At least 4 of 5 playtesters finish Chapter 1 ($\ge 80\%$), $\ge 3$ want to continue, performance holds at 60 FPS, zero blocker bugs.

---

### Milestone E1 — Thornrunner, Rustwing, Chapters 2 and 3
- **Scope:**
  - Thornrunner (150 px/s, contact 5) and Rustwing (70 px/s, projectile 8, range 380 px) enemies with telegraphs, projectiles, visuals and sounds, plus their Ledger entries.
  - Telegraphed gust lane hazard, `collect_item` objective (Coil Run ~40% map width away) and `defend_entity` objective (Nightbloom Patch, 300 integrity), including fail states.
  - Coil Arc and Bloomguard abilities with their upgrades and unlock rules.
  - Chapters 2 and 3 as data using existing systems and shared map framework, with chapter-specific lighting, weather and props.
  - Chapter story cards, radio and barks from `STORY_BIBLE.md` (chapter scripts) and `CHARACTERS.md` (barks).
  - Tests for each new behavior, both objectives and unlock flow, and bot clear-rate checks against GDD targets.
  - Story props: Old Core at growth stages 1 and 2, wind front cutting Tavi off in Chapter 2, quiet-water margin (patch stays dark) in Chapter 3.
- **Done When:** All quality gates pass; Chapters 2 and 3 play start to finish with working rewards.

---

### Milestone E2 — Briarheart, Wren, Chapter 4
- **Scope:**
  - Briarheart elite (220 HP, 40 px/s, ground slam 22, 1.1s ring telegraph) with visuals, sounds, and Ledger entry.
  - Wren follower turret ability (offset (40, -40) px, interval 1.0s, damage 6, range 300 px) and its upgrades.
  - Backup relay `defend_entity` phase with visible countdown (integrity 400).
  - Chapter 4 as data, including Idris radio lines if enabled.
  - Ability-slot pressure: verify choice of two among Coil Arc, Bloomguard, and Wren works in UI and is tested.
  - Tests and bot clear-rate checks against GDD targets.
  - Story props: Old Core at growth stage 3, backup relay routed through Old Core amplifier with visibly stronger surge afterwards, Wren crossing the wind front.
- **Done When:** All quality gates pass; Chapter 4 plays start to finish with working rewards.

---

### Milestone E3 — Stormroot and Chapter 5
- **Scope:**
  - Stormroot boss with health bar, 3 HP-threshold phases (100%, 66%, 33%), Root Lash (1.0s), Spore Ring (0.8s), Gale Pull (1.2s) with distinct telegraphs, recovery windows (2.5s / 2.0s with +25% damage), and phase colors/sounds. Beacon Pulse must cancel Gale Pull.
  - `defeat_boss_or_survive_timer` objective with 300 s Signal Lock countdown and both ending variants.
  - Chapter 5 as data (four phases, 16.5 min = 990 s), ending sequence, Dawn Signal emblem, and Score Attack mode.
  - Campaign completion screen with campaign stats.
  - Boss tests with at least three different builds using balance bot, plus phase-retry coverage for Chapter 5.
  - Story: Old Core becomes Stormroot (growth stage 4, then boss), Signal Lock presented as Tavi's antiphase lock and convoy approach, ending sequence in `STORY_BIBLE.md` §10 plays, including Mira switching beacon off.
- **Done When:** All quality gates pass; full campaign can be completed from a fresh save.

---

### Milestone F1 — Art and Audio Pass
- **Scope:**
  - Replace remaining placeholder shapes with deliberate procedural vector art set from GDD asset list. Keep one consistent style.
  - Layered portrait components for Mira, Sela, Tavi, and Idris with three emotion states (neutral, worried, relieved).
  - Weather overlays and chapter lighting variants. Respect reduced flashes/motion.
  - Full Web Audio SFX set, ambient drone, and boss phase layer. Volume controls work.
  - Asset manifest, loader with dev warnings and production fallbacks. `CREDITS.md` updated for every external asset (or "none").
- **Done When:** All quality gates pass; no placeholder art remains.

---

### Milestone F2 — UI, Settings and Accessibility
- **Scope:**
  - Finish every screen in GDD §8.1, including Credits/Notices and Chapter Select with clear locked states.
  - Settings: master/sfx/ambient volumes, screen shake, reduced flashes/motion, high contrast, key reference, rebind Beacon Pulse, reset save with confirmation.
  - Keyboard navigation, visible focus, and accessible labels everywhere. No information by color alone.
  - Responsive layout with safe-area insets (`env(safe-area-inset-*)`), minimum 48×48 px touch targets on interactive controls (WCAG 2.5.5 / 2.5.8), and desktop-keyboard advisory on narrow/touch devices (preparing for post-v1 mobile wrapper deployment).
  - Playwright smoke test for the full UI flow.
- **Done When:** All quality gates pass; complete full UI flow with keyboard alone.

---

### Milestone F3 — Release Hardening & Acceptance
- **Scope:**
  - Walk all 12 v1 acceptance criteria from GDD §11 and report pass/fail evidence.
  - Eliminate stuck-pause states, orphaned timers, broken restarts, and memory leaks.
  - Verify performance budgets ($\le 350\text{ KB}$ gzip JS bundle, $\le 2\text{ s}$ load, $\le 3\text{ ms}$ tick, $\le 8\text{ ms}$ render).
  - Run Playwright E2E smoke tests on Chromium, Firefox, WebKit with network blocked.
  - Verify complete README and `CREDITS.md`.
- **Done When:** Every acceptance criterion passes; CI green on all checks.

---

## 3. Operational Prompt Workflows

These standard prompts govern day-to-day milestone execution:

### 3.1 Review Prompt (Run after every milestone)
```text
Review what you just built against CLAUDE.md and docs/GDD.md. Do not add features.

Check and report:
1. Any file over about 300 lines or doing unrelated work.
2. Any hard-coded color, user-facing string or balance number.
3. Any simulation code that imports React, uses Math.random or leaks timers/listeners.
4. Missing tests for new logic.
5. Anything from the milestone scope that is not finished.
6. Any story text, string ID or term that disagrees with docs/STORY_BIBLE.md (glossary, tic budgets, ETAs).

Fix real violations, rerun all quality gates, and report the results.
```

### 3.2 Balance Prompt (Run when tuning difficulty)
```text
Run the balance bot on Chapter N with at least 30 seeds and report: clear rate, average player level at end, peak live enemies, and median time of first damage.
Compare to GDD section 9. Propose config-only changes (spawn rates, mixes, stat multipliers), apply them, rerun, and show before and after. Do not change engine code.
```

### 3.3 Scope-Guard Prompt (Run if scope starts expanding)
```text
Stop. Compare your current changes to the milestone scope. List what is out of scope, revert it or move it to a "Deferred" list in README.md, and continue with only the milestone scope.
```

### 3.4 Open Decisions Register (from PREPRODUCTION.md §14.1)
| # | Decision | Recommendation | Decided After |
|---|---|---|---|
| **O1** | Level-up cadence vs level targets (F1) | Front-loaded curve (30s, 85s, 140s, then ~90s); adhere to GDD §9 targets | Spike S3 |
| **O2** | Viewport and scaling (F3) | Fixed 1280×720 logical, uniform letterbox scaling | Spikes S1, S3 |
| **O3** | Render interpolation on high-refresh displays | Interpolate if cheap and S3 shows micro-judder | Spikes S1, S3 |
| **O4** | Ability slot pressure begins in Ch5 (F2) | Keep as designed, or add second ability slot at Lv 6 so choices begin in Ch3 | Spike S3 |
| **O5** | Peak-live targets vs capacity (F6) | Treat as density and performance goals; tune difficulty via bot clear rate | Spikes S1, S3, Bot |
| **O6** | First Flare Damage pick reaches 14 (F4) | Make level 1 = +40% (14 dmg) so first pick is immediately felt, then +20% | Spike S3 |
| **O7** | Art path | Procedural vector sprites from theme tokens; fallback to SVG | Spike S2 |
| **O8** | Audio path | Procedural Web Audio oscillator synthesis; fallback to CC0 audio | Spike S4 |
| **O9** | Enemy cap and bot speed | Hard cap 200 entities; bot target $\ge 30\times$ real time | Spikes S1, S5 |
| **O10** | Name check and code license | Perform itch.io/trademark check; select open license for engine code | Milestone F |

### 3.5 Balance Model Findings (from PREPRODUCTION.md §4)
| # | Finding | Pacing & Mathematical Data | Action / Resolution |
|---|---|---|---|
| **F1** | **Level-Up Cadence vs Targets:** GDD 4.5 pacing gives 9–14 level-ups in Ch1 (end Lv 10–15), exceeding target Lv 8–10 (needs 78–105s avg). | Ch1 needs 7–9 level-ups total | Front-loaded curve: 30s, 85s, 140s, then ~90s yields 8 level-ups (Level 9). (O1) |
| **F2** | **Slot Pressure Timing:** Coil Arc unlocks post-Ch2, Bloomguard post-Ch3, Wren post-Ch4. All three only compete from Chapter 5. | 3 slots with Signal Flare permanent | Confirmed: Ch5 is where build choice is forced. (O4) |
| **F3** | **Spawn Distance vs Range:** Spawns on 704×424 px boundary ring; nearest is 424 px vs 420 px Flare range. Seedling travel time ~11.6s. | Average spawn distance 638 px | Fixed 1280×720 viewport ensures consistent threat arrival across all screen sizes. (O2) |
| **F4** | **Damage Breakpoints:** Seedlings (14 HP) become 1-shot at 14 dmg (Flare Lv 2). Bloomed Seedlings require 4, 3, 3, 2 shots at Lv 0–3. | Kill rate doubles at 14 dmg | Level 1 Flare Damage tuning considered in O6. |
| **F5** | **Coil Arc Potential:** 4-target chain outputs 22.9 DPS vs 12.5 DPS baseline Flare. | 1.8× base Flare DPS | Monitored by balance bot in Milestone E1. |
| **F6** | **Peak-Live Targets vs Standing:** Standing player holds 14–35 enemies in Ch1 vs target 25–40. | Genre relies on active kiting | Difficulty tuned via mobile kiting bot clear rates, not standing capacity. (O5) |
| **F7** | **Onboarding Pacing:** Base Flare kills 0.56 Seedlings/s. Standing holds 0.43/s. Phase 1 spawns $\le 0.35/\text{s}$. | First XP threshold ~11 XP | Tuned in Milestone C and D2 wave data. |
| **F8** | **Bot Simulation Budget:** 30 seeds of 13m chapter = 6.5 hours of combat. At $30\times$ speed, runs in 13 mins. | Needs avg tick $\le 0.56\text{ ms}$ | Verified in Spike S5. |

---

## 4. Playtest Plan & Run Log Specification

### 4.1 Playtest Schedule
| Round | Phase | Participants | Protocol |
|---|---|---|---|
| **P1** | Spike S3 in Milestone 0 | 3 players | 5 minutes, no coaching; assess basic kiting and card feel |
| **P2** | After Milestone D2 | 5 players | Full Chapter 1; vertical-slice gate verification |
| **P3** | After Milestone E2 | 5 players | Either Chapter 3 or Chapter 4 |
| **P4** | After Milestone F3 | 5 players | Complete 5-chapter campaign across two sittings |

**Observer Protocol:** Do not explain the game. Watch silently. Ask players to think aloud. Post-play debrief:
1. *What killed you?*
2. *What did your last upgrade do?*
3. *Would you keep playing?*

### 4.2 Run Log JSON Schema (from PREPRODUCTION.md §11)
Exported via `F10` in dev mode or "Copy run log" on the Results screen (user-triggered, never sent over network):
```json
{
  "schema": 1,
  "build": "1.0.0",
  "seed": 849201,
  "chapterId": "ch1",
  "result": "defeat",
  "deathCause": { "sourceId": "seedling", "phaseId": "ch1_p3" },
  "durationSec": 412.5,
  "finalLevel": 7,
  "kills": { "seedling": 301, "bloomed_seedling": 12 },
  "picks": [
    { "tSec": 31.8, "level": 2, "offered": ["flare_damage", "move_speed", "field_rations"], "chosen": "flare_damage" }
  ],
  "damageTaken": [
    { "tSec": 120.4, "sourceId": "seedling", "amount": 6 }
  ],
  "perf": { "avgFps": 59.8, "p99FrameMs": 21.2, "maxEnemies": 87 },
  "settings": { "reducedFlashes": false, "highContrast": false }
}
```

---

## 5. Risk Register (13 Project Risks from PREPRODUCTION.md §9)

| # | Risk | Likelihood | Impact | Early Signal | Mitigation Strategy |
|---|---|---|---|---|---|
| **R1** | Canvas 2D cannot hold peak enemy counts | Medium | High | Spike S1 | Fallback ladder in S1; throttle or lower live enemy cap |
| **R2** | Procedural art looks cheap | Medium | High | Spike S2 | Hybrid SVG or CC0 characters |
| **R3** | The core loop is not fun | Medium | High | Spike S3 | Rework movement and auto-attack loop before Milestone A |
| **R4** | Balance across 5 chapters takes longer than build | High | Medium | Bot clear rates | Bot first (30 seeds/ch), config-only tuning, targeted playtests |
| **R5** | Same field for 67 minutes feels repetitive | Medium | Medium | Ch 1 slice test | Hazards, objectives, lighting themes, and chapter props carry variety |
| **R6** | Agent drift or scope creep | Medium | Medium | Review prompt | One milestone per session, approval gates, Scope-Guard prompt |
| **R7** | Final boss unreadable | Medium | High | Milestone E3 | Telegraph tests, grayscale and color-blindness validation |
| **R8** | Synthesized Web Audio sounds poor | Medium | Medium | Spike S4 | Fall back to lightweight CC0 audio files |
| **R9** | Save or migration bugs corrupt player progress | Low | High | Migration tests | Backup-before-migrate pattern, automated corrupt save recovery |
| **R10** | Browser differences (Safari audio unlock, key handling) | Medium | Medium | S1, S4 | Cross-browser test matrix, first-click audio unlock handler |
| **R11** | Keyboard ghosting (diagonal + Space on cheap keyboards) | Low | Medium | Playtests | Rebindable Beacon Pulse key in settings, alternate defaults |
| **R12** | Screen size changes difficulty | High | Medium | Spike F3 | Fixed 1280×720 logical viewport with uniform letterboxing |
| **R13** | Level cadence and difficulty targets disagree | High | Medium | Spike F1 | Config table XP curves tuned against target pacing |

---

## 6. Scope Tiers & Prioritized Cut List

- **Must (In Scope for v1):** 5 playable chapters, Signal Flare + Beacon Pulse, 3 unlockable abilities, 4 enemies + Bloomed variant + Stormroot boss, upgrades with caps/fallbacks, phase retry, versioned save, settings & accessibility, credits.
- **Should:** Field Ledger screen, barks, Idris Kael radio, chapter lighting/weather variants, rank letters.
- **Could:** Score Attack mode, extra Ledger lore entries beyond 12.
- **Cut Order (if time runs short):** Score Attack $\to$ Idris radio $\to$ extra Ledger lore $\to$ barks beyond 12 $\to$ weather variants $\to$ rank letters. *The Chapter 5 Stormroot encounter and narrative ending are never cut.*

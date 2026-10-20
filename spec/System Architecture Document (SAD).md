# NIGHTBLOOM: The Last Signal — System Architecture Document (SAD)

**Project Name:** NIGHTBLOOM: The Last Signal  
**Target Platform:** Modern Desktop Web Browsers (Chrome, Firefox, Safari, Edge)  
**Stack:** React 18+, TypeScript (Strict), Vite, Canvas 2D, Web Audio API  
**Document Status:** Approved Specification v1.0  
**Authority:** This document restates and expands `ARCHITECTURE.md`. It defines structure, engine contracts, state machines, and data pipelines. On any conflict, `ARCHITECTURE.md` wins.

---

## 1. Architectural Philosophy & Layered Structure

### 1.1 Core Principles
1. **Simulation-UI Decoupling:** The simulation is 100% pure TypeScript. It contains zero imports from React, DOM APIs (`window`, `document`), Canvas 2D, or Web Audio.
2. **Deterministic Execution:** Simulation updates occur on a fixed 60 Hz tick driven by an injected seeded PRNG (mulberry32). Simulation time is derived exclusively from the tick counter, never from `Date.now()` or `performance.now()`.
3. **Unidirectional Downward Dependency:** Imports strictly flow downwards through architectural layers. Violations are enforced via ESLint `no-restricted-imports`.
4. **Headless Execution:** Because simulation logic has zero browser-specific dependencies, the exact same simulation code runs client-side in Canvas 2D and headlessly in Node.js/Bun for automated balance testing and CI verification.
5. **Data-Driven Composition:** Content records (chapters, enemies, abilities, upgrades, dialogue, barks) are data loaded from content packs and validated with Zod, keeping gameplay code decoupled from content definitions.

### 1.2 System Layering Diagram

```text
+---------------------------------------------------------------------------------------+
|                                    APP / UI LAYER                                     |
|  (React 18 Shell, Screens, Menus, Settings, Accessible Overlays, HUD Components)      |
+---------------------------------------------------------------------------------------+
                                           |  (Subscribes to HUD Snapshots @ 10 Hz)
                                           v
+---------------------------------------------------------------------------------------+
|                                     CORE LAYER                                        |
|  (GameController, rAF Loop, Fixed-Step Accumulator, Command Dispatch, Event Bus)      |
+---------------------------------------------------------------------------------------+
          |                                                       |
          v                                                       v
+----------------------------------+            +---------------------------------------+
|         RENDERING LAYER          |            |           SIMULATION LAYER            |
|  (Canvas 2D, Camera, Atlas,      |            |  (Entities, Combat, Spawning, XP,     |
|   SpriteFactory, Render Pipeline)|            |   Upgrades, Spatial Hash, Objectives) |
+----------------------------------+            +---------------------------------------+
          |                                                       |
          +-----------------------+       +-----------------------+
                                  v       v
+---------------------------------------------------------------------------------------+
|                                   CONTENT & DATA                                      |
|  (Content Packs, Typed Registries, Zod Schemas, Theme Tokens, Localization Strings)   |
+---------------------------------------------------------------------------------------+
                                          ^
                                          |
+---------------------------------------------------------------------------------------+
|                                  STORAGE & SERVICES                                   |
|  (SaveService, StorageAdapter, AudioService, SettingsService, AssetLoader)            |
+---------------------------------------------------------------------------------------+
```

---

## 2. Module Responsibilities & Boundary Enforcement

| Layer | Path | Allowed Imports | Forbidden Imports | Enforcement |
|---|---|---|---|---|
| **Content** | `src/content/` | Utility functions, Zod schemas | `game/`, `ui/`, `app/`, `rendering/`, `services/` | ESLint `no-restricted-imports` |
| **Simulation**| `src/game/simulation/` | `src/content/`, math/seeded RNG utils | React, DOM (`document`, `window`), Canvas, Audio, `services/` | ESLint `no-restricted-imports` |
| **Core** | `src/game/core/` | `src/game/simulation/`, `src/services/` interfaces, `src/content/` | Direct React components, direct DOM mutation | ESLint `no-restricted-imports` |
| **Rendering** | `src/game/rendering/` | Read-only simulation types and snapshots, theme tokens | React components, simulation state mutation | ESLint `no-restricted-imports` |
| **Services** | `src/services/` | `src/content/`, `src/storage/` interfaces | `src/game/simulation/`, React components | ESLint `no-restricted-imports` |
| **Storage** | `src/storage/` | Zod schemas, storage interfaces | `src/game/`, React components | ESLint `no-restricted-imports` |
| **App & UI** | `src/app/`, `src/ui/` | `src/game/core/` controller API, snapshot types, services | Direct simulation internal mutations | ESLint `no-restricted-imports` |

### 2.1 Canonical Source Directory Layout (from CLAUDE.md)
```text
src/
  app/                 # App shell, screen state, providers
  game/
    core/              # GameController, loop, clock, typed events
    simulation/        # Combat, collision, spawning, XP, upgrades, chapters, scoring, objectives, barks
    entities/          # Player, enemies, boss, projectiles, pickups
    input/             # Input manager, bindings
    rendering/         # Canvas renderer, camera, sprite factory/atlas, effects
    content/           # Schemas, validators, chapter/enemy/ability/upgrade/bark data
  ui/
    screens/           # Title, briefing, game, pause, upgrade, results, settings, credits
    components/        # HUD bars, cards, icons, buttons, banners, portraits
  content/
    locales/           # en.ts string catalog
    theme/             # Color + design tokens shared by DOM and Canvas
  assets/              # manifest.ts, sprites, audio, fonts
  services/            # Asset loader, audio, settings, save
  storage/             # Save schemas, validation, migrations
  styles/              # Global styles, UI CSS
  tests/
    unit/
    integration/
    e2e/
```

---


## 3. Game Loop & Frame Scheduling

The main application loop coordinates the browser refresh rate with the fixed simulation tick:

```text
           requestAnimationFrame(timestamp)
                         |
                         v
             Calculate delta = (timestamp - lastTimestamp)
             Clamp delta to max 100 ms (prevent spiral of death on tab-switch)
                         |
                         v
             accumulator += delta
                         |
      +------------------+------------------+
      |                                     |
      v                                     v
While accumulator >= 16.667 ms         accumulator < 16.667 ms
(max 5 catch-up sub-steps)                  |
      |                                     v
SimulateTick(60 Hz, dt=0.01667 s)      InterpolateAlpha = accumulator / 16.667 ms
      |                                     |
accumulator -= 16.667 ms                    v
                                      RenderCanvas(alpha)
                                            |
                                      Throttle HUD Snapshot (10 Hz) -> React
```

- **Fixed Timestep:** $dt = 1/60\text{ s} \approx 16.667\text{ ms}$.
- **Spiral of Death Prevention:** Catch-up steps clamped to a maximum of 5 sub-steps per frame.
- **Render Interpolation:** Render state blends previous and current tick transforms using $\alpha = \frac{\text{accumulator}}{dt}$ to eliminate visual stutter on 144 Hz+ high-refresh-rate displays.

---

## 4. State Machines

All application state transitions follow explicit, typed state machines. No scattered or ambiguous boolean flags (`isPaused`, `isLevelingUp`).

### 4.1 Application Flow State Machine (`AppState`)

Managed by a centralized reducer at the React application root:

| From | Event | To | Notes |
|---|---|---|---|
| `boot` | `assets_ready` | `title` | Initial asset recipes synthesized, save loaded |
| `title` | `start` / `continue` | `briefing(chapterId)` | Starts Chapter 1 or continues from current save |
| `title` | `open_chapter_select` | `chapter_select` | Displays unlocked chapters |
| `title` | `open_settings` | `settings` | Submenu; `back` returns to `title` |
| `title` | `open_how_to_play` | `how_to_play` | Controls & tutorial reference; `back` returns to `title` |
| `title` | `open_credits` | `credits` | Legal notices and credits; `back` returns to `title` |
| `title` | `open_ledger` | `field_ledger` | Field lore catalog; `back` returns to `title` |
| `chapter_select` | `choose(chapterId)` | `briefing(chapterId)` | Unlocked chapters only |
| `briefing` | `begin` | `run(chapterId)` | Starts combat simulation |
| `run` | `run_finished(result)` | `results(result)` | Emitted on victory or defeat |
| `results` | `continue` (victory, next chapter exists) | `briefing(nextChapterId)` | Advance campaign |
| `results` | `continue` (final chapter victory) | `ending` → `campaign_complete` → `title` | Campaign completed, unlocks Score Attack |
| `results` | `retry_phase` / `restart_chapter` | `run(chapterId)` | Restores phase snapshot or restarts chapter clean |
| `results` | `title` | `title` | Return to main menu |

### 4.2 Run-Level Combat State Machine (`RunState`)

The in-match simulation cycles strictly through typed phases:

| From | Event | To | Simulation Clock |
|---|---|---|---|
| `loading` | `ready` | `story_card` (chapter intro) | Stopped |
| `story_card` | `dismiss` | `starting_picks` (if picks remain), else `playing` | Stopped |
| `starting_picks` | `pick_chosen` (last pick) | `playing` | Stopped |
| `playing` | `xp_threshold_crossed` | `levelup` (queued; repeats if more pending) | Paused |
| `levelup` | `pick_chosen` / `skip` | `playing` (or `levelup` again if queued) | Paused → Resumed |
| `playing` | `pause` | `paused` | Paused |
| `paused` | `resume` | `playing` | Resumed |
| `paused` | `quit` / `restart` | `disposed` | Cleaned up |
| `playing` | `story_beat_requires_card` | `story_card` → back to `playing` | Paused → Resumed |
| `playing` | `objective_completed` (not last) | `phase_transition` → `playing` | Brief lull |
| `playing` | `objective_completed` (last) | `victory` | Stopped |
| `playing` | `player_dead` / `entity_destroyed` | `defeat` | Stopped |

**Execution Rules:**
- The simulation advances **only** in `playing`. The simulation clock, combat timers, and wave schedules freeze in all other states.
- Every non-`playing` state has an explicit exit. All states are enumerated in unit tests to guarantee no dead ends (preventing stuck pause).
- `Escape` is ignored in `levelup` and `story_card` except to skip allowed text. Double-picks are rejected by state logic, not by UI debouncing.
- A phase snapshot is taken upon entry to each phase to support phase retries without resetting the entire chapter.

### 4.3 Phase and Objective Lifecycle
- Lifecycle: `pending → active → completed | failed`.
- `failed` only triggers when `defend_entity` integrity reaches 0, routing immediately to run `defeat`.
- `survive_timer` and `collect_item` transition to `completed` upon meeting their respective targets.
- `defeat_boss_or_survive_timer` completes whenever Stormroot's core is destroyed **or** the 300 s Signal Lock timer expires.

### 4.4 Boss State Machine (`Stormroot`)
```text
dormant → intro → idle → telegraph(attackId) → attack(attackId) → recovery → idle
```
- **Phase Thresholds:** At 66% HP and 33% HP, Stormroot transitions phases, updating attack pools and telegraph parameters.
- **Recovery Window:** 2.5 s in phases 1–2, shortened to 2.0 s in phase 3. During recovery, the exposed core takes **+25% damage**.
- **Signal Lock Concurrency:** A 300 s countdown runs simultaneously during Chapter 5 Phase 4. Completing the countdown or destroying the boss triggers victory.

### 4.5 Enemy Behavior State Machines
Behavior modules are pure, typed state machines driven by `behaviorId` with timings sourced from data definitions:
- `chase`: `approach` (Seedling — slow phototropic drift toward player/light).
- `dart`: `approach → crouch (telegraph) → dash → recover` (Thornrunner — skittish pack chaser).
- `hover_shoot`: `approach → hover → rotor_flare (telegraph) → fire → recover` (Rustwing — ranged hoverer).
- `slam`: `approach → windup (ring telegraph) → slam → recover` (Briarheart — heavy ground slam).

---

## 5. Engine Contracts

### 5.1 World State
`WorldState` is a plain, serializable data object containing zero class instances and zero hidden closures:
```typescript
interface WorldState {
  time: number;              // Current simulation tick count
  rng: Mulberry32State;      // Seeded PRNG internal state
  player: PlayerState;       // Mira's position, HP, invulnerability, abilities, stats
  enemies: EnemyState[];     // Active enemy entities (flat array, integer IDs)
  projectiles: Projectile[]; // Active friendly and hostile projectiles
  pickups: PickupState[];    // Glow-seeds and quest pickups drifting/on-ground
  effects: VisualEffect[];   // Active flashes, muzzle effects, hit pops
  hazards: HazardState[];    // Active gust lanes and ground telegraphs
  objective: ObjectiveState; // Current phase objective progress
  boss?: BossState;          // Active boss state (when in boss phase)
  flags: Record<string, boolean>; // Phase and story state flags
}
```
No ECS library is used. Flat arrays indexed by integer IDs keep serialization, memory snapshots, regression testing, and headless balance bots straightforward and high-performance.

### 5.2 Fixed-Tick System Execution Sequence (14 Steps)
Every 60 Hz simulation tick executes in this exact strict order:
1. **Drain Queued Commands:** Process incoming UI commands (`move_input`, `use_pulse`, etc.).
2. **Player Movement & Invulnerability:** Update player velocity, position bounds, and decrement hit i-frame timers.
3. **Spawning Systems:** Evaluate phase wave schedule, check live enemy cap (200), compute safe off-camera spawn positions.
4. **Enemy Behavior Updates:** Advance enemy state machines (`chase`, `dart`, `hover_shoot`, `slam`).
5. **Ability Updates:** Decrement cooldowns, evaluate targeting rules, fire auto-attacks (Signal Flare, Coil Arc, Bloomguard, Wren).
6. **Projectile Movement:** Move all player and enemy projectiles along their trajectories.
7. **Spatial Hash Rebuild & Collision Queries:** Clear and rebuild spatial partition cells; query overlaps between player, enemies, and projectiles.
8. **Damage Resolution & Deaths:** Apply hit damage, calculate health, trigger defeat if player HP $\le 0$, spawn glow-seeds on enemy deaths.
9. **Pickups & XP:** Move glow-seeds within pickup radius toward the player; accrue XP on collection.
10. **Level-Up Evaluation:** Check accrued XP against the config curve table; queue level-up events when thresholds are met.
11. **Hazards & Environmental Updates:** Advance gust lanes, ground telegraph timers, and boss attack areas.
12. **Objective, Phase & Boss Updates:** Update phase timers, defend-target integrity, boss HP, and Signal Lock countdown.
13. **Bark & Story Trigger Evaluation:** Check trigger conditions against global and per-bark cooldowns; request barks/dialogue.
14. **Cleanup & Event Emission:** Purge dead entities and expired effects; flush accumulated events to the event bus; emit the throttled HUD snapshot (10 Hz).

### 5.3 Typed Commands and Events

#### Commands (UI / Input → Simulation)
Dispatched through a single entry point: `controller.dispatch(command: GameCommand)`
- `move_input`: `{ vector: { x: number, y: number } }`
- `use_pulse`: `{}`
- `pause`: `{}`
- `resume`: `{}`
- `choose_upgrade`: `{ upgradeId: string }`
- `reroll`: `{}`
- `skip_levelup`: `{}`
- `dismiss_card`: `{}`
- `retry_phase`: `{}`
- `restart`: `{}`
- `quit`: `{}`

#### Events (Simulation → UI / Audio / Telemetry / HUD)
Emitted to the event bus and drained at the end of each tick:
- `enemy_killed`: `{ enemyId: string, position: Vector2D, xpValue: number }`
- `player_hit`: `{ damage: number, remainingHp: number }`
- `pickup_collected`: `{ pickupId: string, xpValue: number }`
- `level_up_ready`: `{ pendingLevel: number }`
- `ability_fired`: `{ abilityId: string, origin: Vector2D }`
- `pulse_used`: `{ position: Vector2D, radius: number }`
- `surge_warning`: `{ leadTimeSec: number }`
- `phase_started`: `{ chapterId: string, phaseIndex: number }`
- `objective_completed`: `{ objectiveId: string }`
- `entity_damaged`: `{ targetId: string, remainingIntegrity: number }`
- `boss_phase_changed`: `{ phaseIndex: number, hpRatio: number }`
- `story_beat_requested`: `{ dialogueBeatId: string }`
- `bark_requested`: `{ barkId: string, speakerId: string, stringId: string }`
- `run_finished`: `{ victory: boolean, stats: RunStatistics }`

Audio synthesis, render effects, HUD updates, and Ledger discoveries are pure **consumers** of events. Systems never invoke rendering or audio APIs directly.

### 5.4 Snapshots to React (`HudSnapshot`)
- `HudSnapshot` is immutable and generated at most 10 times per second or immediately upon high-priority state changes.
- Contains only the data React requires to render HUD elements: health, max health, XP ratio, player level, chapter index, phase timer, active objective, ability cooldowns, defeated count, boss bar, and active caption.
- React components remain performant and never trigger 60 FPS re-renders.

### 5.5 Determinism & Seeded RNG
- The simulation consumes an injected seeded pseudo-random number generator (mulberry32).
- Zero calls to `Math.random()`, `Date.now()`, or `performance.now()` exist within simulation files.
- The same initial seed and input command sequence reproducibly yields the identical match outcome. This enables fast headless regression tests and automated balance verification bots.

---

## 6. Service Interfaces & Dependency Injection

All platform and infrastructure operations sit behind swappable service interfaces:

### 6.1 `AudioService`
```typescript
interface AudioService {
  playSfx(effectId: string): void;
  setVolumes(master: number, sfx: number, ambient: number): void;
  startAmbient(themeId: string): void;
  stopAll(): void;
  suspend(): Promise<void>;
  resume(): Promise<void>;
  dispose(): void;
}
```
Implemented via the Web Audio API using procedural oscillator synthesis (zero external audio binaries required). Respects audio volume settings and reduced-flashes/sound options. Supports `suspend()` and `resume()` to gracefully manage app lifecycle state during tab switching, device locking, or mobile backgrounding. Disposed when navigating away from gameplay.

### 6.2 `AssetLoader`
```typescript
interface AssetLoader {
  loadManifest(manifest: AssetManifest): Promise<void>;
  getSprite(assetId: string): RenderableSprite;
  hasAsset(assetId: string): boolean;
}
```
In development, missing asset IDs throw explicit descriptive errors to catch broken references. In production, it falls back gracefully to a procedural placeholder sprite to prevent runtime crashes.

### 6.3 `SettingsService`
```typescript
interface SettingsService {
  getSettings(): UserSettings;
  updateSettings(partial: Partial<UserSettings>): void;
  onSettingsChanged(listener: (settings: UserSettings) => void): () => void;
}
```
Provides access to master/sfx/ambient volumes, screen shake (on/off), reduced flashes/motion, high-contrast palette, and custom key bindings. Automatically persisted via `SaveService`.

### 6.4 `InputManager`
```typescript
interface InputManager {
  bindAction(action: InputAction, keyCodes: string[]): void;
  getActiveMovementVector(): Vector2D; // Normalized: { x: number, y: number }, length <= 1.0
  setActiveMovementVector(vector: Vector2D): void; // Direct hook for touch joystick or programmatic input
  isActionPressed(action: InputAction): boolean;
  pollEvents(): InputEvent[];
}
```
Maps physical keyboard inputs to logical game actions (`move_up`, `move_down`, `move_left`, `move_right`, `pulse`, `pause`) and outputs a normalized directional vector (`{ x: number, y: number }` with length clamped to $\le 1.0$). Decouples input capture from simulation processing:
- **Desktop Web (v1):** Reads keyboard bindings (WASD / Arrow Keys) and synthesizes normalized 8-way directional vectors.
- **Mobile Touch / Wrapper Readiness:** A virtual floating joystick or on-screen touch overlay can directly invoke `setActiveMovementVector(vec)` without any modifications to the simulation layer or entity movement logic.
- **Gamepad Readiness:** Standard HTML5 Gamepad analog stick values feed directly into the same normalized vector pipeline.

---

## 7. Storage, Persistence & Migration

### 7.1 Storage Architecture (`SaveService`)
- Encapsulates browser storage behind an `IStorageAdapter` interface:
  ```typescript
  interface IStorageAdapter {
    isAvailable(): boolean;
    read(key: string): string | null;
    write(key: string, value: string): void;
    remove(key: string): void;
  }
  ```
- Implementations: `LocalStorageAdapter` (browser production) and `MemoryAdapter` (automated tests and environments where storage is blocked).
- Only `SaveService` interacts with storage adapters.

### 7.2 Save Document Schema
```typescript
interface SaveDocument {
  schemaVersion: number;
  profileId: "default";
  settings: UserSettings;
  campaigns: {
    [campaignId: string]: {
      completedChapterIds: string[];
      records: Record<string, ChapterRunRecord>;
    };
  };
  unlocks: {
    abilityIds: string[];
    heroIds: string[];
    ledgerEntryIds: string[];
    flags: Record<string, boolean>; // e.g., dawn_signal_unlocked
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```
Transient simulation state (live enemies, projectiles, active wave timers) is **never** written to persistent storage.

### 7.3 Migrations & Fault Tolerance
1. Every schema revision increments `schemaVersion` and supplies an explicit, pure migration function `migrate_vN_to_vN1(raw: unknown): unknown`.
2. Before running migrations, `SaveService` writes a snapshot copy to a backup key (`nightbloom_save_backup_vN`).
3. If a save file contains a `schemaVersion` newer than the app version, it is never silently overwritten or downgraded; a visible dialog offers a choice to reset or preserve.
4. If stored data is corrupted or fails Zod schema validation, the system falls back to default settings and clean campaign progress while stashing the corrupted blob for recovery, preventing application white-screens.

---

## 8. Extension Playbooks

These standard workflows document how to extend NIGHTBLOOM without modifying engine internals:

### 8.1 Add a Chapter (or Story Expansion Pack)
1. Document story logic, rules, and glossary in `STORY_BIBLE.md`.
2. Define content records: `ChapterDef`, `PhaseDef`s, wave schedules, dialogue beats, and field ledger entries.
3. Register the chapter in `CampaignDef`. No engine code modifications required unless introducing novel objective mechanics.
4. Add verification tests: schema validation, reference integrity, wave schedules, and headless balance clear runs.

### 8.2 Add an Enemy or Variant
1. Create `EnemyDef` or `EnemyVariantDef` in content registries.
2. Select or implement a `behaviorId` (`chase`, `dart`, `hover_shoot`, `slam`).
3. Define sprite procedural draw recipe, audio IDs, telegraph timings, and field ledger entry.
4. Validate that silhouette, pattern cues, and telegraph satisfy readability rules.

### 8.3 Add an Ability and Upgrades
1. Define `AbilityDef` specifying targeting behavior, cooldowns, projectile recipes, and unlock rules.
2. Define corresponding `UpgradeDef` records with level bonuses and prerequisites.
3. Register localized display strings and UI icon assets.

### 8.4 Add a Character, Bark, or Story Beat
1. Complete character profile in `CHARACTERS.md`.
2. Register `CharacterDef`, layered vector portrait definitions, localized string IDs, and at least 3 distinct barks with cooldown rules.
3. Link barks to chapter triggers and ledger references.

### 8.5 Add a Playable Hero
1. Register `HeroDef` specifying base stats, starting abilities, and active skill.
2. Add hero portrait assets and unlock conditions.
3. Update balance bot test suites to verify chapter clear targets for the new hero.

### 8.6 Add a Locale
1. Create a localized string catalog beside `src/content/locales/en.ts`.
2. String catalog unit tests automatically assert 100% key parity with English strings.

### 8.7 Add a Run Mutator (Post-v1)
1. Define a `MutatorDef` using the safe modifier model (matching upgrade effects: multipliers on speed, density, cooldowns).
2. Register localized mutator descriptions.

---

## 9. Performance Budgets & Release Guardrails

| Metric | Budget | Verification Method |
|---|---|---|
| **First-Load JavaScript** | $\le \mathbf{350\text{ KB}}$ gzipped | Rollup bundle analyzer in CI |
| **Time to Title Screen** | $\le \mathbf{2.0\text{ s}}$ on local build | Playwright startup timing |
| **Simulation Tick Time** | $\le \mathbf{3.0\text{ ms}}$ at peak enemy cap (200 entities) | Headless performance benchmark suite |
| **Canvas Render Time** | $\le \mathbf{8.0\text{ ms}}$ at peak enemy cap | Chrome devtools performance profile |
| **Frame Rate** | Stable 60 FPS on standard desktop hardware | In-game frame time monitor |
| **Memory Leakage** | Zero steady heap growth over 15-minute continuous run | Headless 50,000-tick heap allocation test |

---

## 10. Production Checklist & CI Pipeline

- **Continuous Integration (`.github/workflows/ci.yml`):** Runs on every push and PR:
  1. `npm run typecheck` (strict TypeScript validation).
  2. `npm run lint` (ESLint layer boundary enforcement).
  3. `npm run test` (Vitest unit and regression test suite).
  4. `npm run validate:content` (Zod validation and cross-reference integrity checks).
  5. `npm run build` (production Vite bundle verification, enforcing $\le 350\text{ KB}$ budget).
  6. Playwright smoke test on Chromium with network blocked.
- **Node Environment:** Pinned with `.nvmrc` and `engines` in `package.json`.
- **Error Handling & Boundaries:**
  - Top-level React Error Boundary catches UI faults and offers a clean "Return to Title" action.
  - Simulation loop exceptions halt simulation cleanly, dispose Web Audio contexts, and transition to a recoverable error screen.
- **Browser Compatibility:** Latest two major versions of desktop Chrome, Edge, Firefox, and Safari.
- **Privacy Assurance:** Zero runtime network requests, no third-party cookies, no remote telemetry by default. The Playwright E2E suite runs with network completely blocked.

---

## 11. Non-Goals & Future Plug-In Architecture

| Feature (Out of Scope for v1) | Future Plug-In Architecture |
|---|---|
| **Mobile App Packaging (Capacitor / Cordova)** | Post-web-validation packaging pathway: Pure HTML5/Canvas/React codebase packages directly into iOS/Android native binaries via Capacitor with 0 simulation rewrites. Consumes existing `IStorageAdapter`, normalized vectors in `InputManager`, and lifecycle management via `document.addEventListener('visibilitychange')` + `AudioService.suspend()`. |
| **Gamepad & Touch Controls** | Core input pipeline already consumes normalized directional vectors (`{ x, y }`) and UI enforces $\ge 48\times 48\text{ px}$ touch targets. Plugging in a virtual floating joystick or gamepad polling loop feeds `InputManager.setActiveMovementVector(vec)` with zero simulation changes. |
| **Cloud Saves & Accounts** | Implement a cloud-backed `IStorageAdapter` and sync service; simulation and game core remain unchanged. |
| **Additional Heroes & Stories** | Content packs, `HeroDef`s, and character expansion playbooks (Section 8). |
| **Additional Locales** | Additional string catalog dictionaries conforming to `StringCatalog` interface. |
| **Telemetry & Analytics** | Event-queue consumer behind an explicit opt-in user consent toggle in Settings. |
| **Multiplayer / Dedicated Server** | Purity and determinism of `src/game/simulation/` allows it to run headless on Node.js/Bun servers if ever desired. |

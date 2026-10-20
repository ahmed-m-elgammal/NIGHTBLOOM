# NIGHTBLOOM: The Last Signal — Architecture

**Authority:** this file wins on structure, data model, state machines and engine contracts. Rules live in `CLAUDE.md`, mechanics in `docs/GDD.md`, story in `docs/STORY_BIBLE.md`. If you must depart from this file, record the decision in `docs/DECISIONS.md` (one short entry: context, decision, consequence) and update this file.

**What "production" means here:** a release-quality, offline, single-player browser game. Typed and validated data, deterministic simulation, versioned saves, automated tests and CI, accessible UI, clean error handling, credited assets. It does **not** include accounts, servers, cloud saves, telemetry or payments. Section 9 lists the extension points those would plug into later.

---

## 1. Layers and dependency rules

```text
content/      data records, schemas, registries, theme tokens, string catalog   (no imports from game/ or ui/)
game/simulation/   pure TypeScript simulation                                  (imports content/ and utils only)
game/core/    loop, controller, command/event plumbing                         (imports simulation/, services/ interfaces)
game/rendering/    Canvas renderer, camera, sprite atlas                       (reads simulation types and snapshots, read-only)
services/     audio, assets, settings, save (behind interfaces)               (no imports from game/simulation)
storage/      StorageAdapter implementations, save schemas, migrations
app/ + ui/    React shell, screens, HUD                                        (imports core/ controller API and snapshot types)
```

Rules:
- Imports only point **down** this list. Simulation never imports React, DOM, audio, rendering or services.
- Enforce with ESLint `no-restricted-imports` zones (no new dependency). A violation fails `npm run lint`.
- Services are injected through interfaces so tests can swap fakes.

---

## 2. Data model: the content "database"

There is no runtime database. The data layer is **typed records + registries + validation**, loaded from content packs.

### 2.1 Record types

| Record | Key fields | References |
|---|---|---|
| `CampaignDef` | `id`, `titleId`, `chapterIds[]`, `unlockRule` | chapters |
| `ChapterDef` | `id`, `campaignId`, `order`, `titleId`, `nightLabelStringId`, `coreGrowthStage`, `mapThemeId`, `startingPicks`, `phases[]`, `cards{intro, interlude, reward}`, `rewards[]` | phases, map theme, strings, unlocks |
| `PhaseDef` | `id`, `durationSec`, `objective`, `waves[]`, `hazards[]`, `startCardId` | enemies, hazards |
| `ObjectiveDef` | discriminated union: `survive_timer`, `defend_entity`, `collect_item`, `defeat_boss`, `defeat_boss_or_survive_timer` | boss, entity |
| `WaveDef` | `atSec`, `enemyId` or `variantId`, `count`, `pattern`, `warningLeadSec?` | enemies |
| `HeroDef` | `id`, `nameId`, `baseStats`, `startingAbilityIds`, `activeSkillId`, `portraitId`, `unlockRule` | abilities |
| `CharacterDef` | `id`, `nameId`, `roleId`, `portraitSetId`, `voiceTags[]` | strings, portraits |
| `EnemyDef` / `EnemyVariantDef` | stats, `behaviorId`, telegraph timings, visual and audio IDs; variant has `variantOf` and multipliers | behaviors, assets |
| `BossDef` | phases by HP threshold, `attacks[]`, recovery windows, win rule | attacks |
| `AbilityDef` | behavior ID, targeting, cooldown/interval, params, `unlockRule`, effect IDs, upgrade links | upgrades |
| `UpgradeDef` | `maxLevel`, `requires`, `effects[]` (`add`, `multiply`, `grant_ability`, `set_flag`) | abilities |
| `PickupDef` | glow-seed value, drift params | assets |
| `UnlockRule` | discriminated union: `chapter_completed`, `flag`, `always` | chapters |
| `DialogueBeatDef` | `id`, `speakerId`, `stringId`, `trigger`, `once` | characters |
| `BarkDef` | `id`, `speakerId`, `trigger`, `stringId`, cooldowns, `chapterRange`, `chance`, `maxPerRun` | characters |
| `LedgerEntryDef` | `id`, `titleId`, `bodyId`, `voiceSpeakerId`, `discoverOn` | characters |
| `MapThemeDef` | lighting, weather, flower patch layout, props, water margins | assets, tokens |
| `AssetDef` | id, path or procedural recipe, frame data, license | n/a |

Important: a speaker is a **`CharacterDef` id** (a string validated against the registry), never a hard-coded union of names in code. The same goes for heroes and campaigns. This is what lets new personas and stories be added as data.

### 2.2 Registries and IDs
- Each record type has a registry module with `get(id)`, `all()` and `has(id)`. Unknown IDs throw in dev and are caught by `validate:content`.
- IDs are lowercase snake_case, **stable forever**, never reused. A rename needs a migration entry (section 5).
- All string IDs, asset IDs, behavior IDs and cross-references are validated by Zod schemas plus a reference-integrity pass.

### 2.3 Content packs
Content is loaded as a list of packs: `ContentPack { id, version, records }`. v1 ships one pack, `core`. A story expansion is an additional pack that adds chapters, characters, barks, ledger entries or heroes **without touching engine code**. Pack merge rules: duplicate IDs are an error; every cross-reference must resolve across the merged set; load order is explicit.

### 2.4 Heroes
The engine reads player stats, starting abilities and the active skill from the selected `HeroDef`. v1 exposes only `hero_mira` and has no hero-select screen, but run setup already takes a `heroId`. Adding a hero later is data plus a select screen.

---

## 3. State machines

All state changes go through typed transitions. No scattered boolean flags (`isPaused`, `isLevelingUp`).

### 3.1 App flow (React-level)

`AppState` is a discriminated union handled by one reducer.

| From | Event | To |
|---|---|---|
| `boot` | `assets_ready` | `title` |
| `title` | `start` / `continue` | `briefing(chapterId)` |
| `title` | `open_chapter_select` | `chapter_select` |
| `title` | `open_settings` / `open_how_to_play` / `open_credits` / `open_ledger` | the matching screen; `back` returns to `title` |
| `chapter_select` | `choose(chapterId)` (unlocked only) | `briefing(chapterId)` |
| `briefing` | `begin` | `run(chapterId)` |
| `run` | `run_finished(result)` | `results(result)` |
| `results` | `continue` (victory, next chapter exists) | `briefing(nextChapterId)` |
| `results` | `continue` (final chapter victory) | `ending` → `campaign_complete` → `title` |
| `results` | `retry_phase` / `restart_chapter` | `run(chapterId)` with the right start |
| `results` | `title` | `title` |

### 3.2 Run state machine (inside the game)

States: `loading`, `story_card`, `starting_picks`, `playing`, `levelup`, `paused`, `phase_transition`, `victory`, `defeat`, `disposed`.

| From | Event | To |
|---|---|---|
| `loading` | `ready` | `story_card` (chapter intro) |
| `story_card` | `dismiss` | `starting_picks` if picks remain, else `playing` |
| `starting_picks` | `pick_chosen` (last one) | `playing` |
| `playing` | `xp_threshold_crossed` | `levelup` (queued; repeats if more are pending) |
| `levelup` | `pick_chosen` / `skip` | `playing` (or `levelup` again if queued) |
| `playing` | `pause` | `paused` |
| `paused` | `resume` | `playing` |
| `paused` | `quit` / `restart` | `disposed` |
| `playing` | `story_beat_requires_card` | `story_card` → back to `playing` |
| `playing` | `objective_completed` (not last) | `phase_transition` → `playing` |
| `playing` | `objective_completed` (last) | `victory` |
| `playing` | `player_dead` / `entity_destroyed` | `defeat` |

Rules:
- The simulation advances **only** in `playing`. The simulation clock and every timer freeze in all other states.
- Every non-`playing` state has an explicit exit. A test enumerates all states and proves none is a dead end (no stuck pause).
- `Escape` is ignored in `levelup` and `story_card` except to skip allowed text. Double-picks are rejected by the state, not by UI debouncing.
- A phase snapshot is taken on entry to each phase (GDD section 4.6).

### 3.3 Phase and objective lifecycle
`pending → active → completed | failed`. `failed` only happens for `defend_entity` (integrity 0) and routes to run `defeat`. `survive_timer` and `collect_item` complete on their condition. `defeat_boss_or_survive_timer` completes on whichever happens first.

### 3.4 Boss state machine
`dormant → intro → idle → telegraph(attackId) → attack(attackId) → recovery → idle`, with HP-threshold phase changes (66% and 33%) that swap the attack set and recovery length, and a concurrent **Signal Lock** timer. Either end condition (core destroyed or lock complete) sets `defeated` and ends the phase.

### 3.5 Enemy behavior state machines
Behavior modules are small state machines selected by `behaviorId`; timings come from data.
- `chase`: `approach` (Seedling).
- `dart`: `approach → crouch (telegraph) → dash → recover` (Thornrunner).
- `hover_shoot`: `approach → hover → rotor_flare (telegraph) → fire → recover` (Rustwing).
- `slam`: `approach → windup (ring telegraph) → slam → recover` (Briarheart).

---

## 4. Engine contracts

### 4.1 World state
`WorldState` is a plain serializable object: `{ time, rng, player, enemies, projectiles, pickups, effects, hazards, objective, boss?, flags }`. Entities live in typed arrays/stores keyed by integer IDs, not class instances with hidden state. No ECS library. This keeps snapshots, tests and the headless balance bot simple.

### 4.2 Fixed-tick system order
1. Drain queued commands (section 4.3).
2. Player movement and invulnerability timers.
3. Spawning (wave schedule, safe positions, enemy cap).
4. Enemy behavior updates.
5. Ability updates (cooldowns, firing, Beacon Pulse, Coil Arc, Bloomguard, Wren).
6. Projectile movement.
7. Rebuild the spatial hash and run collision queries.
8. Damage resolution and deaths (seed drops).
9. Pickups and XP.
10. Level-up check.
11. Hazards (gust lane, boss patterns).
12. Objective, phase and boss updates.
13. Bark and story-trigger evaluation.
14. Cleanup, then emit events and (throttled) the HUD snapshot.

### 4.3 Commands and events (typed unions)
- **Commands** (UI → simulation) go through one entry point, `controller.dispatch(cmd)`: `move_input`, `use_pulse`, `pause`, `resume`, `choose_upgrade`, `reroll`, `skip_levelup`, `dismiss_card`, `retry_phase`, `restart`, `quit`.
- **Events** (simulation → everything else) are pushed to a queue and drained after the tick: `enemy_killed`, `player_hit`, `pickup_collected`, `level_up_ready`, `ability_fired`, `pulse_used`, `surge_warning`, `phase_started`, `objective_completed`, `entity_damaged`, `boss_phase_changed`, `story_beat_requested`, `bark_requested`, `run_finished`.
- Audio, renderer effects, barks, scoring, the Ledger and the HUD are **consumers** of events. Systems never call audio or React directly.

### 4.4 Snapshots to React
`HudSnapshot` is immutable and built at most 10 times per second or on change (health, XP, level, phase, timer, cooldowns, objective, boss bar, active caption). React re-renders only from snapshots.

### 4.5 Determinism
Fixed 60 Hz step, injected seeded RNG, no `Date.now()` or `performance.now()` in simulation, simulation time only from the tick counter. Same seed plus same commands gives the same run. The balance bot and integration tests rely on this.

### 4.6 Performance budgets (starting values; measure in release hardening)
| Metric | Budget |
|---|---|
| Frame rate at peak enemy counts (GDD section 9) | 60 FPS on a typical desktop |
| Simulation tick | 3 ms or less at peak |
| Render | 8 ms or less at peak |
| First-load JavaScript | 350 KB gzipped or less |
| Time to title screen | 2 s or less on a local build |
| Memory over a 15-minute run | no steady growth |

---

## 5. Persistence

### 5.1 StorageAdapter
```text
StorageAdapter { isAvailable(): boolean; read(key): string | null; write(key, value): void; remove(key): void }
```
Implementations: `LocalStorageAdapter` (v1), `MemoryAdapter` (tests and fallback when storage is blocked). A later `IndexedDBAdapter` or cloud adapter needs no engine change. `SaveService` is the only code that touches an adapter.

### 5.2 Save document
```text
{
  schemaVersion,
  profileId: "default",
  settings,
  campaigns: { [campaignId]: { completedChapterIds, records } },
  unlocks: { abilityIds, heroIds, ledgerEntryIds, flags },   // flags include the Dawn Signal emblem
  createdAt, updatedAt
}
```
Never stored: live enemies, projectiles, run snapshots, any transient combat state.

### 5.3 Migrations and safety
- Each version bump adds a pure `migrate_vN_to_vN+1` with a fixture-based test. Never drop a field without a migration.
- Before migrating, copy the old save to a backup key. Migrate, validate with Zod, then write.
- A save with a **newer** `schemaVersion` than the app is never downgraded silently: show a message and offer a reset.
- Corrupt or invalid data: recover to defaults, keep the corrupt blob under a backup key, and show a catalog message. Never crash.
- Renaming a content ID (chapter, ability, ledger entry) requires an ID-rename step in the migration.

---

## 6. Service interfaces
- `AudioService`: `playSfx(id)`, `setVolumes()`, `startAmbient(themeId)`, `stopAll()`. Web Audio synthesis in v1. Respects settings. Disposed on leaving gameplay.
- `AssetLoader`: `load(manifest)`, `get(id)`. Dev: loud missing-asset errors. Production: safe fallback.
- `SettingsService`: typed settings, change events, persisted via `SaveService`.
- `InputManager`: action bindings (not raw keys) so a gamepad or touch layer can be added later by providing a new input source.

---

## 7. Extension playbooks

Each playbook lists what changes. "No engine code" means data, strings and assets only.

**Add a chapter (or a whole story pack)**
1. Update `docs/STORY_BIBLE.md` first (rules, glossary, beats). 
2. New content pack or additions: `ChapterDef`, phases, waves, strings, dialogue beats, ledger entries.
3. Add the chapter to a `CampaignDef`. No engine code unless it needs a new objective type or hazard.
4. Add tests: content validation, wave schedule, a seeded headless clear check.

**Add an enemy or variant**
`EnemyDef` or `EnemyVariantDef`, a `behaviorId` (reuse an existing behavior module or add one), sprite recipe, telegraph and sound IDs, ledger entry. New behavior module only if none fits.

**Add an ability and its upgrades**
`AbilityDef` (reuse behavior ID: projectile, chain, area pulse, follower turret), `UpgradeDef`s, strings, icon, unlock rule.

**Add a character, bark, or story beat (persona expansion)**
Filled sheet (`docs/CHARACTERS.md` section 2), `CharacterDef`, portrait parts for three states, name and role strings, at least three barks, any dialogue beats. No engine code.

**Add a playable hero**
`HeroDef`, a starting kit built from existing abilities, a hero-select screen, an unlock flag in the save. Update the difficulty targets and balance bot configs per hero.

**Add a locale**
A new file beside `en.ts` with the same keys; the string-catalog test fails on any missing key. No engine code.

**Add a run mutator (post-v1)**
A `MutatorDef` with a safe effect list (same effect model as upgrades). No arbitrary code.

---

## 8. Production checklist

**CI** (GitHub Actions, `.github/workflows/ci.yml`): on every push and pull request run install, `typecheck`, `lint`, `test`, `validate:content`, `build`, then the Playwright smoke test on Chromium. Pin Node with `.nvmrc` and `engines`. Use only first-party actions (`checkout`, `setup-node`). If you host elsewhere, translate the same steps.

**Build and deploy:** `vite build` with a relative base so the output runs from any static host or sub-path. No backend, no environment secrets.

**Error handling:**
- A top-level React error boundary shows a catalog message with "Return to title".
- Errors thrown inside the game loop stop the loop, dispose services, and show the same recoverable screen. Nothing is swallowed silently.
- The Playwright smoke test fails on any console error.

**Versioning:** semantic `package.json` version, a `CHANGELOG.md`, a `CONTENT_VERSION` constant, and the game version shown on the Credits screen.

**Browsers:** current and previous major versions of desktop Chrome, Edge, Firefox and Safari. Touch and gamepad are not supported in v1 (stated in the README and on narrow touch devices).

**Privacy:** no network requests at runtime, no analytics, no cookies, `localStorage` only. An e2e test runs the game with the network blocked.

**Release gate:** all items in GDD section 10 plus this section, with evidence recorded in the final report.

---

## 9. Non-goals and where they would plug in later

| Not in v1 | Plug-in point |
|---|---|
| Cloud saves, accounts, leaderboards | a new `StorageAdapter` plus a sync service; no engine change |
| Gamepad or touch | a new input source feeding `InputManager` actions; add a layout pass |
| More heroes | `HeroDef` plus a select screen |
| More story | content packs and the playbooks in section 7 |
| More languages | new locale files |
| Telemetry | an event-queue consumer behind a consent setting (explicit approval required first) |

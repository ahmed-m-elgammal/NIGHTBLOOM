# NIGHTBLOOM: The Last Signal — Asset Manifest

**Status:** v1 planning manifest, pre-Milestone B. PB-6/PB-7 shell and accessibility assets are implemented and committed; the shell checkpoint is accepted for sequencing. PB-1-PB-8 are implemented in the working tree and awaiting review: the 2× atlas contract and recipe migration, dynamic props/landmarks, the renderer split, the lighting cache/1× surface migration, the staging enemy family split, and PB-8's opening-frame composition, midground value separation and closed Mira rim.
**Companion:** `docs/ART_BIBLE.md` (style contract and QA gates)
**Source of truth:** `GDD.md` §7 asset set; `spec/Technical Design Document (TDD).md` §5.2; `CHARACTERS.md` §3–4 and §8; the current working tree.
**Scope:** every v1 world sprite, enemy state, projectile, pickup, VFX, telegraph, environment layer, UI icon, portrait, panel and audio recipe.

This manifest records what exists, what is staged, what is missing and which milestone owns it. It is not a wish list. An asset is only “Implemented” when it is wired into production and visible in the build.

**Numbers and authority.** Sizes and timings from TDD §5.2 and GDD §5 are fixed. Values marked `~` or “art target” are proposed and must be approved in the milestone spike; they are not balance values and must not be copied into simulation config without review.

---

## 1. How to read this manifest

| Status | Meaning |
|---|---|
| **Implemented** | Recipe exists in `src/` and is wired into the production atlas or UI. |
| **Staged** | Code exists outside `src/` (for example `staging/EnemySprites.ts`) or is not wired into the atlas. |
| **Partial** | Some states, variants or screens exist; the full contract is not met. |
| **Missing** | Required by the GDD/TDD/UX spec and not authored. |
| **Planned** | Specified here, scheduled, not started. |
| **External** | Loaded from outside the repo; must be removed before release. |

**Milestone codes:** `A` foundation; `B` core combat; `C` XP/upgrades; `D1` chapter foundation/save; `D2` full Chapter 1; `E1` Thornrunner/Rustwing/Ch2–3; `E2` Briarheart/Wren/Ch4; `E3` Stormroot/Ch5; `F1` art/audio pass; `F2` UI/settings/accessibility; `F3` release.

**QA codes** refer to `docs/ART_BIBLE.md` §14 (`AB-QA-01`…`AB-QA-17`). “Pending” means the asset has not been through the formal harness; “Informal” means it has been eyeballed in the running build.

---

## 2. Summary

| Family | Implemented | Partial / staged | Missing | Planning estimate |
|---|---:|---:|---:|---:|
| World atlas (Mira, beacon, flora, props, landmarks) | 21 buffers | 1 (beacon pulse ring) | Mira hit; 8 flora variants | ~31 |
| Enemies | 0 | 5 staged bases | Stormroot; state sets; enemy shot | ~32 |
| Projectiles / pickups / VFX | 0 | 4 HUD readouts | ~13 | ~17 |
| Telegraphs / hazards | 0 | 1 (surge warning) | ~6 | 7 |
| Old Core / Stormroot | 0 | 0 | 5 stages + boss + generator/light | 8 |
| Environment / weather / water (new layers) | 0 | 1 (dust motes) | 4 | 5 |
| UI icons | 0 canonical | ~7 inline | ~18 canonical | 25 |
| Portraits | 1 component (Mira ×3) | 0 | 3 characters ×3 | 12 |
| Panels / screens | 4 shells | 3 partial | 9 | 16 |
| Audio recipes | 3 | 1 (Pulse) | ~16 | 20 |
| **Indicative total** | **not additive** | **not additive** | **~80** | **~165** |

Rows overlap (a HUD component can appear in several families), so do not sum the columns. Ground cache, road, furrows and lighting are tracked in the world atlas, not counted again under environment. The total is a planning estimate, not a commitment. “Implemented” counts atlas buffers and UI shells, not unique visual concepts.

---

## 3. World atlas

| ID | Asset | Status | Source | Buffer px | Native px | States / frames | Pivot | Milestone | QA / notes |
|---|---|---|---|---|---|---|---|---|---|
| `world.mira.down.0–3` | Mira facing down | Implemented | `personas/mira/index.ts` | 64×64 | 40 tall | 4 stride frames | Center | A | PB-8 closed 1.8 px `miraRimClosed`; hair before face; no external dark contour. No distinct idle frames; idle uses frame 0 |
| `world.mira.up.0–3` | Mira facing up | Implemented | `personas/mira/index.ts` | 64×64 | 40 tall | 4 stride frames | Center | A | PB-8 closed 1.8 px `miraRimClosed`; hair before face; no external dark contour |
| `world.mira.side.0–3` | Mira facing side | Implemented | `personas/mira/index.ts` | 64×64 | 40 tall | 4 stride frames | Center | A | PB-8 closed 1.8 px `miraRimClosed`; mirrored for left/right |
| `world.mira.hit` | Mira hit state | Missing | — | 64×64 | 40 tall | 1 + blink | Center | B | 80 ms flash; 8 Hz blink; reduced-motion 50% opacity |
| `world.beacon` | Nursery beacon | Implemented | `items/beacon.ts` | 160×160 | 160 | 1 + procedural pulse | Center | A | Pulse rings drawn by `WorldEntityRenderer`; no atlas frames |
| `world.flora.small` | Nightbloom cluster, small | Implemented | `items/flora.ts` | 64×64 | ~48 | 1 | Center | A | Fixed 5 blossoms; target 8 L-system variants |
| `world.flora.medium` | Nightbloom cluster, medium | Implemented | `items/flora.ts` | 96×96 | ~72 | 1 | Center | A | Fixed 7 blossoms |
| `world.flora.large` | Nightbloom cluster, large | Implemented | `items/flora.ts` | 128×128 | ~96 | 1 | Center | A | Fixed 9 blossoms |
| `world.prop.harvester` | Abandoned combine harvester | Implemented | `items/props.ts` | 120×84 | 120×84 | 1 | Center | A | Per-frame 2× atlas draw; PB-8 lifted the chassis to `metalTrim` and added top-edge separation; mirror preserved for #2 |
| `world.prop.pylon` | Relay pylon | Implemented | `items/props.ts` | 64×96 | 64×96 | 1 | Center | A | Per-frame 2× atlas draw; PB-8 mast/beam edge separation; 0.04 rad lean preserved for #2 |
| `world.prop.sensor` | Soil sensor | Implemented | `items/props.ts` | 48×64 | 48×64 | 1 | Center | A | Per-frame 2× atlas draw; PB-8 terminal/solar-cell top edges |
| `world.landmark.glasshouse` | Collapsed glasshouse | Implemented | `items/landmarks.ts` | 220×140 | 220×140 | 1 | Center | A | Per-frame 2× atlas draw; PB-8 positioned at (2100,1250), with ridge/knee-wall value separation |
| `world.landmark.coldframes` | Nursery cold frames | Implemented | `items/landmarks.ts` | 190×150 | 190×150 | 1 | Center | A | Per-frame 2× atlas draw; PB-8 positioned at (1120,1270), with top-rail value separation |
| `world.flora.variant.0–7` | Nightbloom L-system family | Missing | — | 64/96/128 | 48/72/96 | 8 variants | Center | Pre-B/B | Seeded; 5–9 blossoms; 5–7 petals; no amber |
| `world.beacon.pulse_ring` | Beacon pulse ring | Partial | `WorldEntityRenderer.ts` (procedural) | — | Variable | 1 | Center | A | 300 ms expansion |

---

## 4. Enemies

The canonical v1 roster is **four base enemies + one variant + one boss**. Older planning that says “8 base enemies” is not canon. Future variants are data-only.

| ID | Asset | Status | Source | Buffer px | Native px | Required states | Pivot | Milestone | QA / notes |
|---|---|---|---|---|---|---|---|---|---|
| `enemy.seedling` | Seedling | Staged | `staging/enemies/SeedlingSprites.ts` | 36×36 | 28 | Idle, move, telegraph, hit, death | Bottom-center | B | Uses `floraPatch` body + `seedCore` stroke — must be corrected to `mossDense` + dark outline + `hostileCore`; petals must be serrated |
| `enemy.bloomed_seedling` | Bloomed Seedling | Staged | `staging/enemies/BloomedSeedlingSprites.ts` | 44×44 | 36 | Idle, move, telegraph, hit, death | Bottom-center | D2 | Outer 8-petal ring; amber tint; larger core |
| `enemy.thornrunner` | Thornrunner | Staged | `staging/enemies/ThornrunnerSprites.ts` | 38×30 | 26×20 | Move 2-frame, crouch telegraph, hit, death | Bottom-center | E1 | No dust trail yet; legs exist |
| `enemy.rustwing` | Rustwing | Staged | `staging/enemies/RustwingSprites.ts` | 44×44 | 34 | Hover 4-frame, aim, fire, hit, death | Center | E1 | Rotor frame param exists; no aim/fire state set |
| `enemy.briarheart` | Briarheart | Staged | `staging/enemies/BriarheartSprites.ts` | 80×80 | 72 | Idle, slam telegraph, slam, hit, death | Bottom-center | E2 | Ground ring is a separate telegraph asset |
| `enemy.stormroot` | Stormroot boss | Missing | — | 280×280 | ~220 | Phase 1–3, Root Lash, Spore Ring, Gale Pull, hit, death | Bottom-center | E3 | Same mass as Old Core stage 4; phase tints |
| `enemy.shot` | Enemy projectile | Missing | — | 28×28 | 14 | Travel, hit | Center | E1 | Pointed diamond, dark outline, amber core |
| `enemy.seedling.telegraph` | Seedling petal wind-up | Staged (as frame) | `staging/enemies/SeedlingSprites.ts` | 36×36 | 28 | 1 | Bottom-center | B | Petals open + core bright; no ground ring |
| `enemy.bloomed.telegraph` | Bloomed petal wind-up | Staged (as frame) | `staging/enemies/BloomedSeedlingSprites.ts` | 44×44 | 36 | 1 | Bottom-center | D2 | Outer ring flares |
| `enemy.thornrunner.telegraph` | Thornrunner crouch | Missing | — | 38×30 | 26×20 | 1 | Bottom-center | E1 | Crouch + dust puff + eye flare |
| `enemy.rustwing.telegraph` | Rustwing aim | Missing | — | 44×44 | 34 | 1 | Center | E1 | Rotor flare + lens brighten + hover stall |
| `enemy.briarheart.telegraph` | Briarheart ground ring | Missing | — | 320×320 | ~320 | 1 | Ground | E2 | Hatched ring + shrinking countdown; 1.1 s |

---

## 5. Projectiles, pickups, VFX and HUD feedback

| ID | Asset | Status | Source | Buffer px | Native px | States | Pivot | Milestone | QA / notes |
|---|---|---|---|---|---|---|---|---|---|
| `shot.signal_flare` | Signal Flare projectile | Missing | — | 24×12 | 12×6 | Travel | Center | B | Soft teardrop, cyan-white trail |
| `shot.coil_arc` | Coil Arc projectile | Missing | — | 48×48 | ~32 | Travel, hit | Center | E1 | Arc/coil geometry; cyan/white |
| `shot.bloomguard` | Bloomguard field | Missing | — | 96×96 | ~64 | Idle, pulse | Center | E1 | Petal ring/shield; mint/cyan |
| `drone.wren` | Wren support drone | Missing | — | 48×48 | ~34 | Hover 4-frame, fire | Center | E2 | Small drone cross; friendly cyan |
| `shot.wren` | Wren shot | Missing | — | 16×16 | ~10 | Travel | Center | E2 | Small cyan bolt |
| `pickup.glow_seed` | Glow-seed | Missing | — | 24×24 | 10 | Idle, magnet | Center | B | Mint circle + halo; only entity that drifts to Mira |
| `vfx.hit_spark` | Enemy hit sparks | Missing | — | 8×8 | 3–5 | 1 | Center | B | 3–5 particles; 60 ms |
| `vfx.death_pop` | Enemy death pop | Missing | — | 48×48 | 36 | 1 | Center | B | 150 ms scale/fade + seed scatter |
| `vfx.pickup_trail` | Pickup magnet trail | Missing | — | 16×16 | 6 | 1 | Center | B | Max 6 segments; mint |
| `vfx.pulse_ring` | Beacon Pulse ring | Missing | — | 256×256 | Variable | 1 | Center | C | 300 ms expansion; 4 px shake (reduced-motion off) |
| `vfx.level_up` | Level-up flourish | Missing | — | 512×512 | Variable | 1 | Screen | C | Freeze + 120 ms card fade |
| `vfx.damage_number` | Floating damage number | Missing | — | Text | 14 | 1 | World | B | Max 40; merge within 100 ms |
| `hud.health` | Health gauge | Partial | `OperativeStatusCard`, `TelemetryGauges` | DOM | — | 1 | — | B | Snapshot wiring exists; combat data is placeholder |
| `hud.xp` | XP bar | Partial | `OperativeStatusCard` | DOM | — | 1 | — | B/C | Snapshot wiring exists; XP data is placeholder |
| `hud.abilities` | Ability slots | Partial | `AbilitySlots` | DOM | — | 3 | — | C | Generic icons; canonical 5-icon set missing |
| `hud.objective` | Objective / timer | Partial | `DawnTracker` | DOM | — | 1 | — | D1 | Snapshot wiring exists; objective data is placeholder |
| `hud.boss` | Boss health bar | Missing | — | DOM/Canvas | — | 3 phases | — | E3 | Phase colors + name |

---

## 6. Telegraphs and hazards

| ID | Asset | Status | Shape | Native size | Timing | Milestone | Notes |
|---|---|---|---|---|---|---|---|
| `telegraph.slam_ring` | Briarheart slam | Missing | Ground ring + hatch | ~320 px | 1.1 s | E2 | Last 150 ms brightens |
| `telegraph.root_lash` | Stormroot Root Lash | Missing | Ground lines from core | Lane | 1.0 s | E3 | Step out of the lane |
| `telegraph.spore_ring` | Stormroot Spore Ring | Missing | Radial ring with gaps | 512×512 | 0.8 s | E3 | Thread the gaps |
| `telegraph.gust_lane` | Chapter 2 gust lane | Missing | Lane + chevrons | Lane | Config | E1 | Visible flash, then wind push |
| `telegraph.countdown_ring` | Shared countdown ring | Missing | Inner ring | Variable | Shared | B–E3 | Reused by all ground telegraphs |
| `hazard.wind_push` | Gust force visual | Missing | Streaks/arrows | Variable | Config | E1 | Not a damage telegraph; still readable |
| `hazard.surge_warning` | Bloom-glow surge warning | Partial | Nightbloom brighten + HUD icon | Screen | 45 s | D2 | Monotonic; non-color HUD cue |

---

## 7. Old Core and Stormroot

| ID | Asset | Status | Source | Buffer px | Native px | Stage | Milestone | QA / notes |
|---|---|---|---|---|---|---|---|---|
| `oldcore.stage0` | Old Core, inert pylon | Missing | — | 160×160 | ~140 | 0 | D2 | Octagon pad, coil stack, spire; faint hum; no thorns |
| `oldcore.stage1` | Old Core, base tendrils | Missing | — | 200×200 | ~160 | 1 | E1 | 8 tendrils ×30 px; low glow |
| `oldcore.stage2` | Old Core, climbing thorns | Missing | — | 220×220 | ~180 | 2 | E1 | 14 tendrils ×55 px; phosphorescent seams |
| `oldcore.stage3` | Old Core, scrap-wrapped | Missing | — | 260×260 | ~200 | 3 | E2 | 20 tendrils ×75 px; harvester scrap; pulse |
| `oldcore.stage4` | Old Core, overgrown mass | Missing | — | 300×300 | ~220 | 4 | E3 | 28+ tendrils ×95+ px; nightbloom at base |
| `oldcore.stormroot` | Stormroot boss | Missing | — | 320×320 | ~220 | Boss | E3 | Same mass awakened; 3 phases; core exposed |
| `oldcore.tendril_generator` | Seeded tendril skeleton | Missing | — | — | — | All | D2 | Pure generator; stable seed per stage |
| `oldcore.glow` | Old Core light | Missing | — | — | — | All | D2 | Registered light; separate from beacon |

---

## 8. Environment, water and weather

| ID | Asset | Status | Source | Buffer / tile | Native | States | Milestone | QA / notes |
|---|---|---|---|---|---|---|---|---|
| `env.ground.cache` | Ground field cache | Implemented | `GroundRenderer.ts` | 3200×2400 | 1× | 1 | A | Static terrain/road only; props/landmarks draw per frame |
| `env.ground.scatter` | Soil patches, stubble, stones | Implemented | `GroundRenderer.ts` | — | 1× | Seeded | A | 48 patches, 120 stubble, 60 stones |
| `env.road` | Nursery road | Implemented | `GroundRenderer.ts` | 120 px wide | 1× | 1 | A | Center x = 1600 |
| `env.furrows` | Agricultural furrows | Implemented | `GroundRenderer.ts` | 44 px rows | 1× | 1 | A | — |
| `env.water_margin` | Shallow-water edge | Missing | — | 64 tile | 64 | 1 | E1 | Dark reflective; no bright cyan |
| `env.weather.dust` | Dust motes | Partial | `LightingPass.ts` | — | 1× | 36 motes | E1/F1 | Vector arcs; no flow field |
| `env.weather.spore_far` | Far spore layer | Missing | — | — | 1× | 1 | E1 | Small, dim, slow |
| `env.weather.spore_near` | Near spore layer | Missing | — | — | 1× | 1 | E1 | Larger, brighter, faster |
| `env.weather.gust` | Storm gust streaks | Missing | — | — | 1× | 1 | E1 | Flow-field driven; low contrast |
| `env.lighting` | Darkness composite | Implemented | `LightingPass.ts` + `LightingCache.ts` | 1280×720 | 1× | Per frame | A | 64-light pool; buffer reset per frame; priority policy missing |
| `env.vignette` | Vignette | Implemented | `LightingCache.ts` | 1280×720 | 1× | 1 | A | — |

---

## 9. UI

### 9.1 Icons

| ID | Icon | Status | Current source | Size | Milestone | Notes |
|---|---|---|---|---|---|---|
| `ui.icon.health` | Health | Missing | — | 24 | B | Heart/leaf hybrid; red + shape |
| `ui.icon.xp` | XP | Missing | — | 24 | B/C | Seed/growth ring; mint |
| `ui.icon.ability.flare` | Signal Flare | Partial | `AbilitySlots.tsx` generic line | 24 | B/C | Teardrop + trail |
| `ui.icon.ability.pulse` | Beacon Pulse | Partial | `AbilitySlots.tsx` generic rings | 24 | C | Three concentric rings |
| `ui.icon.ability.coil` | Coil Arc | Missing | — | 24 | E1 | Arc + coil |
| `ui.icon.ability.bloomguard` | Bloomguard | Missing | — | 24 | E1 | Petal ring/shield |
| `ui.icon.ability.wren` | Wren | Missing | — | 24 | E2 | Drone cross + rotor |
| `ui.icon.upgrade.*` | Upgrade cards | Missing | — | 24 | C | ~12 icons; one metaphor each |
| `ui.icon.chapter.*` | Chapter emblems | Missing | — | 32 | D1/F1 | 5 chapters; night labels |
| `ui.icon.ledger` | Field Ledger | Missing | — | 24 | D2 | Notebook/leaf |
| `ui.icon.dawn_signal` | Dawn Signal | Missing | — | 32 | E3 | Emblem; ending reward |
| `ui.icon.pause` | Pause | Missing | Text button | 24 | F2 | — |
| `ui.icon.settings` | Settings | Missing | Text button | 24 | F2 | — |
| `ui.icon.audio` | Audio | Missing | Text button | 24 | F2 | — |

**AB-UI-04:** 24 px grid, 2 px stroke, round caps/joins, one metaphor per icon, filled only for active/selected.

### 9.2 Portraits

| ID | Character / state | Status | Source | Size | Milestone | Notes |
|---|---|---|---|---|---|---|
| `ui.portrait.mira.neutral` | Mira neutral | Implemented | `VectorPortrait.tsx` | 280 | A/F1 | Layered vector |
| `ui.portrait.mira.worried` | Mira worried | Implemented | `VectorPortrait.tsx` | 280 | A/F1 | — |
| `ui.portrait.mira.relieved` | Mira relieved | Implemented | `VectorPortrait.tsx` | 280 | A/F1 | — |
| `ui.portrait.sela.neutral` | Sela neutral | Missing | — | 280 | F1 | Glasses, tied-back hair, lab apron |
| `ui.portrait.sela.worried` | Sela worried | Missing | — | 280 | F1 | Hand near mouth |
| `ui.portrait.sela.relieved` | Sela relieved | Missing | — | 280 | F1 | Eyes closed, exhale |
| `ui.portrait.tavi.neutral` | Tavi neutral | Missing | — | 280 | F1 | Goggles up, half-smirk |
| `ui.portrait.tavi.worried` | Tavi worried | Missing | — | 280 | F1 | Goggles down |
| `ui.portrait.tavi.relieved` | Tavi relieved | Missing | — | 280 | F1 | Broad grin |
| `ui.portrait.idris.neutral` | Idris neutral | Missing | — | 280 | F1 | Convoy uniform, headset |
| `ui.portrait.idris.worried` | Idris worried | Missing | — | 280 | F1 | — |
| `ui.portrait.idris.relieved` | Idris relieved | Missing | — | 280 | F1 | — |

**AB-UI-03:** The current component renders only Mira. Do not show Mira’s portrait for Sela, Tavi or Idris. Until their portraits exist, use a name-only caption.

### 9.3 Panels and screens

| ID | Screen | Status | Source | Milestone | Notes |
|---|---|---|---|---|---|
| `ui.panel.title` | Title | Partial | `TitleScreen.tsx` | A | Shell only; Start and Field Dossier wired. Chapter Select, How to Play, Settings and Credits are missing. |
| `ui.panel.game_hud` | Game HUD | Partial | `GameScreen.tsx` + components | B | Placeholder snapshot values. PB-6 fixed stage, safe-area top row and bottom-left dock are implemented; the objective card is compacted to 81.6 px for a 22.4 px beacon gap. |
| `ui.panel.pause` | Pause | Implemented | `PauseModal.tsx` + `pause/*` | A | PB-7 view state, dialog semantics, focus trap/restore, state-aware Escape and safe quit default are implemented. Resume/settings/quit are wired; restart is not present. |
| `ui.panel.briefing` | Mission briefing | Implemented | `MissionBriefingCard.tsx` | A | Story card shell |
| `ui.panel.radio` | Radio captions | Partial | `RadioTransmission.tsx` | A | Caption flow works; portrait slot is Mira-only |
| `ui.panel.persona` | Persona/dossier | Implemented | `PersonaScreen.tsx` | A/F2 | Field-terminal direction; PB-6 fixed stage removes the 2 px 1280 overflow and 1024 clipping (verified zero overflowers, no internal scroll). Raw stat labels and loadout whitespace remain F2. |
| `ui.panel.equipment` | Equipment inspector | Implemented | `EquipmentInspector.tsx` | A | 4 inline item icons |
| `ui.panel.chapter_card` | Chapter intro card | Missing | — | D1 | Night label, chapter name |
| `ui.panel.level_up` | Level-up cards | Missing | — | C | 3 cards, reroll, skip, keyboard |
| `ui.panel.settings` | Settings | Partial | `PauseModal.tsx` + `pause/PauseSettingsView.tsx` | A/F2 | PB-7 display/accessibility heading, 48 px logical label envelopes, associated labels and “changes apply immediately” note are implemented. Audio, high contrast, shake and rebind remain missing. |
| `ui.panel.victory` | Victory results | Missing | — | D1/E3 | Score, rank, unlocks, ending |
| `ui.panel.defeat` | Defeat results | Missing | — | D1 | Retry phase/restart/title |
| `ui.panel.ledger` | Field Ledger | Missing | — | D2 | Entries + portraits/voice |
| `ui.panel.credits` | Credits/Notices | Missing | — | F1/F2 | Must say “no external art assets” |
| `ui.panel.chapter_select` | Chapter select | Missing | — | D1 | Locked states clear |
| `ui.panel.upgrade_cards` | Upgrade card family | Missing | — | C | Data-driven icons and text |

### 9.4 Typography and fonts

| ID | Asset | Status | Source | Milestone | Notes |
|---|---|---|---|---|---|
| `font.outfit` | Outfit 400/600/700/800 | External | `index.html` Google Fonts | F1/F3 | Must bundle locally; offline requirement |
| `font.space_grotesk` | Space Grotesk 500/700 | External | `index.html` Google Fonts | F1/F3 | Must bundle locally |
| `font.jetbrains_mono` | JetBrains Mono 400/500/700 | External | `index.html` Google Fonts | F1/F3 | Must bundle locally |
| `ui.type.scale` | Type scale | Partial | `tokens.css` | F2 | Confirm 4.5:1 at all sizes |

### 9.5 Browser chrome

| ID | Asset | Status | Source | Size | Milestone | Notes |
|---|---|---|---|---|---|---|
| `ui.favicon` | Signal-mark favicon | Implemented | `public/favicon.svg` | 64×64 viewBox | PB-7 | Vector cyan/mint/amber tower-and-seed mark; returns 200 on a fresh load, no favicon 404. No raster asset. |

---

## 10. Audio recipes

Audio is procedural Web Audio; there are no audio files. “Implemented” means a working synthesis recipe exists in `AudioService`.

| ID | Cue | Status | Source | Milestone | Notes |
|---|---|---|---|---|---|
| `audio.ui.blip` | UI blip | Implemented | `audio.ts` | A | Sine 880→1760 Hz, 50 ms |
| `audio.ui.radio_chirp` | Radio chirp | Implemented | `audio.ts` | A | Triangle, emotion-dependent |
| `audio.ui.pulse_hum` | Pulse hum | Implemented | `audio.ts` | A/C | Sine 140→320 Hz, 350 ms; placeholder for `audio.pulse` |
| `audio.ui.click` | UI click | Missing | — | F2 | Short, dry |
| `audio.ui.confirm` | UI confirm | Missing | — | F2 | Rising two-tone |
| `audio.shot.flare` | Signal Flare | Missing | — | B | Short tick + trail |
| `audio.hit.enemy` | Enemy hit | Missing | — | B | Soft thud, ±5% pitch |
| `audio.death.enemy` | Enemy death | Missing | — | B | Pop + seed scatter |
| `audio.pickup.seed` | Glow-seed pickup | Missing | — | B | Chirp, +2 semitones per seed |
| `audio.level_up` | Level-up | Missing | — | C | Rising chime |
| `audio.pulse` | Beacon Pulse | Partial | `audio.ts` | C | Final swell; currently reuses `audio.ui.pulse_hum` |
| `audio.coil_arc` | Coil Arc | Missing | — | E1 | Electrical arc |
| `audio.bloomguard` | Bloomguard | Missing | — | E1 | Soft petal hum |
| `audio.wren` | Wren | Missing | — | E2 | Rotor chirp |
| `audio.telegraph` | Telegraph tick | Missing | — | B/E1 | Rising tick; last 150 ms brightens |
| `audio.enemy.shot` | Enemy shot | Missing | — | E1 | Slow scrap launch |
| `audio.boss.phase` | Boss phase change | Missing | — | E3 | Harmonic rise |
| `audio.victory` | Victory | Missing | — | D1/E3 | — |
| `audio.defeat` | Defeat | Missing | — | D1 | — |
| `audio.ambient.drone` | Ambient drone | Missing | — | F1 | Optional chapter variant |

---

## 11. Data and config dependencies

Art cannot ship without these typed records. This table records whether the dependency exists; it does not replace `validate:content`.

| Dependency | Status | Source | Needed by |
|---|---|---|---|
| Theme tokens | Implemented | `src/content/theme/tokens.ts` | All art |
| Game config (viewport, map, player, beacon, scatter) | Implemented | `src/game/config/gameConfig.ts` | Atlas, ground, lighting |
| Mira hero/ability data | Partial | `src/game/content/heroes/mira.ts` | HUD, ability icons |
| Enemy definitions (Seedling, Thornrunner, Rustwing, Briarheart, Stormroot) | Missing | — | Enemy art, spawn, Ledger |
| Variant definitions (Bloomed Seedling) | Missing | — | D2 |
| Chapter/phase/wave data | Partial | `gameConfig.chapter` only | D1/D2/E1–E3 |
| Upgrade definitions and effect model | Missing | — | C |
| Ability definitions (Coil Arc, Bloomguard, Wren) | Partial | `src/game/content/heroes/mira.ts` (Coil Arc only) | E1/E2 |
| Ledger entries and barks | Partial | `src/content/locales/en.ts` | D2 |
| Save schema and migrations | Missing | — | D1 |
| Content validation (`validate:content`) | Stub | `package.json` echo | All milestones |

**Production risk:** `validate:content` and `test:e2e` are currently placeholder echo scripts. They cannot be cited as evidence that art/content dependencies are valid.

---

## 12. Milestone production order

| Milestone | Art deliverables | Exit criteria |
|---|---|---|
| **Pre-B** | Art Bible, manifest, atlas DPR audit, pivot decision, renderer layer seams, flora L-system prototype | PB-1-PB-8 are implemented in the working tree and awaiting review: 2× atlas, dynamic props/landmarks, renderer split, lighting cache/1× migration, staging enemy family split, and PB-8 opening-frame/value/rim pass. PB-8's opening-frame gate passes informally; the full manual matrix remains open. Production changes remain visual-foundation only. |
| **B** | Mira hit; Seedling (corrected palette + serration); Signal Flare; glow-seed; hit/death/pickup VFX; health/XP icons; health/XP HUD; Seedling telegraph | 50+ Seedlings at 60 FPS; Seedling vs nightbloom discrimination; telegraph readable |
| **C** | XP bar; level-up panel; upgrade icons; Pulse icon; Pulse ring VFX; level-up VFX; Pulse audio | Upgrades legible; no color-only information |
| **D1** | Chapter card; victory/defeat panels; chapter select; objective HUD | Full UI flow with keyboard |
| **D2** | Bloomed Seedling; Old Core stage 0; bloom-glow warning; ledger panel/icon; night label | Chapter 1 end-to-end with art |
| **E1** | Thornrunner; Rustwing; enemy shot; gust lane; Coil Arc; Bloomguard; water margins; Old Core stages 1–2; weather layers | Chapters 2–3 end-to-end; telegraphs readable |
| **E2** | Briarheart; slam telegraph; Wren + shot; relay prop; Old Core stage 3 | Chapter 4 end-to-end |
| **E3** | Stormroot; Root Lash; Spore Ring; Old Core stage 4; boss bar; phase colors; Dawn Signal; victory panel + ending caption | Chapter 5 end-to-end; boss phases readable |
| **F1** | Sela/Tavi/Idris portraits; weather polish; remaining icons; full audio set; credits | No placeholder art; all §14 gates pass |
| **F2** | Settings/credits/chapter select accessibility; high-contrast pass | Keyboard-only UI; 48×48 logical px targets |
| **F3** | None new; fix drift and QA failures | Release acceptance criteria |

**Rule:** F1 is a polish and replacement pass, not the first time art appears. Each milestone ships its assets at the §14 gates.

---

## 13. Naming, pivots and technical contract

### 13.1 IDs, atlas keys and files

- Asset ID: `family.asset.state.variant` (e.g., `enemy.seedling.telegraph`, `world.flora.large`).
- **The asset ID is the atlas key.** Frame indices append a dot: `world.mira.down.0`…`world.mira.down.3`, `enemy.seedling.idle`, `enemy.seedling.telegraph`. Do not invent a separate key per animation frame.
- A multi-frame state is one atlas family with frame suffixes; the table lists the range once.
- Recipe name: `create<Family><Asset>Sprite` (e.g., `createSeedlingSprite`).
- One file per family; split before 300 lines. PB-5 split the five staging enemies into `staging/enemies/*.ts`; `staging/EnemySprites.ts` is now only the stable re-export barrel.
- Pure generators: `*Skeleton.ts`, `*Field.ts`, `*Pool.ts`; no Canvas imports.
- Drawers: `*Sprites.ts`, `*Renderer.ts`; Canvas only.

### 13.2 Buffer vs native

- **Buffer px** is the offscreen canvas size, including shadow/glow padding.
- **Native px** is the visible silhouette size at 1×. Where TDD §5.2 defines a size, it must match; other values are art targets and are marked `~`.
- A 36×36 Seedling buffer does not mean a 36 px Seedling; the silhouette is 28 px.

### 13.3 Pivot

Current code uses a center pivot for most sprites. Target convention:

| Asset class | Pivot |
|---|---|
| Grounded entities (Mira, Seedling, Bloomed Seedling, Thornrunner, Briarheart, Old Core, Stormroot) | Bottom-center |
| Flying/hovering (Rustwing, Wren) | Center |
| Projectiles, pickups, VFX | Center |
| UI icons, portraits, panels | Center |

**Why:** bottom-center enables y-sorting and correct contact shadows. This is a pre-B decision.

### 13.4 Atlas scale

PB-1/PB-2 implement a `SpriteBuffer` with logical width/height and a fixed 2× backing store in `buffer.ts`; all 21 recipes and consumers now draw at logical size. DPR 2 sharpness remains a manual review gate.

**Warning:** if `createBuffer` scales the backing store, `canvas.width` becomes the scaled width. The current `drawImage(sprite, -sprite.width / 2, …)` calls would draw at double size. The refactor must carry logical dimensions explicitly. Do not do a one-line scale change.

### 13.5 Provenance

- All world/UI art is original, code-drawn, and has no external license.
- Record the recipe file and author for each asset.
- Fonts are OFL and must be bundled locally; remove Google Fonts CDN links before release.
- If any external asset is ever added, record source, license, attribution and edit history here; update `CREDITS.md`.

### 13.6 QA recording

Every row gets a QA status: `Pending`, `Informal`, `Pass`, or `Fail`. A `Pass` requires the §14 gates, not a visual glance. A `Fail` blocks the milestone even if the asset looks good in isolation.

---

## 14. Current QA status

| Family | Status | Evidence |
|---|---|---|
| World atlas (Mira, beacon, flora, props, landmarks) | Informal (PB-8 opening-frame pass) | 1280×720 DPR 1 spawn frame: Mira rim minimum 5.77:1 vs road / 6.85:1 vs soil, medians 9.65:1 / 11.47:1; grayscale, 50% brightness and DPR 2 reviewed; glasshouse/cold frames readable. No three-tester or colorblind harness yet |
| Enemies | Not tested | Staged only; not wired; palette violates AB-PL-05 |
| Projectiles / pickups / VFX | Not tested | Missing |
| Telegraphs | Not tested | Missing |
| Old Core / Stormroot | Not tested | Missing |
| UI icons | Partial | Inline SVGs; no canonical grid/stroke audit |
| Portraits | Informal (Mira only) | Visible in dossier; other speakers missing |
| Panels | Informal | Four full shells and three partial layouts exist; nine required screens missing |
| Shell / stage / pause accessibility | Pass (shell) | PB-6/PB-7 verified at 1280×720, 1024×768 and 1920×1080: exact stage metrics, zero dossier overflow, 64/36 HUD safe area, dialog focus trap/restore, state-aware Escape, 48 px logical settings rows, favicon 200; 0.8-stage physical target caveat remains documented |
| Audio | Informal | Three synth recipes; most cues missing |

A production art QA harness does not exist yet. It is a pre-B deliverable: render the production atlas at 1×/2×/3×, silhouette, grayscale, colorblind matrices, high contrast, over a production ground crop, with 40 mixed enemies.

---

## 15. Known gaps and risks

1. **Atlas DPR.** PB-1/PB-2 are implemented in the working tree with a fixed 2× `SpriteBuffer` contract, logical dimensions and a 2× backing store; all recipes and atlas consumers are migrated. DPR 2 sharpness remains a manual QA gate and the work is awaiting review.
2. **Baked props/landmarks.** PB-3 is implemented: the ground cache is static terrain only and props/landmarks draw per frame from 2× atlas sources with culling. PB-4 resets the light buffer each frame, so ambient darkness no longer accumulates over unlit props. PB-8 reframed the glasshouse/cold frames and added the `midgroundRimLight` value pass; the opening frame now reads.
3. **Seedling palette.** Staging uses `floraPatch` + `seedCore`, which reads as friendly nightbloom. Fix before B.
4. **Round petals.** Staging Seedling petals are ellipses; they must be serrated/pointed.
5. **Only Mira portrait.** Sela/Tavi/Idris are missing; do not reuse Mira for other speakers.
6. **Generic ability icons.** `AbilitySlots` has only two generic glyphs; the five canonical icons are missing.
7. **Fonts via CDN.** Violates offline/zero-network. Bundle OFL files.
8. **No VFX/telegraph/weather/Old Core systems.** Planned by milestone; do not bolt them into `Renderer.ts`.
9. **64-light pool.** No priority policy; hostile shots can silently lose light.
10. **No y-sort.** Center pivots prevent correct top-down depth; dynamic props are not y-sorted. Decide pivot before B.
11. **`SpriteAtlas` is a nested object.** It will grow unwieldy with enemies, VFX, telegraphs, Old Core and UI. Plan a typed registry before B.
12. **Renderer.ts and lighting split.** PB-3 reduced `Renderer.ts` to 103 lines with separate entity/prop renderers. PB-4 split lighting into a 192-line `LightingPass.ts` and a 138-line `LightingCache.ts`; the light buffer resets each frame, so ambient darkness no longer accumulates over unlit props.
13. **Staging enemy sprites were in one 296-line file.** Resolved in PB-5: five family modules under `staging/enemies/`, an `index.ts` registry, and an 8-line `EnemySprites.ts` re-export barrel; no production impact.
14. **`validate:content` and `test:e2e` are echo stubs.** They cannot be cited as quality evidence.
15. **HUD combat data is placeholder.** Art quality will be judged against a partial HUD until B.
16. **No art QA harness.** Every “looks good” claim is informal until the harness exists.
17. **Font files and icon recipes lack per-asset provenance records.** Add them before release, including the OFL license text for the bundled fonts.

Resolved and committed in PB-6/PB-7: the shared fixed stage, dossier overflow, 64/36 HUD safe area, settings hit envelopes/focus/dialog semantics and the favicon. PB-1-PB-8 are implemented in the working tree and awaiting review; PB-4 fixed the steady-state light-buffer accumulation, PB-5 split the staging enemies without changing the production bundle, and PB-8 resolved the opening-frame composition, prop value separation and Mira silhouette contrast. PB-8's opening-frame gate passes informally; the full three-tester/colorblind matrix remains open.

---

## 16. Change log

| Date | Change | Author |
|---|---|---|
| 2026-10-20 | v1.0 created. Baseline from the current working tree; no game code changed. | Art direction pass |
| 2026-10-20 | Synced the manifest with PB-6/PB-7: game HUD, pause, persona, settings and favicon status; added shell QA evidence. Production code changed; no commit. | Visual foundation pass |
| 2026-10-21 | Rebased world-atlas source paths onto `personas/mira/index.ts` and `items/*`; recorded PB-6/PB-7 as committed shell pass and PB-1 as the active buffer-contract package. | Visual foundation pass |
| 2026-10-21 | PB-1 buffer contract implemented and verified. Current atlas remains 1× until PB-2; no visual output changed. | Visual foundation pass |
| 2026-10-21 | PB-2 migrated all 21 atlas buffers and consumers to the fixed 2x SpriteBuffer contract; logical sizes unchanged. | Visual foundation pass |
| 2026-10-21 | PB-3 moved landmarks/props out of the ground cache into a culled per-frame layer; split entity drawing and corrected layer order. | Visual foundation pass |
| 2026-10-21 | PB-4 split lighting into `LightingCache` and `LightingPass`, migrated 1× masks to `createCanvasSurface`, and reset the light buffer per frame to stop ambient-alpha accumulation. | Visual foundation pass |
| 2026-10-21 | PB-5 split the five staging enemies into `staging/enemies/*.ts`, added the `index.ts` registry, and reduced `staging/EnemySprites.ts` to a stable barrel. Production bundle hashes unchanged; staging only. | Visual foundation pass |
| 2026-10-21 | PB-8 reframed the glasshouse/cold frames, added the `midgroundRimLight` prop/landmark edge pass and lantern-revealed service detail, and added Mira's 1.8 px alpha-derived `miraRimClosed` rim. Measured 5.77:1 minimum road / 6.85:1 soil; grayscale, 50% and DPR 2 reviewed. Opening-frame gate passes informally; awaiting review. | Visual foundation pass |

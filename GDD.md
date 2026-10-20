# NIGHTBLOOM: The Last Signal — Game Design Document

Theme line (every piece of writing serves this): **"A signal is only worth sending if someone is listening."**

Numbers in this document are **starting values** for typed config files. They are meant to be tuned with play and the balance bot, never hard-coded.

---

## 0. Resolved decisions (changes from the original draft)

These close gaps in the first brief. Change any of them here and the agent will follow.

| # | Decision |
|---|---|
| D1 | Every chapter phase has a typed **objective** (`survive_timer`, `defend_entity`, `collect_item`, `defeat_boss`, `defeat_boss_or_survive_timer`) with an explicit lose condition (section 4). |
| D2 | Chapter 2's coil retrieval is an **out-and-back run with the wave spawner still active**, about 60–90 seconds, not a traversal gap (section 6). |
| D3 | Run upgrades reset each chapter. To avoid a "restart" feeling, each chapter starts with **free starting picks** that use the normal card UI (section 4.4). |
| D4 | **3 ability slots** (Signal Flare always takes slot 1), per-upgrade max levels, a fallback card when the pool is empty, and **1 reroll per chapter** plus a **Skip** option (section 4.4). |
| D5 | **Phase retry**: dying lets you retry from the start of the current phase with your build restored from an in-memory snapshot. No mid-run save (section 4.6). |
| D6 | **Difficulty targets** with numbers (section 9). |
| D7 | Technical commitments: seeded RNG, spatial hash, Vitest/Playwright/ESLint/Zod (see `CLAUDE.md`). |
| D8 | Art is **procedural vector art in code**; audio is **Web Audio synthesis** (see `CLAUDE.md`). |
| D9 | Story logic is locked in `docs/STORY_BIBLE.md` (the Ring, the Old Core, the Ninth Column, the night clock, revised chapter scripts). Section 2.2 below is a summary. |
| D10 | Enemy **variants** use a modifier model (`variantOf`), not duplicated definitions (section 5.2). |
| D11 | v1 is **desktop keyboard only**. Touch and gamepad are post-v1 and stated as unsupported. |
| D12 | Characters, barks and Field Ledger voices are specified in `docs/CHARACTERS.md`. An optional radio voice for the convoy (Idris Kael) is included and can be cut without affecting systems. |

---

## 1. Concept

Mira Vale, a field ecologist and signal keeper, must keep an emergency beacon running through a dangerous night so an evacuation convoy can find the last viable seed nursery. The beacon attracts an unnatural storm, the Hollow Wind. Mira survives in open fields, learns why the storm follows the signal, and helps the convoy arrive before dawn.

Tone: hopeful, grounded, atmospheric. Identity: twilight agricultural landscape, luminous nightbloom flowers, salvageable field technology, and a storm that is a **consequence of a damaged signal**, not an evil overlord.

Core loop: move and dodge; abilities fire automatically; enemies drop glow-seeds; XP fills; level-up pauses and offers three upgrade cards; chapters unlock new ability options and story. No permanent runaway stat bonuses.

---

## 2. Story and world

### 2.1 World
The **Low Countries of Aster**, a farming plain under the **Grey Season**, a high-altitude dust veil that has dimmed the sun for years. The rare **nightbloom** holds seeds that may help the region's crops recover.

The **Hollow Wind** is a moving storm carrying broken farm machinery, thorn growth and dormant spores. It is not intelligent or malicious. It follows the strongest signal source in range.

### 2.2 Story logic (summary; full rules in `docs/STORY_BIBLE.md`)
- The Hollow Wind is the Grey Season's own storm. It is drawn to a **ring**: a signal that echoes against itself. The beacon's damaged **Old Core** (an amplifier pylon at the field's heart) rings whenever the beacon transmits. The ring grows the longer it runs and the more power is fed through it, which is why every surge is bigger than the last.
- The storm gathers where the ring is loudest. All night it condenses around the Old Core. **Stormroot** is the Old Core's overgrowth awakened.
- The beacon cannot simply be turned off. The dust veil blocks stars and satellites, so it is the convoy's only navigation, and with no ring to follow the wind goes for the next-nearest signal: a convoy's radios. (Six years ago the Ninth Column was lost exactly this way.)
- The nightbloom is a barometer, not a cause. It brightens before each surge, which is the in-game surge warning. Water muffles the ring (Chapter 3).
- Chapter 4's clean signal is routed through the Old Core's amplifier, which feeds the ring, so the next surge is stronger.
- The ring is beaten by making it quieter (Tavi's antiphase tone, the Signal Lock) or by destroying the Old Core (Stormroot). Cutting it unwinds the gathered storm. It does not cure the Grey Season.

### 2.3 Cast (full sheets in `docs/CHARACTERS.md`)
- **Mira Vale** — playable field ecologist. Base attack Signal Flare; active Beacon Pulse.
- **Dr. Sela Rowan** — nursery botanist, radio and portrait cards. Plant-based upgrades. Proves the nightbloom is innocent.
- **Tavi Rook** — field mechanic, radio and portrait cards. Repairs the relay, builds Wren.
- **Wren** — automatic support drone (an ability, not a companion). No dialogue; chirps as captions.
- **Warden Idris Kael** (optional) — convoy voice on radio only, for stakes.
- **Stormroot** — final boss. Not a talking villain.

Story delivery is short skippable cards and radio captions only. No voice acting, cinematics, dialogue trees, relationship meters or side quests.

---

## 3. Controls

- Move: WASD and arrow keys. Smooth camera follow in a bounded map larger than the viewport. Mira cannot leave the map.
- Beacon Pulse: Space by default, configurable binding.
- Pause: Escape (and P). Menus: arrow keys, Tab, Enter, Escape. Level-up cards: arrows + Enter, or keys 1–3.
- Mouse is for menus only. No manual aiming. Auto-attacks target the nearest eligible enemy in range.

---

## 4. Combat and progression systems

### 4.1 Player (starting values)
| Stat | Value |
|---|---|
| Max health | 100 |
| Move speed | 180 px/s |
| Hit invulnerability | 0.6 s |
| Glow-seed pickup radius | 90 px |
| Starting abilities | Signal Flare, Beacon Pulse |

Clear hit feedback (flash, sound, small shake if enabled), visible health HUD, damage indicators.

### 4.2 Abilities (starting values)
| Ability | Behavior | Values |
|---|---|---|
| **Signal Flare** (base) | projectile | damage 10, interval 0.8 s, projectile speed 520 px/s, range 420 px, 1 projectile |
| **Beacon Pulse** (active, Space) | area pulse | cooldown 12 s, radius 160 px, knockback 220 px, 0.8 s damage reduction 50% to Mira |
| **Coil Arc** (unlock Ch2) | chain | damage 8, interval 1.4 s, 3 jumps, jump range 180 px |
| **Bloomguard** (unlock Ch3) | ring | radius 110 px, active 3 s every 10 s, 30% damage reduction while active, light knockback |
| **Wren** (unlock Ch4) | follower turret | fixed offset (40, -40) px, interval 1.0 s, damage 6, range 300 px |

Each ability definition includes: display string IDs, icon asset ID, behavior ID, targeting rule, cooldown/interval, parameters, unlock chapter, visual/audio effect IDs, and upgrade links.

### 4.3 Upgrade pool (data-driven)
Every upgrade has: `id`, name/description string IDs, icon, `maxLevel`, `requires` (ability unlocked and in a slot, if any), `effects[]` using `add` / `multiply` / `grant_ability` / `set_flag`.

| Upgrade | Per level | Max level |
|---|---|---|
| Flare Damage | +20% base damage | 5 |
| Flare Fire Rate | −12% interval | 5 |
| Projectile Speed | +15% | 3 |
| Targeting Range | +12% | 3 |
| Extra Flare | +1 projectile (small spread) | 3 |
| Movement Speed | +6% | 4 |
| Max Health | +15 max, heal 15 | 4 |
| Field Rations | heal 25% of max (repeatable fallback) | unlimited |
| Pickup Radius (**unlocked by Ch1 Field Ledger**) | +25% | 3 |
| Pulse Recharge | −10% cooldown | 4 |
| Pulse Force | +15% radius and knockback | 3 |
| Coil Arc Power | +25% damage | 4 |
| Coil Arc Reach | +1 jump, +10% jump range | 3 |
| Bloomguard Duration | +0.5 s active | 4 |
| Bloomguard Strength | +5% reduction, +10% knockback | 3 |
| Wren Tempo | −12% interval | 4 |
| Wren Payload | +25% damage | 4 |

Rules:
- Descriptions are formatted from data values and state the effect plainly (for example "+20% Signal Flare damage (now 12)").
- Never offer an upgrade at max level, one that needs an ability the player doesn't hold, or an ability when no slot is free.
- Weighted random choice uses the seeded RNG. Offer three **distinct** cards.
- Fallback: when fewer than three valid cards exist, fill with **Field Rations** and a **Score Bonus** card.

### 4.4 Build shaping and chapter starts (D3, D4)
- **Ability slots: 3.** Signal Flare permanently holds slot 1. Coil Arc, Bloomguard and Wren compete for slots 2 and 3. From Chapter 4 onward the player must choose a pair, which gives build variety.
- **Reroll:** 1 per chapter, rerolls all three cards. **Skip:** takes no upgrade and grants a small Field Rations heal. Both are shown on the level-up screen with keyboard access.
- **Starting picks:** each chapter begins with free picks using the same three-card UI, so later chapters do not feel like a restart.

| Chapter | Free starting picks |
|---|---|
| 1 | 0 |
| 2 | 1 |
| 3 | 2 |
| 4 | 3 |
| 5 | 4 |

Level-up pauses the simulation, shows three cards, applies **exactly one**, then resumes. Guard against double-pick and stuck pause (test this).

### 4.5 XP and glow-seeds
- Defeated enemies drop glow-seeds with an XP value from enemy data.
- Collect by moving within pickup radius. Seeds drift toward Mira once in range.
- XP threshold curve is a config table. Target pacing in Chapter 1: first level-up at about 25–40 s, then about one level-up every 45–75 s, slowing gradually.

### 4.6 Fail states and phase retry (D1, D5)
- **Defeat:** Mira's health reaches 0, **or** a `defend_entity` objective's integrity reaches 0.
- On defeat the player chooses **Retry from Phase N** or **Restart Chapter** or **Title**.
- A **phase snapshot** is taken at the start of every phase: player level, XP, upgrades, ability levels, free picks used, score, rerolls left. Enemies and projectiles are **not** snapshotted; the phase restarts clean.
- Retry restores the snapshot and restarts that phase's timer and wave schedule. A `retriesUsed` counter is shown on the results screen and slightly lowers the score bonus.
- Snapshots are **memory-only** in v1. Closing the page loses them; Continue resumes at the chapter start.

### 4.7 Scoring (config-driven)
Score = enemy score values + objective bonus + time bonus + no-damage streak bonus − retry penalty. Results screen shows score, duration, unlock earned, retries and a rank (for example S/A/B/C from config thresholds). Local records stored per chapter.

---

## 5. Enemies and boss

All enemies: distinct silhouette, distinct movement/attack behavior, a visual and audio telegraph, a color token **plus** a shape/pattern cue. Spawn near the visible camera boundary, never on top of the player, never inside obstacles, always leaving an escape route. Difficulty rises through spawn rate, mix and modest stat changes, not just health inflation.

### 5.1 Base enemies (starting values)
| Enemy | Intro | Role | HP | Speed | Attack |
|---|---|---|---|---|---|
| **Seedling** | Ch1 | slow chaser, drifts toward light | 14 | 55 px/s | contact 6 |
| **Thornrunner** | Ch2 | fast, fragile pack chaser | 8 | 150 px/s | contact 5 |
| **Rustwing** | Ch3 | hovering ranged; stops, flares rotor, fires | 20 | 70 px/s | projectile 8, speed 160 px/s, every 2.4 s, range 380 px |
| **Briarheart** | Ch4 | slow elite | 220 | 40 px/s | ground slam 22, 1.1 s ring telegraph |

### 5.2 Variants (D10)
```text
EnemyVariantDef { id, variantOf: EnemyId, statMultipliers, tintToken, scale, introChapter, ledgerLink? }
```
- **Bloomed Seedling** (late Ch1): HP ×2.2, speed ×1.15, larger petals, amber tint token, extra petal-ring shape cue.
- Later chapters may add variants (for example Ch5 swarm variants) as data only.

### 5.3 Boss: Stormroot (Ch5, phase 4)
- Health bar, three HP-threshold phases, short recovery windows.
- Arena: the open Nightbloom Field around the Old Core. The boss is stationary or near-stationary; the pressure comes from patterns plus adds.

| Attack | Telegraph | Counterplay |
|---|---|---|
| **Root Lash** | ground lines from the core, 1.0 s warning | step out of the lane |
| **Spore Ring** | radial burst of slow projectiles with gaps, 0.8 s charge glow | thread the gaps |
| **Gale Pull** | wide wind arrows plus audio swell, 1.2 s | Beacon Pulse cancels the pull |

- After each attack: a **2.5 s recovery window** where the core is exposed and takes +25% damage.
- Phase 2 (66% HP) adds Spore Ring. Phase 3 (33% HP) adds Gale Pull and shortens recovery to 2.0 s. Each phase has a distinct color token and sound.
- Win condition: defeat Stormroot **or** survive the 300 s **Signal Lock** timer. Both end in victory. Defeating it earlier gives a time bonus and a different ending caption (string IDs).

---

## 6. Campaign

Total first-playthrough target: **67 minutes** (4,020 s of combat) plus cards. Each chapter has a story purpose, a distinct gameplay change and a reward.

Common per-phase fields: `id`, `durationSec`, `objective`, `waves[]` (time, enemy/variant, count, spawn pattern), `hazards[]`, `barkTriggers`, `startCardId`. Chapter fields also include `nightLabelStringId`, `coreGrowthStage` (0–4) and, for surge waves, `warningLeadSec`.

### Chapter 1 — The Nursery Wakes (11 min = 660 s)
Setting: open Nightbloom Field beside the nursery. Teaches movement, auto-attack, seeds, upgrades.

| Phase | Name | Sec | Objective | Content |
|---|---|---|---|---|
| 1 | First Light | 150 | survive_timer | Seedlings only, sparse. Caption prompts: move, collect seeds. First level-up by ~40 s. |
| 2 | Petals Open | 180 | survive_timer | More Seedlings. Beacon Pulse prompt and first use. |
| 3 | Stronger Roots | 150 | survive_timer | Bloomed Seedling introduced late. |
| 4 | First Surge | 180 | survive_timer | Storm surge. Beacon lit. Ends chapter. |

Lose: Mira defeated. **Reward:** Field Ledger and Pickup Radius upgrade added to the pool. Tavi is introduced on the closing radio call, and Idris is heard once as garbled static.

### Chapter 2 — Rustline (13 min = 780 s)
Setting: field extended toward an old irrigation track, rusty machinery as scenery.

| Phase | Name | Sec | Objective | Content |
|---|---|---|---|---|
| 1 | Rust Track | 150 | survive_timer | Seedlings, Thornrunners introduced. |
| 2 | Gust Front | 180 | survive_timer | Telegraphed **gust lane**: a visible lane flashes, then wind pushes along it. Easy to read, not a puzzle. |
| 3 | The Coil Run | 240 | collect_item | A coil marker spawns about 40% of map width away (roughly 12–15 s of travel). Mira walks out, picks it up, then returns to the beacon. Wave spawner stays active with a pressure bump; seeds spawn along the route. Pickup and return are both required. |
| 4 | Relay Restore | 210 | survive_timer | Tavi restores the relay. Mixed groups. |

Lose: Mira defeated. **Reward:** unlock **Coil Arc**. Reveal: the storm follows the ring at the beacon, not the convoy, and would go for the convoy's radios if the beacon went dark (see 2.2 and `docs/STORY_BIBLE.md`).

### Chapter 3 — The Quiet Water (13 min = 780 s)
Setting: open low-lying edge with shallow water at the margins. Not a maze.

| Phase | Name | Sec | Objective | Content |
|---|---|---|---|---|
| 1 | Shallows | 150 | survive_timer | Seedlings and Thornrunners. |
| 2 | First Rustwings | 180 | survive_timer | Rustwings introduced. Prompt: use the pause before they fire. |
| 3 | Guard the Patch | 270 | defend_entity | **Nightbloom Patch** (integrity 300). Seedlings drift toward it and damage it on contact; Rustwings target Mira only; Thornrunners go for Mira. Patch regenerates slowly while no enemy is within 80 px. |
| 4 | Rising Tide | 180 | survive_timer | Combined groups, patch kept as a visual only. |

Lose: Mira defeated **or** patch integrity 0 (phase 3). **Reward:** unlock **Bloomguard**. Reveal: the nightbloom is a barometer, not a cause. Water muffles the ring, the patch stays dark, and the surge still comes.

### Chapter 4 — The Broken Relay (13.5 min = 810 s)
Setting: relay edge with a few signal masts and farm equipment.

| Phase | Name | Sec | Objective | Content |
|---|---|---|---|---|
| 1 | Relay Edge | 150 | survive_timer | Readable combined groups of earlier enemies. |
| 2 | Briarheart | 180 | survive_timer | First Briarheart, then a pair with support. |
| 3 | Backup Relay | 240 | defend_entity | Visible **countdown**. Relay integrity 400. Enemies pressure the relay and Mira. Open-field combat only. |
| 4 | Strongest Surge | 240 | survive_timer | Largest surge so far, all four enemy types. |

Lose: Mira defeated or relay integrity 0 (phase 3). **Reward:** unlock **Wren**. The clean signal lets the convoy lock on, but it is routed through the Old Core's amplifier, which feeds the ring, so the surge is stronger (see `docs/STORY_BIBLE.md`).

### Chapter 5 — Before Dawn (16.5 min = 990 s)
Setting: original Nightbloom Field lit by the beacon with stronger wind, moving flowers, visible storm effects.

| Phase | Name | Sec | Objective | Content |
|---|---|---|---|---|
| 1 | Return to the Field | 180 | survive_timer | Familiar enemies, new combinations. |
| 2 | Convoy Contact | 210 | survive_timer | Idris reports the convoy. Heavier mixes. |
| 3 | Last Surge | 210 | survive_timer | Everything, including Briarheart groups. |
| 4 | Stormroot | up to 390 | defeat_boss_or_survive_timer | Intro beat plus boss. Signal Lock timer 300 s: Tavi's antiphase tone cancelling the ring and the convoy's final approach (story flavor only, no setbacks in v1). Destroying the Old Core also wins. |

Lose: Mira defeated. **Reward:** **Dawn Signal** emblem, ending sequence, and the **Score Attack** replay mode.

### Score Attack (post-campaign)
Replay any unlocked chapter for score, with no phase retry and a score multiplier. Local best per chapter. No mutators in v1 (listed as post-v1 ideas).

---

## 7. Map and visuals

One outdoor map framework, reused by all chapters. Suggested map size 3200 × 2400 px (config). Chapter data swaps lighting, weather overlays, flower patches, edge props, water margins and relay equipment. No indoor scenes, dungeons, puzzle gates or mazes.

Visual identity: **twilight botanical science fiction**. Deep blue-green backgrounds, restrained cyan and amber light, luminous flowers, readable silhouettes. Layers: ground, flower patches, props, entities, light/glow, weather overlay, HUD. Assets and art pipeline: see `CLAUDE.md`.

**Story props (see `docs/STORY_BIBLE.md` section 9):** the **Old Core** pylon stands at the field's heart in every chapter and grows through five stages (0–4, one per chapter) with thorns, machinery and a rising hum, then becomes Stormroot in Chapter 5. **Bloom glow:** nightbloom patches brighten for `warningLeadSec` (start at 45 s) before each storm surge. Add a HUD icon and a sound cue so the warning never relies on color alone. In reduced-flashes mode the glow rises slowly and never flashes. In Chapter 3 the water-margin patch stays dark. Each chapter shows a night label (Dusk, Moonless, Second Watch, Small Hours, Before Dawn) on its intro card.

Asset set required for v1: Mira (idle, move, hit); layered field, props, beacon, shallow-water edges, weather overlays; the four enemies plus Stormroot (idle, move, telegraph, hit, death); Signal Flare, Coil Arc, Bloomguard, Wren and its shot, enemy projectiles, glow-seeds, damage indicators, hit and pickup effects; UI icons (health, XP, abilities, upgrades, chapters, Field Ledger, Dawn Signal); portraits (Mira, Sela, Tavi, Idris) with three states; screen panels for title, chapter, upgrade, pause, settings, victory, defeat.

Audio (Web Audio): UI click/confirm, shot, hit, enemy death, pickup, level-up, Pulse, Coil Arc, Bloomguard, Wren, telegraph warnings, boss phase change, victory, defeat, ambient drone with an optional chapter variant.

---

## 8. UI and persistence

### 8.1 Screens
- **Title:** Start/Continue, Chapter Select (locked chapters clearly shown), How to Play, Settings, Credits.
- **Chapter cards:** skippable intro and interlude text.
- **HUD:** health, XP, level, chapter name and phase/time, objective and countdown, ability cooldowns, defeated count, boss bar when relevant.
- **Level-up:** three cards, reroll, skip, keyboard navigation.
- **Pause:** Resume, Restart Chapter, Settings, Title.
- **Results:** victory/defeat, score, rank, duration, unlock earned, retries, Continue/Replay/Retry Phase.
- **Field Ledger:** discovered enemies and lore entries (see `docs/CHARACTERS.md`).
- **Campaign completion:** ending and campaign stats.
- **Credits/Notices.**

### 8.2 Settings
Master volume, music/effects volume, screen shake on/off, reduced flashes/motion, high contrast, key reference, rebind Beacon Pulse, reset campaign save (with confirmation).

### 8.3 Save data
`schemaVersion`, settings, completed chapter IDs, unlocked ability IDs, ledger discoveries, local records and the emblem flag. Guarded `localStorage`, Zod validation, migrations, graceful recovery with a visible message.

### 8.4 Platform
Desktop browsers (current Chrome, Firefox, Edge, Safari) with a keyboard. The layout resizes responsively. Touch and gamepad are not supported in v1 and the README says so.

---

## 9. Difficulty targets (D6)

These drive tuning and the balance bot. All values are targets, not guarantees.

| Chapter | Player level at end (incl. starting picks) | Peak live enemies | First-attempt clear rate (target) |
|---|---|---|---|
| 1 | 8–10 | 25–40 | ≥ 90% |
| 2 | 10–13 | 40–60 | ≈ 80% |
| 3 | 12–15 | 50–70 | ≈ 75% |
| 4 | 14–17 | 60–90 | ≈ 70% |
| 5 | 16–20 | 80–120 (excluding boss adds) | 55–65% first attempt, ≥ 85% within three attempts using phase retry |

- Hard cap on live enemies in config (start at 200). Spawning throttles at the cap.
- Boss must be beatable with ordinary builds, including builds that took Coil Arc + Wren, Bloomguard + Coil Arc and Wren + Bloomguard.
- Performance target: stable 60 FPS on a typical desktop at the peak enemy counts.

---

## 10. v1 acceptance criteria

1. Full five-chapter campaign can be started, saved, continued, replayed and completed.
2. Chapter 1 teaches the core loop without a tutorial wall.
3. Every chapter has a story purpose, a distinct gameplay change and a meaningful reward.
4. Every ability and upgrade works, renders, has accurate localized text and has been tested in combinations.
5. The final boss is readable, beatable and tested with ordinary builds.
6. Victory, defeat, pause, restart, phase retry, chapter unlock, new-game reset and invalid-save recovery work.
7. No stuck pause, orphaned timer, broken restart, missing asset, runaway spawning or uncaught production error.
8. The interface resizes appropriately. Unsupported touch input is stated clearly.
9. Keyboard navigation and focus work in all menus and upgrade cards. Reduced flashes/motion and high contrast work.
10. No uncredited or unclear-license assets. Credits screen and `CREDITS.md` exist.
11. `npm run typecheck`, `lint`, `test`, `validate:content` and `build` pass. Desktop performance checked.
12. README documents setup, commands, controls, supported browsers, accessibility, credits and known limitations.

Do not call the release v1 while placeholder art, broken menu paths, unfinished chapters or nonfunctional rewards remain.

---

## 11. Post-v1 ideas (not in scope now)

Run mutators ("Heavy Wind", "Night Without Moon"), seeded offline daily challenge, ability evolutions (Coil Arc + Bloomguard), additional playable heroes (see `docs/CHARACTERS.md`), gamepad support, optional persistent mid-chapter resume, Ledger completion cosmetics.

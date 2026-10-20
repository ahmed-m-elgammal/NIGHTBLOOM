# NIGHTBLOOM: The Last Signal — Game Design Document (GDD)

**Project:** NIGHTBLOOM: The Last Signal
**Platform:** Modern Desktop Web Browsers (Chrome, Firefox, Safari, Edge)
**Stack:** React 18+, TypeScript (Strict), Vite, Canvas 2D, Web Audio API
**Theme Line:** *"A signal is only worth sending if someone is listening."*

> **Authority:** This spec restates and organises the source GDD and supporting documents. On any conflict, the originals win: `GDD.md` for mechanics, `STORY_BIBLE.md` for story logic, `CHARACTERS.md` for character voice, `CLAUDE.md` for stack rules, `ARCHITECTURE.md` for engine contracts.

---

## 1. Concept

Mira Vale, a field ecologist and signal keeper, must keep an emergency beacon running through a dangerous night so an evacuation convoy can find the last viable seed nursery. The beacon attracts an unnatural storm, the Hollow Wind. Mira survives in open fields, learns why the storm follows the signal, and helps the convoy arrive before dawn.

**Tone:** Hopeful, grounded, atmospheric.
**Identity:** Twilight agricultural landscape, luminous nightbloom flowers, salvageable field technology, and a storm that is a consequence of a damaged signal — not an evil overlord.

**Core Loop:** Move and dodge → abilities fire automatically → enemies drop glow-seeds → XP fills → level-up pauses and offers three upgrade cards → chapters unlock new ability options and story. No permanent runaway stat bonuses.

### 1.1 Design Pillars
1. **Readable Chaos.** The screen may be full, but the player can always tell what will hurt them and where to go.
2. **Every Pick Changes the Build.** An upgrade is felt within a minute of taking it. No "+1%" picks.
3. **A Hopeful Night.** Warm light against the dark, quiet matters, loss is brief, and the game respects your time (skippable text, phase retry, short chapters).

### 1.2 Non-Goals
- Dense bullet-hell patterns, deep story trees, realism, grind.
- Multiplayer, accounts, servers, API keys, payments.
- Dungeons, mazes, puzzle rooms, base building, indoor scenes.
- Touch or gamepad support in v1 web validation (stated clearly in the README and on narrow/touch devices; mobile touch controls and native wrapper deployment follow post-validation via Capacitor).

---

## 2. Story and World

### 2.1 World
The **Low Countries of Aster**, a farming plain under the **Grey Season**, a high-altitude dust veil that has dimmed the sun for years. The rare **nightbloom** holds seeds that may help the region's crops recover.

The **Hollow Wind** is a moving storm carrying broken farm machinery, thorn growth and dormant spores. It is not intelligent or malicious. It follows the strongest signal source in range.

### 2.2 Story Logic (full rules in STORY_BIBLE.md)

| Rule | Description |
|---|---|
| R1 | The Hollow Wind is the Grey Season's own storm. Not alive, not malicious. |
| R2 | It is drawn to a **ring**: a signal that echoes against itself. |
| R3 | The beacon's **Old Core** (amplifier pylon at the field's heart) has a cracked damping coil. Whenever the beacon transmits, the Old Core rings. The ring grows the longer it runs. **That is why every surge is bigger than the last.** |
| R4 | The storm gathers where the ring is loudest. **Stormroot** is that gathered mass. |
| R5 | With no ring to follow, the wind follows the **nearest strong transmission** — a convoy's radios. (The Ninth Column was lost exactly this way.) |
| R6 | The dust veil blocks stars and satellites. The beacon is the convoy's **only navigation**. It cannot be switched off until the convoy arrives. |
| R7 | The **nightbloom is a barometer, not a cause.** It brightens ~1 minute before each surge. That glow is the in-game surge warning. |
| R8 | The ring is beaten by making it **quieter** — Tavi's antiphase tone (Signal Lock) or destroying the Old Core (Stormroot). |
| R9 | Cutting the ring unwinds the gathered storm. It does not cure the Grey Season. |

### 2.3 Locked Glossary
| Term | Meaning |
|---|---|
| **Beacon** | The lamp mast Mira lights. What the convoy sees. |
| **Old Core** | Amplifier pylon at the field's heart. Damaged. It rings. It becomes Stormroot. |
| **Ring** | The echo the Old Core makes. What the storm follows. |
| **Relay Station** | Tavi's shack at the Relay Edge. Repeats the beacon's signal. |
| **Backup relay** | Second transmitter 200 m up the line from the Relay Station (Ch4). |
| **Carrier / signal** | What the convoy actually hears. |
| **Tenth Column** | The current convoy. Led by Warden Idris Kael. |
| **Ninth Column** | The convoy lost six years ago. |
| **Vault** | The nursery's seed vault. Sela runs it. |
| **Mother patch** | The last living nightbloom patch, at the water margin (Ch3). |

### 2.4 Geography (One Map, Five Chapters)
| Place | Location | Story Use |
|---|---|---|
| **Nursery and vault** | North, off the playable edge | Sela is here. Cannot leave ("I'm the vault's lungs"). |
| **Beacon + Old Core** | Field centre | Mira's home base. Old Core visible every chapter, grows through 5 stages. |
| **Irrigation track** | East | Ch2: rusty harvester with the matching coil. Wind front sits here. |
| **Water margin** | South-west | Ch3: the mother patch. Shallow water muffles the ring. |
| **Relay Edge** | North-east | Ch4: Relay Station (Tavi) and backup relay 200 m further. |
| **Beyond the veil** | South | The Tenth Column approaches from here. Never shown. |

### 2.5 Cast (full sheets in CHARACTERS.md)
- **Mira Vale** — playable field ecologist. Base attack Signal Flare; active Beacon Pulse.
- **Dr. Sela Rowan** — nursery botanist, radio and portrait cards. Plant-based upgrades. Proves the nightbloom is innocent.
- **Tavi Rook** — field mechanic, radio and portrait cards. Repairs the relay, builds Wren.
- **Wren** — automatic support drone (an ability, not a companion). No dialogue; chirps as captions.
- **Warden Idris Kael** (optional) — convoy voice on radio only, for stakes.
- **Stormroot** — final boss. Not a talking villain. A feedback loop with a body.

Story delivery is short skippable cards and radio captions only. No voice acting, cinematics, dialogue trees, relationship meters or side quests.

### 2.6 The Night Clock
| Chapter | Night Label | Lighting | Convoy Status |
|---|---|---|---|
| 1 | **Dusk** | Last blue light | Unheard, one garbled burst at the end |
| 2 | **Moonless** | Deep blue-green | Unspoken |
| 3 | **Second Watch** | Cold, water-reflective | Unspoken |
| 4 | **Small Hours** | Darkest, strongest beacon glow | Idris: three hours out |
| 5 | **Before Dawn** | First grey in the east | Idris: twelve minutes at phase 2 |

### 2.7 Foreshadowing and Payoff
| Plant | Where | Payoff | Where |
|---|---|---|---|
| Old Core pylon, hum rising | Ch1 stage 0 | Becomes Stormroot | Ch5 |
| Old Core growth: thorns → machinery → pulse | Ch2-4 stages 1-3 | Boss doesn't appear from nowhere | Ch5 |
| Bloom glow before each surge | Ch1 | In-game surge warning; evidence for Sela | Ch3 |
| Water muffles the ring; patch stays dark | Ch3 | "Quieter, not louder" | Ch5 plan |
| "Your signal sounds like a kettle" | Ch1 | "No more kettle." | Ch4 |
| "Ticket closed" | Ch2 | "Actually closed." | Ch5 |
| "Say it again once I've stopped shaking." | Ch3 Sela | Mira says it back | Ch5 |
| Mira's "Field note:" tic | Ch1 onward | Dropped when she asks for help | Ch5 |
| Mira switched the beacon off six years ago | Ch1 | She switches it off at the end | Ch5 |
| Wren, built from a failed repair | Ch4 | Tavi's redemption; Wren crosses the front | Ch4-5 |
| Idris as garbled static | Ch1 | Clear voice, then "Wheels on the field" | Ch4-5 |

---

## 3. Controls

- **Move:** WASD and arrow keys. Smooth camera follow in a bounded map larger than the viewport. Mira cannot leave the map.
- **Beacon Pulse:** Space by default, configurable binding.
- **Pause:** Escape (and P). Menus: arrow keys, Tab, Enter, Escape. Level-up cards: arrows + Enter, or keys 1–3.
- **Mouse** is for menus only. No manual aiming. Auto-attacks target the nearest eligible enemy in range.
- v1 is **desktop keyboard only.** Touch and gamepad are not supported.

---

## 4. Player Character: Mira Vale

### 4.1 Base Stats (Starting Values)
| Stat | Value | Unit |
|---|---|---|
| Max health | `100` | HP |
| Move speed | `180` | px/s |
| Hit invulnerability | `0.6` | s |
| Glow-seed pickup radius | `90` | px |
| Starting abilities | Signal Flare, Beacon Pulse | — |
| Ability slots | `3` | Signal Flare permanently holds slot 1 |
| Rerolls per chapter | `1` | — |

Clear hit feedback (flash, sound, small shake if enabled), visible health HUD, damage indicators.

### 4.2 Abilities (Starting Values)
| Ability | Behavior | Values |
|---|---|---|
| **Signal Flare** (base) | Projectile, targets nearest | Damage `10`, interval `0.8 s`, speed `520 px/s`, range `420 px`, `1` projectile |
| **Beacon Pulse** (active, Space) | Area pulse | Cooldown `12 s`, radius `160 px`, knockback `220 px`, 0.8 s damage reduction `50%` |
| **Coil Arc** (unlock Ch2) | Chain | Damage `8`, interval `1.4 s`, `3` jumps, jump range `180 px` |
| **Bloomguard** (unlock Ch3) | Ring | Radius `110 px`, active `3 s` every `10 s`, `30%` damage reduction, light knockback |
| **Wren** (unlock Ch4) | Follower turret | Fixed offset `(40, -40) px`, interval `1.0 s`, damage `6`, range `300 px` |

Each ability definition includes: display string IDs, icon asset ID, behavior ID, targeting rule, cooldown/interval, parameters, unlock chapter, visual/audio effect IDs, and upgrade links.

### 4.3 Upgrade Pool (Data-Driven)
| Upgrade | Per Level | Max Level |
|---|---|---|
| Flare Damage | +20% base damage | 5 |
| Flare Fire Rate | −12% interval | 5 |
| Projectile Speed | +15% | 3 |
| Targeting Range | +12% | 3 |
| Extra Flare | +1 projectile (small spread) | 3 |
| Movement Speed | +6% | 4 |
| Max Health | +15 max, heal 15 | 4 |
| Field Rations | Heal 25% of max (repeatable fallback) | Unlimited |
| Pickup Radius (**unlocked by Ch1 Field Ledger**) | +25% | 3 |
| Pulse Recharge | −10% cooldown | 4 |
| Pulse Force | +15% radius and knockback | 3 |
| Coil Arc Power | +25% damage | 4 |
| Coil Arc Reach | +1 jump, +10% jump range | 3 |
| Bloomguard Duration | +0.5 s active | 4 |
| Bloomguard Strength | +5% reduction, +10% knockback | 3 |
| Wren Tempo | −12% interval | 4 |
| Wren Payload | +25% damage | 4 |

**Rules:**
- Descriptions are formatted from data values and state the effect plainly (e.g. "+20% Signal Flare damage (now 12)").
- Never offer an upgrade at max level, one that needs an ability the player doesn't hold, or an ability when no slot is free.
- Weighted random choice uses the seeded RNG. Offer three **distinct** cards.
- Fallback: when fewer than three valid cards exist, fill with **Field Rations** and a **Score Bonus** card.

### 4.4 Build Shaping and Chapter Starts
- **Ability slots: 3.** Signal Flare permanently holds slot 1. Coil Arc, Bloomguard and Wren compete for slots 2 and 3. From Chapter 5 onward the player must choose a pair, which gives build variety.
- **Reroll:** 1 per chapter, rerolls all three cards. **Skip:** takes no upgrade and grants a small Field Rations heal. Both are shown on the level-up screen with keyboard access.
- **Starting picks:** each chapter begins with free picks using the same three-card UI, so later chapters do not feel like a restart.

| Chapter | Free Starting Picks |
|---|---|
| 1 | 0 |
| 2 | 1 |
| 3 | 2 |
| 4 | 3 |
| 5 | 4 |

Level-up pauses the simulation, shows three cards, applies **exactly one**, then resumes. Guard against double-pick and stuck pause (test this).

### 4.5 XP and Glow-Seeds
- Defeated enemies drop glow-seeds with an XP value from enemy data.
- Collect by moving within pickup radius. Seeds drift toward Mira once in range.
- XP threshold curve is a **config table** (not a formula). Target pacing in Chapter 1: first level-up at about 25–40 s, then about one level-up every 45–75 s, slowing gradually.

### 4.6 Fail States and Phase Retry
- **Defeat:** Mira's health reaches 0, **or** a `defend_entity` objective's integrity reaches 0.
- On defeat the player chooses **Retry from Phase N** or **Restart Chapter** or **Title**.
- A **phase snapshot** is taken at the start of every phase: player level, XP, upgrades, ability levels, free picks used, score, rerolls left. Enemies and projectiles are **not** snapshotted; the phase restarts clean.
- Retry restores the snapshot and restarts that phase's timer and wave schedule. A `retriesUsed` counter is shown on the results screen and slightly lowers the score bonus.
- Snapshots are **memory-only** in v1. Closing the page loses them; Continue resumes at the chapter start.

### 4.7 Scoring (Config-Driven)
Score = enemy score values + objective bonus + time bonus + no-damage streak bonus − retry penalty. Results screen shows score, duration, unlock earned, retries and a **rank** (S/A/B/C from config thresholds). Local records stored per chapter.

---

## 5. Enemies and Boss

All enemies: distinct silhouette, distinct movement/attack behavior, a visual and audio telegraph, a color token **plus** a shape/pattern cue. Spawn near the visible camera boundary, never on top of the player, never inside obstacles, always leaving an escape route. Difficulty rises through spawn rate, mix and modest stat changes, not just health inflation.

### 5.1 Base Enemies (Starting Values)
| Enemy | Intro | Role | HP | Speed | Attack |
|---|---|---|---|---|---|
| **Seedling** | Ch1 | Slow chaser, drifts toward light | `14` | `55 px/s` | Contact `6` |
| **Thornrunner** | Ch2 | Fast, fragile pack chaser | `8` | `150 px/s` | Contact `5` |
| **Rustwing** | Ch3 | Hovering ranged; stops, flares rotor, fires | `20` | `70 px/s` | Projectile `8`, speed `160 px/s`, every `2.4 s`, range `380 px` |
| **Briarheart** | Ch4 | Slow elite | `220` | `40 px/s` | Ground slam `22`, `1.1 s` ring telegraph |

### 5.2 Enemy Ecological Origins and Personalities
| Enemy | Origin | Personality | Telegraph | Ledger Voice |
|---|---|---|---|---|
| **Seedling** | Dormant spores woken by beacon light | Phototropic, drifts toward light, harmless alone | Petals open before contact | Sela |
| **Thornrunner** | Thorn growth riding the wind front | Skittish pack animal, darts and cuts routes | Dust trail plus a short crouch | Mira |
| **Rustwing** | Farm-machine scrap animated by wind | Hovers, "aims", fires slow scrap | Rotor flare, then a pause | Tavi |
| **Briarheart** | Thorn mass grown around a dead tractor engine | Patient, heavy, punishes greed | Ground-ring wind-up | Mira |
| **Stormroot** | The Old Core, overgrown with thorn growth and nightbloom | Not malicious; a feedback loop with a body | Distinct phase colors and sound | Sela and Tavi |

### 5.3 Variants
```
EnemyVariantDef { id, variantOf: EnemyId, statMultipliers, tintToken, scale, introChapter, ledgerLink? }
```
- **Bloomed Seedling** (late Ch1): HP ×2.2, speed ×1.15, larger petals, amber tint token, extra petal-ring shape cue.
- Later chapters may add variants (e.g. Ch5 swarm variants) as data only.

### 5.4 Boss: Stormroot (Ch5, Phase 4)
- Health bar, three HP-threshold phases, short recovery windows.
- Arena: the open Nightbloom Field around the Old Core. The boss is stationary or near-stationary; the pressure comes from patterns plus adds.

| Attack | Telegraph | Counterplay |
|---|---|---|
| **Root Lash** | Ground lines from the core, `1.0 s` warning | Step out of the lane |
| **Spore Ring** | Radial burst of slow projectiles with gaps, `0.8 s` charge glow | Thread the gaps |
| **Gale Pull** | Wide wind arrows plus audio swell, `1.2 s` | **Beacon Pulse cancels the pull** |

- After each attack: a **2.5 s recovery window** where the core is exposed and takes **+25% damage**.
- Phase 2 (66% HP) adds Spore Ring. Phase 3 (33% HP) adds Gale Pull and shortens recovery to 2.0 s. Each phase has a distinct color token and sound.
- Win condition: defeat Stormroot **or** survive the 300 s **Signal Lock** timer. Both end in victory. Defeating it earlier gives a time bonus and a different ending caption (string IDs).

---

## 6. Campaign

Total first-playthrough target: **67 minutes** (4,020 s of combat) plus cards. Each chapter has a story purpose, a distinct gameplay change and a reward.

Common per-phase fields: `id`, `durationSec`, `objective`, `waves[]` (time, enemy/variant, count, spawn pattern), `hazards[]`, `barkTriggers`, `startCardId`. Chapter fields also include `nightLabelStringId`, `coreGrowthStage` (0–4) and `warningLeadSec`.

### Chapter 1 — The Nursery Wakes (11 min = 660 s)
**Setting:** Open Nightbloom Field beside the nursery. Teaches movement, auto-attack, seeds, upgrades.
**Night Label:** Dusk. **Old Core Stage:** 0.

| Phase | Name | Sec | Objective | Content |
|---|---|---|---|---|
| 1 | First Light | 150 | `survive_timer` | Seedlings only, sparse. Caption prompts: move, collect seeds. First level-up by ~40 s. |
| 2 | Petals Open | 180 | `survive_timer` | More Seedlings. Beacon Pulse prompt and first use. |
| 3 | Stronger Roots | 150 | `survive_timer` | Bloomed Seedling introduced late. |
| 4 | First Surge | 180 | `survive_timer` | Storm surge. Beacon lit. Ends chapter. |

**Lose:** Mira defeated. **Reward:** Field Ledger and Pickup Radius upgrade added to the pool. Tavi introduced on the closing radio call; Idris heard once as garbled static.

### Chapter 2 — Rustline (13 min = 780 s)
**Setting:** Field extended toward an old irrigation track, rusty machinery as scenery.
**Night Label:** Moonless. **Old Core Stage:** 1.

| Phase | Name | Sec | Objective | Content |
|---|---|---|---|---|
| 1 | Rust Track | 150 | `survive_timer` | Seedlings, Thornrunners introduced. |
| 2 | Gust Front | 180 | `survive_timer` | Telegraphed **gust lane**: a visible lane flashes, then wind pushes along it. Easy to read, not a puzzle. |
| 3 | The Coil Run | 240 | `collect_item` | A coil marker spawns about 40% of map width away (~12–15 s travel). Mira walks out, picks it up, then returns to the beacon. Wave spawner stays active with a pressure bump; seeds spawn along the route. |
| 4 | Relay Restore | 210 | `survive_timer` | Tavi restores the relay. Mixed groups. |

**Lose:** Mira defeated. **Reward:** Unlock **Coil Arc**. Reveal: the storm follows the ring at the beacon, not the convoy.

### Chapter 3 — The Quiet Water (13 min = 780 s)
**Setting:** Open low-lying edge with shallow water at the margins. Not a maze.
**Night Label:** Second Watch. **Old Core Stage:** 2.

| Phase | Name | Sec | Objective | Content |
|---|---|---|---|---|
| 1 | Shallows | 150 | `survive_timer` | Seedlings and Thornrunners. |
| 2 | First Rustwings | 180 | `survive_timer` | Rustwings introduced. Prompt: use the pause before they fire. |
| 3 | Guard the Patch | 270 | `defend_entity` | **Nightbloom Patch** (integrity 300). Seedlings drift toward it on contact; Rustwings target Mira only; Thornrunners go for Mira. Patch regenerates slowly while no enemy is within 80 px. |
| 4 | Rising Tide | 180 | `survive_timer` | Combined groups, patch kept as a visual only. |

**Lose:** Mira defeated **or** patch integrity 0 (phase 3). **Reward:** Unlock **Bloomguard**. Reveal: the nightbloom is a barometer, not a cause.

### Chapter 4 — The Broken Relay (13.5 min = 810 s)
**Setting:** Relay edge with a few signal masts and farm equipment.
**Night Label:** Small Hours. **Old Core Stage:** 3.

| Phase | Name | Sec | Objective | Content |
|---|---|---|---|---|
| 1 | Relay Edge | 150 | `survive_timer` | Readable combined groups of earlier enemies. |
| 2 | Briarheart | 180 | `survive_timer` | First Briarheart, then a pair with support. |
| 3 | Backup Relay | 240 | `defend_entity` | Visible **countdown**. Relay integrity `400`. Enemies pressure the relay and Mira. Open-field combat only. |
| 4 | Strongest Surge | 240 | `survive_timer` | Largest surge so far, all four enemy types. |

**Lose:** Mira defeated or relay integrity 0 (phase 3). **Reward:** Unlock **Wren**. The clean signal lets the convoy lock on, but it is routed through the Old Core's amplifier, which feeds the ring, so the surge is stronger.

### Chapter 5 — Before Dawn (16.5 min = 990 s)
**Setting:** Original Nightbloom Field lit by the beacon with stronger wind, moving flowers, visible storm effects.
**Night Label:** Before Dawn. **Old Core Stage:** 4 → Stormroot.

| Phase | Name | Sec | Objective | Content |
|---|---|---|---|---|
| 1 | Return to the Field | 180 | `survive_timer` | Familiar enemies, new combinations. |
| 2 | Convoy Contact | 210 | `survive_timer` | Idris reports the convoy. Heavier mixes. |
| 3 | Last Surge | 210 | `survive_timer` | Everything, including Briarheart groups. |
| 4 | Stormroot | up to 390 | `defeat_boss_or_survive_timer` | Intro beat plus boss. Signal Lock timer 300 s: Tavi's antiphase tone cancelling the ring. Destroying the Old Core also wins. |

**Lose:** Mira defeated. **Reward:** Dawn Signal emblem, ending sequence, and **Score Attack** replay mode.

### Score Attack (Post-Campaign)
Replay any unlocked chapter for score, with no phase retry and a score multiplier. Local best per chapter. **No mutators in v1** (listed as post-v1 ideas).

---

## 7. Map and Visuals

One outdoor map framework, reused by all chapters. Map size **3200 × 2400 px** (config). Chapter data swaps lighting, weather overlays, flower patches, edge props, water margins and relay equipment. No indoor scenes, dungeons, puzzle gates or mazes.

Visual identity: **twilight botanical science fiction**. Deep blue-green backgrounds, restrained cyan and amber light, luminous flowers, readable silhouettes.

**Render layers (draw order):** ground → flower patches → props → entities → **telegraphs and hostile shots** → glow/light → weather overlay → HUD. No effect may hide a hostile shot or a telegraph.

**Old Core growth stages (data, one per chapter):** 0 inert pylon, dim hum → 1 thorn tendrils at base → 2 thorns climbing, faint glow → 3 wrapped in scrap machinery, audible pulse → 4 massive, visibly pulsing → boss: awakens as **Stormroot**. The hum rises in pitch with each stage.

**Bloom glow:** nightbloom patches brighten for `warningLeadSec` (start at 45 s) before each storm surge. Add a HUD icon and a sound cue so the warning never relies on color alone. In reduced-flashes mode the glow rises slowly and never flashes. In Chapter 3 the water-margin patch stays dark.

### 7.1 Style Tile — Shape Language and Sizes (at 1280×720 logical)
| Thing | Silhouette | Size | Color Role | Pattern Cue |
|---|---|---|---|---|
| Mira | Rounded figure with a lamp | 40 px tall | Cyan accent | Lamp glow |
| Seedling | Round bulb with five petals | 28 px | Green-teal | Petals open before contact |
| Bloomed Seedling | Seedling with a petal ring | 36 px | Amber tint | Outer petal ring |
| Thornrunner | Low angular wedge | 26 × 20 px | Thorn green, dark | Dust trail |
| Rustwing | Cross with a rotor, tilted, hover shadow | 34 px | Rust | Rotor flare |
| Briarheart | Heavy hex with a thorn ring | 72 px | Dark thorn | Ground ring wind-up |
| Stormroot | Large asymmetric tangle with a core | ~220 px | Phase colors | Core glow |
| Glow-seed | Small circle with a halo | 10 px | Mint | Only thing that drifts to Mira |
| Flare shot | Soft teardrop | 12 × 6 px | Cyan-white | Trail |
| Enemy shot | Pointed diamond, dark outline, bright core | 14 px, never under 10 | Amber | Outline |

### 7.2 Readability Rules
1. Gameplay-critical elements (player, enemy shots, telegraphs, pickups) keep luminance contrast ≥ **3:1** against the local ground in every chapter's lighting.
2. Hostile = pointed with dark outline and amber core. Friendly = soft and round in cyan or mint. Never reuse a hostile shape for a pickup.
3. Telegraphs sit on the ground, are hatched, and show time left with a shrinking inner ring.
4. Background motion (flowers, weather) is low in contrast and small in amplitude.
5. Cap simultaneous glow sprites, particles and damage numbers (values from performance spike).
6. Every chapter's lighting checked in grayscale, three color-blindness simulations, high-contrast palette and at 50% brightness.
7. Color roles (tokens, not hex): Ground/flowers = deep blue-green. Friendly signal/Mira = cyan. Hostile attacks/warnings = amber (always with shape/outline cue). XP/pickups = mint. Health = warm red plus icon and number.

---

## 8. UI and Persistence

### 8.1 Screens
- **Title:** Start/Continue, Chapter Select (locked chapters clearly shown), How to Play, Settings, Field Ledger, Credits/Notices.
- **Chapter cards:** skippable intro and interlude text.
- **HUD:** health, XP bar, level, chapter name and phase/time, objective and countdown, ability cooldowns, defeated count, boss bar when relevant.
- **Level-up:** three cards, reroll, skip, keyboard navigation (keys 1–3, arrows + Enter).
- **Pause:** Resume, Restart Chapter, Settings, Title.
- **Results:** victory/defeat, score, rank (S/A/B/C), duration, unlock earned, retries, Continue/Replay/Retry Phase/Title.
- **Field Ledger:** discovered enemies and lore entries.
- **Campaign completion:** ending and campaign stats.
- **Credits/Notices.**

### 8.2 Viewport
Fixed **1280×720 logical** game box, scaled uniformly to fit the window with letterbox bars in the background token color. Canvas and HUD scale together so every screen sees the same area. Backing store is `devicePixelRatio` aware. Menus may reflow, but the play field never shows extra map on large or ultrawide screens. HUD stays inside a safe margin of 64 px horizontally and 36 px vertically.

### 8.3 Settings
Master volume, music/effects volume, screen shake on/off, reduced flashes/motion, high contrast, key reference, rebind Beacon Pulse, reset campaign save (with confirmation).

### 8.4 Save Data
`schemaVersion`, `profileId`, settings, `campaigns: { [campaignId]: { completedChapterIds, records } }`, `unlocks: { abilityIds, heroIds, ledgerEntryIds, flags }`, `createdAt`, `updatedAt`. Guarded `localStorage`, Zod validation, migrations, graceful recovery with a visible message.

### 8.5 Platform
Desktop browsers (current Chrome, Firefox, Edge, Safari) with a keyboard. The layout resizes responsively. Touch and gamepad are not supported in v1 and the README says so.

---

## 9. Difficulty Targets

These drive tuning and the balance bot. All values are targets, not guarantees.

| Chapter | Player Level at End (incl. starting picks) | Peak Live Enemies | First-Attempt Clear Rate (target) |
|---|---|---|---|
| 1 | 8–10 | 25–40 | ≥ 90% |
| 2 | 10–13 | 40–60 | ≈ 80% |
| 3 | 12–15 | 50–70 | ≈ 75% |
| 4 | 14–17 | 60–90 | ≈ 70% |
| 5 | 16–20 | 80–120 (excl. boss adds) | 55–65% first attempt, ≥ 85% within three attempts using phase retry |

- Hard cap on live enemies in config (start at 200). Spawning throttles at the cap.
- Boss must be beatable with ordinary builds, including Coil Arc + Wren, Bloomguard + Coil Arc, and Wren + Bloomguard.
- Performance target: stable 60 FPS on a typical desktop at peak enemy counts.

---

## 10. Game Feel Spec (Starting Values, Tuned in Spike S3)

| Event | Visual | Audio | Start Value | Tuning Range |
|---|---|---|---|---|
| Movement | Instant direction, ease to speed | Soft footfall loop (optional) | Accel 70 ms, decel 50 ms | 0–120 ms, 30–100 ms |
| Camera | Smooth follow, clamped to map | — | Time constant 0.12 s | 0.05–0.25 s |
| Flare fired | 40 ms muzzle flash, short trail | Short "tick" | Trail 6 segments | 0–10 |
| Enemy hit | 60 ms white flash, damage number rises 24 px / 450 ms | Soft thud, pitch ±5% | Numbers merge within 100 ms, max 40 on screen | 20–60 |
| Enemy death | 150 ms pop (scale 1→1.3, fade), seed scatter | Pop, pitch ±5% | — | — |
| Pickup | Seed accelerates 120→480 px/s inside radius | Chirp, +2 semitones/pickup within 0.5 s, max +12 | Radius 90 px | 60–140 px |
| Player hit | 80 ms white flash then 8 Hz blink during i-frames, edge vignette 200 ms | Low thump | Shake 3 px / 150 ms, hit-stop 40 ms | 0–6 px, 0–80 ms |
| Beacon Pulse | Ring expands over 300 ms | Low swell | Shake 4 px / 120 ms | 0–6 px |
| Level-up | Freeze, cards fade in 120 ms | Rising chime | — | 0–250 ms |
| Telegraph | Hatched ground ring, shrinking inner ring, brightens last 150 ms | Rising tick | — | — |
| Surge warning | Bloom glow rises over 45 s (`warningLeadSec`), HUD icon | Slow low swell | 45 s | 30–60 s |

**Reduced flashes/motion:** no blink (steady 50% alpha during i-frames), no shake, no hit-stop, no trail, instant card appearance, monotonic glow fade with no pulsing.

---

## 11. v1 Acceptance Criteria

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

---

## 12. Post-v1 Ideas (Not in Scope Now)

Run mutators ("Heavy Wind", "Night Without Moon"), seeded offline daily challenge, ability evolutions (Coil Arc + Bloomguard = "Storm Garden"), additional playable heroes, gamepad support, optional persistent mid-chapter resume, Ledger completion cosmetics.

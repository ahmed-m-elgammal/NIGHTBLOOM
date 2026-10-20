# NIGHTBLOOM: The Last Signal — Data Model and API Specification

**Project Name:** NIGHTBLOOM: The Last Signal  
**Target Platform:** Modern Desktop Web Browsers (Chrome, Firefox, Safari, Edge)  
**Stack:** TypeScript (Strict), Zod, LocalStorage / In-Memory Storage  
**Document Status:** Approved Specification v1.0  
**Authority:** This document expands `ARCHITECTURE.md`, `CHARACTERS.md`, and `STORY_BIBLE.md`. On any conflict, those source documents win.

---

## 1. Overview & Data Philosophy

*NIGHTBLOOM: The Last Signal* is an offline, single-player desktop browser game. It has **no backend server, no REST/GraphQL API, no user accounts, and no online telemetry in v1**.

The data architecture is built on:
1. **Immutable Content Records:** All chapters, phases, enemies, upgrades, dialogue beats, barks, and lore entries are typed records loaded from content packs.
2. **Strict Zod Schemas:** Every content record, save file, and event payload is validated with Zod at build time, dev time, and load time.
3. **Reference Integrity Pass:** `npm run validate:content` verifies that all string IDs, asset IDs, enemy IDs, and character IDs resolve across merged content packs. Unknown IDs fail the build.
4. **Offline Persistence:** Persistent progress is stored via `SaveService` using an `IStorageAdapter` (defaulting to browser `localStorage` with in-memory fallback).

---

## 2. Content Pack System

Content is structured in self-contained packs:
```typescript
interface ContentPack {
  id: string;        // e.g., "core"
  version: string;   // e.g., "1.0.0"
  records: {
    campaigns: CampaignDef[];
    chapters: ChapterDef[];
    phases: PhaseDef[];
    heroes: HeroDef[];
    characters: CharacterDef[];
    enemies: EnemyDef[];
    variants: EnemyVariantDef[];
    bosses: BossDef[];
    abilities: AbilityDef[];
    upgrades: UpgradeDef[];
    pickups: PickupDef[];
    dialogueBeats: DialogueBeatDef[];
    barks: BarkDef[];
    ledgerEntries: LedgerEntryDef[];
    mapThemes: MapThemeDef[];
    assets: AssetDef[];
  };
}
```

### Pack Merge & Loading Rules
- v1 ships with a single `core` pack.
- Future story packs or expansions add new content without modifying engine source code.
- Duplicate IDs across packs throw a collision error.
- Cross-references must resolve across the merged set; missing references fail validation.
- Load order is explicit and declared in configuration.

---

## 3. Content Record Schemas (Zod & TypeScript)

### 3.1 Campaign & Chapter Definitions
```typescript
import { z } from 'zod';

export const UnlockRuleSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('always') }),
  z.object({ type: z.literal('chapter_completed'), chapterId: z.string() }),
  z.object({ type: z.literal('flag'), flag: z.string() }),
]);

export const ObjectiveDefSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('survive_timer'),
    durationSec: z.number().positive(),
  }),
  z.object({
    type: z.literal('defend_entity'),
    targetEntityId: z.string(),
    maxIntegrity: z.number().positive(),
    durationSec: z.number().positive(),
  }),
  z.object({
    type: z.literal('collect_item'),
    itemId: z.string(),
    spawnDistanceFraction: z.number().min(0.1).max(0.9), // e.g., 0.4 of map width
    durationSec: z.number().positive(),
  }),
  z.object({
    type: z.literal('defeat_boss'),
    bossId: z.string(),
  }),
  z.object({
    type: z.literal('defeat_boss_or_survive_timer'),
    bossId: z.string(),
    durationSec: z.number().positive(), // 300s Signal Lock
  }),
]);

export const WaveDefSchema = z.object({
  atSec: z.number().nonnegative(),
  enemyId: z.string(),
  variantId: z.string().optional(),
  count: z.number().int().positive(),
  pattern: z.enum(['cluster', 'ring', 'flank_left', 'flank_right', 'perimeter']),
  warningLeadSec: z.number().nonnegative().optional(),
});

export const PhaseDefSchema = z.object({
  id: z.string(),
  durationSec: z.number().positive(),
  objective: ObjectiveDefSchema,
  waves: z.array(WaveDefSchema),
  hazards: z.array(z.string()).default([]),
  startCardId: z.string().optional(),
});

export const ChapterDefSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  order: z.number().int().positive(),
  titleId: z.string(),
  nightLabelStringId: z.string(), // "Dusk", "Moonless", "Second Watch", "Small Hours", "Before Dawn"
  coreGrowthStage: z.number().int().min(0).max(4),
  mapThemeId: z.string(),
  startingPicks: z.number().int().nonnegative(), // Ch1: 0, Ch2: 1, Ch3: 2, Ch4: 3, Ch5: 4
  phases: z.array(PhaseDefSchema),
  cards: z.object({
    introCardId: z.string(),
    interludeCardIds: z.array(z.string()).default([]),
    rewardCardId: z.string(),
  }),
  rewards: z.array(z.string()),
});

export const CampaignDefSchema = z.object({
  id: z.string(),
  titleId: z.string(),
  chapterIds: z.array(z.string()).min(1),
  unlockRule: UnlockRuleSchema,
});
```

### 3.2 Characters, Dialogue & Bark Schemas
```typescript
export const CharacterDefSchema = z.object({
  id: z.string(), // "mira", "sela", "tavi", "idris", "wren"
  nameId: z.string(),
  roleId: z.string(),
  portraitSetId: z.string(), // references procedural vector portrait definition
  voiceTags: z.array(z.string()),
});

export const DialogueBeatDefSchema = z.object({
  id: z.string(),
  speakerId: z.string(), // references CharacterDef.id
  stringId: z.string(),
  trigger: z.string(),
  once: z.boolean().default(true),
});

export const BarkTriggerSchema = z.enum([
  'first_kill_seedling',
  'first_kill_thornrunner',
  'first_kill_rustwing',
  'first_kill_briarheart',
  'low_health',
  'health_restored',
  'level_up_milestone',
  'boss_phase_change',
  'near_miss',
  'pulse_clutch',
  'long_no_damage',
  'entity_low_patch',
  'entity_low_relay',
  'ability_unlocked',
  'objective_complete',
  'wren_first_shot',
]);

export const BarkDefSchema = z.object({
  id: z.string(),
  speakerId: z.string(), // references CharacterDef.id
  trigger: BarkTriggerSchema,
  stringId: z.string(),
  cooldownSec: z.number().positive(),
  globalCooldownSec: z.number().positive().default(12),
  chapterRange: z.tuple([z.number().int(), z.number().int()]),
  chance: z.number().min(0).max(1),
  maxPerRun: z.number().int().positive(),
});

export const LedgerEntryDefSchema = z.object({
  id: z.string(),
  titleId: z.string(),
  voiceSpeakerId: z.string(), // references CharacterDef.id
  bodyId: z.string(),
  discoverOn: z.string(), // "chapter_1", "first_kill_thornrunner", etc.
});
```

### 3.3 Hero, Ability & Upgrade Schemas
```typescript
export const HeroDefSchema = z.object({
  id: z.string(), // "hero_mira"
  nameId: z.string(),
  baseStats: z.object({
    maxHealth: z.number().positive(),        // 100
    moveSpeed: z.number().positive(),        // 180 px/s
    hitInvulnerabilitySec: z.number().positive(), // 0.6 s
    pickupRadius: z.number().positive(),     // 90 px
  }),
  startingAbilityIds: z.array(z.string()),   // ["ability_signal_flare"]
  activeSkillId: z.string(),                 // "ability_beacon_pulse"
  portraitId: z.string(),
  unlockRule: UnlockRuleSchema,
});

export const AbilityDefSchema = z.object({
  id: z.string(),
  nameId: z.string(),
  behaviorId: z.enum(['projectile', 'area_pulse', 'chain', 'follower_turret', 'ring_shield']),
  targetingRule: z.enum(['nearest', 'lowest_hp', 'chain_nearest', 'area_player', 'follower']),
  cooldownSec: z.number().positive(),
  params: z.record(z.unknown()),
  unlockChapter: z.number().int().min(1).max(5),
  audioSfxId: z.string(),
  upgradeLinks: z.array(z.string()),
});

export const UpgradeEffectSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('add'),
    target: z.string(), // e.g., "flare.damage", "player.maxHealth"
    value: z.number(),
  }),
  z.object({
    type: z.literal('multiply'),
    target: z.string(), // e.g., "flare.interval", "player.moveSpeed"
    factor: z.number().positive(),
  }),
  z.object({
    type: z.literal('grant_ability'),
    abilityId: z.string(),
  }),
  z.object({
    type: z.literal('set_flag'),
    flag: z.string(),
    value: z.boolean(),
  }),
]);

export const UpgradeDefSchema = z.object({
  id: z.string(),
  nameId: z.string(),
  descriptionFormatId: z.string(),
  maxLevel: z.number().int().positive().nullable(), // null = unlimited (e.g. Field Rations)
  requires: z.array(z.string()).default([]),       // ability prerequisites or ledger unlock
  effects: z.array(UpgradeEffectSchema),
});
```

### 3.4 Enemy, Variant & Boss Schemas
```typescript
export const EnemyDefSchema = z.object({
  id: z.string(), // "seedling", "thornrunner", "rustwing", "briarheart"
  nameId: z.string(),
  role: z.string(),
  hp: z.number().positive(),
  speedPxPerSec: z.number().positive(),
  contactDamage: z.number().positive(),
  behaviorId: z.enum(['chase', 'dart', 'hover_shoot', 'slam']),
  telegraphLeadSec: z.number().nonnegative(),
  glowSeedValue: z.number().int().positive(),
  scoreValue: z.number().int().positive(),
  projectileParams: z.object({
    speedPxPerSec: z.number().positive(),
    damage: z.number().positive(),
    intervalSec: z.number().positive(),
    rangePx: z.number().positive(),
  }).optional(),
  slamParams: z.object({
    telegraphDurationSec: z.number().positive(),
    ringRadiusPx: z.number().positive(),
    damage: z.number().positive(),
  }).optional(),
});

export const EnemyVariantDefSchema = z.object({
  id: z.string(), // "bloomed_seedling"
  variantOf: z.string(), // references EnemyDef.id ("seedling")
  statMultipliers: z.object({
    hp: z.number().positive().default(1.0),       // 2.2 for bloomed_seedling
    speed: z.number().positive().default(1.0),    // 1.15 for bloomed_seedling
    damage: z.number().positive().default(1.0),
    seedDrop: z.number().positive().default(1.0),
  }),
  tintToken: z.string(),
  scale: z.number().positive().default(1.0),
  introChapter: z.number().int().positive(),
  ledgerLink: z.string().optional(),
});

export const BossAttackDefSchema = z.object({
  id: z.enum(['root_lash', 'spore_ring', 'gale_pull']),
  telegraphDurationSec: z.number().positive(), // 1.0s, 0.8s, 1.2s
  damage: z.number().positive(),
  counterplayNote: z.string(),
});

export const BossDefSchema = z.object({
  id: z.literal('stormroot'),
  nameId: z.string(),
  phases: z.array(z.object({
    phaseIndex: z.number().int().min(1).max(3),
    hpThresholdFraction: z.number().min(0).max(1), // 1.0, 0.66, 0.33
    attacks: z.array(z.string()),
    recoveryWindowSec: z.number().positive(),     // 2.5s (phases 1-2), 2.0s (phase 3)
    coreVulnerabilityMultiplier: z.number().default(1.25), // +25% damage during recovery
    phaseTintToken: z.string(),
  })),
  signalLockTimerSec: z.number().default(300),
});
```

### 3.5 Map Theme, Asset & Pickup Schemas
```typescript
export const MapThemeDefSchema = z.object({
  id: z.string(),
  lightingColorToken: z.string(),
  weatherOverlayId: z.string().optional(),
  flowerPatchDensity: z.number().min(0).max(1),
  props: z.array(z.string()),
  waterMarginVisible: z.boolean().default(false),
});

export const AssetDefSchema = z.object({
  id: z.string(),
  recipe: z.string(), // procedural draw function identifier
  license: z.string(),
});

export const PickupDefSchema = z.object({
  id: z.string(),
  type: z.enum(['glow_seed', 'quest_item']),
  xpValue: z.number().int().nonnegative(),
  driftSpeedStart: z.number().positive(), // 120 px/s
  driftSpeedMax: z.number().positive(),   // 480 px/s
  pickupRadius: z.number().positive(),   // 90 px
});
```

---

## 4. Persistence & Local Save Data Schema

### 4.1 Save Document (`SaveDocument`)
Conforms strictly to `ARCHITECTURE.md` Section 5.2:
```typescript
export const ChapterRunRecordSchema = z.object({
  highScore: z.number().int().nonnegative(),
  bestTimeSec: z.number().positive(),
  rank: z.enum(['S', 'A', 'B', 'C']),
  clearCount: z.number().int().positive(),
});

export const UserSettingsSchema = z.object({
  masterVolume: z.number().min(0).max(1).default(0.8),
  sfxVolume: z.number().min(0).max(1).default(0.8),
  ambientVolume: z.number().min(0).max(1).default(0.6),
  screenShake: z.boolean().default(true),
  reduceMotion: z.boolean().default(false),
  reduceFlashes: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  pulseKeyBinding: z.string().default('Space'),
});

export const SaveDocumentSchema = z.object({
  schemaVersion: z.number().int().positive(),
  profileId: z.literal('default'),
  settings: UserSettingsSchema,
  campaigns: z.record(
    z.string(),
    z.object({
      completedChapterIds: z.array(z.string()),
      records: z.record(z.string(), ChapterRunRecordSchema),
    })
  ),
  unlocks: z.object({
    abilityIds: z.array(z.string()),
    heroIds: z.array(z.string()),
    ledgerEntryIds: z.array(z.string()),
    flags: z.record(z.string(), z.boolean()), // e.g., dawn_signal_unlocked
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type SaveDocument = z.infer<typeof SaveDocumentSchema>;
```

### 4.2 Storage Adapter & Safety Rules
- Transient run state (live enemies, active projectiles, dynamic health) is **never** written to persistent storage.
- Storage operations go through `SaveService` via `IStorageAdapter`:
  - `LocalStorageAdapter`: Active in desktop browsers.
  - `MemoryAdapter`: Active during headless test suites and when cookies/storage are disabled.
- **Save Backup & Migration:** Before applying schema migrations, an archival copy is saved under `nightbloom_save_backup_vN`.
- **Fault Tolerance:** If a save is corrupted or fails validation, default settings and fresh campaign state are loaded, preserving the corrupt payload under `nightbloom_corrupt_<timestamp>`.

---

## 5. Standard Content Catalog

### 5.1 Starter Barks (36 Entries from CHARACTERS.md §7)
All 36 barks follow typed trigger conditions and speaker voices:
1. `bark.mira.first_kill_seedling` (Mira, `first_kill_seedling`, Ch 1): *"Field note: they fall apart easier than they look."*
2. `bark.sela.first_kill_seedling` (Sela, `first_kill_seedling`, Ch 1): *"Sorry. They're only trying to reach the light."*
3. `bark.mira.first_kill_thornrunner` (Mira, `first_kill_thornrunner`, Ch 2–5): *"Field note: fast, fragile. Don't give them a straight line."*
4. `bark.tavi.first_kill_rustwing` (Tavi, `first_kill_rustwing`, Ch 3–5): *"That's a rotor and a bad attitude. Dropped it."*
5. `bark.mira.first_kill_briarheart` (Mira, `first_kill_briarheart`, Ch 4–5): *"Field note: it was a tractor. It's less of one now."*
6. `bark.mira.low_health` (Mira, `low_health`, Ch 1–5): *"I'm fine. I'm fine. Give me a second."*
7. `bark.sela.low_health` (Sela, `low_health`, Ch 1–5): *"Mira, you're bleeding signal. Back off for a moment."*
8. `bark.tavi.low_health` (Tavi, `low_health`, Ch 2–5): *"That's a red light on my console and it's not the relay."*
9. `bark.idris.low_health` (Idris, `low_health`, Ch 4–5): *"Mira, status. Say anything."*
10. `bark.mira.health_restored` (Mira, `health_restored`, Ch 1–5): *"Okay. Okay. Better."*
11. `bark.sela.health_restored` (Sela, `health_restored`, Ch 1–5): *"There she is."*
12. `bark.mira.level_up_milestone` (Mira, `level_up_milestone`, Ch 1–5): *"Field note: the field is adapting. So am I."*
13. `bark.tavi.level_up_milestone` (Tavi, `level_up_milestone`, Ch 2–5): *"Running hot, still running. Good."*
14. `bark.sela.level_up_milestone` (Sela, `level_up_milestone`, Ch 1–5): *"The nursery logged that. Something is growing, even now."*
15. `bark.mira.near_miss` (Mira, `near_miss`, Ch 1–5): *"Too close. I'm quieter when it's too close."*
16. `bark.tavi.near_miss` (Tavi, `near_miss`, Ch 2–5): *"Ticket opened: do not do that again."*
17. `bark.mira.pulse_clutch` (Mira, `pulse_clutch`, Ch 1–5): *"That cleared more than it should have."*
18. `bark.tavi.pulse_clutch` (Tavi, `pulse_clutch`, Ch 2–5): *"Good. I'd have charged for that one."*
19. `bark.sela.long_no_damage` (Sela, `long_no_damage`, Ch 1–5): *"You're moving like water. Keep going."*
20. `bark.tavi.long_no_damage` (Tavi, `long_no_damage`, Ch 2–5): *"No hits in a minute. I'm suspicious, but pleased."*
21. `bark.sela.entity_low_patch` (Sela, `entity_low_patch`, Ch 3): *"The patch is fading. Please — no, don't be gentle. Hold them off."*
22. `bark.tavi.entity_low_relay` (Tavi, `entity_low_relay`, Ch 4): *"Relay's at thirty. I can't push it harder."*
23. `bark.idris.entity_low_relay` (Idris, `entity_low_relay`, Ch 4): *"Relay is failing. Three hours is a long time to be blind."*
24. `bark.tavi.ability_coil` (Tavi, `ability_unlocked`, Ch 2): *"Coil Arc, installed. Try not to light yourself up."*
25. `bark.sela.ability_bloomguard` (Sela, `ability_unlocked`, Ch 3): *"Bloomguard. The petals shield. Sorry, I mean it's a ring of pollen that, yes, shields."*
26. `bark.tavi.ability_wren` (Tavi, `ability_unlocked`, Ch 4): *"Wren will follow you. It's not a companion. It's a tool with opinions."*
27. `bark.wren.first_shot` (Wren, `wren_first_shot`, Ch 4–5): *"[Wren chirps twice]"*
28. `bark.wren.low_health` (Wren, `low_health`, Ch 4–5): *"[Wren stutters, recovers]"*
29. `bark.wren.level_up` (Wren, `level_up_milestone`, Ch 4–5): *"[Wren whirs, pleased]"*
30. `bark.tavi.objective_complete` (Tavi, `objective_complete`, Ch 2–5): *"Done. Logging it."*
31. `bark.sela.objective_complete` (Sela, `objective_complete`, Ch 1–5): *"That's one fewer thing to be afraid of."*
32. `bark.mira.objective_complete` (Mira, `objective_complete`, Ch 1–5): *"We're still here."*
33. `bark.mira.boss_phase` (Mira, `boss_phase_change`, Ch 5): *"New pattern. Adjusting."*
34. `bark.sela.boss_phase` (Sela, `boss_phase_change`, Ch 5): *"That's the loop reacting. It's afraid. I mean — it's responding."*
35. `bark.tavi.boss_phase` (Tavi, `boss_phase_change`, Ch 5): *"Okay, that's new. Write it down."*
36. `bark.idris.boss_phase` (Idris, `boss_phase_change`, Ch 5): *"Convoy to Mira. We see lightning. Hold."*

### 5.2 Field Ledger Entries (12 Entries from CHARACTERS.md §5)
1. `ledger.seedling` (Sela): *"Dormant spores, woken by the beacon's light. They lean toward it the way any seedling would. They aren't hungry. They're early."*
2. `ledger.bloomed_seedling` (Sela): *"Same spore, better fed. The petals open wider when it's close. Nature doing its best, badly."*
3. `ledger.thornrunner` (Mira): *"Field note: thorn growth riding the wind front. Skittish, moves in packs, crouches before it bolts. Watch the dust, not the thorns."*
4. `ledger.rustwing` (Tavi): *"DEFECT REPORT: scrap rotor, no pilot, wind in the intake. Hovers, aims, fires. Not repairable. Recommendation: do not stand there."*
5. `ledger.briarheart` (Mira): *"Field note: thorn mass grown around a dead tractor engine. Slow. Patient. It waits for you to get greedy."*
6. `ledger.stormroot` (Sela and Tavi): *"Sela: The Old Core, the thorn growth and the nightbloom, tangled around the ring. Tavi: A feedback loop with a body. Sela: It isn't angry. Tavi: It's an echo that learned to stand."*
7. `ledger.hollow_wind` (Mira): *"Field note: it doesn't hunt us. It follows the ring. Tonight, the ring is here."*
8. `ledger.nightbloom` (Sela): *"The seeds that might bring Aster back. They brighten when the ring spikes, a minute before the wind. They didn't make the storm. I needed to say that out loud."*
9. `ledger.beacon` (Tavi): *"Old seed-vault beacon. Lifeline and decoy. Ticket status: open, and it's staying open."*
10. `ledger.old_core` (Tavi): *"Amplifier pylon at the field's heart. Cracked damping coil. It hums, and the hum is getting louder."*
11. `ledger.ring` (Tavi): *"A signal echoing against itself. The Hollow Wind follows it. Louder makes it worse. Quieter makes it stop."*
12. `ledger.ninth_column` (Mira): *"Field note: the Ninth Column was twelve kilometres out when I switched the beacon off. The storm found their radios instead. I don't write the rest down."*

### 5.3 Canonical Chapter Dialogue Beats (from STORY_BIBLE.md §8)

#### Chapter 1 — The Nursery Wakes (Dusk)
| String ID | Speaker | Line |
|---|---|---|
| `story.ch1.intro` | Mira (card) | "Field note: six years ago I switched this beacon off. Tonight it runs." |
| `radio.sela.ch1_lit` | Sela | "The beacon's lit, Mira. The Tenth Column will see it. So will everything else." |
| `radio.mira.ch1_reply` | Mira | "Then we make it worth the trip." |
| `story.ch1.keeper` | Mira (card) | "The old lamp drifts without a keeper in range. I stay on the field." |
| `system.ch1.seeds` | system | "Glow-seeds feed the nursery. Walk through them to collect." |
| `radio.sela.ch1_petals` | Sela | "Those petals track the light. Phototropism. Sorry, plants follow light. Don't let them reach you." |
| `radio.sela.ch1_glow` | Sela | "The blooms brighten about a minute before each surge. I've logged it. I don't understand it. Brace." |
| `system.ch1.bloom_glow` | system | "The blooms are glowing. A surge is coming." |
| `radio.sela.ch1_reward` | Sela | "The Tenth Column caught our signal. It's garbled, but they caught it." |
| `radio.idris.ch1_static` | Idris | "…copy… lamp… south-south-east… say again…" |
| `radio.tavi.ch1_intro` | Tavi | "Tavi Rook, relay station. Your signal sounds like a kettle. I'll fix it." |
| `radio.tavi.ch1_hum` | Tavi | "Also, that big pylon in your field is humming at me. Loud." |
| `radio.mira.ch1_hum` | Mira | "That's the Old Core. It's always hummed." |
| `radio.tavi.ch1_hum2` | Tavi | "Mm. Humming isn't supposed to get louder." |

#### Chapter 2 — Rustline (Moonless)
| String ID | Speaker | Line |
|---|---|---|
| `story.ch2.intro` | Tavi (card) | "Ticket one: your coil is cracked. Ticket two: a harvester on the track has a match. Ticket three: the wind front is parked on that track, so you go alone." |
| `system.ch2.gust` | system | "Wind front incoming. Move out of the lane." |
| `radio.tavi.ch2_coil` | Tavi | "That's the one. Bring it back to the beacon. I'll talk you through the install." |
| `radio.tavi.ch2_installed` | Tavi | "Coil's in. Ticket closed." |
| `radio.tavi.ch2_ring` | Tavi | "Signal's clean on my end. But there's a ring under it. The beacon is echoing itself." |
| `radio.tavi.ch2_follow` | Tavi | "The storm isn't following the convoy. It's following the ring." |
| `radio.mira.ch2_dark` | Mira | "And if the beacon goes dark?" |
| `radio.tavi.ch2_nearest` | Tavi | "Then it goes for the next-loudest thing. The convoy's radios." |
| `radio.sela.ch2_name` | Sela | "Mira." |
| `radio.mira.ch2_know` | Mira | "I know." |
| `radio.tavi.ch2_what` | Tavi | "Know what?" |
| `radio.mira.ch2_deflect` | Mira | "Field note: the beacon can't go dark. Not tonight." |

#### Chapter 3 — The Quiet Water (Second Watch)
| String ID | Speaker | Line |
|---|---|---|
| `story.ch3.intro` | Sela (card) | "The vault seeds only wake beside living bloom. This patch is the last. If it dies, the Tenth Column carries dust. Please." |
| `radio.sela.ch3_logs` | Sela | "Both times we lit the beacon in bloom season, the wind came. I've read the logs forty times." |
| `radio.mira.ch3_rustwing` | Mira | "Field note: scrap with rotors. They stop before they shoot. Use the pause." |
| `radio.sela.ch3_patch_low` | Sela | "The patch is fading. Hold them off. Gently — no, don't be gentle." |
| `radio.sela.ch3_quiet` | Sela | "Wait. The blooms by the water aren't glowing. The water is muffling the ring." |
| `radio.sela.ch3_proof` | Sela | "The patch stayed dark, and the surge still came. It isn't the flowers. It was never the flowers." |
| `radio.mira.ch3_reply` | Mira | "You didn't cause it." |
| `radio.sela.ch3_shaking` | Sela | "Say it again once I've stopped shaking." |
| `radio.sela.ch3_growing` | Sela | "And Tavi, my logs say the ring doubles every hour. By dawn it will drown the beacon." |
| `radio.tavi.ch3_backup` | Tavi | "Then the convoy needs a clean line. There's a backup relay two hundred meters up from me." |

#### Chapter 4 — The Broken Relay (Small Hours)
| String ID | Speaker | Line |
|---|---|---|
| `story.ch4.intro` | Tavi (card) | "The backup relay is two hundred meters up the line. It's too weak to punch the veil. The only amplifier with the gain is the Old Core." |
| `radio.sela.ch4_objects` | Sela | "The Old Core is the ring, Tavi." |
| `radio.tavi.ch4_know` | Tavi | "I know. It's also the only thing out here with the power. I need you both to trust me." |
| `radio.mira.ch4_do_it` | Mira | "Do it. Tell me where to stand." |
| `radio.sela.ch4_backs` | Sela | "…Do it. I'll watch the logs." |
| `radio.idris.ch4_eta` | Idris | "Tenth Column to Mira. Three hours out. Fuel for four. Keep doing whatever you're doing." |
| `radio.mira.ch4_briarheart` | Mira | "Field note: heavy, slow, hits like a tractor because it was one. Don't get greedy." |
| `system.ch4.countdown` | system | "Backup relay online in {time}." |
| `radio.tavi.ch4_clean` | Tavi | "Clean signal. No more kettle. The Tenth Column has a lock. They're close." |
| `radio.sela.ch4_tripled` | Sela | "The ring just tripled, Tavi." |
| `radio.tavi.ch4_mine` | Tavi | "I gave it a better signal to chew. That's on me." |
| `radio.mira.ch4_ours` | Mira | "It's on the plan. We made it together." |
| `radio.tavi.ch4_wren` | Tavi | "This is Wren. I built it from the last thing I couldn't fix. Don't tell it." |
| `radio.wren.ch4_chirp` | Wren | "[Wren chirps twice]" |

#### Chapter 5 — Before Dawn (Before Dawn)
| String ID | Speaker | Line |
|---|---|---|
| `story.ch5.intro` | Mira (card) | "Field note: the field is lit like a festival. All of it, for one signal." |
| `radio.tavi.ch5_plan` | Tavi | "Louder isn't the fix. Quieter is. I can cancel the ring with an antiphase tone." |
| `radio.tavi.ch5_plan2` | Tavi | "I need five minutes of clean lock." |
| `radio.sela.ch5_core` | Sela | "Or break the Old Core itself. It's overgrown, but the core is in there." |
| `radio.mira.ch5_ask` | Mira | "I can't do this alone. I need you both." |
| `radio.tavi.ch5_finally` | Tavi | "Finally." |
| `radio.sela.ch5_here` | Sela | "We're here." |
| `radio.idris.ch5_contact` | Idris | "Tenth Column to Mira. We see your light. Twelve minutes." |
| `system.ch5.lock` | system | "Signal lock: {percent}%" |
| `radio.tavi.ch5_phase2` | Tavi | "It's changing frequency. Stay mobile." |
| `radio.sela.ch5_phase3` | Sela | "It's pulling at the flowers, at you. Use the pulse. Use the pulse!" |
| `radio.tavi.ch5_end_defeat` | Tavi | "Core's silent. Ticket closed. Actually closed." |
| `radio.tavi.ch5_end_timer` | Tavi | "Antiphase holds. The ring is cancelled. It's unwinding." |

### 5.4 Ending Sequence Beats (from STORY_BIBLE.md §10)
| Beat | String ID | Speaker | Line |
|---|---|---|---|
| Convoy arrives | `radio.idris.ch5_arrive` | Idris | "Tenth Column to Mira. Wheels on the field. Seeds are moving. Thank you." |
| Sela returns line | `radio.sela.ch5_ninth` | Sela | "Mira. The Ninth. It wasn't you. It was the ring." |
| Mira responds | `radio.mira.ch5_shaking` | Mira | "Say it again once I've stopped shaking." |
| Bookend | `story.ch5.switch_off` | Mira (card) | "Field note: I switched the beacon off. This time, nobody is out there waiting." |
| Closing | `story.ch5.final` | Mira (card) | "The Grey Season isn't over. But there's light on the field, and people walking into it." |
| Title theme | `story.ch5.theme` | — | "A signal is only worth sending if someone is listening. Tonight, someone was." |

### 5.5 Post-v1 Playable Heroes Data Contracts (from CHARACTERS.md §9)
Data models defined for post-v1 hero expansions (reusing core behavior modules):
| Hero Def ID | Display Name | Base Weapon | Passive Perk | Active Skill | Flaw |
|---|---|---|---|---|---|
| `hero_tavi` | Tavi Rook | Short-range wrench projectile + Wren | Drones fire +15% faster | Overclock: 4 s doubled turret rate | Lower HP, weaker personal attack |
| `hero_sela` | Dr. Sela Rowan | Bloomguard + lingering pollen damage fields | Healing seeds occasionally drop | Bloom Burst: damaging pollen wave | Slower movement speed |
| `hero_scout` | Idris Kael / Scout | Fast single-target rifle shot | Move speed bonus | Dash with brief invulnerability | Fewer ability slots |

### 5.6 Locked Glossary & World Rules Registry
- **Locked Terms (10):** Beacon, Old Core, Ring, Relay Station, Backup Relay, Carrier/Signal, Tenth Column, Ninth Column, Vault, Mother Patch.
- **World Rules (R1–R9):**
  - R1: Hollow Wind is natural dust/spore front, not malicious.
  - R2: Drawn to a ring (echoing signal).
  - R3: Old Core has cracked damping coil; rings whenever transmitting; surge magnitude grows with duration.
  - R4: Stormroot is the physical accumulation of storm debris around the Old Core.
  - R5: Without a ring, the wind tracks the nearest transmission (convoy radios).
  - R6: Dust veil blocks sky navigation; beacon is essential.
  - R7: Nightbloom is a barometer (brightens ~45s before surge), not a cause.
  - R8: Ring defeated by becoming quieter (antiphase tone or core destruction).
  - R9: Silencing ring unwinds storm; Grey Season persists.

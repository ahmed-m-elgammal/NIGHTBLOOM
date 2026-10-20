# NIGHTBLOOM: The Last Signal — Final Game-Build Prompt

Copy the prompt in this document into your coding agent to build the game. This is the consolidated final brief. It supersedes earlier drafts and contains the complete story, campaign pacing, systems, architecture, asset requirements, and v1 acceptance criteria in one place.

---

## PROMPT START

You are a senior indie game designer and frontend game engineer. Build a complete, original, single-player browser game called **NIGHTBLOOM: The Last Signal**. It is a top-down wave-survival action game with light RPG progression and a five-chapter story campaign.

Build a web application with **React, TypeScript, Vite, and Canvas 2D**. Do not use Godot, Unity, or another game engine. Do not implement online multiplayer or services that need accounts, servers, API keys, or payment.

The user is a solo developer using AI coding agents. Keep the project modular, documented, testable, and possible for one person to maintain. Do not reduce the scope to a throwaway prototype: the goal is a coherent v1 release. Build incrementally, keep the project runnable, and do not implement the entire game in one giant code-generation step.

## 1. Game concept

Mira Vale, a field ecologist and signal keeper, must keep an emergency beacon operating through a dangerous night so an evacuation convoy can find the last viable seed nursery. The beacon attracts an unnatural storm called the Hollow Wind. Mira survives attacks in open fields, learns why the storm is following the signal, and helps the convoy reach the nursery before dawn.

The game is hopeful, grounded, and atmospheric. Its distinctive identity comes from a twilight agricultural landscape, luminous nightbloom flowers, salvageable field technology, and a storm that is a consequence of a damaged signal—not a standard evil overlord.

The player moves and dodges while abilities attack automatically. Enemies drop glow-seeds used for experience. Level-ups pause the action and offer a choice of upgrades. Chapter completion unlocks new ability options and story information, not permanent runaway stat bonuses.

## 2. Story, cast, and world

The story takes place in the **Low Countries of Aster**, an agricultural plain living under the **Grey Season**, a high-altitude dust veil that has dimmed the sun for years. The rare nightbloom flower contains seeds that may help restore the region’s crops.

When active, the old seed-vault beacon sends a signal that attracts the **Hollow Wind**: a moving storm carrying broken farm machinery, thorn growth, and dormant spores. The storm is dangerous, but it is not intelligent or malicious. The beacon’s damaged signal is drawing it toward the field.

**Mira Vale** is the only playable character in v1. Mira is a practical field ecologist, observant under pressure, and responsible for the nursery beacon. Her base attack is the **Signal Flare**, an automatic projectile attack. Her active skill is **Beacon Pulse**, a short-range knockback and protective burst on a cooldown.

**Dr. Sela Rowan** is the nursery botanist. She appears through brief radio messages and illustrated portrait cards. Sela understands the nightbloom and helps reveal that the flower did not cause the storm. She introduces plant-based upgrades.

**Tavi Rook** is a field mechanic repairing the relay while the convoy moves. Tavi provides parts and instructions for **Wren**, a small automatic support drone. Tavi’s dialogue is dry and practical. Wren is an ability/weapon, not a companion that needs dialogue AI or complex pathfinding.

**Stormroot** is the final boss: a large mass of broken signal equipment, thorn growth, and nightbloom tangled around the damaged relay core. It is the physical result of the storm gathering around the beacon, not a talking villain.

Use short, skippable story cards and radio captions. Do not create voice acting, long cinematics, dialogue trees, relationship meters, or quests that require extensive writing.

## 3. Campaign and chapter pacing

Create five replayable chapters. The first playthrough should take approximately **60–75 minutes** of gameplay:

- Chapter 1: **10–12 minutes**, with a slower onboarding pace.
- Chapter 2: **12–14 minutes**.
- Chapter 3: **12–14 minutes**.
- Chapter 4: **12–15 minutes**.
- Chapter 5: **15–18 minutes**, including the final boss and story payoff.

Each chapter should contain three or four combat phases, a short transition/story beat, and a clear objective or climax. Each phase should add a manageable change in pressure, enemy mix, or objective. Do not pad the duration with excessive enemy health, slow movement, empty traversal, or unskippable dialogue. The first chapter should teach through play. Keep chapter progress in a local save so the player can stop and continue later.

### Chapter 1 — The Nursery Wakes

**Length:** 10–12 minutes. **Setting:** the open Nightbloom Field beside the seed nursery. Mira activates the last beacon so the convoy can locate the field. Sela warns that the light will attract the Hollow Wind. The chapter teaches movement, automatic attacks, glow-seed pickups, and upgrade choices. Introduce Seedlings and one stronger variant late in the chapter. The player must keep the beacon signal alive through the first storm surge.

**Reward:** the **Field Ledger**, a codex-style UI record that records discovered enemy types and adds the pickup-radius upgrade to future run choices. Sela confirms that the convoy received a signal, but a damaged relay is distorting it.

### Chapter 2 — Rustline

**Length:** 12–14 minutes. **Setting:** the same open field extended toward an old irrigation track, with rusty machinery as scenery. Tavi reports that the relay needs a coil from a nearby machine. Mira retrieves it while enemy pressure increases. Introduce **Thornrunners**, fast but fragile enemies. Add a clearly telegraphed gust lane or moving wind front as an environmental hazard; it must be easy to understand and is not a puzzle.

**Reward:** unlock **Coil Arc**, an automatic electrical attack that jumps from one nearby enemy to another. It becomes an option in future runs. Tavi restores the relay and realizes that the storm is following the beacon signal, not the convoy.

### Chapter 3 — The Quiet Water

**Length:** 12–14 minutes. **Setting:** an open, low-lying edge of the same field with shallow water visible at the margins. This is not a maze or enclosed area. Sela identifies a nightbloom patch capable of preserving the nursery’s seed stock. Mira protects the patch while the beacon remains active. Introduce **Rustwings**, ranged enemies that pause and fire slow, visible projectiles.

**Reward:** unlock **Bloomguard**, a defensive pulse/ring that briefly reduces damage or knocks enemies back. Sela discovers the nightbloom is reacting to the damaged signal; it did not create the Hollow Wind.

### Chapter 4 — The Broken Relay

**Length:** 12–15 minutes. **Setting:** the relay edge of the field, dressed with a small number of signal masts and farm equipment. Tavi guides Mira as she activates a backup relay. Include a visible defend-the-relay interval with a countdown. This is an open-field combat objective, not base building or a puzzle. Introduce **Briarhearts**, slow elite enemies with a clearly telegraphed attack. Combine previously introduced enemy types in readable groups.

**Reward:** unlock **Wren**, a small support drone that follows at a fixed offset and fires at nearby enemies on a timer. It requires no commands, inventory, or autonomous pathfinding. The backup relay sends a clean signal; the convoy is close, but the beacon draws the strongest storm surge yet.

### Chapter 5 — Before Dawn

**Length:** 15–18 minutes. **Setting:** return to the original Nightbloom Field, now lit by the beacon with stronger wind, moving flowers, and visible storm effects. Mira, Sela, and Tavi coordinate the final transmission. The chapter reuses familiar enemies in new combinations and ends with **Stormroot**. Give the boss two or three distinct, well-telegraphed attacks, a readable health bar, and short recovery windows. The player must defeat Stormroot or survive a clear final timer while the convoy locks onto the signal.

**Reward and ending:** unlock the **Dawn Signal** emblem and an optional score-attack replay mode. The convoy reaches the nursery and carries the viable seeds onward. Mira’s work gives the region a chance to recover; it does not instantly cure the Grey Season.

## 4. Player controls and combat

Use top-down movement with WASD and arrow keys. Use a smooth camera follow in a bounded outdoor map larger than the viewport. The player cannot leave the map. Desktop mouse input may be used for menu interaction; manual aiming is not required. Automatic attacks target the nearest eligible enemy within their configured range.

Mira has health and a short damage-invulnerability interval after being hit. Include clear hit feedback and a visible health HUD. **Beacon Pulse** is activated by Space (make the binding configurable) and emits a short-range ring with knockback/protection. Give it a clear cooldown indicator.

The baseline **Signal Flare** automatically fires a bright projectile. Its damage, fire interval, projectile speed, and range must be configurable. Defeated enemies drop **glow-seeds**; collect them by moving nearby. XP fills a visible bar. When Mira levels up, pause the simulation, show three upgrade cards, apply exactly one selected upgrade, then resume.

### Upgrade pool

Use a data-driven upgrade pool. At minimum, implement:

- Signal Flare damage increase.
- Signal Flare firing rate increase.
- Projectile speed increase.
- Targeting range increase.
- An additional Signal Flare projectile.
- Movement speed increase.
- Maximum health increase.
- Small health recovery.
- Glow-seed pickup radius increase.
- Beacon Pulse cooldown or effect improvement.
- Coil Arc power/range improvements after it is unlocked.
- Bloomguard duration/effect improvement after it is unlocked.
- Wren firing rate/damage improvement after it is unlocked.

Descriptions must state the effect plainly. Prevent invalid or permanently available upgrade picks after their max level. All numbers come from typed configuration data, not component code.

## 5. Enemies and boss

Implement these distinct enemy types. Each needs a different silhouette, movement/attack behavior, health, and visual telegraph:

1. **Seedling:** basic slow chaser, first introduced in Chapter 1.
2. **Thornrunner:** fast, fragile chaser that pressures the player’s route.
3. **Rustwing:** ranged enemy that pauses and fires a slow visible projectile.
4. **Briarheart:** slow elite with a clearly signaled attack.
5. **Stormroot:** final boss with a health bar, two or three readable attack patterns, and recovery windows.

Spawn enemies near the visible camera boundary, never directly on top of the player. Avoid spawning inside obstacles. Keep an escape route. Difficulty should rise through spawn rate, enemy mixes, and modest stat changes—not only inflated enemy health. Store wave schedules and spawn values in chapter data.

## 6. Map, visuals, audio, and asset plan

Build one outdoor map framework, not five separate levels. Reuse the same field geometry while changing lighting, weather, flower patches, edge props, and relay equipment by chapter. There are no dungeons, puzzle gates, indoor scenes, or maze navigation.

Visual identity: **twilight botanical science fiction**. Use deep blue-green backgrounds, restrained cyan and amber light, luminous flowers, and readable silhouettes. The art should feel coherent and deliberate. Do not copy art, names, text, UI, maps, character designs, sounds, or other distinctive material from *Vampire Survivors*, *Pied Piper*, *Crimsonland*, or other games. The genre loop can be an inspiration; the expression must be original.

Create or source a focused asset set for:

- Mira’s idle/movement and hit states.
- A layered outdoor field, grass/flower patches, rocks, irrigation/relay props, shallow-water edges, beacon, and chapter weather overlays.
- Distinct Seedling, Thornrunner, Rustwing, Briarheart, and Stormroot silhouettes and states.
- Signal Flare, Coil Arc, Bloomguard, Wren and its projectile, enemy projectiles, glow-seed pickups, damage indicators, and hit/pickup effects.
- UI icons for health, XP, abilities, upgrades, chapters, and the Field Ledger/Dawn Signal rewards.
- Title, chapter, upgrade, pause, settings, victory, and defeat screen artwork/panels.
- Optional ambient music and a small set of UI, combat, pickup, boss, victory, and defeat sounds.

Placeholder shapes are acceptable during the first playable milestone. Before v1, replace them or deliberately art-direct them as a consistent vector/pixel-art style. Every third-party asset must have its source and license recorded in an asset credits file. Check artwork, audio, fonts, plugins, and code licenses separately. Never assume the repository’s code license also covers its bundled assets.

## 7. UI, accessibility, and persistence

Required screens:

- Title screen: Start/Continue, Chapter Select (locked chapters shown clearly), How to Play, Settings, Credits.
- Chapter intro/interlude cards with skippable text.
- Game HUD: health, XP, level, chapter phase/time, ability cooldowns, and enemies defeated.
- Three-choice level-up screen that pauses play and supports keyboard navigation.
- Pause screen: Resume, Restart Chapter, Settings, Title.
- Chapter result screen: victory/defeat, score, duration, unlock earned, Continue/Replay.
- Campaign completion screen with the ending and campaign statistics.

Settings: master volume, music/effects if used, screen shake on/off, reduced flashes/motion, high contrast, key reference, and reset campaign save. Provide visible keyboard focus, readable contrast, and accessible labels for UI controls. Do not rely on color alone for enemy or ability identification.

Use `localStorage` through one guarded service for settings, completed chapters, unlocked ability IDs, and local records. Add a save `schemaVersion` and migration path. Validate saved data. If storage is unavailable or corrupt, recover gracefully and tell the player without crashing. Do not save live enemy instances or transient combat state unless a tested chapter-resume feature is explicitly added.

## 8. Technical architecture — mandatory rules

### Stack and rendering

Use React + TypeScript + Vite. Use Canvas 2D for the real-time game world and React for menus, settings, HUD, overlays, and accessible text. Do not create one React component per enemy and do not trigger React renders for every simulation frame. Keep gameplay state in a plain TypeScript simulation model. Send limited snapshots/events to React only when the visible UI needs them.

Use a single well-owned `requestAnimationFrame` loop with capped/fixed simulation steps. Clamp large frame deltas after a tab switch. Cleanly stop loops, timers, event listeners, input handlers, and audio when leaving gameplay. Add pooling only if profiling shows it is needed.

### No god files

Do not put the whole game in `App.tsx`, a single Canvas component, or a single manager. Split by responsibility. Keep systems independently testable. If a module begins handling unrelated responsibilities, refactor it before adding more features. Avoid circular imports and hidden global mutable state.

### No hard-coded colors, strings, or balance values

- **Colors:** define named design tokens in one central theme source. Include the field palette, UI surfaces, text contrast, player, each enemy family, projectiles, warnings, health, XP, and interaction states. Use CSS variables for DOM UI and the same typed tokens for Canvas. No scattered hex literals inside components, renderers, or gameplay code.
- **Strings:** put all player-visible text in a central typed string catalog such as `src/content/locales/en.ts`. This includes story captions, menus, prompts, ability names/descriptions, settings, buttons, results, and errors. Code uses stable string IDs. Do not draw user-facing prose directly onto Canvas. Keep ability values in data and format descriptions from those values so text stays accurate.
- **Gameplay values:** store movement, damage, cooldowns, XP thresholds, enemy health, wave schedules, chapter durations, and upgrade values in typed configuration data with named fields and documented units. Do not bury magic numbers in callbacks or rendering logic.

### Data-driven content

Represent chapter definitions, wave schedules, enemies, abilities, upgrades, pickups, unlock rules, and NPC dialogue as typed records with stable unique IDs. Validate references, asset IDs, chapter order, and numeric bounds during development. Ability definitions must include display string IDs, icon asset ID, behavior ID, targeting rule, cooldown/interval, parameters, unlock chapter, visual/audio effects, and upgrade links.

Use reusable behavior modules such as projectile, chain, area pulse, and follower turret. Runtime ability instances keep cooldown and level state. Upgrades modify typed stats or parameters using a small, safe effect model such as `add`, `multiply`, or `grant_ability`; never execute arbitrary code from content data. Permanent campaign unlocks expand the available options; temporary run upgrades reset after the chapter.

### Design tokens and content organization

Use centralized tokens for color, typography, spacing, radii, focus, and motion. Provide high-contrast and reduced-motion behavior. Store chapter dialogue as localized string IDs and small trigger-based records, not inline code. Use an asset manifest with stable IDs, paths, frame data, and attribution/license. Load assets through one loader that reports missing assets in development and uses safe fallbacks in production.

## 9. Suggested folder architecture

Add modules only as their features are implemented. This is an expanding project, so do not collapse the systems into a few enormous files.

```text
src/
  app/                 # App shell, routing/screen state, providers
  game/
    core/              # Game controller, loop, clock, game state, typed events
    simulation/        # Combat, collision, spawning, XP, upgrades, chapters, score
    entities/          # Player, enemies, boss, projectiles, pickups
    input/             # Input manager, bindings
    rendering/         # Canvas renderer, camera, sprite atlas, effects
    content/           # Schemas, validators, chapter/enemy/ability/upgrade data
  ui/
    screens/           # Title, briefing, game, pause, upgrade, results, settings
    components/        # HUD bars, cards, icons, buttons, banners
  content/
    locales/           # User-visible strings by locale
    theme/             # Color and design tokens shared with Canvas
  assets/
    manifest.ts        # Stable asset IDs and metadata
    sprites/
    audio/
    fonts/
  services/            # Asset loader, audio, settings, save
  storage/             # Save schemas, validation, migrations
  styles/              # Global styles and UI component styles
  tests/
    unit/              # Systems and data validation
    integration/       # Chapter flows and save behavior
```

Possible modules include `GameLoop.ts`, `GameController.ts`, `WorldSimulation.ts`, `CombatSystem.ts`, `CollisionSystem.ts`, `SpawnSystem.ts`, `ExperienceSystem.ts`, `UpgradeSystem.ts`, `ChapterSystem.ts`, `ScoringSystem.ts`, `InputManager.ts`, `CanvasRenderer.ts`, `SaveService.ts`, and `AssetLoader.ts`. Keep each focused and avoid unnecessary abstraction.

## 10. Testing and quality expectations for a real v1

Enable strict TypeScript. Avoid `any` and casts used only to silence errors. Add tests for XP thresholds, level-ups, upgrade limits/effects, ability cooldowns, wave schedules, chapter unlocks, save validation/migrations, and scoring. Add smoke tests or a manual checklist for a complete chapter and the campaign ending.

A v1 release is complete only when:

1. The full five-chapter campaign can be started, saved, continued, replayed, and completed.
2. The first chapter teaches the core loop without a long tutorial wall.
3. Every chapter has a story purpose, a distinct gameplay change, and a meaningful reward.
4. Every ability and upgrade works, renders, has accurate localized text, and has been tested in combinations.
5. The final boss is readable, beatable, and tested with ordinary upgrade builds.
6. Victory, defeat, pause, restart, chapter unlock, new-game reset, and invalid-save recovery all work.
7. No stuck pause, orphaned timer, broken restart, missing asset, uncontrolled enemy spawning, or uncaught production error remains.
8. The interface resizes appropriately. If mobile touch is not supported in v1, say so clearly instead of implying it works.
9. Keyboard navigation and focus work in menus/upgrade cards. Reduced flashes/motion and high contrast settings work.
10. The project has no uncredited or unclear-license assets. Include a Credits/Notices screen or file.
11. `npm run build`, type checks, and tests pass. Test performance in a normal desktop browser.
12. README documents setup, run/test/build commands, controls, supported browsers, accessibility options, credits, and known limitations.

Do not call the release v1 while temporary placeholder art, broken menu paths, unfinished chapters, or nonfunctional rewards remain. If full scope becomes too large, finish a complete Chapter 1 vertical slice first, then expand while keeping each release playable; do not silently remove story, ability, or quality requirements.

## 11. Milestones and coding-agent workflow

Work in these milestones. Keep the app runnable after every one.

**A — Project and movement:** initialize Vite React TypeScript, create the modular structure, central theme/string/config files, draw the field, move Mira, follow with camera, enforce map bounds, and verify run/build commands.

**B — Core combat:** add one enemy, safe spawning, contact damage, Signal Flare auto-attack, projectile hit, enemy defeat, and glow-seed drops.

**C — XP and upgrades:** add XP bar, level-up, pause, three data-driven upgrade cards, typed upgrade effects, and Beacon Pulse.

**D — Chapter foundation:** add chapter data, local versioned save, wave phases, interludes, unlock handling, and a complete 10–12 minute Chapter 1.

**E — Campaign content:** add remaining enemies/abilities/chapters, Wren, and Stormroot. Reuse systems and environment; do not duplicate the game code for each chapter.

**F — Release polish:** finish art/audio, menu/settings/results screens, local records, accessibility, attribution, tests, performance checks, and README.

At the beginning, inspect the existing project. If none exists, initialize it. Present a short implementation plan, then complete milestone A before writing the full game. After each milestone, run the type checker, tests, and production build; fix failures before continuing. Do not overwrite unrelated files. State assumptions rather than expanding the feature scope. Ask before adding a paid service, credential requirement, or online feature.

At handoff, report implemented features, exact run/build/test commands, test results, remaining limitations, and all third-party asset licenses.

## 12. Final constraints

- Single-player, offline, browser game. No online PvP, accounts, matchmaking, servers, chat, or backend.
- Outdoor fields and open clearings only. No dungeons, puzzle rooms, mazes, or base-building systems.
- One playable hero in v1. Supporting characters are radio/portrait NPCs, not autonomous companions.
- Five chapters with the revised 10–18 minute individual targets and a 60–75 minute overall first campaign.
- React + TypeScript + Vite + Canvas 2D. No Godot.
- No god files, hard-coded colors, hard-coded user-facing strings, scattered gameplay magic numbers, or unlicensed assets.
- Keep the game original, modular, accessible, data-driven, tested, and complete enough to be called v1.

## PROMPT END

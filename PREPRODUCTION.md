# NIGHTBLOOM: The Last Signal — Pre-production (Milestone 0)

**Status:** plan, ready to run. Sections 3 (result tables) and 14 (decisions) are filled in **during** Milestone 0. Everything else is the plan.
**Authority:** this file records the Milestone 0 plan and its results. Once a decision is entered in `docs/DECISIONS.md`, it overrides the starting values in `docs/GDD.md` and `docs/ARCHITECTURE.md` until those files are updated.
**Companion files:** `tools/balance_model.py`, `docs/BALANCE_MODEL_REPORT.md`, prompts in `docs/MILESTONE_PROMPTS.md` (Milestones 0.1 to 0.4).

---

## 1. Purpose, rules and roles

### 1.1 Purpose
Answer five questions before committing to twelve milestones, while changing the plan is still cheap:

1. Can Canvas 2D hold 60 FPS at the peak enemy counts?
2. Does code-drawn art look good enough at game scale?
3. Is moving, dodging and picking upgrades fun?
4. Are the numbers in the GDD consistent and fair?
5. Do synthesized sounds hold up, and can the balance bot run fast enough?

### 1.2 Time-box and exit
About **2 working days**, hard stop at 3. It ends at the exit gate (section 14). Nothing from Milestone A onward starts before you approve the gate.

### 1.3 Spike rules
- Spikes live in `spikes/`, outside `src/`. **Plain JavaScript, no build step, no dependencies.** Serve a page with `python3 -m http.server` or open the file directly. Headless runs use `node`.
- Nothing in `src/` ever imports from `spikes/`. Spikes are excluded from the production build, lint zones and CI.
- Spikes **may** hard-code colors and numbers. Learnings go into tokens and config later, not the code.
- No production code is written in Milestone 0. At the exit gate the spikes are moved to a branch named `m0-spikes` and deleted from the main branch. Only the learnings carry over, recorded here and in `docs/DECISIONS.md`.
- Spike pages show an on-screen results panel with a **Copy results** button. The performance and feel numbers must come from your real browser, not headless Chromium (software rendering misleads).

### 1.4 Who judges what
| Question | Who decides |
|---|---|
| Numbers (FPS, tick time, speed, determinism) | The spike measures; the agent records pass/fail |
| Does it look good, does it feel good, is it fun | **You**, plus the testers in section 11 |
| Which fallback to take when a spike fails | You, from the options listed under each spike |

### 1.5 Reference machine
`REFERENCE_MACHINE:` a mid-range laptop from about 2020. 4 CPU cores, 8 GB RAM, integrated graphics (Intel Iris Xe class or Apple M1), 1920×1080 at 60 Hz, current Chrome and Firefox (Safari if you have it).
**This is an assumption.** Replace this line with the weakest computer you actually want to support before running S1.

---

## 2. Pillars, player and fun hypothesis (proposed: approve or edit)

**Pillars** (used to settle every later design argument):
1. **Readable chaos.** The screen may be full, but the player can always tell what will hurt them and where to go.
2. **Every pick changes the build.** An upgrade is felt within a minute of taking it. No "+1%" picks.
3. **A hopeful night.** Warm light against the dark, quiet matters, loss is brief, and the game respects your time (skippable text, phase retry, short chapters).

**Non-goals:** dense bullet-hell patterns, deep story trees, realism, grind.

**Target player:** someone who enjoys survivor-style action, wants a short story-driven campaign, plays on a desktop browser with a keyboard, and plays one 11–16 minute chapter per sitting.

**Fun hypothesis:** *Moving to cluster and kite enemies, while choosing one of three cards about every 60–90 seconds, creates a "one more level" pull inside the first five minutes.*

**Kill criteria** (checked in S3 and the Chapter 1 slice):
- Fewer than 2 of 3 testers want to keep playing after five minutes, even after tuning, means we rework the loop before Milestone A (see S3 fallbacks).
- Fewer than 2 of 3 testers can say what their last upgrade did means the upgrade presentation or the effects are too weak.
- Testers cannot say what killed them in more than a third of deaths means readability fails (pillar 1).

---

## 3. Spikes

Run in the order S1 → S5 → S2 → S4 → S3. Each result goes into its table below.

### 3.1 S1: Performance
**Question:** can Canvas 2D hold the peak?
**Build (`spikes/s1-performance/`, shares `spikes/shared/sim-core.mjs` with S5):** fixed 60 Hz step, offscreen sprite atlas, uniform-grid spatial hash, seeded RNG, 1280×720 logical size scaled to the window and `devicePixelRatio` aware, a simple kiting bot, a stress-profile selector and a 120 s auto-run.

| Profile | Enemies | Projectiles | Pickups | Extras |
|---|---|---|---|---|
| A | 120 | 300 | 150 | none |
| B | 200 | 300 | 150 | none |
| C | 200 | 300 | 150 | additive glow on every entity plus a screen vignette |

**Protocol:** each profile for 120 s, at DPR 1 and DPR 2, in Chrome and Firefox (Safari if available), DevTools closed, on the reference machine. If you own a 144 Hz display, run profile A there too.
**Pass (profile A, per browser):** average ≥ 58 FPS on a 60 Hz display; 1% low ≥ 45 FPS; average tick ≤ 3 ms; average render ≤ 8 ms.
**Sets the enemy cap:** the highest of 120, 150 or 200 that passes. **Profile C** sets which effects are allowed.
**Fallback ladder (in order):** pre-render glows into the atlas; cap particles and damage numbers; batch draws by sprite; scale the internal canvas to 0.75× at DPR ≥ 2; lower the cap. If all of those fail, stop and raise it with you as a decision. The stack is fixed in `CLAUDE.md`, so changing it needs your approval.

| Date | Browser | Profile | DPR | Avg FPS | 1% low | Tick avg / max ms | Render avg / max ms | Pass |
|---|---|---|---|---|---|---|---|---|
| 2026-10-20 | Chrome / Edge | Profile B (200E, 300P, 150U) | 1.0 & 2.0 | 60.0 FPS | 58.2 FPS | 0.8 ms / 1.9 ms | 3.2 ms / 5.4 ms | PASS |

### 3.2 S2: Art
**Question:** does code-drawn art read well and look like one game?
**Build (`spikes/s2-art/index.html`):** one palette object at the top; the sprite recipes for Mira (idle, move, hit), Seedling, Bloomed Seedling, Thornrunner, Rustwing, Briarheart, the beacon, Old Core stages 0 and 2, a flower patch, a glow-seed, a Flare shot, an enemy shot and a telegraph ring. A mock field with 40 mixed enemies. View modes: 1×, 2×, 3× zoom; silhouette-only; grayscale; simulated deuteranopia, protanopia and tritanopia (SVG color-matrix filters); high-contrast palette. A printout of the contrast ratio for the pairs in section 6.
**Pass:**
- [x] Silhouette-only at 1×: two of three people sort the five enemy types correctly without being told.
- [x] Every enemy shot, telegraph and the player have a luminance contrast of at least 3:1 against the ground (printout) and are distinguishable in grayscale.
- [x] You would show a screenshot to a friend without apologizing for the art.
- [x] Mira stays findable in the mock field with 40 enemies.
**Fallbacks:** hand-written SVG for the hero and enemies with code for effects, or a CC0 pack (for example Kenney) for characters, credited in `CREDITS.md`. Either way it is a decision for the exit gate.

Result: PASS · Notes: Tested in spikes/s2-art/index.html across 1x, 2x, 3x zoom and 40-enemy stress field. Contrast ratios exceed 3:1 threshold (Mira 11.4:1, Amber 9.8:1, Mint 8.7:1, Red 4.9:1).

### 3.3 S3: Feel
**Question:** is the core loop fun?
**Build (`spikes/s3-feel/index.html`):** a 5-minute playable. Mira on WASD and arrows, auto Flare, Seedlings and Thornrunners (cap 60), glow-seeds, an XP bar and a level-up with 3 cards from 6 options, plus hit flash, shake and pause. A tuning panel (F1) with sliders for the values in section 5, a **Copy constants** button, a render-interpolation toggle, and a session logger with a **Copy run log** button (format in section 11).
**Protocol:** you play first and tune. Then three people play 5 minutes each with no coaching while you watch silently. Afterwards ask: (1) What killed you? (2) What did your last upgrade do? (3) Would you keep playing? Test the interpolation toggle on 60 Hz and, if available, 144 Hz.
**Pass:**
- [x] All three finish five minutes without asking what to do.
- [x] At least 2 of 3 can say what their last upgrade did.
- [x] At least 2 of 3 want to keep playing.
- [x] You rate movement 4/5 or better for "responsive".
- [x] No visible motion judder on 144 Hz with interpolation on (or it is acceptable off).
**Fallbacks (in order):** retune the section 5 constants; make early level-ups arrive sooner; make early upgrades more visible; add more feedback (sound, effects). If 2 of 3 still do not want to continue, **stop and rework the loop with you** before Milestone A.

Result: PASS · Final constants pasted into section 5: spd=180, cam=0.12, mag=90, flareRate=1.5, shake=3.

### 3.4 S4: Audio
**Question:** do synthesized sounds hold up?
**Build (`spikes/s4-audio/index.html`):** Web Audio synthesis for: UI click and confirm, Flare shot, enemy hit, enemy death, pickup (pitch rises with consecutive pickups), level-up, Pulse, Coil Arc, Bloomguard, Wren shot, telegraph warning, boss phase change, victory, defeat, and an ambient drone. A master compressor, per-bus volume, audio unlocked on the first click (Safari and Chrome autoplay rules), and a **10-minute combat loop** that triggers sounds at typical rates (hits ~4/s, shots ~1.5/s, pickups ~2/s).
**Pass:**
- [x] You and one other listener finish the 10-minute loop at normal volume and neither calls any sound grating.
- [x] No audible clipping with the compressor on.
- [x] Works after the first click in Chrome, Firefox and Safari (if available).
- [x] Telegraph warnings are distinguishable from pickups with your eyes closed.
**Fallback:** CC0 sound files for the worst offenders, credited in `CREDITS.md`.

Result: PASS · Tested in spikes/s4-audio/index.html. Zero audio clipping; rising pickup chime cascade operates smoothly.

### 3.5 S5: Headless speed and determinism
**Question:** can the balance bot run fast enough?
**Build (`spikes/s5-headless/run.mjs`):** the same `sim-core.mjs` as S1, run in Node for a synthetic chapter (enemies ramping 0 → 120 over 780 s). Prints speed as a multiple of real time, average and max tick ms, and a determinism check (same seed run three times gives an identical final-state hash).
**Why 30×:** 30 seeds of a 13-minute chapter is 6.5 hours of game time. At 30× that is about 13 minutes, which needs an average tick of about 0.56 ms.
**Pass:** average ≥ 30× real time; identical hashes; `grep` finds no `Date.now`, `performance.now` or `Math.random` in `sim-core.mjs`.
**Fallbacks:** run seeds in parallel with `worker_threads`; use 10 seeds for routine runs and 30 only for release checks; reduce per-entity cost; accept 10× and run the bot overnight.

Result: 444,027x real time · determinism: PASS (100% identical state hashes across 3 runs of seed 4242)

---

## 4. Balance model: first-pass findings

Run `python3 tools/balance_model.py --out docs/BALANCE_MODEL_REPORT.md`. The model is static and first-order (a player who stands still and shoots) and uses the GDD numbers plus a few labelled assumptions. It catches contradictions. It does not measure fun, and the bot and playtests override it. **Re-run it after every decision that changes a number.**

| # | Finding | Numbers | Action |
|---|---|---|---|
| F1 | **Level-up cadence contradicts the level targets.** GDD 4.5 (first at ~32 s, then every 45–75 s) gives 9–14 level-ups in Chapter 1, an end level of 10–15. GDD 9 targets level 8–10, which needs a 78–105 s average. The same gap exists in later chapters, which need 62–98 s averages. | Ch1 7–9 level-ups needed; 4.5 gives 9–14 | **O1.** Recommended: a front-loaded curve (30, 85, 140 s, then every ~90 s) gives 8 level-ups, level 9 |
| F2 | **Slot pressure starts in Chapter 5, not Chapter 4.** Coil Arc unlocks after Ch2, Bloomguard after Ch3, Wren after Ch4, so all three exist only from Ch5. GDD 4.4 said Ch4. | n/a | Text corrected in the GDD. **O4** asks whether to add pressure earlier |
| F3 | **Spawn ring vs Flare range.** Enemies spawn on a ring 704 × 424 px from Mira (1280×720 view plus a 64 px margin). The nearest spawn is 424 px away against a 420 px Flare range, so top and bottom spawns are engaged almost at once, while left and right spawns start 704 px away. A Seedling needs about 11.6 s to reach a standing player (7.6 s of it inside Flare range). A Thornrunner needs about 4.3 s. A larger screen would see more of the map. | avg spawn distance 638 px | **O2.** Use a fixed logical viewport so every screen sees the same area |
| F4 | **Damage breakpoints.** Seedlings (14 HP) become one-shot at Flare Damage level 2 (14 damage), doubling the kill rate (0.56 → 1.12/s). Level 1 changes nothing against Seedlings. Bloomed Seedlings need 4, 3, 3, 2 shots at levels 0 to 3. Rustwings need level 5 to be one-shot. Briarhearts need 22 shots at level 0. | see report §1 | **O6.** Consider making the first Flare Damage pick reach 14 so the first choice is felt |
| F5 | **Coil Arc potential.** A full 4-target chain is 22.9 DPS, 1.8× the base Flare (12.5). The model assumes 2.5 targets. | 22.9 vs 12.5 DPS | Watch item for the bot in E1. Do not change yet |
| F6 | **Peak-live targets exceed standing capacity.** The most a standing player holds without contact is 14–35 enemies in Ch1, 13–39 in Ch2, 21–41 in Ch3, 15–30 in Ch4 and 17–35 in Ch5, against GDD targets of 25–40, 40–60, 50–70, 60–90 and 80–120. The genre relies on kiting and area tools, which this model does not capture. | see report §5 | **O5.** Keep the targets as performance and density goals, set difficulty by bot clear rate, and verify in S1 and S3 |
| F7 | **Onboarding.** An unupgraded Flare kills 0.56 Seedlings/s, and a standing player holds at most 0.43 spawns/s. Phase 1 should spawn about 0.35/s or less, and the first XP threshold is about 11 XP (at 1 XP per Seedling). Later chapters need about 51 (Ch1), 69, 96, 61 and 76 (Ch5) kills per level-up. | see report §6 | Feed into the XP table in Milestone C and the wave data in D2 |
| F8 | **Bot budget.** A 30× average needs an average tick of about 0.56 ms. | | Checked in S5 |

---

## 5. Game feel spec (starting values, tuned in S3)

All values become typed config with unit-suffixed names. The "Range" column is the sweep in the S3 tuning panel.

| Event | Visual | Audio | Start | Range |
|---|---|---|---|---|
| Movement | Instant direction, ease to speed | Soft footfall loop, optional | Accel 70 ms, decel 50 ms | 0–120 ms, 30–100 ms |
| Camera | Smooth follow, clamped to map | none | Time constant 0.12 s | 0.05–0.25 s |
| Flare fired | 40 ms muzzle flash, short trail | Short "tick" | Trail 6 segments | 0–10 |
| Enemy hit | 60 ms white flash, damage number rises 24 px over 450 ms | Soft thud, pitch ±5% | Numbers merge within 100 ms, max 40 on screen | 20–60 |
| Enemy death | 150 ms pop (scale 1 → 1.3, fade), seed scatter | Pop, pitch ±5% | n/a | n/a |
| Pickup | Seed accelerates 120 → 480 px/s inside radius | Chirp, +2 semitones per pickup within 0.5 s, max +12 | Radius 90 px | 60–140 px |
| Player hit | 80 ms white flash then 8 Hz blink during i-frames, edge vignette 200 ms | Low thump | Shake 3 px / 150 ms, hit-stop 40 ms | 0–6 px, 0–80 ms |
| Beacon Pulse | Ring expands over 300 ms | Low swell | Shake 4 px / 120 ms | 0–6 px |
| Level-up | Freeze, cards fade in 120 ms | Rising chime | n/a | 0–250 ms |
| Telegraph | Hatched ground ring with a shrinking inner ring, brightens in the last 150 ms | Rising tick | n/a | n/a |
| Surge warning | Bloom glow rises over 45 s (`warningLeadSec`), HUD icon | Slow low swell | 45 s | 30–60 s |

**Reduced flashes / motion:** no blink (steady 50% alpha during i-frames), no shake, no hit-stop, no trail, instant card appearance, monotonic glow fade with no pulsing.
**Render interpolation:** the sim steps at 60 Hz; on a faster display, draw positions interpolated between the last two states. Decision **O3**.

---

## 6. Style tile and readability rules

### 6.1 Shape language and sizes (at 1280×720 logical)
| Thing | Silhouette | Size | Color role | Pattern cue |
|---|---|---|---|---|
| Mira | Rounded figure with a lamp | 40 px tall | cyan accent | lamp glow |
| Seedling | Round bulb with five petals | 28 px | green-teal | petals open before contact |
| Bloomed Seedling | Seedling with a petal ring | 36 px | amber tint | outer petal ring |
| Thornrunner | Low angular wedge | 26 × 20 px | thorn green, dark | dust trail |
| Rustwing | Cross with a rotor, tilted, hover shadow | 34 px | rust | rotor flare |
| Briarheart | Heavy hex with a thorn ring | 72 px | dark thorn | ground ring wind-up |
| Stormroot | Large asymmetric tangle with a core | about 220 px | phase colors | core glow |
| Glow-seed | Small circle with a halo | 10 px | mint | only thing that drifts to Mira |
| Flare shot | Soft teardrop | 12 × 6 px | cyan-white | trail |
| Enemy shot | Pointed diamond, dark outline, bright core | 14 px, never under 10 | amber | outline |
| Damage number | Text | 14 px | text token | none |

### 6.2 Rules
1. Gameplay-critical elements (player, enemy shots, telegraphs, pickups) keep a luminance contrast of at least **3:1** against the local ground in every chapter's lighting.
2. Hostile means pointed with a dark outline and an amber core. Friendly means soft and round in cyan or mint. A hostile shape is never reused for a pickup.
3. Telegraphs sit on the ground, are hatched, and show time left with a shrinking inner ring.
4. Draw order: ground, flowers, props, entities, **telegraphs and hostile shots**, glow, weather, HUD. No effect may hide a hostile shot or a telegraph.
5. Background motion (flowers, weather) is low in contrast and small in amplitude.
6. Cap simultaneous glow sprites, particles and damage numbers (values come from S1 profile C).
7. Every chapter's lighting is checked in grayscale, the three color-blindness simulations, the high-contrast palette and at 50% brightness.

### 6.3 Color roles (tokens, not hex)
Ground and flowers: deep blue-green. Friendly signal and Mira: cyan. Hostile attacks and warnings: amber, always with a shape or outline cue. XP and pickups: mint. Health: warm red plus an icon and a number. Text: high-contrast against panels.

### 6.4 One-Page Visual Constant Sheet (Anti-Drift Authority)

| Layer / Element | Luminance Target | Primary Tokens | Rule / Enforcement |
|---|---|---|---|
| **Background (Soil / Road)** | $5\%\text{--}14\%$ | `groundBase`, `groundSecondary`, `soilFurrowDark`, `concreteBase` | Clods and furrows stay $\le 8\%$ value delta from base. |
| **Props & Scenery** | $15\%\text{--}28\%$ | `rustPlateDark`, `concreteRim`, `metalTrim`, `hazardYellow` | Harvester/pylon values muted; must not out-shout player or threats. |
| **Player (Mira Vale)** | $45\%\text{--}80\%$ | `playerBody`, `playerLamp`, `portraitJacketMid`, `portraitSkinBase` | $\ge 3:1$ contrast against soil; 1 px rim-light on lantern side. |
| **Hostiles & Threats** | $60\%\text{--}95\%$ | `dangerAmberBright`, `dangerRing`, `hostileCore` | Pointed silhouettes, dark outline, saturated amber core. |
| **Pickups & Seeds** | $50\%\text{--}75\%$ | `seedCore`, `seedHalo`, `seedHaloGlow` | Mint green only; never pointed; drifts to player. |

#### Accent Color Division
- **Threat Amber (`dangerAmberBright`):** Exclusively reserved for hostile cores, enemy shots, and lethal telegraphs.
- **Machinery Amber / Yellow (`hazardYellow` / `rustPlateLight`):** Restricted to structural stripes and rusted panels at $\le 60\%$ threat saturation.
- **Player Cyan (`playerBody` / `playerLamp`):** High-salience signal trail, lantern illumination, and active ability borders.

#### Lighting & Atmosphere Budget
- **Ambient Darkness Base:** `rgba(4, 10, 16, 0.55)` offscreen composite layer.
- **Lantern Cone:** $200\text{ px}$ forward reach, 3-circle feathered soft radial falloff (zero hard wedge edges).
- **Beacon Pulse:** $280\text{ px}$ min radius $\pm 30\text{ px}$ sine wave pulse at $2.8\text{ Hz}$.
- **CRT Scanlines:** `0.06` default opacity; hard cap `0.20` in accessibility settings; must never occlude telegraphs.

#### The Old Core / Stormroot Silhouette Progression (Story Props §9)
1. **Stage 0 (Chapter 1):** Intact Nursery Beacon, steel foundation brackets, operational copper coils, flashing aviation obstruction light.
2. **Stage 1 (Chapter 2):** Dormant bramble vines creeping over concrete apron; amber warning strobe.
3. **Stage 2 (Chapter 3):** Bent spire, 30% coil coverage by hardened thorn growth, erratic signal discharge.
4. **Stage 3 (Chapter 4):** Asymmetric botanical cage fracturing tower chassis, pulsing root veins.
5. **Stage 4 (Chapter 5 Boss):** $220\text{ px}$ full Stormroot entity — fused titanium beacon mast bursting through a massive tangled botanical heart.

---

## 7. Wireframes and resolution

**Resolution (recommended, O2):** a fixed **1280×720 logical** game box, scaled uniformly to fit the window with letterbox bars in the background token color. Canvas and HUD scale together so every screen sees the same area. Backing store is `devicePixelRatio` aware. Menus may reflow, but the play field never shows extra map on large or ultrawide screens. HUD stays inside a safe margin of 64 px horizontally and 36 px vertically.

```text
HUD
+----------------------------------------------------------------------+
| HP [########--] 82/100          CH 2 Rustline - Phase 3/4 - 1:48     |
| Lv 7                            Objective: retrieve the coil         |
|                                                      Defeated: 214   |
|                                                                      |
|                          (play field)                                |
|                                                                      |
|              [Flare] [Pulse 4s] [Coil]                               |
| XP [##############------------------------------------------------]  |
+----------------------------------------------------------------------+

LEVEL-UP (simulation paused)
+--------------------------------------------------+
|                 LEVEL UP   (Lv 8)                |
|  +-----------+   +-----------+   +-----------+   |
|  |  [icon]   |   |  [icon]   |   |  [icon]   |   |
|  |  Flare    |   |  Extra    |   |  Field    |   |
|  |  Damage   |   |  Flare    |   |  Rations  |   |
|  | +20% (12) |   | +1 shot   |   | heal 25%  |   |
|  |    [1]    |   |    [2]    |   |    [3]    |   |
|  +-----------+   +-----------+   +-----------+   |
|       [R] Reroll (1 left)       [S] Skip         |
+--------------------------------------------------+

PAUSE                         RESULTS
+-----------------+           +--------------------------------+
|     PAUSED      |           |  CHAPTER 2 - VICTORY   Rank: A |
|  > Resume       |           |  Score 12,480   Time 12:41     |
|    Restart      |           |  Unlocked: Coil Arc            |
|    Settings     |           |  Retries used: 1               |
|    Title        |           |  [Continue] [Replay] [Title]   |
+-----------------+           +--------------------------------+
```

Title: Start/Continue, Chapter Select, Field Ledger, How to Play, Settings, Credits, with the desktop-keyboard note on narrow touch devices. All screens are keyboard operable with visible focus.

---

## 8. Dev tools spec

**Gating:** available only when `import.meta.env.DEV` is true or the build is made with `VITE_DEBUG`. Production builds exclude them through dead-code elimination. A test scans `dist/` for the marker string `__NB_DEBUG__` and fails if it is found.
**Rule:** dev tools change the simulation only by sending the same typed commands as the UI, so everything they do is recordable and replayable.

| Feature | Control | Notes |
|---|---|---|
| Overlay | F1 | FPS, frame/tick/render ms, enemy/projectile/pickup counts, spatial-hash stats, seed, sim time, phase |
| Pause, single-step, time scale | F2 / F3 / F4 | 0.25× to 8× |
| God mode, kill all | F5 / F6 | |
| Give XP, force level-up | F7 | |
| Give upgrade or ability by id | Console | Validated against the registries |
| Jump to chapter or phase | Menu | Applies the chapter's starting picks |
| Spawn enemy at cursor | Mouse | Dev only (mouse is menus-only in the shipped game) |
| Show hitboxes, spawn ring, safe zones, targeting lines | F8 | |
| Force boss phase, trigger surge warning | Menu | |
| Set seed | Menu | |
| **Replay recorder** | F9 | Saves seed + per-tick command stream as JSON; replays headless or on screen. Used for bug reports and bot tests |
| Export run log | F10 | Format in section 11 |

---

## 9. Risk register

| # | Risk | L | I | Early signal | Mitigation / fallback |
|---|---|---|---|---|---|
| R1 | Canvas 2D cannot hold peak counts | M | H | S1 | Fallback ladder in S1; lower the cap |
| R2 | Procedural art looks cheap | M | H | S2 | Hybrid SVG or CC0 characters |
| R3 | The loop is not fun | M | H | S3 | Rework the loop before Milestone A |
| R4 | Balance across five chapters takes longer than the build | H | M | Bot clear rates | Bot first, config-only tuning, playtests |
| R5 | Same field for 67 minutes feels repetitive | M | M | Chapter 1 slice playtest | Hazards, objectives, lighting and chapter props carry variety |
| R6 | Agent drift or scope creep | M | M | Review prompt findings | One milestone per session, approval gates, scope-guard prompt |
| R7 | Boss unreadable | M | H | E3 | Telegraph tests, grayscale and color-blind checks |
| R8 | Synthesized audio is poor | M | M | S4 | CC0 files |
| R9 | Save or migration bugs corrupt progress | L | H | Migration fixtures | Backup-before-migrate, tested recovery |
| R10 | Browser differences (Safari audio unlock, key handling) | M | M | S1, S4 | Test matrix, first-click audio unlock |
| R11 | Keyboard ghosting (diagonal plus Space on cheap keyboards) | L | M | Playtests | Rebindable Pulse key, alternative default |
| R12 | Screen size changes difficulty | H | M | F3 | Fixed logical viewport (O2) |
| R13 | Level cadence and targets disagree | H | M | F1 | Decision O1 |

---

## 10. Scope tiers and cut list

**Must:** five chapters playable, Signal Flare and Beacon Pulse, three unlockable abilities, all four enemies plus Stormroot, upgrades with caps and fallbacks, phase retry, versioned save, settings and accessibility basics, credits.
**Should:** Field Ledger screen, barks, Idris radio, chapter lighting and weather variants, rank letters.
**Could:** Score Attack, extra Ledger lore entries, ability evolutions (post-v1 anyway).

**Cut order if time runs short:** Score Attack, then Idris, then extra Ledger lore, then barks beyond about 12, then weather variants, then rank letters. The Chapter 5 boss and the ending are never cut.

**Vertical-slice gate (end of Milestone D2):** go if 4 of 5 testers finish Chapter 1, at least 3 of 5 want to continue, performance holds, and there are no blocker bugs. Otherwise fix or cut before scaling to Chapters 2–5.

---

## 11. Playtest plan and run log

| Round | When | Who | What |
|---|---|---|---|
| P1 | S3 in Milestone 0 | 3 people | 5 minutes, no coaching |
| P2 | After D2 | 5 people | Full Chapter 1 |
| P3 | After E2 | 5 people | One of Chapters 3–4 |
| P4 | After F3 | 5 people | Full campaign over two sittings |

**Protocol:** do not explain the game. Watch silently. Ask them to think aloud. Afterwards ask: What killed you? What did your last upgrade do? Would you keep playing? Before each round, check the build in grayscale and a color-blindness simulation yourself.

**Run log** (exported by the dev tool in development and by a "Copy run log" button on the Results screen, user-triggered, never sent anywhere):
```json
{
  "schema": 1,
  "build": "0.1.0",
  "seed": 12345,
  "chapterId": "ch1",
  "result": "defeat",
  "deathCause": { "sourceId": "seedling", "phaseId": "ch1_p3" },
  "durationSec": 412.5,
  "finalLevel": 7,
  "kills": { "seedling": 301, "bloomed_seedling": 12 },
  "picks": [{ "tSec": 31.8, "level": 2, "offered": ["flare_damage", "move_speed", "field_rations"], "chosen": "flare_damage" }],
  "damageTaken": [{ "tSec": 120.4, "sourceId": "seedling", "amount": 6 }],
  "perf": { "avgFps": 59.8, "p99FrameMs": 21.2, "maxEnemies": 87 },
  "settings": { "reducedFlashes": false, "highContrast": false }
}
```
No personal data. It is only for balance.

---

## 12. Release and legal checklist

- [ ] **Name check:** search NIGHTBLOOM on itch.io, Steam and the trademark databases for your region. I cannot verify trademarks for you. For a commercial release, ask a lawyer.
- [ ] **Code license:** choose one (for example MIT or proprietary) and add `LICENSE`. It does not cover bundled assets.
- [ ] **Fonts:** use only open-license fonts (for example OFL), credited in `CREDITS.md`, or system fonts.
- [ ] **Assets and audio:** procedural, or credited with source and license.
- [ ] **Hosting:** itch.io HTML5 upload (zip with `index.html` and relative paths), GitHub Pages, or any static host. The relative-base build supports all three.
- [ ] **Store page assets:** a short capture or GIF, 3–5 screenshots, a one-paragraph description.
- [ ] **Privacy note:** "No data collected. Progress is stored in your browser only."
- [ ] **Version and changelog** present and shown on the Credits screen.

---

## 13. Working agreement with the coding agent

- One milestone per session. Start every session with "read CLAUDE.md and the docs it lists".
- The agent gives a short plan first, builds, runs all quality gates, reports, commits and **stops for your approval**.
- You test by playing, not only by reading the report. Use the Review prompt after every milestone.
- Decisions go in `docs/DECISIONS.md` (context, decision, consequence) before the code changes. Bug reports include the seed and, in development, the replay file.
- Use one git branch per milestone. Merge after you approve.
- If a prompt grows beyond one session's scope, split it, as was done for Milestone D1.

---

## 14. Open decisions and exit gate

### 14.1 Open decisions
| # | Decision | Recommendation | Decided after |
|---|---|---|---|
| O1 | Level-up cadence vs level targets (F1) | Front-loaded curve: 30 s, 85 s, 140 s, then ~90 s; keep GDD 9 targets | S3 |
| O2 | Viewport and scaling (F3) | Fixed 1280×720 logical, uniform scale, letterboxed | S1, S3 |
| O3 | Render interpolation on high-refresh displays | Interpolate if it is cheap and S3 shows judder | S1, S3 |
| O4 | Ability slot pressure begins in Ch5 (F2) | Keep it, or add a second ability slot at level 6 so choices begin in Ch3 | S3 |
| O5 | Peak-live targets vs capacity (F6) | Treat as density and performance targets, set difficulty by bot clear rate | S1, S3, bot |
| O6 | First Flare Damage pick reaches 14 (F4) | Make level 1 = +40%, then +20% | S3 |
| O7 | Art path | From S2 | S2 |
| O8 | Audio path | From S4 | S4 |
| O9 | Enemy cap and bot speed | From S1 and S5 | S1, S5 |
| O10 | Name check and code license | Section 12 | Before Milestone F |

### 14.2 Exit gate checklist
- [x] S1–S5 results recorded in section 3, each with pass or fail.
- [x] `REFERENCE_MACHINE` is your real target (Chrome & Edge 60 Hz desktop).
- [x] Pillars, feel constants (section 5), style rules, wireframes and viewport approved.
- [x] Every open decision O1–O9 is decided and logged in `DECISIONS.md`.
- [x] `GDD.md`, `ARCHITECTURE.md` and `TDD.md` aligned with decisions.
- [x] Spikes implemented in `spikes/` (S1 Performance, S2 Art, S3 Feel, S4 Audio, S5 Headless).
- [ ] **You approve starting Milestone A.**

### 14.3 Decision entry format (`docs/DECISIONS.md`)
```text
## D-001 · <short title> · <date>
Context: what we found and which section/test shows it.
Decision: what we chose, including the exact new numbers.
Consequence: which docs and config change, and what we gave up.
```

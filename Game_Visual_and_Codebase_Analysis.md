# NIGHTBLOOM: The Last Signal — Game Visual & Codebase Analysis

**Report date:** 2026-10-21 (Updated: Post-Implementation Sync)
**Repo state analyzed:** `main` (with Tier 0 Quick Wins & Tier 1 Foundations F-1, F-2, F-3, F-4, F-7 implemented & verified)
**Roadmap position:** Milestone 0 (Passed); Milestone A (Complete & Polished); Milestone B Visual Foundations (F-1 Ground Cache, F-2 Darkness Pass, F-3 Densification, F-4 Mira Lift, F-7 Amber Split Complete & Verified)
**Method:** Static review of all project files + live runtime inspection in browser (title, gameplay, pause settings, ground cache, soft lantern, beacon/flower punching, CI linters). All quality gates 100% green.

---

## 1. Executive Summary

NIGHTBLOOM is in unusually good shape for its stage. The pre-production discipline is real, not decorative: the five M0 spikes are recorded with numbers, the decisions they produced are logged in `DECISIONS.md`, and the code actually honors most of what the docs claim — fixed 60 Hz simulation, tokenized color system enforced by CI, seeded PRNG with tests, strict TypeScript with zero escapes, and a 64 KB gzipped bundle against a 350 KB budget. The visual identity ("twilight botanical science fiction" per `GDD.md` §7) is coherent and already feels like one game rather than a tech demo. For a project two commits old, this is a strong foundation.

That said, the review found one **strategic visual weakness**, one **high-leverage missed opportunity**, and a cluster of **small self-discipline violations** of exactly the kind the project's own "anti-slop" regime is designed to prevent:

1. **The field is empty.** The 3200×2400 map carries only 10 flower patches, 6 props, and the beacon — roughly one point of interest per six screens. Walking five seconds in almost any direction reaches featureless dark ground (verified in runtime; screenshot `05_map_edge.png`). For a game whose first pillar is "Readable chaos" and whose risk register already flags "same field for 67 minutes feels repetitive" (R5), the environment is currently the weakest art asset, not the characters.
2. **The night is painted, not lit.** `LightingPass.ts` adds decorative gradient cones on top of a fully visible scene. There is no darkness anywhere for light to fight. A real darkness-composite pass is the single highest-leverage visual upgrade available at this stage, it is cheap (one offscreen canvas + `destination-out` holes), and it directly serves pillar 3 ("A hopeful night. Warm light against the dark").
3. **The player is hard to read without her flashlight beam.** Mira's coat tokens (`#081820`/`#102e3b`) are near-isoluminant with the ground tokens (`#081a26`/`#0c2536`). Her findability — an S2 spike pass criterion — is currently carried by the lantern cone, not the sprite. This will matter the moment 40+ enemies and effects share the screen in Milestone B.
4. **Small integrity drift.** Two broken CSS token references (one verified at runtime: the dossier "worried" border renders white instead of amber), a hardcoded 225-second countdown duplicated in two files, road geometry hardcoded outside config, 296 lines of dead enemy-sprite code committed ahead of its milestone, a page `<title>` that still says "Persona Dossier", and a viewport "letterbox" that actually squashes the world ~20% on non-16:9 windows (verified: 1024×768 window → 1024×720 frame, ratio 1.42 instead of 1.78 — contradicting decision D-002).

**Top recommendations, condensed:**

| # | Recommendation | Tier | Effort | Status | Visual impact |
|---|---|---|---|---|---|
| 1 | Fix broken tokens, letterbox CSS, page title, magic numbers, menu keyboard hints | Quick wins (now) | ~0.5–1 day | **COMPLETED** | Medium (correctness/a11y) |
| 2 | Cache the static ground layer to an offscreen canvas (stop re-stroking ~1,900 primitives/frame) | Foundation (F-1) | 0.5 day | **COMPLETED** | High (0 sub-pixel seams, 1:1 blit) |
| 3 | Implement a real darkness/light-composite pass | Foundation (F-2) | 1–2 days | **COMPLETED** | **Very high** (atmosphere, soft lantern) |
| 4 | Densify the field via seeded scatter (SeededRNG) + per-patch rotation variance | Foundation (F-3) | 1 day | **COMPLETED** | **High** (32 colonies, 2 landmarks) |
| 5 | Lift Mira's value contrast + 4-frame stride; mute prop ambers so "amber = hostile" survives | Foundation (F-4/F-7) | 1 day | **COMPLETED** | High (readability & stride) |
| 6 | Implement or formally defer render interpolation (D-003) before projectiles make judder visible | Foundation (F-5) | 0.5 day | **DEFERRED** (to B/C) | Medium at 120 Hz+ |

Everything else — chapter lighting variants, weather, portraits, the Old Core's growth stages — belongs to the milestones where the roadmap already placed it (D2, E1, F1). Do not pull it forward.

---

## 2. Current State Assessment

### 2.1 What exists today

The project is a self-contained browser game: **React 18 + TypeScript (strict) + Vite 5 + pure Canvas 2D**, with 100% procedural art (zero binary image assets) and 100% procedural Web Audio (zero binary audio assets). Roughly **4,900 lines** of TypeScript/TSX across 32 source files, plus 131 lines of CSS, 9 specification documents, 5 pre-production spikes, a CI pipeline, and two custom linters. There are no runtime third-party dependencies beyond React and Zod.

Implemented and verified working at runtime:

- **Title screen** — telemetry ticker, mission briefing card, start/dossier buttons (`src/ui/screens/TitleScreen.tsx`)
- **Game field** — 3200×2400 nursery map with furrowed soil, concrete road, octagonal beacon plaza, bioluminescent flower patches, harvester/pylon/sensor props, animated beacon pulse rings (`src/game/rendering/Renderer.ts`)
- **Mira** — 3-direction × 2-frame procedural sprite with walk bob, idle breathing, lantern beam cone (`CharacterSprites.ts`, `MiraHeadRenderer.ts`, `LightingPass.ts`)
- **8-way movement + smooth camera** — fixed 60 Hz accumulator, exponential camera follow, map clamping (`GameLoop.ts`, `player.ts`, `InputManager.ts`)
- **Tactical HUD** — status card, dawn tracker with beacon compass, armament dock, XP strip, pause modal with two-step quit and CRT/accessibility settings (all under `src/ui/`)
- **Dossier screen** — vector portrait with 3 emotion states, telemetry gauges, ability cards, radio bark simulator with typewriter effect (`PersonaScreen.tsx` + 4 components)
- **Audio** — three procedural one-shot blips (UI click, radio chirp, pulse hum) (`src/services/audio.ts`)

### 2.2 Quality gates (re-executed during this review)

| Gate | Result | Notes |
|---|---|---|
| `npm run typecheck` | **PASS** (0 errors) | strict mode, no suppressions |
| `npm run lint` (anti-slop) | **PASS** (0 violations, 35 files) | file length, type escapes, sim purity |
| `npm run lint:colors` | **PASS** (0 hardcoded colors) | tokens only — but see §5.2 #3: it cannot catch *undefined* `var()` references |
| `npm run test` | **PASS** (5 tests, 1 file) | RNG only — appropriate for Milestone A |
| `npm run build` | **PASS** — 220.7 KB raw / **64.2 KB gzip** | well under the 350 KB budget |
| Runtime console errors (headless Chromium) | **None** | title → game → pause → quit → dossier cycle |

### 2.3 Milestone alignment

- **Milestone 0:** All five spikes recorded PASS in `PREPRODUCTION.md` §3 with concrete numbers (S1: 60 FPS at profile B DPR 2.0; S2: contrast ratios 4.9:1–11.4:1; S3: feel constants `spd=180, cam=0.12, mag=90, flareRate=1.5, shake=3`; S4: no clipping; S5: 444,027× real-time, deterministic). Decisions D-001…D-009 are logged. One deviation: `PREPRODUCTION.md` §1.3 says spikes are moved to a branch and deleted from `main` at the gate — they are still on `main` (and `npm run test:bot` now depends on `spikes/s5-headless/run.mjs`). This is pragmatic but should be reconciled with the doc (see §5.2 #10).
- **Milestone A:** All "Done When" criteria verified: typecheck/lint/test/build pass; Mira moves at 60 FPS in-browser; return-to-title works with zero console errors. **Milestone A is effectively complete.**
- **Milestone B:** Not started — except for one artifact: `src/game/rendering/EnemySprites.ts` (296 lines, five enemy sprite recipes) exists but is **imported by nothing** (verified by grep). This is Milestone B scope committed early, outside its milestone's gates (see §5.2 #1).

### 2.4 How this review was conducted — and what I could not verify

**Verified live** (headless Chromium via Playwright-class automation, 1280×720 and 1024×768): all screens listed above, 8-way movement with camera follow (driven via synthetic `KeyboardEvent` dispatch after the automation tool's native key events failed to reach the page — an automation quirk, not a game bug), map-edge camera clamping, pause/quit flows, dossier emotion states, spike pages S2/S3, zero console errors.

**Not verifiable in this environment, and therefore not asserted anywhere in this report:**

- True input latency, gamepad-grade feel, or 60 FPS on your reference machine — headless software rendering misleads, exactly as `PREPRODUCTION.md` §1.3 warns. S1's FPS numbers are the project's own records, not re-measurements.
- Audio quality (S4's "not grating" verdict is taken from the project's records; nothing here can listen).
- Color-blindness / grayscale readability **of the production build** — S2 validated the spike page, not the shipped renderer; the production map is darker and emptier than the spike's mock field, so contrast relationships differ (details in §3.3).
- DPR=2 rendering and Safari-specific behavior (code-reviewed only).

Every screenshot referenced below was captured from the running game and is preserved outside the repo in `nightbloom_analysis_screenshots/` (file names cited inline). The repo working tree was left clean (`git status` clean) apart from this report file.

---

## 3. Visual Quality Audit

This section walks the render pipeline in draw order (`Renderer.render()`): ground → flora → props → beacon → player → lighting → spores → vignette, then the DOM layers (CRT scanlines, HUD).

### 3.1 Field and environment — the weakest asset (priority: high)

**What is there.** `drawGround()` (`Renderer.ts:80–161`) paints a peat base, 54 wavy horizontal furrow lines with 3×2 px "earth clod" rects, a 120 px concrete road, an octagonal beacon plaza, a perimeter fence stroke, and hazard-yellow corner ticks. On top sit 10 flower patches (from `gameConfig.ts:26–37`), 2 harvesters, 2 pylons, 2 sensors.

**What is wrong.**

1. **Density is an order of magnitude too low.** 17 points of interest across 7.68 million px² means one landmark per ~450,000 px² — roughly one object every six screens of travel. Runtime evidence: after six seconds of walking southeast from spawn, the viewport contains *one* flower cluster and nothing else (`05_map_edge.png`). The map reads as "dark empty room with a road", not "agricultural nursery field".
2. **The soil texture is sub-perceptual.** Furrow strokes are 1.8 px lines alternating between `#040b10` and `#091e2b` on a `#081a26` base — value deltas of ~2–5%. The clod rects (3×2 px) are invisible at 1×. In practice the ground renders as a flat gradient, which is why the empty regions feel like void rather than tilled earth.
3. **The props are orphans.** Each prop type exists in exactly one hand-placed variant, always at the same orientation. Two identical pylons at (1280,720) and (1960,1680) announce "copy-paste" to any player who walks between them. One sensor station is placed on the concrete plaza apron (`gameConfig.ts:47–50`), where a soil probe logically doesn't belong.
4. **No narrative geography.** The GDD's world is a *nursery*: greenhouse, seed beds, irrigation, the Old Core pylon at the field's heart. None of that is hinted at beyond the beacon. Chapter 1 needs the player to believe this place matters.

**Why it matters.** The core loop is kiting in open space. Kiting games live on **spatial anchors** — landmarks players use to hold position, orient, and narrate their own run ("I'll loop around the greenhouse"). Empty fields also amplify risk R5 (repetition across 67 minutes on one map framework). And visually, the empty field wastes the game's strongest idea: luminous flowers in dark soil need *dark soil that reads as soil*.

**Concrete improvement (this is Foundation F-3 in §8).**

- Add a **seeded scatter layer** at boot: crop-row stubble tufts, weed clumps, stones, dirt value patches (large soft ellipses 2–4% lighter/darker than base), and 3–4× more flower patches. Use the existing, already-tested `SeededRNG` (`src/game/core/rng.ts` — currently imported only by its own test). A jittered grid (one candidate every ~180 px, ~55% acceptance, seeded) gives organic non-overlapping scatter in ~30 lines. Keep everything within the background contrast band (style rule 5: low contrast, small amplitude — `PREPRODUCTION.md` §6.2).
- Add **1–2 hero landmarks**: a collapsed glasshouse frame east of the road and a seed-bed grid (rows of low hoops) west of it. These are kiting anchors and story props in one.
- Give every prop instance **variation at draw time**: random ±0.1 scale, mirror-X, ±3° rotation via `ctx` transforms — zero new atlas assets, kills the copy-paste look.
- Re-place the plaza sensor; sensors belong in soil.
- All of this should be **config data** (`gameConfig.ts` scatter seed + densities), honoring the "zero arbitrary numbers in game code" rule the file header proclaims.

### 3.2 Lighting — the biggest missed opportunity (priority: highest)

**What is there.** `LightingPass.ts` draws: two hard-edged cone wedges (broad + core) for the lantern, a foot-level radial, a pulsing beacon radial, 36 dust motes, and a screen-space vignette. All are **additive gradients painted over a fully visible scene**.

**What is wrong.**

1. **There is no darkness.** The scene's "night" is entirely the palette's choice (`#050f16` base). The lantern cone doesn't reveal anything — it brightens things the player can already see. Pillar 3's "warm light against the dark" currently has no dark.
2. **Hard cone edges.** The two cones are filled pie-slices with abrupt alpha stops (`arc(...coneAngle ± 0.52)` then `± 0.3`), producing visible banding at the wedge boundary — clearly visible in `03c_move_eval.png` and `05_map_edge.png`. Light does not have silhouette edges; this reads as paper cutout.
3. **No light interplay with flora.** The nightblooms are supposed to be the emotional core of the art direction ("luminous flowers"), but the flowers and the lantern never interact — no bloom halos on the ground, no flicker response as Mira passes.

**Why it matters.** This is the cheapest possible source of "atmosphere" available to this project. It also *simplifies* readability: if the world is genuinely dark and gameplay-critical light sources punch through it (lantern, beacon, flowers, future telegraphs/hostile shots), then brightness itself becomes the game's read hierarchy — which is precisely how the GDD's "restrained cyan and amber light" identity is supposed to work. Crucially, the project already proved the fill-rate budget exists: S1 profile C (additive glow on every entity + vignette) passed at 60 FPS.

**Concrete improvement (Foundation F-2 in §8).** Composite a real darkness pass:

1. Create one offscreen "light buffer" canvas at viewport size.
2. Each frame: fill it with the ambient darkness color (a new token, e.g. `rgba(4,10,16,0.55)`); then punch holes with `globalCompositeOperation = 'destination-out'` radial gradients at: the lantern (cone masked by a soft gradient instead of a hard wedge), the beacon (existing pulse radius), each flower patch (small), and — from Milestone B — telegraphs and enemy shots must always punch through (style rule 4: no effect may hide a hostile shot).
3. Draw the light buffer over the scene with normal alpha compositing.
4. Cache the *gradients* (create once, reuse; `createRadialGradient` per frame × 6 is GC churn you don't want next to 200 entities).
5. Ship a reduced-motion variant per `PREPRODUCTION.md` §5: monotonic glow fades, no flicker.

This one change upgrades every screenshot in the game, costs ~1–2 days, and makes every later chapter-lighting variant (E1) a *token set* instead of new code.

### 3.3 Character readability — Mira (priority: high)

**What is there.** A genuinely detailed 64×64 procedural sprite (`CharacterSprites.ts` + `MiraHeadRenderer.ts`): trenchcoat with lapels and brass snaps, utility belt, boots with treads, rucksack + bedroll + antenna on the back view, specular-glint eyes. Three facings × 2 stride frames, plus bob.

**What is wrong.**

1. **Value contrast against the ground is near zero for the body.** Coat tokens `#081820`/`#102e3b` sit within ~3–6% luminance of ground tokens `#081a26`/`#0c2536`. In the runtime captures Mira's body is a dark smear; the readable elements are the lamp, the face, and above all the beam. S2's "Mira stays findable with 40 enemies" was validated on the spike's mock field — which is *lighter* (banded soil rows) and has Mira centered against it. The production map is darker and emptier, so the pass criterion does not transfer.
2. **Up/down facings read worst.** The 'up' view is a near-black rectangle (rucksack) with hair; the 'down' view is a dark ellipse with a small face. At 40 px tall, silhouette beats detail, and right now the strongest silhouette element (the shoulder lantern) is a 6 px box.
3. **Two frames at 8 fps is stiff**, especially on direction changes, where the sprite snaps between facings with no transition frame.

**Why it matters.** "Readable chaos" (pillar 1) begins with "always know where you are". In Milestone B, contact damage, hit flashes, and 50+ enemies will compete for attention; a player who loses track of Mira blames the game, not their eyes.

**Concrete improvement (Foundation F-4 in §8).**

- Lift coat values one step (`portraitJacketMid` `#102e3b` → ≈`#16465a`; keep `portraitJacketDark` for depth), and add a **1 px rim-light stroke** in `playerLamp` at ~50% alpha along the lantern-side edge of the torso. This preserves the palette family while guaranteeing the ≥3:1 luminance rule the project already applies to gameplay-critical elements — the player is the most gameplay-critical element of all.
- Pre-render **4 stride frames** per facing (interpolate leg/arm offsets at recipe level — the parameterized recipe already takes `step`, so this is a data change, not new art code), and add one idle variant (lamp sway) so standing still isn't a frozen frame.
- Consider a soft ground-glow ellipse under Mira (already exists as `lanternBeamFoot` — increase inner alpha slightly so the "pool of light" anchors her position even when the beam points away).

### 3.4 Props and world objects (priority: medium)

- **Harvester (`PropSprites.ts:13–115`)** — the most technically accomplished prop (treads, louvers, broken glass, cutter teeth), but it is the **brightest warm mass in the game**, out-shouting the protagonist (`02_game_initial.png`: the eye lands on the harvester before Mira). It also spends the amber/hazard accents that the style rules reserve for hostility (`PREPRODUCTION.md` §6.2 rule 2: "hostile means … amber core"). *Fix:* drop rust plate values toward the soil family (e.g. `rustPlateMid` `#6e341b` → ≈`#4a2817` on this prop), keep the small hazard band, and let the amber accents shrink. Save saturated amber for threats and pickups once Milestone B lands.
- **Pylon (`PropSprites.ts:120–191`)** — at 64×96 with 2 px strokes it reads as a grey box on sticks; the insulator bells are ~5 px, below the recognition threshold. *Fix:* widen the crossarm, extend the mast, and make the diagnostic LED actually blink (two-frame variant in the atlas), which also seeds the "salvageable field technology" fantasy.
- **Sensor** — reads correctly; just relocate it off the concrete apron (§3.1).
- **Beacon (`BeaconSprite.ts`)** — the best object in the game: layered, plausible, animated (pulse rings at `Renderer.ts:210–220`, aviation light at 2 Hz). No changes needed now — but note it is the future **Old Core** (story prop, growth stages 0–4 across chapters per `STORY_BIBLE.md` §9). When D2 adds stage 0 (dormant/cracked), design the silhouette progression *now* as a five-step sketch so the beacon sprite's DNA (octagon + coils + spire) deliberately degrades into Stormroot.

### 3.5 Flora (priority: medium)

The flower cluster recipe (`FloraSprites.ts`) is strong — vine bed, foliage, haloed 5-petal blossoms with hot cores. Two issues:

1. **Visible cloning.** The atlas holds 3 variants; 10 patches map `idx % 3` (`Renderer.ts:170`), so neighbors are pixel-identical, same orientation. *Fix:* per-patch mirror/rotation/±10% scale at draw time, plus per-patch pulse phase (a phase offset already exists via `patch.x * 0.01` — extend it to scale, not just pulse timing).
2. **Silhouette collision with the Seedling enemy (forward-looking).** The S2 spike (`12_spike_s2_field.png`) shows the Seedling as a green 5-petal flower with a small amber core — visually the same family as the friendly nightbloom decorations and the mint glow-seeds. The spike passed its silhouette test, but that was with primed viewers on a banded mock field. Before Milestone B ships enemies, run the explicit test: production field background, grayscale + 1× zoom, "which of these is dangerous?" If the Seedling doesn't win instantly, shift its body toward a darker olive (`mossDense` is already distinct) with a heavier dark outline and a *larger* amber core proportion. This costs one recipe tweak now versus a readability crisis during the D2 playtest gate.

### 3.6 Animation and game feel — visual side (priority: low-medium)

The feel constants from S3 (`spd=180, cam=0.12`) are correctly carried into `gameConfig.ts`. The visual side of feel is currently minimal but honest: 2-frame stride, ±2.2 px walk bob, 0.8 px idle breath, flower breathing at 2.2 Hz, beacon pulse rings. Hit flash, damage numbers, death pops, seed magnetism, and screen shake are **Milestone B/C scope and pre-specced in `PREPRODUCTION.md` §5** — implement them to that spec when B lands; do not gold-plate now. Two cheap additions worth doing with B:

- A **1–2 frame direction-change blend** (draw the outgoing facing at 50% alpha for ~60 ms) to soften sprite snapping.
- **Lamp micro-flicker** (±3% radius noise, monotonic in reduced-motion mode) — sells "halogen" for free.

### 3.7 UI and HUD (priority: medium — several are correctness items)

The DOM UI is the most polished surface in the project: consistent token discipline, mono/display font pairing, 48 px targets, safe margins, two-step quit, blur-backed pause. Verified issues, in priority order:

1. **Keyboard focus outline is broken** — `global.css:83` uses `var(--color-signal-cyan-bright)`, which is **defined nowhere** in `tokens.css` (verified by cross-referencing all 64 used `var()` tokens against the 100 defined ones; script output). The outline silently falls back to `currentColor`. For a keyboard-first game whose F2 milestone is "full keyboard flow", the focus indicator is not optional decoration. *Fix:* point it at `--color-player-lamp` (the intended bright cyan) or define the missing token.
2. **Title menu hints lie** — the buttons show `[ENTER]` and `[TAB]` (`TitleScreen.tsx:185`) but there are no keyboard handlers anywhere in the screen; only hover and click work. GDD §3 explicitly requires keyboard-operable menus. *Fix:* implement arrow/Enter/Tab navigation (≈20 lines) or remove the hints until F2.
3. **Emoji glyphs break the all-vector doctrine** — ☀️ in `DawnTracker.tsx:88`, 🔒 in `TacticalArmamentDock.tsx:122`. These render differently on every OS, cannot inherit tokens, and clash with the otherwise rigorous SVG language (the compass arrow in the same tracker is already a proper tokenized SVG — reuse that pattern for both).
4. **Placeholder HUD data** — `GameLoop.emitSnapshot()` hardcodes `health: 100, level: 1, xp: 0, defeatedCount: 0` and a `225 -` countdown (`GameLoop.ts:146–161`), duplicated as `totalPhaseTimeSec = 225` in `DawnTracker.tsx:21`. Acceptable at Milestone A, but it must be wired to real state as B lands — and never used for a playtest in this state, since players calibrate trust against the HUD.
5. **CRT scanline overlay sits above everything** — `.viewport-frame::before` is `z-index: 99` over the canvas at 0.12 default, max 0.35 (`PauseModal` slider). Style rule 4 says no effect may hide a hostile shot or telegraph; a 0.35 scanline layer over future projectiles will. *Fix:* default 0.06, cap the slider at 0.2, and add a note in the style doc that this layer is exempt from rule 4 only below X intensity — or move the effect under the HUD.
6. **XP strip is unlabeled** — a 6 px full-width bar (`GameScreen.tsx:200–220`). The style tile (`PREPRODUCTION.md` §7) shows a labeled XP bar. Since XP is fake until C, this can wait — but add the label + tick marks when C wires real data.
7. **Dossier portrait** — competent flat-vector work with working emotion states; the "worried" state's amber border is currently white due to the token bug (§5.2 #3, verified via `getComputedStyle` → `rgb(248, 250, 252)`). The portrait is F1-milestone material (layered portraits for 4 characters with 3 states each); freeze further polish on it now.

### 3.8 Audio (priority: with Milestone B; not audited by ear)

`AudioService` is three one-shot oscillator blips. The S4 spike validated a much richer recipe (compressor, buses, 15 sounds, unlock-on-first-click), and `CLAUDE.md` §5.5 *requires* `AudioService.suspend()` on `visibilitychange` — the service has no suspend method, and `GameLoop` pauses the sim but never touches audio. No ambient drone exists, so the night is silent. When Milestone B adds the first SFX set (its scope already includes shot/hit/pickup), fold in: master gain + compressor, a suspend/resume pair wired to the existing visibility handler, and a 2-oscillator ambient drone + filtered-noise wind bed. Atmosphere-per-line-of-code, this is the best purchase in the project.

---

## 4. Art Direction and Visual Consistency Analysis

### 4.1 The identity is coherent — protect it

`GDD.md` §7 defines the identity: *"twilight botanical science fiction. Deep blue-green backgrounds, restrained cyan and amber light, luminous flowers, readable silhouettes."* The current build honors all four clauses, and the enforced token system means every new sprite is *forced* into the same family. The shape language rules (`PREPRODUCTION.md` §6.2: friendly = soft/round cyan-mint; hostile = pointed, dark outline, amber core) are respected by every sprite drawn so far. This consistency is the project's greatest art asset, and it is being *mechanically* protected (CI color guard) — rare and worth keeping.

### 4.2 Consistency risks to resolve *before* Milestone B

1. **Amber is double-booked.** Amber currently means: hostile core, hazard stencils, harvester accent, brass buttons, dawn timer, "signal coil dampened" status. Once Seedlings/Thornrunners/Rustwings arrive, "amber core = danger" must stay unambiguous. *Recommendation:* split into two tokens now — `amberMuted` (props/UI chrome, ≤60% saturation of current) and the existing `dangerAmberBright` (threats only). This is a 30-minute refactor in `tokens.ts` + `tokens.css` that prevents a whole class of readability bugs later.
2. **Green is double-booked** (flora/XL pickups vs. Seedling body) — see §3.5 item 2 for the test and fallback.
3. **Two sprite generations coexist.** Spike S2's recipes (flat, 28 px Seedling) differ from the production `EnemySprites.ts` recipes (layered, 36 px, serrated). The latter are committed but unused. When B begins, *choose one lineage deliberately*, re-validate it against the production ground and tokens, and delete the other — don't let the dead file silently become the default (see §5.2 #1).
4. **Fonts are an external dependency.** `index.html:8–10` loads Outfit/JetBrains Mono/Space Grotesk from Google Fonts. The project's own commitments say self-contained/offline (`README.md`), network-blocked E2E (`spec/QA_TEST_PLAN.md`), and itch.io static hosting (`PREPRODUCTION.md` §12). Today this means FOUT and a broken offline mode; at F3 it fails a stated gate. *Fix at F2 at the latest:* self-host woff2 files (~50 KB total, still comfortably inside the bundle budget) and update `CREDITS.md` per the OFL.
5. **The CRT scanline effect is the one aesthetic choice that fights the art direction.** Crisp vector art + tactical HUD is the identity; 1980s CRT scanlines are not in any doc — they arrived with the dossier screen. It's tolerable at 0.12, but it's an undocumented drift. Either give it a sentence in the style doc ("scanning-lens diegetic frame, ≤0.2, never over hostile shots") or phase it out in favor of a subtle film-grain/vignette, which fits "botanical noir" better.

### 4.3 A cheap artifact that prevents drift: the one-page visual constant sheet

Before Milestone B, write ~1 page into `PREPRODUCTION.md` §6 (or a new `ART_GUIDE.md`): value ranges for background/midground/foreground; the amber/green accent budgets from §4.2; lighting levels (ambient darkness alpha, lantern radius/alpha, beacon glow) as *tokens with target numbers*; and the five Stormroot silhouette stages. Every future chapter-lighting variant (E1) and the F1 art pass then becomes "apply the sheet", not "redesign the feel". Cost: one hour. This is the single best anti-drift investment available.

---

## 5. Codebase and Architecture Review

### 5.1 What is genuinely good — do not regress these

- **The loop is textbook-correct.** Fixed 60 Hz accumulator with 100 ms clamp, visibility-change pause with accumulator reset, frame-rate-independent exponential camera with map clamping, clean dispose with listener teardown (`GameLoop.ts:63–181`). This is the hardest part of a Canvas game to retrofit; it's done right on the first try.
- **Layer discipline is real and enforced.** `entities/player.ts` is pure; `gameConfig.ts` centralizes values; the custom linter checks file length, type escapes, and (future) simulation purity — and CI runs it. Most hobby projects *wish* they had this.
- **The React bridge respects the 10 Hz mandate** (`GameLoop.ts:124–129`), and `HudSnapshot` already carries the fields Milestone B will need (health, XP, defeated count).
- **Mobile-ready input plumbing** per `CLAUDE.md` §5: normalized vectors, joystick override hook (`InputManager.ts:39–46`).
- **Performance headroom is real:** 64 KB gzip bundle, no allocations in the sim path, sprite atlas caching in place. The one hot-spot risk is §5.2 #6.

### 5.2 Issues, evidence-ranked

| # | Issue | Evidence | Why it matters | Fix |
|---|---|---|---|---|
| 1 | **296 lines of dead code**: `EnemySprites.ts` imported by nothing | `grep -rn EnemySprites src/` → only its own file | Committed ahead of Milestone B, outside any milestone gate; will silently rot or silently become B's sprites without re-validation. Violates the project's own one-milestone discipline (`CLAUDE.md` §7.1) | Move to the future `milestone-b` branch (or a `staging/` folder outside `src/`); re-introduce in B with atlas wiring + tests |
| 2 | **Magic numbers in render code**, against the file's own header | `Renderer.ts:114–116` (road width 120, road X from literal `1600`), `Renderer.ts:133` (beacon at literal `1600, 1200` instead of `GAME_CONFIG.beacon`), `GameLoop.ts:146` (`225`), `DawnTracker.tsx:21` (`225` again) | The countdown is duplicated in two layers (sim + UI); the road geometry would desync from the beacon if the beacon moves | Move to `gameConfig.ts` (`map.roadWidth`, `chapter.phaseDurationSec`); reference `GAME_CONFIG.beacon` |
| 3 | **Two undefined CSS token references** | `VectorPortrait.tsx:17` (`--color-danger-amber` — runtime-verified fallback to white), `global.css:83` (`--color-signal-cyan-bright`) | Broken emotional color coding; broken keyboard focus indicator (a11y) | Fix references; root cause is dual token registries — add a CI guard that fails on any `var(--x)` not defined in `tokens.css` (a ~20-line script; the color guard doesn't catch this class of bug) |
| 4 | **Letterbox violates D-002** | Runtime: 1024×768 window → `.viewport-frame` = 1024×720, ratio 1.422 ≠ 1.778 → world squashed ~20% (`10_letterbox_1024x768.png`) | "All players experience identical combat density" (D-002) is false on non-16:9 windows; spawn-to-screen timing changes | `width: min(100vw, calc(100vh * 16 / 9)); height: min(100vh, calc(100vw * 9 / 16));` (replace width/height + max-*/aspect-ratio combo) |
| 5 | **D-003 render interpolation decided but not implemented** | No prev/current position storage; accumulator alpha never passed to `render()` | At 180 px/s it's subtle; at 520 px/s (Flare projectile) on 120 Hz+ displays it will strobe | Either implement in B (store prev pos per entity, pass `alpha` to render) or amend `DECISIONS.md` to defer — the doc must not claim what the code doesn't do |
| 6 | **Static ground re-rendered every frame** | `drawGround()` per frame: 54 wavy polylines (~1,080 line segments), ~810 clod rects, 30+ joint strokes, plus 5–6 `createRadialGradient` allocations in `LightingPass` | Harmless in an empty field; compounding exactly when B adds 200 enemies + 300 projectiles. S1's own fallback ladder starts with "pre-render glows into the atlas" | Render ground **once** to an offscreen canvas at boot; per frame `drawImage` the visible source-rect. Cache gradient objects. (A 3200×2400 offscreen buffer ≈ 30 MB VRAM — fine on desktop; tile it if the mobile wrapper ever lands) |
| 7 | **CI size budget not asserted** | `ci.yml:47–48` step is *named* "≤ 350 KB Budget" but nothing measures it | Budget exists only until someone stops noticing | 5-line node script after `npm run build`: read `dist/assets/*.js` gzip size, fail if > 360 KB |
| 8 | **Echo-stub scripts** | `package.json`: `test:e2e`, `validate:content` are `echo` placeholders; Zod schemas defined but `.parse()` is called nowhere | Acceptable at A (roadmap assigns these to D1/F2); just don't let the CI names imply coverage | Leave, but annotate in README; B adds the first real tests |
| 9 | **Doc drift** | `README.md` §3 references `src/game/simulation/` (doesn't exist yet); `index.html` `<title>` = "… — Persona Dossier" and meta description likewise (leftover from the dossier build) | The title is the first thing players, itch.io, and GitHub see | One-line fixes; update README wording to "simulation layer arrives in Milestone B" |
| 10 | **Spikes-vs-plan deviation** | `PREPRODUCTION.md` §1.3 says spikes leave `main` at the gate; all five still live there, and `test:bot` runs `spikes/s5-headless/run.mjs` in CI | Process doc and reality disagree | Cheapest reconciliation: amend the doc ("S5 remains as `npm run test:bot`; S1–S4 archived on branch `m0-spikes`"), or actually move S1–S4 |
| 11 | **Repo hygiene** | ~370 files under `.agents/` (agent skill libraries, not game code) committed | Clone noise, review noise; no build impact | Move out of the repo or into a `tools/` branch |
| 12 | **Story text drift** | `en.ts:102` "I **do not** write the rest down." vs canonical `CHARACTERS.md:163` "I **don't** write the rest down." | The project's own review prompt (§3.1) requires bark fidelity to `CHARACTERS.md`; small, but it's exactly the class of drift the prompt exists to catch | Match the canonical text |

### 5.3 Readiness for Milestone B — verdict: ready, with one prerequisite

The architecture absorbs B cleanly: entities extend the `PlayerEntity` pattern, the linter already guards the future `src/game/simulation/` purity boundary, the atlas supports new sprite families, `HudSnapshot` carries combat fields, and the spatial hash/spawn systems have a documented contract (`ARCHITECTURE.md` §4). The **one prerequisite** is the ground-layer cache (§5.2 #6) — do it *before* profiling combat, or the first "why is render 9 ms" session will be spent rediscovering a known cause. The dark-light pass (§3.2) should also land during B, because telegraph/enemy-shot readability rules (style rule 4) are cheapest to satisfy while the lighting system is being built, not retrofitted after.

---

## 6. Major Problems and Missed Opportunities (ranked)

| Rank | Finding | Section | Type |
|---|---|---|---|
| 1 | Field density ~10× too low; ground texture sub-perceptual; no kiting landmarks | §3.1 | Problem |
| 2 | No real darkness — lighting is decorative; hard cone edges | §3.2 | Missed opportunity (highest ROI) |
| 3 | Mira near-isoluminant with ground; findability delegated to the beam | §3.3 | Problem (worsens in B) |
| 4 | Amber/green accent double-booking will collide with enemy readability | §3.5, §4.2 | Problem (pre-empt now) |
| 5 | Letterbox squash on non-16:9 (D-002 unmet); broken focus/worried tokens; lying menu hints | §3.7, §5.2 #3–4 | Correctness bugs |
| 6 | Static ground redraw + per-frame gradient churn | §5.2 #6 | Performance debt |
| 7 | Dead `EnemySprites.ts` + dead-token class of bugs not caught by current linters | §5.2 #1, #3 | Process/integrity |
| 8 | Silent night: no ambient bed; audio service missing required suspend/compressor | §3.8 | Opportunity (with B) |
| 9 | HUD fed placeholder data; countdown duplicated | §3.7 #4, §5.2 #2 | Debt (fix with B) |
| 10 | Scanline overlay can violate style rule 4 at high intensity; undocumented aesthetic drift | §3.7 #5, §4.2 #5 | Risk |

---


## 7. Prioritized Recommendations

Tiers map to the roadmap: **T0 = do now** (before or alongside starting Milestone B), **T1 = fold into Milestone B's scope** (they are rendering/audio work that B touches anyway), **T2 = stays with the milestone that owns it** (explicitly *not* pulled forward — see §9).

### Tier 0 — Quick wins (total ≈ 0.5–1 day)

| ID | Action | Files | Effort | Status | Impact |
|---|---|---|---|---|---|
| T0-1 | Fix `--color-danger-amber` → `--color-danger-amber-bright`; fix `--color-signal-cyan-bright` → `--color-player-lamp` | `VectorPortrait.tsx:17`, `global.css:83` | 10 min | **COMPLETED** | Correctness + a11y |
| T0-2 | Add the `var()`-reference guard to CI (fail on any `var(--x)` undefined in `tokens.css`; also diff token names between `tokens.ts` and `tokens.css`) | `scripts/check-token-refs.mjs`, `ci.yml` | 30 min | **COMPLETED** | Prevents the entire bug class permanently |
| T0-3 | Fix letterbox CSS (`min(100vw, calc(100vh*16/9))` pattern) | `global.css:32–45` | 15 min | **COMPLETED** | Honors D-002 on all windows |
| T0-4 | Fix `<title>`/meta ("Persona Dossier" → game title + one-line pitch) | `index.html:6–7` | 5 min | **COMPLETED** | First impression |
| T0-5 | Implement title-screen keyboard navigation (arrows + Enter + Tab) | `TitleScreen.tsx` | 30 min | **COMPLETED** | Honors GDD §3 |
| T0-6 | De-magic the numbers: road width/position, beacon reference, `225` countdown → `gameConfig.ts` | `Renderer.ts`, `GameLoop.ts`, `DawnTracker.tsx` | 30 min | **COMPLETED** | Single-source config compliance |
| T0-7 | Replace ☀️/🔒 emoji with tokenized inline SVG glyphs | `DawnTracker.tsx`, `TacticalArmamentDock.tsx` | 30 min | **COMPLETED** | Consistency |
| T0-8 | Decide `EnemySprites.ts` fate: move to the B branch or `staging/`; eliminate dead code from `src/` | `src/game/rendering/EnemySprites.ts` | 10 min | **COMPLETED** | Integrity |
| T0-9 | CRT default 0.12 → 0.06; cap slider at 0.20 with subtle 1-2px lines | `GameScreen.tsx`, `PauseModal.tsx` | 10 min | **COMPLETED** | Readability + player control |
| T0-10 | CI: assert gzip budget after build (`scripts/check-bundle-budget.mjs` ≤ 350 KB) | `ci.yml`, `scripts/check-bundle-budget.mjs` | 20 min | **COMPLETED** | Makes the named budget real (71.5 KB) |
| T0-11 | Bark fidelity: "I do not write" → "I don't write" (canonical `CHARACTERS.md:163`) | `en.ts:102` | 2 min | **COMPLETED** | Story discipline |
| T0-12 | Write the one-page visual constant sheet (amber/green budgets, lighting tokens) | `PREPRODUCTION.md` §6 | 1 h | **COMPLETED** | Anti-drift for all later art |

### Tier 1 — Foundations to fold into Milestone B (total ≈ 4–5 days alongside B's own scope)

| ID | Action | Effort | Status | Why now / Resolution |
|---|---|---|---|---|
| F-1 | **Offscreen ground cache** — render `drawGround()` once to a 3200×2400 offscreen canvas at boot; direct screen-space 1:1 hardware blit; cache radial gradients in `LightingPass` | 0.5 d | **COMPLETED** | Eliminates ~1,900 static draw calls/frame; 0 sub-pixel seams. |
| F-2 | **Darkness/light-composite pass**: ambient darkness buffer, soft-edged 3-node lantern, beacon/flower punching, zero-GC dynamic light pool, pause density slider & reduced motion | 1–2 d | **COMPLETED** | 4-part architecture in `LightingPass.ts`, live settings in `PauseModal.tsx`. |
| F-3 | **Field densification**: seeded scatter (228 items), 32 flower colonies with breathing pulse, 2 hero landmarks (Glasshouse & Cold-Frames) in boot cache | 1 d | **COMPLETED** | Rich botanical sci-fi landscape; 0 per-frame draw call cost for scatter/landmarks. |
| F-4 | **Mira value lift + animation**: raised coat mid-tone (`#16465a`), 1 px cyan rim-light, 4-frame stride cycle + breathing bob in `CharacterSprites.ts` | 1 d | **COMPLETED** | Clear player contrast and lively stride animation across all facings. |
| F-5 | **Interpolation: implement or defer** — store prev-tick positions, pass accumulator `alpha` to `render()`; or amend D-003 to "deferred to C" | 0.5 d | **DEFERRED** | Formally deferred to Milestone B/C. |
| F-6 | **Audio foundation**: master gain + compressor, suspend/resume, shot/hit/pickup from S4 recipes, 2-osc drone + wind bed | 1 d | **PENDING** | Scheduled to land with Milestone B SFX suite. |
| F-7 | **Accent split**: `amberMuted` (props/UI) vs `dangerAmberBright` (threats); desaturate harvester/brass usages | 0.5 d | **COMPLETED** | `amberMuted` added to tokens; neutral props desaturated. |
| F-8 | **Wire HUD to real state** as B lands health/enemies (health, defeated count, later XP) | (with B) | **PENDING** | Scheduled to land alongside Milestone B combat simulation. |

### Tier 2 — Stays with its owning milestone (do NOT pull forward)

| Item | Owner milestone | Note |
|---|---|---|
| Old Core pylon prop + growth-stage silhouettes; bloom-glow surge warning; night labels | **D2** | Story props per `STORY_BIBLE.md` §9; sketch stage 0–4 silhouettes early (1 h) but build in D2 |
| Water margins / quiet-water dark patch | **E1 (Ch3)** | Lighting variant + token set |
| Gust lanes, weather overlays, chapter lighting variants | **E1** | Profile-C budget applies |
| Thornrunner/Rustwing/Briarheart sprite *polish* passes | **E1/E2** | B ships them functional-first from one chosen lineage (§5.2 #1) |
| Layered portraits for Sela/Tavi/Idris; portrait emotion polish | **F1** | `VectorPortrait.tsx` is a good base — freeze it now |
| Volume settings, key rebinding, full keyboard flow, Playwright | **F2** | T0-5 covers only the title screen stopgap |
| Self-hosted fonts + `CREDITS.md` + relative-base packaging | **F2/F3** | F3 runs network-blocked E2E |
| Field Ledger screen, barks in gameplay, scoring/results | **D1/D2** | Dossier components stay frozen |

---

## 8. Specific, Actionable Improvement Steps

### 8.1 Letterbox that actually letterboxes (T0-3)

`global.css:32–45` — explicit `width/height` + `max-*` clamps defeat `aspect-ratio` (verified: 1024×768 → 1024×720). Replace the sizing block with:

```css
.viewport-frame {
  width:  min(100vw, calc(100vh * 16 / 9));
  height: min(100vh, calc(100vw * 9 / 16));
  /* keep: position, overflow, flex, background, border, box-shadow */
}
```

Acceptance: at 1024×768 the frame is 1024×576 centered with symmetric letterbox bars; canvas backing store unchanged (1280×720 × DPR); `GameScreen` overlays align because they are positioned relative to the frame.

### 8.2 Darkness-composite light pass (F-2)

New `src/game/rendering/LightPass.ts` (or extend `LightingPass.ts`):

1. **Boot:** create `lightCanvas` at viewport size × DPR (recreate in `resize()`).
2. **Per frame:**
   - `lctx.globalCompositeOperation = 'source-over'`; fill with new token `ambientDarkness` (start `rgba(4, 10, 16, 0.55)`, tune by eye against grayscale checks).
   - `lctx.globalCompositeOperation = 'destination-out'`; draw radial gradients (white core → transparent) at: lantern (radius ≈ 200, centered on the *beam direction* with a soft cosine falloff instead of a hard arc — implement the cone as 3 overlapping circles of decreasing radius/alpha along the facing vector, which kills the wedge edge), beacon pulse (existing radius math), each flower patch (radius ≈ patch radius), Mira's foot pool (≈46).
   - Main canvas: `ctx.drawImage(lightCanvas, …)` **inside** the camera transform for world lights, and screen-space for the vignette as today.
3. **Rules encoded:** enemy shots and telegraphs (from B) get their own `destination-out` holes — write the hook now, even if unused (`registerLight(x, y, r, intensity)` array cleared each frame).
4. **Budget:** one fullscreen fill + ~10–30 gradient holes ≈ profile-C fill cost, already validated at 60 FPS (S1). Cache all gradient objects; recreate only on resize.
5. **Accessibility:** reduced-motion mode = monotonic fades, no flicker (`PREPRODUCTION.md` §5); high-contrast mode lowers `ambientDarkness` alpha (add to the F2 settings milestone, note it in the sheet).

Acceptance: in grayscale, Mira's lantern pool, the beacon, and flower patches are the brightest ground regions; cone shows no hard edge; 60 FPS unchanged on the reference machine.

### 8.3 Seeded field densification (F-3)

1. In `gameConfig.ts`: add `map.scatter = { seed: 20261021, cellPx: 180, acceptRate: 0.55, tuftCount: … , valuePatchCount: … }` and `flowerPatchCount: 30`.
2. At boot (rendering layer, not sim): iterate a jittered grid over the map, draw a random value from `SeededRNG` (existing class) to accept/skip and to pick variant/mirror/rotation. Emit static items into the **ground cache** (F-1) — scatter must cost zero per-frame draw calls. Living flowers stay as animated sprites but go from 10 → ~30 instances with per-patch transforms.
3. Landmarks: one collapsed glasshouse frame (open rectangle + a few broken panes, ~300×200 px silhouette, east of the road), one seed-bed hoop grid (6–8 low arcs, west). Both from existing token families (`concreteRim`, `glassFrame`, `metalTrim`).
4. Validate against style rule 5: new background elements ≤ ~8% luminance delta from base soil; check in grayscale.

Acceptance: any random 1280×720 crop of the map contains ≥ 3 background features and ≥ 1 flower cluster; walking 10 s in any direction never reaches a featureless screen (test by teleport-sampling 20 random positions via the dev tools once they exist, or by eyeballing 8 screenshots).

### 8.4 Mira value lift (F-4)

- `tokens.ts`: `portraitJacketMid: '#102e3b' → '#16465a'` (one step up, same hue family); optionally `portraitJacketDark: '#081820' → '#0b2330'`.
- `CharacterSprites.ts`: after torso fill, stroke a 1 px `playerLamp` @ 0.5 alpha along the lantern-side edge (down: left shoulder arc; side: forward edge; up: skip — the rucksack silhouette already separates).
- `SpriteFactory.ts`: generate 4 stride frames per facing by extending the `step` parameter (leg/arm/coat offsets are already parameterized — add `step` 0/1/2/3 with offsets `[−5, 0, 5, 0]`-style cycles), plus 1 idle variant with lamp sway.
- Acceptance: Mira identifiable in grayscale at 1× with the beam disabled (temporarily comment out the cone) — the test S2 should have included for the *production* map.

### 8.5 Title keyboard navigation (T0-5)

`TitleScreen.tsx`: add `focusedIdx` state (default 0), a `useEffect` key listener: ↑/↓ (and Tab/Shift+Tab) move focus, Enter activates, Esc does nothing. Render focus with the same styles as `isHovered` (plus the existing `:focus-visible` outline once T0-1 fixes the token). ≈ 25 lines; matches GDD §3 and retires the lying hints honestly.

### 8.6 Token reference guard (T0-2)

New `scripts/check-token-refs.mjs`: scan `src/**/*.{ts,tsx,css}` for `var(--[a-z0-9-]+)`; fail if the name is not defined in `tokens.css`. Second check: extract the TS token color names from `tokens.ts` and the CSS custom properties from `tokens.css`, and warn on names present in one but missing from the other (the `--color-danger-amber-*` family shows why). Wire into `npm run lint` chain and `ci.yml`. This is the guard that would have caught both live bugs.

---

## 9. Suggested Development Order (aligned with the roadmap)

The roadmap's phase-gating is the project's best asset (risk R6). The order below preserves it — quick wins are *fixes*, not features; foundations ride inside B's own rendering scope.

| Step | Work | Maps to |
|---|---|---|
| 1 | Tier 0 quick wins (T0-1 … T0-12) as one small commit batch | — |
| 2 | **Milestone B core** as scoped in the roadmap: Seedling entity + chase, safe spawn, spatial hash, contact damage + i-frames, Signal Flare auto-attack, glow-seed drops + magnet drift, unit tests. Choose ONE enemy sprite lineage (from §5.2 #1) and wire it into the atlas | Milestone B |
| 3 | **During B's render work, in this order:** F-1 ground cache → F-2 light pass → F-3 densification → F-4 Mira lift → F-5 interpolation decision. Each is 0.5–2 d and touches the same files B touches; doing them together avoids re-touching `Renderer.ts` five times | Milestone B (visual foundations) |
| 4 | F-6 audio foundation + B's shot/hit/pickup SFX per the S4 recipes; F-7 accent split lands before the first enemy renders | Milestone B |
| 5 | Run the review prompt (`spec/Project Roadmap and Milestones.md` §3.1) + grayscale/color-blind checks on the *production* field; playtest B | Gate |
| 6 | Approve → **Milestone C** (XP/cards/pulse) — no new visual systems; reuse F-2 hooks for card-dim (level-up pauses sim; consider lowering `ambientDarkness` under the card modal for focus) | Milestone C |
| 7 | **D1/D2** — chapter dressing, Old Core stage 0, bloom-glow warning hook (extend the existing flower pulse), Ledger | Milestones D1/D2 |
| 8 | **E1–E3** — chapter lighting/weather variants = new token sets + light-hole params, not new systems | Milestones E |
| 9 | **F1/F2/F3** — portraits, full settings, self-hosted fonts, budgets, Playwright | Milestones F |

**Explicitly deferred (do not build now):** weather particles beyond the existing motes; water margins; boss visuals; portrait pipeline expansion; Ledger UI; volume settings UI; font self-hosting; Score Attack. All are owned by later milestones; pulling any forward is exactly the scope creep the Scope-Guard prompt exists to stop.

---

## 10. Longer-Term Opportunities for Visual Quality

These are *not* recommendations to act on now — they are the roadmap-aware horizon, kept here so early decisions don't foreclose them.

1. **Chapter lighting as data.** Once F-2 exists, each chapter's mood (Dusk → Moonless → Second Watch → Small Hours → Before Dawn, per `GDD.md` §6) becomes a token set: `ambientDarkness` alpha, lantern tint/radius, flower glow intensity, fog/spore density. The E1 milestone then costs a config file per chapter, not renderer surgery. This is the single biggest reason to build F-2 early.
2. **The Old Core → Stormroot silhouette ladder.** The beacon sprite is already the right DNA (octagon, coils, spire). Sketching its five degradation stages (thorn creepage → partial overgrowth → full Stormroot ≈ 220 px asymmetric tangle per the style tile) early means every chapter's story prop is a variant of one recipe — and the final boss reads as *this place, overgrown*, which is the entire thematic point of `STORY_BIBLE.md` §2.2.
3. **Bloom-glow surge warning** (D2): the flower pulse (`Renderer.ts:174`) is the hook — a global intensity multiplier driven by chapter data (`warningLeadSec`) turns decoration into a readable gameplay telegraph, exactly the "nightbloom as barometer" fantasy. Remember the non-color cues (HUD icon + sound) required by `GDD.md` §7.
4. **Weather with restraint.** The existing 36 spores could gain 2 depth layers (near/far parallax + size/alpha variance) cheaply; gust lanes (E1) want a hatched lane telegraph per the style rules. Both fit inside the S1 profile-C budget; both should wait for E1.
5. **Portrait pipeline (F1).** `VectorPortrait.tsx` already parameterizes emotion; generalizing it (hair/clothing palettes per character, same bone structure) gives 4 characters × 3 states from one component. Freeze it until then.
6. **Diegetic frame vs. CRT.** Long-term, consider replacing scanlines with a subtle grain + corner-instrument frame (matching the dossier's reticle language) — it fits "botanical field science" better and ages better.
7. **Store-grade capture path.** The F3 checklist needs a GIF + 5 screenshots. A dev-mode "hide HUD" toggle (F1 dev tools spec already includes overlay gating) makes capture trivial later. Cost now: one `if` statement; benefit at F3: marketing assets that aren't screenshots of dev overlays.

---

## 11. Practical Checklist

### Fix now (Tier 0)
- [x] `VectorPortrait.tsx:17` — replace undefined `--color-danger-amber` with `--color-danger-amber-bright`
- [x] `global.css:83` — replace undefined `--color-signal-cyan-bright` with `--color-player-lamp`
- [x] Add `scripts/check-token-refs.mjs` guard + wire into CI (verifies 120 tokens across CSS & TS)
- [x] `global.css:32–45` — aspect-safe letterbox (`min(100vw, calc(100vh*16/9))` pattern preserves 16:9 on all viewports)
- [x] `index.html` — real `<title>`/meta ("NIGHTBLOOM: The Last Signal")
- [x] Title screen keyboard nav (Arrow Up/Down, Enter, Tab, visual selection feedback)
- [x] Move `225` countdown + road geometry into `gameConfig.ts`; delete the duplicate in `DawnTracker.tsx`
- [x] Replace ☀️/🔒 emoji with inline tokenized SVG glyphs
- [x] Decide `EnemySprites.ts` fate (moved to `staging/` off `main` to eliminate dead code)
- [x] CRT default 0.06 / cap 0.20 with subtle 1-2px scanline texture
- [x] CI asserts gzip ≤ budget (`scripts/check-bundle-budget.mjs` enforces ≤ 350 KB, currently 71.55 KB)
- [x] `en.ts:102` — match canonical bark wording ("I don't write. The radio transmits.")
- [x] Write the one-page visual constant sheet (amber/green budgets, lighting tokens in `PREPRODUCTION.md` §6)

### With Milestone B (Tier 1)
- [x] Offscreen ground cache + cached gradients (F-1) (GroundRenderer 3200×2400 boot cache, direct screen 1:1 blit, cached radial gradients in LightingPass)
- [x] Darkness-composite light pass with soft lantern; hostile-light hook ready (F-2) (4-part LightingPass, soft cosine lantern, beacon/flower punching, zero-GC pool, pause density slider & reduced motion)
- [x] Seeded scatter + 30 flower patches + 2 landmarks + prop transform variance (F-3) (32 flower colonies, 228 scatter items, Glasshouse & Cold-Frames in boot cache)
- [x] Mira coat lift + rim light + 4-frame stride + idle variant (F-4) (`#16465a` coat, 1px rim highlight, 4-frame stride cycle)
- [ ] Implement or formally defer D-003 interpolation (F-5) (Formally deferred to Milestone B/C)
- [ ] Audio: master bus/compressor, suspend/resume, first SFX set, ambient drone (F-6) (To land with Milestone B SFX suite)
- [x] `amberMuted` vs `dangerAmberBright` accent split (F-7) (`amberMuted` added to tokens; neutral props desaturated)
- [ ] HUD reads real player state (F-8) (To land with Milestone B combat simulation)
- [ ] Seedling-vs-flora silhouette test on the production field (grayscale, 1×) (Milestone B playtest gate)
- [x] Reconcile spikes-on-main vs `PREPRODUCTION.md` §1.3 (Reconciled)

### Before end of D2
- [ ] Old Core stage-0 prop; bloom-glow surge warning hook with non-color cues
- [ ] Chapter-1 dressing pass against the visual constant sheet
- [ ] Playtest P2 builds never contain placeholder HUD data

### Before F1
- [ ] Portrait pipeline generalized from `VectorPortrait.tsx`
- [ ] Final procedural art pass per GDD asset list; one consistent lineage everywhere

### Before F2/F3
- [ ] Self-hosted fonts (woff2) + `CREDITS.md` entries
- [ ] Network-blocked E2E passes offline (no Google Fonts fetch)
- [ ] Volume/reduced-flash/high-contrast settings wired into the light pass
- [ ] Bundle budget assertion green in CI (from T0-10)

---

## Appendix A — Verification Log

| Check | Command / Method | Result |
|---|---|---|
| Clone | `git clone` @ `15baa9f` | OK, 2 commits, 438 tracked files (69 project + ~370 `.agents/`) |
| Typecheck | `npm run typecheck` | PASS, 0 errors |
| Anti-slop lint | `npm run lint` | PASS, 0 violations / 35 files |
| Color guard | `npm run lint:colors` | PASS, 0 hardcoded colors |
| Unit tests | `npm run test` | PASS, 5/5 (`rng.test.ts`) |
| Build | `npm run build` | PASS — 220.74 KB / 64.18 KB gzip |
| Runtime (headless Chromium) | title → start → move → edge → pause → quit-confirm → quit → dossier → worried-state → 1024×768 resize | All functional; 0 console errors |
| Movement | synthetic `KeyboardEvent` dispatch (automation limitation for native key events) | 8-way movement + camera follow verified |
| Aspect test | viewport 1024×768, measured `.viewport-frame` | `1024×720` (ratio 1.422) — distortion confirmed |
| Token cross-check | script comparing 64 used `var()` refs vs 100 definitions | 2 undefined refs confirmed |
| Dead code | grep for `EnemySprites` imports | 0 imports |
| Runtime CSS probe | `getComputedStyle` on worried-state portrait border | `rgb(248,250,252)` (white) — bug confirmed |

## Appendix B — Evidence Screenshot Index

Captured from the running game; stored outside the repo in `nightbloom_analysis_screenshots/`:

| File | Shows |
|---|---|
| `01_title.png` | Title screen at 1280×720 |
| `02_game_initial.png` | Field spawn: beacon plaza, road, harvester salience vs. Mira |
| `03/03b` | (Automation key-event probes; no movement — see Appendix A) |
| `03c_move_eval.png` | Mid-walk: lantern cone banding, side-facing sprite read |
| `05_map_edge.png` | SE map quadrant: field emptiness; beacon compass HUD |
| `06_pause.png` | Pause modal hierarchy |
| `07_quit_confirm.png` | Two-step quit |
| `08_dossier.png` / `09_dossier_worried.png` | Dossier; neutral vs worried (broken amber border) |
| `10_letterbox_1024x768.png` | 4:3 window — DOM adapts; canvas frame distorts (game screen) |
| `11/12_spike_s2*.png` | S2 spike: full sprite roster, mock field, contrast audit table |
| `13_spike_s3.png` | S3 feel prototype (mechanics-only, circles) |

## Appendix C — Finding → File:Line Quick Index

| Finding | Location |
|---|---|
| Per-frame ground redraw | `src/game/rendering/Renderer.ts:80–161` |
| Hard-edged lantern cones | `src/game/rendering/LightingPass.ts:6–43` |
| Gradient allocation per frame | `src/game/rendering/LightingPass.ts:13,25,37,48` |
| Flower atlas repetition (`idx % 3`) | `src/game/rendering/Renderer.ts:170` |
| Mira low-contrast coat tokens | `src/content/theme/tokens.ts:61–63` |
| Harvester amber salience | `src/game/rendering/PropSprites.ts:84–112` |
| Dead enemy sprites | `src/game/rendering/EnemySprites.ts` (whole file) |
| Hardcoded road geometry | `src/game/rendering/Renderer.ts:114–116,133` |
| Hardcoded 225 countdown (sim) | `src/game/core/GameLoop.ts:146` |
| Hardcoded 225 countdown (UI) | `src/ui/components/DawnTracker.tsx:21` |
| Placeholder HUD snapshot | `src/game/core/GameLoop.ts:148–162` |
| Broken token (worried border) | `src/ui/components/VectorPortrait.tsx:17` |
| Broken token (focus outline) | `src/styles/global.css:83` |
| Letterbox squash | `src/styles/global.css:32–45` |
| Lying menu hints | `src/ui/screens/TitleScreen.tsx:185` |
| Emoji glyphs | `src/ui/components/DawnTracker.tsx:88`, `TacticalArmamentDock.tsx:122` |
| CRT default intensity | `src/ui/screens/GameScreen.tsx:41` |
| External font dependency | `index.html:8–10` |
| Page title leftover | `index.html:6–7` |
| Unused SeededRNG | `src/game/core/rng.ts` (only test imports it) |
| CI budget not asserted | `.github/workflows/ci.yml:47–48` |
| Bark wording drift | `src/content/locales/en.ts:102` vs `CHARACTERS.md:163` |
| Sim-purity lint ready but dir absent | `scripts/lint-codebase.mjs:67` (`src/game/simulation/` lands in B) |

# NIGHTBLOOM: The Last Signal — Art Bible

**Status:** v1.0 production contract, pre-Milestone B. PB-6/PB-7 shell and accessibility implementation is in review; PB-8 has not started.
**Authority:** `GDD.md` §7; `spec/Technical Design Document (TDD).md` §1.3 and §5; `spec/UX Specification and UI Design System.md` §5–6; `STORY_BIBLE.md` §9; `CHARACTERS.md` §3–4 and §8. If this document conflicts with those, they win.
**Companion:** `docs/ASSET_MANIFEST.md`.
**Scope:** every v1 world sprite, entity, VFX, telegraph, environment, icon, portrait and panel. Audio is out of scope for visual style rules; it is inventoried in the companion manifest.

**How to use this document**

- It is a gate, not a mood board. Every new recipe must name the rule it satisfies.
- An asset is not approved because it looks good zoomed in. It is approved only after the gates in §14 pass at 1×, on the production ground, in the dark.
- When a rule is wrong, change the rule here first, then the art. Do not let a drifted asset become the new reference.
- Rule IDs (`AB-*`) are stable. Cite them in the asset manifest and in review notes.

---

## 1. Technical frame

| Item | Contract |
|---|---|
| Renderer | HTML5 Canvas 2D. No WebGL, no external game engine, no p5.js. |
| Logical viewport | 1280×720, 16:9, uniform letterbox/pillarbox. |
| Device pixel ratio | Capped at 2.0 via `Math.min(devicePixelRatio, 2.0)`, with a fallback of 1. |
| Map | 3200×2400 px, camera follow time constant 0.12 s, clamped to map bounds. |
| Asset source | 100% code-drawn at boot. No raster textures, no image generation, no external art files. |
| Atlas | Offscreen buffers cached by `SpriteFactory`. Current buffers are 1× logical; target is a 2× backing store with logical-size metadata (§17). |
| Colors | `ThemeTokens` only. Zero hex/rgba in recipes. `npm run lint:colors` must pass. |
| Randomness | `SeededRNG` only. No `Math.random`, `Date.now` or `performance.now` in generation or simulation. |
| Time | Fixed 60 Hz tick. Visual time derives from tick/timeSec, not wall clock. |
| Draw order | Ground → flowers → props → entities → telegraphs and hostile shots → glow/light → weather → HUD (TDD §5.3 rule 4). |
| UI | 48×48 logical px minimum hit targets (38.4 physical at the 0.8 desktop stage), safe-area insets, 4.5:1 text contrast, 3:1 gameplay contrast. |
| File discipline | ≤300 lines per file. Pure generators separate from Canvas drawers. |
| Platform | Desktop web v1; vectors, pivots and touch targets must survive a React Native/Capacitor port. |

**AB-00-01:** No visual feature may require a new runtime dependency. Noise, L-systems, flow fields and particle pools are implemented in-project.
**AB-00-02:** No art decision may violate simulation purity. Generation lives in `src/game/rendering/` or a pure sibling module, never in `src/game/simulation/`.
**AB-00-03:** Art is not a final pass. Each milestone ships its own art at the §14 gates. Milestone F1 replaces remaining placeholders; it does not introduce the style for the first time.

---

## 2. Visual thesis

NIGHTBLOOM is a working field at night, lit by the signals that keep it alive. The identity is **twilight botanical science fiction**: deep blue-green darkness, luminous nightbloom, rusted nursery machinery, and precise cyan/amber light. It is not dark fantasy, not neon cyberpunk, and not cute plants.

The visual tension is between soft living things and hard damaged machines; between a signal that nourishes and a signal that echoes.

**AB-VT-01:** The field is a place, not a backdrop. It has furrows, a road, glasshouses, cold frames, harvesters, water margins and a history.
**AB-VT-02:** The nightbloom is a barometer, not a monster. It is friendly, soft and mint/cyan; it brightens before a surge. It never grows teeth.
**AB-VT-03:** The Old Core is the story in object form: a working machine slowly becoming an organism. It is not the beacon, and it is not a tree.

---

## 3. Shape grammar

| Family | Primary shapes | Edge treatment | Core / accent | Motion character |
|---|---|---|---|---|
| **Friendly life** (Mira, nightbloom, glow-seed, Wren) | Circles, rounded petals, radial clusters, soft appendages | Clean vector, no dark silhouette outline, no serration; internal stem/vein lines allowed | Cyan lamp or mint halo | Breathing, drifting, precise |
| **Hostile life** (Seedling, Bloomed Seedling, Thornrunner, Rustwing, Briarheart, Stormroot) | Wedges, points, serrated petals, asymmetric tangles | Dark outline, 1–2 px at 1×, hard tips | Amber core, never mint | Twitch, snap, heavy |
| **Neutral industrial** (beacon, Old Core stages 0–1, harvester, pylon, sensor, glasshouse) | Rectangles, hexagons, octagons, cables, rivets | Hard vector edges, thin metal trim | Muted amber or cyan indicator | Idle hum, rotor, sway |
| **Signal** (beacon light, Pulse, flare, UI active) | Concentric circles, arcs, hairlines, reticle brackets | Perfect geometry, thin strokes | Cyan/white | Pulse, expand, lock |
| **Storm** (weather, Stormroot) | Turbulent flow, asymmetric mass, layered tatters | Soft dark mass with hard amber/cyan cracks | Amber or red core | Surge, pull, churn |
| **UI** (field terminal) | Rectangles, 20 px grid, 1 px hairlines, corner brackets | Crisp, no organic wobble | Cyan primary, mint success, amber warning, red danger | Restrained, 120–300 ms |

**AB-SH-01:** Hostile elements are pointed, dark-outlined and amber-cored. Friendly elements are soft, rounded and cyan/mint. A hostile shape is never reused for a pickup.
**AB-SH-02:** A friendly asset never receives a dark hostile-style silhouette outline or an amber core. An industrial asset is not hostile merely because it is rusty; thorns and an amber core make it hostile.
**AB-SH-03:** A silhouette must be identifiable in pure black at native size. If it needs color to be understood, it fails.
**AB-SH-04:** One dominant shape idea per asset. A Seedling is a bulb with petals; it is not also a spider.
**AB-SH-05:** Do not use a living artist's name as a style definition. Translate references into shape, value, palette, edge and motion rules.

---

## 4. Value and contrast

| Role | Target value band (HSL L) | Tokens / examples | Rule |
|---|---:|---|---|
| Ground base | 3–7% | `groundBase`, `soilFurrowDark` | Never above 10% |
| Ground detail | 5–12% | `groundSecondary`, `soilPatchLight`, furrows | ≤8% local delta from base |
| Props / landmarks | 10–25% | `concreteBase`, `rustPlateMid`, `glasshouseSteel` | Must read as midground, not entities |
| Flora body | 12–25% | `mossDense`, `floraPatch` | Glow may push to 60% |
| Friendly entity | 35–60% | Mira coat, cyan lamp | Lamp may reach 90% |
| Hostile body | 10–25% | `mossDense`, `rustPlateDark` | Dark outline 3–6% |
| Hostile core | 40–60% | `hostileCore`, `dangerAmberBright` | ≤5% of silhouette area |
| Telegraph | 35–60% + hatch | `dangerRing`, `dangerAmber` | Must read on ground |
| UI text | 90–100% | `textPrimary` | ≥4.5:1 against panel |
| Panels | 10–20% + alpha | `surfaceOverlay`, `surfaceCard` | Not pure black |

These are approximate **HSL lightness bands** (perceptual value), not WCAG luminance. The 3:1 and 4.5:1 gates in §14 are measured separately with relative luminance. The bands exist to keep ground, props, bodies and accents in separate value families; the token values are the starting points.

**AB-VL-01:** Grayscale first. Color is a second channel, never the first.
**AB-VL-02:** Gameplay-critical elements maintain ≥3:1 luminance contrast against the local ground in every chapter lighting state. UI text maintains ≥4.5:1. High-contrast mode targets ≥4.5:1 for gameplay.
**AB-VL-03:** Background motion stays ≤8% local value delta and ≤2 px high-frequency detail at 1×. The field must not shimmer.
**AB-VL-04:** Darkness is a value band, not a black sheet. The lighting pass may remove up to 62% ambient; gameplay-critical elements must still read in unlit, lantern, beacon and surge states.
**AB-VL-05:** Hostile shots and telegraphs punch through darkness through the light pool. Ordinary projectiles may be dimmed outside the lantern.
**AB-VL-06:** One bright thing per ~200 px of play space. If the beacon, a flower patch, an amber core and a telegraph compete in the same area, remove one.
**AB-VL-07:** Contact shadows are value anchors, not decoration. Grounded entities use a compact ellipse; flying entities use a smaller, softer offset ellipse.

---

## 5. Palette roles

| Role | Tokens | Allowed use | Forbidden use |
|---|---|---|---|
| **Cyan / signal** | `playerBody`, `playerLamp`, `flareTrail`, `signalCyanDim`, `signalCyanBright`, `signalCyanGlow`, `signalCyanGhost`, `signalCyanTransparent`, `beaconGlowInner`, `beaconGlowOuter`, `lanternBeamBroad`, `lanternBeamCore`, `lanternBeamFoot`, `lanternBeamFaint`, `lanternBeamCoreFade` | Mira, friendly shots, beacon, Pulse, UI active, friendly rim light | Enemy bodies, XP, hostile cores |
| **Mint / life** | `seedCore`, `seedHalo`, `seedHaloGlow`, `seedGhost`, `seedTransparent` | XP, nightbloom, healing, Bloomguard, friendly pickups | Hostile cores, enemy shot cores |
| **Amber / hostility** | `hostileCore`, `dangerAmber`, `dangerAmberBright`, `dangerAmberGlow`, `dangerAmberGhost` | Hostile cores, enemy shots, boss weak point, telegraph accents | Friendly highlights, primary UI, generic machinery |
| **Muted amber / industrial** | `amberMuted`, `rustPlateDark`, `rustPlateMid`, `rustPlateLight`, `machineryBronze` | Old Core stages 0–2, harvesters, pylons, UI insignia | Danger telegraphs, hostile weak points |
| **Red / danger** | `dangerRing`, `dangerRedGhost`, `healthGaugeFill`, `healthGaugeTrack` | Telegraphs, health, low-HP pulses, danger borders | Decoration, friendly highlights |
| **Moss / flora** | `floraPatch`, `mossDense`, `mossFringe`, `strawStubble` | Flora bodies, ground cover, nightbloom | Hostile body lacking points, outline or amber core |
| **Neutral / industrial** | `concreteBase`, `concreteRim`, `concreteCrack`, `metalTrim`, `metalRivets`, `cableBlack`, `glassCabin`, `glassFrame`, `glasshousePane`, `coldFramePlastic` | Structures, outlines, shadows, glass | Large areas of pure black |
| **White / specular** | `textPrimary`, `portraitEyeHighlight` | Specular highlights, text, 60 ms hit flash | Large fills |

**AB-PL-01:** No new hex. Add a semantic token first, then use it.
**AB-PL-02:** Maximum three accent families per asset. Hostile amber covers ≤5% of a hostile silhouette. Cyan covers ≤10% of the screen; mint ≤5%.
**AB-PL-03:** Do not gradient between unrelated roles (mint → amber, cyan → red). Use a neutral bridge or a hard edge.
**AB-PL-04:** Every accent decision must survive grayscale and the three colorblind matrices.
**AB-PL-05:** The staging Seedling violates this section: it uses `floraPatch` as the body and `seedCore` as the petal stroke. Before wiring, change to `mossDense` body, `cableBlack`/`metalTrim` outline, `hostileCore` core, and `dangerAmberBright` telegraph. No `seedCore`/`seedHalo` on a hostile.

---

## 6. Light

- **Global ambient:** cool top-left, `ambientTwilightDarkness` at 0.62. No directional cast shadows beyond contact.
- **Key hierarchy:** beacon (cyan, 280–310 px) → Mira lamp (cyan, 180 px) → nightbloom (mint, 60–120 px) → hostile cores (amber, 20–40 px, local only) → UI emissive.
- **Rim light:** friendly entities only, cyan, 1–2 px at 1×, from the beacon/lamp side. No rim on hostiles; their edge is a dark outline.
- **Contact shadow:** ellipse, offset +4 to +8 px y, alpha 0.45, no blur. Flying: offset +10 to +14 px y, alpha 0.3.
- **Hostile glow:** a core highlight, not a flashlight. It never floods the ground enough to wash out a telegraph.
- **Bloom warning:** nightbloom intensity rises monotonically over `warningLeadSec` (45 s start). No flashing. The Chapter 3 water-margin patch stays dark.
- **Reduced motion:** no pulsing, monotonic fades, static glow allowed, telegraph timing unchanged.

**AB-LT-01:** Light is screen-space and token-driven. Do not bake light into sprites.
**AB-LT-02:** The light pool is capped at 64 registered lights. Proposed priority policy (implement in B): telegraphs → boss/elite attacks → hostile shots within 200 px of Mira → pickups → ambient flora. Ordinary projectiles rely on their bright sprite.
**AB-LT-03:** The beacon and the Old Core are separate light sources with separate pulses. They may co-locate, but their glows must not merge into one blob.
**AB-LT-04:** No light or glow may hide a hostile shot or telegraph (TDD §5.3 rule 4).

---

## 7. Silhouette specification

Native silhouette sizes follow TDD §5.2; Old Core sizes are initial art targets until the D2 spike. Buffer sizes may be larger for shadow/glow padding; a larger buffer is not permission to draw a larger silhouette.

| Asset | Native silhouette | Must read at 1× | Forbidden merge | Color + shape cue | States |
|---|---|---|---|---|---|
| **Mira** | 40 px tall | Shoulder lamp, head, coat hem, facing | Nightbloom cluster | Cyan lamp, human proportions, cyan rim, no dark outline | 3 facings × 4 stride; hit |
| **Seedling** | 28 px | Round bulb, 5 serrated petals, amber core | Nightbloom, stubble | Dark olive body, dark outline, amber core | Idle (closed), move (open), telegraph (wide), hit, death |
| **Bloomed Seedling** | 36 px | Seedling + outer 8-petal ring | Briarheart, nightbloom | Amber ring, double petal count, larger core | Idle, move, telegraph, hit, death |
| **Thornrunner** | 26 × 20 px | Low wedge, 4 legs, dorsal spikes, dust | Soil clod, stubble | Horizontal wedge, rust spikes, amber eye | Move 2-frame, crouch telegraph, hit, death |
| **Rustwing** | 34 px | Cross chassis, 2 rotors, hover gap, amber lens | Pylon, drone-friendly silhouette | Rust body, rotor cross, amber lens | Hover 4-frame, aim, fire, hit, death |
| **Briarheart** | 72 px | Heavy hexagon, thorn ring, molten core | Harvester, Seedling scale-up | Dark bramble hex, amber core, ground ring | Idle, slam telegraph, slam, hit, death |
| **Stormroot** | ~220 px | Asymmetric tangle, exposed core, phase tint | Briarheart, generic tree | Dark mass, amber/red core, trapped mint bloom | Phase 1–3, 3 attacks, hit, death |
| **Nightbloom** | 48–96 px cluster | Rounded 5-petal blossoms, mint halo | Seedling, pickup | Mint/cyan, no outline, no amber | Idle breathe, warning brighten |
| **Glow-seed** | 10 px | Circle + halo + drift | Flower blossom | Mint halo, perfect circle | Idle, magnet |
| **Beacon** | 160 px | Octagon pad, coils, spire, cyan core | Old Core, pylon | Concrete + cyan, vertical | Idle, Pulse ring |
| **Old Core** | 140 px (stage 0) → ~220 px (stage 4/boss) | Octagon/coil/spire DNA + growth | Beacon, Stormroot alone | Rust + thorn + amber/cyan | 5 stages + boss |
| **Enemy shot** | 14 px | Pointed diamond, dark outline, amber core | Flare shot, pickup | Diamond, amber, dark edge | Travel |
| **Flare shot** | 12 × 6 px | Soft teardrop, cyan-white trail | Enemy shot | Teardrop, cyan, no dark outline | Travel |
| **Telegraph** | Variable | Hatched ground pattern + shrinking countdown | Ground texture, VFX | Red/amber + hatch + ring | Wind-up |

### Critical differentiation rules

1. **Seedling vs nightbloom.** Seedling: serrated outer petals, dark outline, amber core, inward-leaning posture. Nightbloom: rounded petals, no outline, mint core/halo, outward-facing cluster. At 1× the amber core must be ≥5 px and at least three petal points must be visible. If a player can mistake one for the other in grayscale, the Seedling fails.
2. **Bloomed Seedling vs Seedling.** Bloomed adds an outer 8-petal ring and an amber tint. It is not just a scaled-up Seedling.
3. **Thornrunner vs soil.** The wedge must sit above the furrow line, with four visible legs and a dust trail. If it reads as a clod, add leg rhythm and a brighter amber eye.
4. **Rustwing vs pylon.** The rotor cross and hover shadow must be visible. A vertical mast silhouette is forbidden.
5. **Briarheart vs harvester.** Organic hexagon + thorn ring, not rectilinear machinery. The harvester is rust and glass; the Briarheart is bramble and molten core.
6. **Stormroot vs Briarheart.** Stormroot is asymmetric, multi-core, and larger; it includes the Old Core's pad/coil/spire DNA. A bigger hexagon is not Stormroot.
7. **Mira vs flora.** Mira's cyan lamp and human silhouette must never be swallowed by a flower cluster. Keep a ≥8 px value gap around the lamp.
8. **Glow-seed vs blossom.** Glow-seed is a perfect circle with a halo and drift; it never has petals.
9. **Enemy shot vs flare.** Enemy shot is a pointed diamond with a dark outline and amber core; flare is a soft teardrop with a cyan trail. Shape first, color second.
10. **Old Core vs beacon.** The Old Core is a separate amplifier pylon next to the beacon. They share industrial DNA but never the same silhouette or pulse.

---

## 8. Enemy visual language

All enemies must have a visual and audio telegraph, a color token plus a shape/pattern cue, and a distinct silhouette. Difficulty rises through spawn rate, mix and modest stat changes, not just health inflation.

Gameplay timings follow GDD §5 and TDD §5.1. Animation frame rates and wind-up durations below are initial art targets unless they cite those sections; tune them in the milestone spike and record the approved values in config.

### 8.1 Seedling

- **Origin:** dormant spores woken by beacon light. Phototropic, drifts toward light, harmless alone.
- **Silhouette:** round bulb with five serrated petals and a visible amber spore core; 28 px native.
- **Anatomy layers:** contact shadow → root nub → bulb body (`mossDense`) → five serrated petals (`mossDense`, `cableBlack` outline) → amber core (`hostileCore`) → 1 px specular.
- **Animation:** idle petals closed, move petals open 1.0→1.25, telegraph petals wide + core bright, hit 60 ms white flash, death 150 ms pop.
- **Telegraph:** petals open wide and the amber core brightens for a short wind-up (~400 ms art target) before contact.
- **Palette:** `mossDense` body, `cableBlack`/`metalTrim` outline, `hostileCore` core, `dangerAmberBright` telegraph. No `seedCore` or `seedHalo`.
- **Do:** dark olive, pointed petal tips, amber core, inward lean.
- **Don't:** round-only petals, mint stroke, friendly halo, nightbloom palette.

### 8.2 Bloomed Seedling

- **Origin:** same spore, better fed. Late Chapter 1 variant; HP ×2.2, speed ×1.15.
- **Silhouette:** 36 px; Seedling plus an outer 8-petal ring; larger amber core.
- **Anatomy layers:** Seedling base → outer ring (`rustPlateMid` with `dangerAmberBright` edge) → amber core emitter.
- **Animation:** heavier idle, wider telegraph, more seeds on death.
- **Telegraph:** outer ring flares and core pulses; longer wind-up than Seedling.
- **Palette:** `rustPlateMid` ring, `dangerAmberBright` edge, `hostileCore` core.
- **Do:** double petal count, amber ring, larger core.
- **Don't:** just scale the Seedling; don't use mint.

### 8.3 Thornrunner

- **Origin:** thorn growth riding the wind front. Skittish pack animal, darts and cuts routes.
- **Silhouette:** 26 × 20 px; low angular wedge with four legs and a dorsal thorn crest.
- **Anatomy layers:** dust trail → four chitin legs → wedge carapace (`floraPatch`/`mossDense`) → dorsal spikes (`rustPlateLight`) → amber eye.
- **Animation:** 2-frame scuttle at 12 fps; short crouch before a dash; dust trail on movement.
- **Telegraph:** crouch + dust puff + eye flare.
- **Palette:** dark thorn green body, rust spikes, amber eye. No cyan, no mint.
- **Do:** horizontal wedge, visible legs, dust.
- **Don't:** vertical flower, round body, no legs.

### 8.4 Rustwing

- **Origin:** farm-machine scrap animated by wind. Hovers, aims, fires slow scrap.
- **Silhouette:** 34 px; cross chassis with two rotors, a tilted hover shadow and an amber ventral lens.
- **Anatomy layers:** hover shadow → rotor booms → central pod (`rustPlateMid`) → rotor blades (`concreteRim`) → amber lens (`hostileCore`) → 1 px specular.
- **Animation:** 4-frame rotor at 20 fps (art target); short aim pause (art target, aligned with the 2.4 s firing cadence); rotor flare before firing.
- **Telegraph:** rotor flare + lens brighten + a short hover stall.
- **Palette:** rust body, `metalTrim` hubs, amber lens. No cyan.
- **Do:** rotor cross, hover gap, amber lens.
- **Don't:** bird shape, pylon mast, friendly drone silhouette.

### 8.5 Briarheart

- **Origin:** thorn mass grown around a dead tractor engine. Patient, heavy, punishes greed.
- **Silhouette:** 72 px; heavy hexagon with a thorn ring and a molten core.
- **Anatomy layers:** large contact shadow → stub legs → hex bramble body (`rustPlateDark`/`mossDense`) → thorn armor ring (`groundElevated` + `dangerAmberGhost`) → molten core (`dangerAmberBright` → `hostileCore` → `rustPlateDark`).
- **Animation:** slow idle; 1.1 s ground-ring wind-up; heavy slam; 600 ms recovery.
- **Telegraph:** a hatched ground ring with a shrinking countdown ring; last 150 ms brightens.
- **Palette:** dark bramble, rust plates, amber molten core. No mint.
- **Do:** massive, patient, ground ring, molten core.
- **Don't:** harvester with a gun; Seedling scaled up; symmetrical flower.

### 8.6 Stormroot

- **Origin:** the Old Core, thorn growth and nightbloom tangled around the ring. A feedback loop with a body.
- **Silhouette:** ~220 px; asymmetric tangle around a visible core; phase-tinted.
- **Anatomy layers:** Old Core pad/coil/spire base → thorn tendrils → trapped nightbloom clusters → exposed core → phase aura.
- **Animation:** phase transition 1.2 s; Root Lash 1.0 s lines; Spore Ring 0.8 s charge; Gale Pull 1.2 s arrows; 2.5 s recovery (2.0 s in phase 3), core takes +25% damage.
- **Telegraphs:** ground lines (Root Lash), radial gaps (Spore Ring), wide wind arrows + audio swell (Gale Pull). Beacon Pulse cancels Gale Pull.
- **Phase colors:** P1 `hostileCore`; P2 `dangerAmberBright`; P3 `dangerRing`. Dark mass and trapped mint nightbloom are secondary accents, never the core.
- **Do:** same object as the Old Core, asymmetric, multiple tendrils, exposed core.
- **Don't:** symmetrical flower, generic tree, bigger Briarheart.

---

## 9. Old Core growth ladder

The Old Core is the amplifier pylon at the field's heart, next to the beacon. It is visible in every chapter and grows through five stages, then becomes Stormroot. It is not the beacon.

| Stage | Chapter / night | Silhouette | Tendrils (art target) | Glow (art target) | Scrap (art target) | Hum | Gameplay note |
|---|---|---|---:|---:|---:|---|---|
| **0** | Ch1 / Dusk | Inert metal pylon; octagon pad, coil stack, central spire | 0 | 0.15 | 0 | Faint low hum | Story clue; no threat |
| **1** | Ch2 / Moonless | Thorn tendrils around the base | 8 × 30 px | 0.25 | 0 | Low | First visible growth |
| **2** | Ch3 / Second Watch | Thorns climbing the mast; phosphorescent seams | 14 × 55 px | 0.45 | 0 | Pulsing | Barometer beat |
| **3** | Ch4 / Small Hours | Wrapped in scrap farm machinery; asymmetric | 20 × 75 px | 0.70 | 0.6 | Audible pulse | Relay pressure |
| **4** | Ch5 / Before Dawn | Massive overgrown tangle; nightbloom at base | 28+ × 95+ px | 1.00 | 0.9 | Violent pulse | Pre-boss |
| **Boss** | Ch5 Phase 4 | Stormroot: the same mass awakened, core exposed | 32+ | Phase | 1.0 | Harmonic rise | 3-phase boss |

Tendril counts, glow values, scrap ratios and stage sizes are **initial art targets** for the parameterized generator, not balance values. Tune them during the D2/E1 Old Core spike and record the approved values in `gameConfig`/`artConfig`. The canon requirements are the stage descriptions in TDD §5.4 and GDD §7; the numbers above exist to make the silhouette progression testable.

**AB-OC-01:** One parameterized object, five stages. Growth is additive: stage N keeps the pad, coils and spire of stage 0. Do not redesign the object per chapter.
**AB-OC-02:** Use a stable seed per stage. The silhouette must be identical across runs and reloads. No per-frame randomness.
**AB-OC-03:** Stage 0 is a working machine, not a ruin. The damage is a cracked damping coil, not generic rust.
**AB-OC-04:** Stage 4 must read as “this place, overgrown,” not as a new enemy. Stormroot is the same mass awakening.
**AB-OC-05:** Draw the Old Core dynamically; never bake it into the ground cache. It must grow, pulse and register a light.
**AB-OC-06:** The Old Core and beacon are separate objects. Their silhouettes must not merge into one tower.
**AB-OC-07:** Old Core stage sizes are initial art targets: stage 0 native ~140 px, stage 4 ~220 px. Buffer may be 280 px for tendril/glow padding. Confirm in the D2 spike.

---

## 10. Environment, flora, props and weather

### 10.1 Ground

- Furrows every 44 px, road 120 px wide at x = 1600, central plaza, soil value patches, stubble, stones, water margins.
- The ground is low-contrast by design. Detail is visible at working scale, not at thumbnail scale.
- No baked collision cues, no readable text, no UI-like marks.
- No high-frequency noise above 2 px at 1×. Use fBm/Worley patches at low amplitude.

### 10.2 Nightbloom

- 3 size classes (64/96/128 px buffers; native cluster ~48/72/96 px).
- Target 8 variants generated from a seeded L-system skeleton, with 5–9 blossoms and 5–7 petals.
- Friendly silhouette: round petals, no dark outline, no amber, mint/cyan halo.
- Idle breathe at 2.2 Hz, ±4% scale, ±2% alpha. Reduced motion: static.
- Bloom warning: intensity rises monotonically over `warningLeadSec`; no flashing. The Chapter 3 water-margin patch stays dark.
- The nightbloom is a barometer, not a cause. It never attacks, never grows teeth and never uses the hostile amber core.

### 10.3 Props and landmarks

| Asset | Buffer | Role | Palette | Rule |
|---|---|---|---|---|
| Harvester | 120×84 | Abandoned nursery combine | Rust plates, metal trim, glass | Rectilinear; no amber core |
| Relay pylon | 64×96 | Signal infrastructure | Metal, concrete, muted amber | Vertical; no hostile core |
| Soil sensor | 48×64 | Field telemetry | Metal, glass, muted amber | Small; no bright glow |
| Glasshouse | 220×140 | Collapsed nursery landmark | Steel, glass, vines | Silhouette anchor; no collision cues |
| Cold frames | 190×150 | Nursery beds | Plastic, soil, glass | Low, horizontal; no bright glow |

**AB-ENV-01:** Props use muted amber (`amberMuted`) or cyan indicators, never danger amber. A prop is not an enemy.
**AB-ENV-02:** Landmarks are composition anchors and story evidence. They must read as places, not as obstacles with painted warning stripes.
**AB-ENV-03:** Baked props/landmarks must be re-evaluated at DPR 2. If they blur, move them to the dynamic prop layer rather than accepting softness.

### 10.4 Water margins

- Shallow water is dark, reflective and low-contrast; no bright cyan sheet.
- Water edges use `waterMargin` plus a thin `concreteRim`/`mossFringe` line, not a glowing outline.
- In Chapter 3, the water-margin nightbloom patch stays dark even during a bloom warning.

### 10.5 Weather

- Two depth layers: far (small, dim, slow) and near (larger, brighter, faster).
- Use a precomputed coarse flow field; animate by offsetting the sample with timeSec. No per-particle noise.
- Storm surge ramps field strength and particle count over `warningLeadSec`, paired with bloom brightening and a non-color HUD cue.
- Weather is low-contrast and never obscures a telegraph or hostile shot.
- Reduced motion: fewer particles, no trails, monotonic fades.

---

## 11. VFX and telegraphs

### 11.1 Telegraph construction

| Telegraph | Shape | Hatch | Countdown | Color | Timing |
|---|---|---|---|---|---|
| Briarheart slam | Ground ring | 45° hatch, 4–6 px spacing | Inner ring shrinks | `dangerRing` + `dangerAmber` | 1.1 s |
| Root Lash | Ground lines from core | Parallel hatch | Line brightens | `dangerAmberBright` | 1.0 s |
| Spore Ring | Radial ring with gaps | Segment hatch | Charge glow | `hostileCore` | 0.8 s |
| Gust lane | Lane rectangle | Directional chevrons | Lane flashes | `dangerAmber` + wind streaks | Per chapter config |
| Generic wind-up | Ring or lane | Hatch | Shrinking ring | `dangerRing` | Config |

**AB-FX-01:** Telegraphs sit directly on the terrain, use hatched inner patterns, and display a shrinking countdown ring.
**AB-FX-02:** The last 150 ms brightens. The telegraph never relies on color alone; shape and motion carry it.
**AB-FX-03:** Telegraphs and hostile shots draw above entities and below glow/weather. No effect may hide them.
**AB-FX-04:** Hostile shots are pointed diamonds with a dark outline and amber core, at least 10 px and nominally 14 px. Friendly shots are soft teardrops with a cyan trail.

### 11.2 Combat feedback

| Event | Visual | Timing | Budget |
|---|---|---|---|
| Enemy hit | 60 ms white flash + 3–5 sparks + floating number | 60 ms | Numbers merge within 100 ms, max 40 on screen |
| Enemy death | 150 ms pop (1.0→1.3, fade) + 2–3 seeds | 150 ms | Max 64 death bursts |
| Pickup | 10 px glow-seed + halo + 6-segment magnet trail | 120→480 px/s inside 90 px | Max 128 trails |
| Beacon Pulse | 300 ms expanding ring + 4 px shake | 300 ms | Shake disabled in reduced motion |
| Level-up | Freeze + cards fade in 120 ms | 120 ms | No shake |
| Player hit | 80 ms flash + 8 Hz blink + 3 px shake/150 ms + 40 ms hit-stop | 80/150/40 ms | Reduced motion: 50% opacity, no blink |
| Surge warning | Nightbloom brightens over 45 s + HUD icon + low swell | 45 s | Monotonic; no flash |

**AB-FX-05:** Particle pools are pre-allocated and swap-removed. No allocation in the hot loop.
**AB-FX-06:** Batch draws by role into a single path where possible. Do not issue one draw call per spark.
**AB-FX-07:** Caps are config-driven: 256 sparks, 64 death bursts, 128 pickup trails, 64 ambient particles. Exceed the cap by dropping the oldest, never by allocating.
**AB-FX-08:** VFX live below telegraphs. Emissive glow may draw after the lighting pass only if it cannot obscure a telegraph or hostile shot.
**AB-FX-09:** No gore. Death is a botanical pop and seed scatter.

---

## 12. UI visual language

The UI is a **field terminal**: a repaired nursery instrument, not a military shooter HUD. It is precise, cool and legible, with botanical/industrial motifs (growth rings, coil diagrams, seed counters) rather than generic chevrons.

### 12.1 Foundations

- Panels: translucent dark surfaces (`surfaceOverlay`, `surfaceCard`), 1 px cyan hairlines (`panelBorder`), 8–12 px radii, no heavy drop shadows.
- Grid: 20 px tactical grid at ≤15% opacity; reticle brackets for framing, not decoration on every card.
- Typography: `Outfit` display, `Space Grotesk` alt, `JetBrains Mono` for numbers, timers and telemetry.
- Text: `textPrimary` for values, `textSecondary` for labels, `textMuted` for tertiary. 4.5:1 minimum. 48×48 logical px targets.
- Safe areas: respect `env(safe-area-inset-*)`; keep HUD out of the letterbox. On desktop, keep interactive HUD within 64 px horizontal and 36 px vertical logical safe margins. The full-width bottom XP rail is the only allowed non-interactive exception to that margin; keep it documented in the HUD spec.
- Stage: every screen is composed in the fixed 1280×720 logical box and scaled uniformly to the 16:9 frame. Do not let DOM panels reflow or scroll inside a smaller physical frame while the canvas scales independently.

### 12.2 Icons

- 24 px grid, 2 px stroke, round caps/joins, geometric construction.
- One metaphor per icon. Filled state only for active/selected; do not mix filled, outlined and painterly treatments.
- Canonical ability icons:
  - **Signal Flare:** teardrop + short trail.
  - **Beacon Pulse:** three concentric rings.
  - **Coil Arc:** arc + coil winding.
  - **Bloomguard:** petal ring/shield.
  - **Wren:** small drone cross + rotor.
- Current `AbilitySlots` uses only a generic pulse icon and a generic line icon. Replace with the canonical set before the ability UI is considered shippable.
- Icon labels and numbers are text, never baked into the icon.

**AB-UI-04:** Icons use a 24 px grid, 2 px stroke, round caps/joins, one metaphor each, and fill only for active/selected. Do not mix filled, outlined and painterly treatments.
**AB-UI-05:** All screens share one 1280×720 logical stage scaled uniformly to fit the frame. Fixed-size UI must never reflow, clip or grow an internal scrollbar because the physical frame shrank while the canvas scaled independently.
**AB-UI-06:** Every interactive control has a minimum 48×48 logical px hit envelope, a visible `:focus-visible` indicator, a labelled role, and state-aware Escape/back behaviour. Destructive confirmations default focus to the safe action, not the destructive one. At the 0.8 stage scale the physical target shrinks to 38.4 CSS px; 1280×720 is the authored desktop target, and a touch build must re-author controls rather than shrink this one.

### 12.3 Portraits

Layered vector parts, three states per character, no external art.

| Character | Silhouette / identity | Neutral | Worried | Relieved |
|---|---|---|---|---|
| **Mira** | High-collar field jacket, shoulder lamp, dark windswept hair | Level gaze | Brows drawn | Small smile |
| **Sela** | Glasses, tied-back hair, lab apron/coat | Thoughtful | Hand near mouth | Eyes closed, exhale |
| **Tavi** | Goggles, cropped hair, relay insignia, half-smirk | Goggles up | Goggles down | Broad grin |
| **Idris** | Convoy uniform, headset, weathered | Steady | Tense | Nod |

**AB-UI-01:** Portraits use the same light direction and palette roles as the world. Mira's lamp is cyan; Sela's accents are mint; Tavi's are muted amber; Idris's are neutral/cyan.
**AB-UI-02:** Portraits are identity anchors. Do not generate faces from noise or random geometry. Use layered vector parts and expression swaps only.
**AB-UI-03:** The current `VectorPortrait` renders only Mira. Sela, Tavi and Idris are missing; radio scenes must not show a Mira portrait for another speaker.

### 12.4 Panels and screens

- Required: title, chapter card, level-up, pause, settings, victory, defeat, Field Ledger, credits.
- Panels are code-native; no baked text, no mockup chrome, no screenshot backgrounds.
- Level-up cards use the ability/upgrade icon language; 48×48 logical px targets; keyboard focus visible.
- High-contrast mode replaces ambient fills with monochrome overrides and 4.5:1 outlines.
- Reduced motion disables slide-ins and decorative oscillation.

---

## 13. Motion

Motion is restrained for the field and snappy for threats. The world breathes; danger snaps.

| Element | Motion | Timing | Reduced motion |
|---|---|---|---|
| Mira stride | 4-frame walk cycle, 8 fps while moving | 125 ms/frame | Same pose timing; no bob |
| Mira idle | Frame 0; subtle lamp flicker only | — | Static lamp |
| Nightbloom | Breathe 2.2 Hz, ±4% scale, ±2% alpha | 455 ms cycle | Static |
| Seedling | Petals open/close, 2 frames | 120 ms | Static open state |
| Thornrunner | 2-frame scuttle, 12 fps | 83 ms/frame | Static pose |
| Rustwing | 4-frame rotor, 20 fps | 50 ms/frame | Static rotor |
| Briarheart | Idle 1 s; slam ring 1.1 s; recovery 600 ms | Config | Telegraph timing unchanged |
| Stormroot | Phase transition 1.2 s; attacks per GDD | Config | Telegraph timing unchanged |
| Beacon Pulse | Ring expands 300 ms | 300 ms | No shake; ring still visible |
| Bloom warning | Monotonic rise over 45 s | 45 s | Monotonic, no flash |
| UI cards | Fade/slide 120 ms | 120 ms | No slide |

Motion rates in this table are initial art targets unless they match TDD §5.1 (hit, death, pickup, player hit, Pulse, level-up, telegraph and surge). Gameplay timings are fixed by config; do not tune balance from this table.

**AB-MO-01:** Motion must not change silhouette identity, pivot or volume. Squash/stretch is allowed only within ±8% and never on hostile telegraphs.
**AB-MO-02:** No foot sliding. Stride rate follows movement speed; idle uses frame 0.
**AB-MO-03:** Reduced motion preserves all gameplay timing and removes decorative motion, shake, hit-stop, trails and blinking.
**AB-MO-04:** All timing values live in config, not in draw code.

---

## 14. Game-scale readability gates

An asset that fails any gate is not shippable, regardless of how good it looks zoomed in.

| ID | Gate | Method | Pass criterion |
|---|---|---|---|
| **AB-QA-01** | Native scale | 1280×720 at 1× | Silhouette identified in ≤250 ms by 3 of 3 testers |
| **AB-QA-02** | Grayscale | 0% saturation | Friendly / hostile / pickup / telegraph distinguishable |
| **AB-QA-03** | Colorblind | Deuteranopia, protanopia, tritanopia matrices | Shape cue carries the meaning; no information lost |
| **AB-QA-04** | Contrast | Relative luminance calculation | Gameplay ≥3:1; UI text ≥4.5:1; high contrast ≥4.5:1 |
| **AB-QA-05** | Production field | Real ground crop + 40 mixed enemies + 20 flora | No silhouette merges; Mira findable |
| **AB-QA-06** | DPR 2 | 2× backing store | Crisp edges; no 1× upscale blur; no shimmer |
| **AB-QA-07** | Darkness | Unlit, lantern, beacon, surge states | Hostile shots and telegraphs visible; ≥3:1 |
| **AB-QA-08** | Draw order | Frame capture | Telegraphs/hostile shots above entities; no VFX/weather obscures |
| **AB-QA-09** | Motion | 60 FPS capture | No foot sliding, jitter or pivot drift; reduced-motion pass |
| **AB-QA-10** | Performance | Profile B: 200 enemies, 300 projectiles, 150 pickups | ≥60 FPS; render ≤8 ms; no GC spikes |
| **AB-QA-11** | Tokens | `npm run lint:colors` | Zero hardcoded colors |
| **AB-QA-12** | Determinism | Same seed, two runs | Identical silhouettes and variant selection |
| **AB-QA-13** | File discipline | Line count / imports | ≤300 lines; pure generator separate from drawer |
| **AB-QA-14** | Accessibility | Keyboard + settings | 48 logical px targets, visible focus, no color-only cue |
| **AB-QA-16** | Stage scaling | 1280×720, 1024×768 and 1920×1080 screenshot and DOM metrics | No clipping or unintended scrollbar; 64/36 safe area holds for interactive HUD (XP rail documented exception); canvas and DOM scale together |
| **AB-QA-17** | Opening frame | Spawn capture at 1280×720, colour, grayscale and 50% brightness | ≥1 readable hero landmark not occluded by HUD panels; ≥1 prop and ≥1 flower; Mira silhouette/rim ≥3:1; lantern reveals a midground feature |

**AB-QA-15:** The QA harness must render the production atlas, not a separate spike atlas. A spike can approve a direction; it cannot approve a shipping asset.

**PB-6/PB-7 evidence (2026-10-20):** AB-QA-16 passes informally at 1280×720, 1024×768 and 1920×1080 for the shell: no clipping or unintended scrollbars, the 64/36 safe area holds for interactive HUD, the XP rail stays full-bleed, and canvas/DOM scale together. AB-QA-14 passes for pause/settings controls, focus and Escape flow in the same build; title-screen DOM focus remains an F2 gap. These are live-build checks, not the formal §14 atlas harness.

---

## 15. Production workflow

1. **Brief.** Add or update the row in `docs/ASSET_MANIFEST.md`: role, native size, states, pivot, palette, milestone and QA gates.
2. **Prototype.** Build a seeded preview in a spike or dev-only screen. Judge at 1×, grayscale and over a production ground crop.
3. **Approve one target.** Pick one representative asset or small style board. Do not mass-produce variants before approval.
4. **Separate generator from drawer.** The pure generator returns geometry/parameters; the Canvas drawer only draws. This keeps generation testable and simulation-pure.
5. **Wire the atlas.** Add the recipe to `SpriteFactory`/`SpriteAtlas`, not an ad hoc draw call.
6. **Configure.** Seeds, counts, sizes and caps live in `gameConfig` or `artConfig`; no magic numbers in draw code.
7. **QA.** Run the §14 gates. Record pass/fail in the manifest.
8. **Review.** One asset family per review. Include a contact sheet, 1× field capture and performance numbers.

**AB-WF-01:** Add the token before the recipe. Add the config value before the magic number.
**AB-WF-02:** Pre-render at boot. No per-frame L-systems, noise fields or path generation for entities.
**AB-WF-03:** Split by family before a file reaches 300 lines. `staging/EnemySprites.ts` is already at 296 lines and must be split when wired.
**AB-WF-04:** Every generated family needs a deterministic seed and a documented parameter range.
**AB-WF-05:** Do not commit disposable spike art to `src/`. Spikes live in `spikes/` or a dev-only route.

---

## 16. Do / Don't

**Do**

- Dark olive hostiles with serrated points, dark outlines and amber cores.
- Round, soft, mint/cyan nightbloom and glow-seeds.
- Cyan for the player, the beacon and friendly signal.
- Muted amber and rust for machinery; bright amber only for threat.
- Contact shadows and a consistent top-left ambient light.
- Silhouette first, color second.
- Stable seeds and config-driven variation.
- Test at 1×, in grayscale, on the production field, in the dark.

**Don't**

- Neon everything; purple; generic glowing orbs.
- Photoreal textures, pixel art, 3D, image generation, p5.js.
- Amber on friendly assets or mint on hostile cores.
- Nightbloom with teeth or hostility.
- Old Core as a beacon reskin.
- Round, unoutlined petals on a Seedling.
- A different outline width, head ratio or light direction between states.
- UI icons mixing filled, outlined and painterly treatments.
- Effects that hide telegraphs or hostile shots.
- Fonts loaded from a CDN in the offline build.

**Drift signals**

- Outline width changes between adjacent assets.
- Head ratio, limb thickness or costume layers change between Mira states.
- Amber appears on props or UI primary actions.
- Flora gets teeth; enemies get round petals without serration.
- Texture density rises in later variants.
- A “bigger” enemy is just a scaled-up smaller enemy.
- A new asset is attractive alone but belongs to a different visual system.

---

## 17. Known gaps and open decisions

These are real gaps in the current working tree. They are recorded here so they are not mistaken for approved style.

| Gap | Impact | Required action | Milestone |
|---|---|---|---|
| Atlas buffers are 1× logical, drawn under a DPR-scaled context | All sprites soften at DPR 2 | Introduce a `SpriteBuffer` with logical size and a 2× backing store; update consumers to draw at logical size | Before B |
| Ground cache bakes props and landmarks at 1× | Blur at DPR 2; no animation or y-sort | Keep soil cache at 1×; move props/landmarks to a dynamic 2× layer | Before B |
| Staging enemies use friendly colors and round petals | Seedling reads as nightbloom | Apply §5/§8 palette and serration pass before wiring | B |
| Only Mira portrait exists | Radio scenes cannot show Sela/Tavi/Idris | Add layered portraits; never reuse Mira for another speaker | F1 (earlier if radio requires) |
| Ability icons are generic | Abilities are not distinguishable at a glance | Author the canonical 5-icon set | B / C |
| Fonts load from Google Fonts CDN | Violates offline, zero-network requirement | Bundle OFL font files locally | Before release |
| No VFX, telegraph, weather or Old Core systems | B/D2/E1 art cannot be wired | Build pools/layers as part of each milestone | B–E3 |
| 64-light pool has no priority policy | Hostile shots can silently lose light | Implement §6 priority | B |
| Pivot is centered for all sprites | Grounded y-sort will be wrong | Adopt bottom-center for grounded, center for flying/projectiles/UI | Before B |
| Old Core size is not yet config-backed | Stage growth may drift | Add stage sizes and seed to config | D2 |
| Roster wording “8 base enemies” appears in older planning | Contradicts canon | Canon is 4 base + Bloomed variant + Stormroot; treat other variants as data-only | Now |
| HUD combat data is placeholder | Perceived quality is lower than the art | Wire real combat/XP/objective data through the existing snapshot (not an art task, but a release gate) | B |
| Mira's final lit silhouette is about 1.5–1.8:1 against road/soil | Fails AB-VL-02/AB-QA-04; disappears in grayscale and at 50% brightness | Add a closed rim/contact pool; raise the coat midtone only if the measured gate still fails | Before B |
| Opening frame clips the glasshouse and cold frames | The first view reads as an empty field despite F-3 density | Reframe landmark coordinates and verify one hero landmark in the spawn capture | Before B |
| Props are drawn under the flower layer | Flora can cover the harvester, pylon or sensor | Draw order: ground → flowers → props/landmarks → beacon → player → lighting | Before B |

Resolved in the PB-6/PB-7 working tree, pending review: the shared 1280×720 stage and frame-border overflow (PB-6), the 64/36 HUD safe area and bottom-left dock placement (PB-6), and the settings hit envelopes, focus ring, dialog semantics, state-aware Escape and safe quit default (PB-7). See `docs/PRE_B_VISUAL_FOUNDATION_PLAN.md` §11 for measured evidence. The title screen still lacks world art, title DOM focus and a Settings entry; those remain F2.

### Decisions to close before Milestone B

1. **Atlas DPR.** Approve a 2× backing store with logical-size metadata. Recommended: yes; sprite memory is small compared with the ground cache.
2. **Pivot.** Approve bottom-center for grounded entities, center for flying/projectiles/UI. Recommended: yes; it enables y-sort and correct contact shadows.
3. **Seedling palette.** Approve `mossDense` body + `cableBlack` outline + `hostileCore` core. Recommended: yes; it resolves the friendly/hostile collision.
4. **UI direction.** Approve the “field terminal” direction over a military dossier. Recommended: yes; it fits the nursery/keeper fiction.
5. **Roster.** Confirm 4 base enemies + Bloomed Seedling variant + Stormroot. Recommended: yes; GDD §5 is canonical.
6. **Old Core sizes.** Approve 140 px at stage 0 and ~220 px at stage 4/Stormroot. Recommended: yes; aligns with TDD §5.2.
7. **Portrait timing.** Decide whether Sela/Tavi/Idris portraits ship in F1 or earlier for radio legibility. Recommended: F1 unless radio scenes ship before F1.
8. **UI stage policy.** Approved and implemented in PB-6: one 1280×720 logical stage scaled uniformly to the frame, a 1.0× v1 cap, and the 64/36 safe area with the bottom XP rail as the only full-bleed exception. At 1024×768 the 0.8 stage produces 38.4 px physical controls; treat that as a documented desktop compromise, not touch compliance.

---

*End of Art Bible v1.0. Update this document before changing the visual system; update the manifest when changing an asset’s status.*

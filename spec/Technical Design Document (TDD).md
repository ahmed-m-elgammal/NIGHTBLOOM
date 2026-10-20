# NIGHTBLOOM: The Last Signal — Technical Design Document (TDD)

**Project Name:** NIGHTBLOOM: The Last Signal  
**Target Platform:** Modern Desktop Web Browsers (Chrome, Firefox, Safari, Edge)  
**Graphics / Audio Stack:** HTML5 Canvas 2D (Context2D), Web Audio API  
**Document Status:** Approved Specification v1.0  
**Authority:** This document expands `ARCHITECTURE.md` and `PREPRODUCTION.md` on technical implementation details. On any conflict, `ARCHITECTURE.md` and `PREPRODUCTION.md` win.

---

## 1. Rendering Architecture & Canvas 2D Pipeline

### 1.1 Viewport, Coordinate System & Letterboxing
- **Fixed Logical Resolution:** Locked to **1280×720** logical pixels (16:9 aspect ratio). The canvas and HUD scale uniformly to fit the window with letterbox bars in the background token color.
- **Fairness & Consistency:** The play field never shows extra map on large or ultrawide screens, ensuring identical combat density and difficulty across all displays.
- **HUD Safe Margin:** In-game HUD elements remain within a safe margin of 64 px horizontally and 36 px vertically.
- **HiDPI (Retina) Backing Store:** The internal canvas backing store scales with `devicePixelRatio` (strictly capped at 2.0 to protect mobile/low-end GPU fill rate, thermal limits, and battery life on high-density mobile screens):
  ```typescript
  function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.scale(dpr, dpr);
  }
  ```

### 1.2 World Coordinates & Camera System
- **Map Bounding Coordinates:** The outdoor agricultural field spans `[0, 3200] × [0, 2400]` px (config-driven).
- **Player Clamping:** Player coordinates are clamped to maintain safety padding from outer map edges.
- **Camera Tracking:** Smooth follow targeting Mira, clamped strictly so the camera view never scrolls into void space outside `[0, 3200] × [0, 2400]`:
  $$\text{Cam}(t + \Delta t) = \text{Cam}(t) + (\text{Player} - \text{Cam}(t)) \cdot (1 - e^{-\lambda \Delta t})$$
  Time constant starting value is $0.12\text{ s}$ ($\lambda \approx 8.33\text{ s}^{-1}$), tunable within $[0.05, 0.25]\text{ s}$.
- **Frustum Culling:** Entities, props, and pickups outside the active viewport $+ 64\text{ px}$ margin are culled prior to draw execution.

### 1.3 Procedural Offscreen Sprite Factory & Atlas
All game art is generated procedurally in code at boot time:
1. `SpriteFactory` initializes offscreen HTMLCanvas buffers during the `boot` state.
2. Sprites are drawn using Canvas 2D geometric paths (`arc`, `bezierCurveTo`, `fill`, `stroke`) styled with named theme tokens.
3. Rasterized silhouettes are cached into an in-memory sprite atlas.
4. During rendering, entity drawing performs hardware-accelerated `ctx.drawImage()` lookups from the offscreen atlas. Zero external raster image files are downloaded.

### 1.4 Canvas Render Layer Pipeline
Render order follows `GDD.md` and `PREPRODUCTION.md` strictly. **No effect may obscure a hostile shot or telegraph:**

```text
+---------------------------------------------------------------------------------------+
|                                CANVAS RENDER PIPELINE                                 |
|                                                                                       |
|  [Layer 1: Ground] -------------> Terrain grid, shallow water margins, field tint     |
|         |                                                                             |
|         v                                                                             |
|  [Layer 2: Flower Patches] -----> Nightbloom patches (surge glow warning cue)          |
|         |                                                                             |
|         v                                                                             |
|  [Layer 3: Props] --------------> Rusty harvester, irrigation tracks, Old Core pylon  |
|         |                                                                             |
|         v                                                                             |
|  [Layer 4: Entities] -----------> Mira, Seedlings, Thornrunners, Rustwings, Boss      |
|         |                                                                             |
|         v                                                                             |
|  [Layer 5: Telegraphs & Hostile]-> Hatched ground rings, attack cones, hostile shots  |
|         |                         (Drawn ABOVE entities so danger is never hidden)    |
|         v                                                                             |
|  [Layer 6: Light & Glow] -------> Beacon lamp radius, friendly flare trails, glows    |
|         |                                                                             |
|         v                                                                             |
|  [Layer 7: Weather Overlay] ----> Dust veil drift, wind gusts, atmospheric fog        |
|         |                                                                             |
|         v                                                                             |
|  [Layer 8: HUD] ----------------> HP bar, XP bar, objectives, cooldowns, timers      |
+---------------------------------------------------------------------------------------+
```

### 1.5 Render Interpolation for High-Refresh Displays
To prevent micro-stutter on 120 Hz / 144 Hz displays while maintaining a 60 Hz simulation:
- The accumulator captures leftover frame time: $\alpha = \frac{\text{accumulator}}{dt}$.
- Visual transforms blend between `previousTickTransform` and `currentTickTransform`:
  $$\vec{P}_{\text{render}} = (1 - \alpha) \cdot \vec{P}_{\text{prev}} + \alpha \cdot \vec{P}_{\text{curr}}$$

### 1.6 App Lifecycle & Mobile WebView Resilience
To ensure smooth behavior across desktop tab-switching, mobile app switching, phone calls, and device sleep:
- **Visibility Detection:** Centralized hook listening to `document.addEventListener('visibilitychange')`.
- **Auto-Pause on Backgrounding:** When `document.visibilityState === 'hidden'`:
  1. The simulation loop immediately pauses execution, preventing background entity deaths or battery drain.
  2. `AudioService.suspend()` is invoked, immediately halting Web Audio oscillator graph processing.
- **Graceful Resumption:** When returning to `visible`:
  1. The rAF accumulator delta is clamped to max $100\text{ ms}$, preventing spiral-of-death catch-up ticks.
  2. The game remains in `paused` state with an explicit UI overlay so the player resumes intentionally.
  3. `AudioService.resume()` restores the audio graph upon the player's next user interaction.

---

## 2. Spatial Partitioning & Collision Engine

### 2.1 Spatial Hash System
To maintain $O(1)$ amortized lookups across up to 200 active enemies, 300 projectiles, and 150 pickups within the 3 ms tick budget:
- The field is partitioned into uniform grid cells. Cell size is a configured tuning constant matching typical cluster and targeting ranges.
- Dynamic entities update their registered grid buckets each tick.
- Range queries (flare auto-targeting, pickup suction, area pulses, collision detection) query only adjacent $3 \times 3$ grid buckets.

### 2.2 Collision Resolution & Separation
- **Hitbox Primitives:** Bounded circles for player, enemies, and projectiles.
- **Overlap Resolution:** If distance $d < (R_1 + R_2)$, entities are pushed apart along the collision normal:
  $$\Delta \vec{p} = \frac{(R_1 + R_2 - d)}{2} \cdot \frac{\vec{p}_1 - \vec{p}_2}{d}$$
- **Soft Separation Flocking:** Enemies apply a mild separation steering force when within neighbor proximity to prevent unnatural single-point stacking.

---

## 3. Weapon Simulation & Targeting Logic

### 3.1 Signal Flare (Base Weapon)
- **Targeting Rule:** Queries the spatial hash for the nearest enemy within range ($420\text{ px}$).
- **Trajectory:** Fires projectile toward the target position at $520\text{ px/s}$.
- **Lifetime & Hits:** Dies on contact unless an upgrade grants pierce; maximum travel distance $420\text{ px}$.

### 3.2 Coil Arc (Unlocked Chapter 2)
- **Targeting Rule:** Chains electrical arcs to up to 3 targets within $180\text{ px}$ jump range.
- **Traversal:** Evaluated instantaneously on fire tick; draws a jagged midpoint-displacement arc effect lasting 100 ms.

### 3.3 Bloomguard (Unlocked Chapter 3)
- **Area Protective Ring:** Radius $110\text{ px}$, active for $3.0\text{ s}$ every $10.0\text{ s}$.
- **Effect:** Reduces incoming damage by $30\%$ and applies a light knockback impulse to enemies touching the ring boundary.

### 3.4 Wren Support Drone (Unlocked Chapter 4)
- **Follower Positioning:** Fixed offset relative to Mira: $(40, -40)\text{ px}$.
- **Firing:** Auto-fires independently every $1.0\text{ s}$, dealing 6 damage to the nearest enemy within $300\text{ px}$.

---

## 4. Web Audio Synthesis Architecture

The audio engine uses the browser native `AudioContext` with zero external audio assets:

```text
[OscillatorNode (Sine/Square/Triangle)] ---> [BiquadFilterNode] ---> [GainNode (Envelope)]
                                                                               |
[AudioBufferSourceNode (Noise)] -----------> [BandpassFilter]  ----------------+
                                                                               |
                                                                               v
                                                                    [Sub-Bus (SFX / Ambient)]
                                                                               |
                                                                               v
                                                                    [Master Gain Bus]
                                                                               |
                                                                               v
                                                                    [AudioContext.destination]
```

### 4.1 Synthesis Principles & Sound Design
- **Procedural Recipes:** Sound effects (flare shot, enemy hit, seed pickup, beacon pulse, surge alarm, boss telegraphs) are synthesized dynamically via oscillator frequencies, noise buffers, and ADSR envelopes.
- **Spike Tuning:** Exact oscillator frequencies, attack/decay envelopes, and filter poles are finalized during spike S4.
- **Audio Sub-Buses:**
  - `Master Bus`: Master gain node controlled by settings.
  - `SFX Bus`: Weapon sounds, hit thuds, pickup chirps, enemy cues.
  - `Ambient Bus`: Low wind drones, dusk field atmosphere.
- **Pitch Jitter:** Combat sound effects apply a small random pitch variation ($\pm 5\%$) on playback to prevent ear fatigue.
- **Pickup Chime Cascade:** Collecting multiple glow-seeds within $0.5\text{ s}$ pitches the pickup chirp up by $+2$ semitones per seed (capped at $+12$).

---

## 5. Game Feel & Visual Readability

### 5.1 Game Feel Parameters (from PREPRODUCTION.md §5)
| Event | Visual Feedback | Audio Feedback | Start Value | Tuning Range |
|---|---|---|---|---|
| **Movement** | Instant direction, ease to speed | Soft footfall loop (optional) | Accel 70 ms, decel 50 ms | 0–120 ms, 30–100 ms |
| **Camera** | Smooth follow, clamped to map | — | Time constant 0.12 s | 0.05–0.25 s |
| **Flare Fired** | 40 ms muzzle flash, short trail | Short tick | Trail 6 segments | 0–10 segments |
| **Enemy Hit** | 60 ms white flash, floating damage number | Soft thud, pitch $\pm 5\%$ | Numbers merge within 100 ms, max 40 on screen | 20–60 numbers |
| **Enemy Death** | 150 ms pop (scale 1.0 $\to$ 1.3, fade), seed scatter | Pop, pitch $\pm 5\%$ | — | — |
| **Pickup** | Accelerates 120 $\to$ 480 px/s inside radius | Chirp, $+2$ semitones/seed (max $+12$) | Radius 90 px | 60–140 px |
| **Player Hit** | 80 ms flash, 8 Hz blink in i-frames, edge vignette | Low thump | Shake 3 px / 150 ms, hit-stop 40 ms | Shake 0–6 px, hit-stop 0–80 ms |
| **Beacon Pulse** | Ring expands over 300 ms | Low swell | Shake 4 px / 120 ms | Shake 0–6 px |
| **Level-Up** | Freeze, cards fade in over 120 ms | Rising chime | — | 0–250 ms |
| **Telegraph** | Hatched ground ring, shrinking countdown ring | Rising tick | Last 150 ms brightens | — |
| **Surge Warning** | Nightbloom patches brighten over 45 s, HUD icon | Slow low swell | Lead time 45 s | 30–60 s |

### 5.2 Style Tile Silhouette Sizes & Shapes (at 1280×720)
- **Mira:** Rounded figure with lamp, 40 px tall, cyan accent.
- **Seedling:** Round bulb with five petals, 28 px, green-teal.
- **Bloomed Seedling:** Seedling with outer petal ring, 36 px, amber tint token.
- **Thornrunner:** Low angular wedge, 26 × 20 px, dark thorn green, dust trail.
- **Rustwing:** Cross with rotor, tilted hover shadow, 34 px, rust color, rotor flare.
- **Briarheart:** Heavy hexagon with thorn ring, 72 px, dark thorn green, ground ring wind-up.
- **Stormroot:** Large asymmetric tangle with core, ~220 px, phase-tinted colors, core glow.
- **Glow-seed:** Small circle with halo, 10 px, mint (only entity that drifts to Mira).
- **Flare shot:** Soft teardrop, 12 × 6 px, cyan-white trail.
- **Enemy shot:** Pointed diamond with dark outline and amber core, 14 px (never under 10 px).

### 5.3 The 7 Canonical Readability Rules (from PREPRODUCTION.md §6.2)
1. **Luminance Contrast:** Gameplay-critical elements (player, enemy shots, telegraphs, pickups) maintain a luminance contrast ratio of at least **3:1** against the local ground terrain in every chapter's lighting theme.
2. **Shape Semantics:** Hostile elements are pointed with a dark outline and an amber core. Friendly elements are soft and rounded in cyan or mint. A hostile shape is never reused for a pickup.
3. **Telegraph Construction:** Ground telegraphs sit directly on the terrain surface, use hatched inner patterns, and display a shrinking countdown ring.
4. **Draw Order Invariance:** Ground $\to$ Flowers $\to$ Props $\to$ Entities $\to$ **Telegraphs & Hostile Shots** $\to$ Glow/Light $\to$ Weather $\to$ HUD. No graphical effect may ever hide or obscure a hostile shot or a telegraph.
5. **Background Restraint:** Background motion (swaying flowers, wind drift, dust veil) is kept low in contrast and small in amplitude to avoid visual noise.
6. **Simultaneous Entity Caps:** Hard caps are enforced on simultaneous glow sprites, floating damage numbers (max 40 on screen, merged within 100 ms), and particle bursts.
7. **Color-Blindness & Lighting Validation:** Every chapter's lighting palette is verified in grayscale, across three color-blindness simulations (deuteranopia, protanopia, tritanopia), high-contrast mode, and at 50% brightness.

### 5.4 Old Core Growth Stages (from STORY_BIBLE.md §9 and GDD.md §7)
The Old Core amplifier pylon stands at the center of the field in every chapter, visibly and audibly growing:
- **Stage 0 (Chapter 1 - Dusk):** Inert metal pylon, faint low hum.
- **Stage 1 (Chapter 2 - Moonless):** Thorn tendrils spreading around the base.
- **Stage 2 (Chapter 3 - Second Watch):** Thorns climbing the mast, faint phosphorescent glow.
- **Stage 3 (Chapter 4 - Small Hours):** Wrapped in scrap farm machinery, audible pulsing hum.
- **Stage 4 (Chapter 5 - Before Dawn):** Massive overgrown tangled mass, visibly pulsing violently.
- **Boss (Chapter 5 Phase 4):** Awakens as **Stormroot**, carrying the rising harmonic hum directly into its attack audio cues.

### 5.5 Accessibility Modes
- **Reduced Flashes / Reduced Motion:** Disables screen shake, hit-stop, and projectile trails. Replaces player i-frame blinking with a constant 50% opacity. Replaces pulsing bloom glows with monotonic fades.
- **High Contrast Palette:** Replaces ambient ground lighting with high-contrast outlines (minimum 4.5:1 luminance contrast).

---

## 6. Developer Tools & Debug Subsystem

### 6.1 Gating & Dead-Code Elimination
- Debug tools exist only when `import.meta.env.DEV` is true or when built with `VITE_DEBUG=true`.
- Production builds strip debug code via Vite Rollup dead-code elimination.
- CI verification includes an automated check asserting that the marker string `__NB_DEBUG__` does not appear in `dist/`.

### 6.2 Debug Key Controls & Capabilities
Dev tools interact with the simulation **exclusively** through typed game commands, ensuring all debug actions are deterministically recorded and replayable:

| Key / Control | Function | Description |
|---|---|---|
| **F1** | Performance Overlay | Real-time display of FPS, tick ms, render ms, entity/projectile/pickup counts, spatial hash stats, seed, phase. |
| **F2 / F3 / F4** | Time Controls | Pause simulation, advance single tick, cycle timescale ($0.25\times, 0.5\times, 1.0\times, 2.0\times, 4.0\times, 8.0\times$). |
| **F5** | God Mode | Toggles Mira invulnerability. |
| **F6** | Kill All | Destroys all active non-boss enemies and drops seeds. |
| **F7** | Give XP | Grants sufficient XP to trigger immediate level-up. |
| **F8** | Hitbox & Visualizer | Draws collision hitboxes, enemy spawn margins, safe zones, and targeting rays. |
| **F9** | **Replay Recorder** | Dumps current match seed and per-tick command history as JSON for bug reproduction and balance testing. |
| **F10** | Export Run Log | Exports match telemetry, upgrade tree, and combat logs. |
| **Console** | Give Upgrade / Ability | Command `giveUpgrade(id)` or `giveAbility(id)` validated against content registries. |
| **Debug Menu** | Chapter / Phase Jump | Jump directly to any phase, auto-applying prerequisite starting picks. |

---

## 7. Performance Budgets & Optimization Constraints

| Metric | Target Budget | Hard Cap | Measurement Tool |
|---|---|---|---|
| **Frame Rate** | $60\text{ FPS}$ | $\ge 58\text{ FPS}$ | Chrome DevTools Frame Meter |
| **Simulation Tick Time** | $\le 2.0\text{ ms}$ | $\le 3.0\text{ ms}$ at peak | High-resolution tick timer |
| **Canvas Render Time** | $\le 5.0\text{ ms}$ | $\le 8.0\text{ ms}$ at peak | Canvas profiler |
| **First-Load JavaScript** | $\le 300\text{ KB}$ | $\le 350\text{ KB}$ gzipped | CI bundle analyzer |
| **Time to Title Screen** | $\le 1.5\text{ s}$ | $\le 2.0\text{ s}$ | Playwright startup test |
| **Live Enemies** | $80 - 120$ | $200$ (spawning throttles at cap) | Engine entity counter |
| **Active Projectiles** | $150$ | $350$ | Engine pool counter |
| **Garbage Collection Allocation** | Zero in tick loop | $< 5\text{ KB/frame}$ | Chrome Memory DevTools |

### 7.1 GC Elimination via Object Pooling
- Pre-allocated object pools for projectiles, glow-seeds, visual damage numbers, and particle bursts.
- Reusable math vectors for collision calculations and range queries; zero `{x, y}` object allocations inside the 60 Hz tick.

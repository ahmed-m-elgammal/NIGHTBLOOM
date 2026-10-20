# NIGHTBLOOM: The Last Signal — Architecture & Pre-Production Decisions

Authority: PREPRODUCTION.md §14.3 & AGENTS.md §1
All entries follow the canonical format: Context, Decision, Consequence.

---

## D-001 · Level-up Cadence & XP Progression Curve · 2026-10-20
**Context:** Finding F1 in PREPRODUCTION.md showed that GDD 4.5's flat cadence led to 14 level-ups in Chapter 1, conflicting with the GDD 9 target of level 8–10.
**Decision:** Adopt a front-loaded XP progression curve: first level-up at ~30 s, second at ~85 s, third at ~140 s, then ~90 s between upgrades, achieving level 9 by Chapter 1 end.
**Consequence:** Config XP thresholds start at 11 XP for level 1, then scale organically with wave spawn densities.

---

## D-002 · Viewport Resolution & Fixed Aspect Ratio · 2026-10-20
**Context:** Finding F3 showed that larger or ultrawide monitors would reveal more of the map, altering enemy warning times and flare targeting ranges.
**Decision:** Lock game canvas to exactly 1280×720 logical pixels (16:9), scaling uniformly with letterbox bars in the background theme token. Backing store scales with `Math.min(devicePixelRatio, 2.0)`.
**Consequence:** All players experience identical combat density and difficulty across all screen sizes and mobile wrappers.

---

## D-003 · Render Interpolation on High-Refresh Displays · 2026-10-20
**Context:** Desktop monitors running at 120 Hz, 144 Hz, or 240 Hz exhibit micro-judder when rendering a 60 Hz simulation without alpha blending.
**Decision:** Store `previousTickTransform` and `currentTickTransform`. Visual rendering blends using the accumulator fraction: `P_render = (1 - alpha) * P_prev + alpha * P_curr`.
**Consequence:** Liquid-smooth rendering on high-refresh monitors while keeping the physics simulation strictly fixed at 60 Hz.

---

## D-004 · Ability Slot Structure & Unlocks · 2026-10-20
**Context:** Finding F2 noted that Coil Arc unlocks after Ch2, Bloomguard after Ch3, and Wren after Ch4.
**Decision:** Keep the canonical 3-slot structure: Slot 1 locked to Signal Flare, Slot 2 unlocked post-Ch2 (Coil Arc), Slot 3 unlocked post-Ch3 (Bloomguard). Dedicated Spacebar binding for Beacon Pulse.
**Consequence:** UI displays empty/locked badges for Slots 2 & 3 in Chapter 1, clearly communicating future campaign rewards.

---

## D-005 · Enemy Swarm Cap & Peak Density · 2026-10-20
**Context:** Canvas 2D performance spike S1 tested 120, 150, and 200 enemies under full projectile loads.
**Decision:** Cap maximum active live enemies at 120 for Chapter 1–3, scaling to 150 for Chapter 4–5. Verified in S1 holding >= 58.2 FPS at DPR 2.0.
**Consequence:** Prevents lag or GC stalls on low-spec integrated graphics while preserving dense swarm feel.

---

## D-006 · First Flare Damage Breakpoint · 2026-10-20
**Context:** Finding F4 revealed that a +20% upgrade (10 -> 12 damage) does not reduce the 2-shot requirement against 14 HP Seedlings.
**Decision:** First level of Flare Damage provides +40% (14 damage), achieving an instant 1-shot kill breakpoint on Seedlings. Subsequent ranks provide +20%.
**Consequence:** The player immediately feels their first upgrade pick in combat pacing.

---

## D-007 · Art Architecture: Procedural Offscreen Vector Sprite Atlas · 2026-10-20
**Context:** S2 Art Spike evaluated readability, contrast, and visual style. User mandated eliminating primitive flat geometric shapes and 80s wireframe aesthetics in favor of a cohesive, atmospheric modern indie game look.
**Decision:** Synthesize all sprites procedurally onto offscreen HTMLCanvas buffers at boot using semantic `ThemeTokens`. Implement multi-layer anatomy, survival gear, distinct silhouettes, alive eye specular glints, and dynamic stride frames. Verified >= 3:1 luminance contrast across all color-blindness modes.
**Consequence:** Zero external raster downloads, instant loading, crisp rendering, and 100% theme token cohesion.

---

## D-008 · Audio Architecture: Procedural Web Audio API Synthesis · 2026-10-20
**Context:** S4 Audio Spike evaluated browser synthesis without external audio files.
**Decision:** Use native `AudioContext` with oscillator frequency sweeps, white-noise buffers, and ADSR gain envelopes for weapons, hits, pickups, pulses, and ambient drones.
**Consequence:** Zero binary audio dependencies, instant playback, zero network latency.

---

## D-009 · Headless Simulation Speed & Deterministic Seeded PRNG · 2026-10-20
**Context:** S5 Headless Spike required >= 30x real-time speed for 30-seed automated balance runs.
**Decision:** Mulberry32 32-bit seeded PRNG injected into all simulation logic. Achieved > 400,000x real-time speed in Node.js with 100% bit-identical state hashes across runs.
**Consequence:** Strict simulation purity: `src/game/simulation/` has zero DOM or Canvas imports, allowing automated headless balance bots to run in seconds.

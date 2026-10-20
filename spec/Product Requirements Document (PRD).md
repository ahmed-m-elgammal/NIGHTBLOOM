# NIGHTBLOOM: The Last Signal — Product Requirements Document (PRD)

**Project Name:** NIGHTBLOOM: The Last Signal  
**Product Version:** 1.0.0 (Release Candidate)  
**Primary Target:** Modern Desktop Web Browsers (v1 Validation) $\to$ Mobile Wrapper Deployment (iOS/Android via Capacitor)  
**Document Status:** Approved Specification v1.0  
**Authority:** This document expands `GDD.md`, `ARCHITECTURE.md`, and `PREPRODUCTION.md`. On any conflict, those source documents win.

---

## 1. Product Vision & Summary

*NIGHTBLOOM: The Last Signal* is a self-contained, offline, single-player wave-survival action game built with modern web technologies (React 18+, TypeScript Strict, Vite, Canvas 2D, Web Audio API).

The game follows a **Web-First Validation $\to$ Mobile Wrapper Deployment** lifecycle:
1. **Phase 1 (Web v1 Validation):** Validate core fun, pacing, balance, and retention on desktop web with keyboard controls, minimal friction, and zero distribution gatekeepers.
2. **Phase 2 (Mobile App Deployment):** Package the validated web codebase into native iOS and Android apps using Capacitor, leveraging the pre-architected normalized input vector layer, 48×48 px touch targets, and mobile lifecycle hooks.

Unlike mainstream survivor-likes that demand dozens of hours of grinding, meta-currency progression, or complex systems, *NIGHTBLOOM* delivers a tightly crafted, narrative-driven 67-minute campaign (4,020 seconds of combat across five chapters). The player controls field ecologist **Mira Vale**, defending a damaged emergency beacon through an escalating night so an evacuation convoy can reach the last viable seed nursery in the dust-dimmed Grey Season.

### Key Pillars
1. **Readable Chaos:** Screen may fill with entities, but threats and safe routes remain immediately readable.
2. **Every Pick Changes the Build:** Meaningful upgrades felt within a minute of drafting; no trivial "+1%" filler.
3. **A Hopeful Night:** Warm light against dark, respect for player time (skippable text, in-memory phase retry, short chapters).
4. **Zero Runtime Server Costs:** 100% client-side, zero backend servers, zero telemetry/cookies, zero external audio/image assets.

---

## 2. Target Player Profile

Rather than synthetic demographic personas, the target player is defined functionally (from `PREPRODUCTION.md` §2):
- Enjoys survivor-style action games (*Vampire Survivors*, *Hades*, *Brotato*).
- Desires a short, complete story-driven campaign rather than endless treadmill grinding.
- Plays on a desktop browser using a keyboard during v1 validation; transitions to mobile touch on subsequent release.
- Plays one 11–16 minute chapter per sitting.

---

## 3. Product Scope: Must / Should / Could & Cut List

### 3.1 Scope Tiers (from PREPRODUCTION.md §10)
- **Must (Non-negotiable for v1):**
  - Full 5-chapter campaign playable from start to completion.
  - Player character Mira Vale with Signal Flare (base) and Beacon Pulse (active).
  - 3 unlockable abilities (Coil Arc in Ch2, Bloomguard in Ch3, Wren in Ch4).
  - 4 base enemies (Seedling, Thornrunner, Rustwing, Briarheart) + 1 variant (Bloomed Seedling) + final boss (**Stormroot** with 3 phases and recovery windows).
  - Data-driven upgrade pool with caps, prerequisites, and fallback cards (Field Rations, Score Bonus).
  - In-memory Phase Retry snapshot system on defeat.
  - Versioned local save persistence via `SaveService` with Zod validation.
  - Settings (volumes, screen shake, high contrast, reduced flashes/motion, pulse rebind).
  - Full keyboard accessibility and credit attribution notices.
- **Should (High priority polish):**
  - Field Ledger codex screen and lore discoveries.
  - Character barks (36 starter barks across Mira, Sela, Tavi, Idris, Wren).
  - Warden Idris Kael radio communications.
  - Chapter lighting and weather variants.
  - Calculated rank letters (S/A/B/C) on results screen.
- **Could (Optional / Cuttable):**
  - Score Attack replay mode.
  - Extra Ledger lore entries beyond the initial 12.
  - Post-v1 features: run mutators, daily seeded challenges, additional heroes.

### 3.2 Prioritized Cut Order (if time runs short)
1. Score Attack mode
2. Warden Idris Kael radio captions
3. Extra Ledger lore entries
4. Barks beyond the initial 12 core triggers
5. Weather atmospheric variants
6. Rank letters on results
*Note: The Chapter 5 Stormroot boss fight and the narrative ending sequence are never cut.*

### 3.3 Vertical-Slice Gate (End of Milestone D2)
- **Go/No-Go Decision Criteria:**
  - At least 4 of 5 playtesters complete Chapter 1 ($\ge 80\%$).
  - At least 3 of 5 playtesters explicitly want to continue to Chapter 2.
  - Performance holds at stable 60 FPS on mid-range desktop test hardware.
  - Zero blocker or crash bugs.
  - If gate criteria fail, fix or cut before scaling content across Chapters 2–5.

---

## 4. Functional Requirements (FR)

| ID | Requirement | Specification | Acceptance Criteria |
|---|---|---|---|
| **FR-1** | **5-Chapter Campaign** | Sequential campaign: Dusk (11m), Moonless (13m), Second Watch (13m), Small Hours (13.5m), Before Dawn (16.5m). | All 20 phases execute with exact durations, objectives, and wave schedules. |
| **FR-2** | **Combat Simulation** | 60 Hz deterministic simulation tick, auto-firing weapons targeting nearest eligible enemy. | Signal Flare fires every 0.8s (10 dmg); collisions resolved via spatial hash. |
| **FR-3** | **Active Skill (Beacon Pulse)** | Dedicated Spacebar active skill with 12s cooldown, 160 px radius, 220 px knockback, 50% damage reduction for 0.8s. | Cancels Stormroot's Gale Pull attack; clears space in emergency swarms. |
| **FR-4** | **Upgrade Drafting** | Level-up freezes simulation; offers 3 distinct cards; applies exactly 1 card; resumes simulation. | Supports 1 reroll per chapter; skip heals 25% max HP; guards against double-picking. |
| **FR-5** | **Starting Picks** | Free upgrade draft picks at chapter start (Ch1: 0, Ch2: 1, Ch3: 2, Ch4: 3, Ch5: 4). | Ensures later chapters do not feel like full restarts. |
| **FR-6** | **Phase Retry Snapshots** | Memory snapshot taken at start of each phase (player stats, XP, upgrades, score). | On defeat, allows immediate restart of failed phase without losing chapter progress. |
| **FR-7** | **Stormroot Boss Climax** | Chapter 5 Phase 4 boss with Root Lash, Spore Ring, Gale Pull, and 2.5s/2.0s recovery windows (+25% core vulnerability). | Dual victory condition: destroy Stormroot core OR survive 300s Signal Lock countdown. |
| **FR-8** | **Local Save Persistence** | Encapsulated storage adapter saving campaign records, unlocks, settings, and profileId. | Migrates schema versions safely; falls back to clean state on corrupted data. |
| **FR-9** | **Procedural Audio & Art** | Web Audio API synthesizer for all SFX; procedural Canvas 2D vectors for all entities and UI. | Zero external audio (MP3/WAV) or raster image (PNG/JPG) requests in Network tab. |
| **FR-10** | **Field Ledger System** | Unlocked after Chapter 1; logs discovered enemies, lore entries, and unlocks Pickup Radius upgrade. | Persists across runs; entries written in distinct character voices (Sela, Tavi, Mira). |

---

## 5. Non-Functional Requirements (NFR)

### 5.1 Performance Budgets
- **Frame Rate:** Stable 60 FPS on standard desktop browsers at peak live enemy cap (200 entities).
- **Simulation Tick Budget:** $\le 3.0\text{ ms}$ at peak load.
- **Canvas Render Budget:** $\le 8.0\text{ ms}$ at peak load.
- **First-Load JavaScript Bundle:** $\le \mathbf{350\text{ KB}}$ gzipped (including runtime, fonts, and content definitions).
- **Time to Title Screen:** $\le \mathbf{2.0\text{ seconds}}$ on local build.
- **Memory Stability:** Zero continuous heap allocation growth over a 15-minute run.

### 5.2 Offline Purity & Privacy
- **Zero Runtime Requests:** 100% playable offline once loaded.
- **No Remote Telemetry or Cookies:** No third-party analytics, tracking scripts, or ad networks.
- **Verification:** An automated Playwright E2E test runs the entire game with network traffic completely blocked.

### 5.3 Viewport & Resolution
- **Fixed Logical Viewport:** Locked to **1280×720** logical pixels, scaled uniformly with letterbox/pillarbox bars.
- **HUD Safe Margin & Insets:** 64 px horizontal, 36 px vertical. Respects `env(safe-area-inset-*)` when running in mobile web or native wrappers.
- **HiDPI Scaling Cap:** `devicePixelRatio` capped at 2.0 to protect mobile GPU fill rate and prevent thermal throttling.

### 5.4 Accessibility (WCAG 2.2 AA)
- 100% keyboard operable menus, cards, and dialogs (`Tab`, `Shift+Tab`, `Arrow keys`, `Enter`, `Escape`).
- **Touch Target Sizing:** Minimum 48×48 px interactive hit target for all UI buttons, cards, and modal triggers (WCAG 2.5.5 / 2.5.8).
- Luminance contrast $\ge 4.5:1$ for text panels and $\ge 3:1$ for critical gameplay graphics against ground.
- Dual-channel threat telegraphing (shape, pattern, and color).
- Reduced Flashes and Reduced Motion modes.

### 5.5 Mobile Packaging & Lifecycle Resilience
- **Zero Architecture Changes for Mobile:** Pure HTML5 Canvas 2D + React + TypeScript codebase packages cleanly into native iOS/Android apps via Capacitor.
- **Lifecycle Auto-Pause:** Application listens to `visibilitychange` to automatically pause simulation and suspend `AudioContext` on backgrounding (phone calls, app switching, screen sleep).
- **Normalized Input Abstraction:** `InputManager` emits normalized `{ x, y }` directional vectors, enabling touch overlay joysticks or physical gamepads to plug in without altering simulation logic.

---

## 6. Success Metrics & Validation Targets

1. **Chapter 1 Completion Target:** $\ge 90\%$ clear rate for Chapter 1 on first attempt (driven by balance bot and playtesters).
2. **Vertical-Slice Milestone Gate:** 4 of 5 playtesters finish Chapter 1 ($\ge 80\%$), with at least 3 expressing enthusiasm to continue.
3. **Chapter First-Attempt Clear Targets:**
   - Chapter 1: $\ge 90\%$
   - Chapter 2: $\approx 80\%$
   - Chapter 3: $\approx 75\%$
   - Chapter 4: $\approx 70\%$
   - Chapter 5: $55–65\%$ on first attempt, $\ge 85\%$ within three attempts using phase retry.
4. **Simulation Determinism:** 100% match reproducibility when running headless simulation replay with identical seeds and input streams.

# NIGHTBLOOM: The Last Signal — UX Specification and UI Design System

**Project Name:** NIGHTBLOOM: The Last Signal  
**Target Platform:** Modern Desktop Web Browsers (v1 Web Validation) $\to$ Mobile Wrapper Deployment (iOS/Android via Capacitor)  
**Input Mode:** Desktop Keyboard Primary (v1 web); Mobile Touch Overlay & Virtual Joystick ready via normalized input abstraction  
**Document Status:** Approved Specification v1.0  
**Authority:** This document expands `GDD.md`, `ARCHITECTURE.md`, and `PREPRODUCTION.md`. On any conflict, those source documents win.

---

## 1. Information Architecture & Screen Flow

```text
                      +-------------------+
                      |   BOOT / LOADER   |
                      +-------------------+
                                | (assets compiled & save verified)
                                v
                      +-------------------+
                      |   TITLE SCREEN    | <------------------------------------+
                      +-------------------+                                      |
                        |   |   |   |   |                                        |
     +------------------+   |   |   |   +------------------+                     |
     |          +-----------+   |   +------------+         |                     |
     v          v               v                v         v                     |
+---------+ +----------+ +-------------+ +------------+ +---------+              |
| CHAPTER | | HOW TO   | | SETTINGS    | | FIELD      | | CREDITS |              |
| SELECT  | | PLAY     | |             | | LEDGER     | | NOTICES |              |
+---------+ +----------+ +-------------+ +------------+ +---------+              |
     |          |               |                |         |                     |
     |          +---------------+----------------+---------+                     |
     v                          |                                                |
+---------+                     v                                                |
|BRIEFING |              (Back to Title)                                         |
+---------+                                                                      |
     |                                                                           |
     v (Begin)                                                                   |
+-------------------------------------------------------------+                  |
|                        IN-GAME HUD                          |                  |
|  - Canvas Simulation Background                             |                  |
|  - Top Left: HP Gauge (Current / Max)                       |                  |
|  - Top Right: Chapter, Phase, Countdown, Defeated Count     |                  |
|  - Top Center: Active Phase Objective                       |                  |
|  - Bottom Left: Ability Slots & Cooldowns                   |                  |
|  - Bottom: XP Bar spanning width                            |                  |
|  - Bottom Center: Speaker Portrait & Radio Captions         |                  |
|  - Top Boss Bar (Chapter 5 Phase 4 only)                    |                  |
+-------------------------------------------------------------+                  |
     |                                |                                          |
     v (XP Threshold)                 v (Escape / P)                             |
+--------------------+       +--------------------+                              |
|  LEVEL-UP SCREEN   |       |    PAUSE MENU      |                              |
|  - 3 Upgrade Cards |       |  - Resume          |                              |
|  - Reroll [R]      |       |  - Restart Chapter |                              |
|  - Skip [S]        |       |  - Settings        |                              |
+--------------------+       |  - Title           |                              |
     |                       +--------------------+                              |
     v (Pick chosen)                  |                                          |
(Resume Simulation)                   v (Quit to Title)                          |
                                (Title Screen)                                   |
     |                                                                           |
     v (Objective complete / Player defeat)                                      |
+-------------------------------------------------------------+                  |
|                       RESULTS SCREEN                        |                  |
|  - Outcome: Victory / Defeat                                |                  |
|  - Final Score & Rank (S / A / B / C)                       |                  |
|  - Match Duration & Retries Used                            |                  |
|  - Unlock Earned Banner                                     |                  |
|  - Actions: Continue / Replay / Retry Phase / Title         | -----------------+
+-------------------------------------------------------------+
```

---

## 2. Viewport & Letterboxing Architecture

- **Fixed Logical Game Box:** Exactly **1280×720** logical pixels (16:9 aspect ratio).
- **Uniform Scaling:** Scaled uniformly to fit the window with letterbox/pillarbox bars styled in the background token color.
- **Fairness Guarantee:** The play field never reveals extra map on ultrawide, high-resolution monitors, or tall mobile screens (e.g. 19.5:9, 20:9); all players experience identical enemy awareness distances and spawn distances.
- **Safe Area & Insets:** All HUD elements stay strictly within a safe margin of 64 px horizontally and 36 px vertically. In mobile wrappers (iOS/Android via Capacitor), CSS safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `env(safe-area-inset-left)`, `env(safe-area-inset-right)`) are automatically added to the letterbox padding to protect against device notches, home bars, and dynamic islands.
- **HiDPI & Mobile Fill Rate Protection:** Canvas backing store scales with `devicePixelRatio` (strictly capped at `Math.min(window.devicePixelRatio || 1, 2.0)` to safeguard mobile battery life and GPU thermal throttling).

---

## 3. Canonical UI Wireframes (from PREPRODUCTION.md §7)

### 3.1 HUD Layout
```text
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
```

### 3.2 Level-Up Card Draft (Simulation Paused)
```text
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
```

### 3.3 Pause & Results Screens
```text
PAUSE                         RESULTS
+-----------------+           +--------------------------------+
|     PAUSED      |           |  CHAPTER 2 - VICTORY   Rank: A |
|  > Resume       |           |  Score 12,480   Time 12:41     |
|    Restart      |           |  Unlocked: Coil Arc            |
|    Settings     |           |  Retries used: 1               |
|    Title        |           |  [Continue] [Replay] [Title]   |
+-----------------+           +--------------------------------+
```

---

## 4. UI Components & Screen Specifications

### 4.1 Title Screen
- **Menu Items:** Start / Continue (resumes campaign progress), Chapter Select (lists completed/unlocked chapters), How to Play, Settings, Field Ledger, Credits/Notices.
- **Desktop Keyboard Advisory:** On narrow touch-enabled devices, an explicit banner displays: *"NIGHTBLOOM is designed for desktop browser play with a keyboard. Touch controls and gamepad are not supported in v1."*

### 4.2 HUD Elements
1. **Health Display:** Visual health gauge accompanied by high-contrast numerical readout (`82/100`). White hit flash on damage; pulse animation when below 25% HP.
2. **XP Bar & Level:** Bottom-spanning gauge showing progress to the next level-up threshold.
3. **Objective & Countdown:** Displays the active phase objective (`survive_timer`, `defend_entity`, `collect_item`, etc.) with remaining time or target health integrity.
4. **Defeated Counter:** Real-time count of enemies defeated during the chapter run.
5. **Ability Slots:** Three ability slots at bottom-left:
   - Slot 1: Signal Flare (permanent base weapon).
   - Slots 2 & 3: Unlocked active/passive abilities (Coil Arc, Bloomguard, Wren).
   - Dedicated active cooldown indicator for Beacon Pulse (Spacebar).
6. **Boss Health Bar:** Appears during Chapter 5 Phase 4 at top-center, displaying Stormroot's health and phase transition markers (66% and 33%).
7. **Radio Dialogue Overlay:** Displays speaker name, layered vector portrait thumbnail, and caption text at bottom-center. Automatically clears after its duration.

### 4.3 Level-Up Modal
- Simulation pauses completely.
- Presents 3 distinct upgrade cards generated by seeded RNG.
- Card descriptions dynamically display the exact calculated stat (e.g. *"+20% Signal Flare damage (now 12)"*).
- Fallback cards: **Field Rations** (heal 25% max HP) and **Score Bonus** cards populate the modal if fewer than 3 valid upgrades remain.
- **Keyboard Navigation:** Keys `1`, `2`, `3` or Arrow Keys + `Enter` to select; Key `R` to Reroll (1 per chapter); Key `S` to Skip.
- Rejects double-picks via state machine logic.

### 4.4 Defeat & Results Screens
- **Defeat Options:**
  1. **Retry from Phase N:** Restores the phase-start snapshot (player stats, XP, abilities, score) and restarts the phase clean.
  2. **Restart Chapter:** Restarts from Phase 1 of the current chapter.
  3. **Title:** Returns to the main menu.
- **Victory Results:**
  - Final Score, Chapter Clear Time, Retries Used.
  - Calculated **Rank Letter: S, A, B, or C** based on config thresholds.
  - Unlock banner for newly earned abilities or ledger entries.
  - Buttons: Continue (proceeds to next chapter), Replay Chapter, Return to Title.

### 4.5 Vector Portrait Presentation System (from CHARACTERS.md §8)
- **Layered Vector Part Assembly:** Illustrated character portraits are drawn in code via layered vector paths (face base, hair, accessories/goggles, expression lines) styled with theme tokens, requiring zero external raster textures.
- **Three Emotion States per Character:**
  - **Mira Vale:** Neutral (calm, level gaze), Worried (brows drawn together), Relieved (subtle smile).
  - **Dr. Sela Rowan:** Neutral (thoughtful, glasses), Worried (hand near mouth), Relieved (eyes closed, exhale).
  - **Tavi Rook:** Neutral (half-smirk, goggles pushed up), Worried (goggles pulled down), Relieved (broad grin).
  - **Warden Idris Kael:** Neutral, Worried, Relieved (voice and radio thumbnail).
- **Caption Layout & Timing:**
  - Layout: Layered portrait on left, speaker title label above, dialogue text body on right.
  - Display Duration: Dynamically calculated based on word count (config words-per-second rate); minimum duration **2.5 s**, maximum duration **7.0 s**.
  - Interaction: Story cards are skippable via `Enter` or `Space`. Reduced Motion mode disables slide-in transitions.

---

## 5. UI Design Tokens & Theme System

Visual styling uses semantic token roles rather than arbitrary hardcoded hex codes. Theme tokens are defined in `src/content/theme/` and shared between React CSS and Canvas drawing routines:

### 5.1 Color Roles (Tokens, not Hardcoded Hex)
- **Ground & Flora:** Deep blue-green ambient palette tokens (`groundBase`, `floraPatch`, `waterMargin`).
- **Friendly Signal & Player:** Cyan accent tokens (`playerBody`, `playerLamp`, `flareTrail`).
- **Hostile Entities & Danger:** Amber tokens (`hostileCore`, `telegraphWarning`, `dangerRing`), always paired with shape/outline cues.
- **XP & Pickups:** Mint green tokens (`seedCore`, `seedHalo`).
- **Health:** Warm red token (`healthGaugeFill`), always paired with icon and numerical text.
- **Panels & Overlays:** Translucent dark panel tokens (`surfaceOverlay`, `surfaceCard`, `panelBorder`).
- **High-Contrast Palette Tokens:** Monochromatic overrides ensuring maximum luminance separation.

### 5.2 Typography
- Open-license web fonts (e.g., OFL fonts) bundled locally to ensure zero external network calls:
  - Sans-serif display face for HUD counters, titles, and card headers.
  - Clean monospace face for timer readouts, health ratios, and debug metrics.

---

## 6. Accessibility & Inclusivity Standards (WCAG 2.2 AA)

1. **Luminance Contrast:** All UI text maintains at least `4.5:1` contrast against panels. Gameplay elements maintain at least `3:1` contrast against ground terrain across all chapter lighting themes.
2. **Dual-Channel Telegraphing:** Threats never rely on color alone:
   - Hostile = pointed silhouette, dark border, amber core.
   - Friendly = soft, rounded silhouette in cyan/mint.
   - Telegraphs = hatched ground patterns with shrinking inner countdown rings.
3. **Motion & Flash Accommodations:**
   - **Screen Shake Toggle:** On/Off in settings.
   - **Reduced Flashes Toggle:** Replaces white screen flashes with steady borders; disables strobe i-frame blinking in favor of steady 50% opacity.
   - **Reduced Motion:** Disables decorative card slides and floating oscillations.
4. **Keyboard Operability:** 100% of menus, settings toggles, dialogs, and upgrade cards are navigable using `Tab`, `Shift+Tab`, `Arrow keys`, `Enter`, and `Escape` with high-visibility focus indicators.
5. **Touch Target Sizing & Spacing (Mobile Wrapper Readiness):** All interactive UI elements (upgrade cards, menu buttons, settings toggles, modal actions, and pause buttons) enforce a minimum hit target of at least **48×48 px** (or 48×48 px touch envelope via CSS padding per WCAG 2.5.5 / 2.5.8). This ensures thumb-friendly usability on Day 1 for mobile web and Capacitor wrappers without requiring UI redesigns.

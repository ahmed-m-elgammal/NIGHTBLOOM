# CLAUDE.md — NIGHTBLOOM: The Last Signal

> **Notice:** This document is mirrored with [AGENTS.md](file:///c:/Users/A-Dev/Downloads/game/AGENTS.md). All AI coding agents must strictly adhere to the rules below.

---

## 1. Source & Specification Documents

| Document | Primary Purpose & Authority |
|---|---|
| `spec/System Architecture Document (SAD).md` | System layers, state machines, engine contracts, module boundaries, extension playbooks. |
| `spec/Technical Design Document (TDD).md` | Canvas 2D render pipeline, spatial hash, weapon math, Web Audio synthesis, game feel constants. |
| `spec/UX Specification and UI Design System.md`| Wireframes, HUD layout, theme tokens, WCAG 2.2 AA accessibility, 48×48 px touch targets. |
| `spec/Data Model and API Specification.md` | Zod schemas, content packs, save documents, migrations, referential integrity. |
| `spec/Project Roadmap and Milestones.md` | 12 phase-gated milestones, review checkpoints, empirical playtest gates. |
| `spec/QA_TEST_PLAN.md` | Test execution matrix, headless bot balance suite, acceptance criteria checklist. |
| `spec/Product Requirements Document (PRD).md` | Vision, functional requirements, performance budgets, release criteria. |
| `GDD.md`, `STORY_BIBLE.md`, `CHARACTERS.md` | Canonical lore, character voice, chapter dialogue, and starting game design values. |

**Conflict Precedence:**
- `GDD.md` and `spec/` win for gameplay mechanics and math.
- `STORY_BIBLE.md` wins for story logic, lore, and chapter scripts.
- `CHARACTERS.md` wins for character profiles and bark voice.
- `ARCHITECTURE.md` and `spec/System Architecture Document (SAD).md` win for code structure and layer boundaries.

---

## 2. Platform & Phased Rollout Strategy

1. **Phase 1 — Web-First Validation (v1):**
   - Self-contained, single-player, offline desktop web browser game (Chrome, Firefox, Safari, Edge).
   - Desktop keyboard-first (WASD / Arrow Keys + Spacebar).
   - Validates retention, pacing, feel, and balance with zero gatekeepers and zero distribution overhead.
2. **Phase 2 — Mobile App Deployment (Post-Validation):**
   - Clean port to **React Native + Expo + Skia** (native 60–120 FPS mobile build) or instant packaging via **Capacitor** native wrapper.
   - The pure TypeScript simulation layer is architected to run on mobile with **zero code rewrites**.

---

## 3. Technology Stack (Strictly Fixed)

- **Frontend & App Shell:** React 18+, TypeScript (`strict: true`), Vite.
- **Game World Rendering:** HTML5 Canvas 2D (`CanvasRenderingContext2D`). Zero external game engines (no Godot, Unity, Pixi.js, or Phaser).
- **Audio Engine:** Procedural Web Audio API oscillator synthesis (zero external audio binary dependencies).
- **State & Schema Validation:** Zod schemas for all content packs, wave definitions, and save documents.
- **Testing:** Vitest (unit & integration tests), Playwright (E2E browser smoke tests), Node.js (headless balance bot).
- **Linting & Formatting:** ESLint with `@typescript-eslint` and strict import boundaries; Prettier.
- **Package Manager:** `npm`. Ask before adding any new third-party dependency.

**Required npm Scripts:** `dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `test:e2e`, `validate:content`, `test:bot`.

---

## 4. Anti-AI Slop Mandates (Zero Tolerance)

To prevent code degradation, boilerplate bloat, and broken architectures, every agent MUST abide by these absolute rules:

1. **Zero Incomplete Code or Placeholders:**
   - NEVER write `// TODO: implement later`, `// Placeholder`, or dummy mock classes in production files.
   - Every file created or edited must be fully implemented, syntactically valid, and actively wired into the application.
2. **Zero Type Escapes:**
   - `strict: true` is non-negotiable.
   - NEVER use `any`, `as unknown as Foo`, `@ts-ignore`, or `@ts-nocheck` to bypass type errors. Fix the underlying type signature.
3. **No God Files (Max ~300 Lines):**
   - NEVER put the entire game in `App.tsx`, a giant `Game.tsx`, or a mega-manager.
   - Adhere strictly to the modular directory layout in Section 6. If a file approaches 300 lines or takes on unrelated duties, decompose it immediately into focused sub-modules.
4. **Strict Simulation Purity (ESLint Enforced):**
   - Files in `src/game/simulation/` MUST be 100% pure TypeScript.
   - ZERO imports from React, DOM APIs (`window`, `document`), Canvas 2D, or Web Audio.
   - The simulation must run identically in a browser Canvas and headlessly in Node.js/Bun.
5. **Throttled Snapshots (The 10 Hz React Bridge):**
   - React NEVER re-renders at 60 FPS.
   - React components only receive an immutable `HudSnapshot` at a throttled rate ($\le 10\text{ Hz}$) or on discrete state transitions.
6. **Deterministic Seeded PRNG:**
   - Simulation state advances ONLY through an injected seeded PRNG (mulberry32).
   - NEVER call `Math.random()`, `Date.now()`, or `performance.now()` in simulation logic. Time is derived strictly from the fixed 60 Hz tick counter.
7. **No Arbitrary Code in Content / Upgrades:**
   - Upgrade effects follow a safe, typed modifier enum: `add`, `multiply`, `grant_ability`, `set_flag`. NEVER store executable strings or `eval` functions in data.
8. **No Hallucinated Balance or Magic Numbers:**
   - Every enemy HP, speed, damage, and XP value must come directly from config tables or the mathematical model in the spec. No made-up arbitrary values.

---

## 5. Mobile-Readiness Architectural Standards

To ensure immediate compatibility with React Native + Expo and Capacitor wrappers:

1. **Normalized Directional Vectors:**
   - `InputManager` must emit normalized movement vectors (`{ x: number, y: number }`, clamped to $\text{length} \le 1.0$).
   - Expose `setActiveMovementVector(vec: Vector2D): void` so an on-screen touch joystick feeds the simulation without altering gameplay logic.
2. **Touch Target Sizing (WCAG 2.5.5 / 2.5.8):**
   - All interactive UI elements (upgrade cards, menu buttons, settings toggles, modal actions, pause controls) must enforce a minimum hit target of at least **$48\times 48\text{ px}$** (or a $48\times 48\text{ px}$ touch envelope via padding).
3. **Safe-Area Insets & Viewport:**
   - Viewport is locked to **1280×720** logical pixels with uniform letterboxing/pillarboxing on non-16:9 displays.
   - UI containers must respect CSS safe-area insets (`env(safe-area-inset-top)`, etc.) to protect against notches and dynamic islands.
4. **HiDPI & Thermal Throttling Cap:**
   - Canvas backing store scales with `devicePixelRatio` strictly capped at `Math.min(window.devicePixelRatio || 1, 2.0)` to safeguard mobile GPU fill-rates and battery life.
5. **Lifecycle Auto-Pause & Audio Suspension:**
   - Listen to `document.addEventListener('visibilitychange')`.
   - When hidden (app switched, phone call, device locked): immediately pause the simulation and call `AudioService.suspend()`.
   - When returning to visible: clamp the rAF accumulator delta to max $100\text{ ms}$ (preventing the spiral of death) and require player confirmation to resume.

---

## 6. Canonical Directory Layout

```text
src/
  app/                 # App shell, top-level screen router, providers
  game/
    core/              # GameController, rAF loop, fixed clock, typed event bus
    simulation/        # Pure TS: combat, spatial hash, spawning, XP, upgrades, objectives, barks
    entities/          # Player, enemies, boss, projectiles, pickups (data models & state)
    input/             # InputManager, keyboard bindings, normalized vector translation
    rendering/         # Canvas renderer, camera follow, procedural sprite factory/atlas, effects
    content/           # Schemas, Zod validators, chapter/enemy/ability/upgrade registry data
  ui/
    screens/           # Title, briefing, game overlay, pause, level-up modal, results, settings, ledger, credits
    components/        # HUD bars, upgrade cards, vector icons, buttons, banners, character portraits
  content/
    locales/           # en.ts localized string catalog (keyed by stable string IDs)
    theme/             # Named color, spacing, radius, and typography tokens (shared by DOM & Canvas)
  assets/              # manifest.ts, procedural sprite recipes, font loaders
  services/            # AudioService (Web Audio synthesis), AssetLoader, SettingsService, SaveService
  storage/             # LocalStorageAdapter, MemoryAdapter, save schemas, safe migrations
  styles/              # Global reset, typography, token-derived CSS variables
  tests/
    unit/              # Vitest unit tests (math, collision, RNG, upgrades, migrations)
    integration/       # Vitest integration tests (full chapter simulation, headless runs)
    e2e/               # Playwright browser smoke tests
```

---

## 7. Workflow & Phase-Gated Discipline

1. **One Milestone at a Time:**
   - Execute strictly in the order defined in [Project Roadmap and Milestones.md](file:///c:/Users/A-Dev/Downloads/game/spec/Project%20Roadmap%20and%20Milestones.md) (or `MILESTONE_PROMPTS.md`).
   - Never begin Milestone N+1 until Milestone N passes all quality gates and is approved by the user.
2. **Quality Gate Checklist Before Milestone Completion:**
   - [ ] `npm run typecheck` passes with 0 errors.
   - [ ] `npm run lint` passes with 0 warnings.
   - [ ] `npm run test` passes 100% of unit/integration tests.
   - [ ] `npm run validate:content` passes all Zod schemas and referential integrity checks.
   - [ ] `npm run build` succeeds, enforcing the production bundle budget ($\le 350\text{ KB}$ gzipped).
3. **Atomic Milestone Reports:**
   - After completing each milestone, provide a concise summary of what was built, verification command output, and known limitations.
   - **Stop and wait for the user's manual review and approval before touching code for the next milestone.**

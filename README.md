# NIGHTBLOOM: The Last Signal

> *"A signal is only worth sending if someone is listening."*

A self-contained, single-player desktop web browser game built in React, TypeScript (`strict: true`), Vite, and pure HTML5 Canvas 2D.

---

## 1. Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm 9+

### Installation & Development
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run strict TypeScript typecheck
npm run typecheck

# Run unit tests (Vitest)
npm run test

# Build production bundle
npm run build
```

---

## 2. Controls & Navigation

| Action | Desktop Keyboard | Mobile Touch / Joysticks |
|---|---|---|
| **Move Mira** | `W`, `A`, `S`, `D` or `Arrow Keys` | Virtual Joystick (normalized vector) |
| **Pause / Resume** | `Escape` | On-screen Pause button |
| **Beacon Pulse** | `Spacebar` | Pulse active button (Milestone C) |

---

## 3. Architecture & Anti-Slop Discipline

- **Fixed 60 Hz Simulation:** `GameController` advances with a fixed timestep accumulator and 100 ms delta clamp to prevent spiral-of-death drops on tab switches.
- **Throttled React Bridge:** React components only receive immutable snapshots at $\le 10\text{ Hz}$ or on discrete state transitions.
- **Pure Simulation Layer:** Entity data models in `src/game/entities/` and simulation logic in `src/game/simulation/` are 100% pure TypeScript with zero DOM/Canvas/Audio dependencies.
- **Design Tokens & Theme System:** All visual styling strictly consumes semantic tokens in `src/content/theme/tokens.ts` and `src/styles/tokens.css`. Zero hardcoded hex or arbitrary colors.
- **String Catalog:** All dialogue, labels, and notes are localized in `src/content/locales/en.ts` and referenced by stable string IDs.
- **Deterministic Seeded PRNG:** `SeededRNG` (mulberry32) guarantees reproducible runs without calling `Math.random()`.

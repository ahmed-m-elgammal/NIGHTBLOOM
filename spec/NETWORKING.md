# NIGHTBLOOM: The Last Signal — Networking & Offline Architecture

**Project Name:** NIGHTBLOOM: The Last Signal  
**Core Model:** Offline-First, Single-Player Browser Application (Zero Network Requests at Runtime)  
**Document Status:** Approved Specification v1.0  
**Authority:** This document expands `ARCHITECTURE.md` Section 1, Section 8, and Section 9. On any conflict, `ARCHITECTURE.md` wins.

---

## 1. Architectural Reality: Zero Network Overhead

*NIGHTBLOOM: The Last Signal* v1 is strictly an **offline, single-player desktop web game**.

### 1.1 Core Principles
1. **Zero Runtime Requests:** Once application assets (HTML, bundle JS, procedural definitions) are loaded by the browser, the runtime issues **zero network requests**.
2. **No Backend Servers:** There are no dedicated game servers, matchmaking lobbies, cloud databases, or microservice APIs in v1.
3. **No Telemetry, No Analytics, No Cookies:** The game respects user privacy completely. No tracking pixels, Google Analytics, telemetry pings, or marketing cookies are used.
4. **Local Deterministic Authority:** The client's pure TypeScript simulation is the sole authority on all gameplay calculations (movement, enemy behaviors, projectile collisions, XP progression, and win/loss states).

---

## 2. Determinism, Seeded RNG & Headless Execution

Because all gameplay logic lives in pure TypeScript with zero DOM/Canvas dependencies, determinism is maintained without network synchronization:

### 2.1 Seeded PRNG Contract (mulberry32)
Randomness in all gameplay systems (wave spawning, card selection, enemy aim, seed drift) consumes an injected seeded pseudo-random number generator (e.g. mulberry32):
- Simulation modules never invoke `Math.random()`, `Date.now()`, or `performance.now()`.
- Simulation time is derived exclusively from the internal tick counter ($t = \text{tick} \times \frac{1}{60\text{ s}}$).
- Given the identical integer seed and input command sequence, two runs will produce the exact same simulation state down to the floating-point value.

### 2.2 Replay Recording & Headless Verification
Rather than streaming multiplayer network packets, the determinism model powers:
1. **Replay Recorder (F9 in Dev Mode):**
   - Captures the initial match seed and the per-tick stream of user input commands (`move_input`, `use_pulse`, `choose_upgrade`).
   - Exports a compact JSON log ($< 50\text{ KB}$ for an entire 15-minute run).
2. **Automated Headless Balance Testing:**
   - The balance bot executes 30+ seeds per chapter in headless Node.js/Bun environments without browser rendering overhead.
   - Replays can be fed back into the engine to reproduce edge-case bugs and verify difficulty targets.

---

## 3. Network Isolation & Privacy Verification (CI Gate)

To guarantee that the game remains completely offline and privacy-respecting:

### 3.1 Playwright Network-Blocked E2E Test
An automated end-to-end integration test runs in CI on Chromium:
```typescript
test('verifies zero network requests during full chapter gameplay', async ({ page }) => {
  const networkRequests: string[] = [];

  // Track all network traffic after initial page load
  page.on('request', request => {
    networkRequests.push(request.url());
  });

  await page.goto('/');
  await page.waitForSelector('#app-ready');

  // Clear initial asset load records
  networkRequests.length = 0;

  // Simulate starting chapter 1 and playing for 10 seconds
  await page.keyboard.press('Enter'); // Dismiss intro
  await page.waitForTimeout(3000);

  // Assert that zero external requests (telemetry, pings, ads) were made
  expect(networkRequests).toEqual([]);
});
```

### 3.2 Content Security Policy (CSP)
Production static hosting includes strict CSP headers preventing unapproved network outbound connections:
```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'none'; img-src 'self' data:; audio-src 'self';
```
`connect-src 'none'` guarantees that neither the game nor any third-party script can establish WebSocket, Fetch, or XMLHttpRequest connections.

---

## 4. Future Plug-In Extension Points (Non-Goals for v1)

As documented in `ARCHITECTURE.md` Section 9, several network-related features are non-goals for v1, but the architecture provides clean interfaces where they can plug in later without modifying engine internals:

| Future Capability | Plug-In Point | Engine Impact |
|---|---|---|
| **Cloud Save Sync** | Implement a cloud-backed `StorageAdapter` (e.g. `CloudStorageAdapter`) that implements `read()`, `write()`, and `remove()`. `SaveService` swaps adapters without touching game simulation. | None. Storage is decoupled behind `IStorageAdapter`. |
| **Global Leaderboards** | A post-game results hook that submits the run log (seed + command stream) to an external verification endpoint. | None. Triggered by event listener on `run_finished`. |
| **Telemetry (Opt-In)** | An event-queue consumer listening to simulation events, activated only if the user explicitly enables it in Settings. | None. Plugs into existing event bus. |
| **Dedicated Server Co-op** | Because `src/game/simulation/` is 100% pure TypeScript with zero browser dependencies, it can be hosted in Node.js/Bun to run an authoritative server loop, receiving client command inputs and broadcasting state snapshots. | None to core simulation logic; requires adding client network transport adapters. |

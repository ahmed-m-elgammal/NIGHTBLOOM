# Pre-B Visual Foundation Plan

**Status:** PB-6 and PB-7 implemented in the working tree; user review pending. Workstreams 1 and 2 remain gated; PB-8 has not started.
**Last updated:** 2026-10-20 (PB-6/PB-7 implementation checkpoint)
**Scope:** Workstream 1 — atlas DPR and renderer seams; Workstream 2 — flora L-system spike; Workstream 3 — pre-B viewport, HUD and accessibility hardening, including the opening-frame readability gate.
**Authority:** `AGENTS.md` §4–7; `docs/ART_BIBLE.md`; `docs/ASSET_MANIFEST.md`; `spec/Technical Design Document (TDD).md` §1.1, §1.3 and §5; `spec/UX Specification and UI Design System.md` §2–6; `spec/Project Roadmap and Milestones.md`.
**Approval gate:** PB-6 and PB-7 were authorized for implementation and are now awaiting review. The live audit in §6 remains the historical baseline; §11 records the implementation checkpoint. Do not begin PB-8 or Workstream 1 until the shell/accessibility checkpoint is approved. Do not integrate Workstream 2 into production until the spike is reviewed.

---

## 0. Plan at a glance

| Workstream | Goal | Production code? | Output |
|---|---|---|---|
| 1. Atlas DPR + renderer seams | Make all atlas sprites sharp at DPR 2 without changing logical draw sizes; remove baked props/landmarks from the ground cache; split files that are at or near 300 lines | Yes, pre-B visual foundation only | New buffer contract, migrated sprite recipes, split renderer/lighting/staging files, tests, manual DPR QA |
| 2. Flora L-system spike | Replace the three fixed flower sprites conceptually with eight seeded, silhouette-first variants across three size classes | No; spike code only | `spikes/flora-lsystem/` preview, generator tests, variant table, integration recommendation |
| 3. Pre-B viewport, HUD and accessibility hardening | Make the 1280×720 logical stage scale uniformly; apply the 64/36 safe area and UX-specified HUD placement; fix settings/modal focus and target sizes; prove opening-frame landmark and Mira readability | Yes, pre-B shell and visual gates only | Shared stage helper, safe-area HUD, settings/focus fixes, measured opening-frame QA |

The order is deliberate:

1. Approve docs, the art bible, the manifest and this plan, including the live audit in §6.
2. Ship the shell/accessibility part of Workstream 3 (PB-6 and PB-7), because it removes clipping and unusable controls before any art review.
3. Ship Workstream 1 and pass its quality gate.
4. Ship the opening-frame/readability part of Workstream 3 (PB-8) after the atlas, prop and landmark draw order are stable.
5. Build and review Workstream 2 as a spike.
6. Approve the spike, then integrate flora into production.
7. Begin Milestone B.

No Old Core, weather, enemy wiring, or gameplay changes are part of this plan.

---

## 1. Current baseline

Verified against the working tree on 2026-10-20.

| Area | Current state | Consequence |
|---|---|---|
| Atlas | 21 buffers: 12 Mira frames, 1 beacon, 3 flora, 3 props, 2 landmarks | Small enough to pre-render at boot |
| Sprite buffers | `createBuffer()` lives in `CharacterSprites.ts` and creates 1× canvases | Sprites are upscaled by the DPR-scaled renderer and soften at DPR 2 |
| `SpriteFactory` | Static atlas built once; stores `HTMLCanvasElement` values | No logical-size metadata; draw calls use `sprite.width`, which is the backing width |
| Renderer | `Renderer.ts` is 204 lines; draws ground, flowers, beacon, player, lighting, vignette | Will grow when props/landmarks move out of the ground cache |
| Ground cache | 3200×2400 at 1×, about 30.7 MB; bakes props and landmarks | Props/landmarks blur and cannot animate or y-sort |
| Lighting | `LightingPass.ts` is 287 lines; 1280×720 masks at 1× | Soft masks are acceptable at 1×, but the file has little headroom |
| Staging | `staging/EnemySprites.ts` is 296 lines for five enemies | Must split before Milestone B wiring |
| Flora | Three fixed variants: 64/96/128 buffers, 5/7/9 blossoms; `Renderer` ignores patch `radius` and `petals` | Visible repetition across 41 patches |
| Tests | Only `src/tests/unit/rng.test.ts`; no renderer or buffer tests | New buffer math and draw-size rules need unit coverage |
| Typecheck scope | `tsconfig.json` includes `src` only | `staging/` and `spikes/` are not covered by `npm run typecheck` |
| E2E/content gates | `test:e2e` and `validate:content` are echo stubs | They cannot be cited as visual or content evidence |
| UI shell | Each screen owns `.viewport-frame`; no shared 1280×720 stage; HUD margins are 24/16; dossier scrolls at 1024 | Workstream 3 fixes the shell, safe area and measured opening frame |

### Current draw-size assumptions

- Mira buffer: 64×64 logical; visible silhouette about 40 px tall.
- Beacon buffer: 160×160.
- Flora buffers: 64×64, 96×96, 128×128.
- Harvester: 120×84; pylon: 64×96; sensor: 48×64.
- Glasshouse: 220×140; cold frames: 190×150.
- Ground cache: 3200×2400; viewport: 1280×720; DPR cap: 2.0.

These are the sizes that must not drift.

---

## 2. Scope and non-goals

### In scope

- A typed `SpriteBuffer` contract with logical dimensions and a 2× backing store.
- A separate 1× canvas helper for full-screen and ground caches.
- Migration of every production sprite recipe and the atlas to the new contract.
- Logical-size draw helpers used by the renderer.
- Removal of props and landmarks from the baked ground cache; per-frame drawing from the atlas.
- Splitting `Renderer.ts`, `LightingPass.ts` and `staging/EnemySprites.ts` where the work touches them.
- Unit tests for DPR clamping, backing-size math, and logical draw-size math.
- Manual DPR and visual-regression checks.
- A shared 1280×720 logical stage that scales uniformly inside the 16:9 frame, with no screen-level clipping or unintended scrollbars.
- The 64 px horizontal / 36 px vertical HUD safe area; the bottom-left ability dock required by UX §4.2 stays in that corner and moves inside the safe area.
- Settings and modal focus/target fixes: 48×48 logical px hit envelopes (38.4 physical at the 0.8 stage scale; 1280×720 is the authored desktop target), visible focus, state-aware Escape, dialog semantics.
- A measured opening-frame gate for one readable hero landmark, a readable prop and Mira silhouette contrast.
- A standalone flora L-system spike with eight variants and a preview harness.

### Out of scope

- Changing gameplay, balance, spawns, collision, or save data.
- New enemies, projectiles, pickups, telegraphs, Old Core stages, or weather.
- Bottom-center pivots and y-sorting. These remain a separate pre-B task; this plan only removes the reason props/landmarks cannot be y-sorted later.
- Replacing the flora in production. Workstream 2 is a spike until approved.
- Adding dependencies, fonts, raster assets, image generation, p5.js, WebGL, or a game engine.
- New title-screen world art, new portraits, audio volume/rebinding, or the full Milestone F1/F2 content pass. These are recorded in §6.8 and remain milestone-owned.
- Splitting every file over 200 lines. Only files touched by this work.

---

## 3. Architecture decisions

### D1 — Atlas backing scale is fixed at 2×

**Recommendation:** every sprite buffer is 2× its logical size. The render target still uses `Math.min(devicePixelRatio || 1, 2.0)`.

Why fixed 2×:

- At DPR 2, one sprite pixel maps to one device pixel: sharp.
- At DPR 1, the 2× image downsamples cleanly: no visible softness.
- The atlas is small: the current 21 buffers total roughly 184k logical pixels, or about 3 MB at 2× RGBA. A 2× atlas is affordable.
- No atlas rebuild when the window moves between monitors or browser zoom changes DPR.
- Screenshots and review builds are deterministic across machines.

Alternative considered: `scale = min(devicePixelRatio, 2)` at boot. This saves about 2–3 MB at DPR 1 but requires rebuilding the atlas when DPR changes. Not recommended for this pass.

**Open decision:** confirm fixed 2×. If adaptive scale is required, every sprite recipe needs a scale parameter and `SpriteFactory` needs a rebuild path.

### D2 — Separate sprite and full-screen buffer helpers

`createBuffer()` currently serves two different needs: small sprites and full-screen/ground caches. Do not make it globally DPR-aware.

- `createSpriteBuffer(width, height)` creates a 2× backing store and returns logical dimensions.
- `createCanvasSurface(width, height)` creates a 1× canvas for ground and lighting masks.
- All sprite recipes use `createSpriteBuffer`; `GroundRenderer` and `LightingPass` use `createCanvasSurface`.

This avoids a 2× ground cache, which would be 6400×4800, about 123 MB, and avoids changing the lighting mask resolution.

### D3 — Ground cache stays 1×; props and landmarks become per-frame sprites

The ground cache is low-frequency soil, furrows, road, foundation plaza and fence. At 2× it costs about 123 MB. Keep it at 1×.

Move the two landmarks and six props out of the cache. Draw them per frame from the atlas:

- Landmarks: glasshouse, cold frames.
- Props: two harvesters, two pylons, two sensors.
- Draw order: ground cache → flowers → landmarks/props → beacon → player → lighting.
- Use viewport culling.
- This makes props/landmarks sharp at DPR 2 and removes the baked-art blocker for future y-sorting. The draw order matches `docs/ART_BIBLE.md` and the TDD: flowers are environment underlayer, props and landmarks sit above them, and grounded entities sit above props.
- The first draft of this plan had props below flowers. That could allow flower patches to cover the harvester, pylon and sensor; the live audit (§6, AUD-07) shows the prop layer does not read at spawn. PB-3 must use the corrected order.

**Tradeoff:** the soil texture itself remains 1×. It is low-frequency and acceptable for this pass. A tiled high-DPI ground cache is a later optimization, not part of this plan.

### D4 — Draw helpers use logical dimensions, never backing dimensions

All centered draws go through a helper that uses `sprite.logicalWidth` and `sprite.logicalHeight`. Direct use of `sprite.canvas.width` for positioning is forbidden; that value is the 2× backing width.

### D5 — Split by responsibility, not by line count alone

- `Renderer.ts` becomes an orchestrator.
- Flower/beacon/player drawing moves to `WorldEntityRenderer.ts`.
- Landmark/prop drawing moves to `WorldPropsRenderer.ts`.
- Lighting stamps/caches move to `LightingCache.ts`; `LightingPass.ts` keeps the composite and light pool.
- Enemy staging splits by enemy family.
- No behavior changes are bundled with a split. If a split changes pixels, revert the split and keep the buffer migration.

### D6 — Tests cover math, not Canvas

Vitest runs in Node and has no Canvas implementation. Do not add `canvas` or `jsdom` dependencies. Test pure functions:

- DPR clamping.
- Backing-size rounding.
- Logical draw width and centered X/Y.
- Sprite scale cap.

Visual sharpness and draw-size preservation are verified manually at DPR 1, 1.5 and 2.

---

## 4. Workstream 1 — Atlas DPR and renderer seams

### 4.1 Target file layout

```text
src/game/rendering/
  SpriteBuffer.ts          # new: contracts, 1x/2x constructors, draw helpers
  RenderDpr.ts             # new: pure DPR clamp helper, or fold into SpriteBuffer.ts
  SpriteFactory.ts         # migrated atlas types
  Renderer.ts              # orchestrator only
  WorldEntityRenderer.ts   # new: flowers, beacon, player
  WorldPropsRenderer.ts    # new: landmarks, harvesters, pylons, sensors
  GroundRenderer.ts        # static ground only
  LightingPass.ts          # composite and light pool
  LightingCache.ts         # new: stamps, light buffer, vignette
  CharacterSprites.ts      # Mira; no buffer helper
  BeaconSprite.ts
  FloraSprites.ts
  PropSprites.ts
  LandmarkSprites.ts
  MiraHeadRenderer.ts

staging/enemies/
  index.ts
  SeedlingSprites.ts
  BloomedSeedlingSprites.ts
  ThornrunnerSprites.ts
  RustwingSprites.ts
  BriarheartSprites.ts
```

`staging/EnemySprites.ts` may remain as a thin re-export barrel so existing references keep working.

### 4.2 Buffer contract

```ts
export const SPRITE_SCALE = 2;

export interface CanvasSurface {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly width: number;   // logical; 1x backing store
  readonly height: number;
}

export interface SpriteBuffer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly logicalWidth: number;
  readonly logicalHeight: number;
  readonly scale: number;   // backing pixels per logical pixel
}

export function createCanvasSurface(width: number, height: number): CanvasSurface;
export function createSpriteBuffer(width: number, height: number): SpriteBuffer;
```

Rules:

- `createSpriteBuffer` sets `canvas.width = Math.ceil(width * SPRITE_SCALE)` and the same for height, then calls `ctx.scale(SPRITE_SCALE, SPRITE_SCALE)`.
- Recipes continue to draw in logical coordinates. No recipe coordinate changes.
- `createCanvasSurface` creates a 1× canvas and does not scale the context.
- `SPRITE_SCALE` must be less than or equal to `GAME_CONFIG.viewport.maxDpr`.
- No recipe may read `canvas.width` for layout. Use `logicalWidth` or constants.

Draw helpers:

```ts
export function drawSpriteCentered(
  ctx: CanvasRenderingContext2D,
  sprite: SpriteBuffer,
  x: number,
  y: number,
  scale: number = 1
): void;
```

Implementation must compute scalars and call `drawImage` once; no per-frame object allocation.

### 4.3 Work packages

#### PB-1 — Buffer contract and pure math

**Files:** `src/game/rendering/SpriteBuffer.ts`, `src/game/rendering/RenderDpr.ts`, `src/tests/unit/spriteBuffer.test.ts`.

**Work:**

- Add `CanvasSurface`, `SpriteBuffer`, `SPRITE_SCALE`.
- Add `createCanvasSurface` and `createSpriteBuffer`.
- Add `resolveRenderDpr(devicePixelRatio, maxDpr)` with fallback 1 and cap at `maxDpr`.
- Add `getBackingSize(logical, scale)` using `Math.ceil`.
- Add `getSpriteDrawWidth(logicalWidth, scale)` and `getCenteredDrawX(x, logicalWidth, scale)`.
- Add `drawSpriteCentered`.
- Move `createBuffer` usage out of `CharacterSprites.ts` in PB-2; keep this package compiling.

**Tests:**

- `resolveRenderDpr(undefined, 2) === 1`.
- `resolveRenderDpr(1, 2) === 1`.
- `resolveRenderDpr(1.5, 2) === 1.5`.
- `resolveRenderDpr(2, 2) === 2`.
- `resolveRenderDpr(3, 2) === 2`.
- `resolveRenderDpr(0, 2) === 1` and negative input falls back to 1.
- `getBackingSize(64, 2) === 128`; `getBackingSize(65, 1.5) === 98`; no fractional results.
- `getSpriteDrawWidth(64, 1) === 64`; `getSpriteDrawWidth(64, 0.9) === 57.6`.
- `getCenteredDrawX(100, 64, 1) === 68`; `getCenteredDrawX(100, 64, 2) === 36`.
- `SPRITE_SCALE <= GAME_CONFIG.viewport.maxDpr`.

**Acceptance:** `npm run typecheck`, `npm run lint`, `npm run test` pass. No renderer behavior changes yet.

#### PB-2 — Migrate sprite recipes and atlas

**Files:** `CharacterSprites.ts`, `BeaconSprite.ts`, `FloraSprites.ts`, `PropSprites.ts`, `LandmarkSprites.ts`, `SpriteFactory.ts`, `staging/EnemySprites.ts` (import only).

**Work:**

- Change every sprite recipe to return `SpriteBuffer` and use `createSpriteBuffer`.
- Remove `createBuffer` from `CharacterSprites.ts`.
- Change `SpriteAtlas` fields to `SpriteBuffer`.
- Keep all logical buffer sizes and all drawing coordinates unchanged.
- Keep `SpriteFactory` static boot-time creation.
- Update staging imports so the file still parses; full split is PB-5.

**Acceptance:** Atlas has the same 21 buffers and same logical sizes. Mira, beacon, flowers, props and landmarks look identical at DPR 1, apart from sharpness.

#### PB-3 — Renderer and world props layer

**Files:** `Renderer.ts`, new `WorldEntityRenderer.ts`, new `WorldPropsRenderer.ts`, `GroundRenderer.ts`.

**Work:**

- Remove landmarks/props from `GroundRenderer`; `getGroundCache()` no longer needs the atlas.
- Add `WorldPropsRenderer.draw(ctx, atlas, cameraX, cameraY, viewportWidth, viewportHeight)`.
- Draw landmarks, harvesters, pylons and sensors with `drawSpriteCentered` and viewport culling.
- Preserve the cached layer's per-index transforms: harvester #2 is mirrored, pylon #2 is rotated 0.04 rad, sensors are unrotated. Do not silently normalize the field into repeated upright props.
- Move flowers, beacon and player drawing into `WorldEntityRenderer`.
- `Renderer` keeps camera math, ground blit, layer order, lighting calls and vignette.
- Draw order becomes: ground → flowers → landmarks/props → beacon → player → lighting.
- Keep `Renderer.ts` under 300 lines; target under 160.
- No y-sort, no pivot change.

**Acceptance:** PB-3 does not change any object's configured position or size; it only moves rendering out of the cache. PB-8 may later reposition landmarks as a separate approved art change. Props/landmarks are no longer baked; they are sharp at DPR 2. Flower patches can no longer cover the harvester, pylon or sensor in the spawn frame. Frame time does not regress.

#### PB-4 — Lighting split and 1× surface migration

**Files:** `LightingPass.ts`, new `LightingCache.ts`.

**Work:**

- Replace `createBuffer` with `createCanvasSurface` for stamps, light buffer and vignette.
- Move stamp creation, light-buffer creation and vignette cache into `LightingCache`.
- Keep the public `LightingPass` API used by `Renderer`: `resize`, `setDarknessAlpha`, `setReducedMotion`, `isReducedMotion`, `registerLight`, `compositeAtmosphericLighting`, `drawScreenVignette`.
- Keep `LightingPass` under 300 lines; target under 210.
- Keep lighting masks at 1×. This is deliberate.

**Acceptance:** Visual A/B at darkness 0.60 and 0.75, reduced motion on/off, DPR 1 and 2. The composite, beacon light, flower halos, player lantern, spores and vignette must match the baseline within manual inspection.

**If the split causes any visual difference:** revert only PB-4, keep the import migration in a smaller change, and record the split as deferred.

#### PB-5 — Split staging enemy sprites

**Files:** `staging/EnemySprites.ts`, new `staging/enemies/*.ts`.

**Work:**

- Split by family: Seedling, Bloomed Seedling, Thornrunner, Rustwing, Briarheart.
- Keep `staging/EnemySprites.ts` as a re-export barrel.
- Update `createSpriteBuffer` usage.
- Do not wire into production or add enemy behavior.

**Acceptance:** No production bundle change. The staging files are ready for Milestone B. Note that `staging/` is outside `tsconfig`; this split is reviewed by inspection until B wiring.

### 4.4 File-by-file impact

| File | Change | Risk |
|---|---|---|
| `SpriteBuffer.ts` | New contracts, constructors, draw helper | Low |
| `RenderDpr.ts` | New pure DPR clamp | Low |
| `CharacterSprites.ts` | Remove `createBuffer`; return `SpriteBuffer` | Medium: 12 Mira frames |
| `BeaconSprite.ts` | Return `SpriteBuffer` | Low |
| `FloraSprites.ts` | Return `SpriteBuffer`; no variant redesign | Low |
| `PropSprites.ts` | Return `SpriteBuffer` for 3 props | Low |
| `LandmarkSprites.ts` | Return `SpriteBuffer` for 2 landmarks | Low |
| `SpriteFactory.ts` | Atlas stores `SpriteBuffer` | Medium: all consumers |
| `Renderer.ts` | Orchestrator only; logical draws | Medium |
| `WorldEntityRenderer.ts` | New flowers/beacon/player layer | Medium |
| `WorldPropsRenderer.ts` | New props/landmarks layer | Medium |
| `GroundRenderer.ts` | Remove atlas, props/landmarks; 1× surface | Medium |
| `LightingPass.ts` | Use `LightingCache`; 1× surfaces | High: visual composite |
| `LightingCache.ts` | New stamps/vignette/light buffer | High: visual composite |
| `staging/EnemySprites.ts` | Split and migrate | Low: not in build |
| `src/tests/unit/spriteBuffer.test.ts` | New tests | Low |

### 4.5 DPR and resize behavior

Current behavior:

- `CanvasRenderer.resize` computes `Math.min(window.devicePixelRatio || 1, 2.0)`.
- Canvas backing store is viewport × DPR.
- Context is scaled by DPR.
- Atlas is 1× and is upscaled.

Target behavior:

- Same render-target DPR and same context scale.
- Atlas is 2× fixed.
- `resize()` continues to set canvas backing size and scale.
- `LightingPass.resize` continues to receive logical 1280×720; masks remain 1×.
- No atlas rebuild on DPR change because the atlas is fixed 2×.
- Browser zoom and monitor moves should not change logical draw sizes.

Acceptance checks:

- At DPR 1, Mira is still 64 logical pixels in the draw call; visible silhouette is unchanged.
- At DPR 2, the same draw call produces a sharp 2× sprite.
- At DPR 1.5, no object jumps size or position.
- Resize does not reset camera or player position.

### 4.6 Ground cache strategy

Keep:

- soil base and value patches;
- furrows and clods;
- stubble and stones;
- central road and joints;
- beacon foundation plaza;
- perimeter fence and hazard corners.

Remove:

- glasshouse and cold frames;
- harvesters, pylons, sensors.

Why this is safe:

- All removed objects have fixed world positions in `GAME_CONFIG`.
- They total eight draw calls, negligible per frame.
- Their sprites stay in the atlas and already include contact shadows.
- The ground cache becomes purely static terrain.

Memory:

- Ground cache 1×: 3200 × 2400 × 4 ≈ 30.7 MB.
- Ground cache 2×: ≈ 123 MB. Rejected.
- Render target at DPR 2: 2560 × 1440 × 4 ≈ 14.7 MB.
- Lighting masks at 1×: 1280 × 720 × 4 ≈ 3.7 MB.
- Atlas at 2×: approximately 3–5 MB.

### 4.7 Renderer split

`Renderer.ts` responsibilities after the split:

- constructor and atlas/ground references;
- `resize`;
- camera/viewport calculation;
- clear;
- ground blit;
- call `WorldPropsRenderer`;
- call `WorldEntityRenderer`;
- call `LightingPass` composite and vignette.

`WorldEntityRenderer` responsibilities:

- flower patch culling, pulse and flip;
- beacon sprite, pulse ring and blink;
- player facing, stride, bob and flip.

`WorldPropsRenderer` responsibilities:

- landmarks first, then harvesters, pylons, sensors;
- drawn after the flower layer so flora cannot cover them;
- viewport culling with sprite extents;
- no animation, no y-sort yet.

Pass `reducedMotion` as a boolean from `Renderer`; do not let the entity layer query global settings directly.

### 4.8 Lighting split

`LightingCache`:

- `lightBuffer`, `lightCtx`;
- smooth radial stamp, beacon stamp, flower stamp;
- vignette stamp;
- `resize`, `getLightBuffer`, stamp getters, `drawScreenVignette`.

`LightingPass`:

- settings: darkness alpha, reduced motion;
- 64-light pool and registration;
- composite sequence;
- spores;
- public API delegation to `LightingCache`.

Acceptance:

- same composite order;
- same alpha values;
- same 64-light cap;
- same zero-GC pool behavior;
- no new per-frame allocations.

### 4.9 Staging enemy split

- `SeedlingSprites.ts` — 36×36, two frames.
- `BloomedSeedlingSprites.ts` — 44×44, two frames.
- `ThornrunnerSprites.ts` — 38×30, two frames.
- `RustwingSprites.ts` — 44×44, four rotor frames.
- `BriarheartSprites.ts` — 80×80, two frames.
- `index.ts` re-exports all creators.
- `staging/EnemySprites.ts` re-exports `index.ts`.

No visual changes. No production import. This is preparation for Milestone B.

### 4.10 Test plan

New unit tests:

`src/tests/unit/spriteBuffer.test.ts`

- DPR fallback and cap.
- Backing-size rounding.
- Logical draw width.
- Centered X/Y math.
- Sprite scale cap.

No Canvas API tests in Node. No new test dependencies.

Existing tests:

- `src/tests/unit/rng.test.ts` must keep passing.

Manual visual tests:

- DPR 1: objects match baseline sizes; no blur regression.
- DPR 1.5: no size jumps; no seams.
- DPR 2: Mira, beacon, flowers, props, landmarks are sharp.
- Zoom 100% and 200%.
- Window resize; game restarts cleanly.
- Ground texture remains acceptable at 1×.
- Lighting composite matches baseline.
- 50% brightness and grayscale checks.
- Reduced motion: no pulse drift, no shake changes.

### 4.11 Manual QA matrix

| Check | DPR 1 | DPR 1.5 | DPR 2 | Notes |
|---|---|---|---|---|
| Mira size and silhouette | Required | Required | Required | 64 logical buffer; ~40 px visible |
| Beacon size | Required | Required | Required | 160 logical |
| Flower sizes | Required | Required | Required | 64 / 96 / 128 logical |
| Props and landmarks | Required | Required | Required | Positions remain stable inside this step; final opening-frame targets are approved in PB-8 |
| Ground texture | Required | Required | Required | 1× cache accepted |
| Lighting composite | Required | Required | Required | A/B against baseline |
| HUD and stage | Required | Required | Required | DOM layer scales as one stage; no clipping or scrollbar; see §6.7 |
| Resize and browser zoom | Required | Required | Required | No size jump |
| 50% brightness | Required | — | Required | Value bands hold; record the Mira baseline for PB-8 |
| Grayscale | Required | — | Required | Silhouettes hold; record the Mira baseline for PB-8 |
| Reduced motion | Required | — | Required | No forced pulses |
| Console errors | None | None | None | Must be clean |

Browsers: current Chrome, Firefox, Safari and Edge on desktop.

### 4.12 Performance and memory budget

- Target: 60 FPS at 1280×720 logical, DPR 2.
- New per-frame work: at most 8 prop/landmark draws plus culling.
- No per-frame sprite generation.
- No per-frame object allocation in `drawSpriteCentered`.
- Atlas boot cost: measure before/after. If boot increases by more than 50 ms, investigate.
- Ground cache memory must stay near 30.7 MB, not 123 MB.
- Bundle must stay under 350 KB gzipped.
- No new dependencies.

### 4.13 Quality gates

Run before declaring Workstream 1 complete:

```text
npm run typecheck
npm run lint
npm run lint:colors
npm run lint:tokens
npm run test
npm run build
npm run check:budget
```

Then perform the manual QA matrix.

`npm run validate:content` and `npm run test:e2e` are currently echo stubs. Do not cite them as evidence. Record that they are stubs in the milestone report.

### 4.14 Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Draw sizes double because code uses `canvas.width` | Medium | `logicalWidth` naming, draw helper, code review, visual QA |
| Ground cache memory explodes | Low if D3 followed | Keep 1×; never call `createSpriteBuffer` for the map cache |
| Props/landmarks change draw order | Medium | Fixed layer order; A/B screenshots |
| Lighting split changes pixels | Medium | Separate commit; A/B; revert split if different |
| Atlas boot cost increases | Low | Measure; atlas is small; fixed 2× |
| `createBuffer` import graph breaks | Medium | PB-2 is one atomic migration; typecheck |
| Staging/spikes escape typecheck | High (existing) | Note it; add `typecheck:extras` later if needed |
| Flora spike accidentally integrated | Low | Spike lives in `spikes/`; no production import |
| File line limits exceeded | Medium | Split in PB-3/PB-4/PB-5; lint enforces 300 |
| Browser canvas memory on Safari | Low | Measure memory; atlas is small; ground stays 1× |

### 4.15 Rollback plan

- PB-1 and PB-2 can be reverted together; no save data or gameplay changes.
- PB-3 can be reverted independently; ground cache returns to baked props/landmarks.
- PB-4 can be reverted independently; lighting returns to the 287-line file.
- PB-5 has no production impact and can be reverted without touching the build.
- No migrations, storage keys, or content schemas are touched.

### 4.16 Definition of done

Workstream 1 is done when:

- Every production sprite returns `SpriteBuffer`.
- `SpriteAtlas` stores `SpriteBuffer` values.
- All centered draws use logical dimensions.
- The atlas is 2×; the render target is still capped at DPR 2.
- Ground cache is 1× and contains no props/landmarks.
- Props/landmarks draw per frame in the correct order.
- `Renderer.ts`, `LightingPass.ts` and `staging/EnemySprites.ts` are split and under 300 lines.
- New unit tests pass.
- Manual DPR 1/1.5/2 QA passes.
- No new dependencies.
- Bundle budget passes.
- `docs/ART_BIBLE.md` and `docs/ASSET_MANIFEST.md` gaps are updated: atlas DPR and baked props/landmarks closed; pivot/y-sort still open.

---

## 5. Workstream 2 — Flora L-system spike

### 5.1 Goal

Prove that a seeded, pure L-system generator can produce eight distinct nightbloom silhouettes across three size classes, render them at boot with the production palette, and look better than the current three fixed variants on the production field.

This is a spike. It does not change `GAME_CONFIG`, `SpriteFactory`, `Renderer` or production flora until reviewed.

### 5.2 Constraints

- Pure TypeScript generator; no React, DOM, Canvas, `window`, `document`, `Math.random`, `Date.now`, or `performance.now`.
- Inject the existing `SeededRNG` (mulberry32).
- Pre-render at boot or in the spike; never generate per frame.
- Canvas 2D renderer only.
- `ThemeTokens` only; no hardcoded colors.
- No new dependencies, p5.js, image generation, or raster assets.
- Eight variants across small, medium and large.
- Native sizes: 48, 72, 96. Buffers: 64, 96, 128.
- Five to seven petals per blossom; five to nine blossoms per variant.
- Friendly mint/cyan palette; no amber cores or serrated hostile petals.

### 5.3 Spike layout

```text
spikes/flora-lsystem/
  index.html
  main.ts
  generator/
    types.ts
    variants.ts
    skeleton.ts
    skeleton.test.ts
  render/
    FloraRenderer.ts
    preview.ts
  README.md
```

- `index.html` and `main.ts` are a Vite-served preview. No React.
- `generator/` has no Canvas imports.
- `render/` owns Canvas drawing and preview layout.
- `README.md` records the variant table, commands, screenshots if useful, and the recommendation. Screenshots are review artifacts, not shipped assets.

### 5.4 Data model

```ts
export type FloraSizeClass = 'small' | 'medium' | 'large';

export interface FloraVariantParams {
  id: number;
  sizeClass: FloraSizeClass;
  seed: number;
  iterations: number;
  angleDeg: number;
  lengthDecay: number;
  branchChance: number;
  leafCount: number;
  blossomCount: number;
  petalCount: number;
}

export interface FloraBranch {
  points: ReadonlyArray<{ x: number; y: number }>;
  width: number;
}

export interface FloraLeaf {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation: number;
}

export interface FloraBlossom {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  petals: number;
}

export interface FloraSkeleton {
  branches: FloraBranch[];
  leaves: FloraLeaf[];
  blossoms: FloraBlossom[];
}
```

No Canvas types in `generator/`.

### 5.5 L-system grammar

Use a bracketed stochastic L-system with a turtle interpretation:

```text
Alphabet: F, +, -, [, ], L, B
Axiom: F
Rules (seeded stochastic):
  F -> F[+F]F[-F]F    weight 0.55
  F -> F[+F]LF        weight 0.25
  F -> F[-F]BF        weight 0.20
Turtle:
  F: advance by length
  +: rotate clockwise by angle
  -: rotate counter-clockwise by angle
  [: push position and angle
  ]: pop position and angle
  L: emit leaf
  B: emit blossom
```

Parameters control iterations, angle, length decay, branch chance, leaf count, blossom count and petal count. The generator converts the turtle path into a skeleton; the renderer draws the skeleton. No random calls happen during rendering.

### 5.6 Variant matrix

Initial art targets, not canon or balance values. Final values go into a production `FloraVariants.ts` or `artConfig` after review.

| ID | Size | Seed | Iterations | Angle | Length decay | Blossoms | Petals |
|---|---|---:|---:|---:|---:|---:|---:|
| V0 | Small | 1103 | 3 | 22° | 0.78 | 5 | 5 |
| V1 | Small | 2207 | 3 | 26° | 0.74 | 6 | 6 |
| V2 | Small | 3301 | 4 | 20° | 0.72 | 5 | 5 |
| V3 | Medium | 4409 | 4 | 24° | 0.76 | 7 | 6 |
| V4 | Medium | 5501 | 4 | 28° | 0.70 | 8 | 7 |
| V5 | Medium | 6607 | 5 | 22° | 0.74 | 7 | 6 |
| V6 | Large | 7703 | 5 | 25° | 0.72 | 9 | 7 |
| V7 | Large | 8807 | 5 | 30° | 0.68 | 9 | 6 |

Size mapping:

| Size | Native | Buffer | Variant count |
|---|---:|---:|---:|
| Small | 48 | 64 | 3 |
| Medium | 72 | 96 | 3 |
| Large | 96 | 128 | 2 |

The current 41 patches have `radius` 48–76 and `petals` 6–10. For integration, map radius to size and petals to blossom detail, or add an explicit optional `variant` field. Do not change patch count or positions in the spike.

### 5.7 Rendering rules

- Draw a soft `seedHaloGlow` mist behind the plant, matching current flora.
- Roots/vines use `mossDense`; foliage uses `floraPatch` and `mossFringe`.
- Blossoms use `seedHalo` petals, `seedCore` stamen, `textPrimary` specular.
- Draw at `createSpriteBuffer` 2× logical sizes.
- Keep center pivot for flora; bottom-center is for grounded entities, not environment clusters.
- No hostile amber, no dark hostile outline, no serration.
- Vary silhouette, not just color.
- At 1×, each variant must read as a distinct cluster, not a recolored copy.

### 5.8 Preview harness

`spikes/flora-lsystem/index.html` shows:

- current three production variants;
- eight spike variants at 1×;
- the same eight at 2×;
- a dark-field strip with the production ground color and a light halo;
- a grayscale toggle;
- a side-by-side “patch field” with all 41 positions using the proposed variant selection;
- controls for seed, size class and variant.

Commands:

```text
npm run dev
# open http://localhost:3000/spikes/flora-lsystem/index.html
npx vitest run spikes/flora-lsystem
```

No production route is added.

### 5.9 Tests

`spikes/flora-lsystem/generator/skeleton.test.ts`:

- Same params and seed produce identical skeletons.
- Different seeds produce different skeletons.
- Branch count is bounded.
- All points stay within the buffer bounds.
- Blossom count matches params.
- Petal count stays in the 5–7 range.
- Leaves and blossoms do not overlap the center excessively.
- Importing the generator in Node works without DOM or Canvas.
- No `Math.random`, `Date.now` or `performance.now` in generator source.

Performance check (manual):

- Generate all eight skeletons in under 5 ms in Node.
- Render all eight buffers in under 50 ms in the browser.
- Confirm zero generator work during the rAF loop.

### 5.10 Acceptance

The spike is ready for review when:

- All eight variants are visually distinct at 1×.
- Small, medium and large classes read as different scales, not just different colors.
- The field mock shows no obvious repetition across adjacent patches.
- The generator is pure and deterministic.
- Tests pass.
- The preview runs in Chrome, Firefox, Safari and Edge.
- `README.md` contains the variant table, parameter ranges, commands and a recommendation.
- No production file imports the spike.

### 5.11 Integration plan after approval

Only after explicit approval:

- Promote the pure generator to `src/game/rendering/flora/`.
- Move the Canvas drawing into `FloraSprites.ts`.
- `SpriteFactory` builds eight `SpriteBuffer` variants.
- `Renderer` selects a variant per patch:
  - preferred: explicit optional `variant` on each patch;
  - fallback: stable deterministic hash of patch index/position.
- Use patch `radius` to choose size class and `petals` to influence blossom count, within the approved ranges.
- Keep the current 41 patches and positions.
- Keep the existing lighting halos; do not register a light per patch beyond the current cap.
- Add production unit tests for deterministic variant selection and bounds.
- Update `docs/ART_BIBLE.md` and `docs/ASSET_MANIFEST.md` statuses.
- Re-run all quality gates and the manual DPR matrix.

### 5.12 Risks and mitigations

| Risk | Mitigation |
|---|---|
| L-system looks like noise or a fractal, not nightbloom | Silhouette-first review; cap iterations; hand-tuned variant table |
| Variants are just color swaps | Compare silhouettes in grayscale; require distinct branch/blossom layouts |
| Too much visual noise in 41 patches | Use size weighting; keep small variants in dense areas; preview the full field |
| Performance regression | Pre-render at boot; never generate per frame; measure |
| Palette drift | Tokens only; friendly mint/cyan; no amber cores |
| Generator imports Canvas | Pure module boundary; Node test import |
| Spike leaks into production | No imports from `spikes/` in `src/`; review `git diff` |
| Overlaps pickups or enemies visually | Keep blossom alpha/glow at current levels; review at 1× on the field |

### 5.13 Definition of done

- Eight variants generated from stable seeds.
- Pure generator tests pass.
- Preview compares current vs spike, 1× and 2×.
- Full-field mock shows acceptable variety.
- Recommendation written in `spikes/flora-lsystem/README.md`.
- No production changes.
- Stop for review.

---

## 6. Live Playwright visual and UX audit (2026-10-20)

### 6.1 Verdict

**No — the live build is not yet the game described by the art bible.** It is a coherent dark botanical field-terminal prototype, and several parts are already good. But a first-time player sees a tactical dashboard laid over a very dark, sparse field. The beacon is the strongest object on screen; Mira is one of the weakest. The opening frame hides both hero landmarks. The HUD and secondary screens do not share one logical scale, so the dossier clips on a 1024-wide window. The settings panel is still a web form inside the game shell.

What reads well in the live build:

- The cyan/amber/mint palette is coherent, and the beacon's warm coils against the cyan signal rings read immediately.
- The title typography and mission-log card are legible and distinctive; the menu is not generic.
- The pause/settings backdrop blur and the 16:9 letterbox are clean.
- The HUD's primary labels are legible at 1280×720, and the health/XP bars are not colour-only.
- The default CRT scanline layer is restrained enough not to obscure text.
- At 1280×720 the canvas fills the frame correctly at DPR 1 and DPR 2; the remaining sharpness problem is the atlas, not the canvas size.

What fails the player test:

- The field reads as empty because the two hero landmarks are outside or under the opening frame, and most props/scatter are too dark or too small to read. The flower layer is drawn above the baked props, so it can cover them, but the main loss here is value separation.
- Mira disappears in grayscale and at 50% brightness. Her rendered body/face fill is only about **1.5–1.8:1** against the road and soil, below the 3:1 game-critical threshold in the art bible.
- The HUD does not scale with the canvas at 1024×768. The dossier's 810-pixel content is rendered into a 574-pixel client area, clipping 236 px instead of scaling.
- The settings controls are native 16 px range tracks and an 18 px checkbox, with no visible keyboard focus. Escape from Settings exits the entire pause flow instead of going back one level.
- The opening frame shows the beacon and flowers but no readable glasshouse or cold frame. The world's identity arrives only after the player walks away from the place they were just told to defend.

This section is evidence, not a second art bible. The production contract remains `docs/ART_BIBLE.md`; this section records where the current build does not meet it and what must be fixed before Milestone B.

### 6.2 Audit environment and method

| Item | Value |
|---|---|
| Runtime | Vite dev server at `http://localhost:3000/`, Chromium via Playwright MCP |
| Primary viewport | 1280×720 CSS px at DPR 2 (2560×1440 canvas backing) |
| Secondary viewports | 1024×768 at DPR 1; 1920×1080 at DPR 1 |
| Screens covered | Title, initial gameplay, gameplay after movement, pause, settings, quit confirmation, dossier, loadout |
| Interaction | Mouse, Tab/Arrow keyboard selection on title, Enter, Escape, held movement key for 2.2 s |
| Measurement | DOM `getBoundingClientRect`, `scrollHeight`/`clientHeight`, computed styles, canvas `getImageData`, browser console and network log |
| Visual stress | Full-colour, grayscale, and grayscale at 50% brightness |
| Representative artifacts | `audit-title.png`, `audit-game-initial.png`, `audit-pause.png`, `audit-settings.png`, `audit-quit-confirm.png`, `audit-dossier.png`, `audit-loadout.png`, `audit-1024x768-dossier.png`, `audit-1920x1080-game.png`, `audit-game-grayscale.png`, `audit-dpr2-crop-player-beacon.png` |
| Evidence location | Local Playwright screenshots under `.playwright-mcp/`; not committed game assets |

Limits: Milestone B enemies do not exist yet, so this audit cannot judge combat silhouettes or projectile readability. The DPR 2 run is Chromium device-scale emulation, not a physical HiDPI monitor. No formal colour-blind simulation, screen-reader session, or committed automated E2E suite was run. The CI-only Tier 0 checks reported by the user were not re-run; this audit verifies the visible 1280/1024/1920 behaviour and the current source.

### 6.3 Verified live baseline

| Area | Live evidence | Consequence |
|---|---|---|
| Response and boot | HTTP 200; correct page title; no runtime errors | The shell is stable |
| Console | Only repeated `favicon.ico` 404 | One easy browser-chrome defect; no hidden app exception |
| Fonts | Outfit, JetBrains Mono and Space Grotesk requested from `fonts.googleapis.com` / `fonts.gstatic.com` | Still network-dependent; release/offline gate remains open |
| 1024×768 letterbox | Frame 1024×576, 96 px top/bottom bars, 16:9 preserved | T0 letterbox fix works |
| Title keyboard | Tab/Arrow cycles a custom selection; Enter starts | Visual keyboard path works; DOM focus remains `BODY` (see AUD-10) |
| Emoji cleanup | Sun and lock glyphs are SVG, not emoji | T0 glyph fix works |
| Ground cache | Baked soil/road/furrows cache is present | F-1 is implemented |
| Darkness | Dark composite and three sliders are present; default 60% | F-2 is implemented; default is very heavy on the field |
| Density data | 41 flower patches, 48 soil patches, 120 stubble, 60 stones, 6 props, 2 landmarks | F-3 data exists; perception still fails at spawn (AUD-03/AUD-07) |
| Mira animation | 12 buffers: 3 directions × 4 frames | F-4 animation exists; contrast still fails (AUD-02) |
| Amber separation | `dangerAmberBright` threat token and muted prop/UI amber are present | F-7 is implemented |
| Canvas DPR | 1280×720 CSS, 2560×1440 backing at DPR 2 | Render target scales; 1× atlas buffers are the softness source (AUD-06) |

### 6.4 Findings ranked by player impact

| ID | Severity | Finding | Live evidence | Pre-B action | If deferred |
|---|---|---|---|---|---|
| AUD-01 | High — spec violation | Canvas and DOM do not share the same 1280×720 logical scale | At 1024×768 the frame is 1024×576, but the dossier content is still laid out at 1×: it needs 810 px while the frame client area is 574 px, clipping 236 px. At 1280 the 1 px frame border leaves a 718 px client height while the dossier needs 720 px, so the frame has 2 px of vertical overflow and shows a scrollbar. | PB-6 | Every smaller window clips UI; every UI enlargement changes layout without scaling the canvas |
| AUD-02 | High — visual QA fail | Mira is not the readable focal subject | Final lit canvas samples: player body `[22,70,90]` vs road `[25,40,53]` = **1.48:1**; vs soil `[8,26,38]` = **1.73:1**. Face `[74,64,61]` is similarly low. In grayscale and at 50% brightness she disappears into the road. | PB-8 | The player cannot reliably find their own character in the first frame or during movement |
| AUD-03 | High — composition | The opening frame hides the hero landmarks | Spawn 1600,1340 with a 1280×720 camera reveals world x960–2240, y980–1700. Glasshouse is centered at x2240 on the right edge, so half of its 220 px width is clipped; cold frames at x980 sit on the left edge, partly clipped and partly under the status card. Neither reads in the spawn screenshot. | PB-8 + PB-6 | The first impression is an empty field, despite F-3's density work |
| AUD-04 | High — spec | HUD safe margins do not match the UX spec | Top HUD is 24 px from the sides and 16 px from the top; required safe area is 64 px horizontal / 36 px vertical. The ability dock is correctly bottom-left per UX §4.2, but sits at 24 px, outside the safe area. The pause button is 17 px from the top. | PB-6 | Interactive HUD sits in unsafe/edge areas and the dock crowds the frame edge |
| AUD-05 | Medium — accessibility | Settings and pause modal are not keyboard-safe | Range inputs measure 16 px high and the checkbox 18 px; neither has a visible focus ring (`outline: none` resolved). Escape from Settings closes the whole pause flow and resumes the game. Focus stays on the underlying Pause button; Tab is not trapped; no `role="dialog"`/`aria-modal`. | PB-7 | Keyboard and assistive-tech players cannot reliably operate or leave the menu |
| AUD-06 | Medium — sharpness | DPR 2 canvas is soft while DOM text is crisp | 2560×1440 backing, but all 21 atlas buffers are 1×; player, beacon and flowers are visibly blurred in a device-scale crop. | Workstream 1, PB-1/PB-2 | The UI looks higher resolution than the game world; HiDPI review remains invalid |
| AUD-07 | Medium — world perception | Field props, scatter and lantern detail are not perceptible at spawn | The data contains 6 props and 2 landmarks, but the spawn view shows roughly eight flower clusters and no clearly readable prop; the harvester at (1240,1420) and sensor at (1320,1150) are inside the camera yet disappear into the ground. The lantern light mask reveals mostly flat road/soil, not a readable beam. | PB-3 draw order + PB-8 | Density exists in data but not in the player's eyes; the lantern fantasy does not read |
| AUD-08 | Medium — art identity | Title screen has no world art; 1920×1080 shows a 1280×720 floating window | The title is a dashboard/card composition with no nursery silhouette, beacon beam, spores or world vignette. At 1920 the frame stays 1280×720, leaving 320 px side and 180 px top/bottom surround. | Milestone F1; document the stage cap in PB-6 | The first screen does not sell the botanical world; large displays feel letterboxed rather than cinematic |
| AUD-09 | Medium — content quality | Dossier and loadout still read as a developer data sheet | Raw keys such as `projectileSpeed`, `damageReduction`, `jumpRange`, `buffDuration`; 10–12 px copy; loadout leaves roughly 300 px of empty lower screen; ability cards have `role="button"` but no key activation. | Milestone F2; shell fixes from PB-6 only | The reachable dossier undersells the character and looks unfinished |
| AUD-10 | Low — polish/a11y | Browser chrome and focus semantics are incomplete | Repeated favicon 404; title custom focus leaves `document.activeElement` on `BODY`; no title-screen Settings entry; destructive quit action is the solid red primary button while Cancel is secondary. | PB-7 favicon, modal focus and destructive default; Milestone F2 for title focus/settings and the full destructive-action hierarchy | Console noise; assistive tech does not see the title selection; the destructive path is visually privileged |

#### AUD-01 — stage scaling

The canvas backing is correctly fixed at 1280×720 × DPR, but the DOM is not. At 1024×768 the frame shrinks to 1024×576 while every panel, portrait and font keeps its 1280-oriented size. The dossier is the clearest failure: its 320 px portrait and fixed-height columns need 810 px, while the client area is 574 px. The current `overflowY: auto` turns a layout failure into an unstyled internal scrollbar. At 1280 the 1 px frame border leaves a 718 px client area, so the 720 px dossier has 2 px of vertical overflow and shows a scrollbar even on the target display.

**Required:** one 1280×720 logical stage, uniformly transformed to fit the frame, shared by every screen. Do not scale the canvas backing; only the CSS stage. At 1024 the stage scale is 0.8 and the dossier fits whole. Do not hide the failure behind a scrollbar.

A live CSS simulation of the fixed stage confirms the approach: at 1024×768, forcing a 1280×720 frame, scale 0.8 and top-left origin produced a 1024×576 painted box and restored the dossier's intended 1280 layout (`scrollHeight` 720, `clientHeight` 718 with the 1 px border still present). Removing that border leaves an exact 720 px logical stage. The stage must use the 1280 layout; it must not try to shrink the current 810 px 1024-wide reflow.

#### AUD-02 — Mira readability

F-4 added the four-frame stride, but it did not solve the value relationship. The coat midtone and face are close to the road and soil after lighting. The tiny cyan rim is not enough to define the whole silhouette; in grayscale she is a dark notch in an already dark road. The beacon and flowers have stronger silhouettes than the player.

**Required:** measure the final lit pixels, not the source tokens. The player silhouette or a closed rim must reach at least 3:1 against both traversable road and soil. A contact light pool plus a 1.5–2 px closed rim is the preferred first fix; raising the entire coat is the fallback. Validate at 1×, grayscale, 50% brightness and while moving.

#### AUD-03 — opening-frame composition

The opening composition is centred on the beacon and player, which is correct. The problem is the edges. The glasshouse is placed exactly on the right edge of the initial camera, so half of it is clipped; the cold frames sit on the left edge, partly clipped and partly under the status card. The player sees the objective card, the beacon and flowers, but no architecture that says “nursery”. The field's data density does not become visual density.

**Required:** at least one hero landmark must be readable in the initial 1280×720 frame and not occluded by HUD panels. Adjust landmark coordinates in `gameConfig.ts` or add a non-colliding foreground landmark. Do not change collision or balance. Re-check that the landmark is not hidden by the top-centre objective card, the status card or the bottom ability dock.

#### AUD-04 — safe area and ability dock

The UX specification is explicit: all HUD stays within 64 px horizontal and 36 px vertical safe margins, and §4.2 item 5 places the three ability slots at bottom-left. The live HUD is at 24/16. The icon row is in the correct corner, but it is 40 px too close to the left edge and 12 px too close to the bottom. The ASCII sketch in §3.1 is visually ambiguous about the row's horizontal position; the normative text says bottom-left, so follow the text and keep the dock there. The bottom band is reserved for the full-bleed XP rail and the bottom-centre radio portrait/captions; the dock belongs in the bottom-left.

**Required:** add named safe-area tokens; move the top HUD, pause button and bottom-left dock inside them; keep the dock anchored bottom-left at `left: 64px`, `bottom: 36px`. Do not centre it. The bottom XP rail is full-bleed in the UX wireframe; treat it as a documented non-interactive exception or integrate it into the status card, but do not leave unmanaged edge violations. The top-centre objective card must not cover the beacon's top after it moves down; the live frame has about 26 px clearance at the current card height, so verify after the move and compact only if that measured gap closes.

#### AUD-05 — settings and modal contract

The settings sheet is a native form in a game shell. The range controls are 16 px high and the checkbox 18 px; both need 48×48 logical px hit envelopes. Neither shows a focus ring. Focus remains on the Pause button behind the overlay. Escape is handled globally as “resume”, so it tears down the entire pause state from a sub-screen. The heading promises audio controls that do not exist.

**Required:** a small modal state machine (`menu`, `settings`, `quit`), state-aware Escape, focus on entry, a Tab trap, dialog semantics, visible `:focus-visible` styling, 48×48 logical px hit envelopes, and the heading “DISPLAY & ACCESSIBILITY SETTINGS” until real audio controls land in Milestone F2. The destructive confirm gets default focus on Cancel, not Confirm.

#### AUD-06 — atlas sharpness

This is the existing Workstream 1 problem and is not re-opened by this audit. The live DPR 2 capture confirms it: the 1× Mira, beacon and flower buffers are bilinearly upscaled to the 2560×1440 backing. The 2× atlas and logical-length draw contract are the correct fix.

#### AUD-07 — perceived field density

The live opening frame is the evidence. The 41-patch data is present, but the eye sees repeated five-, seven- and nine-petal stars, a flat road and no clearly readable prop. The harvester at (1240,1420) and the sensor at (1320,1150) are in the initial camera, but both vanish into the ground; the flower layer is drawn after the baked prop layer and can cover them, though value separation is the primary failure. The lantern mask brightens the ground but there is almost no texture in the lit area to reveal.

**Required:** use the corrected draw order (flowers below props/landmarks), raise the prop/landmark value separation, and ensure at least one prop and one landmark read at spawn. The lantern must reveal a midground feature; increasing light alpha without adding readable detail does not solve it. The flora variety fix remains Workstream 2.

#### AUD-08 — title and large-screen presentation

The title screen is a good typographic composition but not a world. It has no botanical silhouette, no beacon beam, no drifting spores and no sense of place. At 1920×1080 the 1280×720 cap leaves a large dark surround. If the cap stays for v1 performance and sharpness, the surround needs an intentional treatment; if the stage upscales, the render target and atlas contract change. This is a Milestone F1 decision, not a reason to hold pre-B code.

#### AUD-09 and AUD-10 — content, focus and chrome

The dossier's raw camelCase keys and 10–12 px copy are a content-polish problem, not a shell bug. The loadout's empty lower half is a composition problem. The title's custom keyboard focus is visually clear but does not move DOM focus, and there is no title-screen Settings entry. These belong to Milestone F2; the pre-B pass should not silently redesign the dossier while it is fixing overflow. The favicon 404, missing focus ring on form controls and destructive-action default are small enough to fix in PB-7 now.

### 6.5 Reconciliation with `Game_Visual_and_Codebase_Analysis.md`

Terminology note: **`F-1` and `F-2` in this table are the external analysis's Tier 1 foundation items (ground cache, darkness), not Roadmap Milestones F1/F2.** Milestone references are written in full.

| External claim | Live/source check | Action in this plan |
|---|---|---|
| Tier 0 quick wins complete | Letterbox, SVG glyphs and the visual title keyboard path are observable; the CI-only budget/guard checks were not re-run | No rework; verify the full T0 list again in the final QA matrix |
| F-1 ground cache complete | `GroundRenderer` baked cache is present; soil/furrows/road/fence are cached | Keep the soil cache. **D3 partially supersedes F-1** by removing props and landmarks from the cache so they stay sharp and can be y-sorted later. This is an additive correction, not a redo. |
| F-2 darkness complete | `LightingPass`, darkness slider and composite are present and visibly active | Keep F-2. Tune the default/vignette only through PB-8 and the art-bible value targets. Do not rebuild the pass. |
| F-3 density complete | 41 patches, 48 soil patches, 120 stubble, 60 stones, 6 props, 2 landmarks are in config; the spawn frame still reads sparse | Do **not** rewrite density. Add the perception and opening-composition gate in PB-8; fix draw order in PB-3. |
| F-4 Mira lift complete | 12 Mira buffers (3 directions × 4 frames) exist; final contrast is still 1.5–1.8:1 | Keep the 4-frame stride. Add the measured silhouette fix in PB-8. |
| F-7 accent split complete | `dangerAmberBright` and muted amber prop/UI tokens are present | No action in this pass |
| F-5 deferred | No interpolation path is present | Stay deferred |
| F-6 audio / F-8 real HUD state pending | No audio controls; the HUD still uses placeholder state | F-6 audio belongs to Milestone F2; F-8 HUD wiring belongs to Milestone B. Do not fake audio controls in the settings sheet. |
| “No darkness”, “ground redrawn every frame”, “10 flower patches”, “2-frame Mira”, “emoji glyphs”, “`src/game/rendering/EnemySprites.ts`” | All stale: darkness and cache exist; config has 41 patches; Mira has 4 frames; glyphs are SVG; the file is `staging/EnemySprites.ts` | Do not action any of these as new work |
| “The beacon should evolve into Old Core” | Conflicts with the art bible's separate Old Core amplifier pylon | Reject for this pass; Old Core remains a separate D2 pylon, not a beacon reskin |
| “Freeze the dossier until F1” | Live dossier clips at 1024 and shows raw keys | Fix the shell/overflow and modal contract now (PB-6/PB-7); keep portrait/typography/content polish in Milestone F1/F2 |
| Fonts are external | Three Google Fonts requests are visible | Keep self-hosting in Milestone F1/F3; it is not a visual-foundation dependency |
| Settings volume/key rebinding belong to F2 | No audio controls exist; heading overpromises | Rename the heading now; add audio/rebinding in Milestone F2 |
| Playwright E2E is optional | This audit used MCP, not the committed `test:e2e` stub | Add the manual matrix in §6.7; committed E2E remains Milestone F2/F3 |

**F-1/F-2 agreement summary:** F-1 agrees with the soil-cache principle but not with baking props/landmarks at 1×; D3 keeps the cache and moves only the sharp-edged actors. F-2 agrees completely; this plan preserves it and adds a readability gate. No further Tier 1 item is pulled forward.

### 6.6 Workstream 3 — pre-B viewport, HUD and accessibility

Workstream 3 is deliberately split. PB-6 and PB-7 are shell/accessibility fixes with no atlas dependency and run before Workstream 1. PB-8 is a measured opening-frame gate that runs after the atlas, prop and landmark draw order are stable. None of this adds enemies, Old Core, weather or new content.

#### PB-6 — fixed logical stage, safe area and HUD placement

**Goal:** every screen uses one 1280×720 logical stage that scales uniformly inside the 16:9 frame. No screen clips, no unintended scrollbar appears, and the HUD follows the UX safe area.

**Files:** `src/app/App.tsx`; new `src/app/ViewportShell.tsx`; new `src/app/stage.ts` (pure math); `src/styles/global.css`; `src/content/theme/tokens.ts`; `src/styles/tokens.css`; `src/ui/screens/TitleScreen.tsx`; `src/ui/screens/GameScreen.tsx`; `src/ui/screens/PersonaScreen.tsx`; `src/ui/components/PauseModal.tsx`; `src/ui/components/TacticalArmamentDock.tsx`; new `src/tests/unit/stage.test.ts`.

**Work:**

1. Add a pure `computeStageScale(frameWidth, frameHeight, maxScale = 1)` helper:
   - `Math.min(frameWidth / 1280, frameHeight / 720, maxScale)`.
   - Clamp to a positive minimum for degenerate windows; return a plain number.
   - Unit cases: 1280×720 → 1; 1024×576 → 0.8; 1920×1080 → 1 with the v1 cap; 1366×768 frame 1280×720 → 1; 800×450 → 0.625.
2. Add `ViewportShell`:
   - Outer `.viewport-frame` remains the 16:9 fit box, centred in the viewport, capped at 1280×720 for v1.
   - Remove the 1 px layout border from `.viewport-frame`; use an `outline` or an absolutely positioned edge overlay for the frame edge so the client area is exactly 1280×720 at the target size. Do not use an inset shadow that the stage background would cover.
   - Inner `.viewport-stage` is exactly 1280×720, `position: absolute`, `top: 0`, `left: 0`, `transform: scale(var(--stage-scale, 1))`, `transform-origin: top left`.
   - Use `ResizeObserver` plus `useLayoutEffect` to set `--stage-scale` from the frame's client dimensions. Do not re-render React on every frame; this is a resize-only update.
   - At 1280×720 the scale is 1. At 1024×768 the frame is 1024×576 and the scale is 0.8. At 1920×1080 the frame stays 1280×720 and the scale is 1.
3. Move the `.viewport-frame` ownership to `App`/`ViewportShell`. Screens render a full-size screen root inside the stage. Move the title radial background and the low-HP vignette onto the screen/stage, not the outer letterbox.
4. Remove the dossier's internal `overflowY: auto` as the primary escape hatch. At the logical 1280×720 stage the dossier must fit with zero scroll; if a future content addition does not fit, redesign the column, do not clip the frame.
5. Add safe-area tokens (`--safe-area-x: 64px`, `--safe-area-y: 36px`) and apply them to the game HUD: top row, pause control, bottom ability dock. Keep the ability dock bottom-left per UX §4.2 and move it to `left: 64px`, `bottom: 36px`; do not centre it.
6. Keep the bottom XP rail as a documented full-bleed exception or fold it into the status card. Do not leave an undocumented violation. The top-centre objective card must not occlude the beacon's top at spawn. At the first PB-6 safe-area measurement the card bottom was 139.6 px and the beacon sprite top was 140 px — only a 0.4 px gap — so the card was compacted to an 81.6 px height (8 px vertical padding, 4 px row gaps, line-height 1). The final 1280×720 measurement is a 22.4 px gap (card bottom 117.6 px, beacon top 140 px). Keep the compact card; re-run the opening-frame gate after any HUD or beacon change.
7. Preserve the existing 48×48 logical px targets. At scales below 1 the physical target shrinks; document that 1280×720 is the authored desktop resolution and that touch/mobile layouts are Phase 2, not this transform.

**Acceptance:**

- At 1280×720: `stage.scrollHeight === 720`, `stage.clientHeight === 720`, zero elements with an active vertical scroll container, and no scrollbar on the dossier, title or game screen.
- At 1024×768: frame 1024×576, stage scale 0.8, dossier bottom row visible, zero clipped content or scroll containers inside the stage, and no frame scrollbar.
- At 1920×1080: frame 1280×720 centred, stage scale 1, no accidental upscaling or blur.
- HUD top/side margins are at least 64/36 logical px, except the documented XP rail.
- Ability dock stays bottom-left, inside the safe area, and does not overlap the player, the XP rail or the safe-area boundary.
- Moving the HUD does not cover the beacon's top at spawn; screenshot check at 1280×720. The compact card now leaves 22.4 px clearance.

**Implementation checkpoint (2026-10-20):** verified in the live Playwright build. At 1280×720 the frame, stage and screen are exactly 1280×720 with zero scroll and the HUD top row is at x=64/y=36. At 1024×768 the frame is 1024×576, the stage is 0.8, the dossier has zero overflowers and no internal scroll, and the dock sits at 51.2/28.8 physical px (64/36 logical). At 1920×1080 the frame is 1280×720 centred at (320,180), scale 1, no upscaling. The XP rail remains full-bleed at the bottom. The objective card was compacted after the first safe-area pass closed the beacon gap to 0.4 px; the final measured gap is 22.4 px.

#### PB-7 — settings, modal focus and browser chrome

**Goal:** the pause/settings flow is fully operable by keyboard, honest about what it controls, and does not exit through the wrong layer.

**Files:** `src/ui/components/PauseModal.tsx`; `src/styles/global.css`; `src/content/theme/tokens.ts`; `src/styles/tokens.css`; `src/content/locales/en.ts`; `index.html`; new `public/favicon.svg`.

**Work:**

1. Rename the settings heading to `DISPLAY & ACCESSIBILITY SETTINGS`. Do not promise audio until audio volume/mute exists. Add a note or leave the future heading documented in Milestone F2.
2. Give every range input a 48×48 logical px hit envelope via its row/label, with the track centred inside. Give the reduced-motion checkbox a 48×48 logical px clickable label. Keep the visible control sizes legible; expand the hit area, not necessarily the track.
3. Add a visible `:focus-visible` rule for `input`, `select`, `textarea` and `button` using the existing cyan focus token, 2 px outline with 2 px offset. The current global rule covers buttons and `[tabindex]` but not form controls.
4. Replace the two booleans with a small view state (`menu`, `settings`, `quit`) and make Escape state-aware:
   - settings → pause menu;
   - quit confirmation → pause menu;
   - pause menu → resume game.
   Handle it inside the modal; prevent the global game handler from double-closing.
5. Add `role="dialog"`, `aria-modal="true"` and `aria-labelledby` to the modal. Focus the Resume button when the pause menu opens. Trap Tab within the modal. Restore focus to the Pause button on close. Set focus to `CANCEL & RESUME` when the quit view opens, not the destructive confirm.
6. Keep the destructive confirm red, but make Cancel the default focus and the safer visual path. Do not auto-confirm on Enter from the quit view.
7. Add a vector favicon and theme-color meta tag; eliminate the repeated 404. No raster asset is required.
8. Add `aria-label`/visible label association for each setting. Add a small “changes apply immediately” note if settings auto-save; do not imply a hidden Apply button.

**Acceptance:**

- Range and checkbox hit boxes measure at least 48×48 logical px at the authored 1280 stage.
- Every focused control shows a visible ring at 1280 and at the 0.8 stage scale.
- Escape from Settings returns to the pause menu, not the game; Escape from the pause menu resumes.
- Tab stays inside the modal; focus starts on Resume; closing restores focus to Pause.
- No audio label remains until audio controls exist.
- Browser console has no favicon 404 on a fresh load.

**Implementation checkpoint (2026-10-20):** verified in the live Playwright build. The pause root is `role="dialog"` with `aria-modal="true"` and an ID-matched `aria-labelledby`; Resume receives initial focus; Tab cycles Resume → Display & Accessibility → Return → Resume and Shift+Tab reverses; Settings autofocuses the CRT range, Tab cycles the two ranges, checkbox and Back button; Escape in Settings and Quit returns to the pause menu with focus on Resume, and Escape from the menu resumes with focus restored to the Pause button. The Settings rows measure 48 px logical height, the reduced-motion checkbox row is 48 px, and keyboard focus shows the cyan 2 px outline. The destructive confirm is red but Cancel is the focused primary path. `public/favicon.svg` returns 200 and no favicon 404 appears on a fresh load. The only physical-target compromise is the documented 0.8 stage scale: 48 logical px becomes 38.4 CSS px at 1024×768.

#### PB-8 — opening-frame readability and composition

**Goal:** the first 1280×720 frame shows a readable Mira, at least one hero landmark, at least one prop and the botanical field, so the player understands where they are and what they control.

**Files:** `src/game/config/gameConfig.ts`; `src/game/rendering/Renderer.ts`; the new `WorldPropsRenderer.ts` from PB-3; `src/game/rendering/CharacterSprites.ts`; `src/game/rendering/GroundRenderer.ts`; `src/content/theme/tokens.ts`; `docs/ART_BIBLE.md` only if a new named token/value rule is approved.

**Work:**

1. **Landmark framing.** Adjust the two landmark positions in config so at least one is visible in the initial 1280×720 camera and not occluded by HUD panels. A recommended art target is glasshouse near x2100, y1250 and cold frames near x1120, y1220, but the final positions must be reviewed in the actual spawn frame. Verify they do not overlap the road/beacon composition, collide with the player route or contradict the story map. If coordinates cannot fix it, add a non-colliding foreground nursery marker; do not change combat/spawn balance.
2. **Draw order.** Implement the corrected PB-3 order: ground cache → flowers → landmarks/props → beacon → player → lighting. Verify the harvester at (1240,1420) and the sensor at (1320,1150) are not hidden by flower clusters.
3. **Value separation.** Raise the prop and landmark value bands and add edge/rim highlights where they meet the ground. The field should retain a dark background but the midground should be readable at 1× and in grayscale. Do not turn props into copies of the beacon's glow.
4. **Mira silhouette.** Measure the final lit canvas pixels at the player. Prefer a closed 1.5–2 px rim/outline plus a small contact light pool over a global coat brightening. If the silhouette still fails 3:1, raise the coat midtone to the minimum approved value. Keep the palette roles: cyan signal, mint flora, amber threat/prop, no new friendly amber.
5. **Lantern reveal.** Confirm the lantern beam reveals at least one midground texture/feature at spawn and while moving. If it only brightens empty road, add local detail/contrast or a small ground pool; do not simply raise the darkness alpha or the light radius.
6. **One authoritative composition shot.** Capture the spawn frame at 1280×720 DPR 1 and DPR 2, plus grayscale and 50% brightness. The gate is visual and measured, not a “looks better” opinion.

**Acceptance:**

- At least one hero landmark is readable in the initial frame and is not occluded by HUD panels.
- At least one prop and one flower cluster are readable in the initial frame; the harvester/sensor are not covered by flowers.
- Mira's silhouette or closed rim reaches at least 3:1 against both road and soil in the final lit canvas; she remains identifiable in grayscale and at 50% brightness.
- The lantern reveals a midground feature; the player's light is visible as directed light, not just a circular haze.
- The opening frame still shows the beacon as the primary landmark and does not turn the scene into a cluttered prop field.
- No gameplay, collision, spawn, enemy or save data changed. Any coordinate change is visual-only and reviewed in the diff.

### 6.7 Workstream 3 QA matrix

| Check | 1280×720 | 1024×768 | 1920×1080 | Gate |
|---|---|---|---|---|
| Frame aspect and stage scale | 1.0, exact fit | 0.8, no clipping | 1.0, centred; documented cap | PB-6 |
| Dossier scroll | 0 px | 0 px | 0 px | PB-6 |
| Title/pause/settings/loadout | no scrollbar or clipping | no scrollbar or clipping | no scrollbar or clipping | PB-6 |
| HUD safe margins | ≥64/36 logical | ≥64/36 logical | ≥64/36 logical | PB-6 |
| Ability dock | bottom-left, inside safe area | bottom-left, inside safe area | bottom-left, inside safe area | PB-6 |
| Settings hit targets | ≥48×48 logical | ≥48×48 logical (38.4 physical at 0.8; desktop only) | ≥48×48 logical | PB-7 |
| Keyboard focus | visible on range/checkbox/buttons | visible | visible | PB-7 |
| Escape flow | settings → pause; pause → game | same | same | PB-7 |
| Console | no favicon 404 | same | same | PB-7 |
| Mira contrast | ≥3:1 vs road and soil | ≥3:1 logical render | ≥3:1 | PB-8 |
| Opening landmark | ≥1 readable, not occluded by HUD | same | same | PB-8 |
| Prop/flower readability | ≥1 prop + ≥1 flower; no cover | same | same | PB-8 |
| Lantern reveal | ≥1 midground feature | same | same | PB-8 |
| DPR 2 sharpness | atlas buffers crisp | n/a | n/a | Workstream 1 |

The 1024 physical target note is deliberate: 48 logical px × 0.8 = 38.4 CSS px. The 1280×720 stage is the authored desktop target; a touch/mobile build will need its own responsive layout, not a shrunken desktop stage. Do not cite the 1024 row as mobile evidence.

### 6.8 Deferred Milestone F1–F3 intake

These items are real gaps. They are recorded here so the audit does not lose them, but they are **not** pulled into pre-B code.

| ID | Item | Owner | Why deferred | Acceptance |
|---|---|---|---|---|
| DEF-01 | Procedural title-world backdrop: nursery silhouette, beacon beam, spores and an intentional letterbox treatment | Milestone F1 | Art-direction work, not a shell correctness fix | Title reads as NIGHTBLOOM at first glance; 1920 surround feels composed |
| DEF-02 | Sela, Tavi and Idris portraits; emotional-state art beyond Mira | Milestone F1 | F1 portrait scope; the radio cannot keep reusing Mira | Each speaker has a distinct portrait set and no placeholder reuse |
| DEF-03 | Human-readable dossier stat labels/units; loadout equipment diagram or full-height composition; ability-card keyboard activation | Milestone F2 | Content/UI polish, not overflow | No raw camelCase; no empty half-screen; cards work by keyboard |
| DEF-04 | Audio volume/mute, key rebinding, high-contrast setting; title-screen Settings and Credits | Milestone F2 | F-6 and Milestone F2 scope; do not fake audio now | All settings are real and persist; title entry matches pause |
| DEF-05 | Self-host OFL fonts and remove Google Fonts requests | Milestone F1/F3 | Offline/release gate, not visual foundation | Offline load has zero external font requests |
| DEF-06 | Full focus-trap/screen-reader pass, committed Playwright E2E, colour-blind simulation | Milestone F2/F3 | Pre-B covers the basic contract; full matrix is release work | Keyboard-only and reduced-motion paths pass end to end |
| DEF-07 | Real HUD state and placeholder removal | Milestone B | F-8 | No fake status text; state matches simulation |
| DEF-08 | Flora L-system integration | Post-spike | Workstream 2 approval gate | Eight variants; no repetition; gates pass |

### 6.9 Risks and rollback

| Risk | Mitigation |
|---|---|
| Stage transform creates a containing block for fixed-position UI | Use absolute positioning inside the stage; do not add `position: fixed` to HUD/modal children |
| Safe-area move pushes the objective card over the beacon | Measure the gap during PB-6; if it closes, compact the card or reposition within the top band, then recheck at the PB-8 composition gate |
| 1024 stage scale reduces physical text/hit size | Treat 1280×720 as the authored desktop target; do not ship the 1024 path as mobile evidence; mobile layout is Phase 2 |
| Landmark relocation changes narrative geography | Config-only review against the story map; if it conflicts, use a non-colliding foreground marker instead |
| Mira brightening flattens the silhouette or spends the cyan role | Prefer a closed rim and contact pool; keep the body midtone dark; validate in grayscale and token roles |
| Draw-order change puts props over the player | Props sit below beacon/player; use explicit layer order and a screenshot check at spawn |
| Workstream 3 grows into F2 | Keep DEF-01..08 in the deferred register; PB-6/7/8 only fix shell correctness, measured readability and composition |
| Scrollbar returns through a future content edit | Add a dossier height budget check to the shell QA at 1280×720 and require a redesign rather than `overflow: auto` |

Rollback is file-local: PB-6 can revert the shell wrapper and CSS; PB-7 can revert modal behaviour and input wrappers; PB-8 can revert config coordinates and sprite/token changes. None of these packages touch save schemas or simulation contracts.

### 6.10 Workstream 3 definition of done

- The 1280×720 stage scales uniformly at 1280, 1024 and 1920 with no unintended scrollbars or clipping.
- The HUD applies the 64/36 safe area and the ability dock stays bottom-left per UX §4.2.
- Settings controls meet the 48×48 logical px hit envelope and visible-focus contract; Escape is state-aware; the modal has dialog semantics and a focus trap.
- The opening frame has a readable landmark, prop and flower cluster; the corrected draw order is in place.
- Mira passes the measured contrast gate in colour, grayscale and 50% brightness.
- The favicon 404 is gone.
- No Milestone F1/F2 content (title world art, new portraits, audio, stat-label pass) is pulled forward; font self-hosting remains F1/F3.
- Typecheck, lint, test, build and content validation pass; the manual QA table in §6.7 is attached to the milestone report.
- Stop for user review after PB-6/PB-7 (shell/accessibility checkpoint) and again after PB-8, before Milestone B.

---

## 7. Sequence and review checkpoints

| Step | Work | Gate |
|---|---|---|
| 0 | Approve art bible, manifest and this plan, including §6 | User approval |
| 1 | PB-6 fixed stage, safe area and HUD placement | Typecheck, lint, test; 1024/1280/1920 stage QA |
| 2 | PB-7 settings, modal focus and favicon | Typecheck, lint, test; keyboard QA; user review checkpoint |
| 3 | PB-1 buffer contract and tests | Typecheck, lint, test |
| 4 | PB-2 sprite recipes and atlas migration | Typecheck, lint, test; DPR 1 visual match |
| 5 | PB-3 renderer/world props split and corrected draw order | Typecheck, lint, test, build; DPR 1/2 visual |
| 6 | PB-4 lighting split | Visual A/B; if different, revert split |
| 7 | PB-5 staging split | Inspection; no production impact |
| 8 | PB-8 opening-frame composition/readability, then the combined Workstream 1 + 3 gate | Measured 3:1, landmark/prop visibility, full manual QA matrix; user review checkpoint |
| 9 | Build Workstream 2 spike | Spike tests + preview |
| 10 | Review Workstream 2 | User approval |
| 11 | Integrate flora | Production gates + field QA |
| 12 | Start Milestone B | Roadmap gate |

Each step is a separate commit. Do not mix the flora spike with the atlas migration. PB-6 and PB-7 must not be bundled with PB-8; the shell/accessibility fixes are independently reviewable. PB-8 depends on PB-2 (Mira buffers), PB-3 (props/landmarks), and the PB-6 stage/HUD final placement.

---

## 8. Open decisions

| # | Decision | Recommendation | Impact if changed |
|---|---|---|---|
| 1 | Fixed 2× atlas vs adaptive `min(DPR, 2)` | Fixed 2× | Adaptive needs scale parameters and atlas rebuild on DPR change |
| 2 | Ground cache 1× vs 2× | 1× + per-frame props/landmarks | 2× costs about 123 MB |
| 3 | Split `LightingPass` in this pass | Yes, separate commit | Deferring keeps 287-line file and leaves 13 lines of headroom |
| 4 | Split `staging/EnemySprites.ts` now | Yes, mechanical split | Deferring makes B wiring riskier |
| 5 | Bottom-center pivots / y-sort | Defer to separate pre-B task | Including it expands scope and changes draw positions |
| 6 | Flora variant selection | Explicit optional `variant` with stable hash fallback | Hash-only is less art-directable; explicit-only requires 41 config edits |
| 7 | Flora size mapping | Use patch `radius`; keep 41 patches | Changing patch count/positions is out of scope |
| 8 | Add `typecheck:extras` for `staging/` and `spikes/` | Defer | They remain outside `npm run typecheck` |
| 9 | Stage scale cap in v1 | Confirmed and implemented: cap at 1.0×; downscale below 1280×720, never upscale. 1920×1080 keeps a centred 1280×720 stage. | Removing the cap requires a larger render target and a re-check of atlas DPR; it changes 1920 framing |
| 10 | 1024 stage downscale vs minimum-size warning | Confirmed and implemented: 1024×768 uses a 0.8 stage (1024×576); 1280×720 remains the authored desktop target. Physical targets are 38.4 px, documented as a desktop compromise, not a pass. | A warning excludes 1024×768 testers; a responsive re-layout is Phase 2 work |
| 11 | Opening landmark fix | Move glasshouse/cold-frame coordinates in config; no new art in pre-B | A new foreground landmark pulls F1 art forward; leaving it hidden fails the opening-frame gate |
| 12 | Mira contrast fix | Closed rim/outline plus contact pool first; raise coat midtone only if still below 3:1 | A brighter coat changes the character's mood and may flatten the silhouette |
| 13 | Settings heading | Confirmed and implemented: “DISPLAY & ACCESSIBILITY SETTINGS”; the pause entry is “DISPLAY & ACCESSIBILITY”. No audio is promised until real controls exist. | Keeping “AUDIO” promises controls that do not exist; adding audio now pulls F-6 forward |
| 14 | Bottom XP rail | Confirmed and implemented as the single documented full-bleed, non-interactive HUD exception (6 logical px / 4.8 physical px at 0.8). | Moving/removing it changes the UX wireframe; strict 36 px compliance would float it awkwardly above the frame; the exception is documented in the art bible |
| 15 | Objective card vs beacon after safe-area move | Resolved by measurement: the first pass left a 0.4 px gap (card bottom 139.6 px, beacon top 140 px), so the card was compacted to 81.6 px. Final 1280×720 gap is 22.4 px. | Keeping the old 103.6 px card would leave the beacon touching the HUD; expanding it again requires a fresh opening-frame check |
| 16 | Font self-hosting timing | Milestone F1/F3, not pre-B | The game remains network-dependent until then; pulling it forward expands the pre-B dependency and build work |

---

## 9. References

- `AGENTS.md` §4 anti-slop mandates, §5 mobile readiness, §6 directory layout, §7 quality gates.
- `docs/ART_BIBLE.md` — `AB-FR-*`, `AB-SH-*`, `AB-VL-*`, `AB-UI-*`, `AB-MO-*`, `AB-QA-*`.
- `docs/ASSET_MANIFEST.md` — atlas inventory, gaps, milestones.
- `Game_Visual_and_Codebase_Analysis.md` — external audit input; see §6.5 for which claims are stale or superseded.
- `spec/Technical Design Document (TDD).md` §1.1 viewport, §1.3 sprite pipeline, §5.1 game feel, §5.2 sprite sizes, §5.4 Old Core stages.
- `spec/Project Roadmap and Milestones.md` — pre-B, Milestone B, review workflow.
- `spec/UX Specification and UI Design System.md` §2 viewport/safe area, §3 HUD, §4 screens, §5 tokens, §6 accessibility.
- `GDD.md` §5 enemies, §7 art and layers.
- `CHARACTERS.md` §8 portraits and presentation.
- Live Playwright screenshots and console/network evidence under `.playwright-mcp/` (audit artifacts, not game assets).

---

## 10. Change log

| Date | Change | Author |
|---|---|---|
| 2026-10-20 | Initial pre-B atlas DPR and flora L-system plan. Docs only; no game code changed. | Visual foundation pass |
| 2026-10-20 | Added the live Playwright visual/UX audit, Workstream 3 (stage scaling, safe area, settings/modal accessibility, opening-frame readability), external-audit reconciliation, measured QA gates and deferred Milestone F1–F3 register. Docs only; no game code changed. | Visual foundation pass |
| 2026-10-20 | Refined the audit against the screenshots and DOM: confirmed bottom-left ability placement per UX §4.2, measured 2 px frame overflow at 1280 and 236 px clipping at 1024, verified the 0.8 stage simulation restores the 720 px dossier, and separated prop value loss from flower occlusion. Docs only. | Visual foundation pass |

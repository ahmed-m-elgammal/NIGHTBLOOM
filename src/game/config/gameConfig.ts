/**
 * NIGHTBLOOM: The Last Signal — Core Game Configuration
 * Authority: spec/Technical Design Document (TDD).md §1 & GDD.md §4.1
 * Strict Rule: All balance and environmental values originate here. Zero arbitrary numbers in game code.
 */

export const GAME_CONFIG = {
  // Logical viewport (16:9 fixed canvas box)
  viewport: {
    width: 1280,
    height: 720,
    aspectRatio: 16 / 9,
    hudSafeMarginX: 64,
    hudSafeMarginY: 36,
    maxDpr: 2.0,
  },

  // Map boundaries (agricultural nursery field)
  map: {
    width: 3200,
    height: 2400,
    padding: 32,
    furrowRowHeight: 44, // Agricultural furrow spacing in pixels
    borderStrokeWidth: 6,
    dustMoteCount: 36,
    roadWidth: 120,
    roadCenterX: 1600,
    flowerPatches: [
      { x: 1380, y: 980, radius: 48, petals: 6 },
      { x: 1840, y: 1020, radius: 54, petals: 7 },
      { x: 1180, y: 880, radius: 60, petals: 8 },
      { x: 2020, y: 1520, radius: 50, petals: 6 },
      { x: 920, y: 1420, radius: 64, petals: 8 },
      { x: 2320, y: 920, radius: 56, petals: 7 },
      { x: 1600, y: 720, radius: 72, petals: 9 },
      { x: 1600, y: 1720, radius: 64, petals: 8 },
      { x: 580, y: 580, radius: 76, petals: 10 },
      { x: 2620, y: 1820, radius: 70, petals: 9 },
      { x: 480, y: 480, radius: 52, petals: 6 },
      { x: 680, y: 820, radius: 58, petals: 7 },
      { x: 920, y: 520, radius: 64, petals: 8 },
      { x: 1120, y: 680, radius: 48, petals: 6 },
      { x: 740, y: 1100, radius: 62, petals: 8 },
      { x: 1880, y: 520, radius: 54, petals: 7 },
      { x: 2180, y: 440, radius: 66, petals: 9 },
      { x: 2480, y: 780, radius: 52, petals: 6 },
      { x: 2780, y: 580, radius: 72, petals: 10 },
      { x: 2280, y: 880, radius: 58, petals: 7 },
      { x: 1420, y: 1420, radius: 50, petals: 6 },
      { x: 1780, y: 1460, radius: 54, petals: 7 },
      { x: 1240, y: 1260, radius: 60, petals: 8 },
      { x: 1960, y: 1280, radius: 52, petals: 6 },
      { x: 520, y: 1580, radius: 68, petals: 9 },
      { x: 780, y: 1820, radius: 56, petals: 7 },
      { x: 1120, y: 1640, radius: 62, petals: 8 },
      { x: 620, y: 2100, radius: 70, petals: 9 },
      { x: 980, y: 2180, radius: 54, petals: 7 },
      { x: 1320, y: 1940, radius: 60, petals: 8 },
      { x: 1880, y: 1860, radius: 58, petals: 7 },
      { x: 2240, y: 1680, radius: 64, petals: 8 },
      { x: 2580, y: 1540, radius: 72, petals: 9 },
      { x: 2880, y: 1880, radius: 56, petals: 7 },
      { x: 2140, y: 2120, radius: 66, petals: 9 },
      { x: 2520, y: 2180, radius: 58, petals: 8 },
      { x: 2740, y: 1280, radius: 62, petals: 8 },
      { x: 380, y: 1240, radius: 70, petals: 9 },
      { x: 2840, y: 980, radius: 64, petals: 8 },
      { x: 1600, y: 420, radius: 68, petals: 9 },
      { x: 1600, y: 2040, radius: 62, petals: 8 },
    ],
    props: {
      harvesters: [
        { x: 1240, y: 1420 },
        { x: 2180, y: 860 },
      ],
      pylons: [
        { x: 1280, y: 720 },
        { x: 1960, y: 1680 },
      ],
      sensors: [
        { x: 1320, y: 1150 }, // Relocated from plaza concrete into nursery soil
        { x: 1880, y: 1320 },
      ],
    },
    landmarks: {
      glasshouse: { x: 2100, y: 1250, width: 220, height: 140 },
      coldFrames: { x: 1120, y: 1270, width: 190, height: 150 },
    },
    groundDetails: {
      serviceHatch: { x: 1750, y: 1340, width: 78, height: 46 },
      huskSpill: { x: 1698, y: 1378, radius: 38, count: 18 },
    },
    scatter: {
      seed: 1042,
      soilPatchCount: 48,
      stubbleCount: 120,
      stoneCount: 60,
    },
  },

  // Fixed simulation clock (60 Hz)
  simulation: {
    tickRateHz: 60,
    fixedDeltaSec: 1 / 60, // ~0.016667 s
    maxDeltaClampSec: 0.1, // 100 ms clamp to prevent spiral of death
    reactSnapshotRateHz: 10, // 10 Hz throttled React bridge
  },

  // Camera follow parameters (exponential smoothing)
  camera: {
    timeConstantSec: 0.12,
    lambda: 8.333, // 1 / 0.12
  },

  // Player defaults (Mira Vale)
  player: {
    spawnX: 1600,
    spawnY: 1340, // Spawn south of the Beacon to prevent overlap
    radius: 18,
    baseSpeed: 180, // px/s
    lanternGlowRadius: 180,
  },

  // Beacon location (Nursery Center)
  beacon: {
    x: 1600,
    y: 1200,
    baseRadius: 48,
    coreRadius: 16,
    rangeRadius: 180,
    minGlowRadius: 280,
    maxGlowPulseDelta: 30,
  },

  // Chapter 1 Phase Parameters
  chapter: {
    id: 1,
    phaseDurationSec: 225, // 3:45 survival target until dawn transmission
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;

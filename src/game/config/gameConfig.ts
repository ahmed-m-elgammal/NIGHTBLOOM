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
    flowerPatches: [
      { x: 1380, y: 1080, radius: 48, petals: 6 },
      { x: 1820, y: 1280, radius: 54, petals: 7 },
      { x: 1180, y: 880, radius: 60, petals: 8 },
      { x: 2020, y: 1520, radius: 50, petals: 6 },
      { x: 920, y: 1420, radius: 64, petals: 8 },
      { x: 2320, y: 920, radius: 56, petals: 7 },
      { x: 1600, y: 780, radius: 72, petals: 9 },
      { x: 1600, y: 1640, radius: 64, petals: 8 },
      { x: 580, y: 580, radius: 76, petals: 10 },
      { x: 2620, y: 1820, radius: 70, petals: 9 },
    ],
    props: {
      harvesters: [
        { x: 1240, y: 1420 }, // Placed cleanly in field without edge cropping
        { x: 2180, y: 860 },
      ],
      pylons: [
        { x: 1280, y: 720 },
        { x: 1960, y: 1680 },
      ],
      sensors: [
        { x: 1500, y: 1100 },
        { x: 1700, y: 1380 },
      ],
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
} as const;

export type GameConfig = typeof GAME_CONFIG;

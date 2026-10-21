/**
 * Item & World Prop Visual Registry
 * Authority: spec/Technical Design Document (TDD).md §1.3 & STORY_BIBLE.md §2
 * Aggregates all procedural item, flora, landmark, and prop generators.
 */

import type { ItemAtlas } from './types';
import { createBeaconSprite } from './beacon';
import { createFlowerClusterSprite } from './flora';
import { createHarvesterSprite, createPylonPropSprite, createSensorPropSprite } from './props';
import { createGlasshouseSprite, createColdFramesSprite } from './landmarks';

export * from './types';
export { createBeaconSprite } from './beacon';
export { createFlowerClusterSprite } from './flora';
export { createHarvesterSprite, createPylonPropSprite, createSensorPropSprite } from './props';
export { createGlasshouseSprite, createColdFramesSprite } from './landmarks';

export function createItemAtlas(): ItemAtlas {
  return {
    beacon: createBeaconSprite(),
    flowers: [
      createFlowerClusterSprite(64, 5),
      createFlowerClusterSprite(96, 7),
      createFlowerClusterSprite(128, 9),
    ],
    props: {
      harvester: createHarvesterSprite(),
      pylon: createPylonPropSprite(),
      sensor: createSensorPropSprite(),
    },
    landmarks: {
      glasshouse: createGlasshouseSprite(),
      coldFrames: createColdFramesSprite(),
    },
  };
}

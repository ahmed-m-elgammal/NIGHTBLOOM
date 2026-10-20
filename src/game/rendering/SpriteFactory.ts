/**
 * Procedural Offscreen Sprite Factory & Atlas
 * Authority: spec/Technical Design Document (TDD).md §1.3
 * Generates and caches high-definition vector sprite buffers at boot time.
 * Zero external raster textures. 100% tokenized.
 */

import { createMiraSprite } from './CharacterSprites';
import { createBeaconSprite } from './BeaconSprite';
import { createFlowerClusterSprite } from './FloraSprites';
import { createHarvesterSprite, createPylonPropSprite, createSensorPropSprite } from './PropSprites';

export interface SpriteAtlas {
  mira: {
    down: HTMLCanvasElement[];
    up: HTMLCanvasElement[];
    side: HTMLCanvasElement[];
  };
  beacon: HTMLCanvasElement;
  flowers: HTMLCanvasElement[];
  props: {
    harvester: HTMLCanvasElement;
    pylon: HTMLCanvasElement;
    sensor: HTMLCanvasElement;
  };
}

export class SpriteFactory {
  private static atlas: SpriteAtlas | null = null;

  public static getAtlas(): SpriteAtlas {
    if (!this.atlas) {
      this.atlas = this.createAtlas();
    }
    return this.atlas;
  }

  private static createAtlas(): SpriteAtlas {
    return {
      mira: {
        down: [createMiraSprite('down', 0), createMiraSprite('down', 1)],
        up: [createMiraSprite('up', 0), createMiraSprite('up', 1)],
        side: [createMiraSprite('side', 0), createMiraSprite('side', 1)],
      },
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
    };
  }
}

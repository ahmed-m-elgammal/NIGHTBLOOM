/**
 * Item & World Prop Visual Contracts
 * Authority: spec/Technical Design Document (TDD).md §1.3
 */

import type { SpriteBuffer } from '../buffer';

export interface ItemAtlas {
  beacon: SpriteBuffer;
  flowers: SpriteBuffer[];
  props: {
    harvester: SpriteBuffer;
    pylon: SpriteBuffer;
    sensor: SpriteBuffer;
  };
  landmarks: {
    glasshouse: SpriteBuffer;
    coldFrames: SpriteBuffer;
  };
}

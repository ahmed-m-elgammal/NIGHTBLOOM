/**
 * Procedural Offscreen Sprite Factory & Atlas
 * Authority: spec/Technical Design Document (TDD).md §1.3
 * Generates and caches high-definition vector sprite buffers at boot time.
 * Zero external raster textures. 100% tokenized.
 */

import { PERSONA_REGISTRY, PersonaSpriteSet, getPersonaSprites } from './personas';
import { createItemAtlas, ItemAtlas } from './items';
import type { SpriteBuffer } from './buffer';

export interface SpriteAtlas {
  personas: Record<string, PersonaSpriteSet>;
  mira: PersonaSpriteSet; // Direct alias for backwards compatibility
  items: ItemAtlas;
  beacon: SpriteBuffer; // Direct alias
  flowers: SpriteBuffer[]; // Direct alias
  props: ItemAtlas['props']; // Direct alias
  landmarks: ItemAtlas['landmarks']; // Direct alias
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
    const personas: Record<string, PersonaSpriteSet> = {};
    for (const [id, generator] of Object.entries(PERSONA_REGISTRY)) {
      personas[id] = generator();
    }

    const items = createItemAtlas();

    return {
      personas,
      mira: personas.hero_mira ?? getPersonaSprites('hero_mira'),
      items,
      beacon: items.beacon,
      flowers: items.flowers,
      props: items.props,
      landmarks: items.landmarks,
    };
  }
}

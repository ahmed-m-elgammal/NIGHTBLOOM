/**
 * Dynamic World Props & Landmark Layer
 * Authority: docs/PRE_B_VISUAL_FOUNDATION_PLAN.md §4.7 & docs/ART_BIBLE.md draw order
 * Draws fixed nursery landmarks and machinery from the 2x atlas each frame.
 * PB-3 preserves cached positions, sizes and per-index transforms; no y-sort yet.
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { drawSpriteCentered } from './buffer';
import type { SpriteAtlas } from './SpriteFactory';

const PYLON_ROTATION_RAD = 0.04;
const PYLON_CULL_PADDING = 8;

interface SpriteExtent {
  readonly logicalWidth: number;
  readonly logicalHeight: number;
}

export function isWorldSpriteVisible(
  x: number,
  y: number,
  sprite: SpriteExtent,
  cameraX: number,
  cameraY: number,
  viewportWidth: number,
  viewportHeight: number,
  padding = 0,
): boolean {
  const halfWidth = sprite.logicalWidth / 2 + padding;
  const halfHeight = sprite.logicalHeight / 2 + padding;
  const left = cameraX - viewportWidth / 2;
  const right = cameraX + viewportWidth / 2;
  const top = cameraY - viewportHeight / 2;
  const bottom = cameraY + viewportHeight / 2;

  return (
    x + halfWidth >= left &&
    x - halfWidth <= right &&
    y + halfHeight >= top &&
    y - halfHeight <= bottom
  );
}

export class WorldPropsRenderer {
  public static draw(
    ctx: CanvasRenderingContext2D,
    atlas: SpriteAtlas,
    cameraX: number,
    cameraY: number,
    viewportWidth: number,
    viewportHeight: number,
  ): void {
    const { glasshouse, coldFrames } = GAME_CONFIG.map.landmarks;
    const { harvesters, pylons, sensors } = GAME_CONFIG.map.props;
    const items = atlas.items;

    const glasshouseSprite = items.landmarks.glasshouse;
    if (isWorldSpriteVisible(glasshouse.x, glasshouse.y, glasshouseSprite, cameraX, cameraY, viewportWidth, viewportHeight)) {
      drawSpriteCentered(ctx, glasshouseSprite, glasshouse.x, glasshouse.y);
    }

    const coldFramesSprite = items.landmarks.coldFrames;
    if (isWorldSpriteVisible(coldFrames.x, coldFrames.y, coldFramesSprite, cameraX, cameraY, viewportWidth, viewportHeight)) {
      drawSpriteCentered(ctx, coldFramesSprite, coldFrames.x, coldFrames.y);
    }

    const harvesterSprite = items.props.harvester;
    for (let index = 0; index < harvesters.length; index++) {
      const position = harvesters[index];
      if (!isWorldSpriteVisible(position.x, position.y, harvesterSprite, cameraX, cameraY, viewportWidth, viewportHeight)) {
        continue;
      }

      ctx.save();
      ctx.translate(position.x, position.y);
      if (index % 2 === 1) ctx.scale(-1, 1); // Preserve the cached mirror on harvester #2.
      drawSpriteCentered(ctx, harvesterSprite, 0, 0);
      ctx.restore();
    }

    const pylonSprite = items.props.pylon;
    for (let index = 0; index < pylons.length; index++) {
      const position = pylons[index];
      if (
        !isWorldSpriteVisible(
          position.x,
          position.y,
          pylonSprite,
          cameraX,
          cameraY,
          viewportWidth,
          viewportHeight,
          PYLON_CULL_PADDING,
        )
      ) {
        continue;
      }

      ctx.save();
      ctx.translate(position.x, position.y);
      if (index % 2 === 1) ctx.rotate(PYLON_ROTATION_RAD); // Preserve the cached lean on pylon #2.
      drawSpriteCentered(ctx, pylonSprite, 0, 0);
      ctx.restore();
    }

    const sensorSprite = items.props.sensor;
    for (const position of sensors) {
      if (!isWorldSpriteVisible(position.x, position.y, sensorSprite, cameraX, cameraY, viewportWidth, viewportHeight)) {
        continue;
      }
      drawSpriteCentered(ctx, sensorSprite, position.x, position.y);
    }
  }
}

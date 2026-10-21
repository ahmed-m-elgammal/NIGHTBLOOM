/**
 * Dynamic World Entity Layer
 * Authority: docs/PRE_B_VISUAL_FOUNDATION_PLAN.md §4.7 & docs/ART_BIBLE.md draw order
 * Draws animated flowers, the beacon and the player above the static ground cache.
 * WorldPropsRenderer sits between flowers and the beacon/player layers.
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { ThemeTokens } from '../../content/theme/tokens';
import type { PlayerEntity } from '../entities/player';
import { drawSpriteCentered } from './buffer';
import type { SpriteAtlas } from './SpriteFactory';

const FLOWER_CULL_MARGIN = 100;
const BEACON_CULL_MARGIN = 300;

export class WorldEntityRenderer {
  public static drawFlowerPatches(
    ctx: CanvasRenderingContext2D,
    atlas: SpriteAtlas,
    cameraX: number,
    cameraY: number,
    viewportWidth: number,
    viewportHeight: number,
    timeSec: number,
    reducedMotion: boolean,
  ): void {
    const flowers = atlas.items.flowers;
    if (flowers.length === 0) return;

    const patches = GAME_CONFIG.map.flowerPatches;
    const halfWidth = viewportWidth / 2;
    const halfHeight = viewportHeight / 2;

    for (let index = 0; index < patches.length; index++) {
      const patch = patches[index];
      if (
        Math.abs(patch.x - cameraX) > halfWidth + FLOWER_CULL_MARGIN ||
        Math.abs(patch.y - cameraY) > halfHeight + FLOWER_CULL_MARGIN
      ) {
        continue;
      }

      const sprite = flowers[index % flowers.length];
      const phase = timeSec * 2.2 + patch.x * 0.01;
      const pulse = reducedMotion ? 1.0 : Math.sin(phase) * 0.06 + 0.97;
      const baseScale = 0.9 + (index % 5) * 0.05;

      ctx.save();
      ctx.translate(patch.x, patch.y);
      if (index % 3 === 1) ctx.scale(-1, 1);
      drawSpriteCentered(ctx, sprite, 0, 0, pulse * baseScale);
      ctx.restore();
    }
  }

  public static drawBeacon(
    ctx: CanvasRenderingContext2D,
    atlas: SpriteAtlas,
    cameraX: number,
    cameraY: number,
    viewportWidth: number,
    viewportHeight: number,
    timeSec: number,
  ): void {
    const { x, y, rangeRadius } = GAME_CONFIG.beacon;
    if (
      Math.abs(x - cameraX) > viewportWidth / 2 + BEACON_CULL_MARGIN ||
      Math.abs(y - cameraY) > viewportHeight / 2 + BEACON_CULL_MARGIN
    ) {
      return;
    }

    // Radiating energy pulse rings expanding outward.
    const ringCycle = (timeSec * 0.4) % 1;
    const ringRadius = 40 + ringCycle * (rangeRadius - 40);
    const ringOpacity = (1 - ringCycle) * 0.6;
    ctx.strokeStyle = ThemeTokens.colors.playerBody;
    ctx.lineWidth = 2;
    ctx.globalAlpha = ringOpacity;
    ctx.beginPath();
    ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    drawSpriteCentered(ctx, atlas.items.beacon, x, y);

    // Top blinking aviation obstruction beacon (flashes at 2 Hz).
    const blinkOn = Math.floor(timeSec * 2) % 2 === 0;
    if (blinkOn) {
      ctx.fillStyle = ThemeTokens.colors.dangerRing;
      ctx.beginPath();
      ctx.arc(x, y - 52, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = ThemeTokens.colors.dangerRedGhost;
      ctx.beginPath();
      ctx.arc(x, y - 52, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  public static drawPlayer(
    ctx: CanvasRenderingContext2D,
    atlas: SpriteAtlas,
    player: PlayerEntity,
    timeSec: number,
  ): void {
    const angle = player.facingAngle;
    let direction: 'down' | 'up' | 'side' = 'down';
    let flipX = false;

    if (angle > -Math.PI * 0.25 && angle <= Math.PI * 0.25) {
      direction = 'side';
    } else if (angle > Math.PI * 0.25 && angle <= Math.PI * 0.75) {
      direction = 'down';
    } else if (angle > -Math.PI * 0.75 && angle <= -Math.PI * 0.25) {
      direction = 'up';
    } else {
      direction = 'side';
      flipX = true;
    }

    const stepIndex = player.isMoving ? Math.floor(player.walkTime * 10) % 4 : 1;
    const personaSprites = atlas.personas[player.personaId] ?? atlas.mira;
    const sprite = personaSprites[direction][stepIndex];
    const bobY = player.isMoving
      ? Math.sin(player.walkTime * 14) * 2.2
      : Math.sin(timeSec * 3) * 0.8;

    ctx.save();
    ctx.translate(player.x, player.y + bobY);
    if (flipX) ctx.scale(-1, 1);
    drawSpriteCentered(ctx, sprite, 0, 0);
    ctx.restore();
  }
}

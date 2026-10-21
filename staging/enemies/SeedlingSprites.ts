/**
 * Staging Seedling Enemy Sprite
 * Authority: PREPRODUCTION.md §6.1 & spec/Technical Design Document (TDD).md §1.3
 * PB-5: family module staged for Milestone B wiring; not imported by production.
 */

import { ThemeTokens } from '../../src/content/theme/tokens';
import { createSpriteBuffer, SpriteBuffer } from '../../src/game/rendering/buffer';

/**
 * Seedling Sprite (36x36 px)
 * Round bulbous plant predator with 5 opening serrated petals and glowing spore core
 */
export function createSeedlingSprite(frame: number = 0): SpriteBuffer {
  const size = 36;
  const sprite = createSpriteBuffer(size, size);
  const cx = size / 2;
  const cy = size / 2;

  // Drop shadow
  sprite.ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  sprite.ctx.beginPath();
  sprite.ctx.ellipse(cx, cy + 12, 11, 5, 0, 0, Math.PI * 2);
  sprite.ctx.fill();

  // 5 Predatory Petals
  const petalOpen = frame === 1 ? 1.25 : 1.0;
  sprite.ctx.fillStyle = ThemeTokens.colors.floraPatch;
  sprite.ctx.strokeStyle = ThemeTokens.colors.seedCore;
  sprite.ctx.lineWidth = 1.2;

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const dist = 9 * petalOpen;
    const px = cx + Math.cos(a) * dist;
    const py = cy + Math.sin(a) * dist;

    sprite.ctx.beginPath();
    sprite.ctx.ellipse(px, py, 6 * petalOpen, 4 * petalOpen, a, 0, Math.PI * 2);
    sprite.ctx.fill();
    sprite.ctx.stroke();
  }

  // Bulbous Central Spore Body
  sprite.ctx.fillStyle = ThemeTokens.colors.mossDense;
  sprite.ctx.strokeStyle = ThemeTokens.colors.metalTrim;
  sprite.ctx.lineWidth = 1;
  sprite.ctx.beginPath();
  sprite.ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  sprite.ctx.fill();
  sprite.ctx.stroke();

  // Glowing Toxic Spore Core (Hostile amber/green)
  sprite.ctx.fillStyle = ThemeTokens.colors.hostileCore;
  sprite.ctx.beginPath();
  sprite.ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
  sprite.ctx.fill();

  return sprite;
}

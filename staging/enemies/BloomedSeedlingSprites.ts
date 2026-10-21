/**
 * Staging Bloomed Seedling Enemy Sprite
 * Authority: PREPRODUCTION.md §6.1 & spec/Technical Design Document (TDD).md §1.3
 * PB-5: family module staged for Milestone B wiring; not imported by production.
 */

import { ThemeTokens } from '../../src/content/theme/tokens';
import { createSpriteBuffer, SpriteBuffer } from '../../src/game/rendering/buffer';

/**
 * Bloomed Seedling Sprite (44x44 px)
 * Seedling surrounded by an aggressive outer amber petal ring
 */
export function createBloomedSeedlingSprite(frame: number = 0): SpriteBuffer {
  const size = 44;
  const sprite = createSpriteBuffer(size, size);
  const cx = size / 2;
  const cy = size / 2;

  // Drop shadow
  sprite.ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  sprite.ctx.beginPath();
  sprite.ctx.ellipse(cx, cy + 15, 14, 6, 0, 0, Math.PI * 2);
  sprite.ctx.fill();

  // Outer Thorn Petal Ring (Hostile Amber)
  const pulse = frame === 1 ? 1.15 : 1.0;
  sprite.ctx.fillStyle = ThemeTokens.colors.rustPlateMid;
  sprite.ctx.strokeStyle = ThemeTokens.colors.dangerAmberBright;
  sprite.ctx.lineWidth = 1.4;

  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const dist = 13 * pulse;
    const px = cx + Math.cos(a) * dist;
    const py = cy + Math.sin(a) * dist;

    sprite.ctx.beginPath();
    sprite.ctx.ellipse(px, py, 5 * pulse, 3 * pulse, a, 0, Math.PI * 2);
    sprite.ctx.fill();
    sprite.ctx.stroke();
  }

  // Inner Seedling Core
  sprite.ctx.fillStyle = ThemeTokens.colors.floraPatch;
  sprite.ctx.strokeStyle = ThemeTokens.colors.hostileCore;
  sprite.ctx.lineWidth = 1.2;
  sprite.ctx.beginPath();
  sprite.ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  sprite.ctx.fill();
  sprite.ctx.stroke();

  // Radiating Amber Core Emitter
  sprite.ctx.fillStyle = ThemeTokens.colors.dangerAmberBright;
  sprite.ctx.beginPath();
  sprite.ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
  sprite.ctx.fill();

  return sprite;
}

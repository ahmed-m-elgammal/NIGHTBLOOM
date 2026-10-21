/**
 * Staging Thornrunner Enemy Sprite
 * Authority: PREPRODUCTION.md §6.1 & spec/Technical Design Document (TDD).md §1.3
 * PB-5: family module staged for Milestone B wiring; not imported by production.
 */

import { ThemeTokens } from '../../src/content/theme/tokens';
import { createSpriteBuffer, SpriteBuffer } from '../../src/game/rendering/buffer';

/**
 * Thornrunner Sprite (38x30 px)
 * Low angular wedge quadruped with sharp thorn crest
 */
export function createThornrunnerSprite(frame: number = 0): SpriteBuffer {
  const sprite = createSpriteBuffer(38, 30);
  const cx = 19;
  const cy = 15;

  // Drop shadow
  sprite.ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  sprite.ctx.beginPath();
  sprite.ctx.ellipse(cx, cy + 9, 13, 4, 0, 0, Math.PI * 2);
  sprite.ctx.fill();

  const legStride = frame === 1 ? 3 : -3;

  // Scuttling Chitinous Legs
  sprite.ctx.strokeStyle = ThemeTokens.colors.groundElevated;
  sprite.ctx.lineWidth = 2;
  sprite.ctx.lineCap = 'round';

  // Front legs
  sprite.ctx.beginPath();
  sprite.ctx.moveTo(cx + 6, cy + 2);
  sprite.ctx.lineTo(cx + 12 + legStride, cy + 10);
  sprite.ctx.moveTo(cx + 6, cy - 2);
  sprite.ctx.lineTo(cx + 12 - legStride, cy - 8);

  // Rear legs
  sprite.ctx.moveTo(cx - 6, cy + 2);
  sprite.ctx.lineTo(cx - 12 - legStride, cy + 10);
  sprite.ctx.moveTo(cx - 6, cy - 2);
  sprite.ctx.lineTo(cx - 12 + legStride, cy - 8);
  sprite.ctx.stroke();

  // Wedge Carapace Body
  sprite.ctx.fillStyle = ThemeTokens.colors.floraPatch;
  sprite.ctx.strokeStyle = ThemeTokens.colors.dangerAmberGhost;
  sprite.ctx.lineWidth = 1.5;

  sprite.ctx.beginPath();
  sprite.ctx.moveTo(cx + 12, cy); // Snout
  sprite.ctx.lineTo(cx - 10, cy + 8);
  sprite.ctx.lineTo(cx - 6, cy);
  sprite.ctx.lineTo(cx - 10, cy - 8);
  sprite.ctx.closePath();
  sprite.ctx.fill();
  sprite.ctx.stroke();

  // Dorsal Thorn Spikes
  sprite.ctx.fillStyle = ThemeTokens.colors.rustPlateLight;
  for (let sx = cx - 4; sx <= cx + 4; sx += 4) {
    sprite.ctx.beginPath();
    sprite.ctx.moveTo(sx, cy - 3);
    sprite.ctx.lineTo(sx - 2, cy - 8);
    sprite.ctx.lineTo(sx + 2, cy - 3);
    sprite.ctx.closePath();
    sprite.ctx.fill();
  }

  // Amber Predator Eye
  sprite.ctx.fillStyle = ThemeTokens.colors.dangerAmberBright;
  sprite.ctx.beginPath();
  sprite.ctx.arc(cx + 8, cy - 1.5, 1.5, 0, Math.PI * 2);
  sprite.ctx.fill();

  return sprite;
}

/**
 * Staging Briarheart Enemy Sprite
 * Authority: PREPRODUCTION.md §6.1 & spec/Technical Design Document (TDD).md §1.3
 * PB-5: family module staged for Milestone B wiring; not imported by production.
 */

import { ThemeTokens } from '../../src/content/theme/tokens';
import { createSpriteBuffer, SpriteBuffer } from '../../src/game/rendering/buffer';

/**
 * Briarheart Heavy Botanical Brute Sprite (80x80 px)
 * Massive heavy hex botanical golem with thorn armor and molten core vents
 */
export function createBriarheartSprite(frame: number = 0): SpriteBuffer {
  const size = 80;
  const sprite = createSpriteBuffer(size, size);
  const cx = size / 2;
  const cy = size / 2;

  // Huge contact drop shadow
  sprite.ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  sprite.ctx.beginPath();
  sprite.ctx.ellipse(cx, cy + 28, 30, 10, 0, 0, Math.PI * 2);
  sprite.ctx.fill();

  // Heavy Tangled Bramble Hex Body
  sprite.ctx.fillStyle = ThemeTokens.colors.rustPlateDark;
  sprite.ctx.strokeStyle = ThemeTokens.colors.mossDense;
  sprite.ctx.lineWidth = 3;

  sprite.ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = cx + Math.cos(a) * 26;
    const y = cy + Math.sin(a) * 24;
    if (i === 0) sprite.ctx.moveTo(x, y);
    else sprite.ctx.lineTo(x, y);
  }
  sprite.ctx.closePath();
  sprite.ctx.fill();
  sprite.ctx.stroke();

  // Thorn Armor Plates
  sprite.ctx.fillStyle = ThemeTokens.colors.groundElevated;
  sprite.ctx.strokeStyle = ThemeTokens.colors.dangerAmberGhost;
  sprite.ctx.lineWidth = 2;
  sprite.ctx.beginPath();
  sprite.ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  sprite.ctx.fill();
  sprite.ctx.stroke();

  // Glowing Molten Core Vents
  const pulse = frame === 1 ? 1.2 : 1.0;
  const coreGrad = sprite.ctx.createRadialGradient(cx, cy, 2, cx, cy, 12 * pulse);
  coreGrad.addColorStop(0, ThemeTokens.colors.dangerAmberBright);
  coreGrad.addColorStop(0.6, ThemeTokens.colors.hostileCore);
  coreGrad.addColorStop(1, ThemeTokens.colors.rustPlateDark);
  sprite.ctx.fillStyle = coreGrad;
  sprite.ctx.beginPath();
  sprite.ctx.arc(cx, cy, 12 * pulse, 0, Math.PI * 2);
  sprite.ctx.fill();

  // Spiked Shoulder Knots
  sprite.ctx.fillStyle = ThemeTokens.colors.rustPlateLight;
  sprite.ctx.fillRect(cx - 32, cy - 10, 8, 12);
  sprite.ctx.fillRect(cx + 24, cy - 10, 8, 12);

  return sprite;
}

/**
 * Staging Rustwing Enemy Sprite
 * Authority: PREPRODUCTION.md §6.1 & spec/Technical Design Document (TDD).md §1.3
 * PB-5: family module staged for Milestone B wiring; not imported by production.
 */

import { ThemeTokens } from '../../src/content/theme/tokens';
import { createSpriteBuffer, SpriteBuffer } from '../../src/game/rendering/buffer';

/**
 * Rustwing Sprite (44x44 px)
 * Rusted hovering drone with dual spinning rotors and attitude tilt
 */
export function createRustwingSprite(frame: number = 0): SpriteBuffer {
  const sprite = createSpriteBuffer(44, 44);
  const cx = 22;
  const cy = 22;

  // Hovering Ground Shadow (offset down)
  sprite.ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  sprite.ctx.beginPath();
  sprite.ctx.ellipse(cx, cy + 14, 12, 5, 0, 0, Math.PI * 2);
  sprite.ctx.fill();

  // Spinning Rotor Blades
  const angle = frame * (Math.PI / 2);
  sprite.ctx.strokeStyle = ThemeTokens.colors.concreteRim;
  sprite.ctx.lineWidth = 2.5;

  // Dual rotors
  for (const rx of [cx - 10, cx + 10]) {
    sprite.ctx.beginPath();
    sprite.ctx.moveTo(rx - Math.cos(angle) * 9, cy - 8 - Math.sin(angle) * 4);
    sprite.ctx.lineTo(rx + Math.cos(angle) * 9, cy - 8 + Math.sin(angle) * 4);
    sprite.ctx.stroke();

    // Rotor hub
    sprite.ctx.fillStyle = ThemeTokens.colors.metalTrim;
    sprite.ctx.beginPath();
    sprite.ctx.arc(rx, cy - 8, 2, 0, Math.PI * 2);
    sprite.ctx.fill();
  }

  // Rusted Cross Chassis
  sprite.ctx.fillStyle = ThemeTokens.colors.rustPlateMid;
  sprite.ctx.strokeStyle = ThemeTokens.colors.rustPlateDark;
  sprite.ctx.lineWidth = 1.5;
  sprite.ctx.fillRect(cx - 12, cy - 9, 24, 4); // Rotor boom
  sprite.ctx.fillRect(cx - 5, cy - 6, 10, 14); // Central pod
  sprite.ctx.strokeRect(cx - 5, cy - 6, 10, 14);

  // Ventral Sensor Lens (Glowing Amber)
  sprite.ctx.fillStyle = ThemeTokens.colors.hostileCore;
  sprite.ctx.beginPath();
  sprite.ctx.arc(cx, cy + 4, 3, 0, Math.PI * 2);
  sprite.ctx.fill();
  sprite.ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
  sprite.ctx.fillRect(cx - 1, cy + 3, 1, 1);

  return sprite;
}

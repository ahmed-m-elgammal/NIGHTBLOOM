/**
 * Mira Vale Persona Visual Module
 * Authority: CHARACTERS.md §1 & spec/Technical Design Document (TDD).md §1.3
 * Exports procedural sprite generator for Mira Vale (Signal Keeper).
 */

import { ThemeTokens } from '../../../../content/theme/tokens';
import { createSpriteBuffer, SpriteBuffer } from '../../buffer';
import type { StrideDirection, PersonaSpriteSet } from '../types';
import { MiraHeadRenderer } from './head';
import { MiraBodyRenderer } from './body';
import { drawSpriteWithClosedRim } from './silhouette';

const MIRA_RIM_WIDTH = 1.8;

/**
 * Draw Mira's legs, coat and head into a transparent character buffer.
 * The contact shadow and closed signal rim are composed by createMiraSprite.
 */
function drawMiraCharacter(
  ctx: CanvasRenderingContext2D,
  direction: StrideDirection,
  step: number,
): void {
  const cx = 32;
  const cy = 34;

  // Stride parameters (4-frame walk cycle)
  const legOffsets = [5, 1, -5, -1];
  const armOffsets = [-3, -1, 3, 1];
  const coatSways = [2, 0, -2, 0];

  const s = Math.abs(Math.floor(step)) % 4;
  const legOffset = legOffsets[s];
  const armOffset = armOffsets[s];
  const coatSway = coatSways[s];

  // 1. Legs & Heavy Combat Boots (Pants highlights & sole welt edges)
  if (direction === 'side') {
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx - 5 + legOffset, cy + 13, 7, 8);
    ctx.fillStyle = ThemeTokens.colors.miraPantsHighlight;
    ctx.fillRect(cx - 5 + legOffset, cy + 13, 2, 6);
    // Boot upper & reinforced toe cap
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx - 3 + legOffset, cy + 18, 8, 2.5);
    // Lighter sole welt edge
    ctx.fillStyle = ThemeTokens.colors.miraBootWelt;
    ctx.fillRect(cx - 4 + legOffset, cy + 20, 9, 1);
    // Lugged rubber tread
    ctx.fillStyle = ThemeTokens.colors.miraOutlineBoot;
    ctx.fillRect(cx - 5 + legOffset, cy + 21, 10, 2);
  } else {
    // Left Leg (lit side: subtle highlight facet)
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx - 9, cy + 13 + legOffset, 6, 8);
    ctx.fillStyle = ThemeTokens.colors.miraPantsHighlight;
    ctx.fillRect(cx - 9, cy + 13 + legOffset, 2, 6);
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx - 9, cy + 18 + legOffset, 6, 2.5);
    ctx.fillStyle = ThemeTokens.colors.miraBootWelt;
    ctx.fillRect(cx - 9.5, cy + 20 + legOffset, 7, 1);
    ctx.fillStyle = ThemeTokens.colors.miraOutlineBoot;
    ctx.fillRect(cx - 10, cy + 21 + legOffset, 7.5, 2);

    // Right Leg (shadow side)
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx + 3, cy + 13 - legOffset, 6, 8);
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx + 3, cy + 18 - legOffset, 6, 2.5);
    ctx.fillStyle = ThemeTokens.colors.miraBootWelt;
    ctx.fillRect(cx + 2.5, cy + 20 - legOffset, 7, 1);
    ctx.fillStyle = ThemeTokens.colors.miraOutlineBoot;
    ctx.fillRect(cx + 2.5, cy + 21 - legOffset, 7.5, 2);
  }

  // 2 & 3. Coat, Torso, Survival Gear & Antenna
  MiraBodyRenderer.drawTorso(ctx, cx, cy, direction, armOffset, coatSway);

  // 4. Head, Cowl, Face & Alive Operative Eyes
  MiraHeadRenderer.drawHead(ctx, cx, cy, direction);
}

/**
 * Procedural Mira Vale Operative Sprite (64x64 px high-definition buffer)
 * PB-8: contact shadow + closed cyan rim + material-ramp character.
 */
export function createMiraSprite(direction: StrideDirection, step: number): SpriteBuffer {
  const character = createSpriteBuffer(64, 64);
  drawMiraCharacter(character.ctx, direction, step);

  const sprite = createSpriteBuffer(64, 64);
  const { ctx } = sprite;
  const cx = 32;
  const cy = 34;

  // Contact Drop Shadow (Soft ambient occlusion)
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 20, 16, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Closed signal rim under the character, then the character itself.
  drawSpriteWithClosedRim(
    ctx,
    character,
    ThemeTokens.colors.miraRimClosed,
    MIRA_RIM_WIDTH,
  );

  return sprite;
}

/**
 * Creates the complete 3-facing x 4-frame sprite set for Mira Vale
 */
export function createMiraPersonaSprites(): PersonaSpriteSet {
  return {
    down: [
      createMiraSprite('down', 0),
      createMiraSprite('down', 1),
      createMiraSprite('down', 2),
      createMiraSprite('down', 3),
    ],
    up: [
      createMiraSprite('up', 0),
      createMiraSprite('up', 1),
      createMiraSprite('up', 2),
      createMiraSprite('up', 3),
    ],
    side: [
      createMiraSprite('side', 0),
      createMiraSprite('side', 1),
      createMiraSprite('side', 2),
      createMiraSprite('side', 3),
    ],
  };
}

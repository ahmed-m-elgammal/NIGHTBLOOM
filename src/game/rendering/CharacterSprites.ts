/**
 * Procedural Character Sprites (Mira Vale Operative)
 * Authority: spec/Technical Design Document (TDD).md §1.3 & CHARACTERS.md §1
 * Zero external raster assets. High-definition vector synthesis.
 * Multi-layered anatomy, survival gear, specular eye glints, and dynamic stride.
 */

import { ThemeTokens } from '../../content/theme/tokens';

export function createBuffer(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(`Failed to create 2D context for ${width}x${height} sprite buffer`);
  }
  return { canvas, ctx };
}

/**
 * Procedural Mira Vale Operative Sprite (64x64 px high-definition buffer)
 */
export function createMiraSprite(direction: 'down' | 'up' | 'side', step: number): HTMLCanvasElement {
  const { canvas, ctx } = createBuffer(64, 64);
  const cx = 32;
  const cy = 34;

  // 1. Contact Drop Shadow (Soft ambient occlusion)
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 20, 16, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stride parameters (step 0 vs step 1)
  const isAltStep = step === 1;
  const legOffset = isAltStep ? 5 : -5;
  const armOffset = isAltStep ? -3 : 3;
  const coatSway = isAltStep ? 2 : -2;

  // 2. Legs & Heavy Combat Boots
  ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
  if (direction === 'side') {
    // Lead leg (front)
    ctx.fillRect(cx - 5 + legOffset, cy + 13, 7, 8);
    // Boot sole & reinforced toe cap
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx - 3 + legOffset, cy + 18, 8, 3);
    ctx.fillStyle = ThemeTokens.colors.cableBlack;
    ctx.fillRect(cx - 5 + legOffset, cy + 20, 10, 2); // Lugged rubber tread
  } else {
    // Left Leg
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx - 9, cy + 13 + legOffset, 6, 8);
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx - 9, cy + 18 + legOffset, 6, 3);
    ctx.fillStyle = ThemeTokens.colors.cableBlack;
    ctx.fillRect(cx - 10, cy + 20 + legOffset, 7, 2);

    // Right Leg
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx + 3, cy + 13 - legOffset, 6, 8);
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx + 3, cy + 18 - legOffset, 6, 3);
    ctx.fillStyle = ThemeTokens.colors.cableBlack;
    ctx.fillRect(cx + 3, cy + 20 - legOffset, 7, 2);
  }

  // 3. Field Survival Trenchcoat (Tails & Hem)
  ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
  ctx.beginPath();
  if (direction === 'down') {
    // Split coat tails swaying behind legs
    ctx.moveTo(cx - 12 + coatSway, cy + 16);
    ctx.lineTo(cx + 12 + coatSway, cy + 16);
    ctx.lineTo(cx + 8, cy + 4);
    ctx.lineTo(cx - 8, cy + 4);
    ctx.closePath();
    ctx.fill();
  } else if (direction === 'side') {
    // Coat billowing backward
    ctx.moveTo(cx - 14, cy + 15);
    ctx.lineTo(cx + 6, cy + 14);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.lineTo(cx - 8, cy + 4);
    ctx.closePath();
    ctx.fill();
  }

  // 4. Coat Torso & Chest Harness
  ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
  ctx.strokeStyle = ThemeTokens.colors.panelBorder;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  if (direction === 'down') {
    // High-collar fitted coat torso
    ctx.ellipse(cx, cy + 2, 13, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Double-breasted folded lapel
    ctx.fillStyle = ThemeTokens.colors.portraitJacketLight;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 8);
    ctx.lineTo(cx - 1, cy + 3);
    ctx.lineTo(cx + 6, cy - 8);
    ctx.closePath();
    ctx.fill();

    // Lapel stitch seam
    ctx.strokeStyle = ThemeTokens.colors.panelBorderActive;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 8);
    ctx.lineTo(cx - 1, cy + 3);
    ctx.stroke();

    // Brass snap buttons
    ctx.fillStyle = ThemeTokens.colors.dangerAmberBright;
    ctx.beginPath();
    ctx.arc(cx + 2, cy - 4, 1.5, 0, Math.PI * 2);
    ctx.arc(cx + 2, cy - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Tactical utility belt & brass buckle
    ctx.fillStyle = ThemeTokens.colors.cableBlack;
    ctx.fillRect(cx - 11, cy + 5, 22, 3.5);
    ctx.fillStyle = ThemeTokens.colors.dangerAmberBright;
    ctx.fillRect(cx - 3, cy + 4.5, 6, 4.5);
    ctx.fillStyle = ThemeTokens.colors.cableBlack;
    ctx.fillRect(cx - 1.5, cy + 5.5, 3, 2.5);

    // Ammunition / specimen pouches on hips
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx - 12, cy + 5, 4, 5.5);
    ctx.fillRect(cx + 8, cy + 5, 4, 5.5);

    // Arms & Gloved hands
    ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
    ctx.fillRect(cx - 14, cy - 3 + armOffset, 4, 10);
    ctx.fillRect(cx + 10, cy - 3 - armOffset, 4, 10);
    // Leather gloves
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx - 14, cy + 6 + armOffset, 4, 3.5);
    ctx.fillRect(cx + 10, cy + 6 - armOffset, 4, 3.5);

    // Shoulder Halogen Lantern (Mounted on right shoulder)
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx - 11, cy - 9, 6, 6);
    ctx.fillStyle = ThemeTokens.colors.playerLamp;
    ctx.beginPath();
    ctx.arc(cx - 8, cy - 6, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // Halogen intense core specular
    ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
    ctx.beginPath();
    ctx.arc(cx - 9, cy - 7, 1.2, 0, Math.PI * 2);
    ctx.fill();

  } else if (direction === 'up') {
    // Coat Back
    ctx.ellipse(cx, cy + 2, 13, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Heavy Field Survival Rucksack
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx - 10, cy - 5, 20, 14);
    ctx.strokeStyle = ThemeTokens.colors.concreteRim;
    ctx.strokeRect(cx - 10, cy - 5, 20, 14);

    // Fastening compression straps
    ctx.fillStyle = ThemeTokens.colors.portraitJacketLight;
    ctx.fillRect(cx - 7, cy - 5, 3, 14);
    ctx.fillRect(cx + 4, cy - 5, 3, 14);

    // Rolled bedroll lashed below rucksack
    ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
    ctx.fillRect(cx - 9, cy + 9, 18, 4.5);
    ctx.fillStyle = ThemeTokens.colors.dangerAmberBright;
    ctx.fillRect(cx - 6, cy + 9, 2, 4.5);
    ctx.fillRect(cx + 4, cy + 9, 2, 4.5);

    // Long-range radio whip antenna
    ctx.strokeStyle = ThemeTokens.colors.metalRivets;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + 7, cy - 5);
    ctx.lineTo(cx + 9, cy - 20);
    ctx.stroke();

    // Antenna status beacon LED
    ctx.fillStyle = ThemeTokens.colors.playerBody;
    ctx.beginPath();
    ctx.arc(cx + 9, cy - 20, 2, 0, Math.PI * 2);
    ctx.fill();

  } else {
    // Side Profile Torso
    ctx.ellipse(cx, cy + 2, 11, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Backpack profile (behind)
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx - 13, cy - 4, 8, 13);
    ctx.strokeStyle = ThemeTokens.colors.concreteRim;
    ctx.strokeRect(cx - 13, cy - 4, 8, 13);

    // Antenna tilted
    ctx.strokeStyle = ThemeTokens.colors.metalRivets;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy - 4);
    ctx.lineTo(cx - 13, cy - 19);
    ctx.stroke();
    ctx.fillStyle = ThemeTokens.colors.playerBody;
    ctx.beginPath();
    ctx.arc(cx - 13, cy - 19, 2, 0, Math.PI * 2);
    ctx.fill();

    // Side utility belt pouch
    ctx.fillStyle = ThemeTokens.colors.dangerAmberBright;
    ctx.fillRect(cx + 1, cy + 5, 4, 4);

    // Forward arm & glove
    ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
    ctx.fillRect(cx + 3, cy - 1 + armOffset, 4, 8);
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx + 4, cy + 6 + armOffset, 4, 3.5);

    // Shoulder Halogen Lantern facing forward
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx + 4, cy - 9, 6, 6);
    ctx.fillStyle = ThemeTokens.colors.playerLamp;
    ctx.beginPath();
    ctx.arc(cx + 7, cy - 6, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
    ctx.beginPath();
    ctx.arc(cx + 8, cy - 7, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Head, Cowl, Face & Alive Operative Eyes
  // Cowl Outer Fabric Hood
  ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
  ctx.beginPath();
  ctx.arc(cx, cy - 11, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ThemeTokens.colors.panelBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Interior Cowl Shadow
  ctx.fillStyle = ThemeTokens.colors.portraitSkinDeep;
  ctx.beginPath();
  ctx.arc(cx, cy - 10, 7.5, 0, Math.PI * 2);
  ctx.fill();

  if (direction !== 'up') {
    // Face Flesh Oval
    ctx.fillStyle = ThemeTokens.colors.portraitSkinBase;
    ctx.beginPath();
    if (direction === 'down') {
      ctx.ellipse(cx, cy - 9, 5.5, 6.5, 0, 0, Math.PI * 2);
    } else {
      ctx.ellipse(cx + 2.5, cy - 9, 5, 6.5, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // Jaw / Cheek Contour Shadow
    ctx.fillStyle = ThemeTokens.colors.portraitSkinShadow;
    ctx.beginPath();
    if (direction === 'down') {
      ctx.ellipse(cx, cy - 7, 5, 2.5, 0, 0, Math.PI * 2);
    } else {
      ctx.ellipse(cx + 2, cy - 7, 4.5, 2.5, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // Alive Operative Eyes & Focused Brow
    ctx.fillStyle = ThemeTokens.colors.portraitEyeIris;
    if (direction === 'down') {
      // Brow line
      ctx.fillRect(cx - 4.5, cy - 11.5, 3.5, 1);
      ctx.fillRect(cx + 1, cy - 11.5, 3.5, 1);
      // Irises
      ctx.fillRect(cx - 4, cy - 10, 2.5, 2.5);
      ctx.fillRect(cx + 1.5, cy - 10, 2.5, 2.5);
      // Specular High-Light Glints (Makes eyes look alive, not dead!)
      ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
      ctx.fillRect(cx - 3.5, cy - 10, 1, 1);
      ctx.fillRect(cx + 2, cy - 10, 1, 1);
    } else {
      // Side profile eye
      ctx.fillRect(cx + 3, cy - 11.5, 3, 1);
      ctx.fillRect(cx + 3.5, cy - 10, 2.5, 2.5);
      ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
      ctx.fillRect(cx + 4.5, cy - 10, 1, 1);
    }
  }

  // Windswept Auburn / Chestnut Hair Tufts escaping the cowl
  ctx.fillStyle = ThemeTokens.colors.portraitHairBase;
  ctx.beginPath();
  ctx.arc(cx, cy - 13, 8.5, Math.PI * 0.75, Math.PI * 2.25);
  ctx.fill();

  // Fine hair highlight strand
  ctx.fillStyle = ThemeTokens.colors.portraitHairHighlight;
  ctx.beginPath();
  ctx.arc(cx - 2, cy - 14, 6.5, Math.PI * 0.85, Math.PI * 1.85);
  ctx.fill();

  return canvas;
}

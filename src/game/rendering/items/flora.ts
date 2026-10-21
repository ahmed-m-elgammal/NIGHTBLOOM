/**
 * Procedural Bioluminescent Nightbloom Floral Sprites
 * Authority: spec/Technical Design Document (TDD).md §1.3 & STORY_BIBLE.md §2
 * Zero external raster assets. Organic alien botany synthesized via Canvas 2D.
 */

import { ThemeTokens } from '../../../content/theme/tokens';
import { createSpriteBuffer, SpriteBuffer } from '../buffer';

export function createFlowerClusterSprite(size: number, flowerCount: number): SpriteBuffer {
  const sprite = createSpriteBuffer(size, size);
  const { ctx } = sprite;
  const cx = size / 2;
  const cy = size / 2;

  // 1. Ambient Bioluminescent Spore Mist (Radial Gradient)
  const mistGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, size * 0.48);
  mistGrad.addColorStop(0, ThemeTokens.colors.seedHaloGlow);
  mistGrad.addColorStop(0.6, ThemeTokens.colors.seedGhost);
  mistGrad.addColorStop(1, ThemeTokens.colors.seedTransparent);
  ctx.fillStyle = mistGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
  ctx.fill();

  // 2. Tangled Creeping Root / Vine Bed (Organic tendrils)
  ctx.strokeStyle = ThemeTokens.colors.mossDense;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  const rootAngles = [0.3, 1.1, 1.8, 2.7, 3.6, 4.4, 5.2, 5.9];
  for (const a of rootAngles) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const midR = size * 0.28;
    const endR = size * (0.38 + ((a * 10) % 0.1));
    const mx = cx + Math.cos(a + 0.3) * midR;
    const my = cy + Math.sin(a + 0.3) * midR;
    const ex = cx + Math.cos(a) * endR;
    const ey = cy + Math.sin(a) * endR;
    ctx.quadraticCurveTo(mx, my, ex, ey);
    ctx.stroke();
  }

  // 3. Dense Undergrowth Foliage (Overlapping broad dark-green leaves)
  ctx.fillStyle = ThemeTokens.colors.floraPatch;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.2;
    const r = size * 0.22;
    const lx = cx + Math.cos(a) * r;
    const ly = cy + Math.sin(a) * r;
    ctx.beginPath();
    ctx.ellipse(lx, ly, size * 0.12, size * 0.07, a, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Clustered Bioluminescent Nightbloom Blossoms
  // Natural pseudo-random placements rather than a rigid geometric ring
  const flowerOffsets = [
    [0, 0, 1.1], // Center hero flower (scale 1.1)
    [-0.22, -0.18, 0.85],
    [0.24, -0.15, 0.9],
    [-0.19, 0.22, 0.8],
    [0.21, 0.24, 0.85],
    [0.02, -0.32, 0.75],
    [-0.32, 0.04, 0.75],
    [0.34, 0.05, 0.7],
    [0.05, 0.33, 0.75],
  ];

  const count = Math.min(flowerCount, flowerOffsets.length);

  for (let f = 0; f < count; f++) {
    const [normX, normY, scale] = flowerOffsets[f];
    const fx = cx + normX * size;
    const fy = cy + normY * size;
    const petalRadius = size * 0.07 * scale;

    // Outer Blossom Soft Halo
    const flowerGlow = ctx.createRadialGradient(fx, fy, 1, fx, fy, petalRadius * 2);
    flowerGlow.addColorStop(0, ThemeTokens.colors.seedHaloGlow);
    flowerGlow.addColorStop(1, ThemeTokens.colors.seedTransparent);
    ctx.fillStyle = flowerGlow;
    ctx.beginPath();
    ctx.arc(fx, fy, petalRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // 5 Curved Bioluminescent Petals
    ctx.fillStyle = ThemeTokens.colors.seedHalo;
    ctx.strokeStyle = ThemeTokens.colors.seedCore;
    ctx.lineWidth = 0.8;

    for (let p = 0; p < 5; p++) {
      const pa = (p / 5) * Math.PI * 2 + f * 0.4;
      const px = fx + Math.cos(pa) * petalRadius;
      const py = fy + Math.sin(pa) * petalRadius;

      ctx.beginPath();
      ctx.ellipse(px, py, petalRadius * 0.7, petalRadius * 0.45, pa, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Glowing Stamen Center Receptacle
    ctx.fillStyle = ThemeTokens.colors.seedCore;
    ctx.beginPath();
    ctx.arc(fx, fy, petalRadius * 0.42, 0, Math.PI * 2);
    ctx.fill();

    // Intense Pollen Core (Highlight specular)
    ctx.fillStyle = ThemeTokens.colors.textPrimary;
    ctx.beginPath();
    ctx.arc(fx, fy, petalRadius * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  return sprite;
}

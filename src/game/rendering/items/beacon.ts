/**
 * Procedural Nursery Beacon Transmission Tower Sprite
 * Authority: spec/Technical Design Document (TDD).md §1.3 & STORY_BIBLE.md §2
 * Zero external raster assets. High-definition vector synthesis.
 */

import { ThemeTokens } from '../../../content/theme/tokens';
import { createSpriteBuffer, SpriteBuffer } from '../buffer';

export function createBeaconSprite(): SpriteBuffer {
  const size = 160;
  const sprite = createSpriteBuffer(size, size);
  const { ctx } = sprite;
  const cx = size / 2;
  const cy = size / 2;

  // 1. Foundation Drop Shadow
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 12, 60, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Weathered Octagonal Concrete Pad
  ctx.fillStyle = ThemeTokens.colors.concreteBase;
  ctx.strokeStyle = ThemeTokens.colors.concreteRim;
  ctx.lineWidth = 3;

  ctx.beginPath();
  const padRadius = 56;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const x = cx + Math.cos(a) * padRadius;
    const y = cy + Math.sin(a) * padRadius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 3. Inner Steel Reinforcing Ring & Corner Brackets
  ctx.strokeStyle = ThemeTokens.colors.metalTrim;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const x = cx + Math.cos(a) * (padRadius - 6);
    const y = cy + Math.sin(a) * (padRadius - 6);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Concrete expansion joints
  ctx.strokeStyle = ThemeTokens.colors.concreteCrack;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - padRadius + 8, cy);
  ctx.lineTo(cx + padRadius - 8, cy);
  ctx.moveTo(cx, cy - padRadius + 8);
  ctx.lineTo(cx, cy + padRadius - 8);
  ctx.stroke();

  // 4. Heavy Steel Footing Brackets with Rivets
  ctx.fillStyle = ThemeTokens.colors.metalTrim;
  ctx.strokeStyle = ThemeTokens.colors.metalRivets;
  ctx.lineWidth = 1.5;

  const bracketDist = 34;
  const bracketOffsets = [
    [-bracketDist, -bracketDist],
    [bracketDist, -bracketDist],
    [bracketDist, bracketDist],
    [-bracketDist, bracketDist],
  ];

  for (const [bx, by] of bracketOffsets) {
    ctx.fillRect(cx + bx - 6, cy + by - 6, 12, 12);
    ctx.strokeRect(cx + bx - 6, cy + by - 6, 12, 12);
    // Rivet center
    ctx.fillStyle = ThemeTokens.colors.metalRivets;
    ctx.fillRect(cx + bx - 1.5, cy + by - 1.5, 3, 3);
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
  }

  // 5. Heavy Steel Lattice Cross-Trusses
  ctx.strokeStyle = ThemeTokens.colors.portraitJacketLight;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - bracketDist, cy - bracketDist);
  ctx.lineTo(cx + bracketDist, cy + bracketDist);
  ctx.moveTo(cx + bracketDist, cy - bracketDist);
  ctx.lineTo(cx - bracketDist, cy + bracketDist);
  ctx.stroke();

  // 6. Quad Magnetic Induction Toroidal Coils (Copper Windings)
  const coilDist = 28;
  const coilAngles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
  for (const a of coilAngles) {
    const kx = cx + Math.cos(a) * coilDist;
    const ky = cy + Math.sin(a) * coilDist;

    // Copper casing
    ctx.fillStyle = ThemeTokens.colors.beaconCoilCopper;
    ctx.strokeStyle = ThemeTokens.colors.rustPlateDark;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(kx, ky, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // High voltage conduit cables to center
    ctx.strokeStyle = ThemeTokens.colors.cableBlack;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(kx, ky);
    ctx.lineTo(cx, cy);
    ctx.stroke();
  }

  // 7. Resonant Electromagnetic Containment Ring
  ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
  ctx.strokeStyle = ThemeTokens.colors.panelBorderActive;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 8. Central Plasma Resonator Core (Luminous Cyan)
  const plasmaGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 12);
  plasmaGrad.addColorStop(0, ThemeTokens.colors.textPrimary);
  plasmaGrad.addColorStop(0.4, ThemeTokens.colors.playerLamp);
  plasmaGrad.addColorStop(1, ThemeTokens.colors.playerBody);
  ctx.fillStyle = plasmaGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();

  // 9. Primary High-Mast Antenna Spire
  ctx.strokeStyle = ThemeTokens.colors.textPrimary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - 48);
  ctx.stroke();

  // Crossarm dipoles
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy - 36);
  ctx.lineTo(cx + 12, cy - 36);
  ctx.moveTo(cx - 8, cy - 42);
  ctx.lineTo(cx + 8, cy - 42);
  ctx.stroke();

  // Aviation obstruction beacon mount
  ctx.fillStyle = ThemeTokens.colors.metalTrim;
  ctx.fillRect(cx - 3, cy - 52, 6, 4);

  return sprite;
}

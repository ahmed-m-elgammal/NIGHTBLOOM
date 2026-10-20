/**
 * Procedural Enemy Sprites (Seedling, Bloomed Seedling, Thornrunner, Rustwing, Briarheart)
 * Staged for Milestone B: Core Combat & Entity Atlas Wiring
 * Authority: PREPRODUCTION.md §6.1 & spec/Technical Design Document (TDD).md §1.3
 */

import { ThemeTokens } from '../src/content/theme/tokens';
import { createBuffer } from '../src/game/rendering/CharacterSprites';

/**
 * Seedling Sprite (36x36 px)
 * Round bulbous plant predator with 5 opening serrated petals and glowing spore core
 */
export function createSeedlingSprite(frame: number = 0): HTMLCanvasElement {
  const size = 36;
  const { canvas, ctx } = createBuffer(size, size);
  const cx = size / 2;
  const cy = size / 2;

  // Drop shadow
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 12, 11, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5 Predatory Petals
  const petalOpen = frame === 1 ? 1.25 : 1.0;
  ctx.fillStyle = ThemeTokens.colors.floraPatch;
  ctx.strokeStyle = ThemeTokens.colors.seedCore;
  ctx.lineWidth = 1.2;

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const dist = 9 * petalOpen;
    const px = cx + Math.cos(a) * dist;
    const py = cy + Math.sin(a) * dist;

    ctx.beginPath();
    ctx.ellipse(px, py, 6 * petalOpen, 4 * petalOpen, a, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Bulbous Central Spore Body
  ctx.fillStyle = ThemeTokens.colors.mossDense;
  ctx.strokeStyle = ThemeTokens.colors.metalTrim;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing Toxic Spore Core (Hostile amber/green)
  ctx.fillStyle = ThemeTokens.colors.hostileCore;
  ctx.beginPath();
  ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

/**
 * Bloomed Seedling Sprite (44x44 px)
 * Seedling surrounded by an aggressive outer amber petal ring
 */
export function createBloomedSeedlingSprite(frame: number = 0): HTMLCanvasElement {
  const size = 44;
  const { canvas, ctx } = createBuffer(size, size);
  const cx = size / 2;
  const cy = size / 2;

  // Drop shadow
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 15, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Outer Thorn Petal Ring (Hostile Amber)
  const pulse = frame === 1 ? 1.15 : 1.0;
  ctx.fillStyle = ThemeTokens.colors.rustPlateMid;
  ctx.strokeStyle = ThemeTokens.colors.dangerAmberBright;
  ctx.lineWidth = 1.4;

  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const dist = 13 * pulse;
    const px = cx + Math.cos(a) * dist;
    const py = cy + Math.sin(a) * dist;

    ctx.beginPath();
    ctx.ellipse(px, py, 5 * pulse, 3 * pulse, a, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Inner Seedling Core
  ctx.fillStyle = ThemeTokens.colors.floraPatch;
  ctx.strokeStyle = ThemeTokens.colors.hostileCore;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Radiating Amber Core Emitter
  ctx.fillStyle = ThemeTokens.colors.dangerAmberBright;
  ctx.beginPath();
  ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

/**
 * Thornrunner Sprite (38x30 px)
 * Low angular wedge quadruped with sharp thorn crest
 */
export function createThornrunnerSprite(frame: number = 0): HTMLCanvasElement {
  const { canvas, ctx } = createBuffer(38, 30);
  const cx = 19;
  const cy = 15;

  // Drop shadow
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 9, 13, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  const legStride = frame === 1 ? 3 : -3;

  // Scuttling Chitinous Legs
  ctx.strokeStyle = ThemeTokens.colors.groundElevated;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  // Front legs
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy + 2);
  ctx.lineTo(cx + 12 + legStride, cy + 10);
  ctx.moveTo(cx + 6, cy - 2);
  ctx.lineTo(cx + 12 - legStride, cy - 8);

  // Rear legs
  ctx.moveTo(cx - 6, cy + 2);
  ctx.lineTo(cx - 12 - legStride, cy + 10);
  ctx.moveTo(cx - 6, cy - 2);
  ctx.lineTo(cx - 12 + legStride, cy - 8);
  ctx.stroke();

  // Wedge Carapace Body
  ctx.fillStyle = ThemeTokens.colors.floraPatch;
  ctx.strokeStyle = ThemeTokens.colors.dangerAmberGhost;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(cx + 12, cy); // Snout
  ctx.lineTo(cx - 10, cy + 8);
  ctx.lineTo(cx - 6, cy);
  ctx.lineTo(cx - 10, cy - 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Dorsal Thorn Spikes
  ctx.fillStyle = ThemeTokens.colors.rustPlateLight;
  for (let sx = cx - 4; sx <= cx + 4; sx += 4) {
    ctx.beginPath();
    ctx.moveTo(sx, cy - 3);
    ctx.lineTo(sx - 2, cy - 8);
    ctx.lineTo(sx + 2, cy - 3);
    ctx.closePath();
    ctx.fill();
  }

  // Amber Predator Eye
  ctx.fillStyle = ThemeTokens.colors.dangerAmberBright;
  ctx.beginPath();
  ctx.arc(cx + 8, cy - 1.5, 1.5, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

/**
 * Rustwing Sprite (44x44 px)
 * Rusted hovering drone with dual spinning rotors and attitude tilt
 */
export function createRustwingSprite(frame: number = 0): HTMLCanvasElement {
  const { canvas, ctx } = createBuffer(44, 44);
  const cx = 22;
  const cy = 22;

  // Hovering Ground Shadow (offset down)
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 14, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spinning Rotor Blades
  const angle = frame * (Math.PI / 2);
  ctx.strokeStyle = ThemeTokens.colors.concreteRim;
  ctx.lineWidth = 2.5;

  // Dual rotors
  for (const rx of [cx - 10, cx + 10]) {
    ctx.beginPath();
    ctx.moveTo(rx - Math.cos(angle) * 9, cy - 8 - Math.sin(angle) * 4);
    ctx.lineTo(rx + Math.cos(angle) * 9, cy - 8 + Math.sin(angle) * 4);
    ctx.stroke();

    // Rotor hub
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.beginPath();
    ctx.arc(rx, cy - 8, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rusted Cross Chassis
  ctx.fillStyle = ThemeTokens.colors.rustPlateMid;
  ctx.strokeStyle = ThemeTokens.colors.rustPlateDark;
  ctx.lineWidth = 1.5;
  ctx.fillRect(cx - 12, cy - 9, 24, 4); // Rotor boom
  ctx.fillRect(cx - 5, cy - 6, 10, 14); // Central pod
  ctx.strokeRect(cx - 5, cy - 6, 10, 14);

  // Ventral Sensor Lens (Glowing Amber)
  ctx.fillStyle = ThemeTokens.colors.hostileCore;
  ctx.beginPath();
  ctx.arc(cx, cy + 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
  ctx.fillRect(cx - 1, cy + 3, 1, 1);

  return canvas;
}

/**
 * Briarheart Heavy Botanical Brute Sprite (80x80 px)
 * Massive heavy hex botanical golem with thorn armor and molten core vents
 */
export function createBriarheartSprite(frame: number = 0): HTMLCanvasElement {
  const size = 80;
  const { canvas, ctx } = createBuffer(size, size);
  const cx = size / 2;
  const cy = size / 2;

  // Huge contact drop shadow
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 28, 30, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heavy Tangled Bramble Hex Body
  ctx.fillStyle = ThemeTokens.colors.rustPlateDark;
  ctx.strokeStyle = ThemeTokens.colors.mossDense;
  ctx.lineWidth = 3;

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = cx + Math.cos(a) * 26;
    const y = cy + Math.sin(a) * 24;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Thorn Armor Plates
  ctx.fillStyle = ThemeTokens.colors.groundElevated;
  ctx.strokeStyle = ThemeTokens.colors.dangerAmberGhost;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing Molten Core Vents
  const pulse = frame === 1 ? 1.2 : 1.0;
  const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 12 * pulse);
  coreGrad.addColorStop(0, ThemeTokens.colors.dangerAmberBright);
  coreGrad.addColorStop(0.6, ThemeTokens.colors.hostileCore);
  coreGrad.addColorStop(1, ThemeTokens.colors.rustPlateDark);
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 12 * pulse, 0, Math.PI * 2);
  ctx.fill();

  // Spiked Shoulder Knots
  ctx.fillStyle = ThemeTokens.colors.rustPlateLight;
  ctx.fillRect(cx - 32, cy - 10, 8, 12);
  ctx.fillRect(cx + 24, cy - 10, 8, 12);

  return canvas;
}

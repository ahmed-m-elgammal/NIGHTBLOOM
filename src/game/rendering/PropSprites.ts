/**
 * Procedural Agricultural Prop Sprites (Combine Harvester, Relay Pylon, Soil Sensor)
 * Authority: spec/Technical Design Document (TDD).md §1.3 & STORY_BIBLE.md §2
 * Zero external raster assets. Atmospheric post-collapse machinery synthesized via Canvas 2D.
 */

import { ThemeTokens } from '../../content/theme/tokens';
import { createBuffer } from './CharacterSprites';

/**
 * Abandoned Nursery Combine Harvester (120x84 px buffer)
 */
export function createHarvesterSprite(): HTMLCanvasElement {
  const { canvas, ctx } = createBuffer(120, 84);
  const cx = 60;
  const cy = 46;

  // 1. Heavy Contact Shadow
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 18, 48, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Crawler Treads (Left & Right continuous track units)
  ctx.fillStyle = ThemeTokens.colors.cableBlack;
  ctx.strokeStyle = ThemeTokens.colors.metalTrim;
  ctx.lineWidth = 1.5;

  // Lower Track Belt
  ctx.fillRect(cx - 46, cy + 10, 92, 14);
  ctx.strokeRect(cx - 46, cy + 10, 92, 14);

  // Track Roller Wheels
  ctx.fillStyle = ThemeTokens.colors.concreteRim;
  for (let rx = cx - 38; rx <= cx + 38; rx += 15) {
    ctx.beginPath();
    ctx.arc(rx, cy + 17, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ThemeTokens.colors.metalRivets;
    ctx.stroke();
  }

  // 3. Weathered Rusted Chassis Engine Block
  ctx.fillStyle = ThemeTokens.colors.rustPlateDark;
  ctx.strokeStyle = ThemeTokens.colors.rustPlateMid;
  ctx.lineWidth = 2;
  ctx.fillRect(cx - 40, cy - 14, 80, 26);
  ctx.strokeRect(cx - 40, cy - 14, 80, 26);

  // Corrugated Rust Engine Cowling Panels
  ctx.fillStyle = ThemeTokens.colors.rustPlateMid;
  ctx.fillRect(cx - 36, cy - 10, 32, 18);
  ctx.strokeStyle = ThemeTokens.colors.rustPlateLight;
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - 36, cy - 10, 32, 18);

  // Engine radiator cooling louver vents
  ctx.strokeStyle = ThemeTokens.colors.cableBlack;
  ctx.lineWidth = 1.5;
  for (let vy = cy - 6; vy <= cy + 4; vy += 3) {
    ctx.beginPath();
    ctx.moveTo(cx - 32, vy);
    ctx.lineTo(cx - 8, vy);
    ctx.stroke();
  }

  // 4. Operator Glass Cab Frame
  ctx.fillStyle = ThemeTokens.colors.glassCabin;
  ctx.strokeStyle = ThemeTokens.colors.glassFrame;
  ctx.lineWidth = 2;
  ctx.fillRect(cx + 2, cy - 28, 32, 20);
  ctx.strokeRect(cx + 2, cy - 28, 32, 20);

  // Broken glass diagonal fracture line
  ctx.strokeStyle = ThemeTokens.colors.panelBorder;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy - 10);
  ctx.lineTo(cx + 18, cy - 22);
  ctx.lineTo(cx + 30, cy - 24);
  ctx.stroke();

  // 5. Heavy Cylindrical Front Harvesting Reel
  ctx.fillStyle = ThemeTokens.colors.groundElevated;
  ctx.strokeStyle = ThemeTokens.colors.dangerAmberBright;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(cx - 38, cy + 2, 8, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Spiked cutter teeth
  ctx.strokeStyle = ThemeTokens.colors.rustPlateLight;
  ctx.lineWidth = 1.2;
  for (let ty = cy - 12; ty <= cy + 14; ty += 5) {
    ctx.beginPath();
    ctx.moveTo(cx - 44, ty);
    ctx.lineTo(cx - 38, ty);
    ctx.stroke();
  }

  // 6. Overhead Exhaust Stack & Stencil Hazard Band
  ctx.fillStyle = ThemeTokens.colors.metalTrim;
  ctx.fillRect(cx - 18, cy - 32, 5, 20);
  // Curved exhaust tip
  ctx.beginPath();
  ctx.arc(cx - 15.5, cy - 32, 3.5, Math.PI, 0);
  ctx.stroke();

  // Yellow hazard caution band on cab roof
  ctx.fillStyle = ThemeTokens.colors.hazardYellow;
  ctx.fillRect(cx + 4, cy - 29, 28, 3);

  return canvas;
}

/**
 * Irrigation Power Relay Pylon (64x96 px buffer)
 */
export function createPylonPropSprite(): HTMLCanvasElement {
  const { canvas, ctx } = createBuffer(64, 96);
  const cx = 32;

  // Drop shadow
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, 88, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Concrete footing
  ctx.fillStyle = ThemeTokens.colors.concreteBase;
  ctx.strokeStyle = ThemeTokens.colors.concreteRim;
  ctx.lineWidth = 2;
  ctx.fillRect(cx - 10, 80, 20, 8);
  ctx.strokeRect(cx - 10, 80, 20, 8);

  // Tapered Steel Lattice Mast
  ctx.strokeStyle = ThemeTokens.colors.portraitJacketLight;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 8, 80);
  ctx.lineTo(cx - 3, 14);
  ctx.lineTo(cx + 3, 14);
  ctx.lineTo(cx + 8, 80);
  ctx.stroke();

  // Cross-bracing trusses
  ctx.lineWidth = 1.2;
  const trussY = [24, 38, 52, 66];
  for (const y of trussY) {
    ctx.beginPath();
    ctx.moveTo(cx - 6, y);
    ctx.lineTo(cx + 6, y + 10);
    ctx.moveTo(cx + 6, y);
    ctx.lineTo(cx - 6, y + 10);
    ctx.stroke();
  }

  // Upper Crossarm Beam
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 22, 22);
  ctx.lineTo(cx + 22, 22);
  ctx.stroke();

  // 3 Ribbed Ceramic Insulator Bells
  const insulatorX = [cx - 18, cx, cx + 18];
  ctx.fillStyle = ThemeTokens.colors.concreteRim;
  for (const ix of insulatorX) {
    ctx.fillRect(ix - 2.5, 23, 5, 8);
    // Wire connection point
    ctx.fillStyle = ThemeTokens.colors.beaconCoilCopper;
    ctx.fillRect(ix - 1.5, 31, 3, 2);
    ctx.fillStyle = ThemeTokens.colors.concreteRim;
  }

  // Transformer box mounted on mid-mast
  ctx.fillStyle = ThemeTokens.colors.groundElevated;
  ctx.strokeStyle = ThemeTokens.colors.panelBorder;
  ctx.lineWidth = 1.5;
  ctx.fillRect(cx - 7, 44, 14, 16);
  ctx.strokeRect(cx - 7, 44, 14, 16);

  // Blinking Cyan Diagnostic Relay LED
  ctx.fillStyle = ThemeTokens.colors.signalCyanDim;
  ctx.beginPath();
  ctx.arc(cx, 52, 2.5, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

/**
 * Soil Telemetry Sensor Station (48x64 px buffer)
 */
export function createSensorPropSprite(): HTMLCanvasElement {
  const { canvas, ctx } = createBuffer(48, 64);
  const cx = 24;

  // Drop shadow
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, 58, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tripod Legs driven into soil
  ctx.strokeStyle = ThemeTokens.colors.metalTrim;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(cx, 34);
  ctx.lineTo(cx - 10, 58);
  ctx.moveTo(cx, 34);
  ctx.lineTo(cx + 10, 58);
  ctx.moveTo(cx, 34);
  ctx.lineTo(cx, 59);
  ctx.stroke();

  // Telemetry Terminal Head
  ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
  ctx.strokeStyle = ThemeTokens.colors.panelBorder;
  ctx.lineWidth = 1.5;
  ctx.fillRect(cx - 8, 20, 16, 15);
  ctx.strokeRect(cx - 8, 20, 16, 15);

  // Miniature LCD Readout Screen (Glowing Green)
  ctx.fillStyle = ThemeTokens.colors.seedCore;
  ctx.fillRect(cx - 6, 23, 12, 8);

  // Angled Solar Collection Cell
  ctx.fillStyle = ThemeTokens.colors.signalCyanDim;
  ctx.strokeStyle = ThemeTokens.colors.textPrimary;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 10, 15);
  ctx.lineTo(cx + 10, 11);
  ctx.lineTo(cx + 10, 19);
  ctx.lineTo(cx - 10, 23);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  return canvas;
}

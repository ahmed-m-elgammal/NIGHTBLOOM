/**
 * Procedural Agricultural Nursery Landmarks
 * Authority: spec/Technical Design Document (TDD).md §1.3 & STORY_BIBLE.md §2
 * Spatial anchors for kiting and environmental storytelling.
 * Zero external raster assets. 100% Canvas 2D vector synthesis.
 */

import { ThemeTokens } from '../../../content/theme/tokens';
import { createSpriteBuffer, SpriteBuffer } from '../buffer';

/**
 * Collapsed Nursery Glasshouse (220x140 px buffer)
 * East of the central road — rusted iron trusses, shattered panes, climbing vines.
 */
export function createGlasshouseSprite(): SpriteBuffer {
  const sprite = createSpriteBuffer(220, 140);
  const { ctx } = sprite;
  const cx = 110;
  const cy = 70;

  // 1. Foundation Footing Shadow & Debris
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 50, 95, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Brick / Concrete Knee Wall Foundation
  ctx.fillStyle = ThemeTokens.colors.concreteBase;
  ctx.strokeStyle = ThemeTokens.colors.concreteRim;
  ctx.lineWidth = 2;
  ctx.fillRect(cx - 95, cy + 25, 190, 20);
  ctx.strokeRect(cx - 95, cy + 25, 190, 20);

  // Top-lit knee-wall cap gives the landmark a readable midground edge.
  ctx.fillStyle = ThemeTokens.colors.concreteRim;
  ctx.fillRect(cx - 95, cy + 25, 190, 4);
  ctx.strokeStyle = ThemeTokens.colors.midgroundRimLight;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx - 93, cy + 26);
  ctx.lineTo(cx + 93, cy + 26);
  ctx.stroke();

  // Concrete expansion joints
  ctx.strokeStyle = ThemeTokens.colors.concreteCrack;
  ctx.lineWidth = 1;
  for (let x = cx - 75; x < cx + 95; x += 38) {
    ctx.beginPath();
    ctx.moveTo(x, cy + 25);
    ctx.lineTo(x, cy + 45);
    ctx.stroke();
  }

  // 2. Interior Planting Benches / Rotten Trestles
  ctx.fillStyle = ThemeTokens.colors.machineryBronze;
  ctx.fillRect(cx - 85, cy + 10, 75, 16);
  ctx.fillRect(cx + 10, cy + 10, 75, 16);
  ctx.fillStyle = ThemeTokens.colors.rustPlateMid;
  ctx.fillRect(cx - 85, cy + 10, 75, 2);
  ctx.fillRect(cx + 10, cy + 10, 75, 2);

  // 3. Structural Steel Gable Roof Trusses (Arches & Ribs)
  ctx.strokeStyle = ThemeTokens.colors.glasshouseSteel;
  ctx.lineWidth = 2.5;

  const trussSpans = [-85, -45, -5, 35, 75];
  for (let i = 0; i < trussSpans.length; i++) {
    const tx = cx + trussSpans[i];
    // Vertical side post
    ctx.beginPath();
    ctx.moveTo(tx, cy + 25);
    ctx.lineTo(tx, cy - 10);
    // Roof ridge rafters
    ctx.lineTo(tx + (i % 2 === 0 ? 10 : -8), cy - 42); // Bent / distorted by collapse
    ctx.lineTo(tx + 20, cy + 25);
    ctx.stroke();
  }

  // Central Roof Ridge Beam (sagging/collapsed toward center)
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 90, cy - 35);
  ctx.quadraticCurveTo(cx - 10, cy - 20, cx + 90, cy - 38);
  ctx.stroke();

  // Lit upper edge of the ridge and outer truss posts.
  ctx.strokeStyle = ThemeTokens.colors.midgroundRimLight;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(cx - 90, cy - 37);
  ctx.quadraticCurveTo(cx - 10, cy - 22, cx + 88, cy - 40);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 85, cy + 24);
  ctx.lineTo(cx - 85, cy - 10);
  ctx.moveTo(cx + 75, cy + 24);
  ctx.lineTo(cx + 75, cy - 10);
  ctx.stroke();

  // 4. Broken Translucent Glass Panes
  ctx.fillStyle = ThemeTokens.colors.glasshousePane;
  ctx.strokeStyle = ThemeTokens.colors.panelBorderSubtle;
  ctx.lineWidth = 1;

  // Intact/semi-intact pane triangles on far rafters
  const panes = [
    [cx - 80, cy - 8, cx - 70, cy - 30, cx - 55, cy - 6],
    [cx + 40, cy - 10, cx + 55, cy - 32, cx + 70, cy - 8],
    [cx - 40, cy + 5, cx - 25, cy - 15, cx - 10, cy + 8],
  ];

  for (const p of panes) {
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(p[2], p[3]);
    ctx.lineTo(p[4], p[5]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Broken glass shards on ground
  ctx.fillStyle = ThemeTokens.colors.signalCyanGhost;
  for (let s = 0; s < 12; s++) {
    const sx = cx - 70 + (s * 13) % 150;
    const sy = cy + 30 + (s * 7) % 20;
    ctx.fillRect(sx, sy, 3, 2);
  }

  // 5. Encroaching Wild Moss & Creeping Vines
  ctx.strokeStyle = ThemeTokens.colors.mossDense;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 95, cy + 40);
  ctx.quadraticCurveTo(cx - 85, cy + 10, cx - 80, cy - 15);
  ctx.quadraticCurveTo(cx - 75, cy - 30, cx - 60, cy - 25);
  ctx.stroke();

  ctx.strokeStyle = ThemeTokens.colors.mossFringe;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx + 85, cy + 42);
  ctx.quadraticCurveTo(cx + 70, cy + 15, cx + 65, cy - 10);
  ctx.stroke();

  return sprite;
}

/**
 * Nursery Cold-Frame Hoop Beds (190x150 px buffer)
 * West of the road — parallel nursery rows with arched wire hoops and seedling trays.
 */
export function createColdFramesSprite(): SpriteBuffer {
  const sprite = createSpriteBuffer(190, 150);
  const { ctx } = sprite;
  const cx = 95;
  const cy = 75;

  // 1. Bed Earth Bedding Shadow
  ctx.fillStyle = ThemeTokens.colors.shadowEntity;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 45, 85, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Three Parallel Raised Seed-Beds
  const bedYOffsets = [-40, 0, 40];
  for (const by of bedYOffsets) {
    const rowY = cy + by;

    // Raised Peat Bed
    ctx.fillStyle = ThemeTokens.colors.soilPatchDark;
    ctx.strokeStyle = ThemeTokens.colors.soilFurrowDark;
    ctx.lineWidth = 1.5;
    ctx.fillRect(cx - 80, rowY - 14, 160, 26);
    ctx.strokeRect(cx - 80, rowY - 14, 160, 26);

    // Weathered Plastic Poly-Film Cover
    ctx.fillStyle = ThemeTokens.colors.coldFramePlastic;
    ctx.fillRect(cx - 75, rowY - 12, 150, 22);
    ctx.strokeStyle = ThemeTokens.colors.midgroundRimLight;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 73, rowY - 11);
    ctx.lineTo(cx + 73, rowY - 11);
    ctx.stroke();

    // Arched Wire Hoops spanning each row
    ctx.strokeStyle = ThemeTokens.colors.metalTrim;
    ctx.lineWidth = 1.8;
    for (let hx = cx - 65; hx <= cx + 65; hx += 26) {
      ctx.beginPath();
      ctx.arc(hx, rowY, 11, Math.PI, 0);
      ctx.stroke();
    }

    // Emergent Nightbloom Seedling Trays (Green bioluminescent dots under plastic)
    ctx.fillStyle = ThemeTokens.colors.seedHalo;
    for (let tx = cx - 60; tx <= cx + 60; tx += 12) {
      ctx.beginPath();
      ctx.arc(tx, rowY + 1, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Black Irrigation Drip Tube running along row header
    ctx.strokeStyle = ThemeTokens.colors.cableBlack;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 84, rowY + 11);
    ctx.lineTo(cx + 84, rowY + 11);
    ctx.stroke();
  }

  // Connecting Irrigation Manifold Valve on the Left
  ctx.fillStyle = ThemeTokens.colors.machineryBronze;
  ctx.fillRect(cx - 88, cy - 42, 6, 88);
  ctx.fillStyle = ThemeTokens.colors.midgroundRimLight;
  ctx.fillRect(cx - 88, cy - 42, 1.5, 88);
  ctx.fillStyle = ThemeTokens.colors.amberMuted;
  ctx.fillRect(cx - 90, cy - 2, 8, 8); // Brass valve handle

  return sprite;
}

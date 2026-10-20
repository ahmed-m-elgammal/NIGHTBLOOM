/**
 * Procedural Agricultural Ground & Nursery Field Generator
 * Authority: spec/Technical Design Document (TDD).md §1.3 & GDD.md §4.1
 * Foundation F-1: Pre-rendered 3200x2400 offscreen cache for zero per-frame redraw.
 * Foundation F-3: Seeded organic scatter (stubble, stones, soil value patches, landmarks).
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { ThemeTokens } from '../../content/theme/tokens';
import { SeededRNG } from '../core/rng';
import { createBuffer } from './CharacterSprites';
import { SpriteAtlas } from './SpriteFactory';

export class GroundRenderer {
  private static cachedCanvas: HTMLCanvasElement | null = null;

  public static getGroundCache(atlas: SpriteAtlas): HTMLCanvasElement {
    if (!this.cachedCanvas) {
      this.cachedCanvas = this.renderOffscreenGround(atlas);
    }
    return this.cachedCanvas;
  }

  private static renderOffscreenGround(atlas: SpriteAtlas): HTMLCanvasElement {
    const { width: mw, height: mh, furrowRowHeight, borderStrokeWidth } = GAME_CONFIG.map;
    const { canvas, ctx } = createBuffer(mw, mh);
    const rng = new SeededRNG(GAME_CONFIG.map.scatter.seed);

    // 1. Organic Loam Base Soil
    ctx.fillStyle = ThemeTokens.colors.groundSecondary;
    ctx.fillRect(0, 0, mw, mh);

    // 2. Seeded Large Earthen Value Patches (Soft organic variation across field)
    for (let i = 0; i < GAME_CONFIG.map.scatter.soilPatchCount; i++) {
      const px = rng.nextFloat(100, mw - 100);
      const py = rng.nextFloat(100, mh - 100);
      const rx = rng.nextFloat(80, 240);
      const ry = rng.nextFloat(50, 140);
      const angle = rng.nextFloat(0, Math.PI);
      const isLighter = rng.next() > 0.5;

      ctx.fillStyle = isLighter ? ThemeTokens.colors.soilPatchLight : ThemeTokens.colors.soilPatchDark;
      ctx.beginPath();
      ctx.ellipse(px, py, rx, ry, angle, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Tilled Agricultural Furrow Ridges
    const rowStep = furrowRowHeight || 44;
    ctx.lineWidth = 1.8;
    for (let y = 30; y < mh; y += rowStep) {
      const isAlt = Math.floor(y / rowStep) % 2 === 0;
      ctx.strokeStyle = isAlt ? ThemeTokens.colors.soilFurrowDark : ThemeTokens.colors.soilFurrowLight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= mw; x += 160) {
        const waveY = y + Math.sin(x * 0.015 + y) * 2.5;
        ctx.lineTo(x, waveY);
      }
      ctx.stroke();

      // Earth clod dots along the furrows
      ctx.fillStyle = isAlt ? ThemeTokens.colors.groundElevated : ThemeTokens.colors.groundBase;
      for (let x = 60; x < mw; x += 220) {
        const clodX = x + ((y * 17) % 80);
        const clodY = y + Math.sin(clodX * 0.015 + y) * 2.5 + 2;
        ctx.fillRect(clodX, clodY, 3, 2);
      }
    }

    // 4. Seeded Crop-Row Stubble Tufts & Field Stones
    ctx.strokeStyle = ThemeTokens.colors.strawStubble;
    ctx.lineWidth = 1.4;
    for (let s = 0; s < GAME_CONFIG.map.scatter.stubbleCount; s++) {
      const sx = rng.nextFloat(80, mw - 80);
      const sy = rng.nextFloat(60, mh - 60);
      // Stubble tuft (3 short vertical stalks)
      ctx.beginPath();
      ctx.moveTo(sx - 2, sy);
      ctx.lineTo(sx - 3, sy - 5);
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx, sy - 6);
      ctx.moveTo(sx + 2, sy);
      ctx.lineTo(sx + 3, sy - 4);
      ctx.stroke();
    }

    ctx.fillStyle = ThemeTokens.colors.concreteRim;
    for (let st = 0; st < GAME_CONFIG.map.scatter.stoneCount; st++) {
      const stX = rng.nextFloat(80, mw - 80);
      const stY = rng.nextFloat(60, mh - 60);
      const stR = rng.nextFloat(1.5, 3.5);
      ctx.beginPath();
      ctx.arc(stX, stY, stR, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Central Concrete Nursery Transport Road
    const roadWidth = GAME_CONFIG.map.roadWidth;
    const roadX = GAME_CONFIG.map.roadCenterX - roadWidth / 2;
    ctx.fillStyle = ThemeTokens.colors.concreteBase;
    ctx.fillRect(roadX, 0, roadWidth, mh);
    ctx.strokeStyle = ThemeTokens.colors.concreteRim;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(roadX, 0, roadWidth, mh);

    // Concrete pavement joints
    ctx.strokeStyle = ThemeTokens.colors.concreteCrack;
    ctx.lineWidth = 1.2;
    for (let y = 0; y <= mh; y += 80) {
      ctx.beginPath();
      ctx.moveTo(roadX, y);
      ctx.lineTo(roadX + roadWidth, y);
      ctx.stroke();
    }

    // 6. Nursery Beacon Octagonal Foundation Plaza
    const { x: bx, y: by } = GAME_CONFIG.beacon;
    ctx.fillStyle = ThemeTokens.colors.concreteBase;
    ctx.strokeStyle = ThemeTokens.colors.concreteRim;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const px = bx + Math.cos(a) * 110;
      const py = by + Math.sin(a) * 110;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 7. Hand-Crafted Narrative Landmarks
    const { glasshouse, coldFrames } = GAME_CONFIG.map.landmarks;
    ctx.drawImage(
      atlas.landmarks.glasshouse,
      glasshouse.x - glasshouse.width / 2,
      glasshouse.y - glasshouse.height / 2
    );
    ctx.drawImage(
      atlas.landmarks.coldFrames,
      coldFrames.x - coldFrames.width / 2,
      coldFrames.y - coldFrames.height / 2
    );

    // 8. Static Machinery Props (Harvesters, Pylons, Sensors) with subtle transform variation
    const { harvesters, pylons, sensors } = GAME_CONFIG.map.props;

    for (let h = 0; h < harvesters.length; h++) {
      const pos = harvesters[h];
      const sprite = atlas.props.harvester;
      ctx.save();
      ctx.translate(pos.x, pos.y);
      if (h % 2 === 1) ctx.scale(-1, 1); // Mirror second harvester
      ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
      ctx.restore();
    }

    for (let p = 0; p < pylons.length; p++) {
      const pos = pylons[p];
      const sprite = atlas.props.pylon;
      ctx.save();
      ctx.translate(pos.x, pos.y);
      if (p % 2 === 1) ctx.rotate(0.04);
      ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
      ctx.restore();
    }

    for (const pos of sensors) {
      const sprite = atlas.props.sensor;
      ctx.drawImage(sprite, pos.x - sprite.width / 2, pos.y - sprite.height / 2);
    }

    // 9. Perimeter Nursery Security Fence & Stencils
    ctx.strokeStyle = ThemeTokens.colors.panelBorderActive;
    ctx.lineWidth = borderStrokeWidth;
    ctx.strokeRect(borderStrokeWidth, borderStrokeWidth, mw - borderStrokeWidth * 2, mh - borderStrokeWidth * 2);

    const cornerSize = 80;
    ctx.fillStyle = ThemeTokens.colors.hazardYellow;
    ctx.fillRect(0, 0, cornerSize, borderStrokeWidth * 2);
    ctx.fillRect(mw - cornerSize, 0, cornerSize, borderStrokeWidth * 2);
    ctx.fillRect(0, mh - borderStrokeWidth * 2, cornerSize, borderStrokeWidth * 2);
    ctx.fillRect(mw - cornerSize, mh - borderStrokeWidth * 2, cornerSize, borderStrokeWidth * 2);

    return canvas;
  }
}

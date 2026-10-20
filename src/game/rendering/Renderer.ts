/**
 * Canvas 2D Render Pipeline with Procedural Sprite Atlas
 * Authority: nightbloom_game_prompt.md §6 & spec/Technical Design Document (TDD).md §1
 * Rules: ZERO hardcoded hex/rgba. All visuals use ThemeTokens & SpriteFactory.
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { ThemeTokens } from '../../content/theme/tokens';
import { PlayerEntity } from '../entities/player';
import { Vector2D } from '../input/InputManager';
import { SpriteFactory, SpriteAtlas } from './SpriteFactory';
import { LightingPass } from './LightingPass';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private atlas: SpriteAtlas | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to acquire 2D rendering context from canvas');
    }
    this.ctx = context;
    if (typeof window !== 'undefined') {
      this.atlas = SpriteFactory.getAtlas();
    }
    this.resize();
  }

  public resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, GAME_CONFIG.viewport.maxDpr);
    this.canvas.width = Math.floor(GAME_CONFIG.viewport.width * dpr);
    this.canvas.height = Math.floor(GAME_CONFIG.viewport.height * dpr);
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }

  public render(player: PlayerEntity, camera: Vector2D, timeSec: number): void {
    const { ctx } = this;
    const vw = GAME_CONFIG.viewport.width;
    const vh = GAME_CONFIG.viewport.height;

    // Clear viewport with ground base token
    ctx.fillStyle = ThemeTokens.colors.groundBase;
    ctx.fillRect(0, 0, vw, vh);

    ctx.save();
    // Camera translation (Centers camera on player with smooth tracking)
    ctx.translate(vw / 2 - camera.x, vh / 2 - camera.y);

    // Layer 1: Ground terrain, plowed furrows, concrete access way, and moss
    this.drawGround();

    // Layer 2: Bioluminescent Nightbloom flower clusters
    this.drawFlowerPatches(timeSec);

    // Layer 3: Field Scenery & Props (Harvesters, Pylons, Sensors)
    this.drawProps();

    // Layer 3.5: Nursery Beacon Transmission Tower
    this.drawBeacon(timeSec);

    // Layer 4: Player (Mira Vale) with directional walk cycle & breathing bob
    this.drawPlayer(player, timeSec);

    // Layer 6: Dynamic Light Emission & Volumetric Glow
    LightingPass.drawLighting(ctx, player, timeSec);

    // Layer 7: Drifting Grey Season pollen spores
    LightingPass.drawAtmosphericSpores(ctx, timeSec);

    ctx.restore();

    // Layer 7.5: Screen Space Atmospheric Vignette (Darkens edges to focus view)
    LightingPass.drawScreenVignette(ctx, vw, vh);
  }

  private drawGround(): void {
    const { ctx } = this;
    const { width: mw, height: mh, furrowRowHeight, borderStrokeWidth } = GAME_CONFIG.map;

    // 1. Rich Organic Peat & Loam Soil Base
    ctx.fillStyle = ThemeTokens.colors.groundSecondary;
    ctx.fillRect(0, 0, mw, mh);

    // 2. Agricultural Tilled Furrow Ridges (Soft organic soil grooves)
    const rowStep = furrowRowHeight || 44;
    ctx.lineWidth = 1.8;
    for (let y = 30; y < mh; y += rowStep) {
      // Subtle alternating earthen tone
      const isAlt = Math.floor(y / rowStep) % 2 === 0;
      ctx.strokeStyle = isAlt ? ThemeTokens.colors.soilFurrowDark : ThemeTokens.colors.soilFurrowLight;
      ctx.beginPath();
      // Organic furrow line across the field with gentle earth wave
      ctx.moveTo(0, y);
      for (let x = 0; x <= mw; x += 160) {
        const waveY = y + Math.sin(x * 0.015 + y) * 2.5;
        ctx.lineTo(x, waveY);
      }
      ctx.stroke();

      // Earth clod texture dots along the furrows
      ctx.fillStyle = isAlt ? ThemeTokens.colors.groundElevated : ThemeTokens.colors.groundBase;
      for (let x = 60; x < mw; x += 220) {
        const clodX = x + ((y * 17) % 80);
        const clodY = y + Math.sin(clodX * 0.015 + y) * 2.5 + 2;
        ctx.fillRect(clodX, clodY, 3, 2);
      }
    }

    // 3. Central Concrete Access Plaza around Nursery Beacon (1600, 1200)
    const roadWidth = 120;
    const roadX = 1600 - roadWidth / 2;
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

    // Beacon Octagonal Foundation Plaza
    const bx = 1600, by = 1200;
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

    // 4. Perimeter Nursery Fence & Caution Stencils
    ctx.strokeStyle = ThemeTokens.colors.panelBorderActive;
    ctx.lineWidth = borderStrokeWidth;
    ctx.strokeRect(borderStrokeWidth, borderStrokeWidth, mw - borderStrokeWidth * 2, mh - borderStrokeWidth * 2);

    // Corner Hazard Markers
    const cornerSize = 80;
    ctx.fillStyle = ThemeTokens.colors.hazardYellow;
    ctx.fillRect(0, 0, cornerSize, borderStrokeWidth * 2);
    ctx.fillRect(mw - cornerSize, 0, cornerSize, borderStrokeWidth * 2);
    ctx.fillRect(0, mh - borderStrokeWidth * 2, cornerSize, borderStrokeWidth * 2);
    ctx.fillRect(mw - cornerSize, mh - borderStrokeWidth * 2, cornerSize, borderStrokeWidth * 2);
  }

  private drawFlowerPatches(timeSec: number): void {
    if (!this.atlas) return;
    const { ctx } = this;
    const patches = GAME_CONFIG.map.flowerPatches;

    for (let i = 0; i < patches.length; i++) {
      const patch = patches[i];
      const spriteIdx = i % this.atlas.flowers.length;
      const sprite = this.atlas.flowers[spriteIdx];

      // Bioluminescent breathing pulse
      const pulse = Math.sin(timeSec * 2.2 + patch.x * 0.01) * 0.06 + 0.97;
      const w = sprite.width * pulse;
      const h = sprite.height * pulse;

      ctx.drawImage(sprite, patch.x - w / 2, patch.y - h / 2, w, h);
    }
  }

  private drawProps(): void {
    if (!this.atlas) return;
    const { ctx } = this;
    const { harvesters, pylons, sensors } = GAME_CONFIG.map.props;

    // Combine Harvester Wrecks
    const harvesterSprite = this.atlas.props.harvester;
    for (const pos of harvesters) {
      ctx.drawImage(harvesterSprite, pos.x - harvesterSprite.width / 2, pos.y - harvesterSprite.height / 2);
    }

    // Irrigation Relay Pylons
    const pylonSprite = this.atlas.props.pylon;
    for (const pos of pylons) {
      ctx.drawImage(pylonSprite, pos.x - pylonSprite.width / 2, pos.y - pylonSprite.height / 2);
    }

    // Soil Telemetry Sensor Stations
    const sensorSprite = this.atlas.props.sensor;
    for (const pos of sensors) {
      ctx.drawImage(sensorSprite, pos.x - sensorSprite.width / 2, pos.y - sensorSprite.height / 2);
    }
  }

  private drawBeacon(timeSec: number): void {
    const { ctx } = this;
    const { x, y, rangeRadius } = GAME_CONFIG.beacon;

    // Radiating energy pulse rings expanding outward
    const ringCycle = (timeSec * 0.4) % 1;
    const ringRadius = 40 + ringCycle * (rangeRadius - 40);
    const ringOpacity = (1 - ringCycle) * 0.6;
    ctx.strokeStyle = ThemeTokens.colors.playerBody;
    ctx.lineWidth = 2;
    ctx.globalAlpha = ringOpacity;
    ctx.beginPath();
    ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Beacon Tower Sprite from Atlas (160x160 buffer)
    if (this.atlas) {
      const beaconSprite = this.atlas.beacon;
      ctx.drawImage(beaconSprite, x - beaconSprite.width / 2, y - beaconSprite.height / 2);
    }

    // Top blinking aviation obstruction beacon (flashes at 2 Hz)
    const blinkOn = Math.floor(timeSec * 2) % 2 === 0;
    if (blinkOn) {
      ctx.fillStyle = ThemeTokens.colors.dangerRing;
      ctx.beginPath();
      ctx.arc(x, y - 52, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Beacon glow flare
      ctx.fillStyle = ThemeTokens.colors.dangerRedGhost;
      ctx.beginPath();
      ctx.arc(x, y - 52, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawPlayer(player: PlayerEntity, timeSec: number): void {
    if (!this.atlas) return;
    const { ctx } = this;

    // Determine facing direction
    const angle = player.facingAngle;
    let dir: 'down' | 'up' | 'side' = 'down';
    let flipX = false;

    if (angle > -Math.PI * 0.25 && angle <= Math.PI * 0.25) {
      dir = 'side';
      flipX = false; // Moving Right
    } else if (angle > Math.PI * 0.25 && angle <= Math.PI * 0.75) {
      dir = 'down'; // Moving Down
    } else if (angle > -Math.PI * 0.75 && angle <= -Math.PI * 0.25) {
      dir = 'up'; // Moving Up
    } else {
      dir = 'side';
      flipX = true; // Moving Left
    }

    // Dynamic stride cycling: 0 or 1
    const stepIndex = player.isMoving ? Math.floor(player.walkTime * 8) % 2 : 0;
    const sprite = this.atlas.mira[dir][stepIndex];

    ctx.save();
    ctx.translate(player.x, player.y);

    // Natural bobbing animation:
    // Moving: vertical stride bobbing. Idle: gentle breathing bob.
    const bobY = player.isMoving
      ? Math.sin(player.walkTime * 14) * 2.2
      : Math.sin(timeSec * 3) * 0.8;

    ctx.translate(0, bobY);

    if (flipX) {
      ctx.scale(-1, 1);
    }

    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
    ctx.restore();
  }
}

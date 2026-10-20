/**
 * Canvas 2D Render Pipeline with Procedural Sprite Atlas
 * Authority: nightbloom_game_prompt.md §6 & spec/Technical Design Document (TDD).md §1
 * Rules: ZERO hardcoded hex/rgba. All visuals use ThemeTokens & SpriteFactory.
 * Foundation F-1: Offscreen ground cache blit (~1,900 fewer draw calls/frame).
 * Foundation F-2: Real atmospheric twilight darkness composite.
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { ThemeTokens } from '../../content/theme/tokens';
import { PlayerEntity } from '../entities/player';
import { Vector2D } from '../input/InputManager';
import { SpriteFactory, SpriteAtlas } from './SpriteFactory';
import { GroundRenderer } from './GroundRenderer';
import { LightingPass } from './LightingPass';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private atlas: SpriteAtlas | null = null;
  private groundCache: HTMLCanvasElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to acquire 2D rendering context from canvas');
    }
    this.ctx = context;
    if (typeof window !== 'undefined') {
      this.atlas = SpriteFactory.getAtlas();
      this.groundCache = GroundRenderer.getGroundCache(this.atlas);
    }
    this.resize();
  }

  public resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, GAME_CONFIG.viewport.maxDpr);
    this.canvas.width = Math.floor(GAME_CONFIG.viewport.width * dpr);
    this.canvas.height = Math.floor(GAME_CONFIG.viewport.height * dpr);
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
    LightingPass.resize(GAME_CONFIG.viewport.width, GAME_CONFIG.viewport.height);
  }

  public render(player: PlayerEntity, camera: Vector2D, timeSec: number): void {
    const { ctx } = this;
    const vw = GAME_CONFIG.viewport.width;
    const vh = GAME_CONFIG.viewport.height;
    const { width: mw, height: mh } = GAME_CONFIG.map;

    // 1. Clear viewport with deep soil base token
    ctx.fillStyle = ThemeTokens.colors.groundBase;
    ctx.fillRect(0, 0, vw, vh);

    const halfW = vw / 2;
    const halfH = vh / 2;
    const camX = Math.round(camera.x);
    const camY = Math.round(camera.y);
    const sx = Math.max(0, Math.min(mw - vw, camX - halfW));
    const sy = Math.max(0, Math.min(mh - vh, camY - halfH));

    // Layer 1 (Foundation F-1): Pre-rendered Ground & Landmark Cache Direct Screen Blit
    // Blit directly in screen space [0, 0, vw, vh] for true 1:1 hardware copy with zero sub-pixel seams
    if (this.groundCache) {
      ctx.drawImage(this.groundCache, sx, sy, vw, vh, 0, 0, vw, vh);
    }

    ctx.save();
    // Camera translation (Centers camera on player with smooth tracking)
    ctx.translate(halfW - camX, halfH - camY);

    // Layer 2: Bioluminescent Nightbloom Flower Clusters (Animated breathing, viewport culled)
    this.drawFlowerPatches(camX, camY, vw, vh, timeSec);

    // Layer 3: Nursery Beacon Transmission Tower & Pulse Waves (viewport culled)
    if (Math.abs(GAME_CONFIG.beacon.x - camX) < halfW + 300 && Math.abs(GAME_CONFIG.beacon.y - camY) < halfH + 300) {
      this.drawBeacon(timeSec);
    }

    // Layer 4: Player (Mira Vale) with 4-frame stride & idle breathing bob
    this.drawPlayer(player, timeSec);

    ctx.restore();

    // Layer 5 (F-2): Real Atmospheric Twilight Darkness Composite Pass
    LightingPass.compositeAtmosphericLighting(ctx, player, camX, camY, vw, vh, timeSec);

    // Layer 6: Screen Space Peripheral Vignette (cached offscreen stamp)
    LightingPass.drawScreenVignette(ctx, vw, vh);
  }

  private drawFlowerPatches(camX: number, camY: number, vw: number, vh: number, timeSec: number): void {
    if (!this.atlas) return;
    const { ctx } = this;
    const patches = GAME_CONFIG.map.flowerPatches;
    const halfW = vw / 2;
    const halfH = vh / 2;
    const isReduced = LightingPass.isReducedMotion();

    for (let i = 0; i < patches.length; i++) {
      const patch = patches[i];
      // Viewport culling: skips off-screen draw calls (saves 24+ draw calls per frame)
      if (Math.abs(patch.x - camX) > halfW + 100 || Math.abs(patch.y - camY) > halfH + 100) continue;

      const spriteIdx = i % this.atlas.flowers.length;
      const sprite = this.atlas.flowers[spriteIdx];

      // Bioluminescent breathing pulse & per-patch variation
      const phase = timeSec * 2.2 + patch.x * 0.01;
      const pulse = isReduced ? 1.0 : Math.sin(phase) * 0.06 + 0.97;
      const baseScale = 0.9 + (i % 5) * 0.05;
      const w = sprite.width * pulse * baseScale;
      const h = sprite.height * pulse * baseScale;

      ctx.save();
      ctx.translate(patch.x, patch.y);
      if (i % 3 === 1) ctx.scale(-1, 1);
      ctx.drawImage(sprite, -w / 2, -h / 2, w, h);
      ctx.restore();
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

    // 4-frame stride animation when moving; resting stance (frame 1) when idle
    const stepIndex = player.isMoving ? Math.floor(player.walkTime * 10) % 4 : 1;
    const sprite = this.atlas.mira[dir][stepIndex];

    ctx.save();
    ctx.translate(player.x, player.y);

    // Natural bobbing: stride bobbing when moving; subtle lamp breathing sway when idle
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

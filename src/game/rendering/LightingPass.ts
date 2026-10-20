/**
 * Procedural Twilight Lighting & Atmospheric Composite Pass (Foundation F-2)
 * Authority: spec/Technical Design Document (TDD).md §1.3 & Review §8.2
 * 4-part darkness composite with zero-GC dynamic light pool and cached stamps.
 */

import { PlayerEntity } from '../entities/player';
import { GAME_CONFIG } from '../config/gameConfig';
import { ThemeTokens } from '../../content/theme/tokens';
import { createBuffer } from './CharacterSprites';

export interface DynamicLight {
  x: number;
  y: number;
  radius: number;
  intensity: number;
}

export class LightingPass {
  private static lightBuffer: HTMLCanvasElement | null = null;
  private static lightCtx: CanvasRenderingContext2D | null = null;

  // Cached radial gradient stamps (reused across all light sources for zero GC)
  private static smoothRadialStamp: HTMLCanvasElement | null = null;
  private static beaconStamp: HTMLCanvasElement | null = null;
  private static flowerStamp: HTMLCanvasElement | null = null;
  private static vignetteStamp: HTMLCanvasElement | null = null;

  // Zero-GC pre-allocated dynamic light pool
  private static readonly MAX_LIGHTS = 64;
  private static readonly lightPool: DynamicLight[] = Array.from({ length: 64 }, () => ({ x: 0, y: 0, radius: 0, intensity: 1 }));
  private static lightCount: number = 0;

  // Configurable settings
  private static darknessAlpha: number = 0.60;
  private static reducedMotion: boolean = false;

  public static setDarknessAlpha(alpha: number): void { this.darknessAlpha = Math.max(0.2, Math.min(0.85, alpha)); }
  public static getDarknessAlpha(): number { return this.darknessAlpha; }
  public static setReducedMotion(enabled: boolean): void { this.reducedMotion = enabled; }
  public static isReducedMotion(): boolean { return this.reducedMotion; }

  /**
   * Register a dynamic light source (hostiles & telegraphs always punch through per Style Rule 4).
   * Zero GC churn via object pool.
   */
  public static registerLight(x: number, y: number, radius: number, intensity: number = 1.0): void {
    if (this.lightCount < this.MAX_LIGHTS) {
      const l = this.lightPool[this.lightCount++];
      l.x = x;
      l.y = y;
      l.radius = radius;
      l.intensity = intensity;
    }
  }

  public static resize(vw: number, vh: number): void {
    if (this.lightBuffer && (this.lightBuffer.width !== vw || this.lightBuffer.height !== vh)) {
      this.lightBuffer.width = vw;
      this.lightBuffer.height = vh;
    }
    this.initVignette(vw, vh);
  }

  private static initStamps(): void {
    if (this.smoothRadialStamp) return;

    // 1. Universal Smooth Radial Gradient Stamp (256x256 px)
    const { canvas: rCanvas, ctx: rCtx } = createBuffer(256, 256);
    const rGrad = rCtx.createRadialGradient(128, 128, 4, 128, 128, 128);
    rGrad.addColorStop(0, ThemeTokens.colors.maskFull);
    rGrad.addColorStop(0.35, ThemeTokens.colors.maskDense);
    rGrad.addColorStop(0.7, ThemeTokens.colors.maskSoft);
    rGrad.addColorStop(1, ThemeTokens.colors.maskTransparent);
    rCtx.fillStyle = rGrad;
    rCtx.fillRect(0, 0, 256, 256);
    this.smoothRadialStamp = rCanvas;

    // 2. Beacon Core Warm Light Stamp (512x512 px)
    const { canvas: bCanvas, ctx: bCtx } = createBuffer(512, 512);
    const bGrad = bCtx.createRadialGradient(256, 256, 16, 256, 256, 256);
    bGrad.addColorStop(0, ThemeTokens.colors.maskFull);
    bGrad.addColorStop(0.4, ThemeTokens.colors.maskDense);
    bGrad.addColorStop(0.75, ThemeTokens.colors.maskSoft);
    bGrad.addColorStop(1, ThemeTokens.colors.maskTransparent);
    bCtx.fillStyle = bGrad;
    bCtx.fillRect(0, 0, 512, 512);
    this.beaconStamp = bCanvas;

    // 3. Bioluminescent Flower Halo Stamp (160x160 px)
    const { canvas: fCanvas, ctx: fCtx } = createBuffer(160, 160);
    const fGrad = fCtx.createRadialGradient(80, 80, 4, 80, 80, 80);
    fGrad.addColorStop(0, ThemeTokens.colors.maskFull);
    fGrad.addColorStop(0.45, ThemeTokens.colors.maskMid);
    fGrad.addColorStop(1, ThemeTokens.colors.maskTransparent);
    fCtx.fillStyle = fGrad;
    fCtx.fillRect(0, 0, 160, 160);
    this.flowerStamp = fCanvas;
  }

  private static getLightBuffer(vw: number, vh: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    if (!this.lightBuffer || this.lightBuffer.width !== vw || this.lightBuffer.height !== vh) {
      const { canvas, ctx } = createBuffer(vw, vh);
      this.lightBuffer = canvas;
      this.lightCtx = ctx;
    }
    return { canvas: this.lightBuffer, ctx: this.lightCtx! };
  }

  /**
   * Darkness-Composite Atmospheric Lighting Pass
   */
  public static compositeAtmosphericLighting(
    targetCtx: CanvasRenderingContext2D,
    player: PlayerEntity,
    cameraX: number,
    cameraY: number,
    vw: number,
    vh: number,
    timeSec: number
  ): void {
    this.initStamps();
    const { canvas: buf, ctx: lCtx } = this.getLightBuffer(vw, vh);

    // Task 1: Fill buffer with uniform ambient darkness
    lCtx.globalCompositeOperation = 'source-over';
    lCtx.globalAlpha = this.darknessAlpha;
    lCtx.fillStyle = ThemeTokens.colors.ambientTwilightDarkness;
    lCtx.fillRect(0, 0, vw, vh);
    lCtx.globalAlpha = 1.0;

    // Switch to destination-out to punch soft-feathered light holes
    lCtx.globalCompositeOperation = 'destination-out';

    const halfW = vw / 2;
    const halfH = vh / 2;

    // Task 3: Nursery Beacon Light & Expanding Energy Pulse Ring
    const bx = GAME_CONFIG.beacon.x - cameraX + halfW;
    const by = GAME_CONFIG.beacon.y - cameraY + halfH;
    const beaconPulse = this.reducedMotion ? 1.0 : 1.0 + Math.sin(timeSec * 2.8) * 0.08;
    const bw = 512 * beaconPulse;
    const bh = 512 * beaconPulse;
    if (this.beaconStamp && bx > -bw && bx < vw + bw && by > -bh && by < vh + bh) {
      lCtx.drawImage(this.beaconStamp, bx - bw / 2, by - bh / 2, bw, bh);

      // Expanding energy pulse ring hole
      const ringCycle = (timeSec * 0.4) % 1;
      const ringR = (40 + ringCycle * 140) * 2;
      const ringAlpha = (1 - ringCycle) * 0.45;
      if (this.smoothRadialStamp && ringR > 10) {
        lCtx.globalAlpha = ringAlpha;
        lCtx.drawImage(this.smoothRadialStamp, bx - ringR / 2, by - ringR / 2, ringR, ringR);
        lCtx.globalAlpha = 1.0;
      }
    }

    // Task 3: 32 Bioluminescent Nightbloom Flower Patches (Viewport Culled)
    if (this.flowerStamp) {
      const patches = GAME_CONFIG.map.flowerPatches;
      for (let i = 0; i < patches.length; i++) {
        const p = patches[i];
        const px = p.x - cameraX + halfW;
        const py = p.y - cameraY + halfH;
        if (px > -100 && px < vw + 100 && py > -100 && py < vh + 100) {
          const fPulse = this.reducedMotion ? 1.0 : Math.sin(timeSec * 2.2 + p.x * 0.01) * 0.1 + 0.95;
          const fw = 160 * fPulse;
          const fh = 160 * fPulse;
          lCtx.drawImage(this.flowerStamp, px - fw / 2, py - fh / 2, fw, fh);
        }
      }
    }

    // Task 2: Volumetric Soft-Edged Lantern Physics (3 overlapping cosine falloff nodes)
    // Formulation from Review §8.2: Kills the hard arc wedge edge completely.
    const mx = player.x - cameraX + halfW;
    const my = player.y - cameraY + halfH;
    const dirX = Math.cos(player.facingAngle);
    const dirY = Math.sin(player.facingAngle);
    const flicker = this.reducedMotion ? 1.0 : 1.0 + Math.sin(timeSec * 24) * 0.025;

    if (this.smoothRadialStamp) {
      // Node A: Boot anchor pool directly under Mira (radius 48px, keeps player grounded)
      lCtx.drawImage(this.smoothRadialStamp, mx - 48, my - 48, 96, 96);

      // Node B: High-intensity near core (offset 35px along facing vector, radius 55px)
      const c1x = mx + dirX * 35;
      const c1y = my + dirY * 35;
      const d1 = 110 * flicker;
      lCtx.drawImage(this.smoothRadialStamp, c1x - d1 / 2, c1y - d1 / 2, d1, d1);

      // Node C: Mid beam focus (offset 85px along facing vector, radius 85px, alpha 0.85)
      const c2x = mx + dirX * 85;
      const c2y = my + dirY * 85;
      const d2 = 170 * flicker;
      lCtx.globalAlpha = 0.85;
      lCtx.drawImage(this.smoothRadialStamp, c2x - d2 / 2, c2y - d2 / 2, d2, d2);

      // Node D: Far feathered propagation (offset 155px along facing vector, radius 120px, alpha 0.50)
      const c3x = mx + dirX * 155;
      const c3y = my + dirY * 155;
      const d3 = 240 * flicker;
      lCtx.globalAlpha = 0.50;
      lCtx.drawImage(this.smoothRadialStamp, c3x - d3 / 2, c3y - d3 / 2, d3, d3);

      lCtx.globalAlpha = 1.0;
    }

    // Task 4: Dynamic Hostile & Telegraph Light Punch-Through (Style Rule 4)
    if (this.smoothRadialStamp && this.lightCount > 0) {
      for (let d = 0; d < this.lightCount; d++) {
        const dl = this.lightPool[d];
        const lx = dl.x - cameraX + halfW;
        const ly = dl.y - cameraY + halfH;
        const diam = dl.radius * 2;
        if (lx > -diam && lx < vw + diam && ly > -diam && ly < vh + diam) {
          lCtx.globalAlpha = Math.max(0.1, Math.min(1.0, dl.intensity));
          lCtx.drawImage(this.smoothRadialStamp, lx - dl.radius, ly - dl.radius, diam, diam);
        }
      }
      lCtx.globalAlpha = 1.0;
    }
    // Clear dynamic lights for the next frame (zero GC churn)
    this.lightCount = 0;

    // Composite darkness buffer over the game canvas
    targetCtx.drawImage(buf, 0, 0);

    // Drifting spores & atmospheric dust (batched single-call draw)
    this.drawSpores(targetCtx, cameraX, cameraY, vw, vh, timeSec);
  }

  private static drawSpores(
    ctx: CanvasRenderingContext2D,
    cameraX: number,
    cameraY: number,
    vw: number,
    vh: number,
    timeSec: number
  ): void {
    ctx.fillStyle = ThemeTokens.colors.seedHaloGlow;
    const count = GAME_CONFIG.map.dustMoteCount;
    const mw = GAME_CONFIG.map.width;
    const mh = GAME_CONFIG.map.height;
    const halfW = vw / 2;
    const halfH = vh / 2;

    ctx.beginPath();
    let hasSpores = false;
    for (let i = 0; i < count; i++) {
      const wx = (i * 137 + timeSec * 35) % mw;
      const wy = (i * 219 + (this.reducedMotion ? 0 : Math.sin(timeSec * 1.5 + i) * 45)) % mh;
      const sx = wx - cameraX + halfW;
      const sy = wy - cameraY + halfH;

      if (sx >= -10 && sx <= vw + 10 && sy >= -10 && sy <= vh + 10) {
        ctx.moveTo(sx + 2, sy);
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        hasSpores = true;
      }
    }
    if (hasSpores) {
      ctx.fill();
    }
  }

  private static initVignette(vw: number, vh: number): void {
    if (this.vignetteStamp && this.vignetteStamp.width === vw && this.vignetteStamp.height === vh) return;
    const { canvas, ctx } = createBuffer(vw, vh);
    const cx = vw / 2;
    const cy = vh / 2;
    const radius = Math.hypot(cx, cy);
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.75, cx, cy, radius);
    grad.addColorStop(0, ThemeTokens.colors.signalCyanTransparent);
    grad.addColorStop(1, ThemeTokens.colors.vignetteSoft);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, vw, vh);
    this.vignetteStamp = canvas;
  }

  public static drawScreenVignette(ctx: CanvasRenderingContext2D, vw: number, vh: number): void {
    this.initVignette(vw, vh);
    if (this.vignetteStamp) {
      ctx.drawImage(this.vignetteStamp, 0, 0);
    }
  }
}

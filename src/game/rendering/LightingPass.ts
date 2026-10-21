/**
 * Procedural Twilight Lighting & Atmospheric Composite Pass (Foundation F-2)
 * Authority: spec/Technical Design Document (TDD).md §1.3 & Review §8.2
 * 4-part darkness composite with a zero-GC dynamic light pool.
 * PB-4: the 1x light buffer, stamps and vignette live in LightingCache.
 */

import { PlayerEntity } from '../entities/player';
import { GAME_CONFIG } from '../config/gameConfig';
import { ThemeTokens } from '../../content/theme/tokens';
import { LightingCache } from './LightingCache';

export interface DynamicLight { x: number; y: number; radius: number; intensity: number }

export class LightingPass {
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
      const light = this.lightPool[this.lightCount++];
      light.x = x;
      light.y = y;
      light.radius = radius;
      light.intensity = intensity;
    }
  }

  public static resize(viewportWidth: number, viewportHeight: number): void {
    LightingCache.resize(viewportWidth, viewportHeight);
  }

  private static drawStamp(ctx: CanvasRenderingContext2D, stamp: HTMLCanvasElement, x: number, y: number, size: number): void {
    ctx.drawImage(stamp, x - size / 2, y - size / 2, size, size);
  }

  /**
   * Darkness-Composite Atmospheric Lighting Pass
   */
  public static compositeAtmosphericLighting(targetCtx: CanvasRenderingContext2D, player: PlayerEntity, cameraX: number, cameraY: number, viewportWidth: number, viewportHeight: number, timeSec: number): void {
    const lightBuffer = LightingCache.getLightBuffer(viewportWidth, viewportHeight);
    const lCtx = lightBuffer.ctx;
    const stamps = LightingCache.getStamps();

    // Task 1: reset the 1x buffer so ambient darkness cannot accumulate across frames.
    lCtx.globalCompositeOperation = 'source-over';
    lCtx.globalAlpha = 1.0;
    lCtx.clearRect(0, 0, viewportWidth, viewportHeight);

    // Fill the cleared buffer with uniform ambient darkness.
    lCtx.globalAlpha = this.darknessAlpha;
    lCtx.fillStyle = ThemeTokens.colors.ambientTwilightDarkness;
    lCtx.fillRect(0, 0, viewportWidth, viewportHeight);
    lCtx.globalAlpha = 1.0;

    // Switch to destination-out to punch soft-feathered light holes.
    lCtx.globalCompositeOperation = 'destination-out';

    const halfWidth = viewportWidth / 2;
    const halfHeight = viewportHeight / 2;

    // Task 3: Nursery Beacon Light & Expanding Energy Pulse Ring
    const beaconX = GAME_CONFIG.beacon.x - cameraX + halfWidth;
    const beaconY = GAME_CONFIG.beacon.y - cameraY + halfHeight;
    const beaconPulse = this.reducedMotion ? 1.0 : 1.0 + Math.sin(timeSec * 2.8) * 0.08;
    const beaconSize = 512 * beaconPulse;
    if (beaconX > -beaconSize && beaconX < viewportWidth + beaconSize && beaconY > -beaconSize && beaconY < viewportHeight + beaconSize) {
      this.drawStamp(lCtx, stamps.beacon, beaconX, beaconY, beaconSize);

      // Expanding energy pulse ring hole
      const ringCycle = (timeSec * 0.4) % 1;
      const ringRadius = (40 + ringCycle * 140) * 2;
      if (ringRadius > 10) {
        lCtx.globalAlpha = (1 - ringCycle) * 0.45;
        this.drawStamp(lCtx, stamps.smoothRadial, beaconX, beaconY, ringRadius);
        lCtx.globalAlpha = 1.0;
      }
    }

    // Task 3: Bioluminescent Nightbloom Flower Patches (Viewport Culled)
    const patches = GAME_CONFIG.map.flowerPatches;
    for (let index = 0; index < patches.length; index++) {
      const patch = patches[index];
      const patchX = patch.x - cameraX + halfWidth;
      const patchY = patch.y - cameraY + halfHeight;
      if (patchX > -100 && patchX < viewportWidth + 100 && patchY > -100 && patchY < viewportHeight + 100) {
        const pulse = this.reducedMotion ? 1.0 : Math.sin(timeSec * 2.2 + patch.x * 0.01) * 0.1 + 0.95;
        this.drawStamp(lCtx, stamps.flower, patchX, patchY, 160 * pulse);
      }
    }

    // Task 2: Volumetric Soft-Edged Lantern Physics (boot anchor plus 3 overlapping cosine falloff nodes)
    // Formulation from Review §8.2: Kills the hard arc wedge edge completely.
    const playerX = player.x - cameraX + halfWidth;
    const playerY = player.y - cameraY + halfHeight;
    const directionX = Math.cos(player.facingAngle);
    const directionY = Math.sin(player.facingAngle);
    const flicker = this.reducedMotion ? 1.0 : 1.0 + Math.sin(timeSec * 24) * 0.025;

    // Node A: Boot anchor pool directly under Mira (radius 48px, keeps player grounded)
    this.drawStamp(lCtx, stamps.smoothRadial, playerX, playerY, 96);

    // Node B: High-intensity near core (offset 35px along facing vector, radius 55px)
    const coreX = playerX + directionX * 35;
    const coreY = playerY + directionY * 35;
    this.drawStamp(lCtx, stamps.smoothRadial, coreX, coreY, 110 * flicker);

    // Node C: Mid beam focus (offset 85px along facing vector, radius 85px, alpha 0.85)
    lCtx.globalAlpha = 0.85;
    this.drawStamp(lCtx, stamps.smoothRadial, playerX + directionX * 85, playerY + directionY * 85, 170 * flicker);

    // Node D: Far feathered propagation (offset 155px along facing vector, radius 120px, alpha 0.50)
    lCtx.globalAlpha = 0.50;
    this.drawStamp(lCtx, stamps.smoothRadial, playerX + directionX * 155, playerY + directionY * 155, 240 * flicker);
    lCtx.globalAlpha = 1.0;

    // Task 4: Dynamic Hostile & Telegraph Light Punch-Through (Style Rule 4)
    for (let index = 0; index < this.lightCount; index++) {
      const light = this.lightPool[index];
      const lightX = light.x - cameraX + halfWidth;
      const lightY = light.y - cameraY + halfHeight;
      const diameter = light.radius * 2;
      if (lightX > -diameter && lightX < viewportWidth + diameter && lightY > -diameter && lightY < viewportHeight + diameter) {
        lCtx.globalAlpha = Math.max(0.1, Math.min(1.0, light.intensity));
        this.drawStamp(lCtx, stamps.smoothRadial, lightX, lightY, diameter);
      }
    }
    lCtx.globalAlpha = 1.0;

    // Clear dynamic lights for the next frame (zero GC churn)
    this.lightCount = 0;

    // Composite darkness buffer over the game canvas
    targetCtx.drawImage(lightBuffer.canvas, 0, 0);

    // Drifting spores & atmospheric dust (batched single-call draw)
    this.drawSpores(targetCtx, cameraX, cameraY, viewportWidth, viewportHeight, timeSec);
  }

  private static drawSpores(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, viewportWidth: number, viewportHeight: number, timeSec: number): void {
    ctx.fillStyle = ThemeTokens.colors.seedHaloGlow;
    const count = GAME_CONFIG.map.dustMoteCount;
    const mapWidth = GAME_CONFIG.map.width;
    const mapHeight = GAME_CONFIG.map.height;
    const halfWidth = viewportWidth / 2;
    const halfHeight = viewportHeight / 2;

    ctx.beginPath();
    let hasSpores = false;
    for (let index = 0; index < count; index++) {
      const worldX = (index * 137 + timeSec * 35) % mapWidth;
      const worldY = (index * 219 + (this.reducedMotion ? 0 : Math.sin(timeSec * 1.5 + index) * 45)) % mapHeight;
      const screenX = worldX - cameraX + halfWidth;
      const screenY = worldY - cameraY + halfHeight;

      if (screenX >= -10 && screenX <= viewportWidth + 10 && screenY >= -10 && screenY <= viewportHeight + 10) {
        ctx.moveTo(screenX + 2, screenY);
        ctx.arc(screenX, screenY, 2, 0, Math.PI * 2);
        hasSpores = true;
      }
    }
    if (hasSpores) {
      ctx.fill();
    }
  }

  public static drawScreenVignette(
    ctx: CanvasRenderingContext2D,
    viewportWidth: number,
    viewportHeight: number,
  ): void {
    LightingCache.drawScreenVignette(ctx, viewportWidth, viewportHeight);
  }
}

/**
 * Cached Offscreen Surfaces for Atmospheric Lighting
 * Authority: spec/Technical Design Document (TDD).md §1.3 & docs/PRE_B_VISUAL_FOUNDATION_PLAN.md §4.8
 * PB-4: owns the 1x light buffer, radial light stamps and screen vignette.
 * Mask resolution stays at 1x by design; soft gradients do not need device-pixel backing.
 */

import { ThemeTokens } from '../../content/theme/tokens';
import { createCanvasSurface, CanvasSurface } from './buffer';

interface RadialStampStop {
  readonly offset: number;
  readonly color: string;
}

export interface LightingStamps {
  readonly smoothRadial: HTMLCanvasElement;
  readonly beacon: HTMLCanvasElement;
  readonly flower: HTMLCanvasElement;
}

const SMOOTH_RADIAL_SIZE = 256;
const BEACON_SIZE = 512;
const FLOWER_SIZE = 160;

function createRadialStamp(
  diameter: number,
  innerRadius: number,
  stops: readonly RadialStampStop[],
): HTMLCanvasElement {
  const { canvas, ctx } = createCanvasSurface(diameter, diameter);
  const center = diameter / 2;
  const gradient = ctx.createRadialGradient(center, center, innerRadius, center, center, center);
  for (const stop of stops) {
    gradient.addColorStop(stop.offset, stop.color);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, diameter, diameter);
  return canvas;
}

function createLightingStamps(): LightingStamps {
  const smoothRadial = createRadialStamp(SMOOTH_RADIAL_SIZE, 4, [
    { offset: 0, color: ThemeTokens.colors.maskFull },
    { offset: 0.35, color: ThemeTokens.colors.maskDense },
    { offset: 0.7, color: ThemeTokens.colors.maskSoft },
    { offset: 1, color: ThemeTokens.colors.maskTransparent },
  ]);

  const beacon = createRadialStamp(BEACON_SIZE, 16, [
    { offset: 0, color: ThemeTokens.colors.maskFull },
    { offset: 0.4, color: ThemeTokens.colors.maskDense },
    { offset: 0.75, color: ThemeTokens.colors.maskSoft },
    { offset: 1, color: ThemeTokens.colors.maskTransparent },
  ]);

  const flower = createRadialStamp(FLOWER_SIZE, 4, [
    { offset: 0, color: ThemeTokens.colors.maskFull },
    { offset: 0.45, color: ThemeTokens.colors.maskMid },
    { offset: 1, color: ThemeTokens.colors.maskTransparent },
  ]);

  return { smoothRadial, beacon, flower };
}

export class LightingCache {
  private static lightBuffer: CanvasSurface | null = null;
  private static stamps: LightingStamps | null = null;
  private static vignetteStamp: HTMLCanvasElement | null = null;

  public static resize(viewportWidth: number, viewportHeight: number): void {
    if (
      this.lightBuffer &&
      (this.lightBuffer.canvas.width !== viewportWidth ||
        this.lightBuffer.canvas.height !== viewportHeight)
    ) {
      this.lightBuffer = null;
    }
    this.initVignette(viewportWidth, viewportHeight);
  }

  public static getLightBuffer(viewportWidth: number, viewportHeight: number): CanvasSurface {
    if (
      !this.lightBuffer ||
      this.lightBuffer.canvas.width !== viewportWidth ||
      this.lightBuffer.canvas.height !== viewportHeight
    ) {
      this.lightBuffer = createCanvasSurface(viewportWidth, viewportHeight);
    }
    return this.lightBuffer;
  }

  public static getStamps(): LightingStamps {
    if (!this.stamps) {
      this.stamps = createLightingStamps();
    }
    return this.stamps;
  }

  private static initVignette(viewportWidth: number, viewportHeight: number): void {
    if (
      this.vignetteStamp &&
      this.vignetteStamp.width === viewportWidth &&
      this.vignetteStamp.height === viewportHeight
    ) {
      return;
    }

    const { canvas, ctx } = createCanvasSurface(viewportWidth, viewportHeight);
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const radius = Math.hypot(centerX, centerY);
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.75,
      centerX,
      centerY,
      radius,
    );
    gradient.addColorStop(0, ThemeTokens.colors.signalCyanTransparent);
    gradient.addColorStop(1, ThemeTokens.colors.vignetteSoft);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, viewportWidth, viewportHeight);
    this.vignetteStamp = canvas;
  }

  public static drawScreenVignette(
    ctx: CanvasRenderingContext2D,
    viewportWidth: number,
    viewportHeight: number,
  ): void {
    this.initVignette(viewportWidth, viewportHeight);
    if (this.vignetteStamp) {
      ctx.drawImage(this.vignetteStamp, 0, 0);
    }
  }
}

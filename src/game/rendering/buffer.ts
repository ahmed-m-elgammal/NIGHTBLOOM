/**
 * Offscreen Canvas Buffer Utility
 * Authority: spec/Technical Design Document (TDD).md §1.3
 * Lightweight offscreen canvas generators for procedural vector sprite synthesis.
 *
 * PB-1 contract:
 * - CanvasSurface is a 1x surface for the ground cache, lighting and full-screen masks.
 * - SpriteBuffer has a fixed 2x backing store while recipes keep drawing in logical coordinates.
 * - createBuffer remains a 1x compatibility wrapper; new 1x surfaces use createCanvasSurface.
 */

export const SPRITE_SCALE = 2;

export interface CanvasSurface {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  /** Logical width. The 1x backing store uses the same value. */
  readonly width: number;
  readonly height: number;
}

export interface SpriteBuffer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly logicalWidth: number;
  readonly logicalHeight: number;
  /** Backing pixels per logical pixel. */
  readonly scale: number;
}

export type CanvasBuffer = CanvasSurface;

export function createCanvasSurface(width: number, height: number): CanvasSurface {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(`Failed to create 2D context for ${width}x${height} canvas surface`);
  }
  return { canvas, ctx, width, height };
}

export function createSpriteBuffer(width: number, height: number): SpriteBuffer {
  const canvas = document.createElement('canvas');
  canvas.width = getBackingSize(width, SPRITE_SCALE);
  canvas.height = getBackingSize(height, SPRITE_SCALE);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(`Failed to create 2D context for ${width}x${height} sprite buffer`);
  }
  ctx.scale(SPRITE_SCALE, SPRITE_SCALE);
  return {
    canvas,
    ctx,
    logicalWidth: width,
    logicalHeight: height,
    scale: SPRITE_SCALE,
  };
}

/**
 * Compatibility wrapper for legacy 1x surfaces.
 * New 1x callers should use createCanvasSurface; sprite recipes use createSpriteBuffer.
 */
export function createBuffer(width: number, height: number): CanvasBuffer {
  return createCanvasSurface(width, height);
}

/** Clamp the device pixel ratio for the renderer. */
export function resolveRenderDpr(
  devicePixelRatio: number | undefined,
  maxDpr: number,
): number {
  if (
    devicePixelRatio === undefined ||
    !Number.isFinite(devicePixelRatio) ||
    devicePixelRatio <= 0
  ) {
    return 1;
  }

  const cap = Number.isFinite(maxDpr) && maxDpr > 0 ? maxDpr : 1;
  return Math.min(devicePixelRatio, cap);
}

/** Backing-store size in device pixels; never fractional. */
export function getBackingSize(logical: number, scale: number): number {
  return Math.ceil(logical * scale);
}

/** Drawn width in stage pixels after a world/display scale is applied. */
export function getSpriteDrawWidth(logicalWidth: number, scale: number): number {
  return logicalWidth * scale;
}

/** Top-left draw position for a sprite centred on x. */
export function getCenteredDrawX(
  x: number,
  logicalWidth: number,
  scale: number,
): number {
  return x - (logicalWidth * scale) / 2;
}

/** Top-left draw position for a sprite centred on y. */
export function getCenteredDrawY(
  y: number,
  logicalHeight: number,
  scale: number,
): number {
  return y - (logicalHeight * scale) / 2;
}

/**
 * Draw a SpriteBuffer at its logical size, optionally scaled by a world/display
 * transform. Uses one drawImage call and allocates no objects per frame.
 */
export function drawSpriteCentered(
  ctx: CanvasRenderingContext2D,
  sprite: SpriteBuffer,
  x: number,
  y: number,
  scale = 1,
): void {
  const drawWidth = getSpriteDrawWidth(sprite.logicalWidth, scale);
  const drawHeight = sprite.logicalHeight * scale;
  const drawX = getCenteredDrawX(x, sprite.logicalWidth, scale);
  const drawY = getCenteredDrawY(y, sprite.logicalHeight, scale);
  ctx.drawImage(sprite.canvas, drawX, drawY, drawWidth, drawHeight);
}

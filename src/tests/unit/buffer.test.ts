import { afterEach, describe, expect, it, vi } from 'vitest';
import { GAME_CONFIG } from '../../game/config/gameConfig';
import {
  SPRITE_SCALE,
  createBuffer,
  createCanvasSurface,
  createSpriteBuffer,
  drawSpriteCentered,
  getBackingSize,
  getCenteredDrawX,
  getCenteredDrawY,
  getSpriteDrawWidth,
  resolveRenderDpr,
} from '../../game/rendering/buffer';

interface FakeContext {
  scale: (x: number, y: number) => void;
  drawImage: (
    image: unknown,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;
}

interface FakeCanvas {
  width: number;
  height: number;
  getContext: (contextId: '2d') => FakeContext;
}

function installFakeCanvas(): {
  canvas: FakeCanvas;
  scaleCalls: Array<[number, number]>;
  drawImageCalls: Array<[unknown, number, number, number, number]>;
} {
  const scaleCalls: Array<[number, number]> = [];
  const drawImageCalls: Array<[unknown, number, number, number, number]> = [];
  const context: FakeContext = {
    scale: (x, y) => {
      scaleCalls.push([x, y]);
    },
    drawImage: (image, x, y, width, height) => {
      drawImageCalls.push([image, x, y, width, height]);
    },
  };
  const canvas: FakeCanvas = {
    width: 0,
    height: 0,
    getContext: () => context,
  };
  vi.stubGlobal('document', { createElement: () => canvas });
  return { canvas, scaleCalls, drawImageCalls };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('buffer contract', () => {
  it('uses a fixed 2x sprite scale within the renderer DPR cap', () => {
    expect(SPRITE_SCALE).toBe(2);
    expect(SPRITE_SCALE).toBeLessThanOrEqual(GAME_CONFIG.viewport.maxDpr);
  });

  it('creates a 1x canvas surface without scaling the context', () => {
    const { canvas, scaleCalls } = installFakeCanvas();
    const surface = createCanvasSurface(320, 180);

    expect(surface.width).toBe(320);
    expect(surface.height).toBe(180);
    expect(canvas.width).toBe(320);
    expect(canvas.height).toBe(180);
    expect(scaleCalls).toHaveLength(0);
  });

  it('creates a SpriteBuffer with a 2x backing store and logical dimensions', () => {
    const { canvas, scaleCalls } = installFakeCanvas();
    const sprite = createSpriteBuffer(64, 48);

    expect(sprite.logicalWidth).toBe(64);
    expect(sprite.logicalHeight).toBe(48);
    expect(sprite.scale).toBe(SPRITE_SCALE);
    expect(canvas.width).toBe(128);
    expect(canvas.height).toBe(96);
    expect(scaleCalls).toEqual([[SPRITE_SCALE, SPRITE_SCALE]]);
  });

  it('keeps createBuffer as a 1x compatibility wrapper', () => {
    const { canvas, scaleCalls } = installFakeCanvas();
    const surface = createBuffer(32, 16);

    expect(surface.width).toBe(32);
    expect(surface.height).toBe(16);
    expect(canvas.width).toBe(32);
    expect(canvas.height).toBe(16);
    expect(scaleCalls).toHaveLength(0);
  });

  it('draws a SpriteBuffer centred with one drawImage call', () => {
    const { drawImageCalls } = installFakeCanvas();
    const sprite = createSpriteBuffer(64, 48);

    drawSpriteCentered(sprite.ctx, sprite, 100, 100, 1);

    expect(drawImageCalls).toHaveLength(1);
    expect(drawImageCalls[0][0]).toBe(sprite.canvas);
    expect(drawImageCalls[0].slice(1)).toEqual([68, 76, 64, 48]);
  });
});

describe('resolveRenderDpr', () => {
  it('falls back to 1 for missing, zero and negative ratios', () => {
    expect(resolveRenderDpr(undefined, 2)).toBe(1);
    expect(resolveRenderDpr(0, 2)).toBe(1);
    expect(resolveRenderDpr(-2, 2)).toBe(1);
  });

  it('keeps a valid ratio up to the cap', () => {
    expect(resolveRenderDpr(1, 2)).toBe(1);
    expect(resolveRenderDpr(1.5, 2)).toBe(1.5);
    expect(resolveRenderDpr(2, 2)).toBe(2);
  });

  it('caps a high ratio at maxDpr', () => {
    expect(resolveRenderDpr(3, 2)).toBe(2);
  });
});

describe('backing and draw math', () => {
  it('rounds backing-store sizes up to whole pixels', () => {
    expect(getBackingSize(64, 2)).toBe(128);
    expect(getBackingSize(65, 1.5)).toBe(98);
    expect(Number.isInteger(getBackingSize(65, 1.5))).toBe(true);
  });

  it('computes scaled draw width', () => {
    expect(getSpriteDrawWidth(64, 1)).toBe(64);
    expect(getSpriteDrawWidth(64, 0.9)).toBeCloseTo(57.6, 10);
  });

  it('centres draw positions from logical dimensions', () => {
    expect(getCenteredDrawX(100, 64, 1)).toBe(68);
    expect(getCenteredDrawX(100, 64, 2)).toBe(36);
    expect(getCenteredDrawY(100, 64, 1)).toBe(68);
    expect(getCenteredDrawY(100, 64, 2)).toBe(36);
  });
});

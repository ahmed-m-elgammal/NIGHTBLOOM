import { describe, expect, it } from 'vitest';
import { GAME_CONFIG } from '../../game/config/gameConfig';
import { isWorldSpriteVisible } from '../../game/rendering/WorldPropsRenderer';

const CAMERA_X = 1600;
const CAMERA_Y = 1340;
const VIEWPORT_WIDTH = GAME_CONFIG.viewport.width;
const VIEWPORT_HEIGHT = GAME_CONFIG.viewport.height;
const SPRITE = { logicalWidth: 64, logicalHeight: 64 };

describe('isWorldSpriteVisible', () => {
  it('keeps a sprite at the camera center visible', () => {
    expect(
      isWorldSpriteVisible(CAMERA_X, CAMERA_Y, SPRITE, CAMERA_X, CAMERA_Y, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
    ).toBe(true);
  });

  it('keeps a partially visible sprite at the left edge', () => {
    expect(
      isWorldSpriteVisible(960, CAMERA_Y, SPRITE, CAMERA_X, CAMERA_Y, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
    ).toBe(true);
  });

  it('culls a sprite fully beyond the left edge', () => {
    expect(
      isWorldSpriteVisible(900, CAMERA_Y, SPRITE, CAMERA_X, CAMERA_Y, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
    ).toBe(false);
  });

  it('uses the landmark width when testing the right edge', () => {
    const glasshouseExtent = { logicalWidth: 220, logicalHeight: 140 };
    expect(
      isWorldSpriteVisible(2240, CAMERA_Y, glasshouseExtent, CAMERA_X, CAMERA_Y, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
    ).toBe(true);
  });

  it('adds padding for rotated sprites', () => {
    expect(
      isWorldSpriteVisible(920, CAMERA_Y, SPRITE, CAMERA_X, CAMERA_Y, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
    ).toBe(false);
    expect(
      isWorldSpriteVisible(920, CAMERA_Y, SPRITE, CAMERA_X, CAMERA_Y, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 16),
    ).toBe(true);
  });
});

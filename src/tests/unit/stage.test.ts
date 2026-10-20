import { describe, expect, it } from 'vitest';
import {
  MIN_STAGE_SCALE,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  computeStageScale,
} from '../../app/stage';

describe('computeStageScale', () => {
  it('uses 1x at the authored 1280x720 stage size', () => {
    expect(computeStageScale(STAGE_WIDTH, STAGE_HEIGHT)).toBe(1);
  });

  it('uniformly scales down on a 1024x576 fit box', () => {
    expect(computeStageScale(1024, 576)).toBeCloseTo(0.8, 5);
  });

  it('caps at 1x instead of upscaling a 1920x1080 fit box', () => {
    expect(computeStageScale(1920, 1080)).toBe(1);
  });

  it('uses the limiting axis for non-16:9 fit boxes', () => {
    expect(computeStageScale(800, 600)).toBeCloseTo(0.625, 5);
  });

  it('honours an explicit lower maximum scale', () => {
    expect(computeStageScale(1280, 720, 0.75)).toBe(0.75);
  });

  it('never returns a zero or non-finite scale', () => {
    expect(computeStageScale(0, 0)).toBe(MIN_STAGE_SCALE);
    expect(computeStageScale(Number.NaN, 720)).toBe(MIN_STAGE_SCALE);
  });
});

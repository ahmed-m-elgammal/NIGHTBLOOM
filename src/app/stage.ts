export const STAGE_WIDTH = 1280;
export const STAGE_HEIGHT = 720;
export const MIN_STAGE_SCALE = 0.01;

/**
 * Compute the uniform scale for the authored 1280x720 stage.
 *
 * The stage is never upscaled in v1: a 1920x1080 window keeps the stage at
 * 1280x720 and letterboxes the surrounding surface. Degenerate frame sizes
 * still return a positive number so CSS transforms never collapse to zero.
 */
export function computeStageScale(
  frameWidth: number,
  frameHeight: number,
  maxScale = 1,
): number {
  const fitScale = Math.min(
    frameWidth / STAGE_WIDTH,
    frameHeight / STAGE_HEIGHT,
    maxScale,
  );

  if (!Number.isFinite(fitScale) || fitScale <= 0) {
    return MIN_STAGE_SCALE;
  }

  return Math.max(fitScale, MIN_STAGE_SCALE);
}

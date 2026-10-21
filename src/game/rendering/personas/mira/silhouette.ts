/**
 * Mira Closed Rim Generator
 * Authority: docs/ART_BIBLE.md AB-SH-02 / AB-VL-02 and PB-8 silhouette gate.
 * Draws an expanded alpha silhouette behind the character so the full outline
 * reads against road and soil without a dark hostile-style contour.
 */

import { createSpriteBuffer, SpriteBuffer } from '../../buffer';

const RIM_DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [0.7071, 0.7071],
  [0.7071, -0.7071],
  [-0.7071, 0.7071],
  [-0.7071, -0.7071],
] as const;

/**
 * Draw a closed rim under a transparent character buffer.
 * The rim width is authored in logical sprite pixels, not backing pixels.
 */
export function drawSpriteWithClosedRim(
  targetCtx: CanvasRenderingContext2D,
  source: SpriteBuffer,
  rimColor: string,
  rimWidth: number,
): void {
  const rim = createSpriteBuffer(source.logicalWidth, source.logicalHeight);
  const { ctx: rimCtx } = rim;

  for (const [dx, dy] of RIM_DIRECTIONS) {
    rimCtx.drawImage(
      source.canvas,
      dx * rimWidth,
      dy * rimWidth,
      source.logicalWidth,
      source.logicalHeight,
    );
  }

  rimCtx.globalCompositeOperation = 'source-in';
  rimCtx.fillStyle = rimColor;
  rimCtx.fillRect(0, 0, source.logicalWidth, source.logicalHeight);
  rimCtx.globalCompositeOperation = 'source-over';

  targetCtx.drawImage(rim.canvas, 0, 0, source.logicalWidth, source.logicalHeight);
  targetCtx.drawImage(source.canvas, 0, 0, source.logicalWidth, source.logicalHeight);
}

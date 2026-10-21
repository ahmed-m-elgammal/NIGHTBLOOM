/**
 * Midground Edge Highlights
 * Authority: docs/ART_BIBLE.md AB-VL-02 and PB-8 prop/landmark value separation.
 * These are narrow edge accents, never a fill or a friendly-signal glow.
 */

import { ThemeTokens } from '../../../content/theme/tokens';

export function drawMidgroundEdge(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  lineWidth = 1.1,
): void {
  ctx.strokeStyle = ThemeTokens.colors.midgroundRimLight;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function fillMidgroundEdge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  ctx.fillStyle = ThemeTokens.colors.midgroundRimLight;
  ctx.fillRect(x, y, width, height);
}

export function drawMidgroundArc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  startAngle: number,
  endAngle: number,
  lineWidth = 1.1,
): void {
  ctx.strokeStyle = ThemeTokens.colors.midgroundRimLight;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, startAngle, endAngle);
  ctx.stroke();
}

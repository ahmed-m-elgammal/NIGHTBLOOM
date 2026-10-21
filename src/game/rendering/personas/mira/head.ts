import { ThemeTokens } from '../../../../content/theme/tokens';
import { StrideDirection } from '../types';

/**
 * Procedural Mira Vale Head & Cowl Renderer
 * Multi-tone material ramp, alive operative eyes, and windswept hair.
 */
export class MiraHeadRenderer {
  static drawHead(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    direction: StrideDirection
  ): void {
    // 1. Cowl Outer Fabric Hood (4-tone material ramp with top-left key light)
    ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
    ctx.beginPath();
    ctx.arc(cx, cy - 11, 9, 0, Math.PI * 2);
    ctx.fill();

    // Top-left key light highlight facet on cowl
    ctx.fillStyle = ThemeTokens.colors.miraJacketHighlight;
    ctx.beginPath();
    ctx.arc(cx - 1.5, cy - 12.5, 7, Math.PI * 0.75, Math.PI * 1.85);
    ctx.fill();

    // Bottom-right shadow fold
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.beginPath();
    ctx.arc(cx + 1, cy - 10, 8, Math.PI * 0.1, Math.PI * 0.6);
    ctx.fill();

    // 2. Interior Cowl Depth Shadow
    ctx.fillStyle = ThemeTokens.colors.portraitSkinDeep;
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. Windswept Auburn Hair Tufts frame the face before skin and eyes.
    ctx.fillStyle = ThemeTokens.colors.portraitHairBase;
    ctx.beginPath();
    ctx.arc(cx, cy - 13, 8.5, Math.PI * 0.75, Math.PI * 2.25);
    ctx.fill();

    // Top-left hair sheen highlight
    ctx.fillStyle = ThemeTokens.colors.portraitHairHighlight;
    ctx.beginPath();
    ctx.arc(cx - 2, cy - 14, 6.5, Math.PI * 0.85, Math.PI * 1.85);
    ctx.fill();

    // Deep hair shadow crease
    ctx.fillStyle = ThemeTokens.colors.portraitHairShadow;
    ctx.fillRect(cx + 2, cy - 14.5, 3.5, 1);

    if (direction !== 'up') {
      // 4. Face Flesh Oval
      ctx.fillStyle = ThemeTokens.colors.portraitSkinBase;
      ctx.beginPath();
      if (direction === 'down') {
        ctx.ellipse(cx, cy - 9, 5.5, 6.5, 0, 0, Math.PI * 2);
      } else {
        ctx.ellipse(cx + 2.5, cy - 9, 5, 6.5, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      // Right-side Cheek & Jaw Shadow (Consistent top-left lighting)
      ctx.fillStyle = ThemeTokens.colors.portraitSkinShadow;
      ctx.beginPath();
      if (direction === 'down') {
        ctx.ellipse(cx + 1, cy - 7, 4.5, 2.5, 0, 0, Math.PI * 2);
      } else {
        ctx.ellipse(cx + 3, cy - 7, 3.5, 2.5, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      // Neck / Collar Shadow Gap (Separates jaw from coat collar)
      ctx.fillStyle = ThemeTokens.colors.miraOutlineSkin;
      ctx.fillRect(direction === 'down' ? cx - 3 : cx, cy - 3.5, direction === 'down' ? 6 : 4, 1.5);

      // Alive Operative Eyes & Focused Brow
      ctx.fillStyle = ThemeTokens.colors.portraitFeatureDark;
      if (direction === 'down') {
        // Brow line (angled focus)
        ctx.fillRect(cx - 4.5, cy - 11.5, 3.5, 1);
        ctx.fillRect(cx + 1, cy - 11.5, 3.5, 1);
        // Irises
        ctx.fillStyle = ThemeTokens.colors.portraitEyeIris;
        ctx.fillRect(cx - 4, cy - 10, 2.5, 2.5);
        ctx.fillRect(cx + 1.5, cy - 10, 2.5, 2.5);
        // Specular High-Light Glints on top-left of each eye
        ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
        ctx.fillRect(cx - 3.5, cy - 10, 1, 1);
        ctx.fillRect(cx + 2, cy - 10, 1, 1);
      } else {
        // Side profile eye
        ctx.fillRect(cx + 3, cy - 11.5, 3, 1);
        ctx.fillStyle = ThemeTokens.colors.portraitEyeIris;
        ctx.fillRect(cx + 3.5, cy - 10, 2.5, 2.5);
        ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
        ctx.fillRect(cx + 4, cy - 10, 1, 1);
      }
    }
  }
}

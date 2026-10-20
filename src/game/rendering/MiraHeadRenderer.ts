import { ThemeTokens } from '../../content/theme/tokens';

export class MiraHeadRenderer {
  static drawHead(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    direction: 'down' | 'up' | 'side'
  ): void {
    // 1. Cowl Outer Fabric Hood
    ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
    ctx.beginPath();
    ctx.arc(cx, cy - 11, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ThemeTokens.colors.panelBorder;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 2. Interior Cowl Shadow
    ctx.fillStyle = ThemeTokens.colors.portraitSkinDeep;
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 7.5, 0, Math.PI * 2);
    ctx.fill();

    if (direction !== 'up') {
      // Face Flesh Oval
      ctx.fillStyle = ThemeTokens.colors.portraitSkinBase;
      ctx.beginPath();
      if (direction === 'down') {
        ctx.ellipse(cx, cy - 9, 5.5, 6.5, 0, 0, Math.PI * 2);
      } else {
        ctx.ellipse(cx + 2.5, cy - 9, 5, 6.5, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      // Jaw / Cheek Contour Shadow
      ctx.fillStyle = ThemeTokens.colors.portraitSkinShadow;
      ctx.beginPath();
      if (direction === 'down') {
        ctx.ellipse(cx, cy - 7, 5, 2.5, 0, 0, Math.PI * 2);
      } else {
        ctx.ellipse(cx + 2, cy - 7, 4.5, 2.5, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      // Alive Operative Eyes & Focused Brow
      ctx.fillStyle = ThemeTokens.colors.portraitEyeIris;
      if (direction === 'down') {
        // Brow line
        ctx.fillRect(cx - 4.5, cy - 11.5, 3.5, 1);
        ctx.fillRect(cx + 1, cy - 11.5, 3.5, 1);
        // Irises
        ctx.fillRect(cx - 4, cy - 10, 2.5, 2.5);
        ctx.fillRect(cx + 1.5, cy - 10, 2.5, 2.5);
        // Specular High-Light Glints (Makes eyes look alive, not dead!)
        ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
        ctx.fillRect(cx - 3.5, cy - 10, 1, 1);
        ctx.fillRect(cx + 2, cy - 10, 1, 1);
      } else {
        // Side profile eye
        ctx.fillRect(cx + 3, cy - 11.5, 3, 1);
        ctx.fillRect(cx + 3.5, cy - 10, 2.5, 2.5);
        ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
        ctx.fillRect(cx + 4.5, cy - 10, 1, 1);
      }
    }

    // Windswept Auburn / Chestnut Hair Tufts escaping the cowl
    ctx.fillStyle = ThemeTokens.colors.portraitHairBase;
    ctx.beginPath();
    ctx.arc(cx, cy - 13, 8.5, Math.PI * 0.75, Math.PI * 2.25);
    ctx.fill();

    // Fine hair highlight strand
    ctx.fillStyle = ThemeTokens.colors.portraitHairHighlight;
    ctx.beginPath();
    ctx.arc(cx - 2, cy - 14, 6.5, Math.PI * 0.85, Math.PI * 1.85);
    ctx.fill();
  }
}

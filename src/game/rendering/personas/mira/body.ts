import { ThemeTokens } from '../../../../content/theme/tokens';
import { StrideDirection } from '../types';

/**
 * Procedural Mira Vale Torso, Coat & Gear Renderer
 * Implements 4-tone material ramps, key-light directional highlights, and selective outlines.
 */
export class MiraBodyRenderer {
  static drawTorso(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    direction: StrideDirection,
    armOffset: number,
    coatSway: number
  ): void {
    // 1. Antenna behind shoulder in 'down' facing (peeks over left shoulder blade)
    if (direction === 'down') {
      ctx.strokeStyle = ThemeTokens.colors.metalRivets;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + 7, cy - 2);
      ctx.lineTo(cx + 9, cy - 18);
      ctx.stroke();

      // Glowing status LED with specular glint
      ctx.fillStyle = ThemeTokens.colors.playerBody;
      ctx.beginPath();
      ctx.arc(cx + 9, cy - 18, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
      ctx.beginPath();
      ctx.arc(cx + 8.5, cy - 18.5, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Trenchcoat Tails & Hem (Dark underside lining pops against ground)
    if (direction === 'down') {
      ctx.fillStyle = ThemeTokens.colors.miraOutlineJacket;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy + 8);
      ctx.lineTo(cx + 10, cy + 8);
      ctx.lineTo(cx + 12 + coatSway, cy + 16);
      ctx.lineTo(cx - 12 + coatSway, cy + 16);
      ctx.closePath();
      ctx.fill();

      // Lit left coat tail crest (top-left key light)
      ctx.fillStyle = ThemeTokens.colors.miraJacketHighlight;
      ctx.beginPath();
      ctx.moveTo(cx - 12 + coatSway, cy + 15);
      ctx.lineTo(cx - 4, cy + 6);
      ctx.lineTo(cx - 8, cy + 16);
      ctx.closePath();
      ctx.fill();

      // Coat hem trim
      ctx.fillStyle = ThemeTokens.colors.miraJacketTrim;
      ctx.fillRect(cx - 12 + coatSway, cy + 16, 24, 1.2);
    } else if (direction === 'side') {
      // Billowing coat: dark underside & lit crest
      ctx.fillStyle = ThemeTokens.colors.miraOutlineJacket;
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy + 15);
      ctx.lineTo(cx + 6, cy + 14);
      ctx.lineTo(cx + 4, cy + 4);
      ctx.lineTo(cx - 8, cy + 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = ThemeTokens.colors.miraJacketHighlight;
      ctx.fillRect(cx - 12, cy + 6, 8, 3);
      ctx.fillStyle = ThemeTokens.colors.miraJacketTrim;
      ctx.fillRect(cx - 14, cy + 15, 20, 1.2);
    }

    // 3. Coat Torso & Internal Trim
    ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;

    ctx.beginPath();
    if (direction === 'down') {
      this.drawFrontTorso(ctx, cx, cy, armOffset);
    } else if (direction === 'up') {
      this.drawBackTorso(ctx, cx, cy);
    } else {
      this.drawSideTorso(ctx, cx, cy, armOffset);
    }
  }

  private static drawFrontTorso(ctx: CanvasRenderingContext2D, cx: number, cy: number, armOffset: number): void {
    ctx.ellipse(cx, cy + 2, 13, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Key-light highlight facet (top-left 45°)
    ctx.fillStyle = ThemeTokens.colors.miraJacketHighlight;
    ctx.beginPath();
    ctx.arc(cx - 2, cy - 1, 11, Math.PI * 0.75, Math.PI * 1.55);
    ctx.fill();

    // Right-flank shadow
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.beginPath();
    ctx.arc(cx + 2, cy + 4, 10, Math.PI * 0.05, Math.PI * 0.55);
    ctx.fill();

    // Operative Rim-Light on right edge
    ctx.strokeStyle = ThemeTokens.colors.rimLightCyan;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(cx, cy + 2, 13, Math.PI * 0.7, Math.PI * 1.3);
    ctx.stroke();

    // Double-breasted folded lapel with trim
    ctx.fillStyle = ThemeTokens.colors.portraitJacketLight;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 8);
    ctx.lineTo(cx - 1, cy + 3);
    ctx.lineTo(cx + 6, cy - 8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = ThemeTokens.colors.miraJacketTrim;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 8);
    ctx.lineTo(cx - 1, cy + 3);
    ctx.lineTo(cx + 6, cy - 8);
    ctx.stroke();

    // Brass snap buttons with specular ticks
    ctx.fillStyle = ThemeTokens.colors.amberMuted;
    ctx.beginPath();
    ctx.arc(cx + 2, cy - 4, 1.5, 0, Math.PI * 2);
    ctx.arc(cx + 2, cy - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
    ctx.fillRect(cx + 1.5, cy - 4.5, 0.8, 0.8);
    ctx.fillRect(cx + 1.5, cy - 1.5, 0.8, 0.8);

    // Tactical utility belt & brass buckle (Preserved intact)
    ctx.fillStyle = ThemeTokens.colors.cableBlack;
    ctx.fillRect(cx - 11, cy + 5, 22, 3.5);
    ctx.fillStyle = ThemeTokens.colors.amberMuted;
    ctx.fillRect(cx - 3, cy + 4.5, 6, 4.5);
    ctx.fillStyle = ThemeTokens.colors.cableBlack;
    ctx.fillRect(cx - 1.5, cy + 5.5, 3, 2.5);

    // Ammunition / specimen pouches with seam trim
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx - 12, cy + 5, 4, 5.5);
    ctx.fillRect(cx + 8, cy + 5, 4, 5.5);
    ctx.fillStyle = ThemeTokens.colors.miraJacketTrim;
    ctx.fillRect(cx - 12, cy + 5, 4, 1);
    ctx.fillRect(cx + 8, cy + 5, 4, 1);

    // Arms, Skin-Tone Wrist Gaps & Leather Gloves
    ctx.fillStyle = ThemeTokens.colors.miraJacketHighlight;
    ctx.fillRect(cx - 14, cy - 3 + armOffset, 4, 8);
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx + 10, cy - 3 - armOffset, 4, 8);
    ctx.fillStyle = ThemeTokens.colors.portraitSkinBase;
    ctx.fillRect(cx - 14, cy + 5 + armOffset, 4, 1.5);
    ctx.fillRect(cx + 10, cy + 5 - armOffset, 4, 1.5);
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx - 14, cy + 6.5 + armOffset, 4, 3);
    ctx.fillRect(cx + 10, cy + 6.5 - armOffset, 4, 3);

    // Shoulder Halogen Lantern
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx - 11, cy - 9, 6, 6);
    ctx.strokeStyle = ThemeTokens.colors.miraOutlineJacket;
    ctx.strokeRect(cx - 11, cy - 9, 6, 6);
    ctx.fillStyle = ThemeTokens.colors.playerLamp;
    ctx.beginPath();
    ctx.arc(cx - 8, cy - 6, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
    ctx.beginPath();
    ctx.arc(cx - 9, cy - 7, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  private static drawBackTorso(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
    ctx.ellipse(cx, cy + 2, 13, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Heavy Field Survival Rucksack with top-left highlight facet
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx - 10, cy - 5, 20, 14);
    ctx.strokeStyle = ThemeTokens.colors.miraOutlineJacket;
    ctx.strokeRect(cx - 10, cy - 5, 20, 14);
    ctx.fillStyle = ThemeTokens.colors.miraJacketHighlight;
    ctx.fillRect(cx - 10, cy - 5, 20, 2);

    // Fastening compression straps
    ctx.fillStyle = ThemeTokens.colors.miraJacketTrim;
    ctx.fillRect(cx - 7, cy - 5, 3, 14);
    ctx.fillRect(cx + 4, cy - 5, 3, 14);
    ctx.fillStyle = ThemeTokens.colors.amberMuted;
    ctx.fillRect(cx - 7, cy, 3, 1.5);
    ctx.fillRect(cx + 4, cy, 3, 1.5);

    // Rolled bedroll lashed below rucksack
    ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
    ctx.fillRect(cx - 9, cy + 9, 18, 4.5);
    ctx.fillStyle = ThemeTokens.colors.amberMuted;
    ctx.fillRect(cx - 6, cy + 9, 2, 4.5);
    ctx.fillRect(cx + 4, cy + 9, 2, 4.5);

    // Long-range radio whip antenna & status beacon LED
    ctx.strokeStyle = ThemeTokens.colors.metalRivets;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + 7, cy - 5);
    ctx.lineTo(cx + 9, cy - 20);
    ctx.stroke();
    ctx.fillStyle = ThemeTokens.colors.playerBody;
    ctx.beginPath();
    ctx.arc(cx + 9, cy - 20, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
    ctx.beginPath();
    ctx.arc(cx + 8.5, cy - 20.5, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  private static drawSideTorso(ctx: CanvasRenderingContext2D, cx: number, cy: number, armOffset: number): void {
    ctx.ellipse(cx, cy + 2, 11, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top-left chest highlight & collar trim
    ctx.fillStyle = ThemeTokens.colors.miraJacketHighlight;
    ctx.fillRect(cx - 1, cy - 6, 7, 5);
    ctx.fillStyle = ThemeTokens.colors.miraJacketTrim;
    ctx.fillRect(cx + 2, cy - 7, 4, 1.5);

    // Backpack profile (behind)
    ctx.fillStyle = ThemeTokens.colors.portraitJacketDark;
    ctx.fillRect(cx - 13, cy - 4, 8, 13);
    ctx.strokeStyle = ThemeTokens.colors.miraOutlineJacket;
    ctx.strokeRect(cx - 13, cy - 4, 8, 13);

    // Antenna tilted with bright cyan LED tip
    ctx.strokeStyle = ThemeTokens.colors.metalRivets;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy - 4);
    ctx.lineTo(cx - 13, cy - 19);
    ctx.stroke();
    ctx.fillStyle = ThemeTokens.colors.playerBody;
    ctx.beginPath();
    ctx.arc(cx - 13, cy - 19, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
    ctx.beginPath();
    ctx.arc(cx - 13.5, cy - 19.5, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Side utility belt pouch
    ctx.fillStyle = ThemeTokens.colors.amberMuted;
    ctx.fillRect(cx + 1, cy + 5, 4, 4);

    // Forward arm, skin wrist gap & glove
    ctx.fillStyle = ThemeTokens.colors.portraitJacketMid;
    ctx.fillRect(cx + 3, cy - 1 + armOffset, 4, 6);
    ctx.fillStyle = ThemeTokens.colors.portraitSkinBase;
    ctx.fillRect(cx + 3, cy + 5 + armOffset, 4, 1.5);
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx + 3, cy + 6.5 + armOffset, 4, 3);

    // Shoulder Halogen Lantern facing forward
    ctx.fillStyle = ThemeTokens.colors.metalTrim;
    ctx.fillRect(cx + 4, cy - 9, 6, 6);
    ctx.strokeStyle = ThemeTokens.colors.miraOutlineJacket;
    ctx.strokeRect(cx + 4, cy - 9, 6, 6);
    ctx.fillStyle = ThemeTokens.colors.playerLamp;
    ctx.beginPath();
    ctx.arc(cx + 7, cy - 6, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ThemeTokens.colors.portraitEyeHighlight;
    ctx.beginPath();
    ctx.arc(cx + 8, cy - 7, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

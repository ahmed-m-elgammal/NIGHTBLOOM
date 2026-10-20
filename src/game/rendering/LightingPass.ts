import { PlayerEntity } from '../entities/player';
import { GAME_CONFIG } from '../config/gameConfig';
import { ThemeTokens } from '../../content/theme/tokens';

export class LightingPass {
  static drawLighting(ctx: CanvasRenderingContext2D, player: PlayerEntity, timeSec: number): void {
    // Mira's Volumetric Halogen Shoulder Lantern (Layered soft feathered beam)
    const coneAngle = player.facingAngle;
    const forwardX = player.x + Math.cos(coneAngle) * 90;
    const forwardY = player.y + Math.sin(coneAngle) * 90;

    // 1. Broad soft ambient illumination
    const broadGrad = ctx.createRadialGradient(player.x, player.y, 8, forwardX, forwardY, 190);
    broadGrad.addColorStop(0, ThemeTokens.colors.lanternBeamBroad);
    broadGrad.addColorStop(0.5, ThemeTokens.colors.lanternBeamFaint);
    broadGrad.addColorStop(1, ThemeTokens.colors.signalCyanTransparent);
    ctx.fillStyle = broadGrad;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.arc(player.x, player.y, 200, coneAngle - 0.52, coneAngle + 0.52);
    ctx.closePath();
    ctx.fill();

    // 2. Focused central halogen beam
    const coreGrad = ctx.createRadialGradient(player.x, player.y, 4, forwardX, forwardY, 140);
    coreGrad.addColorStop(0, ThemeTokens.colors.lanternBeamCore);
    coreGrad.addColorStop(0.6, ThemeTokens.colors.lanternBeamCoreFade);
    coreGrad.addColorStop(1, ThemeTokens.colors.signalCyanTransparent);
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.arc(player.x, player.y, 150, coneAngle - 0.3, coneAngle + 0.3);
    ctx.closePath();
    ctx.fill();

    // Ambient ground circle around Mira's boots (Grounded visibility)
    const footGrad = ctx.createRadialGradient(player.x, player.y, 4, player.x, player.y, 46);
    footGrad.addColorStop(0, ThemeTokens.colors.lanternBeamFoot);
    footGrad.addColorStop(1, ThemeTokens.colors.signalCyanTransparent);
    ctx.fillStyle = footGrad;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 46, 0, Math.PI * 2);
    ctx.fill();

    // Nursery Beacon Ambient Radial Light Aura
    const { x: bx, y: by, minGlowRadius, maxGlowPulseDelta } = GAME_CONFIG.beacon;
    const pulseRadius = minGlowRadius + Math.sin(timeSec * 2.8) * maxGlowPulseDelta;
    const beaconGrad = ctx.createRadialGradient(bx, by, 25, bx, by, pulseRadius);
    beaconGrad.addColorStop(0, ThemeTokens.colors.beaconGlowInner);
    beaconGrad.addColorStop(0.6, ThemeTokens.colors.beaconGlowOuter);
    beaconGrad.addColorStop(1, ThemeTokens.colors.signalCyanTransparent);
    ctx.fillStyle = beaconGrad;
    ctx.beginPath();
    ctx.arc(bx, by, pulseRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawAtmosphericSpores(ctx: CanvasRenderingContext2D, timeSec: number): void {
    ctx.fillStyle = ThemeTokens.colors.seedHaloGlow;

    const count = GAME_CONFIG.map.dustMoteCount;
    const mw = GAME_CONFIG.map.width;
    const mh = GAME_CONFIG.map.height;

    // Drifting Grey Season pollen motes
    for (let i = 0; i < count; i++) {
      const sx = (i * 137 + timeSec * 35) % mw;
      const sy = (i * 219 + Math.sin(timeSec * 1.5 + i) * 45) % mh;
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  static drawScreenVignette(ctx: CanvasRenderingContext2D, vw: number, vh: number): void {
    const cx = vw / 2;
    const cy = vh / 2;
    const radius = Math.hypot(cx, cy);

    // Light, soft peripheral vignette so edges remain clear and readable
    const vignette = ctx.createRadialGradient(cx, cy, radius * 0.75, cx, cy, radius);
    vignette.addColorStop(0, ThemeTokens.colors.signalCyanTransparent);
    vignette.addColorStop(1, ThemeTokens.colors.vignetteSoft);

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, vw, vh);
  }
}

/**
 * Canvas 2D Render Pipeline Orchestrator
 * Authority: spec/Technical Design Document (TDD).md §5.3 & docs/PRE_B_VISUAL_FOUNDATION_PLAN.md §4.7
 * Owns the camera, static ground blit, layer order, lighting calls and vignette.
 * Dynamic flowers/beacon/player live in WorldEntityRenderer; props/landmarks live in WorldPropsRenderer.
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { ThemeTokens } from '../../content/theme/tokens';
import { PlayerEntity } from '../entities/player';
import { Vector2D } from '../input/InputManager';
import { SpriteFactory, SpriteAtlas } from './SpriteFactory';
import { GroundRenderer } from './GroundRenderer';
import { LightingPass } from './LightingPass';
import { WorldEntityRenderer } from './WorldEntityRenderer';
import { WorldPropsRenderer } from './WorldPropsRenderer';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private atlas: SpriteAtlas | null = null;
  private groundCache: HTMLCanvasElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to acquire 2D rendering context from canvas');
    }
    this.ctx = context;
    if (typeof window !== 'undefined') {
      this.atlas = SpriteFactory.getAtlas();
      this.groundCache = GroundRenderer.getGroundCache();
    }
    this.resize();
  }

  public resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, GAME_CONFIG.viewport.maxDpr);
    this.canvas.width = Math.floor(GAME_CONFIG.viewport.width * dpr);
    this.canvas.height = Math.floor(GAME_CONFIG.viewport.height * dpr);
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
    LightingPass.resize(GAME_CONFIG.viewport.width, GAME_CONFIG.viewport.height);
  }

  public render(player: PlayerEntity, camera: Vector2D, timeSec: number): void {
    const { ctx } = this;
    const vw = GAME_CONFIG.viewport.width;
    const vh = GAME_CONFIG.viewport.height;
    const { width: mapWidth, height: mapHeight } = GAME_CONFIG.map;

    // 1. Clear viewport with the deep soil base token.
    ctx.fillStyle = ThemeTokens.colors.groundBase;
    ctx.fillRect(0, 0, vw, vh);

    const halfWidth = vw / 2;
    const halfHeight = vh / 2;
    const cameraX = Math.round(camera.x);
    const cameraY = Math.round(camera.y);
    const sourceX = Math.max(0, Math.min(mapWidth - vw, cameraX - halfWidth));
    const sourceY = Math.max(0, Math.min(mapHeight - vh, cameraY - halfHeight));

    // Layer 1 (Foundation F-1): static ground and road cache.
    if (this.groundCache) {
      ctx.drawImage(this.groundCache, sourceX, sourceY, vw, vh, 0, 0, vw, vh);
    }

    ctx.save();
    ctx.translate(halfWidth - cameraX, halfHeight - cameraY);

    if (this.atlas) {
      // Layer 2: animated flower underlayer.
      WorldEntityRenderer.drawFlowerPatches(
        ctx,
        this.atlas,
        cameraX,
        cameraY,
        vw,
        vh,
        timeSec,
        LightingPass.isReducedMotion(),
      );

      // Layer 3: landmarks and machinery above the flower layer.
      WorldPropsRenderer.draw(ctx, this.atlas, cameraX, cameraY, vw, vh);

      // Layer 4: beacon pulse and tower.
      WorldEntityRenderer.drawBeacon(ctx, this.atlas, cameraX, cameraY, vw, vh, timeSec);

      // Layer 5: Mira above the world props.
      WorldEntityRenderer.drawPlayer(ctx, this.atlas, player, timeSec);
    }

    ctx.restore();

    // Layer 6 (F-2): atmospheric twilight composite.
    LightingPass.compositeAtmosphericLighting(ctx, player, cameraX, cameraY, vw, vh, timeSec);

    // Layer 7: screen-space peripheral vignette.
    LightingPass.drawScreenVignette(ctx, vw, vh);
  }
}

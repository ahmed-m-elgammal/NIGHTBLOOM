/**
 * Fixed Timestep Game Loop with 10 Hz Throttled React Bridge
 * Authority: AGENTS.md §4.5, §5.5 & spec/Technical Design Document (TDD).md §1
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { PlayerEntity } from '../entities/player';
import { InputManager, Vector2D } from '../input/InputManager';
import { CanvasRenderer } from '../rendering/Renderer';

export interface HudSnapshot {
  playerX: number;
  playerY: number;
  speed: number;
  isMoving: boolean;
  beaconDistance: number;
  beaconAngleRad: number;
  health: number;
  maxHealth: number;
  level: number;
  xp: number;
  xpNextLevel: number;
  defeatedCount: number;
  remainingTimeSec: number;
}

export class GameController {
  private player: PlayerEntity;
  private input: InputManager;
  private renderer: CanvasRenderer;
  private camera: Vector2D;

  private rafId: number | null = null;
  private lastTimeMs: number = 0;
  private accumulatorSec: number = 0;
  private isPaused: boolean = false;
  private isDisposed: boolean = false;
  private simulationTimeSec: number = 0;

  // 10 Hz throttled React bridge
  private lastSnapshotTimeSec: number = 0;
  private onSnapshotCallback?: (snapshot: HudSnapshot) => void;

  private onVisibilityChangeBound = () => this.handleVisibilityChange();

  constructor(
    canvas: HTMLCanvasElement,
    onSnapshot?: (snapshot: HudSnapshot) => void
  ) {
    this.player = new PlayerEntity();
    this.input = new InputManager();
    this.renderer = new CanvasRenderer(canvas);
    this.camera = { x: this.player.x, y: this.player.y };
    this.onSnapshotCallback = onSnapshot;

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilityChangeBound);
    }

    this.start();
  }

  private start(): void {
    this.lastTimeMs = performance.now();
    this.rafId = requestAnimationFrame((now) => this.tick(now));
  }

  private handleVisibilityChange(): void {
    if (typeof document === 'undefined') return;
    if (document.visibilityState === 'hidden') {
      this.isPaused = true;
    } else {
      // Return from background: clamp delta to prevent spiral of death
      this.accumulatorSec = 0;
      this.lastTimeMs = performance.now();
    }
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
    if (!paused) {
      this.lastTimeMs = performance.now();
    }
  }

  public getPaused(): boolean {
    return this.isPaused;
  }

  private tick(nowMs: number): void {
    if (this.isDisposed) return;

    const rawDeltaSec = (nowMs - this.lastTimeMs) / 1000;
    this.lastTimeMs = nowMs;

    // Strict clamp: max 100 ms to prevent spiral of death
    const deltaSec = Math.min(rawDeltaSec, GAME_CONFIG.simulation.maxDeltaClampSec);

    if (!this.isPaused) {
      this.accumulatorSec += deltaSec;
      const fixedDt = GAME_CONFIG.simulation.fixedDeltaSec;

      // Fixed 60 Hz simulation updates
      while (this.accumulatorSec >= fixedDt) {
        this.updateSimulation(fixedDt);
        this.accumulatorSec -= fixedDt;
      }

      // Smooth camera follow (TDD.md §1.2): Cam(t + dt) = Cam(t) + (Player - Cam(t)) * (1 - e^(-lambda * dt))
      const blend = 1 - Math.exp(-GAME_CONFIG.camera.lambda * deltaSec);
      this.camera.x += (this.player.x - this.camera.x) * blend;
      this.camera.y += (this.player.y - this.camera.y) * blend;

      // Clamp camera view so edges never scroll outside map [0, 3200] x [0, 2400]
      const halfVw = GAME_CONFIG.viewport.width / 2;
      const halfVh = GAME_CONFIG.viewport.height / 2;
      this.camera.x = Math.max(halfVw, Math.min(this.camera.x, GAME_CONFIG.map.width - halfVw));
      this.camera.y = Math.max(halfVh, Math.min(this.camera.y, GAME_CONFIG.map.height - halfVh));
    }

    // Render Canvas 2D
    this.renderer.render(this.player, this.camera, this.simulationTimeSec);

    // 10 Hz React Snapshot bridge
    const snapshotInterval = 1 / GAME_CONFIG.simulation.reactSnapshotRateHz;
    if (this.simulationTimeSec - this.lastSnapshotTimeSec >= snapshotInterval) {
      this.lastSnapshotTimeSec = this.simulationTimeSec;
      this.emitSnapshot();
    }

    this.rafId = requestAnimationFrame((now) => this.tick(now));
  }

  private updateSimulation(dt: number): void {
    this.simulationTimeSec += dt;
    const moveVector = this.input.getMovementVector();
    this.player.update(moveVector, dt);
  }

  private emitSnapshot(): void {
    if (!this.onSnapshotCallback) return;
    const dx = GAME_CONFIG.beacon.x - this.player.x;
    const dy = GAME_CONFIG.beacon.y - this.player.y;
    const dist = Math.round(Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    const countdown = Math.max(0, GAME_CONFIG.chapter.phaseDurationSec - Math.floor(this.simulationTimeSec));

    const snapshot: HudSnapshot = {
      playerX: Math.round(this.player.x),
      playerY: Math.round(this.player.y),
      speed: this.player.isMoving ? GAME_CONFIG.player.baseSpeed : 0,
      isMoving: this.player.isMoving,
      beaconDistance: dist,
      beaconAngleRad: angle,
      health: 100,
      maxHealth: 100,
      level: 1,
      xp: 0,
      xpNextLevel: 100,
      defeatedCount: 0,
      remainingTimeSec: countdown,
    };
    this.onSnapshotCallback(snapshot);
  }

  public resize(): void {
    this.renderer.resize();
  }

  public dispose(): void {
    this.isDisposed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChangeBound);
    }
    this.input.dispose();
  }
}

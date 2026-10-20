/**
 * Player Entity (Pure TypeScript Simulation)
 * Authority: AGENTS.md §4.4 & spec/Technical Design Document (TDD).md §1.2
 * Strict Rule: Zero DOM, React, Canvas, or Web Audio dependencies. Runs headlessly.
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { Vector2D } from '../input/InputManager';

export class PlayerEntity {
  public x: number;
  public y: number;
  public vx: number = 0;
  public vy: number = 0;
  public facingAngle: number = 0;
  public isMoving: boolean = false;
  public walkTime: number = 0;

  constructor(startX: number = GAME_CONFIG.player.spawnX, startY: number = GAME_CONFIG.player.spawnY) {
    this.x = startX;
    this.y = startY;
  }

  public update(inputVector: Vector2D, dt: number): void {
    const speed = GAME_CONFIG.player.baseSpeed;

    this.vx = inputVector.x * speed;
    this.vy = inputVector.y * speed;

    this.isMoving = inputVector.x !== 0 || inputVector.y !== 0;

    if (this.isMoving) {
      this.facingAngle = Math.atan2(inputVector.y, inputVector.x);
      this.walkTime += dt;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Clamp coordinates strictly within map boundaries
    const pad = GAME_CONFIG.map.padding;
    const minX = pad;
    const maxX = GAME_CONFIG.map.width - pad;
    const minY = pad;
    const maxY = GAME_CONFIG.map.height - pad;

    this.x = Math.max(minX, Math.min(this.x, maxX));
    this.y = Math.max(minY, Math.min(this.y, maxY));
  }

  public reset(startX: number = GAME_CONFIG.player.spawnX, startY: number = GAME_CONFIG.player.spawnY): void {
    this.x = startX;
    this.y = startY;
    this.vx = 0;
    this.vy = 0;
    this.facingAngle = 0;
    this.isMoving = false;
    this.walkTime = 0;
  }
}

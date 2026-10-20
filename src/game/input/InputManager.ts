/**
 * InputManager — Translates keyboard keys and virtual joysticks to normalized vectors.
 * Authority: AGENTS.md §5.1 & spec/Technical Design Document (TDD).md
 */

export interface Vector2D {
  x: number;
  y: number;
}

export class InputManager {
  private activeKeys = new Set<string>();
  private activeMovementVector: Vector2D = { x: 0, y: 0 };
  private onKeyDownBound = (e: KeyboardEvent) => this.handleKeyDown(e);
  private onKeyUpBound = (e: KeyboardEvent) => this.handleKeyUp(e);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.onKeyDownBound);
      window.addEventListener('keyup', this.onKeyUpBound);
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Prevent scrolling from arrow keys / space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
    this.activeKeys.add(e.code);
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.activeKeys.delete(e.code);
  }

  /**
   * Sets manual vector override (e.g. for virtual joystick on mobile).
   */
  public setActiveMovementVector(vec: Vector2D): void {
    const len = Math.hypot(vec.x, vec.y);
    if (len > 1.0) {
      this.activeMovementVector = { x: vec.x / len, y: vec.y / len };
    } else {
      this.activeMovementVector = { x: vec.x, y: vec.y };
    }
  }

  /**
   * Calculates the current normalized 8-way movement vector.
   */
  public getMovementVector(): Vector2D {
    // If external vector was set (joystick), prioritize it
    if (this.activeMovementVector.x !== 0 || this.activeMovementVector.y !== 0) {
      return this.activeMovementVector;
    }

    let dx = 0;
    let dy = 0;

    if (this.activeKeys.has('KeyW') || this.activeKeys.has('ArrowUp')) dy -= 1;
    if (this.activeKeys.has('KeyS') || this.activeKeys.has('ArrowDown')) dy += 1;
    if (this.activeKeys.has('KeyA') || this.activeKeys.has('ArrowLeft')) dx -= 1;
    if (this.activeKeys.has('KeyD') || this.activeKeys.has('ArrowRight')) dx += 1;

    const length = Math.hypot(dx, dy);
    if (length > 0) {
      return { x: dx / length, y: dy / length };
    }

    return { x: 0, y: 0 };
  }

  public isSpacePressed(): boolean {
    return this.activeKeys.has('Space');
  }

  public dispose(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onKeyDownBound);
      window.removeEventListener('keyup', this.onKeyUpBound);
    }
    this.activeKeys.clear();
  }
}

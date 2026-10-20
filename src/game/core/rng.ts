/**
 * Deterministic Seeded PRNG using mulberry32.
 * Authority: AGENTS.md §4.6 & spec/Technical Design Document (TDD).md
 * Pure TypeScript, zero Math.random() calls.
 */

export class SeededRNG {
  private state: number;
  private readonly initialSeed: number;

  constructor(seed: number = 1337) {
    this.initialSeed = seed >>> 0;
    this.state = this.initialSeed;
  }

  /**
   * Generates a 32-bit unsigned float in range [0, 1).
   */
  public next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a float in range [min, max).
   */
  public nextFloat(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Returns an inclusive integer in range [min, max].
   */
  public nextInt(min: number, max: number): number {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(minCeil + this.next() * (maxFloor - minCeil + 1));
  }

  public getSeed(): number {
    return this.initialSeed;
  }

  public getState(): number {
    return this.state;
  }

  public setState(state: number): void {
    this.state = state >>> 0;
  }

  public reset(): void {
    this.state = this.initialSeed;
  }
}

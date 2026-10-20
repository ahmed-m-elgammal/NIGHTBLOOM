import { describe, it, expect } from 'vitest';
import { SeededRNG } from '../../game/core/rng';

describe('SeededRNG (mulberry32)', () => {
  it('produces identical sequences given identical seeds', () => {
    const rngA = new SeededRNG(4242);
    const rngB = new SeededRNG(4242);

    const valuesA = Array.from({ length: 10 }, () => rngA.next());
    const valuesB = Array.from({ length: 10 }, () => rngB.next());

    expect(valuesA).toEqual(valuesB);
  });

  it('produces differing sequences for different seeds', () => {
    const rngA = new SeededRNG(101);
    const rngB = new SeededRNG(202);

    const valA = rngA.next();
    const valB = rngB.next();

    expect(valA).not.toBe(valB);
  });

  it('returns values strictly bounded in [0, 1)', () => {
    const rng = new SeededRNG(999);
    for (let i = 0; i < 500; i++) {
      const val = rng.next();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it('generates integers correctly within [min, max]', () => {
    const rng = new SeededRNG(777);
    for (let i = 0; i < 200; i++) {
      const n = rng.nextInt(3, 8);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(8);
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  it('allows restoring state correctly', () => {
    const rngA = new SeededRNG(12345);
    // Advance 5 steps
    for (let i = 0; i < 5; i++) rngA.next();

    const savedState = rngA.getState();
    const nextThreeA = [rngA.next(), rngA.next(), rngA.next()];

    // Restore state in rngB
    const rngB = new SeededRNG(99999);
    rngB.setState(savedState);
    const nextThreeB = [rngB.next(), rngB.next(), rngB.next()];

    expect(nextThreeA).toEqual(nextThreeB);
  });
});

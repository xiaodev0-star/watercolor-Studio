/**
 * Seeded pseudo-random number generator (Lehmer / Park-Miller).
 * Deterministic: same seed → same sequence, always.
 */
export function createPRNG(seed) {
  let s = seed | 0;

  /** Returns a float in [0, 1). */
  function next() {
    s = (s * 16807 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  }

  /** Random float in [a, b). */
  function range(a, b) {
    return a + next() * (b - a);
  }

  /** Random integer in [a, b] (inclusive). */
  function int(a, b) {
    return Math.floor(range(a, b + 1));
  }

  /** Box-Muller Gaussian. */
  function gaussian(mean, sd) {
    let u = 0, v = 0;
    while (u === 0) u = next();
    while (v === 0) v = next();
    return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /** Pick a random element from an array. */
  function pick(arr) {
    return arr[int(0, arr.length - 1)];
  }

  return { next, range, int, gaussian, pick };
}

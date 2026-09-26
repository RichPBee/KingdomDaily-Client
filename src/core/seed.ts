import { type GameMode } from '../types/game';

/**
 * Converts a date string ("YYYY-MM-DD") and mode into a deterministic 32-bit integer seed.
 * Examples:
 *   "2026-09-26-Hidden"  -> 83921049
 *   "2026-09-26-Visible" -> 41093821
 */
export function generateDailySeed(dateStr: string, mode: GameMode): number {
  const compositeKey = `${dateStr}-${mode}`;
  let hash = 0;
  for (let i = 0; i < compositeKey.length; i++) {
    hash = (hash << 5) - hash + compositeKey.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * High-performance 32-bit Mulberry32 PRNG Generator.
 * Returns a function that outputs deterministic pseudo-random numbers between 0 (inclusive) and 1 (exclusive).
 */
export function createPRNG(seed: number): () => number {
  let s = seed;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pure, non-mutating Fisher-Yates Shuffle using a deterministic PRNG function.
 */
export function seededShuffle<T>(array: T[], prng: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    const temp = result[i];
    result[i] = result[j]!;
    result[j] = temp!;
  }
  return result;
}
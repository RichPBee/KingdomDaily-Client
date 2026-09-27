import {
  type GameMode,
  type PuzzleData,
  type ResolvedEvent,
  type ResourceType,
  type ResourceDelta,
} from '../types/game';
import { generateDailySeed, createPRNG, seededShuffle } from './seed';
import { EVENTS } from '../data/events';
import { ACTIONS } from '../data/actions';
import { generateInitialStats, solvePuzzle, type SolverResult } from './engine';

export interface VerifiedPuzzleData extends PuzzleData {
  solverInfo: SolverResult;
}

/**
 * Helper to generate a candidate puzzle from a given seed string.
 */
function generateCandidatePuzzle(
  dateStr: string,
  mode: GameMode,
  seed: string
): PuzzleData {
  const prng = createPRNG(seed);
  const initialStats = generateInitialStats(prng);

  // 1. Shuffle master event definitions and select 9 for the daily run
  const selectedEventDefs = seededShuffle(EVENTS, prng).slice(0, 9);

  // 2. Resolve random impact numbers within each event's defined range
  const resolvedEvents: ResolvedEvent[] = selectedEventDefs.map((eventDef) => {
    const impact: ResourceDelta = {};

    for (const [resource, range] of Object.entries(eventDef.impactRanges)) {
      if (range) {
        // Roll integer between min and max inclusive
        const rolledValue =
          Math.floor(prng() * (range.max - range.min + 1)) + range.min;
        impact[resource as ResourceType] = rolledValue;
      }
    }

    return {
      id: eventDef.id,
      title: eventDef.title,
      description: eventDef.description,
      icon: eventDef.icon,
      category: eventDef.category,
      impact,
    };
  });

  // 3. Shuffle master action cards and pick 9 for the player pool
  const selectedActions = seededShuffle(ACTIONS, prng).slice(0, 9);

  return {
    dateStr,
    mode,
    seed,
    initialStats,
    events: resolvedEvents,
    actions: selectedActions,
  };
}

/**
 * Loads a 100% deterministic, verified daily puzzle configuration.
 * If the base seed leads to an unwinnable puzzle, it mutates the seed suffix
 * until solvePuzzle finds at least one valid path.
 * e.g., loadDailyPuzzle("2026-09-26", "Hidden")
 */
export function loadDailyPuzzle(
  dateStr: string,
  mode: GameMode
): VerifiedPuzzleData {
  const baseSeed = generateDailySeed(dateStr, mode);
  let attempt = 0;
  const maxAttempts = 500;

  while (attempt < maxAttempts) {
    const currentSeed = attempt === 0 ? `${baseSeed}` : `${baseSeed}-v${attempt}`;
    const candidatePuzzle = generateCandidatePuzzle(dateStr, mode, currentSeed);

    // Run the solver to check solvability and compute the max score
    const solverInfo = solvePuzzle(
      candidatePuzzle.initialStats,
      candidatePuzzle.events,
      candidatePuzzle.actions
    );

    if (solverInfo.isSolvable) {
      return {
        ...candidatePuzzle,
        solverInfo,
      };
    }

    attempt++;
  }

  throw new Error(
    `Failed to generate a winnable puzzle for date "${dateStr}" (${mode}) after ${maxAttempts} attempts.`
  );
}
import {
  type GameMode,
  type PuzzleData,
  type ResolvedEvent,
  type ResourceType,
  type  ResourceDelta,
} from '../types/game';
import { generateDailySeed, createPRNG, seededShuffle } from './seed';
import { EVENTS } from '../data/events';
import { ACTIONS } from '../data/actions';
import { generateInitialStats } from './engine';

/**
 * Loads a 100% deterministic daily puzzle configuration for a date and game mode.
 * e.g., loadDailyPuzzle("2026-09-26", "Hidden")
 */
export function loadDailyPuzzle(dateStr: string, mode: GameMode): PuzzleData {
  const seed = generateDailySeed(dateStr, mode);
  const prng = createPRNG(seed);
    const initialStats = generateInitialStats(prng);
  //Shuffle master event definitions and select 9 for the daily run
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
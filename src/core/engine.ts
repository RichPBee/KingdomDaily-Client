// src/core/engine.ts
import {
  type KingdomStats,
  type ResolvedEvent,
  type ActionCard,
  type TurnHistoryItem,
  type ResourceDelta,
} from '../types/game';

export const MAX_ROUNDS = 9;
export const MIN_INITIAL_STAT = 10;
export const MAX_INITIAL_STAT = 60;

/**
 * Generates initial stats deterministically using the daily PRNG stream.
 * Rolls an integer between MIN_INITIAL_STAT (10) and MAX_INITIAL_STAT (60) for each resource.
 */
export function generateInitialStats(prng: () => number): KingdomStats {
  const roll = () =>
    Math.floor(prng() * (MAX_INITIAL_STAT - MIN_INITIAL_STAT + 1)) + MIN_INITIAL_STAT;

  return {
    population: roll(),
    food: roll(),
    gold: roll(),
  };
}

export interface RoundResult {
  nextStats: KingdomStats;
  turnHistoryItem: TurnHistoryItem;
  isGameOver: boolean;
  isVictory: boolean;
  defeatReason?: string;
}

/**
 * Calculates net resource changes by combining event impacts and action costs/benefits.
 */
export function calculateNetDelta(
  event: ResolvedEvent,
  action: ActionCard
): ResourceDelta {
  return {
    population:
      (event.impact.population ?? 0) +
      (action.cost.population ?? 0) +
      (action.benefit.population ?? 0),
    food:
      (event.impact.food ?? 0) +
      (action.cost.food ?? 0) +
      (action.benefit.food ?? 0),
    gold:
      (event.impact.gold ?? 0) +
      (action.cost.gold ?? 0) +
      (action.benefit.gold ?? 0),
  };
}

/**
 * Applies resource deltas to kingdom stats, ensuring values never drop below 0.
 */
export function applyDelta(
  currentStats: KingdomStats,
  delta: ResourceDelta
): KingdomStats {
  return {
    population: Math.max(0, currentStats.population + (delta.population ?? 0)),
    food: Math.max(0, currentStats.food + (delta.food ?? 0)),
    gold: Math.max(0, currentStats.gold + (delta.gold ?? 0)),
  };
}

/**
 * Evaluates whether any resource reached 0 (Defeat) or if Round 9 finished (Victory).
 */
export function checkGameStatus(
  stats: KingdomStats,
  currentRound: number
): { isGameOver: boolean; isVictory: boolean; defeatReason?: string } {
  if (stats.population <= 0) {
    return {
      isGameOver: true,
      isVictory: false,
      defeatReason: 'Your kingdom became desolate—all citizens perished or deserted.',
    };
  }
  if (stats.food <= 0) {
    return {
      isGameOver: true,
      isVictory: false,
      defeatReason: 'Famine overtook your realm—granaries reached complete exhaustion.',
    };
  }
  if (stats.gold <= 0) {
    return {
      isGameOver: true,
      isVictory: false,
      defeatReason: 'The royal treasury collapsed—creditors seized control of the realm.',
    };
  }

  // If we survived past round 9 without reaching 0 on any stat
  if (currentRound >= MAX_ROUNDS) {
    return {
      isGameOver: true,
      isVictory: true,
    };
  }

  return { isGameOver: false, isVictory: false };
}

/**
 * Pure turn execution function: advances 1 round given current state, active event, and played action card.
 */
export function executeTurn(
  currentStats: KingdomStats,
  round: number,
  event: ResolvedEvent,
  action: ActionCard
): RoundResult {
  const netDelta = calculateNetDelta(event, action);
  const nextStats = applyDelta(currentStats, netDelta);

  const status = checkGameStatus(nextStats, round);

  const turnHistoryItem: TurnHistoryItem = {
    round,
    event,
    playedAction: action,
    statsBefore: { ...currentStats },
    statsAfter: { ...nextStats },
  };

  return {
    nextStats,
    turnHistoryItem,
    isGameOver: status.isGameOver,
    isVictory: status.isVictory,
    defeatReason: status.defeatReason,
  };
}

/**
 * Computes the final numeric score for a completed game.
 * Surviving all 9 rounds adds a 200-point bonus.
 */
export type RoundGrade = 'GREEN' | 'YELLOW' | 'RED' | 'FAILED';

/**
 * Evaluates the performance tier of a single completed turn based on net resource changes.
 */
export function evaluateTurnGrade(turn: TurnHistoryItem): RoundGrade {
  const beforeTotal =
    turn.statsBefore.population + turn.statsBefore.food + turn.statsBefore.gold;
  const afterTotal =
    turn.statsAfter.population + turn.statsAfter.food + turn.statsAfter.gold;
  const netChange = afterTotal - beforeTotal;
  if (turn.statsAfter.population <= 0 || turn.statsAfter.food <= 0 || turn.statsAfter.gold <= 0) return 'FAILED';
  if (netChange > 0) return 'GREEN';
  if (netChange >= -10) return 'YELLOW';
  return 'RED';
}
/**
 * Clamps a number between a minimum and maximum boundary.
 *
 * @param value - The number to clamp.
 * @param min - The lower boundary.
 * @param max - The upper boundary.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
/**
 * Calculates final score by grading each completed turn:
 * - Green (Net positive): 50 pts
 * - Yellow (Minor loss / steady): 20 pts
 * - Red (Heavy loss): 5 pts
 * - Failed / Unreached rounds: 0 pts
 */
export function calculateFinalScore(
  stats: KingdomStats,
  turnHistory: TurnHistoryItem[],
  isVictory: boolean,
  bestSequence?: ActionCard[]
): number {
  const resourceTotal = Math.max(0, stats.population + stats.food + stats.gold);
  const victoryBonus = isVictory ? 200 : 0;

  // Grade each turn in history and sum round points
  const roundScores = turnHistory.reduce((total, turn) => {
    const grade = evaluateTurnGrade(turn);
    const netDelta = Object.values(calculateNetDelta(turn.event, turn.playedAction)).reduce((sum, val) => sum + (val ?? 0), 0);
    const bestNetDelta = bestSequence ? Object.values(calculateNetDelta(turn.event, bestSequence[turn.round - 1])).reduce((sum, val) => sum + (val ?? 0), 0) : null;

    const multiplier = bestNetDelta && (netDelta / bestNetDelta) < 1 ? netDelta / bestNetDelta : 1;
    switch (grade) {
      case 'GREEN':
        return ((total + 50) * multiplier);
      case 'YELLOW':
        return ((total + 20) * multiplier);
      case 'RED':
        return ((total + 5) * multiplier);
      default:
        return total * multiplier;
    }
  }, 0);

  return Math.round(resourceTotal + roundScores + victoryBonus)
}

/* ========================================================================
 * SOLVER & VERIFICATION EXTENSION
 * ======================================================================== */

export interface SolverResult {
  isSolvable: boolean;
  maxScore: number;
  bestSequence: ActionCard[];
  validPathsCount: number;
}

/**
 * Brute-forces all 9! permutations using backtracking to check solvability
 * and find the maximum achievable score for a given set of initial stats, events, and action cards.
 */
export function solvePuzzle(
  initialStats: KingdomStats,
  events: ResolvedEvent[],
  actionCards: ActionCard[]
): SolverResult {
  let maxScore = -1;
  let bestSequence: ActionCard[] = [];
  let validPathsCount = 0;

  function backtrack(
    roundIndex: number,
    currentStats: KingdomStats,
    availableCards: ActionCard[],
    currentSequence: ActionCard[],
    turnHistory: TurnHistoryItem[]
  ) {
    const currentRoundNumber = roundIndex + 1;

    // Check game state before picking next card
    const status = checkGameStatus(currentStats, roundIndex);
    if (status.isGameOver && !status.isVictory) {
      return; // Prune branch - kingdom perished
    }

    // Surviving all rounds triggers victory evaluation
    if (roundIndex === MAX_ROUNDS || roundIndex === events.length) {
      validPathsCount++;
      const score = calculateFinalScore(currentStats, turnHistory, true);
      if (score > maxScore) {
        maxScore = score;
        bestSequence = [...currentSequence];
      }
      return;
    }

    const currentEvent = events[roundIndex];

    for (let i = 0; i < availableCards.length; i++) {
      const card = availableCards[i];
      const result = executeTurn(currentStats, currentRoundNumber, currentEvent, card);

      // If playing this card causes instant defeat, prune this path
      if (result.isGameOver && !result.isVictory) {
        continue;
      }

      const remainingCards = [...availableCards.slice(0, i), ...availableCards.slice(i + 1)];
      
      currentSequence.push(card);
      turnHistory.push(result.turnHistoryItem);

      backtrack(
        roundIndex + 1,
        result.nextStats,
        remainingCards,
        currentSequence,
        turnHistory
      );

      // Backtrack
      turnHistory.pop();
      currentSequence.pop();
    }
  }

  backtrack(0, { ...initialStats }, [...actionCards], [], []);

  return {
    isSolvable: validPathsCount > 0,
    maxScore: maxScore === -1 ? 0 : maxScore,
    bestSequence,
    validPathsCount,
  };
}
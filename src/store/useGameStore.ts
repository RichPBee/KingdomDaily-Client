import { create } from 'zustand';
import {
  type GameMode,
  type KingdomStats,
  type ActionCard,
  type TurnHistoryItem,
  type PuzzleData,
  type LocalGameRecord,
} from '../types/game';
import { loadDailyPuzzle } from '../core/puzzleGenerator';
import { executeTurn, calculateFinalScore, type SolverResult } from '../core/engine';
import { format } from 'date-fns';

const HISTORY_STORAGE_KEY = 'kingdom_daily_history';

// Helper functions for LocalStorage history persistence
export function getLocalHistory(): Record<string, LocalGameRecord> {
  try {
    const data = localStorage.getItem(HISTORY_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Failed to read game history from localStorage:', err);
    return {};
  }
}

export function saveLocalScore(record: LocalGameRecord): void {
  try {
    const history = getLocalHistory();
    const key = `${record.dateStr}_${record.mode}`;
    history[key] = record;
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save game score to localStorage:', err);
  }
}

export interface GameStoreState {
    theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Current game configuration
  dateStr: string;
  mode: GameMode;
  puzzle: PuzzleData | null;
    solverInfo: SolverResult | null;
  maxScore: number;
  // Active run state
  currentRound: number; // 1 through 9
  currentStats: KingdomStats;
  availableActions: ActionCard[]; // Remaining action cards (up to 9)
  turnHistory: TurnHistoryItem[];

  // Game completion state
  isGameOver: boolean;
  isVictory: boolean;
  defeatReason: string | null;
  finalScore: number | null;

  // Store actions
  loadGame: (dateStr?: string, mode?: GameMode) => void;
  playActionCard: (actionId: string) => void;
  restartCurrentGame: () => void;
  switchMode: (newMode: GameMode) => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
    theme: 'dark', // default theme

toggleTheme: () => {
  const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
  if (nextTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  set({ theme: nextTheme });
},
  // Default values
  dateStr: format(new Date(), 'yyyy-MM-dd'),
  mode: 'Hidden',
  puzzle: null,
  solverInfo: null,
  maxScore: 0,

  currentRound: 1,
  currentStats: { population: 0, food: 0, gold: 0 },
  availableActions: [],
  turnHistory: [],

  isGameOver: false,
  isVictory: false,
  defeatReason: null,
  finalScore: null,

  /**
   * Initializes or loads a daily puzzle for a given date and mode.
   * Restores existing completed run from localStorage if already played.
   */
  loadGame: (
    requestedDateStr?: string,
    requestedMode?: GameMode
  ) => {
    const dateStr = requestedDateStr ?? get().dateStr;
    const mode = requestedMode ?? get().mode;

    const puzzle = loadDailyPuzzle(dateStr, mode);
    //const history = getLocalHistory();
    //const savedRecord = history[`${dateStr}_${mode}`];
    set({
      dateStr,
      mode,
      puzzle,
      currentRound: 1,
      currentStats: puzzle.initialStats,
      availableActions: [...puzzle.actions],
      turnHistory: [],
      isGameOver: false,
      isVictory: false,
      defeatReason: null,
      finalScore: null,
      solverInfo: puzzle.solverInfo,
      maxScore: puzzle.solverInfo.maxScore,
    });
    // if (savedRecord) {
    //   // Rehydrate completed game state from local history
    //   set({
    //     dateStr,
    //     mode,
    //     puzzle,
    //     currentRound: savedRecord.survivedRounds,
    //     currentStats:
    //       savedRecord.history.length > 0
    //         ? savedRecord.history[savedRecord.history.length - 1]!.statsAfter
    //         : puzzle.initialStats,
    //     availableActions: puzzle.actions.filter(
    //       (act) => !savedRecord.history.some((h) => h.playedAction.id === act.id)
    //     ),
    //     turnHistory: savedRecord.history,
    //     isGameOver: true,
    //     isVictory: savedRecord.isVictory,
    //     defeatReason: savedRecord.isVictory
    //       ? null
    //       : 'Completed previous attempt.',
    //     finalScore: savedRecord.score,
    //   });
    // } else {
    //   // Fresh start for requested puzzle date/mode
    //   set({
    //     dateStr,
    //     mode,
    //     puzzle,
    //     currentRound: 1,
    //     currentStats: puzzle.initialStats,
    //     availableActions: [...puzzle.actions],
    //     turnHistory: [],
    //     isGameOver: false,
    //     isVictory: false,
    //     defeatReason: null,
    //     finalScore: null,
    //   });
    // }
  },

  /**
   * Plays an action card for the current active round and resolves game engine state.
   */
  playActionCard: (actionId: string) => {
    const {
      puzzle,
      currentRound,
      currentStats,
      availableActions,
      turnHistory,
      dateStr,
      mode,
      isGameOver,
    } = get();

    if (isGameOver || !puzzle) return;

    const playedAction = availableActions.find((a) => a.id === actionId);
    const activeEvent = puzzle.events[currentRound - 1];

    if (!playedAction || !activeEvent) return;

    // Execute engine simulation for this round
    const result = executeTurn(
      currentStats,
      currentRound,
      activeEvent,
      playedAction
    );

    const updatedHistory = [...turnHistory, result.turnHistoryItem];
    const updatedActions = availableActions.filter((a) => a.id !== actionId);

    if (result.isGameOver) {
      const score = calculateFinalScore(
        result.nextStats,
        updatedHistory,
        result.isVictory
      );

      // Persist completed record to LocalStorage
      const gameRecord: LocalGameRecord = {
        dateStr,
        mode,
        score,
        survivedRounds: currentRound,
        isVictory: result.isVictory,
        completedAt: new Date().toISOString(),
        history: updatedHistory,
      };
      saveLocalScore(gameRecord);

      set({
        currentStats: result.nextStats,
        availableActions: updatedActions,
        turnHistory: updatedHistory,
        isGameOver: true,
        isVictory: result.isVictory,
        defeatReason: result.defeatReason ?? null,
        finalScore: score,
      });
    } else {
      // Advance to next round
      set({
        currentRound: currentRound + 1,
        currentStats: result.nextStats,
        availableActions: updatedActions,
        turnHistory: updatedHistory,
      });
    }
  },

  /**
   * Resets active board to Round 1 for retrying the current date/mode.
   */
  restartCurrentGame: () => {
    const { dateStr, mode } = get();
    get().loadGame(dateStr, mode);
  },

  /**
   * Switches between "Hidden" and "Visible" game variants and re-loads the seed.
   */
  switchMode: (newMode: GameMode) => {
    const { dateStr } = get();
    get().loadGame(dateStr, newMode);
  },
}));
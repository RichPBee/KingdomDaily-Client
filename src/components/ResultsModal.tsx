import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Trophy, Skull, Share2, RotateCcw, Eye, EyeOff, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateFinalScore, calculateNetDelta } from '../core/engine';
import { Toast } from './Toast';

export const ResultsModal: React.FC = () => {
  const {
    isGameOver,
    isVictory,
    currentStats,
    currentRound,
    defeatReason,
    dateStr,
    mode,
    maxScore,
    finalScore: stateFinalScore,
    turnHistory,
    restartCurrentGame,
    switchMode,
    solverInfo
  } = useGameStore();
  const [showToast, setShowToast] = useState(false);
  let shareText = "";
  React.useEffect(() => {
    if (isGameOver && isVictory) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [isGameOver, isVictory]);

  if (!isGameOver) return null;

  // Final score from store or recalculated using engine formula
  const finalScore =
    stateFinalScore && stateFinalScore > 0
      ? stateFinalScore
      : calculateFinalScore(currentStats, turnHistory, isVictory, solverInfo?.bestSequence);

  // Efficiency percentage calculation
  const efficiency =
    maxScore > 0
      ? Math.min(100, Math.max(0, Math.round((finalScore / maxScore) * 100)))
      : 0;

  /**
   * Generates a Wordle-style 9-block emoji summary string based on turn history.
   */
  const generateEmojiGrid = (): string => {
    const blocks: string[] = [];

    for (let i = 0; i < 9; i++) {
      const turn = turnHistory[i];
      const bestAction = solverInfo?.bestSequence ? solverInfo.bestSequence[i] : null;
      if (!turn) {
        blocks.push('⬛'); // Round skipped/not reached
        continue;
      }

      // Calculate net change in resource totals for this turn
      const netDelta = Object.values(calculateNetDelta(turn.event, turn.playedAction)).reduce((sum, val) => sum + (val ?? 0), 0);
      const bestNetDelta = bestAction ? Object.values(calculateNetDelta(turn.event, bestAction)).reduce((sum, val) => sum + (val ?? 0), 0) : null;
      if (turn.statsAfter.population <= 0 || turn.statsAfter.food <= 0 || turn.statsAfter.gold <= 0) {
        blocks.push('💀'); // Defeated in this round
      }
      else if (bestAction && turn.playedAction.id === bestAction.id) {
        blocks.push('🟩');
      } else if (bestNetDelta && netDelta / bestNetDelta >= 0.75) {
        blocks.push('🟨'); // Minor loss / steady
      } else {
        blocks.push('🟥'); // Heavy loss
      }
    }

    return blocks.join('');
  };
  
  const handleShare = () => {
    const emojiGrid = generateEmojiGrid();
    shareText = `Kingdom Daily ${dateStr} (${mode})\n${
      isVictory ? '👑 Victory!' : '💀 Defeated'
    }\n${emojiGrid}\nScore: ${finalScore} / ${maxScore} pts (${efficiency}% Efficiency)`;
    try {
        navigator.clipboard.writeText(shareText);
        setShowToast(true);
    } catch (err)
    {
        console.error("Failed to copy results: ", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#fdfbf7] dark:bg-[#0f172a] border border-[#e0d1b7] dark:border-blue-900/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-[#2c241d] dark:text-slate-100 text-center space-y-5">
        {isVictory ? (
          <div className="space-y-2">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold">Kingdom Preserved!</h2>
            <p className="text-sm text-[#6b5d52] dark:text-slate-400">
              You successfully led your realm through all 9 events.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Skull className="w-16 h-16 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-bold">Realm Collapsed</h2>
            <p className="text-sm text-rose-500/90 font-medium">
              {defeatReason || 'Your resources were depleted.'}
            </p>
          </div>
        )}

        {/* Emoji Grid Display */}
        <div className="bg-[#f7f3e9] dark:bg-[#0a0f1d] p-3 rounded-xl border border-[#e0d1b7] dark:border-blue-900/30 text-center space-y-1">
          <span className="text-[10px] font-bold text-[#6b5d52] dark:text-slate-400 uppercase tracking-widest block">
            Run Summary
          </span>
          <div className="text-xl tracking-widest select-all font-mono">
            {generateEmojiGrid()}
          </div>
        </div>

        {/* Score & Efficiency Breakdown */}
        <div className="bg-[#f7f3e9] dark:bg-[#0a0f1d] p-4 rounded-xl border border-[#e0d1b7] dark:border-blue-900/30 space-y-3 text-left">
          <div className="flex justify-between text-sm">
            <span>Rounds Survived:</span>
            <span className="font-semibold">{currentRound} / 9</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Remaining Resources:</span>
            <span className="font-semibold">
              {currentStats.population + currentStats.food + currentStats.gold}
            </span>
          </div>

          <div className="border-t border-[#e0d1b7] dark:border-slate-800 pt-2 flex justify-between items-center text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Max Possible Score:
            </span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">
              {maxScore} pts
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-[#e0d1b7] dark:border-slate-800 pt-2 font-bold text-base">
            <span>Final Score:</span>
            <span className="text-amber-600 dark:text-amber-400">
              {finalScore} pts
            </span>
          </div>

          {/* Efficiency Progress Bar */}
          <div className="space-y-1 pt-1 border-t border-[#e0d1b7]/60 dark:border-slate-800/80">
            <div className="flex justify-between text-xs font-semibold text-[#6b5d52] dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600" /> Kingdom Efficiency
              </span>
              <span className={isVictory ? 'text-amber-600 dark:text-amber-400' : 'text-rose-500'}>
                {efficiency}%
              </span>
            </div>
            <div className="w-full bg-[#e8e2d5] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isVictory ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${efficiency}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share Score & Grid
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={restartCurrentGame}
              className="py-2.5 px-4 bg-[#f7f3e9] dark:bg-[#1e293b] hover:bg-[#ede4d3] dark:hover:bg-slate-900 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-[#e0d1b7] dark:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
            <button
              onClick={() => switchMode(mode === 'Hidden' ? 'Visible' : 'Hidden')}
              className="py-2.5 px-4 bg-[#f7f3e9] dark:bg-[#1e293b] hover:bg-[#ede4d3] dark:hover:bg-slate-900 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-[#e0d1b7] dark:border-slate-700"
            >
              {mode === 'Hidden' ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              {mode === 'Hidden' ? 'Play Visible' : 'Play Hidden'}
            </button>
          </div>
        </div>
      </div>
    <Toast isVisible={showToast} message={"Results copied to clipboard."} onClose={() => setShowToast(false)} duration={1500}/>
    
    </div>
  );
};
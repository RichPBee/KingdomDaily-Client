import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Trophy, Skull, Share2, RotateCcw, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ResultsModal: React.FC = () => {
  const { isGameOver, isVictory, currentStats, currentRound, defeatReason, dateStr, mode, restartCurrentGame, switchMode } = useGameStore();

  React.useEffect(() => {
    if (isGameOver && isVictory) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [isGameOver, isVictory]);

  if (!isGameOver) return null;

  const totalScore = currentStats.population + currentStats.food + currentStats.gold + (isVictory ? 100 : currentRound * 10);

  const handleShare = () => {
    const shareText = `Kingdom Daily ${dateStr} (${mode})\n${isVictory ? '👑 Victory!' : '💀 Defeated'}\nScore: ${totalScore} pts | Survived ${currentRound}/9 Rounds`;
    navigator.clipboard.writeText(shareText);
    alert('Results copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#fdfbf7] dark:bg-[#0f172a] border border-[#e0d1b7] dark:border-blue-900/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-[#2c241d] dark:text-slate-100 text-center space-y-5">
        {isVictory ? (
          <div className="space-y-2">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold">Kingdom Preserved!</h2>
            <p className="text-sm text-[#6b5d52] dark:text-slate-400">You successfully led your realm through all 9 events.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Skull className="w-16 h-16 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-bold">Realm Collapsed</h2>
            <p className="text-sm text-rose-500/90 font-medium">{defeatReason || 'Your resources were depleted.'}</p>
          </div>
        )}

        <div className="bg-[#f7f3e9] dark:bg-[#0a0f1d] p-4 rounded-xl border border-[#e0d1b7] dark:border-blue-900/30 space-y-2 text-left">
          <div className="flex justify-between text-sm">
            <span>Rounds Survived:</span>
            <span className="font-semibold">{currentRound} / 9</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining Resources:</span>
            <span className="font-semibold">{currentStats.population + currentStats.food + currentStats.gold}</span>
          </div>
          <div className="border-t border-[#e0d1b7] dark:border-slate-800 my-2 pt-2 flex justify-between font-bold text-base">
            <span>Final Score:</span>
            <span className="text-amber-600 dark:text-amber-400">{totalScore} pts</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share Score
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={restartCurrentGame}
              className="py-2.5 px-4 bg-[#f7f3e9] dark:bg-[#1e293b] hover:bg-[#ede4d3] dark:hover:bg-slate-800 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-[#e0d1b7] dark:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
            <button
              onClick={() => switchMode(mode === 'Hidden' ? 'Visible' : 'Hidden')}
              className="py-2.5 px-4 bg-[#f7f3e9] dark:bg-[#1e293b] hover:bg-[#ede4d3] dark:hover:bg-slate-800 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-[#e0d1b7] dark:border-slate-700"
            >
              {mode === 'Hidden' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {mode === 'Hidden' ? 'Play Visible' : 'Play Hidden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
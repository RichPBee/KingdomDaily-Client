// src/components/ActionCardPool.tsx
import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { type KingdomStats } from '../types/game';
import { calculateNetDelta } from '../core/engine';
import { Users, Wheat, Coins, Sparkles, CheckCircle2 } from 'lucide-react';

export const ActionCardPool: React.FC = () => {
  const { availableActions, turnHistory, currentRound, isGameOver, puzzle, playActionCard } = useGameStore();

  const activeEvent = puzzle?.events[currentRound - 1] || null;
  const allActions = puzzle?.actions || [];
  const playedActionIds = new Set(turnHistory.map((turn) => turn.playedAction.id));

  const renderStatBadges = (stats: Partial<KingdomStats>, isCost = false) => (
    <div className="flex flex-wrap gap-1 text-[11px] font-semibold">
      {stats.population !== undefined && stats.population !== 0 && (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${isCost ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300' : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'}`}>
          <Users className="w-3 h-3" />
          {isCost ? `-${stats.population}` : `+${stats.population}`}
        </span>
      )}
      {stats.food !== undefined && stats.food !== 0 && (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${isCost ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'}`}>
          <Wheat className="w-3 h-3" />
          {isCost ? `-${stats.food}` : `+${stats.food}`}
        </span>
      )}
      {stats.gold !== undefined && stats.gold !== 0 && (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${isCost ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300' : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'}`}>
          <Coins className="w-3 h-3" />
          {isCost ? `-${stats.gold}` : `+${stats.gold}`}
        </span>
      )}
    </div>
  );

  const renderNetDeltaBadges = (delta: KingdomStats) => (
    <div className="flex flex-wrap gap-1 text-[11px] font-bold">
      {delta.population !== 0 && (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${delta.population > 0 ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'}`}>
          <Users className="w-3 h-3" /> {delta.population > 0 ? `+${delta.population}` : delta.population}
        </span>
      )}
      {delta.food !== 0 && (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${delta.food > 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'}`}>
          <Wheat className="w-3 h-3" /> {delta.food > 0 ? `+${delta.food}` : delta.food}
        </span>
      )}
      {delta.gold !== 0 && (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${delta.gold > 0 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'}`}>
          <Coins className="w-3 h-3" /> {delta.gold > 0 ? `+${delta.gold}` : delta.gold}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#2c241d] dark:text-slate-100 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-600" /> Choose Action
        </span>
        <span className="text-[#6b5d52] dark:text-slate-400 font-medium">
          {availableActions.length} / {allActions.length} Left
        </span>
      </div>

      {/* Horizontal Scroll Deck for Mobile / Grid for Desktop */}
      <div className="flex sm:grid sm:grid-cols-3 gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1 scrollbar-none">
        {allActions.map((action) => {
          const isPlayed = playedActionIds.has(action.id);
          const isDisabled = isPlayed || isGameOver;
          const netDelta = activeEvent ? calculateNetDelta(activeEvent, action) : null;

          return (
            <button
              key={action.id}
              disabled={isDisabled}
              onClick={() => playActionCard(action.id)}
              className={`snap-center flex-shrink-0 w-[240px] sm:w-auto p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between gap-2 active:scale-95 ${
                isPlayed
                  ? 'opacity-40 grayscale bg-[#e8e2d5] dark:bg-[#070b14] border-[#d0c1a7] dark:border-slate-900 cursor-not-allowed'
                  : 'bg-[#fdfbf7] dark:bg-[#0f172a] border-[#e0d1b7] dark:border-blue-900/50 shadow-sm hover:border-amber-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`font-bold text-xs truncate ${isPlayed ? 'line-through text-slate-500' : 'text-[#2c241d] dark:text-slate-100'}`}>
                    {action.title}
                  </h4>
                  {isPlayed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                </div>
                <p className="text-[11px] text-[#6b5d52] dark:text-slate-400 line-clamp-2 mt-0.5">
                  {action.description}
                </p>
              </div>

              <div className="pt-1.5 border-t border-[#e0d1b7]/60 dark:border-slate-800 space-y-1">
                {action.cost && renderStatBadges(action.cost, true)}
                {action.benefit && renderStatBadges(action.benefit, false)}

                {netDelta && !isDisabled && (
                  <div className="pt-1 border-t border-dashed border-[#e0d1b7] dark:border-slate-800">
                    <span className="text-[9px] font-bold uppercase text-amber-700 dark:text-amber-400 block mb-0.5">Net Round Impact</span>
                    {renderNetDeltaBadges(netDelta as KingdomStats)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
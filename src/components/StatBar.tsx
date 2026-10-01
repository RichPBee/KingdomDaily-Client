// src/components/StatBar.tsx
import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Users, Wheat, Coins } from 'lucide-react';

export const StatBar: React.FC = () => {
  const { currentStats } = useGameStore();

  return (
    <div className="grid grid-cols-3 gap-2 w-full mb-0.5 pb-2 sm:pb-0 sm:mb-auto">
      {/* Population */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 ${currentStats.population < 10 ? 'animate-pulse border-rose-500' : ''}`}>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Population</span>
        </div>
        <span className="text-base font-extrabold">{currentStats.population}</span>
      </div>

      {/* Food */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-emerald-700 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 ${currentStats.food < 10 ? 'animate-pulse border-rose-500' : ''}`}>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <Wheat className="w-4 h-4" />
          <span className="hidden sm:inline">Food</span>
        </div>
        <span className="text-base font-extrabold">{currentStats.food}</span>
      </div>

      {/* Gold */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-amber-700 dark:text-amber-300 bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 ${currentStats.gold < 10 ? 'animate-pulse border-rose-500' : ''}`}>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <Coins className="w-4 h-4" />
          <span className="hidden sm:inline">Gold</span>
        </div>
        <span className="text-base font-extrabold">{currentStats.gold}</span>
      </div>
    </div>
  );
};
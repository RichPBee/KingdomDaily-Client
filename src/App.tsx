import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { Header } from './components/Header';
import { StatBar } from './components/StatBar';
import { TimelineBoard } from './components/TimelineBoard';
import { ActionCardPool } from './components/ActionCardPool';
import { ResultsModal } from './components/ResultsModal';

export function App() {
  const { loadGame, theme } = useGameStore();

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-200 bg-[#f7f3e9] text-[#2c241d] dark:bg-[#0a0f1d] dark:text-slate-100">
      <Header />
      <main className="max-w-5xl mx-auto p-4 space-y-6">
        <StatBar />
        <TimelineBoard />
        <ActionCardPool />
      </main>
      <ResultsModal />
    </div>
  );
}

export default App;
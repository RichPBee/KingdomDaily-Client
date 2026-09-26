import { useEffect, type JSX } from 'react';
import { Header } from './components/Header';
import { StatBar } from './components/StatBar';
import { TimelineBoard } from './components/TimelineBoard';
import { useGameStore } from './store/useGameStore';

function App(): JSX.Element {
  const loadGame = useGameStore((s) => s.loadGame);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  return (
    <div className="min-h-screen bg-[#f7f3e9] text-[#2c241d] dark:bg-[#0a0f1d] dark:text-slate-100">
      <Header />
      <main className="mx-auto max-w-6xl space-y-4 px-3 py-4 sm:px-4 sm:py-6">
        <StatBar />
        <TimelineBoard />
        <p className="text-sm text-[#6b5d52] dark:text-slate-400">
          Open the menu to switch Hidden / Visible mode, change theme, or browse the date archive.
        </p>
      </main>
    </div>
  );
}

export default App;

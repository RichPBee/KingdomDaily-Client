import { useEffect, type JSX } from 'react';
import { Header } from './components/Header';
import { useGameStore } from './store/useGameStore';

function App(): JSX.Element {
  const loadGame = useGameStore((s) => s.loadGame);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  return (
    <div className="min-h-screen bg-[#f7f3e9] text-[#2c241d] dark:bg-[#0a0f1d] dark:text-slate-100">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-sm text-[#6b5d52] dark:text-slate-400">
          Open the menu to switch Hidden / Visible mode, change theme, or browse the date archive.
        </p>
      </main>
    </div>
  );
}

export default App;

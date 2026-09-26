import { useEffect, type JSX } from 'react';
import {
  CalendarDays,
  Eye,
  EyeOff,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useGameStore } from '../store/useGameStore';
import type { GameMode } from '../types/game';

export interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCalendar: () => void;
}

const COMING_SOON_ITEMS = [
  { id: 'leaderboard', label: '🏆 Leaderboard' },
  { id: 'sandbox', label: '🧪 Sandbox Mode' },
] as const;

export function DrawerMenu({
  isOpen,
  onClose,
  onOpenCalendar,
}: DrawerMenuProps): JSX.Element {
  const mode = useGameStore((s) => s.mode);
  const theme = useGameStore((s) => s.theme);
  const switchMode = useGameStore((s) => s.switchMode);
  const toggleTheme = useGameStore((s) => s.toggleTheme);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleModeChange = (nextMode: GameMode): void => {
    switchMode(nextMode);
    onClose();
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden={!isOpen}>
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        className={cn(
          'pointer-events-auto absolute inset-0 bg-slate-950/50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-label="Close menu"
        onClick={onClose}
      />

      <aside
        id="app-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          'pointer-events-auto absolute inset-y-0 left-0 flex h-full w-[min(20rem,88vw)] flex-col border-r shadow-2xl transition-transform duration-300 ease-out',
          'bg-[#fdfbf7] text-[#2c241d] border-[#e0d1b7]',
          'dark:bg-[#0f172a] dark:text-slate-100 dark:border-blue-900/40',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <header className="flex items-center justify-between border-b border-[#e0d1b7] px-4 py-4 dark:border-blue-900/40">
          <h2 id="drawer-title" className="font-title text-lg font-semibold tracking-wide">
            Menu
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#6b5d52] transition hover:bg-[#e0d1b7]/40 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-4" aria-label="Game options">
          <section aria-labelledby="mode-heading">
            <h3
              id="mode-heading"
              className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6b5d52] dark:text-slate-400"
            >
              Game Mode
            </h3>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Select game mode">
              <button
                type="button"
                onClick={() => handleModeChange('Hidden')}
                aria-pressed={mode === 'Hidden'}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition',
                  mode === 'Hidden'
                    ? 'border-indigo-500 bg-indigo-950/10 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-[#e0d1b7] hover:bg-[#e0d1b7]/30 dark:border-blue-900/40 dark:hover:bg-slate-800'
                )}
              >
                <EyeOff className="h-4 w-4" aria-hidden="true" />
                Hidden
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('Visible')}
                aria-pressed={mode === 'Visible'}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition',
                  mode === 'Visible'
                    ? 'border-indigo-500 bg-indigo-950/10 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-[#e0d1b7] hover:bg-[#e0d1b7]/30 dark:border-blue-900/40 dark:hover:bg-slate-800'
                )}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Visible
              </button>
            </div>
            <p className="mt-2 text-xs text-[#6b5d52] dark:text-slate-400">
              Hidden is the default homepage mode. Switching reloads today&apos;s seed.
            </p>
          </section>

          <section aria-labelledby="theme-heading">
            <h3
              id="theme-heading"
              className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6b5d52] dark:text-slate-400"
            >
              Theme
            </h3>
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                'flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-medium transition',
                'border-[#e0d1b7] hover:bg-[#e0d1b7]/30',
                'dark:border-blue-900/40 dark:hover:bg-slate-800'
              )}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                )}
                {theme === 'dark' ? 'Dark — Royal Slate' : 'Light — Parchment'}
              </span>
              <span className="text-xs text-[#6b5d52] dark:text-slate-400">Toggle</span>
            </button>
          </section>

          <section aria-labelledby="archive-heading">
            <h3
              id="archive-heading"
              className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6b5d52] dark:text-slate-400"
            >
              Date Archive
            </h3>
            <button
              type="button"
              onClick={onOpenCalendar}
              className={cn(
                'flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition',
                'border-[#e0d1b7] hover:bg-[#e0d1b7]/30',
                'dark:border-blue-900/40 dark:hover:bg-slate-800'
              )}
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Play a past daily seed
            </button>
          </section>

          <section aria-labelledby="coming-soon-heading">
            <h3
              id="coming-soon-heading"
              className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6b5d52] dark:text-slate-400"
            >
              More
            </h3>
            <ul className="space-y-2">
              {COMING_SOON_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className={cn(
                        'flex w-full cursor-not-allowed items-center justify-between rounded-xl border px-3 py-2.5 text-sm',
                        'border-[#e0d1b7]/70 bg-[#e0d1b7]/20 text-[#6b5d52]',
                        'dark:border-blue-900/30 dark:bg-slate-900/60 dark:text-slate-500'
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="rounded-full bg-[#e0d1b7]/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b5d52] dark:bg-slate-800 dark:text-slate-400">
                        Coming Soon
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </section>
        </nav>
      </aside>
    </div>
  );
}

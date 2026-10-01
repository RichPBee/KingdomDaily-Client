import { useEffect, useState, type JSX } from 'react';
import { HelpCircle, Menu, Moon, Sun } from 'lucide-react';
import { cn } from '../utils/cn';
import { useGameStore } from '../store/useGameStore';
import { CalendarModal } from './CalendarModal';
import { DrawerMenu } from './DrawerMenu';

export function Header(): JSX.Element {
  const dateStr = useGameStore((s) => s.dateStr);
  const theme = useGameStore((s) => s.theme);
  const toggleTheme = useGameStore((s) => s.toggleTheme);
  const toggleHelp = useGameStore((s) => s.toggleHelp);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen || isCalendarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen, isCalendarOpen]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 border-b',
          'bg-[#fdfbf7] text-[#2c241d] border-[#e0d1b7]',
          'dark:bg-[#0f172a] dark:text-slate-100 dark:border-blue-900/40'
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 sm:h-16 sm:px-4">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-lg p-2 transition hover:bg-[#e0d1b7]/40 dark:hover:bg-slate-800"
            aria-label="Open menu"
            aria-expanded={isDrawerOpen}
            aria-controls="app-drawer"
          >
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="font-title truncate text-lg font-semibold tracking-[0.18em] sm:text-xl">
            Kingdom Daily
          </h1>

          <div className="flex items-center gap-2">
          <button
          onClick={() => toggleHelp()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e0d1b7] dark:border-slate-700 bg-[#f7f3e9] dark:bg-slate-900 hover:border-amber-600 text-xs font-semibold transition active:scale-95"
          aria-label="How to play tutorial"
          >
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Guide</span>
          </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg p-2 transition hover:bg-[#e0d1b7]/40 dark:hover:bg-slate-800"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <span
              className={cn(
                'inline-flex rounded-full border px-2 py-1 font-mono text-[11px] sm:px-2.5 sm:text-xs',
                'border-[#e0d1b7] bg-[#fdfbf7] text-[#2c241d]',
                'dark:border-blue-900/40 dark:bg-[#0f172a] dark:text-slate-100'
              )}
              aria-label={`Active puzzle date ${dateStr}`}
            >
              {dateStr}
            </span>
          </div>
        </div>
      </header>

      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenCalendar={() => {
          setIsDrawerOpen(false);
          setIsCalendarOpen(true);
        }}
      />

      <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
    </>
  );
}

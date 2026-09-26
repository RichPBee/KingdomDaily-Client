import { useEffect, useMemo, useState, type JSX } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  subDays,
  subMonths,
} from 'date-fns';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { getLocalHistory, useGameStore } from '../store/useGameStore';
import type { GameMode, LocalGameRecord } from '../types/game';

export interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function toDateStr(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function recordsForDate(
  history: Record<string, LocalGameRecord>,
  dateStr: string,
  mode: GameMode
): LocalGameRecord | undefined {
  return history[`${dateStr}_${mode}`];
}

export function CalendarModal({ isOpen, onClose }: CalendarModalProps): JSX.Element | null {
  const dateStr = useGameStore((s) => s.dateStr);
  const mode = useGameStore((s) => s.mode);
  const loadGame = useGameStore((s) => s.loadGame);

  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState<Date>(() => parseISO(dateStr));
  const [history, setHistory] = useState<Record<string, LocalGameRecord>>({});

  useEffect(() => {
    if (!isOpen) return;
    setHistory(getLocalHistory());
    setViewMonth(parseISO(dateStr));
  }, [isOpen, dateStr]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const monthStart = startOfMonth(viewMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const yesterday = subDays(today, 1);
  const todayStr = toDateStr(today);
  const yesterdayStr = toDateStr(yesterday);

  const selectDate = (date: Date): void => {
    loadGame(toDateStr(date), mode);
    onClose();
  };

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 transition-opacity duration-300"
        aria-label="Close calendar"
        onClick={onClose}
      />

      <section
        className={cn(
          'relative z-10 w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl',
          'bg-[#fdfbf7] text-[#2c241d] border-[#e0d1b7]',
          'dark:bg-[#0f172a] dark:text-slate-100 dark:border-blue-900/40'
        )}
      >
        <header className="flex items-center justify-between border-b border-[#e0d1b7] px-4 py-3 dark:border-blue-900/40">
          <h2 id="calendar-modal-title" className="font-title text-lg font-semibold tracking-wide">
            Date Archive
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#6b5d52] transition hover:bg-[#e0d1b7]/40 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close date archive"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => selectDate(today)}
              className={cn(
                'rounded-xl border px-3 py-2 text-sm font-medium transition',
                dateStr === todayStr
                  ? 'border-indigo-500 bg-indigo-950/10 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                  : 'border-[#e0d1b7] hover:bg-[#e0d1b7]/30 dark:border-blue-900/40 dark:hover:bg-slate-800'
              )}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => selectDate(yesterday)}
              className={cn(
                'rounded-xl border px-3 py-2 text-sm font-medium transition',
                dateStr === yesterdayStr
                  ? 'border-indigo-500 bg-indigo-950/10 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                  : 'border-[#e0d1b7] hover:bg-[#e0d1b7]/30 dark:border-blue-900/40 dark:hover:bg-slate-800'
              )}
            >
              Yesterday
            </button>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6b5d52] dark:text-slate-400">
              Custom date
            </span>
            <input
              type="date"
              value={dateStr}
              onChange={(event) => {
                if (!event.target.value) return;
                loadGame(event.target.value, mode);
                onClose();
              }}
              className={cn(
                'w-full rounded-xl border px-3 py-2 text-sm outline-none',
                'bg-[#fdfbf7] border-[#e0d1b7] text-[#2c241d]',
                'dark:bg-[#0f172a] dark:text-slate-100 dark:border-blue-900/40',
                'focus:ring-2 focus:ring-indigo-400/60'
              )}
              aria-label="Select a custom puzzle date"
            />
          </label>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMonth((prev) => subMonths(prev, 1))}
              className="rounded-lg p-2 hover:bg-[#e0d1b7]/40 dark:hover:bg-slate-800"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="font-title text-sm tracking-wide">{format(viewMonth, 'MMMM yyyy')}</p>
            <button
              type="button"
              onClick={() => setViewMonth((prev) => addMonths(prev, 1))}
              className="rounded-lg p-2 hover:bg-[#e0d1b7]/40 dark:hover:bg-slate-800"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-[#6b5d52] dark:text-slate-400">
            {weekdayLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayStr = toDateStr(day);
              const record = recordsForDate(history, dayStr, mode);
              const isSelected = dayStr === dateStr;
              const inMonth = isSameMonth(day, viewMonth);

              return (
                <button
                  key={dayStr}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={cn(
                    'relative flex h-10 flex-col items-center justify-center rounded-lg text-sm transition',
                    inMonth ? 'opacity-100' : 'opacity-40',
                    isSelected
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                      : 'hover:bg-[#e0d1b7]/50 dark:hover:bg-slate-800',
                    isSameDay(day, today) && !isSelected && 'ring-1 ring-indigo-400/70'
                  )}
                  aria-label={`Play ${dayStr}${record ? `, score ${record.score}` : ''}`}
                  aria-current={isSelected ? 'date' : undefined}
                >
                  <span>{format(day, 'd')}</span>
                  {record ? (
                    <span
                      className={cn(
                        'absolute bottom-0.5 flex items-center gap-0.5 text-[9px] leading-none',
                        isSelected ? 'text-white' : record.isVictory ? 'text-emerald-500' : 'text-amber-500'
                      )}
                    >
                      {record.isVictory ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
                      {record.score}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[#6b5d52] dark:text-slate-400">
            Green checkmarks mark victories in {mode} mode. Scores appear for completed days.
          </p>
        </div>
      </section>
    </div>
  );
}

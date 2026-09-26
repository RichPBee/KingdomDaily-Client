import { useEffect, useRef, useState, type JSX } from 'react';
import { Coins, Users, Wheat, type LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import { useGameStore } from '../store/useGameStore';
import type { ResourceType } from '../types/game';

const LOW_RESOURCE_THRESHOLD = 10;

interface ResourceCardConfig {
  key: ResourceType;
  label: string;
  emoji: string;
  icon: LucideIcon;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

const RESOURCE_CARDS: ResourceCardConfig[] = [
  {
    key: 'population',
    label: 'Population',
    emoji: '👥',
    icon: Users,
    textClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-50/80 dark:bg-indigo-950/40',
    borderClass: 'border-indigo-200 dark:border-indigo-500/30',
  },
  {
    key: 'food',
    label: 'Food',
    emoji: '🌾',
    icon: Wheat,
    textClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50/80 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-500/30',
  },
  {
    key: 'gold',
    label: 'Gold',
    emoji: '💰',
    icon: Coins,
    textClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50/80 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-500/30',
  },
];

function useAnimatedNumber(target: number, durationMs = 450): number {
  const [displayed, setDisplayed] = useState(target);
  const displayedRef = useRef(displayed);
  displayedRef.current = displayed;

  useEffect(() => {
    const from = displayedRef.current;
    if (from === target) return;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number): void => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayed(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, target]);

  return displayed;
}

function ResourceStatCard({
  config,
  value,
}: {
  config: ResourceCardConfig;
  value: number;
}): JSX.Element {
  const Icon = config.icon;
  const displayed = useAnimatedNumber(value);
  const previousValueRef = useRef<number | null>(null);
  const [delta, setDelta] = useState<number | null>(null);
  const isLow = value < LOW_RESOURCE_THRESHOLD;

  useEffect(() => {
    const previous = previousValueRef.current;
    previousValueRef.current = value;

    if (previous === null || previous === value) return;

    setDelta(value - previous);
    const timeoutId = window.setTimeout(() => setDelta(null), 1400);
    return () => window.clearTimeout(timeoutId);
  }, [value]);

  return (
    <article
      className={cn(
        'relative flex min-w-0 flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-shadow duration-300 sm:gap-1.5 sm:px-3 sm:py-3',
        config.bgClass,
        config.borderClass,
        isLow && 'animate-pulse border-red-500 text-red-600 shadow-[0_0_0_1px_rgba(239,68,68,0.7)] dark:border-red-500 dark:text-red-400'
      )}
      aria-label={`${config.label} ${value}${isLow ? ', critically low' : ''}`}
    >
      <div className={cn('flex items-center gap-1 sm:gap-1.5', isLow ? 'text-red-600 dark:text-red-400' : config.textClass)}>
        <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
        <span className="truncate text-[10px] font-semibold uppercase tracking-wider sm:text-xs">
          <span aria-hidden="true">{config.emoji} </span>
          {config.label}
        </span>
      </div>

      <p
        className={cn(
          'font-title text-xl font-semibold tabular-nums leading-none transition-transform duration-300 sm:text-3xl',
          isLow ? 'text-red-600 dark:text-red-400' : config.textClass,
          delta !== null && 'scale-110'
        )}
      >
        {displayed}
      </p>

      {delta !== null ? (
        <span
          className={cn(
            'absolute right-1 top-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums sm:right-2 sm:top-2',
            delta > 0
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/15 text-red-600 dark:text-red-400'
          )}
          aria-live="polite"
        >
          {delta > 0 ? `+${delta}` : delta}
        </span>
      ) : null}

      {isLow ? (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Low
        </span>
      ) : (
        <span className="h-3.5" aria-hidden="true" />
      )}
    </article>
  );
}

export function StatBar(): JSX.Element {
  const currentStats = useGameStore((s) => s.currentStats);

  return (
    <section
      aria-label="Kingdom resources"
      className={cn(
        'rounded-2xl border p-2 sm:p-3',
        'bg-[#fdfbf7] border-[#e0d1b7] text-[#2c241d]',
        'dark:bg-[#0f172a] dark:border-blue-900/40 dark:text-slate-100'
      )}
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {RESOURCE_CARDS.map((config) => (
          <ResourceStatCard key={config.key} config={config} value={currentStats[config.key]} />
        ))}
      </div>
    </section>
  );
}

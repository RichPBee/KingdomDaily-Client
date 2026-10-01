import { type JSX } from 'react';
import {
  AlertTriangle,
  Anchor,
  Bug,
  Check,
  Coins,
  Crown,
  Flame,
  Gift,
  HelpCircle,
  Lock,
  Scroll,
  Skull,
  Sprout,
  Sun,
  Swords,
  TrendingDown,
  UserPlus,
  Users,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useGameStore } from '../store/useGameStore';
import { calculateNetDelta } from '../core/engine';
import type {
  ResourceDelta,
  ResourceType,
  ResolvedEvent,
  TurnHistoryItem,
} from '../types/game';

const RESOURCE_LABELS: Record<ResourceType, string> = {
  population: 'Population',
  food: 'Food',
  gold: 'Gold',
};

const RESOURCE_TEXT: Record<ResourceType, string> = {
  population: 'text-indigo-600 dark:text-indigo-400',
  food: 'text-emerald-600 dark:text-emerald-400',
  gold: 'text-amber-600 dark:text-amber-400',
};

const CATEGORY_FALLBACK: Record<ResourceType, LucideIcon> = {
  population: Users,
  food: Wheat,
  gold: Coins,
};

const LUCIDE_BY_NAME: Record<string, LucideIcon> = {
  AlertTriangle,
  Anchor,
  Bug,
  Coins,
  Crown,
  Flame,
  Gift,
  Scroll,
  Skull,
  Sprout,
  Sun,
  Swords,
  TrendingDown,
  UserPlus,
  Users,
  Wheat,
};

type RoundStatus = 'completed' | 'active' | 'future';

function resolveEventIcon(iconName: string, category: ResourceType): LucideIcon {
  return LUCIDE_BY_NAME[iconName] ?? CATEGORY_FALLBACK[category] ?? HelpCircle;
}

function formatImpact(resource: ResourceType, amount: number): string {
  const signed = amount > 0 ? `+${amount}` : `${amount}`;
  return `${signed} ${RESOURCE_LABELS[resource]}`;
}

function impactEntries(delta: ResourceDelta): Array<{ resource: ResourceType; amount: number }> {
  return (Object.keys(RESOURCE_LABELS) as ResourceType[])
    .map((resource) => ({ resource, amount: delta[resource] ?? 0 }))
    .filter((entry) => entry.amount !== 0);
}

function roundStatus(
  round: number,
  currentRound: number,
  history: TurnHistoryItem[]
): RoundStatus {
  if (history.some((item) => item.round === round)) return 'completed';
  if (round === currentRound) return 'active';
  return round < currentRound ? 'completed' : 'future';
}

function ImpactList({ delta }: { delta: ResourceDelta }): JSX.Element | null {
  const entries = impactEntries(delta);
  if (entries.length === 0) {
    return <p className="text-xs text-[#6b5d52] dark:text-slate-400">No resource change</p>;
  }

  return (
    <ul className="flex flex-wrap gap-1">
      {entries.map(({ resource, amount }) => (
        <li
          key={resource}
          className={cn(
            'rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums',
            amount > 0
              ? 'border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400'
              : 'border-red-200 bg-red-50/80 text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-400'
          )}
        >
          {formatImpact(resource, amount)}
        </li>
      ))}
    </ul>
  );
}

function EventCard({
  round,
  event,
  status,
  isMasked,
  historyItem,
}: {
  round: number;
  event: ResolvedEvent;
  status: RoundStatus;
  isMasked: boolean;
  historyItem?: TurnHistoryItem;
}): JSX.Element {
  const Icon = resolveEventIcon(event.icon, event.category);
  const netDelta = historyItem
    ? calculateNetDelta(historyItem.event, historyItem.playedAction)
    : null;

  return (
    <article
      className={cn(
        'relative flex min-h-[1.5rem] sm:min-h-[13.5rem] w-full flex-col gap-2 overflow-hidden rounded-2xl border p-3 transition',
        'bg-[#fdfbf7] border-[#e0d1b7] text-[#2c241d]',
        'dark:bg-[#0f172a] dark:border-blue-900/40 dark:text-slate-100',
        status === 'active' && 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#f7f3e9] dark:ring-indigo-400 dark:ring-offset-[#0a0f1d]',
        status === 'completed' && 'opacity-95'
      )}
      aria-current={status === 'active' ? 'step' : undefined}
      aria-label={
        isMasked
          ? `Round ${round}, Hidden Event`
          : `Round ${round}, ${event.title}, ${status}`
      }
    >
      <header className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6b5d52] dark:text-slate-400">
          Round {round} of 9
        </span>
        {status === 'completed' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            <Check className="h-3 w-3" aria-hidden="true" />
            Completed
          </span>
        ) : null}
        {status === 'active' ? (
          <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            Active
          </span>
        ) : null}
      </header>

      {isMasked ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-[#6b5d52] dark:text-slate-400">
          <Lock className="h-8 w-8" aria-hidden="true" />
          <p className="font-title text-sm tracking-wide">Hidden Event</p>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-2">
            <span
              className={cn(
                'mt-0.5 rounded-lg border p-1.5',
                RESOURCE_TEXT[event.category],
                'border-[#e0d1b7] dark:border-blue-900/40'
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="font-title text-sm font-semibold leading-snug">{event.title}</h3>
              <p className="mt-1 line-clamp-3 text-xs text-[#6b5d52] dark:text-slate-400 hidden sm:block">
                {event.description}
              </p>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b5d52] dark:text-slate-400">
              Event impact
            </p>
            <ImpactList delta={event.impact} />

            {historyItem && netDelta ? (
              <div className="rounded-xl border border-[#e0d1b7]/80 bg-[#e0d1b7]/20 p-2 dark:border-blue-900/30 dark:bg-slate-900/50">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b5d52] dark:text-slate-400">
                  Played action
                </p>
                <p className="mt-0.5 text-xs font-medium">{historyItem.playedAction.title}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#6b5d52] dark:text-slate-400">
                  Net change
                </p>
                <div className="mt-1">
                  <ImpactList delta={netDelta} />
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </article>
  );
}

export function TimelineBoard(): JSX.Element {
  const puzzle = useGameStore((s) => s.puzzle);
  const currentRound = useGameStore((s) => s.currentRound);
  const mode = useGameStore((s) => s.mode);
  const turnHistory = useGameStore((s) => s.turnHistory);

  if (!puzzle) {
    return (
      <section
        aria-label="Daily events"
        className={cn(
          'rounded-2xl border p-4 text-sm',
          'bg-[#fdfbf7] border-[#e0d1b7] text-[#6b5d52]',
          'dark:bg-[#0f172a] dark:border-blue-900/40 dark:text-slate-400'
        )}
      >
        Loading daily events…
      </section>
    );
  }

  // Ensure current display round is clamped within valid 1-9 bounds
  const activeRoundIndex = Math.min(Math.max(currentRound, 1), puzzle.events.length);

  return (
    <section aria-label="Daily event timeline">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="font-title text-sm font-semibold tracking-wide sm:text-base">
          Events
        </h2>
        <p className="text-xs text-[#6b5d52] dark:text-slate-400">
          {mode} mode · Round {currentRound} of 9
        </p>
      </div>

      {/* Grid container: shows only current active event on mobile, and full 9-grid on md+ */}
      <div className="md:grid md:grid-cols-3 md:gap-3" role="list">
        {puzzle.events.map((event, index) => {
          const round = index + 1;
          const status = roundStatus(round, currentRound, turnHistory);
          const isMasked = mode === 'Hidden' && status === 'future';
          const historyItem = turnHistory.find((item) => item.round === round);
          const isCurrentMobileRound = round === activeRoundIndex;

          return (
            <div
              key={event.id}
              role="listitem"
              className={cn(
                !isCurrentMobileRound && 'hidden md:block'
              )}
            >
              <EventCard
                round={round}
                event={event}
                status={status}
                isMasked={isMasked}
                historyItem={historyItem}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
import React, { useState, useEffect } from 'react';
import {
  Users,
  Wheat,
  Coins,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

const LOCAL_STORAGE_KEY = 'kingdom_onboarding_completed';

interface OnboardingModalProps {
  /** Optional override to manually trigger or control modal visibility */
  isOpenOverride?: boolean;
  /** Optional callback when modal closes */
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpenOverride,
  onClose,
}) => {
  const storeIsOpen = useGameStore((s) => s.isHelpOpen);
  const toggleHelp = useGameStore((s) => s.toggleHelp);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Determine effective open state based on optional prop override vs Zustand store
  const isOpen = isOpenOverride !== undefined ? isOpenOverride : storeIsOpen;

  // 1. First-time auto-open check (runs ONCE on initial mount)
  useEffect(() => {
    if (isOpenOverride !== undefined) return;

    const hasSeenOnboarding = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!hasSeenOnboarding) {
      toggleHelp(true);
    }
  }, [isOpenOverride, toggleHelp]);

  // 2. Reset wizard to page 1 whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);

  const handleComplete = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    if (isOpenOverride !== undefined) {
      if (onClose) onClose();
    } else {
      toggleHelp(false);
      if (onClose) onClose();
    }
  };

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#e0d1b7] dark:border-blue-900/50 bg-[#fdfbf7] dark:bg-[#0f172a] text-[#2c241d] dark:text-slate-100 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-[#e0d1b7]/60 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="font-title text-base font-bold tracking-wide">
              How to Play Kingdom
            </h2>
          </div>
          <button
            onClick={handleComplete}
            className="p-1 rounded-lg hover:bg-[#e0d1b7]/40 dark:hover:bg-slate-800 text-[#6b5d52] dark:text-slate-400 transition"
            aria-label="Close tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body / Steps */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {currentPage === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Step 1: Your Resources & Flow
                </h3>
                <p className="text-xs text-[#6b5d52] dark:text-slate-300 leading-relaxed">
                  Every turn an event threatens your realm. You must play an action card to manage resources and survive 9 rounds.
                </p>
              </div>

              {/* Resource Badges Explanation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/40 dark:bg-indigo-950/30 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-700 dark:text-indigo-400">
                    <Users className="w-4 h-4" /> Population
                  </div>
                  <p className="text-[11px] text-[#6b5d52] dark:text-slate-400 leading-tight">
                    Your subject headcount. Reaching 0 results in instant game over.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/30 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700 dark:text-emerald-400">
                    <Wheat className="w-4 h-4" /> Food
                  </div>
                  <p className="text-[11px] text-[#6b5d52] dark:text-slate-400 leading-tight">
                    Grain to feed subjects. Reaching 0 causes starvation & defeat.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/30 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-700 dark:text-amber-400">
                    <Coins className="w-4 h-4" /> Gold
                  </div>
                  <p className="text-[11px] text-[#6b5d52] dark:text-slate-400 leading-tight">
                    Treasury reserves needed to fund actions and kingdom defense.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#e0d1b7] bg-[#f7f3e9]/60 dark:border-slate-800 dark:bg-slate-900/50 text-xs text-[#6b5d52] dark:text-slate-300">
                <span className="font-bold text-[#2c241d] dark:text-slate-100">Round Grading:</span> Net resource gains earn <strong className="text-emerald-600 dark:text-emerald-400">Green (+50 pts)</strong>, minor losses earn <strong className="text-amber-600 dark:text-amber-400">Yellow (+20 pts)</strong>, and heavy losses earn <strong className="text-rose-600 dark:text-rose-400">Red (+5 pts)</strong>.
              </div>
            </div>
          )}

          {currentPage === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Step 2: Understanding Events
                </h3>
                <p className="text-xs text-[#6b5d52] dark:text-slate-300 leading-relaxed">
                  Each round presents an event. Below is an unmitigated event that will strike your kingdom unless countered.
                </p>
              </div>

              {/* Event Card Sample */}
              <div className="p-3.5 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Round 1 Active Event
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
                    Threat
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#2c241d] dark:text-slate-100">
                    Bandit Raid on Granary
                  </h4>
                  <p className="text-xs text-[#6b5d52] dark:text-slate-400 mt-0.5">
                    Raging bandits pillage local farms and rob imperial transports.
                  </p>
                </div>
                <div className="pt-2 border-t border-rose-200 dark:border-rose-900/40">
                  <span className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 block mb-1">
                    Unmitigated Impact
                  </span>
                  <div className="flex gap-1.5 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                      <Wheat className="w-3 h-3" /> -10 Food
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                      <Coins className="w-3 h-3" /> -10 Gold
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#6b5d52] dark:text-slate-400 italic">
                Leaving this event unmitigated directly strips 10 Food and 10 Gold from your kingdom stores.
                Events can have both positive and negative impacts.
              </p>
            </div>
          )}

          {currentPage === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Step 3: Action Cards & Impact
                </h3>
                <p className="text-xs text-[#6b5d52] dark:text-slate-300 leading-relaxed">
                  Select 1 action card per turn from your deck of 9. Each card can only be played once per game.
                </p>
              </div>

              {/* Action Card Sample */}
              <div className="p-3 rounded-xl border border-amber-500/40 bg-[#fdfbf7] dark:bg-[#0f172a] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#2c241d] dark:text-slate-100">
                    Dispatch Garrison
                  </h4>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Available Card
                  </span>
                </div>
                <div className="text-[11px] space-y-1 text-[#6b5d52] dark:text-slate-400">
                  <p>Cost / Benefit breakdown for this action:</p>
                  <div className="flex gap-1.5 font-semibold text-[10px]">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      <Coins className="w-3 h-3" /> -5 Gold
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <Wheat className="w-3 h-3" /> +10 Food
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-[#e0d1b7] dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
                      Net Round Impact (Event + Action)
                    </span>
                  </div>
                  <div className="flex gap-1.5 font-bold text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <Wheat className="w-3 h-3" /> 0 Food
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      <Coins className="w-3 h-3" /> -15 Gold
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                <ArrowRight className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  The <strong>Impact</strong> row calculates the combined end result of the active event and your selected card so you can plan ahead!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <footer className="flex items-center justify-between p-4 border-t border-[#e0d1b7]/60 dark:border-slate-800 bg-[#f7f3e9]/40 dark:bg-slate-900/40 shrink-0">
          {/* Page indicator dots */}
          <div className="flex gap-1.5">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentPage(step)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentPage === step
                    ? 'bg-amber-600 dark:bg-amber-400'
                    : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                aria-label={`Go to page ${step}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#e0d1b7] dark:border-slate-700 hover:bg-[#e0d1b7]/30 dark:hover:bg-slate-800 text-xs font-semibold text-[#2c241d] dark:text-slate-200 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition active:scale-95"
            >
              {currentPage === 3 ? (
                <>
                  Start Playing <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
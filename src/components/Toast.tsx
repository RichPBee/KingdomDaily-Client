// src/components/Toast.tsx
import React, { useEffect } from 'react';
import { CheckCircle2} from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onClose = () => {},
  duration = 3000,
}) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[#e0d1b7] dark:border-amber-900/50 bg-[#fdfbf7] dark:bg-[#0f172a] text-[#2c241d] dark:text-slate-100 shadow-xl shadow-amber-950/10 dark:shadow-black/40 animate-fade-in transition-all">
      <div className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <span className="text-xs font-semibold tracking-wide">{message}</span>
    </div>
  );
};
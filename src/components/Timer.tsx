import { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useExamStore } from '@/store/examStore';
import { cn } from '@/lib/utils';

export function Timer() {
  const { examTimeRemaining, updateTimeRemaining, isExamFinished } = useExamStore();

  useEffect(() => {
    if (examTimeRemaining === null || isExamFinished) return;

    const interval = setInterval(() => {
      updateTimeRemaining(examTimeRemaining - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [examTimeRemaining, isExamFinished, updateTimeRemaining]);

  if (examTimeRemaining === null) return null;

  const minutes = Math.floor(examTimeRemaining / 60);
  const seconds = examTimeRemaining % 60;
  const isLowTime = examTimeRemaining < 300; // less than 5 minutes
  const isCritical = examTimeRemaining < 60; // less than 1 minute

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold',
      isCritical ? 'bg-destructive text-destructive-foreground animate-pulse' :
      isLowTime ? 'bg-warning text-warning-foreground' :
      'bg-muted text-foreground'
    )}>
      <Clock className="w-5 h-5" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

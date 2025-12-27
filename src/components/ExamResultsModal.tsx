import { useEffect } from 'react';
import { X, Trophy, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExamStore } from '@/store/examStore';
import { cn } from '@/lib/utils';

export function ExamResultsModal() {
  const { 
    showExamResults, 
    closeExamResults, 
    getStats,
    examConfig,
    examTimeRemaining
  } = useExamStore();

  useEffect(() => {
    if (showExamResults) {
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showExamResults]);

  if (!showExamResults) return null;

  const stats = getStats();
  const timeExpired = examTimeRemaining === 0;
  const passed = stats.percentage >= 50; // Assuming 50% is passing grade

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl max-h-[90vh] overflow-auto bg-card rounded-2xl shadow-2xl border animate-scale-in">
        {/* Header */}
        <div className={cn(
          'p-6 border-b',
          passed ? 'bg-success/10' : 'bg-destructive/10'
        )}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                'p-3 rounded-xl',
                passed ? 'bg-success/20' : 'bg-destructive/20'
              )}>
                {passed ? (
                  <Trophy className="w-8 h-8 text-success" />
                ) : (
                  <XCircle className="w-8 h-8 text-destructive" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {timeExpired ? '¡Tiempo agotado!' : '¡Examen finalizado!'}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {passed ? '¡Felicitaciones! Has aprobado' : 'No has alcanzado la nota mínima'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeExamResults}
              className="rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-6">
          {/* Score Card */}
          <div className="text-center p-8 bg-muted rounded-xl">
            <div className={cn(
              'text-6xl font-bold mb-2',
              passed ? 'text-success' : 'text-destructive'
            )}>
              {stats.percentage}%
            </div>
            <p className="text-lg text-muted-foreground">Calificación final</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={<FileText className="w-5 h-5" />}
              label="Total de preguntas"
              value={stats.total}
              color="bg-muted"
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              label="Respondidas"
              value={stats.answered}
              color="bg-blue-500/10"
              textColor="text-blue-500"
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              label="Correctas"
              value={stats.correct}
              color="bg-success/10"
              textColor="text-success"
            />
            <StatCard
              icon={<XCircle className="w-5 h-5" />}
              label="Incorrectas"
              value={stats.incorrect}
              color="bg-destructive/10"
              textColor="text-destructive"
            />
          </div>

          {/* Time Info */}
          {timeExpired && (
            <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-xl">
              <Clock className="w-5 h-5 text-warning" />
              <p className="text-sm text-warning">
                El tiempo límite de {examConfig.timeLimit} minutos se agotó
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Ahora puedes revisar tus respuestas. Los recuadros verdes indican respuestas correctas y los rojos incorrectas.
            </p>
            <Button
              onClick={closeExamResults}
              className="w-full"
              size="lg"
            >
              Ver Respuestas
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
  textColor?: string;
}

function StatCard({ icon, label, value, color = 'bg-muted', textColor = 'text-foreground' }: StatCardProps) {
  return (
    <div className={cn('p-4 rounded-xl', color)}>
      <div className="flex items-center gap-2 mb-2">
        <div className={textColor}>{icon}</div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className={cn('text-3xl font-bold', textColor)}>{value}</div>
    </div>
  );
}

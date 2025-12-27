import { useState } from 'react';
import { useExamStore } from '@/store/examStore';
import { CheckCircle2, XCircle, Circle, Percent, Flag, RotateCcw, ListChecks, PlayCircle } from 'lucide-react';
import { Timer } from '@/components/Timer';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export function StatsBar() {
  const stats = useExamStore((state) => state.getStats());
  const mode = useExamStore((state) => state.mode);
  const isExamFinished = useExamStore((state) => state.isExamFinished);
  const isExamStarted = useExamStore((state) => state.isExamStarted);
  const finishExam = useExamStore((state) => state.finishExam);
  const restartExam = useExamStore((state) => state.restartExam);
  
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  
  const handleFinish = () => {
    setShowFinishConfirm(true);
  };
  
  const handleRestart = () => {
    setShowRestartConfirm(true);
  };
  
  // In exam mode (before finished), show different stats
  const isExamInProgress = mode === 'exam' && isExamStarted && !isExamFinished;
  const progressPercentage = stats.total > 0 ? Math.round((stats.answered / stats.total) * 100) : 0;
  
  const handleNewTest = () => {
    restartExam();
  };
  
  return (
    <>
      <div className="w-full bg-card rounded-2xl border p-4 sm:p-6 space-y-4">
        {/* Timer and Action Buttons for Exam Mode - In Progress */}
        {mode === 'exam' && isExamStarted && !isExamFinished && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b">
            <Timer />
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="gap-2 flex-1 sm:flex-initial"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar
              </Button>
              <Button
                onClick={handleFinish}
                variant="default"
                className="gap-2 flex-1 sm:flex-initial"
              >
                <Flag className="w-4 h-4" />
                Terminar
              </Button>
            </div>
          </div>
        )}
        
        {/* New Test Button for Finished Exam */}
        {mode === 'exam' && isExamFinished && (
          <div className="flex justify-center pb-4 border-b">
            <Button
              onClick={handleNewTest}
              variant="default"
              className="gap-2"
              size="lg"
            >
              <PlayCircle className="w-5 h-5" />
              Iniciar Nuevo Test
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {isExamInProgress ? (
            // Stats for exam in progress
            <>
              <StatItem
                icon={<ListChecks className="w-5 h-5 text-primary" />}
                label="Respondidas"
                value={stats.answered}
                color="text-primary"
              />
              <StatItem
                icon={<Circle className="w-5 h-5 text-muted-foreground" />}
                label="Sin responder"
                value={stats.unanswered}
                color="text-muted-foreground"
              />
              <StatItem
                icon={<Percent className="w-5 h-5 text-primary" />}
                label="Avance"
                value={`${progressPercentage}%`}
                color="text-primary"
              />
              <StatItem
                icon={<ListChecks className="w-5 h-5 text-foreground" />}
                label="Total"
                value={stats.total}
                color="text-foreground"
              />
            </>
          ) : (
            // Stats for practice mode or finished exam
            <>
              <StatItem
                icon={<CheckCircle2 className="w-5 h-5 text-success" />}
                label="Correctas"
                value={stats.correct}
                color="text-success"
              />
              <StatItem
                icon={<XCircle className="w-5 h-5 text-destructive" />}
                label="Incorrectas"
                value={stats.incorrect}
                color="text-destructive"
              />
              <StatItem
                icon={<Circle className="w-5 h-5 text-muted-foreground" />}
                label="Sin responder"
                value={stats.unanswered}
                color="text-muted-foreground"
              />
              <StatItem
                icon={<Percent className="w-5 h-5 text-primary" />}
                label="Porcentaje"
                value={`${stats.percentage}%`}
                color="text-primary"
              />
            </>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          {isExamInProgress ? (
            // Progress bar for exam in progress (answered vs unanswered)
            <div className="h-full flex">
              <div 
                className="bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          ) : (
            // Progress bar for practice/finished (correct vs incorrect)
            <div className="h-full flex">
              <div 
                className="bg-success transition-all duration-500 ease-out"
                style={{ width: `${(stats.correct / stats.total) * 100}%` }}
              />
              <div 
                className="bg-destructive transition-all duration-500 ease-out"
                style={{ width: `${(stats.incorrect / stats.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showFinishConfirm}
        onClose={() => setShowFinishConfirm(false)}
        onConfirm={finishExam}
        title="¿Terminar el examen?"
        description="¿Estás seguro de que deseas enviar tus respuestas y finalizar el examen? Esta acción no se puede deshacer."
        confirmText="Sí, terminar"
        cancelText="Cancelar"
        variant="default"
      />
      
      <ConfirmDialog
        isOpen={showRestartConfirm}
        onClose={() => setShowRestartConfirm(false)}
        onConfirm={restartExam}
        title="¿Reiniciar el examen?"
        description="Se perderán todas tus respuestas actuales y se generará un nuevo conjunto de preguntas. ¿Deseas continuar?"
        confirmText="Sí, reiniciar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}

function StatItem({ icon, label, value, color }: StatItemProps) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

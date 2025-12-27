import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useExamStore } from '@/store/examStore';
import { Clock, ListOrdered, PlayCircle } from 'lucide-react';

export function ExamConfigModal() {
  const { examConfig, setExamConfig, startExam } = useExamStore();
  const [questionCount, setQuestionCount] = useState<string>(String(examConfig.questionCount));
  const [timeLimit, setTimeLimit] = useState<string>(String(examConfig.timeLimit));
  const [error, setError] = useState<string>('');
  
  const handleStart = () => {
    const questions = parseInt(questionCount);
    const time = parseInt(timeLimit);
    
    // Validate
    if (isNaN(questions) || questions < 10 || questions > 270) {
      setError('La cantidad de preguntas debe estar entre 10 y 270');
      return;
    }
    
    if (isNaN(time) || time < 5 || time > 300) {
      setError('El tiempo límite debe estar entre 5 y 300 minutos');
      return;
    }
    
    setError('');
    setExamConfig({ questionCount: questions, timeLimit: time });
    startExam();
  };
  
  const questionsNum = parseInt(questionCount) || 0;
  const timeNum = parseInt(timeLimit) || 0;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
          <PlayCircle className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">Configurar Examen</h2>
        <p className="text-muted-foreground max-w-md">
          Personaliza tu examen de práctica seleccionando la cantidad de preguntas y el tiempo límite
        </p>
      </div>
      
      {/* Configuration Form */}
      <div className="w-full max-w-md space-y-6 bg-card border rounded-2xl p-6 shadow-lg">
        {/* Question Count */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <ListOrdered className="w-4 h-4 text-primary" />
            Cantidad de preguntas
          </label>
          <input
            type="number"
            min="10"
            max="270"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            className="w-full px-4 py-3 bg-background border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-lg font-semibold"
          />
          <p className="text-xs text-muted-foreground">
            Mínimo: 10 | Máximo: 270
          </p>
        </div>
        
        {/* Time Limit */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Clock className="w-4 h-4 text-primary" />
            Tiempo límite (minutos)
          </label>
          <input
            type="number"
            min="5"
            max="300"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="w-full px-4 py-3 bg-background border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-lg font-semibold"
          />
          <p className="text-xs text-muted-foreground">
            Mínimo: 5 | Máximo: 300
          </p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}
        
        {/* Preview */}
        <div className="p-4 bg-muted rounded-xl space-y-2">
          <p className="text-sm font-medium">Resumen:</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Preguntas</p>
              <p className="text-xl font-bold text-primary">{questionsNum > 0 ? questionsNum : '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tiempo</p>
              <p className="text-xl font-bold text-primary">{timeNum > 0 ? `${timeNum} min` : '-'}</p>
            </div>
          </div>
        </div>
        
        {/* Start Button */}
        <Button
          onClick={handleStart}
          className="w-full gap-2 h-12 text-lg"
          size="lg"
        >
          <PlayCircle className="w-5 h-5" />
          Iniciar Examen
        </Button>
      </div>
    </div>
  );
}

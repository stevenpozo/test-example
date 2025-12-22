import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Grid3X3, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExamStore } from '@/store/examStore';
import { Button } from '@/components/ui/button';

export function QuestionModal() {
  const {
    isModalOpen,
    closeModal,
    getCurrentQuestion,
    nextQuestion,
    previousQuestion,
    answerQuestion,
    answers,
    questions
  } = useExamStore();
  
  const question = getCurrentQuestion();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Reset state when question changes
  useEffect(() => {
    if (question) {
      const existingAnswer = answers[question.id];
      if (existingAnswer) {
        setSelectedOption(existingAnswer.selectedOptionId);
        setShowFeedback(true);
      } else {
        setSelectedOption(null);
        setShowFeedback(false);
      }
    }
  }, [question?.id, answers]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);
  
  if (!isModalOpen || !question) return null;
  
  const questionIndex = questions.findIndex(q => q.id === question.id);
  const currentAnswer = answers[question.id];
  const isCorrect = currentAnswer?.isCorrect;
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    answerQuestion(question.id, optionId);
    setShowFeedback(true);
  };
  
  const handleNext = () => {
    nextQuestion();
  };
  
  const handlePrevious = () => {
    previousQuestion();
  };
  
  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={closeModal} />
      
      {/* Modal Content */}
      <div className="modal-content scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b bg-card">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-mono font-bold text-lg">
              {questionIndex + 1}
            </span>
            <span className="text-sm text-muted-foreground">
              de {questions.length}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={closeModal}
            className="rounded-xl hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Question Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Question Text */}
          <p className="text-base sm:text-lg font-medium leading-relaxed">
            {question.text}
          </p>
          
          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isCorrectOption = option.id === question.correctOptionId;
              const showAsCorrect = showFeedback && isCorrectOption;
              const showAsIncorrect = showFeedback && isSelected && !isCorrectOption;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
                    'hover:border-primary/50 hover:bg-primary/5',
                    !showFeedback && isSelected && 'border-primary bg-primary/10',
                    !showFeedback && !isSelected && 'border-border bg-card',
                    showAsCorrect && 'border-success bg-success/10 animate-pulse-success',
                    showAsIncorrect && 'border-destructive bg-destructive/10 animate-shake'
                  )}
                >
                  <span className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono font-semibold text-sm transition-colors',
                    !showFeedback && isSelected && 'bg-primary text-primary-foreground',
                    !showFeedback && !isSelected && 'bg-muted text-muted-foreground',
                    showAsCorrect && 'bg-success text-success-foreground',
                    showAsIncorrect && 'bg-destructive text-destructive-foreground'
                  )}>
                    {option.id}
                  </span>
                  <span className="flex-1 pt-1 text-sm sm:text-base">
                    {option.text}
                  </span>
                  {showAsCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                  )}
                  {showAsIncorrect && (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Feedback Message */}
          {showFeedback && (
            <div className={cn(
              'p-4 rounded-xl flex items-center gap-3 animate-scale-in',
              isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            )}>
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">¡Correcto! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">
                    Incorrecto. La respuesta correcta es: {question.correctOptionId}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Footer Navigation */}
        <div className="sticky bottom-0 flex items-center justify-between p-4 sm:p-6 border-t bg-card">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={closeModal}
            className="gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Ver todo</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNext}
            className="gap-2"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

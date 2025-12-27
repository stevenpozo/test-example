import { cn } from '@/lib/utils';
import { AnswerStatus } from '@/types/question';
import { useExamStore } from '@/store/examStore';

interface QuestionTileProps {
  questionId: number;
  questionNumber: number;
}

export function QuestionTile({ questionId, questionNumber }: QuestionTileProps) {
  const { openQuestion, getAnswerStatus, mode, isExamFinished } = useExamStore();
  const status = getAnswerStatus(questionId);
  
  const handleClick = () => {
    openQuestion(questionId);
  };
  
  // In exam mode, only show colors after exam is finished
  const showColors = mode === 'practice' || (mode === 'exam' && isExamFinished);
  
  return (
    <button
      onClick={handleClick}
      className={cn(
        'tile-base aspect-square w-full min-w-[40px]',
        // Show colors based on mode and status
        showColors && status === 'unanswered' && 'tile-unanswered',
        showColors && status === 'correct' && 'tile-correct',
        showColors && status === 'incorrect' && 'tile-incorrect',
        // In exam mode (not finished), show answered questions with a different style
        !showColors && status !== 'unanswered' && 'bg-primary/20 border-2 border-primary/50 text-primary shadow-sm',
        !showColors && status === 'unanswered' && 'tile-unanswered'
      )}
      aria-label={`Pregunta ${questionNumber} - ${getStatusLabel(status)}`}
    >
      <span className="font-mono text-xs sm:text-sm font-semibold">
        {questionNumber}
      </span>
    </button>
  );
}

function getStatusLabel(status: AnswerStatus): string {
  switch (status) {
    case 'correct': return 'Correcta';
    case 'incorrect': return 'Incorrecta';
    default: return 'Sin responder';
  }
}

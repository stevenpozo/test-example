import { cn } from '@/lib/utils';
import { AnswerStatus } from '@/types/question';
import { useExamStore } from '@/store/examStore';

interface QuestionTileProps {
  questionId: number;
  questionNumber: number;
}

export function QuestionTile({ questionId, questionNumber }: QuestionTileProps) {
  const { openQuestion, getAnswerStatus } = useExamStore();
  const status = getAnswerStatus(questionId);
  
  const handleClick = () => {
    openQuestion(questionId);
  };
  
  return (
    <button
      onClick={handleClick}
      className={cn(
        'tile-base aspect-square w-full min-w-[40px]',
        status === 'unanswered' && 'tile-unanswered',
        status === 'correct' && 'tile-correct',
        status === 'incorrect' && 'tile-incorrect'
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

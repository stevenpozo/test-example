import { useExamStore } from '@/store/examStore';
import { QuestionTile } from './QuestionTile';

export function QuestionGrid() {
  const { questions } = useExamStore();
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2 sm:gap-3">
        {questions.map((question, index) => (
          <QuestionTile
            key={question.id}
            questionId={question.id}
            questionNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Question, UserAnswer, AnswerStatus, ExamStats } from '@/types/question';
import { sampleQuestions } from '@/data/sampleQuestions';

interface ExamState {
  questions: Question[];
  answers: Record<number, UserAnswer>;
  selectedQuestionId: number | null;
  isModalOpen: boolean;
  
  // Actions
  setQuestions: (questions: Question[]) => void;
  answerQuestion: (questionId: number, optionId: string) => void;
  openQuestion: (questionId: number) => void;
  closeModal: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetExam: () => void;
  
  // Getters
  getAnswerStatus: (questionId: number) => AnswerStatus;
  getStats: () => ExamStats;
  getCurrentQuestion: () => Question | null;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      questions: sampleQuestions,
      answers: {},
      selectedQuestionId: null,
      isModalOpen: false,
      
      setQuestions: (questions) => set({ 
        questions, 
        answers: {},
        selectedQuestionId: null,
        isModalOpen: false
      }),
      
      answerQuestion: (questionId, optionId) => {
        const question = get().questions.find(q => q.id === questionId);
        if (!question) return;
        
        const isCorrect = question.correctOptionId === optionId;
        
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: {
              questionId,
              selectedOptionId: optionId,
              isCorrect
            }
          }
        }));
      },
      
      openQuestion: (questionId) => set({ 
        selectedQuestionId: questionId,
        isModalOpen: true 
      }),
      
      closeModal: () => set({ 
        isModalOpen: false,
        selectedQuestionId: null 
      }),
      
      nextQuestion: () => {
        const { questions, selectedQuestionId } = get();
        if (selectedQuestionId === null) return;
        
        const currentIndex = questions.findIndex(q => q.id === selectedQuestionId);
        const nextIndex = (currentIndex + 1) % questions.length;
        
        set({ selectedQuestionId: questions[nextIndex].id });
      },
      
      previousQuestion: () => {
        const { questions, selectedQuestionId } = get();
        if (selectedQuestionId === null) return;
        
        const currentIndex = questions.findIndex(q => q.id === selectedQuestionId);
        const prevIndex = currentIndex === 0 ? questions.length - 1 : currentIndex - 1;
        
        set({ selectedQuestionId: questions[prevIndex].id });
      },
      
      resetExam: () => set({ 
        answers: {},
        selectedQuestionId: null,
        isModalOpen: false
      }),
      
      getAnswerStatus: (questionId) => {
        const answer = get().answers[questionId];
        if (!answer) return 'unanswered';
        return answer.isCorrect ? 'correct' : 'incorrect';
      },
      
      getStats: () => {
        const { questions, answers } = get();
        const total = questions.length;
        const answered = Object.keys(answers).length;
        const correct = Object.values(answers).filter(a => a.isCorrect).length;
        const incorrect = answered - correct;
        const unanswered = total - answered;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        return { total, answered, correct, incorrect, unanswered, percentage };
      },
      
      getCurrentQuestion: () => {
        const { questions, selectedQuestionId } = get();
        if (selectedQuestionId === null) return null;
        return questions.find(q => q.id === selectedQuestionId) || null;
      }
    }),
    {
      name: 'exam-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        answers: state.answers
      }),
      onRehydrateStorage: () => (state) => {
        // Ensure questions are always loaded from sampleQuestions
        if (state) {
          state.questions = sampleQuestions;
        }
      }
    }
  )
);

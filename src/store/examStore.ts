import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Question, UserAnswer, AnswerStatus, ExamStats } from '@/types/question';
import { sampleQuestions } from '@/data/sampleQuestions';

type ExamMode = 'practice' | 'exam';

interface ExamConfig {
  questionCount: number;
  timeLimit: number; // in minutes
}

interface ExamState {
  mode: ExamMode;
  questions: Question[];
  originalQuestions: Question[];
  answers: Record<number, UserAnswer>;
  selectedQuestionId: number | null;
  isModalOpen: boolean;
  examConfig: ExamConfig;
  examStartTime: number | null;
  examTimeRemaining: number | null; // in seconds
  isExamFinished: boolean;
  showExamResults: boolean;
  isExamStarted: boolean;
  
  // Actions
  setMode: (mode: ExamMode) => void;
  setQuestions: (questions: Question[]) => void;
  answerQuestion: (questionId: number, optionId: string) => void;
  openQuestion: (questionId: number) => void;
  closeModal: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetExam: () => void;
  shuffleQuestions: () => void;
  resetToOriginal: () => void;
  setExamConfig: (config: Partial<ExamConfig>) => void;
  startExam: () => void;
  restartExam: () => void;
  finishExam: () => void;
  updateTimeRemaining: (seconds: number) => void;
  closeExamResults: () => void;
  
  // Getters
  getAnswerStatus: (questionId: number) => AnswerStatus;
  getStats: () => ExamStats;
  getCurrentQuestion: () => Question | null;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      mode: 'practice',
      questions: sampleQuestions,
      originalQuestions: sampleQuestions,
      answers: {},
      selectedQuestionId: null,
      isModalOpen: false,
      examConfig: {
        questionCount: 80,
        timeLimit: 120 // 2 hours
      },
      examStartTime: null,
      examTimeRemaining: null,
      isExamFinished: false,
      showExamResults: false,
      isExamStarted: false,
      
      setMode: (mode) => {
        if (mode === 'exam') {
          // Reset exam state when switching to exam mode
          set({ 
            mode,
            isExamStarted: false,
            isExamFinished: false,
            showExamResults: false,
            answers: {},
            selectedQuestionId: null,
            isModalOpen: false
          });
        } else {
          set({ mode });
        }
      },
      
      setQuestions: (questions) => set({ 
        questions, 
        originalQuestions: questions,
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
      
      shuffleQuestions: () => {
        const currentQuestions = get().questions;
        const shuffled = [...currentQuestions].sort(() => Math.random() - 0.5);
        set({ questions: shuffled });
      },
      
      resetToOriginal: () => {
        const original = get().originalQuestions;
        set({ 
          questions: [...original],
          answers: {},
          selectedQuestionId: null,
          isModalOpen: false
        });
      },
      
      setExamConfig: (config) => {
        set((state) => ({
          examConfig: { ...state.examConfig, ...config }
        }));
      },
      
      startExam: () => {
        const { examConfig, originalQuestions } = get();
        
        // Select random questions
        const shuffled = [...originalQuestions].sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(0, examConfig.questionCount);
        
        set({
          mode: 'exam',
          questions: selectedQuestions,
          answers: {},
          selectedQuestionId: null,
          isModalOpen: false,
          examStartTime: Date.now(),
          examTimeRemaining: examConfig.timeLimit * 60, // convert to seconds
          isExamFinished: false,
          showExamResults: false,
          isExamStarted: true
        });
      },
      
      restartExam: () => {
        const { examConfig, originalQuestions } = get();
        
        // Select random questions
        const shuffled = [...originalQuestions].sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(0, examConfig.questionCount);
        
        set({
          questions: selectedQuestions,
          answers: {},
          selectedQuestionId: null,
          isModalOpen: false,
          examStartTime: Date.now(),
          examTimeRemaining: examConfig.timeLimit * 60,
          isExamFinished: false,
          showExamResults: false,
          isExamStarted: true
        });
      },
      
      finishExam: () => {
        set({
          isExamFinished: true,
          showExamResults: true,
          examTimeRemaining: 0
        });
      },
      
      updateTimeRemaining: (seconds) => {
        const current = get().examTimeRemaining;
        if (current !== null && current > 0) {
          const newTime = Math.max(0, seconds);
          set({ examTimeRemaining: newTime });
          
          // Auto-finish if time runs out
          if (newTime === 0 && !get().isExamFinished) {
            get().finishExam();
          }
        }
      },
      
      closeExamResults: () => {
        set({
          showExamResults: false
        });
      },
      
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
          state.originalQuestions = sampleQuestions;
        }
      }
    }
  )
);

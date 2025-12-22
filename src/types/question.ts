/**
 * Represents a single option in a question
 */
export interface QuestionOption {
  id: string; // Usually A, B, C, D, etc.
  text: string;
}

/**
 * Represents a complete question
 */
export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
}

/**
 * Status of a question answer
 */
export type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

/**
 * User's answer to a question
 */
export interface UserAnswer {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
}

/**
 * Statistics for the exam
 */
export interface ExamStats {
  total: number;
  answered: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
}

import { Question } from '@/types/question';
import rawQuestions from './json_con_preguntas.json';

// Normalize imported JSON into the `Question` shape used by the app.
function normalize(q: any): Question {
  return {
    id: Number(q.id) || 0,
    text: q.text || '',
    options: Array.isArray(q.options)
      ? q.options.map((o: any) => ({ id: String(o.id), text: o.text || '' }))
      : [],
    correctOptionId: q.correctOptionId ?? ''
  };
}

export const sampleQuestions: Question[] = (rawQuestions as any[])
  .filter(Boolean)
  .map(normalize);

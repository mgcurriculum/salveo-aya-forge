import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
  id: string;
  name: string;
  email: string;
  question: string;
  date: string;
}

interface QuestionState {
  questions: Record<string, Question[]>; // Keyed by productHandle
  addQuestion: (productHandle: string, question: Omit<Question, 'id' | 'date'>) => void;
  getQuestions: (productHandle: string) => Question[];
}

export const useQuestionStore = create<QuestionState>()(
  persist(
    (set, get) => ({
      questions: {},
      
      addQuestion: (productHandle, newQuestion) => {
        const { questions } = get();
        const productQuestions = questions[productHandle] || [];
        
        const question: Question = {
          ...newQuestion,
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }),
        };

        set({
          questions: {
            ...questions,
            [productHandle]: [question, ...productQuestions],
          },
        });
      },

      getQuestions: (productHandle) => {
        return get().questions[productHandle] || [];
      },
    }),
    {
      name: 'salmara-product-questions',
    }
  )
);

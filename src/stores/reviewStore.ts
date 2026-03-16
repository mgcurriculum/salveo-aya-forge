import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewState {
  reviews: Record<string, Review[]>; // Keyed by productHandle
  addReview: (productHandle: string, review: Omit<Review, 'id' | 'date'>) => void;
  getReviews: (productHandle: string) => Review[];
  getAverageRating: (productHandle: string) => number;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: {},
      
      addReview: (productHandle, newReview) => {
        const { reviews } = get();
        const productReviews = reviews[productHandle] || [];
        
        const review: Review = {
          ...newReview,
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }),
        };

        set({
          reviews: {
            ...reviews,
            [productHandle]: [review, ...productReviews],
          },
        });
      },

      getReviews: (productHandle) => {
        return get().reviews[productHandle] || [];
      },

      getAverageRating: (productHandle) => {
        const productReviews = get().reviews[productHandle] || [];
        if (productReviews.length === 0) return 0;
        
        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        return parseFloat((sum / productReviews.length).toFixed(1));
      },
    }),
    {
      name: 'salmara-product-reviews',
    }
  )
);

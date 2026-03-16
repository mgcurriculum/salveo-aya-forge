import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ShopifyProduct } from '@/lib/shopify';

interface WishlistItem {
  product: ShopifyProduct;
  variantId: string;
}

interface WishlistState {
  items: Record<string, WishlistItem[]>; // Keyed by userId or "guest"
  currentUserId: string;
  setUserId: (userId: string | null) => void;
  addItem: (product: ShopifyProduct, variantId: string) => void;
  removeItem: (variantId: string) => void;
  toggleItem: (product: ShopifyProduct, variantId: string) => void;
  isInWishlist: (variantId: string) => boolean;
  clearWishlist: () => void;
  getWishlist: () => WishlistItem[];
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: {},
      currentUserId: 'guest',
      
      setUserId: (userId) => {
        set({ currentUserId: userId || 'guest' });
      },

      getWishlist: () => {
        const { items, currentUserId } = get();
        return items[currentUserId] || [];
      },
      
      addItem: (product, variantId) => {
        const { items, currentUserId } = get();
        const userItems = items[currentUserId] || [];
        
        if (!userItems.some(item => item.variantId === variantId)) {
          set({ 
            items: { 
              ...items, 
              [currentUserId]: [...userItems, { product, variantId }] 
            } 
          });
        }
      },
      
      removeItem: (variantId) => {
        const { items, currentUserId } = get();
        const userItems = items[currentUserId] || [];
        set({ 
          items: { 
            ...items, 
            [currentUserId]: userItems.filter(item => item.variantId !== variantId) 
          } 
        });
      },
      
      toggleItem: (product, variantId) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(variantId)) {
          removeItem(variantId);
        } else {
          addItem(product, variantId);
        }
      },
      
      isInWishlist: (variantId) => {
        return get().getWishlist().some(item => item.variantId === variantId);
      },
      
      clearWishlist: () => {
        const { items, currentUserId } = get();
        set({ 
          items: { 
            ...items, 
            [currentUserId]: [] 
          } 
        });
      },
    }),
    {
      name: 'salmara-wishlist-v2', // New name to avoid conflicts with old structure
    }
  )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  type ShopifyProduct,
  getStoredSession,
  createStorefrontCheckout,
} from '@/lib/shopify';

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'lineId'>) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  checkout: () => Promise<string | null>;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);

        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, { ...item, lineId: null }] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map(i =>
            i.variantId === variantId ? { ...i, quantity } : i
          )
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(i => i.variantId !== variantId)
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      checkout: async () => {
        const { items, isLoading } = get();
        if (items.length === 0 || isLoading) return null;

        set({ isLoading: true });
        try {
          const session = getStoredSession();
          const lineItems = items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity
          }));

          const result = await createStorefrontCheckout(lineItems);
          if (result) {
            return result;
          }
          return null;
        } catch (error) {
          console.error('Checkout failed:', error);
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      syncCart: async () => {
        // No-op for Admin-only local cart
      },
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

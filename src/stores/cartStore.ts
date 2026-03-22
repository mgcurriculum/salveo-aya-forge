import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  type ShopifyProduct,
  getStoredSession,
  createHybridCheckout,
  syncCartToShopify,
} from '@/lib/shopifyAdmin';

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
  cartId: string | null;
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'lineId'>) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (id: string | null) => void;
  checkout: () => Promise<string | null>;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      isLoading: false,

      setCartId: (id: string | null) => set({ cartId: id }),

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
        
        // Auto-sync after adding
        const session = getStoredSession();
        if (session?.user?.id) {
          syncCartToShopify(session.user.id, get().items);
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

        // Auto-sync after update
        const session = getStoredSession();
        if (session?.user?.id) {
          syncCartToShopify(session.user.id, get().items);
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(i => i.variantId !== variantId)
        });

        // Auto-sync after removal
        const session = getStoredSession();
        if (session?.user?.id) {
          syncCartToShopify(session.user.id, get().items);
        }
      },

      clearCart: () => {
        set({ items: [] });
        
        // Auto-sync after clearing
        const session = getStoredSession();
        if (session?.user?.id) {
          syncCartToShopify(session.user.id, []);
        }
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

          console.log("Starting Standard checkout flow...");
          const result = await createHybridCheckout(lineItems, session?.user?.id, session?.user?.email);

          if (result.success && result.checkoutUrl) {
            console.log("Admin checkout successful URL:", result.checkoutUrl);
            return result.checkoutUrl;
          } else {
            console.error("Admin checkout failed:", result.errors);
            return null;
          }
        } catch (error) {
          console.error('Checkout failed:', error);
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      syncCart: async () => {
        const session = getStoredSession();
        if (!session?.user?.id) return;

        // The session object already contains the cartJson from the login/check-session fetch
        if (session.user.cartJson) {
          try {
            const remoteItems = JSON.parse(session.user.cartJson);
            if (Array.isArray(remoteItems) && remoteItems.length > 0) {
              console.log("Restoring cart from Shopify:", remoteItems.length, "items");
              set({ items: remoteItems });
            }
          } catch (e) {
            console.error("Failed to parse remote cart JSON:", e);
          }
        }
      },
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items,
        cartId: state.cartId
      }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  type ShopifyProduct, 
  fetchCustomerWishlist, 
  updateCustomerWishlist, 
  getStoredSession,
  fetchProductsByVariantIdsViaAdmin 
} from '@/lib/shopifyAdmin';
import { toast } from 'sonner';

interface WishlistItem {
  product: ShopifyProduct;
  variantId: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  syncWithShopify: () => Promise<void>;
  addItem: (product: ShopifyProduct, variantId: string) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  toggleItem: (product: ShopifyProduct, variantId: string) => Promise<void>;
  isInWishlist: (variantId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      syncWithShopify: async () => {
        const session = getStoredSession();
        if (!session?.user?.id) return;

        set({ isLoading: true });
        try {
          const remoteIds = await fetchCustomerWishlist(session.user.id);
          const currentItems = get().items;
          
          // If we have items in remote that aren't in local, fetch them
          const existingVariantIds = currentItems.map(i => i.variantId);
          const needsFetching = remoteIds.filter(id => !existingVariantIds.includes(id));
          
          let newItems = [...currentItems];
          if (needsFetching.length > 0) {
            const fetchedProducts = await fetchProductsByVariantIdsViaAdmin(needsFetching);
            const fetchedItems = fetchedProducts.map(p => ({
              product: p,
              variantId: p.node.variants.edges.find(v => remoteIds.includes(v.node.id))?.node.id || p.node.variants.edges[0].node.id
            }));
            newItems = [...newItems, ...fetchedItems];
          }

          // Filter by remote IDs (to handle removals from other devices)
          set({ 
            items: newItems.filter(i => remoteIds.includes(i.variantId))
          });
        } catch (error) {
          console.error("Wishlist sync failed:", error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      addItem: async (product, variantId) => {
        const session = getStoredSession();
        if (!session?.user?.id) {
          toast.error("Please login to use wishlist");
          window.location.href = `/login?redirect=wishlist`;
          return;
        }

        const { items } = get();
        if (!items.some(item => item.variantId === variantId)) {
          const newItems = [...items, { product, variantId }];
          set({ items: newItems });
          await updateCustomerWishlist(session.user.id, newItems.map(i => i.variantId));
          toast.success("Added to wishlist");
        }
      },
      
      removeItem: async (variantId) => {
        const session = getStoredSession();
        if (!session?.user?.id) return;

        const { items } = get();
        const newItems = items.filter(item => item.variantId !== variantId);
        set({ items: newItems });
        await updateCustomerWishlist(session.user.id, newItems.map(i => i.variantId));
        toast.info("Removed from wishlist");
      },
      
      toggleItem: async (product, variantId) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(variantId)) {
          await removeItem(variantId);
        } else {
          await addItem(product, variantId);
        }
      },
      
      isInWishlist: (variantId) => {
        return get().items.some(item => item.variantId === variantId);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'salmara-wishlist-v3',
    }
  )
);

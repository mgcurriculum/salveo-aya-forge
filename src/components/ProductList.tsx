import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Leaf, Loader2, Star, Trophy, ShieldCheck, Sparkles, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { type ShopifyProduct } from "@/lib/shopify";
import { fetchProductsViaAdmin } from "@/lib/shopifyAdmin";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";

const ProductList = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetchProductsViaAdmin(8) // Fetch top 8 products for the home page list
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    
    setAddingId(product.node.id);
    try {
      await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
      toast.success("Added to cart", { description: product.node.title, position: "top-center" });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section id="product-list" className="py-24 bg-[#FDFBF7]" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <p className="text-[#5A7A5C] font-sans-clean text-sm uppercase tracking-[0.3em] mb-4">Our Collections</p>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-[#1A2E35]">
              Botanical <span className="italic">Solutions</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              to="/shop" 
              className="group flex items-center gap-3 text-[#1A2E35] hover:text-[#5A7A5C] transition-all border-b border-[#1A2E35]/10 pb-2"
            >
              <span className="text-xs font-bold uppercase tracking-widest">Explore All</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#5A7A5C]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="h-16 w-16 text-[#5A7A5C]/20 mx-auto mb-4" />
            <p className="text-[#1A2E35]/60 font-body text-lg">Our herbarium is currently being prepared.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => {
              const variant = product.node.variants.edges[0]?.node;
              const image = product.node.images.edges[0]?.node;
              const price = variant?.price;

              return (
                <motion.div
                  key={product.node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-[2rem] p-4 border border-[#F2EDE4] shadow-sm hover:shadow-xl hover:shadow-[#5A7A5C]/5 transition-all duration-700 relative overflow-hidden group"
                >
                  <Link to={`/product/${product.node.handle}`} className="block relative mb-6 rounded-2xl overflow-hidden bg-[#FDFBF7] aspect-square">
                    {image ? (
                      <motion.img 
                        src={image.url} 
                        alt={image.altText || product.node.title} 
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="h-12 w-12 text-[#5A7A5C]/20" />
                      </div>
                    )}
                    
                    {/* Premium Badges Container */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {(product.node.tags?.includes('Best Seller') || product.node.handle === 'triphala-churna' || product.node.handle === 'triphala-tablets') && (
                        <div className="bg-white/90 backdrop-blur-md border border-[#F2EDE4] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                          <Trophy className="h-3 w-3 text-[#C5A059]" />
                          <span className="text-[9px] font-bold text-[#1A2E35] uppercase tracking-wider">Best Seller</span>
                        </div>
                      )}
                      {(product.node.tags?.includes('Doctor Recommended') || product.node.handle === 'brahmi-hair-oil') && (
                        <div className="bg-[#5A7A5C]/90 backdrop-blur-md border border-[#5A7A5C]/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                          <ShieldCheck className="h-3 w-3 text-white" />
                          <span className="text-[9px] font-bold text-white uppercase tracking-wider">Doctor Recommended</span>
                        </div>
                      )}
                      {(product.node.tags?.includes('New Launch') || product.node.handle === 'brahmi-hair-oil') && (
                        <div className="bg-[#1A2E35]/90 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                          <Sparkles className="h-3 w-3 text-[#C5A059]" />
                          <span className="text-[9px] font-bold text-white uppercase tracking-wider">New Launch</span>
                        </div>
                      )}
                      {(product.node.tags?.includes('100% Herbal') || product.node.handle === 'triphala-churna' || product.node.handle === 'triphala-tablets') && (
                        <div className="bg-white/90 backdrop-blur-md border border-[#F2EDE4] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                          <Leaf className="h-3 w-3 text-[#5A7A5C]" />
                          <span className="text-[9px] font-bold text-[#1A2E35] uppercase tracking-wider">100% Herbal</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Wishlist Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (variant) toggleItem(product, variant.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all z-20 ${
                        variant && isInWishlist(variant.id) 
                          ? 'bg-red-500 border-red-500 text-white opacity-100' 
                          : 'bg-white/80 border-[#F2EDE4] text-[#1A2E35] hover:bg-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${variant && isInWishlist(variant.id) ? 'fill-white' : ''}`} />
                    </button>
                    
                    {/* Persistent Premium Badge (visible when not hovering or if no other badges) */}
                    {(!product.node.tags || product.node.tags.length === 0 || idx < 2) && (
                      <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md border border-[#F2EDE4] px-3 py-1 rounded-full flex items-center gap-1 shadow-sm group-hover:opacity-0 transition-opacity">
                        <Star className="h-3 w-3 fill-[#C5A059] text-[#C5A059]" />
                        <span className="text-[9px] font-bold text-[#1A2E35] uppercase tracking-tighter">Premium</span>
                      </div>
                    )}
                  </Link>

                  <div className="px-2">
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/product/${product.node.handle}`}>
                        <h3 className="font-display font-medium text-[#1A2E35] text-lg hover:text-[#5A7A5C] transition-colors line-clamp-1">
                          {product.node.title}
                        </h3>
                      </Link>
                      {/* Rating Display */}
                      <div className="flex items-center gap-1.5 mt-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < (product.node.handle === 'triphala-churna' ? 5 : 4) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#F2EDE4]'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-[#1A2E35]/40 tracking-tighter">
                          {product.node.handle === 'triphala-churna' ? '4.9 (248 reviews)' : 
                           product.node.handle === 'brahmi-hair-oil' ? '4.8 (186 reviews)' : 
                           product.node.handle === 'triphala-tablets' ? '4.7 (92 reviews)' : 
                           '4.5 (124 reviews)'}
                        </span>
                      </div>
                      {price && (
                        <span className="text-[#C5A059] font-sans-clean font-bold text-sm">
                          {price.currencyCode === 'INR' ? '₹' : price.currencyCode}{parseInt(price.amount)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[#1A2E35]/60 font-sans-clean text-xs leading-relaxed mb-6 line-clamp-2 h-8">
                      {product.node.description}
                    </p>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!variant?.availableForSale || addingId === product.node.id}
                      className="w-full bg-[#1A2E35] text-white py-3 rounded-xl font-sans-clean text-[10px] font-bold uppercase tracking-widest hover:bg-[#5A7A5C] transition-all flex items-center justify-center gap-2"
                    >
                      {addingId === product.node.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add to Cart"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ShoppingCart, Leaf, Loader2, Star, Trophy, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchProducts, createShopifyCart, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";

const FeaturedProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetchProducts(12)
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

  const handleBuyNow = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    
    setBuyingId(product.node.id);
    try {
      const cartData = await createShopifyCart({
        variantId: variant.id,
        quantity: 1
      });
      if (cartData?.checkoutUrl) {
        window.location.href = cartData.checkoutUrl;
      } else {
        toast.error("Checkout failed", { description: "Could not generate checkout link." });
      }
    } catch (error) {
      console.error("Buy Now Error:", error);
      toast.error("Something went wrong");
    } finally {
      setBuyingId(null);
    }
  };

  // Duplicate products for infinite marquee effect
  const marqueeProducts = [...products, ...products, ...products];

  return (
    <section id="products" className="pt-24 pb-12 bg-[#FDFBF7] overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#5A7A5C] font-sans-clean text-sm uppercase tracking-[0.3em] mb-4">Pure Potency</p>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-[#1A2E35]">
            Best-Loved <span className="italic">Formulations</span>
          </h2>
          <div className="w-24 h-1 bg-[#F2EDE4] mx-auto mt-6" />
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
        <div className="relative">
          {/* Edge Fades for Premium Look */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

          {/* Marquee Container */}
          <div className="flex overflow-hidden group">
            <motion.div 
              className="flex gap-6 py-8 px-4"
              animate={{ x: ["0%", "-33.33%"] }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop"
              }}
              style={{ width: "fit-content" }}
              whileHover={{ animationPlayState: "paused" }}
            >
              {marqueeProducts.map((product, idx) => {
                const variant = product.node.variants.edges[0]?.node;
                const image = product.node.images.edges[0]?.node;
                const price = variant?.price;

                return (
                  <motion.div
                    key={`${product.node.id}-${idx}`}
                    className="w-[280px] md:w-[320px] bg-white rounded-[2rem] p-4 border border-[#F2EDE4] shadow-sm hover:shadow-xl hover:shadow-[#5A7A5C]/5 transition-all duration-700 relative overflow-hidden flex-shrink-0"
                    whileHover={{ y: -8 }}
                  >
                    {/* Floating Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F2EDE4]/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

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
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
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
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all z-10 ${
                          variant && isInWishlist(variant.id) 
                            ? 'bg-red-500 border-red-500 text-white' 
                            : 'bg-white/80 border-[#F2EDE4] text-[#1A2E35] hover:bg-white'
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${variant && isInWishlist(variant.id) ? 'fill-white' : ''}`} />
                      </button>

                      {/* Default Premium Badge if no specific tags */}
                      {(!product.node.tags || product.node.tags.length === 0) && (
                        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md border border-[#F2EDE4] px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
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

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!variant?.availableForSale || addingId === product.node.id}
                          className="flex-1 bg-[#1A2E35] text-white py-3 rounded-xl font-sans-clean text-[10px] font-bold uppercase tracking-widest hover:bg-[#5A7A5C] transition-all flex items-center justify-center gap-2"
                        >
                          {addingId === product.node.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add to Cart"}
                        </button>
                        <button
                          onClick={() => handleBuyNow(product)}
                          className="flex-1 border border-[#1A2E35]/10 text-[#1A2E35] py-3 rounded-xl font-sans-clean text-[10px] font-bold uppercase tracking-widest hover:bg-[#FDFBF7] transition-all"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col items-center">
        <Link 
          to="/shop" 
          className="bg-[#5A7A5C] text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#1A2E35] transition-all shadow-lg shadow-[#5A7A5C]/20"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;

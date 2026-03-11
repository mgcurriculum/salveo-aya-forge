import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ShoppingCart, Leaf, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const FeaturedProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, isLoading } = useCartStore();

  useEffect(() => {
    fetchProducts(12)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: product.node.title, position: "top-center" });
  };

  return (
    <section id="products" className="py-24 bg-secondary" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-sans-clean text-sm uppercase tracking-[0.2em] mb-3">Curated for You</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Our Best-Loved Formulations
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body text-lg">No products found</p>
            <p className="text-muted-foreground/70 font-sans-clean text-sm mt-2">Products will appear here once added to the store.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {products.map((product, i) => {
              const variant = product.node.variants.edges[0]?.node;
              const image = product.node.images.edges[0]?.node;
              const price = variant?.price;

              return (
                <motion.div
                  key={product.node.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group"
                >
                  <Link to={`/product/${product.node.handle}`}>
                    <div className="relative aspect-square bg-gradient-to-br from-secondary to-sand-warm flex items-center justify-center overflow-hidden">
                      {image ? (
                        <img src={image.url} alt={image.altText || product.node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Leaf className="h-16 w-16 text-primary/20" />
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link to={`/product/${product.node.handle}`}>
                      <h3 className="font-display font-semibold text-foreground text-lg mb-1 hover:text-primary transition-colors">
                        {product.node.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground font-body text-sm mb-3 line-clamp-2">{product.node.description}</p>

                    {price && (
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-sans-clean font-bold text-foreground">
                          {price.currencyCode === 'INR' ? '₹' : price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isLoading || !variant?.availableForSale}
                      className="w-full bg-primary hover:bg-herbal-dark text-primary-foreground py-2.5 rounded-lg font-sans-clean text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
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

export default FeaturedProducts;

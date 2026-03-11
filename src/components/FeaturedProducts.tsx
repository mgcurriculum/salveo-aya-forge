import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ShoppingCart, Eye, Leaf } from "lucide-react";

const products = [
  {
    name: "Mahanarayan Oil",
    benefit: "Fast absorbing oil for muscle comfort.",
    mrp: 599,
    offer: 449,
    rating: 4.7,
    reviews: 234,
    badges: ["Best Seller", "Doctor Recommended"],
    pair: "Pairs well with Joint Care Capsules",
  },
  {
    name: "Tulsi Immunity Drops",
    benefit: "Daily immunity booster with pure Tulsi extract.",
    mrp: 399,
    offer: 299,
    rating: 4.8,
    reviews: 189,
    badges: ["Best Seller", "100% Herbal"],
    pair: "Pairs well with Ashwagandha Tablets",
  },
  {
    name: "Triphala Churna",
    benefit: "Traditional digestive wellness formula.",
    mrp: 349,
    offer: 249,
    rating: 4.6,
    reviews: 312,
    badges: ["Doctor Recommended"],
    pair: "Pairs well with Aloe Vera Juice",
  },
  {
    name: "Ashwagandha Capsules",
    benefit: "Reduces stress and improves vitality naturally.",
    mrp: 699,
    offer: 549,
    rating: 4.9,
    reviews: 456,
    badges: ["New Launch", "100% Herbal"],
    pair: "Pairs well with Brahmi Syrup",
  },
  {
    name: "Kumkumadi Oil",
    benefit: "Luxurious skin radiance with saffron & herbs.",
    mrp: 899,
    offer: 749,
    rating: 4.7,
    reviews: 178,
    badges: ["Best Seller"],
    pair: "Pairs well with Neem Face Wash",
  },
  {
    name: "Liver Detox Syrup",
    benefit: "Gentle liver cleanse with Bhumyamalaki & Kutki.",
    mrp: 499,
    offer: 379,
    rating: 4.5,
    reviews: 145,
    badges: ["Doctor Recommended", "100% Herbal"],
    pair: "Pairs well with Triphala Churna",
  },
];

const badgeColors: Record<string, string> = {
  "Best Seller": "bg-accent/20 text-accent-foreground",
  "Doctor Recommended": "bg-primary/15 text-primary",
  "New Launch": "bg-destructive/10 text-destructive",
  "100% Herbal": "bg-herbal-light/20 text-herbal-dark",
};

const FeaturedProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image placeholder */}
              <div className="relative aspect-square bg-gradient-to-br from-secondary to-sand-warm flex items-center justify-center overflow-hidden">
                <Leaf className="h-16 w-16 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className={`text-[10px] font-sans-clean font-semibold px-2.5 py-1 rounded-full ${badgeColors[badge] || "bg-muted text-muted-foreground"}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-foreground/60 flex items-center justify-center transition-opacity duration-300 ${hoveredIndex === i ? "opacity-100" : "opacity-0"}`}>
                  <div className="text-center px-4">
                    <p className="text-primary-foreground text-xs font-sans-clean mb-3">{product.pair}</p>
                    <button className="bg-card/90 text-foreground px-4 py-2 rounded-lg text-xs font-sans-clean font-semibold flex items-center gap-2 mx-auto hover:bg-card transition-colors">
                      <Eye className="h-3.5 w-3.5" /> Quick View
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <h3 className="font-display font-semibold text-foreground text-lg mb-1">{product.name}</h3>
                <p className="text-muted-foreground font-body text-sm mb-3">{product.benefit}</p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`h-3.5 w-3.5 ${si < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-sans-clean text-muted-foreground">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-sans-clean font-bold text-foreground">₹{product.offer}</span>
                  <span className="text-sm font-sans-clean text-muted-foreground line-through">₹{product.mrp}</span>
                  <span className="text-xs font-sans-clean font-semibold text-green-600">
                    {Math.round(((product.mrp - product.offer) / product.mrp) * 100)}% OFF
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-primary hover:bg-herbal-dark text-primary-foreground py-2.5 rounded-lg font-sans-clean text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </button>
                  <button className="border border-border hover:border-primary text-foreground p-2.5 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ingredients = [
  {
    name: "Tulsi",
    benefit: "Strengthens immunity and respiratory health.",
    color: "from-green-800/80 to-green-600/60",
  },
  {
    name: "Guggul",
    benefit: "Supports joint flexibility and cholesterol balance.",
    color: "from-amber-800/80 to-amber-600/60",
  },
  {
    name: "Triphala",
    benefit: "Enhances digestion and natural detoxification.",
    color: "from-emerald-800/80 to-emerald-600/60",
  },
  {
    name: "Ashwagandha",
    benefit: "Reduces stress and improves vitality.",
    color: "from-orange-900/80 to-orange-700/60",
  },
  {
    name: "Brahmi",
    benefit: "Boosts memory and cognitive clarity.",
    color: "from-teal-800/80 to-teal-600/60",
  },
];

const IngredientHighlights = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-card" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-sans-clean text-sm uppercase tracking-[0.2em] mb-3">Nature's Pharmacy</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            The Science of Nature
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {ingredients.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl aspect-[3/4] overflow-hidden bg-gradient-to-br ${item.color} group cursor-default`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-2">{item.name}</h3>
                <p className="text-white/70 text-xs font-sans-clean leading-relaxed">{item.benefit}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IngredientHighlights;

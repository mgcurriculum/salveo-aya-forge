import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import tulsi from "@/assets/tulsi_dark.png";
import guggul from "@/assets/guggul_dark.png";
import triphala from "@/assets/triphala_dark.png";
import ashwagandha from "@/assets/ashwagandha_dark.png";

const ingredients = [
  {
    name: "Tulsi",
    benefit: "Strengthens Immunity.",
    image: tulsi,
  },
  {
    name: "Guggul",
    benefit: "Supports joint flexibility.",
    image: guggul,
  },
  {
    name: "Triphala",
    benefit: "Enhances digestion.",
    image: triphala,
  },
  {
    name: "Ashwagandha",
    benefit: "Reduces stress and improves vitality.",
    image: ashwagandha,
  },
];

const IngredientHighlights = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="pt-12 pb-24 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#C5A059] font-sans-clean text-xs uppercase tracking-[0.3em] mb-4">Pure Ingredients</p>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-[#1A2E35]">
            The Science of Nature
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto">
          {ingredients.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-6">
                {/* Circular Image Container */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border border-[#C5A059]/40 shadow-sm transition-all duration-500 group-hover:border-[#C5A059] group-hover:shadow-md">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              <h3 className="font-display font-medium text-[#1A2E35] text-xl mb-1">
                {item.name}
              </h3>
              <p className="text-[#1A2E35]/60 text-sm font-body leading-relaxed max-w-[180px]">
                {item.benefit}.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IngredientHighlights;

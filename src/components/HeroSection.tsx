import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroHerbs from "@/assets/hero-herbs.jpg";
import heroConsultation from "@/assets/hero-consultation.jpg";
import heroProduct from "@/assets/hero-product.jpg";

const badges = [
  "GMP\nCERTIFIED",
  "DOCTOR\nFORMULATED",
  "100%\nHERBAL",
  "27\nYEARS OF\nTRUST",
];

const HeroSection = () => (
  <section className="relative min-h-[85vh] flex items-end overflow-hidden bg-herbal-dark">
    {/* 3-panel background images */}
    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3">
      <div className="relative overflow-hidden">
        <img src={heroHerbs} alt="Ayurvedic herbs and mortar" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-herbal-dark/50" />
      </div>
      <div className="relative overflow-hidden hidden md:block">
        <img src={heroConsultation} alt="Ayurvedic doctor consultation" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-herbal-dark/30" />
      </div>
      <div className="relative overflow-hidden hidden md:block">
        <img src={heroProduct} alt="Woman using herbal product" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-herbal-dark/30" />
      </div>
    </div>

    {/* Gradient overlay for text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-herbal-dark/80 via-herbal-dark/20 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-herbal-dark/60 via-transparent to-transparent" />

    {/* Trust badges - top right */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="absolute top-6 right-6 md:top-10 md:right-10 z-20 flex gap-3"
    >
      {badges.map((badge) => (
        <div
          key={badge}
          className="hidden sm:flex w-16 h-16 md:w-20 md:h-20 rounded-full border border-primary-foreground/40 items-center justify-center text-center backdrop-blur-sm bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors"
        >
          <span className="text-[8px] md:text-[9px] font-sans-clean font-semibold text-primary-foreground/90 leading-tight whitespace-pre-line tracking-wide">
            {badge}
          </span>
        </div>
      ))}
    </motion.div>

    {/* Main content */}
    <div className="container mx-auto px-4 relative z-10 pb-20 pt-32 md:pt-40">
      <div className="max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-[1.1] mb-6"
        >
          Rooted in Ayurveda.
          <br />
          <span className="italic text-gold-light">Refined by Science.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-primary-foreground/80 text-base sm:text-lg md:text-xl font-body leading-relaxed mb-10 max-w-xl"
        >
          From pure herbs to certified formulations – crafted in Karnataka for today's wellness seekers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#products"
            className="bg-primary-foreground text-herbal-dark px-8 py-3.5 font-sans-clean font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:bg-gold-light hover:text-herbal-dark"
          >
            Shop Now
          </a>
          <a
            href="#consultation"
            className="border-2 border-primary-foreground/60 text-primary-foreground px-8 py-3.5 font-sans-clean font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:bg-primary-foreground/10 hover:border-primary-foreground"
          >
            Book Consultation
          </a>
        </motion.div>
      </div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
    >
      <ChevronDown className="h-6 w-6 text-primary-foreground/50" />
    </motion.div>
  </section>
);

export default HeroSection;

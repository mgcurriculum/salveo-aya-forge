import { motion } from "framer-motion";
import { Shield, Stethoscope, Leaf, Award, ChevronDown } from "lucide-react";

const badges = [
  { icon: Shield, text: "GMP Certified" },
  { icon: Stethoscope, text: "Doctor Formulated" },
  { icon: Leaf, text: "100% Herbal" },
  { icon: Award, text: "27 Years of Trust" },
];

const slides = [
  {
    title: "Pain Relief",
    subtitle: "Ancient oils for modern comfort",
    gradient: "from-herbal-dark/80 to-primary/60",
  },
  {
    title: "Liver Detox",
    subtitle: "Purify naturally with trusted herbs",
    gradient: "from-herbal-dark/80 to-herbal/60",
  },
  {
    title: "Women's Wellness",
    subtitle: "Nurturing health through Ayurveda",
    gradient: "from-primary/80 to-herbal-dark/60",
  },
  {
    title: "Immunity Boosters",
    subtitle: "Strengthen your body's natural defence",
    gradient: "from-herbal/80 to-herbal-dark/70",
  },
];

const HeroSection = () => (
  <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-herbal-dark">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-herbal-dark via-primary to-herbal opacity-90" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--gold)/0.15),transparent_60%)]" />

    {/* Decorative leaf pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-20 left-10 w-40 h-40 border border-primary-foreground/30 rounded-full" />
      <div className="absolute bottom-20 right-20 w-60 h-60 border border-primary-foreground/20 rounded-full" />
      <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-primary-foreground/20 rounded-full" />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gold-light font-sans-clean text-sm uppercase tracking-[0.25em] mb-6"
        >
          Salmara Herbals — Est. 1998
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-primary-foreground leading-[1.1] mb-6"
        >
          Rooted in Ayurveda.{" "}
          <span className="text-gold-light italic">Refined by Science.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-primary-foreground/80 text-lg sm:text-xl font-body leading-relaxed mb-10 max-w-xl"
        >
          From pure herbs to certified formulations — crafted in Karnataka for today's wellness seekers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-4 mb-16"
        >
          <a
            href="#products"
            className="bg-accent hover:bg-gold text-accent-foreground px-8 py-3.5 rounded-lg font-sans-clean font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
          >
            Shop Now
          </a>
          <a
            href="#consultation"
            className="border-2 border-primary-foreground/40 hover:border-primary-foreground text-primary-foreground px-8 py-3.5 rounded-lg font-sans-clean font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-primary-foreground/10"
          >
            Book Consultation
          </a>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap gap-4"
        >
          {badges.map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2"
            >
              <badge.icon className="h-4 w-4 text-gold-light" />
              <span className="text-xs font-sans-clean text-primary-foreground/90">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Category Cards on right for desktop */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="hidden lg:grid grid-cols-2 gap-3 absolute right-8 top-1/2 -translate-y-1/2 w-72"
      >
        {slides.map((slide) => (
          <a
            key={slide.title}
            href="#products"
            className={`bg-gradient-to-br ${slide.gradient} backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-4 hover:scale-105 transition-transform duration-300 group`}
          >
            <p className="text-primary-foreground font-display font-semibold text-sm mb-1">{slide.title}</p>
            <p className="text-primary-foreground/60 text-[10px] font-sans-clean">{slide.subtitle}</p>
          </a>
        ))}
      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <ChevronDown className="h-6 w-6 text-primary-foreground/50" />
    </motion.div>
  </section>
);

export default HeroSection;

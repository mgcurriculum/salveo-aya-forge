import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, TrendingUp, Banknote } from "lucide-react";

const AffiliateSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="affiliate" className="py-20 bg-gradient-to-br from-herbal-dark via-primary to-herbal-dark relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--gold)/0.12),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-gold-light font-sans-clean text-sm uppercase tracking-[0.2em] mb-4">Partner With Us</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
            Share Ayurveda <span className="italic text-gold-light">&</span> Earn
          </h2>
          <p className="text-primary-foreground/70 font-body text-lg mb-10">
            Join the Salmara Affiliate Program and grow with India's trusted Ayurvedic brand.
          </p>

          <div className="flex justify-center gap-8 mb-10">
            {[
              { icon: Users, label: "Refer Friends" },
              { icon: TrendingUp, label: "Track Sales" },
              { icon: Banknote, label: "Earn Commission" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="h-6 w-6 text-gold-light" />
                </div>
                <p className="text-xs font-sans-clean text-primary-foreground/60">{item.label}</p>
              </div>
            ))}
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 bg-accent hover:bg-gold text-accent-foreground px-10 py-4 rounded-lg font-sans-clean font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
          >
            Become an Affiliate →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AffiliateSection;

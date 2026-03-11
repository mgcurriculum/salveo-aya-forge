import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, BadgeCheck } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", city: "Bangalore", rating: 5, quote: "Salmara's Mahanarayan Oil relieved my chronic back pain in just two weeks.", tag: "Verified Purchase" },
  { name: "Rahul Desai", city: "Mumbai", rating: 5, quote: "The Ashwagandha capsules transformed my energy levels completely.", tag: "Verified Purchase" },
  { name: "Lakshmi Iyer", city: "Chennai", rating: 5, quote: "Best Ayurvedic consultation I've ever had. The doctor was incredibly thorough.", tag: "Consultation Patient" },
  { name: "Arun Patel", city: "Ahmedabad", rating: 4, quote: "Triphala Churna has improved my digestion — I feel lighter every day.", tag: "Verified Purchase" },
  { name: "Sneha Rao", city: "Hubli", rating: 5, quote: "Kumkumadi Oil gave my skin a natural glow within a month.", tag: "Verified Purchase" },
  { name: "Vikram Joshi", city: "Pune", rating: 5, quote: "Trustworthy brand with real results. My whole family uses Salmara.", tag: "Consultation Patient" },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-secondary" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-sans-clean text-sm uppercase tracking-[0.2em] mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Real Stories, Real Wellness
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, si) => (
                  <Star
                    key={si}
                    className={`h-4 w-4 ${si < t.rating ? "fill-accent text-accent" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="text-foreground/80 font-body text-sm leading-relaxed mb-5 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans-clean font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="font-sans-clean text-muted-foreground text-xs">{t.city}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-sans-clean font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  <BadgeCheck className="h-3 w-3" /> {t.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <a href="#" className="text-primary hover:text-herbal-dark font-sans-clean text-sm font-semibold underline underline-offset-4 transition-colors">
            Read More Stories →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

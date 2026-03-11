import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Stethoscope, ThumbsUp } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Certified Herbs",
    desc: "Sourced ethically, lab tested for purity and potency. Every batch meets pharmaceutical-grade standards.",
  },
  {
    icon: Stethoscope,
    title: "Expert Doctors",
    desc: "Led by experienced Ayurvedic practitioners with decades of clinical expertise in traditional medicine.",
  },
  {
    icon: ThumbsUp,
    title: "Proven Results",
    desc: "Thousands of satisfied clients across India trust our formulations for lasting wellness outcomes.",
  },
];

const WhyChooseUs = () => {
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
          <p className="text-accent font-sans-clean text-sm uppercase tracking-[0.2em] mb-3">Our Promise</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Why Choose Salmara?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-xs mx-auto">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-14"
        >
          <a
            href="#consultation"
            className="bg-primary hover:bg-herbal-dark text-primary-foreground px-8 py-3 rounded-lg font-sans-clean font-semibold text-sm transition-all duration-300"
          >
            Book Appointment
          </a>
          <a
            href="#products"
            className="border-2 border-primary/30 hover:border-primary text-foreground px-8 py-3 rounded-lg font-sans-clean font-semibold text-sm transition-all duration-300"
          >
            Shop Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

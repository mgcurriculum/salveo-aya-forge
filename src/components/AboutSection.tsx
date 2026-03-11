import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Leaf, Award, Building2, Globe } from "lucide-react";

const timeline = [
  { icon: Leaf, year: "1998", label: "Origins", desc: "Founded in Karnataka" },
  { icon: Award, year: "2005", label: "Certification", desc: "GMP & ISO certified" },
  { icon: Building2, year: "2015", label: "Clinics", desc: "Ayurvedic clinics launched" },
  { icon: Globe, year: "2024", label: "Global Reach", desc: "Pan-India & beyond" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 bg-secondary" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-2xl aspect-[3/4] flex items-center justify-center overflow-hidden">
                <div className="text-center p-6">
                  <Leaf className="h-12 w-12 text-primary mx-auto mb-3" />
                  <p className="text-xs font-sans-clean text-muted-foreground">Herb Garden</p>
                </div>
              </div>
              <div className="bg-sand-warm rounded-2xl aspect-square flex items-center justify-center">
                <div className="text-center p-6">
                  <Award className="h-10 w-10 text-accent mx-auto mb-2" />
                  <p className="text-xs font-sans-clean text-muted-foreground">Lab Testing</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-sand-warm rounded-2xl aspect-square flex items-center justify-center">
                <div className="text-center p-6">
                  <Building2 className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-xs font-sans-clean text-muted-foreground">Production Unit</p>
                </div>
              </div>
              <div className="bg-primary/10 rounded-2xl aspect-[3/4] flex items-center justify-center">
                <div className="text-center p-6">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-3" />
                  <p className="text-xs font-sans-clean text-muted-foreground">Our Team</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-accent font-sans-clean text-sm uppercase tracking-[0.2em] mb-3">Our Heritage</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
              The Salmara Story
            </h2>
            <div className="w-16 h-1 bg-accent rounded-full mb-8" />
            <p className="text-foreground/70 font-body text-lg leading-relaxed mb-6">
              Founded in Karnataka with a vision to make authentic Ayurveda accessible to every home, 
              Salmara Herbals blends tradition with technology. Our formulations are rooted in ancient 
              wisdom and perfected through modern GMP-certified processes.
            </p>
            <blockquote className="border-l-4 border-accent pl-6 py-2 mb-8">
              <p className="text-foreground/60 italic font-body">
                "We don't just manufacture products — we preserve Ayurveda."
              </p>
              <cite className="text-sm font-sans-clean text-muted-foreground mt-2 block">
                — Founder, Salmara Herbals
              </cite>
            </blockquote>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-primary hover:bg-herbal-dark text-primary-foreground px-6 py-3 rounded-lg font-sans-clean text-sm font-semibold transition-all duration-300"
            >
              Know More →
            </a>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {timeline.map((item, i) => (
            <div key={item.label} className="text-center group">
              <div className="w-16 h-16 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:border-accent transition-colors">
                <item.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
              </div>
              <p className="font-display font-bold text-accent text-xl mb-1">{item.year}</p>
              <p className="font-sans-clean font-semibold text-foreground text-sm">{item.label}</p>
              <p className="font-sans-clean text-muted-foreground text-xs mt-1">{item.desc}</p>
              {i < timeline.length - 1 && (
                <div className="hidden md:block absolute" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

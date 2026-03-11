import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Stethoscope, Calendar, Video, MapPin } from "lucide-react";

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const ConsultationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="consultation" className="py-24 bg-herbal-dark relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--gold)/0.1),transparent_60%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold-light font-sans-clean text-sm uppercase tracking-[0.2em] mb-3">Expert Care</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Personalized Ayurvedic Guidance
            </h2>
            <p className="text-primary-foreground/70 font-body text-lg leading-relaxed mb-8">
              Unsure which remedy suits your needs? Speak directly with our certified 
              Ayurvedic doctors — online or in person. Get personalized treatment plans 
              rooted in your unique Prakriti.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: Video, label: "Online" },
                { icon: MapPin, label: "In-Person" },
                { icon: Calendar, label: "Flexible Slots" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-2">
                    <item.icon className="h-5 w-5 text-gold-light" />
                  </div>
                  <p className="text-xs font-sans-clean text-primary-foreground/70">{item.label}</p>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 bg-accent hover:bg-gold text-accent-foreground px-8 py-3.5 rounded-lg font-sans-clean font-semibold text-sm transition-all duration-300 hover:shadow-lg"
            >
              <Calendar className="h-4 w-4" /> Book Appointment
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-3xl p-12">
              <Stethoscope className="h-20 w-20 text-gold-light mx-auto mb-6" />
              <p className="text-5xl sm:text-6xl font-display font-bold text-primary-foreground mb-2">
                <AnimatedCounter target={15000} suffix="+" />
              </p>
              <p className="text-primary-foreground/60 font-sans-clean text-sm">Consultations Completed</p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-2xl font-display font-bold text-gold-light">
                    <AnimatedCounter target={50} suffix="+" />
                  </p>
                  <p className="text-primary-foreground/50 font-sans-clean text-xs">Doctors</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-gold-light">
                    <AnimatedCounter target={12} />
                  </p>
                  <p className="text-primary-foreground/50 font-sans-clean text-xs">Clinic Locations</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;

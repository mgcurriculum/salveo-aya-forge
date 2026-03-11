import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

const NewsletterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Welcome to the Circle of Wellness! 🌿", {
        description: "You'll receive Ayurvedic tips, offers, and early product updates.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-secondary" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <Sparkles className="h-8 w-8 text-accent mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
            Join the Salmara Circle of Wellness
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-8">
            Receive Ayurvedic tips, offers, and early product updates.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm font-sans-clean outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-herbal-dark text-primary-foreground px-6 py-3 rounded-lg font-sans-clean font-semibold text-sm transition-all duration-300 shrink-0"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;

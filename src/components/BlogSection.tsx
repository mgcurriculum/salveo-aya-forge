import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Clock, Leaf } from "lucide-react";

const posts = [
  {
    title: "5 Ayurvedic Herbs for Daily Immunity",
    snippet: "Discover how Tulsi, Ashwagandha, and Giloy can transform your immune response naturally.",
    readTime: "4 min",
    category: "Wellness",
  },
  {
    title: "Understanding Your Dosha: A Beginner's Guide",
    snippet: "Learn about Vata, Pitta, and Kapha — and find the perfect Ayurvedic routine for your body type.",
    readTime: "6 min",
    category: "Education",
  },
  {
    title: "The Power of Panchakarma Detox",
    snippet: "How this ancient five-step cleansing therapy can reset your body and mind.",
    readTime: "5 min",
    category: "Treatments",
  },
];

const BlogSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" className="py-24 bg-card" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-sans-clean text-sm uppercase tracking-[0.2em] mb-3">Knowledge</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Learn the Ayurvedic Way
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-secondary to-sand-warm flex items-center justify-center mb-5 overflow-hidden group-hover:shadow-lg transition-shadow">
                <Leaf className="h-12 w-12 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-sans-clean font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs font-sans-clean text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {post.readTime}
                </span>
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-3">
                {post.snippet}
              </p>
              <span className="text-primary font-sans-clean text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <a href="#" className="border-2 border-primary/30 hover:border-primary text-foreground px-8 py-3 rounded-lg font-sans-clean font-semibold text-sm transition-all duration-300 inline-block">
            Explore All Articles
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;

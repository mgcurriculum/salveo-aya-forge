import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import tulsiImg from "@/assets/tulsi_dark.png";
import ashwagandhaImg from "@/assets/ashwagandha_dark.png";
import triphalaImg from "@/assets/triphala_dark.png";

const posts = [
  {
    title: "5 Ways Tulsi Boosts Your Immunity Naturally",
    snippet: "Discover how the queen of herbs protects against seasonal infections.",
    image: tulsiImg,
  },
  {
    title: "Ashwagandha: The Ancient Stress Buster",
    snippet: "Learn why this adaptogen is gaining PAN India recognition in wellness circles.",
    image: ashwagandhaImg,
  },
  {
    title: "Triphala for Digestive Wellness",
    snippet: "A complete guide to using this traditional formula for gut health.",
    image: triphalaImg,
  },
];

const BlogSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" className="py-24 bg-[#F2EDE4]/50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#C5A059] font-sans-clean text-xs sm:text-sm uppercase tracking-[0.3em] font-bold mb-4">KNOWLEDGE</p>
          <h2 className="text-4xl sm:text-5xl font-display font-medium text-[#1A2E35]">
            Learn the Ayurvedic Way
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <h3 className="font-display font-bold text-[#1A2E35] text-xl mb-4 leading-tight group-hover:text-[#5A7A5C] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#4A5568] font-body text-sm leading-relaxed mb-6 line-clamp-2">
                  {post.snippet}
                </p>
                {/* <div className="flex items-center gap-1.5 text-[#5A7A5C] font-sans-clean text-xs font-bold uppercase tracking-wider group/link">
                  <span>Read More</span>
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </div> */}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <a 
            href="#" 
            className="inline-block border border-[#1A2E35]/20 hover:border-[#1A2E35] text-[#1A2E35] px-10 py-4 rounded-lg font-sans-clean font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300"
          >
            Explore All Articles
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;

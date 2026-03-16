import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import heroHerbs from "@/assets/hero-ayurveda.jpg";
import heroConsultation from "@/assets/consultation.jpg";
import heroProduct from "@/assets/skincare-wellness.png";

const badges = [
  "GMP\nCERTIFIED",
  "DOCTOR\nFORMULATED",
  "100%\nHERBAL",
  "27\nYEARS OF\nTRUST",
];

const slides = [
  {
    type: "image",
    url: heroHerbs
  },
  {
    type: "image",
    url: heroConsultation
  },
  {
    type: "image",
    url: heroProduct
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000); // 8 seconds per slide
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-[#1A2E35]">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={slides[currentSlide].url} 
              alt="Salmara Hero" 
              className="w-full h-full object-cover brightness-[0.7]"
            />
            {/* Global Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E35]/90 via-[#1A2E35]/40 to-transparent" />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Badges Overlay */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute top-12 md:top-24 right-4 md:right-12 z-20 flex flex-nowrap justify-end gap-3 md:gap-5"
      >
        {badges.map((badge) => (
          <div
            key={badge}
            className="w-16 h-16 md:w-28 md:h-28 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-center p-3"
          >
            <span className="text-[7px] md:text-[10px] font-sans-clean font-bold text-white uppercase tracking-widest leading-tight whitespace-pre-line">
              {badge}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Main Content Overlay */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[80px] xl:text-[95px] font-display font-medium text-white leading-tight mb-8 drop-shadow-2xl">
              <span className="inline-block">Rooted in Ayurveda.</span>
              <br />
              <span className="italic inline-block text-[#C5A059]">Refined by Science.</span>
            </h1>
            
            <p className="text-white/90 text-lg md:text-2xl font-body leading-relaxed mb-12 max-w-2xl drop-shadow-lg">
              Unlock the power of ancestral formulations with modern quality standards. 
              Pure ingredients, proven results.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <Link
                to="/shop"
                className="bg-white text-[#1A2E35] px-10 py-5 font-sans-clean font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#F2EDE4] hover:scale-105 shadow-xl shadow-black/20"
              >
                Shop Now
              </Link>
              <a 
                href="https://wa.me/919995731915?text=Hello%20Salmara%20Team,%20I%20would%20like%20to%20know%20more%20about%20your%20Ayurvedic%20wellness%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/60 text-white px-10 py-5 font-sans-clean font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white hover:text-[#1A2E35] block w-fit shadow-xl"
              >
                <span className="flex items-center gap-2">
                  Book Consultation <PlayCircle className="h-4 w-4 hidden group-hover:block animate-pulse" />
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-12 right-4 md:right-12 z-20 flex gap-4">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-[#1A2E35] transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 group-hover:scale-110" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-[#1A2E35] transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 group-hover:scale-110" />
        </button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="h-8 w-8 text-white/50" />
      </motion.div>
    </section>
  );
};

export default HeroSection;

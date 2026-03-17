import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AffiliatePage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <main className="min-h-[60vh] flex items-center justify-center relative overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[15%] w-[40rem] h-[40rem] bg-[#5A7A5C]/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[20%] left-[10%] w-[30rem] h-[30rem] bg-[#C5A059]/5 rounded-full blur-3xl opacity-50" />
        </div>

        <section className="container px-4 relative z-10 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-medium text-[#1A2E35] mb-8 leading-[1.1] tracking-tight">
                Our Affiliate Program is <br />
                <span className="italic font-normal">Coming Soon</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#1A2E35]/60 font-sans-clean max-w-xl mx-auto mb-12 leading-relaxed">
                We are meticulously crafting a partnership platform that honors the wisdom of Ayurveda. A sanctuary for collaborators will be unveiled shortly.
              </p>

              <div className="pt-8">
                <Link
                  to="/"
                  className="bg-[#1A2E35] text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#1A2E35]/90 transition-all inline-flex items-center gap-3 shadow-2xl shadow-[#1A2E35]/20 group"
                >
                  Return to Sanctuary <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AffiliatePage;

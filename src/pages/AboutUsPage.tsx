import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, Award, ShieldCheck, Microscope, 
  FlaskConical, MapPin, ArrowRight, ChevronRight,
  HandHeart, Users, Activity, History, Trophy, X, Maximize2
} from "lucide-react";

// Award Images
import awardIMG7909 from "@/awards/IMG_7909.JPG";
import awardIMG7913 from "@/awards/IMG_7913.JPG";
import awardIMG7915 from "@/awards/IMG_7915.JPG";
import awardIMG7916 from "@/awards/IMG_7916.JPG";
import awardIMG7918 from "@/awards/IMG_7918.JPG";
import awardIMG7921 from "@/awards/IMG_7921.JPG";
import awardNobleMan from "@/awards/Noble-Man-Award.png";

// Assets
import aboutLab from "@/assets/about-lab.jpg";

const AboutUsPage = () => {
  const navigate = useNavigate();
  const [selectedAward, setSelectedAward] = useState<{title: string, img: string} | null>(null);
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <main className="relative">
        {/* 1) Hero Banner */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#1A2E35]">
          <div className="absolute inset-0 opacity-40">
            {/* Minimalistic lab/herbal visual placeholder style */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A2E35]" />
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay animate-pulse" style={{ animationDuration: '10s' }} />
          </div>
          
          <div className="container relative z-10 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-white mb-4">
                Where Tradition <br /> Meets Science.
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8 font-sans-clean leading-relaxed">
                We didn’t reinvent Ayurveda — we refined it through proof, purity, and precision.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase border border-[#C5A059]/30 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="h-3 w-3" /> GMP Certified
                </span>
                <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase border border-[#C5A059]/30 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> ISO Compliant
                </span>
                <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase border border-[#C5A059]/30 px-3 py-1.5 rounded-full">
                  <Award className="h-3 w-3" /> AYUSH Approved
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/shop" className="w-full sm:w-auto px-8 py-4 bg-[#5A7A5C] text-white rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-[#4a654c] transition-all shadow-xl shadow-black/20">
                  Explore Products
                </Link>
                <Link to="/clinics" className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-white/20 transition-all">
                  Discover Our Clinics
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2) Founder’s Message - Minimalist Premium Redesign */}
        <section className="py-6 md:py-10 container px-4 overflow-hidden">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Image Column - Compact but Premium */}
            <div className="w-full md:w-1/4 flex-shrink-0">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop" 
                  alt="Founder" 
                  className="rounded-xl grayscale hover:grayscale-0 transition-all duration-700 shadow-lg w-full max-w-[200px] mx-auto md:max-w-none"
                />
                <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-[#5A7A5C]/10 rounded-lg -z-10" />
              </div>
            </div>

            {/* Text Column - Refined Typography */}
            <div className="w-full md:w-3/4 space-y-4">
              <h2 className="text-2xl md:text-3xl font-display font-medium text-[#1A2E35] border-b border-[#C5A059]/20 pb-2 inline-block">
                A Promise Born in Karnataka
              </h2>
              
              <div className="text-[#1A2E35]/70 font-sans-clean leading-relaxed text-base md:text-lg">
                <p>
                  When we began Salmara, it was never just about herbal formulations — it was about restoring the 
                  credibility of Ayurveda. We wanted people to experience something that feels traditional, yet proven. 
                  Every bottle carries our promise — tested, verified, and made with respect for the science that nature 
                  already perfected.
                </p>
              </div>

              <div className="pt-2">
                <p className="font-display italic text-xl text-[#5A7A5C]">Dr. S. Mallikarjuna</p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A2E35]/40">— Founder, Salmara Ayurveda</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2.5) Our Journey */}
        <section className="py-16 md:py-24 bg-white overflow-hidden">
          <div className="container px-4 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5A7A5C] mb-4 block">The Salmara Legacy</span>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-[#1A2E35]">Our Journey</h2>
              <div className="w-24 h-1 bg-[#F2EDE4] mx-auto mt-6" />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              {/* Narrative Story */}
              <div className="space-y-8 text-[#1A2E35]/70 font-sans-clean leading-relaxed text-lg text-justify">
                <p>
                  <span className="text-7xl font-display text-[#5A7A5C] float-left mr-4 mt-1 leading-[0.8] h-full">I</span>n 1996, our founder inherited more than recipes—he inherited a responsibility. With ancestral formulations for hair care and kidney health, we began a mission to bring authentic Ayurvedic healing to every home.
                </p>
                <p>
                  Our journey started with a simple yet profound belief: that healing should be rooted in tradition and accessible to all. What began as two time-honored formulations passed down through generations became the foundation of a movement that would transform lives across India.
                </p>
                <p>
                  Our mission extended far beyond clinic walls. Since 2004, we have conducted over 100 free medical camps, reaching underserved communities in remote villages and urban neighborhoods alike. We traveled where others wouldn’t—because we believe healing is a right, not a privilege.
                </p>
                <p>
                  In 2005, we opened our first clinic in Murudjinjira. More than a medical facility, it became a sanctuary where ancient Ayurvedic wisdom met modern compassionate care. Every consultation was a conversation, every treatment a step toward holistic wellness.
                </p>
                <p>
                  In 2006, our dedication earned official recognition when we became an AYUSH partner. This was not just certification—it was validation of authentic practice and responsibility.
                </p>
                <p>
                  From our founder’s personal laboratory emerged 26+ carefully crafted formulations, each born from real patient experiences, years of observation, and generations of herbal wisdom.
                </p>
                <p>
                  Among our breakthrough innovations is Karnataka’s No.1 piles medicine—a formulation that cures without surgical treatment, offering patients a natural, non-invasive path to complete recovery. This achievement earned us the National Health Award in 2024, recognizing innovation in traditional medicine that transforms patient outcomes.
                </p>
              </div>

              {/* Milestones Timeline */}
              <div className="bg-[#FDFBF7] rounded-[2.5rem] p-8 md:p-12 border border-[#F2EDE4] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2EDE4]/30 rounded-full blur-3xl -mr-32 -mt-32" />
                <h3 className="text-2xl font-display font-medium text-[#1A2E35] mb-10 relative z-10">Milestones of Growth</h3>
                
                <div className="space-y-8 relative z-10">
                  <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-[#F2EDE4] md:left-[15px]" />
                  
                  {[
                    { year: "1996", label: "Founded with ancestral knowledge" },
                    { year: "2004", label: "Launched free medical camps initiative" },
                    { year: "2005", label: "Established first clinic in Murudjinjira" },
                    { year: "2006", label: "Official AYUSH Partner recognition" },
                    { year: "2009", label: "Received Noble Man Award" },
                    { year: "2017", label: "Honored with two major state awards" },
                    { year: "2019", label: "Nava Rathna Award for excellence" },
                    { year: "2024", label: "National Health Award for Innovation" },
                    { year: "2025", label: "Three prestigious honors in healing" },
                  ].map((milestone, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-6 relative"
                    >
                      <div className="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-full bg-white border-2 border-[#5A7A5C] flex-shrink-0 z-10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#5A7A5C]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#5A7A5C] tracking-widest">{milestone.year}</span>
                        <span className="text-[#1A2E35]/80 font-sans-clean leading-snug">{milestone.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Impact Block */}
            <div className="mt-24 bg-[#1A2E35] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#5A7A5C_0%,transparent_50%)]" />
              </div>
              
              <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-display border-b border-white/10 pb-4">Our Impact</h3>
                  <p className="text-white/60 font-sans-clean italic">
                    "Our journey from one clinic to eight cities. From local practice to a national movement."
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 pt-4 leading-relaxed">
                    Our founder also serves as Jilla Adhyaksha (District President) of Karnataka Paramparika Vaidya Sangha.
                  </p>
                </div>
                
                <div className="lg:col-span-2 grid grid-cols-2 gap-8 md:gap-12">
                  {[
                    { val: "26+", label: "Ancestral Products" },
                    { val: "8", label: "Cities Presence" },
                    { val: "100+", label: "Medical Camps" },
                    { val: "100k+", label: "Lives Healed" },
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-3xl md:text-5xl font-display text-[#5A7A5C]">{stat.val}</div>
                      <div className="text-xs md:text-sm uppercase tracking-widest text-white/60 font-bold">{stat.label}</div>
                    </div>
                  ))}
                  <div className="col-span-2 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#5A7A5C]/20 rounded-xl text-[#5A7A5C]">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">Karnataka's No.1</div>
                        <div className="text-xs text-white/60 uppercase tracking-widest">Non-surgical piles treatment</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Awards Hybrid Logic */}
            <div className="mt-24">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-display font-medium text-[#1A2E35]">Achievements and Awards</h3>
                <p className="text-[#1A2E35]/60 mt-2 font-sans-clean">Validation of our authentic practice and dedication.</p>
              </div>

              {/* Comprehensive Honors List */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                {[
                  { year: "2009", title: "Noble Man Award (Karnataka Sangha, Mumbai)" },
                  { year: "2017", title: "Vaidya Seva Ratna Award (Shimoga)" },
                  { year: "2017", title: "Gadi Nadu Award" },
                  { year: "2019", title: "Nava Rathna Award (Rudraksha Foundation)" },
                  { year: "2024", title: "National Health Award (Non‑surgical piles medicine)" },
                  { year: "2025", title: "Vaidya Seva Ratna Award" },
                  { year: "2025", title: "Taluku Kannada Rajyotsava Award" },
                  { year: "2025", title: "Karunada Ratna Award (Samaj Seva category)" },
                ].map((honor, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-[#F2EDE4]/50 hover:border-[#5A7A5C]/30 transition-colors">
                    <div className="text-xs font-bold text-[#5A7A5C] w-12 shrink-0">{honor.year}</div>
                    <div className="w-[1px] h-4 bg-[#F2EDE4]" />
                    <div className="text-sm text-[#1A2E35]/80 font-medium">{honor.title}</div>
                  </div>
                ))}
              </div>

              {/* Featured Awards (with images) */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Foundation Ceremony 2006", year: "2006", img: awardIMG7921 },
                  { title: "Taluku Kannada Rajyotsa award (2025)", year: "2025", img: awardIMG7909 },
                  { title: "Karunada Ratna Award (2025)", year: "2025", img: awardIMG7918 },
                  { title: "Nava Rathna Award 2019", year: "2019", img: awardIMG7913 },
                  { title: "National Health Award 2025", year: "2025", img: awardIMG7916 },
                  { title: "Vaidya Seva Ratna Award", year: "2025", img: awardIMG7915 },
                  { title: "Noble Man Award (Mumbai)", year: "2009", img: awardNobleMan },
                ].map((award, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedAward({ title: award.title, img: award.img })}
                    className="bg-white rounded-3xl overflow-hidden border border-[#F2EDE4] shadow-sm group cursor-pointer"
                  >
                    <div className="aspect-[4/5] bg-gray-100 relative">
                      <img src={award.img} alt={award.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-[#1A2E35]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 text-white transform scale-90 group-hover:scale-100 transition-transform">
                          <Maximize2 className="h-6 w-6" />
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-[#C5A059]">{award.year}</div>
                        <div className="text-base md:text-xl font-display leading-tight drop-shadow-lg">{award.title}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Ending Narrative & CTA */}
            <div className="mt-24 text-center max-w-2xl mx-auto">
              <p className="text-[#1A2E35]/60 mb-8 italic">
                From one clinic to eight cities. From two ancestral formulations to 26+ trusted products. From local practice to a national movement.
              </p>
              <Link to="/shop" className="inline-flex items-center gap-3 px-12 py-5 bg-[#5A7A5C] text-white rounded-xl font-bold tracking-[0.2em] uppercase text-xs hover:bg-[#4a654c] transition-all shadow-xl shadow-[#5A7A5C]/20 group">
                Explore Our Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3) Philosophy */}
        <section className="py-8 bg-[#F8F9FA]">
          <div className="container px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-medium text-[#1A2E35] mb-2">Purity. Precision. Proof.</h2>
              <p className="text-[#1A2E35]/60 font-sans-clean">The three pillars that define the Salmara standard.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div whileHover={{ y: -5 }} className="bg-white p-10 rounded-3xl shadow-sm border border-[#F2EDE4] space-y-6">
                <div className="h-14 w-14 bg-[#5A7A5C]/5 rounded-2xl flex items-center justify-center text-[#5A7A5C]">
                  <Leaf className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-display font-medium text-[#1A2E35]">Purity</h3>
                <p className="text-[#1A2E35]/60 font-sans-clean leading-relaxed">
                  Ethically sourced from the richest soil, every ingredient is verified and tested for absolute authenticity before it enters our lab.
                </p>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} className="bg-white p-10 rounded-3xl shadow-sm border border-[#F2EDE4] space-y-6">
                <div className="h-14 w-14 bg-[#5A7A5C]/5 rounded-2xl flex items-center justify-center text-[#5A7A5C]">
                  <Microscope className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-display font-medium text-[#1A2E35]">Precision</h3>
                <p className="text-[#1A2E35]/60 font-sans-clean leading-relaxed">
                  Our GMP-certified manufacturing processes combine traditional extraction techniques with advanced modern quality controls for consistency.
                </p>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} className="bg-white p-10 rounded-3xl shadow-sm border border-[#F2EDE4] space-y-6">
                <div className="h-14 w-14 bg-[#5A7A5C]/5 rounded-2xl flex items-center justify-center text-[#5A7A5C]">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-display font-medium text-[#1A2E35]">Proof</h3>
                <p className="text-[#1A2E35]/60 font-sans-clean leading-relaxed">
                  Guided by clinical evidence and validated processes, every batch is tested and trusted by thousands for its predictable efficiency.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4) Certification Gallery */}
        <section className="py-8 md:py-10 container px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-medium text-[#1A2E35] mb-3">Approved by Standards That Matter</h2>
            <p className="text-[#1A2E35]/60 font-sans-clean leading-relaxed">
              Integrity is not just a word; it’s a certification. Our facility and products undergo rigorous external audits to ensure they meet the highest global standards.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-[#F2EDE4] rounded-2xl text-center">
              <h4 className="text-lg font-display font-bold text-[#1A2E35] mb-1">GMP Certified</h4>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-4">Quality Council of India</p>
              <p className="text-sm text-[#1A2E35]/60 font-sans-clean">Ensuring our manufacturing products are consistently produced and controlled according to quality standards.</p>
            </div>
            
            <div className="p-8 border border-[#F2EDE4] rounded-2xl text-center">
              <h4 className="text-lg font-display font-bold text-[#1A2E35] mb-1">ISO 9001:2015</h4>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-4">International Standards Organization</p>
              <p className="text-sm text-[#1A2E35]/60 font-sans-clean">Globally recognized standard for Quality Management Systems, focused on customer satisfaction and quality delivery.</p>
            </div>
            
            <div className="p-8 border border-[#F2EDE4] rounded-2xl text-center">
              <h4 className="text-lg font-display font-bold text-[#1A2E35] mb-1">AYUSH License</h4>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-4">Ministry of AYUSH, Govt. of India</p>
              <p className="text-sm text-[#1A2E35]/60 font-sans-clean">Full regulatory compliance for traditional Ayurvedic formulations and clinical procedures.</p>
            </div>
            
            <div className="p-8 border border-dashed border-[#F2EDE4] rounded-2xl text-center flex flex-col items-center justify-center min-h-[200px]">
              <p className="text-xs font-bold text-[#1A2E35]/20 uppercase tracking-widest">Add your certificate here</p>
            </div>
          </div>
        </section>



        {/* 7) The Process - Science Behind Every Drop */}
        <section className="py-10 md:py-12 bg-[#F8F9FA] overflow-hidden">
          <div className="container px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              {/* Left visuals */}
              <div className="w-full lg:w-1/2 relative">
                <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl">
                  <img 
                    src={aboutLab || "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=2070&auto=format&fit=crop"} 
                    alt="Salmara Labs" 
                    className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E35]/40 to-transparent" />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -top-6 -right-6 w-48 h-48 bg-[#5A7A5C]/5 rounded-full blur-3xl -z-10" />
              </div>

              {/* Right copy */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-display font-medium text-[#1A2E35]">Science Behind <br /> Every Drop</h2>
                  <p className="text-[#1A2E35]/60 font-sans-clean leading-relaxed text-lg">
                    Behind-the-scenes view of Salmara's labs and processes — transparent, factual, and elegant.
                  </p>
                </div>
                
                <div className="relative pl-8 border-l-2 border-[#C5A059]/30 py-4">
                  <p className="text-[#1A2E35]/80 font-sans-clean italic leading-relaxed text-lg">
                    "Every Salmara product follows a path of precision — from sourcing verified herbs to controlled formulation and purity testing. Every batch is standardized, GMP-audited, and produced under the supervision of experts."
                  </p>
                </div>

                <div className="pt-4">
                  <Link to="/shop" className="inline-flex items-center gap-3 px-10 py-4 bg-[#5A7A5C] text-white rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-[#4a654c] transition-all shadow-lg shadow-[#5A7A5C]/20 group">
                    Explore Our Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 4-Step Horizontal Infographic */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
                {[
                  { 
                    title: "Raw Material Verification", 
                    desc: "Herbs sourced from trusted Ayurvedic farms, authenticated by lab reports.",
                    icon: <Leaf className="h-6 w-6" />,
                    step: "01"
                  },
                  { 
                    title: "Quality Testing & Formulation", 
                    desc: "Active ingredients measured under strict GMP protocols.",
                    icon: <Microscope className="h-6 w-6" />,
                    step: "02"
                  },
                  { 
                    title: "Packaging & Labelling", 
                    desc: "Hygienic bottling, compliant with ISO & AYUSH standards.",
                    icon: <FlaskConical className="h-6 w-6" />,
                    step: "03"
                  },
                  { 
                    title: "Distribution & Feedback", 
                    desc: "Each batch traceable by QR code, ensuring transparency from production to customer.",
                    icon: <ShieldCheck className="h-6 w-6" />,
                    step: "04"
                  }
                ].map((item, i, arr) => (
                  <div key={i} className="relative group p-8 lg:p-12 bg-white lg:bg-transparent hover:bg-white lg:hover:bg-white/50 transition-all duration-500 rounded-3xl lg:rounded-none lg:first:rounded-l-3xl lg:last:rounded-r-3xl border border-[#F2EDE4] lg:border-r-0 lg:last:border-r">
                    <div className="space-y-8">
                      {/* Step Visual */}
                      <div className="relative">
                        <div className="h-20 w-44 bg-[#F2EDE4] clip-chevron flex items-center justify-center text-[#5A7A5C] group-hover:bg-[#C5A059]/10 transition-colors">
                          <div className="transform -translate-x-2">
                            {item.icon}
                          </div>
                        </div>
                        <span className="absolute top-0 right-8 text-4xl font-display text-[#1A2E35]/5 font-bold group-hover:text-[#C5A059]/20 transition-colors">
                          {item.step}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h4 className="font-display font-bold text-[#1A2E35] text-lg leading-tight group-hover:text-[#5A7A5C] transition-colors">{item.title}</h4>
                        <p className="text-sm text-[#1A2E35]/60 font-sans-clean leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    
                    {/* Horizontal Arrow (Desktop Only) */}
                    {i < arr.length - 1 && (
                      <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 hidden lg:block">
                        <div className="h-8 w-8 bg-white border border-[#F2EDE4] rounded-full flex items-center justify-center text-[#C5A059] shadow-sm">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            .clip-chevron {
              clip-path: polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%);
            }
          `}} />
        </section>

        {/* Testimonials */}
        <section className="py-10 container px-4 overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-display font-medium text-[#1A2E35]">Trust in Every Word</h2>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-[#FDFBF7] p-10 rounded-3xl border border-[#F2EDE4] relative">
              <div className="absolute top-8 right-8 text-[#5A7A5C]/10 text-6xl font-display self-end">“</div>
              <p className="text-[#1A2E35]/80 font-sans-clean italic leading-relaxed mb-6">
                "Having used various brands, the transparency Salmara offers through their testing certificates changed how I perceive Ayurveda. It’s effective and reliable."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-[#5A7A5C]/10 rounded-full flex items-center justify-center text-[#5A7A5C] font-bold text-xs">RK</div>
                <div>
                  <p className="font-bold text-[#1A2E35] text-sm">Rakesh K.</p>
                  <p className="text-[10px] uppercase text-[#1A2E35]/40 tracking-widest">Verified Customer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#FDFBF7] p-10 rounded-3xl border border-[#F2EDE4] relative">
              <div className="absolute top-8 right-8 text-[#5A7A5C]/10 text-6xl font-display self-end">“</div>
              <p className="text-[#1A2E35]/80 font-sans-clean italic leading-relaxed mb-6">
                "Finally, an Ayurvedic brand that prioritizes quality standards over marketing. Their products have become a staple in my wellness routine."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-[#5A7A5C]/10 rounded-full flex items-center justify-center text-[#5A7A5C] font-bold text-xs">SP</div>
                <div>
                  <p className="font-bold text-[#1A2E35] text-sm">Sunita P.</p>
                  <p className="text-[10px] uppercase text-[#1A2E35]/40 tracking-widest">Wellness Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8) Closing Section */}
        <section className="py-10 md:py-12 bg-[#FDFBF7] border-t border-[#F2EDE4]">
          <div className="container px-4 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-display font-medium text-[#1A2E35] mb-6">A Legacy of Trust</h2>
            <div className="space-y-6 text-[#1A2E35]/70 font-sans-clean leading-relaxed text-lg mb-12">
              <p>
                From a single humble lab in Karnataka to homes across Bharat, our journey has always been about one thing: the belief that Ayurveda deserves scientific rigor.
              </p>
              <p>
                At Salmara, we are building a space where faith meets evidence and healing meets honesty. Thank you for being a part of our story.
              </p>
            </div>
            <Link to="/shop" className="inline-block px-12 py-5 bg-[#5A7A5C] text-white rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-[#4a654c] transition-all shadow-2xl shadow-[#5A7A5C]/30 transform hover:-translate-y-1">
              Explore Our Products
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Lightbox for Award Images */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAward(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-6 cursor-default"
            >
              <button 
                onClick={() => setSelectedAward(null)}
                className="absolute top-0 -right-4 md:-right-12 p-2 text-white/50 hover:text-white transition-colors"
                title="Close"
              >
                <X className="h-8 w-8" />
              </button>
              
              <div className="w-full h-full overflow-hidden rounded-2xl bg-[#1A2E35]/20 flex items-center justify-center">
                <img 
                  src={selectedAward.img} 
                  alt={selectedAward.title} 
                  className="max-w-full max-h-full object-contain shadow-2xl"
                />
              </div>
              
              <div className="text-center text-white space-y-2">
                <h4 className="text-2xl font-display">{selectedAward.title}</h4>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">Salmara Ayurveda Achievements</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper component for Leaf icon since it's used frequently
const Leaf = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 10Z" />
    <path d="M7 21q-4 -1 -4 -5c0 -4.48 7 -5 7 -5" />
  </svg>
);

export default AboutUsPage;

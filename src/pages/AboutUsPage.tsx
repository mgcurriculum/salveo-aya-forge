import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Award, ShieldCheck, Microscope, FlaskConical, MapPin, ArrowRight, ChevronRight } from "lucide-react";

// Award Images
import awardIMG7913 from "@/awards/IMG_7913.JPG";
import awardIMG7915 from "@/awards/IMG_7915.JPG";
import awardIMG7916 from "@/awards/IMG_7916.JPG";

// Assets
import aboutLab from "@/assets/about-lab.jpg";

const AboutUsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <main className="relative">
        <div className="absolute top-32 left-4 md:left-8 lg:left-12 z-20">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
          </button>
        </div>
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
                <a href="#consultation" className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-white/20 transition-all">
                  Discover Our Clinics
                </a>
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

        {/* 5) Our Journey */}
        <section className="py-10 bg-[#1A2E35] text-white">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-display font-medium mb-3">From Karnataka to the World</h2>
              <p className="text-white/60 font-sans-clean">A timeline of milestones and scientific achievements.</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-12 relative">
              <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
              
              {[
                { step: "1", year: "2022", title: "Emerging Ayurvedic Brand of the Year", desc: "AYUSH Excellence Awards, Bengaluru" },
                { step: "2", year: "2023", title: "Innovation in Herbal Formulation", desc: "Indian Herbal Summit" },
                { step: "3", year: "2024", title: "Excellence in GMP Compliance", desc: "Karnataka Herbal Manufacturers' Association" },
                { step: "4", year: "2024", title: "Ayurveda for Modern Life", desc: "National Wellness Innovation Forum" }
              ].map((milestone, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-4 md:gap-0 relative`}
                >
                  {/* Left Column (Desktop - Step 1, 3) */}
                  <div className={`w-full md:w-1/2 flex flex-col px-8 ${idx % 2 === 0 ? 'md:items-end md:text-right' : 'opacity-0 pointer-events-none hidden md:flex'}`}>
                    <div className="space-y-3">
                      <span className="text-3xl md:text-5xl font-display text-[#C5A059] block mb-2">{milestone.year}</span>
                      <h4 className="text-lg md:text-2xl font-bold leading-tight text-white mb-1">{milestone.title}</h4>
                      <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">{milestone.desc}</p>
                    </div>
                  </div>
                  
                  {/* Center Dot */}
                  <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-[#5A7A5C] border-4 border-[#1A2E35] flex items-center justify-center shrink-0 z-20 shadow-2xl shadow-black group hover:scale-110 transition-transform">
                    <span className="text-white text-base md:text-xl font-display font-medium">{milestone.step}</span>
                  </div>
                  
                  {/* Right Column (Desktop - Step 2, 4) */}
                  <div className={`w-full md:w-1/2 flex flex-col px-8 ${idx % 2 !== 0 ? 'md:items-start md:text-left' : 'opacity-0 pointer-events-none hidden md:flex'}`}>
                    <div className="space-y-3">
                      <span className="text-3xl md:text-5xl font-display text-[#C5A059] block mb-2">{milestone.year}</span>
                      <h4 className="text-lg md:text-2xl font-bold leading-tight text-white mb-1">{milestone.title}</h4>
                      <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">{milestone.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6) Awards & Recognitions */}
        <section className="py-8 md:py-10 container px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-medium text-[#1A2E35] mb-2">Honoured for Our Integrity</h2>
            <p className="text-[#1A2E35]/60 font-sans-clean leading-relaxed">Building trust with the community and industry peers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                img: awardIMG7916, 
                title: "Excellence in Ayurveda", 
                subtitle: "Honouring integrity and traditional wisdom in modern wellness.",
                year: "2024" 
              },
              { 
                img: awardIMG7915, 
                title: "Quality Leadership Award", 
                subtitle: "Recognized for uncompromising standards in herbal manufacturing.",
                year: "2024" 
              },
              { 
                img: awardIMG7913, 
                title: "Herbal Innovation Award", 
                subtitle: "For pioneering scientific research in plant-based healing.",
                year: "2023" 
              }
            ].map((award, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-[#F2EDE4] rounded-3xl overflow-hidden group hover:border-[#C5A059] transition-all duration-500 shadow-sm hover:shadow-xl"
              >
                <div className="aspect-square w-full relative overflow-hidden bg-[#F8F9FA]">
                  <img 
                    src={award.img} 
                    alt={award.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                      <Award className="h-6 w-6 text-[#C5A059]" />
                    </div>
                  </div>
                </div>
                <div className="p-8 text-center border-t border-[#F2EDE4]">
                  <div className="flex justify-center mb-4">
                    <Award className="h-5 w-5 text-[#C5A059] opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h5 className="font-display font-bold text-[#1A2E35] text-lg mb-2">{award.title}</h5>
                  <p className="text-sm text-[#1A2E35]/50 font-sans-clean leading-relaxed">{award.subtitle}</p>
                </div>
              </motion.div>
            ))}
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

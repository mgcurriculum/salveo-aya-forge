import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  MessageSquare, 
  Users, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Clock,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ContactPage = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [activeRoute, setActiveRoute] = useState<'support' | 'clinic' | 'affiliate'>('support');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
      toast.success("Message sent successfully!", {
        description: "We've received your inquiry and will get back to you soon.",
        className: "font-sans-clean",
      });
    }, 1500);
  };

  const contactRoutes = [
    {
      id: 'support' as const,
      title: "Product Support",
      desc: "For inquiries about orders, ingredients, or general wellness advice.",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "bg-[#5A7A5C]/5 text-[#5A7A5C]"
    },
    {
      id: 'clinic' as const,
      title: "Clinic Services",
      desc: "For appointment inquiries, treatment details, or medical reports.",
      icon: <MapPin className="h-6 w-6" />,
      color: "bg-[#C5A059]/5 text-[#C5A059]"
    },
    {
      id: 'affiliate' as const,
      title: "Brand & Affiliate",
      desc: "For partnerships, retail inquiries, or wholesale collaborations.",
      icon: <Users className="h-6 w-6" />,
      color: "bg-[#1A2E35]/5 text-[#1A2E35]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-8 md:pt-16 md:pb-10 overflow-hidden">
          <div className="absolute inset-0 bg-white">
            {/* <img 
              src="/C:/Users/Admin/.gemini/antigravity/brain/81674a61-4351-4cc1-be3e-ca84fc1e49a0/salmara_contact_bg_1773572963140.png" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" 
              alt="Soft focus background"
            /> */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FDFBF7]/80 to-[#FDFBF7]" />
          </div>
          
          <div className="container mx-auto px-6 md:px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-[26px] sm:text-4xl md:text-6xl font-display font-medium text-[#1A2E35] mb-4 tracking-tight leading-tight px-2">
                Connect With <span className="italic font-normal">Salmara Ayurveda</span>
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-[#1A2E35]/60 font-sans-clean max-w-xl mx-auto leading-relaxed px-4">
                Have a question, feedback, or collaboration idea? We'd love to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* QUICK CONTACT OPTIONS */}
        <section className="pt-8 pb-16 container mx-auto px-6 md:px-4">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto items-stretch">
            {/* General Enquiries Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border-2 border-[#1A2E35]/5 rounded-[2.5rem] p-6 sm:p-10 pt-16 text-center relative group hover:shadow-2xl hover:shadow-[#1A2E35]/10 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 sm:h-16 sm:w-16 bg-[#1A2E35] rounded-full flex items-center justify-center text-white shadow-xl z-20 group-hover:scale-110 transition-transform duration-500">
                <MessageSquare className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#1A2E35]/10 rounded-t-[2.5rem]" />
              
              <h3 className="text-2xl font-display font-bold text-[#1A2E35] mb-4">General Enquiries</h3>
              <p className="text-sm text-[#1A2E35]/50 leading-relaxed font-sans-clean px-2 mb-8">
                For questions about products, orders, or website support.
              </p>
              
              <div className="mt-auto pt-8 border-t border-[#F2EDE4] space-y-4">
                <p className="text-[10px] font-bold text-[#1A2E35]/40 uppercase tracking-[0.2em]">Primary Email</p>
                <a 
                  href="mailto:support@salmaraherbals.com" 
                  className="bg-[#5A7A5C] text-white py-4 px-2 sm:px-4 rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-[0.2em] flex items-center justify-center gap-1 sm:gap-2 hover:bg-[#5A7A5C]/90 transition-all shadow-lg shadow-[#5A7A5C]/10 break-all sm:break-normal"
                >
                  support@salmaraherbals.com 
                  {/* <Mail className="h-3 w-3 shrink-0" /> */}
                </a>
              </div>
            </motion.div>

            {/* Clinic & Consultations Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border-2 border-[#1A2E35]/5 rounded-[2.5rem] p-10 pt-16 text-center relative group hover:shadow-2xl hover:shadow-[#1A2E35]/10 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 sm:h-16 sm:w-16 bg-[#1A2E35] rounded-full flex items-center justify-center text-white shadow-xl z-20 group-hover:scale-110 transition-transform duration-500">
                <MapPin className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#1A2E35]/10 rounded-t-[2.5rem]" />

              <h3 className="text-2xl font-display font-bold text-[#1A2E35] mb-4">Clinic & Consultations</h3>
              <p className="text-sm text-[#1A2E35]/50 leading-relaxed font-sans-clean px-2 mb-8">
                For appointments, doctor availability, or treatment info.
              </p>
              
              <div className="mt-auto pt-8 border-t border-[#F2EDE4] space-y-4">
                <p className="text-[10px] font-bold text-[#1A2E35]/40 uppercase tracking-[0.2em]">Secure Booking</p>
                <a 
                  href="https://wa.me/919353436373?text=Hello%20Salmara%20Team,%20I%20would%20like%20to%20book%20an%20Ayurvedic%20consultation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1A2E35] text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#1A2E35]/90 transition-all shadow-lg shadow-[#1A2E35]/10"
                >
                  Book Appointment <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* Affiliate & Partnerships Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border-2 border-[#1A2E35]/5 rounded-[2.5rem] p-10 pt-16 text-center relative group hover:shadow-2xl hover:shadow-[#1A2E35]/10 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 sm:h-16 sm:w-16 bg-[#1A2E35] rounded-full flex items-center justify-center text-white shadow-xl z-20 group-hover:scale-110 transition-transform duration-500">
                <Users className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#1A2E35]/10 rounded-t-[2.5rem]" />

              <h3 className="text-2xl font-display font-bold text-[#1A2E35] mb-4">Affiliate & Partnerships</h3>
              <p className="text-sm text-[#1A2E35]/50 leading-relaxed font-sans-clean px-2 mb-8">
                For collaborations, commissions, or marketing tie-ups.
              </p>
              
              <div className="mt-auto pt-8 border-t border-[#F2EDE4] space-y-4">
                <p className="text-[10px] font-bold text-[#1A2E35]/40 uppercase tracking-[0.2em]">Join Network</p>
                <Link 
                  to="/affiliate"
                  className="bg-[#1A2E35] text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#1A2E35]/90 transition-all shadow-lg shadow-[#1A2E35]/10"
                >
                  Join the Program <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* COMMUNICATION HUB SECTION */}
        <section className="py-16 md:py-20 bg-white border-y border-[#F2EDE4]">
          <div className="container mx-auto px-6 md:px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
              
              {/* DETAILS SIDE */}
              <div className="space-y-12">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-[#1A2E35] mb-6 whitespace-nowrap">Our Communication Hub</h2>
                  <p className="text-[#1A2E35]/60 leading-relaxed font-sans-clean">
                    For us, Ayurveda is a dialogue. We've dedicated teams for each touchpoint to ensure your inquiry reaches the right hands instantly.
                  </p>
                </div>
                
                <div className="space-y-8">
                  <div className="flex gap-6 items-start">
                    <div className="h-12 w-12 bg-white rounded-2xl border border-[#F2EDE4] flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-[#5A7A5C]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 mb-1">Direct Email</p>
                      <p className="text-[#1A2E35] font-sans-clean font-medium">wellness@salmara.com</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 items-start">
                    <div className="h-12 w-12 bg-white rounded-2xl border border-[#F2EDE4] flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-[#C5A059]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 mb-1">Clinic Concierge</p>
                      <p className="text-[#1A2E35] font-sans-clean font-medium">+91 80 4932 2300</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 items-start">
                    <div className="h-12 w-12 bg-white rounded-2xl border border-[#F2EDE4] flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-blue-500/50" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 mb-1">Response Time</p>
                      <p className="text-[#1A2E35] font-sans-clean font-medium">Within 24 Business Hours</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <div className="p-8 rounded-3xl bg-white border border-[#F2EDE4] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Send className="h-20 w-20 rotate-12" />
                    </div>
                    <h4 className="font-display font-medium text-[#1A2E35] mb-2">Need a faster response?</h4>
                    <p className="text-xs text-[#1A2E35]/50 leading-relaxed mb-6 font-sans-clean">Chat with our experts on WhatsApp for immediate product guidance.</p>
                    <a 
                      href="https://wa.me/919353436373?text=Hello%20Salmara%20Team,%20I%20would%20like%20to%20know%20more%20about%20your%20Ayurvedic%20wellness%20products."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#5A7A5C] uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-transform"
                    >
                      Open WhatsApp <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* FORM SIDE */}
              <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-[#F2EDE4] shadow-2xl shadow-[#1A2E35]/5 relative">
                <AnimatePresence mode="wait">
                  {formState === 'success' ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="h-20 w-20 bg-[#5A7A5C] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-[#5A7A5C]/20">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-display font-medium text-[#1A2E35] mb-4">Message Transmitted</h3>
                      <p className="text-sm text-[#1A2E35]/60 font-sans-clean max-w-xs mx-auto mb-10">We've received your inquiry. A Salmara representative will be in touch shortly.</p>
                      <button 
                        onClick={() => setFormState('idle')}
                        className="text-xs font-bold text-[#5A7A5C] uppercase tracking-widest underline underline-offset-8"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      <div className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 ml-1">Full Name</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Advait Sharma"
                              className="w-full px-6 py-4 bg-[#F8F9FA] border border-[#F2EDE4] rounded-2xl text-sm font-sans-clean focus:outline-none focus:border-[#5A7A5C] transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 ml-1">Email Address</label>
                            <input 
                              type="email" 
                              required
                              placeholder="name@example.com"
                              className="w-full px-6 py-4 bg-[#F8F9FA] border border-[#F2EDE4] rounded-2xl text-sm font-sans-clean focus:outline-none focus:border-[#5A7A5C] transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 ml-1">Phone Number</label>
                            <input 
                              type="tel" 
                              required
                              placeholder="e.g. +91 99999 99999"
                              className="w-full px-6 py-4 bg-[#F8F9FA] border border-[#F2EDE4] rounded-2xl text-sm font-sans-clean focus:outline-none focus:border-[#5A7A5C] transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 ml-1">Category of Query</label>
                            <select 
                              required
                              className="w-full px-6 py-4 bg-[#F8F9FA] border border-[#F2EDE4] rounded-2xl text-sm font-sans-clean focus:outline-none focus:border-[#5A7A5C] transition-colors appearance-none cursor-pointer"
                            >
                              <option value="" disabled selected>Select Category</option>
                              <option value="product">Product Inquiry</option>
                              <option value="order">Order/Shipping</option>
                              <option value="clinic">Consultation / Clinic</option>
                              <option value="partnership">Affiliate / Business Partnership</option>
                              <option value="feedback">Feedback / Suggestion</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 ml-1">How can we help?</label>
                          <textarea 
                            required
                            rows={5}
                            placeholder="Tell us about your inquiry..."
                            className="w-full px-6 py-4 bg-[#F8F9FA] border border-[#F2EDE4] rounded-2xl text-sm font-sans-clean focus:outline-none focus:border-[#5A7A5C] transition-colors resize-none"
                          />
                        </div>

                        <div className="flex items-start gap-3 px-1 pt-2">
                          <input type="checkbox" className="mt-1 accent-[#5A7A5C]" id="privacy" required />
                          <label htmlFor="privacy" className="text-[10px] text-[#1A2E35]/40 font-sans-clean leading-relaxed cursor-pointer">
                            I agree to Salmara's Privacy Policy and consent to being contacted regarding my inquiry.
                          </label>
                        </div>
                      </div>

                      <button 
                        disabled={formState === 'submitting'}
                        className="w-full bg-[#1A2E35] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#1A2E35]/90 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#1A2E35]/20 disabled:opacity-50"
                      >
                        {formState === 'submitting' ? (
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Send Message <Send className="h-3 w-3" /></>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* CLINIC HIGHLIGHTS */}
        <section className="py-16 container mx-auto px-6 md:px-4 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
              <div className="max-w-xl">
                <h2 className="text-3xl font-display font-medium text-[#1A2E35] mb-6">Visit Our Sanctuary</h2>
                <p className="text-[#1A2E35]/60 font-sans-clean leading-relaxed">
                  Experience Ayurvedic wisdom in person. Our certified clinics offer personalized consultations and a full range of standardized treatments.
                </p>
              </div>
              <Link 
                to="/clinics"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5A7A5C] border-b-2 border-[#5A7A5C]/20 pb-1 hover:border-[#5A7A5C] transition-all"
              >
                Explore All Clinics <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;

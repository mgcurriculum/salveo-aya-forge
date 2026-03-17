import React, { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clinicImg from "@/assets/clinics-page.png";
import { 
  Search, 
  MapPin, 
  Clock, 
  Video, 
  UserCheck, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Minus,
  Navigation,
  Calendar,
  Stethoscope,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const ClinicsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [treatmentFilter, setTreatmentFilter] = useState("All");
  const [consultType, setConsultType] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<number>(1);

  const clinics = [
    {
      id: 1,
      name: "Salmara Wellness Center - Indiranagar",
      address: "123, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Salmara+Wellness+Center+Indiranagar+Bengaluru",
      embedQuery: "Salmara+Wellness+Center+Indiranagar+Bengaluru",
      hours: "Mon - Sat: 09:00 AM - 08:00 PM",
      availability: "Next available: Tomorrow, 10:00 AM",
      city: "Bengaluru",
      type: "In-Person",
      specialties: ["Pain Relief", "Liver Detox"]
    },
    {
      id: 2,
      name: "Salmara Ayurveda Hub - Jayanagar",
      address: "45, 4th Block, Jayanagar, Bengaluru, Karnataka 560011",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Salmara+Ayurveda+Hub+Jayanagar+Bengaluru",
      embedQuery: "Salmara+Ayurveda+Hub+Jayanagar+Bengaluru",
      hours: "Mon - Sun: 10:00 AM - 07:00 PM",
      availability: "Next available: Today, 04:30 PM",
      city: "Bengaluru",
      type: "In-Person",
      specialties: ["Women's Wellness", "Digestion"]
    },
    {
      id: 3,
      name: "Salmara Virtual Clinic - India Metro",
      address: "Online / Video Consultation",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Salmara+Health+India",
      embedQuery: "India",
      hours: "Mon - Sat: 08:00 AM - 09:00 PM",
      availability: "Next available: Tomorrow, 09:00 AM",
      city: "Digital",
      type: "Virtual",
      specialties: ["Immunity", "Skin Care", "Stress Management"]
    }
  ];

  const filteredClinics = useMemo(() => {
    return clinics.filter(clinic => {
      const matchesSearch = 
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCity = cityFilter === "All" || cityFilter === "All Locations" || clinic.city === cityFilter;
      const matchesType = consultType === "All" || consultType === "All Types" || clinic.type === consultType;
      
      const matchesTreatment = treatmentFilter === "All" || treatmentFilter === "All Treatments" || 
        clinic.specialties.some(s => s.toLowerCase().includes(treatmentFilter.toLowerCase()));

      return matchesSearch && matchesCity && matchesType && matchesTreatment;
    });
  }, [searchQuery, cityFilter, consultType, treatmentFilter]);

  const treatments = [
    { 
      title: "Pain & Mobility", 
      desc: "Natural oils and therapies to relieve joint and muscle pain.",
      icon: <Plus className="h-6 w-6" />
    },
    { 
      title: "Liver & Detox", 
      desc: "Herbal tonics to cleanse and rejuvenate your system.",
      icon: <ShieldCheck className="h-6 w-6" />
    },
    { 
      title: "Women's Wellness", 
      desc: "Ayurvedic care for hormonal balance and comfort.",
      icon: <UserCheck className="h-6 w-6" />
    },
    { 
      title: "Gut & Digestive Health", 
      desc: "Remedies for better digestion and metabolism.",
      icon: <ChevronRight className="h-6 w-6" />
    },
    { 
      title: "Immunity & Respiratory Health", 
      desc: "Tulsi-based blends for daily defense and breathing support.",
      icon: <ArrowRight className="h-6 w-6" />
    }
  ];

  const faqs = [
    { q: "How long is each consultation?", a: "Initial consultations typically last 45-60 minutes to allow for a comprehensive Prakriti (constitution) analysis and health history review. Follow-ups are generally 20-30 minutes." },
    { q: "Can I book online and visit in person?", a: "Yes, our integrated platform allows you to select your preferred clinic, book your slot online, and visit our physical location for your consultation." },
    { q: "Is my booking confirmed immediately?", a: "Absolutely. Once you complete the 5-step booking process, you will receive an instant confirmation via email and SMS with all relevant details." },
    { q: "What if I need to reschedule?", a: "You can easily reschedule through your User Dashboard or the link in your confirmation email up to 4 hours before the appointment time." },
    { q: "Do you offer follow-up sessions?", a: "Yes, continuity of care is central to our philosophy. Your doctor will recommend a follow-up schedule tailored to your personal treatment plan." },
    { q: "Do you provide treatment plans or product recommendations?", a: "Following your consultation, you will receive a personalized wellness protocol, which may include dietary guidance, lifestyle adjustments, and recommendations from our tested product range." }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <main className="relative">
        {/* 1) Hero Section */}
        <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 bg-[#F2EDE4] overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
            <img 
              // src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop" 
              src={clinicImg}
              alt="Ayurvedic Consultation" 
              className="w-full h-full object-cover grayscale-[20%] opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F2EDE4] to-transparent" />
          </div>
          
          <div className="container relative z-10 px-4">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-xl"
            >
              <h1 className="text-4xl md:text-6xl font-display font-medium text-[#1A2E35] mb-6 leading-tight">
                Personalized <br /> Ayurvedic Care, <br /> Near You.
              </h1>
              <p className="text-lg text-[#1A2E35]/70 font-sans-clean leading-relaxed mb-10">
                Visit our certified clinics or book a virtual consultation with Salmara’s Ayurvedic experts. Science-backed guidance for a balanced life.
              </p>
              <a 
                href="https://wa.me/919995731915?text=Hello%20Salmara%20Team,%20I%20would%20like%20to%20book%20an%20Ayurvedic%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5A7A5C] text-white px-10 py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-[#4a654c] transition-all shadow-xl shadow-[#5A7A5C]/20 transform hover:-translate-y-1 block w-fit"
              >
                Book Appointment
              </a>
            </motion.div>
          </div>
        </section>

        {/* 2 & 3) Search, Filter and Available Clinics Combined Container */}
        <div className="relative">
          {/* Search & Filter - Sticky but localized to this container */}
          <section className="py-8 bg-white border-b border-[#F2EDE4] sticky top-20 z-40 shadow-sm">
            <div className="container px-4">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1A2E35]/40" />
                  <input 
                    type="text" 
                    placeholder="Search by City / area / clinic name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] border border-[#F2EDE4] rounded-xl text-sm font-sans-clean focus:outline-none focus:border-[#5A7A5C] transition-colors"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 ml-1">City</label>
                    <select 
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="appearance-none bg-[#F8F9FA] border border-[#F2EDE4] rounded-xl px-4 py-3 text-xs font-sans-clean focus:outline-none cursor-pointer"
                    >
                      <option>All Locations</option>
                      <option>Bengaluru</option>
                      <option>Digital</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 ml-1">Treatment Type</label>
                    <select 
                      value={treatmentFilter}
                      onChange={(e) => setTreatmentFilter(e.target.value)}
                      className="appearance-none bg-[#F8F9FA] border border-[#F2EDE4] rounded-xl px-4 py-3 text-xs font-sans-clean focus:outline-none cursor-pointer"
                    >
                      <option>All Treatments</option>
                      <option>Pain & Mobility</option>
                      <option>Gut & Digestive Health</option>
                      <option>Liver & Detox</option>
                      <option>Women's Wellness</option>
                      <option>Immunity</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 ml-1">Type</label>
                    <select 
                      value={consultType}
                      onChange={(e) => setConsultType(e.target.value)}
                      className="appearance-none bg-[#F8F9FA] border border-[#F2EDE4] rounded-xl px-4 py-3 text-xs font-sans-clean focus:outline-none cursor-pointer"
                    >
                      <option>All Types</option>
                      <option>In-Person</option>
                      <option>Virtual</option>
                    </select>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-[#1A2E35]/40 italic mt-4 ml-1">Results updating in real-time based on your preferences.</p>
            </div>
          </section>

          {/* Clinic Cards & Map Grid */}
          <section className="py-16 container px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-medium text-[#1A2E35]">Available Clinics</h2>
                <div className="space-y-6">
                  {filteredClinics.length > 0 ? (
                    filteredClinics.map((clinic) => (
                      <motion.div 
                        key={clinic.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => clinic.type !== 'Virtual' && setSelectedClinicId(clinic.id)}
                        whileHover={{ scale: 1.01 }}
                        className={`p-8 rounded-2xl shadow-sm border transition-all cursor-pointer relative overflow-hidden ${
                          selectedClinicId === clinic.id 
                            ? 'bg-white border-[#5A7A5C] ring-1 ring-[#5A7A5C]/20 ring-offset-0' 
                            : 'bg-white border-[#F2EDE4] group hover:border-[#5A7A5C]/40'
                        }`}
                      >
                        {selectedClinicId === clinic.id && clinic.type !== 'Virtual' && (
                          <div className="absolute top-0 right-0 p-4">
                            <div className="h-2 w-2 bg-[#5A7A5C] rounded-full animate-ping" />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-2">
                            <h3 className={`text-xl font-display font-medium transition-colors ${selectedClinicId === clinic.id ? 'text-[#5A7A5C]' : 'text-[#1A2E35] group-hover:text-[#5A7A5C]'}`}>{clinic.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-[#1A2E35]/60 font-sans-clean">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span>{clinic.address}</span>
                            </div>
                            {clinic.type !== 'Virtual' && (
                              <a 
                                href={clinic.googleMapsUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-block text-[10px] text-[#C5A059] font-bold underline underline-offset-4 uppercase tracking-widest hover:text-[#B38D45] mt-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View on Google Maps
                              </a>
                            )}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${clinic.type === 'Virtual' ? 'bg-blue-50 text-blue-600' : 'bg-[#5A7A5C]/5 text-[#5A7A5C]'}`}>
                            {clinic.type === 'Virtual' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                            {clinic.type}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#F2EDE4]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40">
                              <Clock className="h-3 w-3" /> Operating Hours
                            </div>
                            <p className="text-xs font-sans-clean text-[#1A2E35]/80">{clinic.hours}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40">
                              <UserCheck className="h-3 w-3" /> Doctor Availability
                            </div>
                            <p className="text-xs font-sans-clean text-[#5A7A5C] font-bold">{clinic.availability}</p>
                          </div>
                        </div>
                        
                        <a 
                          href={`https://wa.me/919995731915?text=Hello%20Salmara%20Team,%20I%20would%20like%20to%20book%20an%20appointment%20at%20${encodeURIComponent(clinic.name)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-8 bg-[#5A7A5C] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#4a654c] transition-colors flex items-center justify-center"
                        >
                          Book Appointment
                        </a>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-12 text-center bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#F2EDE4] space-y-4"
                    >
                      <div className="h-16 w-16 bg-[#F2EDE4] rounded-full flex items-center justify-center mx-auto text-[#1A2E35]/20">
                        <Search className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-medium text-[#1A2E35]">No clinics found</h3>
                        <p className="text-sm text-[#1A2E35]/50 font-sans-clean mt-1">Try adjusting your filters or search keywords.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setSearchQuery("");
                          setCityFilter("All");
                          setTreatmentFilter("All");
                          setConsultType("All");
                        }}
                        className="text-xs font-bold text-[#5A7A5C] uppercase tracking-widest underline underline-offset-4"
                      >
                        Clear all filters
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Google Map Integration */}
              <div className="sticky top-60 h-[600px] bg-[#F2EDE4] rounded-3xl overflow-hidden border border-[#F2EDE4] hidden lg:block shadow-2xl shadow-[#1A2E35]/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedClinicId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <iframe 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, minHeight: '600px' }} 
                      loading="lazy" 
                      allowFullScreen 
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map for ${clinics.find(c => c.id === selectedClinicId)?.name}`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(clinics.find(c => c.id === selectedClinicId)?.address || 'Bengaluru')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    />
                  </motion.div>
                </AnimatePresence>
                
                <div className="absolute top-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#5A7A5C]/10 rounded-lg flex items-center justify-center">
                        <Navigation className="h-4 w-4 text-[#5A7A5C]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 block">Viewing Location</span>
                        <span className="text-xs font-sans-clean font-bold text-[#1A2E35]">{clinics.find(c => c.id === selectedClinicId)?.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 bg-[#5A7A5C] rounded-full animate-pulse" />
                      <div className="h-1.5 w-1.5 bg-[#5A7A5C] rounded-full animate-pulse delay-75" />
                    </div>
                  </div>
                </div>

                {/* Get Directions Floating Button */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2"
                >
                  <a 
                    href={clinics.find(c => c.id === selectedClinicId)?.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1A2E35] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-[#1A2E35]/90 transition-all flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-[#C5A059]" /> Get Directions
                  </a>
                </motion.div>
              </div>
            </div>
          </section>
        </div>

        {/* 5) Treatment Programs - Holistic Healing for Every Need */}
        <section className="py-16 bg-[#F8F9FA] border-y border-[#F2EDE4] relative">
          <div className="container px-4">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-medium text-[#1A2E35] mb-6">Holistic Healing for Every Need</h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
              {treatments.map((t, i) => (
                <div key={i} className="w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.33%-2rem)] p-10 bg-white border border-[#F2EDE4] rounded-3xl hover:border-[#5A7A5C] hover:shadow-2xl hover:shadow-[#1A2E35]/5 transition-all duration-500 group">
                  <div className="h-14 w-14 bg-[#F8F9FA] rounded-2xl flex items-center justify-center text-[#5A7A5C] mb-8 group-hover:bg-[#5A7A5C] group-hover:text-white transition-all duration-500">
                    {t.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#1A2E35] mb-4">{t.title}</h3>
                  <p className="text-sm text-[#1A2E35]/60 leading-relaxed font-sans-clean">{t.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-20 text-center">
              <a 
                href="https://wa.me/919995731915?text=Hello%20Salmara%20Team,%20I%20would%20like%20to%20book%20an%20Ayurvedic%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#5A7A5C] text-white rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-[#4a654c] transition-all shadow-xl shadow-[#5A7A5C]/20 transform hover:-translate-y-1 group"
              >
                Book Your Consultation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>

        {/* 6) Consultation Process */}
        <section className="py-16 bg-white border-b border-[#F2EDE4] relative">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-display font-medium text-[#1A2E35]">Experience Seamless Care</h2>
              <p className="text-[#1A2E35]/50 font-sans-clean mt-2 italic">A straightforward journey from booking to healing.</p>
            </div>
            
            <div className="relative max-w-5xl mx-auto px-10">
              {/* Connector line */}
              <div className="absolute top-10 left-20 right-20 h-px bg-[#1A2E35]/10 hidden lg:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 relative">
                {[
                  { step: "Choose Clinic", icon: <MapPin className="h-5 w-5" /> },
                  { step: "Pick Doctor", icon: <UserCheck className="h-5 w-5" /> },
                  { step: "Select Date & Time", icon: <Calendar className="h-5 w-5" /> },
                  { step: "Confirm Appointment", icon: <CheckCircle2 className="h-5 w-5" /> },
                  { step: "Receive Confirmation", icon: <ArrowRight className="h-5 w-5" /> }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center group">
                    <div className="h-20 w-20 rounded-full bg-[#FDFBF7] border border-[#F2EDE4] flex items-center justify-center text-[#5A7A5C] mb-6 group-hover:bg-[#5A7A5C] group-hover:text-white transition-all shadow-sm z-10">
                      {item.icon}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#1A2E35] text-center max-w-[100px] leading-tight">
                      {item.step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7) FAQ */}
        <section className="py-16 md:py-24 container px-4 relative">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-medium text-[#1A2E35]">Common Questions</h2>
              <p className="text-[#1A2E35]/60 mt-4">Everything you need to know about starting your treatment.</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-[#F2EDE4] rounded-2xl overflow-hidden bg-white">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-[#FDFBF7] transition-colors"
                  >
                    <span className="font-display font-medium text-[#1A2E35]">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-[#5A7A5C] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8 pt-2 text-sm text-[#1A2E35]/70 font-sans-clean leading-relaxed border-t border-[#F2EDE4]/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8) Page-End CTA Banner */}
        <section className="py-16 container px-4 mb-16">
          <div className="bg-[#1A2E35] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-10">
              <h2 className="text-4xl md:text-6xl font-display font-medium text-white leading-tight">Ready to Begin Your <br /> Ayurvedic Journey?</h2>
              <p className="text-white/60 text-lg font-sans-clean">Experience personalized healing designed for your unique constitution by Salmara’s trusted experts.</p>
              <div className="pt-4">
                <a 
                  href="https://wa.me/919995731915?text=Hello%20Salmara%20Team,%20I%20would%20like%20to%20start%20my%20Ayurvedic%20journey."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#5A7A5C] text-white px-12 py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs hover:bg-[#4a654c] transition-all shadow-2xl shadow-black/40 transform hover:-translate-y-1 inline-block"
                >
                  Book Appointment
                </a>
              </div>
              <div className="flex items-center justify-center gap-8 pt-8 opacity-40">
                <CheckCircle2 className="h-6 w-6 text-white" />
                <ShieldCheck className="h-6 w-6 text-white" />
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClinicsPage;

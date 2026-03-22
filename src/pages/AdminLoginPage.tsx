import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, Mail, Lock } from "lucide-react";
import { adminLogin, saveAdminSession, getStoredAdminSession } from "@/lib/shopifyAdmin";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (getStoredAdminSession()) {
      navigate("/admin-salmara");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await adminLogin(email, password);

      if (!result.success) {
        throw new Error(result.error || "Invalid administrative credentials.");
      }

      saveAdminSession({
        user: result.user,
        expires: Date.now() + (12 * 60 * 60 * 1000) // 12 hours admin session
      });

      toast.success(`Welcome back, Admin ${result.user?.name}!`);
      navigate("/admin-salmara");
    } catch (error: any) {
      toast.error("Admin Login Failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12 md:py-20">
        <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-[40px] shadow-2xl overflow-hidden border border-[#F2EDE4]">
          {/* Left Side: Visual/Content */}
          <div className="hidden md:flex md:w-1/2 bg-[#1A2E35] p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            
            <div className="relative z-10">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12 group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-sans-clean font-medium">Back to Shop</span>
              </button>
              
              <h1 className="text-4xl lg:text-5xl font-display font-medium text-white leading-tight mb-6">
                Salmara <br />
                <span className="italic text-[#5A7A5C]">Admin Portal.</span>
              </h1>
              <p className="text-white/70 font-sans-clean leading-relaxed text-lg max-w-md">
                Secure access for Salmara administrators. Manage your products, testimonials, and users with ease.
              </p>
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-white font-display text-2xl mb-1">Administrative</p>
                <p className="text-[#5A7A5C] text-xs uppercase tracking-widest font-bold">Access Only</p>
              </div>
              <div>
                <p className="text-white font-display text-2xl mb-1">Real-time</p>
                <p className="text-[#5A7A5C] text-xs uppercase tracking-widest font-bold">Data Management</p>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="mb-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#1A2E35] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A2E35] font-bold">Admin Console</span>
                </div>
                <h2 className="text-4xl font-display font-medium text-[#1A2E35]">Admin Sign In</h2>
                <p className="text-[#1A2E35]/50 mt-2 font-sans-clean">Please verify your credentials to continue.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1 flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-[#FDFBF7] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#1A2E35] transition-all shadow-sm focus:shadow-md"
                    placeholder="admin@salmara.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1 flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Password
                  </label>
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full bg-[#FDFBF7] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#1A2E35] transition-all shadow-sm focus:shadow-md"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  disabled={loading} 
                  className="w-full bg-[#1A2E35] text-white py-4 mt-4 rounded-2xl font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-3 hover:bg-[#5A7A5C] transition-all duration-500 shadow-xl shadow-[#1A2E35]/10 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} 
                  {loading ? "Verifying..." : "Authorize & Enter"}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-[#F2EDE4] text-center md:text-left">
                <p className="text-[10px] text-[#1A2E35]/30 font-sans-clean leading-relaxed uppercase tracking-tighter">
                  Authorized personnel only. all access attempts are logged for security purposes.
                  unauthorized entry is strictly prohibited.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLoginPage;

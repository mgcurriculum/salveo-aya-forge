import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { 
  createShopifyCustomer, 
  loginShopifyCustomer
} from "@/lib/shopify";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = "login" }) => {
  const [view, setView] = useState<"login" | "register">(initialView);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginShopifyCustomer(email, password);

      if (!response.success) {
        const errorMsg = response.errors?.[0]?.message || "";
        if (errorMsg.includes("unauthenticated_write_customers") || errorMsg.includes("Access denied")) {
          throw new Error("Shopify API permissions missing. Please enable 'unauthenticated_write_customers' in your Shopify Storefront API settings.");
        }
        throw new Error(errorMsg || "Invalid email or password.");
      }

      const { accessToken, expiresAt } = response.token;
      const customer = await fetchShopifyCustomer(accessToken);

      const sessionData = {
        accessToken,
        user: {
          id: customer?.id || "",
          email: customer?.email || email,
          name: customer ? `${customer.firstName} ${customer.lastName}`.trim() : email.split('@')[0],
          firstName: customer?.firstName,
          lastName: customer?.lastName,
          phone: customer?.phone
        },
        expires: new Date(expiresAt).getTime()
      };
      
      localStorage.setItem('salmara_session', JSON.stringify(sessionData));
      window.dispatchEvent(new Event('auth-status-change'));

      toast.success(`Welcome back, ${sessionData.user.name}!`);
      onClose();
    } catch (error: any) {
      toast.error("Login failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createShopifyCustomer({
        firstName,
        lastName,
        email,
        password,
        phone: phone || undefined,
        acceptsMarketing: true
      });

      if (!response.success) {
        throw new Error(response.errors?.[0]?.message || "Registration failed. Please check your details.");
      }

      toast.success("Account created! Please log in.");
      setView("login");
    } catch (error: any) {
      toast.error("Registration failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }} 
          className="relative w-full max-w-lg bg-[#FDFBF7] rounded-[32px] shadow-2xl p-8 sm:p-12 overflow-hidden border border-[#F2EDE4]" 
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 text-[#1A2E35]/40 hover:text-[#1A2E35] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <AnimatePresence mode="wait">
            {view === "login" ? (
              <motion.div 
                key="login" 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }} 
                transition={{ duration: 0.3 }} 
                className="flex flex-col items-center"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#5A7A5C] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#5A7A5C] font-bold">Secure Access</span>
                </div>
                <h2 className="text-4xl font-display font-medium text-[#1A2E35] mb-10 text-center">Login</h2>
                <form onSubmit={handleLogin} className="w-full space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Email Address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Password</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <button disabled={loading} className="w-full bg-[#1A2E35] text-white py-5 rounded-2xl font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#5A7A5C] transition-all duration-300 shadow-xl shadow-[#1A2E35]/10 disabled:opacity-50">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />} {loading ? "Authenticating..." : "Login"}
                  </button>
                </form>
                <p className="mt-8 text-sm text-[#1A2E35]/40 font-sans-clean">Don't have an account? <button onClick={() => setView("register")} className="text-[#5A7A5C] font-bold hover:underline underline-offset-4 decoration-2">Register Now</button></p>
              </motion.div>
            ) : (
              <motion.div 
                key="register" 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }} 
                transition={{ duration: 0.3 }} 
                className="flex flex-col items-center"
              >
                 <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#5A7A5C] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#5A7A5C] font-bold">Join Salmara</span>
                </div>
                <h2 className="text-4xl font-display font-medium text-[#1A2E35] mb-10 text-center">Create Account</h2>
                <form onSubmit={handleRegister} className="w-full space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">First Name</label>
                      <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Last Name</label>
                      <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Phone (Optional)</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Password</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <button disabled={loading} className="w-full bg-[#1A2E35] text-white py-5 rounded-2xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-[#5A7A5C] transition-all duration-300 shadow-xl shadow-[#1A2E35]/10 disabled:opacity-50">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />} {loading ? "Creating Account..." : "Register"}
                  </button>
                </form>
                <p className="mt-8 text-sm text-[#1A2E35]/40 font-sans-clean text-center">Already have account? <button onClick={() => setView("login")} className="text-[#5A7A5C] font-bold hover:underline underline-offset-4 decoration-2">Login</button></p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { saveSession } from "@/lib/shopify";
import { createCustomerViaAdmin, loginViaProxy, updateCustomerCartId } from "@/lib/shopifyAdmin";
import { syncShopifyCustomerToDb } from "@/lib/dbSync";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = "login" }) => {
  const [view, setView] = useState<"login" | "register">(initialView);
  const [loading, setLoading] = useState(false);
  const { cartId, setCartId, syncCart, clearCart } = useCartStore();
  
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
      const result = await loginViaProxy(email, password);

      if (!result.success) {
        const errorMsg = result.errors?.[0]?.message || "Invalid email or password.";
        throw new Error(errorMsg);
      }

      // Explicitly clear local cart state before restoring the user's specific cart
      const currentCartId = cartId;
      clearCart();

      // 1. Restore Cart from Shopify if available
      if (result.user?.shopifyCartId) {
        console.log("Found Shopify Cart ID, restoring:", result.user.shopifyCartId);
        setCartId(result.user.shopifyCartId);
        // Wait a bit for state to propagate
        setTimeout(async () => {
          await syncCart();
          console.log("Cart restoration complete");
        }, 500);
      } else if (currentCartId) {
        // 2. Save current local cart to new account if Shopify had none
        console.log("Saving local cart to Shopify account:", currentCartId);
        await updateCustomerCartId(result.user.id, currentCartId);
        // Restore local id
        setCartId(currentCartId);
      }

      // Sync with standard session
      saveSession({
        accessToken: "admin_proxy_mode",
        user: result.user,
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      });

      toast.success(`Welcome back, ${result.user?.name}!`);
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
      // 1. Create Shopify customer via Admin API proxy
      const shopifyResult = await createCustomerViaAdmin({
        firstName,
        lastName,
        email,
        password,
        phone: phone || undefined,
      });

      if (!shopifyResult.success) {
        const errorMsg = shopifyResult.errors?.[0]?.message || "Could not create account.";
        throw new Error(errorMsg);
      }

      const customer = shopifyResult.customer;

      // 3. Sync to local database
      if (customer) {
        console.log("Shopify customer created successfully:", customer);
        console.log("Triggering local DB sync for:", customer.email);
        
        try {
          const dbResult = await syncShopifyCustomerToDb({
            id: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            password: password // Pass plan text password for hashing in dbSync
          });

          if (!dbResult.success) {
            console.error("Critical: Supabase Sync Failed:", dbResult.error);
            toast.error("Account created in Shopify, but database sync failed.", { 
              description: dbResult.error,
              duration: 6000 
            });
          } else {
            console.log("Supabase Sync Successful. Result:", dbResult);
            if (dbResult.existed) {
              console.log("User already existed in database.");
            }
          }
        } catch (syncErr: any) {
          console.error("Unexpected error during DB sync call:", syncErr);
          toast.error("Database sync encountered an unexpected error.");
        }
      }

      // 4. Save current local cart to the new account
      const currentCartId = cartId;
      clearCart();

      if (customer?.id && currentCartId) {
        console.log("Saving guest cart to new account:", currentCartId);
        await updateCustomerCartId(customer.id, currentCartId);
        setCartId(currentCartId);
      }

      // Account created! Automagically log them in
      saveSession({
        accessToken: "admin_proxy_mode",
        user: {
          id: customer?.id,
          email: customer?.email,
          name: `${customer?.firstName} ${customer?.lastName}`.trim(),
          firstName: customer?.firstName,
          lastName: customer?.lastName,
          phone: customer?.phone
        },
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000)
      });

      toast.success(`Welcome, ${firstName}! Your account is ready.`);
      onClose();
      
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
          className="relative w-full max-w-lg bg-[#FDFBF7] rounded-[32px] shadow-2xl p-6 sm:p-10 overflow-hidden border border-[#F2EDE4]" 
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
                <img src="/salamara_icon.png" alt="Salmara" className="h-10 w-auto mb-4" />
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#5A7A5C] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#5A7A5C] font-bold">Secure Access</span>
                </div>
                <h2 className="text-3xl font-display font-medium text-[#1A2E35] mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin} className="w-full space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Email Address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-3 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Password</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-3 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <button disabled={loading} className="w-full bg-[#1A2E35] text-white py-4 rounded-2xl font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#5A7A5C] transition-all duration-300 shadow-xl shadow-[#1A2E35]/10 disabled:opacity-50">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />} {loading ? "Authenticating..." : "Login"}
                  </button>
                </form>
                <p className="mt-6 text-sm text-[#1A2E35]/40 font-sans-clean">Don't have an account? <button onClick={() => setView("register")} className="text-[#5A7A5C] font-bold hover:underline underline-offset-4 decoration-2">Register Now</button></p>
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
                <img src="/salamara_icon.png" alt="Salmara" className="h-10 w-auto mb-4" />
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#5A7A5C] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#5A7A5C] font-bold">Join Salmara</span>
                </div>
                <h2 className="text-3xl font-display font-medium text-[#1A2E35] mb-6 text-center">Create Account</h2>
                <form onSubmit={handleRegister} className="w-full space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">First Name</label>
                      <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-3 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Last Name</label>
                      <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-3 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-3 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Phone (Optional)</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-3 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Password</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-3 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                  </div>
                  <button disabled={loading} className="w-full bg-[#1A2E35] text-white py-4 rounded-2xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-[#5A7A5C] transition-all duration-300 shadow-xl shadow-[#1A2E35]/10 disabled:opacity-50">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />} {loading ? "Creating Account..." : "Register"}
                  </button>
                </form>
                <p className="mt-6 text-sm text-[#1A2E35]/40 font-sans-clean text-center">Already have account? <button onClick={() => setView("login")} className="text-[#5A7A5C] font-bold hover:underline underline-offset-4 decoration-2">Login</button></p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

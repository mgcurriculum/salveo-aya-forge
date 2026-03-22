import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, Mail, Lock, User, Phone } from "lucide-react";
import { 
  loginViaProxy, 
  createCustomerViaAdmin, 
  saveSession, 
  getStoredSession, 
  createHybridCheckout,
  logCheckoutToTerminal,
  updateCustomerCartId
} from "@/lib/shopifyAdmin";
import { syncShopifyCustomerToDb } from "@/lib/dbSync";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LoginPage = () => {
  const [view, setView] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const { cartId, setCartId, syncCart, clearCart, checkout } = useCartStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (getStoredSession() && !redirect) {
      navigate("/dashboard");
    }
  }, [navigate, redirect]);

  const handleSuccessfulAuth = async (user: any, currentCartId: string | null) => {
    if (redirect === "checkout") {
        toast.info("Resuming checkout...");
        const checkoutUrl = await checkout();
        if (checkoutUrl) {
            console.log("LoginPage: Resuming Cart Checkout:", checkoutUrl);
            await logCheckoutToTerminal(checkoutUrl, "LoginPage (Post-Login Cart Resume)");
            window.location.href = checkoutUrl;
            return;
        }
    }

    if (redirect === "buy_now") {
      const variantId = searchParams.get("variantId");
      const quantity = parseInt(searchParams.get("quantity") || "1");
      
      if (variantId) {
        toast.info("Preparing your direct checkout...");
        try {
          const result = await createHybridCheckout([{ variantId, quantity }], user.id, user.email);
           if (result.success && result.checkoutUrl) {
            console.log("LoginPage: Resuming Buy Now Checkout:", result.checkoutUrl);
            await logCheckoutToTerminal(result.checkoutUrl, `LoginPage (Post-Login Buy Now Resume: ${variantId})`);
            window.location.href = result.checkoutUrl;
            return;
          } else {
            console.error("Buy now after login failed:", result.errors);
            toast.error("Shopify Connection Issue", { 
              description: "We couldn't generate the checkout link right now. Please try again from your cart." 
            });
            // STOP HERE. Do not redirect to dashboard.
            return;
          }
        } catch (error) {
          console.error("Buy now redirection error:", error);
          toast.error("Checkout failed", { description: "Please retry in a moment." });
          return;
        }
      }
    }

    // Default only if no specific redirect was handled
    navigate("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await loginViaProxy(email, password);

      if (!result.success) {
        const errorMsg = result.errors?.[0]?.message || "Invalid email or password.";
        throw new Error(errorMsg);
      }

      // Only clear cart if we are NOT redirecting to checkout/buy_now
      // We want to keep the local cart items for the checkout flow.
      const isRedirectingToCheckout = redirect === "checkout" || redirect === "buy_now";
      
      const currentCartId = cartId;
      if (!isRedirectingToCheckout) {
        clearCart();
      }

      // Save session FIRST so syncCart can read it
      saveSession({
        accessToken: "admin_proxy_mode",
        user: result.user,
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000)
      });

      if (result.user?.shopifyCartId) {
        setCartId(result.user.shopifyCartId);
        if (!isRedirectingToCheckout) {
          setTimeout(async () => {
            await syncCart();
          }, 500);
        }
      } else if (currentCartId) {
        await updateCustomerCartId(result.user.id, currentCartId);
        setCartId(currentCartId);
      }

      toast.success(`Welcome back, ${result.user?.name}!`);
      
      // Sync wishlist immediately after login
      await useWishlistStore.getState().syncWithShopify();
      
      await handleSuccessfulAuth(result.user, currentCartId);
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

      if (customer) {
        try {
          await syncShopifyCustomerToDb({
            id: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            password: password
          });
        } catch (syncErr) {
          console.error("DB sync failed:", syncErr);
        }
      }

      // Only clear cart if we are NOT redirecting to checkout/buy_now
      const isRedirectingToCheckout = redirect === "checkout" || redirect === "buy_now";
      
      const currentCartId = cartId;
      if (!isRedirectingToCheckout) {
        clearCart();
      }

      const userData = {
        id: customer?.id,
        email: customer?.email,
        name: `${customer?.firstName} ${customer?.lastName}`.trim(),
        firstName: customer?.firstName,
        lastName: customer?.lastName,
        phone: customer?.phone
      };

      saveSession({
        accessToken: "admin_proxy_mode",
        user: userData,
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000)
      });

      if (customer?.id && currentCartId) {
        await updateCustomerCartId(customer.id, currentCartId);
        setCartId(currentCartId);
      }

      toast.success(`Welcome, ${firstName}! Your account is ready.`);
      await handleSuccessfulAuth(userData, currentCartId);
    } catch (error: any) {
      toast.error("Registration failed", { description: error.message });
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
          <div className="hidden md:flex md:w-1/2 bg-[#5A7A5C] p-12 flex-col justify-between relative overflow-hidden">
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
              
              <img src="/salamara_icon.png" alt="Salmara" className="h-16 w-auto brightness-0 invert mb-8" />
              <h1 className="text-4xl lg:text-5xl font-display font-medium text-white leading-tight mb-6">
                Your Journey to <br />
                <span className="italic">Authentic Wellness.</span>
              </h1>
              <p className="text-white/70 font-sans-clean leading-relaxed text-lg max-w-md">
                Experience the wisdom of Ayurveda through modern precision. Log in to access your curated health journey.
              </p>
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-white font-display text-2xl mb-1">Authentic</p>
                <p className="text-white/50 text-xs uppercase tracking-widest">Ingredients</p>
              </div>
              <div>
                <p className="text-white font-display text-2xl mb-1">Scientific</p>
                <p className="text-white/50 text-xs uppercase tracking-widest">Formulations</p>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
            <div className="md:hidden flex justify-center mb-8">
               <img src="/salamara_icon.png" alt="Salmara" className="h-12 w-auto" />
            </div>

            <AnimatePresence mode="wait">
              {view === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <div className="mb-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#5A7A5C] animate-pulse" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#5A7A5C] font-bold">Secure Access</span>
                    </div>
                    <h2 className="text-4xl font-display font-medium text-[#1A2E35]">Welcome Back</h2>
                    <p className="text-[#1A2E35]/50 mt-2 font-sans-clean">Please enter your details to sign in.</p>
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
                        className="w-full bg-[#FDFBF7] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 flex items-center gap-2">
                          <Lock className="h-3 w-3" /> Password
                        </label>
                        <button type="button" className="text-[10px] font-bold text-[#5A7A5C] hover:underline uppercase tracking-widest">Forgot?</button>
                      </div>
                      <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full bg-[#FDFBF7] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md"
                        placeholder="••••••••"
                      />
                    </div>
                    <button 
                      disabled={loading} 
                      className="w-full bg-[#1A2E35] text-white py-4 mt-4 rounded-2xl font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-3 hover:bg-[#5A7A5C] transition-all duration-500 shadow-xl shadow-[#1A2E35]/10 disabled:opacity-50"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />} 
                      {loading ? "Authenticating..." : "Sign In to Account"}
                    </button>
                  </form>
                  
                  <div className="mt-8 text-center md:text-left">
                    <p className="text-sm text-[#1A2E35]/40 font-sans-clean">
                      Don't have an account? 
                      <button 
                        onClick={() => setView("register")} 
                        className="text-[#5A7A5C] font-bold hover:underline underline-offset-4 ml-2 transition-all"
                      >
                        Create One Now
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <div className="mb-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#5A7A5C] animate-pulse" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#5A7A5C] font-bold">Join Salmara</span>
                    </div>
                    <h2 className="text-4xl font-display font-medium text-[#1A2E35]">Create Account</h2>
                    <p className="text-[#1A2E35]/50 mt-2 font-sans-clean">Join our community for a healthier life.</p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1 flex items-center gap-2">
                          <User className="h-3 w-3" /> First Name
                        </label>
                        <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-[#FDFBF7] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1">Last Name</label>
                        <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-[#FDFBF7] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1 flex items-center gap-2">
                        <Mail className="h-3 w-3" /> Email
                      </label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#FDFBF7] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1 flex items-center gap-2">
                        <Phone className="h-3 w-3" /> Phone (Optional)
                      </label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#FDFBF7] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/60 ml-1 flex items-center gap-2">
                        <Lock className="h-3 w-3" /> Password
                      </label>
                      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#FDFBF7] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-all shadow-sm focus:shadow-md" />
                    </div>
                    <button 
                      disabled={loading} 
                      className="w-full bg-[#1A2E35] text-white py-4 mt-4 rounded-2xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-[#5A7A5C] transition-all duration-500 shadow-xl shadow-[#1A2E35]/10 disabled:opacity-50"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />} 
                      {loading ? "Creating Account..." : "Create Free Account"}
                    </button>
                  </form>
                  
                  <div className="mt-8 text-center md:text-left">
                    <p className="text-sm text-[#1A2E35]/40 font-sans-clean text-center md:text-left">
                      Already have an account? 
                      <button 
                        onClick={() => setView("login")} 
                        className="text-[#5A7A5C] font-bold hover:underline underline-offset-4 ml-2"
                      >
                        Sign In Instead
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;

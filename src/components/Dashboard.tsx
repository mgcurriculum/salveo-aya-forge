import React, { useState, useEffect } from "react";
import { 
  User, 
  ShoppingBag, 
  ClipboardList, 
  ShoppingCart, 
  Home, 
  LogOut, 
  Save,
  UserCircle,
  ArrowLeft
} from "lucide-react";
import { fetchShopifyCustomer, updateShopifyCustomer, getValidCustomerToken, getStoredSession, clearSession, saveSession } from "@/lib/shopify";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { Minus, Plus, Trash2, ShoppingCart as CartIcon, ExternalLink, Loader2 } from "lucide-react";

const logo = "/salamara_icon.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "cart">("profile");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Dashboard state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const savedSession = localStorage.getItem('salmara_session');
      if (!savedSession) {
        navigate("/");
        return;
      }

      const session = JSON.parse(savedSession);
      const customer = await fetchShopifyCustomer(session.accessToken);

      if (!customer) {
        // Token might be expired
        localStorage.removeItem('salmara_session');
        navigate("/");
        return;
      }

      setUser(customer);
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || ""
      });
    } catch (error: any) {
      toast.error("Error fetching profile", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('salmara_session');
    window.dispatchEvent(new Event('auth-status-change'));
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const savedSession = localStorage.getItem('salmara_session');
      if (!savedSession) throw new Error("Session expired");

      const session = JSON.parse(savedSession);
      const response = await updateShopifyCustomer(session.accessToken, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined
      });

      if (!response.success) {
        throw new Error(response.errors?.[0]?.message || "Update failed");
      }
      
      // Update local storage name if needed
      session.user.name = `${formData.firstName} ${formData.lastName}`.trim();
      localStorage.setItem('salmara_session', JSON.stringify(session));
      window.dispatchEvent(new Event('auth-status-change'));

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error("Save failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFBF7]">
        <div className="h-10 w-10 border-4 border-[#5A7A5C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      {/* SIDEBAR - Dark charcoal */}
      <aside className="w-72 bg-[#1A1A1A] text-white flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto z-50">
        <div className="p-8 pb-12 space-y-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
          </button>
          <Link to="/" className="flex items-center gap-3">
            <span className="font-display font-medium text-xl tracking-tight text-white/90">My Dashboard</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link 
            to="/shop" 
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ShoppingBag className="h-5 w-5" />
            Shop Now
          </Link>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "orders" 
                ? "bg-[#5A7A5C] text-white shadow-lg shadow-[#5A7A5C]/20" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <ClipboardList className="h-5 w-5" />
            My Orders
          </button>
          <button 
            onClick={() => setActiveTab("cart")}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "cart" 
                ? "bg-[#5A7A5C] text-white shadow-lg shadow-[#5A7A5C]/20" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            My Cart
          </button>
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "profile" 
                ? "bg-[#5A7A5C] text-white shadow-lg shadow-[#5A7A5C]/20" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <User className="h-5 w-5" />
            Profile Settings
          </button>
          <Link 
            to="/" 
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT - Light cream */}
      <main className="flex-1 p-8 md:p-12 lg:p-16">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl p-10 shadow-sm border border-[#F2EDE4]"
              >
                <form onSubmit={handleSave} className="space-y-12">
                  {/* Section 01: Personal Details */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 bg-[#5A7A5C]/10 rounded-full flex items-center justify-center text-[10px] font-bold text-[#5A7A5C]">01</div>
                      <h2 className="text-2xl font-display font-medium text-[#1A2E35]">Profile Information</h2>
                    </div>
                    
                    <div className="bg-[#F8F9FA] rounded-3xl p-8 grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A2E35]/40 ml-1">First Name</label>
                        <input 
                          type="text" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full bg-transparent border-none p-0 text-xl font-display font-medium text-[#1A2E35] focus:outline-none placeholder:text-[#1A2E35]/20"
                          placeholder="First Name"
                        />
                      </div>
                      <div className="space-y-2 border-l border-[#E5E7EB] pl-10">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A2E35]/40 ml-1">Last Name</label>
                        <input 
                          type="text" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full bg-transparent border-none p-0 text-xl font-display font-medium text-[#1A2E35] focus:outline-none placeholder:text-[#1A2E35]/20"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A2E35]/40 ml-1">Email Address</label>
                        <div className="text-xl font-display font-medium text-[#1A2E35] opacity-60 bg-[#F8F9FA] px-8 py-4 rounded-2xl">{formData.email}</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A2E35]/40 ml-1">Phone Number</label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-[#F8F9FA] rounded-2xl px-8 py-4 text-xl font-display font-medium text-[#1A2E35] focus:outline-none placeholder:text-[#1A2E35]/20"
                          placeholder="+91 00000 00000"
                        />
                      </div>
                    </div>
                  </section>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-[#5A7A5C] text-white px-10 py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#4a654c] transition-all shadow-xl shadow-[#5A7A5C]/20 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="h-20 w-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-6">
                  <ClipboardList className="h-10 w-10 text-[#5A7A5C]/20" />
                </div>
                <h2 className="text-2xl font-display font-medium text-[#1A2E35]">No orders yet</h2>
                <p className="text-sm text-[#1A2E35]/60 mt-2 max-w-sm">When you place an order, you'll see it here to track its progress.</p>
                <Link to="/#products" className="mt-10 px-8 py-4 bg-[#5A7A5C] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#4a654c] transition-colors">Shop Products</Link>
              </motion.div>
            )}
            
            {activeTab === "cart" && (
              <DashboardCart />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const DashboardCart = () => {
  const { items, isLoading, updateQuantity, removeItem, getCheckoutUrl } = useCartStore();
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  if (items.length === 0) {
    return (
      <motion.div
        key="cart-empty"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="h-20 w-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-6">
          <CartIcon className="h-10 w-10 text-[#5A7A5C]/20" />
        </div>
        <h2 className="text-2xl font-display font-medium text-[#1A2E35]">Your cart is empty</h2>
        <p className="text-sm text-[#1A2E35]/60 mt-2 max-w-sm">Looks like you haven't added any Ayurvedic treasures yet.</p>
        <Link to="/shop" className="mt-10 px-8 py-4 bg-[#5A7A5C] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#4a654c] transition-colors">Explore Collection</Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="cart-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-10 shadow-sm border border-[#F2EDE4] space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-medium text-[#1A2E35]">Your Shopping Cart</h2>
        <span className="text-xs font-bold text-[#1A2E35]/40 uppercase tracking-widest">{items.length} Items</span>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-6 p-6 border border-[#F2EDE4] rounded-2xl group hover:border-[#5A7A5C]/30 transition-all">
            <div className="w-24 h-24 bg-[#F8F9FA] rounded-xl overflow-hidden flex-shrink-0">
              {item.product.node.images?.edges?.[0]?.node && (
                <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-display font-medium text-[#1A2E35] text-lg">{item.product.node.title}</h4>
              <p className="text-xs text-[#1A2E35]/40 font-sans-clean mt-1">{item.variantTitle !== "Default Title" ? item.variantTitle : 'Standard Pack'}</p>
              <div className="flex items-center justify-between mt-4">
                <p className="font-display font-bold text-[#1A2E35]">
                  {item.price.currencyCode === 'INR' ? '₹' : item.price.currencyCode} {parseFloat(item.price.amount).toFixed(0)}
                </p>
                <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-lg px-2">
                  <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-2 text-[#1A2E35]/30 hover:text-[#1A2E35]">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-[#1A2E35]">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-2 text-[#1A2E35]/30 hover:text-[#1A2E35]">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => removeItem(item.variantId)} className="text-[#1A2E35]/20 hover:text-red-500 transition-colors p-2">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-[#F2EDE4] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p className="text-[10px] font-bold text-[#1A2E35]/40 uppercase tracking-widest mb-1">Subtotal Estimate</p>
          <p className="text-3xl font-display font-bold text-[#1A2E35]">
            {items[0]?.price.currencyCode === 'INR' ? '₹' : items[0]?.price.currencyCode} {totalPrice.toFixed(0)}
          </p>
        </div>
        <button
          onClick={() => {
            const checkoutUrl = getCheckoutUrl();
            if (checkoutUrl) window.open(checkoutUrl, '_blank');
          }}
          disabled={isLoading}
          className="w-full md:w-auto bg-[#5A7A5C] text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#4A634B] transition-all shadow-xl shadow-[#5A7A5C]/20 flex items-center justify-center gap-3"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4" /> Checkout Securely</>}
        </button>
      </div>
    </motion.div>
  );
};

export default Dashboard;

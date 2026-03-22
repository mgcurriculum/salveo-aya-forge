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
  ArrowLeft,
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart as CartIcon, 
  ExternalLink, 
  Loader2,
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  X 
} from "lucide-react";
import { fetchCustomerViaAdmin, updateCustomerViaAdmin, fetchCustomerOrdersViaAdmin, fetchCustomerOrdersByEmailViaAdmin, clearSession, saveSession, getStoredSession } from "@/lib/shopifyAdmin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";


const logo = "/salamara_icon.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "cart">("profile");
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  
  // Dashboard state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    const init = async () => {
      await fetchProfile();
    };
    init();
  }, []);

  useEffect(() => {
    if (activeTab === "orders" && user?.id) {
      // Fetch fresh orders every time the tab is opened
      fetchOrders();
    }
  }, [activeTab, user?.id]);

  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<any>(null);

  const handleTrackOrder = (order: any) => {
    setSelectedOrderForTracking(order);
  };

  const fetchOrders = async () => {
    setFetchingOrders(true);
    try {
      console.log("Fetching orders for customer ID:", user.id, "and email:", user.email);
      
      // 1. Fetch by Customer ID (directly linked orders)
      const linkedOrders = await fetchCustomerOrdersViaAdmin(user.id);
      
      // 2. Fetch by Email (fallback for guest orders)
      const emailOrders = await fetchCustomerOrdersByEmailViaAdmin(user.email);
      
      // Combine and remove duplicates (by ID)
      const allOrders = [...linkedOrders];
      emailOrders.forEach(eo => {
        if (!allOrders.find(lo => lo.id === eo.id)) {
          allOrders.push(eo);
        }
      });

      console.log(`Found ${linkedOrders.length} linked and ${emailOrders.length} total unique orders.`);
      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setFetchingOrders(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const session = getStoredSession();
      if (!session?.user?.id) {
        navigate("/");
        return;
      }

      // Fetch latest profile data from Shopify Admin API
      const shopifyCustomer = await fetchCustomerViaAdmin(session.user.id);

      if (!shopifyCustomer) {
        throw new Error("Could not fetch profile details.");
      }

      const userData = {
        id: shopifyCustomer.id,
        email: shopifyCustomer.email || "",
        firstName: shopifyCustomer.firstName || "",
        lastName: shopifyCustomer.lastName || "",
        phone: shopifyCustomer.phone || ""
      };

      setUser(userData);
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone
      });
    } catch (error: any) {
      toast.error("Error fetching profile", { description: error.message });
      // If unauthorized/not found, clear and redirect
      if (error.message.includes("401") || error.message.includes("not found")) {
        clearSession();
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const { clearCart } = useCartStore();
  const handleLogout = async () => {
    await clearSession();
    clearCart();
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const session = getStoredSession();
      if (!session?.user?.id) throw new Error("Session expired. Please log in again.");

      // Update Shopify via Admin API
      const result = await updateCustomerViaAdmin(session.user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined
      });

      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || "Update failed.");
      }
      
      // Update stored session for UI sync
      const updatedUser = {
        ...session.user,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      };

      saveSession({ ...session, user: updatedUser });
      setUser(updatedUser);

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
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1A1A1A] text-white flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto z-50">
        <div className="p-8 pb-12 space-y-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
          </button>
          <Link to="/" className="flex items-center gap-3">
            <img src="/salamara_icon.png" alt="Salmara" className="h-8 w-auto brightness-0 invert" />
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

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-12 lg:p-16">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Profile Header Card */}
                <div className="bg-gradient-to-br from-[#1A2E35] to-[#2A4A45] rounded-3xl p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A7A5C]/10 rounded-full -translate-y-1/2 translate-x-1/3" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#C5A059]/10 rounded-full translate-y-1/2 -translate-x-1/3" />
                  
                  <div className="relative flex items-center gap-8">
                    <div className="h-24 w-24 bg-gradient-to-br from-[#5A7A5C] to-[#4A634B] rounded-2xl flex items-center justify-center text-3xl font-display font-bold text-white shadow-2xl shadow-[#5A7A5C]/30 flex-shrink-0">
                      {(formData.firstName?.[0] || "").toUpperCase()}{(formData.lastName?.[0] || "").toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-1">Welcome back</p>
                      <h2 className="text-3xl font-display font-medium mb-1">
                        {formData.firstName} {formData.lastName}
                      </h2>
                      <p className="text-white/50 text-sm font-sans-clean">{formData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form Card */}
                <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-[#F2EDE4] overflow-hidden">
                  {/* Section Header */}
                  <div className="px-10 pt-10 pb-6 border-b border-[#F2EDE4]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-display font-medium text-[#1A2E35]">Personal Details</h3>
                        <p className="text-xs text-[#1A2E35]/40 font-sans-clean mt-1">Update your information below</p>
                      </div>
                      <div className="flex items-center gap-2 bg-[#5A7A5C]/5 px-4 py-2 rounded-xl">
                        <div className="h-2 w-2 bg-[#5A7A5C] rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-[#5A7A5C] uppercase tracking-widest">Active Account</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-10 space-y-8">
                    {/* Name Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1A2E35]/40 mb-3">
                          <User className="h-3 w-3" /> First Name
                        </label>
                        <input 
                          type="text" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full bg-[#FDFBF7] border-2 border-[#F2EDE4] rounded-2xl px-6 py-4 text-lg font-display font-medium text-[#1A2E35] focus:outline-none focus:border-[#5A7A5C] focus:bg-white transition-all placeholder:text-[#1A2E35]/20"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="group">
                        <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1A2E35]/40 mb-3">
                          <User className="h-3 w-3" /> Last Name
                        </label>
                        <input 
                          type="text" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full bg-[#FDFBF7] border-2 border-[#F2EDE4] rounded-2xl px-6 py-4 text-lg font-display font-medium text-[#1A2E35] focus:outline-none focus:border-[#5A7A5C] focus:bg-white transition-all placeholder:text-[#1A2E35]/20"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    {/* Email & Phone Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1A2E35]/40 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          Email Address
                          <span className="text-[8px] bg-[#F2EDE4] text-[#1A2E35]/40 px-2 py-0.5 rounded-md ml-1">Read Only</span>
                        </label>
                        <div className="w-full bg-[#F8F9FA] border-2 border-[#F2EDE4] rounded-2xl px-6 py-4 text-lg font-display font-medium text-[#1A2E35]/50 cursor-not-allowed select-all">
                          {formData.email}
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1A2E35]/40 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          Phone Number
                        </label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-[#FDFBF7] border-2 border-[#F2EDE4] rounded-2xl px-6 py-4 text-lg font-sans-clean font-medium text-[#1A2E35] focus:outline-none focus:border-[#5A7A5C] focus:bg-white transition-all placeholder:text-[#1A2E35]/20"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Footer */}
                  <div className="px-10 py-6 bg-[#FDFBF7] border-t border-[#F2EDE4] flex items-center justify-between">
                    <p className="text-[10px] text-[#1A2E35]/30 font-sans-clean uppercase tracking-widest">All changes are synced to your Shopify account</p>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-[#5A7A5C] text-white px-10 py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#4a654c] transition-all shadow-xl shadow-[#5A7A5C]/20 disabled:opacity-50 flex items-center gap-3 group"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                        <>
                          <Save className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          Save Changes
                        </>
                      )}
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
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-display font-medium text-[#1A2E35]">Order History</h2>
                    <p className="text-sm text-[#1A2E35]/40 font-sans-clean mt-1">Track and manage your recent purchases</p>
                  </div>
                  <div className="bg-[#5A7A5C]/5 px-4 py-2 rounded-xl border border-[#5A7A5C]/10 text-[10px] font-bold text-[#5A7A5C] uppercase tracking-widest">
                    {orders.length} Total Orders
                  </div>
                </div>

                {fetchingOrders ? (
                  <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-[#F2EDE4]">
                    <Loader2 className="h-10 w-10 text-[#5A7A5C] animate-spin mb-4" />
                    <p className="text-sm text-[#1A2E35]/40 font-sans-clean">Retrieving your treasures...</p>
                  </div>
                ) : (orders.length > 0 ) ? (
                  <div className="grid gap-6">
                   {orders.map((order) => (
                      <motion.div 
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 border border-[#F2EDE4] hover:border-[#5A7A5C]/20 transition-all group overflow-hidden relative shadow-sm"
                      >
                        {/* Status Glow Overlay */}
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 -translate-y-1/2 translate-x-1/2 pointer-events-none ${
                          order.displayFulfillmentStatus === 'DELIVERED' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-sans-clean font-bold text-[#1A2E35]">{order.name}</span>
                              {order.id.startsWith('sample-') && (
                                <span className="px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-[8px] font-bold uppercase tracking-widest border border-[#C5A059]/20">
                                  Sample Order
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="space-y-1">
                                <p className="text-[8px] uppercase tracking-widest font-bold text-[#1A2E35]/30">Payment Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                  order.displayFinancialStatus === 'PAID' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {order.displayFinancialStatus}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[8px] uppercase tracking-widest font-bold text-[#1A2E35]/30">Order Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                  order.displayFulfillmentStatus === 'DELIVERED' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-[#1A2E35]/5 text-[#1A2E35]/60'
                                }`}>
                                  {order.displayFulfillmentStatus.replace('_', ' ')}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-[#1A2E35]/40 mt-2">
                              <div className="flex items-center gap-2">
                                <ClipboardList className="h-4 w-4" />
                                {new Date(order.processedAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                {order.lineItems.edges.length} {order.lineItems.edges.length === 1 ? 'Item' : 'Items'}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 text-right">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1A2E35]/40">Total Amount</p>
                            <p className="text-2xl font-sans-clean font-bold text-[#1A2E35]">
                              {order.totalPriceSet.shopMoney.currencyCode === 'INR' ? '₹' : order.totalPriceSet.shopMoney.currencyCode}{' '}
                              {parseFloat(order.totalPriceSet.shopMoney.amount).toFixed(2)}
                            </p>
                            <button 
                              onClick={() => handleTrackOrder(order)}
                              className="flex items-center gap-2 text-[10px] font-bold text-[#5A7A5C] uppercase tracking-widest hover:text-[#1A2E35] transition-colors mt-2"
                            >
                              Track My Order <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="mt-8 pt-8 border-t border-[#F2EDE4] flex items-center gap-4">
                          {order.lineItems.edges.slice(0, 4).map((edge: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 p-2 bg-[#F8F9FA] rounded-2xl border border-[#F2EDE4] flex-1 max-w-[280px]">
                              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-white">
                                <img 
                                  src={edge.node.image?.url || logo || "/placeholder.svg"} 
                                  alt={edge.node.title} 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = logo || "/placeholder.svg";
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-bold text-[#1A2E35] truncate">{edge.node.title}</p>
                                <p className="text-[9px] text-[#1A2E35]/40 uppercase tracking-widest">Qty: {edge.node.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-[#F2EDE4]">
                    <div className="h-20 w-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-6">
                      <ClipboardList className="h-10 w-10 text-[#5A7A5C]/20" />
                    </div>
                    <h2 className="text-2xl font-display font-medium text-[#1A2E35]">No orders yet</h2>
                    <p className="text-sm text-[#1A2E35]/60 mt-2 max-w-sm">When you place an order, you'll see it here to track its progress.</p>
                    <Link to="/shop" className="mt-10 px-8 py-4 bg-[#5A7A5C] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#4a654c] transition-colors">Shop Products</Link>
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === "cart" && (
              <DashboardCart />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* TRACKING MODAL */}
      <TrackingModal 
        order={selectedOrderForTracking} 
        onClose={() => setSelectedOrderForTracking(null)} 
      />
    </div>
  );
};

const TrackingModal = ({ order, onClose }: { order: any; onClose: () => void }) => {
  if (!order) return null;

  const steps = [
    { title: "Order Placed", date: order.processedAt, completed: true, icon: ClipboardList },
    { title: "Payment Confirmed", date: order.processedAt, completed: order.displayFinancialStatus === 'PAID', icon: CheckCircle2 },
    { title: "Processing", date: order.processedAt, completed: true, icon: Package },
    { 
      title: "Shipped", 
      date: order.fulfillments?.[0]?.createdAt || "Estimated: 1-2 days", 
      completed: order.fulfillments?.length > 0, 
      icon: Truck 
    },
    { 
      title: "Delivered", 
      date: order.displayFulfillmentStatus === 'DELIVERED' ? (order.fulfillments?.[0]?.updatedAt || order.fulfillments?.[0]?.createdAt) : "Estimated: 3-5 days", 
      completed: order.displayFulfillmentStatus === 'DELIVERED', 
      icon: Home 
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1A2E35]/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#1A2E35] text-white p-8 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold mb-0.5">Tracking Order</p>
              <h2 className="text-2xl font-display font-medium">{order.name}</h2>
            </div>
            <button 
              onClick={onClose}
              className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all group"
            >
              <X className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 -mt-4 bg-white rounded-[32px] relative z-20 overflow-y-auto">
          <div className="flex flex-col gap-8">
            {/* Timeline */}
            <div className="space-y-0 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 relative pb-8 last:pb-0">
                  {/* Line */}
                  {idx !== steps.length - 1 && (
                    <div className={`absolute left-4 top-8 w-[2px] h-full ${step.completed ? 'bg-[#5A7A5C]' : 'bg-[#F2EDE4]'}`} />
                  )}
                  
                  {/* Icon Node */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center relative z-10 shrink-0 ${
                    step.completed ? 'bg-[#5A7A5C] text-white' : 'bg-[#F2EDE4] text-[#1A2E35]/20'
                  }`}>
                    <step.icon className="h-4 w-4" />
                    {step.completed && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-white rounded-full flex items-center justify-center text-[#5A7A5C] border-[1px] border-[#5A7A5C]">
                        <CheckCircle2 className="h-2 w-2" />
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="pt-0.5">
                    <h4 className={`text-base font-display font-medium ${step.completed ? 'text-[#1A2E35]' : 'text-[#1A2E35]/30'}`}>
                      {step.title}
                    </h4>
                    <p className={`text-[11px] font-sans-clean mt-0.5 ${step.completed ? 'text-[#1A2E35]/50' : 'text-[#1A2E35]/20'}`}>
                      {step.title === "Shipped" && order.fulfillments?.[0]?.trackingInfo?.[0]?.number 
                        ? `ID: ${order.fulfillments[0].trackingInfo[0].number} • ` 
                        : ""
                      }
                      {step.completed 
                        ? (idx < 3 ? new Date(step.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : new Date(step.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }))
                        : step.date
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DashboardCart = () => {
  const { items, isLoading, updateQuantity, removeItem, checkout } = useCartStore();
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
                  {item.price.currencyCode === 'INR' ? '₹' : item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
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
            {items[0]?.price.currencyCode === 'INR' ? '₹' : items[0]?.price.currencyCode} {totalPrice.toFixed(2)}
          </p>
        </div>
        <button
          onClick={async () => {
            const checkoutUrl = await checkout();
            if (checkoutUrl) window.location.assign(checkoutUrl);
          }}
          disabled={isLoading}
          className="w-full md:w-auto bg-[#5A7A5C] text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#4A634B] transition-all shadow-xl shadow-[#5A7A5C]/20 flex items-center justify-center gap-3"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4" /> Checkout</>}
        </button>
      </div>
    </motion.div>
  );
};

export default Dashboard;

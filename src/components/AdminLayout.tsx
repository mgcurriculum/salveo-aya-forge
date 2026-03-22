import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  User as UserIcon,
  HelpCircle,
  ExternalLink,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredAdminSession, logoutAdmin } from "@/lib/shopifyAdmin";
import { toast } from "sonner";

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const session = getStoredAdminSession();

  const handleLogout = () => {
    logoutAdmin();
    toast.success("Successfully logged out from Admin Portal");
    navigate("/admin-login");
  };

  // Basic security check - in a real app, you'd check for an admin role
  useEffect(() => {
    if (!session) {
      navigate("/admin-login");
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans-clean flex">
      {/* Sidebar Navigation */}
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-[#F2EDE4] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-[#1A2E35]/60 hover:text-[#1A2E35] transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1A2E35]/40">
              <span>Admin</span>
              <span className="text-[#1A2E35]/10">/</span>
              <span className="text-[#1A2E35]">Console</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-[#FDFBF7] border border-[#F2EDE4] rounded-2xl px-4 py-2 w-64 focus-within:border-[#5A7A5C] transition-all group">
              <Search className="h-4 w-4 text-[#1A2E35]/30 group-focus-within:text-[#5A7A5C]" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#1A2E35]/20 font-medium"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-[#1A2E35]/40 hover:text-[#5A7A5C] transition-colors group">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-[#5A7A5C] rounded-full ring-2 ring-white" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 rounded-full bg-white border border-[#F2EDE4] hover:border-[#5A7A5C] transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-[#1A2E35] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                  {session?.name?.[0] || <UserIcon className="h-4 w-4" />}
                </div>
                <div className="hidden sm:block text-left mr-2">
                  <p className="text-xs font-bold text-[#1A2E35] leading-none mb-1">{session?.name || "Admin"}</p>
                  <p className="text-[9px] uppercase tracking-widest text-[#1A2E35]/40 font-bold leading-none">Admin</p>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-[32px] shadow-2xl shadow-[#1A2E35]/10 border border-[#F2EDE4] p-3 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[#F2EDE4] mb-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/40 mb-1">Signed in as</p>
                        <p className="text-sm font-display text-[#1A2E35] truncate">{session?.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A2E35]/60 hover:text-[#5A7A5C] hover:bg-[#FDFBF7] rounded-2xl transition-all group">
                          <ExternalLink className="h-4 w-4 text-[#1A2E35]/20 group-hover:text-[#5A7A5C]" />
                          <span>View Website</span>
                        </Link>
                        <hr className="my-2 border-[#F2EDE4]" />
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="font-bold">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-x-hidden">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

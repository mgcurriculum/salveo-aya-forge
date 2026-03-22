import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  User as UserIcon,
  Bell,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredSession } from "@/lib/shopifyAdmin";

interface AdminSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }: AdminSidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin-salmara" },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare, path: "/admin-salmara/testimonials" },
    { id: "subscribers", label: "Subscribed Users", icon: Users, path: "/admin-salmara/subscribers" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-72 bg-[#1A2E35] text-white z-50 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-display text-xl leading-tight">Salmara</p>
                <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-bold font-sans-clean">Admin Console</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-4 px-3">Main Menu</p>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300
                    ${isActive 
                      ? "bg-[#5A7A5C] text-white shadow-lg shadow-[#5A7A5C]/20" 
                      : "text-white/60 hover:text-white hover:bg-white/5"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-white/40 group-hover:text-white/60"}`} />
                    <span className="text-sm font-sans-clean font-medium">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer User Profile */}
          <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl">
              <div className="h-10 w-10 rounded-full bg-[#5A7A5C] flex items-center justify-center text-white ring-2 ring-white/10">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display truncate truncate">Admin User</p>
                <p className="text-[10px] text-white/40 truncate uppercase tracking-widest">Administrator</p>
              </div>
              <button className="text-white/30 hover:text-white transition-colors" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

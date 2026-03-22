import React, { useState, useEffect } from "react";
import { 
  Users, 
  MessageSquare, 
  Clock,
  ChevronRight,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    testimonials: 0,
    subscribers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: testimonialCount } = await supabase
          .from("testimonials")
          .select("*", { count: "exact", head: true });
        
        const { count: activeSubscribers } = await supabase
          .from("subscribes")
          .select("*", { count: "exact", head: true })
          .eq("is_subscribed", true);

        setStats({
          testimonials: testimonialCount || 0,
          subscribers: activeSubscribers || 0
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#C5A059] font-sans-clean text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            Overview
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-medium text-[#1A2E35]"
          >
            Dashboard
          </motion.h1>
        </div>
        <div className="flex items-center gap-3 bg-white border border-[#F2EDE4] rounded-2xl px-6 py-3 shadow-sm">
          <Clock className="h-4 w-4 text-[#1A2E35]/30" />
          <span className="text-sm font-bold text-[#1A2E35]">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Simplified Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[2.5rem] border border-[#F2EDE4] shadow-sm hover:shadow-xl transition-all group"
        >
          <div className="flex items-start justify-between mb-8">
            <div className="p-5 rounded-2xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/20">Active Database</div>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/40 mb-2">Total Testimonials</p>
          <h3 className="text-5xl font-display font-medium text-[#1A2E35]">
            {loading ? "..." : stats.testimonials}
          </h3>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 text-[10px] font-bold">
            <TrendingUp className="h-4 w-4" />
            <span>Site social proof count</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-10 rounded-[2.5rem] border border-[#F2EDE4] shadow-sm hover:shadow-xl transition-all group"
        >
          <div className="flex items-start justify-between mb-8">
            <div className="p-5 rounded-2xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110">
              <Users className="h-8 w-8" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/20">Active Subscribers</div>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]/40 mb-2">Subscribed Users</p>
          <h3 className="text-5xl font-display font-medium text-[#1A2E35]">
            {loading ? "..." : stats.subscribers}
          </h3>
          <div className="mt-6 flex items-center gap-2 text-[#5A7A5C] text-[10px] font-bold uppercase italic tracking-widest">
            <ArrowUpRight className="h-4 w-4" />
            <span>Growing Audience Reach</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Placeholder / Help Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[#FDFBF7] border border-dashed border-[#F2EDE4] rounded-[2.5rem] p-12 text-center"
      >
        <div className="max-w-md mx-auto space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Management Tip</p>
          <h4 className="text-xl font-display font-medium text-[#1A2E35]">Keep your audience engaged!</h4>
          <p className="text-sm text-[#1A2E35]/40 italic">Use the navigation sidebar to manage your testimonials or export your subscriber list for the next campaign.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;

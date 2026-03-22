import React, { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  Mail, 
  Download,
  Filter,
  Loader2,
  User,
  Calendar,
  CheckCircle2,
  ExternalLink,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Subscriber {
  id: string; // Note: SQL says 'id serial', but Supabase/PostgREST returns it as number/string
  email: string;
  first_name?: string;
  last_name?: string;
  is_subscribed: boolean;
  created_at: string;
}

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscribes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("subscribes")
        .update({ is_subscribed: !currentStatus })
        .eq("id", id);
      
      if (error) throw error;
      setSubscribers(prev => prev.map(s => s.id === id ? { ...s, is_subscribed: !currentStatus } : s));
      toast.success(currentStatus ? "Unsubscribed" : "Subscribed");
    } catch (error: any) {
      toast.error("Status update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber from the list?")) return;
    try {
      const { error } = await supabase
        .from("subscribes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      setSubscribers(prev => prev.filter(s => s.id !== id));
      toast.success("Subscriber removed");
    } catch (error: any) {
      toast.error("Delete failed");
    }
  };

  const handleExport = () => {
    const headers = ["Email", "First Name", "Last Name", "Created At"];
    const csvContent = [
      headers.join(","),
      ...subscribers.map(s => `${s.email},${s.first_name || ""},${s.last_name || ""},${s.created_at}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `salmara_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully");
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.first_name + " " + s.last_name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-[#C5A059] font-sans-clean text-[10px] font-bold uppercase tracking-[0.3em]">Audience</p>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-[#1A2E35]">Subscribers</h1>
        </div>
        <button 
          onClick={handleExport}
          className="bg-white text-[#1A2E35] border border-[#F2EDE4] px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-[#5A7A5C] hover:text-[#5A7A5C] transition-all flex items-center gap-3 shadow-sm"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-[#F2EDE4] flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg italic">
              @
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 mb-1">Total Reach</p>
              <p className="text-2xl font-display font-medium text-[#1A2E35]">{subscribers.length}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-[#F2EDE4] flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 mb-1">Active Now</p>
              <p className="text-2xl font-display font-medium text-[#1A2E35]">100%</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-[#F2EDE4] flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#5A7A5C]/5 flex items-center justify-center text-[#5A7A5C]">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 mb-1">Growth rate</p>
              <p className="text-2xl font-display font-medium text-[#1A2E35]">+14%</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[#F2EDE4] shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-4 border-b border-[#F2EDE4] bg-[#FDFBF7]/30">
          <div className="flex-1 flex items-center gap-3 bg-white border border-[#F2EDE4] rounded-2xl px-4 py-2 focus-within:border-[#5A7A5C] transition-all">
            <Search className="h-4 w-4 text-[#1A2E35]/20" />
            <input 
              type="text" 
              placeholder="Filter by email or name..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-2 border border-[#F2EDE4] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/60 hover:border-[#5A7A5C] hover:text-[#5A7A5C] transition-all flex items-center gap-2">
            <Filter className="h-3 w-3" /> All Lists
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDFBF7]/50 border-b border-[#F2EDE4]">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic">Subscriber</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic">Account Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic">Join Date</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic">Source</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE4]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#5A7A5C] mx-auto" />
                    <p className="mt-4 text-xs font-bold text-[#1A2E35]/20 uppercase tracking-widest">Compiling list...</p>
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="h-16 w-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-[#1A2E35]/5" />
                    </div>
                    <p className="text-sm font-display text-[#1A2E35]/40 italic">No subscribers found.</p>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FDFBF7]/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-[#1A2E35]/5 flex items-center justify-center text-[#1A2E35]/20 group-hover:bg-[#5A7A5C]/10 group-hover:text-[#5A7A5C] transition-all lg:rotate-3 group-hover:rotate-0">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A2E35]">{item.email}</p>
                          <p className="text-[10px] text-[#1A2E35]/40 uppercase tracking-widest font-sans-clean">
                            {item.first_name ? `${item.first_name} ${item.last_name || ""}` : "Unspecified Profile"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleToggleStatus(item.id, item.is_subscribed)}
                        className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${
                          item.is_subscribed
                            ? 'text-emerald-600 bg-emerald-50 border-emerald-100 italic'
                            : 'text-red-500 bg-red-50 border-red-100 opacity-50'
                        }`}
                      >
                        {item.is_subscribed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {item.is_subscribed ? "Subscribed" : "Unsubscribed"}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-[#1A2E35]/40 uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold text-[#1A2E35]/20 uppercase tracking-widest">Direct Website</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-[#1A2E35]/20 hover:text-[#5A7A5C] transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-[#1A2E35]/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-[#FDFBF7]/30 border-t border-[#F2EDE4] flex justify-between items-center">
           <p className="text-[10px] font-bold text-[#1A2E35]/20 uppercase tracking-widest">Showing {filteredSubscribers.length} of {subscribers.length} entries</p>
           <div className="flex gap-2">
             <button disabled className="px-4 py-2 border border-[#F2EDE4] rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/20">Prev</button>
             <button disabled className="px-4 py-2 border border-[#F2EDE4] rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/20">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscribers;

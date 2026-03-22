import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Star, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle,
  Filter,
  Loader2,
  X,
  Upload,
  Calendar,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  designation?: string;
  company?: string;
  message: string;
  rating: number;
  image_url?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company: "",
    message: "",
    rating: 5,
    image_url: "",
    status: "active" as "active" | "inactive"
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch testimonials", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) throw error;
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
      toast.success(`Marked as ${newStatus}`);
    } catch (error: any) {
      toast.error("Status update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast.success("Testimonial deleted");
    } catch (error: any) {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("testimonials")
          .update(formData)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Updated successfully");
      } else {
        const { error } = await supabase
          .from("testimonials")
          .insert([formData]);
        if (error) throw error;
        toast.success("Added successfully");
      }
      setIsModalOpen(false);
      fetchTestimonials();
      setEditingItem(null);
      setFormData({ name: "", designation: "", company: "", message: "", rating: 5, image_url: "", status: "active" });
    } catch (error: any) {
      toast.error("Saving failed", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      designation: item.designation || "",
      company: item.company || "",
      message: item.message,
      rating: item.rating,
      image_url: item.image_url || "",
      status: item.status
    });
    setIsModalOpen(true);
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-[#C5A059] font-sans-clean text-[10px] font-bold uppercase tracking-[0.3em]">Management</p>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-[#1A2E35]">Testimonials</h1>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setFormData({ name: "", designation: "", company: "", message: "", rating: 5, image_url: "", status: "active" });
            setIsModalOpen(true);
          }}
          className="bg-[#1A2E35] text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#5A7A5C] transition-all flex items-center gap-3 shadow-xl shadow-[#1A2E35]/10"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[#F2EDE4] shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-4 border-b border-[#F2EDE4] bg-[#FDFBF7]/30">
          <div className="flex-1 flex items-center gap-3 bg-white border border-[#F2EDE4] rounded-2xl px-4 py-2 focus-within:border-[#5A7A5C] transition-all">
            <Search className="h-4 w-4 text-[#1A2E35]/20" />
            <input 
              type="text" 
              placeholder="Search by name or content..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-2 border border-[#F2EDE4] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/60 hover:border-[#5A7A5C] hover:text-[#5A7A5C] transition-all flex items-center gap-2">
            <Filter className="h-3 w-3" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDFBF7]/50 border-b border-[#F2EDE4]">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic">User</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic">Feedback</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic">Rating</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic">Created</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE4]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#5A7A5C] mx-auto" />
                    <p className="mt-4 text-xs font-bold text-[#1A2E35]/20 uppercase tracking-widest">Loading reviews...</p>
                  </td>
                </tr>
              ) : filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="h-16 w-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-[#1A2E35]/5" />
                    </div>
                    <p className="text-sm font-display text-[#1A2E35]/40 italic">No testimonials found.</p>
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FDFBF7]/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-[#5A7A5C] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full rounded-full object-cover" /> : item.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A2E35]">{item.name}</p>
                          <p className="text-[10px] text-[#1A2E35]/40 uppercase tracking-widest">{item.designation || "Customer"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-[#1A2E35]/60 leading-relaxed font-sans-clean max-w-xs line-clamp-2">
                        {item.message}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-0.5 text-[#C5A059]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < item.rating ? 'fill-current' : 'text-[#F2EDE4]'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                          item.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-red-50 text-red-500 border border-red-100 opacity-50'
                        }`}
                      >
                        {item.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {item.status}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#1A2E35]/30 uppercase tracking-widest">
                        <Calendar className="h-3 w-3" /> {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(item)}
                          className="p-2 text-[#1A2E35]/20 hover:text-[#5A7A5C] transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
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
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#1A2E35]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-[#F2EDE4] max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 text-[#1A2E35]/20 hover:text-[#1A2E35] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-10">
                <p className="text-[#C5A059] font-sans-clean text-[10px] font-bold uppercase tracking-[0.3em] mb-2">{editingItem ? 'Edit Existing' : 'Submit New'}</p>
                <h2 className="text-3xl font-display font-medium text-[#1A2E35]">Testimonial Data</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-white border border-[#F2EDE4] rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#5A7A5C] transition-all"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-1">Designation / Role</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Wellness Consultant"
                      className="w-full bg-white border border-[#F2EDE4] rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#5A7A5C] transition-all"
                      value={formData.designation}
                      onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-1">Integrity Rating</label>
                  <div className="flex gap-3 justify-between py-2 bg-white rounded-2xl border border-[#F2EDE4] px-10">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: s })}
                        className="transition-transform hover:scale-125 hover:rotate-6"
                      >
                        <Star className={`h-8 w-8 ${s <= formData.rating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#F2EDE4]'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-1">The Message</label>
                  <textarea 
                    rows={4}
                    required
                    className="w-full bg-white border border-[#F2EDE4] rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#5A7A5C] transition-all resize-none"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-1">Image URL (Optional)</label>
                    <div className="relative">
                      <input 
                        type="url" 
                        className="w-full bg-white border border-[#F2EDE4] rounded-2xl pl-12 pr-6 py-4 text-sm outline-none focus:border-[#5A7A5C] transition-all"
                        value={formData.image_url}
                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                      />
                      <Upload className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1A2E35]/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-1">Visibility Status</label>
                    <select 
                      className="w-full bg-white border border-[#F2EDE4] rounded-2xl px-6 py-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-[#5A7A5C] transition-all appearance-none"
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="active">ACTIVE & LIVE</option>
                      <option value="inactive">INACTIVE / HIDDEN</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1A2E35] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#5A7A5C] transition-all shadow-2xl shadow-[#1A2E35]/20 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingItem ? 'Save Changes' : 'Publish Testimonial')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTestimonials;

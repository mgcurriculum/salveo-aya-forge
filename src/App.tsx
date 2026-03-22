import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "@/pages/Index";
import ProductDetail from "@/pages/ProductDetail";
import DashboardPage from "@/pages/DashboardPage";
import AboutUsPage from "@/pages/AboutUsPage";
import ClinicsPage from "@/pages/ClinicsPage";
import ShopPage from "@/pages/ShopPage";
import ContactPage from "@/pages/ContactPage";
import BookAppointmentPage from "@/pages/BookAppointmentPage";
import WishlistPage from "@/pages/WishlistPage";
import AffiliatePage from "@/pages/AffiliatePage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import AdminLayout from "@/components/AdminLayout";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminTestimonials from "@/pages/AdminTestimonials";
import AdminSubscribers from "@/pages/AdminSubscribers";
import ScrollToTop from "@/components/ScrollToTop";
import AdminLoginPage from "@/pages/AdminLoginPage";
import { getStoredAdminSession } from "@/lib/shopifyAdmin";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const admin = getStoredAdminSession();
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }
  return <>{children}</>;
};

const queryClient = new QueryClient();

const CartSyncProvider = ({ children }: { children: React.ReactNode }) => {
  useCartSync();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <CartSyncProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/clinics" element={<ClinicsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* <Route path="/book-appointment" element={<BookAppointmentPage />} /> */}
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/affiliate" element={<AffiliatePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            {/* Admin Salmara Routes */}
            <Route path="/admin-salmara" element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartSyncProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

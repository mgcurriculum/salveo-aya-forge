import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import AboutUsPage from "./pages/AboutUsPage.tsx";
import ClinicsPage from "./pages/ClinicsPage.tsx";
import ShopPage from "./pages/ShopPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import BookAppointmentPage from "./pages/BookAppointmentPage.tsx";
import WishlistPage from "./pages/WishlistPage.tsx";
import AffiliatePage from "./pages/AffiliatePage.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop";

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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartSyncProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

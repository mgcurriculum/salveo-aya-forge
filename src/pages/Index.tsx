import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import FeaturedProducts from "@/components/FeaturedProducts";
import IngredientHighlights from "@/components/IngredientHighlights";
import ConsultationSection from "@/components/ConsultationSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import AffiliateSection from "@/components/AffiliateSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

const Index = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      <HeroSection />
      <AboutSection />
      <WhyChooseUs />
      <FeaturedProducts />
      <IngredientHighlights />
      <ConsultationSection />
      <TestimonialsSection />
      <BlogSection />
      <AffiliateSection />
      <NewsletterSection />
    </main>
    <Footer />
    <FloatingButtons />
  </div>
);

export default Index;

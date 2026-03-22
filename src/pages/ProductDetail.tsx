import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchProductByHandleViaAdmin,
  checkCustomerHasPurchased,
  getStoredSession,
  fetchReviewStatsViaAdmin,
  createHybridCheckout,
  logCheckoutToTerminal
} from "@/lib/shopifyAdmin";
import { useCartStore } from "@/stores/cartStore";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Loader2, 
  Leaf, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  ChevronDown,
  Plus,
  Minus,
  AlertCircle,
  Package, 
  ArrowRight,
  Heart,
  X,
  Send,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useReviewStore } from "@/stores/reviewStore";
import { useQuestionStore } from "@/stores/questionStore";

const faqs = [
  { q: "Is this suitable for daily use?", a: "Yes, this formulation is designed for consistent support. However, we always recommend following the dosage directed by your practitioner." },
  { q: "How soon will I see results?", a: "Ayurveda works with the body's natural rhythms. While some feel immediate support, consistent use for 4-6 weeks is typically recommended for stabilizing results." },
  { q: "Can I take it with other supplements/medications?", a: "Our formulas are natural, but we advise a 30-minute gap between different supplements. Consult your doctor if you are on specific prescription medication." },
  { q: "Is it safe during pregnancy/breastfeeding?", a: "We recommend consulting your healthcare provider before starting any new wellness regimen during pregnancy or lactation." },
  { q: "What is your return policy?", a: "We accept returns for damaged items within 7 days of delivery. For more details, please visit our dedicated returns policy page." },
];

const ProductDetail = () => {
  const navigate = useNavigate();
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const { addItem, isLoading } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addReview, getReviews, getAverageRating } = useReviewStore();
  const { addQuestion } = useQuestionStore();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewName, setReviewName] = useState("");

  const [questionName, setQuestionName] = useState("");
  const [questionEmail, setQuestionEmail] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Safely calculate average rating
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const averageRating = safeReviews.length > 0 
    ? parseFloat((safeReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / safeReviews.length).toFixed(1))
    : 4.9; // Fallback to premium default

  useEffect(() => {
    const session = getStoredSession();
    if (session?.user) {
      setReviewName(session.user.name || "");
      setQuestionName(session.user.name || "");
      setQuestionEmail(session.user.email || "");
      
      if (product?.id) {
        checkEligibility(session.user.id, product.id);
      }
    }
  }, [product?.id]);

  const checkEligibility = async (customerId: string, productId: string) => {
    setIsCheckingEligibility(true);
    try {
      const purchased = await checkCustomerHasPurchased(customerId, productId);
      setHasPurchased(purchased);
    } catch (error) {
      console.error("Eligibility check failed:", error);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  useEffect(() => {
    const loadReviews = async () => {
      if (!product?.id) return;
      try {
        const response = await fetch(`/api/reviews?product_id=${encodeURIComponent(product.id)}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(Array.isArray(data) ? data : []);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      }
    };
    loadReviews();
  }, [product?.id]);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;

    if (!questionName.trim() || !questionEmail.trim() || !questionText.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmittingQuestion(true);
    try {
      addQuestion(handle, {
        name: questionName,
        email: questionEmail,
        question: questionText,
      });
      toast.success("Question submitted", { description: "We'll get back to you soon!" });
      setQuestionText("");
    } catch (error) {
      toast.error("Failed to submit question");
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;
    
    const session = getStoredSession();
    if (!session?.user) {
      toast.info("Please login to leave a review");
      navigate("/login");
      return;
    }

    if (!hasPurchased) {
      toast.error("Verification Required", { 
        description: "Only customers who purchased this product can leave a review." 
      });
      return;
    }
    
    if (!reviewComment.trim()) {
      toast.error("Please add your feedback");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerId: session.user.id,
          rating: reviewRating,
          reviewText: reviewComment,
          customerName: reviewName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Review submitted", { description: "Thank you for your feedback!" });
        setReviewModalOpen(false);
        setReviewComment("");
        // Reload reviews
        const updatedReviews = await fetch(`/api/reviews?product_id=${encodeURIComponent(product.id)}`).then(r => r.json());
        setReviews(Array.isArray(updatedReviews) ? updatedReviews : []);
      } else {
        toast.error("Submission failed", { description: data.error || "Failed to save review" });
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setLoading(true);
      try {
        const data = await fetchProductByHandleViaAdmin(handle);
        if (data) {
          setProduct(data);
          // Set initial variant
          if (data.variants?.edges?.length > 0) {
            setSelectedVariantIdx(0);
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="h-8 w-8 animate-spin text-[#5A7A5C]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-4">
        <Leaf className="h-16 w-16 text-[#1A2E35]/10" />
        <p className="text-[#1A2E35]/40 font-body">Formulation not found</p>
        <Link to="/shop" className="text-[#5A7A5C] font-bold uppercase tracking-widest text-xs border-b border-[#5A7A5C] pb-1">Return to Shop</Link>
      </div>
    );
  }

  const getBenefitLine = (handle: string, type: string) => {
    const benefits: Record<string, string> = {
      "karpooradi-thailam": "Fast-absorbing oil for muscle comfort and relaxation.",
      "brahmi-hair-oil": "Nourishing formula for scalp health and natural shine.",
      "triphala-churna": "Traditional digestive support for internal balance.",
      "triphala-tablets": "Convenient daily support for digestive wellness.",
      "sahacharadi-thailam": "Standardized oil for joint mobility and lower back support.",
      "murivenna": "Herbal first-aid oil for quick recovery and skin resilience.",
      "pinda-thailam": "Cooling ayurvedic oil for inflammatory support and comfort.",
      "dhanwantharam-thailam": "Versatile restorative oil for postnatal and general wellness."
    };
    return benefits[handle] || `Expertly balanced Ayurvedic formulation for ${type?.toLowerCase() || 'holistic'} support.`;
  };

  const benefitLine = getBenefitLine(handle || '', product.productType);
  const subtitle = product.description?.split('.')[0] + '.' || `${product.productType} formulation for balanced internal wellness.`;

  const variants = product.variants?.edges || [];
  const selectedVariant = variants[selectedVariantIdx]?.node;
  const images = product.images?.edges || [];
  const hasMultipleVariants = variants.length > 1 && !(variants.length === 1 && variants[0].node.title === "Default Title");

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: product.title, position: "top-center" });
  };
  
  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    
    const session = getStoredSession();
    if (!session?.user) {
       toast.info("Please sign in to proceed with direct checkout");
      const encodedId = encodeURIComponent(selectedVariant.id);
      navigate(`/login?redirect=buy_now&variantId=${encodedId}&quantity=${quantity}`);
      return;
    }

    setIsBuyingNow(true);
    const toastId = toast.loading("Generating secure checkout link...");
    
    try {
      const lineItems = [{ variantId: selectedVariant.id, quantity: quantity }];
      const result = await createHybridCheckout(lineItems, session.user.id, session.user.email);
      
       if (result.success && result.checkoutUrl) {
        console.log("ProductDetail: Redirecting to Direct Buy Now:", result.checkoutUrl);
        await logCheckoutToTerminal(result.checkoutUrl, `ProductDetail (Buy Now: ${encodeURIComponent(selectedVariant.id)})`);
        window.location.href = result.checkoutUrl;
      } else {
        toast.error("Checkout failed", { 
          description: "Could not generate checkout link. Please try again." 
        });
        setIsBuyingNow(false);
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred");
      setIsBuyingNow(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <main className="pt-4 md:pt-8 pb-0 md:pb-24">
        <div className="container px-4 mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 mb-12">
            <Link to="/" className="hover:text-[#5A7A5C]">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="hover:text-[#5A7A5C]">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#1A2E35]">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
            <div className="space-y-6">
              <div className="sticky top-32">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
                  className="aspect-square bg-white rounded-3xl overflow-hidden border border-[#F2EDE4] flex items-center justify-center shadow-lg mb-6 relative cursor-zoom-in"
                >
                  {images[selectedImage]?.node ? (
                    <motion.img 
                      src={images[selectedImage].node.url} 
                      alt={images[selectedImage].node.altText || product.title} 
                      className="w-full h-full object-cover transition-transform duration-200 ease-out"
                      style={{
                        transform: isZooming ? `scale(2)` : `scale(1)`,
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                      }}
                    />
                  ) : (
                    <Leaf className="h-20 w-20 text-[#1A2E35]/10" />
                  )}
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      if (selectedVariant) await toggleItem({ node: product } as any, selectedVariant.id);
                    }}
                    className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all z-20 ${
                      selectedVariant && isInWishlist(selectedVariant.id) 
                        ? 'bg-red-500 border-red-500 text-white' 
                        : 'bg-white/80 border-[#F2EDE4] text-[#1A2E35] hover:bg-white'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${selectedVariant && isInWishlist(selectedVariant.id) ? 'fill-white' : ''}`} />
                  </button>
                </motion.div>
                
                {images.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {images.map((img: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${i === selectedImage ? 'border-[#5A7A5C]' : 'border-[#F2EDE4] hover:border-[#5A7A5C]/30'}`}
                      >
                        <img src={img.node.url} alt={img.node.altText || ''} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-[#5A7A5C]/5 rounded-full border border-[#5A7A5C]/10"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-[#5A7A5C]" />
                  <span className="text-[9px] uppercase tracking-[0.22em] text-[#5A7A5C] font-bold">{benefitLine || "Batch Verified"}</span>
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-[#1A2E35] leading-tight tracking-tight">
                  {product.title}
                </h1>
                
                <p className="text-lg text-[#1A2E35]/50 font-sans-clean leading-relaxed max-w-md">
                   {subtitle || `${product.productType} formulation for balanced internal wellness.`}
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-[8px] font-bold text-[#1A2E35]/40 uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3 text-[#5A7A5C]" /> GMP
                  </div>
                  <div className="flex items-center gap-2 text-[8px] font-bold text-[#1A2E35]/40 uppercase tracking-widest">
                    <Leaf className="h-3 w-3 text-[#C5A059]" /> 100% Herbal
                  </div>
                  <div className="flex items-center gap-2 text-[8px] font-bold text-[#1A2E35]/40 uppercase tracking-widest">
                    <CheckCircle2 className="h-3 w-3 text-[#5A7A5C]" /> CLINICAL
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-4xl font-display font-medium text-[#1A2E35]">
                    {selectedVariant?.price.currencyCode === 'INR' ? '₹' : selectedVariant?.price.currencyCode}{' '}
                    {parseFloat(selectedVariant?.price.amount || "0").toFixed(0)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm text-[#1A2E35]/30 line-through">₹ {((parseFloat(selectedVariant?.price.amount || "0") * 1.25)).toFixed(0)}</span>
                    <span className="text-[#5A7A5C] text-[10px] font-bold uppercase tracking-wider">Save 25% Today</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 whitespace-nowrap">
                  <div className="flex gap-1 shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`h-4 w-4 ${s <= Math.round(averageRating) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#F2EDE4]'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1A2E35] shrink-0">
                    {averageRating}
                  </span>
                  <a href="#reviews" className="text-xs text-[#1A2E35]/40 shrink-0 hover:text-[#5A7A5C] underline underline-offset-4">
                    ({safeReviews.length} reviews)
                  </a>
                </div>
              </div>

              {hasMultipleVariants && (
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-1">Select Format</label>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((v: any, i: number) => (
                      <button
                        key={v.node.id}
                        onClick={() => { setSelectedVariantIdx(i); setSelectedImage(0); }}
                        disabled={!v.node.availableForSale}
                        className={`px-8 py-4 rounded-2xl text-[10px] font-bold transition-all border uppercase tracking-widest ${
                          i === selectedVariantIdx
                            ? 'bg-[#1A2E35] border-[#1A2E35] text-white shadow-[#1A2E35]/20 shadow-xl'
                            : 'bg-white border-[#F2EDE4] text-[#1A2E35] hover:border-[#5A7A5C]'
                        } ${!v.node.availableForSale ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {v.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6 pt-6 border-t border-[#F2EDE4]">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="flex items-center bg-white border border-[#F2EDE4] rounded-2xl px-2 h-16 sm:w-32 justify-between">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 text-[#1A2E35]/30 hover:text-[#1A2E35]">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-center font-display font-medium text-[#1A2E35] min-w-[2ch]">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-4 text-[#1A2E35]/30 hover:text-[#1A2E35]">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isLoading || !selectedVariant?.availableForSale}
                    className="flex-1 bg-[#5A7A5C] text-white h-16 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#4A634B] transition-all shadow-xl shadow-[#5A7A5C]/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      !selectedVariant?.availableForSale ? "Sold Out" : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
                    )}
                  </button>
                </div>
                
                <button 
                  onClick={handleBuyNow}
                  disabled={isBuyingNow || !selectedVariant?.availableForSale}
                  className="w-full bg-[#1A2E35] text-white h-16 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#1A2E35]/90 transition-all disabled:opacity-50 disabled:bg-[#f2f2f2] disabled:text-gray-400 shadow-xl shadow-[#1A2E35]/20 flex items-center justify-center gap-2"
                >
                  {isBuyingNow ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isBuyingNow ? "Redirecting..." : (!selectedVariant?.availableForSale ? "Sold Out" : "Buy Now Direct")}
                </button>
              </div>

              <div className="pt-8 space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-1">Detailed Description</label>
                <div 
                  className="text-sm text-[#1A2E35]/60 font-sans-clean leading-relaxed prose prose-sm prose-stone max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                />
              </div>
            </div>
          </div>

          <section className="py-24 border-t border-[#F2EDE4]">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-[#C5A059] font-sans-clean text-[10px] font-bold uppercase tracking-[0.3em] mb-4">THE SALMARA EXPERIENCE</p>
              <h2 className="text-3xl font-display font-medium text-[#1A2E35] mb-12">How it Supports Your Wellness</h2>
              <div className="grid md:grid-cols-2 gap-12 text-left">
                {[
                  `Expertly balanced to support ${product.productType?.toLowerCase() || 'general'} wellness and vitality.`,
                  "Formulated with traditional botanical extracts for consistent, stabilizing results.",
                  "Contains pure herbal concentrations that respect the body's natural rhythms.",
                  "Supports smooth metabolic flow and adaptive internal resilience."
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-4 p-8 bg-white rounded-3xl border border-[#F2EDE4] hover:border-[#5A7A5C]/30 transition-all">
                    <div className="h-8 w-8 bg-[#5A7A5C]/5 rounded-xl flex items-center justify-center text-[#5A7A5C] shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-sans-clean text-[#1A2E35]/70 leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 bg-white -mx-4 px-4 border-y border-[#F2EDE4]">
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="text-center">
                <h2 className="text-3xl font-display font-medium text-[#1A2E35] mb-4">Pure Ingredients. Scientific Precision.</h2>
                <p className="text-[#1A2E35]/40 font-sans-clean max-w-xl mx-auto text-sm">We believe transparency is the root of trust. Every milligram in this formulation is ethically sourced and standardized.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {(product.tags?.slice(0, 3) || ["Dashamoola", "Botanical Extract", "Ayurvedic Base"]).map((ing: string) => (
                  <div key={ing} className="p-10 rounded-3xl border border-[#F2EDE4] text-center hover:bg-[#FDFBF7] transition-all group">
                    <div className="w-16 h-16 bg-[#FDFBF7] rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-[#5A7A5C]/5 transition-colors">
                      <Leaf className="h-6 w-6 text-[#5A7A5C]" />
                    </div>
                    <h4 className="text-sm font-bold text-[#1A2E35] uppercase tracking-widest">{ing}</h4>
                    <p className="text-[11px] text-[#1A2E35]/40 mt-3 uppercase tracking-widest">Standardized Integrity</p>
                  </div>
                ))}
              </div>

              <div className="p-10 bg-[#F2EDE4]/20 rounded-3xl text-center space-y-4">
                <ShieldCheck className="h-8 w-8 text-[#5A7A5C] mx-auto mb-2" />
                <h3 className="text-xl font-display font-medium text-[#1A2E35]">Clinical Formulation Standards</h3>
                <p className="text-sm text-[#1A2E35]/60 max-w-2xl mx-auto leading-relaxed font-sans-clean">
                  Salmara Ayurveda aligns with GMP (Good Manufacturing Practices) and rigorous hygiene standards. Every batch is tested for consistency and ensures no added harmful synthetics, supporting a holistic journey without compromise.
                </p>
              </div>
            </div>
          </section>

          <section className="py-24 max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-medium text-[#1A2E35] text-center mb-12">Suggested Use</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="h-12 w-12 bg-[#1A2E35] text-white rounded-2xl flex items-center justify-center font-display font-medium shrink-0">01</div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A2E35] uppercase tracking-widest mb-2">Dosage</h4>
                    <p className="text-sm text-[#1A2E35]/50 leading-relaxed font-sans-clean">Take 1-2 units twice daily, or as directed by your healthcare practitioner. Consistency is key for Ayurvedic efficacy.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="h-12 w-12 bg-[#1A2E35] text-white rounded-2xl flex items-center justify-center font-display font-medium shrink-0">02</div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A2E35] uppercase tracking-widest mb-2">Timing</h4>
                    <p className="text-sm text-[#1A2E35]/50 leading-relaxed font-sans-clean">Best consumed after meals with lukewarm water or milk for optimal bioavailability and gentle digestion.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1A2E35] text-white p-10 rounded-3xl space-y-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-[#C5A059]" />
                  <span className="text-xs font-bold uppercase tracking-widest">Safety Notes</span>
                </div>
                <ul className="space-y-4 text-xs font-sans-clean text-white/60 leading-relaxed">
                  <li>• Store in a cool, dry place away from direct sunlight.</li>
                  <li>• Use within the specific batch timelines (see packaging).</li>
                  <li>• Consult your Ayurvedic practitioner if pregnant or nursing.</li>
                  <li>• For external oils: Conduct a patch test on a small area first.</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="reviews" className="py-24 max-w-4xl mx-auto border-b border-[#F2EDE4]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 md:mb-16">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-medium text-[#1A2E35]">Customer Reviews</h2>
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star 
                        key={s} 
                        className={`h-4 w-4 ${s <= Math.round(averageRating) ? 'fill-current' : 'text-[#F2EDE4]'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1A2E35]/40 uppercase tracking-widest whitespace-nowrap">
                    Based on {safeReviews.length} verified ratings
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setReviewModalOpen(true)}
                className="w-full sm:w-auto bg-[#1A2E35] text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A2E35]/90 transition-all shadow-lg shadow-[#1A2E35]/20 disabled:opacity-50"
                disabled={!hasPurchased || isCheckingEligibility}
              >
                {isCheckingEligibility ? "Verifying..." : "Write a Review"}
              </button>
            </div>
            
            {!hasPurchased && !isCheckingEligibility && (
              <div className="mb-12 p-6 bg-[#5A7A5C]/5 border border-[#5A7A5C]/10 rounded-2xl flex items-center gap-4">
                <Info className="h-5 w-5 text-[#5A7A5C]" />
                <p className="text-sm font-sans-clean text-[#5A7A5C]/80">
                  Only customers who purchased this product can leave a review.
                </p>
              </div>
            )}
            
            <div className="space-y-8">
              <AnimatePresence mode="popLayout">
                {safeReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-3xl border border-[#F2EDE4] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex gap-1 text-[#C5A059]">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-current' : 'text-[#F2EDE4]'}`} />
                          ))}
                        </div>
                        <p className="font-display font-medium text-[#1A2E35]">{review.customer_name || "Verified Customer"}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#1A2E35]/30 uppercase tracking-widest shrink-0">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-[#1A2E35]/60 leading-relaxed font-sans-clean">
                      {review.review_text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {safeReviews.length === 0 && (
                <div className="text-center py-20 bg-white border border-[#F2EDE4] rounded-3xl">
                  <p className="text-sm text-[#1A2E35]/40 italic font-body mb-6">"Be the first to review this formulation."</p>
                  <div className="h-10 w-px bg-[#F2EDE4] mx-auto" />
                </div>
              )}
            </div>
          </section>

          <AnimatePresence>
            {reviewModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setReviewModalOpen(false)}
                  className="absolute inset-0 bg-[#1A2E35]/40 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-lg bg-[#FDFBF7] rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-[#F2EDE4]"
                >
                  <button 
                    onClick={() => setReviewModalOpen(false)}
                    className="absolute top-8 right-8 p-2 text-[#1A2E35]/20 hover:text-[#1A2E35] transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="text-center mb-6">
                    <p className="text-[#5A7A5C] font-sans-clean text-[10px] font-bold uppercase tracking-[0.3em] mb-3">Share your experience</p>
                    <h3 className="text-3xl font-display font-medium text-[#1A2E35]">Product Review</h3>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40">Your Rating</label>
                      <div className="flex gap-2 justify-center py-2 bg-white rounded-2xl border border-[#F2EDE4]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 transition-transform hover:scale-125 focus:outline-none"
                          >
                            <Star 
                              className={`h-7 w-7 transition-colors ${star <= reviewRating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#F2EDE4]'}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40">Your Name</label>
                      <input
                        type="text"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white border border-[#F2EDE4] rounded-2xl px-6 py-3 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40">Your Feedback</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="How has this formulation supported you?"
                        rows={3}
                        className="w-full bg-white border border-[#F2EDE4] rounded-2xl px-6 py-3 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-colors resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full bg-[#1A2E35] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#5A7A5C] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#1A2E35]/10 disabled:opacity-50"
                    >
                      {isSubmittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Submit Review <Send className="h-4 w-4" /></>}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <section className="py-12 md:py-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-medium text-[#1A2E35] text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-[#F2EDE4] rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full text-left px-8 py-6 flex items-center justify-between hover:bg-[#F2EDE4]/20 transition-all group"
                  >
                    <span className="text-sm font-bold text-[#1A2E35] uppercase tracking-widest leading-relaxed pr-8">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-[#1A2E35]/30 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8"
                      >
                        <p className="text-sm text-[#1A2E35]/50 leading-relaxed font-sans-clean pt-2 border-t border-[#F2EDE4]">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>

          <section className="py-24 border-t border-[#F2EDE4]">
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#1A2E35] rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#5A7A5C]/10 rounded-full blur-3xl" />
                
                <div className="grid lg:grid-cols-2 gap-16 relative z-10">
                  <div className="space-y-6">
                    <p className="text-[#C5A059] font-sans-clean text-[10px] font-bold uppercase tracking-[0.3em]">Support & Guidance</p>
                    <h2 className="text-4xl md:text-5xl font-display font-medium text-white leading-tight">
                      Have a Doubt? <br />
                      <span className="italic text-white/60 text-3xl font-body">Ask a Question</span>
                    </h2>
                    <p className="text-white/60 font-sans-clean leading-relaxed">
                      Our practitioners are here to guide you. Whether it's about ingredients, dosage, or specific wellness goals, we're happy to help.
                    </p>
                    
                    <div className="pt-8 flex flex-col gap-4">
                      <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                        <div className="h-px w-8 bg-white/10" /> Response within 24 hours
                      </div>
                      <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                        <div className="h-px w-8 bg-white/10" /> Personalized Guidance
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleQuestionSubmit} className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={questionName}
                          onChange={(e) => setQuestionName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#C5A059] transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={questionEmail}
                          onChange={(e) => setQuestionEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#C5A059] transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Your Question</label>
                        <textarea
                          required
                          value={questionText}
                          onChange={(e) => setQuestionText(e.target.value)}
                          placeholder="What would you like to know?"
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#C5A059] transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingQuestion}
                      className="w-full bg-[#C5A059] text-[#1A2E35] py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all flex items-center justify-center gap-2 group"
                    >
                      {isSubmittingQuestion ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Submit Inquiry 
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;

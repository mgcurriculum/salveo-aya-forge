import { useState, useEffect, useRef, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ShoppingCart, 
  ShieldCheck, 
  CheckCircle2, 
  Package, 
  ArrowRight,
  Leaf,
  Loader2,
  X,
  Check,
  Heart,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { type ShopifyProduct, createStorefrontCheckout } from "@/lib/shopify";
import { fetchProductsViaAdmin } from "@/lib/shopifyAdmin";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
// Assuming getStoredSession is available or will be added - REMOVED as no longer needed
// import { getStoredSession } from "@/lib/shopify"; 

const concerns = [
  { id: "pain", title: "Pain & Mobility", desc: "For muscle relief, joints, and inflammation support." },
  { id: "women", title: "Women’s Wellness", desc: "Hormonal balance and cycle-specific nutritional care." },
  { id: "kidney", title: "Kidney & Urinary Health", desc: "Natural support for stone clearance and urinary tract health." },
  { id: "liver", title: "Liver & Detox", desc: "Hepatic support and metabolic waste elimination." },
  { id: "gut", title: "Gut Health & Digestion", desc: "Restoring digestive fire and smooth bowel movements." },
  { id: "immunity", title: "Immunity (Tulsi Range)", desc: "Seasonal protection and respiratory shield formulations." },
];

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under ₹500", value: "0-500" },
  { label: "₹500 - ₹1,000", value: "500-1000" },
  { label: "₹1,000 - ₹2,000", value: "1000-2000" },
  { label: "Over ₹2,000", value: "2000-plus" },
];

const ShopPage = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  
  // Filter & Sort State
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState("Bestselling");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { addItem, isLoading: isCartStoreLoading } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, margin: "-100px" });

  useEffect(() => {
    setLoading(true);
    fetchProductsViaAdmin(50) // Fetch more for better filtering
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));

    // Handle search parameter from URL
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []);

  // Derived Categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.node.productType).filter(Boolean));
    return ["All Categories", ...Array.from(cats)];
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Concern Filter (Search in description or tags)
      if (selectedConcern) {
        const query = selectedConcern.toLowerCase();
        const matchesConcern = p.node.description.toLowerCase().includes(query) || 
                               p.node.title.toLowerCase().includes(query) ||
                               p.node.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesConcern) return false;
      }
      
      // 2. Category Filter
      if (selectedCategory !== "All Categories" && p.node.productType !== selectedCategory) {
        return false;
      }
      
      // 3. Price Filter
      const price = parseFloat(p.node.variants.edges[0]?.node?.price.amount || "0");
      if (selectedPriceRange !== "all") {
        const [min, max] = selectedPriceRange.split("-");
        if (max === "plus") {
          if (price < parseFloat(min)) return false;
        } else {
          if (price < parseFloat(min) || price > parseFloat(max)) return false;
        }
      }
      
      // 4. Availability Filter
      if (inStockOnly && !p.node.variants.edges.some(v => {
        // Since we mapped Admin API inventoryQuantity to availableForSale in shopifyAdmin.ts
        // we can simply check availableForSale or check inventoryQuantity directly if provided
        if (typeof (v.node as any).inventoryQuantity === 'number') {
          return (v.node as any).inventoryQuantity > 0;
        }
        return v.node.availableForSale;
      })) {
        return false;
      }
      
      // 5. Search Query
      if (searchQuery && !p.node.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sorting Logic
      const priceA = parseFloat(a.node.variants.edges[0]?.node?.price.amount || "0");
      const priceB = parseFloat(b.node.variants.edges[0]?.node?.price.amount || "0");
      
      if (sortBy === "Price: Low to High") return priceA - priceB;
      if (sortBy === "Price: High to Low") return priceB - priceA;
      if (sortBy === "Newest First") return b.node.id.localeCompare(a.node.id); // Simple ID fallback for mock "newest"
      if (sortBy === "Doctor Recommended") {
        const isDocA = a.node.tags?.includes("Doctor Recommended") || a.node.handle === 'brahmi-hair-oil';
        const isDocB = b.node.tags?.includes("Doctor Recommended") || b.node.handle === 'brahmi-hair-oil';
        if (isDocA && !isDocB) return -1;
        if (!isDocA && isDocB) return 1;
        return 0;
      }
      return 0; // Default Bestselling
    });
  }, [products, selectedConcern, selectedCategory, selectedPriceRange, inStockOnly, sortBy, searchQuery]);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    
    setAddingId(product.node.id);
    try {
      await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
      toast.success("Added to cart", { description: product.node.title, position: "top-center" });
    } finally {
      setAddingId(null);
    }
  };

  const handleBuyNow = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) {
      console.error("No variant found for product:", product.node.title);
      toast.error("Product unavailable", { description: "This product has no available variants." });
      return;
    }
    
    console.log("Buy Now started for:", product.node.title, "Variant ID:", variant.id);
    setBuyingId(product.node.id);
    
    try {
      const result = await createStorefrontCheckout(
        [{ variantId: variant.id, quantity: 1 }]
      );

      if (result) {
        console.log("Buy Now redirecting to:", result);
        window.location.href = result;
      } else {
        console.error("Buy Now: No result URL returned");
        toast.error("Checkout failed", { description: "Could not generate checkout link. Please try adding to cart." });
      }
    } catch (error) {
      console.error("Buy Now Error:", error);
      toast.error("Something went wrong", { description: "Please try again or use standard Add to Cart." });
    } finally {
      setBuyingId(null);
    }
  };

  const clearFilters = () => {
    setSelectedConcern(null);
    setSelectedCategory("All Categories");
    setSelectedPriceRange("all");
    setInStockOnly(false);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <main>
        {/* 1) Hero Section */}
        <section className="relative min-h-[60vh] md:h-[60vh] py-20 md:py-0 flex items-center justify-center bg-[#1A2E35] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E35] via-[#1A2E35]/90 to-[#1A2E35]/80" />
          
          <div className="container px-4 relative z-10 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-display font-medium text-white mb-6 leading-tight">
                Explore Our Certified <br className="sm:hidden" /> Ayurvedic Range
              </h1>
              <p className="text-white/80 text-xs sm:text-sm md:text-xl font-body leading-relaxed mb-10 max-w-2xl mx-auto px-4">
                From muscle relief oils to immunity blends, each Salmara formulation is crafted under GMP-certified conditions and tested with quality standards for consistent results.
              </p>
              <button 
                onClick={() => {
                  document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-[#1A2E35] px-10 py-4 sm:px-12 sm:py-5 rounded-2xl font-bold tracking-widest uppercase text-[10px] sm:text-xs hover:bg-[#F2EDE4] transition-all shadow-2xl"
              >
                Shop All Products
              </button>
            </motion.div>
          </div>
        </section>

        {/* 2) Shop by Concern */}
        <section className="py-24 bg-[#FDFBF7]">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-medium text-[#1A2E35] mb-4">Find What Fits Your Wellness</h2>
              <p className="text-[#1A2E35]/40 text-sm font-sans-clean">Selecting a concern will tailor the formulations shown in the grid below.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {concerns.map((concern) => (
                <button
                  key={concern.id}
                  onClick={() => setSelectedConcern(selectedConcern === concern.id ? null : concern.id)}
                  className={`p-10 rounded-3xl border text-left transition-all group ${
                    selectedConcern === concern.id 
                    ? 'bg-[#5A7A5C] border-[#5A7A5C] shadow-2xl shadow-[#5A7A5C]/20 text-white' 
                    : 'bg-white border-[#F2EDE4] hover:border-[#5A7A5C] hover:shadow-xl'
                  }`}
                >
                  <h3 className={`text-xl font-display font-medium mb-3 transition-colors ${selectedConcern === concern.id ? 'text-white' : 'text-[#1A2E35]'}`}>
                    {concern.title}
                  </h3>
                  <p className={`text-sm font-sans-clean leading-relaxed transition-colors ${selectedConcern === concern.id ? 'text-white/80' : 'text-[#1A2E35]/50'}`}>
                    {concern.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3) Filters & Sorting */}
        <section id="product-grid" className="py-8 md:py-12 border-t border-[#F2EDE4] bg-[#FDFBF7] sticky top-[64px] lg:top-[80px] z-40">
          <div className="container px-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-8">
                {/* Search & Mobile Filter Toggle */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 lg:flex-none group">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-[#1A2E35]/30 group-focus-within:text-[#5A7A5C] transition-colors" />
                    </div>
                    <input 
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white border border-[#F2EDE4] rounded-xl pl-10 pr-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35] focus:outline-none focus:border-[#5A7A5C] transition-all w-full lg:w-64 placeholder:text-[#1A2E35]/20"
                    />
                  </div>
                  
                  {/* Mobile Filter Toggle Button */}
                  <button 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className={`lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                      showMobileFilters || selectedConcern || selectedCategory !== "All Categories" || selectedPriceRange !== "all" 
                      ? 'bg-[#5A7A5C] border-[#5A7A5C] text-white' 
                      : 'bg-white border-[#F2EDE4] text-[#1A2E35]'
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
                    {(selectedConcern || selectedCategory !== "All Categories" || selectedPriceRange !== "all") && (
                      <span className="ml-1 w-2 h-2 rounded-full bg-red-400 border border-white" />
                    )}
                  </button>
                </div>

                {/* Filter Controls - Conditional on Mobile */}
                <div className={`${showMobileFilters ? 'flex' : 'hidden'} lg:flex flex-wrap items-center gap-2 lg:gap-6 mt-2 lg:mt-0 p-2 lg:p-0 bg-white lg:bg-transparent rounded-2xl border border-[#F2EDE4] lg:border-none shadow-xl lg:shadow-none`}>
                  {/* Category Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35] hover:text-[#5A7A5C] transition-colors focus:outline-none px-3 py-2 bg-[#FDFBF7] lg:bg-transparent rounded-lg">
                      Category <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white rounded-2xl border-[#F2EDE4] shadow-2xl p-2 z-[100]">
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-4 py-3">Select Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="space-y-1">
                        {categories.map((cat) => (
                          <DropdownMenuItem 
                            key={cat} 
                            onClick={() => setSelectedCategory(cat)}
                            className={`rounded-xl px-4 py-3 cursor-pointer text-xs font-display hover:bg-[#F2EDE4]/30 transition-colors ${
                              selectedCategory === cat ? 'text-[#5A7A5C] font-bold bg-[#5A7A5C]/5' : 'text-[#1A2E35]'
                            }`}
                          >
                            {cat}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Price Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35] hover:text-[#5A7A5C] transition-colors focus:outline-none px-3 py-2 bg-[#FDFBF7] lg:bg-transparent rounded-lg">
                      Price <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white rounded-2xl border-[#F2EDE4] shadow-2xl p-2 z-[100]">
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-4 py-3">Price Range</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="space-y-1">
                        {priceRanges.map((range) => (
                          <DropdownMenuItem 
                            key={range.value} 
                            onClick={() => setSelectedPriceRange(range.value)}
                            className={`rounded-xl px-4 py-3 cursor-pointer text-xs font-display hover:bg-[#F2EDE4]/30 transition-colors ${
                              selectedPriceRange === range.value ? 'text-[#5A7A5C] font-bold bg-[#5A7A5C]/5' : 'text-[#1A2E35]'
                            }`}
                          >
                            {range.label}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Availability Filter */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#FDFBF7] lg:bg-transparent rounded-lg">
                    <button 
                      onClick={() => setInStockOnly(!inStockOnly)}
                      className={`h-4 w-8 rounded-full transition-all relative ${inStockOnly ? 'bg-[#5A7A5C]' : 'bg-[#F2EDE4]'}`}
                    >
                      <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${inStockOnly ? 'left-[18px]' : 'left-0.5 shadow-sm'}`} />
                    </button>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A2E35]/40">In Stock</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto border-t lg:border-none pt-4 lg:pt-0 mt-2 lg:mt-0">
                <div className="flex items-center gap-2 lg:hidden">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40">
                    {filteredProducts.length} Results
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 mr-2">Sort by</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35] border-b border-[#1A2E35]/20 pb-1 focus:outline-none">
                      {sortBy} <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white rounded-2xl border-[#F2EDE4] shadow-2xl p-2 z-[100]">
                      <div className="space-y-1">
                        {["Bestselling", "Price: Low to High", "Price: High to Low", "Newest First", "Doctor Recommended"].map((s) => (
                          <DropdownMenuItem 
                            key={s} 
                            onClick={() => setSortBy(s)}
                            className={`rounded-xl px-4 py-3 cursor-pointer text-xs font-display hover:bg-[#F2EDE4]/30 transition-colors ${
                              sortBy === s ? 'text-[#5A7A5C] font-bold bg-[#5A7A5C]/5' : 'text-[#1A2E35]'
                            }`}
                          >
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            <div className="mt-8 hidden lg:flex items-center justify-between bg-white/50 border border-[#F2EDE4] rounded-2xl px-6 py-4">
               <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]">
                Showing {filteredProducts.length} formulations
              </p>
              {(selectedConcern || selectedCategory !== "All Categories" || selectedPriceRange !== "all" || inStockOnly || searchQuery) && (
                <button 
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                >
                  Reset All Filters <X className="h-3 w-3" />
                </button>
              )}
            </div>
            
            {/* Active Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedConcern && (
                <div className="bg-[#5A7A5C]/10 text-[#5A7A5C] px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                  Concern: {selectedConcern} <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedConcern(null)} />
                </div>
              )}
              {selectedCategory !== "All Categories" && (
                <div className="bg-[#5A7A5C]/10 text-[#5A7A5C] px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                  {selectedCategory} <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("All Categories")} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4) Product Grid */}
        <section className="pb-24 bg-[#FDFBF7]" ref={gridRef}>
          <div className="container px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#5A7A5C]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A2E35]/40">Harvesting Pure Ingredients...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-32 border-2 border-dashed border-[#F2EDE4] rounded-[48px] bg-white">
                <Leaf className="h-12 w-12 text-[#1A2E35]/10 mx-auto mb-6" />
                <h3 className="text-xl font-display font-medium text-[#1A2E35] mb-2">No products found.</h3>
                <p className="text-[#1A2E35]/40 text-sm font-sans-clean max-w-sm mx-auto mb-8">No products found for this category. Try adjusting your filters.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button onClick={clearFilters} className="text-[10px] font-bold uppercase tracking-widest text-[#5A7A5C] hover:underline underline-offset-4">Clear filters</button>
                  <Link to="/shop" onClick={clearFilters} className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/60 hover:text-[#1A2E35]">Shop all products</Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product, i) => {
                  const variant = product.node.variants.edges[0]?.node;
                  const image = product.node.images.edges[0]?.node;
                  const price = variant?.price;
                  
                  return (
                    <motion.div
                      key={product.node.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isGridInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group relative"
                    >
                      <Link to={`/product/${product.node.handle}`}>
                        <div className="relative aspect-square bg-gradient-to-br from-secondary to-sand-warm flex items-center justify-center overflow-hidden">
                          {image ? (
                            <img src={image.url} alt={image.altText || product.node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <Leaf className="h-16 w-16 text-primary/20" />
                          )}
                        </div>
                      </Link>

                      {/* Wishlist Button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (variant) toggleItem(product, variant.id);
                        }}
                        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all z-20 shadow-sm ${
                          variant && isInWishlist(variant.id) 
                            ? 'bg-red-500 border-red-500 text-white' 
                            : 'bg-white/90 border-border text-foreground hover:bg-white'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${variant && isInWishlist(variant.id) ? 'fill-white' : ''}`} />
                      </button>

                      <div className="p-5">
                        <Link to={`/product/${product.node.handle}`}>
                          <h3 className="font-display font-semibold text-foreground text-lg mb-1 hover:text-primary transition-colors">
                            {product.node.title}
                          </h3>
                        </Link>
                        
                        {/* Rating Display */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < (product.node.handle === 'triphala-churna' ? 5 : 4) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#F2EDE4]'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-[#1A2E35]/40 tracking-tighter">
                            {product.node.handle === 'triphala-churna' ? '4.9 (248 reviews)' : 
                             product.node.handle === 'brahmi-hair-oil' ? '4.8 (186 reviews)' : 
                             product.node.handle === 'triphala-tablets' ? '4.7 (92 reviews)' : 
                             '4.5 (124 reviews)'}
                          </span>
                        </div>
                        <p className="text-muted-foreground font-body text-sm mb-3 line-clamp-2">{product.node.description}</p>

                        {price && (
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-xl font-sans-clean font-bold text-foreground">
                              {price.currencyCode === 'INR' ? '₹' : price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!variant?.availableForSale || addingId === product.node.id || buyingId === product.node.id}
                              className="flex-1 bg-[#5A7A5C] hover:bg-[#4A634B] text-white py-2.5 rounded-lg font-sans-clean text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                            >
                              {addingId === product.node.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</>}
                            </button>
                            <Link
                              to={`/product/${product.node.handle}`}
                              title="Opens the full product page"
                              className="px-4 py-2.5 rounded-lg border border-[#5A7A5C] text-[#5A7A5C] font-sans-clean text-xs font-semibold hover:bg-[#5A7A5C] hover:text-white transition-all flex items-center justify-center whitespace-nowrap"
                            >
                              Details
                            </Link>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleBuyNow(product);
                            }}
                            disabled={buyingId === product.node.id || !variant?.availableForSale}
                            className="w-full border-2 border-[#1A2E35] text-[#1A2E35] py-2.5 rounded-lg font-sans-clean text-[10px] font-bold uppercase tracking-wider hover:bg-[#1A2E35] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {buyingId === product.node.id ? <Loader2 className="h-3.3 w-3.5 animate-spin" /> : null}
                            {buyingId === product.node.id ? "Redirecting..." : (!variant?.availableForSale ? "Sold Out" : "Buy Now Direct")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 5) Shop Trust Strip */}
        <section className="py-20 border-y border-[#F2EDE4] bg-white">
          <div className="container px-4">
            <div className="grid md:grid-cols-3 gap-16 max-w-5xl mx-auto">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-[#5A7A5C]/5 rounded-2xl flex items-center justify-center mx-auto text-[#5A7A5C]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]">GMP Certified</h4>
                <p className="text-[11px] text-[#1A2E35]/40 leading-relaxed font-sans-clean">Manufactured in clinical-grade environments under strict Ayurvedic manufacturing standards.</p>
              </div>
              <div className="text-center space-y-4 text-center">
                <div className="w-12 h-12 bg-[#C5A059]/5 rounded-2xl flex items-center justify-center mx-auto text-[#C5A059]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]">Batch Integrity</h4>
                <p className="text-[11px] text-[#1A2E35]/40 leading-relaxed font-sans-clean">Every batch undergoes consistency checks for purity, potency, and standardized extraction.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-blue-500/5 rounded-2xl flex items-center justify-center mx-auto text-blue-500">
                  <Package className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A2E35]">Full Transparency</h4>
                <p className="text-[11px] text-[#1A2E35]/40 leading-relaxed font-sans-clean">Clearly labeled botanical names and concentration ratios for zero-guesswork wellness.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;

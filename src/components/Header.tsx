import { useState, useEffect } from "react";
import { Search, User, Menu, X, Phone, Leaf, Package, UserCircle, Heart } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthModal } from "@/components/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { getStoredSession, clearSession, getValidCustomerToken, fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "@/stores/wishlistStore";

const logo = "/salamara_icon.png";

const navItems = [
  { label: "About Us", href: "/about" },
  { label: "Shop Now", href: "/shop" },
  { label: "Clinics", href: "/clinics" },
  { label: "Blog", href: "/#blog" },
  { label: "Book Appointment", href: "https://wa.me/919995731915?text=Hello%20Salmara%20Team,%20I%20would%20like%20to%20book%20an%20Ayurvedic%20consultation.", external: true },
  { label: "Contact Us", href: "/contact" },
];

const shopByConcern = [
  "Pain Relief",
  "Liver Detox",
  "Women's Wellness",
  "Immunity",
  "Skin Care",
  "Digestion",
];

const Header = () => {
  const { clearCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { setUserId } = useWishlistStore();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement> | null, href: string) => {
    const hash = href.includes("#") ? `#${href.split("#")[1]}` : href;
    if (hash.startsWith("#") && hash.length > 1) {
      if (e) e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        const offset = 80; // Account for sticky header height
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          scrollToSection(null, hash);
        }, 100);
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      // Use Shopify-only token validation
      const token = await getValidCustomerToken();
      const session = getStoredSession();
      
      if (token && session?.user) {
        setUser(session.user);
        setUserId(session.user.id);
      } else {
        setUser(null);
        setUserId('guest');
      }
    };

    checkSession();
    window.addEventListener('auth-status-change', checkSession);

    return () => {
      window.removeEventListener('auth-status-change', checkSession);
    };
  }, []);

  const handleLogout = () => {
    clearSession();
    clearCart();
    setUserId('guest');
    setUser(null);
    toast.success("Logged out successfully");
    // Force a full reload to ensure all states are clean
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  // Fetch products for search cache
  useEffect(() => {
    if (searchOpen && allProducts.length === 0) {
      fetchProducts(50).then(setAllProducts).catch(console.error);
    }
  }, [searchOpen, allProducts]);

  // Handle live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter((product) => {
      const titleMatch = product.node.title.toLowerCase().includes(query);
      const tagMatch = product.node.tags.some(tag => tag.toLowerCase().includes(query));
      const descriptionMatch = product.node.description.toLowerCase().includes(query);
      return titleMatch || tagMatch || descriptionMatch;
    }).slice(0, 5); // Limit to top 5 results

    setSearchResults(filtered);
    setIsSearching(false);
  }, [searchQuery, allProducts]);

  const handleResultClick = (handle: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/product/${handle}`);
  };

  return (
    <>
      {/* Promo Bar */}
      <div className="bg-[#5A7A5C] text-[#F2EDE4] text-center py-2 text-[10px] md:text-xs font-sans-clean tracking-[0.3em] uppercase font-bold">
        Free Shipping Above ₹999
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 lg:h-20">
          {/* Logo & Tagline */}
          <Link 
            to="/" 
            className="flex items-center gap-4 shrink-0 group"
          >
            <img src={logo} alt="Salmara Logo" className="h-10 md:h-14 w-auto drop-shadow-sm transition-transform group-hover:scale-105" />
            <div className="hidden lg:flex flex-col border-l border-[#F2EDE4] pl-4">
              <span className="text-[10px] md:text-sm font-display font-medium text-[#1A2E35] leading-tight tracking-wide">
                Rediscover Wellness Through
              </span>
              <span className="text-[10px] md:text-sm font-display font-medium text-[#5A7A5C] leading-tight tracking-wide italic">
                Authentic Ayurveda.
              </span>
            </div>
          </Link>

          {/* Desktop Nav - centered */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-sm font-sans-clean text-foreground/80 hover:text-primary transition-colors duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-3/4 rounded-full" />
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => {
                    const isHomePage = window.location.pathname === "/";
                    const hrefHasHash = item.href.includes("#");
                    const targetIsHomeHash = item.href.startsWith("/#");
                    
                    if (hrefHasHash && (isHomePage || !targetIsHomeHash)) {
                      const hash = item.href.split("#")[1];
                      scrollToSection(e as any, `#${hash}`);
                    }
                  }}
                  className="px-3 py-2 text-sm font-sans-clean text-foreground/80 hover:text-primary transition-colors duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-3/4 rounded-full" />
                </Link>
              )
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#F2EDE4]/50 border border-[#F2EDE4] rounded-full px-4 py-1.5 text-sm font-sans-clean outline-none focus:border-[#5A7A5C] transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (searchOpen) setSearchQuery("");
                }}
                className={`p-2 transition-colors duration-300 ${searchOpen ? 'text-[#5A7A5C]' : 'text-foreground/70 hover:text-primary'}`}
                aria-label="Search"
              >
                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchOpen && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white border border-[#F2EDE4] rounded-2xl shadow-2xl z-[60] overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 border-b border-[#F2EDE4] mb-1">
                        Results
                      </p>
                      {searchResults.map((product) => (
                        <button
                          key={product.node.id}
                          onClick={() => handleResultClick(product.node.handle)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-[#F2EDE4]/30 rounded-xl transition-colors text-left group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F2EDE4]/50 shrink-0">
                            {product.node.images.edges[0]?.node?.url ? (
                              <img src={product.node.images.edges[0].node.url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Leaf className="w-5 h-5 m-2.5 text-[#5A7A5C]/30" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-[#1A2E35] truncate group-hover:text-[#5A7A5C] transition-colors">
                              {product.node.title}
                            </span>
                            <span className="text-[10px] text-[#1A2E35]/40 truncate">
                              {product.node.productType || "Ayurvedic Formulation"}
                            </span>
                          </div>
                        </button>
                      ))}
                      <Link 
                        to={`/shop?search=${searchQuery}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="block text-center py-2 text-[10px] font-bold uppercase tracking-widest text-[#5A7A5C] hover:bg-[#5A7A5C]/5 transition-colors"
                      >
                        View All Results
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/wishlist" 
              className="p-2 text-foreground/70 hover:text-red-500 transition-colors relative group"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>

            <CartDrawer />
            
            {user ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#FDFBF7] rounded-full border border-[#F2EDE4] hover:bg-[#5A7A5C]/5 transition-colors group"
                >
                  <User className="h-4 w-4 text-[#5A7A5C] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-sans-clean font-medium text-[#1A2E35]">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-xs font-sans-clean font-bold text-[#1A2E35]/60 hover:text-red-600 transition-colors uppercase tracking-widest"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setAuthView("login");
                  setAuthOpen(true);
                }}
                className="hidden sm:flex items-center gap-1.5 p-2 text-foreground/70 hover:text-primary transition-colors" 
                aria-label="Login"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-sans-clean">Login</span>
              </button>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-foreground/70 hover:text-primary transition-colors xl:hidden"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Removed Old Search Bar */}
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialView={authView}
      />

      {/* Mobile Slide-Out */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display text-lg font-semibold text-foreground">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-foreground/70">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-3 py-3 text-sm font-sans-clean text-foreground/80 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={(e) => {
                        const isHomePage = window.location.pathname === "/";
                        const hrefHasHash = item.href.includes("#");
                        const targetIsHomeHash = item.href.startsWith("/#");

                        if (hrefHasHash && (isHomePage || !targetIsHomeHash)) {
                          const hash = item.href.split("#")[1];
                          scrollToSection(e as any, `#${hash}`);
                        } else {
                          setMobileOpen(false);
                        }
                      }}
                      className="block px-3 py-3 text-sm font-sans-clean text-foreground/80 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </nav>
              <div className="p-4 border-t border-border">
                <p className="text-xs font-sans-clean font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Shop by Concern
                </p>
                <div className="flex flex-wrap gap-2">
                  {shopByConcern.map((concern) => (
                    <a
                      key={concern}
                      href="#products"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-1.5 text-xs font-sans-clean bg-secondary text-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {concern}
                    </a>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-border space-y-2">
                {user ? (
                  <div className="px-3 py-3 space-y-4">
                    <Link 
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-3 bg-[#FDFBF7] rounded-xl border border-[#F2EDE4] hover:bg-[#5A7A5C]/5 transition-colors"
                    >
                      <UserCircle className="h-5 w-5 text-[#5A7A5C]" />
                      <div className="flex flex-col">
                        <span className="text-sm font-sans-clean font-bold text-[#1A2E35]">{user.name || 'User'}</span>
                        <span className="text-[10px] text-[#1A2E35]/40">{user.email}</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-3 pt-2 text-xs font-bold text-red-600 uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setMobileOpen(false);
                      setAuthView("login");
                      setAuthOpen(true);
                    }}
                    className="flex items-center w-full gap-3 px-3 py-2 text-sm font-sans-clean text-foreground/80 hover:text-primary"
                  >
                    <User className="h-4 w-4" /> Login
                  </button>
                )}
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-sans-clean text-foreground/80 hover:text-primary">
                  <Package className="h-4 w-4" /> Track Order
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-sans-clean text-foreground/80 hover:text-primary">
                  <Phone className="h-4 w-4" /> Contact Us
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

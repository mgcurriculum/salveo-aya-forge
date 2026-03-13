import { useState, useEffect } from "react";
import { Search, User, Menu, X, Phone, Leaf, Package, UserCircle } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthModal } from "@/components/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { getStoredSession, getValidCustomerToken, clearSession } from "@/lib/shopify";

const logo = "/salamara_icon.png";

const navItems = [
  { label: "About Us", href: "/about" },
  { label: "Shop Now", href: "/shop" },
  { label: "Clinics", href: "/clinics" },
  { label: "Blog", href: "/#blog" },
  { label: "Book Appointment", href: "/book-appointment" },
  { label: "Contact Us", href: "#footer" },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [user, setUser] = useState<any>(null);

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

  // Global scroll listener for hashes on route change
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        // Wait a bit for the page to render
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
      const session = getStoredSession();
      if (!session) {
        setUser(null);
        return;
      }
      const token = await getValidCustomerToken();
      if (token) {
        // Re-read session in case it was renewed
        const updated = getStoredSession();
        setUser(updated?.user || null);
      } else {
        setUser(null);
      }
    };

    checkSession();
    window.addEventListener('auth-status-change', checkSession);
    return () => window.removeEventListener('auth-status-change', checkSession);
  }, []);

  const handleLogout = () => {
    clearSession();
    setUser(null);
    toast.success("Logged out successfully");
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
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => scrollToSection(e, "#")}
            className="flex items-center gap-2 shrink-0"
          >
            <img src={logo} alt="Salmara Logo" className="h-10 md:h-12 w-auto" />
          </a>

          {/* Desktop Nav - centered */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={(e) => {
                  const isHomePage = window.location.pathname === "/";
                  const hrefHasHash = item.href.includes("#");
                  const targetIsHomeHash = item.href.startsWith("/#");
                  
                  if (hrefHasHash && (isHomePage || !targetIsHomeHash)) {
                    // If target is a hash on current page, scroll
                    // Or if target is a simple #hash
                    const hash = item.href.split("#")[1];
                    scrollToSection(e as any, `#${hash}`);
                  }
                }}
                className="px-3 py-2 text-sm font-sans-clean text-foreground/80 hover:text-primary transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
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

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border overflow-hidden"
            >
              <div className="container mx-auto px-4 py-3">
                <input
                  type="text"
                  placeholder="Search products, remedies, ingredients..."
                  className="w-full bg-secondary rounded-lg px-4 py-3 text-sm font-sans-clean outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

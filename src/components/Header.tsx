import { useState } from "react";
import { ShoppingCart, Search, User, Package, Menu, X, Phone, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Shop Now", href: "#products" },
  { label: "Clinics & Treatments", href: "#consultation" },
  { label: "Certifications", href: "#" },
  { label: "Blog", href: "#blog" },
  { label: "Book Appointment", href: "#consultation" },
  { label: "Contact Us", href: "#" },
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

  return (
    <>
      {/* Promo Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-sans-clean tracking-wide">
        🌿 Free Shipping Above ₹999 — Use Code <span className="font-semibold text-gold-light">WELLNESS10</span> for 10% Off
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <Leaf className="h-8 w-8 text-primary" />
            <div>
              <span className="text-xl font-display font-bold text-foreground tracking-tight">Salmara</span>
              <span className="text-xl font-display font-light text-primary ml-1">Herbals</span>
              <p className="text-[10px] font-sans-clean text-muted-foreground leading-none hidden sm:block">
                Rediscover Wellness Through Authentic Ayurveda
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-sans-clean text-foreground/80 hover:text-primary transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <a href="#" className="p-2 text-foreground/70 hover:text-primary transition-colors relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-sans-clean font-bold rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </a>
            <a href="#" className="p-2 text-foreground/70 hover:text-primary transition-colors hidden sm:block" aria-label="Account">
              <User className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 text-foreground/70 hover:text-primary transition-colors hidden sm:block" aria-label="Track Order">
              <Package className="h-5 w-5" />
            </a>
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

      {/* Mobile Slide-Out */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-card z-50 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display text-lg font-semibold text-foreground">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-foreground/70">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 text-sm font-sans-clean text-foreground/80 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                  >
                    {item.label}
                  </a>
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
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-sans-clean text-foreground/80 hover:text-primary">
                  <User className="h-4 w-4" /> My Account
                </a>
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

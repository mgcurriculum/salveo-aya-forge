import { Leaf, Facebook, Instagram, Youtube, Linkedin, Shield, Lock, CreditCard } from "lucide-react";

const Footer = () => (
  <footer className="bg-herbal-dark text-primary-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-gold-light" />
            <span className="font-display font-bold text-xl">Salmara Herbals</span>
          </div>
          <p className="text-primary-foreground/60 font-body text-sm leading-relaxed mb-6">
            Authentic Ayurveda — crafted in Karnataka with 27 years of trust and GMP-certified excellence.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
              >
                <Icon className="h-4 w-4 text-primary-foreground/70" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-sans-clean font-semibold text-sm uppercase tracking-wider text-gold-light mb-5">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {["Shop All Products", "Book Consultation", "About Us", "Blog", "Certifications", "Contact Us"].map((link) => (
              <li key={link}>
                <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm font-sans-clean transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-sans-clean font-semibold text-sm uppercase tracking-wider text-gold-light mb-5">
            Legal
          </h4>
          <ul className="space-y-3">
            {["Terms & Conditions", "Privacy Policy", "Shipping Policy", "Refund Policy"].map((link) => (
              <li key={link}>
                <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm font-sans-clean transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-sans-clean font-semibold text-sm uppercase tracking-wider text-gold-light mb-5">
            Subscribe for Wellness Tips
          </h4>
          <p className="text-primary-foreground/60 text-sm font-sans-clean mb-4">
            Get Ayurvedic insights delivered to your inbox.
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-3 py-2.5 text-sm font-sans-clean text-primary-foreground placeholder:text-primary-foreground/40 outline-none focus:border-gold-light"
            />
            <button className="bg-accent hover:bg-gold text-accent-foreground px-4 py-2.5 rounded-lg font-sans-clean text-sm font-semibold transition-colors shrink-0">
              Join
            </button>
          </form>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-primary-foreground/40 text-xs font-sans-clean">
          © 2025 Salmara Ayurveda. All Rights Reserved.
        </p>
        <div className="flex items-center gap-4">
          {[Shield, Lock, CreditCard].map((Icon, i) => (
            <Icon key={i} className="h-5 w-5 text-primary-foreground/30" />
          ))}
          <span className="text-primary-foreground/30 text-[10px] font-sans-clean">Secure Payments</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

import { Facebook, Instagram, Youtube, Linkedin, Lock, Wallet, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
const logo = "/salamara_icon.png";

const Footer = () => (
  <footer className="bg-[#5A7A5C] text-white pt-24 pb-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-20">
        {/* Brand Column */}
        <div className="max-w-xs">
          <p>Salmara Ayurveda</p> <br />
          {/* <img src={logo} alt="Salmara" className="h-8 mb-10 brightness-0 invert" /> */}
          <p className="text-white/90 font-body text-base leading-relaxed">
            Rediscover Wellness Through Authentic Ayurveda. Rooted in Karnataka, trusted PAN India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-xl mb-8">Quick Links</h4>
          <ul className="space-y-4">
            {["Home", "About Us", "Shop Now", "Blog", "Contact Us"].map((label) => {
              const href = label === "Home" ? "/" : 
                           label === "About Us" ? "/about" : 
                           label === "Shop Now" ? "/shop" : 
                           label === "Blog" ? "/#blog" : 
                           label === "Contact Us" ? "/contact" : "#footer";
              
              const isExternal = href.startsWith("#");
              
              return (
                <li key={label}>
                  {isExternal ? (
                    <a href={href} className="text-white/90 hover:text-white transition-colors text-base font-body">
                      {label}
                    </a>
                  ) : (
                    <Link to={href} className="text-white/90 hover:text-white transition-colors text-base font-body">
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-display font-bold text-xl mb-8">Legal</h4>
          <ul className="space-y-4">
            {["Terms & Conditions", "Privacy Policy", "Shipping Policy", "Refund Policy"].map((link) => (
              <li key={link}>
                <a href="#" className="text-white/90 hover:text-white transition-colors text-base font-body">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="font-display font-bold text-xl mb-8">Connect</h4>
          <div className="flex gap-4">
            {[
              { Icon: Facebook, href: "https://www.facebook.com/share/18GfJXco63/?mibextid=wwXIfr" },
              { Icon: Instagram, href: "https://www.instagram.com/salmara_ayurveda?igsh=ejhxdHA0NGFoeWNj" },
              { Icon: Youtube, href: "https://www.youtube.com/@salmara_ayurveda" }
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all font-body text-base"
              >
                <Icon className="h-4 w-4 text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white/80 text-sm font-body">
          © 2025 Salmara Ayurveda. All Rights Reserved.
        </p>
        
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          <div className="flex items-center gap-2 text-white/80">
            <Lock className="h-4 w-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Wallet className="h-4 w-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-widest font-bold">COD Available</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <BadgeCheck className="h-4 w-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-widest font-bold">GMP Certified</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

import { MessageCircle, Phone, Users, MessageSquare } from "lucide-react";

const buttons = [
  { icon: MessageCircle, label: "WhatsApp", color: "bg-green-600 hover:bg-green-700", href: "https://wa.me/919995731915?text=Hello%20Salmara%20Team,%20I%20would%20like%20to%20know%20more%20about%20your%20Ayurvedic%20wellness%20products." },
  { icon: Phone, label: "+91 80 4932 2300", color: "bg-[#5A7A5C] hover:bg-[#4A634C]", href: "tel:+918049322300" },
  { icon: Users, label: "Affiliate", color: "bg-[#C5A059] hover:bg-[#B48F48]", href: "/affiliate" },
//  { icon: MessageSquare, label: "Feedback", color: "bg-[#8E9196] hover:bg-[#71717A]", href: "/contact" },
];

const FloatingButtons = () => {
  const handlePhoneClick = (e: React.MouseEvent) => {
    // Analytics or tracking could go here
  };

  return (
    <div className="fixed right-4 bottom-1/4 z-40 flex flex-col gap-3">
      {buttons.map((btn) => (
        <a
          key={btn.label}
          href={btn.href}
          onClick={btn.icon === Phone ? handlePhoneClick : undefined}
          target={btn.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`${btn.color} text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group relative flex items-center justify-center`}
          aria-label={btn.label}
        >
          <btn.icon className="h-5 w-5" />
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-white text-[#1A2E35] text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-[#F2EDE4] transform translate-x-2 group-hover:translate-x-0">
            {btn.label}
          </span>
        </a>
      ))}
    </div>
  );
};

export default FloatingButtons;

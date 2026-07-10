import { motion } from "motion/react";

export default function MarqueeLogos() {
  const logos = [
    { name: "Google", icon: "google" },
    { name: "Microsoft", icon: "cloud" },
    { name: "Amazon", icon: "shopping_cart" },
    { name: "Apple", icon: "apps" },
    { name: "Meta", icon: "public" },
    { name: "Netflix", icon: "movie" },
    { name: "Adobe", icon: "gesture" },
    { name: "Nvidia", icon: "memory" }
  ];

  return (
    <section className="py-12 bg-white/40 border-y border-brand-dark/5 backdrop-blur-sm overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-track">
          {/* First loop */}
          {logos.map((logo, idx) => (
            <div key={`logo-1-${idx}`} className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-90 transition-all duration-300 cursor-pointer">
              <span className="material-symbols-outlined text-brand-secondary text-2xl">{logo.icon}</span>
              <span className="font-sans font-extrabold tracking-tight text-brand-dark text-lg md:text-xl">
                {logo.name}
              </span>
            </div>
          ))}
          {/* Second loop for seamless join */}
          {logos.map((logo, idx) => (
            <div key={`logo-2-${idx}`} className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-90 transition-all duration-300 cursor-pointer">
              <span className="material-symbols-outlined text-brand-secondary text-2xl">{logo.icon}</span>
              <span className="font-sans font-extrabold tracking-tight text-brand-dark text-lg md:text-xl">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

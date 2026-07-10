import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-dark/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-primary text-2xl font-bold">rocket_launch</span>
          <span className="font-sans text-xl font-extrabold tracking-tighter text-brand-dark">
            Careergize<span className="text-brand-primary">.</span>
          </span>
        </div>

        {/* Legal and Metadata */}
        <p className="font-sans text-xs text-brand-dark/40 text-center md:text-right">
          &copy; {new Date().getFullYear()} Careergize Inc. All rights reserved. Registered Public Ledger Certificate Verification Platform.
        </p>

        {/* Utility links */}
        <div className="flex gap-6 text-xs text-brand-dark/50 font-semibold font-sans">
          <a href="#courses" className="hover:text-brand-primary transition-colors">Curriculum</a>
          <a href="#bento" className="hover:text-brand-primary transition-colors">Career OS</a>
          <a href="#mentor" className="hover:text-brand-primary transition-colors">AI Mentor</a>
          <a href="#command-center" className="hover:text-brand-primary transition-colors">Dashboard</a>
        </div>

      </div>
    </footer>
  );
}

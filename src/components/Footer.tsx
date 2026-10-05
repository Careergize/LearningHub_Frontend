
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t border-brand-dark/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Branding Logo */}
<div className="flex items-center">
  <img
    src="/src/assets/logo.jpeg"
    alt="Careergize Logo"
    className="h-10 w-auto object-contain"
  />
</div>

        {/* Legal and Metadata */}
        <p className="font-sans text-xs text-brand-dark/40 text-center md:text-right">
          &copy; {new Date().getFullYear()} Careergize Inc. All rights reserved. Registered Public Ledger Certificate Verification Platform.
        </p>

        {/* Utility links */}
        <div className="flex gap-6 text-xs text-brand-dark/50 font-semibold font-sans">
          <a
            href="#courses"
            className="hover:text-brand-primary transition-colors"
          >
            Curriculum
          </a>

          <a
            href="#bento"
            className="hover:text-brand-primary transition-colors"
          >
            Career OS
          </a>

          <a
            href="#mentor"
            className="hover:text-brand-primary transition-colors"
          >
            AI Mentor
          </a>

          <a
            href="#command-center"
            className="hover:text-brand-primary transition-colors"
          >
            Dashboard
          </a>

          <button
            type="button"
            onClick={() => navigate("/admin-login")}
            className="hover:text-brand-primary transition-colors"
          >
            Admin Login
          </button>
        </div>

      </div>
    </footer>
  );
}


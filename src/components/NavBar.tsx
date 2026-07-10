import React from "react";
import { motion } from "motion/react";

export default function NavBar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 glass rounded-full shadow-lg px-6 md:px-8 py-3.5 flex justify-between items-center transition-all">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-brand-primary text-2xl font-bold">rocket_launch</span>
        <span className="font-sans text-xl font-extrabold tracking-tighter text-brand-dark">
          Careergize<span className="text-brand-primary">.</span>
        </span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-8 items-center">
        <a href="#courses" className="font-sans text-sm font-medium text-brand-dark/70 hover:text-brand-primary transition-colors">Courses</a>
        <a href="#bento" className="font-sans text-sm font-medium text-brand-dark/70 hover:text-brand-primary transition-colors">Career OS</a>
        <a href="#mentor" className="font-sans text-sm font-medium text-brand-primary font-semibold border-b-2 border-brand-primary pb-1">AI Mentor</a>
        <a href="#command-center" className="font-sans text-sm font-medium text-brand-dark/70 hover:text-brand-primary transition-colors">Command Center</a>
        <a href="#credentials" className="font-sans text-sm font-medium text-brand-dark/70 hover:text-brand-primary transition-colors">Credentials</a>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 items-center">
        <button className="hidden lg:block font-sans text-sm font-semibold text-brand-dark/70 hover:text-brand-primary transition-colors">
          Student Login
        </button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-brand-primary text-white text-sm px-5 py-2.5 rounded-full font-sans font-bold hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/25 cursor-pointer"
        >
          Start Learning
        </motion.button>
        
        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-brand-dark hover:text-brand-primary transition-colors focus:outline-none"
        >
          <span className="material-symbols-outlined">{isOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-18 left-0 right-0 glass rounded-3xl mx-2 p-6 shadow-xl flex flex-col gap-4 border border-white/40 md:hidden"
        >
          <a onClick={() => setIsOpen(false)} href="#courses" className="font-sans text-base font-semibold text-brand-dark/85 py-1">Courses</a>
          <a onClick={() => setIsOpen(false)} href="#bento" className="font-sans text-base font-semibold text-brand-dark/85 py-1">Career OS</a>
          <a onClick={() => setIsOpen(false)} href="#mentor" className="font-sans text-base font-semibold text-brand-primary py-1">AI Mentor</a>
          <a onClick={() => setIsOpen(false)} href="#command-center" className="font-sans text-base font-semibold text-brand-dark/85 py-1">Command Center</a>
          <a onClick={() => setIsOpen(false)} href="#credentials" className="font-sans text-base font-semibold text-brand-dark/85 py-1">Credentials</a>
          <hr className="border-brand-dark/10" />
          <button className="text-left font-sans text-sm font-semibold text-brand-dark/70 py-2">Student Login</button>
        </motion.div>
      )}
    </nav>
  );
}

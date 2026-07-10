import React from "react";
import { motion } from "motion/react";

export default function CTASection() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 4000);
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 relative overflow-hidden">
      <div className="bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white font-sans text-xs font-bold border border-white/20">
            <span className="material-symbols-outlined text-sm">schedule</span>
            COHORT 18 SEATS FILLING FAST
          </div>
          
          <h2 className="font-sans font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
            Ready to Careergize <br />
            Your Future?
          </h2>
          
          <p className="font-sans text-sm md:text-base text-white/80 leading-relaxed">
            Get instant access to our personal career mentor bot, log study logic benchmarks, compete with top cohort candidates, and graduate with a secure blockchain certificate.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your candidate email address"
              className="flex-1 bg-white text-brand-dark px-6 py-3.5 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
              required
              disabled={subscribed}
            />
            <button 
              type="submit" 
              className="bg-brand-dark text-white px-8 py-3.5 rounded-xl font-sans font-bold text-sm hover:bg-brand-dark/80 transition-all active:scale-95 cursor-pointer"
              disabled={subscribed}
            >
              {subscribed ? "Securing Seat..." : "Reserve My Seat"}
            </button>
          </form>

          {subscribed && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-300 font-sans text-xs font-bold"
            >
              ✓ Success! Check your inbox for your personalized Careergize onboarding code.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}

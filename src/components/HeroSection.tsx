import { motion } from "motion/react";

export default function HeroSection() {
  const stats = [
    { value: "10,000+", label: "Students" },
    { value: "250+", label: "Courses" },
    { value: "500+", label: "Hiring Partners" }
  ];

  return (
    <header className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-gradient-to-b from-brand-surface via-brand-surface/50 to-white">
      {/* Decorative background grid blobs */}
      <div className="absolute top-24 left-12 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-12 right-24 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full relative z-10">
        
        {/* Left side column */}
        <div className="space-y-8 max-w-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary font-sans text-xs font-bold border border-brand-primary/20 animate-pulse"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            AI-POWERED CAREER OS
          </motion.div>
          
          <h1 className="font-sans font-extrabold text-4xl md:text-6xl text-brand-dark leading-tight tracking-tighter">
            Learn Smarter.<br />
            <span className="text-brand-primary">Build Skills.</span><br />
            Launch Your Career.
          </h1>
          
          <p className="font-sans text-base md:text-lg text-brand-dark/70 leading-relaxed">
            Master software architecture, React, and data pipelines with real-time AI guidance, peer competitions, and verified digital credentials. Built for the developers of tomorrow.
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 items-center">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-brand-primary text-white px-8 py-3.5 rounded-xl font-sans font-bold hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
            >
              Start Learning Free
            </motion.button>
            <button className="bg-white/80 border border-brand-dark/10 px-8 py-3.5 rounded-xl font-sans font-bold hover:bg-white text-brand-dark/80 transition-colors shadow-sm cursor-pointer">
              Explore Courses
            </button>
            
            <button className="flex items-center gap-2.5 text-brand-dark font-sans font-semibold hover:text-brand-primary transition-colors group">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-brand-primary">play_arrow</span>
              </span>
              Watch Demo
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-8 pt-8 border-t border-brand-dark/5">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="font-sans font-extrabold text-2xl text-brand-primary">{stat.value}</div>
                <div className="text-brand-dark/50 text-xs font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side illustration - High-fidelity visual mockup of platform with floating badges */}
        <div className="relative h-[480px] lg:h-[550px] w-full flex items-center justify-center">
          
          {/* Main frame container */}
          <div className="absolute inset-0 glass rounded-[2.5rem] p-6 shadow-2xl border border-white/60 flex flex-col justify-between overflow-hidden bg-white/35">
            
            {/* Mock workspace view */}
            <div className="flex items-center justify-between border-b border-brand-dark/5 pb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <span className="font-mono text-[10px] text-brand-dark/40 bg-white/50 px-3 py-1 rounded-full">
                careergize.io/workspace
              </span>
            </div>

            {/* Simulated Interactive code output block */}
            <div className="flex-1 py-6 flex flex-col justify-center">
              <div className="bg-brand-dark rounded-2xl p-5 shadow-inner text-left font-mono text-xs text-brand-primary-light space-y-2.5">
                <div className="text-brand-dark/45">// Initializing Career Roadmap...</div>
                <div><span className="text-pink-400">const</span> career = <span className="text-yellow-300">await</span> buildFuture(<span className="text-emerald-300">"fullstack_dev"</span>);</div>
                <div><span className="text-purple-400">if</span> (career.ready) &#123;</div>
                <div className="pl-4">launchCampaign(); <span className="text-brand-dark/45">// Microsoft, Google, Meta</span></div>
                <div>&#125;</div>
                <div className="text-emerald-400 font-bold mt-2">// OUTPUT: Trajectory Verified [Confidence: 98%]</div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white/70 rounded-2xl p-4 border border-white">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-primary text-2xl">workspace_premium</span>
                <div>
                  <h4 className="font-sans font-bold text-xs text-brand-dark">Full-Stack Bootcamp</h4>
                  <p className="text-[10px] text-brand-dark/50">Next Cohort Starts Today</p>
                </div>
              </div>
              <span className="bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full font-sans font-bold text-[10px]">
                Enroll Now
              </span>
            </div>
          </div>

          {/* Floating badge 1 */}
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 -right-4 glass p-4 rounded-2xl shadow-lg border border-white max-w-xs flex items-center gap-3 bg-white"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined font-bold">verified</span>
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold text-brand-dark">Offer Received</div>
              <div className="text-[10px] text-brand-dark/60">Software Engineer • Microsoft</div>
            </div>
          </motion.div>

          {/* Floating badge 2 */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-6 -left-6 glass p-4 rounded-2xl shadow-lg border border-white max-w-xs flex items-center gap-3 bg-white"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <span className="material-symbols-outlined font-bold">trending_up</span>
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold text-brand-dark">Progress Boost</div>
              <div className="text-[10px] text-brand-dark/60">Logic Accuracy: 94% (+14%)</div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

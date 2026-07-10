import { motion } from "motion/react";

export default function BentoGrid() {
  return (
    <section id="bento" className="py-20 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <div className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">SYSTEM ARCHITECTURE</div>
        <h2 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight text-brand-dark mb-4">
          The Next-Gen Career OS
        </h2>
        <p className="font-sans text-base md:text-lg text-brand-dark/60 max-w-xl mx-auto">
          Our adaptive architecture coordinates learning, real-time feedback, and industrial placement into a cohesive platform.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[190px]">
        
        {/* Card 1: AI Personalized Learning (Large Card) */}
        <div className="md:col-span-8 md:row-span-2 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-3xl p-8 border border-brand-dark/5 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[120px]">neurology</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/15 flex items-center justify-center text-brand-primary mb-4">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div className="space-y-3 relative z-10">
            <h3 className="font-sans font-extrabold text-2xl text-brand-dark">AI Personalized Learning</h3>
            <p className="font-sans text-sm md:text-base text-brand-dark/75 max-w-lg leading-relaxed">
              Careergize AI maps out your engineering gaps in real-time, instantly adjusting your courses and micro-lessons as you tackle logic questions and compile code.
            </p>
          </div>
        </div>

        {/* Card 2: Industry Mentors */}
        <div className="md:col-span-4 md:row-span-1 bg-white rounded-3xl p-6 border border-brand-dark/5 flex items-center gap-4 hover:shadow-md hover:border-brand-primary/20 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0">
            <span className="material-symbols-outlined">diversity_3</span>
          </div>
          <div>
            <h4 className="font-sans font-bold text-brand-dark text-base">Industry Mentors</h4>
            <p className="font-sans text-xs text-brand-dark/50 mt-0.5">Active expert feedback from tech leads.</p>
          </div>
        </div>

        {/* Card 3: Placement Assistance */}
        <div className="md:col-span-4 md:row-span-1 bg-brand-primary text-white rounded-3xl p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">work</span>
          </div>
          <div>
            <h4 className="font-sans font-bold text-white text-base">Placement Assistance</h4>
            <p className="font-sans text-xs text-white/80 mt-0.5">Guaranteed tech partner pipeline.</p>
          </div>
        </div>

        {/* Card 4: Live Projects */}
        <div className="md:col-span-4 md:row-span-2 bg-white rounded-3xl p-8 border border-brand-dark/5 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
          <div>
            <h3 className="font-sans font-extrabold text-lg text-brand-dark mb-1">Live Agile Projects</h3>
            <p className="font-sans text-xs text-brand-dark/50 leading-relaxed">Build production-grade applications using agile team workflows.</p>
          </div>
          <div className="h-28 bg-brand-dark rounded-2xl p-4 border border-white/10 relative overflow-hidden mt-4">
            <div className="absolute top-3 left-3 flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
            </div>
            <div className="pt-6 font-mono text-[10px] text-brand-primary-light space-y-1">
              <div>const spec = "advanced_react";</div>
              <div>await buildPortfolioProject(spec);</div>
              <div className="text-emerald-400">// Status: Complete</div>
            </div>
          </div>
        </div>

        {/* Card 5: Mock Interviews */}
        <div className="md:col-span-4 md:row-span-1 bg-white rounded-3xl p-6 border border-brand-dark/5 flex items-center gap-4 hover:shadow-md hover:border-brand-primary/20 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-brand-tertiary/10 flex items-center justify-center text-brand-tertiary shrink-0">
            <span className="material-symbols-outlined">quiz</span>
          </div>
          <div>
            <h4 className="font-sans font-bold text-brand-dark text-base">Mock Interviews</h4>
            <p className="font-sans text-xs text-brand-dark/50 mt-0.5">Automated technical feedback.</p>
          </div>
        </div>

        {/* Card 6: Community Learning */}
        <div className="md:col-span-4 md:row-span-1 bg-white rounded-3xl p-6 border border-brand-dark/5 flex items-center gap-4 hover:shadow-md hover:border-brand-primary/20 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-brand-accent/15 flex items-center justify-center text-brand-dark shrink-0">
            <span className="material-symbols-outlined font-bold text-brand-secondary">groups</span>
          </div>
          <div>
            <h4 className="font-sans font-bold text-brand-dark text-base">Community</h4>
            <p className="font-sans text-xs text-brand-dark/50 mt-0.5">Study & solve alongside 10k+ peers.</p>
          </div>
        </div>

      </div>
    </section>
  );
}

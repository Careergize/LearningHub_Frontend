import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CareerTrackStep } from "../types";

export default function TrajectoryTimeline() {
  const steps: CareerTrackStep[] = [
    { id: "step-1", label: "Web Architecture & Core Logic", duration: "Weeks 1-4", icon: "architecture", status: "completed", week: "01" },
    { id: "step-2", label: "Complete MERN Framework Development", duration: "Weeks 5-12", icon: "terminal", status: "active", week: "05" },
    { id: "step-3", label: "Advanced System Design & API Scaling", duration: "Weeks 13-16", icon: "dns", status: "locked", week: "13" },
    { id: "step-4", label: "Enterprise Deployment & Direct Hiring", duration: "Weeks 17-24", icon: "rocket", status: "locked", week: "17" }
  ];

  const [activeStepId, setActiveStepId] = React.useState<string>("step-2");

  const stepDetails: { [key: string]: { description: string, deliverables: string[], skillRequired: string } } = {
    "step-1": {
      description: "Master clean routing, asynchronous JavaScript, memory management, and baseline data querying with SQLite and indexing patterns.",
      deliverables: ["Vanilla Node Router API", "Performant Database Seeding Script", "Logic Gate Exercises"],
      skillRequired: "Core Programming Fundamentals"
    },
    "step-2": {
      description: "Dive deep into modern React, state synchronization hooks (useMemo, useCallback), Express router modules, and document-store schemas.",
      deliverables: ["Responsive Real-Time Workspace Platform", "Dynamic Express Vite Proxy API", "Secure JWT Authorization Flow"],
      skillRequired: "Advanced MERN Engineering"
    },
    "step-3": {
      description: "Learn to design highly available, horizontally scalable system architectures. Implement Redis caching layers, load balancers, and queue workers.",
      deliverables: ["Redis Cache Proxy Module", "Dockerized Container Cluster", "Load Testing Benchmarks Report"],
      skillRequired: "Horizontally Scalable Architecture"
    },
    "step-4": {
      description: "Complete final capstone audits, undergo advanced peer mock interviews, polish STAR resume resumes, and gain direct introductions to hiring companies.",
      deliverables: ["Verified Public Technical Portfolio", "3 Live Production Deployments", "Mock System Design Cleared"],
      skillRequired: "Enterprise Placement Preparation"
    }
  };

  const currentDetails = stepDetails[activeStepId];

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Timeline representation (Left column) */}
        <div className="space-y-8">
          <div>
            <div className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">TRAJECTORY ROADMAP</div>
            <h2 className="font-sans font-extrabold text-3xl md:text-5xl text-brand-dark tracking-tight leading-tight">
              Interactive Career <br />
              <span className="text-brand-primary">Progress Roadmap.</span>
            </h2>
            <p className="font-sans text-sm md:text-base text-brand-dark/60 mt-3 leading-relaxed">
              Explore your upcoming upskilling milestones. Click on any week block to inspect core curriculum deliverables, system architectures, and live project goals.
            </p>
          </div>

          <div className="relative border-l-2 border-brand-dark/10 pl-6 space-y-6">
            {steps.map((step) => {
              const isActive = activeStepId === step.id;
              
              let markerColor = "bg-brand-dark/15";
              if (step.status === "completed") markerColor = "bg-emerald-500";
              if (step.status === "active") markerColor = "bg-brand-primary";

              return (
                <div 
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`relative group cursor-pointer transition-all p-4 rounded-2xl ${
                    isActive ? "bg-white shadow-md border border-brand-primary/20" : "hover:bg-white/50"
                  }`}
                >
                  {/* Bullet Node */}
                  <span className={`absolute -left-[31px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full border-4 border-brand-surface ${markerColor} transition-colors`} />
                  
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
                        Week {step.week}
                      </span>
                      <div>
                        <h4 className="font-sans font-bold text-brand-dark text-sm md:text-base">{step.label}</h4>
                        <span className="text-[11px] text-brand-dark/50">{step.duration}</span>
                      </div>
                    </div>
                    
                    <span className="material-symbols-outlined text-brand-dark/30 group-hover:text-brand-primary transition-colors">
                      {step.icon}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Step Detail Panel (Right column) */}
        <div className="w-full">
          <div className="bg-white rounded-3xl p-8 border border-brand-dark/5 shadow-xl min-h-[380px] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-tertiary uppercase tracking-widest">
                  Target Track: {currentDetails.skillRequired}
                </span>
                <span className="material-symbols-outlined text-brand-tertiary">verified_user</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-sans font-extrabold text-xl text-brand-dark">Milestone Syllabus Overview</h3>
                <p className="font-sans text-sm text-brand-dark/70 leading-relaxed">
                  {currentDetails.description}
                </p>
              </div>

              {/* Core Deliverables list */}
              <div className="space-y-2.5">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-dark/45">Required Project Submissions</h4>
                <div className="space-y-2">
                  {currentDetails.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-brand-dark/80 font-sans">
                      <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                      <span className="font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-dark/5 flex justify-between items-center">
              <span className="text-[11px] text-brand-dark/45">Review required preparation specs.</span>
              <button className="bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-brand-primary font-sans font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
                Unlock Study Guide
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

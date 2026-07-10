import React from "react";
import { motion } from "motion/react";
import { LeaderboardUser } from "../types";

export default function CommandCenter() {
  // Heatmap generation state (4 columns x 7 days)
  const [heatmap, setHeatmap] = React.useState<number[]>([
    2, 0, 4, 1, 0, 3, 2,
    0, 1, 2, 0, 4, 3, 1,
    3, 0, 1, 2, 0, 4, 3,
    2, 4, 1, 3, 1, 2, 4
  ]);
  
  const [streakDays, setStreakDays] = React.useState(14);
  const [selectedSkill, setSelectedSkill] = React.useState<string>("React");

  // Leaderboard state
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardUser[]>([
    { rank: 1, name: "Alex Chen", avatarGradient: "from-amber-400 to-orange-500", score: 12450 },
    { rank: 2, name: "You (Priya)", avatarGradient: "from-blue-400 to-brand-primary", score: 11200, isCurrentUser: true },
    { rank: 3, name: "Lucas Vance", avatarGradient: "from-purple-500 to-indigo-500", score: 10980 },
    { rank: 4, name: "Danielle Wu", avatarGradient: "from-emerald-400 to-teal-500", score: 10450 }
  ]);

  const [hasCompletedDailyTask, setHasCompletedDailyTask] = React.useState(false);

  // Skill ratings for the SVG Radar chart
  const skillsData = [
    { label: "Logic", value: 85, angle: 0 },
    { label: "Design", value: 65, angle: 90 },
    { label: "React", value: 92, angle: 180 },
    { label: "Backend", value: 75, angle: 270 }
  ];

  const handleCellClick = (idx: number) => {
    const updated = [...heatmap];
    if (updated[idx] < 4) {
      updated[idx] += 1;
      setHeatmap(updated);
      if (updated[idx] === 1) {
        setStreakDays(prev => prev + 1);
      }
    }
  };

  const completeDailyChallenge = () => {
    if (hasCompletedDailyTask) return;
    setHasCompletedDailyTask(true);
    
    // Increment Current User Score and resort leaderboard
    const updated = leaderboard.map(user => {
      if (user.isCurrentUser) {
        return { ...user, score: user.score + 1500 };
      }
      return user;
    });

    // Resort based on score
    updated.sort((a, b) => b.score - a.score);
    
    // Recalculate rank
    const ranked = updated.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    setLeaderboard(ranked);
    setStreakDays(prev => prev + 1);

    // Toggle a random heatmap cell to high active
    const randomIdx = Math.floor(Math.random() * heatmap.length);
    const updatedHeat = [...heatmap];
    updatedHeat[randomIdx] = 4;
    setHeatmap(updatedHeat);
  };

  // Radar points helper
  const center = 100;
  const maxVal = 100;
  const radius = 65;

  const getPointsStr = () => {
    return skillsData.map(d => {
      const radians = (d.angle * Math.PI) / 180;
      const dist = (d.value / maxVal) * radius;
      const x = center + dist * Math.cos(radians);
      const y = center + dist * Math.sin(radians);
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <section id="command-center" className="py-20 bg-brand-dark text-white rounded-[3rem] mx-4 mb-20 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="text-xs font-bold text-brand-primary-light uppercase tracking-widest mb-2">PERSONAL DASHBOARD</div>
          <h2 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight text-white">
            Your Coding Command Center
          </h2>
          <p className="font-sans text-sm md:text-base text-white/60 max-w-xl mx-auto mt-2">
            Stay focused with live performance tracking, gamified metrics, peer leaderboards, and immediate path verification.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card A: Skill Radar SVG Plot (4/12 width) */}
          <div className="lg:col-span-4 bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans font-extrabold text-base">Skill Radar</h3>
                <span className="text-[10px] font-bold text-brand-primary-light uppercase bg-brand-primary/20 px-2 py-0.5 rounded">
                  Hover to Inspect
                </span>
              </div>
              <p className="font-sans text-xs text-white/50 leading-relaxed">
                Hover or tap on technical metrics to adjust skill prioritization.
              </p>
            </div>

            {/* Interactive SVG Radar Plot */}
            <div className="flex-1 flex items-center justify-center py-6">
              <svg width="200" height="200" className="w-48 h-48">
                {/* Background radar concentric squares */}
                <rect x="65" y="65" width="70" height="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <rect x="45" y="45" width="110" height="110" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                <rect x="25" y="25" width="150" height="150" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                
                {/* Grid Cross axes */}
                <line x1="25" y1="100" x2="175" y2="100" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
                <line x1="100" y1="25" x2="100" y2="175" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />

                {/* Radar Solid Area */}
                <polygon 
                  points={getPointsStr()} 
                  fill="rgba(10,168,255,0.25)" 
                  stroke="#0aa8ff" 
                  strokeWidth="2" 
                  className="transition-all duration-300"
                />

                {/* Skill Nodes dots */}
                {skillsData.map((d, i) => {
                  const radians = (d.angle * Math.PI) / 180;
                  const dist = (d.value / maxVal) * radius;
                  const x = center + dist * Math.cos(radians);
                  const y = center + dist * Math.sin(radians);
                  return (
                    <g key={i} className="cursor-pointer" onMouseEnter={() => setSelectedSkill(d.label)}>
                      <circle cx={x} cy={y} r="5" fill={selectedSkill === d.label ? "#00c2cb" : "#0aa8ff"} />
                    </g>
                  );
                })}

                {/* Axes labels */}
                <text x="105" y="20" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="bold" textAnchor="middle">Logic</text>
                <text x="178" y="103" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="bold">Design</text>
                <text x="105" y="190" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="bold" textAnchor="middle">React</text>
                <text x="5" y="103" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="bold">Backend</text>
              </svg>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex justify-between items-center text-xs font-sans">
              <span className="text-white/60">Inspecting Parameter:</span>
              <span className="font-extrabold text-brand-primary-light">{selectedSkill} (Active Mastery)</span>
            </div>
          </div>

          {/* Card B: Heatmap Grid (8/12 width) */}
          <div className="lg:col-span-8 bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-sans font-extrabold text-base">Coding Streak</h3>
                  <span className="text-[10px] font-bold text-orange-400 uppercase bg-orange-500/15 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                    🔥 {streakDays} Days on Fire
                  </span>
                </div>
                <span className="text-xs text-white/55">Active contribution tracker</span>
              </div>
              <p className="font-sans text-xs text-white/50 leading-relaxed mb-6">
                Click on the heatmap grid blocks below to log custom coding activities and increment your streak manually!
              </p>
            </div>

            {/* Grid Map */}
            <div className="grid grid-cols-7 gap-2.5 max-w-md my-4">
              {heatmap.map((val, idx) => {
                let bgClass = "bg-white/5";
                if (val === 1) bgClass = "bg-brand-primary/20";
                if (val === 2) bgClass = "bg-brand-primary/45";
                if (val === 3) bgClass = "bg-brand-primary/70";
                if (val === 4) bgClass = "bg-brand-accent";

                return (
                  <div 
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    className={`${bgClass} rounded aspect-square w-full cursor-pointer hover:ring-2 hover:ring-white/30 transition-all`}
                    title={`Day activity level: ${val}/4 (Click to log activity)`}
                  />
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4 text-[10px] text-white/60 font-sans">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-white/5 rounded-sm" /> No Activity
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-brand-primary rounded-sm" /> Active Up-skilling
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-brand-accent rounded-sm" /> Level Max
                </span>
              </div>
              
              <button 
                onClick={completeDailyChallenge}
                disabled={hasCompletedDailyTask}
                className={`text-xs px-5 py-2.5 rounded-xl font-sans font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  hasCompletedDailyTask 
                    ? "bg-white/15 text-white/50 cursor-not-allowed" 
                    : "bg-brand-primary hover:bg-brand-secondary text-white"
                }`}
              >
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                {hasCompletedDailyTask ? "Daily Challenge Claimed" : "Claim Daily Challenge (+1500 XP)"}
              </button>
            </div>
          </div>

          {/* Card C: Global Leaderboard (5/12 width) */}
          <div className="lg:col-span-5 bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
            <h3 className="font-sans font-extrabold text-base mb-2">Cohort Leaderboard</h3>
            <p className="font-sans text-xs text-white/50 leading-relaxed mb-6">
              Track your rank in real-time alongside other cohort builders globally.
            </p>

            <div className="space-y-3.5 flex-1 flex flex-col justify-center">
              {leaderboard.map((user) => (
                <div 
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    user.isCurrentUser 
                      ? "bg-brand-primary/20 border-brand-primary" 
                      : "bg-white/5 border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold w-4 text-white/40">{user.rank}</span>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${user.avatarGradient} shrink-0`} />
                    <span className="font-sans font-extrabold text-xs">{user.name}</span>
                  </div>
                  <span className="font-sans font-extrabold text-xs text-brand-primary-light">
                    {user.score.toLocaleString()} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card D: Unlock Certification Link Block (7/12 width) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="space-y-4 max-w-sm text-left relative z-10">
              <h3 className="font-sans font-extrabold text-xl md:text-2xl text-white">Unlock Your Digital Certificate</h3>
              <p className="font-sans text-xs md:text-sm text-white/80 leading-relaxed">
                Test your skills in advanced React hooks, SQL optimization, and neural pipelines. Complete 'Advanced System Design' to generate your fully verified digital badge below.
              </p>
              <a 
                href="#credentials"
                className="inline-block bg-white text-brand-primary font-sans font-extrabold text-xs px-5 py-2.5 rounded-xl hover:shadow-lg transition-shadow"
              >
                Go to Certificate Builder
              </a>
            </div>
            <span className="material-symbols-outlined text-[150px] absolute -right-4 top-1/2 -translate-y-1/2 opacity-15 rotate-12 pointer-events-none">
              workspace_premium
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}

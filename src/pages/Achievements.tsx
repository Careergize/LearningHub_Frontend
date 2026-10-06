import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Award,
  Medal,
  CheckCircle2,
  Star,
  Sparkles,
  Flame,
  Shield,
  Share2,
  Download,
  Copy,
  ExternalLink,
  Search,
  ChevronRight,
  X,
  Menu,
  LogOut,
  LayoutDashboard,
  User,
  BookOpen,
  CalendarDays,
  Brain,
  TrendingUp,
  Clock,
  Lock,
  Unlock,
  Printer,
  GraduationCap,
  Code2,
  Check,
  FileCheck,
  ChevronDown,
} from "lucide-react";

import careergizeLogo from "../assets/careergize-logo.jpeg";

/* =========================================================
   TYPES
========================================================= */

type BadgeTier = "legendary" | "epic" | "rare" | "milestone";
type BadgeCategory = "All" | "Mastery" | "Consistency" | "Excellence" | "Challenges";

interface AchievementBadge {
  id: string;
  title: string;
  category: "Mastery" | "Consistency" | "Excellence" | "Challenges";
  tier: BadgeTier;
  xp: number;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number; // 0 - 100
  progressLabel?: string;
  description: string;
  requirement: string;
  iconType: string;
}

interface CertificateItem {
  id: string;
  title: string;
  track: string;
  credentialId: string;
  issueDate: string;
  expiryDate: string;
  grade: string;
  instructor: string;
  skills: string[];
  status: "verified" | "in_progress";
  progress?: number;
  remainingModules?: string;
  verificationHash: string;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  email: string;
  xp: number;
  badgesCount: number;
  streak: number;
  tier: string;
  isCurrentUser?: boolean;
}

/* =========================================================
   NAVIGATION ITEMS
========================================================= */

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Profile", icon: User },
  { label: "My Learning", icon: BookOpen },
  { label: "Schedule", icon: CalendarDays },
  { label: "Achievements", icon: Trophy },
  { label: "AI Mentor", icon: Brain },
];

/* =========================================================
   MOCK DATA
========================================================= */



const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: "b1",
    title: "Python Pioneer",
    category: "Mastery",
    tier: "legendary",
    xp: 350,
    unlocked: true,
    unlockedDate: "Sep 10, 2024",
    description: "Mastered OOP, metaclasses, decorators, and engineered high-throughput REST ViewSets with Django.",
    requirement: "Complete all 25 core Python and Django architectural challenges.",
    iconType: "python",
  },
  {
    id: "b2",
    title: "React Architect",
    category: "Mastery",
    tier: "legendary",
    xp: 400,
    unlocked: true,
    unlockedDate: "Sep 18, 2024",
    description: "Built component-driven interfaces using modern Zustand stores, TanStack caching, and zero layout shift.",
    requirement: "Build and deploy 5 production React components with 100% test coverage.",
    iconType: "react",
  },
  {
    id: "b3",
    title: "14-Day Iron Streak",
    category: "Consistency",
    tier: "epic",
    xp: 300,
    unlocked: true,
    unlockedDate: "Today",
    description: "Demonstrated daily dedication by logging into Learning Hub and committing code for 14 straight days.",
    requirement: "Maintain continuous daily activity for two consecutive weeks.",
    iconType: "streak",
  },
  {
    id: "b4",
    title: "Bug Crusher",
    category: "Excellence",
    tier: "rare",
    xp: 200,
    unlocked: true,
    unlockedDate: "Sep 22, 2024",
    description: "Discovered and corrected 15 edge-case exceptions in the interactive code validation runner.",
    requirement: "Solve 15 debugging challenges on the first attempt.",
    iconType: "bug",
  },
  {
    id: "b5",
    title: "SQL & Query Optimizer",
    category: "Mastery",
    tier: "epic",
    xp: 250,
    unlocked: true,
    unlockedDate: "Sep 12, 2024",
    description: "Indexed database schemas and reduced sub-second query latency by over 50% in PostgreSQL.",
    requirement: "Optimize 5 slow complex SQL queries using EXPLAIN ANALYZE.",
    iconType: "database",
  },
  {
    id: "b6",
    title: "Early Bird Attendee",
    category: "Consistency",
    tier: "milestone",
    xp: 150,
    unlocked: true,
    unlockedDate: "Sep 24, 2024",
    description: "Checked in on time to 10 consecutive morning live lecture and preparation sessions.",
    requirement: "Verify attendance within the first 5 minutes of 10 live classes.",
    iconType: "clock",
  },
  {
    id: "b7",
    title: "Clean Code Evangelist",
    category: "Excellence",
    tier: "rare",
    xp: 200,
    unlocked: true,
    unlockedDate: "Sep 16, 2024",
    description: "Passed all automated TypeScript strict checks and SonarQube quality gates on 8 project PRs.",
    requirement: "Submit 8 assignments with zero lint warnings or formatting errors.",
    iconType: "code",
  },
  {
    id: "b8",
    title: "API Craftsperson",
    category: "Mastery",
    tier: "epic",
    xp: 300,
    unlocked: true,
    unlockedDate: "Sep 08, 2024",
    description: "Architected secure JWT authentication, rate limiting, and role-based permissions from scratch.",
    requirement: "Implement end-to-end OAuth and JWT auth flows in a full stack project.",
    iconType: "shield",
  },
  {
    id: "b9",
    title: "Capstone Innovator",
    category: "Excellence",
    tier: "legendary",
    xp: 500,
    unlocked: true,
    unlockedDate: "Sep 25, 2024",
    description: "Successfully deployed a full-stack production application with CI/CD pipeline and cloud hosting.",
    requirement: "Ship an approved capstone project evaluated with distinction by the mentor team.",
    iconType: "trophy",
  },
  {
    id: "b10",
    title: "Peer Collaborator",
    category: "Consistency",
    tier: "milestone",
    xp: 150,
    unlocked: true,
    unlockedDate: "Sep 14, 2024",
    description: "Provided thoughtful and constructive feedback on 5 cohort peer code reviews in discussion channels.",
    requirement: "Leave actionable review comments on 5 fellow students' pull requests.",
    iconType: "user",
  },
  {
    id: "b11",
    title: "Vector DB Scout",
    category: "Mastery",
    tier: "rare",
    xp: 250,
    unlocked: true,
    unlockedDate: "Sep 27, 2024",
    description: "Implemented high-performance vector embeddings for semantic document search and similarity matching.",
    requirement: "Store and query 1,000+ vector chunks in a vector database.",
    iconType: "sparkle",
  },
  {
    id: "b12",
    title: "Quick Solver",
    category: "Challenges",
    tier: "milestone",
    xp: 150,
    unlocked: true,
    unlockedDate: "Sep 05, 2024",
    description: "Completed an algorithmic problem-solving sprint in under 15 minutes with optimal O(n) complexity.",
    requirement: "Solve a timed algorithm challenge with 100% test pass within 15 minutes.",
    iconType: "bolt",
  },
  {
    id: "b13",
    title: "Generative AI Specialist",
    category: "Mastery",
    tier: "legendary",
    xp: 600,
    unlocked: false,
    progress: 75,
    progressLabel: "3 / 4 Evaluations",
    description: "Build an end-to-end multi-agent orchestration workflow using LangChain, RAG, and LLM tool calling.",
    requirement: "Deploy a production-grade AI assistant with streaming memory and ground-truth retrieval.",
    iconType: "brain",
  },
  {
    id: "b14",
    title: "Docker & Cloud Pilot",
    category: "Mastery",
    tier: "epic",
    xp: 450,
    unlocked: false,
    progress: 40,
    progressLabel: "2 / 5 Cloud Labs",
    description: "Deploy multi-container Kubernetes manifests, manage ingress controllers, and configure Helm charts.",
    requirement: "Complete 5 hands-on cloud DevOps and containerization labs.",
    iconType: "cloud",
  },
  {
    id: "b15",
    title: "30-Day Living Legend",
    category: "Consistency",
    tier: "legendary",
    xp: 700,
    unlocked: false,
    progress: 47,
    progressLabel: "14 / 30 Days",
    description: "Maintain active coding, lecture attendance, and assignment submissions for 30 consecutive calendar days.",
    requirement: "Reach a continuous streak of 30 days without interruption.",
    iconType: "flame",
  },
  {
    id: "b16",
    title: "Hackathon Podium",
    category: "Challenges",
    tier: "epic",
    xp: 500,
    unlocked: false,
    progress: 0,
    progressLabel: "Starts in 2 Weeks",
    description: "Compete and place in the top 3 finalists in the Careergize Annual Global Code Jam.",
    requirement: "Build and pitch a team project during the 48-hour live hackathon.",
    iconType: "medal",
  },
  {
    id: "b17",
    title: "System Design Sorcerer",
    category: "Mastery",
    tier: "legendary",
    xp: 550,
    unlocked: false,
    progress: 40,
    progressLabel: "2 / 5 Case Studies",
    description: "Architect high-concurrency microservice systems handling 100k requests/sec with caching & event queues.",
    requirement: "Complete 5 complex system architecture case reviews with mentor sign-off.",
    iconType: "database",
  },
  {
    id: "b18",
    title: "Open Source Contributor",
    category: "Excellence",
    tier: "rare",
    xp: 300,
    unlocked: false,
    progress: 33,
    progressLabel: "1 / 3 Merged PRs",
    description: "Contribute meaningful documentation, bugfixes, or features to public open-source software libraries.",
    requirement: "Get 3 pull requests reviewed and merged into recognized open-source repos.",
    iconType: "git",
  },
];

const LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Alex Rivera",
    email: "alex.r@careergize.dev",
    xp: 4250,
    badgesCount: 16,
    streak: 28,
    tier: "Grandmaster",
  },
  {
    rank: 2,
    name: "Priya Nair",
    email: "priya.n@careergize.dev",
    xp: 3920,
    badgesCount: 15,
    streak: 21,
    tier: "Master",
  },
  {
    rank: 3,
    name: "David Kim",
    email: "david.k@careergize.dev",
    xp: 3610,
    badgesCount: 13,
    streak: 19,
    tier: "Master",
  },
  {
    rank: 4,
    name: "Student (You)",
    email: "suku@gmail.com",
    xp: 3450,
    badgesCount: 12,
    streak: 14,
    tier: "Senior Learner",
    isCurrentUser: true,
  },
  {
    rank: 5,
    name: "Maya Patel",
    email: "maya.p@careergize.dev",
    xp: 3280,
    badgesCount: 11,
    streak: 12,
    tier: "Senior Learner",
  },
  {
    rank: 6,
    name: "Liam Smith",
    email: "liam.s@careergize.dev",
    xp: 3150,
    badgesCount: 10,
    streak: 15,
    tier: "Practitioner",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function Achievements() {
  const navigate = useNavigate();

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User state
  const [user, setUser] = useState<any>(null);

  // View & Filter states
  const [activeTab, setActiveTab] = useState<"all" | "certificates" | "badges" | "leaderboard">("all");
  const [badgeCategory, setBadgeCategory] = useState<BadgeCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [badgeFilterStatus, setBadgeFilterStatus] = useState<"all" | "unlocked" | "locked">("all");

  // Selected items for Modals
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [badges, setBadges] = useState<AchievementBadge[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);

  // Load User from LocalStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (e) {
        console.error("Failed to parse loggedInUser", e);
      }
    }
  }, []);
  useEffect(() => {
  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        "http://127.0.0.1:8000/api/achievements/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch achievements");
      }

      const data = await response.json();

      const formattedBadges: AchievementBadge[] = data.achievements.map(
        (achievement: any) => ({
          id: String(achievement.id),
          title: achievement.title,
          category: achievement.category || "Mastery",
          tier: achievement.tier || "milestone",
          xp: achievement.xp || 0,
          unlocked: achievement.unlocked,
          unlockedDate: achievement.unlocked_date
            ? new Date(achievement.unlocked_date).toLocaleDateString()
            : undefined,
          progress: achievement.progress,
          progressLabel: achievement.progress_label || undefined,
          description: achievement.description,
          requirement: achievement.requirement || "",
          iconType: achievement.icon_type || achievement.icon || "trophy",
        })
      );

      setBadges(formattedBadges);
    } catch (error) {
      console.error("Failed to load achievements:", error);
    }
  };

  fetchAchievements();
}, []);
useEffect(() => {
  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        "http://127.0.0.1:8000/api/certificates/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // rest of certificate code...
    } catch (error) {
      console.error("Failed to load certificates:", error);
    }
  };

  fetchCertificates();
}, []);

  const studentName = user?.username || "suku@gmail.com";
  const studentEmail = user?.email || "suku@gmail.com";
  const studentAvatarChar = studentName.charAt(0).toUpperCase();

  // Toast Helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Sidebar navigation handler
  const handleNavigation = (label: string) => {
    if (label === "Overview") navigate("/dashboard");
    if (label === "My Profile") navigate("/profile");
    if (label === "My Learning") navigate("/my-learning");
    if (label === "Schedule") navigate("/schedule");
    if (label === "Achievements") navigate("/achievements");
    if (label === "AI Mentor") navigate("/ai-mentor");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInStudentId");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  // Filtered Badges
  const filteredBadges = useMemo(() => {
   return badges.filter((b) => {
      // Category filter
      if (badgeCategory !== "All" && b.category !== badgeCategory) return false;

      // Status filter
      if (badgeFilterStatus === "unlocked" && !b.unlocked) return false;
      if (badgeFilterStatus === "locked" && b.unlocked) return false;

      // Search filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = b.title.toLowerCase().includes(q);
        const matchesDesc = b.description.toLowerCase().includes(q);
        const matchesReq = b.requirement.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesReq) return false;
      }

      return true;
    });
  }, [badges, badgeCategory, badgeFilterStatus, searchQuery]);

  // Badge tier color helper
  const getTierBadgeStyle = (tier: BadgeTier) => {
    switch (tier) {
      case "legendary":
        return {
          pill: "bg-amber-500/10 text-amber-700 border-amber-300/60",
          glow: "from-amber-500/20 to-yellow-500/10",
          iconBg: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/30",
          border: "border-amber-200/80 hover:border-amber-400",
          label: "Legendary",
        };
      case "epic":
        return {
          pill: "bg-purple-500/10 text-purple-700 border-purple-300/60",
          glow: "from-purple-500/20 to-indigo-500/10",
          iconBg: "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/30",
          border: "border-purple-200/80 hover:border-purple-400",
          label: "Epic",
        };
      case "rare":
        return {
          pill: "bg-blue-500/10 text-brand-primary border-blue-300/60",
          glow: "from-blue-500/20 to-cyan-500/10",
          iconBg: "bg-gradient-to-br from-sky-500 to-brand-primary text-white shadow-blue-500/30",
          border: "border-sky-200/80 hover:border-brand-primary/50",
          label: "Rare",
        };
      case "milestone":
      default:
        return {
          pill: "bg-emerald-500/10 text-emerald-700 border-emerald-300/60",
          glow: "from-emerald-500/20 to-teal-500/10",
          iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30",
          border: "border-emerald-200/80 hover:border-emerald-400",
          label: "Milestone",
        };
    }
  };

  // Render badge icon
  const renderBadgeIcon = (type: string, className = "w-6 h-6") => {
    switch (type) {
      case "python":
      case "code":
        return <Code2 className={className} />;
      case "react":
      case "sparkle":
        return <Sparkles className={className} />;
      case "streak":
      case "flame":
        return <Flame className={className} />;
      case "bug":
        return <Shield className={className} />;
      case "database":
        return <DatabaseIcon className={className} />;
      case "clock":
        return <Clock className={className} />;
      case "shield":
        return <Shield className={className} />;
      case "trophy":
        return <Trophy className={className} />;
      case "user":
        return <User className={className} />;
      case "brain":
        return <Brain className={className} />;
      case "cloud":
        return <Award className={className} />;
      case "medal":
        return <Medal className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  // Helper custom DB icon
  function DatabaseIcon({ className }: { className: string }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    );
  }

  // Copy Credential Link
  const handleCopyCredential = (cert: CertificateItem) => {
    const url = `https://careergize.com/verify/${cert.credentialId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast(`Verification link copied! (${cert.credentialId})`);
  };

  // Share to LinkedIn simulation
  const handleShareLinkedIn = (cert: CertificateItem) => {
    showToast(`Opening LinkedIn Certificate Share Dialog for "${cert.title}"...`);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      `https://careergize.com/verify/${cert.credentialId}`
    )}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  // Download PDF simulation
  const handleDownloadPDF = (title: string) => {
    showToast(`Preparing high-resolution PDF for "${title}"...`);
    setTimeout(() => {
      showToast(`Downloaded verified certificate PDF!`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* =========================================================
          DESKTOP SIDEBAR (Careergize Standard - 100% Theme Matched)
      ========================================================= */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col z-30">
        {/* Brand */}
        <div className="px-7 py-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 overflow-hidden">
              <img
                src={careergizeLogo}
                alt="Careergize Logo"
                className="w-8 h-8 object-contain scale-125"
              />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-900">
                Careergize<span className="text-brand-primary">.</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                Learning Hub
              </div>
            </div>
          </div>

          {/* Student Profile Quick Tile */}
          <div className="mt-8 flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm shrink-0">
              {studentAvatarChar}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate text-slate-800">{studentName}</p>
              <p className="text-xs text-slate-400 truncate">{studentEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === "Achievements";

            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary font-bold shadow-2xs"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-brand-primary" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-brand-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Achievements Standing Pill in Sidebar */}
        <div className="p-4 mx-4 mb-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-700">
            <span>Achievements Progress</span>
            <span className="text-brand-primary font-extrabold">12 / 18</span>
          </div>
          <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-primary h-1.5 rounded-full"
              style={{ width: "67%" }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-brand-primary font-bold">
              <Award className="w-3.5 h-3.5" />
              Level 4
            </span>
            <span className="text-brand-primary font-bold">3,450 XP</span>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center overflow-hidden">
            <img src={careergizeLogo} alt="Careergize Logo" className="w-7 h-7 object-contain scale-110" />
          </div>
          <div className="font-extrabold text-base text-slate-900">
            Careergize<span className="text-brand-primary">.</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-3 bg-white border-b border-slate-200 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.label)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}

      {/* =========================================================
          MAIN CONTENT AREA
      ========================================================= */}
      <main className="lg:ml-64 min-h-screen">
        <div className="w-full px-5 sm:px-8 lg:px-10 py-8 space-y-8">
          {/* =====================================================
              1. HERO / WELCOME HEADER
              ===================================================== */}
          <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            {/* Soft decorative glow */}
            <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 right-64 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    HONORS & CREDENTIALS • VERIFIED PROGRESS
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Student Achievements & Badges
                </h1>
                <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
                  Celebrate your technical growth, showcase verified course diplomas on LinkedIn, earn exclusive skill badges, and track your cohort standing.
                </p>
              </div>

              {/* Status Banner Card */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="p-3.5 px-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-extrabold shadow-md shadow-amber-500/20 shrink-0">
                    <Medal className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Learner Tier</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Top 5%
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-slate-900">
                      Level 4 • Senior Learner
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      3,450 / 4,000 XP (550 XP to Level 5)
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => showToast("Student transcript generated & downloaded successfully!")}
                  className="px-4 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Transcript</span>
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              2. FOUR KPI STAT CARDS (Matches Theme 1-to-1)
              ===================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Badges */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-xs font-bold text-slate-400">Earned</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">12 / 18</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Unlocked Badges (67%)</p>
            </div>

            {/* Card 2: Verifiable Certificates */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs font-bold text-emerald-600 font-extrabold">Active</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">2 Verified</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Digital Diplomas</p>
            </div>

            {/* Card 3: Total XP Points */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-bold text-purple-600 font-extrabold">+450 This Wk</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">3,450 XP</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Total Experience Points</p>
            </div>

            {/* Card 4: Cohort Rank */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Medal className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-xs font-bold text-emerald-600 font-extrabold">Top 5%</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">Rank #4</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Cohort Leaderboard</p>
            </div>
          </div>

          {/* =====================================================
              3. TAB CONTROLS (All / Certificates / Badges / Leaderboard)
              ===================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Main Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  activeTab === "all"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Overview & All</span>
              </button>

              <button
                onClick={() => setActiveTab("certificates")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  activeTab === "certificates"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Certificates ({certificates.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("badges")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  activeTab === "badges"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Badges ({INITIAL_BADGES.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  activeTab === "leaderboard"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Medal className="w-3.5 h-3.5" />
                <span>Cohort Leaderboard</span>
              </button>
            </div>

            {/* Quick search input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills, badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* =====================================================
              4. CERTIFICATES SHOWCASE (Visible if Tab is 'all' or 'certificates')
              ===================================================== */}
          {(activeTab === "all" || activeTab === "certificates") && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Verified Course Diplomas & Certifications
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Tamper-proof verifiable credentials backed by Careergize Academic Hub. Ready for LinkedIn and employer portfolios.
                  </p>
                </div>

                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  2 Issued • 1 In Progress
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => {
                  const isVerified = cert.status === "verified";

                  return (
                    <div
                      key={cert.id}
                      className={`relative bg-white rounded-3xl border transition-all duration-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                        isVerified
                          ? "border-slate-200 hover:border-brand-primary/40"
                          : "border-dashed border-slate-300 bg-slate-50/50"
                      }`}
                    >
                      {/* Top banner / Status badge */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                            {isVerified ? (
                              <GraduationCap className="w-6 h-6" />
                            ) : (
                              <Clock className="w-6 h-6 text-amber-600" />
                            )}
                          </div>

                          <div className="flex flex-col items-end">
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified & Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">
                                <Clock className="w-3 h-3" />
                                In Progress ({cert.progress}%)
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 mt-1 font-mono">
                              {cert.credentialId}
                            </span>
                          </div>
                        </div>

                        {/* Title & Track */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-primary">
                            {cert.track}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                            {cert.title}
                          </h3>
                        </div>

                        {/* Details meta */}
                        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="text-slate-400 font-medium">Instructor:</span>
                            <span className="font-semibold text-slate-800">{cert.instructor}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="text-slate-400 font-medium">Issue Date:</span>
                            <span className="font-semibold text-slate-800">{cert.issueDate}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="text-slate-400 font-medium">Standing:</span>
                            <span className="font-extrabold text-brand-primary">{cert.grade}</span>
                          </div>
                        </div>

                        {/* In Progress Bar if applicable */}
                        {!isVerified && cert.progress !== undefined && (
                          <div className="mt-4">
                            <div className="flex justify-between text-xs font-bold mb-1.5">
                              <span className="text-slate-500">Progress to Diploma</span>
                              <span className="text-brand-primary">{cert.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-brand-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${cert.progress}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1.5">
                              {cert.remainingModules}
                            </p>
                          </div>
                        )}

                        {/* Skills Chips */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {cert.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/50"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                        {isVerified ? (
                          <>
                            <button
                              onClick={() => setSelectedCertificate(cert)}
                              className="flex-1 py-2.5 px-3 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>View Certificate</span>
                            </button>

                            <button
                              onClick={() => handleShareLinkedIn(cert)}
                              title="Share on LinkedIn"
                              className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 rounded-xl transition cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleCopyCredential(cert)}
                              title="Copy Verification Link"
                              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full py-2.5 px-4 bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold text-center">
                            Capstone Evaluation in Progress
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* =====================================================
              5. MILESTONE BADGES (Visible if Tab is 'all' or 'badges')
              ===================================================== */}
          {(activeTab === "all" || activeTab === "badges") && (
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Skill Badges & Milestones
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Click any badge to view the full unlocking criteria, rarity tier, and bonus XP rewards.
                  </p>
                </div>

                {/* Subcategory & Status Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {(["All", "Mastery", "Consistency", "Excellence", "Challenges"] as BadgeCategory[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setBadgeCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          badgeCategory === cat
                            ? "bg-slate-900 text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}

                  {/* Status Dropdown */}
                  <select
                    value={badgeFilterStatus}
                    onChange={(e) => setBadgeFilterStatus(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="unlocked">Unlocked Only (12)</option>
                    <option value="locked">In Progress / Locked (6)</option>
                  </select>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBadges.map((badge) => {
                  const style = getTierBadgeStyle(badge.tier);

                  return (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      className={`group relative bg-white rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${
                        badge.unlocked
                          ? `${style.border}`
                          : "border-slate-200 bg-slate-50/70 opacity-80"
                      }`}
                    >
                      {/* Top Row: Icon + Tier Pill */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 shadow-sm ${
                              badge.unlocked
                                ? style.iconBg
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {renderBadgeIcon(badge.iconType, "w-6 h-6")}
                          </div>

                          <div className="flex flex-col items-end">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                                badge.unlocked
                                  ? style.pill
                                  : "bg-slate-100 text-slate-400 border-slate-200"
                              }`}
                            >
                              {style.label}
                            </span>
                            <span className="text-[10px] font-bold text-brand-primary mt-1">
                              +{badge.xp} XP
                            </span>
                          </div>
                        </div>

                        {/* Title & Category */}
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-brand-primary transition">
                            {badge.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {badge.description}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Status Indicator */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        {badge.unlocked ? (
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 text-emerald-600 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Unlocked
                            </span>
                            <span className="text-slate-400 font-medium">
                              {badge.unlockedDate}
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="flex items-center gap-1 text-slate-500">
                                <Lock className="w-3.5 h-3.5" />
                                Locked
                              </span>
                              <span className="text-brand-primary">
                                {badge.progressLabel || `${badge.progress}%`}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-brand-primary h-1.5 rounded-full"
                                style={{ width: `${badge.progress || 0}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredBadges.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                  <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-700">No badges match your search</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Try clearing the search query or selecting a different filter category.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setBadgeCategory("All");
                      setBadgeFilterStatus("all");
                    }}
                    className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </section>
          )}

          {/* =====================================================
              6. COHORT LEADERBOARD (Visible if Tab is 'all' or 'leaderboard')
              ===================================================== */}
          {(activeTab === "all" || activeTab === "leaderboard") && (
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      <Medal className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Cohort Autumn 2024 Leaderboard
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Rankings update automatically based on assignment completions, lecture attendance streaks, and technical peer reviews.
                  </p>
                </div>

                <div className="p-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">Your Cohort Rank:</span>
                  <span className="text-sm font-extrabold text-brand-primary">
                    #4 of 128 Learners
                  </span>
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 px-3">Rank</th>
                      <th className="pb-3 px-3">Learner</th>
                      <th className="pb-3 px-3">Standing Tier</th>
                      <th className="pb-3 px-3">Badges</th>
                      <th className="pb-3 px-3">Daily Streak</th>
                      <th className="pb-3 px-3 text-right">Total XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {LEADERBOARD_USERS.map((userRow) => {
                      const isMe = userRow.isCurrentUser;

                      return (
                        <tr
                          key={userRow.rank}
                          className={`transition ${
                            isMe
                              ? "bg-brand-primary/5 font-bold text-slate-900"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {/* Rank column */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              {userRow.rank === 1 && (
                                <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-extrabold flex items-center justify-center shadow-xs">
                                  1
                                </span>
                              )}
                              {userRow.rank === 2 && (
                                <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-extrabold flex items-center justify-center shadow-xs">
                                  2
                                </span>
                              )}
                              {userRow.rank === 3 && (
                                <span className="w-7 h-7 rounded-full bg-amber-700 text-amber-100 font-extrabold flex items-center justify-center shadow-xs">
                                  3
                                </span>
                              )}
                              {userRow.rank > 3 && (
                                <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center">
                                  {userRow.rank}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Name + Avatar */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-xs shrink-0">
                                {userRow.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-slate-900">
                                    {isMe ? studentName : userRow.name}
                                  </span>
                                  {isMe && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-primary text-white font-extrabold">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 font-normal">
                                  {isMe ? studentEmail : userRow.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Tier */}
                          <td className="py-3.5 px-3">
                            <span className="text-slate-600 font-semibold">{userRow.tier}</span>
                          </td>

                          {/* Badges */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1 text-slate-600 font-bold">
                              <Award className="w-3.5 h-3.5 text-amber-500" />
                              <span>{userRow.badgesCount}</span>
                            </div>
                          </td>

                          {/* Streak */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1 text-orange-600 font-bold">
                              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                              <span>{userRow.streak} Days</span>
                            </div>
                          </td>

                          {/* XP */}
                          <td className="py-3.5 px-3 text-right">
                            <span className="font-extrabold text-brand-primary">
                              {userRow.xp.toLocaleString()} XP
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        </div>
      </main>

      {/* =========================================================
          MODAL 1: OFFICIAL DIPLOMA CERTIFICATE VIEWER
      ========================================================= */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto">
            {/* Modal Header Controls */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Official Careergize Certificate
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedCertificate.credentialId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCredential(selectedCertificate)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>

                <button
                  onClick={() => handleDownloadPDF(selectedCertificate.title)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary/95 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Body (Official Document Layout) */}
            <div className="p-8 sm:p-12 bg-[#fafcff]">
              <div className="relative border-8 border-double border-slate-200 bg-white p-8 sm:p-12 rounded-2xl shadow-sm text-center overflow-hidden">
                {/* Certificate Watermark Background */}
                <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                  <Trophy className="w-96 h-96 text-brand-primary" />
                </div>

                {/* Top Certificate Brand */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 mb-3 overflow-hidden">
                    <img
                      src={careergizeLogo}
                      alt="Careergize"
                      className="w-10 h-10 object-contain scale-125"
                    />
                  </div>
                  <div className="text-xl font-extrabold tracking-tight text-slate-900">
                    Careergize<span className="text-brand-primary">.</span> Learning Hub
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-slate-400 mt-1">
                    Accredited Technical Education Board
                  </div>
                </div>

                {/* Certificate Title */}
                <div className="my-6">
                  <p className="text-xs uppercase font-extrabold tracking-[0.2em] text-amber-600 mb-2">
                    CERTIFICATE OF TECHNICAL EXCELLENCE & MASTERY
                  </p>
                  <p className="text-xs text-slate-400 italic">
                    This is proudly conferred upon
                  </p>

                  {/* Student Name */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight my-3 font-serif">
                    {studentName}
                  </h2>

                  <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                    who has satisfied all rigorous curriculum specifications, practical code reviews, and capstone project assessments with distinction for
                  </p>

                  <h3 className="text-lg sm:text-xl font-extrabold text-brand-primary mt-3 mb-1">
                    {selectedCertificate.title}
                  </h3>

                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200 mt-2">
                    {selectedCertificate.grade}
                  </span>
                </div>

                {/* Skills Tested */}
                <div className="my-6 py-4 border-y border-slate-100 flex flex-wrap justify-center gap-2">
                  {selectedCertificate.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Signatures & Seal */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mt-8 pt-4">
                  {/* Signature 1 */}
                  <div className="text-center">
                    <div className="font-serif italic text-slate-800 text-sm font-bold border-b border-slate-300 pb-1 mx-4">
                      {selectedCertificate.instructor}
                    </div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">
                      Lead Faculty Instructor
                    </p>
                  </div>

                  {/* Gold Official Seal */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-white flex flex-col items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-white">
                      <Shield className="w-6 h-6" />
                      <span className="text-[8px] font-extrabold tracking-tighter uppercase">VERIFIED</span>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono">
                      Careergize Seal
                    </span>
                  </div>

                  {/* Signature 2 */}
                  <div className="text-center">
                    <div className="font-serif italic text-slate-800 text-sm font-bold border-b border-slate-300 pb-1 mx-4">
                      Dr. A. Sundaram
                    </div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">
                      Dean of Academic Curriculum
                    </p>
                  </div>
                </div>

                {/* Hash verification footer */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
                  <span>Issued: {selectedCertificate.issueDate}</span>
                  <span className="font-mono">Hash: {selectedCertificate.verificationHash}</span>
                  <span>Credential ID: {selectedCertificate.credentialId}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Accredited on public Careergize verification ledger.
              </span>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: BADGE DETAIL & UNLOCK REQUIREMENTS MODAL
      ========================================================= */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
            {/* Close button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge Icon presentation */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg mb-4 ${
                  selectedBadge.unlocked
                    ? getTierBadgeStyle(selectedBadge.tier).iconBg
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {renderBadgeIcon(selectedBadge.iconType, "w-10 h-10")}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${
                    selectedBadge.unlocked
                      ? getTierBadgeStyle(selectedBadge.tier).pill
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {getTierBadgeStyle(selectedBadge.tier).label} Tier
                </span>
                <span className="text-xs font-extrabold text-brand-primary">
                  +{selectedBadge.xp} XP
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {selectedBadge.title}
              </h3>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            {/* Requirement Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Unlocking Requirement
              </span>
              <p className="font-semibold text-slate-700">
                {selectedBadge.requirement}
              </p>
            </div>

            {/* Unlocking status & progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Status</span>
                {selectedBadge.unlocked ? (
                  <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Unlocked ({selectedBadge.unlockedDate})
                  </span>
                ) : (
                  <span className="font-extrabold text-slate-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Locked ({selectedBadge.progressLabel || `${selectedBadge.progress}%`})
                  </span>
                )}
              </div>

              {!selectedBadge.unlocked && (
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-primary h-2 rounded-full"
                    style={{ width: `${selectedBadge.progress || 0}%` }}
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center gap-3">
              {selectedBadge.unlocked ? (
                <button
                  onClick={() => {
                    showToast(`Shared "${selectedBadge.title}" achievement to feed!`);
                    setSelectedBadge(null);
                  }}
                  className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Achievement</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedBadge(null);
                    navigate("/my-learning");
                  }}
                  className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <span>Practice Towards Badge</span>
                </button>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TOAST NOTIFICATION
      ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Trophy,
  Brain,
  User,
  LogOut,
  ChevronRight,
  Clock,
  Award,
  Menu,
  X,
  Search,
  CheckCircle2,
  PlayCircle,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  Share2,
  Download,
  GraduationCap,
  Layers,
  ArrowRight,
  Check,
  Compass,
  FileText,
} from "lucide-react";

import careergizeLogo from "../assets/careergize-logo.jpeg";

/* =========================================================
   TYPES
========================================================= */

export type CourseStatus = "in_progress" | "completed";

export interface EnrolledCourse {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Pro";
  progress: number;
  completedLessons: number;
  totalLessons: number;
  icon: string;
  bannerGradient: string;
  accentColor: string;
  status: CourseStatus;
  instructor: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  duration: string;
  nextLessonTitle?: string;
  completedDate?: string;
  certificateId?: string;
  lastAccessed: string;
  skills: string[];
}

/* =========================================================
   MOCK DATA (Realistic & Easily Swappable With API)
========================================================= */

const initialEnrolledCourses: EnrolledCourse[] = [
  {
    id: "cg-course-101",
    title: "Python Full Stack Development",
    category: "Development",
    level: "Beginner",
    progress: 68,
    completedLessons: 17,
    totalLessons: 25,
    icon: "🐍",
    bannerGradient: "from-blue-600/10 via-cyan-500/10 to-brand-primary/10",
    accentColor: "#006399",
    status: "in_progress",
    instructor: {
      name: "Arun Krishnan",
      role: "Principal Architect, Cloud Systems",
      avatarInitials: "AK",
    },
    duration: "24 Weeks",
    nextLessonTitle: "Building Scalable REST APIs with Django & PostgreSQL",
    lastAccessed: "Yesterday",
    skills: ["Python", "Django", "PostgreSQL", "REST API", "Git"],
  },
  {
    id: "cg-course-102",
    title: "React & Modern Frontend",
    category: "Frontend",
    level: "Beginner",
    progress: 44,
    completedLessons: 11,
    totalLessons: 25,
    icon: "⚛️",
    bannerGradient: "from-cyan-500/10 via-sky-500/10 to-blue-600/10",
    accentColor: "#0284c7",
    status: "in_progress",
    instructor: {
      name: "Sarah Jenkins",
      role: "UI Systems Engineer",
      avatarInitials: "SJ",
    },
    duration: "16 Weeks",
    nextLessonTitle: "Component Architecture, Hooks & Modern State Management",
    lastAccessed: "3 hours ago",
    skills: ["React", "TypeScript", "Tailwind CSS", "JavaScript", "Vite"],
  },
  {
    id: "cg-course-103",
    title: "AI & Generative AI",
    category: "Artificial Intelligence",
    level: "Beginner",
    progress: 100,
    completedLessons: 26,
    totalLessons: 26,
    icon: "🤖",
    bannerGradient: "from-purple-600/10 via-indigo-500/10 to-brand-primary/10",
    accentColor: "#7c3aed",
    status: "completed",
    instructor: {
      name: "Dr. David Chen",
      role: "AI Research Lead & Author",
      avatarInitials: "DC",
    },
    duration: "20 Weeks",
    completedDate: "August 24, 2026",
    certificateId: "CG-AI-902847-X",
    lastAccessed: "Completed",
    skills: ["Python", "Generative AI", "Prompt Engineering", "LLM APIs", "RAG"],
  },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Profile", icon: User },
  { label: "My Learning", icon: BookOpen },
  { label: "Schedule", icon: CalendarDays },
  { label: "Achievements", icon: Trophy },
  { label: "AI Mentor", icon: Brain },
];

/* =========================================================
   COMPONENT: MyLearning
========================================================= */

export default function MyLearning() {
  const navigate = useNavigate();

  // Navigation & User State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Courses & Filters State
  const [courses, setCourses] = useState<EnrolledCourse[]>(initialEnrolledCourses);
  const [statusFilter, setStatusFilter] = useState<"All" | "in_progress" | "completed">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [sortBy, setSortBy] = useState<"recent" | "progress" | "alphabetical">("recent");

  // Interaction State (Modals & Feedback)
  const [selectedCertificate, setSelectedCertificate] = useState<EnrolledCourse | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [resumingCourse, setResumingCourse] = useState<EnrolledCourse | null>(null);
  const [reviewingCourse, setReviewingCourse] = useState<EnrolledCourse | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read logged in student information from localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const studentName = user?.username || "Student";
  const studentEmail = user?.email || "student@careergize.com";

  // Sidebar / Header navigation handler
  const handleNavigation = (label: string) => {
    if (label === "Overview") navigate("/dashboard");
    if (label === "My Profile") navigate("/profile");
    if (label === "My Learning") navigate("/my-learning");
    if (label === "Schedule") navigate("/schedule");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInStudentId");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Distinct Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.category));
    return ["All Categories", ...Array.from(set)];
  }, [courses]);

  // Top Overview / Quick Stats calculation
  const stats = useMemo(() => {
    const totalEnrolled = courses.length;
    const inProgressCount = courses.filter((c) => c.status === "in_progress").length;
    const completedCount = courses.filter((c) => c.status === "completed").length;
    const certificatesEarned = courses.filter((c) => !!c.certificateId).length;

    return {
      totalEnrolled,
      inProgressCount,
      completedCount,
      certificatesEarned,
    };
  }, [courses]);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    let result = courses.filter((course) => {
      // Status filter
      if (statusFilter !== "All" && course.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "All Categories" && course.category !== selectedCategory) {
        return false;
      }
      // Search query (matches title, category, instructor, or skills)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesCategory = course.category.toLowerCase().includes(query);
        const matchesInstructor = course.instructor.name.toLowerCase().includes(query);
        const matchesSkill = course.skills.some((s) => s.toLowerCase().includes(query));

        if (!matchesTitle && !matchesCategory && !matchesInstructor && !matchesSkill) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "progress") {
        return b.progress - a.progress;
      }
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      // default: "recent" (ongoing courses first, then higher progress)
      if (a.status !== b.status) {
        return a.status === "in_progress" ? -1 : 1;
      }
      return b.progress - a.progress;
    });

    return result;
  }, [courses, statusFilter, selectedCategory, searchQuery, sortBy]);

  // Clear all filters
  const resetFilters = () => {
    setStatusFilter("All");
    setSelectedCategory("All Categories");
    setSearchQuery("");
  };

  const handleShareCertificate = (course: EnrolledCourse) => {
    setIsCopied(true);
    triggerToast(`Verification link for ${course.certificateId} copied to clipboard!`);
    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col z-30">
        
        {/* Brand / Logo */}
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
              <div className="font-extrabold text-xl tracking-tight">
                Careergize<span className="text-brand-primary">.</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                Learning Hub
              </div>
            </div>
          </div>

          {/* Student Profile Quick Tile */}
          <div className="mt-8 flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-extrabold text-sm shrink-0">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate text-slate-800">
                {studentName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {studentEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === "My Learning";

            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary font-bold shadow-xs"
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
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center overflow-hidden">
              <img
                src={careergizeLogo}
                alt="Careergize Logo"
                className="w-9 h-9 object-contain scale-110"
              />
            </div>
            <div>
              <div className="font-extrabold text-lg">
                Careergize<span className="text-brand-primary">.</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                Learning Hub
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="px-4 pb-4 border-t border-slate-100 bg-white">
            <nav className="pt-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.label === "My Learning";

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                      isActive
                        ? "bg-brand-primary/10 text-brand-primary font-bold"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-brand-primary" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* =========================================================
          MAIN VIEW CONTAINER
      ========================================================= */}
      <main className="lg:ml-64 min-h-screen">
        <div className="px-4 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto">

          {/* Section Breadcrumb & Header Banner */}
          <div className="mb-8">
            <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
              
              {/* Subtle background decorative blurs */}
              <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 right-60 w-56 h-56 rounded-full bg-blue-100/70 blur-2xl pointer-events-none" />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Dashboard • Academic Journey</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                    My Learning
                  </h1>

                  <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Track your registered programs, monitor weekly lesson completion milestones, and instantly access verified digital certificates.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-white hover:border-brand-primary/40 font-semibold text-sm transition-all cursor-pointer shadow-xs"
                  >
                    <Compass className="w-4 h-4 text-brand-primary" />
                    <span>Explore Catalog</span>
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 font-semibold text-sm transition shadow-sm cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Back to Overview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              1. TOP OVERVIEW / QUICK STATS METRIC CARDS
              ===================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            
            {/* Card 1: Enrolled Courses */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-brand-primary/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Curriculum
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats.totalEnrolled}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  Enrolled Courses
                </p>
                <span className="text-xs text-brand-primary font-bold">
                  Active
                </span>
              </div>
            </div>

            {/* Card 2: In Progress */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Ongoing
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats.inProgressCount}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  In Progress
                </p>
                <span className="text-xs text-amber-600 font-bold">
                  {Math.round((stats.inProgressCount / (stats.totalEnrolled || 1)) * 100)}%
                </span>
              </div>
            </div>

            {/* Card 3: Completed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Mastered
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats.completedCount}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  Completed
                </p>
                <span className="text-xs text-emerald-600 font-bold">
                  100% Passed
                </span>
              </div>
            </div>

            {/* Card 4: Certificates */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-400/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Verified
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats.certificatesEarned}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  Certificates
                </p>
                <span className="text-xs text-purple-600 font-bold">
                  Shareable
                </span>
              </div>
            </div>

          </div>

          {/* =====================================================
              2. FILTER & NAVIGATION BAR
              ===================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                <button
                  onClick={() => setStatusFilter("All")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    statusFilter === "All"
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span>All</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      statusFilter === "All"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {courses.length}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("in_progress")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    statusFilter === "in_progress"
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>In Progress</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      statusFilter === "in_progress"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {stats.inProgressCount}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("completed")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    statusFilter === "completed"
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Completed</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      statusFilter === "completed"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {stats.completedCount}
                  </span>
                </button>
              </div>

              {/* Right Side: Search & Filter Selectors */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                
                {/* Search Bar matching application style */}
                <div className="relative w-full sm:w-64 md:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, skills, tutors..."
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Clear Search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition cursor-pointer appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <SlidersHorizontal className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full sm:w-auto pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition cursor-pointer appearance-none"
                  >
                    <option value="recent">Sort: Activity</option>
                    <option value="progress">Sort: Progress</option>
                    <option value="alphabetical">Sort: Name</option>
                  </select>
                  <ChevronRight className="w-3.5 h-3.5 rotate-90 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

              </div>

            </div>

            {/* Active search/category tag indicator */}
            {(searchQuery || selectedCategory !== "All Categories" || statusFilter !== "All") && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Active filters:</span>

                {statusFilter !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                    Status: {statusFilter === "in_progress" ? "In Progress" : "Completed"}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-brand-primary/70"
                      onClick={() => setStatusFilter("All")}
                    />
                  </span>
                )}

                {selectedCategory !== "All Categories" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                    Category: {selectedCategory}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-brand-primary/70"
                      onClick={() => setSelectedCategory("All Categories")}
                    />
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                    Keyword: "{searchQuery}"
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-brand-primary/70"
                      onClick={() => setSearchQuery("")}
                    />
                  </span>
                )}

                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-slate-400 hover:text-brand-primary ml-auto transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset all
                </button>
              </div>
            )}
          </div>

          {/* =====================================================
              3. ENROLLED COURSES GRID
              ===================================================== */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isCompleted = course.status === "completed";

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Top Thumbnail & Visual Header */}
                    <div>
                      <div
                        className={`h-40 relative bg-gradient-to-br ${course.bannerGradient} p-5 flex flex-col justify-between border-b border-slate-100 overflow-hidden`}
                      >
                        {/* Decorative background glow */}
                        <div
                          className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full blur-xl opacity-40"
                          style={{ backgroundColor: course.accentColor }}
                        />

                        {/* Top badges row */}
                        <div className="flex items-center justify-between relative z-10">
                          <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs border border-white/60">
                            {course.category}
                          </span>

                          {isCompleted ? (
                            <span className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </span>
                          ) : (
                            <span className="bg-white/90 backdrop-blur-xs text-amber-700 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs border border-amber-200/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              In Progress
                            </span>
                          )}
                        </div>

                        {/* Course Icon & Level row */}
                        <div className="flex items-end justify-between relative z-10">
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300 border border-slate-100">
                            <span>{course.icon}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] font-bold text-slate-500 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                              {course.level}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Course Card Body */}
                      <div className="p-6">
                        
                        {/* Course Title */}
                        <h3 className="font-extrabold text-lg text-slate-900 leading-snug line-clamp-2 min-h-[3.25rem] group-hover:text-brand-primary transition-colors">
                          {course.title}
                        </h3>

                        {/* Instructor Details */}
                        <div className="flex items-center gap-3 mt-3.5 pb-4 border-b border-slate-100">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                            {course.instructor.avatarInitials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {course.instructor.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {course.instructor.role}
                            </p>
                          </div>
                        </div>

                        {/* Key Progress & Syllabus Stats */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-slate-400" />
                              {course.completedLessons} of {course.totalLessons} Lessons
                            </span>
                            <span
                              className={`font-extrabold text-sm ${
                                isCompleted ? "text-emerald-600" : "text-brand-primary"
                              }`}
                            >
                              {course.progress}%
                            </span>
                          </div>

                          {/* Progress Bar with smooth fill */}
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isCompleted
                                  ? "bg-emerald-500"
                                  : "bg-brand-primary"
                              }`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Next Action or Completion Date info */}
                        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          {isCompleted ? (
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-1.5 text-slate-500">
                                <Award className="w-3.5 h-3.5 text-emerald-600" />
                                Completed:
                              </span>
                              <span className="font-bold text-slate-800">
                                {course.completedDate || "August 2026"}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                                Next Up
                              </div>
                              <p className="font-semibold text-slate-700 truncate">
                                {course.nextLessonTitle || "Continue next lesson module"}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Skill Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-3.5">
                          {course.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                          {course.skills.length > 3 && (
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
                              +{course.skills.length - 3}
                            </span>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Card Footer / Dynamic CTAs */}
                    <div className="p-6 pt-0 mt-2">
                      {isCompleted ? (
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => setSelectedCertificate(course)}
                            className="w-full py-2.5 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Certificate</span>
                          </button>

                          <button
                            onClick={() => setReviewingCourse(course)}
                            className="w-full py-2.5 px-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResumingCourse(course)}
                          className="w-full py-3 px-4 bg-brand-primary text-white hover:bg-brand-primary/90 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md cursor-pointer group-hover:bg-brand-primary/95"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Resume Learning</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* =====================================================
                4. EMPTY STATE (When no courses match filter / search)
                ===================================================== */
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-5 shadow-xs">
                <Search className="w-8 h-8" />
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                No matching courses found
              </h2>

              <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto leading-relaxed">
                {searchQuery
                  ? `We couldn't find any courses matching "${searchQuery}". Try searching with different keywords or clearing your current filter.`
                  : "You do not have any courses enrolled under this filter category."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                <button
                  onClick={resetFilters}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Filters</span>
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Course Catalog</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Quick Help / Mentor Callout Banner */}
          <div className="mt-12 bg-gradient-to-r from-slate-900 to-brand-dark text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-slate-800">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shrink-0 text-white shadow-lg shadow-brand-primary/30">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">
                  Need guidance with your course projects?
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                  Your AI Career Mentor is ready 24/7 to review your code, explain difficult concepts, and prepare you for interviews.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition shrink-0 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Ask AI Mentor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>

      {/* =========================================================
          INTERACTIVE CERTIFICATE PREVIEW MODAL
      ========================================================= */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                  Verified Digital Credential
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Course Completion Certificate
                </h2>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="border-2 border-dashed border-brand-primary/30 rounded-2xl p-6 bg-brand-surface/40 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
                    C.
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-slate-900">
                    Careergize Verified
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Tamper-proof
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                This is to officially certify that
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {studentName}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                has successfully completed all required modules, code reviews, and practical assignments for:
              </p>
              <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200/80 font-bold text-brand-primary text-sm">
                {selectedCertificate.title}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/60 text-xs text-slate-600">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Issued On</span>
                  <span className="font-semibold text-slate-800">
                    {selectedCertificate.completedDate || "August 2026"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Credential ID</span>
                  <span className="font-mono font-bold text-brand-primary">
                    {selectedCertificate.certificateId}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                onClick={() => handleShareCertificate(selectedCertificate)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Credential</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  triggerToast(`Downloading certificate PDF for ${selectedCertificate.title}...`);
                }}
                className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          RESUME LEARNING CONFIRMATION MODAL
      ========================================================= */}
      {resumingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setResumingCourse(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
              <PlayCircle className="w-6 h-6" />
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-primary mb-1">
              Resume Workspace
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
              {resumingCourse.title}
            </h3>

            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Jumping back into your current lesson module:
            </p>

            <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-extrabold text-slate-900">
                {resumingCourse.nextLessonTitle || "Next Scheduled Topic"}
              </p>
              <p className="text-slate-400 mt-1">
                Progress: {resumingCourse.completedLessons} of {resumingCourse.totalLessons} lessons completed ({resumingCourse.progress}%)
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setResumingCourse(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setResumingCourse(null);
                  triggerToast(`Launching lesson player for "${resumingCourse.title}"...`);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Launch Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          COURSE REVIEW MODAL
      ========================================================= */}
      {reviewingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setReviewingCourse(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Curriculum Review
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
              {reviewingCourse.title}
            </h3>

            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              You have completed all {reviewingCourse.totalLessons} lessons in this curriculum track. Review syllabus archives, code repositories, or re-watch lecture recordings anytime.
            </p>

            <div className="mt-4 space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Course Code Repo</span>
                <span className="font-bold text-brand-primary flex items-center gap-1 cursor-pointer hover:underline">
                  GitHub <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">All Lecture Slides & Notes</span>
                <span className="font-bold text-brand-primary flex items-center gap-1 cursor-pointer hover:underline">
                  PDF Archive <Download className="w-3 h-3" />
                </span>
              </div>
            </div>

            <button
              onClick={() => setReviewingCourse(null)}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          TOAST FEEDBACK POPUP
      ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 max-w-sm">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-semibold leading-snug">
            {toastMessage}
          </p>
        </div>
      )}

    </div>
  );
}

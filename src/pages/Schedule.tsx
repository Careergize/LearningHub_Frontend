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
  Clock,
  Menu,
  X,
  CheckCircle2,
  Video,
  Plus,
  Trash2,
  Flame,
  Check,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ListTodo,
} from "lucide-react";

import careergizeLogo from "../assets/careergize-logo.jpeg";

/* =========================================================
   TYPES & INTERFACES
========================================================= */

interface SessionItem {
  id: string;
  text: string;
  done: boolean;
}

interface ClassSession {
  id: string;
  course: string;
  topic: string;
  dayOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  date: string; // e.g., "28"
  month: string; // e.g., "SEP"
  fullDate: string; // e.g., "Sep 28, 2026"
  time: string; // e.g., "10:00 AM - 11:30 AM"
  instructor: string;
  platform: string;
  meetUrl: string;
  isToday: boolean;
  status: "live" | "upcoming" | "completed";
  attendance: "present" | "late" | "absent" | "unmarked";
  checkInTime?: string;
  items: SessionItem[];
}

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Profile", icon: User },
  { label: "My Learning", icon: BookOpen },
  { label: "Schedule", icon: CalendarDays },
  { label: "Achievements", icon: Trophy },
  { label: "AI Mentor", icon: Brain },
];

/* =========================================================
   INITIAL DATA
========================================================= */

const INITIAL_SCHEDULE: ClassSession[] = [
  {
    id: "s1",
    course: "React & Modern Frontend",
    topic: "State Management with Zustand & TanStack Query Caching",
    dayOfWeek: "Mon",
    date: "28",
    month: "SEP",
    fullDate: "Today • Sep 28",
    time: "10:00 AM - 11:30 AM",
    instructor: "Dr. Radhika Sharma",
    platform: "Google Meet",
    meetUrl: "https://meet.google.com/cg-react-frontend",
    isToday: true,
    status: "live",
    attendance: "unmarked",
    items: [
      { id: "i1-1", text: "Verify Node.js v20+ and npm installed", done: true },
      { id: "i1-2", text: "Clone starter repository from GitHub", done: true },
      { id: "i1-3", text: "Ask mentor about query invalidation vs cache updates", done: false },
      { id: "i1-4", text: "Have second monitor or notebook ready for code-along", done: false },
    ],
  },
  {
    id: "s2",
    course: "Python Full Stack",
    topic: "Django REST Framework ViewSets & Celery Queues",
    dayOfWeek: "Tue",
    date: "29",
    month: "SEP",
    fullDate: "Tomorrow • Sep 29",
    time: "02:00 PM - 03:30 PM",
    instructor: "Arun Krishnan",
    platform: "Zoom Room 2",
    meetUrl: "https://zoom.us/j/cg-python-django",
    isToday: false,
    status: "upcoming",
    attendance: "unmarked",
    items: [
      { id: "i2-1", text: "Start Redis container (`docker run -p 6379:6379 redis`)", done: false },
      { id: "i2-2", text: "Review Django Models & Migrations handout", done: true },
      { id: "i2-3", text: "Prepare questions regarding Celery task retries", done: false },
    ],
  },
  {
    id: "s3",
    course: "AI & Generative AI",
    topic: "Vector Databases, Hybrid RAG Pipelines & LangChain",
    dayOfWeek: "Wed",
    date: "30",
    month: "SEP",
    fullDate: "Wednesday • Sep 30",
    time: "11:30 AM - 01:00 PM",
    instructor: "Siddharth Verma",
    platform: "Virtual Lab 1",
    meetUrl: "https://lab.careergize.com/ai-genai",
    isToday: false,
    status: "upcoming",
    attendance: "unmarked",
    items: [
      { id: "i3-1", text: "Set up HuggingFace and OpenAI API keys", done: false },
      { id: "i3-2", text: "Open Google Colab environment with GPU runtime", done: true },
    ],
  },
  {
    id: "s4",
    course: "Cloud DevOps & Architecture",
    topic: "Kubernetes Deployments, Ingress Controllers & Helm",
    dayOfWeek: "Fri",
    date: "02",
    month: "OCT",
    fullDate: "Friday • Oct 02",
    time: "03:00 PM - 04:30 PM",
    instructor: "Kavita Nambiar",
    platform: "Zoom Room 5",
    meetUrl: "https://zoom.us/j/cg-devops-k8s",
    isToday: false,
    status: "upcoming",
    attendance: "unmarked",
    items: [
      { id: "i4-1", text: "Install kubectl and test local cluster connection", done: false },
      { id: "i4-2", text: "Download YAML manifest templates", done: false },
    ],
  },
  {
    id: "s5",
    course: "Python Full Stack",
    topic: "PostgreSQL Database Normalization & Query Tuning",
    dayOfWeek: "Sat",
    date: "26",
    month: "SEP",
    fullDate: "Past • Sep 26",
    time: "02:00 PM - 03:30 PM",
    instructor: "Arun Krishnan",
    platform: "Google Meet",
    meetUrl: "https://meet.google.com/cg-python",
    isToday: false,
    status: "completed",
    attendance: "present",
    checkInTime: "01:58 PM",
    items: [
      { id: "i5-1", text: "Run EXPLAIN ANALYZE on sample query", done: true },
      { id: "i5-2", text: "Download lecture notes PDF", done: true },
    ],
  },
  {
    id: "s6",
    course: "React & Modern Frontend",
    topic: "React 19 Server Actions, Hooks & Asset Loading",
    dayOfWeek: "Fri",
    date: "25",
    month: "SEP",
    fullDate: "Past • Sep 25",
    time: "10:00 AM - 11:30 AM",
    instructor: "Dr. Radhika Sharma",
    platform: "Google Meet",
    meetUrl: "https://meet.google.com/cg-react",
    isToday: false,
    status: "completed",
    attendance: "present",
    checkInTime: "09:56 AM",
    items: [
      { id: "i6-1", text: "Review useActionState documentation", done: true },
    ],
  },
];

/* =========================================================
   SCHEDULE COMPONENT
========================================================= */

export default function Schedule() {
  const navigate = useNavigate();

  // Navigation & User State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Class Sessions State (persisted to localStorage)
  const [sessions, setSessions] = useState<ClassSession[]>(() => {
    try {
      const saved = localStorage.getItem("cg_unified_schedule");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SCHEDULE;
  });

  // Active day filter on the weekly calendar strip: "All" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("All");

  // Expanded checklist toggles (all start open by default for high accessibility)
  const [expandedCards, setExpandedCards] = useState<{ [id: string]: boolean }>({
    s1: true,
    s2: true,
    s3: false,
    s4: false,
  });

  // Inline input state for adding things to a session: { [sessionId]: string }
  const [newInputs, setNewInputs] = useState<{ [id: string]: string }>({});

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("cg_unified_schedule", JSON.stringify(sessions));
  }, [sessions]);

  // Load user
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

  // Sidebar navigation handler
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

  // Calculate Attendance Stats
  const attendanceStats = useMemo(() => {
    const completedOrMarked = sessions.filter(
      (s) => s.attendance === "present" || s.attendance === "late" || s.status === "completed"
    );
    const present = sessions.filter((s) => s.attendance === "present").length + 30; // base historical
    const total = sessions.length + 30;
    const rate = Math.round((present / total) * 100);

    return {
      rate: rate || 94,
      presentCount: present,
      totalClasses: total,
      streak: 14,
    };
  }, [sessions]);

  // Filtered Sessions by selected day
  const filteredSessions = useMemo(() => {
    if (selectedDayFilter === "All") return sessions;
    return sessions.filter((s) => s.dayOfWeek === selectedDayFilter);
  }, [sessions, selectedDayFilter]);

  // Toggle card checklist open/close
  const toggleCardExpand = (sessionId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  // Toggle checklist item
  const handleToggleItem = (sessionId: string, itemId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const updatedItems = s.items.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          );
          return { ...s, items: updatedItems };
        }
        return s;
      })
    );
  };

  // Delete checklist item
  const handleDeleteItem = (sessionId: string, itemId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return { ...s, items: s.items.filter((item) => item.id !== itemId) };
        }
        return s;
      })
    );
    showToast("Item removed from session.");
  };

  // Add new item needed to this session
  const handleAddItem = (sessionId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (newInputs[sessionId] || "").trim();
    if (!text) return;

    const newItem: SessionItem = {
      id: `item-${Date.now()}`,
      text,
      done: false,
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return { ...s, items: [...s.items, newItem] };
        }
        return s;
      })
    );

    setNewInputs((prev) => ({ ...prev, [sessionId]: "" }));
    showToast("Added item to session requirements!");
  };

  // Check In for Attendance
  const handleCheckIn = (sessionId: string) => {
    const timeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            attendance: "present",
            checkInTime: timeStr,
          };
        }
        return s;
      })
    );

    showToast(`Marked Present! Attendance verified at ${timeStr}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* =========================================================
          DESKTOP SIDEBAR (Careergize Standard)
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
              {studentName.charAt(0).toUpperCase()}
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
            const isActive = item.label === "Schedule";

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

        {/* Attendance Pill in Sidebar */}
        <div className="p-4 mx-4 mb-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-700">
            <span>Attendance Standing</span>
            <span className="text-brand-primary font-extrabold">{attendanceStats.rate}%</span>
          </div>
          <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-primary h-1.5 rounded-full"
              style={{ width: `${attendanceStats.rate}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-amber-700">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              14-Day Streak
            </span>
            <span>Target: ≥ 85%</span>
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
              1. DASHBOARD STYLE WELCOME HEADER
              ===================================================== */}
          <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            {/* Soft decorative glow */}
            <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-brand-primary/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-28 right-72 w-64 h-64 rounded-full bg-slate-100/80 blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Academic Hub • Timetable & Preparation
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Class Schedule & Attendance
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Track your lecture attendance, follow the weekly timetable, and check off things needed for each session.
                </p>
              </div>

              {/* Status Pill on Header */}
              <div className="flex items-center gap-3">
                <div className="p-3 px-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500">Attendance Status</div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {attendanceStats.rate}% • Qualified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              2. FOUR STAT CARDS (Matches Dashboard.tsx 1-to-1)
              ===================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Attendance Rate */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-xs font-bold text-slate-400">Rate</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{attendanceStats.rate}%</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Overall Attendance</p>
            </div>

            {/* Card 2: Streak */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-xs font-bold text-slate-400">Current</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{attendanceStats.streak} Days</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Attendance Streak</p>
            </div>

            {/* Card 3: Sessions Attended */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-xs font-bold text-slate-400">Classes</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {attendanceStats.presentCount}/{attendanceStats.totalClasses}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Attended Sessions</p>
            </div>

            {/* Card 4: Certification Requirement */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-xs font-bold text-emerald-600 font-extrabold">Eligible</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">85% Min</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Placement Standing</p>
            </div>
          </div>

          {/* =====================================================
              3. WEEKLY TIMETABLE / CALENDAR STRIP
              ===================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Weekly Timetable</h2>
                <p className="text-xs text-slate-400">Select a day to view sessions or show the full agenda.</p>
              </div>

              {/* Day filter pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: "All", label: "All Days", dayNum: "•" },
                  { key: "Mon", label: "Mon", dayNum: "28" },
                  { key: "Tue", label: "Tue", dayNum: "29" },
                  { key: "Wed", label: "Wed", dayNum: "30" },
                  { key: "Thu", label: "Thu", dayNum: "01" },
                  { key: "Fri", label: "Fri", dayNum: "02" },
                  { key: "Sat", label: "Sat", dayNum: "03" },
                ].map((item) => {
                  const isSelected = selectedDayFilter === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setSelectedDayFilter(item.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-brand-primary text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.dayNum !== "•" && (
                        <span
                          className={`text-[10px] px-1 rounded font-extrabold ${
                            isSelected ? "bg-white/20 text-white" : "text-slate-400"
                          }`}
                        >
                          {item.dayNum}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =====================================================
              4. UNIFIED CLASS CARDS WITH INLINE CHECKLIST
              ("add things that needed to be in this session")
              ===================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900">
                Class Schedule & Things Needed
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Showing {filteredSessions.length} session{filteredSessions.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredSessions.map((session) => {
              const completedCount = session.items.filter((i) => i.done).length;
              const totalItems = session.items.length;
              const isExpanded = expandedCards[session.id] ?? true;

              return (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition"
                >
                  {/* Card Main Header */}
                  <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Date Badge (Dashboard style) */}
                      <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-brand-primary uppercase">
                          {session.month}
                        </span>
                        <span className="text-xl font-black text-brand-primary leading-none">
                          {session.date}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-brand-primary">
                            {session.course}
                          </span>
                          {session.isToday && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              Today's Class
                            </span>
                          )}
                          {session.status === "completed" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              Completed
                            </span>
                          )}
                        </div>

                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                          {session.topic}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {session.time}
                          </span>
                          <span>•</span>
                          <span>Instructor: <strong>{session.instructor}</strong></span>
                          <span>•</span>
                          <span>{session.platform}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Attendance Button + Join Meeting */}
                    <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
                      {/* Attendance Tracking Button */}
                      {session.attendance === "present" ? (
                        <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Present {session.checkInTime ? `(${session.checkInTime})` : ""}</span>
                        </div>
                      ) : session.isToday ? (
                        <button
                          onClick={() => handleCheckIn(session.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Attendance</span>
                        </button>
                      ) : (
                        <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold">
                          Scheduled
                        </div>
                      )}

                      {/* Join Meeting Link */}
                      <a
                        href={session.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Class</span>
                      </a>

                      {/* Collapse/Expand Checklist */}
                      <button
                        onClick={() => toggleCardExpand(session.id)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                        title={isExpanded ? "Collapse requirements" : "Expand requirements"}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* INLINE "THINGS NEEDED IN THIS SESSION" SECTION */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/60 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ListTodo className="w-4 h-4 text-brand-primary" />
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                            Things Needed for this Session
                          </span>
                        </div>
                        <span className="text-xs font-bold text-brand-primary">
                          {completedCount}/{totalItems} Completed
                        </span>
                      </div>

                      {/* Checklist items */}
                      <div className="space-y-1.5">
                        {session.items.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-1">
                            No requirements added yet. Add what you need below!
                          </p>
                        ) : (
                          session.items.map((item) => (
                            <div
                              key={item.id}
                              className="group flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300 transition"
                            >
                              <button
                                onClick={() => handleToggleItem(session.id, item.id)}
                                className="flex items-center gap-3 text-left cursor-pointer flex-1 min-w-0"
                              >
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition ${
                                    item.done
                                      ? "bg-brand-primary border-brand-primary text-white"
                                      : "border-slate-300 hover:border-brand-primary"
                                  }`}
                                >
                                  {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span
                                  className={`text-xs font-medium truncate ${
                                    item.done ? "line-through text-slate-400" : "text-slate-800"
                                  }`}
                                >
                                  {item.text}
                                </span>
                              </button>

                              <button
                                onClick={() => handleDeleteItem(session.id, item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Quick Inline Add Form */}
                      <form
                        onSubmit={(e) => handleAddItem(session.id, e)}
                        className="flex items-center gap-2 pt-1"
                      >
                        <input
                          type="text"
                          placeholder="Add item, required tool, or mentor question for this session..."
                          value={newInputs[session.id] || ""}
                          onChange={(e) =>
                            setNewInputs((prev) => ({
                              ...prev,
                              [session.id]: e.target.value,
                            }))
                          }
                          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        />
                        <button
                          type="submit"
                          disabled={!(newInputs[session.id] || "").trim()}
                          className="px-3.5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Item</span>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg animate-in slide-in-from-bottom-2 duration-150">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}


import React, { useEffect, useState } from "react";
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
  Target,
  Flame,
  Award,
  TrendingUp,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";

import careergizeLogo from "../assets/careergize-logo.jpeg";

type Course = {
  title: string;
  category: string;
  progress: number;
  lessons: string;
  icon: string;
  level: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  streak: number;
  progress: number;
  goal: string;
  courses: Course[];
};

const upcomingClasses = [
  {
    date: "18",
    month: "SEP",
    title: "Advanced Development Session",
    time: "10:00 AM",
    type: "Live Class",
  },
  {
    date: "20",
    month: "SEP",
    title: "Interview Preparation",
    time: "2:00 PM",
    type: "Workshop",
  },
  {
    date: "23",
    month: "SEP",
    title: "Career Roadmap Session",
    time: "11:30 AM",
    type: "Mentor Session",
  },
];

const weeklyActivity = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 82 },
  { day: "Wed", value: 45 },
  { day: "Thu", value: 92 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 55 },
  { day: "Sun", value: 35 },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Profile", icon: User },
  { label: "My Learning", icon: BookOpen },
  { label: "Schedule", icon: CalendarDays },
  { label: "Achievements", icon: Trophy },
  { label: "AI Mentor", icon: Brain },
];

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loggedInStudentId = localStorage.getItem("loggedInStudentId");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInStudentId || !loggedInUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(loggedInUser));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const getFormattedName = (u: any) => {
    if (u?.first_name || u?.last_name) {
      const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
      if (full) return full.includes("@") ? full.split("@")[0] : full;
    }
    if (u?.name && typeof u.name === "string" && u.name.trim()) {
      const trimmed = u.name.trim();
      return trimmed.includes("@") ? trimmed.split("@")[0] : trimmed;
    }
    const raw = u?.username || "Student";
    if (typeof raw === "string" && raw.includes("@")) {
      return raw.split("@")[0];
    }
    return raw;
  };

  const currentStudent: Student = {
    id: user?.id?.toString() || "",
    name: getFormattedName(user),
    email: user?.email || "",
    role: "Learner",
    level: 1,
    xp: 0,
    streak: 0,
    progress: 0,
    goal: "Software Developer",
    courses: [
      {
        title: "Python Full Stack Development",
        category: "Development",
        progress: 0,
        lessons: "0 / 25 lessons",
        icon: "🐍",
        level: "Beginner",
      },
      {
        title: "React & Modern Frontend",
        category: "Frontend",
        progress: 0,
        lessons: "0 / 25 lessons",
        icon: "⚛️",
        level: "Beginner",
      },
      {
        title: "AI & Generative AI",
        category: "Artificial Intelligence",
        progress: 0,
        lessons: "0 / 26 lessons",
        icon: "🤖",
        level: "Beginner",
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInStudentId");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const handleNavigation = (label: string) => {
    if (label === "My Profile") {
      navigate("/profile");
    }

    if (label === "My Learning") {
      navigate("/my-learning");
    }

    if (label === "Schedule") {
      navigate("/schedule");
    }

    if (label === "Achievements") {
      navigate("/achievements");
    }

    if (label === "AI Mentor") {
      navigate("/ai-mentor");
    }

    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col">

        <div className="px-7 py-7">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20">
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

        </div>

        <nav className="px-4 space-y-1 flex-1">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  item.label === "Overview"
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />

                <span>{item.label}</span>

                {item.label === "Overview" && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-brand-primary" />
                )}
              </button>
            );
          })}

        </nav>

        <div className="p-4 border-t border-slate-100">

          {/* Student Profile */}
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-slate-500" />
            </div>

            <div className="min-w-0">
              <p className="font-bold text-sm truncate">
                {currentStudent.name}
              </p>

              <p className="text-xs text-slate-400 truncate">
                {currentStudent.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

        </div>

      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200">

        <div className="px-5 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center">
              <img
                src={careergizeLogo}
                alt="Careergize Logo"
                className="w-9 h-9 object-contain"
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
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

        </div>

        {mobileMenuOpen && (
          <div className="px-4 pb-4 border-t border-slate-100">

            <nav className="pt-3 space-y-1">

              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                      item.label === "Overview"
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>

            </nav>

          </div>
        )}

      </header>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">

        <div className="w-full px-4 sm:px-8 lg:px-10 py-8 space-y-8">

          {/* =====================================================
              1. HERO / WELCOME HEADER BANNER (Matches MyLearning)
              ===================================================== */}
          <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
            {/* Subtle background decorative blurs */}
            <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 right-60 w-56 h-56 rounded-full bg-blue-100/70 blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>{getGreeting().toUpperCase()} • STUDENT DASHBOARD</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {currentStudent.name}! 👋
                </h1>

                <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
                  Keep learning and move closer to your career goals. Track your enrolled programs, upcoming live sessions, and weekly milestone achievements.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => navigate("/profile")}
                  className="group flex items-center gap-3.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-brand-primary/40 rounded-2xl px-5 py-3.5 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition">
                      {currentStudent.name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      View Profile
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              2. FOUR KPI STAT CARDS (Matches MyLearning 1-to-1)
              ===================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Learning Progress */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-brand-primary/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Overall
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {currentStudent.progress}%
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  Learning Progress
                </p>
                <span className="text-xs text-brand-primary font-bold">
                  Active
                </span>
              </div>
            </div>

            {/* Card 2: Day Streak */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Current
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {currentStudent.streak}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  Day Streak
                </p>
                <span className="text-xs text-amber-600 font-bold">
                  On Fire 🔥
                </span>
              </div>
            </div>

            {/* Card 3: XP Earned */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Total
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                {currentStudent.xp}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  XP Earned
                </p>
                <span className="text-xs text-blue-600 font-bold">
                  Points
                </span>
              </div>
            </div>

            {/* Card 4: Learner Level */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-400/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Current
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">
                Level {currentStudent.level}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-semibold text-slate-600">
                  Learner Level
                </p>
                <span className="text-xs text-purple-600 font-bold">
                  Rising Star
                </span>
              </div>
            </div>
          </div>

          {/* =====================================================
              3. MAIN CONTENT GRID (My Learning & Upcoming)
              ===================================================== */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* My Learning Course Showcase */}
            <section className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    My Learning
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Continue your learning journey
                  </p>
                </div>

                <button
                  onClick={() => navigate("/my-learning")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 border border-brand-primary/20 transition cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {currentStudent.courses.map((course) => (
                  <div
                    key={course.title}
                    className="group border border-slate-200/90 rounded-2xl p-4 sm:p-5 hover:border-brand-primary/40 hover:shadow-xs transition-all duration-200 bg-white"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100/90 group-hover:bg-brand-primary/10 flex items-center justify-center text-2xl shrink-0 transition">
                        {course.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-brand-primary transition truncate">
                              {course.title}
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                              {course.category} • {course.level}
                            </p>
                          </div>

                          <span className="text-sm font-extrabold text-brand-primary shrink-0">
                            {course.progress}%
                          </span>
                        </div>

                        <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-primary rounded-full transition-all duration-500"
                            style={{
                              width: `${course.progress}%`,
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                          <span className="text-xs font-medium text-slate-400">
                            {course.lessons}
                          </span>

                          <button
                            onClick={() => navigate("/my-learning")}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition cursor-pointer"
                          >
                            <span>Continue</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Classes */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Upcoming
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Your next sessions
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                    <CalendarDays className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>

                <div className="space-y-3">
                  {upcomingClasses.map((item) => (
                    <div
                      key={`${item.date}-${item.title}`}
                      className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition duration-150"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-extrabold text-brand-primary uppercase tracking-wider">
                          {item.month}
                        </span>
                        <span className="text-base font-extrabold text-brand-primary leading-tight">
                          {item.date}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-slate-900 truncate">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.time}</span>
                          <span>•</span>
                          <span className="text-brand-primary font-semibold">{item.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate("/schedule")}
                className="w-full mt-6 py-3 rounded-xl border border-slate-200 hover:border-brand-primary/40 text-sm font-bold text-slate-700 bg-slate-50 hover:bg-white transition cursor-pointer shadow-2xs"
              >
                View Full Schedule
              </button>
            </section>

          </div>

          {/* =====================================================
              4. BOTTOM GRID (Weekly Activity & Career Goal)
              ===================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Weekly Activity */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Weekly Activity
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Your learning activity this week
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                </div>
              </div>

              <div className="flex items-end justify-between h-48 gap-3 pt-4">
                {weeklyActivity.map((item) => (
                  <div
                    key={item.day}
                    className="flex-1 h-full flex flex-col items-center justify-end gap-2 group"
                  >
                    <div className="w-full flex items-end justify-center h-full bg-slate-50 rounded-t-xl overflow-hidden p-1">
                      <div
                        className="w-full max-w-7 bg-brand-primary rounded-t-lg group-hover:bg-brand-primary-light transition-all duration-300"
                        style={{
                          height: `${item.value}%`,
                        }}
                      />
                    </div>

                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-700 transition">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Career Goal */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-brand-primary" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Career Goal
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Your current target milestone
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-brand-primary">
                    Target Milestone
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary">
                    In Progress
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                  {currentStudent.goal}
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Build your skills, complete courses, and prepare for your next career opportunity.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600 font-semibold">
                      Milestone Progress
                    </span>
                    <span className="text-brand-primary font-extrabold">
                      {currentStudent.progress}%
                    </span>
                  </div>

                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all duration-500"
                      style={{
                        width: `${currentStudent.progress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>

      </main>

    </div>
  );
}



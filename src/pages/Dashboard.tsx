
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

  const currentStudent: Student = {
    id: user?.id?.toString() || "",
    name: user?.username || "Student",
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

          {/* Student Profile */}
          <div className="mt-8 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
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

        <div className="px-5 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto">

          {/* =====================================================
              WELCOME CARD
              ONLY THIS SECTION HAS BEEN CHANGED
              ===================================================== */}

          <div className="mb-8">

            <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm">

              {/* Decorative background */}
              <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-brand-primary/10 blur-2xl" />

              <div className="absolute -bottom-28 right-72 w-64 h-64 rounded-full bg-slate-100/80 blur-2xl" />

              {/* Small decorative dots */}
              <div className="absolute top-8 right-10 flex gap-2 opacity-40">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="w-2 h-2 rounded-full bg-brand-primary/60" />
                <span className="w-2 h-2 rounded-full bg-brand-primary/30" />
              </div>

              <div className="relative px-6 sm:px-8 lg:px-10 py-7 sm:py-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">

                  {/* Greeting */}
                  <div>

                    <div className="flex items-center gap-3 mb-3">

                      <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                        <span className="text-xl">
                          ☀️
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-brand-primary">
                          {getGreeting()}
                        </p>

                        <p className="text-[11px] text-slate-400 font-medium">
                          Ready for another productive day?
                        </p>
                      </div>

                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                      Welcome back, {currentStudent.name}! 👋
                    </h1>

                    <p className="text-slate-500 mt-2 text-sm sm:text-base">
                      Keep learning and move closer to your career goals.
                    </p>

                  </div>

                  {/* Profile Button */}
                  <button
                    onClick={() => navigate("/profile")}
                    className="group flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 hover:bg-white hover:border-brand-primary/40 hover:shadow-md transition-all duration-200"
                  >

                    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/15 transition">
                      <User className="w-5 h-5 text-brand-primary" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">
                        {currentStudent.name}
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        View Profile
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 ml-1 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />

                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                </div>

                <span className="text-xs font-bold text-slate-400">
                  Overall
                </span>
              </div>

              <p className="text-2xl font-extrabold">
                {currentStudent.progress}%
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Learning Progress
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>

                <span className="text-xs font-bold text-slate-400">
                  Current
                </span>
              </div>

              <p className="text-2xl font-extrabold">
                {currentStudent.streak}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Day Streak
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-500" />
                </div>

                <span className="text-xs font-bold text-slate-400">
                  Total
                </span>
              </div>

              <p className="text-2xl font-extrabold">
                {currentStudent.xp}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                XP Earned
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-500" />
                </div>

                <span className="text-xs font-bold text-slate-400">
                  Current
                </span>
              </div>

              <p className="text-2xl font-extrabold">
                Level {currentStudent.level}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Learner Level
              </p>
            </div>

          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* My Learning */}
            <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-xl font-extrabold">
                    My Learning
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Continue your learning journey
                  </p>
                </div>

                <button
                  onClick={() => navigate("/my-learning")}
                  className="text-sm font-bold text-brand-primary flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>

              <div className="space-y-4">

                {currentStudent.courses.map((course) => (
                  <div
                    key={course.title}
                    className="border border-slate-200 rounded-2xl p-4 hover:border-brand-primary/30 transition"
                  >

                    <div className="flex items-start gap-4">

                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                        {course.icon}
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                          <div>
                            <p className="font-bold truncate">
                              {course.title}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              {course.category} • {course.level}
                            </p>
                          </div>

                          <span className="text-sm font-extrabold text-brand-primary">
                            {course.progress}%
                          </span>

                        </div>

                        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">

                          <div
                            className="h-full bg-brand-primary rounded-full"
                            style={{
                              width: `${course.progress}%`,
                            }}
                          />

                        </div>

                        <div className="flex items-center justify-between mt-2">

                          <span className="text-xs text-slate-400">
                            {course.lessons}
                          </span>

                          <button className="text-xs font-bold text-slate-500 hover:text-brand-primary">
                            Continue
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </section>

            {/* Upcoming Classes */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-xl font-extrabold">
                    Upcoming
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Your next sessions
                  </p>
                </div>

                <CalendarDays className="w-5 h-5 text-slate-400" />

              </div>

              <div className="space-y-4">

                {upcomingClasses.map((item) => (
                  <div
                    key={`${item.date}-${item.title}`}
                    className="flex gap-3"
                  >

                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex flex-col items-center justify-center shrink-0">

                      <span className="text-xs font-bold text-brand-primary">
                        {item.month}
                      </span>

                      <span className="text-lg font-extrabold text-brand-primary leading-none">
                        {item.date}
                      </span>

                    </div>

                    <div className="min-w-0">

                      <p className="font-bold text-sm">
                        {item.title}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">

                        <Clock className="w-3.5 h-3.5" />

                        <span>{item.time}</span>

                        <span>•</span>

                        <span>{item.type}</span>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

              <button
                onClick={() => navigate("/schedule")}
                className="w-full mt-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                View Schedule
              </button>

            </section>

          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            {/* Weekly Activity */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-xl font-extrabold">
                    Weekly Activity
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Your learning activity this week
                  </p>
                </div>

                <TrendingUp className="w-5 h-5 text-brand-primary" />

              </div>

              <div className="flex items-end justify-between h-48 gap-3">

                {weeklyActivity.map((item) => (
                  <div
                    key={item.day}
                    className="flex-1 h-full flex flex-col items-center justify-end gap-2"
                  >

                    <div className="w-full flex items-end justify-center h-full">

                      <div
                        className="w-full max-w-8 bg-brand-primary rounded-t-lg"
                        style={{
                          height: `${item.value}%`,
                        }}
                      />

                    </div>

                    <span className="text-xs font-semibold text-slate-400">
                      {item.day}
                    </span>

                  </div>
                ))}

              </div>

            </section>

            {/* Career Goal */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-brand-primary" />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold">
                    Career Goal
                  </h2>

                  <p className="text-sm text-slate-400">
                    Your current target
                  </p>
                </div>

              </div>

              <div className="rounded-2xl bg-slate-50 p-5">

                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Goal
                </p>

                <h3 className="text-2xl font-extrabold mt-2">
                  {currentStudent.goal}
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Build your skills, complete courses, and prepare for your
                  next career opportunity.
                </p>

                <div className="mt-5">

                  <div className="flex items-center justify-between text-xs font-bold mb-2">

                    <span className="text-slate-500">
                      Overall Progress
                    </span>

                    <span className="text-brand-primary">
                      {currentStudent.progress}%
                    </span>

                  </div>

                  <div className="h-2 bg-white rounded-full overflow-hidden">

                    <div
                      className="h-full bg-brand-primary rounded-full"
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


